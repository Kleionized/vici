// Walk the funnel once at a device size, screenshot each board (and its scrolled end),
// and measure overlap/overflow. node sizes.mjs --w=375 --h=667
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const flags = Object.fromEntries(process.argv.slice(2).map((a) => { const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)]; }));
const W = Number(flags.w ?? 393), H = Number(flags.h ?? 852);
const OUT = `.overhaul/verify/auth-funnel/sz-${W}x${H}`;
fs.mkdirSync(OUT, { recursive: true });
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await ctx.addInitScript(fs.readFileSync('.overhaul/f-funnel-user.js', 'utf8'));
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
await page.goto('http://localhost:8096/welcome', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await page.evaluate(DRIVE);
await page.waitForTimeout(1800);
const ev = (js) => page.evaluate(`(async () => { ${js} })()`);
const measure = () => page.evaluate(() => {
  const vw = innerWidth, vh = innerHeight;
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.01; };
  const prim = [...document.querySelectorAll('[role="button"]')].filter((b) => { const r = b.getBoundingClientRect(); return r.height === 58 && r.bottom > vh - 120 && vis(b); });
  const primTop = prim.length ? Math.min(...prim.map((b) => b.getBoundingClientRect().top)) : null;
  // text leaves visible on screen
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = tw.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) { if (r.width < 1) continue; texts.push({ t: t.slice(0, 40), l: Math.round(r.left), r: Math.round(r.right), top: Math.round(r.top), b: Math.round(r.bottom) }); } }
  const overflowX = texts.filter((x) => x.r > vw + 0.5 || x.l < -0.5);
  // text whose box is inside the primary's band but is not the primary's own label
  const primLabels = new Set(prim.map((b) => b.textContent.trim()));
  const under = primTop == null ? [] : texts.filter((x) => x.b > primTop + 1 && x.top < vh && !primLabels.has(x.t));
  // scroller
  const sc = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100);
  const svgs = [...document.querySelectorAll('svg')].filter((s) => s.getBoundingClientRect().width > 300).map((s) => { const r = s.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), top: Math.round(r.top), b: Math.round(r.bottom), vis: getComputedStyle(s).display !== 'none' }; });
  return { primTop, overflowX, under, scroll: sc.map((el) => ({ sh: el.scrollHeight, ch: el.clientHeight })), svgs, docW: document.documentElement.scrollWidth };
});
const scrollEnd = () => page.evaluate(() => { const sc = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100); for (const el of sc) el.scrollTop = el.scrollHeight; return sc.length; });
const t = (l) => ev(`await tap(${JSON.stringify(l)}, { wait: 600 });`);
const noTurn = () => ev(`window.__st = window.__st || window.setTimeout; window.setTimeout = (fn, ms) => (ms === 260 ? 0 : window.__st(fn, ms));`);
const turn = () => ev(`if (window.__st) window.setTimeout = window.__st;`);
let k = 0;
async function snap(name) {
  k++;
  const tag = String(k).padStart(2, '0') + '-' + name;
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${tag}.png` });
  const m = await measure();
  let line = `${tag}: primTop=${m.primTop} docW=${m.docW} scroll=${JSON.stringify(m.scroll)} heroes=${JSON.stringify(m.svgs)}`;
  if (m.overflowX.length) line += `\n   OVERFLOW-X ${JSON.stringify(m.overflowX)}`;
  if (m.under.length) line += `\n   UNDER-PRIMARY ${JSON.stringify(m.under.slice(0, 6))}`;
  console.log(line);
  if (m.scroll.length) {
    await scrollEnd();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${tag}-end.png` });
    const m2 = await measure();
    if (m2.under.length) console.log(`   END UNDER-PRIMARY ${JSON.stringify(m2.under.slice(0, 6))}`);
  }
}
const single = async (name, pick) => { await snap(name); await ev(`await tap(${JSON.stringify(pick)}, { wait: 1000 });`); };
try {
  await snap('name');
  await ev(`await typeIn(0, 'Sam');`); await t('Continue');
  await snap('age'); await t('Continue');
  await single('gender', 'Male');
  await snap('start'); await t('Start');
  await single('q1', 'A few times a week');
  await single('q2', '1–3 years');
  await single('q3', 'Yes, several times');
  await single('q3b', 'A few days');
  await snap('fp'); await t('Continue');
  for (const l of ['Late at night', 'When I can’t sleep', 'When I’m home alone', 'While scrolling']) await t(l);
  await snap('q5'); await t('Continue');
  for (const l of ['Bored', 'Lonely', 'Tired']) await t(l);
  await snap('q6'); await t('Continue');
  await t('In bed'); await snap('q7'); await t('Continue');
  await t('I start scrolling'); await t('I can’t sleep'); await snap('wsi'); await t('Continue');
  await snap('transition'); await t('Continue');
  await single('q21', 'Quite a bit');
  for (const l of ['Focus', 'Sleep', 'Confidence']) await t(l);
  await snap('wia'); await t('Continue');
  await single('q10', 'Sometimes');
  await single('q13', 'A few days a week');
  await single('q15', 'Stop completely');
  await single('q16', 'Keep it, just without porn');
  await t('Blocking sites or apps'); await t('Going cold turkey'); await snap('q17'); await t('Continue');
  await snap('gc');
} catch (e) { console.log('WALK ERROR ' + e.message.slice(0, 300)); await page.screenshot({ path: `${OUT}/zz-error.png` }); }
await browser.close();
