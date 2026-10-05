// sos-flow functional walk: the SOS settings gear on the hub's breathing board (D256), and the sheet staying open over the stage.
const log = [];
const ok = (c, m) => { log.push((c ? 'ok ' : 'FAIL ') + m); };
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return true; await __sleep(90); } return false; };
await __sleep(800);
await tap('Breathe'); ok(await seen(['Breathe in.']), 'Breathe → 85F');
ok(!__txt().includes('Orb light'), 'sheet closed at first');
await tap('SOS settings'); ok(await seen(['Orb light']), 'gear opens the sheet');
await tap('Silent'); await tap('Violet light'); await tap('Dawn'); await __sleep(300);
const st = JSON.parse(localStorage.getItem('tideline.sos.settings') || 'null');
ok(st && st.sound === 'silent' && st.light === 'violet' && st.background === 'dawn', 'saved ' + JSON.stringify(st));
const done = [...document.querySelectorAll('[role=button]')].filter((b) => b.textContent.trim() === 'Done');
__fire(done[done.length - 1]); await __sleep(700);
ok(!__txt().includes('Orb light') || getComputedStyle([...document.querySelectorAll('div')].find((d) => d.textContent === 'Orb light')).opacity === '0', 'sheet Done closes it');
await tap('Back'); ok(await seen(['Get out of bed.']), 'back to the panes');
await tap('Breathe'); await seen(['Breathe in.']); await __sleep(400);
ok(!__txt().includes('Orb light'), 'reopened breathing board has no sheet open');
return log.filter((l) => !l.startsWith('ok ')).join(' || ').slice(0, 380) || 'all ok (' + log.length + ')';
