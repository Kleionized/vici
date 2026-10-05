#!/usr/bin/env node
/* Capture both sides of every medallions frame, sig prefix r-medallions-. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const map = JSON.parse(fs.readFileSync('.vicifull/map.json', 'utf8'));
const recipes = JSON.parse(fs.readFileSync('.vicifull/recipes/medallions.json', 'utf8')).filter((r) => r.frame);
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));

for (const r of recipes) {
  if (only.length && !only.includes(r.frame)) continue;
  const m = map.find((x) => x.label === r.frame);
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  const d = `r-medallions-d-${slug}`;
  const a = `r-medallions-a-${slug}`;
  const dpng = `.vicifull/shots/${d}.png`;
  const apng = `.vicifull/shots/${a}.png`;
  const run = (argv) => {
    try { execFileSync('node', argv, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }); return ''; }
    catch (e) { return 'FAIL ' + ((e.stdout ?? '') + (e.stderr ?? '')).slice(0, 400); }
  };
  let err = run(['scripts/vicifull/shot.mjs', 'design', 'Email-Login', m.file, dpng, `--sig=${d}`]);
  const argv = ['scripts/vicifull/shot.mjs', 'app', r.route, apng, `--sig=${a}`, `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.seed === true) argv.push('--seed');
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (r.settle) argv.push(`--settle=${r.settle}`);
  if (r.fast) argv.push('--fast');
  err += run(argv);
  console.log(`${r.frame.padEnd(26)} ${err ? err : 'ok'}`);
}
