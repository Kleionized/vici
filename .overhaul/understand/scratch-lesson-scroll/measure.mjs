// Measure each lesson-1 frame's centred stack at other device widths, in the
// design server's own Lato, by re-laying the frame's block at a new width.
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
const out = [];
for (let k = 1; k <= 14; k++) {
  await page.goto(`http://localhost:8097/f/Email-Login/Lesson-Scroll-${k}.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const host = document.querySelector('[data-screen-label]');
    const block = [...host.children].find((d) => d.style.top === '140px');
    const res = {};
    for (const W of [393, 375, 390, 430]) {
      const col = W - 64;
      block.style.right = 'auto';
      block.style.width = col + 64 - 64 + 'px';
      // the hero wrapper is the frame's own 393; keep it, as the app would centre it
      block.style.justifyContent = 'flex-start';
      block.style.bottom = 'auto';
      const kids = [...block.children];
      const top = block.getBoundingClientRect().top;
      const last = kids[kids.length - 1].getBoundingClientRect().bottom;
      const lines = kids.filter((c) => /px/.test(c.style.lineHeight || '')).map((c) => Math.round(c.getBoundingClientRect().height / parseFloat(c.style.lineHeight)));
      res[W] = { stack: Math.round((last - top) * 10) / 10, lines: lines.join(',') };
    }
    return res;
  });
  out.push([k, r]);
}
for (const [k, r] of out) console.log(k, JSON.stringify(r));
await browser.close();
