const o = {};
await waitFor('Open the report');
await tap('Open the report'); await __sleep(1800); o.openUrl = location.pathname + location.search; o.t = __txt().slice(0, 40);
return o;
