import fs from 'node:fs';
import { chromium } from 'playwright-core';
const FRAMES = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'))['sos-flow'].map((f) => f.replace(/\.html$/, '')).filter((f) => f !== 'SOS-Challenge');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 })).newPage();
for (const f of FRAMES) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}.html`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(async () => {
    await document.fonts.ready;
    const lines = (el) => {
      const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!tn) return null;
      const t = tn.textContent; const res = []; let cur = ''; let lastTop = null;
      for (let i = 0; i < t.length; i++) { const rg = document.createRange(); rg.setStart(tn, i); rg.setEnd(tn, i + 1); const rc = rg.getClientRects()[0]; if (!rc) { cur += t[i]; continue; } if (lastTop !== null && Math.abs(rc.top - lastTop) > 5) { res.push(cur); cur = ''; } lastTop = rc.top; cur += t[i]; }
      res.push(cur); return res.map((s) => s.trim());
    };
    const out = [];
    for (const el of document.querySelectorAll('div,span')) {
      const tw = el.style.textWrap;
      if (!tw || tw === 'wrap') continue;
      const drawn = lines(el); if (!drawn) continue;
      el.style.textWrap = 'wrap'; const greedy = lines(el); el.style.textWrap = tw;
      out.push({ tw, drawn, greedy, same: drawn.join('|') === greedy.join('|') });
    }
    return out;
  });
  for (const x of r) if (!x.same || x.drawn.length > 1) console.log(`${f} [${x.tw}] ${x.same ? 'same' : 'DIFF'} drawn=${JSON.stringify(x.drawn)}${x.same ? '' : ' greedy=' + JSON.stringify(x.greedy)}`);
}
await browser.close();
