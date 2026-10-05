/* Dump one 8x8 device block from both images, channel by channel. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, cx, cy] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const x0 = +cx * 2, y0 = +cy * 2;
for (let y = y0; y < y0 + 8; y++) {
  let la = '', lb = '';
  for (let x = x0; x < x0 + 8; x++) {
    const i = (y * A.width + x) * 4, j = (y * B.width + x) * 4;
    la += String(A.data[i]).padStart(4);
    lb += String(B.data[j]).padStart(4);
  }
  console.log(`dev y${y}  D${la}   |  A${lb}`);
}
