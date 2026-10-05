/* GROUP day (verify): design | app side by side, optionally cropped. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, out, x = 0, y = 0, w = 393, h = 852, scale = 1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const S = Number(scale), W = Math.round(Number(w) * 2 * S), H = Math.round(Number(h) * 2 * S);
const G = 12;
const o = new PNG({ width: W * 2 + G, height: H });
const put = (src, ox) => {
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
    const sx = Math.round(Number(x) * 2 + xx / S), sy = Math.round(Number(y) * 2 + yy / S);
    const i = (src.width * sy + sx) << 2, j = (o.width * yy + xx + ox) << 2;
    o.data[j] = src.data[i]; o.data[j+1] = src.data[i+1]; o.data[j+2] = src.data[i+2]; o.data[j+3] = 255;
  }
};
put(A, 0); put(B, W + G);
for (let yy = 0; yy < H; yy++) for (let xx = W; xx < W + G; xx++) { const j = (o.width * yy + xx) << 2; o.data[j]=255;o.data[j+1]=0;o.data[j+2]=0;o.data[j+3]=255; }
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out);
