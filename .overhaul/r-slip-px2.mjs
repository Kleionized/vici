/* Whole-frame per-PIXEL diff with F49's exclusion, not D009's band.
   EXCLUDES: only the design frame's clock/indicator strip — frame y 23.5…36.5
   AND x 47…360 — plus the home-indicator pill row y >= 838. NOTHING ELSE:
   no flatness test, no gradient skip, no block averaging, full width, all
   other rows including 0…23 and 37…53.
   Usage: node r-slip-px2.mjs a.png b.png */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393;
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height);
const inStrip=(fx,fy)=> (fy>=23&&fy<=37&&fx>=46&&fx<=361);
let c4=0,c8=0,c16=0,n=0,sum=0,worst=0,wx=0,wy=0;
const cell=Math.round(16*s);const map=new Map();
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
 const fx=x/s,fy=y/s; if(inStrip(fx,fy)||fy>=838)continue;
 const i=(y*A.width+x)*4,j=(y*B.width+x)*4;let d=0;
 for(let c=0;c<3;c++)d=Math.max(d,Math.abs(A.data[i+c]-B.data[j+c]));
 n++;sum+=d;if(d>worst){worst=d;wx=fx;wy=fy;}
 if(d>=4)c4++; if(d>=8){c8++;const k=`${Math.floor(x/cell)},${Math.floor(y/cell)}`;map.set(k,(map.get(k)??0)+1);} if(d>=16)c16++;}
const top=[...map.entries()].sort((p,q)=>q[1]-p[1]).slice(0,6);
console.log(`${a.split('/').pop().replace(/^r-slip-d-|\.png$/g,'')}: of ${n} px (excl. ONLY the design clock strip y23-37 x46-361 and the home-indicator row y>=838) >=4:${c4} >=8:${c8} >=16:${c16}; mean|d| ${(sum/n).toFixed(3)}; worst ${worst} at frame ${wx.toFixed(0)},${wy.toFixed(0)}`);
for(const [k,v] of top){const [cx,cy]=k.split(',').map(Number);console.log(`   cell frame ${cx*16},${cy*16} 16x16 : ${v} px >=8`);}
