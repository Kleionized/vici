/* Differences that are NOT edge antialiasing.
   The design page and the app page rasterise curves with different AA (the
   quality setting moves with the machine, so the same pair can read 0 one hour
   and 400 the next); those differences only ever land on a pixel whose own
   neighbourhood is a gradient. This counts a pixel only where the design's 3x3
   neighbourhood is flat — a fill, a background, a solid bar — so a real colour,
   size or position error still shows and an AA edge does not. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
let bad = 0, worst = 0, wx = 0, wy = 0;
for (let y = 110; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  if (y > 1600 && x < 130) continue; // the Expo dev bubble
  let flat = true;
  for (let c = 0; c < 3 && flat; c++) {
    let lo = 255, hi = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const v = at(A, x + i, y + j, c); if (v < lo) lo = v; if (v > hi) hi = v; }
    if (hi - lo > 6) flat = false;
  }
  if (!flat) continue;
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A, x, y, c) - at(B, x, y, c)));
  if (d > 8) { bad++; if (d > worst) { worst = d; wx = x; wy = y; } }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${bad} flat-px over 8/255 (worst ${worst} at ${Math.round(wx/2)},${Math.round(wy/2)})`);
