import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { SWATCHES } from "@/data/content";
import { Link } from "@/lib/router";
import { Img, Strip } from "@/components/Img";
import { useBurst, type BurstState } from "@/components/Burst";
import { LAST_FRAME, currentTheme, plumeX, stillUrl, type FrameRect } from "@/lib/burst";
import { applyPose, bindToScroll, scrollTimelinesSupported, type Pose } from "@/lib/scrollLinked";
import { useReducedMotion } from "@/lib/motion";
import type { BurstTheme } from "@/data/burst";

/*
  Home hero, designed from the color burst outward.
  A Swiss title page sits on the page ground with the burst rising from the bottom edge beneath it, its oxide plume
  plumb under the oxide word "color". The burst plays forward as you scroll down and backward as you scroll up, and
  it never stops dead or jolts: it rises with the copy, eases into place under its five captions, then accelerates
  until it moves exactly with the page, so the hand-off to the ledger below has no seam. The copy scrolls natively.

  Where the burst and its captions sit is a pure function of scroll, handed to the compositor as scroll-driven
  animations (lib/scrollLinked), so they move in the same frame as the page. Only the frame index (the cloud's morph)
  is driven from script. Without scroll timelines (Firefox, older Safari), the burst loop places them each frame instead.
*/

const KIT = ["9", "71", "25", "615", "620"].map((no) => SWATCHES.find((s) => s.no === no)!);

// Cloud extent as a fraction of frame height, worst case over both renders and all frames (dark f192), after the
// painter's vignette. One geometry serves both themes, so switching theme never reflows the hero.
const BAND_TOP = 0.056;
const BAND_BOTTOM = 0.915;
const BAND_MID = 0.49;
// Band top while the copy is still on screen (dark, mid-sequence); the gap under the copy is solved against it.
const RISE_BAND_TOP = 0.12;
const PUSH = 1.05; // gentle push-in across the sequence

type Geo = {
  phone: boolean;
  cw: number; // stage width
  stageH: number; // viewport height under the header
  top: number; // where the stage pins: header height plus any top safe-area inset
  W: number;
  H: number;
  capY: number; // caption row, from the frame top
  capH: number;
  y0: number; // frame top at scroll 0 (stage coords)
  yRest: number; // frame top while the burst settles under its captions
  D: number; // rise distance
  d: number; // the last part of the rise, eased to a stop
  Rd: number; // scroll spent rising
  Hd: number; // scroll spent settled
  E: number; // scroll spent accelerating to page speed
  T: number; // total scroll; the stage releases here
  frameX: number;
  plumb: number;
  pull: number; // ledger offset so it lands under the captions as the stage releases
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function solve(cw: number, stageH: number, top: number, copyBottom: number, colorX: number | null): Geo {
  const phone = cw < 640;
  const portraitTablet = !phone && cw < 1024 && stageH > cw;
  const k = phone ? 2.15 : portraitTablet ? 1.25 : 1.0;
  const capH = phone ? 44 : 36;
  const gap = phone ? 16 : 26;
  const bandTop = BAND_MID - (BAND_MID - BAND_TOP) * PUSH;
  const bandBottom = BAND_MID + (BAND_BOTTOM - BAND_MID) * PUSH;
  // band + caption row fit the stage
  const Hmax = (stageH - gap - capH - 12) / (bandBottom - bandTop);
  const W = Math.round(Math.min(k * cw, (Hmax * 16) / 9));
  const H = Math.round((W * 9) / 16);
  const capY = Math.round(bandBottom * H + gap);
  const span = capY + capH - bandTop * H;
  const yRest = Math.round((stageH - span) / 2 - bandTop * H);
  const guard = phone ? 24 : 32;
  const y0 = Math.max(yRest, Math.round(copyBottom + guard - RISE_BAND_TOP * H));
  const D = y0 - yRest;
  // rise: moves with the copy, then eases to a stop over the last d px of scroll
  const d = Math.min(phone ? 220 : 260, 2 * D);
  const Rd = D > 0 ? D + d / 2 : 0;
  const Hd = Math.round(stageH * (phone ? 0.26 : 0.3));
  const E = Math.round(Math.min(phone ? 260 : 300, stageH * 0.34));
  const T = Math.round(Rd + Hd + E);
  const frameX = (cw - W) / 2;
  let plumb = 0;
  if (!phone && !portraitTablet && colorX !== null) {
    const red = frameX + plumeX("light", 0)[0] * W;
    const charcoal = frameX + plumeX("light", 0)[4] * W;
    plumb = Math.max(0, Math.min(colorX - red, cw - 48 - charcoal));
  }
  const pull = Math.round(yRest - E / 2 + capY + capH + (phone ? 20 : 28) - stageH);
  return { phone, cw, stageH, top, W, H, capY, capH, y0, yRest, D, d, Rd, Hd, E, T, frameX, plumb, pull };
}

/** Frame top (stage coords) at scroll s: velocity runs 1 -> 0 (rise), 0 (settled), 0 -> 1 (lift), never jumping. */
function frameTop(g: Geo, s: number) {
  if (s <= g.Rd) {
    const lin = g.D - g.d / 2;
    if (s <= lin) return g.y0 - s;
    const t = g.d > 0 ? (s - lin) / g.d : 1;
    return g.y0 - lin - g.d * (t - (t * t) / 2);
  }
  const u = Math.min(Math.max(s - g.Rd - g.Hd, 0), g.E);
  return g.yRest - (u * u) / (2 * g.E);
}

function frameRect(g: Geo, s: number): FrameRect {
  const scale = 1 + (PUSH - 1) * smooth(g.Rd * 0.4, g.T, s);
  // the plumb shift unwinds over the rise, but never faster than over 260px (tall screens have little or no rise)
  let x = g.frameX + g.plumb * (1 - smooth(0, Math.max(g.Rd, 260), s));
  if (g.phone) {
    // phones read the plate as one slow pan, red to charcoal
    const a = 0.04 + (0.5 - 0.04) * (0.5 - 0.5 * Math.cos(Math.PI * smooth(g.Rd * 0.45, g.T - g.E * 0.25, s)));
    x = -a * g.W;
  }
  const w = g.W * scale;
  const h = g.H * scale;
  return { x: x + (g.W - w) / 2, y: frameTop(g, s) + BAND_MID * g.H * (1 - scale), w, h };
}

/**
 * The canvas holds the frame at its largest (fully pushed-in) size, so placing the frame is placing the canvas: a
 * translate, and a scale from 1/PUSH up to 1 (the compositor only ever scales it down).
 */
function canvasPose(g: Geo, s: number): Pose {
  const r = frameRect(g, s);
  return { transform: `translate(${r.x.toFixed(2)}px,${r.y.toFixed(2)}px) scale(${(r.w / (g.W * PUSH)).toFixed(5)})` };
}

/** x of each caption under its plume, kept apart and inside the gutters (phones: they travel off with the pan). */
function captionX(cw: number, phone: boolean, rect: FrameRect, frame: number, theme: BurstTheme, ws: number[]) {
  const gutter = phone ? 16 : Math.max(16, Math.min(56, cw * 0.04));
  const pos = plumeX(theme, frame).map((fx) => rect.x + fx * rect.w);
  const wd = (i: number) => ws[i] ?? 80;
  for (let i = 1; i < 5; i++) pos[i] = Math.max(pos[i], pos[i - 1] + (wd(i - 1) + wd(i)) / 2 + 14);
  for (let i = 3; i >= 0; i--) pos[i] = Math.min(pos[i], pos[i + 1] - (wd(i) + wd(i + 1)) / 2 - 14);
  return pos.map((x, i) => {
    const half = wd(i) / 2;
    if (!phone) return { x: Math.min(Math.max(x, gutter + half), cw - gutter - half) - half, o: 1 };
    const lo = gutter + half;
    const hi = cw - gutter - half;
    const out = x < lo ? lo - x : x > hi ? x - hi : 0;
    return { x: x - half, o: 1 - smooth(0, gutter, out) }; // gone before any of it reaches the screen edge
  });
}

/** The frame the scroll position calls for (the drawn frame eases toward it). */
const frameAt = (g: Geo, s: number) => (g.T > 0 ? LAST_FRAME * Math.min(Math.max(s / g.T, 0), 1) : 0);

/** Caption poses at scroll s: under their plumes, on the caption row, faded in as the burst settles. */
function captionPoses(g: Geo, s: number, theme: BurstTheme, ws: number[]): Pose[] {
  const y = frameTop(g, s) + g.capY;
  const shown = smooth(g.Rd - 220, g.Rd - 30, s);
  return captionX(g.cw, g.phone, frameRect(g, s), frameAt(g, s), theme, ws).map(({ x, o }) => ({
    transform: `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`,
    opacity: o * shown,
  }));
}

/** Live light/dark theme, as the burst frames see it. */
function useTheme() {
  const [theme, setTheme] = useState<BurstTheme>(currentTheme);
  useEffect(() => {
    const on = () => setTheme(currentTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", on);
    const mo = new MutationObserver(on);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mq.removeEventListener("change", on);
      mo.disconnect();
    };
  }, []);
  return theme;
}

/** Stage height and pin line: the small viewport under the header (and any top safe-area inset, as the CSS pins it). */
function stageHeight() {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;height:100svh;width:0;padding-top:env(safe-area-inset-top,0px);box-sizing:border-box;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height || window.innerHeight;
  const inset = parseFloat(getComputedStyle(probe).paddingTop) || 0;
  probe.remove();
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
  return { stage: Math.round(h - header - inset), top: header + inset };
}

/** Static plate (reduced motion, very short screens): the densest frame at rest, captions at its plume positions. */
function stillGeo(cw: number) {
  const phone = cw < 640;
  const W = cw;
  const H = Math.round((W * 9) / 16);
  const capY = Math.round(BAND_BOTTOM * H + 26);
  return { phone, W, H, capY, holderH: phone ? H : capY + 36 + 16 };
}

export function BurstHero() {
  const reduce = useReducedMotion();
  const theme = useTheme();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [still, setStill] = useState<ReturnType<typeof stillGeo> | null>(null);
  const [capW, setCapW] = useState<number[]>([]);
  // scroll timelines place the burst on the compositor; false once they turn out not to work here
  const [timelines, setTimelines] = useState(scrollTimelinesSupported);
  // bumped when the page comes back from the back-forward cache, whose restored scroll timelines can't be trusted
  const [epoch, setEpoch] = useState(0);
  const live = !reduce && !!geo && geo.stageH >= 420;

  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLLIElement | null)[]>([]);
  const capInRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const geoRef = useRef<Geo | null>(null);
  geoRef.current = geo;
  const poseRef = useRef({ theme, capW });
  poseRef.current = { theme, capW };
  // true while scroll timelines place the canvas and captions; otherwise the burst loop places them
  const bound = useRef(false);

  // Solve the geometry before paint, on resize, when the copy changes height (web fonts) and once fonts settle.
  useLayoutEffect(() => {
    let lastW = 0;
    let lastH = 0;
    let lastCopy = 0;
    const run = (force = false) => {
      const cw = document.documentElement.clientWidth;
      const { stage, top } = stageHeight();
      const copyBottom = copyRef.current?.offsetHeight ?? 0;
      // ignore small height changes (mobile toolbars): they would re-lay out the hero mid-scroll
      if (!force && cw === lastW && Math.abs(stage - lastH) < 120 && Math.abs(copyBottom - lastCopy) < 2 && geoRef.current) return;
      lastW = cw;
      lastH = stage;
      lastCopy = copyBottom;
      const c = colorRef.current?.getBoundingClientRect();
      const colorX = c ? c.left + c.width / 2 : null;
      setGeo(solve(cw, stage, top, copyBottom, colorX));
      setStill(stillGeo(cw));
    };
    run(true);
    const onResize = () => run();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    if (copyRef.current) ro.observe(copyRef.current);
    document.fonts?.ready.then(() => run(true)).catch(() => {});
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [reduce]);

  // The ledger is pulled up so it rises into place under the captions as the burst lifts away.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ledger-pull", live && geo ? `${geo.pull}px` : "0px");
    return () => {
      root.style.removeProperty("--ledger-pull");
    };
  }, [live, geo]);

  // Header sits on the plate as one sheet while the hero is under it; a compact CTA appears once the hero's own CTAs
  // have scrolled away (tablet widths, where the header has no CTA of its own).
  useEffect(() => {
    const root = document.documentElement;
    const section = sectionRef.current;
    const ctas = ctaRef.current;
    if (!section || !ctas) return;
    const header = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 64;
    let raf = 0;
    const check = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const on = r.top <= header + 8 && r.bottom > header;
      if (on !== "plate" in root.dataset) {
        if (on) root.dataset.plate = "";
        else delete root.dataset.plate;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && e.boundingClientRect.top < header) root.dataset.heroCtaGone = "";
      else delete root.dataset.heroCtaGone;
    });
    io.observe(ctas);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      delete root.dataset.plate;
      delete root.dataset.heroCtaGone;
    };
  }, [live]);

  // Caption widths set their spacing: measured before paint, and again whenever one changes size (web fonts).
  useLayoutEffect(() => {
    const els = capRefs.current.slice(0, KIT.length).filter((el): el is HTMLLIElement => !!el);
    const measure = () => {
      const ws = els.map((el) => el.offsetWidth);
      setCapW((prev) => (prev.length === ws.length && prev.every((x, i) => x === ws[i]) ? prev : ws));
    };
    measure();
    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [geo, live]);

  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setEpoch((n) => n + 1);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  /** Scroll offset into the hero: 0 with the hero's top at the stage's pin line, T where the stage releases. */
  const progressPx = (g: Geo) => {
    const sec = sectionRef.current;
    return sec ? g.top - sec.getBoundingClientRect().top : 0;
  };

  /** The canvas, then the five captions. */
  const placed = () => {
    const els = [canvasRef.current, ...capRefs.current.slice(0, KIT.length)];
    return els.length === KIT.length + 1 && els.every(Boolean) ? (els as HTMLElement[]) : null;
  };
  const poses = (g: Geo, s: number) => {
    const { theme: t, capW: ws } = poseRef.current;
    return [canvasPose(g, s), ...captionPoses(g, s, t, ws)];
  };

  /** Places the canvas and captions for scroll offset s from script (no scroll timelines, and under the animations). */
  const placeNow = (g: Geo, s: number) => {
    const els = placed();
    if (!els) return;
    const ps = poses(g, Math.min(Math.max(s, 0), g.T));
    els.forEach((el, i) => applyPose(el, ps[i]));
  };

  // Bind the canvas and captions to page scroll on the compositor, so they move in the same frame as the page.
  useLayoutEffect(() => {
    bound.current = false;
    if (!live || !geo || !timelines) return;
    const els = placed();
    const sec = sectionRef.current;
    if (!els || !sec) return;
    placeNow(geo, progressPx(geo)); // what shows until the animations start
    const start = sec.getBoundingClientRect().top + window.scrollY - geo.top; // page scroll at s = 0
    // sampled every 4px of scroll: linear interpolation in between is within 0.01px of the curves
    const anims = bindToScroll(
      els.map((el, i) => ({ el, at: (s: number) => poses(geo, s)[i] })),
      start,
      start + geo.T,
    );
    if (!anims) {
      setTimelines(false);
      return;
    }
    bound.current = true;
    return () => {
      anims.forEach((a) => a.cancel());
      bound.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, geo, timelines, theme, capW, epoch]);

  useBurst(
    canvasRef,
    {
      watch: sectionRef,
      progress: () => {
        const g = geoRef.current;
        if (!g || g.T <= 0) return 0;
        return Math.min(Math.max(progressPx(g) / g.T, 0), 1);
      },
      // frames run the whole way, so the burst is always moving while you scroll
      frame: (p) => LAST_FRAME * p,
      onUpdate: (st: BurstState) => {
        const g = geoRef.current;
        if (!g) return;
        if (st.painted) sectionRef.current?.classList.add("is-painted");
        const s = st.p * g.T;
        if (!bound.current) placeNow(g, s);
        // Captions sit under the plumes of the frame the scroll calls for; the drawn frame eases toward it, so each
        // caption carries the small, slowly changing difference itself.
        const { theme: t, capW: ws } = poseRef.current;
        const rect = frameRect(g, s);
        const want = captionX(g.cw, g.phone, rect, frameAt(g, s), t, ws);
        const drawn = captionX(g.cw, g.phone, rect, st.frame, t, ws);
        capInRefs.current.forEach((el, i) => {
          if (el) el.style.transform = `translateX(${(drawn[i].x - want[i].x).toFixed(1)}px)`;
        });
      },
    },
    live,
  );

  // static captions: at the densest frame's plume positions
  useEffect(() => {
    if (live || !still || still.phone) return;
    captionX(document.documentElement.clientWidth, false, { x: 0, y: 0, w: still.W, h: still.H }, LAST_FRAME, theme, capW).forEach(({ x }, i) => {
      const el = capRefs.current[i];
      if (el) el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    });
  }, [live, still, theme, capW]);

  const copy = (
    <div ref={copyRef} className="frame fx__copy">
      <p className="eyebrow eyebrow--oxide load-1">Iron oxide pigments &amp; color systems · Founded 1890 · Milwaukee, WI</p>
      <h1 id="page-title" tabIndex={-1} className="d-hero fx__title load-2">
        <span>
          The <strong ref={colorRef}>color</strong>
        </span>{" "}
        <span>of today's architecture.</span>
      </h1>
      <div className="fx__deck">
        <p className="fx__stand load-3">
          DCS manufactures iron oxide pigments, liquid and granular color systems, and automated dispensing equipment for
          architectural precast, cast stone, manufactured stone veneer and masonry. Our lab matches existing buildings and
          builds custom colors with your own sand and aggregate.
        </p>
        <div ref={ctaRef} className="fx__ctas load-4">
          <Link to="contact" className="btn btn--solid">
            Request free samples <ArrowRight aria-hidden />
          </Link>
          <Link to="color-guide" className="btn btn--ghost">
            Browse the color guide
          </Link>
        </div>
      </div>
    </div>
  );

  const captions = (
    <ul className="fx__caps" role="group" aria-label="Five DCS colors, photographed on concrete samples">
      {KIT.map((s, i) => {
        const body = (
          <>
            <Strip img={s.img} className="fx__chip" />
            <span className="mono">
              <span className="fx__no">#{s.no}</span> <span className="fx__name">{s.name}</span>
            </span>
          </>
        );
        return (
          <li
            key={s.no}
            ref={(el) => {
              capRefs.current[i] = el;
            }}
            className="fx__cap"
          >
            {live ? (
              <span
                ref={(el) => {
                  capInRefs.current[i] = el;
                }}
                className="fx__cap-in"
              >
                {body}
              </span>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );

  if (live && geo) {
    return (
      <section
        ref={sectionRef}
        className="fx fx--live"
        aria-labelledby="page-title"
        style={{ height: `${geo.T + geo.stageH}px`, "--stage-h": `${geo.stageH}px` } as CSSProperties}
      >
        <div className="fx__stage">
          <div className="fx__paint">
            <canvas ref={canvasRef} className="fx__canvas" style={{ width: `${geo.W * PUSH}px`, height: `${geo.H * PUSH}px` }} aria-hidden />
          </div>
          {captions}
        </div>
        {copy}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="fx fx--still"
      aria-labelledby="page-title"
      style={still ? ({ "--plate-w": `${still.W}px`, "--plate-h": `${still.H}px`, "--holder-h": `${still.holderH}px`, "--cap-y": `${still.capY}px` } as CSSProperties) : undefined}
    >
      {copy}
      <div className="fx__plate">
        {still && (
          <picture className="fx__still" aria-hidden>
            <source media="(prefers-color-scheme: dark)" srcSet={stillUrl("dark")} />
            <img src={stillUrl("light")} alt="" width={1920} height={1080} decoding="async" />
          </picture>
        )}
        {captions}
      </div>
    </section>
  );
}

/** The plate's colophon. Its top rule is the five plume colors as real concrete: the powder, set. */
export function Ledger() {
  return (
    <div className="frame ledger-wrap">
      <div className="strip-bar ledger__kit" aria-hidden>
        {KIT.map((s) => (
          <Strip key={s.no} img={s.img} />
        ))}
      </div>
      <div className="ledger ledger--colophon">
        <div>
          <b>1890</b>
          <span>Founded as Ricketson Mineral Color Works</span>
        </div>
        <div>
          <b>4,000+</b>
          <span>standard colors in the dry pigment line</span>
        </div>
        <div>
          <b>5 + 4</b>
          <span>liquid and granular base colors for automated dispensing</span>
        </div>
        <div>
          <b>16 yrs</b>
          <span>average tenure of a DCS employee</span>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { img: "vanderbilt-144", name: "144 Vanderbilt", alt: "Stepped residential building clad in pink architectural concrete" },
  { img: "neiman-marcus", name: "Neiman Marcus Fort Worth", alt: "Buff concrete panels with the Neiman Marcus script logo against a blue sky" },
  { img: "ne-corner-345", name: "345, northeast corner", alt: "Charcoal precast office building with arched upper windows" },
  { img: "acquilus", name: "Acquilus Tower", alt: "Yellow oceanfront residential tower at dusk" },
];

/** The featured-project slideshow from the old hero, now the first thing the plate hands off to: powder, then building. */
export function FeaturedProjects() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [seen, setSeen] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // autoplay only once the slideshow is properly in view, so slide 1 is the first one anyone sees
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.intersectionRatio >= 0.5), { threshold: [0, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || hover || reduce || !seen) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setI((x) => (x + 1) % SLIDES.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [paused, hover, reduce, seen]);

  return (
    <section className="featured section--tight" aria-labelledby="featured-h">
      <div className="frame spec">
        <div className="spec__label">
          <h2 id="featured-h" className="eyebrow">
            Featured project
          </h2>
        </div>
        <section
          ref={ref}
          className="spec__body hero__media"
          aria-roledescription="carousel"
          aria-label="Featured projects"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <div className="hero__slides">
            {SLIDES.map((s, n) => (
              <figure key={s.img} className={`hero__slide ${n === i ? "is-active" : ""}`} aria-hidden={n !== i} aria-roledescription="slide" aria-label={`${n + 1} of ${SLIDES.length}`}>
                <Img name={s.img} alt={s.alt} />
              </figure>
            ))}
          </div>
          <div className="hero__bar">
            <p className="mono text-ink-3 min-w-0" aria-live={paused ? "polite" : "off"}>
              Featured project · <span className="text-ink">{SLIDES[i].name}</span>
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hero__dots">
                {SLIDES.map((s, n) => (
                  <button key={s.img} type="button" className="hero__dot" aria-label={`Show ${s.name}`} aria-current={n === i} onClick={() => setI(n)} />
                ))}
              </div>
              <button type="button" className="hero__pause" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused((p) => !p)}>
                {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
