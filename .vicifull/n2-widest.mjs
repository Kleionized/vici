/**
 * What is the WIDEST a dynamic run could ever be, in the design's own metrics?
 *
 * Clone the frame's own node for that run, swap in each candidate string, and
 * measure at `width: max-content` — which is the width Yoga gives an absolute
 * node that states `left` and no `right`. If the widest candidate still fits
 * the space left inside the containing block, the box cannot overflow on
 * device and needs no opposing anchor.
 *
 *   node .vicifull/n2-widest.mjs <bundle> <Frame.html> "<text to find>" cand1 cand2 …
 */
import { chromium } from 'playwright-core';
const [bundle, frame, needle, ...cands] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await page.goto(`http://localhost:8097/f/${bundle}/${frame}`, { waitUntil: 'networkidle' });
const res = await page.evaluate(([needle, cands]) => {
  const el = [...document.querySelectorAll('*')].find(
    (e) => e.children.length === 0 && (e.textContent || '').trim() === needle,
  );
  if (!el) return { error: 'no node with that exact text' };
  let cb = el.parentElement;
  while (cb && getComputedStyle(cb).position === 'static') cb = cb.parentElement;
  const cbs = cb ? getComputedStyle(cb) : null;
  const inner = cb
    ? cb.getBoundingClientRect().width - (parseFloat(cbs.paddingLeft) || 0) - (parseFloat(cbs.paddingRight) || 0)
    : 393;
  const cs = getComputedStyle(el);
  const anchor = el.style.left ? parseFloat(cs.left) : parseFloat(cs.right);
  const out = [];
  for (const t of cands) {
    const c = el.cloneNode(true);
    c.textContent = t;
    c.style.position = 'absolute';
    c.style.left = '-9999px';
    c.style.right = 'auto';
    c.style.width = 'max-content';
    (cb || document.body).appendChild(c);
    out.push({ t, w: Math.round(c.getBoundingClientRect().width * 10) / 10 });
    c.remove();
  }
  return { avail: Math.round((inner - anchor) * 10) / 10, font: cs.fontSize + '/' + cs.fontWeight + '/' + cs.letterSpacing, out };
}, [needle, cands]);
if (res.error) { console.error(res.error); process.exit(1); }
console.log(`avail ${res.avail}   ${res.font}`);
for (const r of res.out.sort((a, b) => b.w - a.w)) console.log(`  ${String(r.w).padStart(7)}  ${r.w > res.avail ? 'OVERFLOWS  ' : '           '}${r.t}`);
await browser.close();
