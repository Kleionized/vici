/* verifier: walk L2 end to end from its cover with the real controls; record writes, rail, controls, path. */
const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
const nexts = () => [...document.querySelectorAll('[aria-label="Next"]')];
const header = () => [...document.querySelectorAll('div')].some((d) => d.textContent.trim() === 'Lesson 2' && d.children.length === 0 && d.getBoundingClientRect().top < 110);
const checked = () => [...document.querySelectorAll('[role="checkbox"],[role="radio"]')].map((e) => (e.getAttribute('aria-checked') === 'true' ? 1 : 0)).join('');
const log = [];
const L = (k, v) => log.push(k + '=' + JSON.stringify(v));
L('cover', { rail: rail(), header: header(), nexts: nexts().length, progress: data()?.progress?.['day-02'] ?? null });
await tap('Begin', { wait: 700 });
L('afterBegin', { rail: rail(), header: header(), progress: data()?.progress?.['day-02']?.status });
// F2 quote: tap the band (first Next) — tap anywhere
L('quoteNexts', nexts().length);
__fire(nexts()[0]); await __sleep(700);
L('afterBandTap', rail());
// tap empty band area well away from text, via elementFromPoint
await tapAt(200, 690, 700).catch((e) => L('tapAtErr', e.message));
L('afterEmptyBandTap', rail());
// ring through to the question
for (let i = 0; i < 12 && !document.body.innerText.includes('Question'); i++) { const n = nexts(); __fire(n[n.length - 1]); await __sleep(700); }
L('onQuestion', { rail: rail(), nexts: nexts().length, roles: checked() });
// a tap on the band beside the rows must not turn the page
const before = rail();
const el = document.elementFromPoint(200, 160); if (el) __fire(el); await __sleep(500);
L('bandTapOnQuestion', { before, after: rail() });
await tap('A. Saved material or bookmarks'); await tap('C. A device beside me where I usually watch');
L('ac', checked());
await tap('F. Nothing clear right now'); L('f', checked());
await tap('B. A feed or account that leads to porn'); L('b', checked());
await tap('B. A feed or account that leads to porn'); L('none', checked());
await tap('A. Saved material or bookmarks'); await tap('C. A device beside me where I usually watch');
await tap('Continue', { wait: 800 });
L('reflection1', data()?.reflections?.['day-02']?.answers ?? null);
L('onReflect', { rail: rail(), text: __txt().slice(0, 80), inputs: document.querySelectorAll('input').length });
const bt = rail(); const e2 = document.elementFromPoint(200, 200); if (e2) __fire(e2); await __sleep(500); L('bandTapOnReflect', { before: bt, after: rail() });
await typeIn(0, 'Phone in the kitchen');
await tap('Continue', { wait: 800 });
L('reflection2', data()?.reflections?.['day-02']?.answers ?? null);
L('onClosingQuote', { rail: rail(), t: __txt().slice(0, 60) });
{ const n = nexts(); __fire(n[n.length - 1]); await __sleep(700); }
L('onTask', { rail: rail(), t: __txt().slice(0, 60) });
{ const n = nexts(); __fire(n[n.length - 1]); await __sleep(700); }
L('onTaskEnd', { rail: rail(), before: data()?.progress?.['day-02']?.status });
await tap('Finish lesson', { wait: 800 });
const p = data()?.progress?.['day-02'];
L('afterFinish', { rail: rail(), status: p?.status, completedAt: !!p?.completedAt, t: __txt().slice(0, 90) });
await tap('Done', { wait: 2000 });
L('afterDone', location.pathname + location.search);
console.error("VLOG " + log.join(" || ")); return 1;
