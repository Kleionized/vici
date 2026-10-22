// Shoots, diffs and records ledger rows.
//
//   node scripts/vici-ui-2/check.mjs <rowRegex> [--status=IMPLEMENTED] [--wait=1800] [--note=...]
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
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)]; }));
const re = new RegExp(args.find((a) => !a.startsWith('--')));
const ledger = JSON.parse(fs.readFileSync('scripts/vici-ui-2/ledger.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const run = promisify(execFile);
/** The diff of the row shot before this one runs while this one is shot (one at a time: the machine is small). */
let pending = Promise.resolve();
const done = new Map();
for (const row of ledger.rows) {
  if (!re.test(row.id)) continue;
  const t = targetOf(row);
  if (!t) { console.log(row.id, 'no harness target'); continue; }
  await shoot({ screen: t.screen, state: t.state, route: t.route, seed: t.seed, keepSeed: t.keepSeed, clock: t.clock, blur: t.blur, globals: t.globals, steps: t.steps, name: row.id, time: t.time, wait: Number(t.wait ?? flags.wait ?? 1800) });
  await pending;
  pending = run('node', ['scripts/pixel-diff.mjs', `pixel-diff/design/${row.id}.png`, `pixel-diff/app/${row.id}.png`, row.id])
    .then((r) => r.stdout.toString(), (e) => String(e.stdout ?? e))
    .then((out) => {
      const m = out.match(/\(([\d.]+) %\)/);
      done.set(row.id, {
        harness: t.route ? `${t.route}${t.seed ? ` · seed ${t.seed}` : ''}${t.clock ? ` · clock ${t.clock}` : ''}` : `${t.screen}&state=${t.state}`,
        diff: m ? `${m[1]} %` : out.split('\n')[0],
        date: today,
        ...(flags.status ? { status: flags.status } : {}),
        ...(flags.note ? { note: flags.note } : {}),
      });
      console.log(out.trim().split('\n').slice(0, 4).join('\n'));
    });
}
await pending;
// merged into the ledger as it is now, so edits made while the run went on stand
const now = JSON.parse(fs.readFileSync('scripts/vici-ui-2/ledger.json', 'utf8'));
for (const row of now.rows) if (done.has(row.id)) Object.assign(row, done.get(row.id));
fs.writeFileSync('scripts/vici-ui-2/ledger.json', JSON.stringify(now, null, 1) + '\n');
execFileSync('node', ['scripts/vici-ui-2/ledger.mjs', 'md']);
