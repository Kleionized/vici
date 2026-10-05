/* r-handover pass-2 instrument.
   EXCLUDES NOTHING by default: every pixel of both PNGs is counted — gradients,
   washes, text, the top 54pt of chrome. --band=y0,y1 (css) narrows on purpose
   and the header always prints the band actually used, so a number can never be
   quoted without its exclusion (F35).
   Reports, per pair: 8x8 device-block mean deltas (antialiasing-proof) AND a raw
   per-pixel count over the same threshold (antialiasing-sensitive, so a small
   raw count with zero blocks is a rasterisation edge, not a missing shape).
   usage: node r-handover-blocks.mjs a.png b.png [thr] [--band=y0,y1] [--top=N] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const pos = args.filter((x) => !x.startsWith('--'));
const [a, b] = pos;
const thr = Number(pos[2] ?? 4);
const bandArg = (args.find((x) => x.startsWith('--band=')) ?? '').slice(7);
const band = bandArg ? bandArg.split(',').map(Number) : null;
const topN = Number((args.find((x) => x.startsWith('--top=')) ?? '--top=14').slice(6));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 8;
const y0 = band ? band[0] * 2 : 0, y1 = Math.min(band ? band[1] * 2 : H, H);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = []; let sum = 0, n = 0, raw = 0, rawWorst = 0, rawPx = 0;
for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A, x, y, c) - at(B, x, y, c)));
  rawPx++; if (d >= thr) raw++; if (d > rawWorst) rawWorst = d;
}
for (let by = y0; by + S <= y1; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], q = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); q[c] += at(B, x, y, c); }
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - q[c]) / (S * S));
  sum += d; n++; if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}   band css y ${y0 / 2}–${y1 / 2}  (excludes nothing inside it)`);
console.log(`  blocks ${out.length}/${n} over ${thr}/255   mean |d| ${(sum / n).toFixed(2)}   worst block ${(out[0]?.[0] ?? 0).toFixed(1)}`);
console.log(`  raw px ${raw}/${rawPx} over ${thr}/255   worst px ${rawWorst}`);
for (const [d, x, y] of out.slice(0, topN)) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
