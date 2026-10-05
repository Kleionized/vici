const L = [];
await __sleep(1500);
if (location.pathname !== '/library') { await tap('Close', { wait: 2000 }).catch(() => {}); }
L.push('start ' + location.pathname); console.error('STEP ' + L[L.length-1]);
const row = [...document.querySelectorAll('[role="button"]')].find((b) => /lesson 03,/.test(b.getAttribute('aria-label') || ''));
L.push('row ' + (row && row.getAttribute('aria-label'))); console.error('STEP ' + L[L.length-1]);
if (row) { __fire(row); await __sleep(2000); }
L.push('opened ' + location.pathname + ' rail ' + document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow') + ' | ' + __txt().slice(0, 40)); console.error('STEP ' + L[L.length-1]);
await tap('Begin', { wait: 700 });
const n = [...document.querySelectorAll('[aria-label="Next"]')]; __fire(n[n.length - 1]); await __sleep(700);
L.push('rail ' + document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')); console.error('STEP ' + L[L.length-1]);
await tap('Close', { wait: 2000 });
L.push('closed ' + location.pathname + ' | ' + __txt().slice(0, 50)); console.error('STEP ' + L[L.length-1]);
console.error('VLOG ' + L.join(' || '));
return 1;
