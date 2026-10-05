/* Classify every differing pixel on Night 4 Closed's moon by geometry.
   Disc: box 255,160 34x34 -> centre (272,177) r17. Bite: centre (277.78,170.2), r 13.5..14.5. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const A=PNG.sync.read(fs.readFileSync('.overhaul/shots/rday/d-Night-4-Closed.png'));
const B=PNG.sync.read(fs.readFileSync('.overhaul/shots/rday/a-Night-4-Closed.png'));
let rim=0, bite=0, other=0, n=0; const otherPts=[];
const hist=new Map();
for(let y=54*2;y<852*2;y++) for(let x=0;x<A.width;x++){
  const i=(A.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  if(d<=8) continue; n++;
  const cx=x/2+0.25, cy=y/2+0.25;
  const rd=Math.hypot(cx-272,cy-177);            // from disc centre
  const rb=Math.hypot(cx-277.78,cy-170.2);        // from bite centre
  const k=`rim${Math.abs(rd-17)<=1.5?1:0}_bite${(rb>12&&rb<16)?1:0}`;
  hist.set(k,(hist.get(k)??0)+1);
  if(Math.abs(rd-17)<=1.5) rim++; else if(rb>12&&rb<16) bite++; else {other++; otherPts.push([cx,cy,d,rd.toFixed(2),rb.toFixed(2)]);}
}
console.log('total',n,'within 1.5 of disc rim',rim,'on bite arc only',bite,'neither',other);
for(const [k,v] of hist) console.log(' ',k,v);
for(const p of otherPts.slice(0,20)) console.log('   other', p.join(' '));
