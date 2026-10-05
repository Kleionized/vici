const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
await tap('Log the slip'); await tap('Continue'); await tap('Continue');
await tap('Tired'); await tap('Phone in bed'); await tap('Late night'); await __sleep(2500);
log('chip transforms', [...document.querySelectorAll('[role="checkbox"]')].map((e) => { const r = e.getBoundingClientRect(); return e.textContent.trim() + ' ' + getComputedStyle(e).transform + ' ' + r.x.toFixed(2) + ',' + r.y.toFixed(2) + ' ' + r.width.toFixed(2) + 'x' + r.height.toFixed(2); }));
