// Shoots, diffs and records ledger rows.
//
//   node scripts/vici-ui-2/check.mjs <rowRegex> [--status=IMPLEMENTED] [--wait=1800] [--note=...] [--pass=N [--resume]]
//
// `--pass=N` marks each row it shoots as captured in verification pass N;
// with `--resume` a row already marked for pass N is skipped. Results are
// saved every 25 rows, so an interrupted run keeps what it did.
//
// For every ledger row matching the regex that has a harness target
// (groups.mjs): screenshot the app in that state, diff it against the row's
// design render (scripts/pixel-diff.mjs) and write the result and today's date
// onto the row. Prints one line per row; the images are in pixel-diff/out/.
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import { targetOf } from './groups.mjs';
import { shoot } from './shoot-app.mjs';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), ''] : [a.slice(2, i), a.slice(i + 1)]; }));
const re = new RegExp(args.find((a) => !a.startsWith('--')));
const ledger = JSON.parse(fs.readFileSync('scripts/vici-ui-2/ledger.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const run = promisify(execFile);
/** The diff of the row shot before this one runs while this one is shot (one at a time: the machine is small). */
let pending = Promise.resolve();
const done = new Map();
const pass = flags.pass ? Number(flags.pass) : null;
/** Merge what is done into the ledger as it is now (edits made meanwhile stand). */
function save() {
  const now = JSON.parse(fs.readFileSync('scripts/vici-ui-2/ledger.json', 'utf8'));
  for (const row of now.rows) if (done.has(row.id)) Object.assign(row, done.get(row.id));
  fs.writeFileSync('scripts/vici-ui-2/ledger.json', JSON.stringify(now, null, 1) + '\n');
}
let shot = 0;
for (const row of ledger.rows) {
  if (!re.test(row.id)) continue;
  if (pass != null && 'resume' in flags && (row.pass ?? 0) >= pass) continue;
  const t = targetOf(row);
  if (!t) { console.log(row.id, 'no harness target'); continue; }
  await shoot({ screen: t.screen, state: t.state, route: t.route, seed: t.seed, keepSeed: t.keepSeed, clock: t.clock, blur: t.blur, globals: t.globals, steps: t.steps, name: row.id, time: t.time, wait: Number(t.wait ?? flags.wait ?? 1800) });
  await pending;
  if (++shot % 25 === 0) save();
  pending = run('node', ['scripts/pixel-diff.mjs', `pixel-diff/design/${row.id}.png`, `pixel-diff/app/${row.id}.png`, row.id])
    .then((r) => r.stdout.toString(), (e) => String(e.stdout ?? e))
    .then((out) => {
      const m = out.match(/\(([\d.]+) %\)/);
      // a row whose share moved since it was last recorded
      const before = parseFloat(row.diff);
      if (m && Number.isFinite(before) && Math.abs(parseFloat(m[1]) - before) > 0.05) console.log(`MOVED ${row.id}: ${before} % → ${m[1]} %`);
      done.set(row.id, {
        harness: t.route ? `${t.route}${t.seed ? ` · seed ${t.seed}` : ''}${t.clock ? ` · clock ${t.clock}` : ''}` : `${t.screen}&state=${t.state}`,
        diff: m ? `${m[1]} %` : out.split('\n')[0],
        date: today,
        ...(flags.status ? { status: flags.status } : {}),
        ...(flags.note ? { note: flags.note } : {}),
        ...(pass != null ? { pass } : {}),
      });
      console.log(out.trim().split('\n').slice(0, 4).join('\n'));
    });
}
await pending;
save();
execFileSync('node', ['scripts/vici-ui-2/ledger.mjs', 'md']);
