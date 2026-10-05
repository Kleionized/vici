/* Full-precision tops for the week-XII letter's block run, both sides. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const which = process.argv[2];            // design | app
const needle = 'So here is the part';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
if (which === 'app') {
  const seed = fs.readFileSync('.vicifull/letters-seed.js','utf8').replace('setTimeout(() => location.reload(), 0);','');
  await ctx.addInitScript(`try { ${seed} } catch (e) {}`);
}
const page = await ctx.newPage();
if (which === 'design') await page.goto('http://localhost:8097/f/Email-Login/Letter-Week-XII.html', { waitUntil: 'networkidle' });
else {
  await page.goto('http://localhost:8096/letter?variant=week12', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.getByText('Open it', { exact: true }).first().click();
  await page.waitForTimeout(1500);
}
const rows = await page.evaluate((needle) => {
  const out = [];
  const root = document.body;
  const walk = (el) => {
    for (const c of el.children) {
      const t = (c.textContent || '').trim();
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      if (r.width > 40 && r.height > 8 && (t.startsWith('So here is the part') || t.startsWith('There were nights') || t.startsWith('And there were bad') || t.startsWith('At the start, porn') || t.startsWith('— Sam') || t.startsWith('Keep this letter'))) {
        if (c.children.length === 0 || t.startsWith('Keep this letter'))
          out.push({ t: t.slice(0,26), top: r.top, h: r.height, lh: cs.lineHeight, mb: cs.marginBottom, mt: cs.marginTop, disp: cs.display });
      }
      if ((c.getBoundingClientRect().width) > 100 || c.children.length) walk(c);
    }
  };
  walk(root);
  // the mark block
  return out;
}, needle);
for (const r of rows) console.log(JSON.stringify(r));
await browser.close();
