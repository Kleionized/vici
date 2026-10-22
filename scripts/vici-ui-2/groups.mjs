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
// what each question's frame draws chosen (the generator's `drawnSelected`), as that board's answer
const DRAWN = Object.fromEntries([...fs.readFileSync('src/content/onboardingFunnel.ts', 'utf8').matchAll(/^\s*(\{"id":.*\}),?\s*$/gm)].map((m) => JSON.parse(m[1]))
  .filter((r) => (r.kind === 'list' || r.kind === 'chips') && r.drawnSelected?.length)
  .map((r) => [r.id, r.multi ? r.drawnSelected.map((i) => r.options[i]) : r.options[r.drawnSelected[0]]]));
// the man the tail frames draw: `25 · Where We’d Start` pills his three triggers
const TAIL_MAN = { triggers: ['Late at night', 'When I’m home alone', 'While scrolling'] };
const TAIL = {
  'Enlisting Aegis': 'plan-together&hold=1', 'Where We’d Start': 'whered-start', 'Start Here': 'start-here', 'Start Here Step 1': 'start-here-1', 'Start Here Step 2': 'start-here-2',
  'Your Plan': 'your-plan', 'Starting Score': 'starting-point', 'Cost Next 30': 'next30', 'Cost Next 365': 'one-year', 'Cost By Age 80': 'age80',
  'Line If Nothing Changes': 'line-nothing', 'Line With the Plan': 'line-plan', 'A Clean Day': 'clean-day', 'One Bad Day': 'one-bad-day', 'What You Want Back': 'want-back',
  'Letter Received': 'letter-arrived', 'Letter Week XII': 'letter-read', 'The Vow': 'vow', 'Medallion Received': 'medallion', 'Reminders Setup': 'reminders', 'Day Zero': 'day-zero',
};
const ROUTES = {
  Splash: { route: '/splash?hold=1', seed: '-' },
  Login: { route: '/sign-in', seed: '-' },
  'Welcome Back': { route: '/welcome-back', seed: '-' },
  Paywall: { route: '/paywall', seed: 'v-premium-seed' },
  'Manage Subscription': { route: '/subscription', seed: 'f-pw-sub-dated', clock: '2026-07-10T09:41:00' },
  'Paywall Rescue': { route: '/paywall?stage=rescue', seed: 'v-premium-seed' },
  'Paywall Confirmed': { route: '/paywall?stage=confirmed', seed: 'v-premium-seed' },
};

// the app canvas's other boards: route, seed, and the steps that reach the frame's state (D35)
const MORNING = ['tap:Begin', 'wait:700', 'tap:Yes', 'wait:300'];
const M1 = [...MORNING, 'tap:Next', 'wait:700'];
const M2 = [...M1, 'tap:Continue', 'wait:600'];
const M3 = [...M2, 'tap:Continue', 'wait:600'];
const M4 = [...M3, 'tap:Continue', 'wait:700'];
const NIGHT = ['tap:Begin', 'wait:800'];
const N1 = [...NIGHT, 'tap:Continue', 'wait:700', 'tap:Calm', 'wait:300'];
const N2 = [...N1, 'tap:Next', 'wait:700'];
const N3 = [...N2, 'tap:Loneliness', 'wait:300', 'tap:Next', 'wait:800'];
const N4 = [...N3, 'tap:Continue', 'wait:900'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
/** `Week <roman> <title>` and its `P2` (the rows scrolled to their end). */
const lessonScroll = (screen) => {
  const m = /^Lesson Scroll (\d+)$/.exec(screen ?? '');
  return m ? { route: `/lesson/day/1?page=${m[1]}`, seed: 'library-seed' } : null;
};
const weekTarget = (screen) => {
  const m = /^Week ([IVX]+) .*?( P2)?$/.exec(screen ?? '');
  if (!m) return null;
  const n = ROMAN.indexOf(m[1]) + 1;
  return { route: `/week/${n}`, seed: 'library-seed', steps: m[2] ? ['wait:600', `end:week-${n}`] : undefined };
};
const SCREENS = {
  'Morning Check-in Time': { route: '/routines/morning-time', seed: 'v-premium-seed' },
  'Nightly Check-in Time': { route: '/routines/night-time', seed: 'v-premium-seed' },
  'Today Home': { route: '/today', seed: 'today-0900-seed' },
  'Today Home II': { route: '/today', seed: 'today-ii-seed', steps: ['wait:600', 'page:today:1'] },
  'Today Home Task': { route: '/today', seed: 'today-task-seed', steps: ['wait:600', 'page:today:1'] },
  'Today Home III': { route: '/today', seed: 'today-2000-seed-own', steps: ['wait:600', 'page:today:2'] },
  'Score Detail': { route: '/score', seed: 'today-0900-seed' },
  'Score Detail Moves': { route: '/score', seed: 'today-0900-seed', steps: ['wait:600', 'page:score:1'] },
  'Score Detail Ranks': { route: '/score', seed: 'today-0900-seed', steps: ['wait:600', 'page:score:2'] },
  'Morning Check-in Cover': { route: '/day/morning', seed: 'day-seed-own' },
  'Morning Task Check': { route: '/day/morning', seed: 'day-seed-own', steps: MORNING },
  'Morning 1 Yesterday': { route: '/day/morning', seed: 'day-seed-own', steps: M1 },
  'Morning Feeling': { route: '/day/morning', seed: 'day-seed-own', steps: M2 },
  'Morning Energy': { route: '/day/morning', seed: 'day-seed-own', steps: M3 },
  'Morning Resign Pledge': { route: '/day/morning', seed: 'day-seed-own', steps: M4 },
  'Morning Pledge Signed': { route: '/day/morning', seed: 'day-seed-own', steps: [...M4, 'tap:Sign for today', 'wait:800'] },
  'Change Pledge Sheet': { route: '/day/morning', seed: 'day-seed-own', steps: [...M4, 'tap:Change the pledge', 'wait:900', 'type:Phone stays out of the bedroom'], blur: true },
  'Morning Journal Goal': { route: '/day/morning', seed: 'day-seed-own', steps: [...M4, 'tap:Sign for today', 'wait:800', 'tap:Confirm', 'wait:900', 'type:Finish the essay draft before lunch.'], blur: true },
  'Morning 5 Done': { route: '/day/morning', seed: 'day-seed-own', steps: [...M4, 'tap:Sign for today', 'wait:800', 'tap:Confirm', 'wait:900', 'tap:Skip', 'wait:900'] },
  'Night Check-in Cover': { route: '/day/night', seed: 'day-seed-own' },
  'Night 1 Mood': { route: '/day/night', seed: 'day-seed-own', steps: NIGHT },
  'Checkin Emotions': { route: '/day/night', seed: 'day-seed-own', steps: [...NIGHT, 'tap:Continue', 'wait:700', 'tap:Calm', 'wait:300', 'tap:Tired', 'wait:400'] },
  'Checkin Reasons': { route: '/day/night', seed: 'day-seed-own', steps: [...N2, 'tap:School / work', 'wait:300', 'tap:Loneliness', 'wait:400'] },
  'Night 3 Reflection': { route: '/day/night', seed: 'day-seed-own', steps: [...N3, 'type:Sam called at the right moment…'], blur: true },
  'Night 2 Record': { route: '/day/night', seed: 'day-seed-own', steps: N4 },
  'Night Action Reminder': { route: '/day/night', seed: 'vday-seed-d1-own', steps: [...N4, 'tap:Continue', 'wait:900'] },
  'Night Journal Proud': { route: '/day/night', seed: 'day-seed-own', steps: [...N4, 'tap:Continue', 'wait:900', 'tap:Done', 'wait:900', 'type:Went for a run instead of scrolling in bed.'], blur: true },
  'Night 4 Closed': { route: '/day/night', seed: 'day-seed-own', steps: [...N4, 'tap:Continue', 'wait:900', 'tap:Done', 'wait:900', 'tap:Skip', 'wait:1000'] },
  // medallions and the post
  Medallions: { route: '/milestones', seed: 'medallions-seed' },
  'Medallions Still To Earn': { route: '/milestones', seed: 'medallions-seed', steps: ['wait:800', 'tap:Still to earn', 'wait:600'] },
  'Album Earned II': { route: '/milestones', seed: 'medallions-seed', steps: ['wait:800', 'page:album:1', 'wait:600'] },
  ...Object.fromEntries(['Paper', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((t) => [`Breakwater ${t}`, { route: `/medallions/breakwater?tier=${t.toLowerCase()}`, seed: 'medallions-seed' }])),
  ...Object.fromEntries(['Paper', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((t) => [`Detail ${t}`, { route: `/medallions/vici?tier=${t === 'Paper' ? 'none' : t.toLowerCase()}`, seed: 'medallions-seed' }])),
  ...Object.fromEntries(['Vici', 'Rebound', 'Breakwater', 'Logbook', 'Pulse', 'Archive', 'Lessons'].map((t) => [`Tiers ${t}`, { route: `/medallions/tiers/${t.toLowerCase()}`, seed: 'medallions-seed' }])),
  'Tiers Vidi': { route: '/medallions/tiers/vidi', seed: 'medallions-vidi-seed' },
  'Tiers One-offs': { route: '/medallions/tiers/once', seed: 'medallions-seed' },
  // the owner's letters replace the frame's sample (D552): a letter for the morning after a slip
  'Letter Arrival': { route: '/letter?id=R01&at=1792572060000', seed: 'ml-letters-seed' },
  'Letter Read': { route: '/letter?id=R01&at=1792572060000', seed: 'ml-letters-seed', steps: ['tap:Read', 'wait:900'] },
  'Medallion Letter': { route: '/medallion-post', seed: 'ml-letters-seed', steps: ['tap:Read', 'wait:900'] },
  'Yearly Drop': { route: '/drop', seed: 'ml-letters-seed' },
  'Drop Received': { route: '/drop', seed: 'ml-letters-seed', steps: ['tap:Get the year', 'wait:1400'] },
  // the log
  'Log Chooser': { route: '/log-chooser', seed: 'logs-seed' },
  'Log Urges': { route: '/log', seed: 'logs-week-sun-seed', steps: ['wait:500'] },
  'Log Check-ins': { route: '/log', seed: 'logs-week-sun-seed', steps: ['tap:Check-ins', 'wait:600'] },
  'Log Reports': { route: '/log', seed: 'logs-reports-seed', steps: ['tap:Reports', 'wait:700'] },
  'Urge Overview': { route: '/urge-overview', seed: 'logs-overview-sos', steps: ['wait:600'] },
  'Urge Overview Scrolled': { route: '/urge-overview', seed: 'logs-overview-sos', steps: ['wait:600', 'page:overview:1', 'wait:500'] },
  'Report Ready': { route: '/report-ready?week=2025-07-14', seed: 'logs-wr-story' },
  'Weekly Report': { route: '/weekly-report?week=2025-07-14', seed: 'logs-wr-story' },
  'Weekly Report Urges': { route: '/weekly-report?week=2025-07-14', seed: 'logs-wr-story', steps: ['wait:600', 'tap:Continue', 'wait:500'] },
  'Weekly Report Helped': { route: '/weekly-report?week=2025-07-14', seed: 'logs-wr-story', steps: ['wait:600', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500'] },
  'Weekly Report Journal': { route: '/weekly-report?week=2025-07-14', seed: 'logs-wr-story', steps: ['wait:600', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500'] },
  'Weekly Report Next': { route: '/weekly-report?week=2025-07-14', seed: 'logs-wr-story', steps: ['wait:600', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500', 'tap:Continue', 'wait:500'] },
  'Weekly Report Slip Week': { route: '/weekly-report?week=2025-06-30', seed: 'logs-wr-slip' },
  'Urge Log Intensity': { route: '/urge-log', seed: 'logs-flow-seed', steps: ['tap:Intense', 'wait:400'] },
  'Urge Log Trigger': { route: '/urge-log', seed: 'logs-flow-seed', steps: ['tap:Intense', 'tap:Continue', 'wait:600', 'tap:Late night', 'tap:Boredom', 'wait:400'] },
  'Urge Log Outcome': { route: '/urge-log', seed: 'logs-flow-seed', steps: ['tap:Intense', 'tap:Continue', 'wait:600', 'tap:Late night', 'tap:Boredom', 'tap:Continue', 'wait:600', 'tap:Rode it out', 'wait:300'] },
  'Urge Log When': { route: '/urge-log', seed: 'logs-flow-seed', steps: ['tap:Intense', 'tap:Continue', 'wait:600', 'tap:Late night', 'tap:Boredom', 'tap:Continue', 'wait:600', 'tap:Rode it out', 'wait:300', 'tap:Continue', 'wait:600'] },
  'Urge Log Done': { route: '/urge-log', seed: 'logs-flow-seed', steps: ['tap:Intense', 'tap:Continue', 'wait:600', 'tap:Late night', 'tap:Boredom', 'tap:Continue', 'wait:600', 'tap:Rode it out', 'wait:300', 'tap:Continue', 'wait:600', 'tap:Log the urge', 'wait:900'] },
  // settings
  Settings: { route: '/settings', seed: 'settings-seed' },
  'Edit Profile': { route: '/profile', seed: 'settings-profile-seed' },
  'Sheet Profile Photo': { route: '/profile', seed: 'settings-profile-seed', steps: ['wait:800', 'tap:Change photo', 'wait:900'] },
  'Sheet Edit Name': { route: '/profile', seed: 'settings-profile-seed', steps: ['wait:800', 'tap:Name, Sam Reyes', 'wait:900'], blur: true },
  'Settings Weekly Report': { route: '/weekly-report?week=2025-07-14&from=settings', seed: 'logs-wr-days-seed' },
  'Settings Check-in Time': { route: '/routines/night-time?from=settings', seed: 'v-premium-seed' },
  'Your Vow Page': { route: '/vow', seed: 'settings-vow-dated-seed' },
  'Sheet Sign Out': { route: '/settings', seed: 'settings-seed', steps: ['wait:800', 'tap:Sign out', 'wait:900'] },
  'Data Privacy': { route: '/privacy', seed: 'settings-seed' },
  'App Lock': { route: '/applock', seed: 'settings-seed' },
};
/** How long a capture waits: the board's own settle, plus its steps. */
const waitFor = (steps = []) => 2500 + 900 + steps.reduce((a, st) => a + (st.startsWith('wait:') ? Number(st.slice(5)) : st.startsWith('tap:') ? 450 : 300), 0);

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
    if (FUNNEL[row.screen]) return { route: `/welcome?step=${FUNNEL[row.screen]}`, seed: FUNNEL[row.screen] === 'name' ? 'tail-unnamed-seed' : 'f-funnel-user', blur: FUNNEL[row.screen] === 'name', globals: DRAWN[FUNNEL[row.screen]] ? { __ONB_ANSWERS: { [FUNNEL[row.screen]]: DRAWN[FUNNEL[row.screen]] } } : undefined, time: h12(), wait: 2500 };
    if (TAIL[row.screen]) return { route: `/welcome?step=${TAIL[row.screen]}`, seed: row.screen === 'The Vow' ? 'tail-vow-seed' : 'tail-session-seed', globals: { __ONB_ANSWERS: TAIL_MAN }, time: h12(), wait: 2500 };
    if (ROUTES[row.screen]) return { ...ROUTES[row.screen], time: h12(), wait: 2500 };
  }
  if (file === 'app' && (SCREENS[row.screen] || weekTarget(row.screen) || lessonScroll(row.screen))) {
    const t = SCREENS[row.screen] ?? weekTarget(row.screen) ?? lessonScroll(row.screen);
    return { ...t, time: t.time ?? h12(), wait: t.wait ?? waitFor(t.steps) };
  }
  const rel = file === 'relapse' ? relapseSeq[i] : file === 'app' && i >= 294 && i <= 368 ? relapseSeq[i - 294] : null;
  if (rel) return rel.specOnly ? null : { screen: 'relapse', ...rel };
  return null;
}
