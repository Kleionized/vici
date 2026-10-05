/* What CSS position does an unstyled react-native-svg <Svg> get on web, and
   does it paint above its absolutely-positioned siblings? */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const seed = fs.readFileSync('.vicifull/letters-onb-seed.js','utf8').replace('setTimeout(() => location.reload(), 0);','');
await ctx.addInitScript(`try { ${seed} } catch (e) {}`);
const p = await ctx.newPage();
await p.goto('http://localhost:8096/welcome', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(()=>{});
await p.waitForTimeout(1500);
await p.evaluate(fs.readFileSync('.vicifull/drive.js', 'utf8'));
await p.evaluate(() => { window.__H = 'med'; });
await p.evaluate(`(async () => { ${fs.readFileSync('.vicifull/drives/handover-walk.js','utf8')} })()`).catch((e)=>console.error('drive:', e.message));
await p.waitForTimeout(1400);
console.log(await p.evaluate(() => {
  const svgs = [...document.querySelectorAll('svg')];
  const laurel = svgs.find((s) => s.getAttribute('viewBox') === '0 0 40 26');
  if (!laurel) return 'laurel svg not found; svg viewBoxes: ' + svgs.map(s=>s.getAttribute('viewBox')).join(' | ');
  const cs = getComputedStyle(laurel);
  const sibs = [...laurel.parentElement.children].map((c) => `${c.tagName} pos=${getComputedStyle(c).position} z=${getComputedStyle(c).zIndex}`);
  const r = laurel.getBoundingClientRect();
  return JSON.stringify({ position: cs.position, zIndex: cs.zIndex, rect: [r.x, r.y, r.width, r.height], siblings: sibs }, null, 1);
}));
await b.close();
