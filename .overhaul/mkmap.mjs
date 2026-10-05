import fs from 'node:fs';
import path from 'node:path';

const specDir = 'specs';
const byFrame = new Map();
for (const f of fs.readdirSync(specDir).filter((x) => x.endsWith('.md'))) {
  const src = fs.readFileSync(path.join(specDir, f), 'utf8');
  const fm = src.match(/\*\*Design frame\*\*\s*`?([^`\n]+)`?/);
  const af = src.match(/\*\*App file\*\*\s*(.+)/);
  if (!fm) continue;
  let label = fm[1].trim().replace(/^.*Email-Login\//, '').replace(/^\d+\s+·\s+/, '').replace(/\.html$/, '');
  byFrame.set(label, { spec: f, app: (af?.[1] || '').trim() });
}
const fidx = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8'));
const pidx = JSON.parse(fs.readFileSync('.overhaul/prev/Email-Login/_index.json', 'utf8'));
const pm = new Map(pidx.frames.map((x) => [x.label, x]));
const dl = new Map();
for (const df of fs.readdirSync('.overhaul/fdiff')) {
  const t = fs.readFileSync('.overhaul/fdiff/' + df, 'utf8');
  dl.set(df.replace(/\.diff$/, '.html'), t.split('\n').filter((l) => /^[+-][^+-]/.test(l)).length);
}
const rows = [];
for (const [i, fr] of fidx.frames.entries()) {
  const p = pm.get(fr.label);
  let status = 'identical';
  if (!p) status = 'ADDED';
  else if (dl.has(fr.file)) status = 'changed';
  const s = byFrame.get(fr.label) || {};
  rows.push({ n: i + 1, label: fr.label, file: fr.file, status, diff: dl.get(fr.file) || 0, spec: s.spec || '', app: s.app || '' });
}
fs.writeFileSync('.overhaul/map.json', JSON.stringify(rows, null, 2));
const md = ['| # | Frame | File | Status | Δlines | Spec | App file |', '|---|---|---|---|---|---|---|'];
for (const r of rows) md.push(`| ${r.n} | ${r.label} | ${r.file} | ${r.status} | ${r.diff || ''} | ${r.spec} | ${r.app.replace(/\|/g, '\\|')} |`);
fs.writeFileSync('.overhaul/MAP.md', md.join('\n') + '\n');
const noApp = rows.filter((r) => !r.app);
console.log('rows', rows.length, 'without app mapping', noApp.length);
console.log(noApp.map((r) => r.n + ' ' + r.label + ' [' + r.status + ']').join('\n'));
