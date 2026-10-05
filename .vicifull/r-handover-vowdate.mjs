/* The Vow's date line is `new Date()` (welcome.tsx:223), not account state, so
   F28's "seed the state the frame draws" means pinning the clock. Freeze the
   page's clock at the frame's own authoring day and re-capture, to establish
   whether the date line is a live-clock divergence or a real format defect. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.vicifull/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => {
  const FIXED = new Date('2026-06-09T12:00:00').getTime();
  const R = Date;
  // eslint-disable-next-line no-global-assign
  Date = class extends R { constructor(...a) { if (a.length === 0) super(FIXED); else super(...a); } static now() { return FIXED; } };
  Date.parse = R.parse; Date.UTC = R.UTC;
});
const page = await ctx.newPage();
await page.goto('http://localhost:8096/', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await page.evaluate(() => { localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } })); localStorage.setItem('tideline.session.userId', 'mockuser_funnel'); localStorage.removeItem('tideline.mock.userdata.mockuser_funnel'); });
await page.goto('http://localhost:8096/welcome', { waitUntil: 'networkidle' });
await page.evaluate(DRIVE);
await page.evaluate(`(async () => { window.__H='vow'; ${fs.readFileSync('.vicifull/drives/handover-walk.js', 'utf8')} })()`);
await page.waitForTimeout(1400);
console.log(await page.evaluate(() => document.body.innerText.replace(/\n+/g, ' | ').slice(0, 300)));
await page.screenshot({ path: '.vicifull/shots/r-handover/a-vow-jun9.png' });
await browser.close();
