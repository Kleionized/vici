import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , src, out, x0, y0, w, h, z = 3] = process.argv;
const a = PNG.sync.read(fs.readFileSync(src));
const X = Number(x0)*2, Y = Number(y0)*2, W = Number(w)*2, H = Number(h)*2, Z = Number(z);
const o = new PNG({ width: W*Z, height: H*Z });
for (let y = 0; y < H*Z; y++) for (let x = 0; x < W*Z; x++) {
  const si = (((Y + Math.floor(y/Z)) * a.width) + (X + Math.floor(x/Z))) * 4;
  const di = (y * W*Z + x) * 4;
  o.data[di] = a.data[si]; o.data[di+1] = a.data[si+1]; o.data[di+2] = a.data[si+2]; o.data[di+3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(o));
