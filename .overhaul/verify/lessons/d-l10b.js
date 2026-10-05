const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
const checked = () => [...document.querySelectorAll('[role="checkbox"],[role="radio"]')].map((e) => e.getAttribute('role')[0] + (e.getAttribute('aria-checked') === 'true' ? 1 : 0)).join('');
const r = [...document.querySelectorAll('[role="radio"]')];
const log = [];
__fire(r[0]); await __sleep(300); log.push('A ' + checked());
__fire(r[1]); await __sleep(300); log.push('B ' + checked());
__fire(r[1]); await __sleep(300); log.push('B again ' + checked());
await tap('Continue', { wait: 800 });
log.push('refl=' + JSON.stringify(data()?.reflections?.['day-10']?.answers ?? null) + ' rail=' + rail() + ' t=' + __txt().slice(0, 120));
// best answer page: tap anywhere turns it
const n = [...document.querySelectorAll('[aria-label="Next"]')]; log.push('answerNexts=' + n.length);
if (n[0]) { __fire(n[0]); await __sleep(700); }
log.push('afterAnswerTap rail=' + rail());
console.error("VLOG " + log.join(" || ")); return 1;
