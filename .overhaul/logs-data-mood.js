/* GROUP logs — 91C Urge Overview · Mood (Sun 20 Jul 2025 21:30): fourteen urges in the last
   30 days, the feeling before each Tense ×6, Flat ×4, Restless ×3, Low ×1. */
(() => {
const at = window.__at;
const feel = ['Tense', 'Tense', 'Tense', 'Tense', 'Tense', 'Tense', 'Flat', 'Flat', 'Flat', 'Flat', 'Restless', 'Restless', 'Restless', 'Low'];
const events = feel.map((feeling, i) => ({ type: 'urge_rode_out', createdAt: at('2025-07-19T22:00') - i * 2 * 86400000, severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 300, precedingState: { feeling } }));
window.__logsSeed({ createdAt: at('2025-05-01T09:00'), events, checkins: [] });
})();
