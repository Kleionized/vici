/* Best integer device-pixel shift (dx,dy) of the app raster against the design
   inside a box, by minimising SAD over a search window. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, box, rng] = process.argv;
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const S=2, R=Number(rng??12);
const [x0,y0,x1,y1]=box.split(',').map(Number);
let best=null;
for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){
  let s=0,n=0;
  for(let y=Math.round(y0*S);y<Math.round(y1*S);y+=2)for(let x=Math.round(x0*S);x<Math.round(x1*S);x+=2){
    const i=(A.width*y+x)<<2, j=(B.width*(y+dy)+(x+dx))<<2;
    if(j<0||j>=B.data.length) continue;
    s+=Math.abs(A.data[i]-B.data[j])+Math.abs(A.data[i+1]-B.data[j+1])+Math.abs(A.data[i+2]-B.data[j+2]); n+=3;
  }
  const m=s/n;
  if(!best||m<best.m) best={dx,dy,m};
  if(dx===0&&dy===0) var zero=m;
}
console.log(`box ${box}: best shift dx ${best.dx} dy ${best.dy} device px (mean|Δ| ${best.m.toFixed(2)}), at 0,0 mean|Δ| ${zero.toFixed(2)}`);
