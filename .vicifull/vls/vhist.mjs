/* Where do the differing pixels sit? A column histogram separates a one-pixel
   edge (all at one x) from art that is genuinely in the wrong place. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,thrA] = process.argv; const thr = Number(thrA ?? 12);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const SKIP = 108; const cols = new Map(), rows = new Map();
for (let y = SKIP; y < A.height; y++) for (let x = 0; x < A.width; x++) {
  const i = (y*A.width+x)*4;
  const d = Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2]));
  if (d <= thr) continue;
  cols.set(x/2, (cols.get(x/2)??0)+1); rows.set(y/2, (rows.get(y/2)??0)+1);
}
const top = (m,n)=>[...m].sort((p,q)=>q[1]-p[1]).slice(0,n).map(([k,v])=>`${k}:${v}`).join(' ');
console.log('distinct x: ' + cols.size + '  distinct y: ' + rows.size);
console.log('worst x: ' + top(cols,14));
console.log('worst y: ' + top(rows,14));
const xs=[...cols.keys()].sort((p,q)=>p-q), ys=[...rows.keys()].sort((p,q)=>p-q);
console.log('x range ' + xs[0] + '..' + xs[xs.length-1] + '   y range ' + ys[0] + '..' + ys[ys.length-1]);
