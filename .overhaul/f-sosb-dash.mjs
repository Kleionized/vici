// node .overhaul/f-sosb-dash.mjs — where the protocol lines break with a plain space vs a no-break space before "—"
// (15/24 Lato 400, pretty, column = width − 48), on :8097 where Lato is served.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const src = fs.readFileSync('src/content/roughDays.ts', 'utf8');
const runs = [...src.matchAll(/(?:s|act): '([^']*\\u00A0[^']*)'/g)].map((m) => m[1].replace(/\\u00A0/g, ' '));
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: 430, height: 400 } })).newPage();
await p.goto('http://localhost:8097/f/Email-Login/SOS-Challenge.html');
await p.evaluate(() => document.fonts.ready);
for (const W of [375, 390, 393, 430]) for (const t of runs) {
  const r = await p.evaluate(([W, t]) => {
    const d = document.createElement('div'); d.style.cssText = `position:absolute;left:0;top:0;width:${W - 48}px;font:400 15px/24px Lato;text-wrap:pretty;text-align:center`; document.body.appendChild(d);
    const lines = (s) => { d.textContent = s; const tn = d.firstChild; const rg = document.createRange(); const out = []; let cur = '', top = null; for (let k = 0; k < tn.length; k++) { rg.setStart(tn, k); rg.setEnd(tn, k + 1); const rc = rg.getClientRects()[0]; if (rc && top !== null && rc.top > top + 4) { out.push(cur.trim()); cur = ''; } if (rc && (top === null || rc.top > top + 4)) top = rc.top; cur += tn.data[k]; } out.push(cur.trim()); return out; };
    const plain = lines(t.replace(/ /g, ' ')); d.remove();
    return plain.some((l, i) => i > 0 && l.startsWith('—')) ? plain.join(' ⏎ ') : null;
  }, [W, t]);
  if (r) console.log(W, r);
}
await b.close();
