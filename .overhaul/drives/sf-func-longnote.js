await __sleep(600);
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles)); };
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']); await tap('Continue'); await seen(['Where are you right now?']); await tap('Continue'); await seen(['Open the door and move.']); await tap('Continue'); await seen(['Move I of 3']); await tap('Continue'); await seen(['Move II of 3']); await tap('Continue'); await seen(['Move III of 3']); await tap('Continue'); await seen(['What’s feeding it right now?']); await tap('Continue'); await seen(['What’s underneath it?']).catch(()=>null); 
// trigger board (unknown) → feeling
if (!__txt().includes('What’s underneath it?')) { await tap('Done').catch(()=>tap('Continue')); await seen(['What’s underneath it?']); }
await tap('Continue'); await __sleep(400); await tap('Done'); await seen(['Where is the urge now?']); await tap('Continue'); await seen(['One more thing.']);
const ta = document.querySelector('textarea');
const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(ta), 'value').set;
setter.call(ta, (window.__NOTE || 'I need to tell her that I was wrong about Sunday, that I am sorry, and that I would like to try again next weekend if she is willing. I also need to say that I have been struggling and that I am working on it every night now, and that I will keep working on it for as long as it takes, because it matters to me more than I have said.'));
ta.dispatchEvent(new Event('input', { bubbles: true }));
await __sleep(500); ta.blur();
const r = ta.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height), ta.scrollHeight];
