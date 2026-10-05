/* Grain statistics inside one frame rectangle, computed on each image
   separately (no cross-image exclusion at all). High-passes with a 9x9 box
   mean, then reports rms, sign flips per row, and the row autocorrelation at
   the 96 CSS px tile lag — F47's test for "does it tile at the file's own
   size" rather than an eyeball.
   Usage: node r-slip-grain.mjs img.png x y w h */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f,X,Y,W,H]=process.argv.slice(2);
const P=PNG.sync.read(fs.readFileSync(f));
const s=P.width/393;
const x0=Math.round(X*s),y0=Math.round(Y*s),w=Math.round(W*s),h=Math.round(H*s);
const g=(x,y)=>{const i=(y*P.width+x)*4;return (P.data[i]+P.data[i+1]+P.data[i+2])/3;};
const hp=[];const K=4;
for(let y=0;y<h;y++){const row=[];for(let x=0;x<w;x++){
 let sum=0,n=0;
 for(let dy=-K;dy<=K;dy++)for(let dx=-K;dx<=K;dx++){
  const yy=y0+y+dy,xx=x0+x+dx;
  if(yy<0||xx<0||yy>=P.height||xx>=P.width)continue;sum+=g(xx,yy);n++;}
 row.push(g(x0+x,y0+y)-sum/n);}hp.push(row);}
let sq=0,n=0,flips=0;
for(const row of hp){for(let x=0;x<row.length;x++){sq+=row[x]*row[x];n++;
 if(x&&Math.sign(row[x])!==Math.sign(row[x-1]))flips++;}}
const lag=Math.round(96*s);
let num=0,d1=0,d2=0;
for(const row of hp)for(let x=0;x+lag<row.length;x++){num+=row[x]*row[x+lag];d1+=row[x]*row[x];d2+=row[x+lag]*row[x+lag];}
let num1=0,e1=0,e2=0;
for(const row of hp)for(let x=0;x+1<row.length;x++){num1+=row[x]*row[x+1];e1+=row[x]*row[x];e2+=row[x+1]*row[x+1];}
console.log(`${f.split('/').pop()} rect ${X},${Y} ${W}x${H} (${w}x${h} device px): hp rms ${Math.sqrt(sq/n).toFixed(3)}, flips/row ${(flips/hp.length).toFixed(1)}, autocorr@lag1 ${(num1/Math.sqrt(e1*e2)).toFixed(3)}, autocorr@${lag}px(96pt tile) ${(num/Math.sqrt(d1*d2)).toFixed(3)}`);
