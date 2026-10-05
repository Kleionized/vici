#!/usr/bin/env node
/**
 * Pixel comparison of a design capture against an app capture.
 *
 *   node scripts/overhaul/pxdiff.mjs <design.png> <app.png> [outPrefix] [--t=24] [--ignore=x,y,w,h;...]
 *
 * Writes, next to `outPrefix` (default: the app PNG without `.png`):
 *   <prefix>.diff.png     the design in faint grey with every differing pixel in red
 *   <prefix>.overlay.png  50/50 blend of the two — a doubled edge is an offset
 *   <prefix>.strip.png    design | app | diff side by side, one image to look at
 * and prints the mismatch share, the mean channel delta, and the mismatch
 * regions as boxes in FRAME points (device pixels / dpr), largest first.
 *
 * A pixel "differs" when any channel is more than `--t` apart (default 24 of
 * 255): enough to ignore antialiasing and the noise texture's grain, not enough
 * to hide a wrong grey. The status bar and home indicator are excluded by
 * default (`--keep-chrome` keeps them); `--ignore=x,y,w,h;…` blanks more.
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [dPath, aPath, prefixArg] = argv.filter((a) => !a.startsWith('--'));
if (!dPath || !aPath) { console.error('usage: pxdiff.mjs <design.png> <app.png> [outPrefix] [--t=24]'); process.exit(1); }
const T = Number(flags.t ?? 24);
const prefix = prefixArg ?? aPath.replace(/\.png$/, '');

const D = PNG.sync.read(fs.readFileSync(dPath));
const A = PNG.sync.read(fs.readFileSync(aPath));
const W = Math.min(D.width, A.width), H = Math.min(D.height, A.height);
const dpr = Number(flags.dpr ?? (Math.round(D.width / 393) || 1));
if (D.width !== A.width || D.height !== A.height) console.log(`size differs: design ${D.width}x${D.height}, app ${A.width}x${A.height} — compared ${W}x${H}`);

// The status bar (0–54) and the home indicator (127,839 139×5) are phone chrome
// the app never draws (D009) — out of the count unless `--keep-chrome`.
const CHROME = flags['keep-chrome'] ? [] : ['0,0,393,54', '120,834,153,14'];
const ignore = [...CHROME, ...String(flags.ignore ?? '').split(';').filter(Boolean)].map((r) => r.split(',').map((v) => Number(v) * dpr));
const ignored = (x, y) => ignore.some(([ix, iy, iw, ih]) => x >= ix && x < ix + iw && y >= iy && y < iy + ih);

const diff = new PNG({ width: W, height: H });
const over = new PNG({ width: W, height: H });
const CELL = 4 * dpr; // mismatch grid cell, 4 frame points
const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
const grid = new Uint32Array(gw * gh);
let bad = 0, counted = 0, sum = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const kd = (D.width * y + x) << 2, ka = (A.width * y + x) << 2, k = (W * y + x) << 2;
    const dr = D.data[kd], dg = D.data[kd + 1], db = D.data[kd + 2];
    const ar = A.data[ka], ag = A.data[ka + 1], ab = A.data[ka + 2];
    const m = Math.max(Math.abs(dr - ar), Math.abs(dg - ag), Math.abs(db - ab));
    over.data[k] = (dr + ar) >> 1; over.data[k + 1] = (dg + ag) >> 1; over.data[k + 2] = (db + ab) >> 1; over.data[k + 3] = 255;
    const lum = Math.round(0.3 * dr + 0.59 * dg + 0.11 * db);
    const faint = 200 + Math.round(lum * 0.2);
    if (ignored(x, y)) { diff.data[k] = diff.data[k + 1] = diff.data[k + 2] = 235; diff.data[k + 3] = 255; continue; }
    counted++; sum += m;
    if (m > T) {
      bad++;
      grid[Math.floor(y / CELL) * gw + Math.floor(x / CELL)]++;
      diff.data[k] = 230; diff.data[k + 1] = 20; diff.data[k + 2] = 20; diff.data[k + 3] = 255;
    } else {
      diff.data[k] = faint; diff.data[k + 1] = faint; diff.data[k + 2] = faint; diff.data[k + 3] = 255;
    }
  }
}

// Connected regions of mismatching cells (a cell counts if >= 3% of it differs).
const minCell = Math.max(1, Math.round(CELL * CELL * 0.03));
const seen = new Uint8Array(gw * gh);
const regions = [];
for (let i = 0; i < gw * gh; i++) {
  if (seen[i] || grid[i] < minCell) continue;
  const q = [i]; seen[i] = 1;
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1, px = 0;
  while (q.length) {
    const c = q.pop(); const cx = c % gw, cy = (c / gw) | 0;
    px += grid[c];
    x0 = Math.min(x0, cx); y0 = Math.min(y0, cy); x1 = Math.max(x1, cx); y1 = Math.max(y1, cy);
    for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
      const n = ny * gw + nx;
      if (!seen[n] && grid[n] >= minCell) { seen[n] = 1; q.push(n); }
    }
  }
  const s = CELL / dpr;
  regions.push({ x: x0 * s, y: y0 * s, w: (x1 - x0 + 1) * s, h: (y1 - y0 + 1) * s, px });
}
regions.sort((a, b) => b.px - a.px);

fs.writeFileSync(prefix + '.diff.png', PNG.sync.write(diff));
fs.writeFileSync(prefix + '.overlay.png', PNG.sync.write(over));
// strip: design | app | diff, each scaled to 1x (dpr down-sample) to keep it small
const sw = Math.floor(W / dpr), sh = Math.floor(H / dpr), GAP = 8;
const strip = new PNG({ width: sw * 3 + GAP * 2, height: sh });
strip.data.fill(255);
const blit = (src, srcW, ox) => {
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const ks = (srcW * (y * dpr) + x * dpr) << 2, kt = (strip.width * y + ox + x) << 2;
    strip.data[kt] = src.data[ks]; strip.data[kt + 1] = src.data[ks + 1]; strip.data[kt + 2] = src.data[ks + 2]; strip.data[kt + 3] = 255;
  }
};
blit(D, D.width, 0); blit(A, A.width, sw + GAP); blit(diff, W, (sw + GAP) * 2);
fs.writeFileSync(prefix + '.strip.png', PNG.sync.write(strip));

const share = counted ? (100 * bad) / counted : 0;
console.log(`mismatch ${share.toFixed(2)}% (${bad} of ${counted} px > ${T}), mean Δ ${(sum / Math.max(1, counted)).toFixed(2)}`);
console.log(`regions (frame pt, largest first): ${regions.length}`);
for (const r of regions.slice(0, Number(flags.top ?? 15))) console.log(`  ${r.x},${r.y} ${r.w}x${r.h}  (${r.px} px)`);
console.log(`-> ${prefix}.strip.png  ${prefix}.diff.png  ${prefix}.overlay.png`);
if (flags.json) fs.writeFileSync(prefix + '.pxdiff.json', JSON.stringify({ share, bad, counted, mean: sum / Math.max(1, counted), regions }, null, 1));
