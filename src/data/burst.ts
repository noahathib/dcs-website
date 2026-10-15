// Generated from the color-burst clips by the frame pipeline (see public/burst). Do not edit by hand.
// Frames 0-192 of color-burst-{light,dark}-site.mp4: the clips peak at frame 192, then dissolve back to frame 0 to loop,
// so the scroll sequence ends at peak density. Tiers: every frame at 1920 px, every 2nd frame at 1280 px.

export type BurstTheme = "light" | "dark";
export type BurstTier = { w: number; h: number; count: number; stride: number; bytes: number };

export const BURST_FRAMES = 193;
export const BURST_SIZE = { w: 1920, h: 1080 };
export const BURST_TIERS: Record<BurstTheme, BurstTier[]> = {
  light: [{w: 1920, h: 1080, count: 193, stride: 1, bytes: 7205358}, {w: 1280, h: 720, count: 97, stride: 2, bytes: 2197340}],
  dark: [{w: 1920, h: 1080, count: 193, stride: 1, bytes: 7820816}, {w: 1280, h: 720, count: 97, stride: 2, bytes: 2385700}],
};

/** Horizontal centre of each plume (fraction of frame width), red, gold, buff, grey, charcoal, at source frames 0, 48, 96, 144, 192. */
export const PLUME_KEYS = [0, 48, 96, 144, 192];
export const PLUME_X: Record<BurstTheme, number[][]> = {
  light: [
    [0.16, 0.35, 0.5, 0.66, 0.86],
    [0.15, 0.34, 0.5, 0.63, 0.84],
    [0.15, 0.33, 0.48, 0.6, 0.83],
    [0.14, 0.32, 0.47, 0.58, 0.8],
    [0.13, 0.31, 0.45, 0.56, 0.79],
  ],
  dark: [
    [0.16, 0.35, 0.51, 0.67, 0.85],
    [0.14, 0.33, 0.49, 0.66, 0.84],
    [0.12, 0.33, 0.48, 0.64, 0.82],
    [0.12, 0.31, 0.46, 0.62, 0.8],
    [0.11, 0.29, 0.44, 0.59, 0.79],
  ],
};
