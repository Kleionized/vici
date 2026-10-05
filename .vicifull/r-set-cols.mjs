/* Count blocks >= thr in each of several named CSS x-bands. Excludes device rows 0..107. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,thrArg,...bands] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height),S=8,thr=Number(thrArg??4);
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const bs=bands.map(s=>{const [n,x0,x1]=s.split(':');return {n,x0:Number(x0)*2,x1:Number(x1)*2,c:0,max:0}});
let other=0,omax=0,otot=0;
for(let by=108;by+S<=H;by+=S)for(let bx=0;bx+S<=W;bx+=S){
  const m=[0,0,0],q=[0,0,0];
  for(let y=by;y<by+S;y++)for(let x=bx;x<bx+S;x++)for(let c=0;c<3;c++){m[c]+=at(A,x,y,c);q[c]+=at(B,x,y,c);}
  let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(m[c]-q[c])/(S*S));
  if(d<thr)continue; otot++;
  const hit=bs.find(v=>bx>=v.x0&&bx+S<=v.x1);
  if(hit){hit.c++;hit.max=Math.max(hit.max,d);} else {other++;omax=Math.max(omax,d);console.log(`  OUTSIDE css ${bx/2},${by/2} Δ${d.toFixed(1)}`);}
}
for(const v of bs)console.log(`${v.n} (css x ${v.x0/2}..${v.x1/2}): ${v.c} blocks, worst ${v.max.toFixed(1)}`);
console.log(`outside all bands: ${other} blocks, worst ${omax.toFixed(1)}   TOTAL ${otot}`);
