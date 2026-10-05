/* Independent pixel accounting for the pass-2 weeks recheck.
 *
 * EXCLUDES: device rows 0..107 only — the 54 CSS rows of status bar the app
 * never builds (D009). Nothing else is excluded: gradients, washes, shadow
 * bands, both boats, every text run and every scene layer are inside the
 * compared region (F35).
 *
 * Prints, over the compared region:
 *   raw per-pixel max-channel Δ: mean, worst, counts over 2 and over 8
 *   8x8 block means: blocks over 2 and over 4, worst block mean
 *   the worst blocks' CSS coordinates
 * An optional 5th arg restricts to a CSS box "x,y,w,h" (stated in the output).
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, boxArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const box = boxArg ? boxArg.split(',').map(Number) : null;
const Y0 = 108;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const inBox = (x, y) => !box || (x / 2 >= box[0] && y / 2 >= box[1] && x / 2 < box[0] + box[2] && y / 2 < box[1] + box[3]);
let n = 0, sum = 0, worst = 0, o2 = 0, o8 = 0, wx = 0, wy = 0;
for (let y = Y0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!inBox(x, y)) continue;
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A, x, y, c) - at(B, x, y, c)));
  n++; sum += d; if (d > 2) o2++; if (d > 8) o8++;
  if (d > worst) { worst = d; wx = x / 2; wy = y / 2; }
}
const S = 8; const blocks = [];
let bworst = 0, bsum = 0, bn = 0;
for (let by = Y0; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  if (!inBox(bx, by) || !inBox(bx + S - 1, by + S - 1)) continue;
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  bn++; bsum += d; if (d > bworst) bworst = d;
  if (d >= 2) blocks.push([d, bx / 2, by / 2]);
}
blocks.sort((p, q) => q[0] - p[0]);
const o4 = blocks.filter((r) => r[0] >= 4).length;
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}${box ? ' box ' + boxArg : ''}  [excludes only device rows 0-107 = the 54css status bar]`);
console.log(`  raw px ${n}  meanΔ ${(sum / n).toFixed(4)}  worstΔ ${worst} at css ${wx},${wy}  >2: ${o2}  >8: ${o8}`);
console.log(`  8x8 blocks ${bn}  >=2: ${blocks.length}  >=4: ${o4}  worst block ${bworst.toFixed(1)}  mean ${(bsum / bn).toFixed(3)}`);
for (const [d, x, y] of blocks.slice(0, 12)) console.log(`     block ${d.toFixed(1)} at css ${x},${y}`);
