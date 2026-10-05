const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
await tap('Log the slip'); await tap('Continue'); await tap('Continue');
await tap('Late night'); await tap('Continue'); await __sleep(1200);
log('98E text', document.body.innerText);
await tap('Continue'); await __sleep(500);
log('98F first paint', [...document.querySelectorAll('[role="radio"]')].map((e) => e.textContent.trim() + ':' + e.getAttribute('aria-checked')));
await tap('Continue'); await __sleep(800);
log('98F no answer -> ', document.body.innerText.slice(0, 80));
await tap('Continue'); await __sleep(800);
log('first card', document.body.innerText.slice(0, 120));
const seen = [];
for (let i = 0; i < 20; i++) { seen.push((document.body.innerText.split('\n').filter(Boolean)[1] || '').trim()); await tap('Give me another'); await __sleep(150); }
log('deck walk', seen);
