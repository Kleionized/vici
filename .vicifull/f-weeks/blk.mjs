/* Block-mean diff over the WHOLE frame, 8x8 device-pixel blocks.
 *
 * Excludes nothing by default: the only optional exclusion is the top 54 CSS
 * rows (`--nochrome`), which is the status bar the app never builds (D009).
 * Gradients, washes and shadow bands are all inside the compared region --
 * F35's rule is that an instrument must state what it skips, and this one
 * skips nothing unless told to.
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const [a, b, thrArg, boxArg] = args.filter((a) => !a.startsWith('--'));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
// optional CSS-space box "x,y,w,h" to restrict the comparison to
const box = boxArg ? boxArg.split(',').map(Number) : null;
const y0 = flags.includes('--nochrome') ? 108 : 0;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let worst = 0, sum = 0, cells = 0;
for (let by = y0; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  if (box) {
    const cx = bx / 2, cy = by / 2;
    if (cx < box[0] || cy < box[1] || cx >= box[0] + box[2] || cy >= box[1] + box[3]) continue;
  }
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  worst = Math.max(worst, d); sum += d; cells++;
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length}/${cells} blocks over ${thr}/255  worst ${worst.toFixed(1)}  mean ${(sum / cells).toFixed(3)}${box ? `  box ${boxArg}` : ''}${y0 ? '  [top 54css excluded]' : ''}`);
for (const [d, x, y] of out.slice(0, 20)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
