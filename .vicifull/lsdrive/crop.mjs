import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, src, out, x, y, w, h, scale] = process.argv;
const A = PNG.sync.read(fs.readFileSync(src));
const S = Number(scale ?? 4), X = Number(x)*2, Y = Number(y)*2, W = Number(w)*2, H = Number(h)*2;
const o = new PNG({ width: W*S, height: H*S });
for (let j=0;j<H*S;j++) for (let i=0;i<W*S;i++){
  const si = ((Y + Math.floor(j/S)) * A.width + (X + Math.floor(i/S)))*4;
  const di = (j*W*S+i)*4;
  o.data[di]=A.data[si]; o.data[di+1]=A.data[si+1]; o.data[di+2]=A.data[si+2]; o.data[di+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(o));
