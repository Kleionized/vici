// Three-way merge of a generated content file whose records are one JSON object
// per line (`  {"id":…},`): base = the generator run on the previous bundle,
// next = the same generator run on `Vici UI 2`, app = the file as the app has it
// (the base plus the owner's later edits, e.g. the 10 Oct copy pass).
//
// Field by field: where the new bundle changed a value, the new value; where it
// left a value as it was, the app's (D28). Every other line comes from `next`.
//
//   node scripts/vici-ui-2/merge3.mjs <base> <next> <app> <out> [--key=id]
import fs from 'node:fs';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [basePath, nextPath, appPath, outPath] = args.filter((a) => !a.startsWith('--'));
const KEY = flags.key ?? 'id';
const REC = /^(\s*)(\{.*\})(,?)\s*$/;

const records = (text) => {
  const out = new Map();
  for (const line of text.split('\n')) {
    const m = REC.exec(line);
    if (!m) continue;
    try {
      const o = JSON.parse(m[2]);
      if (o && o[KEY] != null) out.set(String(o[KEY]), o);
    } catch {}
  }
  return out;
};
const base = records(fs.readFileSync(basePath, 'utf8'));
const app = records(fs.readFileSync(appPath, 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const log = [];

function merge(b, n, a, at) {
  if (same(n, b)) return a; // the bundle left it: the app's value stands
  if (same(a, b) || a === undefined) return n; // the app never touched it: the bundle's new value
  // both changed: objects merge key by key; anything else takes the bundle's
  if (n && a && b && typeof n === 'object' && typeof a === 'object' && typeof b === 'object' && !Array.isArray(n)) {
    const out = {};
    for (const k of new Set([...Object.keys(n), ...Object.keys(a)])) out[k] = merge(b[k], n[k], a[k], `${at}.${k}`);
    return out;
  }
  log.push(`${at}: both changed — the bundle's ${JSON.stringify(n).slice(0, 80)} over the app's ${JSON.stringify(a).slice(0, 80)}`);
  return n;
}

const lines = fs.readFileSync(nextPath, 'utf8').split('\n').map((line) => {
  const m = REC.exec(line);
  if (!m) return line;
  let n;
  try { n = JSON.parse(m[2]); } catch { return line; }
  const id = n?.[KEY];
  if (id == null || !base.has(String(id)) || !app.has(String(id))) return line;
  const merged = merge(base.get(String(id)), n, app.get(String(id)), String(id));
  return `${m[1]}${JSON.stringify(merged)}${m[3]}`;
});
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`merged → ${outPath}${log.length ? `\n${log.join('\n')}` : ''}`);
