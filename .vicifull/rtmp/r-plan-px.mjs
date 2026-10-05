/* Whole-body pixel diff for the `plan` re-measure (pass 2).
   EXCLUDES NOTHING but the phone status bar the design frame draws and the app
   never does (D009): canvas y 0..53. Everything from y=54 to y=834 is compared
   — gradients, washes, grain, shadows, text.  Reports raw per-pixel Δ counts,
   the worst pixel and where it is, and 8x8 block-mean clusters so a broad soft
   error cannot hide under an antialiasing floor. */
import fs from 'node:fs';
import { PNG } from 'pngjs';

const [A, B, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const y0 = Number(opt.y0 ?? 54), y1 = Number(opt.y1 ?? 834);
const x0 = Number(opt.x0 ?? 0), x1 = Number(opt.x1 ?? 393);

const a = PNG.sync.read(fs.readFileSync(A));
const b = PNG.sync.read(fs.readFileSync(B));
if (a.width !== b.width || a.height !== b.height) { console.log('SIZE MISMATCH', a.width, a.height, b.width, b.height); }
const dev = a.width / 393;
const px = (p, x, y) => { const i = (y * p.width + x) * 4; return [p.data[i], p.data[i + 1], p.data[i + 2]]; };

const th = [4, 6, 8, 12, 20, 40];
const cnt = th.map(() => 0);
let worst = 0, wat = null, sum = 0, n = 0;
const rowHist = new Map();
const DY0 = Math.round(y0 * dev), DY1 = Math.round(y1 * dev), DX0 = Math.round(x0 * dev), DX1 = Math.round(x1 * dev);
for (let y = DY0; y < DY1; y++) {
  let rc = 0;
  for (let x = DX0; x < DX1; x++) {
    const p = px(a, x, y), q = px(b, x, y);
    const d = Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2]));
    sum += d; n++;
    for (let k = 0; k < th.length; k++) if (d >= th[k]) cnt[k]++;
    if (d > worst) { worst = d; wat = [x / dev, y / dev, p.join(','), q.join(',')]; }
    if (d >= 6) rc++;
  }
  if (rc) rowHist.set(Math.round(y / dev), (rowHist.get(Math.round(y / dev)) || 0) + rc);
}
console.log(`${A.split('/').pop()} vs ${B.split('/').pop()}  body y${y0}-${y1} x${x0}-${x1}  ${n} device px, NOTHING excluded`);
console.log('  over ' + th.map((t, i) => `${t}:${cnt[i]}`).join('  '));
console.log('  mean |Δ| ' + (sum / n).toFixed(3) + '   worst ' + worst + (wat ? ` at canvas (${wat[0].toFixed(1)},${wat[1].toFixed(1)}) design ${wat[2]} app ${wat[3]}` : ''));

/* 8x8 block means: kills curve antialiasing (a one-device-pixel edge averages
   to under 1/255 over 64 px) without killing a broad soft region, which is the
   exact failure F35 records. */
let bworst = 0, bat = null, bover = 0, btot = 0;
const blocks = [];
for (let y = DY0; y + 8 <= DY1; y += 8) for (let x = DX0; x + 8 <= DX1; x += 8) {
  const ma = [0, 0, 0], mb = [0, 0, 0];
  for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
    const p = px(a, x + i, y + j), q = px(b, x + i, y + j);
    for (let c = 0; c < 3; c++) { ma[c] += p[c]; mb[c] += q[c]; }
  }
  const d = Math.max(...ma.map((v, c) => Math.abs(v - mb[c]) / 64));
  btot++;
  if (d >= 2) { bover++; blocks.push([d, x / dev, y / dev]); }
  if (d > bworst) { bworst = d; bat = [x / dev, y / dev]; }
}
console.log(`  8x8 blocks: ${bover}/${btot} over 2/255, worst ${bworst.toFixed(2)}` + (bat ? ` at (${bat[0].toFixed(0)},${bat[1].toFixed(0)})` : ''));
blocks.sort((p, q) => q[0] - p[0]);
for (const [d, x, y] of blocks.slice(0, 12)) console.log(`     block Δ${d.toFixed(2)} at (${x.toFixed(0)},${y.toFixed(0)})`);
const rows = [...rowHist.entries()].sort((p, q) => q[1] - p[1]).slice(0, 10);
if (rows.length) console.log('  worst rows (px over 6): ' + rows.map(([r, c]) => `y${r}:${c}`).join(' '));
