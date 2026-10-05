/* GROUP tail — which fixed runs break differently under the frame's text-wrap (balance/pretty) than greedily, at 345 (D332). node .overhaul/f-tail-breaks.mjs */
import { chromium } from 'playwright-core';
const runs = [
  // [text, size, weight, lh, ls, width, wrap]
  ['You don’t need to change everything at once. Start with this.', 15, 400, 24, 0, 345, 'pretty'],
  ['Keep your phone out of bed tonight.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Pick the hour you stop tonight.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Leave the room instead of lying there.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Keep one door open tonight.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Charge it away from the bed.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Can’t sleep? Get out of bed before you start scrolling.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Set the hour before you need it.', 26, 700, 33, -0.6, 345, 'balance'],
  ['When it comes round, put the phone down and go to bed.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Decide now where you will go.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Twenty minutes awake and you get up, without the phone.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Pick the room you will not close.', 26, 700, 33, -0.6, 345, 'balance'],
  ['When the house empties, the door stays open.', 26, 700, 33, -0.6, 345, 'balance'],
  ['Tonight, before you lie down.', 15, 400, 24, 0, 345, 'pretty'],
  ['One change tonight. Build from there.', 15, 400, 24, 0, 345, 'pretty'],
  ['Tonight, while it is still early.', 15, 400, 24, 0, 345, 'pretty'],
  ['Tonight, before the house goes quiet.', 15, 400, 24, 0, 345, 'pretty'],
  ['This is where you start. What you do from here matters more than the questionnaire.', 15, 400, 24, 0, 345, 'pretty'],
  ['If the rate you reported stayed the same, about 9 of the next 30 days could end with porn.', 15, 400, 24, 0, 345, 'pretty'],
  ['The line keeps climbing. Relapses get more frequent, not less.', 15, 400, 24, 0, 345, 'pretty'],
  ['You only have to make the next decision different. Then the next one. Then come back tomorrow.', 15, 400, 24, 0, 345, 'pretty'],
  ['It doesn’t erase the work before it. Your lessons, logs, rating history and medallions stay.', 15, 400, 24, 0, 345, 'pretty'],
  ['What matters is that you come back.', 16, 400, 25, 0, 345, 'pretty'],
  ['This is what you’re doing it for.', 26, 700, 33, -0.6, 345, 'balance'],
  ['More of your time and attention going where you actually want them.', 16, 400, 25, 0, 345, 'pretty'],
  ['Not a perfect streak for its own sake.', 15, 400, 24, 0, 345, 'pretty'],
  ['Putting your plan together…', 26, 700, 33, -0.6, 345, 'balance'],
  ['From you, twelve weeks from now.', 15, 400, 24, 0, 345, 'pretty'],
  ['That’s all today has to be.', 15, 400, 24, 0, 345, 'pretty'],
  ['Where you’re predicted to relapse.', 15, 400, 24, 0, 345, 'pretty'],
  ['These came up together in your answers.', 15, 400, 24, 0, 345, 'pretty'],
  ['The vow.', 40, 700, 46, -0.6, 345, 'balance'],
];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.goto('http://localhost:8097/f/Email-Login/Your-Plan.html', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const res = await page.evaluate((runs) => {
  const lines = (el) => {
    const t = el.firstChild; const r = document.createRange(); const out = []; let cur = ''; let lastTop = null;
    for (let i = 0; i < t.length; i++) { r.setStart(t, i); r.setEnd(t, i + 1); const rc = r.getClientRects()[0]; if (!rc) { cur += t.data[i]; continue; } if (lastTop !== null && rc.top > lastTop + 5) { out.push(cur); cur = ''; } lastTop = rc.top; cur += t.data[i]; }
    out.push(cur); return out.map((s) => s.trim());
  };
  return runs.map(([text, size, w, lh, ls, width, wrap]) => {
    const mk = (mode) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:0;top:0;width:${width}px;font-family:Lato;font-size:${size}px;font-weight:${w};line-height:${lh}px;letter-spacing:${ls}px;text-wrap:${mode};text-align:center`; d.textContent = text; document.body.appendChild(d); const l = lines(d); d.remove(); return l; };
    const a = mk(wrap), b = mk('wrap');
    return { text, frame: a, greedy: b, differs: JSON.stringify(a) !== JSON.stringify(b) };
  });
}, runs);
for (const r of res) if (r.differs) console.log('DIFF', JSON.stringify(r.frame), ' greedy:', JSON.stringify(r.greedy));
console.log(res.filter((r) => !r.differs).length, 'same of', res.length);
await browser.close();
