// px.mjs <a.png> <b.png> <x> <y> [w h]  — mean RGB of an x,y[,w,h] patch in EACH image,
// in DEVICE pixels. No exclusions of any kind: every pixel in the box is counted.
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...rest] = process.argv.slice(2);
const [x, y, w = 1, h = 1] = rest.map(Number);
function mean(f) {
  const p = PNG.sync.read(fs.readFileSync(f));
  let r = 0, g = 0, bl = 0, n = 0;
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
    const k = (p.width * j + i) << 2;
    r += p.data[k]; g += p.data[k + 1]; bl += p.data[k + 2]; n++;
  }
  return [r / n, g / n, bl / n].map((v) => Math.round(v));
}
const A = mean(a), B = mean(b);
console.log(`${x},${y} ${w}x${h}  design ${A.join(',')}   app ${B.join(',')}   Δ ${A.map((v, i) => Math.abs(v - B[i])).join(',')}`);
