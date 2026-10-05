/* column-averaged vertical profile of both images over a css x-range. Excludes nothing. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,x0,x1,y0,y1]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const X0=Number(x0)*2,X1=Number(x1)*2;
for(let cy=Number(y0);cy<Number(y1);cy+=1){
  let sa=0,sb=0,n=0;
  for(let y=cy*2;y<cy*2+2;y++) for(let x=X0;x<X1;x++){sa+=at(A,x,y,0);sb+=at(B,x,y,0);n++;}
  const da=sa/n, db=sb/n;
  console.log(`y ${cy}  design ${da.toFixed(2)}  app ${db.toFixed(2)}  d ${(da-db).toFixed(2)}`);
}
