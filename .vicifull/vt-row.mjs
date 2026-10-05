import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,yy,x0,x1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)); const B = PNG.sync.read(fs.readFileSync(b));
const y=Number(yy);
for(let x=Number(x0);x<=Number(x1);x++){const i=(y*A.width+x)*4,j=(y*B.width+x)*4;
console.log(x, `${A.data[i]},${A.data[i+1]},${A.data[i+2]}`, '|', `${B.data[j]},${B.data[j+1]},${B.data[j+2]}`);}
