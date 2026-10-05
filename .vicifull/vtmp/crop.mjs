import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, src, out, x, y, w, h] = process.argv;
const A = PNG.sync.read(fs.readFileSync(src));
const S = 2;
const X = Math.round(x*S), Y = Math.round(y*S), W = Math.round(w*S), H = Math.round(h*S);
const o = new PNG({ width: W, height: H });
for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
  const si = (A.width*(Y+j)+(X+i))<<2, di = (W*j+i)<<2;
  o.data[di]=A.data[si]; o.data[di+1]=A.data[si+1]; o.data[di+2]=A.data[si+2]; o.data[di+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(o));
