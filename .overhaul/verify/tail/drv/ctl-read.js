const N = { read: 'Week XII, from', vow: 'The vow.', med: 'Your first medallion.' };
await window.__has(N.read, 10000);
window.__log.push('read: no Back ' + window.__noCtl('Back'));
await __step('read Keep this letter', () => tap('Keep this letter'), N.vow, N.read);
await __step('vow Close', () => tap('Close'), N.med, N.vow);
return window.__log.length;
