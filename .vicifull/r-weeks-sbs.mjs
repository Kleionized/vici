/* Side-by-side crop: design left, app right, with a 4px divider. CSS coords. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a, b, out, X, Y, W, H, Sarg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const S = Number(Sarg ?? 1);
const x0 = Math.round(Number(X)*2), y0 = Math.round(Number(Y)*2), w = Math.round(Number(W)*2), h = Math.round(Number(H)*2);
const gap = 8;
const o = new PNG({ width: w*S*2 + gap, height: h*S });
o.data.fill(255);
for (const [P, ox] of [[A,0],[B,w*S+gap]])
  for (let y = 0; y < h*S; y++) for (let x = 0; x < w*S; x++) {
    const sx = x0 + Math.floor(x/S), sy = y0 + Math.floor(y/S);
    for (let c = 0; c < 4; c++) o.data[(y*o.width+x+ox)*4+c] = P.data[(sy*P.width+sx)*4+c];
  }
for (let y = 0; y < h*S; y++) for (let x = w*S; x < w*S+gap; x++) { o.data[(y*o.width+x)*4]=255; o.data[(y*o.width+x)*4+1]=0; o.data[(y*o.width+x)*4+2]=0; o.data[(y*o.width+x)*4+3]=255; }
fs.writeFileSync(out, PNG.sync.write(o));
