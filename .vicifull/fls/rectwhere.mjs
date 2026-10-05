import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , a, b, X, Y, W, H, thrArg] = process.argv;
const thr = Number(thrArg ?? 5);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const x0 = Math.round(Number(X)*2), y0 = Math.round(Number(Y)*2), x1 = Math.round((+X + +W)*2), y1 = Math.round((+Y + +H)*2);
const cols = new Map(), rows = new Map();
for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
  const i = (y*A.width+x)*4;
  const d = Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2]));
  if (d > thr) { cols.set(x/2,(cols.get(x/2)??0)+1); rows.set(y/2,(rows.get(y/2)??0)+1); }
}
console.log('cols:', [...cols].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`${k}:${v}`).join(' '));
console.log('rows:', [...rows].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`${k}:${v}`).join(' '));
