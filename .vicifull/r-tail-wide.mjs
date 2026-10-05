import fs from 'node:fs';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--disable-extensions','--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
const seed = fs.readFileSync('.vicifull/tail-session-seed.js','utf8').replace('setTimeout(() => location.reload(), 0);','');
await ctx.addInitScript(`try { ${seed} } catch(e){}`);
const page = await ctx.newPage();
await page.goto('http://localhost:8096/welcome', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(()=>{});
await page.evaluate(fs.readFileSync('.vicifull/drive.js','utf8'));
await page.waitForTimeout(1500);
await page.evaluate(`(async () => { window.__T="starting-point" })()`);
await page.evaluate(`(async () => { ${fs.readFileSync('.vicifull/drives/tail-walk.js','utf8')} })()`);
await page.waitForTimeout(2400);
const info = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll('svg')].filter(s => (s.getAttribute('viewBox')||'') === '0 0 345 88');
  return svgs.map(s => { const r = s.getBoundingClientRect(); const p = s.parentElement.getBoundingClientRect();
    // where does the curve's ink actually reach?
    return { par: p.width, w: r.width, h: r.height, pAR: s.getAttribute('preserveAspectRatio') }; });
});
console.log(JSON.stringify(info));
await page.screenshot({ path: '/private/tmp/claude-501/-Users-admin-Documents-tideline/5423ed38-acde-4575-81d4-992c18251029/scratchpad/wide-32.png' });
await browser.close();
