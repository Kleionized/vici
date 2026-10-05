/* Shift search over one frame rectangle: does translating the app image by
   (dx,dy) device px align it with the design? A grain whose TILE PHASE differs
   has a clear minimum away from (0,0); a grain that is MAGNIFIED (F31) has no
   shift that helps. No exclusions inside the rectangle.
   Usage: node r-slip-shift.mjs a.png b.png x y w h [range] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,X,Y,W,H,R]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393,rng=Number(R??12);
const x0=Math.round(X*s),y0=Math.round(Y*s),w=Math.round(W*s),h=Math.round(H*s);
const res=[];
for(let dy=-rng;dy<=rng;dy++)for(let dx=-rng;dx<=rng;dx++){
 let sum=0,n=0;
 for(let y=y0+rng;y<y0+h-rng;y++)for(let x=x0+rng;x<x0+w-rng;x++){
  const i=(y*A.width+x)*4,j=((y+dy)*B.width+(x+dx))*4;
  let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(A.data[i+c]-B.data[j+c]));
  sum+=d;n++;}
 res.push([sum/n,dx,dy]);}
res.sort((p,q)=>p[0]-q[0]);
const zero=res.find(r=>r[1]===0&&r[2]===0);
console.log(`best shifts (device px, mean |d| over frame ${X},${Y} ${W}x${H}):`);
for(const [m,dx,dy] of res.slice(0,6))console.log(`   dx=${dx} dy=${dy} : ${m.toFixed(3)}`);
console.log(`   dx=0 dy=0 : ${zero[0].toFixed(3)}`);
