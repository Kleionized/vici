// Independent verifier runner: replay auth-funnel recipes one at a time.
// node .overhaul/verify/auth-funnel/run.mjs [--only=Label,Label] [--w= --h=] [--suffix=] [--scroll=]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2);
const flag = (n, d) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const only = flag('only', '') ? flag('only', '').split(',') : null;
const W = flag('w', ''), H = flag('h', ''), suffix = flag('suffix', ''), scroll = flag('scroll', '');
const nodiff = args.includes('--nodiff');
const OUT = '.overhaul/verify/auth-funnel';
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/auth-funnel.json', 'utf8'));
const idx = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames;
const fileOf = new Map(idx.map((f) => [f.label, f.file]));
const sh = (argv) => { try { return execFileSync('node', argv, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return 'FAIL ' + (e.stdout ?? '') + (e.stderr ?? ''); } };
for (const r of recipes) {
  if (r.unreachable) continue;
  if (only && !only.includes(r.frame)) continue;
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-') + suffix;
  const png = `${OUT}/a-${slug}.png`;
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, png, `--sig=vaf-${slug}`, `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (r.fast) argv.push('--fast');
  if (r.settle != null) argv.push(`--settle=${r.settle}`);
  if (W) argv.push(`--w=${W}`, `--h=${H}`);
  if (scroll) argv.push(`--scroll=${scroll}`);
  const t0 = Date.now();
  const so = sh(argv);
  console.log(`=== ${r.frame} (${((Date.now() - t0) / 1000).toFixed(1)}s)\n` + so.trim().split('\n').filter((l) => !/^shot ->|rows ->/.test(l)).join('\n'));
  const file = fileOf.get(r.frame);
  if (nodiff || !file || W) continue;
  const base = file.replace(/\.html$/, '');
  const sd = sh(['scripts/overhaul/sigdiff.mjs', `d-Email-Login-${base}`, `vaf-${slug}`]);
  fs.writeFileSync(`${OUT}/sig-${slug}.txt`, sd);
  console.log('sig: ' + sd.trim().split('\n').pop());
  const px = sh(['scripts/overhaul/pxdiff.mjs', `.overhaul/shots/design/Email-Login/${base}.png`, png, `${OUT}/s-${slug}`]);
  console.log('px: ' + px.trim().split('\n').slice(0, 6).join(' | '));
  for (const ext of ['diff', 'overlay']) fs.rmSync(`${OUT}/s-${slug}.${ext}.png`, { force: true });
}
