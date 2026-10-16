/** Ease the image sequence in elapsed time, independently of the screen's refresh rate. */
export function advanceBurstProgress(current: number, target: number, elapsedMs: number): number {
  const next = current + (target - current) * -Math.expm1(-Math.max(0, elapsedMs) / 120);
  // Below a twentieth of a source frame, settle exactly so the animation can sleep.
  return Math.abs(target - next) < 0.0002 ? target : next;
}
