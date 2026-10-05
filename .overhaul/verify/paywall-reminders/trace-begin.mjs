// verifier: trace the route after Day 0's Begin (with and without the launch-gate stamps)
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const GATES = process.argv[2] === 'gates';
const TAIL = fs.readFileSync('.overhaul/tail-session-seed.js', 'utf8') + (GATES ? `\nlocalStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));` : '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
await ctx.addInitScript(`try { ${TAIL} } catch (e) {}`);
const page = await ctx.newPage();
await page.goto('http://localhost:8096/welcome?step=day-zero', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await page.waitForTimeout(2500);
console.log('now', await page.evaluate(() => new Date().toString()));
await page.mouse.click(196, 775);
const seen = [];
for (let i = 0; i < 40; i++) { const p = await page.evaluate(() => location.pathname); if (seen[seen.length - 1] !== p) seen.push(p); await page.waitForTimeout(150); }
console.log('paths:', seen.join(' -> '));
console.log('text:', (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))).slice(0, 200));
await browser.close();
