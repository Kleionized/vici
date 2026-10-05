/* Raw per-pixel max-channel difference over a css rect. Excludes NOTHING inside
   the rect — no flatness test, no gradient skip. Defaults to the whole frame
   below css y 54, which is the status-bar chrome the app never draws (D009).
   usage: node f-funnel-rawpx.mjs a.png b.png [x0 y0 x1 y1] [thr] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...rest] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const nums = rest.map(Number);
const [x0, y0, x1, y1] = nums.length >= 4 ? nums : [0, 54, 393, 852];
const thr = nums.length >= 5 ? nums[4] : (nums.length === 1 ? nums[0] : 8);
let n = 0, worst = 0, sum = 0, tot = 0, wx = 0, wy = 0;
for (let y = y0 * 2; y < y1 * 2 && y < Math.min(A.height, B.height); y++)
  for (let x = x0 * 2; x < x1 * 2 && x < Math.min(A.width, B.width); x++) {
    let d = 0;
    for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(A.data[(y * A.width + x) * 4 + c] - B.data[(y * B.width + x) * 4 + c]));
    tot++; sum += d;
    if (d > worst) { worst = d; wx = x / 2; wy = y / 2; }
    if (d >= thr) n++;
  }
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()} css [${x0},${y0}..${x1},${y1}]: ${n} device px >= ${thr}/255 of ${tot}, mean ${(sum / tot).toFixed(3)}, worst ${worst} at css ${wx},${wy}`);
