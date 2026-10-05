const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
const uid = 'slip-seed-user';
const events = () => (JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || '{}').events || []).map((e) => ({ t: e.type, trig: e.trigger, at: new Date(e.createdAt).toString().slice(0, 21) }));
const h1 = () => (document.body.innerText.split('\n').find((l) => l.trim().length > 6) || '').trim();
const continueEl = () => [...__btns()].filter((b) => b.textContent.trim() === 'Continue').map((b) => ({ dis: b.getAttribute('aria-disabled'), op: getComputedStyle(b).opacity }));
await tap('Log the slip');
// back from closeit? there is no back chevron on 98B; go forward
await tap('Continue');
// 98C → back chevron → 98B
const back = () => { const el = [...document.querySelectorAll('[aria-label]')].find((e) => /^back$/i.test(e.getAttribute('aria-label')) || /back/i.test(e.getAttribute('aria-label'))); if (!el) throw new Error('no back'); __fire(el); };
back(); await __sleep(600);
log('98C back ->', document.body.innerText.slice(0, 80));
await tap('Continue'); await __sleep(400);
log('98B continue ->', document.body.innerText.slice(0, 40));
await tap('Yesterday'); await __sleep(500);
await tap('Continue'); await __sleep(600);
log('98D first paint', { text: document.body.innerText.slice(0, 60), cont: continueEl() });
await tap('Continue'); await __sleep(600);
log('98D after disabled tap', { text: document.body.innerText.slice(0, 40), events: events().length });
await tap('Bored'); log('Bored on', [...document.querySelectorAll('[role="checkbox"]')].filter((e) => e.getAttribute('aria-checked') === 'true').map((e) => e.textContent.trim()));
await tap('Bored'); log('Bored off', [...document.querySelectorAll('[role="checkbox"]')].filter((e) => e.getAttribute('aria-checked') === 'true').map((e) => e.textContent.trim()));
// back from 98D → 98C, then forward keeps state
back(); await __sleep(600);
log('98D back ->', { text: document.body.innerText.slice(0, 60), chips: [...document.querySelectorAll('[role="radio"]')].map((e) => e.textContent.trim() + ':' + e.getAttribute('aria-checked')) });
await tap('Continue'); await __sleep(600);
await tap('Stressed'); await tap('Argument');
log('98D picked', { cont: continueEl() });
const before = events().length;
await tap('Continue'); await __sleep(1500);
log('events', { before, after: events() });
log('letter.pending', localStorage.getItem('tideline.letter.pending'));
log('98E text', document.body.innerText);
