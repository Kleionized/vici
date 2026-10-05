await __sleep(600);
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles) + ' :: ' + __txt().slice(0, 200)); };
await seen(['It happened.']);
