/* Per-PIXEL diff over one frame-coordinate rectangle. No block averaging, no
   flatness test, no gradient skip — the whole rectangle, every pixel, every
   channel. Written for D151: a block mean hides a smooth few-level error in a
   wash's core, which is exactly where a missing blur shows up.
   Usage: node f-slip-px.mjs a.png b.png x y w h [threshold] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, X, Y, W, H, T] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const s = A.width / 393, thr = Number(T ?? 3);
const x0 = Math.round(X * s), y0 = Math.round(Y * s), w = Math.round(W * s), h = Math.round(H * s);
let over = 0, n = 0, sum = 0, worst = 0, wx = 0, wy = 0;
for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
  const i = (y * A.width + x) * 4;
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(A.data[i + c] - B.data[i + c]));
  n++; sum += d;
  if (d > worst) { worst = d; wx = x / s; wy = y / s; }
  if (d >= thr) over++;
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()} over frame ${X},${Y} ${W}x${H}: ${over} of ${n} px >= ${thr}/255, mean |d| ${(sum / n).toFixed(2)}, worst ${worst} at frame ${wx.toFixed(0)},${wy.toFixed(0)}`);
