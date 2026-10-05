import { PNG } from 'pngjs'; import { chromium } from 'playwright-core';
const b=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});
const ctx=await b.newContext({viewport:{width:393,height:800},deviceScaleFactor:2});
const p=await ctx.newPage(); await p.goto('file://'+process.cwd()+'/.vicifull/rl/ctl3.html'); await p.waitForTimeout(500);
const B={}; for(const id of ['A','P','Q']) B[id]=PNG.sync.read(await (await p.$('#'+id)).screenshot());
await b.close();
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
const prof=Q=>{const a=[];
 for(let cx=120;cx<=157;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=256;y<280;y++){s+=at(Q,x,y);n++;}a.push(s/n);}
 for(let cy=164;cy<=200;cy++){let s=0,n=0;for(let y=cy*2;y<cy*2+2;y++)for(let x=356;x<428;x++){s+=at(Q,x,y);n++;}a.push(s/n);}
 return a;};
const R={}; for(const id of ['A','P','Q']) R[id]=prof(B[id]);
for(const i of ['P','Q']){let e=0,m=0;for(let j=0;j<R.A.length;j++){e+=(R[i][j]-R.A[j])**2;m=Math.max(m,Math.abs(R[i][j]-R.A[j]));}
 console.log(`${i==='P'?'sigma18 sRGB     ':'sigma18 linearRGB'} vs css drop-shadow: rms ${Math.sqrt(e/R.A.length).toFixed(3)}  max ${m.toFixed(2)}`);}
