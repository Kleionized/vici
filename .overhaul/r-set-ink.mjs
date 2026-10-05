/* Ink bounding box + per-column ink mass inside a CSS box, for each image.
   "Ink" = any pixel darker than `thr` on the green channel. No exclusions. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, X, Y, W, H, T] = process.argv.slice(2);
const x0 = Number(X)*2, y0 = Number(Y)*2, w = Number(W)*2, h = Number(H)*2, thr = Number(T ?? 140);
for (const f of [a, b]) {
  const p = PNG.sync.read(fs.readFileSync(f));
  let minx=1e9,maxx=-1,miny=1e9,maxy=-1,mass=0;
  for (let j=y0;j<y0+h;j++) for (let i=x0;i<x0+w;i++){
    const k=((j*p.width)+i)<<2;
    const v=p.data[k+1];
    if (v<thr){ mass += (thr-v); minx=Math.min(minx,i);maxx=Math.max(maxx,i);miny=Math.min(miny,j);maxy=Math.max(maxy,j); }
  }
  console.log(`${f.split('/').pop()}  ink css x ${minx/2}..${(maxx+1)/2} y ${miny/2}..${(maxy+1)/2}  w ${(maxx+1-minx)/2} h ${(maxy+1-miny)/2}  mass ${Math.round(mass)}`);
}
