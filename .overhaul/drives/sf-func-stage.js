// sos-flow functional walk 2: ?board=, the challenge's back, the stage controls and settings.
const log = [];
const ok = (c, m) => { log.push((c ? 'ok ' : 'FAIL ') + m); };
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return true; await __sleep(90); } return false; };
await __sleep(600);
// opened on /urge?board=SOS-Challenge
ok(await seen(['Break the isolation.']), 'board=SOS-Challenge draws the challenge');
ok(!!document.querySelector('[aria-label="Back"]'), 'challenge draws the back chevron');
await tap('Give me another'); ok(await seen(['Let it pass.']), 'challenge another wraps → Turned on');
ok(!document.querySelector('[aria-label="Back"]'), 'feeling board draws no back');
await tap('Done'); await seen(['Where is the urge now?']);
await tap('Back'); ok(await seen(['Let it pass.']), 'reassess back → feeling board');
await tap('Done'); await seen(['Where is the urge now?']);
await tap('Continue'); await seen(['One more thing.']); await tap('Done'); ok(await seen(['Breathe in.']), 'to breathe');
await tap('SOS settings'); ok(await seen(['Orb light']), 'gear opens settings');
await tap('Rain'); await tap('Gold light'); await tap('Starfield'); await __sleep(300);
const st = JSON.parse(localStorage.getItem('tideline.sos.settings') || 'null');
ok(st && st.sound === 'rain' && st.light === 'gold' && st.background === 'starfield', 'settings saved ' + JSON.stringify(st));
{ const ds = __btns().filter((b) => b.textContent.trim() === 'Done'); __fire(ds[ds.length - 1]); } await __sleep(600);
ok(!__txt().includes('Orb light') || getComputedStyle(document.querySelector('[role=dialog]') || document.body).opacity === '0', 'sheet Done closes');
await tap('I slipped'); await __sleep(1200); ok(location.pathname === '/slip', 'I slipped → ' + location.pathname);
return log.filter((l) => !l.startsWith('ok ')).join(' || ').slice(0, 380) || 'all ok (' + log.length + ')';
