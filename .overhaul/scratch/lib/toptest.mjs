import { chromium } from 'playwright-core';
const [frame, top, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
await page.goto(`http://localhost:8097/f/Email-Login/${frame}`, { waitUntil: 'networkidle' });
await page.evaluate(async (t) => { await document.fonts.ready; const s = document.querySelector('svg[data-hero]'); if (t !== 'keep') s.style.top = t + 'px'; }, top);
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
