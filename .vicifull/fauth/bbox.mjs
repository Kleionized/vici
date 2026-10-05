/* Bounding box of every block a bd.mjs run would report, so a diff can be
   attributed to one region instead of guessed at. Same exclusions as bd.mjs. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height), S = 8, thr = Number(thrArg ?? 3);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0;
for (let by = 108; by + S <= Math.min(H, 1676); by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++) for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  if (d >= thr) { n++; x0 = Math.min(x0, bx / 2); y0 = Math.min(y0, by / 2); x1 = Math.max(x1, (bx + S) / 2); y1 = Math.max(y1, (by + S) / 2); }
}
console.log(n ? `${n} blocks, all inside css x ${x0}..${x1}, y ${y0}..${y1}` : 'no blocks');
