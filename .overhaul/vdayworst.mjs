import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,x0,y0,x1,y1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const l = [];
for (let y=Number(y0)*2;y<Number(y1)*2;y++) for (let x=Number(x0)*2;x<Number(x1)*2;x++){
  const i=(A.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  if(d>3) l.push([d,x/2,y/2,[A.data[i],A.data[i+1],A.data[i+2]].join(','),[B.data[i],B.data[i+1],B.data[i+2]].join(',')]);
}
l.sort((p,q)=>q[0]-p[0]);
for (const r of l.slice(0,10)) console.log('d'+r[0], r[1]+','+r[2], 'design '+r[3], 'app '+r[4]);
console.log('n>3 =', l.length);
