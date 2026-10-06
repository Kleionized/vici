// Print Today's three page heights and the pager viewport at a size: node .overhaul/today-pageh.mjs 375x667 <seed>
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [W, H] = (process.argv[2] ?? '375x667').split('x').map(Number);
const seed = fs.readFileSync(process.argv[3] ?? '.overhaul/today-2000-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
await ctx.addInitScript(seed);
const page = await ctx.newPage();
await page.goto('http://localhost:8096/today', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
console.log(await page.evaluate(() => { const n = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight > d.clientHeight + 8 && getComputedStyle(d).overflowY !== 'visible')[0]; return JSON.stringify({ viewport: n.clientHeight, pages: [...n.firstElementChild.children].map((c) => c.offsetHeight) }); }));
await browser.close();
