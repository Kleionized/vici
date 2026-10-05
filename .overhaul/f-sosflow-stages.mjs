// node stages-walk.mjs <W> <H> <outdir> [interrupt|hub] — walks the SOS stages and captures each, with scroll extents
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [W, H, OUT, CTX = 'interrupt'] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
if (CTX === 'hub') { const s = fs.readFileSync('.overhaul/sosflow-hub-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', ''); await ctx.addInitScript(`try { ${s} } catch (e) {}`); }
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
await page.goto('http://localhost:8096' + (CTX === 'hub' ? '/urge-hub' : '/urge'), { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await page.evaluate(fs.readFileSync('.overhaul/drive.js', 'utf8'));
await page.waitForTimeout(1500);
const ev = (js) => page.evaluate(`(async () => { ${js} })()`);
const measure = async (name) => {
  const r = await page.evaluate(() => {
    const sc = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.getBoundingClientRect().height > 100);
    return sc.map((el) => ({ top: Math.round(el.getBoundingClientRect().top), bottom: Math.round(el.getBoundingClientRect().bottom), sh: el.scrollHeight, ch: el.clientHeight }));
  });
  console.log(name, JSON.stringify(r));
  await page.screenshot({ path: `${OUT}/${name}.png` });
};
const seen = `const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles) + ' :: ' + __txt().slice(0, 200)); };`;
if (CTX === 'hub') {
  await ev(`${seen} await seen(['Get out of bed.']); await tap('Breathe'); await seen(['Breathe in.']);`);
} else {
  await ev(`${seen} const only = async (label) => { const chips = [...document.querySelectorAll('[role="checkbox"],[role="radio"]')]; for (const c of chips) if (c.getAttribute('aria-checked') === 'true' && c.textContent.trim() !== label) { __fire(c); await __sleep(200); } const me = chips.find((c) => c.textContent.trim() === label); if (!me || me.getAttribute('aria-checked') !== 'true') await tap(label); };
await seen(['The first 90 seconds.']);
await tap('Start'); await seen(['How strong is it right now?']); await tap('Continue'); await seen(['Where are you right now?']); await only('Somewhere private'); await tap('Continue'); await seen(['Open the door and move.']); await tap('Continue'); await seen(['Move I of 3']); await tap('Continue'); await seen(['Move II of 3']); await tap('Continue'); await seen(['Move III of 3']); await tap('Continue'); await seen(['What’s feeding it right now?']); await only('Doomscrolling'); await tap('Continue'); await seen(['Get off the feed.']); await tap('Continue'); await seen(['What’s underneath it?']); await only('Turned on'); await tap('Continue'); await seen(['Let it pass.']); await tap('Done'); await seen(['Where is the urge now?']); await tap('Continue'); await seen(['One more thing.']); await tap('Done'); await seen(['Breathe in.']);`);
}
await page.waitForTimeout(300);
await measure(`${CTX}-1-breathe`);
await ev(`${seen} await seen(['Tap the numbers as they land.'], 50000);`);
await page.waitForTimeout(400);
await measure(`${CTX}-2-tap`);
await ev(`${seen} for (let i = 1; i <= 3; i += 1) await tap('Number ' + i);`);
await page.waitForTimeout(300);
await measure(`${CTX}-2b-tap3`);
await ev(`${seen} for (let i = 4; i <= 5; i += 1) await tap('Number ' + i); await seen(['Find the one that’s different.']);`);
await page.waitForTimeout(400);
await measure(`${CTX}-3-odd`);
if (CTX !== 'hub') {
  await ev(`${seen} for (let r = 0; r < 6; r += 1) { const t = [...document.querySelectorAll('[aria-label^="Tile "]')].find((e) => getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)'); __fire(t); await __sleep(300); } await seen(['Ride it out.']);`);
  await page.waitForTimeout(400);
  await measure(`${CTX}-4-wave`);
} else {
  await ev(`${seen} for (let r = 0; r < 6; r += 1) { const t = [...document.querySelectorAll('[aria-label^="Tile "]')].find((e) => getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)'); __fire(t); await __sleep(300); } await seen(['Get out of bed.']);`);
  await page.waitForTimeout(400);
  await measure(`${CTX}-4-panes`);
}
await browser.close();
