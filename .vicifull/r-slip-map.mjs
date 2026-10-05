/* Per-pixel diff, mapped. Exclusions: ONE — frame rows above y=54 (D009 status
   bar). Nothing else. Prints the bounding box of every pixel over `thr` and a
   column/row histogram, so a cluster can be located rather than guessed.
   Usage: node r-slip-map.mjs a.png b.png [thr] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,T]=process.argv.slice(2);
const thr=Number(T??4);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393,y0=Math.round(54*s);
let minx=1e9,maxx=-1,miny=1e9,maxy=-1,cnt=0;
const cols=new Map(),rows=new Map();
for(let y=y0;y<Math.min(A.height,B.height);y++)for(let x=0;x<Math.min(A.width,B.width);x++){
 const i=(y*A.width+x)*4,j=(y*B.width+x)*4;let d=0;
 for(let c=0;c<3;c++)d=Math.max(d,Math.abs(A.data[i+c]-B.data[j+c]));
 if(d>=thr){cnt++;const fx=Math.round(x/s),fy=Math.round(y/s);
  minx=Math.min(minx,fx);maxx=Math.max(maxx,fx);miny=Math.min(miny,fy);maxy=Math.max(maxy,fy);
  cols.set(fx>>3,(cols.get(fx>>3)??0)+1);rows.set(fy>>3,(rows.get(fy>>3)??0)+1);}}
console.log(`${cnt} px >= ${thr}/255; frame bbox x ${minx}…${maxx} y ${miny}…${maxy}`);
console.log('  cols(8pt):',[...cols.entries()].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`${k*8}:${v}`).join(' '));
console.log('  rows(8pt):',[...rows.entries()].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`${k*8}:${v}`).join(' '));
