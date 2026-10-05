// For hero-led scroll pages at a size: does any painted svg shape start above the band top (clipped by the band)?
import { chromium } from 'playwright-core';
const [W, H] = [375, 667];
const pages = process.argv[2].split(',').map((s) => s.match(/L(\d+)-F(\d+)/).slice(1).map(Number));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now() + 864e5)); } catch {} });
const page = await ctx.newPage();
for (const [n, k] of pages) {
  await page.goto(`http://localhost:8096/lesson/day/${n}?page=${k}`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    const sc = [...document.querySelectorAll('div')].find((d) => /(auto|scroll|hidden)/.test(getComputedStyle(d).overflowY) && d.getBoundingClientRect().height > 200 && d.getBoundingClientRect().top > 60 && d.getBoundingClientRect().top < 140);
    const band = sc.getBoundingClientRect().top;
    const svg = sc.querySelector('svg');
    let top = Infinity, who = '';
    for (const el of svg.querySelectorAll('path,circle,rect,ellipse,line,polygon,polyline')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || el.closest('defs,clipPath,mask')) continue;
      const fill = el.getAttribute('fill'), stroke = el.getAttribute('stroke');
      if ((fill === 'none' || fill === 'transparent') && (!stroke || stroke === 'none')) continue;
      const b = el.getBoundingClientRect();
      const sw = stroke && stroke !== 'none' ? Number(el.getAttribute('stroke-width') || 1) / 2 : 0;
      if (b.top - sw < top) { top = b.top - sw; who = el.tagName; }
    }
    return { band, svgTop: svg.getBoundingClientRect().top, artTop: top, who };
  });
  console.log(`L${n}-F${k} band ${r.band.toFixed(1)} svg ${r.svgTop.toFixed(1)} art ${r.artTop.toFixed(1)} ${r.artTop < r.band - 0.01 ? 'CLIPPED ' + r.who : 'ok'}`);
}
await browser.close();
