#!/usr/bin/env node
// GROUP today, Phase 1 — replay .overhaul/recipes/today.json one frame at a time:
// capture, pxdiff against the design PNG, print the mismatch line. Strips land in
// .overhaul/shots/today/. `node .overhaul/r-today-p1.mjs [Frame label substring]`
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const only = process.argv[2];
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/today.json', 'utf8'));
for (const r of recipes) {
  if (only && !r.frame.includes(only)) continue;
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  const out = `.overhaul/shots/today/a-${slug}.png`;
  try {
    execFileSync('node', ['scripts/overhaul/shot.mjs', 'app', r.route, out, `--sig=a-today-${slug}`, `--initseed=${r.initseed}`, `--wait=${r.wait}`, `--do=${r.do}`], { stdio: ['ignore', 'pipe', 'pipe'] });
    const px = execFileSync('node', ['scripts/overhaul/pxdiff.mjs', `.overhaul/shots/design/Email-Login/${slug}.png`, out], { encoding: 'utf8' });
    console.log(r.frame.padEnd(22), (px.match(/mismatch [^\n]*/) || ['?'])[0], '|', (px.match(/regions[^\n]*\n((?:  [^\n]*\n){0,3})/) || ['', ''])[1].replace(/\n/g, ' ; '));
  } catch (e) {
    console.log(r.frame, 'FAILED', String(e.stderr || e).slice(-300));
  }
}
