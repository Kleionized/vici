import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,thr=4]=process.argv; const S=2;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const bins=new Map();
for(let y=0;y<A.height;y++)for(let x=0;x<A.width;x++){
  if(x>=46*S&&x<=362*S&&y>=22*S&&y<=38*S)continue;
  const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  if(d>=Number(thr)){const k=`${Math.floor(x/S/20)*20},${Math.floor(y/S/20)*20}`;const t=bins.get(k)??{c:0,mx:0};t.c++;if(d>t.mx)t.mx=d;bins.set(k,t);} }
for(const [k,t] of [...bins.entries()].sort((p,q)=>q[1].c-p[1].c).slice(0,14)) console.log(`  ${k}  px ${t.c}  max ${t.mx}`);
console.log(`total bins ${bins.size}`);
