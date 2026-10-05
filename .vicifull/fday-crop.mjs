/* crop a canvas-coordinate box out of a 2x capture, optionally magnified */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [src, out, x0, y0, x1, y1, z = '4'] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(src));
const w = (Number(x1) - Number(x0)) * 2, h = (Number(y1) - Number(y0)) * 2, Z = Number(z);
const O = new PNG({ width: w * Z, height: h * Z });
for (let y = 0; y < h * Z; y++) for (let x = 0; x < w * Z; x++) {
  const si = (A.width * (Number(y0) * 2 + Math.floor(y / Z)) + (Number(x0) * 2 + Math.floor(x / Z))) << 2;
  const di = (O.width * y + x) << 2;
  O.data[di] = A.data[si]; O.data[di+1] = A.data[si+1]; O.data[di+2] = A.data[si+2]; O.data[di+3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(O));
