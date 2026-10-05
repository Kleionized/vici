import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:8096/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } }));
  localStorage.setItem('tideline.session.userId', 'mockuser_funnel');
  localStorage.removeItem('tideline.mock.userdata.mockuser_funnel');
});
await page.goto('http://localhost:8096/welcome', { waitUntil: 'networkidle' });
await page.evaluate(DRIVE);
await page.evaluate(`(async () => { window.__H='map1'; ${fs.readFileSync('.overhaul/drives/handover-walk.js','utf8')} })()`);
await page.waitForTimeout(1400);
const r = await page.evaluate(() => {
  const out = [];
  const walk = (el) => {
    if (el.children.length === 0 && el.textContent && /^(Week IV|Know Your Brain|You are here)$/.test(el.textContent.trim())) {
      const rect = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      out.push({ t: el.textContent.trim(), tag: el.tagName, top: rect.top, h: rect.height, lh: cs.lineHeight, fs: cs.fontSize, ff: cs.fontFamily.slice(0,60), disp: cs.display, va: cs.verticalAlign, pt: cs.paddingTop, bt: cs.borderTopWidth, fv: cs.fontVariationSettings, fw: cs.fontWeight, parentTop: el.parentElement.getBoundingClientRect().top, parentH: el.parentElement.getBoundingClientRect().height, parentDisp: getComputedStyle(el.parentElement).display, parentAI: getComputedStyle(el.parentElement).alignItems, gpDisp: getComputedStyle(el.parentElement.parentElement).display });
    }
    for (const c of el.children) walk(c);
  };
  walk(document.body);
  return out;
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
