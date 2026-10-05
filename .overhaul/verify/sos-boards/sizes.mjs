// verifier: open each board via mock ?board= at a device size, measure text vs controls; screenshots for a subset.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const VW = Number(flags.w), VH = Number(flags.h);
const keys = flags.keys ? String(flags.keys).split(',') : JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'))['sos-boards'].map((f) => f.replace('.html', ''));
const shots = new Set(String(flags.shots ?? '').split(',').filter(Boolean));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
for (const k of keys) {
  await page.goto(`http://localhost:8096/urge?board=${k}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const r = await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const texts = [];
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') continue;
      let op = 1; for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
      const rg = document.createRange(); rg.selectNodeContents(n);
      const rects = [...rg.getClientRects()];
      if (!rects.length) continue;
      const top = Math.min(...rects.map((q) => q.top)), bottom = Math.max(...rects.map((q) => q.bottom)), left = Math.min(...rects.map((q) => q.left)), right = Math.max(...rects.map((q) => q.right));
      texts.push({ t: t.slice(0, 40), top: +top.toFixed(1), bottom: +bottom.toFixed(1), left: +left.toFixed(1), right: +right.toFixed(1), lines: new Set(rects.map((q) => Math.round(q.top))).size, op: +op.toFixed(2) });
    }
    const btn = (label) => [...document.querySelectorAll('[role="button"]')].find((b) => b.textContent.trim() === label);
    const svgs = [...document.querySelectorAll('svg')].map((s) => { const q = s.getBoundingClientRect(); let op = 1; for (let e = s; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity); return { w: Math.round(q.width), h: Math.round(q.height), top: Math.round(q.top), left: Math.round(q.left), op }; }).filter((s) => s.w > 200);
    return { vw, vh, texts, svgs };
  });
  const ctaT = r.texts.filter((x) => x.t === 'Continue' || x.t === 'Done');
  const pill = ctaT.length ? ctaT[ctaT.length - 1] : null;
  const ghost = r.texts.find((x) => x.t === 'Give me another');
  const stack = r.texts.filter((x) => x.top > 120 && !['Continue', 'Done', 'Give me another'].includes(x.t));
  const stackBottom = Math.max(...stack.map((x) => x.bottom));
  const stackTop = Math.min(...stack.map((x) => x.top));
  // pill box: label is centred in a 58 box, label 19 tall → pill top ≈ label top − 19.5
  const pillTop = pill ? pill.top - 19.5 : null;
  const over = r.texts.filter((x) => x.right > r.vw + 0.5 || x.left < -0.5);
  const lines = stack.map((x) => `${x.t.slice(0, 14)}:${x.lines}`).join(' ');
  console.log(`${k} ${VW}x${VH} | stack ${stackTop}-${stackBottom} | pillTop ${pillTop?.toFixed(1)} | clear ${(pillTop - stackBottom).toFixed(1)} | ghost ${ghost ? ghost.top : '-'} | hero ${r.svgs.map((s) => `${s.w}x${s.h}@${s.left},${s.top} op${s.op}`).join(';') || 'NONE'} | ${lines}${over.length ? ' | OVERFLOW ' + JSON.stringify(over) : ''}${stack.some((x) => x.op < 1) ? ' | OPACITY<1' : ''}`);
  if (shots.has(k) || flags.allshots) await page.screenshot({ path: `.overhaul/verify/sos-boards/s-${k}-${VW}x${VH}.png` });
}
await browser.close();
