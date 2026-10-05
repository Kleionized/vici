await __sleep(600);
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles)); };
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']);
await tap(window.__BAND || 'Faint'); await __sleep(200);
await tap('Continue'); await seen(['Where are you right now?']); await tap('Continue'); await seen(['Open the door and move.']); await tap('Continue'); await seen(['Move I of 3']); await tap('Continue'); await seen(['Move II of 3']); await tap('Continue'); await seen(['Move III of 3']); await tap('Continue'); await seen(['What’s feeding it right now?']); await tap('Continue'); await __sleep(500);
await tap('Continue').catch(() => tap('Done')); await seen(['What’s underneath it?']);
await tap('Continue'); await __sleep(500); await tap('Done'); await seen(['Where is the urge now?']);
const out = [__txt().match(/(Gone|Noticeable|Still there|Strong|Peaking)\s+[^]*?to \d|still at \d/)?.[0]];
if (window.__AFTER) { await tap(window.__AFTER); await __sleep(200); out.push(__txt().match(/(Gone|Noticeable|Still there|Strong|Peaking) [A-Z][^—]*— [a-z]+ [^.]*?\d( to \d)?/)?.[0]); }
return out;
