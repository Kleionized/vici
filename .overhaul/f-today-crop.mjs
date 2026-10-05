/* crop a css-rect out of a 2x device-pixel PNG and write it, for reading by eye */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [src, out, X, Y, W, H, scale] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(src));
const s = Number(scale ?? 2);
const x = Number(X) * 2, y = Number(Y) * 2, w = Number(W) * 2, h = Number(H) * 2;
const O = new PNG({ width: w * s / 2, height: h * s / 2 });
for (let j = 0; j < O.height; j++) for (let i = 0; i < O.width; i++) {
  const sx = Math.min(P.width - 1, x + Math.floor(i * 2 / s)), sy = Math.min(P.height - 1, y + Math.floor(j * 2 / s));
  for (let c = 0; c < 4; c++) O.data[(j * O.width + i) * 4 + c] = P.data[(sy * P.width + sx) * 4 + c];
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log(out, O.width + 'x' + O.height);
