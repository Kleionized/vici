// sos-flow functional walk: the Reassess line follows the direction the urge moved (D254).
// `--do="window.__BAND='Faint'"` picks the first read; every second read is then tapped and its line read back.
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles)); };
await __sleep(600);
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']);
await tap(window.__BAND || 'Intense'); await __sleep(200);
await tap('Continue'); await seen(['Where are you right now?']); await tap('Continue'); await seen(['Open the door and move.']); await tap('Continue'); await seen(['Move I of 3']); await tap('Continue'); await seen(['Move II of 3']); await tap('Continue'); await seen(['Move III of 3']); await tap('Continue'); await seen(['What’s feeding it right now?']); await tap('Continue'); await __sleep(500);
await tap('Continue').catch(() => tap('Done')); await seen(['What’s underneath it?']);
await tap('Continue'); await __sleep(500); await tap('Done'); await seen(['Where is the urge now?']);
const line = () => (__txt().match(/(It passed|Holding steady|Coming down|Rising)( — (from \d to \d|still at \d))?/) || ['?'])[0];
const word = () => (__txt().match(/\b(Gone|Noticeable|Still there|Strong|Peaking)\b/) || ['?'])[0];
const out = ['default ' + word() + ' / ' + line()];
for (const b of ['Gone', 'Noticeable', 'Still there', 'Strong', 'Peaking']) { await tap(b); await __sleep(200); out.push(b + ' / ' + line()); }
return (window.__BAND || 'Intense') + ' :: ' + out.join(' | ');
