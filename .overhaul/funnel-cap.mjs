/* Capture the app with a signed-in mock user: goto, plant the session, reload,
   drive, shoot. shot.mjs's --script cannot navigate, so this does the reload. */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PROBE = fs.readFileSync('.overhaul/probe.js', 'utf8');
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const pos = argv.filter((a) => !a.startsWith('--'));
const [route, out] = pos;

/* The same launch args as `scripts/overhaul/shot.mjs`. They are not a memory
   nicety: without `--disable-gpu` Chrome rasterises down a different path, and
   an app PNG captured here against a design PNG captured by shot.mjs differs by
   ~620 px over 12/255 (worst 88) on a frame that is actually identical. Pairing
   the two harnesses was reading as antialiasing noise on every frame. */
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'],
});
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[console] ' + m.text()); });
await page.goto('http://localhost:8096/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } }));
  localStorage.setItem('tideline.session.userId', 'mockuser_funnel');
  localStorage.removeItem('tideline.mock.userdata.mockuser_funnel');
});
await page.goto('http://localhost:8096' + route, { waitUntil: 'networkidle' });
await page.evaluate(DRIVE);
if (flags.do) { const r = await page.evaluate(`(async () => { ${flags.do} })()`); if (r) console.log('do ->', JSON.stringify(r).slice(0, 600)); }
if (flags.script) { const r = await page.evaluate(`(async () => { ${fs.readFileSync(flags.script, 'utf8')} })()`); if (r) console.log('script ->', JSON.stringify(r).slice(0, 600)); }
await page.waitForTimeout(Number(flags.wait ?? 1200));
if (flags.sig) {
  await page.evaluate(PROBE);
  const rows = await page.evaluate((n) => window.__sigRows(n), flags.sig);
  fs.mkdirSync('.overhaul/sig', { recursive: true });
  fs.writeFileSync('.overhaul/sig/' + String(flags.sig).replace(/[^A-Za-z0-9._-]/g, '_') + '.txt', rows);
  console.log(rows.split('\n').length + ' rows -> ' + flags.sig);
}
if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); await page.screenshot({ path: out }); console.log('shot -> ' + out); }
await browser.close();
