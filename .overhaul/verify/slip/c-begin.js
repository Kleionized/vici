const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
const trace = []; for (const m of ['pushState', 'replaceState']) { const o = history[m].bind(history); history[m] = (s, t, u) => { trace.push(m + ' ' + u); return o(s, t, u); }; }
await tap('Log the slip'); await tap('Continue'); await tap('Continue');
await tap('Bored'); await tap('Continue'); await __sleep(1000);
await tap('Continue'); await __sleep(400); await tap('Continue'); await __sleep(400);
await tap('Continue'); await __sleep(400);
await tap('Done'); await __sleep(800);
log('after Done', { path: location.pathname, text: document.body.innerText.slice(0, 80) });
if (document.body.innerText.includes('Sign it again')) { await tap('Sign it again'); await __sleep(800); }
log('98K', document.body.innerText.slice(0, 120));
await tap('Start again'); await __sleep(2500);
log('after Start again (today slip)', { trace, path: location.pathname, text: document.body.innerText.slice(0, 100) });
