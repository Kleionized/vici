/* Pixel-compare a design capture with an app capture, ignoring the status bar
   band the app never draws (canvas y < 54) and the dev-overlay corner. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
let bad = 0, worst = 0, wx = 0, wy = 0;
for (let y = 108; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (y > 1600 && x < 130) continue; // the Expo dev bubble
    const i = (y * A.width + x) * 4, j = (y * B.width + x) * 4;
    const d = Math.max(Math.abs(A.data[i] - B.data[j]), Math.abs(A.data[i + 1] - B.data[j + 1]), Math.abs(A.data[i + 2] - B.data[j + 2]));
    if (d > 12) { bad++; if (d > worst) { worst = d; wx = x; wy = y; } }
  }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${bad} px over 12/255 (worst ${worst} at ${wx},${Math.round(wy/2)})`);
