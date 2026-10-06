// Tick today's disc with nothing named (day 41, Fri 18 Jul 09:00), then open the next morning's check-in
// on the same data and read what Morning Task Check asks after.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/today-0900-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const CLOCK = fs.readFileSync('.overhaul/clock.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
let ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
await ctx.addInitScript(SEED);
let page = await ctx.newPage();
await page.goto('http://localhost:8096/today', { waitUntil: 'networkidle' });
await page.evaluate(DRIVE); await page.waitForTimeout(1800);
await page.evaluate(`(async () => { const n=[...document.querySelectorAll('div')].filter(d=>d.scrollHeight>d.clientHeight+8 && getComputedStyle(d).overflowY!=='visible')[0]; n.scrollTop=n.firstElementChild.children[1].offsetTop; await __sleep(600); await tap('Today’s task done'); await __sleep(800) })()`);
const dump = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)]))));
await ctx.close();
ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
await ctx.addInitScript(`window.__CLOCK='2025-07-19T09:00'; ${CLOCK}; if (!sessionStorage.getItem('p2.restored')) { const d = ${dump}; localStorage.clear(); for (const k in d) localStorage.setItem(k, d[k]); sessionStorage.setItem('p2.restored', '1'); }`);
page = await ctx.newPage();
await page.goto('http://localhost:8096/day/morning', { waitUntil: 'networkidle' });
await page.evaluate(DRIVE); await page.waitForTimeout(1800);
await page.evaluate(`(async () => { await tap('Begin'); await __sleep(900) })()`);
console.log((await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 300));
await browser.close();
