/* F47's test: prove a grain tiles at the file's own 96 css px, by high-passing
   each row and correlating it with itself at the 96 css px (192 device px) lag.
   A magnified tile (expo-image contentFit="cover") loses the correlation and
   its rms collapses; a repeat-tiled one keeps both. Nothing masked. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, x0s, y0s, x1s, y1s] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const [x0, y0, x1, y1] = [x0s, y0s, x1s, y1s].map(Number);
const LAG = 192;
let num = 0, d1 = 0, d2 = 0, rms = 0, n = 0, flips = 0;
for (let y = y0 * 2; y < y1 * 2; y++) {
  const row = [];
  for (let x = x0 * 2; x < x1 * 2; x++) row.push(P.data[(y * P.width + x) * 4]);
  const hp = row.map((v, i) => (i > 0 && i < row.length - 1 ? v - (row[i - 1] + row[i + 1]) / 2 : 0));
  for (let i = 1; i < hp.length - 1 - LAG; i++) { num += hp[i] * hp[i + LAG]; d1 += hp[i] * hp[i]; d2 += hp[i + LAG] * hp[i + LAG]; }
  for (let i = 1; i < hp.length - 1; i++) { rms += hp[i] * hp[i]; n++; if (hp[i] * hp[i - 1] < 0) flips++; }
}
console.log(`${f.split('/').pop()} [${x0},${y0}..${x1},${y1}]  r@96css ${(num / Math.sqrt(d1 * d2)).toFixed(3)}  rms ${Math.sqrt(rms / n).toFixed(3)}  flips/row ${(flips / (y1 - y0) / 2).toFixed(1)}`);
