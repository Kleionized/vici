import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,thr=20] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const cells={};
for(let y=54*2;y<A.height;y++)for(let x=0;x<A.width;x++){
  const i=(A.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  if(d>Number(thr)){const k=`${Math.floor(x/2/20)*20},${Math.floor(y/2/20)*20}`;cells[k]=cells[k]||{n:0,max:0};cells[k].n++;if(d>cells[k].max)cells[k].max=d;}
}
const rows=Object.entries(cells).sort((p,q)=>q[1].n-p[1].n).slice(0,25);
for(const [k,v] of rows) console.log(`cell x,y=${k}  n=${v.n} max=${v.max}`);
