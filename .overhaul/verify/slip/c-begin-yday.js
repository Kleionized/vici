const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
await tap('Log the slip'); await tap('Continue'); await tap('Yesterday'); await __sleep(400); await tap('Continue');
await tap('Bored'); await tap('Continue'); await __sleep(1000);
log('98E', document.body.innerText.slice(0, 200));
await tap('Continue'); await __sleep(400); await tap('Continue'); await __sleep(400);
log('warn', document.body.innerText.slice(0, 80));
await tap('Continue'); await __sleep(400);
await tap('Done'); await __sleep(800);
if (document.body.innerText.includes('Sign it again')) { log('pledge shown', true); await tap('Sign it again'); await __sleep(800); }
log('98K', document.body.innerText.slice(0, 80));
await tap('Start again'); await __sleep(1200);
log('after Start again (yesterday slip)', { path: location.pathname, text: document.body.innerText.slice(0, 120) });
await tap('Check in'); await __sleep(2500);
log('after Check in', { path: location.pathname, text: document.body.innerText.slice(0, 80) });
