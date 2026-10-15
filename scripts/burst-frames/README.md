# Color-burst frame pipeline

Cuts the scroll-scrubbed frame sequences in `public/burst/` from the clips in the project root.

```
python3 -m venv .venv && .venv/bin/pip install numpy pillow imageio-ffmpeg
.venv/bin/python scripts/burst-frames/build_frames.py .. public/burst
```

- Sources: `color-burst-light-site.mp4` (light theme) and `color-burst-dark-site.mp4` (dark theme). Their grounds were baked
  to the page grounds at render time and decode to (231.7, 231.9, 229.6) and (16.8, 23.1, 28.5): within one code value of
  `--cement` #e8e9e6 and #11171d. The `-v2` clips have white/black grounds with a vignette and are not used.
- `dec.py` decodes yuv420p with exact BT.709 limited-range math (ffmpeg's default swscale path is ~2 levels off).
- The clips loop: they densify to a peak at frame 192 and frames 193-215 dissolve back to frame 0. Only 0-192 are used.
- Tiers: 1920 px every frame (193), 1280 px every 2nd frame (97). WebP q76.
- After a rebuild, update the byte counts in `src/data/burst.ts` from `public/burst/manifest.json`.
  Plume label anchors in `src/data/burst.ts` are art-directed by eye at frames 0/48/96/144/192.
