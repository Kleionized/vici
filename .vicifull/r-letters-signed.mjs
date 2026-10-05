/* signed per-channel mean over a css rect, both images. Excludes nothing inside the rect. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,x0,y0,x1,y1]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const X0=Number(x0)*2,Y0=Number(y0)*2,X1=Number(x1)*2,Y1=Number(y1)*2;
const sa=[0,0,0],sb=[0,0,0]; let n=0; const hist=new Map();
for(let y=Y0;y<Y1;y++)for(let x=X0;x<X1;x++){for(let c=0;c<3;c++){sa[c]+=at(A,x,y,c);sb[c]+=at(B,x,y,c);}n++;
  const d=at(A,x,y,0)-at(B,x,y,0); hist.set(d,(hist.get(d)||0)+1);}
console.log(`rect css ${x0},${y0} - ${x1},${y1}  ${n} px`);
console.log(' design mean rgb', sa.map(v=>(v/n).toFixed(2)).join(' '));
console.log(' app    mean rgb', sb.map(v=>(v/n).toFixed(2)).join(' '));
console.log(' signed  d  rgb', sa.map((v,i)=>((v-sb[i])/n).toFixed(3)).join(' '));
const ks=[...hist.keys()].sort((p,q)=>p-q);
console.log(' R-channel signed delta histogram:', ks.map(k=>`${k}:${hist.get(k)}`).join(' '));
