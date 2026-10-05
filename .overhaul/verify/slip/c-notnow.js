const log = (k, v) => console.error('R:' + k + ' = ' + JSON.stringify(v));
const trace = [];
for (const m of ['pushState', 'replaceState']) { const o = history[m].bind(history); history[m] = (s, t, u) => { trace.push(m + ' ' + u); return o(s, t, u); }; }
await tap('Not now'); await __sleep(2500);
log('after Not now on direct load', { trace, path: location.pathname });
