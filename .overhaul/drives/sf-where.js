await __sleep(600);
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles) + ' :: ' + __txt().slice(0, 200)); };
const only = async (label) => { const chips = [...document.querySelectorAll('[role="checkbox"],[role="radio"]')]; for (const c of chips) if (c.getAttribute('aria-checked') === 'true' && c.textContent.trim() !== label) { __fire(c); await __sleep(200); } const me = chips.find((c) => c.textContent.trim() === label); if (!me || me.getAttribute('aria-checked') !== 'true') await tap(label); };
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']); await tap('Continue'); await seen(['Where are you right now?']);
