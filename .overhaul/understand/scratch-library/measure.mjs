import fs from 'node:fs';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:1 });
const page = await ctx.newPage();
const files = fs.readdirSync('.overhaul/final/Email-Login').filter(f=>/^Week-[IVX]+-.*\.html$/.test(f)).sort();
for (const f of files) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}`, { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  const r = await page.evaluate(()=>{
    const out=[];
    const fontOk = document.fonts.check('700 15px Lato') ;
    const root=document.querySelector('[data-screen-label]');
    const rb=root.getBoundingClientRect();
    const box=(el)=>{const b=el.getBoundingClientRect(); return [+(b.left-rb.left).toFixed(2),+(b.top-rb.top).toFixed(2),+b.width.toFixed(2),+b.height.toFixed(2)];};
    // header
    const divs=[...root.querySelectorAll('div')];
    const hdr=divs.find(d=>d.style.top==='338px');
    const hdrKids=[...hdr.children].map(c=>({t:c.textContent, b:box(c)}));
    const rows=[...root.querySelectorAll('div')].filter(d=>d.style.height==='58px');
    const rowInfo=rows.map(rw=>{ const t=rw.querySelector('span[style*="flex: 1"]')||rw.querySelector('span'); const spans=[...rw.querySelectorAll('span')]; return {row:box(rw), title:t.textContent, tb:box(t), lines:Math.round(t.getBoundingClientRect().height/18), extra: spans.filter(s=>s!==t).map(s=>[s.textContent, box(s)])}; });
    return {fontOk, hdrKids, rowInfo};
  });
  console.log('==', f, 'fontOk', r.fontOk);
  console.log('  hdr', r.hdrKids.map(k=>`${k.t}@${k.b.join(',')}`).join(' | '));
  for (const ri of r.rowInfo) console.log(`  row ${ri.row.join(',')} lines=${ri.lines} title@${ri.tb.join(',')} "${ri.title}" ${ri.extra.map(e=>e[0]+'@'+e[1].join(',')).join(' ')}`);
}
await browser.close();
