/* row-averaged horizontal profile of both images over a css y-range. Excludes nothing. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,y0,y1,x0,x1]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const Y0=Number(y0)*2,Y1=Number(y1)*2;
for(let cx=Number(x0);cx<Number(x1);cx+=1){
  let sa=0,sb=0,n=0;
  for(let x=cx*2;x<cx*2+2;x++) for(let y=Y0;y<Y1;y++){sa+=at(A,x,y,0);sb+=at(B,x,y,0);n++;}
  console.log(`x ${cx}  design ${(sa/n).toFixed(2)}  app ${(sb/n).toFixed(2)}  d ${((sa-sb)/n).toFixed(2)}`);
}
