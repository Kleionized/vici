import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,yy,x0,x1,step] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)); const B = PNG.sync.read(fs.readFileSync(b));
const y=Math.round(Number(yy)*2);
for(let x=Number(x0);x<=Number(x1);x+=Number(step??2)){const X=Math.round(x*2);const i=(y*A.width+X)*4,j=(y*B.width+X)*4;
const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
console.log(x, `${A.data[i]},${A.data[i+1]},${A.data[i+2]}`, '|', `${B.data[j]},${B.data[j+1]},${B.data[j+2]}`, ' Δ'+d);}
