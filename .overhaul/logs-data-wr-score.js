/* GROUP logs — 91C Weekly Report · Score (and 93D Settings Weekly Report), week Jul 14–20,
   read on Mon 21 Jul 2025 09:00. The frame's line (y 108, 93.3, 78.7, 71.3, 49.3, 34.7, 20)
   is day-end scores rising 0, 8, 16, 20, 32, 40, 48 above Monday, and its caption is +12 on
   1,240 — on the app's weights that is a Monday with two slips (−36), then +8 (check-in and a
   ride), +8, +4 (a clean day alone), +12 (check-in, three rides), +8, +8. The 1,228 it starts
   from is 28 days since the account opened (112) and 58 rides before the week (116). Sample
   arithmetic: the Days frame's "7 of 7" is its own seed (D126 style). */
(() => {
const at = window.__at, days = window.__days;
const events = [];
const ride = (s) => events.push({ type: 'urge_rode_out', createdAt: at(s), severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 300 });
const slip = (s) => events.push({ type: 'lapse', createdAt: at(s), trigger: 'Late night' });
for (let i = 0; i < 58; i += 1) ride(`2025-06-${String(17 + Math.floor(i / 6)).padStart(2, '0')}T${String(9 + (i % 6)).padStart(2, '0')}:00`);
slip('2025-07-14T21:00'); slip('2025-07-14T23:00');
ride('2025-07-15T20:00'); ride('2025-07-16T20:00');
ride('2025-07-18T19:00'); ride('2025-07-18T20:00'); ride('2025-07-18T21:00');
ride('2025-07-19T20:00'); ride('2025-07-20T20:00');
const checkins = ['2025-07-15', '2025-07-16', '2025-07-18', '2025-07-19', '2025-07-20'].map((date) => ({ date, mood: 4, energy: 4 }));
window.__logsSeed({ createdAt: at('2025-06-16T08:00'), events, checkins });
})();
