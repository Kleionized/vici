// medallions-letters Phase 2: capture the group's unframed screens at 393x852 and the three sweep sizes.
//   node .overhaul/ml-unframed.mjs <outDir> [filter]
// One browser; each shot in a fresh context (dpr 1). Insets as the size sweep sets them (status bar 20 at 667).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const [out = '.overhaul/shots/ml-unframed', only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const seed = (f) => fs.readFileSync(f, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const MED = seed('.overhaul/medallions-seed.js');
const FRESH = seed('.overhaul/medallions-fresh-seed.js');
const LET = seed('.overhaul/letters-seed.js');
// drive.js's scrollBy() recurses into window.scrollBy(0, dy) when nothing scrolls — scroll only a real scroller
const END = 'const n=[...document.querySelectorAll("div")].find(d=>d.scrollHeight>d.clientHeight+8&&getComputedStyle(d).overflowY!=="visible"); if(n){n.scrollTop=n.scrollHeight; await __sleep(400)}';
const PAGE2 = 'const d=[...document.querySelectorAll("div")].find(x=>x.scrollWidth>x.clientWidth+8); d.scrollLeft=d.clientWidth; await __sleep(700)';
const SHOTS = [
  ['mail', '/mail', MED],
  ['mail-end', '/mail', MED, END],
  ['week12-arrive', '/letter?variant=week12', LET],
  ['fresh-earned', '/milestones', FRESH],
  ['fresh-ahead-1', '/milestones', FRESH, 'await tap("Still to earn"); await __sleep(700)'],
  ['fresh-ahead-2', '/milestones', FRESH, `await tap("Still to earn"); await __sleep(700); ${PAGE2}`],
  ['oneoff-earned', '/medallions/veni?tier=platinum', MED],
  ['oneoff-unearned', '/medallions/return?tier=none', MED],
  ['tiered-unearned', '/medallions/archive?tier=none', MED],
  ['tiered-unearned-end', '/medallions/archive?tier=none', MED, END],
  ['notfound', '/medallions/zzz', MED],
  ['tiers-notfound', '/medallions/tiers/veni', MED],
];
const SIZES = [[393, 852], [375, 667], [390, 844], [430, 932]];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
for (const [name, route, s, drive] of SHOTS) {
  if (only && !name.includes(only)) continue;
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(st); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
    await ctx.addInitScript(`try { ${s} } catch (e) {}`);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log(`  [pageerror] ${name}: ${e.message}`));
    await page.goto('http://localhost:8096' + route, { waitUntil: 'networkidle' });
    await page.evaluate(DRIVE);
    await page.waitForTimeout(1600);
    if (drive) { try { await page.evaluate(`(async () => { ${drive} })()`); } catch (e) { console.log(`  drive ${name}: ${e.message}`); } }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const f = `${out}/${name}@${w}x${h}.png`;
    await page.screenshot({ path: f });
    console.log(f);
    await ctx.close();
  }
}
await browser.close();
