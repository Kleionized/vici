/* Whole-frame per-pixel diff. Excludes NOTHING: no gradient masking, no edge
   erosion, no band skipping — every device pixel of both PNGs is compared, and
   the only argument is the threshold. Reports the count over the threshold, the
   share of the frame, the mean and max channel delta over those pixels, and the
   worst 40x40 cells so a defect can be located rather than only counted.
   Optionally crops to a css-coordinate box: --box=x,y,w,h. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const [a, b] = args.filter((s) => !s.startsWith('--'));
const thr = Number((args.find((s) => s.startsWith('--thr=')) || '--thr=6').slice(6));
const boxArg = args.find((s) => s.startsWith('--box='));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const S = A.width / 393;
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
let x0 = 0, y0 = 0, x1 = W, y1 = H;
if (boxArg) { const [bx, by, bw, bh] = boxArg.slice(6).split(',').map(Number); x0 = Math.round(bx * S); y0 = Math.round(by * S); x1 = Math.round((bx + bw) * S); y1 = Math.round((by + bh) * S); }
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
let n = 0, sum = 0, max = 0;
const cells = new Map();
for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A, x, y, c) - at(B, x, y, c)));
  if (d < thr) continue;
  n++; sum += d; if (d > max) max = d;
  const k = `${Math.floor(x / S / 40) * 40},${Math.floor(y / S / 40) * 40}`;
  const e = cells.get(k) || [0, 0]; e[0]++; if (d > e[1]) e[1] = d; cells.set(k, e);
}
const total = (x1 - x0) * (y1 - y0);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}  thr ${thr}${boxArg ? ' ' + boxArg : ''}`);
console.log(`  ${n} px over ${thr} (${((n / total) * 100).toFixed(3)} % of ${total}), mean ${n ? (sum / n).toFixed(0) : 0}, max ${max}`);
for (const [k, v] of [...cells].sort((p, q) => q[1][0] - p[1][0]).slice(0, 8)) console.log(`    cell ${k}: ${v[0]} px, worst ${v[1]}`);
