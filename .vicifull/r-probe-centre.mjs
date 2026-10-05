/* Test: does the canvas's own centring mechanism (top:50% + translateY(-50%))
   put the glyphs half a pixel higher than flex centring, at the same box top?
   Patch the DESIGN frame to flex-centre its tile text stack and re-measure the
   ink rows of "Week IV". Nothing else is touched. */
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:8097/f/Email-Login/Campaign-Map.html', { waitUntil: 'networkidle' });
const before = await page.evaluate(() => {
  const el = [...document.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim() === 'Week IV');
  return { top: el.getBoundingClientRect().top, h: el.getBoundingClientRect().height, stack: el.parentElement.getBoundingClientRect().top };
});
await page.screenshot({ path: '.vicifull/shots/r-handover/x-centre-before.png' });
const after = await page.evaluate(() => {
  const el = [...document.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim() === 'Week IV');
  const stack = el.parentElement;
  stack.style.top = '0'; stack.style.bottom = '0'; stack.style.transform = 'none';
  stack.style.display = 'flex'; stack.style.flexDirection = 'column'; stack.style.justifyContent = 'center';
  return { top: el.getBoundingClientRect().top, h: el.getBoundingClientRect().height, stack: stack.getBoundingClientRect().top };
});
await page.screenshot({ path: '.vicifull/shots/r-handover/x-centre-after.png' });
console.log('before', JSON.stringify(before), '\nafter ', JSON.stringify(after));
await browser.close();
