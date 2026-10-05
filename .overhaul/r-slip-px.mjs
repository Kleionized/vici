/* Whole-frame per-PIXEL diff. Exclusions: ONE — frame rows above y=54 (the
   D009 status bar the app never builds). Nothing else: no flatness test, no
   gradient skip, no block averaging, full width, full height.
   Reports counts over 4/8/16/32 and the 16x16 frame cells holding the most
   pixels over 16, so a cluster (a real defect) separates from scattered
   antialiasing on glyph edges.
   Usage: node rpx.mjs a.png b.png [--cells=N] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2).filter(x=>!x.startsWith('--'));
const nCells = Number((process.argv.find(x=>x.startsWith('--cells='))??'--cells=8').slice(8));
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const s = A.width / 393;
const W = Math.min(A.width,B.width), H = Math.min(A.height,B.height);
const y0 = Math.round(54*s);
const cell = Math.round(16*s);
const map = new Map();
let c4=0,c8=0,c16=0,c32=0,n=0,sum=0,worst=0,wx=0,wy=0;
for (let y=y0;y<H;y++) for (let x=0;x<W;x++){
  const i=(y*A.width+x)*4, j=(y*B.width+x)*4;
  let d=0; for(let c=0;c<3;c++) d=Math.max(d,Math.abs(A.data[i+c]-B.data[j+c]));
  n++; sum+=d;
  if(d>worst){worst=d;wx=x/s;wy=y/s;}
  if(d>=4)c4++; if(d>=8)c8++; if(d>=16){c16++;
    const k=`${Math.floor(x/cell)},${Math.floor(y/cell)}`; map.set(k,(map.get(k)??0)+1);}
  if(d>=32)c32++;
}
const top=[...map.entries()].sort((p,q)=>q[1]-p[1]).slice(0,nCells);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: of ${n} px (y>=54, full width; only D009 status bar excluded) >=4:${c4} >=8:${c8} >=16:${c16} >=32:${c32}; mean |d| ${(sum/n).toFixed(3)}; worst ${worst} at frame ${wx.toFixed(0)},${wy.toFixed(0)}`);
for(const [k,v] of top){const [cx,cy]=k.split(',').map(Number);console.log(`   cell frame ${cx*16},${cy*16} 16x16 : ${v} px >=16`);}
