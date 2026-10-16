import { useEffect, useRef, type RefObject } from "react";
import { FrameSet, LAST_FRAME, frameSet, canvasPainter, currentTheme, glCanUpload, glPainter, parseRgb, pickTier, type Drawable, type Painter } from "@/lib/burst";
import type { BurstTheme } from "@/data/burst";
import { advanceBurstProgress } from "@/lib/burstMotion";

export type BurstState = {
  /** scroll progress, 0..1, exactly where the page is */
  p: number;
  /** progress after easing, which drives the frame index */
  eased: number;
  /** source frame drawn, 0..LAST_FRAME (fractional) */
  frame: number;
  /** canvas size, CSS px */
  w: number;
  h: number;
  theme: BurstTheme;
  /** a frame has been drawn */
  painted: boolean;
};

export type BurstOptions = {
  /** raw scroll progress, 0..1, read every animation frame */
  progress: () => number;
  /** eased progress to source frame */
  frame: (p: number) => number;
  /** called when progress or the drawn frame changes; write styles to refs here, never set React state */
  onUpdate?: (s: BurstState) => void;
  /** element whose visibility gates the animation loop (defaults to the canvas) */
  watch?: RefObject<Element | null>;
};

/**
 * Plays a burst canvas from scroll. Scrolling down plays the frames forward, scrolling up reverses them; the frame index
 * is eased a little, so a mouse-wheel step becomes a short glide instead of a jump.
 * The frame always fills the canvas. Placing the canvas is the caller's job, and belongs on a scroll timeline: a
 * position written here would be a frame behind the page, which scrolls on another thread.
 */
export function useBurst(canvasRef: RefObject<HTMLCanvasElement | null>, options: BurstOptions, enabled = true) {
  const opts = useRef(options);
  opts.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    // The painter is chosen once a frame has loaded: WebGL (exact ground) when the browser lets it upload the
    // frames, otherwise the 2D canvas. A canvas keeps whichever context it gets first, so this can't be undone.
    let painter: Painter | null = null;
    let glLost = false;
    const ensurePainter = (sample: Drawable) => {
      if (painter || glLost) return painter;
      painter = (glCanUpload(sample) ? glPainter(canvas) : null) ?? canvasPainter(canvas);
      canvas.dataset.renderer = painter.kind;
      syncGround();
      return painter;
    };

    // The ground on screen is the CSS background behind the canvas; the painter keys the frames against it.
    const groundOf = () => {
      let el: HTMLElement | null = canvas.parentElement;
      while (el) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return parseRgb(bg);
        el = el.parentElement;
      }
      return parseRgb(getComputedStyle(document.body).backgroundColor);
    };
    const syncGround = () => painter?.setGround(groundOf());

    let theme = currentTheme();
    let set: FrameSet | null = null;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let shown = -1;
    let raw = 0;
    let last = 0;
    let frameMs = 16; // display frame interval, kept across idle so a gesture's first step is the right size
    let speed = 0; // tier frames per ms, smoothed
    let raf = 0;
    let inView = true;
    let visible = !document.hidden;
    let dirty = true;
    let drawn = "";
    let painted = false;
    let reported = "";

    const loadSet = () => {
      const o = opts.current;
      const tier = pickTier(theme, w);
      if (set && set.theme === theme && set.tier.w === tier.w) return;
      if (set) set.onFrame = () => {};
      set?.stop();
      const s = frameSet(theme, tier);
      s.aim(o.frame(shown < 0 ? o.progress() : shown) / tier.stride);
      s.onFrame = () => {
        dirty = true;
        kick();
      };
      set = s;
      if (!visible) s.stop();
      dirty = true;
    };

    const size = () => {
      // layout size: the canvas's transform (its placement) must not resize it
      const nw = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      const tier = pickTier(theme, nw);
      // Rendering above the source resolution adds GPU work without adding image detail.
      const ndpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2, tier.w / Math.max(nw, 1), tier.h / Math.max(nh, 1));
      if (nw === w && nh === h && ndpr === dpr) return;
      w = nw;
      h = nh;
      dpr = ndpr;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      dirty = true;
      loadSet();
      kick();
    };

    const tick = (now: number) => {
      raf = 0;
      if (last) frameMs += (Math.min(now - last, 64) - frameMs) * 0.2;
      const dt = last ? Math.min(now - last, 64) : frameMs;
      last = now;
      const o = opts.current;
      raw = o.progress();
      const prev = shown < 0 ? raw : shown;
      // Do not clamp lag to a distance: a large wheel step would cut straight to that bound.
      const next = advanceBurstProgress(prev, raw, dt);
      if (set && w > 0 && h > 0) {
        const frame = Math.min(Math.max(o.frame(next), 0), LAST_FRAME);
        const step = shown < 0 ? 0 : (frame - Math.min(Math.max(o.frame(prev), 0), LAST_FRAME)) / set.tier.stride;
        speed += (step / dt - speed) * -Math.expm1(-dt / 45);
        set.aim(frame / set.tier.stride, speed);
        const key = frame.toFixed(2);
        if (!painter && !glLost) {
          const sample = set.first();
          if (sample) ensurePainter(sample);
        }
        if (dirty || key !== drawn) {
          const done = painter?.paint(set, frame, { x: 0, y: 0, w, h }, dpr) ?? "none";
          if (done !== "none") {
            dirty = done === "partial";
            drawn = key;
            painted = true;
          }
        }
        const state = `${raw}|${key}|${painted}`;
        if (state !== reported) {
          reported = state;
          o.onUpdate?.({ p: raw, eased: next, frame, w, h, theme, painted });
        }
      }
      shown = next;
      // Loading/decoding wakes us through onFrame. Waiting for it must not busy-loop at display rate.
      if (shown !== raw) kick();
      else last = 0;
    };

    function kick() {
      if (!raf && visible && !glLost) raf = requestAnimationFrame(tick);
    }

    const onScroll = () => kick();
    const onResize = () => {
      size();
      kick();
    };
    const syncVisibility = () => {
      const next = inView && !document.hidden;
      if (next === visible) return;
      visible = next;
      if (visible) {
        // Return at the reader's current position, without replaying a gesture made offscreen.
        shown = -1;
        if (set) set.aim(opts.current.frame(opts.current.progress()) / set.tier.stride);
        set?.resume();
        dirty = true;
        kick();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
        speed = 0;
        set?.stop();
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        syncVisibility();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(opts.current.watch?.current ?? canvas);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => {
      const t = currentTheme();
      if (t === theme) return;
      theme = t;
      syncGround(); // CSS has already switched --cement for the new scheme
      size();
      loadSet();
      kick();
    };
    mq.addEventListener("change", onTheme);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", syncVisibility);
    const onLost = (e: Event) => {
      e.preventDefault();
      painter = null;
      glLost = true;
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };
    const onRestored = () => {
      glLost = false;
      painter = glPainter(canvas);
      syncGround();
      dirty = true;
      kick();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    size();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", syncVisibility);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onTheme);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      painter?.dispose();
      if (set) set.onFrame = () => {};
      set?.stop();
    };
  }, [canvasRef, enabled]);
}
