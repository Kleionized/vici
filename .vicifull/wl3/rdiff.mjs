/* Independent pass-2 instrument. Excludes NOTHING by default: every device
   pixel of both PNGs is compared over the full frame, status-bar rows included.
   Reports (a) whole-frame count over the threshold, (b) the same count with the
   top 54 css rows (the status bar the app never builds, D009) reported
   SEPARATELY rather than silently dropped, (c) the worst 16x16 css cells, and
   (d) an 8x8 block-mean diff with a +/-1 device-px nudge so an edge-rounding
   residual can be told from a real one.  --box=x,y,w,h optionally crops. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const [a, b] = args.filter((s) => !s.startsWith('--'));
const thr = Number((args.find((s) => s.startsWith('--thr=')) || '--thr=6').slice(6));
const bthr = Number((args.find((s) => s.startsWith('--bthr=')) || '--bthr=4').slice(7));
const boxArg = args.find((s) => s.startsWith('--box='));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const S = A.width / 393;
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
let x0 = 0, y0 = 0, x1 = W, y1 = H;
if (boxArg) { const [bx,by,bw,bh] = boxArg.slice(6).split(',').map(Number); x0=Math.round(bx*S); y0=Math.round(by*S); x1=Math.round((bx+bw)*S); y1=Math.round((by+bh)*S); }
const at = (P,x,y,c) => P.data[(y*P.width+x)*4+c];
let n=0,sum=0,max=0,nChrome=0,nBody=0;
const cells = new Map();
for (let y=y0;y<y1;y++) for (let x=x0;x<x1;x++) {
  let d=0; for (let c=0;c<3;c++) d=Math.max(d,Math.abs(at(A,x,y,c)-at(B,x,y,c)));
  if (d<thr) continue;
  n++; sum+=d; if(d>max)max=d;
  if (y < 54*S) nChrome++; else nBody++;
  const k=`${Math.floor(x/S/16)*16},${Math.floor(y/S/16)*16}`;
  const e=cells.get(k)||[0,0]; e[0]++; if(d>e[1])e[1]=d; cells.set(k,e);
}
const total=(x1-x0)*(y1-y0);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}  thr ${thr}${boxArg?' '+boxArg:''}`);
console.log(`  RAW ${n} px over ${thr} (${((n/total)*100).toFixed(3)}% of ${total}) mean ${n?(sum/n).toFixed(0):0} max ${max}   [status-bar rows y<54: ${nChrome} | body y>=54: ${nBody}]`);
for (const [k,v] of [...cells].sort((p,q)=>q[1][0]-p[1][0]).slice(0,10)) console.log(`    cell ${k}: ${v[0]} px worst ${v[1]}`);
// 8x8 block means with a nudge, over the body only (states its exclusion).
const BS=8; let diff=0, stub=0; const worst=[];
const atc=(P,x,y,c)=>P.data[(Math.max(0,Math.min(P.height-1,y))*P.width+Math.max(0,Math.min(P.width-1,x)))*4+c];
for (let by=Math.max(y0,Math.round(54*S)); by+BS<=y1; by+=BS) for (let bx=x0; bx+BS<=x1; bx+=BS) {
  let best=Infinity, plain=0;
  for (const [ox,oy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
    const m=[0,0,0], q=[0,0,0];
    for (let y=by;y<by+BS;y++) for (let x=bx;x<bx+BS;x++) for (let c=0;c<3;c++){ m[c]+=atc(A,x,y,c); q[c]+=atc(B,x+ox,y+oy,c); }
    let d=0; for(let c=0;c<3;c++) d=Math.max(d,Math.abs(m[c]-q[c])/(BS*BS));
    if(ox===0&&oy===0) plain=d;
    if(d<best) best=d;
  }
  if (plain>=bthr) diff++;
  if (best>=bthr) { stub++; worst.push([best,bx/S,by/S]); }
}
worst.sort((p,q)=>q[0]-p[0]);
console.log(`  BLOCKS (y>=54 css only): ${diff} over ${bthr}, ${stub} survive a +/-1 device-px nudge`);
for (const [d,x,y] of worst.slice(0,10)) console.log(`    ${d.toFixed(1)} at css ${x.toFixed(0)},${y.toFixed(0)}`);
