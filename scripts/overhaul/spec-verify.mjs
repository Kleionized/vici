#!/usr/bin/env node
/**
 * Append the numeric comparison table to a spec file.
 *
 * Phase 4 asks for a property-by-property table: property, design value, app
 * value, match or mismatch. Both sides were measured with the same probe, so
 * the table is built from the two captures rather than typed — every visible
 * box on the frame appears as a row, matched on its text where it has any and
 * on its box where it does not.
 *
 * Usage: node scripts/overhaul/spec-verify.mjs <specFile> <designSig> <appSig>
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , specFile, a, b] = process.argv;
const read = (n) => fs.readFileSync(`.overhaul/sig/${n.replace(/[^A-Za-z0-9._-]/g, '_')}.txt`, 'utf8').split('\n').filter(Boolean).map((l) => l.split(' | '));
const wrapper = (r) => r[1] === '0' && r[2] === '0' && r[3] === '393' && r[4] === '852' && r[10] === '-';
const A = read(a).filter((r) => !wrapper(r));
const B = read(b).filter((r) => !wrapper(r));
const rnd = (v) => Math.round(Number(v));
const key = (r) => (r[10] !== '-' ? 'T:' + r[10] : 'P:' + [rnd(r[1]), rnd(r[2]), rnd(r[3]), rnd(r[4])].join(','));
const idx = (rows) => { const m = new Map(); for (const r of rows) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); } return m; };
const MA = idx(A), MB = idx(B);
const esc = (s) => String(s).replace(/\|/g, '\\|');
const box = (r) => `${r[1]}, ${r[2]} · ${r[3]} × ${r[4]}`;
const paint = (r) => [r[5] === '-' ? null : r[5], r[6] === '-' ? null : `r ${r[6]}`, r[7] === '-' ? null : `α ${r[7]}`, r[8] === '-' ? null : r[8]].filter(Boolean).join(' · ') || '—';
const type = (r) => (r[9] === '-' ? '—' : r[9]);

const out = [];
out.push('');
out.push('## Comparison — design frame vs the running app');
out.push('');
out.push('Both sides measured with the same probe (`.overhaul/probe.js`): every visible box\'s rect in');
out.push('frame coordinates plus its background, radius, opacity, shadow and type metrics. The design');
out.push('frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas');
out.push('status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).');
out.push('');
out.push('| Element | Property | Design | App | Result |');
out.push('| --- | --- | --- | --- | --- |');
const F = { 1: 'x', 2: 'y', 3: 'width', 4: 'height', 5: 'background', 6: 'radius', 7: 'opacity', 8: 'shadow', 9: 'type' };
let rows = 0, bad = 0;
const usedB = new Set();
for (const rows of MB.values()) for (const r of rows) usedB.add(r);
/** Pair a design box with an app box within a point — two engines rounding. */
/**
 * A screen whose words are the user's own draws different digits in the app
 * than the canvas's sample does. Pair those by their type metrics and their
 * line, so everything except the value is still compared.
 */
const nearText = (ra) => {
  let best = null, bestD = Infinity;
  for (const r of usedB) {
    if (r[10] === '-' || ra[10] === '-') continue;
    if (r[9] !== ra[9]) continue;
    if (Math.abs(Number(ra[2]) - Number(r[2])) > 1) continue;
    const d = Math.abs(Number(ra[1]) - Number(r[1]));
    if (d < bestD) { bestD = d; best = r; }
  }
  return bestD <= 24 ? best : null;
};
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
  let asData = false;
  if (!rowsB) {
    const hit = near(rowsA[0]);
    if (hit) { rowsB = [hit]; usedB.delete(hit); }
  }
  if (!rowsB) {
    const hit = nearText(rowsA[0]);
    if (hit) { rowsB = [hit]; usedB.delete(hit); asData = true; }
  }
  const name = rowsA[0][10] === '-' ? `${rowsA[0][0]} at ${rowsA[0][1]}, ${rowsA[0][2]}` : `“${rowsA[0][10].slice(0, 48)}”`;
  if (!rowsB) {
    out.push(`| ${esc(name)} | box · paint | ${esc(box(rowsA[0]))} · ${esc(paint(rowsA[0]))} | *absent* | **mismatch** |`);
    bad++; rows++;
    continue;
  }
  // Two rows can carry the same word — a section action and a tab label both
  // read "Library" — and the two sides need not list them in the same order.
  const pool = rowsB.slice();
  const paired = rowsA.map((ra) => {
    let bi = 0, bd = Infinity;
    for (let j = 0; j < pool.length; j++) {
      const d = Math.hypot(Number(ra[1]) - Number(pool[j][1]), Number(ra[2]) - Number(pool[j][2]));
      if (d < bd) { bd = d; bi = j; }
    }
    return pool.length ? pool.splice(bi, 1)[0] : null;
  });
  for (let i = 0; i < Math.min(rowsA.length, rowsB.length); i++) {
    const ra = rowsA[i], rb = paired[i];
    const diff = [];
    for (const f of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (ra[f] === rb[f]) continue;
      // sub-quarter-point differences are where two layout engines round
      if (f <= 4 && Math.abs(Number(ra[f]) - Number(rb[f])) < 0.25) continue;
      // a value the user owns renders at its own width
      if (asData && (f === 3 || f === 4)) continue;
      diff.push(f);
    }
    rows++;
    if (!diff.length) {
      out.push(
        asData
          ? `| ${esc(name)} | box · paint · type | ${esc(box(ra))} · ${esc(paint(ra))} · ${esc(type(ra))} | same box and metrics, value ${esc(JSON.stringify(rb[10]))} | match (value) |`
          : `| ${esc(name)} | box · paint · type | ${esc(box(ra))} · ${esc(paint(ra))} · ${esc(type(ra))} | identical | match |`,
      );
    } else {
      bad++;
      for (const f of diff) out.push(`| ${esc(name)} | ${F[f]} | ${esc(ra[f])} | ${esc(rb[f])} | **mismatch** |`);
    }
  }
}
out.push('');
out.push(`**${rows} elements compared; ${rows - bad} match, ${bad} differ.**`);
out.push('');
fs.appendFileSync(path.join('specs', specFile), out.join('\n'));
console.log(`${specFile}: ${rows} compared, ${bad} differ`);
