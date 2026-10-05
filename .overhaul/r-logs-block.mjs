/* Block-mean diff over the WHOLE frame — no row cutoff, no flatness filter, no
   region excluded (F35). 8x8 device-pixel blocks = 4x4 CSS pt. Averaging kills
   antialiasing; a lost paint server, a wrong gradient or a shifted box does not
   average away. Usage: node .overhaul/r-logs-block.mjs a.png b.png [thr] [--top=N] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const [a, b] = args.filter((x) => !x.startsWith('--'));
const thr = Number(args.filter((x) => !x.startsWith('--'))[2] ?? 4);
const top = Number((args.find((x) => x.startsWith('--top=')) ?? '--top=0').slice(6));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
for (let by = top * 2; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
const total = Math.floor((H - top * 2) / S) * Math.floor(W / S);
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length}/${total} blocks over ${thr}/255 (whole frame from y=${top})`);
for (const [d, x, y] of out.slice(0, 30)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
