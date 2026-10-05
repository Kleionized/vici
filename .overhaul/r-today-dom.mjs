/* read specific DOM attributes off the running app, to prove an attribute
   actually reaches the document rather than only the JSX. Excludes nothing. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [route, seed, expr] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
if (seed && seed !== '-') ctx.addInitScript(fs.readFileSync(seed,'utf8'));
const page = await ctx.newPage();
await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(3500);
console.log(JSON.stringify(await page.evaluate(expr), null, 1));
await browser.close();
