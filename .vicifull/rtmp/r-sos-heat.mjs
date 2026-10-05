import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, th] = process.argv;
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const S=2, T=Number(th??6);
const rows=[];
for(let by=54; by<834; by+=20){
  let c=0,s=0,mx=0;
  for(let y=by*S;y<Math.min((by+20)*S,834*S);y++)for(let x=0;x<A.width;x++){
    const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
    const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
    if(d>T){c++;s+=d;if(d>mx)mx=d;}
  }
  if(c) rows.push(`  y ${by}-${by+20}: px>${T} ${c}  mean ${(s/c).toFixed(1)}  max ${mx}`);
}
console.log(rows.join('\n'));
