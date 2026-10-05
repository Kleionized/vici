/* Lessons — exercise the reader's writes on lesson 13 (question → reflect → task → complete).
   Run with --initseed=.overhaul/weeks-seed.js (day 12: lessons 1–11 completed, 13 untouched) on
   /lesson/day/13?page=12. Returns what the mock store holds after each step. */
const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
const checked = () => [...document.querySelectorAll('[role="radio"],[role="checkbox"]')].map((e) => e.getAttribute('aria-checked') === 'true' ? 1 : 0).join('');
const out = { start: rail() };
await tap('B. To have more control over what I do');
await tap('D. To follow a personal or religious value');
out.afterPick = checked();
await tap('Continue', { wait: 700 });
out.reflection1 = data()?.reflections?.['day-13']?.answers;
out.onReflect = rail();
await typeIn(0, 'Mornings with my daughter');
await tap('Continue', { wait: 700 });
out.reflection2 = data()?.reflections?.['day-13']?.answers;
out.onQuote = rail();
await tap('Next', { wait: 500 });
out.onTask = rail();
await tap('Next', { wait: 500 });
out.onTaskEnd = rail();
out.before = data()?.progress?.['day-13'] ?? null;
await tap('Finish lesson', { wait: 700 });
const p = data()?.progress?.['day-13'];
out.after = p && { status: p.status, completedAt: !!p.completedAt };
out.onComplete = rail();
out.text = __txt().slice(0, 120);
return out;
