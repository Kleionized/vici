const o = {};
await waitFor('Open the report');
await tap('Close'); await __sleep(2200); o.closeUrl = location.pathname;
return o;
