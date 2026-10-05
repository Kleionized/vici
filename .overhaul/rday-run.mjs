/* GROUP day, pass 2 VERIFY — independent capture of all 17 frames, sig prefix r-day-. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const R = JSON.parse(fs.readFileSync('.overhaul/recipes/day.json', 'utf8'));
const only = process.argv.slice(2);
fs.mkdirSync('.overhaul/shots/rday', { recursive: true });
for (const r of R) {
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  if (only.length && !only.includes(slug)) continue;
  const d = `.overhaul/shots/rday/d-${slug}.png`;
  const a = `.overhaul/shots/rday/a-${slug}.png`;
  if (!fs.existsSync(d)) {
    execFileSync('node', ['scripts/overhaul/shot.mjs', 'design', 'Email-Login', r.file, d, `--sig=r-day-d-${slug}`], { stdio: 'inherit' });
  }
  const args = ['scripts/overhaul/shot.mjs', 'app', r.route, a, `--sig=r-day-a-${slug}`, `--initseed=${r.initseed}`, `--wait=${r.wait ?? 1200}`];
  if (r.script) args.push(`--script=${r.script}`);
  else if (r.do) args.push(`--do=${r.do}`);
  try { execFileSync('node', args, { stdio: 'inherit' }); } catch (e) { console.log(`CAPTURE FAILED ${r.frame}`); continue; }
  console.log(`\n### ${r.frame}`);
  execFileSync('node', ['.overhaul/rday-px.mjs', d, a, '8'], { stdio: 'inherit' });
}
