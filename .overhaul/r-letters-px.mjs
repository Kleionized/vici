/* GROUP letters, RECHECK pass — dual pixel instrument.
   Usage: node r-letters-px.mjs A.png B.png [blockThr=4] [fromCss=54] [toCss=1e9]

   Reports TWO independent numbers and states its exclusions:
     (1) RAW per-device-pixel max-channel |delta| histogram over the whole
         compared band. NOTHING is excluded inside the band: no gradient
         regions, no flat-neighbourhood test, no edge suppression. A raw count
         is noisy under glyph antialiasing, which is why (2) exists — but a
         raw count is the only thing that can see a small tonal shift over a
         large smooth area, so it is printed first (FINDINGS F35).
     (2) 8x8 device-pixel BLOCK MEAN diff. Averaging 64 pixels kills a
         one-device-pixel edge shift (~1-4/255) and keeps a lost paint server,
         a wrong gradient focus or a shifted box.
   EXCLUDED, and only this: css rows < fromCss (default 54 = the design
   frame's own 9:41 status bar, which the app never draws, DECISIONS D009)
   and css rows >= toCss when given. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg, fromArg, toArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
if (A.width !== B.width || A.height !== B.height)
  console.log(`! size differs: ${A.width}x${A.height} vs ${B.width}x${B.height} — comparing ${W}x${H}`);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const y0 = Number(fromArg ?? 54) * 2, y1 = Math.min(H, Number(toArg ?? 1e9) * 2);
// (1) raw
const buckets = [2, 4, 6, 8, 12, 20, 40, 80];
const cnt = buckets.map(() => 0);
let rawWorst = 0, rawWorstAt = null, sum = 0, n = 0;
for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A, x, y, c) - at(B, x, y, c)));
  sum += d; n++;
  if (d > rawWorst) { rawWorst = d; rawWorstAt = [x / 2, y / 2]; }
  for (let i = 0; i < buckets.length; i++) if (d >= buckets[i]) cnt[i]++;
}
console.log(`RAW  band css ${y0 / 2}..${y1 / 2}  ${n} px  mean|d| ${(sum / n).toFixed(3)}  worst ${rawWorst} at css ${rawWorstAt?.[0]},${rawWorstAt?.[1]}`);
console.log('     ' + buckets.map((t, i) => `>=${t}: ${cnt[i]}`).join('  '));
// (2) blocks
const S = 8, thr = Number(thrArg ?? 4);
const out = [];
let worst = 0;
for (let by = y0; by + S <= y1; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  worst = Math.max(worst, d);
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`BLOCK 8x8  ${out.length} blocks >= ${thr}/255   worst ${worst.toFixed(1)}`);
for (const [d, x, y] of out.slice(0, 25)) console.log(`      ${d.toFixed(1)}  css ${x},${y}`);
