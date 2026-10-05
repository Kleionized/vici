/* Capture /score and /today under a stated browser locale, to test whether any
   rendered string is locale-dependent. Excludes nothing. */
import fs from 'node:fs'; import { chromium } from 'playwright-core';
const [route, seed, loc] = process.argv.slice(2);
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage',`--lang=${loc}`] });
const ctx = await browser.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:2, locale: loc, timezoneId:'Europe/London' });
ctx.addInitScript(fs.readFileSync(seed,'utf8'));
const page = await ctx.newPage();
await page.goto('http://localhost:8096'+route, { waitUntil:'domcontentloaded', timeout:120000 });
await page.waitForTimeout(4000);
console.log(loc, '->', JSON.stringify(await page.evaluate(`Array.from(document.querySelectorAll('div,span')).map(e=>e.childElementCount===0&&e.textContent).filter(t=>t&&/[0-9]/.test(t)&&t.length<40).slice(0,24)`)));
await browser.close();
