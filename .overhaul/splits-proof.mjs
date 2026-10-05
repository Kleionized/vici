/*
 * Part E (splits, D394): the before/after captures that prove the three file
 * splits changed nothing. One Chrome at a time.
 *
 *   node .overhaul/splits-proof.mjs <prefix> [name,...]
 *   node scripts/overhaul/pxdiff.mjs .overhaul/shots/splits/b-<n>.png .overhaul/shots/splits/a-<n>.png --t=0 --keep-chrome --ignore=0,788,64,64
 *
 * The hub and Surf Complete read the wall clock (session timer, "x days ago"),
 * so their seeds are prefixed with a frozen Date and both runs see one instant.
 * Expo's rebuild badge (x 0-64, y 788-852) is any agent's HMR, not the app.
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const S = '.overhaul/shots/splits';
fs.mkdirSync(S, { recursive: true });
const CLOCK = '/* Freeze the wall clock for a before/after capture pair: Date.now() and new Date()\n   return one fixed instant, so the hub\'s live session clock and every\n   "x days ago" read the same on both captures. */\n(() => {\n  const T = Date.UTC(2026, 9, 4, 20, 30, 0);\n  const RD = Date;\n  function FD(...a) { if (!(this instanceof FD)) return new RD(T).toString(); return a.length ? new RD(...a) : new RD(T); }\n  FD.prototype = RD.prototype;\n  FD.now = () => T;\n  FD.UTC = RD.UTC;\n  FD.parse = RD.parse;\n  window.Date = FD;\n})();\n';
const ANIM = '/* Freeze animation time as well: performance.now() and every rAF timestamp\n   read one instant, so a looping Reanimated/CSS-driven scale is caught at the\n   same phase on every capture. Timers (setTimeout/setInterval) still run. */\n(() => {\n  const P = 1000;\n  performance.now = () => P;\n  window.requestAnimationFrame = (cb) => setTimeout(() => cb(P), 16);\n  window.cancelAnimationFrame = (id) => clearTimeout(id);\n})();\n';
fs.writeFileSync(`${S}/frozen2-hub-seed.js`, ANIM + CLOCK + '\n' + fs.readFileSync('.overhaul/hub-seed.js', 'utf8'));
for (const s of ['hub-seed', 'sos-seed']) fs.writeFileSync(`${S}/frozen-${s}.js`, CLOCK + '\n' + fs.readFileSync(`.overhaul/${s}.js`, 'utf8'));
const [prefix, only] = process.argv.slice(2);
const D = '.overhaul/drives/';
const CAPS = {
  // urge split
  'u-intro': ['/urge', '--wait=1800'],
  'u-strength': ['/urge', "--do=await tap('Start the interrupt')", '--wait=1600'],
  'u-where': ['/urge', "--do=await tap('Start the interrupt'); await tap('Continue')", '--wait=1600'],
  'u-locbed': ['/urge', `--script=${D}b-SOS-Loc-Bed.js`, '--wait=900'],
  'u-challenge': ['/urge', `--script=${D}b-SOS-Challenge.js`, '--wait=900'],
  'u-done': ['/urge', `--initseed=${S}/frozen-sos-seed.js`, `--script=${D}sos-done.js`, '--wait=1600'],
  'u-hub': ['/urge-hub', `--initseed=${S}/frozen-hub-seed.js`, '--wait=1400'],
  'u-hub2': ['/urge-hub', `--initseed=${S}/frozen-hub-seed.js`, `--script=${D}hub-pane2.js`, '--wait=1400'],
  'u-hubbreathe': ['/urge-hub', `--initseed=${S}/frozen-hub-seed.js`, `--script=${D}hub-breathe.js`, '--wait=1200'],
  // the breathing orb scales on a Reanimated clock, so its capture also freezes
  // performance.now() and every rAF timestamp (one instant, every run)
  'u-hubbreathe-f': ['/urge-hub', `--initseed=${S}/frozen2-hub-seed.js`, `--script=${D}hub-breathe.js`, '--wait=1200'],
  // v3 split
  'v-name': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', '--do=window.__N=0;', `--script=${D}funnel-walk.js`, '--wait=900'],
  'v-q1': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', `--do=window.__N=4; window.__AFTER="const st=window.setTimeout; window.setTimeout=(fn,ms)=>(ms===260?0:st(fn,ms)); await t('A few times a week')";`, `--script=${D}funnel-walk.js`, '--wait=900'],
  'v-q5': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', `--do=window.__N=9; window.__AFTER="await t('Late at night'); await t('When I’m stressed'); await t('While scrolling')";`, `--script=${D}funnel-walk.js`, '--wait=900'],
  'v-gate': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', "--do=await window.typeIn(0,'Sam'); await window.tap('Continue',{wait:520}); await window.typeIn(0,'15'); await window.tap('Continue',{wait:520})", '--wait=900'],
  // handover split (+ O3Reading/O3Shell, which stay in v3 / move to funnel)
  'h-map': ['/welcome', '--initseed=.overhaul/letters-onb-seed.js', "--do=window.__H='map1'", `--script=${D}handover-walk.js`, '--wait=1200'],
  'h-letter': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', "--do=window.__H='letter'", `--script=${D}handover-walk.js`, '--wait=1400'],
  'h-rem': ['/welcome', '--initseed=.overhaul/f-funnel-user.js', "--do=window.__H='rem'", `--script=${D}handover-walk.js`, '--wait=1200'],
  'h-day0': ['/welcome', '--initseed=.overhaul/f-pw-funnel-seed.js', `--script=${D}v-pw-dayzero.js`, '--wait=1600'],
  'h-letterroute': ['/letter?variant=week12', '--initseed=.overhaul/letters-seed.js', "--do=await new Promise(r => setTimeout(r, 1300)); await tap('Open it'); await new Promise(r => setTimeout(r, 1200))", '--wait=800'],
  'h-reminders': ['/reminders', '--do=await __sleep(1500)', '--wait=1400'],
};
const names = only ? only.split(',') : Object.keys(CAPS);
for (const n of names) {
  const [route, ...flags] = CAPS[n];
  const out = `.overhaul/shots/splits/${prefix}-${n}.png`;
  const t0 = Date.now();
  const r = spawnSync('node', ['scripts/overhaul/shot.mjs', 'app', route, out, ...flags], { encoding: 'utf8', timeout: 240000 });
  const err = (r.stderr || '').split('\n').filter((l) => /fonts|pageerror|Error|never saw|no control/.test(l)).join(' | ');
  console.log(`${n}: ${((Date.now() - t0) / 1000).toFixed(1)}s exit=${r.status} ${(r.stdout || '').trim().split('\n').filter((l) => !l.startsWith('shot')).join(' | ').slice(0, 160)} ${err.slice(0, 400)}`);
}
