/* Signed mean of (design - app) over a css patch, per channel. Excludes nothing. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, cx, cy, rad] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const R = Number(rad ?? 4), X = Number(cx), Y = Number(cy);
const s = [0, 0, 0]; let n = 0;
for (let y = (Y - R) * 2; y <= (Y + R) * 2; y++) for (let x = (X - R) * 2; x <= (X + R) * 2; x++) {
  for (let c = 0; c < 3; c++) s[c] += A.data[(y * A.width + x) * 4 + c] - B.data[(y * B.width + x) * 4 + c];
  n++;
}
console.log(`${a.split('/').pop().replace(/^r-funnel-d-/, '').replace(/\.png$/, '').padEnd(18)} patch ${X},${Y} +-${R}: design-app R/G/B ${(s[0] / n).toFixed(2)} / ${(s[1] / n).toFixed(2)} / ${(s[2] / n).toFixed(2)}`);
