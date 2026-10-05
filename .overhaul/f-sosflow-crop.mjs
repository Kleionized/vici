// node .overhaul/f-sosflow-crop.mjs in.png out.png x y w h [scale] — crop device pixels, nearest-neighbour upscale
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [inp, out, X, Y, W, H, S = '3'] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(inp));
const [x, y, w, h, s] = [X, Y, W, H, S].map(Number);
const dst = new PNG({ width: w * s, height: h * s });
for (let j = 0; j < h * s; j++) for (let i = 0; i < w * s; i++) {
  const si = ((y + Math.floor(j / s)) * src.width + (x + Math.floor(i / s))) * 4, di = (j * w * s + i) * 4;
  for (let k = 0; k < 4; k++) dst.data[di + k] = src.data[si + k] ?? 0;
}
fs.writeFileSync(out, PNG.sync.write(dst));
console.log('crop ->', out);
