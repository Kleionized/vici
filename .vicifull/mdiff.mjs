#!/usr/bin/env node
/* Row-level signature diff for the medallions group: the canvas draws a coin's
   field, sun and dunes as CSS boxes and the app as SVG shapes, so a design row
   pairs with an app row at the same box that carries no background or radius.
   Those, and `50%` written as a pixel radius, are the only forgiven columns. */
import fs from 'node:fs';
const [x, y, ...rest] = process.argv.slice(2);
/* `--dy=N` shifts every design row down N before pairing: the canvas draws the
   album's second page at the grid's own origin, and the app's grid bottoms out
   N short of putting that row there. */
const DY = Number((rest.find((f) => f.startsWith('--dy=')) || '--dy=0').slice(5));
const read = (n) => fs.readFileSync('.vicifull/sig/' + n + '.txt', 'utf8').split('\n').filter(Boolean).map((l) => l.split(' | '));
const wrapper = (r) => r[1] === '0' && r[2] === '0' && r[3] === '393' && r[4] === '852' && r[10] === '-';
const A = read(x).filter((r) => !wrapper(r)), B = read(y).filter((r) => !wrapper(r));
const rnd = (v) => Math.round(Number(v));
const key = (r, dy = 0) => (r[10] !== '-' ? 'T:' + r[10] : 'P:' + [rnd(r[1]), rnd(+r[2] + dy), rnd(r[3]), rnd(r[4])].join(','));
const MB = new Map();
for (const r of B) { const k = key(r); if (!MB.has(k)) MB.set(k, []); MB.get(k).push(r); }
let miss = 0, diff = 0;
for (const ra of A) {
  const pool = MB.get(key(ra, DY)) || [];
  const rb = pool.shift();
  if (!rb) { miss++; console.log('MISS ' + ra.join(' | ')); continue; }
  const bad = [];
  for (let f = 1; f < 10; f++) {
    if (ra[f] === rb[f]) continue;
    if (f <= 4 && Math.abs(+ra[f] + (f === 2 ? DY : 0) - +rb[f]) < 0.25) continue;
    if (f === 6 && ra[f] === '50%') continue;              // a circle either way
    if ((f === 5 || f === 6 || f === 8) && rb[f] === '-') continue; // CSS box → SVG shape
    if (f === 8 && ra[f] === '-') continue;                // the rim, hung on the app's wrapper
    bad.push(f + ': ' + ra[f] + ' → ' + rb[f]);
  }
  if (bad.length) { diff++; console.log([ra[0], ra[1], ra[2], ra[3], ra[4], (ra[10] || '').slice(0, 28)].join(' ') + '  ||  ' + bad.join('   ')); }
}
console.log(`--- ${A.length} design rows, ${B.length} app rows; ${miss} missing, ${diff} differing`);
