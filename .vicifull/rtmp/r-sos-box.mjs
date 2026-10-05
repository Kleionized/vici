/* Signed per-channel mean difference (design − app) inside a frame-pt box, plus
   point samples. Excludes nothing inside the box. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, box, ...pts] = process.argv;
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const S = 2;
const [x0,y0,x1,y1] = box.split(',').map(Number);
let s=[0,0,0], n=0, mx=0, mxAt=null;
for (let y=Math.round(y0*S); y<Math.round(y1*S); y++) for (let x=Math.round(x0*S); x<Math.round(x1*S); x++) {
  const ia=(A.width*y+x)<<2, ib=(B.width*y+x)<<2;
  for (let c=0;c<3;c++) s[c]+=A.data[ia+c]-B.data[ib+c];
  const d=Math.max(...[0,1,2].map(c=>Math.abs(A.data[ia+c]-B.data[ib+c])));
  if(d>mx){mx=d;mxAt=[x/S,y/S];}
  n++;
}
console.log(`box ${box}: signed mean (design−app) R ${(s[0]/n).toFixed(2)} G ${(s[1]/n).toFixed(2)} B ${(s[2]/n).toFixed(2)}  max ${mx} at ${mxAt}`);
const px=(I,x,y)=>{const i=(I.width*Math.round(y*S)+Math.round(x*S))<<2;return [I.data[i],I.data[i+1],I.data[i+2]];};
for (const p of pts){const [x,y]=p.split(',').map(Number);const pa=px(A,x,y),pb=px(B,x,y);
 console.log(`  ${p.padEnd(9)} design ${pa.join(',').padEnd(13)} app ${pb.join(',').padEnd(13)} Δ ${Math.max(...pa.map((v,i)=>Math.abs(v-pb[i])))}`);}
