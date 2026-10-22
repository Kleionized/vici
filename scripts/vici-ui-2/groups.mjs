// Which harness state draws each ledger row: row id → { screen, state, time }.
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('Vici UI 2/project/sos-library.js', 'utf8'), ctx);
const L = ctx.window.SOS_LIB;

/** The status bar's time for a frame clock "HH:MM" (no clock → the renders' 09:41), as the ISO time simctl takes. */
const h12 = (c = '09:41') => new Date(2026, 9, 21, Number(c.split(':')[0]), Number(c.split(':')[1])).toISOString();

const SOS_IDS = ['live', 's01', 's02', 's02b', 's03', 's03b', 's04', 's05', 's05b', 's05d', 's06', 's06b', 's06d', 's06e', 's06f', 's07', 's07b', 's07c', 's07d', 's08', 's08b'];
const CLOCK = { s05: '00:20', s05b: '15:00', s05d: '14:00', s06: '15:00', s06b: '00:20', s06d: '15:00', s06e: '15:00', s06f: '15:00', s07: '14:00', s07b: '14:00', s07c: '15:00', s07d: '15:00', s08: '14:00', s08b: '15:00' };
const SIT_CLOCK = { A: '15:10', B: '00:20', C: '08:10', D: '15:00', E: '14:00', F: '18:30', G: '19:00', H: '11:00', I: '21:30', J: '16:30', K: '14:00', L: '17:30' };
const OVR_CLOCK = { I05: '23:30', I07: '13:00', I08: '13:00' };
const sosSeq = [...SOS_IDS.map((id) => ({ state: id, time: h12(CLOCK[id]) })), ...'ABCDEFGHIJKL'.split('').flatMap((s) => L.acts.filter((a) => a.sit === s).map((a) => ({ state: a.id, time: h12(OVR_CLOCK[a.id] ?? SIT_CLOCK[s]) })))];

const html = fs.readFileSync('Vici UI 2/project/Vici Relapse.dc.html', 'utf8');
const MSG = [...html.matchAll(/\['(E\d{3})', '([a-z ]+)', \[([^\]]*)\]/g)].map((m) => [m[1], m[2], m[3]]);
const relClock = (m) => (m[2].includes('current_evening') ? '19:30' : m[1] === 'sleep' ? '23:40' : m[1] === 'time remaining' ? '15:10' : '21:42');
const REL_CLOCK = { live: '09:41', r04: '15:10', r04b: '10:20', r04c: '23:40' };
const relapseSeq = [
  'live', 'r01', 'r01b', 'r01c', 'r01c2', 'r01d', 'r01e', 'r02', 'r02b', 'r02c', 'r02d', 'r02e', 'r02f', 'r03', 'r03b', 'r04', 'r04b', 'r04c', 'r05',
  'r01f', 'r02g', 'r04d', 'r04e',
].map((id) => ({ state: id, time: h12(REL_CLOCK[id] ?? '21:42'), specOnly: ['r01f', 'r02g', 'r04d', 'r04e'].includes(id) }))
  .concat(MSG.map((m) => ({ state: `m${m[0]}`, time: h12(relClock(m)) })))
  .concat([['Q01', 'E025'], ['Q02', 'E002'], ['Q03', 'E009'], ['Q04', 'E041']].map(([q, e]) => ({ state: `q${q}`, time: h12(q === 'Q04' ? '23:40' : relClock(MSG.find((m) => m[0] === e))) })));

// onboarding: the funnel's steps by their canvas label, the plan and the tail by step id
const FUNNEL = Object.fromEntries([...fs.readFileSync('src/content/onboardingFunnel.ts', 'utf8').matchAll(/"id":"([a-zA-Z0-9]+)","label":"([^"]*)"/g)].map((m) => [m[2], m[1]]));
const TAIL = {
  'Enlisting Aegis': 'plan-together&hold=1', 'Where We’d Start': 'whered-start', 'Start Here': 'start-here', 'Start Here Step 1': 'start-here-1', 'Start Here Step 2': 'start-here-2',
  'Your Plan': 'your-plan', 'Starting Score': 'starting-point', 'Cost Next 30': 'next30', 'Cost Next 365': 'one-year', 'Cost By Age 80': 'age80',
  'Line If Nothing Changes': 'line-nothing', 'Line With the Plan': 'line-plan', 'A Clean Day': 'clean-day', 'One Bad Day': 'one-bad-day', 'What You Want Back': 'want-back',
  'Letter Received': 'letter-arrived', 'Letter Week XII': 'letter-read', 'The Vow': 'vow', 'Medallion Received': 'medallion', 'Reminders Setup': 'reminders', 'Day Zero': 'day-zero',
};
const ROUTES = {
  Splash: { route: '/splash', seed: '-' },
  Login: { route: '/sign-in', seed: '-' },
  'Welcome Back': { route: '/welcome-back', seed: '-' },
  Paywall: { route: '/paywall', seed: 'v-premium-seed' },
  'Manage Subscription': { route: '/subscription', seed: 'f-pw-sub-dated' },
};

export function targetOf(row) {
  const [file, n] = row.id.split('__');
  // the lesson readers: `L<day> Frame <k>` → the reader on that page
  const lesson = /^L(\d+) Frame (\d+)$/.exec(row.screen ?? '');
  if (/^w\d\d$/.test(file) && lesson) return { route: `/lesson/day/${lesson[1]}?page=${lesson[2]}`, seed: 'library-seed', time: h12() };
  const i = Number(n);
  if (file === 'sos') return { screen: 'sos', ...sosSeq[i] };
  if (file === 'app' && i >= 102 && i <= 242) return { screen: 'sos', ...sosSeq[i - 102] };
  if (file === 'app' && i === 293) return { screen: 'chooser', state: 'main', time: h12() };
  if (file === 'app' && i <= 49) {
    if (FUNNEL[row.screen]) return { route: `/welcome?step=${FUNNEL[row.screen]}`, seed: 'f-funnel-user', time: h12(), wait: 2500 };
    if (TAIL[row.screen]) return { route: `/welcome?step=${TAIL[row.screen]}`, seed: row.screen === 'The Vow' ? 'tail-vow-seed' : 'tail-session-seed', time: h12(), wait: 2500 };
    if (ROUTES[row.screen]) return { ...ROUTES[row.screen], time: h12(), wait: 2500 };
  }
  const rel = file === 'relapse' ? relapseSeq[i] : file === 'app' && i >= 294 && i <= 368 ? relapseSeq[i - 294] : null;
  if (rel) return rel.specOnly ? null : { screen: 'relapse', ...rel };
  return null;
}
