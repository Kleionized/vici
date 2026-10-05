import { PNG } from 'pngjs'; import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport:{width:393,height:700}, deviceScaleFactor:2 });
const p = await ctx.newPage(); await p.goto('file://'+process.cwd()+'/.vicifull/rl/ctl2.html'); await p.waitForTimeout(500);
const B={}; for(const id of ['V0','W0','W1','W2','W3']) B[id]=PNG.sync.read(await (await p.$('#'+id)).screenshot());
await b.close();
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
// V0 left penumbra
const prof=(Q,x0,x1,y0,y1)=>{const a=[];for(let cx=x0;cx<=x1;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=y0*2;y<y1*2;y++){s+=at(Q,x,y);n++;}a.push(s/n);}return a;};
console.log('V0 (HTML div, filter drop-shadow 18px) left penumbra:');
console.log(prof(B.V0,112,150,124,136).map(v=>v.toFixed(1)).join(' '));
console.log('\nCONTACT SHADOW — vertical profile x 180..212, y 104..140');
const vp=(Q)=>{const a=[];for(let cy=104;cy<=140;cy++){let s=0,n=0;for(let y=cy*2;y<cy*2+2;y++)for(let x=180*2;x<212*2;x++){s+=at(Q,x,y);n++;}a.push(s/n);}return a;};
const R={}; for(const id of ['W0','W1','W2','W3']) R[id]=vp(B[id]);
console.log('y    W0(css blur4)  W1(sig4 sRGB)  W2(sig4 linear)  W3(sig8)');
for(let j=0;j<R.W0.length;j+=2) console.log(`${104+j}   ${['W0','W1','W2','W3'].map(i=>R[i][j].toFixed(2).padStart(8)).join(' ')}`);
for(const i of ['W1','W2','W3']){let e=0,m=0;for(let j=0;j<R.W0.length;j++){e+=(R[i][j]-R.W0[j])**2;m=Math.max(m,Math.abs(R[i][j]-R.W0[j]));}console.log(`${i} vs W0: rms ${Math.sqrt(e/R.W0.length).toFixed(3)} max ${m.toFixed(2)}`);}
