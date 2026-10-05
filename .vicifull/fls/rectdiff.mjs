/* Pixel comparison over ONE stated rectangle, in frame points, so a finding can be
   measured where it lives rather than diluted across the screen. Excludes nothing
   inside the rect — no flatness test, no gradient skip (F35). */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , a, b, X, Y, W, H, thrArg] = process.argv;
const thr = Number(thrArg ?? 5);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const x0 = Math.round(Number(X) * 2), y0 = Math.round(Number(Y) * 2);
const x1 = Math.round((Number(X) + Number(W)) * 2), y1 = Math.round((Number(Y) + Number(H)) * 2);
let bad = 0, n = 0, maxd = 0, sum = 0, worst = null;
for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
  const i = (y * A.width + x) * 4;
  const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
  n++; sum += d;
  if (d > maxd) { maxd = d; worst = [x / 2, y / 2, [A.data[i], A.data[i+1], A.data[i+2]].join(','), [B.data[i], B.data[i+1], B.data[i+2]].join(',')]; }
  if (d > thr) bad++;
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()} rect ${X},${Y} ${W}x${H}: ${bad}/${n} px over ${thr}, mean |d| ${(sum/n).toFixed(2)}, max ${maxd}` + (worst ? ` at (${worst[0]}, ${worst[1]}) design ${worst[2]} app ${worst[3]}` : ''));
