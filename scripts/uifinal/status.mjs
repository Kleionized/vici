#!/usr/bin/env node
/**
 * Set a ledger row's status (and stamp the verification date).
 *
 * Usage: node scripts/uifinal/status.mjs <STATUS> <YYYY-MM-DD> "<label>" ["<label>" …]
 *        node scripts/uifinal/status.mjs <STATUS> <YYYY-MM-DD> --match "<regex>"
 *        node scripts/uifinal/status.mjs <STATUS> <YYYY-MM-DD> --from <STATUS>
 *
 * Matches on the Screen column of `UI_FINAL_LEDGER.md`. Prints what it changed.
 *
 * `--from` promotes every row currently at one status, which is what finishing
 * a pass actually means — and unlike a label list it cannot quietly skip a row
 * or reach a dispositioned one.
 */
import fs from 'node:fs';

const [, , status, date, ...rest] = process.argv;
const VALID = ['NOT_STARTED', 'SPEC_EXTRACTED', 'IMPLEMENTED', 'PASS_1', 'PASS_2', 'PASS_3', 'DONE'];
if (!VALID.includes(status)) {
  console.error(`status must be one of ${VALID.join(', ')}`);
  process.exit(1);
}

const lines = fs.readFileSync('UI_FINAL_LEDGER.md', 'utf8').split('\n');
// The superseded VICI bundles repeat many labels ("Settings", "Campaign Map",
// "Cue Hue Picker"…), so a bare label match would mark them too.
const SUPERSEDED = new Set(['VICI (previous)', 'vici-prev']);
/** Harness rows carry canonical labels but are dispositioned in their own right. */
const isHarness = (bundle) => bundle.startsWith('screenshots/');
const useRegex = rest[0] === '--match';
const useFrom = rest[0] === '--from';
const re = useRegex ? new RegExp(rest[1]) : null;
const from = useFrom ? rest[1] : null;
const labels = useRegex || useFrom ? null : new Set(rest);
if (useFrom && !VALID.includes(from)) {
  console.error(`--from must be one of ${VALID.join(', ')}`);
  process.exit(1);
}

let n = 0;
const out = lines.map((line) => {
  if (!line.startsWith('| ') || line.startsWith('| Bundle') || line.startsWith('| ---')) return line;
  const cells = line.split('|');
  if (SUPERSEDED.has(cells[1].trim()) || isHarness(cells[1].trim())) return line;
  const label = cells[2].trim();
  const hit = useFrom ? cells[4].trim() === from : useRegex ? re.test(label) : labels.has(label);
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
