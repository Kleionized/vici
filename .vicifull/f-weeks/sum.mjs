/* Whole-frame per-pixel accounting. Excludes ONLY the top 54 CSS rows (the
   status bar the app never builds, D009); nothing else — gradients, washes and
   shadow bands are all inside the compared region (F35). */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, boxArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const box = boxArg ? boxArg.split(',').map(Number) : null;
let n = 0, sum = 0, worst = 0, over8 = 0, over2 = 0;
for (let y = 108; y < H; y++) for (let x = 0; x < W; x++) {
  if (box) { const cx = x/2, cy = y/2; if (cx < box[0] || cy < box[1] || cx >= box[0]+box[2] || cy >= box[1]+box[3]) continue; }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(A.data[(y*A.width+x)*4+c] - B.data[(y*B.width+x)*4+c]));
  n++; sum += d; worst = Math.max(worst, d); if (d > 8) over8++; if (d > 2) over2++;
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}${box?' box '+boxArg:''}: px ${n}  meanΔ ${(sum/n).toFixed(4)}  worstΔ ${worst}  >2: ${over2}  >8: ${over8}`);
