/* GROUP logs — the account the WEEKLY REPORT frames draw (F28: seed the state,
   don't excuse the row as sample data).

   `/weekly-report` with no ?week= reads the latest COMPLETED week, so this seed
   fills that week and the one before it exactly as 92 / 92-2 / 92-3 do:

     card    7 check-ins · 3 urges · 0 relapses
     days    this week  #A9A597 #767267 #A9A597 #767267 #131313 #767267 #767267
             last week  #CDC9BD #A9A597 #A9A597 #CDC9BD #A9A597 #767267 #A9A597
     urges   Late night · Intense / rode it out
             Boredom · Mild       / surfed the timer
             Stress · Strong      / rode it out

   MOOD_TONE maps 1→#CDC9BD, 2→#A9A597, 3 and 4→#767267, 5→#131313, which is
   where the mood numbers below come from. The weekday NAMES the canvas prints
   (Tuesday, Thursday, Friday) are the frame's own dates, not derivable from a
   relative seed — the urges are placed on those weekdays of the report week so
   they are, and only the month/day label differs. */
const uid = 'logs-week-user';
const DAY = 86400000;
const HOUR = 3600000;
const MIN = 60000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/* Monday of this week, then the Monday of the week the report covers. */
const thisMon = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
const repMon = thisMon - 7 * DAY;
const prevMon = repMon - 7 * DAY;
const createdAt = repMon - 28 * DAY;

localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(repMon)));

const events = [];
let n = 0;
const ev = (type, at, extra) => events.push(Object.assign({ _id: 'seed-e-' + ++n, userId: uid, type, createdAt: at }, extra));

/* the report week's three urges, on the frame's own weekdays and clock times */
ev('urge_rode_out', repMon + 1 * DAY + 23 * HOUR + 40 * MIN, { severity: 8, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 240 });
ev('urge_rode_out', repMon + 3 * DAY + 15 * HOUR + 10 * MIN, { severity: 3, trigger: 'Boredom', whatHelped: 'Surfed with the timer', durationSeconds: 360 });
ev('urge_rode_out', repMon + 4 * DAY + 21 * HOUR + 5 * MIN, { severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 420 });
/* the week before carries two, so the score line has somewhere to climb from */
ev('urge_rode_out', prevMon + 2 * DAY + 20 * HOUR, { severity: 5, trigger: 'Tired', whatHelped: 'Rode it out', durationSeconds: 300 });
ev('urge_rode_out', prevMon + 5 * DAY + 22 * HOUR, { severity: 4, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 300 });

const checkins = {};
const read = (at, mood, sleep, i) => {
  checkins[key(at)] = { _id: 'seed-c-' + key(at), userId: uid, date: key(at), mood, energy: 3, sleepHours: sleep, emotions: [], reasons: [], dailyAction: 'Phone out of the bedroom', dailyActionDone: true };
  ev('check_in', at + 8 * HOUR + (35 + i) * MIN);
};
const THIS_WEEK = [2, 4, 2, 4, 5, 4, 4];
const LAST_WEEK = [1, 2, 2, 1, 2, 4, 2];
THIS_WEEK.forEach((mood, i) => read(repMon + i * DAY, mood, 7, i));
LAST_WEEK.forEach((mood, i) => read(prevMon + i * DAY, mood, 6.5, i + 7));

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events,
  checkins,
  journalEntries: [],
}));
