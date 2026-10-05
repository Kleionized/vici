/* GROUP day, pass 2 — capture all 17 frames on both sides and diff each.
   Reads the same recipe table that .overhaul/recipes/day.json publishes. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const R = JSON.parse(fs.readFileSync('.overhaul/recipes/day.json', 'utf8'));
const only = process.argv.slice(2);
fs.mkdirSync('.overhaul/shots/fday', { recursive: true });
for (const r of R) {
  if (r.unreachable) { console.log(`${r.frame}: unreachable — ${r.unreachable}`); continue; }
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  if (only.length && !only.includes(slug)) continue;
  const d = `.overhaul/shots/fday/d-${slug}.png`;
  const a = `.overhaul/shots/fday/a-${slug}.png`;
  if (!fs.existsSync(d)) {
    execFileSync('node', ['scripts/overhaul/shot.mjs', 'design', 'Email-Login', r.file, d, `--sig=f-day-d-${slug}`], { stdio: 'inherit' });
  }
  const args = ['scripts/overhaul/shot.mjs', 'app', r.route, a, `--sig=f-day-a-${slug}`, `--initseed=${r.initseed}`, `--wait=${r.wait ?? 1200}`];
  if (r.script) args.push(`--script=${r.script}`);
  else if (r.do) args.push(`--do=${r.do}`);
  execFileSync('node', args, { stdio: 'inherit' });
  console.log(`\n### ${r.frame}`);
  execFileSync('node', ['.overhaul/fday-px.mjs', d, a, '8'], { stdio: 'inherit' });
}
