/* The laurel box on Drop Received, measured with nothing excluded:
   every device pixel in the css box is counted. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const x0 = 345, x1 = 439, y0 = 494, y1 = 577;      // device px = css 172.5..219.5 x 247..288.5
let dl = 0, al = 0, dn = 0, an = 0, n = 0, maxd = 0, at = null, over6 = 0, over12 = 0, sum = 0;
for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
  const i = (y * A.width + x) * 4;
  const d = A.data[i], p = B.data[i];
  n++; dl += d; al += p; if (d > 170) dn++; if (p > 170) an++;
  const e = Math.abs(d - p); sum += e; if (e > maxd) { maxd = e; at = [x/2, y/2, d, p]; }
  if (e > 6) over6++; if (e > 12) over12++;
}
console.log(`px ${n}  design>170 ${dn} mean ${(dl/n).toFixed(1)}   app>170 ${an} mean ${(al/n).toFixed(1)}`);
console.log(`mean |Δ| ${(sum/n).toFixed(2)}  over 6/255 ${over6}  over 12/255 ${over12}  worst Δ${maxd}${at ? ` at css ${at[0]},${at[1]} (design ${at[2]}, app ${at[3]})` : ' — no pixel differs'}`);
