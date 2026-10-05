const o = {};
await waitFor('Open the report');
await tap('Later'); await __sleep(2200); o.laterUrl = location.pathname;
return o;
