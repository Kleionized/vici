/* Print a vertical (or horizontal) run of pixels from two PNGs side by side, in frame points. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , a, b, mode, fixed, from, to] = process.argv;
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const px = (P, x, y) => { const i = (Math.round(y*2) * P.width + Math.round(x*2)) * 4; return `${P.data[i]},${P.data[i+1]},${P.data[i+2]}`; };
for (let v = Number(from); v <= Number(to); v += 0.5) {
  const x = mode === 'col' ? Number(fixed) : v, y = mode === 'col' ? v : Number(fixed);
  console.log(`${mode === 'col' ? 'y' : 'x'}=${v}  design ${px(A,x,y).padEnd(13)} app ${px(B,x,y)}`);
}
