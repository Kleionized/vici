/* Grain autocorrelation at the tile lag (F47 rule 3), plus amplitude.
   Rows are high-passed (row mean removed via a 9px moving average) so the
   field gradient does not dominate. Region is stated on the command line;
   nothing inside it is excluded.
   node grain.mjs png x0 y0 x1 y1 [lag=96] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, ...a] = process.argv.slice(2);
const [x0,y0,x1,y1] = a.slice(0,4).map(Number); const lag = Number(a[4] ?? 96);
const P = PNG.sync.read(fs.readFileSync(f));
const g = (x,y)=>P.data[((y*2)*P.width + x*2)*4];
let num=0, den=0, ss=0, n=0, flips=0, mean=0;
for (let y=y0; y<y1; y++) {
  const row=[]; for (let x=x0; x<x1; x++) row.push(g(x,y));
  const hp = row.map((v,i)=>{ let s=0,c=0; for(let k=-4;k<=4;k++){const j=i+k; if(j>=0&&j<row.length){s+=row[j];c++;} } return v - s/c; });
  for (let i=0;i<hp.length;i++){ ss+=hp[i]*hp[i]; n++; mean+=row[i]; if(i&&Math.sign(hp[i])!==Math.sign(hp[i-1])) flips++; }
  for (let i=0;i+lag<hp.length;i++){ num+=hp[i]*hp[i+lag]; }
  for (let i=0;i+lag<hp.length;i++){ den+=hp[i]*hp[i]; }
}
console.log(`${f.split('/').pop().padEnd(22)} rms ${Math.sqrt(ss/n).toFixed(3)}  mean ${(mean/n).toFixed(2)}  autocorr@${lag} ${(num/den).toFixed(3)}  flips/row ${(flips/(y1-y0)).toFixed(1)}`);
