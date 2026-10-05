/* Lessons — Begin records the lesson as started; the ring and a tap anywhere both turn the page.
   Run with --initseed=.overhaul/weeks-seed.js on /lesson/day/13?page=1. */
const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
const out = { cover: rail(), before: data()?.progress?.['day-13'] ?? null };
await tap('Begin', { wait: 600 });
out.afterBegin = { rail: rail(), progress: data()?.progress?.['day-13'] };
// two controls say Next on a reading page: the band (first in the document) and the ring
const nexts = () => [...document.querySelectorAll('[aria-label="Next"]')];
out.nextControls = nexts().length;
__fire(nexts()[0]); await __sleep(600);
out.afterBand = rail();
__fire(nexts()[nexts().length - 1]); await __sleep(600);
out.afterRing = rail();
return out;
