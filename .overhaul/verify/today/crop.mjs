// node crop.mjs in.png out.png x y w h [scale]  (CSS px at dpr 2)
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [i, o, x, y, w, h, s = '1'] = process.argv.slice(2);
const im = PNG.sync.read(fs.readFileSync(i));
const X = +x * 2, Y = +y * 2, Wd = +w * 2, Ht = +h * 2, S = +s;
const out = new PNG({ width: Wd * S, height: Ht * S });
for (let yy = 0; yy < Ht * S; yy++) for (let xx = 0; xx < Wd * S; xx++) {
  const sx = X + Math.floor(xx / S), sy = Y + Math.floor(yy / S);
  const si = (sy * im.width + sx) * 4, di = (yy * Wd * S + xx) * 4;
  for (let c = 0; c < 4; c++) out.data[di + c] = im.data[si + c] ?? 0;
}
fs.writeFileSync(o, PNG.sync.write(out));
