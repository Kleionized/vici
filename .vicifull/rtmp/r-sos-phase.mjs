/* High-pass both rasters (subtract an 11x11 box mean) inside a region, then find
   the shift that maximises normalised correlation. Isolates the grain from the
   smooth gradient beneath it. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, box, rng] = process.argv;
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const S=2, R=Number(rng??120);
const [x0,y0,x1,y1]=box.split(',').map(Number);
const X0=Math.round(x0*S), Y0=Math.round(y0*S), X1=Math.round(x1*S), Y1=Math.round(y1*S);
const K=5;
function hp(P){
  const w=P.width,h=P.height;
  const out=new Float32Array(w*h);
  const lum=new Float32Array(w*h);
  for(let i=0;i<w*h;i++){const j=i<<2;lum[i]=0.299*P.data[j]+0.587*P.data[j+1]+0.114*P.data[j+2];}
  for(let y=Y0-R-K;y<Y1+R+K;y++)for(let x=X0-R-K;x<X1+R+K;x++){
    if(x<K||y<K||x>=w-K||y>=h-K) continue;
    let s=0,n=0;
    for(let dy=-K;dy<=K;dy++)for(let dx=-K;dx<=K;dx++){s+=lum[(y+dy)*w+x+dx];n++;}
    out[y*w+x]=lum[y*w+x]-s/n;
  }
  return out;
}
const HA=hp(A), HB=hp(B);
let best=null, zero=null;
for(let dy=-R;dy<=R;dy+=1)for(let dx=-R;dx<=R;dx+=1){
  let sab=0,saa=0,sbb=0;
  for(let y=Y0;y<Y1;y+=2)for(let x=X0;x<X1;x+=2){
    const va=HA[y*A.width+x], vb=HB[(y+dy)*B.width+x+dx];
    sab+=va*vb; saa+=va*va; sbb+=vb*vb;
  }
  const c=sab/Math.sqrt(saa*sbb||1);
  if(!best||c>best.c) best={dx,dy,c};
  if(dx===0&&dy===0) zero=c;
}
console.log(`box ${box}: best corr ${best.c.toFixed(3)} at device shift dx ${best.dx} dy ${best.dy} (= ${best.dx/2} , ${best.dy/2} CSS pt); corr at 0,0 = ${zero.toFixed(3)}`);
