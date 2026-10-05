// node .overhaul/f-sosb-chal-wrap.mjs — SOS-Challenge's card sentence on :8097, greedy vs pretty, at each phone's card width
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await p.goto('http://localhost:8097/f/Email-Login/SOS-Challenge.html');
await p.evaluate(() => document.fonts.ready);
for (const W of [375, 390, 393, 430]) {
  const r = await p.evaluate((W) => {
    const el = [...document.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim().startsWith('Send one message'));
    el.style.width = (W - 48 - 44) + 'px';
    const lines = (wrap) => { el.style.textWrap = wrap; const tn = el.firstChild; const rg = document.createRange(); const out = []; let cur = '', top = null; for (let k = 0; k < tn.length; k++) { rg.setStart(tn, k); rg.setEnd(tn, k + 1); const rc = rg.getClientRects()[0]; if (rc && top !== null && rc.top > top + 4) { out.push(cur.trim()); cur = ''; } if (rc && (top === null || rc.top > top + 4)) top = rc.top; cur += tn.data[k]; } out.push(cur.trim()); return out.join(' | '); };
    return { wrap: lines('wrap'), pretty: lines('pretty') };
  }, W);
  console.log(W, JSON.stringify(r));
}
await b.close();
