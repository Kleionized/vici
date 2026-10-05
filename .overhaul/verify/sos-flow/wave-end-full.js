await __sleep(600);
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles) + ' :: ' + __txt().slice(0, 200)); };
const only = async (label) => { const chips = [...document.querySelectorAll('[role="checkbox"],[role="radio"]')]; for (const c of chips) if (c.getAttribute('aria-checked') === 'true' && c.textContent.trim() !== label) { __fire(c); await __sleep(200); } const me = chips.find((c) => c.textContent.trim() === label); if (!me || me.getAttribute('aria-checked') !== 'true') await tap(label); };
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']); await tap('Continue'); await seen(['Where are you right now?']); await only('Somewhere private'); await tap('Continue'); await seen(['Open the door and move.']); await tap('Continue'); await seen(['Move I of 3']); await tap('Continue'); await seen(['Move II of 3']); await tap('Continue'); await seen(['Move III of 3']); await tap('Continue'); await seen(['What’s feeding it right now?']); await only('Doomscrolling'); await tap('Continue'); await seen(['Get off the feed.']); await tap('Continue'); await seen(['What’s underneath it?']); await only('Turned on'); await tap('Continue'); await seen(['Let it pass.']); await tap('Done'); await seen(['Where is the urge now?']); await tap('Continue'); await seen(['One more thing.']); await tap('Done'); await seen(['Breathe in.']);
await seen(["Tap the numbers as they land."], 50000);
for (let i = 1; i <= 5; i += 1) await tap("Number " + i);
await seen(["Find the one that’s different."]);
for (let r = 0; r < 6; r += 1) { const t = [...document.querySelectorAll("[aria-label^=\"Tile \"]")].find((e) => getComputedStyle(e).backgroundColor === "rgb(255, 255, 255)"); __fire(t); await __sleep(300); }
await seen(["Ride it out."]);
const r = Date.now.bind(Date); Date.now = () => r() + 120000;
const t0 = r(); while (r() - t0 < 4000) { if (__txt().includes('The wave passed.')) break; await __sleep(100); }
return __txt().slice(0, 120);
