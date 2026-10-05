/* GROUP paywall — block-mean diff, stating what it excludes (FINDINGS F35).

   Averages SxS device-pixel blocks on both images and reports every block whose
   mean channel differs by more than the threshold. Averaging kills glyph
   antialiasing (a 1-px edge shift moves a block mean by about 1/8 of the
   contrast) without killing a gradient, a lost paint server or a shifted box.

   EXCLUDES: nothing. It walks device row 0 to the bottom of the shorter image
   and column 0 to the right of the narrower one — no top cutoff and no flatness
   test, which is what let F23 and F35 hide. `--from`/`--to` narrow it to one
   CSS band only when a band is what is being asked about, and the header then
   says so.

   node .vicifull/f-pw-blockdiff.mjs a.png b.png [thr=4] [--from=<cssY>] [--to=<cssY>] [--s=8]
*/
import fs from 'node:fs';
import { PNG } from 'pngjs';
const argv = process.argv.slice(2);
const flag = (n, d) => { const a = argv.find((x) => x.startsWith(`--${n}=`)); return a ? Number(a.slice(n.length + 3)) : d; };
const [a, b, thrArg] = argv.filter((x) => !x.startsWith('--'));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = flag('s', 8), thr = Number(thrArg ?? 4);
const y0 = Math.max(0, Math.round(flag('from', 0) * 2));
const y1 = Math.min(H, Math.round(flag('to', H / 2) * 2));
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
const out = [];
let worst = 0;
for (let by = y0; by + S <= y1; by += S) for (let bx = 0; bx + S <= W; bx += S) {
  const m = [0, 0, 0], n = [0, 0, 0];
  for (let y = by; y < by + S; y++) for (let x = bx; x < bx + S; x++)
    for (let c = 0; c < 3; c++) { m[c] += at(A, x, y, c); n[c] += at(B, x, y, c); }
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(m[c] - n[c]) / (S * S));
  if (d > worst) worst = d;
  if (d >= thr) out.push([d, bx / 2, by / 2]);
}
out.sort((p, q) => q[0] - p[0]);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${out.length} blocks of ${S}x${S} over ${thr}/255 mean, worst ${worst.toFixed(1)} — css rows ${y0 / 2}..${y1 / 2}, all columns, no flatness filter`);
for (const [d, x, y] of out.slice(0, Number(flag("list", 30)))) console.log(`   ${d.toFixed(1)} at css ${x},${y}`);
