import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [VW, VH] = process.argv.slice(2).map(Number);
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/settings-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
await ctx.addInitScript(`try { ${SEED} } catch (e) {}`);
const page = await ctx.newPage();
const lines = () => page.evaluate(() => {
  const out = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) {
    const s = n.textContent; if (s.trim().length < 20) continue;
    const ls = []; let cur = null, top = null;
    for (let i = 0; i < s.length; i++) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); const q = r.getClientRects()[0]; if (!q) continue; const t = Math.round(q.top); if (top === null || Math.abs(t - top) > 4) { if (cur !== null) ls.push(cur); cur = ''; top = t; } cur += s[i]; }
    if (cur !== null) ls.push(cur);
    if (ls.length > 1) out.push(ls.map((l) => l.trim()));
  }
  return out;
});
const CTA = ['Walk through it', 'Next', 'Done'];
for (const key of ['loneliness', 'anxiety', 'stress', 'boredom', 'latenight', 'homealone', 'argument']) {
  await page.goto(`http://localhost:8096/rough-protocol?key=${key}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(DRIVE); await page.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(600);
    for (const ls of await lines()) { const bad = ls.slice(1).some((l) => /^[—–]/.test(l)); const widow = ls[ls.length - 1].split(/\s+/).length === 1; if (bad || widow) console.log(`${key} p${i + 1} ${VW}: ${bad ? 'DASH-START ' : ''}${widow ? 'WIDOW ' : ''}${JSON.stringify(ls)}`); }
    if (i < 2) await page.evaluate(`(async () => { await tap(${JSON.stringify(CTA[i])}); })()`);
  }
}
console.log('done', VW);
await browser.close();
