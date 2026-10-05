import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
const src = JSON.stringify(fs.readFileSync('.overhaul/verify/day/hit.js', 'utf8'));
const [seed = '.overhaul/day-seed.js'] = process.argv.slice(2);
for (const [w, h] of [[393, 852]]) for (const [f, r] of [['m', '/day/morning']]) {
  let o;
  { const s = spawnSync('node', ['scripts/overhaul/shot.mjs', 'app', r, `.overhaul/verify/day/hit-${f}.png`, `--w=${w}`, `--h=${h}`, `--initseed=${seed}`, `--do=window.__HITSRC = ${src};`, `--script=.overhaul/verify/day/drv-hit-${f}.js`, '--wait=200'], { encoding: 'utf8' }); o = s.stdout + s.stderr; }
  console.log(`== ${w}x${h} ${r}\n` + o.split('\n').filter((l) => !l.startsWith('shot')).join('\n').replace(/","/g, '"\n"'));
}
