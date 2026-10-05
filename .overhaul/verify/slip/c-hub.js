const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
log('hub', { path: location.pathname, text: document.body.innerText.slice(0, 80) });
await tap('I slipped'); await __sleep(1800);
log('after I slipped', { path: location.pathname, text: document.body.innerText.slice(0, 80) });
await tapAt(362, 80, 2000);
log('after ✕', { path: location.pathname, text: document.body.innerText.slice(0, 80) });
