// Prints the line breaks the canvas renders for every text block (text-wrap balance/pretty and plain),
// and what a plain greedy wrap would give, for each frame in the auth-funnel group.
import { chromium } from 'playwright-core';
const frames = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const p = await (await b.newContext({ viewport: { width: 393, height: 852 } })).newPage();
for (const f of frames) {
  await p.goto(`http://localhost:8097/f/Email-Login/${f}.html`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const rows = await p.evaluate(() => {
    const lineSplit = (el) => {
      // walk text nodes, word by word, group by rect top
      const words = [];
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = tw.nextNode())) {
        const t = n.textContent;
        const re = /\S+/g; let m;
        while ((m = re.exec(t))) {
          const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
          const rc = r.getClientRects()[0];
          if (rc) words.push({ w: m[0], top: Math.round(rc.top) });
        }
      }
      const lines = [];
      for (const w of words) { const l = lines[lines.length - 1]; if (l && Math.abs(l.top - w.top) < 4) l.t.push(w.w); else lines.push({ top: w.top, t: [w.w] }); }
      return lines.map((l) => l.t.join(' '));
    };
    const out = [];
    for (const el of document.querySelectorAll('div,span')) {
      if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
      const tw = el.style.textWrap || el.style.getPropertyValue('text-wrap') || '';
      const was = lineSplit(el);
      let plain = null;
      if (tw && tw !== 'wrap') { el.style.textWrap = 'wrap'; plain = lineSplit(el); el.style.textWrap = tw; }
      out.push({ tw, was, plain, w: Math.round(el.getBoundingClientRect().width * 10) / 10 });
    }
    return out;
  });
  console.log('== ' + f);
  for (const r of rows) {
    if (r.was.length < 2 && !(r.plain && r.plain.length > 1)) continue;
    const moved = r.plain && JSON.stringify(r.plain) !== JSON.stringify(r.was);
    console.log(`  [${r.tw || 'plain'}${moved ? ' MOVES' : ''}] w=${r.w}  ${r.was.join(' ⏎ ')}`);
    if (moved) console.log(`        greedy: ${r.plain.join(' ⏎ ')}`);
  }
}
await b.close();
