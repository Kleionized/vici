/* Find the flattest 48x48 frame-coordinate windows in an image (lowest range
   after removing the grain's own high frequency): a paper region with no ink.
   Usage: node r-slip-flat.mjs img.png */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const P=PNG.sync.read(fs.readFileSync(process.argv[2]));
const s=P.width/393;const W=48;
const g=(x,y)=>{const i=(y*P.width+x)*4;return (P.data[i]+P.data[i+1]+P.data[i+2])/3;};
const out=[];
for(let fy=60;fy+W<852;fy+=24)for(let fx=0;fx+W<393;fx+=24){
 let mn=999,mx=-1,sum=0,n=0;
 for(let y=Math.round(fy*s);y<Math.round((fy+W)*s);y+=2)for(let x=Math.round(fx*s);x<Math.round((fx+W)*s);x+=2){
  const v=g(x,y);mn=Math.min(mn,v);mx=Math.max(mx,v);sum+=v;n++;}
 out.push([mx-mn,fx,fy,(sum/n).toFixed(1)]);}
out.sort((a,b)=>a[0]-b[0]);
for(const [r,x,y,m] of out.slice(0,10))console.log(`  range ${r.toFixed(1)} mean ${m} at frame ${x},${y} 48x48`);
