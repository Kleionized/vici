// medallions-letters Phase 2: walk every back path the group owns (D340 — tabs go back through history).
//   node .overhaul/ml-backpaths.mjs
// One browser, one context per flow; prints `ok`/`FAIL` per step with the pathname reached.
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/medallions-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });

async function flow(name, seed, start, steps) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
  await ctx.addInitScript(`try { ${seed} } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${e.message}`));
  await page.goto('http://localhost:8096' + start, { waitUntil: 'networkidle' });
  await page.evaluate(DRIVE);
  await page.waitForTimeout(1500);
  console.log(`== ${name} (start ${new URL(page.url()).pathname})`);
  for (const [label, expect] of steps) {
    try {
      await page.evaluate(DRIVE);
      await page.evaluate(`tap(${JSON.stringify(label)})`);
    } catch (e) {
      console.log(`  FAIL tap ${label}: ${String(e.message).slice(0, 160)}`);
      break;
    }
    await page.waitForTimeout(1300);
    const at = new URL(page.url()).pathname;
    console.log(`  ${at === expect ? 'ok  ' : 'FAIL'} ${label} -> ${at}${at === expect ? '' : ` (want ${expect})`}`);
  }
  await ctx.close();
}

await flow('tab in, chevron out', SEED, '/today', [['Journey', '/milestones'], ['Back', '/today']]);
await flow('board, ladder, back', SEED, '/today', [
  ['Journey', '/milestones'],
  ['Breakwater. Tier I, ×1', '/medallions/breakwater'],
  ['See every tier', '/medallions/tiers/breakwater'],
  ['Back', '/medallions/breakwater'],
  ['See every tier', '/medallions/tiers/breakwater'],
  ['Back to medallions', '/milestones'],
  ['Back', '/today'],
]);
await flow('one-off board → Earned once', SEED, '/milestones', [
  ['Veni. Jun 9', '/medallions/veni'],
  ['Jun 9. Every one-off', '/medallions/tiers/once'],
  ['Back', '/medallions/veni'],
  ['Back', '/milestones'],
]);
await flow('unearned board → Back to medallions', SEED, '/milestones', [
  ['Still to earn', '/milestones'],
  ['Archive. 9 of 10 entries', '/medallions/archive'],
  ['Back to medallions', '/milestones'],
]);
await flow('profile → album', SEED, '/profile', [['Medallions', '/milestones'], ['Back', '/profile']]);
await flow('all → album', SEED, '/all', [['Medallions', '/milestones'], ['Back', '/all']]);
await flow('dashboard → album', SEED, '/dashboard', [['Medallions', '/milestones'], ['Back', '/dashboard']]);
await flow('mail → post → drop', SEED, '/mail', [
  ['VICI Post · A medallion', '/medallion-post'],
  ['Read', '/medallion-post'],
  ['Open the enclosure', '/drop'],
  ['Close', '/medallion-post'],
  ['Close', '/mail'],
]);
await browser.close();
