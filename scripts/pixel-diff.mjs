#!/usr/bin/env node
/**
 * Compares a design render with an app screenshot, pixel by pixel.
 *
 *   node scripts/pixel-diff.mjs <design.png> <app.png> [name] [--threshold=0.1] [--keep-chrome] [--crop=x,y,w,h] [--ignore=x,y,w,h;...]
 *
 * Both images must be the same size: a size mismatch is a finding in itself,
 * so the script refuses to compare and exits 2. Writes to pixel-diff/out/:
 *   <name>.mask.png     every differing pixel in red over a faint grey design
 *   <name>.overlay.png  the two at 50 % opacity each (a doubled edge is an offset)
 *   <name>.side.png     design | app | mask, side by side
 * and prints the count and share of differing pixels, plus the differing
 * regions as boxes in points (device pixels / 3), largest first.
 *
 * The status bar (0–54 pt) and the home indicator are drawn by iOS, not the
 * app (VICI_UI_2_DECISIONS.md D2): they are left out unless `--keep-chrome`.
 * `--crop` compares one region only (a chart at its own bounds), in points.
 */
import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [designPath, appPath, nameArg] = argv.filter((a) => !a.startsWith('--'));
if (!designPath || !appPath) {
  console.error('usage: pixel-diff.mjs <design.png> <app.png> [name] [--threshold=0.1] [--keep-chrome] [--crop=x,y,w,h] [--ignore=x,y,w,h;...]');
  process.exit(1);
}
const name = nameArg ?? path.basename(appPath, '.png');
const SCALE = 3;
const OUT = 'pixel-diff/out';
/** Fast, light compression: these images are looked at, not kept. */
const FAST = { deflateLevel: 1, deflateStrategy: 0 };
fs.mkdirSync(OUT, { recursive: true });

let D = PNG.sync.read(fs.readFileSync(designPath));
let A = PNG.sync.read(fs.readFileSync(appPath));
if (D.width !== A.width || D.height !== A.height) {
  console.log(`SIZE MISMATCH design ${D.width}x${D.height} app ${A.width}x${A.height}`);
  process.exit(2);
}

const box = (s) => s.split(',').map((v) => Math.round(Number(v) * SCALE));
function crop(img, [x, y, w, h]) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(img, out, x, y, w, h, 0, 0);
  return out;
}
let origin = [0, 0];
if (flags.crop) {
  const c = box(flags.crop);
  D = crop(D, c);
  A = crop(A, c);
  origin = [c[0], c[1]];
}
const { width: W, height: H } = D;

// Blank the regions that are not the app's to draw, in both images alike.
const ignore = [];
if (!flags['keep-chrome'] && !flags.crop) ignore.push('0,0,393,54', '120,832,153,16');
if (flags.ignore) ignore.push(...String(flags.ignore).split(';').filter(Boolean));
for (const r of ignore) {
  const [x, y, w, h] = box(r);
  for (let yy = Math.max(0, y - origin[1]); yy < Math.min(H, y - origin[1] + h); yy++)
    for (let xx = Math.max(0, x - origin[0]); xx < Math.min(W, x - origin[0] + w); xx++) {
      const i = (yy * W + xx) * 4;
      for (let k = 0; k < 4; k++) A.data[i + k] = D.data[i + k];
    }
}

const mask = new PNG({ width: W, height: H });
const threshold = Number(flags.threshold ?? 0.1);
const differing = pixelmatch(D.data, A.data, mask.data, W, H, { threshold, includeAA: false, alpha: 0.15, diffColor: [255, 0, 0], aaColor: [255, 255, 0] });
fs.writeFileSync(path.join(OUT, `${name}.mask.png`), PNG.sync.write(mask, FAST));

const overlay = new PNG({ width: W, height: H });
for (let i = 0; i < D.data.length; i += 4) {
  for (let k = 0; k < 3; k++) overlay.data[i + k] = Math.round((D.data[i + k] + A.data[i + k]) / 2);
  overlay.data[i + 3] = 255;
}
fs.writeFileSync(path.join(OUT, `${name}.overlay.png`), PNG.sync.write(overlay, FAST));

const GAP = 12;
const side = new PNG({ width: W * 3 + GAP * 2, height: H });
side.data.fill(255);
PNG.bitblt(D, side, 0, 0, W, H, 0, 0);
PNG.bitblt(A, side, 0, 0, W, H, W + GAP, 0);
PNG.bitblt(mask, side, 0, 0, W, H, (W + GAP) * 2, 0);
fs.writeFileSync(path.join(OUT, `${name}.side.png`), PNG.sync.write(side, FAST));

// Group the red pixels into boxes on a 3-pt grid, so a finding has a place.
const CELL = 3 * SCALE;
const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
const hot = new Uint8Array(gw * gh);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (mask.data[i] === 255 && mask.data[i + 1] === 0 && mask.data[i + 2] === 0) hot[Math.floor(y / CELL) * gw + Math.floor(x / CELL)] = 1;
  }
const seen = new Uint8Array(gw * gh);
const regions = [];
for (let c = 0; c < hot.length; c++) {
  if (!hot[c] || seen[c]) continue;
  let [x0, y0, x1, y1, n] = [c % gw, Math.floor(c / gw), c % gw, Math.floor(c / gw), 0];
  const stack = [c];
  seen[c] = 1;
  while (stack.length) {
    const k = stack.pop();
    const kx = k % gw, ky = Math.floor(k / gw);
    n++;
    x0 = Math.min(x0, kx); x1 = Math.max(x1, kx); y0 = Math.min(y0, ky); y1 = Math.max(y1, ky);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      const nx = kx + dx, ny = ky + dy;
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
      const nk = ny * gw + nx;
      if (hot[nk] && !seen[nk]) { seen[nk] = 1; stack.push(nk); }
    }
  }
  const pt = (v) => Math.round((v * CELL) / SCALE);
  regions.push({ x: pt(x0) + origin[0] / SCALE, y: pt(y0) + origin[1] / SCALE, w: pt(x1 - x0 + 1), h: pt(y1 - y0 + 1), n });
}
regions.sort((a, b) => b.n - a.n);

const pct = (differing / (W * H)) * 100;
console.log(`${name}: ${differing} px differ (${pct.toFixed(3)} %)`);
for (const r of regions.slice(0, 12)) console.log(`  region x${r.x} y${r.y} ${r.w}x${r.h} pt (${r.n} cells)`);
fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify({ name, design: designPath, app: appPath, differing, pct, regions }, null, 1));
