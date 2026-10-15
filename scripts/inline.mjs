// Inlines the Parcel build into self-contained pages.
//   build/index.html    full document: open directly in a browser, images load from build/img
//   build/artifact.html body-only variant for claude.ai Artifacts (the host adds doctype/head/body)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const out = "build";
const pick = (ext) => {
  const f = readdirSync(dist).filter((n) => n.endsWith(ext));
  if (f.length !== 1) throw new Error(`Expected one ${ext} in ${dist}, found ${f.join(", ") || "none"}`);
  return readFileSync(join(dist, f[0]), "utf8");
};
const css = pick(".css").replace(/<\/style/gi, "<\\/style");
const js = pick(".js").replace(/<\/script/gi, "<\\/script");

const src = readFileSync("index.html", "utf8");
const grab = (re) => (src.match(re) ?? [""])[0];
const title = grab(/<title>[\s\S]*?<\/title>/);
const metas = [...src.matchAll(/<meta (?:name="description"|property="og:[^"]+")[^>]*>/g)].map((m) => m[0]).join("\n");
const fonts = [...src.matchAll(/<link\s+rel="(?:preconnect|stylesheet)"[^>]*>/g)].map((m) => m[0].replace(/\s+/g, " ")).join("\n");

const headBits = `${title}\n${metas}\n${fonts}\n<style>${css}</style>`;
const body = `<div id="root"></div>\n<script type="module">${js}</script>`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, "index.html"),
  `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />\n${headBits}\n</head>\n<body>\n${body}\n</body>\n</html>\n`,
);
writeFileSync(join(out, "artifact.html"), `${headBits}\n${body}\n`);
if (existsSync("public/img")) cpSync("public/img", join(out, "img"), { recursive: true });
// Color-burst frame sequences (scroll-scrubbed hero); manifest.json is build metadata only.
if (existsSync("public/burst")) cpSync("public/burst", join(out, "burst"), { recursive: true, filter: (p) => !p.endsWith("manifest.json") });
console.log(`build/index.html ${(readFileSync(join(out, "index.html")).length / 1024).toFixed(0)} KB, img + burst copied`);
