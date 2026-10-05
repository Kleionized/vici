import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,x,y0,y1]=process.argv; const S=2;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
for(let y=Number(y0);y<Number(y1);y++){const i=(A.width*(y*S)+Number(x)*S)<<2,j=(B.width*(y*S)+Number(x)*S)<<2;
const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
console.log(`y ${y} design ${A.data[i]},${A.data[i+1]},${A.data[i+2]} app ${B.data[j]},${B.data[j+1]},${B.data[j+2]} Δ${d}`);}
