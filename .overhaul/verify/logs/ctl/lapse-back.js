const o = {};
await waitFor('When did it happen?');
await tap('Continue'); await waitFor('What fed it?');
await tap('Back'); await __sleep(500); o.back1 = __txt().includes('When did it happen?');
await tap('Back'); await __sleep(1800); o.back0url = location.pathname;
return o;
