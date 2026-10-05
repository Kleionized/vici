// verifier: at 393x852, does any board's scroll region have overflow? and Settings entry points
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const GATES = `localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
{ const d = new Date(); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7) - 7); localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(m.getFullYear() + '-' + String(m.getMonth() + 1).padStart(2, '0') + '-' + String(m.getDate()).padStart(2, '0'))); }`;
const P = fs.readFileSync('.overhaul/v-premium-seed.js', 'utf8') + GATES;
const T = fs.readFileSync('.overhaul/tail-session-seed.js', 'utf8');
const S = fs.readFileSync('.overhaul/f-pw-sub-dated.js', 'utf8') + GATES;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
async function run(seed, route, js) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
  await ctx.addInitScript(`try { ${seed} } catch (e) {}`);
  const page = await ctx.newPage();
  await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(DRIVE);
  await page.waitForTimeout(2000);
  if (js) await page.evaluate(`(async () => { ${js} })()`);
  const r = await page.evaluate(() => [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.clientHeight > 50).map((el) => `${el.scrollHeight}/${el.clientHeight}`));
  console.log(route, js ? js.slice(0, 40) : '', 'scrollers:', r.join(' '), (await page.evaluate(() => location.pathname)));
  await ctx.close();
}
await run(T, '/welcome?step=reminders');
await run(P, '/paywall');
await run(P, '/paywall', "await tap('Close'); await __sleep(600)");
await run(S, '/subscription');
await run(P, '/routines/morning-time');
await run(P, '/reminders');
await run(P, '/notify-primer');
// Settings entry points
await run(P, '/settings', "await tap('Night check-in'); await __sleep(1500)");
await run(P, '/settings', "await tap('Morning check-in'); await __sleep(1500)");
await run(P, '/settings', "await tap('Manage subscription'); await __sleep(1500)");
await run(P, '/settings', "await tap('Night check-in'); await __sleep(1500); await tap('Back'); await __sleep(1500)");
await browser.close();
