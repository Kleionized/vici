/* GROUP logs — Urge Overview with the app's own words (Sun 20 Jul 2025 21:30, last 30 days):
   the SOS flow's places (`Somewhere private` 5, `At work or school` 3) and a note standing in
   for a place where none was picked (1); SOS triggers `Something online` 5, `A stuck fantasy` 3,
   `Doomscrolling` 2, `Can’t sleep` 1; feelings `Stressed or anxious` 4, `I don’t know` 3,
   `Turned on` 2, `Restless` 1. Not a frame — the check that long labels never run into the
   dots or off the screen (D286). */
(() => {
const at = window.__at;
const u = (type, when, severity, trigger, feeling, location, note) => ({ type, createdAt: at(when), severity, trigger, durationSeconds: type === 'urge_rode_out' ? 300 : undefined, whatHelped: type === 'urge_rode_out' ? 'Rode it out' : undefined, note, precedingState: { location, feeling } });
const events = [
  u('urge_acted_on', '2025-07-19T23:10', 8, 'Something online · Doomscrolling', 'Stressed or anxious', 'Somewhere private'),
  u('urge_rode_out', '2025-07-17T00:20', 6, 'Something online', 'Stressed or anxious', 'At work or school'),
  u('urge_rode_out', '2025-07-15T22:40', 8, 'A stuck fantasy', 'Stressed or anxious', 'Somewhere private'),
  u('urge_rode_out', '2025-07-13T23:50', 10, 'Something online · A stuck fantasy', 'Stressed or anxious', 'Somewhere private'),
  u('urge_rode_out', '2025-07-09T00:05', 6, 'Something online', 'I don’t know', 'Somewhere private'),
  u('urge_rode_out', '2025-07-06T01:15', 8, 'Can’t sleep · Doomscrolling', 'I don’t know', 'Somewhere private'),
  u('urge_rode_out', '2025-07-03T15:30', 4, 'Something online', 'I don’t know', 'At work or school'),
  u('urge_rode_out', '2025-06-30T19:10', 6, 'A stuck fantasy', 'Turned on', 'At work or school'),
  u('urge_rode_out', '2025-06-26T21:45', 2, undefined, 'Turned on', undefined, 'Tell him I’m sorry about Saturday and that I meant it'),
  u('urge_rode_out', '2025-06-25T21:45', 2, undefined, 'Restless', undefined),
];
window.__logsSeed({ createdAt: at('2025-05-01T09:00'), events, checkins: [] });
})();
