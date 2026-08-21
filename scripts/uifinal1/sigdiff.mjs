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
const key = (r) => (r[10] !== '-' ? 'T:' + r[10] : 'P:' + r[1] + ',' + r[2] + ',' + r[3] + ',' + r[4]);
const idx = (rows) => { const m = new Map(); for (const r of rows) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); } return m; };
const MA = idx(A), MB = idx(B);
const F = ['tag', 'x', 'y', 'w', 'h', 'bg', 'radius', 'opacity', 'shadow', 'type', 'text'];
let diffs = 0, missing = 0, extra = 0;
for (const [k, rowsA] of MA) {
  const rowsB = MB.get(k);
  if (!rowsB) { missing++; console.log('MISSING in app:  ' + rowsA[0].join(' | ')); continue; }
  for (let i = 0; i < Math.min(rowsA.length, rowsB.length); i++) {
    const ra = rowsA[i], rb = rowsB[i];
    const bad = [];
    for (let f = 1; f < 10; f++) if (ra[f] !== rb[f]) bad.push(`${F[f]}: ${ra[f]} → ${rb[f]}`);
    if (bad.length) { diffs++; console.log(`~ ${ra[10].slice(0, 40).padEnd(40)} ${bad.join('   ')}`); }
  }
  if (rowsA.length !== rowsB.length) console.log(`# count ${k}: design ${rowsA.length}, app ${rowsB.length}`);
}
for (const [k, rowsB] of MB) if (!MA.has(k)) { extra++; if (flags.includes('--all')) console.log('EXTRA in app:    ' + rowsB[0].join(' | ')); }
console.log(`--- ${A.length} design rows, ${B.length} app rows; ${diffs} differing, ${missing} missing, ${extra} extra (use --all to list extras)`);
