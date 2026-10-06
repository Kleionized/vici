#!/usr/bin/env node
/**
 * Headless capture of a design frame or an app route, at the canvas's own
 * 393x852, using the Chrome already on this machine.
 *
 *   node scripts/overhaul/shot.mjs design <bundle> <Frame.html> <out.png>
 *   node scripts/overhaul/shot.mjs app <path> <out.png> [--seed] [--script=file.js]
 *
 * `--sig=<name>` also writes the layout signature to .overhaul/sig/<name>.txt
 * so a design frame and the app can be diffed numerically, not by eye.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PROBE = fs.readFileSync('.overhaul/probe.js', 'utf8');

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
// `--w=`/`--h=`: another device size (the canvas is 393x852; the size sweep
// also runs 375x667, 390x844 and 430x932).
const VW = Number(flags.w ?? 393), VH = Number(flags.h ?? 852);
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: Number(flags.dpr ?? 2) });
/* `--initseed=<file>`: put a dataset into localStorage BEFORE the first paint.
   A route like /day/morning has nothing that signs a mock user in, so seeding
   after load needs a reload — and a reload destroys the execution context the
   driving happens from. An init script lands first and needs no reload. */
if (flags.initseed) {
  const seed = fs.readFileSync(String(flags.initseed), 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
  await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('initseed: ' + e.message); }`);
}
// Expo's dev fast-refresh badge (`.__expo_fast_refresh`, a bolt at 8,802) appears in any
// capture taken while another agent's save rebuilds the bundle. It is not app UI;
// hide exactly that class rather than masking the corner the Today tab lives in.
await ctx.addInitScript(() => {
  const css = '.__expo_fast_refresh{display:none!important}';
  const add = () => { const s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
});
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
    await page.evaluate(fs.readFileSync('.overhaul/reseed.js', 'utf8'));
    await page.reload({ waitUntil: 'networkidle' });
  }
  await page.evaluate(fs.readFileSync('.overhaul/drive.js', 'utf8'));
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
/* Fonts first: a capture taken before Lato arrives measures the fallback face,
   and every text row then disagrees for a reason that is not the screen's. */
const fontState = await page.evaluate(async () => {
  await document.fonts.ready;
  const want = [['400', 'normal'], ['700', 'normal']];
  const ok = want.map(([w, st]) => document.fonts.check(`${st} ${w} 16px Lato`) || [...document.fonts].some((f) => /Lato/.test(f.family) && f.status === 'loaded'));
  const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')}:${f.weight}:${f.style}`);
  return { ok: ok.every(Boolean), loaded };
});
if (!fontState.ok) console.error('[fonts] Lato NOT loaded — loaded faces: ' + fontState.loaded.join(', '));
else if (flags.fonts) console.log('[fonts] ' + fontState.loaded.join(', '));
/* `--scroll=<y>`: scroll the page's main scroller (the tallest scrollable box)
   by y before capturing, so content below the first screen is compared too.
   `--scroll=end` goes to the bottom. Prints the scroller's full height. */
if (flags.scroll != null) {
  const r = await page.evaluate((y) => {
    // the scroller on screen: a pager mounts its neighbours' scrollers off-screen, at equal size
    const vw = innerWidth, vh = innerHeight;
    const vis = (el) => { const r = el.getBoundingClientRect(); return Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)); };
    const all = [...document.querySelectorAll('*')].filter((el) => {
      const cs = getComputedStyle(el);
      return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100 && vis(el) > 0;
    });
    all.sort((a, b) => vis(b) - vis(a));
    const el = all[0];
    if (!el) return { scroller: null };
    el.scrollTop = y === 'end' ? el.scrollHeight : Number(y);
    return { scroller: true, scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
  }, String(flags.scroll));
  console.log('scroll -> ' + JSON.stringify(r));
  await page.waitForTimeout(400);
}
if (flags.sig) {
  await page.evaluate(PROBE);
  const rows = await page.evaluate((n) => window.__sigRows(n), flags.sig);
  fs.mkdirSync('.overhaul/sig', { recursive: true });
  fs.writeFileSync('.overhaul/sig/' + String(flags.sig).replace(/[^A-Za-z0-9._-]/g, '_') + '.txt', rows);
  console.log(rows.split('\n').length + ' rows -> ' + flags.sig);
}
await page.evaluate(async () => {
  // every image decoded (the noise tile is a background image backed by an <img>),
  // then two frames so RN-web's onLoad re-render has painted it
  await Promise.all([...document.images].map((i) => (i.complete ? (i.decode ? i.decode().catch(() => {}) : null) : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
});
if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  console.log('shot -> ' + out);
}
await browser.close();
