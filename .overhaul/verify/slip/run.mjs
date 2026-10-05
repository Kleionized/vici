// Independent verifier runner for group slip. Usage: node .overhaul/verify/slip/run.mjs [frameLabelSubstr] [--w= --h= --scroll=] [--nodiff]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2);
const flag = (n) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : null; };
const only = args.filter((a) => !a.startsWith('--'));
const W = flag('w'), H = flag('h'), SCROLL = flag('scroll'), TAG = flag('tag') ?? '';
const nodiff = args.includes('--nodiff');
const idx = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames;
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/slip.json', 'utf8')).filter((r) => r.frame);
const OUT = '.overhaul/verify/slip';
for (const r of recipes) {
  if (only.length && !only.some((o) => r.frame === o)) continue;
  const f = idx.find((x) => x.label === r.frame);
  if (!f) { console.log('NO FRAME', r.frame); continue; }
  const slug = f.file.replace(/\.html$/, '') + (TAG ? '-' + TAG : '');
  const png = `${OUT}/a-${slug}.png`;
  const sig = `vslip-${slug}`;
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, png, `--sig=${sig}`, `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (W) argv.push(`--w=${W}`); if (H) argv.push(`--h=${H}`);
  if (SCROLL) argv.push(`--scroll=${SCROLL}`);
  let out = '';
  try { out = execFileSync('node', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }); }
  catch (e) { out = (e.stdout ?? '') + (e.stderr ?? ''); console.log('CAPTURE FAIL', r.frame, out.slice(-500)); continue; }
  console.log(`== ${r.frame}  ${out.trim().split('\n').filter((l) => /fonts|pageerror|console|scroll|do ->/.test(l)).join(' / ')}`);
  if (nodiff || W) continue;
  const dPng = `.overhaul/shots/design/Email-Login/${f.file.replace(/\.html$/, '.png')}`;
  const dSig = `d-Email-Login-${f.file.replace(/\.html$/, '')}`;
  let sd = '';
  try { sd = execFileSync('node', ['scripts/overhaul/sigdiff.mjs', dSig, sig], { encoding: 'utf8' }); } catch (e) { sd = (e.stdout ?? '') + (e.stderr ?? ''); }
  fs.writeFileSync(`${OUT}/${slug}.sigdiff.txt`, sd);
  let px = '';
  try { px = execFileSync('node', ['scripts/overhaul/pxdiff.mjs', dPng, png, `${OUT}/${slug}`], { encoding: 'utf8' }); } catch (e) { px = (e.stdout ?? '') + (e.stderr ?? ''); }
  for (const ext of ['diff', 'overlay']) fs.rmSync(`${OUT}/${slug}.${ext}.png`, { force: true });
  console.log('   sig: ' + sd.trim().split('\n').pop());
  console.log('   px : ' + px.trim().split('\n').slice(0, 4).join(' / '));
}
