/* Pixel-compare a design capture with an app capture at CSS resolution.
   The two pages rasterise curve antialiasing slightly differently — the same
   arc lands on the same coordinates but its edge pixels can differ by up to a
   third of a step — so this box-averages each 2x2 device block back to one CSS
   pixel before comparing, which cancels the AA and leaves real differences. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width) >> 1, H = Math.min(A.height, B.height) >> 1;
const box = (P, x, y, c) => (P.data[((2*y)*P.width + 2*x)*4+c] + P.data[((2*y)*P.width + 2*x+1)*4+c] + P.data[((2*y+1)*P.width + 2*x)*4+c] + P.data[((2*y+1)*P.width + 2*x+1)*4+c]) / 4;
let bad = 0, worst = 0, wx = 0, wy = 0;
for (let y = 54; y < H; y++) for (let x = 0; x < W; x++) {
  if (y > 800 && x < 65) continue; // the Expo dev bubble
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(box(A, x, y, c) - box(B, x, y, c)));
  if (d > 6) { bad++; if (d > worst) { worst = d; wx = x; wy = y; } }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${bad} css-px over 6/255 (worst ${worst.toFixed(1)} at ${wx},${wy})`);
