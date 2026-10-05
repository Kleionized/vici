// node sweep.mjs <w> <h> <frame label>... — capture recipes at a size, then a contact sheet
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
const [w, h, ...labels] = process.argv.slice(2);
const recs = JSON.parse(fs.readFileSync('.overhaul/recipes/auth-funnel.json', 'utf8'));
const files = [];
for (const label of labels) {
  const r = recs.find((x) => x.frame === label);
  if (!r) { console.error('no recipe ' + label); continue; }
  const out = `.overhaul/shots/af/sz/${label.replace(/[^A-Za-z0-9]+/g, '-')}-${w}.png`;
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, out, `--w=${w}`, `--h=${h}`, '--dpr=1', `--wait=${r.wait ?? 1600}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (r.fast) argv.push('--fast');
  if (r.scroll != null) argv.push(`--scroll=${r.scroll}`);
  try { execFileSync('node', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); files.push(out); process.stderr.write('ok ' + label + '\n'); }
  catch (e) { process.stderr.write('FAIL ' + label + ' ' + String(e.stderr).slice(-300) + '\n'); }
}
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const gap = 8;
const W = imgs.reduce((a, i) => a + i.width + gap, 0), H = Math.max(...imgs.map((i) => i.height));
const sheet = new PNG({ width: W, height: H });
sheet.data.fill(255);
let x = 0;
for (const i of imgs) { PNG.bitblt(i, sheet, 0, 0, i.width, i.height, x, 0); x += i.width + gap; }
const name = `.overhaul/shots/af/sz/sheet-${w}-${labels.length}-${Date.now() % 100000}.png`;
fs.writeFileSync(name, PNG.sync.write(sheet));
console.log(name);
