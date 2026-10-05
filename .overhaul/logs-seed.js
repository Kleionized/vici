/* GROUP logs — an account shaped like the log frames draw it.
   91 wants three urges this week and two behind it; 91-2 wants a run of
   mornings; 91-3 wants five closed weeks so the sparkline has a line to draw.
   The launch gates in `(app)/_layout` are pre-satisfied so a capture of /log
   stays on /log instead of being pushed into the day check-in. */
const uid = 'logs-seed-user';
const DAY = 86400000;
const HOUR = 3600000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const createdAt = midnight - 41 * DAY;

localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
/* the launch prompts: check-in asked within the hour, letter and medallion
   delivered, the newest weekly report already seen */
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));

const events = [];
let n = 0;
const ev = (type, at, extra) => events.push(Object.assign({ _id: 'seed-e-' + ++n, userId: uid, type, createdAt: at }, extra));

/* this week: three urges, all this side of the seven-day line */
ev('urge_rode_out', midnight - 3 * DAY + 23 * HOUR + 40 * 60000, { severity: 8, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 240, precedingState: { feeling: 'Tense', location: 'Bedroom' } });
ev('urge_rode_out', midnight - 2 * DAY + 15 * HOUR + 10 * 60000, { severity: 3, trigger: 'Boredom', whatHelped: 'Surfed with the timer', durationSeconds: 360, precedingState: { feeling: 'Flat', location: 'Desk' } });
ev('urge_rode_out', midnight - 1 * DAY + 21 * HOUR + 5 * 60000, { severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 420, precedingState: { feeling: 'Restless', location: 'Bedroom' } });
/* last week: one slip and one ridden out */
ev('lapse', midnight - 9 * DAY + 22 * HOUR + 22 * 60000, { severity: 6, trigger: 'Home alone' });
ev('urge_rode_out', midnight - 11 * DAY + 0 * HOUR + 5 * 60000, { severity: 3, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 300 });
/* older urges, so the earlier weeks carry something */
for (let d = 16; d <= 34; d += 6) ev('urge_rode_out', midnight - d * DAY + 20 * HOUR, { severity: 5, trigger: 'Tired', whatHelped: 'Rode it out', durationSeconds: 300 });

const checkins = {};
/* 91-2 draws three readings this week and two behind it, so the seed is holed
   the same way rather than filling every morning. The daily action is the exact
   string `Lapse Done` draws in its `Changed` row. */
const READS = [{ d: 0, mood: 4, sleep: 7 }, { d: 1, mood: 3, sleep: 6 }, { d: 3, mood: 4, sleep: 7.5 }, { d: 8, mood: 4, sleep: 8 }, { d: 11, mood: 2, sleep: 5 }];
for (const { d, mood, sleep } of READS) {
  const at = midnight - d * DAY;
  checkins[key(at)] = { _id: 'seed-c-' + d, userId: uid, date: key(at), mood, energy: 3, sleepHours: sleep, emotions: [], reasons: [], dailyAction: 'Phone charges outside bedroom', dailyActionDone: true };
  /* the clock the log reads a check-in's time off */
  ev('check_in', at + 8 * HOUR + (35 + d) * 60000);
}

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events,
  checkins,
  journalEntries: [],
}));
