import fs from 'node:fs'; import { PNG } from 'pngjs'; import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport:{width:393,height:700}, deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.goto('file://' + process.cwd() + '/.vicifull/rl/grid.html');
await p.waitForTimeout(600);
const ids=['A',...Array.from({length:28},(_,i)=>'G'+i)];
const bufs={};
for (const id of ids) bufs[id]=await (await p.$('#'+id)).screenshot();
await b.close();
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
const prof=Q=>{const a=[];
 for(let cx=126;cx<=157;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=256;y<280;y++){s+=at(Q,x,y);n++;}a.push(s/n);}
 for(let cy=168;cy<=196;cy++){let s=0,n=0;for(let y=cy*2;y<cy*2+2;y++)for(let x=178*2;x<214*2;x++){s+=at(Q,x,y);n++;}a.push(s/n);}
 return a;};
const R={}; for(const id of ids) R[id]=prof(PNG.sync.read(bufs[id]));
const combos=[]; for(const sig of [15,16,17,18,19,20,22]) for(const off of [10,11,12.2,13]) combos.push([sig,off]);
const res=combos.map(([sig,off],i)=>{const a=R['G'+i],c=R.A;let e=0,m=0;for(let j=0;j<c.length;j++){e+=(a[j]-c[j])**2;m=Math.max(m,Math.abs(a[j]-c[j]));}return [Math.sqrt(e/c.length),m,sig,off];});
res.sort((x,y)=>x[0]-y[0]);
for(const [rms,md,sig,off] of res.slice(0,10)) console.log(`sigma ${sig} offset ${off}: rms ${rms.toFixed(3)} max ${md.toFixed(2)}`);
