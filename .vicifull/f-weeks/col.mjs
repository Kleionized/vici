/* Print a column of device pixels from two PNGs side by side. args: A B cssX cssY0 cssY1 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, cx, y0, y1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const px = (P, x, y) => [0,1,2].map((c) => P.data[(y * P.width + x) * 4 + c]);
for (let dy = Math.round(Number(y0) * 2); dy <= Math.round(Number(y1) * 2); dy++) {
  const x = Math.round(Number(cx) * 2);
  const p = px(A, x, dy), q = px(B, x, dy);
  const d = Math.max(...[0,1,2].map((i) => Math.abs(p[i] - q[i])));
  console.log(`dev y ${dy} (css ${(dy/2).toFixed(1)})  design ${p.join(',')}   app ${q.join(',')}   d ${d}`);
}
