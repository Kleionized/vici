/* Block-mean diff summarised by 20-css-px row band and x extent.
   EXCLUDES: css rows 0-53 only (the design PNG's 9:41 status bar, D009).
   No gradient, edge or region exclusions. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const bands = new Map();
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m=[0,0,0], n=[0,0,0];
  for (let y=by;y<by+S;y++) for (let x=bx;x<bx+S;x++) for (let c=0;c<3;c++){m[c]+=at(A,x,y,c);n[c]+=at(B,x,y,c);}
  let d=0; for(let c=0;c<3;c++) d=Math.max(d,Math.abs(m[c]-n[c])/(S*S));
  if (d>=thr){ const band=Math.floor(by/2/20)*20; const e=bands.get(band)||{n:0,worst:0,x0:1e9,x1:-1};
    e.n++; e.worst=Math.max(e.worst,d); e.x0=Math.min(e.x0,bx/2); e.x1=Math.max(e.x1,bx/2+4); bands.set(band,e);}
}
console.log([...bands.entries()].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`  css y ${k}-${k+19}: ${v.n} blocks, worst ${v.worst.toFixed(1)}, x ${v.x0}-${v.x1}`).join('\n'));
