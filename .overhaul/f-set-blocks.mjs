/* Block-mean diff, whole frame. Averages 8x8 device-pixel blocks and lists every
   block whose mean channel differs by >= thr, grouped by CSS row band.
   EXCLUDES: device rows 0..107 only — the 54pt status bar the app never draws
   (D009). Nothing else is excluded: gradients, washes and text all count. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const rows = new Map();
let n = 0, worst = 0, worstAt = '';
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  if (d >= thr) {
    n++;
    const r = by / 2;
    const cur = rows.get(r) ?? { n: 0, max: 0 };
    cur.n++; cur.max = Math.max(cur.max, d); rows.set(r, cur);
    if (d > worst) { worst = d; worstAt = `${bx / 2},${by / 2}`; }
  }
}
console.log(`${n} blocks >= ${thr}/255 (worst ${worst.toFixed(1)} at css ${worstAt})`);
for (const [r, v] of [...rows].sort((p, q2) => p[0] - q2[0])) console.log(`  css y ${r}: ${v.n} blocks, worst ${v.max.toFixed(1)}`);
