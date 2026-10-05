#!/usr/bin/env node
/**
 * Lessons, Phase 2: every reader page at one phone size, checked for the band's own rules (D313).
 *
 *   node .overhaul/scratch/lessons-scrollcheck.mjs --w=375 --h=667 [--lessons=1-84] [--out=<dir>] [--shots]
 *
 * Per page: the band's mode (scroll = its scroller overflows), and
 *   - scroll pages: at scroll 0 the stack starts at the band top; scrolled to the end, the last painted row
 *     (text, card, input, option row) clears the fade (winH − 150) and the bottom control; an end PNG is
 *     written for every scroll page (and a start PNG with --shots)
 *   - other pages: nothing clipped by the band (scrollHeight ≤ clientHeight), nothing under the control
 *   - every page: no text or card past the window's left/right edge (svg art exempt — full-bleed by design)
 * Writes <out>/report.json and prints the faults.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const W = Number(flags.w ?? 375), H = Number(flags.h ?? 667);
const OUT = String(flags.out ?? `/private/tmp/claude-501/-Users-admin-Documents-Vici/78405a53-1221-424d-91e7-3f6311738516/scratchpad/scroll-${W}x${H}`);
fs.mkdirSync(OUT, { recursive: true });

const WEEKS = fs.readdirSync('.overhaul/final').filter((d) => /^Week-\d\d-/.test(d)).sort();
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
  const set = new Set();
  for (const part of String(flags.lessons ?? '1-84').split(',')) { const [a, b] = part.split('-').map(Number); for (let i = a; i <= (b || a); i++) set.add(i); }
  return [...set].filter((n) => lessons.has(n)).sort((x, y) => x - y);
})();

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => {
  const css = '.__expo_fast_refresh{display:none!important}';
  const add = () => { const s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  try { localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now() + 864e5)); localStorage.removeItem('tideline.letter.pending'); localStorage.removeItem('tideline.post.backondeck.pending'); } catch {}
});
await ctx.addInitScript({ path: '.overhaul/drive.js' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

const open = async (n, k) => {
  await page.goto(`http://localhost:8096/lesson/day/${n}?page=${k}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(800);
};
const railPct = () => page.evaluate(() => {
  for (const t of [...document.querySelectorAll('[role="progressbar"]')]) { const f = t.firstElementChild?.getBoundingClientRect(); const tr = t.getBoundingClientRect(); if (f) return Math.round((f.width / tr.width) * 100); }
  return null;
});
const advance = () => page.evaluate(() => {
  const vh = window.innerHeight;
  const btns = [...document.querySelectorAll('[role="button"]')].filter((b) => b.getBoundingClientRect().top > vh * 0.6);
  const el = btns.find((b) => /^(Begin|Continue|Finish lesson)$/.test(b.textContent.trim())) ?? btns.find((b) => b.getAttribute('aria-label') === 'Next' && b.getBoundingClientRect().width < 80);
  if (!el) return false;
  window.__fire(el);
  return true;
});

/** the band's scroller and what is painted in it */
const probe = (phase) => page.evaluate((phase) => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const sc = [...document.querySelectorAll('div')].find((d) => { const cs = getComputedStyle(d); return /(auto|scroll|hidden)/.test(cs.overflowY) && d.getBoundingClientRect().height > 200 && d.querySelector('[dir], div') && d.getBoundingClientRect().top > 60 && d.getBoundingClientRect().top < 160; });
  if (!sc) return { err: 'no band scroller' };
  if (phase === 'end') { sc.scrollTop = sc.scrollHeight; sc.dispatchEvent(new Event('scroll', { bubbles: true })); }
  const scR = sc.getBoundingClientRect();
  const ctl = [...document.querySelectorAll('[role="button"]')].filter((b) => { const r = b.getBoundingClientRect(); return r.top > vh * 0.6 && r.height < 80 && !sc.contains(b); }).map((b) => b.getBoundingClientRect());
  const ctlTop = ctl.length ? Math.min(...ctl.map((r) => r.top)) : vh;
  const painted = [];
  for (const el of sc.querySelectorAll('*')) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el);
    const text = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
    const bg = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    const isSvg = el.tagName.toLowerCase() === 'svg';
    const input = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    if (text || bg || input || isSvg) painted.push({ t: (el.textContent || el.tagName).trim().slice(0, 40), top: r.top, bottom: r.bottom, left: r.left, right: r.right, svg: isSvg, text });
  }
  const content = painted.filter((p) => !p.svg);
  const bottom = Math.max(...painted.map((p) => p.bottom));
  // an svg box may reach a few px past the art it paints (the hero's viewport); the stack's top is its first non-svg row or its art
  const top = Math.min(...content.map((p) => p.top), ...painted.filter((p) => p.svg).map((p) => p.top + 4));
  const lastText = content.filter((p) => p.text).sort((a, b) => b.bottom - a.bottom)[0];
  const overX = content.filter((p) => p.right > vw + 0.5 || p.left < -0.5).map((p) => `${p.t} [${Math.round(p.left)}..${Math.round(p.right)}]`);
  return {
    scrollH: sc.scrollHeight, clientH: sc.clientHeight, overflowY: getComputedStyle(sc).overflowY, scrollTop: sc.scrollTop,
    bandTop: scR.top, bandBottom: scR.bottom, ctlTop, fadeTop: vh - 150, top, bottom, lastText: lastText ? `${lastText.t} @${Math.round(lastText.top)}-${Math.round(lastText.bottom)}` : null,
    lastTextBottom: lastText ? lastText.bottom : null, overX,
  };
}, phase);

const rows = [];
const faults = [];
for (const n of pick) {
  const L = lessons.get(n);
  for (let k = 1; k <= L.pages; k++) {
    if (k === 1) await open(n, 1);
    else {
      const ok = await advance();
      await page.waitForTimeout(Number(flags.step ?? 700));
      const want = Math.round((k / L.pages) * 100), got = await railPct();
      if (!ok || got !== want) await open(n, k);
    }
    const a = await probe('start');
    const slug = `L${n}-F${k}`;
    if (a.err) { process.stderr.write(`${slug} ERR ${a.err}\n`); faults.push(`${slug}: ${a.err}`); rows.push({ slug, err: a.err }); continue; }
    const scroll = a.scrollH > a.clientH + 1 && a.overflowY !== 'hidden';
    const row = { slug, mode: scroll ? 'scroll' : 'fit', start: a };
    if (a.overX.length) faults.push(`${slug}: overflowX ${a.overX.join('; ')}`);
    if (scroll) {
      if (Math.abs(a.top - a.bandTop) > 1.5) faults.push(`${slug}: scroll page does not start at the band top (${a.top.toFixed(1)} vs ${a.bandTop.toFixed(1)})`);
      if (flags.shots) fs.writeFileSync(path.join(OUT, `${slug}.png`), await page.screenshot());
      const e = await probe('end');
      await page.waitForTimeout(250);
      fs.writeFileSync(path.join(OUT, `${slug}.end.png`), await page.screenshot());
      row.end = e;
      if (e.bottom > e.fadeTop + 1) faults.push(`${slug}: at the end the last row ends ${e.bottom.toFixed(1)} > fade top ${e.fadeTop}`);
      if (e.bottom > e.ctlTop) faults.push(`${slug}: at the end the last row ends under the control (${e.bottom.toFixed(1)} > ${e.ctlTop.toFixed(1)})`);
    } else {
      if (a.scrollH > a.clientH + 1) faults.push(`${slug}: band clips its stack (${a.scrollH} > ${a.clientH})`);
      if (a.bottom > a.ctlTop + 0.5) faults.push(`${slug}: fit page runs under the control (${a.bottom.toFixed(1)} > ${a.ctlTop.toFixed(1)}; ${a.lastText})`);
      if (a.top < a.bandTop - 0.5) faults.push(`${slug}: fit page starts above the band (${a.top.toFixed(1)})`);
    }
    rows.push(row);
    process.stderr.write(`${slug} ${row.mode}${scroll ? ` end ${row.end.bottom.toFixed(0)}/${row.end.fadeTop}` : ''}\n`);
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ W, H, rows, faults, errors }, null, 1));
console.log(`${rows.length} pages at ${W}x${H}: ${rows.filter((r) => r.mode === 'scroll').length} scroll, ${faults.length} faults${errors.length ? `, ${errors.length} page errors (first: ${errors[0]})` : ''}`);
for (const f of faults) console.log('  ' + f);
