import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, y0, y1, x0=0, x1=393] = process.argv;
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const S=2; let sum=0,n=0,max=0,at=null;
for (let y=Number(y0)*S;y<Number(y1)*S;y++) for (let x=Number(x0)*S;x<Number(x1)*S;x++){
  const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  sum+=d;n++; if(d>max){max=d;at=[x/S,y/S];}
}
console.log(`y ${y0}-${y1} x ${x0}-${x1}: mean ${(sum/n).toFixed(3)} max ${max} at ${at&&at.map(v=>v.toFixed(0)).join(',')}`);
