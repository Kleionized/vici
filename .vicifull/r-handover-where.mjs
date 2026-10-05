/* Where the differing blocks are. Same 8x8 block means as r-handover-blocks;
   excludes nothing; groups the survivors into named rects so a residual can be
   attributed instead of counted. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const pos = args.filter((x) => !x.startsWith('--'));
const [a, b] = pos; const thr = Number(pos[2] ?? 4);
const rects = (args.find((x) => x.startsWith('--rects=')) ?? '').slice(8);
const R = rects ? rects.split(';').map((s) => { const [n, x, y, w, h] = s.split(','); return { n, x: +x, y: +y, w: +w, h: +h }; }) : [];
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height), S = 8;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const hit = Object.create(null); let other = 0, otherWorst = 0; const otherList = [];
let total = 0;
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0,0,0], q = [0,0,0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++) for (let c = 0; c < 3; c++) { m[c] += at(A,x,y,c); q[c] += at(B,x,y,c); }
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c]-q[c])/(S*S));
  if (d < thr) continue; total++;
  const cx = bx/2, cy = by/2;
  const r = R.find((r) => cx >= r.x && cx < r.x + r.w && cy >= r.y && cy < r.y + r.h);
  if (r) { hit[r.n] = hit[r.n] || { n: 0, worst: 0 }; hit[r.n].n++; hit[r.n].worst = Math.max(hit[r.n].worst, d); }
  else { other++; otherWorst = Math.max(otherWorst, d); otherList.push([d, cx, cy]); }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${total} blocks over ${thr}/255 (css y>=54, nothing else excluded)`);
for (const k of Object.keys(hit)) console.log(`   ${k}: ${hit[k].n} blocks, worst ${hit[k].worst.toFixed(1)}`);
otherList.sort((p,q)=>q[0]-p[0]);
console.log(`   OUTSIDE named rects: ${other} blocks, worst ${otherWorst.toFixed(1)}`);
for (const [d,x,y] of otherList.slice(0, 20)) console.log(`      ${d.toFixed(1)} at css ${x},${y}`);
