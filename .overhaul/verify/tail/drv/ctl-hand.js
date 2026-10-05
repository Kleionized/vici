const N = { arr: 'A letter arrived.', read: 'Week XII, from', vow: 'The vow.', med: 'Your first medallion.' };
await window.__has(N.arr, 10000);
window.__log.push('arrived: no Close ' + window.__noCtl('Close') + ', no Back ' + window.__noCtl('Back'));
await __step('arr Save it for later', () => tap('Save it for later'), N.vow, N.arr);
window.__log.push('vow date caps: ' + (window.__txt().match(/Day 0, [A-Z][a-z]{2} \d+/) || ['(none)'])[0]);
await __step('vow Not now', () => tap('Not now'), N.med, N.vow);
window.__log.push('medallion: no Close ' + window.__noCtl('Close') + ', no Back ' + window.__noCtl('Back'));
return window.__log.length;
