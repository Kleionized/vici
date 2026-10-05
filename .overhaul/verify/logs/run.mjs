// Replay one logs recipe: capture app, sigdiff, pxdiff. Usage: node run.mjs "<Frame Name>" [extra shot flags...]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const [name, ...extra] = process.argv.slice(2);
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/logs.json', 'utf8'));
const r = recipes.find((x) => x.frame === name);
if (!r) { console.error('no recipe', name); process.exit(1); }
const slug = name.replace(/ /g, '-');
const tag = (extra.find((e) => e.startsWith('--tag=')) || '').slice(6);
const flags = extra.filter((e) => !e.startsWith('--tag='));
const out = `.overhaul/verify/logs/a-${slug}${tag ? '-' + tag : ''}.png`;
const sig = `vl-${slug}${tag ? '-' + tag : ''}`;
const args = ['scripts/overhaul/shot.mjs', 'app', r.route, out, `--sig=${sig}`, `--wait=${r.wait ?? 900}`];
if (r.initseed) args.push(`--initseed=${r.initseed}`);
if (r.do) args.push(`--do=${r.do}`);
args.push(...flags);
try { console.log(execFileSync('node', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 180000, killSignal: 'SIGKILL' })); }
catch (e) { console.log('SHOT FAIL', e.stdout, e.stderr); process.exit(1); }
if (!tag) {
  try { console.log(execFileSync('node', ['scripts/overhaul/sigdiff.mjs', `d-Email-Login-${slug}`, sig], { encoding: 'utf8' })); } catch (e) { console.log(e.stdout, e.stderr); }
  try { console.log(execFileSync('node', ['scripts/overhaul/pxdiff.mjs', `.overhaul/shots/design/Email-Login/${slug}.png`, out], { encoding: 'utf8' })); } catch (e) { console.log(e.stdout, e.stderr); }
}
