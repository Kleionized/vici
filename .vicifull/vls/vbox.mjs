/* Differing pixels inside one box, in frame points, so a single layer's error
   can be separated from the rasteriser noise around the rest of the picture. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,X,Y,W,H,T] = process.argv; const thr = Number(T ?? 12);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
let bad=0, max=0, n=0;
for (let y=Math.round(Number(Y)*2); y<Math.round((Number(Y)+Number(H))*2); y++)
  for (let x=Math.round(Number(X)*2); x<Math.round((Number(X)+Number(W))*2); x++) {
    const i=(y*A.width+x)*4; n++;
    const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
    if(d>max)max=d; if(d>thr)bad++;
  }
console.log(`${bad}/${n} px over ${thr} in box (${X},${Y},${W},${H}); max delta ${max}`);
