import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [VW, VH] = process.argv.slice(2).map(Number);
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/settings-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
await ctx.addInitScript(`try { ${SEED} } catch (e) {}`);
const page = await ctx.newPage();
const measure = () => page.evaluate(() => {
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()]; if (!rs.length) continue; texts.push({ t, top: Math.min(...rs.map((q) => q.top)), bottom: Math.max(...rs.map((q) => q.bottom)), right: Math.max(...rs.map((q) => q.right)), left: Math.min(...rs.map((q) => q.left)), lines: new Set(rs.map((q) => Math.round(q.top))).size }); }
  const svgs = [...document.querySelectorAll('svg')].filter((s) => s.getBoundingClientRect().width > 200).length;
  const dots = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(); return r.width > 4 && r.width < 10 && Math.abs(r.width - r.height) < 0.5 && getComputedStyle(d).borderRadius !== '0px'; }).map((d) => d.getBoundingClientRect().bottom);
  return { texts, svgs, dotsBottom: dots.length ? Math.max(...dots) : null, vw: innerWidth };
});
const CTA = ['Walk through it', 'Next', 'Done'];
for (const key of ['loneliness', 'anxiety', 'stress', 'boredom', 'latenight', 'homealone', 'argument']) {
  await page.goto(`http://localhost:8096/rough-protocol?key=${key}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(DRIVE); await page.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(700);
    const m = await measure();
    const pill = m.texts.find((x) => x.t === CTA[i]);
    const pillTop = pill.top - 19.5;
    const stack = m.texts.filter((x) => x.top > 110 && x.bottom < pillTop + 10 && ![...CTA, 'Not tonight', 'Back'].includes(x.t));
    const sb = Math.max(...stack.map((x) => x.bottom), m.dotsBottom ?? 0);
    const over = m.texts.filter((x) => x.right > m.vw + 0.5 || x.left < -0.5);
    console.log(`${key} p${i + 1} ${VW}x${VH} | stackBottom ${sb.toFixed(1)} pillTop ${pillTop.toFixed(1)} clear ${(pillTop - sb).toFixed(1)} | hero ${m.svgs} | ${stack.map((x) => x.t.slice(0, 12) + ':' + x.lines).join(' ')}${over.length ? ' OVERFLOW' : ''}`);
    if (i < 2) await page.evaluate(`(async () => { await tap(${JSON.stringify(CTA[i])}); })()`);
  }
}
await browser.close();
