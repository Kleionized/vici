/* Ink bounding box of a region: the extreme device pixels whose luminance is on
   the far side of a threshold. Excludes nothing inside the stated rect. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, xs, ys, ws, hs, mode, thrS] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const [x0, y0, w, h] = [+xs * 2, +ys * 2, +ws * 2, +hs * 2];
const thr = Number(thrS ?? 128);
let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1, n = 0;
const rowsum = [], colsum = [];
for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
  const i = (y * P.width + x) * 4;
  const L = 0.299 * P.data[i] + 0.587 * P.data[i + 1] + 0.114 * P.data[i + 2];
  const ink = mode === 'light' ? L > thr : L < thr;
  if (ink) { n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    rowsum[y - y0] = (rowsum[y - y0] || 0) + 1; colsum[x - x0] = (colsum[x - x0] || 0) + 1; }
}
console.log(`${f.split('/').pop()}  ink px ${n}  device bbox x ${minx}–${maxx}  y ${miny}–${maxy}  (css x ${minx/2}–${maxx/2} y ${miny/2}–${maxy/2})`);
