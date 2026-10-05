// Tail verifier runner: replays .overhaul/recipes/tail.json one at a time, captures, sigdiffs, pxdiffs.
// usage: node .overhaul/verify/tail/run.mjs [labelFilter|...] [--w= --h= --scroll=] [--route-suffix=...]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2);
const filt = args.find((a) => !a.startsWith('--'));
const extra = args.filter((a) => a.startsWith('--') && !a.startsWith('--ignore=') && !a.startsWith('--tag='));
const ign = args.find((a) => a.startsWith('--ignore='));
const tag = (args.find((a) => a.startsWith('--tag=')) || '').slice(6);
const V = '.overhaul/verify/tail';
const idx = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames;
const fileOf = new Map(idx.map((f) => [f.label, f.file]));
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/tail.json', 'utf8'));
const sh = (argv) => { try { return execFileSync('node', argv, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return 'ERR ' + (e.stdout ?? '') + (e.stderr ?? ''); } };
for (const r of recipes) {
  if (r.unreachable) continue;
  if (filt && !filt.split('|').some((f) => r.frame === f || (f.endsWith('*') && r.frame.startsWith(f.slice(0, -1))))) continue;
  const file = fileOf.get(r.frame);
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-');
  const sz = extra.length ? '-' + extra.map((x) => x.replace(/[^0-9a-z]/g, '')).join('') : '';
  const a = `v-tail-${slug}${sz}${tag}`;
  const png = `${V}/${a}.png`;
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, png, `--sig=${a}`, `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.do) argv.push(`--do=${r.do}`);
  argv.push(...extra);
  const out = sh(argv);
  console.log(`=== ${r.frame} (${file ?? 'no frame'})\n` + out.trim().split('\n').filter((l) => !/rows ->|shot ->/.test(l)).join('\n'));
  if (!file || extra.some((x) => /--(w|h)=/.test(x))) continue;
  const d = `.overhaul/shots/design/Email-Login/${file.replace(/\.html$/, '.png')}`;
  const sig = sh(['scripts/overhaul/sigdiff.mjs', `d-Email-Login-${file.replace(/\.html$/, '')}`, a]);
  fs.writeFileSync(`${V}/${a}.sigdiff.txt`, sig);
  console.log('sig: ' + sig.trim().split('\n').pop());
  const pxa = [ 'scripts/overhaul/pxdiff.mjs', d, png, `${V}/${a}` ];
  if (ign) pxa.push(ign);
  const px = sh(pxa);
  console.log(px.trim().split('\n').slice(0, 10).join('\n'));
  for (const ext of ['diff', 'overlay']) fs.rmSync(`${V}/${a}.${ext}.png`, { force: true });
}
