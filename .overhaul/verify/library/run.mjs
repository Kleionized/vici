// Verifier runner: replays .overhaul/recipes/library.json one frame at a time,
// captures the app, sigdiffs + pxdiffs against the stored design capture.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/library.json', 'utf8'));
const idx = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames;
const OUT = '.overhaul/verify/library';
for (const r of recipes) {
  if (only && !only.test(r.frame)) continue;
  const f = idx.find((x) => x.label === r.frame);
  if (!f) { console.log('NO FRAME', r.frame); continue; }
  const slug = f.file.replace(/\.html$/, '');
  const png = `${OUT}/a-${slug}.png`;
  const args = ['scripts/overhaul/shot.mjs', 'app', r.route, png, `--sig=v-lib-${slug}`];
  if (r.initseed) args.push(`--initseed=${r.initseed}`);
  if (r.do) args.push(`--do=${r.do}`);
  if (r.wait) args.push(`--wait=${r.wait}`);
  let out = '';
  try { out = execFileSync('node', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  console.log('=== ' + r.frame + '\n' + out.trim());
  let sd = '';
  try { sd = execFileSync('node', ['scripts/overhaul/sigdiff.mjs', `d-Email-Login-${slug}`, `v-lib-${slug}`], { encoding: 'utf8' }); } catch (e) { sd = (e.stdout || '') + (e.stderr || ''); }
  console.log('--- sigdiff\n' + sd.trim().split('\n').slice(0, 40).join('\n'));
  let pd = '';
  try { pd = execFileSync('node', ['scripts/overhaul/pxdiff.mjs', `.overhaul/shots/design/Email-Login/${slug}.png`, png], { encoding: 'utf8' }); } catch (e) { pd = (e.stdout || '') + (e.stderr || ''); }
  console.log('--- pxdiff\n' + pd.trim().split('\n').slice(0, 14).join('\n'));
}
