import fs from 'node:fs';
import { PNG } from 'pngjs';
const [dName, aName] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const D = rd(dName), A = rd(aName);
const px = (p, x, y) => { const i = (p.width * y + x) << 2; return (p.data[i] + p.data[i+1] + p.data[i+2]) / 3; };
// band in device px
const X0 = 40, X1 = 740, Y0 = 570, Y1 = 640;
let best = null;
for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
  let s = 0, n = 0;
  for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) { s += Math.abs(px(D, x, y) - px(A, x + dx, y + dy)); n++; }
  const m = s / n;
  if (!best || m < best.m) best = { dx, dy, m: +m.toFixed(3) };
}
console.log(dName, '->', JSON.stringify(best));
