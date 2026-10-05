/* Is the residual an edge shift or a real difference? For every 8x8 block that
   differs, try the app block at each of the nine +/-1 device-pixel offsets and
   keep the best. Blocks that a one-pixel nudge fixes are D083 edges; blocks
   that survive every nudge are real. Nothing is excluded. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(Math.max(0, Math.min(P.height - 1, y)) * P.width + Math.max(0, Math.min(P.width - 1, x))) * 4 + c];
let differing = 0, stubborn = 0; const worst = [];
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  let best = Infinity, plain = 0;
  for (const [ox, oy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
    const m = [0,0,0], n = [0,0,0];
    for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
      for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x + ox, y + oy, c); }
    let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
    if (ox === 0 && oy === 0) plain = d;
    if (d < best) best = d;
  }
  if (plain >= thr) differing++;
  if (best >= thr) { stubborn++; worst.push([best, bx / 2, by / 2]); }
}
worst.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${differing} blocks over ${thr}, ${stubborn} of them survive a +/-1 device-px nudge`);
for (const [d, x, y] of worst.slice(0, 8)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
