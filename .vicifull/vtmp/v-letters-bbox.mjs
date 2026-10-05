/* ink bbox of light pixels inside a window (for white marks on ink) */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [A,B,x0,x1,y0,y1,thrR] = process.argv.slice(2);
const thr=Number(thrR??170);
const b=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu']});
const p=await b.newPage();
const bb=async(f)=>{
 const s=fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
 return p.evaluate(async([s,x0,x1,y0,y1,thr])=>{
  const i=new Image();i.src='data:image/png;base64,'+s;await i.decode();
  const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);
  const d=g.getImageData(0,0,i.width,i.height);
  let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9,sum=0,n=0;
  for(let y=y0*2;y<y1*2;y++)for(let x=x0*2;x<x1*2;x++){const k=(y*i.width+x)*4;const v=(d.data[k]+d.data[k+1]+d.data[k+2])/3;
   if(v>thr){minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);n++;sum+=v;}}
  return {minx:minx/2,maxx:maxx/2,miny:miny/2,maxy:maxy/2,n,avg:Math.round(sum/n)};
 },[s,Number(x0),Number(x1),Number(y0),Number(y1),thr]);
};
console.log(A, JSON.stringify(await bb(A)));
console.log(B, JSON.stringify(await bb(B)));
await b.close();
