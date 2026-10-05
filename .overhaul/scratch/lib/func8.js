const out = {};
await __sleep(400);
await tap('Unlock VICI Plus'); await __sleep(1800);
out.unlock = location.pathname;
history.back(); await __sleep(1500);
out.backTo = location.pathname;
await tap('Back'); await __sleep(1500);
out.back = location.pathname;
return out;
