import { BURST_FRAMES, BURST_SIZE, BURST_TIERS, PLUME_KEYS, PLUME_X, type BurstTheme, type BurstTier } from "@/data/burst";

/*
  Scroll-scrubbed color burst.
  Frames are WebP stills cut from color-burst-{light,dark}-site.mp4 (public/burst). Their ground is the page ground
  baked in at the source; a soft mask fades the frame edges to transparent so the real page ground shows through
  and no rectangle is ever visible. A canvas (not <video>) is used because seeking a video is not frame-accurate or
  instant in every browser, while drawing a decoded image is.
*/

export const LAST_FRAME = BURST_FRAMES - 1;

export function currentTheme(): BurstTheme {
  const forced = document.documentElement.dataset.theme;
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Smallest tier that is sharp enough for the drawn width; phones and Save-Data stay on the light tier. */
export function pickTier(theme: BurstTheme, drawnCssWidth: number): BurstTier {
  const [hi, lo] = BURST_TIERS[theme];
  const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const constrained = !!conn?.saveData || /(^|-)2g$|^3g$/.test(conn?.effectiveType ?? "");
  const phone = window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;
  if (constrained || phone) return lo;
  return drawnCssWidth * dpr > lo.w * 1.15 ? hi : lo;
}

export const frameUrl = (theme: BurstTheme, tier: BurstTier, i: number) =>
  `burst/${theme}/${tier.w}/${String(i).padStart(3, "0")}.webp`;
export const stillUrl = (theme: BurstTheme) => `burst/${theme}/still.webp`;

/** Plume centres (fraction of frame width) at a source frame, interpolated between the art-directed keys. */
export function plumeX(theme: BurstTheme, frame: number): number[] {
  const keys = PLUME_KEYS;
  const rows = PLUME_X[theme];
  const f = Math.min(Math.max(frame, 0), keys[keys.length - 1]);
  let k = 0;
  while (k < keys.length - 2 && f > keys[k + 1]) k++;
  const t = (f - keys[k]) / (keys[k + 1] - keys[k]);
  return rows[k].map((x, j) => x + (rows[k + 1][j] - x) * t);
}

/** Anything the painters can draw. */
export type Drawable = ImageBitmap | HTMLImageElement;

const canBitmap = typeof createImageBitmap === "function";

/*
  Decoding runs in workers. Chrome already decodes createImageBitmap(blob) off the main thread, but WebKit decodes it on
  the main thread (about 6 ms a frame at 1920 px), which stalls the page while scrolling; in a worker it costs the
  main thread nothing in either engine. The bitmaps are transferred back, not copied.
*/
const DECODER = `self.onmessage = (e) => {
  const { id, blob } = e.data;
  createImageBitmap(blob).then(
    (bmp) => self.postMessage({ id, bmp }, [bmp]),
    (err) => self.postMessage({ id, error: String(err) }),
  );
};`;

type Pending = { blob: Blob; resolve: (b: ImageBitmap) => void; reject: (e: unknown) => void };

class DecoderPool {
  private workers: Worker[] = [];
  private pending = new Map<number, Pending>();
  private seq = 0;
  private turn = 0;

  constructor(size: number) {
    try {
      const url = URL.createObjectURL(new Blob([DECODER], { type: "text/javascript" }));
      for (let n = 0; n < size; n++) {
        const w = new Worker(url);
        w.onmessage = (e: MessageEvent<{ id: number; bmp?: ImageBitmap; error?: string }>) => {
          const p = this.pending.get(e.data.id);
          if (!p) return e.data.bmp?.close();
          this.pending.delete(e.data.id);
          if (e.data.bmp) p.resolve(e.data.bmp);
          else p.reject(e.data.error);
        };
        // a worker that can't run (CSP, no createImageBitmap in workers): decode on this thread from now on
        w.onerror = () => this.retire();
        this.workers.push(w);
      }
    } catch {
      this.retire();
    }
  }

  private retire() {
    this.workers.forEach((w) => w.terminate());
    this.workers = [];
    const left = [...this.pending.values()];
    this.pending.clear();
    left.forEach((p) => createImageBitmap(p.blob).then(p.resolve, p.reject));
  }

  decode(blob: Blob): Promise<ImageBitmap> {
    if (!this.workers.length) return createImageBitmap(blob);
    return new Promise((resolve, reject) => {
      const id = ++this.seq;
      this.pending.set(id, { blob, resolve, reject });
      this.workers[this.turn++ % this.workers.length].postMessage({ id, blob });
    });
  }
}

let pool: DecoderPool | null = null;
const decoders = () => (pool ??= new DecoderPool(typeof Worker === "function" ? 3 : 0));

/**
 * One theme/tier of frames.
 * - Network: a small neighborhood of the reader loads first, then the rest loads coarse to fine (every 16th frame,
 *   then 8th, 4th, 2nd, all). Over http they are kept as small Blobs (about 7 MB for the whole set); from file:// as <img>.
 * - Decode (http): only frames around the reader are decoded, in workers. The window leads the reader by its speed
 *   times the decode latency, thins out to every 2nd/4th... frame when the reader moves faster than decoding can keep
 *   up, and only turns round after a few frames of travel the other way. The frames on screen are never released.
 *   Painting never waits for a decode: it uses the nearest frames that are ready, so scrolling can't stall.
 * - file:// has no fetch or workers: the <img> frames are decoded by the browser when they load and drawn directly.
 */
export class FrameSet {
  readonly theme: BurstTheme;
  readonly tier: BurstTier;
  private readonly useBlob: boolean;
  private srcs: (Blob | HTMLImageElement | null)[];
  private bmps: (ImageBitmap | null)[];
  private decoding = new Set<number>();
  private requested: boolean[];
  private inflight = 0;
  private stopped = false;
  private aimed = false;
  private concurrency = 6;
  private failures = 0;
  /** tier index the reader is at, which way they are going, and how fast (tier frames per ms) */
  focus = 0;
  dir = 1;
  private speed = 0;
  private against = 0;
  /** decode latency (ms), measured */
  private latency = 12;
  /** frames the painter is showing: never released */
  private shown: number[] = [];
  /** most decoded frames kept: about 270 MB at 1920 px, 150 MB at 1280 px */
  readonly budget: number;
  onFrame: () => void = () => {};

  constructor(theme: BurstTheme, tier: BurstTier) {
    this.theme = theme;
    this.tier = tier;
    this.useBlob = canBitmap && /^https?:$/.test(location.protocol);
    this.srcs = new Array(tier.count).fill(null);
    this.bmps = new Array(tier.count).fill(null);
    this.requested = new Array(tier.count).fill(false);
    this.budget = tier.w >= 1920 ? 32 : 40;
  }

  start(concurrency = 6) {
    this.concurrency = concurrency;
    // The caller may be restoring a scroll position. Wait for aim instead of spending the first requests and
    // decodes on frame zero, and use the same rule when a cached set resumes at a different position.
    if (this.stopped || !this.aimed) return;
    if (this.inflight < concurrency && !this.requested[this.focus]) this.request(this.focus, true);
    for (let n = this.inflight; n < concurrency; n++) this.next();
    this.pump();
  }

  /** Pause new network and decode work; loaded frames remain usable until the next aim. */
  stop() {
    this.stopped = true;
    this.aimed = false;
  }

  resume() {
    if (!this.stopped) return;
    this.stopped = false;
    this.start(this.concurrency);
  }

  private next() {
    if (this.stopped || !this.aimed) return;
    const count = this.tier.count;
    // Adjacent frames make fractional playback possible. Complete this bounded neighborhood before distant
    // coarse coverage, favoring the direction of travel when two candidates are equally close.
    for (let distance = 0; distance <= 6; distance++) {
      for (const i of [this.focus + this.dir * distance, this.focus - this.dir * distance]) {
        if (i >= 0 && i < count && !this.requested[i]) return this.request(i, false);
      }
    }
    for (const step of [16, 8, 4, 2, 1]) {
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < count; i += step) {
        if (this.requested[i]) continue;
        const d = Math.abs(i - this.focus);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best === -1 && step === 16 && !this.requested[count - 1]) best = count - 1;
      if (best !== -1) return this.request(best, false);
    }
  }

  private request(i: number, first: boolean) {
    this.requested[i] = true;
    this.inflight++;
    const url = frameUrl(this.theme, this.tier, i);
    const done = (src: Blob | HTMLImageElement | null) => {
      this.inflight--;
      if (src) {
        this.srcs[i] = src;
        if (this.useBlob) this.pump();
        else this.onFrame();
      } else {
        this.requested[i] = false;
        this.failures++;
      }
      if (!this.stopped && this.failures < 12) this.next();
    };
    if (this.useBlob) {
      fetch(url, first ? ({ priority: "high" } as RequestInit) : undefined)
        .then((r) => (r.ok ? r.blob() : null))
        .then(done, () => done(null));
    } else {
      // decoded by the browser off the main thread before it counts as loaded, so drawing it never decodes in a frame
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      img.decode().then(
        () => done(img),
        () => done(null),
      );
    }
  }

  /** The range of tier frames worth holding decoded, and the step to decode them at. */
  private plan() {
    const n = this.tier.count;
    const lead = Math.max(-24, Math.min(24, this.speed * (this.latency + 33)));
    const ahead = this.dir >= 0;
    const c = this.focus + lead;
    const lo = Math.max(0, Math.floor(Math.min(this.focus, c) - (ahead ? 6 : 16)));
    const hi = Math.min(n - 1, Math.ceil(Math.max(this.focus, c) + (ahead ? 16 : 6)));
    // decode capacity is about 4 frames per latency; past 3/4 of it, decode every 2nd, 4th... frame first
    const cap = (4 / Math.max(this.latency, 4)) * 0.75;
    let step = 1;
    while (Math.abs(this.speed) / step > cap && step < 16) step *= 2;
    return { lo, hi, step, start: Math.round(this.focus + this.speed * this.latency) };
  }

  /** Decode the frames the reader is heading into; release the ones they have left. */
  pump() {
    if (!this.useBlob || this.stopped || !this.aimed) return;
    const n = this.tier.count;
    const { lo, hi, step, start } = this.plan();
    const keep = (i: number) => (i >= lo && i <= hi) || this.shown.includes(i);
    let held = 0;
    for (let i = 0; i < n; i++) {
      const b = this.bmps[i];
      if (!b) continue;
      if (keep(i)) held++;
      else {
        b.close();
        this.bmps[i] = null;
      }
    }
    if (this.decoding.size >= 4 || held + this.decoding.size >= this.budget) return;
    const order: number[] = [];
    const seen = new Set<number>();
    const add = (i: number) => {
      if (i >= lo && i <= hi && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    const d = this.dir >= 0 ? 1 : -1;
    for (let s = step; s >= 1; s >>= 1) {
      for (let k = 0; k <= 40; k++) add(Math.round((start + d * k) / s) * s);
      if (s === 1 || Math.abs(this.speed) < 0.02) for (let k = 1; k <= 8; k++) add(this.focus - d * k);
    }
    for (const i of order) {
      if (this.decoding.size >= 4 || held + this.decoding.size >= this.budget) break;
      const src = this.srcs[i];
      if (this.bmps[i] || this.decoding.has(i) || !(src instanceof Blob)) continue;
      this.decoding.add(i);
      const t0 = performance.now();
      decoders()
        .decode(src)
        .then((bmp) => {
          this.decoding.delete(i);
          this.latency += (performance.now() - t0 - this.latency) * 0.2;
          if (this.bmps[i]) bmp.close();
          else this.bmps[i] = bmp;
          this.onFrame();
          this.pump();
        })
        .catch(() => {
          this.decoding.delete(i);
        });
    }
  }

  /**
   * Point the decode window at a tier index. `speed` is the reader's speed in tier frames per ms (signed); the
   * direction only turns round after 3 frames of travel the other way, so a jittery stop doesn't flush the window.
   */
  aim(fi: number, speed = 0) {
    const i = Math.round(Math.min(Math.max(fi, 0), this.tier.count - 1));
    this.speed = speed;
    if (!this.aimed) {
      this.aimed = true;
      this.focus = i;
      this.against = 0;
      this.start(this.concurrency);
      return;
    }
    if (i === this.focus) return;
    const d = i > this.focus ? 1 : -1;
    if (d === this.dir) this.against = 0;
    else if ((this.against += Math.abs(i - this.focus)) >= 3) {
      this.dir = d;
      this.against = 0;
    }
    this.focus = i;
    this.pump();
  }

  /** The painter's frames on screen, kept decoded. */
  hold(...frames: number[]) {
    this.shown = frames.filter((i) => i >= 0);
  }

  /** A drawable frame at tier index i, if ready. */
  ready(i: number): Drawable | null {
    if (this.useBlob) return this.bmps[i];
    const s = this.srcs[i];
    return s instanceof HTMLImageElement ? s : null;
  }

  /** any drawable frame, to probe what the browser allows */
  first(): Drawable | null {
    for (let i = 0; i < this.tier.count; i++) {
      const d = this.ready(i);
      if (d) return d;
    }
    return null;
  }

  /**
   * Nearest drawable frames around a fractional tier index, for a crossfade: [a, b, t] with b = -1 for a single frame
   * and a = -1 for nothing. `has` adds frames the painter can still draw without a decode (uploaded textures).
   */
  around(fi: number, has: (i: number) => boolean = () => false): [number, number, number] {
    const n = this.tier.count;
    const ok = (i: number) => has(i) || !!this.ready(i);
    const x = Math.min(Math.max(fi, 0), n - 1);
    let a = Math.floor(x);
    while (a >= 0 && !ok(a)) a--;
    let b = Math.ceil(x);
    while (b < n && !ok(b)) b++;
    if (a < 0) return b < n ? [b, -1, 0] : [-1, -1, 0];
    if (b >= n || a === b) return [a, -1, 0];
    return [a, b, (x - a) / (b - a)];
  }
}

const sets = new Map<string, FrameSet>();

/** One FrameSet per theme and tier for the life of the page, so returning to Home reuses decoded frames. */
export function frameSet(theme: BurstTheme, tier: BurstTier): FrameSet {
  const key = `${theme}/${tier.w}`;
  let s = sets.get(key);
  if (!s) {
    s = new FrameSet(theme, tier);
    sets.set(key, s);
    s.start();
  } else {
    s.resume();
  }
  return s;
}

/** Where the 1920x1080 frame is drawn, in CSS pixels relative to the canvas. */
export type FrameRect = { x: number; y: number; w: number; h: number };

/** A crossfade between frames further apart than this (source frames) reads as a double exposure: draw the nearer. */
const MAX_BLEND_GAP = 4;

/**
 * The frame pair to draw for a fractional tier index: nearer frame alone when the ready frames are far apart or when
 * the reader is moving too fast for a crossfade to be seen (`blend` false).
 */
function pick(set: FrameSet, fi: number, blend: boolean, has?: (i: number) => boolean): [number, number, number] {
  const [a, b, t] = set.around(fi, has);
  if (b < 0) return [a, -1, 0];
  if (!blend || (b - a) * set.tier.stride > MAX_BLEND_GAP) return t < 0.5 ? [a, -1, 0] : [b, -1, 0];
  return [a, b, t];
}

const MASK_W = 320;
const MASK_H = 180;
let maskCache: HTMLCanvasElement | null = null;

/** Soft vignette in frame space: fades the frame's open ground (top/bottom bands, feathered sides) to transparent. */
function frameMask() {
  if (maskCache) return maskCache;
  const c = document.createElement("canvas");
  c.width = MASK_W;
  c.height = MASK_H;
  const g = c.getContext("2d")!;
  const img = g.createImageData(MASK_W, MASK_H);
  const ramp = (t: number, a: number, b: number) => {
    const u = Math.min(Math.max((t - a) / (b - a), 0), 1);
    return u * u * (3 - 2 * u);
  };
  for (let y = 0; y < MASK_H; y++) {
    const v = (y + 0.5) / MASK_H;
    const vy = ramp(v, 0.02, 0.16) * (1 - ramp(v, 0.84, 0.98));
    for (let x = 0; x < MASK_W; x++) {
      const u = (x + 0.5) / MASK_W;
      const vx = ramp(u, 0.0, 0.05) * (1 - ramp(u, 0.95, 1));
      const o = (y * MASK_W + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 0;
      img.data[o + 3] = Math.round(255 * vx * vy);
    }
  }
  g.putImageData(img, 0, 0);
  maskCache = c;
  return c;
}

/** "none": nothing near the frame was ready, the last frame stays on screen; "partial": drawn without its crossfade partner, which comes on a later paint. */
export type PaintResult = "none" | "partial" | "full";

export interface Painter {
  kind: "webgl" | "2d";
  /** Draws a (possibly fractional) source frame at rect (CSS px), crossfading neighbours when `blend` is set. */
  paint(set: FrameSet, frame: number, rect: FrameRect, dpr: number, blend?: boolean): PaintResult;
  /** exact page ground behind the canvas, 0-255 */
  setGround(rgb: [number, number, number]): void;
  dispose(): void;
}

/** Reads an rgb()/rgba() computed color. */
export function parseRgb(css: string): [number, number, number] {
  const m = css.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

const VERT = `attribute vec2 p; uniform vec4 r; varying vec2 uv;
void main(){ uv = p; vec2 xy = r.xy + p * r.zw; gl_Position = vec4(xy.x * 2.0 - 1.0, 1.0 - xy.y * 2.0, 0.0, 1.0); }`;

// The frames' ground is the page ground to within the codec's +-1-2 levels. Keying it here (alpha 0 where the pixel
// is ground) lets the stage's own CSS background show through, so the ground on screen is exactly the page color.
// The vignette softens cropped plumes at the frame edges.
const FRAG = `precision mediump float; varying vec2 uv;
uniform sampler2D A; uniform sampler2D B; uniform float t; uniform vec3 ground;
float ramp(float x, float a, float b){ float u = clamp((x - a) / (b - a), 0.0, 1.0); return u * u * (3.0 - 2.0 * u); }
void main(){
  vec3 c = mix(texture2D(A, uv).rgb, texture2D(B, uv).rgb, t);
  vec3 d = abs(c - ground) * 255.0;
  float w = ramp(max(d.r, max(d.g, d.b)), 2.5, 5.5);
  float m = ramp(uv.y, 0.02, 0.16) * (1.0 - ramp(uv.y, 0.84, 0.98)) * ramp(uv.x, 0.0, 0.05) * (1.0 - ramp(uv.x, 0.95, 1.0));
  float a = w * m;
  gl_FragColor = vec4(c * a, a);
}`;

/** WebGL painter: exact ground via runtime keying. Returns null when WebGL is unavailable. */
export function glPainter(canvas: HTMLCanvasElement): Painter | null {
  const opts: WebGLContextAttributes = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false };
  const gl = (canvas.getContext("webgl2", opts) ?? canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, "r");
  const uT = gl.getUniformLocation(prog, "t");
  const uG = gl.getUniformLocation(prog, "ground");
  gl.uniform1i(gl.getUniformLocation(prog, "A"), 0);
  gl.uniform1i(gl.getUniformLocation(prog, "B"), 1);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  // Uploaded frames by set and tier index, least recently used first. A texture outlives its decoded bitmap, so
  // scrubbing back over recent frames needs neither a decode nor an upload. The frames are drawn at or above their
  // size (pickTier), so no mipmaps.
  const cache = new Map<string, WebGLTexture>();
  const keyOf = (set: FrameSet, i: number) => `${set.theme}/${set.tier.w}/${i}`;
  const touch = (key: string) => {
    const tex = cache.get(key);
    if (tex) {
      cache.delete(key);
      cache.set(key, tex);
    }
    return tex ?? null;
  };
  const upload = (key: string, img: Drawable) => {
    if (cache.size >= 8) {
      const [old, tex] = cache.entries().next().value!;
      gl.deleteTexture(tex);
      cache.delete(old);
    }
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    cache.set(key, tex);
    return tex;
  };

  return {
    kind: "webgl",
    setGround(rgb) {
      gl.uniform3f(uG, rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    },
    paint(set, frame, rect, dpr, blend = true) {
      const [a, b, t] = pick(set, frame / set.tier.stride, blend, (i) => cache.has(keyOf(set, i)));
      if (a < 0) return "none"; // nothing near: keep showing the last frame rather than an empty canvas
      const heavy = b >= 0 && t >= 0.5 ? b : a;
      const light = heavy === a ? b : a;
      const texOf = (i: number) => {
        const key = keyOf(set, i);
        const tex = touch(key);
        if (tex) return tex;
        const img = set.ready(i);
        return img ? upload(key, img) : null;
      };
      const tHeavy = texOf(heavy);
      if (!tHeavy) return "none";
      const tLight = light >= 0 ? texOf(light) : null;
      set.hold(heavy, tLight ? light : -1);
      const W = canvas.width;
      const H = canvas.height;
      gl.viewport(0, 0, W, H);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tLight && heavy === b ? tLight : tHeavy);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tLight && heavy === a ? tLight : tHeavy);
      gl.uniform1f(uT, tLight ? t : 0);
      gl.uniform4f(uR, (rect.x * dpr) / W, (rect.y * dpr) / H, (rect.w * dpr) / W, (rect.h * dpr) / H);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return light >= 0 && !tLight ? "partial" : "full";
    },
    dispose() {
      cache.forEach((tex) => gl.deleteTexture(tex));
      cache.clear();
    },
  };
}

/**
 * Whether WebGL may upload this image. Pages opened from disk (file://) treat every image as cross-origin, and
 * WebGL refuses those, while a 2D canvas can still draw them.
 */
export function glCanUpload(img: Drawable): boolean {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl");
  if (!gl) return false;
  try {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.deleteTexture(tex);
    return true;
  } catch {
    return false;
  } finally {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

/** 2D-canvas painter, used when WebGL is unavailable: frame ground within the codec's +-1 level, edges masked. */
export function canvasPainter(canvas: HTMLCanvasElement): Painter {
  const ctx = canvas.getContext("2d", { alpha: true })!;
  return {
    kind: "2d",
    setGround() {},
    paint: (set, frame, rect, dpr, blend = true) => paint(ctx, set, frame, rect, dpr, blend),
    dispose() {},
  };
}

/** Paints a (possibly fractional) source frame into the canvas at rect, or nothing if no frame near it is ready. */
export function paint(ctx: CanvasRenderingContext2D, set: FrameSet, frame: number, rect: FrameRect, dpr: number, blend = true): PaintResult {
  const [a, b, t] = pick(set, frame / set.tier.stride, blend);
  const A = a >= 0 ? set.ready(a) : null;
  if (!A) return "none";
  const B = b >= 0 ? set.ready(b) : null;
  set.hold(a, b);
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, cw, ch);
  const x = rect.x * dpr;
  const y = rect.y * dpr;
  const w = rect.w * dpr;
  const h = rect.h * dpr;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(A, x, y, w, h);
  if (B && t > 0.002) {
    ctx.globalAlpha = t;
    ctx.drawImage(B, x, y, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(frameMask(), x, y, w, h);
  ctx.globalCompositeOperation = "source-over";
  return "full";
}

export { BURST_SIZE };
