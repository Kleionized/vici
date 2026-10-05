/* Magnify a region of a capture, in frame points, so a difference the numbers
   located can be looked at. usage: node vcrop.mjs <in.png> <out.png> x y w h [zoom] */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,inp,outp,X,Y,W,H,Z] = process.argv;
const z = Number(Z ?? 3), x0 = Number(X)*2, y0 = Number(Y)*2, w = Number(W)*2, h = Number(H)*2;
const A = PNG.sync.read(fs.readFileSync(inp));
const out = new PNG({ width: w*z, height: h*z });
for (let y = 0; y < h*z; y++) for (let x = 0; x < w*z; x++) {
  const sx = x0 + Math.floor(x/z), sy = y0 + Math.floor(y/z);
  const s = (sy*A.width+sx)*4, d = (y*out.width+x)*4;
  out.data[d]=A.data[s]; out.data[d+1]=A.data[s+1]; out.data[d+2]=A.data[s+2]; out.data[d+3]=255;
}
fs.writeFileSync(outp, PNG.sync.write(out));
