import fs from 'node:fs'; import { PNG } from 'pngjs';
const [pa, pb, X0, Y0, X1, Y1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(pa)), B = PNG.sync.read(fs.readFileSync(pb));
const S=2;
const g=(im,x,y)=>{const o=(im.width*y+x)<<2; return Math.round((im.data[o]+im.data[o+1]+im.data[o+2])/3);};
for (let y=Number(Y0)*S; y<Number(Y1)*S; y++) {
  let ra='', rb='';
  for (let x=Number(X0)*S; x<Number(X1)*S; x++) { ra+=String(g(A,x,y)).padStart(4); rb+=String(g(B,x,y)).padStart(4); }
  console.log(`y${(y/S).toFixed(1).padStart(6)} D${ra}\n        A${rb}`);
}
