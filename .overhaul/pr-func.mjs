#!/usr/bin/env node
/**
 * paywall-reminders: exercise every control the group touched, in the running
 * web build, and print what each did.
 *
 *   node .overhaul/pr-func.mjs [routines|paywall|funnel|subscription|reminders]
 */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const only = process.argv[2];
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
// the two launch gates (app)/_layout pushes over a tab on first launch — stamped so a
// return to Settings/Today stays there (the same stamps as .overhaul/settings-seed.js)
const GATES = `localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
{ const d = new Date(); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7) - 7); localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(m.getFullYear() + '-' + String(m.getMonth() + 1).padStart(2, '0') + '-' + String(m.getDate()).padStart(2, '0'))); }`;
const PREMIUM = fs.readFileSync('.overhaul/v-premium-seed.js', 'utf8') + '\n' + GATES;
const TAIL = fs.readFileSync('.overhaul/tail-session-seed.js', 'utf8');
const SUB = fs.readFileSync('.overhaul/f-pw-sub-dated.js', 'utf8') + '\n' + GATES;
// the premium account with premium off — a free member
const FREE = PREMIUM.replace('premium: true', 'premium: false');

const results = [];
const check = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

async function session(init) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
  if (init) await ctx.addInitScript(`try { ${init.replace('setTimeout(() => location.reload(), 0);', '')} } catch (e) {}`);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
  const go = async (path) => {
    await page.goto('http://localhost:8096' + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.waitForTimeout(1600);
  };
  const ev = (js) => page.evaluate(`(async () => { ${js} })()`);
  const txt = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  // the LAST match: a stack keeps the screen under a pushed one mounted, earlier in the DOM
  const tap = async (label, wait = 600) => {
    await page.evaluate(DRIVE);
    await ev(`const all = window.__btns(); const m = (f) => all.filter(f); let c = m((b) => b.textContent.trim() === ${JSON.stringify(label)}); if (!c.length) c = m((b) => (b.getAttribute('aria-label') || '') === ${JSON.stringify(label)}); if (!c.length) c = m((b) => b.textContent.trim().includes(${JSON.stringify(label)})); if (!c.length) throw new Error('no control ' + ${JSON.stringify(label)}); window.__fire(c[c.length - 1]); await __sleep(${wait});`);
  };
  const has = async (needle, ms = 6000) => { await page.evaluate(DRIVE); return ev(`return await waitFor(${JSON.stringify(needle)}, ${ms});`).catch(() => false); };
  const path = () => page.evaluate(() => location.pathname);
  const attr = (sel, a) => page.evaluate(([s, n]) => { const all = document.querySelectorAll(s); return all.length ? all[all.length - 1].getAttribute(n) : null; }, [sel, a]);
  const ls = (k) => page.evaluate((key) => localStorage.getItem(key), k);
  return { browser, page, go, ev, txt, tap, has, path, attr, ls };
}

async function routines() {
  let s = await session(PREMIUM);
  await s.go('/routines/morning-time?from=settings');
  check('morning: parks on 8:00 AM (D324 default)', (await s.attr('[aria-label="Hour"]', 'aria-valuetext')) === '8' || (await s.txt()).includes('8 : 00'), `hour=${await s.attr('[aria-label="Hour"]', 'aria-valuetext')}`);
  await s.tap('Monday');
  check('morning: Monday toggles off', (await s.attr('[aria-label="Monday"]', 'aria-checked')) === 'false');
  await s.tap('Hour 9', 1400);
  check('morning: tapping the row under the band steps the hour', (await s.attr('[aria-label="Hour"]', 'aria-valuetext')) === '9', `hour=${await s.attr('[aria-label="Hour"]', 'aria-valuetext')}`);
  await s.tap('Save time', 1500);
  const stored = JSON.parse((await s.ls('tideline.routines.v2')) || '{}');
  const days = JSON.parse((await s.ls('tideline.routines.days.v1')) || '{}');
  check('morning: Save time writes the time', stored.morning?.hour === 9 && stored.morning?.period === 'AM', JSON.stringify(stored.morning));
  check('morning: Save time writes the days', Array.isArray(days.morning) && !days.morning.includes(1) && days.morning.length === 6, JSON.stringify(days.morning));
  check('morning ?from=settings: Save returns to Settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/routines/morning-time');
  await s.tap('Save time', 1800);
  check('morning (onboarding): Save goes on to the night board', (await s.path()) === '/routines/night-time', await s.path());
  check('night: parks on 10:30 PM', (await s.attr('[aria-label="Minute"]', 'aria-valuetext')) === '30', `min=${await s.attr('[aria-label="Minute"]', 'aria-valuetext')}`);
  await s.tap('Back', 1500);
  check('night: Back returns to the morning board', (await s.path()) === '/routines/morning-time', await s.path());
  await s.tap('Save time', 1800);
  await s.tap('Save time', 2200);
  check('night (onboarding): Save replaces with Today', (await s.path()) === '/today', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/routines/night-time?from=settings');
  await s.tap('Back', 1500);
  check('night ?from=settings: Back (no history) lands on Settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();
}

async function paywall() {
  let s = await session(FREE);
  await s.go('/paywall');
  await s.tap('Monthly, $12.99/month');
  check('paywall: Monthly selects', (await s.attr('[aria-label="Monthly, $12.99/month"]', 'aria-checked')) === 'true');
  check('paywall: Yearly unselects', (await s.attr('[aria-label="Yearly, $39.99/year"]', 'aria-checked')) === 'false');
  await s.tap('Yearly, $39.99/year');
  check('paywall: Yearly selects back', (await s.attr('[aria-label="Yearly, $39.99/year"]', 'aria-checked')) === 'true');
  await s.tap('Continue', 900);
  check('paywall: Continue opens the pay sheet (Yearly)', await s.has('VICI Plus · Yearly'));
  await s.tap('Cancel', 900);
  check('pay sheet: Cancel closes it', !(await s.txt()).includes('Due today'));
  await s.tap('Continue', 900);
  await s.tap('Confirm with Side Button', 1200);
  check('pay sheet: confirm lands on Confirmed (yearly line)', await s.has('The whole campaign is yours until'));
  await s.tap('Begin', 1500);
  check('confirmed: Begin closes /paywall', (await s.path()) !== '/paywall', await s.path());
  await s.browser.close();

  // the footer "Restore" — a premium store account restores
  s = await session(PREMIUM);
  await s.go('/paywall');
  await s.page.click('[role="link"]:has-text("Restore")');
  check('paywall: footer Restore restores an entitled account', await s.has('Receipt sent'));
  await s.browser.close();

  // a free account: Restore finds nothing and stays
  s = await session(FREE);
  await s.go('/paywall');
  await s.page.click('[role="link"]:has-text("Restore")');
  await s.page.waitForTimeout(800);
  check('paywall: footer Restore with nothing to restore stays on the board', (await s.txt()).includes('Take your life back'));
  await s.tap('Close', 900);
  check('paywall: ✕ opens the rescue once', await s.has('Before you go'));
  await s.tap('No thanks', 1500);
  check('rescue: No thanks closes /paywall', (await s.path()) !== '/paywall', await s.path());
  await s.browser.close();

  s = await session(FREE);
  await s.go('/paywall');
  await s.tap('Close', 900);
  await s.tap('Close', 1500);
  check('rescue: ✕ closes /paywall', (await s.path()) !== '/paywall', await s.path());
  await s.browser.close();

  s = await session(FREE);
  await s.go('/paywall');
  await s.tap('Close', 900);
  await s.tap('Start free trial', 900);
  check('rescue: Start free trial opens the sheet with the trial row', await s.has('3 days free, then $39.99/year'));
  await s.page.mouse.click(196, 140); // the scrim above the panel
  await s.page.waitForTimeout(700);
  check('pay sheet: scrim tap dismisses', !(await s.txt()).includes('Due today'));
  await s.browser.close();
}

async function funnel() {
  let s = await session(TAIL);
  await s.go('/welcome?step=reminders');
  await s.tap('Turn on reminders', 1200);
  check('reminders setup: Turn on reminders advances to the paywall', await s.has('Take your life back'));
  await s.tap('Skip', 900);
  check('embedded paywall: ✕ (Skip) opens the rescue', await s.has('Before you go'));
  await s.tap('No thanks', 1200);
  check('embedded rescue: No thanks advances to Day 0', await s.has('Day 0'));
  check('day 0: card reads Lesson 1 / Prepare for tonight', (await s.txt()).includes('Lesson 1 Prepare for tonight'));
  await s.tap('Begin', 4000);
  check('day 0: Begin finishes onboarding onto the morning board', (await s.path()) === '/routines/morning-time', await s.path());
  await s.browser.close();

  s = await session(TAIL);
  await s.go('/welcome?step=reminders');
  await s.tap('Not now', 1200);
  check('reminders setup: Not now advances to the paywall', await s.has('Take your life back'));
  await s.browser.close();
}

async function subscription() {
  let s = await session(SUB);
  await s.go('/subscription');
  await s.tap('Restore purchases', 900);
  check('subscription: Restore purchases runs and stays', (await s.path()) === '/subscription');
  await s.tap('Payment method', 900);
  check('subscription: Payment method runs (customer center → store) and stays', (await s.path()) === '/subscription');
  await s.tap('Change plan', 1500);
  check('subscription: Change plan opens /paywall', (await s.path()) === '/paywall', await s.path());
  await s.page.goBack();
  await s.page.waitForTimeout(1200);
  await s.tap('Back', 1500);
  check('subscription: Back leaves the page', (await s.path()) !== '/subscription', await s.path());
  await s.browser.close();

  s = await session(FREE);
  await s.go('/subscription');
  const t = await s.txt();
  check('subscription (free): Free tools / Core tools included / Free, no cancel', t.includes('Free tools') && t.includes('Core tools included') && !t.includes('Cancel subscription'), t.slice(0, 160));
  await s.browser.close();
}

async function reminders() {
  let s = await session(PREMIUM);
  await s.go('/reminders');
  await s.tap('Turn on reminders', 1500);
  const data = JSON.parse((await s.ls('tideline.mock.userdata.mockuser_pw')) || '{}');
  const set = data.user?.settings ?? {};
  check('/reminders: Turn on reminders writes both nudges', set.morningCheckin === true && set.riskTimeSupport === true, JSON.stringify(set));
  check('/reminders: … and goes back (Settings without history)', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/reminders');
  await s.tap('Back', 1500);
  check('/reminders: Back', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  for (const label of ['Close', 'Not now', 'Turn on reminders']) {
    s = await session(PREMIUM);
    await s.go('/notify-primer');
    await s.tap(label, 1500);
    check(`/notify-primer: ${label} closes`, (await s.path()) === '/today', await s.path());
    await s.browser.close();
  }
}

/**
 * D340 (tabs go back through history): every way into this group's pushed pages from a tab
 * returns to that tab — Settings, the All drawer and Locked — rather than to Today.
 */
async function history() {
  let s = await session(SUB);
  await s.go('/settings');
  await s.tap('Manage subscription', 1600);
  check('history: Settings → Manage subscription', (await s.path()) === '/subscription', await s.path());
  await s.tap('Back', 1500);
  check('history: Subscription Back → Settings', (await s.path()) === '/settings', await s.path());
  await s.tap('Morning check-in', 1600);
  check('history: Settings → Morning check-in board', (await s.path()) === '/routines/morning-time', await s.path());
  await s.tap('Back', 1500);
  check('history: morning Back → Settings', (await s.path()) === '/settings', await s.path());
  await s.tap('Night check-in', 1600);
  await s.tap('Save time', 1800);
  check('history: Settings → night board → Save time → Settings', (await s.path()) === '/settings', await s.path());
  await s.tap('Manage subscription', 1600);
  await s.tap('Change plan', 1600);
  await s.tap('Close', 900);
  await s.tap('No thanks', 1600);
  check('history: Subscription → Change plan → ✕ → No thanks → Subscription', (await s.path()) === '/subscription', await s.path());
  await s.tap('Back', 1500);
  check('history: … → Back → Settings', (await s.path()) === '/settings', await s.path());
  await s.browser.close();

  s = await session(PREMIUM);
  await s.go('/all');
  for (const [row, path, out] of [
    ['Reminders', '/reminders', 'Back'],
    ['Notifications primer', '/notify-primer', 'Not now'],
    ['Morning check-in time', '/routines/morning-time', 'Back'],
    ['Manage subscription', '/subscription', 'Back'],
  ]) {
    await s.tap(row, 1600);
    const there = await s.path();
    await s.tap(out, 1500);
    check(`history: All → ${row} → ${out} → All`, there === path && (await s.path()) === '/all', `${there} → ${await s.path()}`);
  }
  await s.tap('Paywall', 1600);
  await s.tap('Close', 900);
  await s.tap('No thanks', 1600);
  check('history: All → Paywall → ✕ → No thanks → All', (await s.path()) === '/all', await s.path());
  await s.browser.close();

  s = await session(FREE);
  await s.go('/locked');
  await s.tap('Unlock VICI Plus', 1600);
  const there = await s.path();
  await s.tap('Close', 900);
  await s.tap('Close', 1600);
  check('history: Locked → Unlock → ✕ → ✕ → Locked', there === '/paywall' && (await s.path()) === '/locked', `${there} → ${await s.path()}`);
  await s.browser.close();
}

const all = { routines, paywall, funnel, subscription, reminders, history };
for (const [k, fn] of Object.entries(all)) if (!only || only === k) await fn();
console.log('\n' + results.join('\n'));
