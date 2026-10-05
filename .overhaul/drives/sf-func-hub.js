// sos-flow functional walk 3: the hub's controls.
const log = [];
const ok = (c, m) => { log.push((c ? 'ok ' : 'FAIL ') + m); };
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return true; await __sleep(90); } return false; };
const sel = (q) => document.querySelector(q);
await __sleep(800);
ok(await seen(['Get out of bed.']), 'hub opens on 85A');
ok(!document.querySelector('[role=radio][aria-checked=true]'), 'no chip chosen');
await tap('Relationship'); await __sleep(300);
ok(sel('[role=radio][aria-checked=true]')?.textContent === 'Relationship', 'chip chosen');
ok(JSON.parse(localStorage.getItem('tideline.urgeSession') || '{}').trigger === 'Relationship', 'chip saved on session');
await tap('Pane 3'); await __sleep(800);
const sc = [...document.querySelectorAll('div')].find((d) => d.scrollWidth > d.clientWidth + 100 && getComputedStyle(d).overflowX !== 'visible');
ok(sc && Math.round(sc.scrollLeft / sc.clientWidth) === 2, 'Pane 3 pages to 85C (' + (sc && sc.scrollLeft) + ')');
ok(sel('[aria-label="Pane 3"]')?.getAttribute('aria-selected') === 'true', 'dot 3 selected');
await tap('Breathe'); ok(await seen(['Breathe in.']), 'Breathe → 85F');
await tap('Back'); await __sleep(900);
// every pane is in the DOM at once, so the text alone cannot say which one is on screen: read the pager
const page = () => { const s = [...document.querySelectorAll('div')].find((d) => d.scrollWidth > d.clientWidth + 100 && getComputedStyle(d).overflowX !== 'visible'); return s ? Math.round(s.scrollLeft / s.clientWidth) + 1 : 0; };
ok(page() === 3 && sel('[aria-label="Pane 3"]')?.getAttribute('aria-selected') === 'true', '85F back → the panes, still on pane 3 (page ' + page() + ')');
await tap('Breathe'); await seen(['Breathe in.']); await tap('Done'); await __sleep(900); ok(!__txt().includes('Breathe in.') && page() === 3, '85F Done → the panes, on pane 3');
await tap('Breathe'); await seen(['Breathe in.']); ok(await seen(['Tap the numbers as they land.'], 50000), 'breathe round → tap stage');
for (let i = 1; i <= 5; i += 1) await tap('Number ' + i);
ok(await seen(['Find the one that’s different.']), 'tap → odd');
for (let r = 0; r < 6; r += 1) { const t = [...document.querySelectorAll('[aria-label^="Tile "]')].find((e) => getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)'); __fire(t); await __sleep(300); }
ok(await seen(['Get out of bed.', 'Every urge so far has ended.']), 'odd → back to panes');
await tap('I slipped'); await __sleep(1200); ok(location.pathname === '/slip', 'I slipped → ' + location.pathname);
return log.filter((l) => !l.startsWith('ok ')).join(' || ').slice(0, 380) || 'all ok (' + log.length + ')';
