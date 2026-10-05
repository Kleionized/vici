// Library group, Phase 2: back paths under D340 (tabs go back through history).
//   node .overhaul/scratch/lib/backpaths.mjs
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const SEED = fs.readFileSync('.overhaul/library-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });

// what the screen shows: the path, and the week page in view (its heading inside the window)
const where = (page) => page.evaluate(() => {
  const h = [...document.querySelectorAll('[role=heading]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight; }).map((e) => e.textContent.trim());
  return `${location.pathname}${location.search} [${h.slice(0, 2).join(' | ')}]`;
});

const CASES = [
  ['Today → Library tab → back', '/today', ["await tap('Library', { wait: 1500 })", "await tap('Back', { wait: 1500 })"]],
  ['All → A week · board → back', '/all', ["await tap('A week · board', { wait: 2000 })", "await tap('Back', { wait: 1500 })"]],
  ['All → The library → back', '/all', ["await tap('The library', { wait: 2000 })", "await tap('Back', { wait: 1500 })"]],
  ['Library ?week=3 → lesson 16 → Close', '/library?week=3', ["await tap('Check what you need, lesson 16, completed', { wait: 2500 })", "await tap('Close', { wait: 2000 })"]],
  ['fresh /library → back', '/library', ["await tap('Back', { wait: 1500 })"]],
  ['Today → Library → Today tab → Library tab', '/today', ["await tap('Library', { wait: 1500 })", "await tap('Today', { wait: 1200 })", "await tap('Library', { wait: 1500 })"]],
  ['All → Lessons browser → search → Cancel → Cancel', '/all', ["await tap('Lessons browser', { wait: 2000 })", "await tap('Search lessons', { wait: 1500 })", "await tap('Cancel', { wait: 1500 })", "await tap('Cancel', { wait: 1500 })"]],
  ['fresh /lessons-browser → Cancel', '/lessons-browser', ["await tap('Cancel', { wait: 1500 })"]],
  ['fresh /search → Cancel', '/search', ["await tap('Cancel', { wait: 1500 })"]],
  ['All → Locked weeks → back', '/all', ["await tap('Locked weeks', { wait: 2000 })", "await tap('Back', { wait: 1500 })"]],
  ['fresh /locked → back', '/locked', ["await tap('Back', { wait: 1500 })"]],
  ['All → The campaign → back', '/all', ["await tap('The campaign', { wait: 2000 })", "await tap('Back', { wait: 1500 })"]],
  ['All → Chapter I → back', '/all', ["await tap('Chapter I · The Landing', { wait: 2000 })", "await tap('Back', { wait: 1500 })"]],
  ['fresh /journey/landing → back', '/journey/landing', ["await tap('Back', { wait: 1500 })"]],
  ['fresh /first-steps → close', '/first-steps', ["await tap('Close', { wait: 1500 })"]],
  ['fresh /first-steps → step 2', '/first-steps', ["await tap('Remove easy access to porn', { wait: 2500 })", "await tap('Close', { wait: 2000 })"]],
];

for (const [name, route, steps] of CASES.filter(([n]) => !process.argv[2] || n.includes(process.argv[2]))) {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(`try { ${SEED} } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error(`  [pageerror] ${e.message}`));
  try {
    await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.waitForTimeout(2000);
    const trail = [await where(page)];
    for (const s of steps) {
      await page.evaluate(DRIVE).catch(() => {});
      await page.evaluate(`(async () => { ${s} })()`);
      trail.push(await where(page));
    }
    console.log(`${name}\n   ${trail.join('\n → ')}`);
  } catch (e) {
    console.log(`${name}: FAILED ${String(e).slice(0, 240)}`);
  }
  await ctx.close();
}
await browser.close();
