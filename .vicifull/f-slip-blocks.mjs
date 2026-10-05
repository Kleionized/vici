/* 8x8 block-mean diff over the WHOLE frame.
   Exclusions: ONE, stated on every run — frame rows above `--from` (default 54,
   the status bar the app never builds, D009). Nothing else is excluded: every
   remaining row and column is compared, gradients, washes and shadows included,
   which is F35's rule.
   Averaging an 8x8 block kills antialiasing (a one-pixel edge shift moves the
   mean by ~1/8 of the contrast) without suppressing a paint difference.
   Usage: node f-slip-blocks.mjs a.png b.png [threshold] [--all] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const all = args.includes('--all');
const [a, b, thrArg] = args.filter((x) => !x.startsWith('--'));
const from = Number((args.find((x) => x.startsWith('--from=')) ?? '--from=54').slice(7));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const scale = A.width / 393;
const S = 8, thr = Number(thrArg ?? 4);
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let blocks = 0;
for (let by = Math.round(from * (A.width / 393)); by + S <= H; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  blocks++;
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  if (d >= thr) out.push([d, bx / scale, by / scale]);
}
out.sort((p, q) => q[0] - p[0]);
/* Expo's dev-server overlay (a dark rounded square with a lightning bolt) drops
   into the bottom-left corner of the app page at random while other agents are
   editing and Metro is rebuilding. It is not the app, and it is 120 blocks at
   Δ217 every time. Named rather than excluded: the run is re-taken, not
   forgiven — and if a real defect ever lands in that corner this line will not
   fire, because it requires EVERY differing block to be inside the badge. */
const devBadge = out.length > 0 && out.every(([, x, y]) => x < 62 && y > 788);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length} of ${blocks} blocks over ${thr}/255 mean (frame y>=${from} to ${(H / scale).toFixed(0)}, full width; only the D009 status bar excluded)`);
if (devBadge) console.log('   ^ every differing block is inside the Expo dev-server overlay in the bottom-left corner — a capture artefact, re-take the shot');
for (const [d, x, y] of (all ? out : out.slice(0, 20))) console.log(`   ${d.toFixed(1)} at frame ${x.toFixed(0)},${y.toFixed(0)}`);
