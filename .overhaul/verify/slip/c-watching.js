const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
await tap('Log the slip'); await tap('Continue'); await tap('Continue');
await tap('Tired'); await tap('Continue'); await __sleep(1000);
await tap('Continue'); await __sleep(500);
await tap('I’m already watching again'); await __sleep(300);
await tap('Continue'); await __sleep(2500);
log('after watching again', { path: location.pathname, text: document.body.innerText.slice(0, 120) });
