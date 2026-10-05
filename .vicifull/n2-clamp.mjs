#!/usr/bin/env node
/**
 * For one design frame: every absolutely-positioned element that has a
 * horizontal anchor (left OR right) and NO opposing anchor and NO width — the
 * exact shape absscan.mjs flags in the app — reported with
 *
 *   rendered  the width the browser gave it (shrink-to-fit)
 *   maxc      its max-content width (what Yoga would give it)
 *   avail     the space left inside its containing block from its own anchor
 *
 * rendered == avail && maxc > rendered  ->  CLAMPED: the app needs the
 *   opposing anchor, or it lays out at `maxc` on device and overflows.
 * rendered == maxc                      ->  content-width in the design too;
 *   Yoga lands on the same box. Leave it.
 *
 *   node .vicifull/n2-clamp.mjs <bundle> <Frame.html>
 */
import { chromium } from 'playwright-core';

const [bundle, frame] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(`http://localhost:8097/f/${bundle}/${frame}`, { waitUntil: 'networkidle' });

const rows = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'absolute') continue;
    /* getComputedStyle resolves `left`/`right` to USED values on a positioned
       box, so both always read as px. The declaration is what matters here, and
       these frames state everything inline. */
    const st = el.style;
    const hasL = !!st.left, hasR = !!st.right;
    if (!hasL && !hasR) continue;
    if (hasL && hasR) continue;
    if (st.width || st.inset || st.minWidth || st.maxWidth) continue;
    if (el.hasAttribute('width')) continue;
    const text = (el.textContent || '').trim();
    const rect = el.getBoundingClientRect();
    // containing block: nearest positioned ancestor (or the frame root)
    let cb = el.parentElement;
    while (cb && getComputedStyle(cb).position === 'static') cb = cb.parentElement;
    const cbr = cb ? cb.getBoundingClientRect() : { left: 0, right: 393, width: 393 };
    const cbs = cb ? getComputedStyle(cb) : null;
    const padL = cbs ? parseFloat(cbs.paddingLeft) || 0 : 0;
    const padR = cbs ? parseFloat(cbs.paddingRight) || 0 : 0;
    const bL = cbs ? parseFloat(cbs.borderLeftWidth) || 0 : 0;
    const bR = cbs ? parseFloat(cbs.borderRightWidth) || 0 : 0;
    const inner = cbr.width - padL - padR - bL - bR;
    const anchor = hasL ? parseFloat(cs.left) : parseFloat(cs.right);
    const avail = inner - anchor;
    // max-content width, measured on a clone off-screen in the same styles
    const clone = el.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.right = 'auto';
    clone.style.width = 'max-content';
    clone.style.maxWidth = 'none';
    (cb || document.body).appendChild(clone);
    const maxc = clone.getBoundingClientRect().width;
    clone.remove();
    out.push({
      tag: el.tagName.toLowerCase(),
      side: hasL ? 'left' : 'right',
      anchor: Math.round(anchor * 10) / 10,
      top: Math.round(rect.top * 10) / 10,
      rendered: Math.round(rect.width * 10) / 10,
      maxc: Math.round(maxc * 10) / 10,
      avail: Math.round(avail * 10) / 10,
      text: text.slice(0, 46).replace(/\s+/g, ' '),
    });
  }
  return out;
});

for (const r of rows) {
  const clamped = r.maxc > r.rendered + 0.5;
  const flag = clamped ? (Math.abs(r.rendered - r.avail) < 1 ? 'CLAMPED' : 'wrapped') : 'content ';
  console.log(
    `${flag}  ${r.tag.padEnd(4)} ${r.side}:${String(r.anchor).padStart(5)} top:${String(r.top).padStart(6)}` +
    `  rendered ${String(r.rendered).padStart(6)}  maxc ${String(r.maxc).padStart(7)}  avail ${String(r.avail).padStart(6)}  ${r.text ? '· ' + r.text : ''}`,
  );
}
await browser.close();
