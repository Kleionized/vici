/* GROUP logs — the Log tab's world (91 / 91-2): Sun 20 Jul 2025, 21:30 (pinned above
   by `window.__CLOCK` + clock.js). This week (Mon 14 – Sun 20): urges Tue 23:40
   (Intense), Thu 15:10 (Mild), Fri 21:05 (Strong); last week: a lapse Sun 13 22:22 and
   an urge Wed 9 00:05 (Mild). Twelve mornings in a row (Jul 9 – 20), energies drawing
   the frame's 29.6 / 25.2 circles, words Steady · Flat · Good · Good · Calm. The same
   three urges are 91C3's week (`Tue · Thu · Fri`), so this world serves it from Jul 21. */
(() => {
const uid = 'logs-seed-user';
const DAY = 86400000, HOUR = 3600000, MIN = 60000;
const now = Date.now();
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const at = (s) => new Date(s).getTime();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const createdAt = at('2025-06-01T09:00');
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
let n = 0;
const ev = (type, when, extra) => Object.assign({ _id: 'seed-w-' + ++n, userId: uid, type, createdAt: at(when) }, extra);
const events = [
  ev('urge_rode_out', '2025-07-15T23:40', { severity: 8, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 240 }),
  ev('urge_rode_out', '2025-07-17T15:10', { severity: 4, trigger: 'Boredom', whatHelped: 'Surfed with the timer', durationSeconds: 360 }),
  ev('urge_rode_out', '2025-07-18T21:05', { severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 420 }),
  ev('lapse', '2025-07-13T22:22', { trigger: 'Late night' }),
  ev('urge_rode_out', '2025-07-09T00:05', { severity: 4, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 300 }),
];
const checkins = {};
/* Jul 9 … Jul 20: energy 4 except Tue 15 and Fri 18 (3); the five newest read Steady
   (mood 3), Flat (night word), Good, Good (mood 4), Calm (night word) */
const WORDS = { '2025-07-20': { mood: 3 }, '2025-07-19': { mood: 3, emotions: ['Flat'] }, '2025-07-18': { mood: 4 }, '2025-07-17': { mood: 4 }, '2025-07-16': { mood: 4, emotions: ['Calm'] } };
for (let d = 9; d <= 20; d += 1) {
  const date = `2025-07-${String(d).padStart(2, '0')}`;
  const w = WORDS[date] || { mood: 4 };
  checkins[date] = { _id: 'seed-c-' + d, userId: uid, date, mood: w.mood, energy: d === 15 || d === 18 ? 3 : 4, emotions: w.emotions || [], reasons: [] };
}
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins, journalEntries: [],
}));
})();
