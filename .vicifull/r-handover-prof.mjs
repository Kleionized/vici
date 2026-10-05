/* Column and row ink profiles over a rect, and the integer device-pixel shift
   between two images that minimises squared difference of those profiles.
   Excludes nothing inside the rect. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [fa, fb, xs, ys, ws, hs, mode, thrS] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(fa)), B = PNG.sync.read(fs.readFileSync(fb));
const [x0, y0, w, h] = [+xs * 2, +ys * 2, +ws * 2, +hs * 2];
const thr = Number(thrS ?? 128);
const prof = (P) => {
  const col = new Array(w).fill(0), row = new Array(h).fill(0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * P.width + (x0 + x)) * 4;
    const L = 0.299 * P.data[i] + 0.587 * P.data[i + 1] + 0.114 * P.data[i + 2];
    const v = mode === 'light' ? Math.max(0, L - thr) : Math.max(0, thr - L);
    col[x] += v; row[y] += v;
  }
  return { col, row };
};
const a = prof(A), b = prof(B);
const best = (u, v) => { let bs = 1e18, bk = 0; for (let k = -6; k <= 6; k++) { let s = 0, n = 0; for (let i = 0; i < u.length; i++) { const j = i + k; if (j < 0 || j >= v.length) continue; s += (u[i] - v[j]) ** 2; n++; } s /= n; if (s < bs) { bs = s; bk = k; } } return { bk, bs }; };
const cs = best(a.col, b.col), rs = best(a.row, b.row);
const mass = (p) => p.reduce((s, x) => s + x, 0);
const cen = (p) => { let s = 0, m = 0; p.forEach((v, i) => { s += v * i; m += v; }); return m ? s / m : 0; };
console.log(`x: best shift ${cs.bk} device px (b relative to a); centroid a ${cen(a.col).toFixed(2)} b ${cen(b.col).toFixed(2)} Δ${(cen(b.col)-cen(a.col)).toFixed(2)}`);
console.log(`y: best shift ${rs.bk} device px; centroid a ${cen(a.row).toFixed(2)} b ${cen(b.row).toFixed(2)} Δ${(cen(b.row)-cen(a.row)).toFixed(2)}`);
console.log(`ink mass a ${mass(a.col).toFixed(0)}  b ${mass(b.col).toFixed(0)}  ratio ${(mass(b.col)/mass(a.col)).toFixed(4)}`);
