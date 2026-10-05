import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,y,x0,x1,step=4]=process.argv; const S=2;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
for(let x=Number(x0);x<Number(x1);x+=Number(step)){
  const i=(A.width*(Number(y)*S)+x*S)<<2,j=(B.width*(Number(y)*S)+x*S)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  console.log(`x ${x}  design ${A.data[i]},${A.data[i+1]},${A.data[i+2]}  app ${B.data[j]},${B.data[j+1]},${B.data[j+2]}  Δ${d}`);
}
