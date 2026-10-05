/* Lessons — Finish lesson on an already-completed lesson does not re-stamp it; Done closes.
   --initseed=.overhaul/weeks-seed.js on /lesson/day/5?page=14 (lesson 5 completed by the seed). */
const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const before = data()?.progress?.['day-05'];
await tap('Finish lesson', { wait: 700 });
const after = data()?.progress?.['day-05'];
await tap('Done', { wait: 1500 });
return { before: before && before.completedAt, after: after && after.completedAt, same: before?.completedAt === after?.completedAt, path: location.pathname };
