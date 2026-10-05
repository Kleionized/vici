#!/usr/bin/env node
// verifier (paywall-reminders): drive every control of the group in the running web build.
//   node .overhaul/verify/paywall-reminders/func.mjs [routines|paywall|funnel|sub|rem]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const only = process.argv[2];
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const GATES = `localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
{ const d = new Date(); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7) - 7); localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(m.getFullYear() + '-' + String(m.getMonth() + 1).padStart(2, '0') + '-' + String(m.getDate()).padStart(2, '0'))); }`;
const PREMIUM = fs.readFileSync('.overhaul/v-premium-seed.js', 'utf8') + '\n' + GATES;
const FREE = PREMIUM.replace('premium: true', 'premium: false');
const TAIL = fs.readFileSync('.overhaul/tail-session-seed.js', 'utf8');
const CONF = fs.readFileSync('.overhaul/f-pw-confirmed-seed.js', 'utf8') + '\n' + GATES;
const SUB = fs.readFileSync('.overhaul/f-pw-sub-dated.js', 'utf8') + '\n' + GATES;

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };

async function session(init, w = 393, h = 852) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  if (init) await ctx.addInitScript(`try { ${init.replace('setTimeout(() => location.reload(), 0);', '')} } catch (e) {}`);
  const page = await ctx.newPage();
  const popups = [];
  ctx.on('page', (p) => popups.push(p.url()));
  page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|DevTools|Download the React/.test(m.text())) console.error('[console] ' + m.text().slice(0, 200)); });
  const go = async (path) => {
    await page.goto('http://localhost:8096' + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.waitForTimeout(1800);
  };
  const ev = (js) => page.evaluate(`(async () => { ${js} })()`);
  const txt = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  // drive.js tap (synthetic events on the LAST matching control — stacks keep the screen below mounted)
  const tap = async (label, wait = 700) => {
    await page.evaluate(DRIVE);
    await ev(`const all = window.__btns(); const m = (f) => all.filter(f); let c = m((b) => b.textContent.trim() === ${JSON.stringify(label)}); if (!c.length) c = m((b) => (b.getAttribute('aria-label') || '') === ${JSON.stringify(label)}); if (!c.length) c = m((b) => b.textContent.trim().includes(${JSON.stringify(label)})); if (!c.length) throw new Error('no control ' + ${JSON.stringify(label)}); window.__fire(c[c.length - 1]); await __sleep(${wait});`);
  };
  // a real mouse click at a point: proves nothing transparent sits over the control
  const click = async (x, y, wait = 700) => { await page.mouse.click(x, y); await page.waitForTimeout(wait); };
  const has = async (needle, ms = 6000) => { await page.evaluate(DRIVE); return ev(`return await waitFor(${JSON.stringify(needle)}, ${ms});`).catch(() => false); };
  const path = () => page.evaluate(() => location.pathname + location.search);
  const attr = (sel, a) => page.evaluate(([s, n]) => { const all = document.querySelectorAll(s); return all.length ? all[all.length - 1].getAttribute(n) : null; }, [sel, a]);
  const ls = (k) => page.evaluate((key) => localStorage.getItem(key), k);
  const hitAt = (x, y) => page.evaluate(([x, y]) => { let el = document.elementFromPoint(x, y); const chain = []; while (el && chain.length < 6) { chain.push((el.getAttribute('role') || el.tagName) + (el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label') + ']' : '')); el = el.parentElement; } return chain.join(' < '); }, [x, y]);
  return { browser, page, go, ev, txt, tap, click, has, path, attr, ls, hitAt, popups };
}

async function routines() {
  let s = await session(PREMIUM);
  await s.go('/routines/morning-time?from=settings');
  check('morning: hour parks on 8', (await s.attr('[aria-label="Hour"]', 'aria-valuetext')) === '8', `hour=${await s.attr('[aria-label="Hour"]', 'aria-valuetext')}`);
  check('morning: minute 00 / AM', (await s.attr('[aria-label="Minute"]', 'aria-valuetext')) === '00' && (await s.attr('[aria-label="AM or PM"]', 'aria-valuetext')) === 'AM', `${await s.attr('[aria-label="Minute"]', 'aria-valuetext')} ${await s.attr('[aria-label="AM or PM"]', 'aria-valuetext')}`);
  // Tuesday disc at x 146, y 595 — a real click
  await s.click(146, 595);
  check('morning: Tuesday toggles off (real click)', (await s.attr('[aria-label="Tuesday"]', 'aria-checked')) === 'false');
  await s.click(146, 595);
  check('morning: Tuesday toggles back on', (await s.attr('[aria-label="Tuesday"]', 'aria-checked')) === 'true');
  await s.click(96, 595); // Monday off
  // the minute row under the band: '01' at x 211, y 432
  await s.click(211, 432, 1500);
  check('morning: clicking the row under the band steps the minute', (await s.attr('[aria-label="Minute"]', 'aria-valuetext')) === '01', `min=${await s.attr('[aria-label="Minute"]', 'aria-valuetext')}`);
  // PM row at x 288, y 432
  await s.click(288, 432, 1500);
  check('morning: clicking PM steps the meridiem', (await s.attr('[aria-label="AM or PM"]', 'aria-valuetext')) === 'PM', `p=${await s.attr('[aria-label="AM or PM"]', 'aria-valuetext')}`);
  await s.click(196, 775, 1800); // Save time
  const stored = JSON.parse((await s.ls('tideline.routines.v2')) || '{}');
  const days = JSON.parse((await s.ls('tideline.routines.days.v1')) || '{}');
  check('morning: Save writes 8:01 PM', stored.morning?.hour === 8 && stored.morning?.minute === 1 && stored.morning?.period === 'PM', JSON.stringify(stored.morning));
  check('morning: Save writes days without Monday', JSON.stringify(days.morning) === JSON.stringify([0, 2, 3, 4, 5, 6]), JSON.stringify(days));
  check('morning ?from=settings: Save lands on Settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/routines/morning-time');
  await s.click(28, 80, 1800); // back chevron, no history, not settings
  check('morning (no history): Back replaces with Today', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/routines/morning-time');
  await s.tap('Save time', 2000);
  check('morning (onboarding): Save pushes the night board', (await s.path()) === '/routines/night-time', await s.path());
  check('night: parks on 10:30 PM', (await s.attr('[aria-label="Hour"]', 'aria-valuetext')) === '10' && (await s.attr('[aria-label="Minute"]', 'aria-valuetext')) === '30' && (await s.attr('[aria-label="AM or PM"]', 'aria-valuetext')) === 'PM');
  await s.click(28, 80, 1800);
  check('night: Back returns to the morning board', (await s.path()) === '/routines/morning-time', await s.path());
  await s.tap('Save time', 2000);
  await s.tap('Save time', 2400);
  check('night (onboarding): Save replaces with Today', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/routines/night-time?from=settings');
  check('night ?from=settings: no "Settings" back word, no reassurance line', !(await s.txt()).includes('Settings') && !(await s.txt()).includes('riskiest hours'), (await s.txt()).slice(0, 120));
  await s.click(28, 80, 1800);
  check('night ?from=settings: Back (no history) lands on Settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  // from the Settings screen itself: the rows open the boards, Back returns
  s = await session(PREMIUM);
  await s.go('/settings');
  const t = await s.txt();
  console.log('   settings text: ' + t.slice(0, 260));
  await s.browser.close();
}

async function paywall() {
  let s = await session(PREMIUM);
  await s.go('/paywall');
  console.log('   hit at ✕ (362,80): ' + (await s.hitAt(362, 80)));
  console.log('   hit at footer Restore (220,792): ' + (await s.hitAt(220, 792)));
  console.log('   hit at footer Terms (172,792): ' + (await s.hitAt(172, 792)));
  check('paywall: Yearly checked by default', (await s.attr('[aria-label="Yearly, $39.99/year"]', 'aria-checked')) === 'true');
  await s.click(286, 400);
  check('paywall: Monthly card selects (real click)', (await s.attr('[aria-label="Monthly, $12.99/month"]', 'aria-checked')) === 'true' && (await s.attr('[aria-label="Yearly, $39.99/year"]', 'aria-checked')) === 'false');
  await s.click(196, 741, 900); // Continue
  check('paywall: Continue (Monthly) opens the pay sheet with Monthly', (await s.has('Due today')) && (await s.txt()).includes('VICI Plus · Monthly') && (await s.txt()).includes('$12.99'), (await s.txt()).slice(-200));
  await s.tap('Cancel', 900);
  check('paywall: Cancel closes the sheet', !(await s.txt()).includes('Due today'));
  await s.click(106, 400);
  check('paywall: Yearly reselects', (await s.attr('[aria-label="Yearly, $39.99/year"]', 'aria-checked')) === 'true');
  await s.click(196, 741, 900);
  await s.click(196, 30, 900); // scrim (over the status bar)
  check('paywall: scrim click dismisses the sheet', !(await s.txt()).includes('Due today'));
  await s.click(196, 741, 1200);
  await s.tap('Confirm with Side Button', 1800);
  check('paywall: Confirm → Confirmed with the yearly line', (await s.has('The whole campaign is yours until')), (await s.txt()).slice(0, 200));
  check('paywall: Confirmed names Sam', (await s.txt()).includes('We’re in, Sam.'));
  await s.tap('Begin', 1800);
  check('paywall: Begin closes /paywall (→ /today with no history)', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  // ✕ → Rescue; ✕ there closes
  s = await session(PREMIUM);
  await s.go('/paywall');
  await s.click(362, 80, 900);
  check('paywall: ✕ (real click) opens Rescue', await s.has('Before you go'));
  await s.click(362, 80, 1800);
  check('rescue: ✕ closes /paywall', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/paywall');
  await s.tap('Close', 900);
  await s.click(196, 783, 1800); // No thanks
  check('rescue: No thanks closes /paywall', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  s = await session(CONF);
  await s.go('/paywall');
  await s.tap('Close', 900);
  await s.click(196, 727, 1000); // Start free trial
  check('rescue: Start free trial opens the sheet with the trial row', (await s.has('Due today')) && (await s.txt()).includes('3 days free, then $39.99/year') && (await s.txt()).includes('$0.00'));
  await s.tap('Confirm with Side Button', 1800);
  check('rescue: Confirm → Confirmed with the trial line', (await s.has('Nothing is charged until Jul')), (await s.txt()).slice(0, 220));
  check('confirmed: receipt line', (await s.txt()).includes('Receipt sent to sam@hey.com'));
  await s.browser.close();

  // the footer Restore (real click on the word) — entitled account restores
  s = await session(PREMIUM);
  await s.go('/paywall');
  await s.click(220, 792, 2000);
  check('paywall: footer "Restore" (entitled) → Confirmed', await s.has('We’re in', 3000), (await s.txt()).slice(0, 160));
  await s.browser.close();

  s = await session(FREE);
  await s.go('/paywall');
  await s.click(220, 792, 2000);
  check('paywall: footer "Restore" (free) stays on the board', (await s.txt()).includes('Take your life back.') && !(await s.txt()).includes('We’re in'));
  await s.click(172, 792, 1200);
  check('paywall: "Terms" is inert', (await s.txt()).includes('Take your life back.') && (await s.path()) === '/paywall');
  // ✕ twice: rescue then close
  await s.tap('Close', 900);
  await s.tap('Close', 1800);
  check('paywall (free): ✕ then ✕ closes', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  // monthly purchase line
  s = await session(CONF);
  await s.go('/paywall');
  await s.tap('Monthly, $12.99/month', 600);
  await s.tap('Continue', 1000);
  await s.tap('Confirm with Side Button', 1800);
  check('paywall: Monthly purchase → monthly line', (await s.has('month by month')), (await s.txt()).slice(0, 200));
  await s.browser.close();
}

async function funnel() {
  let s = await session(TAIL);
  await s.go('/welcome?step=reminders');
  check('funnel: reminders board has no Back/Skip', !(await s.page.evaluate(() => [...document.querySelectorAll('[role=button]')].some((b) => /^(Back|Skip|Close)$/.test(b.getAttribute('aria-label') || '')))));
  await s.click(196, 727, 1800); // Turn on reminders
  check('funnel: Turn on reminders → paywall step', await s.has('Take your life back.'), (await s.txt()).slice(0, 120));
  check('funnel: embedded ✕ is labelled Skip', (await s.page.evaluate(() => !!document.querySelector('[aria-label="Skip"]'))));
  await s.click(362, 80, 1000);
  check('funnel: Skip → rescue', await s.has('Before you go'));
  await s.tap('No thanks', 1800);
  check('funnel: No thanks → Day 0', await s.has('Day 0'), (await s.txt()).slice(0, 160));
  check('funnel: Day 0 card reads Lesson 1 / Prepare for tonight', (await s.txt()).includes('Lesson 1') && (await s.txt()).includes('Prepare for tonight'));
  await s.click(196, 775, 3500); // Begin
  check('funnel: Begin → finish() → /routines/morning-time', (await s.path()).startsWith('/routines/morning-time'), await s.path());
  await s.browser.close();

  s = await session(TAIL);
  await s.go('/welcome?step=reminders');
  await s.click(196, 783, 1800); // Not now
  check('funnel: Not now → paywall step', await s.has('Take your life back.'));
  await s.tap('Continue', 1000);
  await s.tap('Confirm with Side Button', 1800);
  check('funnel: paid → Confirmed', await s.has('We’re in'));
  await s.tap('Begin', 1800);
  check('funnel: Confirmed Begin → Day 0', await s.has('Day 0'), (await s.txt()).slice(0, 120));
  await s.browser.close();
}

async function sub() {
  let s = await session(SUB);
  await s.go('/subscription');
  await s.click(196, 396, 1800); // Change plan row
  check('sub: Change plan → /paywall', (await s.path()) === '/paywall', await s.path());
  await s.browser.close();

  s = await session(SUB);
  await s.go('/subscription');
  for (const [label, y] of [['Redeem a code', 457], ['Restore purchases', 518], ['Payment method', 658], ['Receipts & invoices', 719], ['Cancel subscription', 787]]) {
    await s.click(196, y, 1200);
    check(`sub: ${label} runs and stays`, (await s.path()) === '/subscription', `${await s.path()} popups=${s.popups.length}`);
  }
  await s.click(28, 80, 1800);
  check('sub: Back (no history) → /settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(FREE);
  await s.go('/subscription');
  const t = await s.txt();
  check('sub (free): Free tools / Core tools included / Free pill / no next charge / no cancel', t.includes('Free tools') && t.includes('Core tools included') && /Change plan\s*Free/.test(t) && !t.includes('Next charge') && !t.includes('Cancel subscription'), t.slice(0, 260));
  await s.page.screenshot({ path: '.overhaul/verify/paywall-reminders/u-sub-free.png' });
  await s.browser.close();
}

async function rem() {
  let s = await session(PREMIUM);
  await s.go('/reminders');
  await s.click(196, 775, 2000); // Turn on reminders (bottom 48)
  const ud = JSON.parse((await s.ls('tideline.mock.userdata.mockuser_pw')) || '{}');
  check('/reminders: Turn on writes morningCheckin + riskTimeSupport', ud.user?.settings?.morningCheckin === true && ud.user?.settings?.riskTimeSupport === true, JSON.stringify(ud.user?.settings));
  check('/reminders: Turn on goes back (→ /settings)', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/reminders');
  await s.click(28, 80, 1800);
  check('/reminders: Back → /settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  for (const [label, x, y] of [['✕', 362, 80], ['Not now', 196, 783], ['Turn on reminders', 196, 727]]) {
    s = await session(PREMIUM);
    await s.go('/notify-primer');
    await s.click(x, y, 1800);
    check(`/notify-primer: ${label} closes (→ /today)`, (await s.path()) === '/today', await s.path());
    await s.browser.close();
  }
}

const all = { routines, paywall, funnel, sub, rem };
for (const [k, f] of Object.entries(all)) if (!only || only === k) await f();
console.log(`\n${pass} pass, ${fail} fail`);
