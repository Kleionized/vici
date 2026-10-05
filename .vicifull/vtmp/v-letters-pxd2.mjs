import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [A,B,thrRaw,y0r,y1r] = process.argv.slice(2);
const thr=Number(thrRaw??12), Y0=Number(y0r??55), Y1=Number(y1r??852);
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu'] });
const p = await b.newPage();
const load=(f)=>fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
const out = await p.evaluate(async ([a64,b64,thr,Y0,Y1])=>{
  const mk=async(s)=>{const i=new Image();i.src='data:image/png;base64,'+s;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);return g.getImageData(0,0,i.width,i.height);} ;
  const A=await mk(a64),B=await mk(b64);
  const W=Math.min(A.width,B.width);
  let n=0;const top=[];
  for(let y=Y0*2;y<Y1*2;y++)for(let x=0;x<W;x++){
    const i=(y*A.width+x)*4,j=(y*B.width+x)*4;
    const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
    if(d>thr){n++;top.push([d,x/2,y/2,[A.data[i],A.data[i+1],A.data[i+2]].join(','),[B.data[j],B.data[j+1],B.data[j+2]].join(',')]);}
  }
  top.sort((a,b)=>b[0]-a[0]);
  return {n, top: top.slice(0,15)};
},[load(A),load(B),thr,Y0,Y1]);
console.log(`${A} vs ${B} thr=${thr} y${Y0}-${Y1}: ${out.n}px`);
for(const t of out.top) console.log(`  Δ${t[0]} at ${t[1]},${t[2]}  design ${t[3]}  app ${t[4]}`);
await b.close();
