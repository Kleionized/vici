/* Raw per-device-pixel comparison of two PNGs over a css rect.
   EXCLUDES NOTHING inside the rect: no flatness test, no gradient skip, no
   block averaging. The only default exclusion is css y < 54 — the status-bar
   chrome the app never draws (D009). Reports, per channel, the signed mean of
   (design - app) so a one-directional tint shows as a sign, plus the worst
   pixel and the counts over 4 and 8 of 255.
   usage: node .vicifull/r-funnel-px.mjs design.png app.png [x0 y0 x1 y1] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...rest] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const n4 = rest.map(Number);
const [x0, y0, x1, y1] = n4.length >= 4 ? n4 : [0, 54, 393, 852];
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
let tot = 0, worst = 0, wx = 0, wy = 0, c4 = 0, c8 = 0, c16 = 0, sumAbs = 0;
const sgn = [0, 0, 0];
for (let y = y0 * 2; y < Math.min(y1 * 2, H); y++)
  for (let x = x0 * 2; x < Math.min(x1 * 2, W); x++) {
    let d = 0;
    for (let c = 0; c < 3; c++) {
      const dv = A.data[(y * A.width + x) * 4 + c] - B.data[(y * B.width + x) * 4 + c];
      sgn[c] += dv; d = Math.max(d, Math.abs(dv));
    }
    tot++; sumAbs += d;
    if (d > worst) { worst = d; wx = x / 2; wy = y / 2; }
    if (d >= 4) c4++; if (d >= 8) c8++; if (d >= 16) c16++;
  }
console.log(`${a.split('/').pop().replace(/^r-funnel-d-/, '')} css[${x0},${y0}..${x1},${y1}] n=${tot}  >=4:${c4}  >=8:${c8}  >=16:${c16}  meanAbs ${(sumAbs / tot).toFixed(3)}  signed R/G/B ${(sgn[0] / tot).toFixed(2)}/${(sgn[1] / tot).toFixed(2)}/${(sgn[2] / tot).toFixed(2)}  worst ${worst} at css ${wx},${wy}`);
