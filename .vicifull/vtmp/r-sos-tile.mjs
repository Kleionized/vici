/* F47's method: prove a grain tiles at 96 css px by autocorrelating each row's
 * high-passed luminance at the 96-px lag. Reports rms (how much fine detail is
 * there) and the correlation at the tile lag (does it repeat at 96?). */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,path,y0,y1,x0,x1]=process.argv; const S=2, LAG=96*S;
const I=PNG.sync.read(fs.readFileSync(path));
let rmsSum=0,corrSum=0,flipSum=0,rows=0;
for(let y=Number(y0)*S;y<Number(y1)*S;y++){
  const a=[];
  for(let x=Number(x0)*S;x<Number(x1)*S;x++){const i=(I.width*y+x)<<2;a.push(0.299*I.data[i]+0.587*I.data[i+1]+0.114*I.data[i+2]);}
  // high-pass: subtract a 9-tap box
  const hp=a.map((v,i)=>{let s=0,n=0;for(let k=-4;k<=4;k++){const j=i+k;if(j>=0&&j<a.length){s+=a[j];n++;}}return v-s/n;});
  const m=hp.reduce((p,c)=>p+c,0)/hp.length;
  const d=hp.map(v=>v-m);
  const v0=d.reduce((p,c)=>p+c*c,0);
  if(v0<1e-6) continue;
  let c=0,n=0; for(let i=0;i+LAG<d.length;i++){c+=d[i]*d[i+LAG];n++;}
  let flips=0; for(let i=1;i<d.length;i++) if((d[i]>0)!==(d[i-1]>0)) flips++;
  rmsSum+=Math.sqrt(v0/d.length); corrSum+= n? c/ (v0*n/d.length) :0; flipSum+=flips; rows++;
}
console.log(`${path.split('/').pop()}  rows ${rows}  rms ${(rmsSum/rows).toFixed(3)}  corr@96 ${(corrSum/rows).toFixed(3)}  flips/row ${(flipSum/rows).toFixed(1)}`);
