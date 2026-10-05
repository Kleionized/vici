#!/usr/bin/env node
/**
 * Pixel sweep of the lesson readers: every page of every lesson against its
 * design frame, in one browser.
 *
 *   node scripts/overhaul/lesson-sweep.mjs [--lessons=1-84 | --lessons=1,7,16] [--t=24] [--max=0.5]
 *        [--w=393 --h=852] [--port=8096] [--out=.overhaul/lesson-sweep]
 *
 * For lesson n, page k it opens `/lesson/day/<n>?page=<k>` (the reader's deep link), waits for fonts and
 * the page's fade-in, screenshots at 2x, and compares with
 * `.overhaul/shots/design/<Week bundle>/L<n>-Frame-<k>.png` using pxdiff's rule (a pixel differs when a
 * channel is more than --t apart; status bar and home indicator excluded). A page whose mismatch share is
 * above --max % is a FAIL and gets a design|app|diff strip in <out>/strips/. Writes <out>/report.json and
 * <out>/report.md (per lesson, per page), merging with an earlier report so weeks can be swept in pieces.
 *
 * At another size (--w/--h) there is no design frame to compare to; the sweep then only captures and
 * checks for content running under the bottom control or past the screen (reported, not pixel-diffed).
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const T = Number(flags.t ?? 24);
const MAX = Number(flags.max ?? 0.5);
const W = Number(flags.w ?? 393), H = Number(flags.h ?? 852);
const canvas = W === 393 && H === 852;
const OUT = String(flags.out ?? (canvas ? '.overhaul/lesson-sweep' : `.overhaul/lesson-sweep-${W}x${H}`));
const PORT = Number(flags.port ?? 8096);

const WEEKS = fs.readdirSync('.overhaul/final').filter((d) => /^Week-\d\d-/.test(d)).sort();
// lesson n → its week bundle and frame count, from the split indices
const lessons = new Map();
for (const wk of WEEKS) {
  const idx = JSON.parse(fs.readFileSync(`.overhaul/final/${wk}/_index.json`, 'utf8'));
  for (const f of idx.frames) {
    const m = /^L(\d+) Frame (\d+)$/.exec(f.label);
    if (!m) continue;
    const n = Number(m[1]), k = Number(m[2]);
    const e = lessons.get(n) ?? { n, week: wk, pages: 0 };
    e.pages = Math.max(e.pages, k);
    lessons.set(n, e);
  }
}
const pick = (() => {
  const s = String(flags.lessons ?? '1-84');
  const set = new Set();
  for (const part of s.split(',')) {
    const [a, b] = part.split('-').map(Number);
    for (let i = a; i <= (b || a); i++) set.add(i);
  }
  return [...set].filter((n) => lessons.has(n)).sort((x, y) => x - y);
})();

fs.mkdirSync(path.join(OUT, 'strips'), { recursive: true });
const reportPath = path.join(OUT, 'report.json');
const prev = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : {};

const CHROME = [[0, 0, 393, 54], [120, 834, 153, 14]];
function compare(dBuf, aBuf, slug) {
  const D = PNG.sync.read(dBuf), A = PNG.sync.read(aBuf);
  const w = Math.min(D.width, A.width), h = Math.min(D.height, A.height), dpr = Math.round(D.width / 393) || 1;
  const ign = CHROME.map((r) => r.map((v) => v * dpr));
  const diff = new PNG({ width: w, height: h });
  let bad = 0, counted = 0;
  const rows = new Uint32Array(Math.ceil(h / dpr));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const kd = (D.width * y + x) << 2, ka = (A.width * y + x) << 2, k = (w * y + x) << 2;
    const m = Math.max(Math.abs(D.data[kd] - A.data[ka]), Math.abs(D.data[kd + 1] - A.data[ka + 1]), Math.abs(D.data[kd + 2] - A.data[ka + 2]));
    const skip = ign.some(([ix, iy, iw, ih]) => x >= ix && x < ix + iw && y >= iy && y < iy + ih);
    const lum = 200 + Math.round((0.3 * D.data[kd] + 0.59 * D.data[kd + 1] + 0.11 * D.data[kd + 2]) * 0.2);
    if (!skip) { counted++; if (m > T) { bad++; rows[Math.floor(y / dpr)]++; } }
    const red = !skip && m > T;
    diff.data[k] = red ? 230 : lum; diff.data[k + 1] = red ? 20 : lum; diff.data[k + 2] = red ? 20 : lum; diff.data[k + 3] = 255;
  }
  const share = counted ? (100 * bad) / counted : 0;
  // vertical bands of mismatch (frame y), for the report
  const bands = [];
  let start = -1;
  for (let y = 0; y <= rows.length; y++) {
    const on = y < rows.length && rows[y] > 2 * dpr;
    if (on && start < 0) start = y;
    if (!on && start >= 0) { bands.push([start, y]); start = -1; }
  }
  if (share > MAX) {
    const sw = Math.floor(w / dpr), sh = Math.floor(h / dpr), GAP = 8;
    const strip = new PNG({ width: sw * 3 + GAP * 2, height: sh });
    strip.data.fill(255);
    const blit = (src, srcW, ox) => { for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const ks = (srcW * (y * dpr) + x * dpr) << 2, kt = (strip.width * y + ox + x) << 2; strip.data[kt] = src.data[ks]; strip.data[kt + 1] = src.data[ks + 1]; strip.data[kt + 2] = src.data[ks + 2]; strip.data[kt + 3] = 255; } };
    blit(D, D.width, 0); blit(A, A.width, sw + GAP); blit(diff, w, (sw + GAP) * 2);
    fs.writeFileSync(path.join(OUT, 'strips', `${slug}.strip.png`), PNG.sync.write(strip));
  }
  return { share: Number(share.toFixed(3)), bands };
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
// Expo's dev fast-refresh badge (`.__expo_fast_refresh`, a bolt at 8,802) appears in any
// capture taken while another agent's save rebuilds the bundle. It is not app UI;
// hide exactly that class rather than masking the corner the Today tab lives in.
await ctx.addInitScript(() => {
  const css = '.__expo_fast_refresh{display:none!important}';
  const add = () => { const s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
});
// The (app) layout's launch prompts (check-in, letter, post, weekly report) can
// push over a deep-linked lesson; mark them already handled for this context.
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now() + 864e5));
    localStorage.removeItem('tideline.letter.pending');
    localStorage.removeItem('tideline.post.backondeck.pending');
  } catch {}
});
await ctx.addInitScript({ path: '.overhaul/drive.js' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const results = { ...prev };
let fails = 0, pagesDone = 0;
for (const n of pick) {
  const L = lessons.get(n);
  const rows = [];
  /* One load per lesson: page 1 by its deep link, then each next page by
     tapping the page's own bottom control (the ring, or Begin / Continue /
     Finish lesson) — the way a reader moves, and 15× fewer bundle loads than a
     `goto` per page. The rail tells whether the tap landed: the fill must be
     round(k/N·100) % of the track. A page that did not land is opened by its
     deep link instead, so a broken control shows up as a note, not as a
     cascade of shifted captures. */
  const open = async (k) => {
    await page.goto(`http://localhost:${PORT}/lesson/day/${n}?page=${k}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(Number(flags.wait ?? 700));
    if (!new URL(page.url()).pathname.startsWith(`/lesson/day/${n}`)) {
      process.stderr.write(`  (pushed to ${page.url()} — re-opening)\n`);
      await page.goto(`http://localhost:${PORT}/lesson/day/${n}?page=${k}`, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
      await page.waitForTimeout(Number(flags.wait ?? 700));
    }
  };
  const railPct = () => page.evaluate(() => {
    const tracks = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(); return Math.abs(r.height - 3) < 0.6 && r.width > 300 && d.firstElementChild; });
    for (const t of tracks) { const f = t.firstElementChild.getBoundingClientRect(); const tr = t.getBoundingClientRect(); if (Math.abs(f.height - 3) < 0.6) return Math.round((f.width / tr.width) * 100); }
    return null;
  });
  const advance = () => page.evaluate(() => {
    const vh = window.innerHeight;
    const btns = [...document.querySelectorAll('[role="button"]')].filter((b) => b.getBoundingClientRect().top > vh * 0.75);
    const pill = btns.find((b) => /^(Begin|Continue|Finish lesson)$/.test(b.textContent.trim()));
    const ring = btns.find((b) => b.getAttribute('aria-label') === 'Next' && b.getBoundingClientRect().width < 80);
    const el = pill ?? ring;
    if (!el) return false;
    window.__fire(el);
    return true;
  });
  const notes = [];
  for (let k = 1; k <= L.pages; k++) {
    if (k === 1) await open(1);
    else {
      const ok = await advance();
      await page.waitForTimeout(Number(flags.step ?? 650));
      const want = Math.round((k / L.pages) * 100);
      const got = await railPct();
      if (!ok || got !== want) { notes.push(`F${k}: tap from F${k - 1} did not advance (rail ${got}% ≠ ${want}%) — opened by link`); await open(k); }
    }
    const buf = await page.screenshot();
    const slug = `L${n}-Frame-${k}`;
    if (canvas) {
      const dPath = `.overhaul/shots/design/${L.week}/${slug}.png`;
      const r = compare(fs.readFileSync(dPath), buf, slug);
      if (r.share > MAX) fails++;
      rows.push({ k, ...r, status: r.share > MAX ? 'FAIL' : 'ok' });
      process.stderr.write(`L${n} F${k}: ${r.share}%${r.share > MAX ? '  FAIL' : ''}\n`);
    } else {
      // other sizes: find content that runs under the bottom control or off-screen
      const info = await page.evaluate(() => {
        const vh = window.innerHeight;
        const ctl = [...document.querySelectorAll('[aria-label="Next"],[role="button"]')].map((e) => e.getBoundingClientRect()).filter((r) => r.top > vh * 0.75);
        const ctlTop = ctl.length ? Math.min(...ctl.map((r) => r.top)) : vh;
        const texts = [...document.querySelectorAll('div,span')].filter((e) => e.childNodes.length && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()));
        const under = texts.map((e) => ({ t: e.textContent.trim().slice(0, 40), r: e.getBoundingClientRect() })).filter((x) => x.r.bottom > ctlTop + 1 && x.r.top < vh && !/^(Next|Begin|Continue|Finish lesson|Done)$/.test(x.t));
        return { ctlTop, under: under.slice(0, 5).map((x) => `${x.t} @${Math.round(x.r.top)}-${Math.round(x.r.bottom)}`) };
      });
      fs.writeFileSync(path.join(OUT, 'strips', `${slug}.png`), buf);
      rows.push({ k, under: info.under, status: info.under.length ? 'CHECK' : 'ok' });
      if (info.under.length) fails++;
    }
    pagesDone++;
  }
  results[n] = { week: L.week, pages: L.pages, rows, notes };
  if (notes.length) process.stderr.write(`L${n} notes: ${notes.join(' · ')}\n`);
}
await browser.close();
fs.writeFileSync(reportPath, JSON.stringify(results, null, 1));
const md = ['| Lesson | Week | pages | worst % | failing pages |', '|---|---|---|---|---|'];
for (const n of Object.keys(results).map(Number).sort((a, b) => a - b)) {
  const r = results[n];
  const worst = Math.max(0, ...r.rows.map((x) => x.share ?? 0));
  const bad = r.rows.filter((x) => x.status !== 'ok').map((x) => `F${x.k}${x.share != null ? ` ${x.share}%` : ''}`);
  md.push(`| L${n} | ${r.week} | ${r.pages} | ${worst.toFixed(2)} | ${bad.join(', ')} |`);
}
fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n') + '\n');
console.log(`${pagesDone} pages over ${pick.length} lessons — ${fails} ${canvas ? `over ${MAX}%` : 'with content under the control'}${errors.length ? `; ${errors.length} page errors (first: ${errors[0]})` : ''} -> ${OUT}/report.md`);
