/* Grain texture check: in a band the design leaves flat apart from the noise
   tile, count sign changes along each row of the row-mean-subtracted signal and
   the sd. A repeating 96x96 tile gives many small flips; one tile magnified ~9x
   gives few large blotches. Excludes nothing inside the band. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, y0s, y1s, x0s, x1s] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const [y0, y1, x0, x1] = [+y0s, +y1s, +(x0s ?? 0), +(x1s ?? 393)];
let flips = 0, rows = 0, sd = 0;
for (let y = y0 * 2; y < y1 * 2; y++) {
  const v = [];
  for (let x = x0 * 2; x < x1 * 2; x++) { const i = (y * P.width + x) * 4; v.push((P.data[i] + P.data[i + 1] + P.data[i + 2]) / 3); }
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const d = v.map((z) => z - mean);
  sd += Math.sqrt(d.reduce((a, b) => a + b * b, 0) / d.length);
  let f2 = 0;
  for (let i = 1; i < d.length; i++) if ((d[i] > 0) !== (d[i - 1] > 0)) f2++;
  flips += f2; rows++;
}
console.log(`${f.split('/').pop()}  y${y0}-${y1} x${x0}-${x1}:  flips/row ${(flips / rows).toFixed(1)}   sd ${(sd / rows).toFixed(2)}`);
