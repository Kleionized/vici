/* Pass-2 `day` pixel instrument.
 *
 * EXCLUSIONS, stated (FINDINGS F35): device rows above y0 (default canvas y=54,
 * the status bar the app never builds) and below y1 (default 852). NOTHING ELSE
 * is excluded — no flatness test, no gradient mask, no edge suppression. Every
 * pixel in the window is compared at full resolution on max-channel delta.
 *
 *   node .overhaul/fday-px.mjs a.png b.png [thresh=8] [y0=54] [y1=852]
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';

const [a, b, t = '8', y0 = '54', y1 = '852'] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const th = Number(t);
const bands = new Map();
let n = 0, worst = 0, wx = 0, wy = 0, sum = 0, tot = 0;
const pts = [];
for (let y = Number(y0) * 2; y < Number(y1) * 2; y++) {
  for (let x = 0; x < A.width; x++) {
    const i = (A.width * y + x) << 2;
    const d = Math.max(
      Math.abs(A.data[i] - B.data[i]),
      Math.abs(A.data[i + 1] - B.data[i + 1]),
      Math.abs(A.data[i + 2] - B.data[i + 2]),
    );
    sum += d; tot++;
    if (d > th) {
      n++;
      const band = Math.floor(y / 2 / 50) * 50;
      bands.set(band, (bands.get(band) ?? 0) + 1);
      pts.push([x / 2, y / 2, d]);
      if (d > worst) { worst = d; wx = x / 2; wy = y / 2; }
    }
  }
}
console.log(`n>${th} = ${n}   mean|d| = ${(sum / tot).toFixed(3)}   worst = ${worst} at ${wx},${wy}`);
for (const [k, v] of [...bands].sort((p, q) => p[0] - q[0])) console.log(`  y${k}-${k + 49}: ${v}`);
/* crude clustering so a report names WHERE, not just how many */
if (pts.length) {
  const cl = [];
  for (const [x, y, d] of pts) {
    let hit = null;
    for (const c of cl) if (x >= c.x0 - 6 && x <= c.x1 + 6 && y >= c.y0 - 6 && y <= c.y1 + 6) { hit = c; break; }
    if (hit) { hit.x0 = Math.min(hit.x0, x); hit.x1 = Math.max(hit.x1, x); hit.y0 = Math.min(hit.y0, y); hit.y1 = Math.max(hit.y1, y); hit.n++; hit.d = Math.max(hit.d, d); }
    else cl.push({ x0: x, x1: x, y0: y, y1: y, n: 1, d });
  }
  cl.sort((p, q) => q.n - p.n);
  for (const c of cl.slice(0, 8)) console.log(`  cluster ${c.x0}..${c.x1} x ${c.y0}..${c.y1}  n=${c.n} maxd=${c.d}`);
  if (cl.length > 8) console.log(`  … ${cl.length - 8} more clusters`);
}
