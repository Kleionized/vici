/* Block-mean diff over the WHOLE frame — no row cutoff, no flatness filter, so
   nothing is excluded: gradients, washes and the top 54pt are all counted.
   8x8 device-pixel block means kill antialiasing (a 1-px edge shift moves a
   block mean by ~1/8 of the contrast) while a missing shape, a wrong gradient
   radius or a smeared texture move it a lot.
   usage: node f-handover-diff.mjs a.png b.png [thr] [--band=y0,y1] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const [a, b] = args.filter((x) => !x.startsWith('--'));
const thr = Number(args.filter((x) => !x.startsWith('--'))[2] ?? 4);
const band = (args.find((x) => x.startsWith('--band=')) ?? '').slice(7).split(',').map(Number);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8;
const y0 = band.length === 2 ? band[0] * 2 : 0;
const y1 = band.length === 2 ? band[1] * 2 : H;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let sum = 0, n = 0;
for (let by = y0; by + S <= Math.min(y1, H); by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  sum += d; n++;
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}  css y ${y0 / 2}-${Math.min(y1, H) / 2}`);
console.log(`  ${out.length}/${n} blocks over ${thr}/255   mean |d| ${(sum / n).toFixed(2)}   worst ${(out[0]?.[0] ?? 0).toFixed(1)}`);
for (const [d, x, y] of out.slice(0, 16)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
