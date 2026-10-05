const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
log('98L', { path: location.pathname + location.search, text: document.body.innerText.slice(0, 120) });
await tap('Later'); await __sleep(2500);
log('after Later', { path: location.pathname, text: document.body.innerText.slice(0, 100) });
