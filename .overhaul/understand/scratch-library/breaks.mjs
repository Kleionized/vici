import fs from 'node:fs';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:1 })).newPage();
const files = ['Week-III-In-the-Moment-P2.html','Week-IV-Know-Your-Brain-P2.html','Week-V-Why-It-Feels-Worth-It-P2.html','Week-VI-Discipline.html','Week-VIII-Boredom-and-Meaning.html','Week-IX-Connection.html','Week-X-Yourself.html','Week-XI-Build-a-Life-You-Want-P2.html'];
for (const f of files) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}`, { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  const r = await page.evaluate(()=>{
    const out=[];
    for (const s of document.querySelectorAll('span')) {
      if (!s.style.flex) continue;
      if (s.getBoundingClientRect().height < 30) continue;
      const tn=s.firstChild; const txt=tn.textContent; const range=document.createRange(); let lines=[]; let cur=''; let lastTop=null;
      for (let i=0;i<txt.length;i++){ range.setStart(tn,i); range.setEnd(tn,i+1); const top=Math.round(range.getBoundingClientRect().top); if(lastTop!==null && top!==lastTop){ lines.push(cur); cur=''; } cur+=txt[i]; lastTop=top; }
      lines.push(cur); out.push(lines);
    }
    // all svg chevrons / check positions in rows
    const rb=document.querySelector('[data-screen-label]').getBoundingClientRect();
    const svgs=[...document.querySelectorAll('svg')].filter(s=>s.getAttribute('viewBox')==='0 0 14 14').map(s=>{const b=s.getBoundingClientRect(); return [b.left-rb.left,b.top-rb.top,b.width].map(v=>+v.toFixed(2)).join(',');});
    return {out, svgs};
  });
  console.log(f, JSON.stringify(r.out), r.svgs.slice(0,4).join(' '));
}
await browser.close();
