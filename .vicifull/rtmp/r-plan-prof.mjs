/* Horizontal or vertical profile through two PNGs at canvas coords.
   usage: prof.mjs A.png B.png h|v fixed from to step  */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [A,B,dir,fixed,from,to,step] = process.argv.slice(2);
const a = PNG.sync.read(fs.readFileSync(A)), b = PNG.sync.read(fs.readFileSync(B));
const dev = a.width/393;
const mean=(p,X,Y)=>{const s=[0,0,0];let n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const x=Math.round(X*dev)+i,y=Math.round(Y*dev)+j;if(x<0||y<0||x>=p.width||y>=p.height)continue;const k=(y*p.width+x)*4;s[0]+=p.data[k];s[1]+=p.data[k+1];s[2]+=p.data[k+2];n++;}return s.map(v=>Math.round(v/n));};
for(let v=Number(from);v<=Number(to);v+=Number(step)){
  const x = dir==='h'? v : Number(fixed), y = dir==='h'? Number(fixed) : v;
  const P=mean(a,x,y),Q=mean(b,x,y);
  const d=Math.max(...P.map((z,i)=>Math.abs(z-Q[i])));
  console.log(`(${x},${y})`.padEnd(12),'design',P.join(',').padEnd(13),'app',Q.join(',').padEnd(13),'Δ'+d);
}
