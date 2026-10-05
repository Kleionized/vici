import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, th] = process.argv;
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const S=2, T=Number(th??6), C=20;
const nx=Math.ceil(393/C), ny=Math.ceil((834-54)/C);
const g=new Int32Array(nx*ny);
for(let y=54*S;y<834*S;y++)for(let x=0;x<A.width;x++){
  const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  if(d>T) g[Math.floor((y/S-54)/C)*nx+Math.floor(x/S/C)]++;
}
const ch=' .:-=+*#%@';
for(let r=0;r<ny;r++){
  let line='';
  for(let c=0;c<nx;c++){const v=g[r*nx+c];line+= v===0?' ':ch[Math.min(9,1+Math.floor(Math.log2(v)))];}
  console.log(String(54+r*C).padStart(4)+' |'+line+'|');
}
console.log('     |'+Array.from({length:nx},(_,c)=>String(c*C/100|0)).join('')+'|  (x tick = hundreds)');
