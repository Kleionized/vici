#!/usr/bin/env node
/**
 * Headless capture of a design frame or an app route, at the canvas's own
 * 393x852, using the Chrome already on this machine.
 *
 *   node scripts/vicifull/shot.mjs design <bundle> <Frame.html> <out.png>
 *   node scripts/vicifull/shot.mjs app <path> <out.png> [--seed] [--script=file.js]
 *
 * `--sig=<name>` also writes the layout signature to .vicifull/sig/<name>.txt
 * so a design frame and the app can be diffed numerically, not by eye.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PROBE = fs.readFileSync('.vicifull/probe.js', 'utf8');

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const pos = argv.filter((a) => !a.startsWith('--'));

/* Several agents capture at once on an 8 GB machine, so each browser is asked
   to be as small as it can: no GPU process, no shared-memory file, and a small
   JS heap. A capture renders one 393x852 page and exits. */
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'],
});
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
/* `--initseed=<file>`: put a dataset into localStorage BEFORE the first paint.
   A route like /day/morning has nothing that signs a mock user in, so seeding
   after load needs a reload — and a reload destroys the execution context the
   driving happens from. An init script lands first and needs no reload. */
if (flags.initseed) {
  const seed = fs.readFileSync(String(flags.initseed), 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
  await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('initseed: ' + e.message); }`);
}
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[console] ' + m.text()); });
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));

const mode = pos[0];
let out;
if (mode === 'design') {
  const [, bundle, frame, o] = pos;
  out = o;
  await page.goto(`http://localhost:8097/f/${bundle}/${frame}`, { waitUntil: 'networkidle' });
} else {
  const [, route, o] = pos;
  out = o;
  const base = flags.port ? `http://localhost:${flags.port}` : 'http://localhost:8096';
  /* Under six agents plus Metro this machine can take a while to serve a
     route, and `networkidle` then times out on a page that is perfectly fine.
     Wait for the document, then give the network a bounded chance to settle. */
  await page.goto(base + (route.startsWith('/') ? route : '/' + route), { waitUntil: 'domcontentloaded', timeout: 120000 });
  /* `--fast`: skip the network-idle wait. A screen that replaces itself shortly
     after load — `01 · Splash` holds for 900 ms — is already gone by the time the
     network settles under load, so its capture has to start from the document. */
  if (!flags.fast) await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  if (flags.seed) {
    await page.evaluate(fs.readFileSync('.vicifull/reseed.js', 'utf8'));
    await page.reload({ waitUntil: 'networkidle' });
  }
  await page.evaluate(fs.readFileSync('.vicifull/drive.js', 'utf8'));
  /* A board is not interactive the moment the network goes idle: react-native-web
     attaches its responders a beat later, and a tap before that silently no-ops.
     Waiting here rather than in every recipe (FINDINGS F21) — but only when there
     is something to drive. A static capture may be of a screen that does not last
     1.5 s: `01 · Splash` replaces itself at 900 ms, and settling first walks
     straight past it. `--settle=<ms>` overrides either way. */
  const settle = flags.settle != null ? Number(flags.settle) : (flags.do || flags.script ? 1500 : 0);
  if (settle > 0) await page.waitForTimeout(settle);
  if (flags.do) {
    const r = await page.evaluate(`(async () => { ${flags.do} })()`);
    if (r) console.log('do ->', JSON.stringify(r).slice(0, 400));
  }
  if (flags.script) {
    const r = await page.evaluate(`(async () => { ${fs.readFileSync(flags.script, 'utf8')} })()`);
    if (r) console.log('script ->', JSON.stringify(r).slice(0, 400));
  }
  await page.waitForTimeout(Number(flags.wait ?? 900));
}
if (flags.sig) {
  await page.evaluate(PROBE);
  const rows = await page.evaluate((n) => window.__sigRows(n), flags.sig);
  fs.mkdirSync('.vicifull/sig', { recursive: true });
  fs.writeFileSync('.vicifull/sig/' + String(flags.sig).replace(/[^A-Za-z0-9._-]/g, '_') + '.txt', rows);
  console.log(rows.split('\n').length + ' rows -> ' + flags.sig);
}
if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  console.log('shot -> ' + out);
}
await browser.close();
