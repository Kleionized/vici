// library Phase 2: capture the group's unframed screens at 393x852 and the three sweep sizes.
//   node .overhaul/lib-unframed.mjs <outDir> [filter] [--sizes=393x852,375x667]
// One browser; each shot in a fresh context (dpr 1). Insets as the size sweep sets them (status bar 20 at 667).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [out = '.overhaul/shots/lib-unframed', only] = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(out, { recursive: true });
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const seed = (f) => fs.readFileSync(f, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const D38 = seed('.overhaul/library-seed.js');
const D3 = seed('.overhaul/library-day3-seed.js');
// the tallest vertical scroller in view, to its end
const END = 'const n=[...document.querySelectorAll("div")].filter(d=>d.scrollHeight>d.clientHeight+8&&/(auto|scroll)/.test(getComputedStyle(d).overflowY)&&d.getBoundingClientRect().left>-1&&d.getBoundingClientRect().right<innerWidth+1).sort((a,b)=>b.clientHeight-a.clientHeight)[0]; if(n){n.scrollTop=n.scrollHeight; await __sleep(500)}';
const SHOTS = [
  ['library', '/library', D38],
  ['lessons-browser', '/lessons-browser', D38],
  ['lessons-browser-end', '/lessons-browser', D38, END],
  ['search', '/search', D38],
  ['search-sleep', '/search', D38, 'await tap("sleep"); await __sleep(600)'],
  ['search-end', '/search', D38, END],
  ['first-steps', '/first-steps', D3],
  ['first-steps-end', '/first-steps', D3, END],
  ['first-steps-d38', '/first-steps', D38],
  ['locked', '/locked', D38],
  ['locked-end', '/locked', D38, END],
  ['journey', '/journey', D38],
  ['journey-end', '/journey', D38, END],
  ['chapter-landing', '/journey/landing', D38],
  ['chapter-crossing', '/journey/crossing', D38],
  ['chapter-highlands', '/journey/highlands', D38],
  ['chapter-watch', '/journey/watch', D38],
  ['chapter-watch-end', '/journey/watch', D38, END],
];
const SIZES = (flags.sizes ?? '393x852,375x667,390x844,430x932').split(',').map((s) => s.split('x').map(Number));
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
