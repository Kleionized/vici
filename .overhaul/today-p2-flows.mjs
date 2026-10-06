// today Phase 2: walk the group's controls and back paths (D340 — tabs go back through history),
// and check what the task disc writes in both registers.
//   node .overhaul/today-p2-flows.mjs [--only=<substring>]
// One browser, one context per flow; prints `ok`/`FAIL` per step with the pathname reached and,
// for the disc, today's row as stored (dailyAction / dailyActionDone).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7);
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const seed = (f) => fs.readFileSync(f, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });

// today's stored row (the clock is frozen, so `new Date()` is the seed's today)
const ROW = `(() => { const d = new Date(); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); const key = Object.keys(localStorage).find((x) => x.startsWith('tideline.mock.userdata.')); const c = JSON.parse(localStorage.getItem(key)).checkins[k] || {}; return JSON.stringify({ dailyAction: c.dailyAction, dailyActionDone: c.dailyActionDone }); })()`;
// the pager's page k into view
const PAGE = (k) => `js:const n=[...document.querySelectorAll('div')].filter(d=>d.scrollHeight>d.clientHeight+8 && getComputedStyle(d).overflowY!=='visible')[0]; n.scrollTop=n.firstElementChild.children[${k}].offsetTop; await __sleep(600)`;
// the task label and the sentence as drawn on page two
const TASK = `(() => { const t = [...document.querySelectorAll('[aria-label="Open today’s task"], [role=button]')].find((b) => /^Today’s task/.test(b.textContent.trim())); return t ? t.textContent.trim() : '(no task row)'; })()`;

async function flow(name, start, initseed, steps, viewport = { width: 393, height: 852 }) {
  if (only && !name.includes(only)) return;
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(`try { ${seed(initseed)} } catch (e) { console.error(e) }`);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${e.message}`));
  await page.goto('http://localhost:8096' + start, { waitUntil: 'networkidle' });
  await page.evaluate(DRIVE);
  await page.waitForTimeout(1800);
  console.log(`== ${name} (start ${new URL(page.url()).pathname}${new URL(page.url()).search})`);
  for (const [action, expect, probe] of steps) {
    try {
      await page.evaluate(DRIVE);
      if (action.startsWith('js:')) await page.evaluate(`(async () => { ${action.slice(3)} })()`);
      else if (action.startsWith('key:')) await page.keyboard.press(action.slice(4));
      else await page.evaluate(`tap(${JSON.stringify(action)})`);
    } catch (e) {
      console.log(`  FAIL ${action.slice(0, 60)}: ${String(e.message).slice(0, 160)}`);
      break;
    }
    await page.waitForTimeout(1300);
    const u = new URL(page.url());
    const at = u.pathname + u.search;
    const seen = probe ? await page.evaluate(probe) : '';
    const good = expect == null || at === expect || u.pathname === expect;
    console.log(`  ${good ? 'ok  ' : 'FAIL'} ${action.slice(0, 60)} -> ${at}${seen ? `  ${seen}` : ''}${good ? '' : ` (want ${expect})`}`);
  }
  await ctx.close();
}

const S0900 = '.overhaul/today-0900-seed.js'; // day 41, no action named for today: lesson 41 by day
const SII = '.overhaul/today-ii-seed.js'; // a named generic action, undone
const STASK = '.overhaul/today-task-seed.js'; // lesson 1's sentence named, done
const S2000 = '.overhaul/today-2000-seed.js'; // evening, pledge on page three
const S86 = '.overhaul/today-seed-d86.js'; // past the course

await flow('disc, lesson register by day (nothing named)', '/today', S0900, [
  [PAGE(1), '/today', TASK],
  ['js:', '/today', ROW],
  ['Today’s task done', '/today', ROW],
  ['js:', '/today', TASK],
  ['Today’s task done', '/today', ROW],
]);
await flow('disc, generic register (named action)', '/today', SII, [
  [PAGE(1), '/today', TASK],
  ['Today’s task done', '/today', ROW],
  ['Today’s task done', '/today', ROW],
]);
await flow('disc, lesson register (named lesson task, done)', '/today', STASK, [
  [PAGE(1), '/today', TASK],
  ['Today’s task done', '/today', ROW],
]);
await flow('disc, past the course', '/today', S86, [
  [PAGE(1), '/today', TASK],
  ['js:', '/today', ROW],
  ['Today’s task done', '/today', ROW],
  ['Today’s task done', '/today', ROW],
]);
await flow('sentence → task page → Close', '/today', S0900, [
  [PAGE(1), '/today'],
  ['Open today’s task', '/lesson/day/41?page=task', `document.body.innerText.slice(0, 80).replace(/\\s+/g, ' ')`],
  ['Close', '/today'],
]);
await flow('generic sentence → day lesson task page', '/today', SII, [
  [PAGE(1), '/today'],
  ['Open today’s task', '/lesson/day/41?page=task'],
  ['js:history.back(); await __sleep(300)', '/today'],
]);
await flow('past the course: sentence toggles, tile → lessons browser', '/today', S86, [
  [PAGE(1), '/today', TASK],
  ['Today’s task', '/today', ROW],
  ['Week I. Start the first lesson', '/lessons-browser'],
  ['Cancel', '/today'],
]);
await flow('lesson tile → reader → Close', '/today', S0900, [
  [PAGE(1), '/today'],
  ['Lesson 41. Give the action a time and place', '/lesson/day/41'],
  ['Close', '/today'],
]);
await flow('urge tile → hub → back', '/today', S0900, [
  [PAGE(1), '/today'],
  ['Ride it out. Urge surfing', '/urge-hub'],
  ['js:history.back(); await __sleep(300)', '/today'],
]);
await flow('score door → Score → Months → Year → back', '/today', S0900, [
  ['Recovery score 1,240', '/score'],
  ['Range: Months', '/score'],
  ['Year', '/score', `[...document.querySelectorAll('[role=button]')].map(b=>b.getAttribute('aria-label')).filter(l=>l&&l.startsWith('Range'))[0]`],
  ['Back', '/today'],
]);
await flow('score → Journey tab → back', '/today', S0900, [
  ['Recovery score 1,240', '/score'],
  ['Journey', null],
  ['js:history.back(); await __sleep(300)', '/score'],
  ['Back', '/today'],
]);
await flow('this morning chip → morning → close', '/today', S0900, [
  ['This morning: Fine', '/day/morning'],
  ['Close', '/today'],
]);
await flow('avatar → settings → back', '/today', S0900, [
  ['Open settings', '/settings'],
  ['js:history.back(); await __sleep(300)', '/today'],
]);
await flow('page three: + → editor (Pledge) → back; ☆ → past pledges → back; tonight → hub', '/today', S2000, [
  [PAGE(2), '/today'],
  ['New pledge', '/journal-new?tag=Pledge'],
  ['Back', '/today'],
  [PAGE(2), '/today'],
  ['Past pledges', '/journal'],
  ['Back', '/today'],
  [PAGE(2), '/today'],
  ['Urge surfing', '/urge-hub'],
]);
await flow('All → Past pledges → back; Write a pledge → back; Sentence journal → Escape', '/all', S0900, [
  ['Past pledges', '/journal'],
  ['Back', '/all'],
  ['Write a pledge', '/journal-new'],
  ['Back', '/all'],
  ['Sentence journal', '/affirmation'],
  ['key:Escape', '/all'],
]);
await browser.close();
