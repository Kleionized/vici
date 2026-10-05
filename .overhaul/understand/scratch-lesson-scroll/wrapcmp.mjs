// For every run in the 14 frames that states text-wrap, compare the frame's
// own breaks with plain greedy wrapping (what native RN does).
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
for (let k = 1; k <= 14; k++) {
  await page.goto(`http://localhost:8097/f/Email-Login/Lesson-Scroll-${k}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const lines = (el) => {
      const range = document.createRange(); const t = el.firstChild; if (!t || t.nodeType !== 3) return null;
      const out = []; let cur = ''; let lastTop = null;
      for (let i = 0; i < t.length; i++) { range.setStart(t, i); range.setEnd(t, i + 1); const rc = range.getClientRects()[0]; if (!rc) { cur += t.data[i]; continue; } if (lastTop != null && rc.top > lastTop + 4) { out.push(cur); cur = ''; } lastTop = rc.top; cur += t.data[i]; }
      out.push(cur); return out.map((s) => s.trim());
    };
    const res = [];
    for (const el of document.querySelectorAll('[data-screen-label] div')) {
      const tw = el.style.textWrap; if (!tw || !el.firstChild || el.firstChild.nodeType !== 3) continue;
      const a = lines(el); el.style.textWrap = 'wrap'; const b = lines(el); el.style.textWrap = tw;
      if (JSON.stringify(a) !== JSON.stringify(b)) res.push({ tw, frame: a, greedy: b });
    }
    return res;
  });
  for (const x of r) console.log(`F${k} [${x.tw}]\n  frame : ${x.frame.join(' / ')}\n  greedy: ${x.greedy.join(' / ')}`);
}
await browser.close();
