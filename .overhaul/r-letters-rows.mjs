/* per-device-row ink count over a css x-range, both images, and the rows whose
   counts differ by more than a threshold. Ink = pixel darker than `cut`.
   EXCLUDES nothing inside the stated band. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,x0,x1,y0,y1,cutArg,thrArg]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const at=(P,x,y)=>P.data[(y*P.width+x)*4];
const X0=Number(x0)*2,X1=Number(x1)*2,cut=Number(cutArg??170),thr=Number(thrArg??4);
let bad=0, tot=0, firstA=null, firstB=null;
const diffs=[];
for(let y=Number(y0)*2;y<Number(y1)*2;y++){
  let ca=0,cb=0;
  for(let x=X0;x<X1;x++){ if(at(A,x,y)<cut)ca++; if(at(B,x,y)<cut)cb++; }
  tot++;
  if(ca>0&&firstA===null)firstA=y/2; if(cb>0&&firstB===null)firstB=y/2;
  if(Math.abs(ca-cb)>thr){bad++;diffs.push([y/2,ca,cb]);}
}
console.log(`${tot} device rows in css ${y0}..${y1}, ink cut <${cut}: ${bad} rows differ by >${thr} px`);
console.log(` first ink row: design ${firstA}  app ${firstB}`);
for(const [y,ca,cb] of diffs.slice(0,30)) console.log(`   y ${y}  design ${ca}  app ${cb}`);
