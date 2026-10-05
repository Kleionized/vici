/* verifier: L10 single choice + best answer page */
const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
const checked = () => [...document.querySelectorAll('[role="checkbox"],[role="radio"]')].map((e) => e.getAttribute('role')[0] + (e.getAttribute('aria-checked') === 'true' ? 1 : 0)).join('');
const opts = [...document.querySelectorAll('[role="radio"]')].map((e) => e.getAttribute('aria-label'));
const log = ['opts=' + JSON.stringify(opts), 'start=' + rail() + ' ' + checked()];
// Continue with nothing chosen: advances, saves nothing
await tap('Continue', { wait: 800 });
log.push('noChoice rail=' + rail() + ' refl=' + JSON.stringify(data()?.reflections?.['day-10'] ?? null) + ' t=' + __txt().slice(0, 90));
console.error("VLOG " + log.join(" || ")); return 1;
