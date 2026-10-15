"""Build the scroll-scrubbed color-burst frame sequences for dcs-site.

Source clips (project root) have their backgrounds baked to the page grounds:
  color-burst-light-site.mp4  ground decodes to (231.7, 231.9, 229.6)  page --cement #e8e9e6 (232, 233, 230)
  color-burst-dark-site.mp4   ground decodes to (16.8, 23.1, 28.5)     page --cement #11171d (17, 23, 29)
Both clips are seamless loops: they densify from frame 0 to a peak at frame 192, then frames 193-215 dissolve back
to frame 0. The scroll sequence uses frames 0-192 so it ends at peak density instead of rewinding.

Output (dcs-site/public/burst):
  {theme}/{w}/{i:03d}.webp   opaque WebP frames; tier 1920 every frame, tier 1280 every 2nd frame
  {theme}/still.webp         frame 192 for reduced motion
  {theme}/plumes.json        per-frame x position (0..1 of frame width) of each of the five plumes, smoothed
  manifest.json
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
from dec import yuv_frames

THEMES = {
    'light': ('color-burst-light-site.mp4', (231.71, 231.93, 229.60)),
    'dark':  ('color-burst-dark-site.mp4',  (16.75, 23.08, 28.46)),
}
TIERS = [(1920, 1), (1280, 2)]  # (width, source-frame stride)
Q = 76
W, H = 1920, 1080
LAST = 192
PLUMES = ['red', 'gold', 'buff', 'grey', 'charcoal']


def encode(job):
    arr, outs = job
    im = Image.fromarray(arr, 'RGB')
    for w, path in outs:
        imr = im if w == W else im.resize((w, round(w * H / W)), Image.LANCZOS)
        imr.save(path, 'WEBP', quality=Q, method=6)
    return [os.path.getsize(p) for _, p in outs]


def plume_x(rgb, B):
    """Median x (0..1) of each plume's dense pixels; None when the class is too small to trust."""
    s = rgb[::4, ::4]
    d = np.abs(s - B).max(-1)
    mx = s.max(-1); mn = s.min(-1); L = (mx + mn) / 2; sat = (mx - mn) / np.maximum(mx, 1)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    m = d > 14
    cls = {
        'red':      m & (r > g + 45) & (r > b + 40) & (g < b + 40),
        'gold':     m & (r > b + 70) & (g > b + 45) & (sat > 0.42),
        'buff':     m & (r > b + 25) & (g > b + 10) & (sat > 0.14) & (sat <= 0.42) & (r - g < 45),
        'grey':     m & (sat < 0.09) & (L > 150),
        'charcoal': m & (L < 120) & (b >= r - 6) & (sat < 0.5),
    }
    xs = np.broadcast_to(np.arange(s.shape[1])[None, :], s.shape[:2])
    out = []
    for k in PLUMES:
        msk = cls[k]
        out.append(float(np.median(xs[msk])) / s.shape[1] if msk.sum() > 150 else None)
    return out


def smooth_series(vals, radius=8):
    a = np.array([[np.nan if v is None else v for v in row] for row in vals], dtype=np.float64)
    n = len(a)
    for j in range(a.shape[1]):
        col = a[:, j]
        ok = ~np.isnan(col)
        if ok.sum() == 0:
            continue
        col = np.interp(np.arange(n), np.where(ok)[0], col[ok])
        k = np.ones(2 * radius + 1) / (2 * radius + 1)
        a[:, j] = np.convolve(np.pad(col, radius, mode='edge'), k, mode='valid')
    return a


if __name__ == '__main__':
    SRC, OUT = sys.argv[1], sys.argv[2]
    manifest = {'width': W, 'height': H, 'frames': LAST + 1, 'fps': 24, 'plumes': PLUMES, 'themes': {}}
    with ProcessPoolExecutor(max_workers=max(2, (os.cpu_count() or 4) - 2)) as pool:
        for theme, (clip, B) in THEMES.items():
            B = np.array(B, np.float32)
            for w, _ in TIERS:
                os.makedirs(f'{OUT}/{theme}/{w}', exist_ok=True)
            futs = []; px = []
            for n, rgb in yuv_frames(os.path.join(SRC, clip)):
                if n > LAST:
                    break
                px.append(plume_x(rgb, B))
                arr = np.clip(rgb + 0.5, 0, 255).astype(np.uint8)
                outs = [(w, f'{OUT}/{theme}/{w}/{n // s:03d}.webp') for w, s in TIERS if n % s == 0]
                futs.append(pool.submit(encode, (arr, outs)))
                if n == LAST:
                    Image.fromarray(arr, 'RGB').save(f'{OUT}/{theme}/still.webp', 'WEBP', quality=82, method=6)
            for f in futs:
                f.result()
            tiers = []
            for w, s in TIERS:
                cnt = len(range(0, LAST + 1, s))
                tot = sum(os.path.getsize(f'{OUT}/{theme}/{w}/{i:03d}.webp') for i in range(cnt))
                tiers.append({'w': w, 'h': round(w * H / W), 'count': cnt, 'stride': s, 'bytes': tot})
                print(theme, w, cnt, 'frames', round(tot / 1048576, 2), 'MB', flush=True)
            sm = smooth_series(px)
            # store every 4th frame, 3 decimals; the player interpolates
            json.dump({'step': 4, 'x': [[round(float(v), 3) for v in row] for row in sm[::4]]}, open(f'{OUT}/{theme}/plumes.json', 'w'))
            manifest['themes'][theme] = {'tiers': tiers}
    json.dump(manifest, open(f'{OUT}/manifest.json', 'w'), indent=1)
    print(json.dumps(manifest, indent=1))
