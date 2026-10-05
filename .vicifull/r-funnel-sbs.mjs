/* Side-by-side design | app | 8x-amplified signed difference, for reading. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, out, ...r] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const n = r.map(Number);
const [x0, y0, x1, y1] = n.length >= 4 ? n : [0, 0, 393, 852];
const w = (x1 - x0) * 2, h = (y1 - y0) * 2, G = 8;
const O = new PNG({ width: w * 3 + G * 2, height: h });
O.data.fill(255);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const sa = ((y + y0 * 2) * A.width + x + x0 * 2) * 4, sb = ((y + y0 * 2) * B.width + x + x0 * 2) * 4;
  const p1 = (y * O.width + x) * 4, p2 = (y * O.width + x + w + G) * 4, p3 = (y * O.width + x + 2 * w + 2 * G) * 4;
  for (let c = 0; c < 4; c++) { O.data[p1 + c] = A.data[sa + c]; O.data[p2 + c] = B.data[sb + c]; }
  for (let c = 0; c < 3; c++) O.data[p3 + c] = Math.max(0, Math.min(255, 128 + (A.data[sa + c] - B.data[sb + c]) * 8));
  O.data[p3 + 3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log(out);
