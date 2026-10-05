import fs from 'node:fs';
import { PNG } from 'pngjs';
const [src, out, x, y, w, h] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(src));
const X = Number(x) * 2, Y = Number(y) * 2, W = Number(w) * 2, H = Number(h) * 2;
const S = 4; // upscale
const P = new PNG({ width: W * S, height: H * S });
for (let j = 0; j < H * S; j++) for (let i = 0; i < W * S; i++) {
  const sx = X + Math.floor(i / S), sy = Y + Math.floor(j / S);
  for (let c = 0; c < 4; c++) P.data[(j * W * S + i) * 4 + c] = A.data[(sy * A.width + sx) * 4 + c];
}
fs.writeFileSync(out, PNG.sync.write(P));
console.log('->', out);
