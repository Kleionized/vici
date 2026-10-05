const o = {};
await waitFor('Insights');
await tap('Back'); await __sleep(1800); o.back = location.pathname;
return o;
