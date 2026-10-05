// One browser session per size: walk the slip flow and screenshot each step.
// node .overhaul/verify/slip/walk.mjs <w> <h> <seed> <tag> [route]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [W, H, SEED, TAG, ROUTE = '/slip', PLAN = 'main'] = process.argv.slice(2);
const OUT = '.overhaul/verify/slip/small';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: Number(W), height: Number(H) }, deviceScaleFactor: 2 });
const seed = fs.readFileSync(SEED, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('initseed: ' + e.message); }`);
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
await page.goto('http://localhost:8096' + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await page.evaluate(fs.readFileSync('.overhaul/drive.js', 'utf8'));
await page.waitForTimeout(1800);
const shot = async (name, scrollEnd) => {
  await page.waitForTimeout(900);
  const info = await page.evaluate(() => {
    const sc = [...document.querySelectorAll('*')].filter((el) => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100; });
    return sc.map((el) => ({ sh: el.scrollHeight, ch: el.clientHeight, top: Math.round(el.getBoundingClientRect().top) }));
  });
  await page.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
  let extra = '';
  if (scrollEnd) {
    await page.evaluate(() => { const sc = [...document.querySelectorAll('*')].filter((el) => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100; }); sc.forEach((el) => { el.scrollTop = el.scrollHeight; }); });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${TAG}-${name}-end.png` });
    extra = ' +end';
  }
  console.log(`${name}: scrollers ${JSON.stringify(info)}${extra}`);
};
const tap = (l) => page.evaluate((x) => window.tap(x), l);
try {
  if (PLAN === 'main') {
    await shot('A-entry');
    await tap('Log the slip'); await shot('B-closeit');
    await tap('Continue'); await shot('C-when', true);
    await tap('Change'); await page.waitForTimeout(800); await shot('C-when-sheet');
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    await tap('Continue'); await shot('D-fed-empty');
    await tap('Tired'); await tap('Phone in bed'); await tap('Late night'); await shot('D-fed');
    await tap('Continue'); await shot('E-logged', true);
    await tap('Continue'); await tap('A little'); await shot('F-urgenow', true);
    await tap('Continue'); await shot('G-warn');
    await tap('Continue'); await shot('card0');
    // deck with Tired, Phone in bed, Late night: feel-tired, trig-late-night, then the rest in file order
    const want = { 'Skip the self-lecture.': 'ashamed', 'Stop feeding it.': 'turnedon', 'Get out of bed for a few minutes.': 'cantsleep', 'Change what happens next.': 'habit', 'Leave the room.': 'beingalone', 'Move the phone.': 'latenight' };
    for (let i = 0; i < 19; i++) {
      const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
      for (const [k, v] of Object.entries(want)) if (t.includes(k)) { await shot('card-' + v); delete want[k]; }
      await tap('Give me another'); await page.waitForTimeout(200);
    }
    await tap('Done').catch(async () => tap('Continue'));
    await shot('J-pledge');
    await tap('Sign it again'); await shot('K-begin');
  } else if (PLAN === 'morning') {
    await shot('L-morning');
  } else if (PLAN === 'pledge') {
    await tap('Log the slip'); await tap('Continue'); await tap('Continue'); await tap('Bored'); await tap('Continue');
    await page.waitForTimeout(800); await tap('Continue'); await tap('Continue'); await tap('Continue');
    await tap('Done'); await shot('J-pledge', true);
  } else if (PLAN === 'warn') {
    await tap('Log the slip'); await tap('Continue'); await tap('Continue'); await tap('Bored'); await tap('Continue');
    await page.waitForTimeout(800); await tap('Continue'); await tap('Continue'); await shot('G-warn');
  }
} catch (e) { console.log('ERR ' + e.message); }
await browser.close();
