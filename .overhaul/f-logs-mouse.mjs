// Real-mouse checks (synthetic DOM events do not reach the RNGH wheel).
import fs from 'node:fs';
import { chromium } from 'playwright-core';
process.chdir('/Users/admin/Documents/Vici');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
const seed = fs.readFileSync('.overhaul/logs-flow-tick-seed.js', 'utf8');
await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('seed ' + e.message); }`);
const page = await ctx.newPage();
const log = (...a) => console.log('CHECK', ...a);
const center = async (sel) => { const b = await page.locator(sel).last().boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
const text = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));

// 1 · the wheel: tap the row above the band, then drag the minutes
await page.goto('http://localhost:8096/log-chooser', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(2500);
await page.mouse.click(...(await center('[aria-label="A lapse"]')));
await page.waitForTimeout(300);
await page.mouse.click(...(await center('text=Continue')));
await page.waitForTimeout(1500);
log('at', page.url());
{ const [hx, hy] = await center('[aria-label="Hour 10"]'); log('hour10 at', hx, hy, await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e.outerHTML.slice(0, 120) + ' / closest label: ' + e.closest('[aria-label]')?.getAttribute('aria-label'); }, [hx, hy]));
  await page.mouse.move(hx, hy); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); }
await page.waitForTimeout(1200);
const vals = () => page.evaluate(() => [...document.querySelectorAll('[aria-valuetext]')].map((e) => e.getAttribute('aria-label') + '=' + e.getAttribute('aria-valuetext')).join(' | '));
log('after Hour 10 tap:', await vals(), '| when chips on:', await page.evaluate(() => [...document.querySelectorAll('[role=radio][aria-checked=true]')].map((e) => e.textContent).join(',')));
const [mx, my] = await center('[aria-label="Minute"]');
await page.mouse.move(mx, my); await page.mouse.down();
for (let i = 1; i <= 12; i++) { await page.mouse.move(mx, my + i * 8); await page.waitForTimeout(25); }
await page.waitForTimeout(150); await page.mouse.up();
await page.waitForTimeout(1500);
log('after minute drag:', await vals());
await page.mouse.click(...(await center('text=Continue')));
await page.waitForTimeout(800);
await page.mouse.click(...(await center('text=Stress')));
await page.mouse.click(...(await center('text=Continue')));
await page.waitForTimeout(1500);
log('saved:', await page.evaluate(() => { const e = JSON.parse(localStorage.getItem('tideline.mock.userdata.logs-seed-user')).events.find((x) => x.type === 'lapse'); return e && new Date(e.createdAt).toString().slice(0, 21); }));
// 2 · close with history goes back to the chooser
await page.locator('[aria-label="Close"]').last().click();
await page.waitForTimeout(1500);
log('close ->', new URL(page.url()).pathname);
await browser.close();
