/* GROUP logs — 91-3 Log Reports (Mon 21 Jul 2025, 09:00): five closed weeks since the
   account opened on Mon 16 Jun, moving the score +5, +6, −4, +8, +12 to 1,240 on the
   app's own weights (`scoreAt`: clean day 4, check-in 2, lesson 3, ride 2, slip −16 −4).
   The frame's +5 is odd, which only a lesson makes; 1,240 needs 213 points before the
   first report week — 105 rides and one lesson logged before the account opened (sample
   arithmetic, D097 style; nothing else reads them). */
(() => {
const at = window.__at, days = window.__days;
const events = [];
const ride = (s) => events.push({ type: 'urge_rode_out', createdAt: at(s), severity: 4, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 300 });
const slip = (s) => events.push({ type: 'lapse', createdAt: at(s), trigger: 'Late night' });
for (let i = 0; i < 105; i += 1) ride(`2025-06-${String(1 + Math.floor(i / 7)).padStart(2, '0')}T${String(8 + (i % 7)).padStart(2, '0')}:00`);
// W1 Jun 16–22: two slips, seven check-ins, a lesson   → +5
slip('2025-06-17T22:00'); slip('2025-06-20T22:00');
// W2 Jun 23–29: two slips, seven check-ins, two rides  → +6
slip('2025-06-24T22:00'); slip('2025-06-27T22:00'); ride('2025-06-25T20:00'); ride('2025-06-28T20:00');
// W3 Jun 30–Jul 6: two slips, four check-ins           → −4
slip('2025-07-01T22:00'); slip('2025-07-04T22:00');
// W4 Jul 7–13: one slip                               → +8
slip('2025-07-09T22:00');
// W5 Jul 14–20: one slip, two check-ins               → +12 → 1,240
slip('2025-07-16T22:00');
const checkins = [...days('2025-06-16', 7), ...days('2025-06-23', 7), ...days('2025-06-30', 4), '2025-07-18', '2025-07-19'].map((date) => ({ date, mood: 4, energy: 4 }));
const progress = {
  'seed-lesson-a': { userId: 'logs-seed-user', lessonSlug: 'seed-lesson-a', status: 'completed', completedAt: at('2025-06-10T09:00') },
  'seed-lesson-b': { userId: 'logs-seed-user', lessonSlug: 'seed-lesson-b', status: 'completed', completedAt: at('2025-06-18T09:00') },
};
window.__logsSeed({ createdAt: at('2025-06-16T08:00'), events, checkins, progress });
})();
