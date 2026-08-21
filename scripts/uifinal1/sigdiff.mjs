#!/usr/bin/env node
/**
 * Diff two captured layout signatures.
 *
 * The design frame and the app both POST a signature to the frame server; this
 * lines them up and reports what differs. Rows are matched on their text where
 * they have any and on position otherwise, so an extra wrapper view in the app
 * does not shift every row after it.
 *
 * Usage: node scripts/uifinal1/sigdiff.mjs <designName> <appName> [--all]
 */
import fs from 'node:fs';
const [, , a, b, ...flags] = process.argv;
const read = (n) => fs.readFileSync(`.uifinal1/sig/${n.replace(/[^A-Za-z0-9._-]/g, '_')}.txt`, 'utf8').split('\n').filter(Boolean).map((l) => l.split(' | '));
const wrapper = (r) => r[1] === '0' && r[2] === '0' && r[3] === '393' && r[4] === '852' && r[10] === '-';
const A = read(a).filter((r) => !wrapper(r)), B = read(b).filter((r) => !wrapper(r));
// Rows carrying text match on their words; the rest match on their box.
// Rows with words match on the words; the rest match on their box, rounded to
// the point so two layout engines' fractional grids still pair up.
const rnd = (v) => Math.round(Number(v));
const key = (r) => (r[10] !== '-' ? 'T:' + r[10] : 'P:' + [rnd(r[1]), rnd(r[2]), rnd(r[3]), rnd(r[4])].join(','));
const idx = (rows) => { const m = new Map(); for (const r of rows) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); } return m; };
const MA = idx(A), MB = idx(B);
const F = ['tag', 'x', 'y', 'w', 'h', 'bg', 'radius', 'opacity', 'shadow', 'type', 'text'];
let diffs = 0, missing = 0, extra = 0, rounded = 0;
/**
 * A design row whose box did not key exactly still matches an app row whose box
 * is within a point of it — two layout engines rounding the same fractional
 * grid land either side of a .5. Paired here before anything is called missing.
 */
const usedB = new Set();
for (const rows of MB.values()) for (const r of rows) usedB.add(r);
const near = (ra) => {
  let best = null, bestD = Infinity;
  for (const r of usedB) {
    if (r[10] !== '-' || ra[10] !== '-') continue;
    const d = Math.max(...[1, 2, 3, 4].map((f) => Math.abs(Number(ra[f]) - Number(r[f]))));
    if (d < bestD) { bestD = d; best = r; }
  }
  return bestD <= 1 ? best : null;
};

for (const [k, rowsA] of MA) {
  let rowsB = MB.get(k);
  if (!rowsB) {
    const hit = near(rowsA[0]);
    if (hit) { rowsB = [hit]; usedB.delete(hit); }
  }
  if (!rowsB) { missing++; console.log('MISSING in app:  ' + rowsA[0].join(' | ')); continue; }
  for (let i = 0; i < Math.min(rowsA.length, rowsB.length); i++) {
    const ra = rowsA[i], rb = rowsB[i];
    const bad = [];
    let rounding = 0;
    for (let f = 1; f < 10; f++) {
      if (ra[f] === rb[f]) continue;
      // Two layout engines lay out the same fractional grid; a difference under
      // a quarter of a point is where they round, not what they were told.
      if (f <= 4 && Math.abs(Number(ra[f]) - Number(rb[f])) < 0.25) { rounding++; continue; }
      bad.push(`${F[f]}: ${ra[f]} → ${rb[f]}`);
    }
    if (rounding) rounded += rounding;
    if (bad.length) { diffs++; console.log(`~ ${ra[10].slice(0, 40).padEnd(40)} ${bad.join('   ')}`); }
  }
  if (rowsA.length !== rowsB.length) console.log(`# count ${k}: design ${rowsA.length}, app ${rowsB.length}`);
}
for (const [k, rowsB] of MB) if (!MA.has(k)) { extra++; if (flags.includes('--all')) console.log('EXTRA in app:    ' + rowsB[0].join(' | ')); }
console.log(`--- ${A.length} design rows, ${B.length} app rows; ${diffs} differing, ${missing} missing, ${extra} extra, ${rounded} sub-0.25pt rounding (use --all to list extras)`);
