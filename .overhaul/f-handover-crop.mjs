import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, out, xs, ys, ws, hs, ss] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const [x, y, w, h, s] = [+xs * 2, +ys * 2, +ws * 2, +hs * 2, +(ss ?? 1)];
const O = new PNG({ width: w * s, height: h * s });
for (let j = 0; j < h * s; j++) for (let i = 0; i < w * s; i++) {
  const si = ((y + Math.floor(j / s)) * P.width + (x + Math.floor(i / s))) * 4;
  const di = (j * O.width + i) * 4;
  for (let c = 0; c < 4; c++) O.data[di + c] = P.data[si + c];
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log(out);
