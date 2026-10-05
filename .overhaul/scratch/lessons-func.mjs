#!/usr/bin/env node
// Lessons Phase 2 — the reader's controls on a short phone, and the back paths into and out of it (D340).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const OUT = '/private/tmp/claude-501/-Users-admin-Documents-Vici/78405a53-1221-424d-91e7-3f6311738516/scratchpad/func';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const log = (...a) => console.log(...a);

async function ctxAt(w, h, seed) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  });
  if (seed) await ctx.addInitScript(`try { ${fs.readFileSync(seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '')} } catch (e) { console.error(e.message) }`);
  await ctx.addInitScript(() => { try { localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now() + 864e5)); } catch {} });
  await ctx.addInitScript({ path: '.overhaul/drive.js' });
  return ctx;
}
const go = async (page, route, wait = 1200) => {
  await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(wait);
};
const rail = (page) => page.evaluate(() => { const t = document.querySelector('[role="progressbar"]'); if (!t) return null; return Math.round((t.firstElementChild.getBoundingClientRect().width / t.getBoundingClientRect().width) * 100); });
const path = (page) => new URL(page.url()).pathname + new URL(page.url()).search;
const band = (page) => page.evaluate(() => [...document.querySelectorAll('div')].find((d) => /(auto|scroll|hidden)/.test(getComputedStyle(d).overflowY) && d.getBoundingClientRect().height > 200 && d.getBoundingClientRect().top > 60 && d.getBoundingClientRect().top < 160) ? true : false);

// 1 — 375×667: a reading page in scroll mode turns on a tap in the band; a drag-free scroll keeps the page
{
  const ctx = await ctxAt(375, 667);
  const page = await ctx.newPage();
  await go(page, '/lesson/day/1?page=5');
  log('1a L1 F5 rail', await rail(page));
  await page.evaluate(async () => {
    const sc = [...document.querySelectorAll('div')].find((d) => /(auto|scroll)/.test(getComputedStyle(d).overflowY) && d.scrollHeight > d.clientHeight + 1);
    sc.scrollTop = sc.scrollHeight; sc.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await page.waitForTimeout(400);
  log('1b after scrolling, still F5:', await rail(page));
  await page.mouse.click(187, 300);
  await page.waitForTimeout(700);
  log('1c tap in the band →', await rail(page), '(want 43)');
  // 2 — the question at 375 (scroll): the last option sits under the fade at scroll 0; scrolled, it takes the tap
  await go(page, '/lesson/day/7?page=11');
  await page.evaluate(async () => {
    const sc = [...document.querySelectorAll('div')].find((d) => /(auto|scroll)/.test(getComputedStyle(d).overflowY) && d.scrollHeight > d.clientHeight + 1);
    sc.scrollTop = sc.scrollHeight; sc.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await page.waitForTimeout(400);
  const box = await page.evaluate(() => { const el = [...document.querySelectorAll('[role="radio"]')].pop(); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: el.getAttribute('aria-label') }; });
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(400);
  log('2a tapped', box.label, '→ checked', await page.evaluate(() => [...document.querySelectorAll('[role="radio"]')].filter((e) => e.getAttribute('aria-checked') === 'true').map((e) => e.getAttribute('aria-label'))));
  fs.writeFileSync(`${OUT}/L7-F11-375-chosen.png`, await page.screenshot());
  const pill = await page.evaluate(() => { const b = [...document.querySelectorAll('[role="button"]')].find((e) => e.textContent.trim() === 'Continue'); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.click(pill.x, pill.y);
  await page.waitForTimeout(700);
  log('2b Continue →', await rail(page), '(want 75)');
  fs.writeFileSync(`${OUT}/L7-F12-375.png`, await page.screenshot());
  // 3 — the reflect page at 375: type a note, Continue
  await page.evaluate(async () => { await window.typeIn(0, 'kept the phone on the shelf'); });
  fs.writeFileSync(`${OUT}/L7-F12-375-note.png`, await page.screenshot());
  await page.evaluate(async () => { await window.tap('Continue'); });
  await page.waitForTimeout(700);
  log('3 reflect Continue →', await rail(page), '(want 81)');
  await ctx.close();
}

// 4 — back paths (D340): Library → lesson → ✕, Today → task row → ✕, All drawer → lesson → ✕
{
  const ctx = await ctxAt(393, 852, '.overhaul/library-seed.js');
  const page = await ctx.newPage();
  await go(page, '/week/2', 2500);
  log('4a library at', path(page));
  const row = await page.evaluate(() => { const b = [...document.querySelectorAll('[role="button"]')].find((e) => { const r = e.getBoundingClientRect(); return r.top > 460 && r.width > 250 && r.left >= 0 && r.right <= innerWidth; }); const r = b.getBoundingClientRect(); return { t: b.getAttribute('aria-label') || b.textContent.trim(), x: r.left + 100, y: r.top + 20 }; });
  await page.mouse.click(row.x, row.y);
  await page.waitForTimeout(1500);
  log('4b tapped', JSON.stringify(row.t), '→', path(page));
  await page.evaluate(() => window.__fire(document.querySelector('[aria-label="Close"]')));
  await page.waitForTimeout(1500);
  log('4c ✕ →', path(page));
  await ctx.close();
}
{
  const ctx = await ctxAt(393, 852, '.overhaul/today-task-seed.js');
  const page = await ctx.newPage();
  await go(page, '/today', 2500);
  await page.evaluate(async () => { const n = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight > d.clientHeight + 8 && getComputedStyle(d).overflowY !== 'visible')[0]; n.scrollTop = 548; await window.__sleep(1000); });
  const cand = await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((b) => { const r = b.getBoundingClientRect(); return r.top > 100 && r.bottom < 760 && r.width > 200; }).map((b) => b.textContent.trim().slice(0, 60)));
  log('5a today rows', JSON.stringify(cand));
  const hit = await page.evaluate(() => { const b = [...document.querySelectorAll('[role="button"]')].find((e) => { const r = e.getBoundingClientRect(); return r.top > 100 && r.bottom < 760 && r.width > 200 && /task/i.test(e.textContent); }); if (!b) return null; window.__fire(b); return b.textContent.trim().slice(0, 60); });
  await page.waitForTimeout(1500);
  log('5b tapped', JSON.stringify(hit), '→', path(page), 'rail', await rail(page));
  await page.evaluate(async () => { await window.tap('Close'); });
  await page.waitForTimeout(1500);
  log('5c ✕ →', path(page));
  await go(page, '/all', 2000);
  await page.evaluate(async () => { await window.tap('A lesson · reader'); });
  await page.waitForTimeout(1500);
  log('6a All → ', path(page));
  await page.evaluate(async () => { await window.tap('Close'); });
  await page.waitForTimeout(1500);
  log('6b ✕ →', path(page));
  // redirects and the unknown lesson
  await go(page, '/lesson-card/3');
  log('7a /lesson-card/3 →', path(page), 'rail', await rail(page));
  await go(page, '/task/3');
  log('7b /task/3 →', path(page), 'rail', await rail(page));
  await go(page, '/lesson/day/999');
  log('7c /lesson/day/999 → close button', await page.evaluate(() => !!document.querySelector('[aria-label="Close"]')), 'band', await band(page));
  fs.writeFileSync(`${OUT}/unknown-393.png`, await page.screenshot());
  await page.evaluate(async () => { await window.tap('Close'); });
  await page.waitForTimeout(1500);
  log('7d ✕ on a cold deep link →', path(page));
  await ctx.close();
}
await browser.close();
