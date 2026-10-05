/* pixel diff two shots: node pxd.mjs a b [threshold] [--rows] */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [A, B, thrRaw] = process.argv.slice(2).filter(a=>!a.startsWith('--'));
const thr = Number(thrRaw ?? 12);
const rows = process.argv.includes('--rows');
const b = await chromium.launch({ channel: 'chrome', headless: true, args:['--disable-gpu'] });
const p = await b.newPage();
const load = (f) => fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
const out = await p.evaluate(async ([a64, b64, thr]) => {
  const mk = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = document.createElement('canvas'); c.width=i.width;c.height=i.height; const g=c.getContext('2d'); g.drawImage(i,0,0); return g.getImageData(0,0,i.width,i.height); };
  const A = await mk(a64), B = await mk(b64);
  const W = Math.min(A.width,B.width), H = Math.min(A.height,B.height);
  let n=0, worst=0, wx=0, wy=0; const band = {}; const clusters=[];
  for (let y=0;y<H;y++) for (let x=0;x<W;x++){
    const i=(y*A.width+x)*4, j=(y*B.width+x)*4;
    const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
    if(d>thr){n++; const cy=Math.floor(y/2/10)*10; band[cy]=(band[cy]||0)+1; if(d>worst){worst=d;wx=x;wy=y;}}
  }
  return {n, worst, wx:wx/2, wy:wy/2, W:W/2, H:H/2, band};
}, [load(A), load(B), thr]);
console.log(`${A} vs ${B}  thr=${thr}  diff=${out.n}px  worst=${out.worst} at ${out.wx},${out.wy}`);
const bands = Object.entries(out.band).map(([k,v])=>[Number(k),v]).sort((x,y)=>y[1]-x[1]).slice(0,25);
for(const [y,c] of bands) console.log(`  y ${y}-${y+9}: ${c}`);
await b.close();
