/* Block-mean diff for the auth group.
 *
 * Averages SxS device-pixel blocks on both images and reports every block whose
 * mean channel differs by >= thr. Averaging kills antialiasing without killing
 * gradients (FINDINGS F35: an instrument that excludes gradient regions cannot
 * settle a gradient finding).
 *
 * EXCLUSIONS, stated in full: css rows y < 54 (the canvas's status bar) and
 * y >= 838 (the home indicator) — D009 chrome the app never draws. NOTHING
 * ELSE is excluded: no flatness test, no edge suppression, every x, every
 * gradient region, every channel.
 *
 *   node bd.mjs a.png b.png [thr=3] [S=8]
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg, sArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = Number(sArg ?? 8), thr = Number(thrArg ?? 3);
const Y0 = 54 * 2, Y1 = 838 * 2;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let total = 0, worst = 0;
for (let by = Y0; by + S <= Math.min(H, Y1); by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  total++;
  if (d > worst) worst = d;
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length}/${total} blocks >= ${thr}/255 mean, worst ${worst.toFixed(1)}/255  [excl. y<54 and y>=838 only]`);
for (const [d, x, y] of out.slice(0, 20)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
