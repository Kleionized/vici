/* where the block-mean differences live, summed into 20pt css bands */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const band = new Map();
for (let by = 108; by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  if (d < thr) continue;
  const k = Math.floor(by / 2 / 20) * 20;
  const v = band.get(k) ?? { n: 0, worst: 0 };
  v.n++; v.worst = Math.max(v.worst, d); band.set(k, v);
}
for (const k of [...band.keys()].sort((x, y) => x - y)) console.log(`  css y ${k}-${k + 19}: ${band.get(k).n} blocks, worst ${band.get(k).worst.toFixed(1)}`);
