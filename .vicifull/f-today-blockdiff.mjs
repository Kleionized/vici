/* GROUP today, pass 2 — whole-frame block-mean diff.
   8x8 device-pixel block means on both images; a block is reported when any
   channel's mean differs by >= thr.
   EXCLUDES: the phone chrome only — css rows 0-53 (the status bar) and, when
   asked, a stated band at the foot. The design frames DO carry the 9:41 status
   bar and the app never draws it (DECISIONS D009), so those rows are chrome,
   not parity. Nothing else is excluded: not gradient regions, not
   antialiased edges beyond what averaging over 64 device pixels suppresses
   (a one-device-pixel edge shift moves a block mean by ~1/8 of the local
   contrast, so a pure edge difference lands around 1-4/255 and a lost paint
   server, a wrong stop or a shifted box lands far above it). FINDINGS F35. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg, fromArg, toArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let worst = 0;
const y0 = Number(fromArg ?? 54) * 2, y1 = Math.min(H, Number(toArg ?? 1e9) * 2);
for (let by = y0; by + S <= y1; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  worst = Math.max(worst, d);
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${A.width}x${A.height} / ${B.width}x${B.height}; ${out.length} of ${Math.floor((y1 - y0) / S) * Math.floor(W / S)} blocks over ${thr}/255 mean, worst ${worst.toFixed(1)}; css rows ${y0 / 2}-${y1 / 2}`);
for (const [d, x, y] of out.slice(0, 16)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
