/* GROUP logs — 91A / 91B / 91D Urge Overview (Summary, Strength, Timing), read on Sun 20 Jul
   2025 21:30 over the last 30 days: nine urges, seven ridden out, slips on Jul 19 and 13;
   bands 1·1·3·3·1 (ties Strong/Intense → Strong); triggers Stress 5, Late night 4, Boredom 3,
   Tired 1 (`Tiredness`); hours 0, 0, 1, 15, 19, 21, 22, 23, 23 (peak 11 pm – 1 am); places
   Bedroom 5, Desk 3, Bathroom 1. The Mood page draws fourteen feelings — its own seed (D126). */
(() => {
const at = window.__at;
const u = (type, when, severity, trigger, location, dur) => ({ type, createdAt: at(when), severity, trigger, durationSeconds: dur, whatHelped: type === 'urge_rode_out' ? 'Rode it out' : undefined, precedingState: { location } });
const events = [
  u('urge_acted_on', '2025-07-19T23:10', 8, 'Stress · Late night', 'Bedroom'),
  u('urge_rode_out', '2025-07-17T00:20', 6, 'Stress · Boredom', 'Desk', 360),
  u('urge_rode_out', '2025-07-15T22:40', 8, 'Stress · Late night', 'Bedroom', 240),
  u('urge_acted_on', '2025-07-13T23:50', 10, 'Late night · Boredom', 'Bedroom'),
  u('urge_rode_out', '2025-07-09T00:05', 6, 'Stress', 'Bedroom', 180),
  u('urge_rode_out', '2025-07-06T01:15', 8, 'Late night · Tired', 'Bedroom', 300),
  u('urge_rode_out', '2025-07-03T15:30', 4, 'Stress · Boredom', 'Desk', 300),
  u('urge_rode_out', '2025-06-30T19:10', 6, undefined, 'Desk', 300),
  u('urge_rode_out', '2025-06-26T21:45', 2, undefined, 'Bathroom', 300),
];
window.__logsSeed({ createdAt: at('2025-05-01T09:00'), events, checkins: [] });
})();
