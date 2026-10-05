import { chromium } from 'playwright-core';
import fs from 'node:fs';
const files = fs.readdirSync('.overhaul/final/Email-Login').filter(f=>/^SOS-(Loc|Feel|Trig)-.*\.html$/.test(f)).sort();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const out = {};
for (const f of files) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const lines = (el) => {
      const tn = [...el.childNodes].find(n => n.nodeType === 3); if (!tn) return null;
      const t = tn.textContent; const res = []; let cur = '', lastTop = null;
      for (let i = 0; i < t.length; i++) {
        const rg = document.createRange(); rg.setStart(tn, i); rg.setEnd(tn, i + 1);
        const rc = rg.getClientRects()[0]; if (!rc) { cur += t[i]; continue; }
        if (lastTop !== null && Math.abs(rc.top - lastTop) > 5) { res.push(cur); cur = ''; }
        lastTop = rc.top; cur += t[i];
      }
      res.push(cur); return res.map(s => s.trim());
    };
    const fonts = document.fonts.check('700 30px Lato') && document.fonts.check('400 15px Lato');
    const stack = [...document.querySelectorAll('div')].find(d => d.style.top === '452px');
    const [h, p] = stack.children;
    const rect = (e) => { const b = e.getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map(v => +v.toFixed(2)); };
    const res = { fonts, title: lines(h), body: lines(p), hRect: rect(h), pRect: rect(p) };
    // greedy versions
    h.style.textWrap = 'wrap'; p.style.textWrap = 'wrap';
    res.titleGreedy = lines(h); res.bodyGreedy = lines(p);
    h.style.textWrap = ''; p.style.textWrap = '';
    const btn = [...document.querySelectorAll('div')].find(d => d.style.borderRadius === '29px');
    res.btn = rect(btn); res.btnText = rect(btn.firstElementChild);
    const ghost = [...document.querySelectorAll('div')].find(d => d.textContent.trim() === 'Give me another' && d.children.length === 0);
    if (ghost) res.ghost = rect(ghost);
    const kick = [...document.querySelectorAll('div')].find(d => d.style.fontSize === '13px' && d.children.length === 0);
    res.kicker = rect(kick);
    const x = document.querySelector('svg[width="18"]'); res.close = rect(x);
    const art = document.querySelector('svg[data-hero]'); res.art = rect(art);
    return res;
  });
  out[f.replace('.html','')] = r;
  console.log(f, r.fonts, JSON.stringify(r.title), JSON.stringify(r.body), r.hRect, r.pRect, (JSON.stringify(r.title)!==JSON.stringify(r.titleGreedy)||JSON.stringify(r.body)!==JSON.stringify(r.bodyGreedy)) ? 'GREEDY-DIFFERS t=' + JSON.stringify(r.titleGreedy)+' b='+JSON.stringify(r.bodyGreedy) : '');
}
fs.writeFileSync('.overhaul/understand/scratch-sos-boards/lines.json', JSON.stringify(out, null, 1));
await browser.close();
