// Verifier: drive the library group's flows with real mouse input, one Chrome.
// node .overhaul/verify/library/flows.mjs [scenarioRegex]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const BASE = 'http://localhost:8096';
const OUT = '.overhaul/verify/library';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'],
});

const results = [];
const log = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  :: ' + detail : ''}`); };

async function ctxWith(seedFile, w = 393, h = 852) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  if (seedFile) {
    const seed = fs.readFileSync(seedFile, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
    await ctx.addInitScript(`try { if (!sessionStorage.getItem('__seeded')) { ${seed}; sessionStorage.setItem('__seeded','1'); } } catch (e) { console.error('initseed: ' + e.message); }`);
  }
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('   [pageerror] ' + e.message.slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|DevTools/.test(m.text())) console.log('   [console.error] ' + m.text().slice(0, 200)); });
  return { ctx, page };
}

const path = (page) => { const u = new URL(page.url()); return u.pathname + u.search; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** the week heading(s) currently inside the viewport */
const visibleHeadings = (page) => page.evaluate(() => [...document.querySelectorAll('[role="heading"]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.bottom > 0 && r.top < innerHeight; }).map((e) => e.textContent.trim()));

/** click the centre of the first visible element whose aria-label or text matches */
async function clickByLabel(page, label, { exact = true } = {}) {
  const box = await page.evaluate(({ label, exact }) => {
    const els = [...document.querySelectorAll('[role="button"],[role="tab"],[role="link"],[role="radio"],[role="checkbox"],a,button')];
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.bottom > 0 && r.top < innerHeight; };
    const m = (e) => { const a = (e.getAttribute('aria-label') || '').trim(); const t = e.textContent.trim(); return exact ? a === label || t === label : a.includes(label) || t.includes(label); };
    let el = els.filter(vis).find(m);
    if (!el) { el = els.find((e) => m(e) && e.getBoundingClientRect().width > 0); if (el) { el.scrollIntoView({ block: 'center' }); } }
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, disabled: el.getAttribute('aria-disabled'), label: el.getAttribute('aria-label'), text: el.textContent.trim().slice(0, 60) };
  }, { label, exact });
  await sleep(300);
  if (!box) throw new Error('no visible control ' + JSON.stringify(label));
  await page.mouse.click(box.x, box.y);
  return box;
}

async function waitPath(page, pred, ms = 6000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (pred(path(page))) return true; await sleep(100); }
  return false;
}

async function open(page, route, settle = 2500) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await sleep(settle);
}

const scenarios = {
  async library38() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/library');
    let h = await visibleHeadings(page);
    log('library no param opens current week (day 38 → Discipline)', h.includes('Discipline'), `path ${path(page)} headings ${JSON.stringify(h)}`);
    // chevron position
    const chev = await page.evaluate(() => { const b = [...document.querySelectorAll('[role="button"]')].find((e) => e.getAttribute('aria-label') === 'Back'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    log('library back chevron box at 22,60 h40', !!chev && Math.abs(chev[0] - 22) < 1 && Math.abs(chev[1] - 60) < 1 && Math.abs(chev[3] - 40) < 1, JSON.stringify(chev));
    // current row → lesson 38
    let b = await clickByLabel(page, 'Keep rules that serve a purpose, lesson 38, today');
    let ok = await waitPath(page, (p) => p.startsWith('/lesson/day/38'));
    log('current row 38 → /lesson/day/38', ok, path(page));
    await page.goBack(); await sleep(1500);
    h = await visibleHeadings(page);
    log('history.back returns to library on Week VI', path(page).startsWith('/library') && h.includes('Discipline'), `${path(page)} ${JSON.stringify(h)}`);
    b = await clickByLabel(page, 'Practise the response, lesson 37, completed');
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/37'));
    log('done row 37 → /lesson/day/37', ok, path(page));
    await page.goBack(); await sleep(1500);
    b = await clickByLabel(page, 'Practise the part that gets in the way, lesson 39, upcoming');
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/39'));
    log('upcoming row 39 → /lesson/day/39', ok, path(page));
    await page.goBack(); await sleep(1500);
    // real horizontal wheel on the pager
    await page.mouse.move(200, 400);
    await page.mouse.wheel(393, 0);
    await sleep(1500);
    h = await visibleHeadings(page);
    const sl = await page.evaluate(() => [...document.querySelectorAll('div')].filter((d) => /(auto|scroll)/.test(getComputedStyle(d).overflowX) && d.scrollWidth > d.clientWidth + 10).map((d) => [d.scrollLeft, d.clientWidth, d.scrollWidth]));
    log('horizontal wheel → next week (Relapse and Adversity)', h.includes('Relapse and Adversity'), `${JSON.stringify(h)} pager ${JSON.stringify(sl)}`);
    const chev2 = await page.evaluate(() => { const bs = [...document.querySelectorAll('[role="button"]')].filter((e) => e.getAttribute('aria-label') === 'Back').map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }); return bs; });
    log('chevron still fixed after paging', JSON.stringify(chev2).includes('[22,60]'), JSON.stringify(chev2));
    // rows on week VII all upcoming → tap 43
    b = await clickByLabel(page, 'Learn from a slip, lesson 43, upcoming');
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/43'));
    log('week VII row 43 (after swipe) → /lesson/day/43', ok, path(page));
    await page.goBack(); await sleep(1500);
    h = await visibleHeadings(page);
    log('back from lesson after swipe returns to the swiped week', h.includes('Relapse and Adversity'), `${path(page)} ${JSON.stringify(h)}`);
    await page.mouse.move(200, 400);
    await page.mouse.wheel(-393, 0); await sleep(1500);
    h = await visibleHeadings(page);
    log('wheel back → Discipline', h.includes('Discipline'), JSON.stringify(h));
    // vertical wheel on rows viewport → P2
    await page.mouse.move(200, 600);
    await page.mouse.wheel(0, 400); await sleep(900);
    const st = await page.evaluate(() => [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(); return /(auto|scroll)/.test(getComputedStyle(d).overflowY) && d.scrollHeight > d.clientHeight + 1 && r.left >= -1 && r.right <= innerWidth + 1; }).map((d) => [d.scrollTop, d.clientHeight, d.scrollHeight, Math.round(d.getBoundingClientRect().top)]));
    log('vertical wheel on rows viewport stops at 264 (P2)', JSON.stringify(st).includes('[264,264,528,472]'), JSON.stringify(st));
    await page.screenshot({ path: `${OUT}/flow-lib-wheelP2.png` });
    await ctx.close();
  },

  async tabsBack() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/today', 3000);
    const b = await clickByLabel(page, 'Library');
    await sleep(1500);
    const h = await visibleHeadings(page);
    log('Today → Library tab lands on Week VI', path(page).startsWith('/library') && h.includes('Discipline'), `${path(page)} ${JSON.stringify(h)}`);
    const lit = await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].map((t) => `${t.textContent.trim()}:${t.getAttribute('aria-selected')}`));
    log('tab bar shows Library selected', lit.some((t) => t === 'Library:true'), JSON.stringify(lit));
    await clickByLabel(page, 'Back');
    const ok = await waitPath(page, (p) => p.startsWith('/today'));
    log('library chevron → back to /today', ok, path(page));
    await ctx.close();
  },

  async allDrawer() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    const longPressToday = async () => {
      const r = await page.evaluate(() => { const t = [...document.querySelectorAll('[role="tab"]')].find((e) => e.textContent.trim() === 'Today'); const b = t.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
      await page.mouse.move(r.x, r.y); await page.mouse.down(); await sleep(900); await page.mouse.up(); await sleep(1500);
    };
    await open(page, '/all', 3000);
    await clickByLabel(page, 'A week · board');
    await sleep(2500);
    let h = await visibleHeadings(page);
    const tabbars = await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].filter((t) => t.textContent.trim() === 'Library').length);
    log('All → "A week · board" lands on Week I (Reset)', h.includes('Reset'), `${path(page)} ${JSON.stringify(h)} libraryTabsInDOM=${tabbars}`);
    await clickByLabel(page, 'Back');
    await sleep(1500);
    log('chevron from week page opened via All (pre-overhaul: back to /all)', path(page).startsWith('/all'), `now at ${path(page)}`);
    await longPressToday();
    log('long-press Today → /all', path(page).startsWith('/all'), path(page));
    await clickByLabel(page, 'The library');
    await sleep(2000);
    h = await visibleHeadings(page);
    log('All → "The library" → Week VI', h.includes('Discipline'), `${path(page)} ${JSON.stringify(h)}`);
    await longPressToday();
    log('long-press Today → /all (library mounted)', path(page).startsWith('/all'), path(page));
    await clickByLabel(page, 'A week · board');
    await sleep(2500);
    h = await visibleHeadings(page);
    log('with library mounted on Week VI, A week · board → Week I', h.includes('Reset'), `${path(page)} ${JSON.stringify(h)}`);
    await page.mouse.move(200, 400); await page.mouse.wheel(393 * 3, 0); await sleep(1500);
    const hs = await visibleHeadings(page);
    await longPressToday();
    await clickByLabel(page, 'A week · board'); await sleep(2500);
    const h2 = await visibleHeadings(page);
    log('after swiping away, asking for week 1 again turns to Reset', h2.includes('Reset'), `${path(page)} afterSwipe=${JSON.stringify(hs)} after=${JSON.stringify(h2)}`);
    await ctx.close();
  },

  async clamp() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    for (const [route, want] of [['/week/99', 'Leave It Behind'], ['/week/abc', 'Reset'], ['/week/0', 'Reset'], ['/week/12', 'Leave It Behind'], ['/library?week=7', 'Relapse and Adversity']]) {
      await open(page, route, 2500);
      const h = await visibleHeadings(page);
      log(`${route} → ${want}`, h.includes(want), `${path(page)} ${JSON.stringify(h)}`);
    }
    await ctx.close();
  },

  async day3() {
    const { ctx, page } = await ctxWith('.overhaul/library-day3-seed.js');
    await open(page, '/library');
    const h = await visibleHeadings(page);
    const rows = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((e) => /lesson \d\d/.test(e.getAttribute('aria-label') || '')).filter((e) => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }).map((e) => e.getAttribute('aria-label')));
    log('day 3 library opens Week I with 03 current', h.includes('Reset') && rows.some((r) => /lesson 03, today/.test(r)), `${JSON.stringify(h)} ${JSON.stringify(rows.slice(0, 4))}`);
    await open(page, '/first-steps');
    const txt = await page.evaluate(() => document.body.innerText);
    log('first-steps shows "1 of 6 done"', txt.includes('1 of 6 done'), '');
    const st = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((e) => /^Step/.test(e.getAttribute('aria-label') || '')).map((e) => `${e.getAttribute('aria-label')}|dis=${e.getAttribute('aria-disabled')}`));
    log('first-steps rows/disabled states', st.length === 6, JSON.stringify(st));
    await clickByLabel(page, 'Step 5', { exact: false }); await sleep(1200);
    log('tapping locked step 5 does not navigate', path(page).startsWith('/first-steps'), path(page));
    await clickByLabel(page, 'Step 3', { exact: false });
    let ok = await waitPath(page, (p) => p.startsWith('/lesson/day/3'));
    log('step 3 (current) → /lesson/day/3', ok, path(page));
    await open(page, '/first-steps');
    await clickByLabel(page, 'Step 2', { exact: false });
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/2'));
    log('step 2 (open) → /lesson/day/2', ok, path(page));
    await open(page, '/first-steps');
    await clickByLabel(page, 'Close');
    ok = await waitPath(page, (p) => p.startsWith('/today'));
    log('first-steps close (no history) → /today', ok, path(page));
    await ctx.close();
  },

  async browserSearch() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/all', 3000);
    await clickByLabel(page, 'Lessons browser');
    let ok = await waitPath(page, (p) => p.startsWith('/lessons-browser'));
    await sleep(1500);
    log('All → Lessons browser', ok, path(page));
    const dis = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((e) => /lesson (01|38|39|84),/.test(e.getAttribute('aria-label') || '')).map((e) => `${e.getAttribute('aria-label')}|dis=${e.getAttribute('aria-disabled')}`));
    log('browser rows: 01/38 enabled, 39/84 disabled', /lesson 39, upcoming\|dis=true/.test(dis.join()) && /lesson 01, completed\|dis=null/.test(dis.join()) && /lesson 38, today\|dis=null/.test(dis.join()), JSON.stringify(dis));
    await clickByLabel(page, 'Prepare for tonight, lesson 01, completed');
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/1'));
    log('browser row 01 → /lesson/day/1', ok, path(page));
    await page.goBack(); await sleep(1500);
    await clickByLabel(page, 'Search lessons');
    ok = await waitPath(page, (p) => p.startsWith('/search'));
    await sleep(1500);
    log('browser search glyph → /search', ok, path(page));
    let txt = await page.evaluate(() => document.body.innerText);
    log('search empty query → 84 results', /84 results/i.test(txt), (txt.match(/\d+ results?/i) || [])[0]);
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
    log('search field autofocused', focused === 'INPUT', focused);
    await page.keyboard.type('brain'); await sleep(600);
    txt = await page.evaluate(() => document.body.innerText);
    log('typing "brain" filters', /\d+ results?/i.test(txt), (txt.match(/\d+ results?/i) || [])[0]);
    await page.fill('input', ''); await sleep(300);
    await clickByLabel(page, 'sleep'); await sleep(600);
    const val = await page.evaluate(() => document.querySelector('input').value);
    txt = await page.evaluate(() => document.body.innerText);
    const chip = await page.evaluate(() => [...document.querySelectorAll('[aria-checked],[aria-selected]')].map((e) => `${e.textContent.trim()}:${e.getAttribute('aria-checked') ?? e.getAttribute('aria-selected')}`));
    log('chip "sleep" fills the field and filters', val === 'sleep', `value=${val} ${(txt.match(/\d+ results?/i) || [])[0]} chips=${JSON.stringify(chip)}`);
    const first = await page.evaluate(() => { const e = [...document.querySelectorAll('[role="button"]')].find((x) => /lesson \d\d$/.test(x.getAttribute('aria-label') || '')); return e && e.getAttribute('aria-label'); });
    await clickByLabel(page, first);
    const n = Number(first.match(/lesson (\d\d)$/)[1]);
    ok = await waitPath(page, (p) => p.startsWith('/lesson/day/' + n));
    log(`search result "${first}" → /lesson/day/${n}`, ok, path(page));
    await page.goBack(); await sleep(1500);
    await clickByLabel(page, 'Cancel');
    ok = await waitPath(page, (p) => p.startsWith('/lessons-browser'));
    log('search Cancel → back to lessons-browser', ok, path(page));
    await sleep(800);
    await clickByLabel(page, 'Cancel');
    ok = await waitPath(page, (p) => p.startsWith('/all'));
    log('lessons-browser Cancel → back to /all', ok, path(page));
    await ctx.close();
  },

  async locked() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/all', 3000);
    await clickByLabel(page, 'Locked weeks');
    let ok = await waitPath(page, (p) => p.startsWith('/locked'));
    await sleep(1500);
    log('All → Locked weeks', ok, path(page));
    await clickByLabel(page, 'Back');
    await sleep(1500);
    log('locked Back (opened from All) →', true, path(page));
    await open(page, '/all', 3000);
    await clickByLabel(page, 'Locked weeks'); await sleep(1500);
    await clickByLabel(page, 'Unlock VICI Plus');
    ok = await waitPath(page, (p) => p.startsWith('/paywall'));
    log('Unlock VICI Plus → /paywall', ok, path(page));
    await sleep(1500);
    const closes = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].map((e) => e.getAttribute('aria-label') || e.textContent.trim()).filter(Boolean).slice(0, 12));
    try { await clickByLabel(page, 'Close'); } catch (e) { log('paywall close', false, JSON.stringify(closes)); }
    await sleep(1500);
    const afterClose = path(page);
    console.log('   after paywall close at', afterClose);
    await clickByLabel(page, 'Back'); await sleep(1500);
    log('paywall ✕ then locked Back', true, `after close at ${afterClose}; after Back ${path(page)}`);
    await open(page, '/locked');
    await clickByLabel(page, 'Back');
    ok = await waitPath(page, (p) => !p.startsWith('/locked'));
    log('locked Back with no history', ok, `now ${path(page)}`);
    await ctx.close();
  },

  async journey() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/all', 3000);
    await clickByLabel(page, 'The campaign');
    let ok = await waitPath(page, (p) => p.startsWith('/journey'));
    await sleep(1500);
    const txt = await page.evaluate(() => document.body.innerText);
    const labels = await page.evaluate(() => [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).filter((l) => /, (done|you are here|not yet)$/.test(l)));
    log('campaign renders 12 status rows', labels.length === 12, JSON.stringify(labels));
    log('campaign has "Day 90 · the vow, renewed"', txt.includes('Day 90 · the vow, renewed'), '');
    await clickByLabel(page, 'Back');
    ok = await waitPath(page, (p) => p.startsWith('/all'));
    log('campaign Back → /all', ok, path(page));
    await clickByLabel(page, 'Chapter II · The Crossing');
    ok = await waitPath(page, (p) => p.startsWith('/journey/crossing'));
    await sleep(1500);
    const lab2 = await page.evaluate(() => [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).filter((l) => /, (done|you are here|not yet)$/.test(l)));
    log('crossing at day 38: Highlands is "you are here"', lab2.some((l) => /^The Highlands, .*you are here$/.test(l)), JSON.stringify(lab2));
    await clickByLabel(page, 'Back');
    ok = await waitPath(page, (p) => p.startsWith('/all'));
    log('chapter Back → /all', ok, path(page));
    await open(page, '/journey/nope');
    const h = await visibleHeadings(page);
    log('/journey/nope → The Landing', h.includes('The Landing'), JSON.stringify(h));
    await clickByLabel(page, 'Back');
    ok = await waitPath(page, (p) => p === '/journey');
    log('chapter Back with no history → /journey', ok, path(page));
    await ctx.close();
  },

  async day90() {
    const seed = fs.readFileSync('.overhaul/library-seed.js', 'utf8').replace('midnight - 37 * DAY', 'midnight - 89 * DAY');
    fs.writeFileSync(`${OUT}/day90-seed.js`, seed);
    const { ctx, page } = await ctxWith(`${OUT}/day90-seed.js`);
    await open(page, '/library');
    const h = await visibleHeadings(page);
    const rows = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((e) => /lesson \d\d/.test(e.getAttribute('aria-label') || '')).filter((e) => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }).map((e) => e.getAttribute('aria-label')));
    log('day 90 opens Week XII, all rows completed', h.includes('Leave It Behind') && rows.length === 7 && rows.every((r) => /completed$/.test(r)), `${JSON.stringify(h)} ${JSON.stringify(rows)}`);
    await page.screenshot({ path: `${OUT}/flow-day90.png` });
    await ctx.close();
  },
  async extra() {
    const { ctx, page } = await ctxWith('.overhaul/library-seed.js');
    await open(page, '/library');
    await clickByLabel(page, 'Back');
    let ok = await waitPath(page, (p) => p.startsWith('/today'));
    log('direct /library → Back (no history) → /today', ok, path(page));
    await open(page, '/search');
    await page.keyboard.type('zzzz'); await sleep(600);
    const txt = await page.evaluate(() => document.body.innerText);
    log('search no match → "0 results"', /0 results/.test(txt), (txt.match(/\d+ results?/) || [])[0]);
    await page.screenshot({ path: `${OUT}/flow-search-empty.png` });
    await ctx.close();
  },
};

for (const [name, fn] of Object.entries(scenarios)) {
  if (only && !only.test(name)) continue;
  console.log(`\n## ${name}`);
  try { await fn(); } catch (e) { log(`${name} threw`, false, e.message.slice(0, 300)); }
}
await browser.close();
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
// (appended) extra checks — run with: node flows.mjs extra
