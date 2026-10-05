import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:1 })).newPage();
await page.goto('http://localhost:8097/f/Email-Login/Week-VI-Discipline.html', { waitUntil:'networkidle' });
await page.evaluate(()=>document.fonts.ready);
const r = await page.evaluate(()=>{
  const rb=document.querySelector('[data-screen-label]').getBoundingClientRect();
  const bx=(el)=>{const b=el.getBoundingClientRect(); return [b.left-rb.left,b.top-rb.top,b.width,b.height].map(v=>+v.toFixed(2)).join(',');};
  const out={};
  const bar=[...document.querySelectorAll('div')].find(d=>d.style.height==='104px');
  out.bar=bx(bar);
  out.items=[...bar.children].map(c=>({box:bx(c), kids:[...c.children].map(k=>k.tagName+':'+bx(k)+':'+(k.textContent||''))}));
  const chev=[...document.querySelectorAll('svg')].find(s=>s.getAttribute('viewBox')==='0 0 12 20'); out.chev=bx(chev); out.chevBox=bx(chev.parentElement);
  const hero=[...document.querySelectorAll('svg')].find(s=>s.getAttribute('viewBox')==='0 0 393 240'); out.hero=bx(hero); 
  const g=hero.querySelector('g, path, rect'); 
  // art bbox in screen coords
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9; for (const el of hero.querySelectorAll('path,rect,circle,ellipse')) { const b=el.getBoundingClientRect(); minx=Math.min(minx,b.left-rb.left); miny=Math.min(miny,b.top-rb.top); maxx=Math.max(maxx,b.right-rb.left); maxy=Math.max(maxy,b.bottom-rb.top);} out.art=[minx,miny,maxx,maxy].map(v=>+v.toFixed(2)).join(',');
  const noise=document.querySelector('[data-screen-label]').children[0]; out.noise=getComputedStyle(noise).backgroundImage.slice(0,80)+' '+getComputedStyle(noise).opacity;
  return out;
});
console.log(JSON.stringify(r,null,1));
await browser.close();
