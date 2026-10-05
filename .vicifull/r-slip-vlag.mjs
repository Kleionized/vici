/* Vertical-only phase search over one frame rectangle: mean |d| between A and
   B shifted by dy device px. Nothing excluded inside the rectangle.
   Usage: node r-slip-vlag.mjs a.png b.png x y w h [maxdy] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,X,Y,W,H,L]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393,maxl=Number(L??200);
const x0=Math.round(X*s),y0=Math.round(Y*s),w=Math.round(W*s),h=Math.round(H*s);
const res=[];
for(let dy=-maxl;dy<=maxl;dy++){let sum=0,n=0;
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
  const yy=y+dy;if(yy<0||yy>=B.height)continue;
  const i=(y*A.width+x)*4,j=(yy*B.width+x)*4;
  let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(A.data[i+c]-B.data[j+c]));
  sum+=d;n++;}
 res.push([sum/n,dy]);}
const z=res.find(r=>r[1]===0);
res.sort((p,q)=>p[0]-q[0]);
console.log(`frame ${X},${Y} ${W}x${H}: best dy=${res[0][1]} mean|d| ${res[0][0].toFixed(3)}  |  dy=0 mean|d| ${z[0].toFixed(3)}`);
console.log('  next:',res.slice(1,5).map(([m,d])=>`dy=${d}:${m.toFixed(3)}`).join(' '));
