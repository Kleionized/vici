#!/usr/bin/env node
/**
 * Same output as scripts/overhaul/shot.mjs (PNG + layout signature), but it
 * drives the page with REAL Playwright clicks.
 *
 * `.overhaul/drive.js`'s `tap()` dispatches synthetic pointer/mouse events, and
 * react-native-web's Pressable ignores them on this build — the slip flow never
 * advanced past its first screen under it, and neither did `/urge`'s. A real
 * `page.getByText(...).click()` advances both.
 *
 *   node .overhaul/slipshot.mjs /slip out.png sig-name "Log the slip" "Closed" …
 *   a step of the form  @<n>  clicks the nth control instead of a label,
 *   a step of the form  #<ms> waits.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PROBE = fs.readFileSync('.overhaul/probe.js', 'utf8');
const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [route, out, sig, ...steps] = argv.filter((a) => !a.startsWith('--'));

/* `--slips=N` signs a mock account in BEFORE the first paint, with N slips
   already on today's log and a signed pledge — the only way to reach 98H and
   98I, which are chosen by that count, and the only way the 98J card shows a
   name and a pledge line instead of its fallbacks. */
const SEED = (n) => `
const uid = 'slip-seed-user';
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'slip@vici.app': { userId: uid, email: 'slip@vici.app', password: 'x', displayName: 'Jerry' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 12 * 86400000, onboardingComplete: true, settings: {} },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: Array.from({ length: ${n} }, (_, i) => ({ _id: 's-' + i, userId: uid, type: 'lapse', createdAt: midnight + (9 + i) * 3600000, note: '' })),
  checkins: {},
  journalEntries: [{ _id: 's-p', userId: uid, tag: 'Pledge', title: 'Pledge', body: 'The mornings are mine again.', createdAt: midnight }],
}));
`;

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
if (flags.slips != null) await ctx.addInitScript(SEED(Number(flags.slips) || 0));
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(2500);

for (const step of steps) {
  if (step.startsWith('#')) { await page.waitForTimeout(Number(step.slice(1))); continue; }
  if (step.startsWith('@')) { await page.locator('button').nth(Number(step.slice(1))).click(); await page.waitForTimeout(420); continue; }
  await page.getByText(step, { exact: true }).first().click();
  await page.waitForTimeout(420);
}
await page.waitForTimeout(700);

if (sig && sig !== '-') {
  await page.evaluate(PROBE);
  const rows = await page.evaluate((n) => window.__sigRows(n), sig);
  fs.mkdirSync('.overhaul/sig', { recursive: true });
  fs.writeFileSync('.overhaul/sig/' + sig.replace(/[^A-Za-z0-9._-]/g, '_') + '.txt', rows);
  console.log(rows.split('\n').length + ' rows -> ' + sig);
}
if (out && out !== '-') {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  console.log('shot -> ' + out);
}
await browser.close();
