import { chromium } from 'playwright-core';
import fs from 'node:fs';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const c = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const p = await c.newPage();
await p.goto('http://localhost:8097/f/Email-Login/Sheet-Edit-Name.html', { waitUntil: 'networkidle' });
await p.evaluate(`
  const s=[...document.querySelectorAll('span')].filter(x=>x.textContent==='Sam Reyes').pop();
  s.style.webkitFontSmoothing='auto';
  const car=s.nextElementSibling; if(car) car.style.visibility='hidden';
`);
await p.screenshot({ path: '/private/tmp/claude-501/-Users-admin-Documents-tideline/5423ed38-acde-4575-81d4-992c18251029/scratchpad/smooth-auto.png' });
await b.close();
