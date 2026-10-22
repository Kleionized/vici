// The run's ledger: scripts/vici-ui-2/ledger.json is the record, VICI_UI_2_LEDGER.md
// its readable table. Every artboard of every canvas in `Vici UI 2` is one row.
//
//   node scripts/vici-ui-2/ledger.mjs init                 rows from pixel-diff/design/index.json (keeps existing fields)
//   node scripts/vici-ui-2/ledger.mjs set <regex> k=v ...  set fields on every row whose id matches
//   node scripts/vici-ui-2/ledger.mjs show <regex>         print matching rows
//   node scripts/vici-ui-2/ledger.mjs md                   rewrite VICI_UI_2_LEDGER.md
import fs from 'node:fs';

const JSON_PATH = 'scripts/vici-ui-2/ledger.json';
const MD_PATH = 'VICI_UI_2_LEDGER.md';
export const STATUSES = ['NOT_STARTED', 'SPEC_EXTRACTED', 'IMPLEMENTED', 'DIFF_CLEAN', 'PASS_1', 'PASS_2', 'PASS_3', 'DONE', 'SUPERSEDED'];

const load = () => (fs.existsSync(JSON_PATH) ? JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')) : { rows: [] });
const save = (l) => fs.writeFileSync(JSON_PATH, JSON.stringify(l, null, 1) + '\n');

function md(l) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const r of l.rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
  const out = [
    '# Vici UI 2 — ledger',
    '',
    'Design folder: `/Users/admin/Documents/Vici/Vici UI 2` (quote it in every shell command).',
    'Starting branch: `vici-overhaul-final` · work branch: `vici-ui-2` · baseline commit `a28abcc4`.',
    '',
    'Generated from `scripts/vici-ui-2/ledger.json` by `node scripts/vici-ui-2/ledger.mjs md`. Edit the JSON (or use `set`), never this table.',
    '',
    `Rows: ${l.rows.length} · ` + STATUSES.map((s) => `${s} ${counts[s]}`).join(' · '),
    '',
    '| id | design file | artboard | app file | spec | harness | status | diff | verified | note |',
    '|---|---|---|---|---|---|---|---|---|---|',
    ...l.rows.map((r) => `| ${r.id} | ${esc(r.file)} | ${esc(r.label)} | ${esc(r.app)} | ${esc(r.spec)} | ${esc(r.harness)} | ${r.status} | ${esc(r.diff)} | ${esc(r.date)} | ${esc(r.note)} |`),
    '',
  ];
  fs.writeFileSync(MD_PATH, out.join('\n'));
}

const [cmd, ...args] = process.argv.slice(2);
const l = load();
if (cmd === 'init') {
  const idx = JSON.parse(fs.readFileSync('pixel-diff/design/index.json', 'utf8'));
  const old = Object.fromEntries(l.rows.map((r) => [r.id, r]));
  const rows = [];
  for (const [file, v] of Object.entries(idx))
    for (const r of v.rows)
      rows.push({ id: r.name, file, sec: r.sec, label: r.label, screen: r.screen, size: `${Math.round(r.w)}x${Math.round(r.h)}`, app: '', harness: '', status: 'NOT_STARTED', diff: '', date: '', note: '', ...old[r.name] });
  l.rows = rows;
  save(l);
  md(l);
  console.log(rows.length, 'rows');
} else if (cmd === 'set') {
  const re = new RegExp(args[0]);
  const kv = Object.fromEntries(args.slice(1).map((a) => [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)]));
  if (kv.status && !STATUSES.includes(kv.status)) throw new Error('bad status ' + kv.status);
  let n = 0;
  for (const r of l.rows) if (re.test(r.id)) { Object.assign(r, kv); n++; }
  save(l);
  md(l);
  console.log(n, 'rows set');
} else if (cmd === 'show') {
  const re = new RegExp(args[0] ?? '.');
  for (const r of l.rows) if (re.test(r.id)) console.log([r.id, r.label, r.app, r.status, r.diff, r.note].join(' | '));
} else if (cmd === 'md') md(l);
else console.log('usage: ledger.mjs init | set <regex> k=v ... | show <regex> | md');
