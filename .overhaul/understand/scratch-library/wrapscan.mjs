import fs from 'node:fs';
import { chromium } from 'playwright-core';
const titles = fs.readFileSync('/dev/stdin','utf8').split('\n').map(l=>l.match(/^\s*(\d+) = "([^"]*)"/)).filter(Boolean).map(m=>[+m[1],m[2]]);
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:1 })).newPage();
await page.goto('http://localhost:8097/f/Email-Login/Week-I-Reset.html', { waitUntil:'networkidle' });
await page.evaluate(()=>document.fonts.ready);
const res = await page.evaluate((titles)=>{
  const host=document.createElement('div'); document.body.appendChild(host);
  const out=[];
  for (const [n,t] of titles) {
    const row=[n,t];
    for (const w of [251,233,211.22,193.22]) { const s=document.createElement('span'); s.style.cssText=`display:block;width:${w}px;font:700 15px Lato;`; s.textContent=t; host.appendChild(s); row.push(Math.round(s.getBoundingClientRect().height/18)); s.remove(); }
    out.push(row);
  }
  return out;
}, titles);
for (const r of res) if (r.slice(2).some(x=>x>1)) console.log(r.join(' | '));
await browser.close();
