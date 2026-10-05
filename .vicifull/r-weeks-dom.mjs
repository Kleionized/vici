import fs from 'node:fs';
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const seed = fs.readFileSync('.vicifull/weeks-seed.js','utf8').replace('setTimeout(() => location.reload(), 0);','');
await ctx.addInitScript(`try { ${seed} } catch(e){}`);
const p = await ctx.newPage();
await p.goto('http://localhost:8096/week/1', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(()=>{});
await p.waitForTimeout(2200);
const out = await p.evaluate(() => {
  const dump = (sel) => [...document.querySelectorAll(sel)].map(n => n.tagName + ' ' + [...n.attributes].map(a=>a.name+'="'+a.value+'"').join(' '));
  const filters = [...document.querySelectorAll('filter')].map(f => f.outerHTML.replace(/\s+/g,' ').slice(0,320));
  return {
    radialGradients: dump('radialGradient'),
    linearGradients: dump('linearGradient').slice(0,4),
    filters,
    filteredShapes: [...document.querySelectorAll('[filter]')].map(n=>n.tagName+' filter='+n.getAttribute('filter')+' fill='+n.getAttribute('fill')),
    stops: [...document.querySelectorAll('radialGradient stop')].map(s=>s.getAttribute('offset')+' '+s.getAttribute('stop-color')+' '+s.getAttribute('stop-opacity')),
    nestedSvg: [...document.querySelectorAll('svg svg')].length,
  };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
