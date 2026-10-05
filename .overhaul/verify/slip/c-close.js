const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
const x = [...document.querySelectorAll('[aria-label]')].find((e) => /close/i.test(e.getAttribute('aria-label')));
log('close control', x ? x.getAttribute('aria-label') : null);
await tapAt(362, 80, 2500);
log('after ✕ on direct load', { path: location.pathname, text: document.body.innerText.slice(0, 100) });
