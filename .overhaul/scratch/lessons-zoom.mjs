// node lessons-zoom.mjs <strip.png> x y w h scale out.png — design | app | diff crops of a pxdiff strip, enlarged
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, X, Y, Wd, Ht, S, out] = process.argv.slice(2);
const x0 = +X, y0 = +Y, w = +Wd, h = +Ht, s = +S;
const I = PNG.sync.read(fs.readFileSync(f));
const panel = Math.floor((I.width - 16) / 3);
const O = new PNG({ width: (w * s) * 3 + 16, height: h * s });
O.data.fill(255);
for (let p = 0; p < 3; p++) for (let y = 0; y < h * s; y++) for (let x = 0; x < w * s; x++) {
  const sx = p * (panel + 8) + x0 + Math.floor(x / s), sy = y0 + Math.floor(y / s);
  const k = (I.width * sy + sx) << 2, t = (O.width * y + p * (w * s + 8) + x) << 2;
  O.data[t] = I.data[k]; O.data[t + 1] = I.data[k + 1]; O.data[t + 2] = I.data[k + 2]; O.data[t + 3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(O));
