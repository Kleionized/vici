import fs from 'node:fs'; import { PNG } from 'pngjs';
const [src, out, X, Y, W, H, Sarg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(src));
const S = Number(Sarg ?? 1);
const x0 = Math.round(Number(X)*2), y0 = Math.round(Number(Y)*2), w = Math.round(Number(W)*2), h = Math.round(Number(H)*2);
const o = new PNG({ width: w*S, height: h*S });
for (let y = 0; y < h*S; y++) for (let x = 0; x < w*S; x++) {
  const sx = x0 + Math.floor(x/S), sy = y0 + Math.floor(y/S);
  for (let c = 0; c < 4; c++) o.data[(y*o.width+x)*4+c] = A.data[(sy*A.width+sx)*4+c];
}
fs.writeFileSync(out, PNG.sync.write(o));
