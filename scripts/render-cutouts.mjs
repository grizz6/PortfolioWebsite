// Turns each desk object into a cut-out: a torn white paper edge around its shape, saved as WebP.
// Sources live in src/assets/desk-src/<key>.svg, or <key>.png / .jpg / .webp for a real photo
// (a photo needs a transparent background so the edge can follow the object's outline).
// Output goes to src/assets/desk/<key>.webp, which the site uses ahead of the SVG.
//
// Usage: npm run cutouts            render every object
//        npm run cutouts -- phone   render only the objects named
import { chromium } from "playwright";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDir = path.join(root, "src/assets/desk-src");
const outDir = path.join(root, "src/assets/desk");
const PAD = 14; // room for the paper edge, in the object's own units
const EDGE = 5; // how far the white paper reaches beyond the object
const SCALE = 2; // render at twice the drawn size so edges stay sharp

const font = async (pkg, file) =>
  "data:font/woff2;base64," + (await readFile(path.join(root, "node_modules", pkg, "files", file))).toString("base64");

const fonts = `
@font-face { font-family: "Permanent Marker"; src: url(${await font("@fontsource/permanent-marker", "permanent-marker-latin-400-normal.woff2")}); }
@font-face { font-family: "Instrument Serif"; font-style: italic; src: url(${await font("@fontsource/instrument-serif", "instrument-serif-latin-400-italic.woff2")}); }`;

const files = await readdir(srcDir);
const wanted = process.argv.slice(2);
const sources = new Map();
for (const f of files) {
  const { name, ext } = path.parse(f);
  if (wanted.length && !wanted.includes(name)) continue;
  const isPhoto = [".png", ".jpg", ".jpeg", ".webp"].includes(ext.toLowerCase());
  if (ext === ".svg" && !sources.has(name)) sources.set(name, f);
  if (isPhoto) sources.set(name, f); // a real photo wins over the drawing
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: SCALE });

for (const [key, file] of sources) {
  const full = path.join(srcDir, file);
  let w, h, inner;
  if (file.endsWith(".svg")) {
    const svg = await readFile(full, "utf8");
    [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    inner = svg.replace(/<svg[^>]*>/, `<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`);
  } else {
    const meta = await sharp(full).metadata();
    // photos are drawn about 400 units wide; the edge is sized to match the drawings
    w = 400; h = Math.round((400 * meta.height) / meta.width);
    const data = (await sharp(full).resize({ width: 800 }).png().toBuffer()).toString("base64");
    inner = `<image href="data:image/png;base64,${data}" x="0" y="0" width="${w}" height="${h}"/>`;
  }
  const seed = [...key].reduce((s, c) => s + c.charCodeAt(0), 0) % 97;
  const W = w + PAD * 2, H = h + PAD * 2;
  await page.setContent(`<!doctype html><style>${fonts} html,body{margin:0;background:transparent}</style>
<svg id="o" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${-PAD} ${-PAD} ${W} ${H}">
  <filter id="torn" filterUnits="userSpaceOnUse" x="${-PAD}" y="${-PAD}" width="${W}" height="${H}" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="${EDGE}" result="grown"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="${seed}" result="noise"/>
    <feDisplacementMap in="grown" in2="noise" scale="${EDGE * 1.3}" xChannelSelector="R" yChannelSelector="G" result="rough"/>
    <feFlood flood-color="#FFFFFF"/>
    <feComposite in2="rough" operator="in" result="paper"/>
    <feMerge><feMergeNode in="paper"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <g filter="url(#torn)">${inner}</g>
</svg>`);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("#o").screenshot({ omitBackground: true });
  const out = path.join(outDir, key + ".webp");
  await writeFile(out, await sharp(png).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer());
  console.log("rendered", key, `${W * SCALE}x${H * SCALE}`);
}
await browser.close();
