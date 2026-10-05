const N = { read: 'Week XII, from', vow: 'The vow.' };
await window.__has(N.read, 10000);
await __step('read Close', () => tap('Close'), N.vow, N.read);
return window.__log.length;
