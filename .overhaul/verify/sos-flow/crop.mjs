// crop.mjs in.png out.png x y w h [scale]   (frame pt, dpr 2)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [i, o, x, y, w, h, s = 2] = process.argv.slice(2);
const I = PNG.sync.read(fs.readFileSync(i)); const S = Number(s);
const O = new PNG({ width: w * 2 * S / 2 | 0, height: h * 2 * S / 2 | 0 });
for (let yy = 0; yy < O.height; yy++) for (let xx = 0; xx < O.width; xx++) {
  const sx = Math.floor(x * 2 + xx * 2 / S), sy = Math.floor(y * 2 + yy * 2 / S);
  const k = (I.width * sy + sx) << 2, kk = (O.width * yy + xx) << 2;
  for (let c = 0; c < 4; c++) O.data[kk + c] = I.data[k + c];
}
fs.writeFileSync(o, PNG.sync.write(O)); console.log('crop ->', o, O.width, O.height);
