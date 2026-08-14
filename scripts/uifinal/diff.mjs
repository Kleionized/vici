#!/usr/bin/env node
/**
 * Frame-by-frame diff between two split canvases.
 * Usage: node scripts/uifinal/diff.mjs <prevDir> <finalDir>
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [, , prevDir, finalDir] = process.argv;
const read = (d) => JSON.parse(fs.readFileSync(path.join(d, '_index.json'), 'utf8'));
const prev = read(prevDir);
const final = read(finalDir);
const hash = (d, f) => crypto.createHash('sha1').update(fs.readFileSync(path.join(d, f))).digest('hex');

const pMap = new Map(prev.frames.map((f) => [f.label, f]));
const fMap = new Map(final.frames.map((f) => [f.label, f]));

const added = [];
const removed = [];
const same = [];
const changed = [];

for (const f of final.frames) {
  const p = pMap.get(f.label);
  if (!p) { added.push(f.label); continue; }
  if (hash(prevDir, p.file) === hash(finalDir, f.file)) same.push(f.label);
  else changed.push({ label: f.label, prevBytes: p.bytes, finalBytes: f.bytes, delta: f.bytes - p.bytes });
}
for (const p of prev.frames) if (!fMap.has(p.label)) removed.push(p.label);

console.log(`## ${finalDir}`);
console.log(`prev=${prev.count} final=${final.count}  identical=${same.length} changed=${changed.length} added=${added.length} removed=${removed.length}\n`);
console.log('### ADDED (new in UI Final)');
added.forEach((l) => console.log('  + ' + l));
console.log('\n### REMOVED (gone from UI Final)');
removed.forEach((l) => console.log('  - ' + l));
console.log('\n### CHANGED');
changed.forEach((c) => console.log(`  ~ ${c.label}  (${c.prevBytes} -> ${c.finalBytes}, ${c.delta >= 0 ? '+' : ''}${c.delta})`));
console.log('\n### IDENTICAL');
same.forEach((l) => console.log('  = ' + l));
