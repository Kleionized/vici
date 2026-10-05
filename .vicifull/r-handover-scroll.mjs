/* Capture both sides of Letter Week XII scrolled by the same amount, so the
   lower two thirds of the 2,100pt letter are compared as pixels and not only
   as signature rows. The design frame's letter body is `overflow:auto`, so it
   scrolls the same way the app's ScrollView does. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.vicifull/drive.js', 'utf8');
const dy = Number(process.argv[2] ?? 900);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const scroll = (dy) => {
  const els = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight - d.clientHeight > 200 && d.clientHeight > 400);
  els.forEach((e) => { e.scrollTop = dy; });
  return els.map((e) => ({ h: e.clientHeight, sh: e.scrollHeight, top: e.scrollTop }));
};
const d = await ctx.newPage();
await d.goto('http://localhost:8097/f/Email-Login/Letter-Week-XII.html', { waitUntil: 'networkidle' });
console.log('design scrollers', JSON.stringify(await d.evaluate(scroll, dy)));
await d.waitForTimeout(400);
await d.screenshot({ path: `.vicifull/shots/r-handover/d-read-s${dy}.png` });
await d.close();
const a = await ctx.newPage();
await a.goto('http://localhost:8096/', { waitUntil: 'networkidle' });
await a.evaluate(() => { localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } })); localStorage.setItem('tideline.session.userId', 'mockuser_funnel'); localStorage.removeItem('tideline.mock.userdata.mockuser_funnel'); });
await a.goto('http://localhost:8096/welcome', { waitUntil: 'networkidle' });
await a.evaluate(DRIVE);
await a.evaluate(`(async () => { window.__H='read'; ${fs.readFileSync('.vicifull/drives/handover-walk.js', 'utf8')} })()`);
await a.waitForTimeout(1400);
console.log('app scrollers', JSON.stringify(await a.evaluate(scroll, dy)));
await a.waitForTimeout(600);
await a.screenshot({ path: `.vicifull/shots/r-handover/a-read-s${dy}.png` });
await a.close();
await browser.close();
