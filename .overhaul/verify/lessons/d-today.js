const L = [];
await __sleep(2000);
if (location.pathname !== '/today') { await tap('Close', { wait: 2000 }).catch(() => {}); }
L.push('at ' + location.pathname);
const t = [...document.querySelectorAll('[role="button"]')].find((b) => (b.getAttribute('aria-label') || '') === 'Open today’s task');
L.push('taskRow ' + !!t);
if (t) { __fire(t); await __sleep(2000); L.push('task -> ' + location.pathname + location.search + ' rail ' + document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')); await tap('Close', { wait: 2000 }); L.push('back ' + location.pathname); }
const tile = [...document.querySelectorAll('[role="button"]')].find((b) => /^Lesson 12/.test(b.textContent.trim()));
L.push('tile ' + (tile && tile.textContent.trim().slice(0, 40)));
if (tile) { __fire(tile); await __sleep(2000); L.push('tile -> ' + location.pathname + ' rail ' + document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow') + ' ' + __txt().slice(0, 40)); await tap('Close', { wait: 2000 }); L.push('back ' + location.pathname); }
console.error('VLOG ' + L.join(' || '));
return 1;
