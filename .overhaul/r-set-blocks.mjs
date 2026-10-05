/* Whole-frame 8x8 block-mean diff. EXCLUDES device rows 0..107 (the 54pt status
   bar the app never draws, D009) and NOTHING else — gradients, washes, art and
   text all count. Prints per-css-row bands with the x-extent of the blocks in
   each, so a residue can be located rather than just counted. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg, y0a, y1a] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const yLo = y0a === undefined ? 108 : Number(y0a) * 2;
const yHi = y1a === undefined ? H : Number(y1a) * 2;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const rows = new Map();
let n = 0, worst = 0, worstAt = '';
for (let by = Math.max(108, yLo); by + S <= Math.min(H, yHi); by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  if (d >= thr) {
    n++;
    const r = by / 2;
    const cur = rows.get(r) ?? { n: 0, max: 0, x0: 1e9, x1: -1 };
    cur.n++; cur.max = Math.max(cur.max, d); cur.x0 = Math.min(cur.x0, bx / 2); cur.x1 = Math.max(cur.x1, (bx + S) / 2);
    rows.set(r, cur);
    if (d > worst) { worst = d; worstAt = `${bx / 2},${by / 2}`; }
  }
}
console.log(`${n} blocks >= ${thr}/255 (worst ${worst.toFixed(1)} at css ${worstAt}) [rows ${yLo/2}..${Math.min(H,yHi)/2} css, status bar 0..53 excluded]`);
for (const [r, v] of [...rows].sort((p, q2) => p[0] - q2[0])) console.log(`  css y ${r}: ${v.n} blocks x ${v.x0}..${v.x1}, worst ${v.max.toFixed(1)}`);
