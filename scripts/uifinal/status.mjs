#!/usr/bin/env node
/**
 * Set a ledger row's status (and stamp the verification date).
 *
 * Usage: node scripts/uifinal/status.mjs <STATUS> <YYYY-MM-DD> "<label>" ["<label>" …]
 *        node scripts/uifinal/status.mjs <STATUS> <YYYY-MM-DD> --match "<regex>"
 *
 * Matches on the Screen column of `UI_FINAL_LEDGER.md`. Prints what it changed.
 */
import fs from 'node:fs';

const [, , status, date, ...rest] = process.argv;
const VALID = ['NOT_STARTED', 'SPEC_EXTRACTED', 'IMPLEMENTED', 'PASS_1', 'PASS_2', 'PASS_3', 'DONE'];
if (!VALID.includes(status)) {
  console.error(`status must be one of ${VALID.join(', ')}`);
  process.exit(1);
}

const lines = fs.readFileSync('UI_FINAL_LEDGER.md', 'utf8').split('\n');
const useRegex = rest[0] === '--match';
const re = useRegex ? new RegExp(rest[1]) : null;
const labels = useRegex ? null : new Set(rest);

let n = 0;
const out = lines.map((line) => {
  if (!line.startsWith('| ') || line.startsWith('| Bundle') || line.startsWith('| ---')) return line;
  const cells = line.split('|');
  const label = cells[2].trim();
  const hit = useRegex ? re.test(label) : labels.has(label);
  if (!hit) return line;
  n++;
  cells[4] = ` ${status} `;
  cells[5] = ` ${date} `;
  return cells.join('|');
});
fs.writeFileSync('UI_FINAL_LEDGER.md', out.join('\n'));

// Refresh the summary line.
const rows = out.filter((l) => l.startsWith('| ') && !l.startsWith('| Bundle') && !l.startsWith('| ---'));
const counts = {};
for (const r of rows) {
  const s = r.split('|')[4].trim();
  counts[s] = (counts[s] ?? 0) + 1;
}
const summary = `**${rows.length} rows.** ` + Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(' · ');
const final = fs.readFileSync('UI_FINAL_LEDGER.md', 'utf8').replace(/^\*\*\d+ rows\.\*\*.*$/m, summary);
fs.writeFileSync('UI_FINAL_LEDGER.md', final);
console.log(`${status}: ${n} rows`, counts);
