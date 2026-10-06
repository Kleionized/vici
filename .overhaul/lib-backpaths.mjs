// library Phase 2: walk every back path the group owns (D340 — tabs go back through history),
// and check the pager lands on the week asked for.
//   node .overhaul/lib-backpaths.mjs
// One browser, one context per flow; prints `ok`/`FAIL` per step with the pathname (and week in view) reached.
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/library-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });

// the week page header in view (the pager keeps a neighbour mounted either side, off-screen)
const WEEK = `(() => { const h = [...document.querySelectorAll('[role="heading"]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('[role="heading"]') === e; }); return h.map((e) => e.textContent.trim()).join(' | '); })()`;

async function flow(name, start, steps, viewport = { width: 393, height: 852 }) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(`try { ${SEED} } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${e.message}`));
  await page.goto('http://localhost:8096' + start, { waitUntil: 'networkidle' });
  await page.evaluate(DRIVE);
  await page.waitForTimeout(1800);
  console.log(`== ${name} (start ${new URL(page.url()).pathname}${new URL(page.url()).search})`);
  for (const [action, expect, week] of steps) {
    try {
      await page.evaluate(DRIVE);
      if (action.startsWith('js:')) await page.evaluate(`(async () => { ${action.slice(3)} })()`);
      else await page.evaluate(`tap(${JSON.stringify(action)})`);
    } catch (e) {
      console.log(`  FAIL ${action}: ${String(e.message).slice(0, 160)}`);
      break;
    }
    await page.waitForTimeout(1400);
    const at = new URL(page.url()).pathname;
    const seen = week ? await page.evaluate(WEEK) : '';
    const good = at === expect && (!week || seen.includes(week));
    console.log(`  ${good ? 'ok  ' : 'FAIL'} ${action.slice(0, 60)} -> ${at}${week ? ` [${seen}]` : ''}${good ? '' : ` (want ${expect}${week ? ' ' + week : ''})`}`);
  }
  await ctx.close();
}

// swipe the pager one page: scroll the horizontal scroller by its width
const SWIPE = (dir) => `js:const p=[...document.querySelectorAll('div')].find(d=>d.scrollWidth>d.clientWidth*3&&/(auto|scroll)/.test(getComputedStyle(d).overflowX)); p.scrollLeft += ${dir} * p.clientWidth; await __sleep(500)`;

await flow('Today → Library tab → chevron', '/today', [['Library', '/library', 'Discipline'], ['Back', '/today']]);
await flow('Log → Library tab → chevron', '/log', [['Library', '/library', 'Discipline'], ['Back', '/log']]);
await flow('Library cold start → chevron', '/library', [['Back', '/today']]);
// 375 × 667: the page scrolls whole and carries its own chevron (D243)
await flow('375×667: Today → Library → chevron', '/today', [['Library', '/library', 'Discipline'], ['Back', '/today']], { width: 375, height: 667 });
await flow('375×667: Library → row 38', '/library', [['Keep rules that serve a purpose, lesson 38, today', '/lesson/day/38']], { width: 375, height: 667 });
await flow('All → A week · board → chevron', '/all', [['A week · board', '/library', 'Reset'], ['Back', '/all']]);
await flow('All → week 1, back, week 1 again (param consumed)', '/all', [
  ['A week · board', '/library', 'Reset'],
  [SWIPE(1), '/library', 'Changing Your Mindset'],
  ['Back', '/all'],
  ['A week · board', '/library', 'Reset'],
]);
await flow('Library → lesson row → back to the same week', '/library', [
  [SWIPE(-1), '/library', 'Why It Feels Worth It'],
  ['Look at the benefit and cost, lesson 29, completed', '/lesson/day/29'],
  ['js:history.back(); await __sleep(300)', '/library', 'Why It Feels Worth It'],
]);
await flow('Library → lesson row → the reader\'s Close', '/today', [
  ['Library', '/library', 'Discipline'],
  [SWIPE(1), '/library', 'Relapse and Adversity'],
  ['Learn from a slip, lesson 43, upcoming', '/lesson/day/43'],
  ['Close', '/library', 'Relapse and Adversity'],
  ['Back', '/today'],
]);
await flow('Library → Continue row', '/library', [['Keep rules that serve a purpose, lesson 38, today', '/lesson/day/38']]);
await flow('All → Locked weeks → back', '/all', [['Locked weeks', '/locked'], ['Back', '/all']]);
await flow('All → Locked → Unlock', '/all', [['Locked weeks', '/locked'], ['Unlock VICI Plus', '/paywall']]);
await flow('All → Lessons browser → search → cancel → cancel', '/all', [
  ['Lessons browser', '/lessons-browser'],
  ['Search lessons', '/search'],
  ['Cancel', '/lessons-browser'],
  ['Cancel', '/all'],
]);
await flow('Lessons browser → row → back', '/lessons-browser', [['Prepare for tonight, lesson 01, completed', '/lesson/day/1'], ['js:history.back(); await __sleep(300)', '/lessons-browser']]);
await flow('All → Search → chip → row', '/all', [['Search', '/search'], ['sleep', '/search'], ['Make room for food and sleep, lesson 24', '/lesson/day/24']]);
await flow('All → First steps → close', '/all', [['First steps', '/first-steps'], ['Close', '/all']]);
await flow('All → First steps → step 1', '/all', [['First steps', '/first-steps'], ['Step 1, Prepare for tonight', '/lesson/day/1']]);
await flow('All → campaign → back', '/all', [['The campaign', '/journey'], ['Back', '/all']]);
await flow('All → Chapter II → back', '/all', [['Chapter II · The Crossing', '/journey/crossing'], ['Back', '/all']]);
await flow('Chapter cold start → back', '/journey/watch', [['Back', '/journey']]);
await browser.close();
