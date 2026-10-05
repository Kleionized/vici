const o = {};
await waitFor('Insights');
o.range0 = (__txt().match(/[A-Z][a-z]{2} \d+ – [A-Z][a-z]{2} \d+/) || [])[0];
await tap('4W'); await __sleep(600); o.range4 = (__txt().match(/[A-Z][a-z]{2} \d+ – [A-Z][a-z]{2} \d+/) || [])[0];
await tap('12W'); await __sleep(600); o.range12 = (__txt().match(/[A-Z][a-z]{2} \d+ – [A-Z][a-z]{2} \d+/) || [])[0];
await tap('Your mail'); await __sleep(1800); o.mail = location.pathname;
return o;
