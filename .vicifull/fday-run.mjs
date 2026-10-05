/* GROUP day, pass 2 — capture all 17 frames on both sides and diff each.
   Reads the same recipe table that .vicifull/recipes/day.json publishes. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const R = JSON.parse(fs.readFileSync('.vicifull/recipes/day.json', 'utf8'));
const only = process.argv.slice(2);
fs.mkdirSync('.vicifull/shots/fday', { recursive: true });
for (const r of R) {
  if (r.unreachable) { console.log(`${r.frame}: unreachable — ${r.unreachable}`); continue; }
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  if (only.length && !only.includes(slug)) continue;
  const d = `.vicifull/shots/fday/d-${slug}.png`;
  const a = `.vicifull/shots/fday/a-${slug}.png`;
  if (!fs.existsSync(d)) {
    execFileSync('node', ['scripts/vicifull/shot.mjs', 'design', 'Email-Login', r.file, d, `--sig=f-day-d-${slug}`], { stdio: 'inherit' });
  }
  const args = ['scripts/vicifull/shot.mjs', 'app', r.route, a, `--sig=f-day-a-${slug}`, `--initseed=${r.initseed}`, `--wait=${r.wait ?? 1200}`];
  if (r.script) args.push(`--script=${r.script}`);
  else if (r.do) args.push(`--do=${r.do}`);
  execFileSync('node', args, { stdio: 'inherit' });
  console.log(`\n### ${r.frame}`);
  execFileSync('node', ['.vicifull/fday-px.mjs', d, a, '8'], { stdio: 'inherit' });
}
