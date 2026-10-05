/* Letter Week XII via /letter?variant=week12 (this group's caller), both sides
   scrolled to the same offset. The design frame's letter body is overflow:auto. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.vicifull/drive.js', 'utf8');
const SEED = fs.readFileSync('.vicifull/letters-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const dy = Number(process.argv[2] ?? 900);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--disable-extensions','--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
await ctx.addInitScript(`try { ${SEED} } catch (e) {}`);
const scroll = (dy) => {
  const els = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight - d.clientHeight > 200 && d.clientHeight > 400);
  els.forEach((e) => { e.scrollTop = dy; });
  return els.map((e) => ({ h: e.clientHeight, sh: e.scrollHeight, top: e.scrollTop }));
};
const d = await ctx.newPage();
await d.goto('http://localhost:8097/f/Email-Login/Letter-Week-XII.html', { waitUntil: 'networkidle' });
console.log('design scrollers', JSON.stringify(await d.evaluate(scroll, dy)));
await d.waitForTimeout(400);
await d.screenshot({ path: `.vicifull/rl/ds-${dy}.png` });
await d.close();
const a = await ctx.newPage();
await a.goto('http://localhost:8096/letter?variant=week12', { waitUntil: 'networkidle' });
await a.evaluate(DRIVE);
await a.waitForTimeout(1300);
await a.evaluate(`(async () => { await tap('Open it'); })()`);
await a.waitForTimeout(1400);
console.log('app scrollers', JSON.stringify(await a.evaluate(scroll, dy)));
await a.waitForTimeout(600);
await a.screenshot({ path: `.vicifull/rl/as-${dy}.png` });
await a.close();
await browser.close();
