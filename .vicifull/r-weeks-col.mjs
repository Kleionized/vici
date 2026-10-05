import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,xArg,y0,y1] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const x=Math.round(Number(xArg)*2);
for(let y=Math.round(Number(y0)*2); y<=Math.round(Number(y1)*2); y++){
  const g=(P)=>[0,1,2].map(c=>P.data[(y*P.width+x)*4+c]).join(',');
  const d=Math.max(...[0,1,2].map(c=>Math.abs(A.data[(y*A.width+x)*4+c]-B.data[(y*B.width+x)*4+c])));
  console.log(`dev row ${y} (css ${(y/2).toFixed(1)}): design ${g(A)}  app ${g(B)}  Δ${d}`);
}
