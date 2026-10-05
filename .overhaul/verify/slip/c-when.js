const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
const state = () => ({
  chips: [...document.querySelectorAll('[role="radio"]')].map((e) => e.textContent.trim() + ':' + e.getAttribute('aria-checked')),
  wheel: [...document.querySelectorAll('[aria-valuetext]')].map((e) => (e.getAttribute('aria-label') || '') + '=' + e.getAttribute('aria-valuetext')),
  date: (document.body.innerText.match(/(Tonight|Today|Last night|Yesterday|[A-Z][a-z]{2} [A-Z][a-z]{2} \d+)[^\n]*/g) || []).slice(0, 3),
  path: location.pathname,
});
const tapLabel = async (l) => { const el = [...document.querySelectorAll('[aria-label]')].find((e) => e.getAttribute('aria-label') === l); if (!el) throw new Error('no ' + l); __fire(el); await __sleep(700); };
await tap('Log the slip'); await tap('Continue');
log('initial', state());
await tapLabel('Hour 10'); log('after Hour 10', state());
await tapLabel('Minute 42'); log('after Minute 42', state());
await tapLabel('Hour 12'); log('after Hour 12 (+2h → future, clamp)', state());
await tap('Yesterday'); await __sleep(600); log('Yesterday', state());
await tap('Earlier today'); await __sleep(600); log('Earlier today', state());
await tap('Just now'); await __sleep(600); log('Just now', state());
await tap('Change'); await __sleep(800);
log('sheet open', { radios: [...document.querySelectorAll('[role="radio"]')].map((e) => e.textContent.trim() + ':' + e.getAttribute('aria-checked')) });
await tap('Sun Jul 20'); await __sleep(1200);
log('after pick Sun Jul 20', state());
// back chevron
const backBtn = [...document.querySelectorAll('[aria-label]')].find((e) => /back/i.test(e.getAttribute('aria-label')));
log('back control', backBtn ? backBtn.getAttribute('aria-label') : null);
