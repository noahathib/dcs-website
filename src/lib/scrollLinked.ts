/*
  Scroll-linked placement that runs on the compositor.
  Browsers scroll the page on another thread, so anything positioned from requestAnimationFrame is placed for the scroll
  offset the main thread last saw: while the page moves it trails the text, then snaps back (measured: a full scroll step
  behind on most frames at 120 Hz). A scroll-driven animation is sampled by the compositor with the same offset as the
  page, so it moves with the page exactly, even while the main thread is busy. Where scroll timelines are missing
  (Firefox, Safari before 26), callers place elements from requestAnimationFrame instead.
*/

type ScrollTimelineCtor = new (options: { source?: Element | null; axis?: "block" | "inline" | "x" | "y" }) => AnimationTimeline;

const ScrollTimelineImpl = () => (window as unknown as { ScrollTimeline?: ScrollTimelineCtor }).ScrollTimeline;

/** Scroll timelines with px animation ranges (Chrome/Edge 115+, Safari 26+). Firefox has neither by default. */
export function scrollTimelinesSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof ScrollTimelineImpl() === "function" &&
    typeof Element.prototype.animate === "function" &&
    "rangeStart" in Animation.prototype &&
    typeof CSS !== "undefined" &&
    CSS.supports("animation-range-start", "0px")
  );
}

/** One element's look at scroll offset s (px into the range). Keep the same transform functions at every s. */
export type Pose = { transform: string; opacity?: number };

export type Track = { el: HTMLElement; at: (s: number) => Pose };

/**
 * Binds each track to document scroll between offsets `from` and `to` (px): its pose is sampled every `step` px and the
 * compositor interpolates. Returns the animations, or null if the browser can't run them as asked.
 */
export function bindToScroll(tracks: Track[], from: number, to: number, step = 4): Animation[] | null {
  const ST = ScrollTimelineImpl();
  if (!ST || to <= from) return null;
  const n = Math.min(480, Math.max(48, Math.ceil((to - from) / step)));
  const start = `${Math.round(from * 100) / 100}px`;
  const end = `${Math.round(to * 100) / 100}px`;
  const anims: Animation[] = [];
  try {
    const timeline = new ST({ source: document.scrollingElement ?? document.documentElement, axis: "block" });
    // Ranges as strings: Chrome quietly turns a bare CSS.px() into 0%/100%, and Firefox has no CSS.px at all.
    const options = { timeline, rangeStart: start, rangeEnd: end, fill: "both", easing: "linear" } as KeyframeAnimationOptions;
    for (const { el, at } of tracks) {
      const frames: Keyframe[] = [];
      for (let i = 0; i <= n; i++) frames.push({ offset: i / n, ...at(((to - from) * i) / n) });
      anims.push(el.animate(frames, options));
    }
    // An engine that dropped the range would scrub the whole document instead ('normal', or '0%' for a coerced value):
    // read it back where it can be read.
    const read = (anims[0] as Animation & { rangeStart?: unknown }).rangeStart;
    const offset = read && typeof read === "object" && "offset" in read ? (read as { offset: unknown }).offset : read;
    if (offset !== undefined && offset !== null && !String(offset).includes("px")) throw new Error("range not applied");
    return anims;
  } catch {
    anims.forEach((a) => a.cancel());
    return null;
  }
}

/** Writes a pose as inline style (the requestAnimationFrame fallback, and the baseline under an animation). */
export function applyPose(el: HTMLElement, pose: Pose) {
  el.style.transform = pose.transform;
  if (pose.opacity !== undefined) el.style.opacity = pose.opacity.toFixed(3);
}
