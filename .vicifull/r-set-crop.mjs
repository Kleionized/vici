/* Side-by-side crop of the same CSS box from two captures, design left, app right,
   with a 6px divider. Args: a.png b.png x y w h out.png   (CSS units) */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, X, Y, W, H, out] = process.argv.slice(2);
const x = Number(X) * 2, y = Number(Y) * 2, w = Number(W) * 2, h = Number(H) * 2;
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const D = new PNG({ width: w * 2 + 12, height: h });
for (let j = 0; j < h; j++) for (let i = 0; i < w * 2 + 12; i++) {
  const k = (j * D.width + i) << 2;
  let src = null, si = 0;
  if (i < w) { src = A; si = i; } else if (i >= w + 12) { src = B; si = i - w - 12; }
  if (!src) { D.data[k] = 255; D.data[k+1] = 0; D.data[k+2] = 0; D.data[k+3] = 255; continue; }
  const sk = ((y + j) * src.width + (x + si)) << 2;
  D.data[k] = src.data[sk]; D.data[k+1] = src.data[sk+1]; D.data[k+2] = src.data[sk+2]; D.data[k+3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(D));
console.log(out, D.width + 'x' + D.height);
