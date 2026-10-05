// Real-mouse tap on a neighbour wheel row in the Lapse When step (seeded, clock pinned 23:40).
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
await ctx.addInitScript(fs.readFileSync(process.argv[3] || '.overhaul/logs-flow-seed.js', 'utf8'));
const page = await ctx.newPage();
page.on('console', (m) => { if (m.text().startsWith('DBG')) console.log(m.text()); });
await page.goto('http://localhost:8096/' + (process.argv[2] || 'lapse'), { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(3000);
const vals = () => page.evaluate(() => [...document.querySelectorAll('[aria-valuetext]')].map((e) => e.getAttribute('aria-label') + '=' + e.getAttribute('aria-valuetext')).join(' | '));
console.log('CHECK before', await vals());
for (const lab of (process.env.LABS || 'Hour 10,Minute 41,AM or PM AM').split(',')) {
  const b = await page.locator(`[aria-label="${lab}"]`).first().boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1200);
  console.log('CHECK after', lab, '→', await vals(), '| row:', await page.evaluate(() => [...document.querySelectorAll('div')].map((d) => d.textContent).find((t) => /Change$/.test(t) && t.length < 40)));
}
await browser.close();
