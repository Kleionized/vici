/* print a device-pixel column, design vs app, over a device-row range. Excludes nothing. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,xArg,y0,y1]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const x=Number(xArg);
for(let y=Number(y0);y<=Number(y1);y++){
  const d=[0,1,2].map(c=>A.data[(y*A.width+x)*4+c]), p=[0,1,2].map(c=>B.data[(y*B.width+x)*4+c]);
  console.log(`dev y ${y} (css ${(y/2).toFixed(1)})  design ${d.join(',')}  app ${p.join(',')}  Δ${Math.max(...d.map((v,i)=>Math.abs(v-p[i])))}`);
}
