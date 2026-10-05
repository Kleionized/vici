/* GROUP logs — 91C2 Weekly Report · Days, week Jul 14–20 read on Mon 21 Jul 2025: no slip
   all week (7 of 7), an urge ridden out on Friday only (the one wave); last week Jul 7–13
   holds slips on Wednesday and Saturday (the two hollow dots). Check-ins carry moods so the
   week has a report. */
(() => {
const at = window.__at, days = window.__days;
const events = [
  { type: 'urge_rode_out', createdAt: at('2025-07-18T21:05'), severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 420 },
  { type: 'lapse', createdAt: at('2025-07-09T22:00'), trigger: 'Late night' },
  { type: 'lapse', createdAt: at('2025-07-12T22:00'), trigger: 'Late night' },
];
const checkins = days('2025-07-07', 14).map((date) => ({ date, mood: 4, energy: 4 }));
window.__logsSeed({ createdAt: at('2025-06-16T08:00'), events, checkins });
})();
