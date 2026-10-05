import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
let n=0,s=0,w=0;
for(let y=0;y<108;y++)for(let x=0;x<A.width;x++){let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(A.data[(y*A.width+x)*4+c]-B.data[(y*B.width+x)*4+c]));n++;s+=d;w=Math.max(w,d);}
console.log(`top 54css rows: px ${n} mean ${(s/n).toFixed(3)} worst ${w}`);
