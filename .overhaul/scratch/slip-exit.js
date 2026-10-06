await __sleep(1200);
await tap('I slipped'); await __sleep(1200);
await tap('Log the slip'); await tap('Continue'); await tap('Continue'); await tap('Tired'); await tap('Continue'); await tap('Continue');
await tap('I’m already watching again'); await tap('Continue'); await __sleep(1200);
const at1 = location.pathname, len1 = history.length;
await tap('Close'); await __sleep(1200);
const at2 = location.pathname;
return { at1, len1, at2 };
