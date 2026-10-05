/* GROUP today — pixel-compare a design capture with an app capture and report
   where the differences sit, in 32pt bands of canvas y. The status bar (canvas
   y < 54) is skipped: the app never draws it. Captures are 2x. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, fromArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const from = Number(fromArg ?? 54) * 2;
const bands = new Map();
let bad = 0;
for (let y = from; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * A.width + x) * 4, j = (y * B.width + x) * 4;
    const d = Math.max(Math.abs(A.data[i] - B.data[j]), Math.abs(A.data[i + 1] - B.data[j + 1]), Math.abs(A.data[i + 2] - B.data[j + 2]));
    if (d > 12) {
      bad++;
      const band = Math.floor(y / 64) * 32;
      const e = bands.get(band) ?? { n: 0, worst: 0, wx: 0, wy: 0 };
      e.n++; if (d > e.worst) { e.worst = d; e.wx = Math.round(x / 2); e.wy = Math.round(y / 2); }
      bands.set(band, e);
    }
  }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${bad} px over 12/255`);
for (const [band, e] of [...bands].sort((p, q) => q[1].n - p[1].n).slice(0, 14))
  console.log(`  y ${band}-${band + 31}: ${e.n} px, worst ${e.worst} at ${e.wx},${e.wy}`);
