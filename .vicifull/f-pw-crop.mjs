/* GROUP paywall — crop a region of a capture and magnify it, for reading a
   detail the block diff can only give a number for.

   node .vicifull/f-pw-crop.mjs <in.png> <out.png> <cssX> <cssY> <cssW> <cssH> [scale]

   Coordinates are CSS points in the frame's own 393 x 852; the captures are at
   deviceScaleFactor 2, so the crop is taken at 2x and then nearest-neighbour
   magnified by `scale` — nearest, not smoothed, so an antialiased edge stays
   the shape it actually is. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [src,out,x,y,w,h,scale] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(src));
const S = Number(scale||1);
const X=Number(x)*2, Y=Number(y)*2, W=Number(w)*2, H=Number(h)*2;
const o = new PNG({width:W*S, height:H*S});
for (let j=0;j<H*S;j++) for (let i=0;i<W*S;i++) { const si=X+Math.floor(i/S), sj=Y+Math.floor(j/S);
  for (let c=0;c<4;c++) o.data[(j*W*S+i)*4+c] = P.data[(sj*P.width+si)*4+c]; }
fs.writeFileSync(out, PNG.sync.write(o));
