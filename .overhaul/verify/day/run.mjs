// Verifier runner: replay day recipes one at a time, capture, sigdiff + pxdiff.
// usage: node .overhaul/verify/day/run.mjs [frameLabelSubstr] [--w= --h=] [--nodiff] [--tag=x]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const only = args.filter((a) => !a.startsWith('--'));
const recipes = JSON.parse(fs.readFileSync('.overhaul/recipes/day.json', 'utf8'));
const OUT = '.overhaul/verify/day';
const sh = (argv) => { try { return execFileSync('node', argv, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return 'ERR ' + (e.stdout ?? '') + (e.stderr ?? ''); } };
for (const r of recipes) {
  if (only.length && !only.some((o) => r.frame.includes(o))) continue;
  if (r.unframed && !flags.unframed) continue;
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g, '-') + (flags.tag ? '-' + flags.tag : '');
  const png = `${OUT}/a-${slug}.png`;
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, png, `--sig=vday-a-${slug}`, `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (flags.w) argv.push(`--w=${flags.w}`);
  if (flags.h) argv.push(`--h=${flags.h}`);
  if (flags.scroll) argv.push(`--scroll=${flags.scroll}`);
  const s = sh(argv);
  console.log(`=== ${r.frame}\n${s.trim()}`);
  if (flags.w || flags.nodiff || !r.file) continue;
  const base = r.file.replace(/\.html$/, '');
  console.log(sh(['scripts/overhaul/sigdiff.mjs', `d-Email-Login-${base}`, `vday-a-${slug}`]).trim().split('\n').slice(-40).join('\n'));
  console.log(sh(['scripts/overhaul/pxdiff.mjs', `.overhaul/shots/design/Email-Login/${base}.png`, png, `${OUT}/${slug}`]).trim());
  for (const ext of ['diff', 'overlay']) fs.rmSync(`${OUT}/${slug}.${ext}.png`, { force: true });
}
