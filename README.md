# DCS Inc. website (redesign prototype)

React 19 + TypeScript + Tailwind CSS, bundled to a single self-contained HTML page.
Design rationale, the audit of the current site and the content-verification list are in [`../REDESIGN_NOTES.md`](../REDESIGN_NOTES.md).

## View it

| Goal | Do this |
|---|---|
| Just look | Open `build/index.html` in Chrome or Edge (double-click). Photos load from `build/img/`. To judge the scroll-driven burst, serve the folder instead (`python3 -m http.server -d build 8000`, then http://localhost:8000): pages opened from disk can't use the WebGL painter or the decode workers. |
| Edit with live reload | `npm install` once, then `npm run dev` and open http://localhost:5173 |
| Rebuild the standalone page | `npm run bundle` (writes `build/index.html`, `build/artifact.html`, `build/img/`) |

Opening this folder's `index.html` directly shows a note instead of the site; it is the dev-server entry point.

## GitHub Pages

This folder can be the root of a GitHub repository. The workflow in
`.github/workflows/deploy-pages.yml` builds and publishes `dist/` on every push to
`main`, or when run manually from the Actions tab.

1. Push this folder to a GitHub repository with a `main` branch.
2. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Run **Deploy website to GitHub Pages** in the Actions tab, or push another change.

The site will be available at `https://<account>.github.io/<repository>/`.
Vite uses relative asset paths, and the existing hash navigation works on Pages
without server redirects. No deployment secret is needed; the workflow uses
GitHub's built-in token. Generated builds, installed dependencies, local caches,
and environment files are excluded from Git.

To check the hosted build locally, run `npm run build` then `npm run preview`.
Use `npm run bundle` separately when you need the standalone `build/index.html`.

GitHub Pages hosts the site files only. The contact form still prepares an email
or copyable request, and PDFs still come from the current DCS website. The
production items below remain separate from publishing this preview.

## Home hero: scroll-driven color burst

The landing page is built around `color-burst-light-site.mp4` (light theme) and `color-burst-dark-site.mp4` (dark theme), whose
grounds were baked to the page's `--cement` colors. Scrolling scrubs the burst: down plays it forward, up plays it back.

- **Frames, not video.** `public/burst/{light,dark}/{1920,1280}/NNN.webp` are frames 0-192 of each clip (the clips loop back to
  frame 0 after 192). Desktop gets every frame at 1920 px (about 7 MB), phones every second frame at 1280 px (about 2 MB). They load
  adjacent to the reader first, then coarse to fine across the rest of the sequence. Over http they are decoded in workers, a window that leads the reader by its
  speed; the frames on screen are never released, and the canvas never blanks while it waits. From disk the browser decodes each `<img>` as it loads. Rebuild them with
  `scripts/burst-frames/` (see its README).
- **Seamless ground.** A WebGL painter keys the frames' ground to transparent, so the page's own CSS background shows through and
  the ground on screen is exactly `--cement`. Where WebGL can't load the frames (pages opened from disk, `file://`) a 2D canvas
  draws them instead; the ground there is within one level of the page color.
- **Placement on the compositor.** Where the burst and its captions sit is a pure function of scroll. It is handed to the
  browser as scroll-driven animations (`ScrollTimeline` with px ranges, sampled every 4 px), so they move in the same frame as the
  page even while the main thread is busy. Only the cloud's morph (the frame index) runs in script, where a frame of lag can't be
  seen. Positions written from `requestAnimationFrame` trail the page by a frame or more, because browsers scroll on another
  thread; that showed as the burst juddering against the copy. Chrome/Edge 115+ and Safari 26+ take the compositor path; Firefox
  and older Safari place them from script each frame.
- **Code.** `src/components/BurstHero.tsx` (title page, sticky plate, plume captions, ledger, featured project),
  `src/components/Burst.tsx` (scroll loop, frame index), `src/lib/scrollLinked.ts` (compositor placement), `src/lib/burst.ts`
  (loader, decode workers, painters), `src/data/burst.ts` (tiers, plume positions).
- **Reduced motion** (and screens under 420 px tall) get a still of the densest frame, with no pinning.
- **Fluid response.** The image sequence eases toward scroll over a 120 ms response time, without a hard catch-up jump.
  Rendering is capped at the source resolution. Animation and frame loading pause offscreen or in a hidden tab, and
  a settled canvas waits for frame-ready notifications instead of polling. Section reveals fade without moving the text.
- The pre-redesign page is kept for reference in `../original-site/` (`index.html` opens directly; `source/` has its `src`).

## Structure

```
src/
  index.css            design tokens (light + dark) and all component styles
  App.tsx              route table, page titles/meta descriptions, focus + scroll on navigation
  data/
    site.ts            contact details, PDF documents, routes + SEO copy, navigation, legacy URL aliases
    content.ts         testimonials, color swatches, projects, markets, people, history, careers, base pigments
    imageSizes.ts      generated: intrinsic size of every image in public/img
  components/          Header (mega menus, mobile menu), Footer, Img/Strip, RingSet (color fan),
                       Systems (base color system, packaging scale), Gallery (masonry, rail, lightbox, testimonials), Bits
  pages/               Home, Products (6 pages), Industries (5), ColorGuide, Library (projects, resources, SDS), Company (4 + 404)
  lib/                 hash router, scroll reveal, sample-request store
public/img/            131 WebP images taken from the current site
scripts/inline.mjs     inlines the Parcel build into build/index.html
```

**Editing content.** Almost all copy and data lives in `src/data/*.ts`. Add a project by adding a row to `PROJECTS` and a WebP to `public/img/`, then run `npm run images` to regenerate `imageSizes.ts`. Add a document by adding a row to `DOCS`.

**Design tokens.** Every color is a CSS variable on `:root` in `src/index.css`, redefined for dark mode. Tailwind's `cement`, `ink`, `oxide`, `ochre`, `tan` and `deep` colors map to those variables, so utilities and custom CSS stay in sync.

**Routing.** Pages use hash routes with the current site's slugs (`#dry-pigment`, `#precast` and so on). That keeps the prototype a single file. Old folder URLs (`/support`, `/about`) and the four dead `/…-solutions` links are aliased in `ALIASES`.

## Before production

1. **Hosting decision.** This is a standalone build and cannot be pasted into Squarespace. Either host it statically (Netlify, Vercel, Cloudflare Pages, S3) or rebuild the design inside Squarespace using these pages as the spec.
2. **Real URLs + prerendering for SEO.** Switch the hash router to path routes with the same slugs (`/dry-pigment`, …). Prerender each page to static HTML (for example by porting to Astro or Next.js static export). Then add 301 redirects for `/products`, `/industries`, `/support`, `/about` and `/…-solutions`.
3. **Re-host the PDFs.** Documents currently link to `dynamiccolorsolutions.com/s/…`, which stops working if the Squarespace site is cancelled. Copy them to the new host with the same file names.
4. **Contact form backend.** The form validates and composes the request, then asks the visitor to copy or email it; nothing is sent. Connect it to a form service or CRM (HubSpot, Formspree, Netlify Forms, …) with spam protection.
5. **Images.** Add responsive `srcset` sizes (and AVIF) and an Open Graph share image.
6. **Housekeeping.**
   - Add `sitemap.xml`, `robots.txt`, `Organization`/`LocalBusiness` structured data, analytics and, if needed, cookie consent.
   - Complete the content checks listed in `REDESIGN_NOTES.md` §4: project names, color disclaimer and photo rights.
   - Test with real assistive technology (NVDA/VoiceOver) on a staging URL.
