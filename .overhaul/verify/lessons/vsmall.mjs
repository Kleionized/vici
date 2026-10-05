#!/usr/bin/env node
// Independent verifier sweep: /lesson/day/<n>?page=<k> vs the Week design PNG.
//   node vsweep.mjs --lessons=1,2,5 [--w --h] [--out=dir]
// At 393x852: per page mismatch share at t=24 and t=8, strip when t24 > 0.02%; app PNG saved at 1x for montage.
// Other sizes: app PNG saved at 1x, plus a geometry probe (text under the bottom control, text past the right edge).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const W = Number(flags.w ?? 393), H = Number(flags.h ?? 852), canvas = W === 393 && H === 852;
const OUT = String(flags.out ?? `.overhaul/verify/lessons/sweep-${W}x${H}`);
fs.mkdirSync(OUT + '/app', { recursive: true }); fs.mkdirSync(OUT + '/strips', { recursive: true });
const WEEKS = fs.readdirSync('.overhaul/final').filter((d) => /^Week-\d\d-/.test(d)).sort();
const lessons = new Map();
for (const wk of WEEKS) for (const f of JSON.parse(fs.readFileSync(`.overhaul/final/${wk}/_index.json`, 'utf8')).frames) {
  const m = /^L(\d+) Frame (\d+)$/.exec(f.label); if (!m) continue;
  const e = lessons.get(+m[1]) ?? { week: wk, pages: 0 }; e.pages = Math.max(e.pages, +m[2]); lessons.set(+m[1], e);
}
const pick = []; for (const p of String(flags.lessons).split(',')) { const [a, b] = p.split('-').map(Number); for (let i = a; i <= (b || a); i++) pick.push(i); }
const pagesFilter = flags.pages ? String(flags.pages).split(',').map(Number) : null;
const CH = [[0, 0, 393, 54], [120, 834, 153, 14]];
function cmp(D, A, t) {
  let bad = 0, cnt = 0, y0 = null, y1 = null;
  for (let y = 108; y < D.height; y++) for (let x = 0; x < D.width; x++) {
    if (y >= 1668 && y < 1696 && x >= 240 && x < 546) continue;
    const k = (D.width * y + x) << 2; cnt++;
    if (Math.max(Math.abs(D.data[k] - A.data[k]), Math.abs(D.data[k + 1] - A.data[k + 1]), Math.abs(D.data[k + 2] - A.data[k + 2])) > t) { bad++; if (y0 === null) y0 = y >> 1; y1 = y >> 1; }
  }
  return { share: +(100 * bad / cnt).toFixed(4), bad, y0, y1 };
}
function half(A) { const o = new PNG({ width: A.width >> 1, height: A.height >> 1 }); for (let y = 0; y < o.height; y++) for (let x = 0; x < o.width; x++) { const k = (o.width * y + x) << 2; for (let c = 0; c < 3; c++) { let s = 0; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) s += A.data[((A.width * (2 * y + dy) + 2 * x + dx) << 2) + c]; o.data[k + c] = s / 4; } o.data[k + 3] = 255; } return o; }
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const resPath = OUT + '/results.json';
const res = fs.existsSync(resPath) ? JSON.parse(fs.readFileSync(resPath, 'utf8')) : {};
for (const n of pick) {
  const L = lessons.get(n); if (!L) continue;
  for (let k = 1; k <= L.pages; k++) {
    if (pagesFilter && !pagesFilter.includes(k)) continue;
    const slug = `L${n}-F${k}`;
    const want = Math.round((k / L.pages) * 100);
    const railNow = () => page.evaluate(() => { const e = document.querySelector('[role="progressbar"]'); return e ? Number(e.getAttribute('aria-valuenow')) : null; }).catch(() => null);
    let via = 'tap';
    if (k === 1 || pagesFilter || flags.goto || (await railNow()) !== want) {
      via = 'goto';
      await page.goto(`http://localhost:8096/lesson/day/${n}?page=${k}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(Number(flags.wait ?? 900));
    } else await page.waitForTimeout(Number(flags.tapwait ?? 700));
    const rail = await railNow();
    const fontsOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('normal 700 16px Lato') && document.fonts.check('normal 400 16px Lato') && [...document.fonts].some((f) => /Lato/.test(f.family) && f.status === 'loaded'); });
    const info = await page.evaluate(() => {
      const t = document.body.innerText;
      const vh = innerHeight, vw = innerWidth;
      const ctl = [...document.querySelectorAll('[role="button"]')].map((e) => ({ l: e.getAttribute('aria-label') || e.textContent.trim(), r: e.getBoundingClientRect() })).filter((x) => x.r.top > vh * 0.7 && x.r.height < 80);
      const ctlTop = ctl.length ? Math.min(...ctl.map((x) => x.r.top)) : vh;
      const leaves = [...document.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()));
      const vis = (e) => { let n = e; while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') return false; n = n.parentElement; } return true; };
      const under = [], right = [];
      for (const e of leaves) { const r = e.getBoundingClientRect(); const s = e.textContent.trim().slice(0, 30); if (/^(Begin|Continue|Finish lesson|Done)$/.test(s) || !vis(e)) continue; if (r.bottom > ctlTop - 0.5 && r.top < vh) under.push(`${s}@${Math.round(r.top)}-${Math.round(r.bottom)}`); if (r.right > vw - 0.5 || r.left < -0.5) right.push(`${s}@x${Math.round(r.left)}-${Math.round(r.right)}`); }
      const red = /Unable to resolve|SyntaxError|TypeError|ReferenceError|Error:/.test(t.slice(0, 400));
      const sc = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100);
      return { head: t.replace(/\s+/g, ' ').slice(0, 60), ctlTop: Math.round(ctlTop), under: under.slice(0, 4), right: right.slice(0, 4), red, scroll: sc.length ? { sh: sc[0].scrollHeight, ch: sc[0].clientHeight } : null, path: location.pathname + location.search };
    });
    const buf = await page.screenshot();
    const A = PNG.sync.read(buf);
    fs.writeFileSync(`${OUT}/app/${slug}.png`, PNG.sync.write(half(A)));
    const row = { fontsOk, ...info };
    if (!canvas) {
      // scroll the band to its end and look again: the last row must clear the bottom control
      const end = await page.evaluate(async () => {
        const sc = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && el.getBoundingClientRect().height > 100);
        if (!sc.length) return null;
        sc[0].scrollTop = sc[0].scrollHeight; await new Promise((r) => setTimeout(r, 350));
        const vh = innerHeight;
        const ctl = [...document.querySelectorAll('[role="button"]')].map((e) => e.getBoundingClientRect()).filter((r) => r.top > vh * 0.7 && r.height < 80);
        const ctlTop = ctl.length ? Math.min(...ctl.map((r) => r.top)) : vh;
        const leaves = [...document.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && !/^(Begin|Continue|Finish lesson|Done)$/.test(e.textContent.trim()));
        const inScroll = leaves.filter((e) => sc[0].contains(e));
        const lastBottom = Math.max(...inScroll.map((e) => e.getBoundingClientRect().bottom), ...[...sc[0].querySelectorAll('[role="radio"],[role="checkbox"],input')].map((e) => e.getBoundingClientRect().bottom));
        return { ctlTop: Math.round(ctlTop), lastBottom: Math.round(lastBottom), clear: Math.round(ctlTop - lastBottom), scrollTop: sc[0].scrollTop };
      });
      row.end = end;
      if (end) fs.writeFileSync(`${OUT}/app/${slug}-end.png`, PNG.sync.write(half(PNG.sync.read(await page.screenshot()))));
      row.bad = end ? end.clear < 0 : row.under.length > 0;
      if (row.right.length) row.bad = true;
    }
    if (canvas) {
      const D = PNG.sync.read(fs.readFileSync(`.overhaul/shots/design/${L.week}/L${n}-Frame-${k}.png`));
      row.t24 = cmp(D, A, 24); row.t8 = cmp(D, A, 8);
      if (row.t24.share > 0.02) {
        const sw = 393, sh = 852, G = 8, st = new PNG({ width: sw * 2 + G, height: sh }); st.data.fill(255);
        const Dh = half(D), Ah = half(A);
        for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { for (const [src, ox] of [[Dh, 0], [Ah, sw + G]]) { const ks = (sw * y + x) << 2, kt = (st.width * y + ox + x) << 2; for (let c = 0; c < 4; c++) st.data[kt + c] = src.data[ks + c]; } }
        fs.writeFileSync(`${OUT}/strips/${slug}.png`, PNG.sync.write(st));
      }
    }
    row.via = via; row.rail = rail; row.want = want;
    res[slug] = row;
    // advance the way a reader does: the page's pill, else the 44 ring (the last control labelled Next)
    if (k < L.pages && !pagesFilter) {
      await page.evaluate(async () => {
        const btns = [...document.querySelectorAll('[role="button"]')];
        let el = btns.find((b) => /^(Begin|Continue|Finish lesson)$/.test(b.textContent.trim()));
        if (!el) { const nx = btns.filter((b) => b.getAttribute('aria-label') === 'Next'); el = nx[nx.length - 1]; }
        if (!el) return;
        for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, pointerId: 1, button: 0 }));
      }).catch(() => {});
    }
    process.stdout.write(`${slug} ${via} rail ${rail}/${want} ${canvas ? `t24 ${row.t24.share}% t8 ${row.t8.share}% y${row.t24.y0}-${row.t24.y1}` : `ctl ${row.ctlTop} under ${row.under.length} right ${row.right.length} end ${JSON.stringify(row.end)}${row.bad ? ' BAD' : ''}`}${fontsOk ? '' : ' FONTS!'}${row.red ? ' RED!' : ''}${row.path.includes(`/lesson/day/${n}`) ? '' : ' PATH ' + row.path}\n`);
    fs.writeFileSync(resPath, JSON.stringify(res, null, 1));
  }
}
await browser.close();
if (errs.length) console.log('page errors:', errs.length, errs.slice(0, 3));
