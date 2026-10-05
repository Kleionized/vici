/* design↔app |Δ| over one frame-point rect. Nothing excluded inside the rect. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a, X0, Y0, X1, Y1] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const D = rd(d), A = rd(a); const s = D.width / 393;
const px = (p, x, y) => { const i = (p.width * y + x) << 2; return [p.data[i], p.data[i+1], p.data[i+2]]; };
let sum = 0, n = 0, worst = 0, wx = 0, wy = 0, o8 = 0;
for (let y = Y0 * s; y < Y1 * s; y++) for (let x = X0 * s; x < X1 * s; x++) {
  const P = px(D, x, y), Q = px(A, x, y);
  const v = Math.max(Math.abs(P[0]-Q[0]), Math.abs(P[1]-Q[1]), Math.abs(P[2]-Q[2]));
  sum += v; n++; if (v > 8) o8++; if (v > worst) { worst = v; wx = x / s; wy = y / s; }
}
console.log(`${d} vs ${a}  rect ${X0},${Y0}-${X1},${Y1}  mean ${(sum/n).toFixed(2)}  >8 ${(100*o8/n).toFixed(2)}%  worst ${worst} at ${wx.toFixed(0)},${wy.toFixed(0)}`);
