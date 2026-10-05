const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
await tap('Log the slip'); await tap('Continue'); await tap('Continue');
await tap('Bored'); await tap('Continue'); await __sleep(1000);
await tap('Continue'); await __sleep(400); await tap('Continue'); await __sleep(400);
log('warn', document.body.innerText.slice(0, 40));
await tap('Continue'); await __sleep(400);
await tap('Done'); await __sleep(800);
log('after card CTA', document.body.innerText.slice(0, 60));
