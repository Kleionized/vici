/* raw pixel rows: print design vs app RGB along a css row, at given x samples.
   EXCLUDES nothing. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,yArg,x0Arg,x1Arg,stepArg] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const y=Math.round(Number(yArg)*2);
const px=(P,x)=>[0,1,2].map(c=>P.data[(y*P.width+x)*4+c]);
for(let x=Number(x0Arg)*2;x<=Number(x1Arg)*2;x+=Number(stepArg??8)){
  const d=px(A,x), p=px(B,x);
  const dd=Math.max(...d.map((v,i)=>Math.abs(v-p[i])));
  console.log(`css x ${(x/2).toFixed(1)}  design ${d.join(',')}  app ${p.join(',')}  Δ${dd}`);
}
