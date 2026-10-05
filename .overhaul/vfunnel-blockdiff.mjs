/* Block-mean diff: averages 8x8 device-pixel blocks on both images and reports
   the blocks whose mean colour differs. Averaging kills antialiasing (a 1-px
   edge shift moves a block mean by ~1/8 of the contrast) while a missing shape,
   a wrong gradient or a shifted box moves it a lot. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length} blocks over ${thr}/255 mean`);
for (const [d, x, y] of out.slice(0, 24)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
