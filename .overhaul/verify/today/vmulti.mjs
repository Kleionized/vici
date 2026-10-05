#!/usr/bin/env node
// Verifier scratch: one browser, several captures of one route at a device size.
//   node vmulti.mjs <route> <seed> <w> <h> <outPrefix> '<json: [{name, js}]>'
// Each step's js runs in the page (drive.js loaded), then a screenshot <outPrefix>-<name>.png.
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const [route, seed, w, h, prefix, stepsJson] = process.argv.slice(2);
const steps = stepsJson.endsWith('.json') ? JSON.parse(fs.readFileSync(stepsJson, 'utf8')) : JSON.parse(stepsJson);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 2 });
if (seed && seed !== '-') {
  const s = fs.readFileSync(seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
  await ctx.addInitScript(`try { ${s} } catch (e) { console.error('initseed: ' + e.message); }`);
}
await ctx.addInitScript(() => {
  const css = '.__expo_fast_refresh{display:none!important}';
  const add = () => { const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
});
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[console] ' + m.text().slice(0, 300)); });
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await page.evaluate(fs.readFileSync('.overhaul/drive.js', 'utf8'));
await page.waitForTimeout(1800);
const fontsOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('normal 700 16px Lato'); });
if (!fontsOk) console.error('[fonts] Lato NOT loaded');
for (const st of steps) {
  let r;
  try {
    r = await page.evaluate(`(async () => { ${st.js || ''} })()`);
  } catch (e) {
    r = 'ERR ' + e.message;
  }
  await page.waitForTimeout(st.wait ?? 700);
  if (r !== undefined) console.log(st.name, '->', JSON.stringify(r).slice(0, 600));
  if (!st.noshot) {
    await page.screenshot({ path: `${prefix}-${st.name}.png` });
    console.log('shot', `${prefix}-${st.name}.png`);
  }
}
await browser.close();
