/* high-pass rms + zero-crossing rate along a css row band, design vs app.
   Detects a missing or smeared grain overlay (FINDINGS F31). Excludes nothing. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,y0,y1,x0,x1]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
function stat(P){ let s=0,n=0,f=0;
  for(let y=Number(y0)*2;y<Number(y1)*2;y++){ let prev=null;
    for(let x=Number(x0)*2;x+1<Number(x1)*2;x++){
      const v=P.data[(y*P.width+x)*4], w=P.data[(y*P.width+x+1)*4];
      const d=w-v; s+=d*d; n++; if(prev!==null && Math.sign(d)!==Math.sign(prev) && d!==0) f++; prev=d; } }
  return {rms:Math.sqrt(s/n).toFixed(3), flips:(f/((Number(y1)-Number(y0))*2)).toFixed(1)}; }
const d=stat(A),p=stat(B);
console.log(`design rms ${d.rms} flips/row ${d.flips}   app rms ${p.rms} flips/row ${p.flips}`);
