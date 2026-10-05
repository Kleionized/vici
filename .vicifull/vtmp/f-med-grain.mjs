/* Grain check. Reads a band of pure board background from the design PNG and the
   app PNG and reports, for each: the mean level, and the mean |Δ| between
   horizontally adjacent pixels — the high-frequency energy that tells a 1px
   speckle apart from a blob tens of points across. Also the design↔app |Δ|
   over exactly that band. The band is background only: no text, no coin, no
   dev badge. Coordinates are frame points; PNGs are 2× device pixels. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [dName, aName, x0, y0, x1, y1] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const D = rd(dName), A = rd(aName);
const s = D.width / 393;
const px = (p, x, y) => { const i = (p.width * y + x) << 2; return (p.data[i] + p.data[i+1] + p.data[i+2]) / 3; };
const stats = (p) => {
  let n = 0, sum = 0, hf = 0, hn = 0;
  for (let y = y0 * s; y < y1 * s; y++) for (let x = x0 * s; x < x1 * s; x++) {
    sum += px(p, x, y); n++;
    if (x + 2 < x1 * s) { hf += Math.abs(px(p, x, y) - px(p, x + 2, y)); hn++; }
  }
  return { mean: +(sum / n).toFixed(2), hf: +(hf / hn).toFixed(3) };
};
let dd = 0, dn = 0, worst = 0;
for (let y = y0 * s; y < y1 * s; y++) for (let x = x0 * s; x < x1 * s; x++) {
  const v = Math.abs(px(D, x, y) - px(A, x, y)); dd += v; dn++; if (v > worst) worst = v;
}
console.log(`band ${x0},${y0}-${x1},${y1}  design ${JSON.stringify(stats(D))}  app ${JSON.stringify(stats(A))}  |d-a| mean ${(dd/dn).toFixed(2)} worst ${worst.toFixed(0)}`);
