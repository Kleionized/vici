import fs from 'node:fs'; import { PNG } from 'pngjs'; import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport:{width:393,height:700}, deviceScaleFactor:2 });
const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/.vicifull/rl/ctl.html'); await p.waitForTimeout(500);
const ids=['U0','U1','U2','U3','U4']; const B={};
for(const id of ids) B[id]=PNG.sync.read(await (await p.$('#'+id)).screenshot());
await b.close();
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
const prof=Q=>{const a=[];for(let cx=110;cx<=149;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=124*2;y<136*2;y++){s+=at(Q,x,y);n++;}a.push(s/n);}return a;};
const R={}; for(const id of ids) R[id]=prof(B[id]);
console.log('x    U0(css-ds) U1(sig9) U2(sig18) U3(feDS9) U4(box-shadow)');
for(let j=0;j<R.U0.length;j+=2) console.log(`${110+j}  ${ids.map(i=>R[i][j].toFixed(1).padStart(7)).join(' ')}`);
for(const i of ['U1','U2','U3','U4']){let e=0,m=0;for(let j=0;j<R.U0.length;j++){e+=(R[i][j]-R.U0[j])**2;m=Math.max(m,Math.abs(R[i][j]-R.U0[j]));}console.log(`${i} vs U0: rms ${Math.sqrt(e/R.U0.length).toFixed(3)} max ${m.toFixed(2)}`);}
