#!/usr/bin/env node
/**
 * GROUP today, pass 2 — the F28 test on `20B · Score Detail — What Moved It`.
 *
 * The verifier called the ledger's five rows an unproven "sample data" excuse
 * and said they are seedable. They are: this builds the account the ledger
 * itself states — 17 days alive, one slip, nine check-ins, four lessons, four
 * urges ridden — and captures the page off it, so the row values can be read
 * rather than argued about.
 *
 * `monthLedger` windows on `min(30, daysAlive)`, so "clean days +64" is
 * 16 = days − slips, which forces daysAlive = 17 once the slip row says one
 * slip. That is the only account that produces the ledger, and it is not the
 * account the four frames' header (1,240 · Navigator · II) is drawn for.
 *
 *   node .vicifull/f-today-ledger.mjs out.png --sig=name
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PROBE = fs.readFileSync('.vicifull/probe.js', 'utf8');
const DRIVE = fs.readFileSync('.vicifull/drive.js', 'utf8');

const DAY = 86_400_000;
const UID = 'today-ledger-user';
const midnight = new Date().setHours(0, 0, 0, 0);
const at = (daysAgo, hour = 21) => midnight - daysAgo * DAY + hour * 3600e3;
const key = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

let n = 0;
const events = [];
const ev = (type, createdAt, extra = {}) => events.push({ _id: `led-${++n}`, userId: UID, type, createdAt, ...extra });

// one slip, eight days back
ev('lapse', at(8, 22), { severity: 5 });
// four urges ridden
for (let i = 0; i < 4; i++) ev('urge_rode_out', at(2 + i * 3, 20), { severity: 5, trigger: 'Late night', precedingState: 'Bored', whatHelped: 'Left the room', reopens: 0 });

// nine check-ins
const checkins = {};
for (let i = 0; i < 9; i++) {
  const k = key(at(i));
  checkins[k] = { userId: UID, date: k, mood: 3, energy: 3, note: '' };
}

// four lessons finished, week II's first four — the same four the seed uses
const progress = {};
['day-11', 'day-10', 'day-09', 'day-08'].forEach((slug, i) => {
  progress[slug] = { userId: UID, lessonSlug: slug, status: 'completed', completedAt: at(i * 2, 8), fitsMeRating: 4 };
});

const seed = {
  user: { clerkUserId: UID, displayName: 'Marcus', createdAt: midnight - 16 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress,
  reflections: {},
  checkins,
  events,
  journalEntries: [],
  lifeMap: { userId: UID, values: [] },
};

const SEED = `
localStorage.setItem('tideline.mock.users', ${JSON.stringify(JSON.stringify({ 'led@vici.app': { userId: UID, email: 'led@vici.app', password: 'x', displayName: 'Marcus' } }))});
localStorage.setItem('tideline.session.userId', ${JSON.stringify(UID)});
localStorage.setItem('tideline.mock.userdata.' + ${JSON.stringify(UID)}, ${JSON.stringify(JSON.stringify(seed))});
`;

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [out] = argv.filter((a) => !a.startsWith('--'));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
await ctx.addInitScript(`try { ${SEED} } catch (e) { console.error('seed: ' + e.message); }`);
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[console] ' + m.text()); });
await page.goto('http://localhost:8096/score', { waitUntil: 'networkidle' });
await page.evaluate(DRIVE);
await page.evaluate(`(async () => { await __sleep(1700); const n=[...document.querySelectorAll('div')].find(d=>d.scrollWidth>d.clientWidth+8); n.scrollLeft=393; await __sleep(1400) })()`);
await page.waitForTimeout(900);
if (flags.sig) {
  await page.evaluate(PROBE);
  const rows = await page.evaluate((s) => window.__sigRows(s), flags.sig);
  fs.mkdirSync('.vicifull/sig', { recursive: true });
  fs.writeFileSync('.vicifull/sig/' + String(flags.sig).replace(/[^A-Za-z0-9._-]/g, '_') + '.txt', rows);
  console.log(rows.split('\n').length + ' rows -> ' + flags.sig);
}
if (out && out !== '-') { fs.mkdirSync(path.dirname(out), { recursive: true }); await page.screenshot({ path: out }); console.log('shot -> ' + out); }
await browser.close();
