#!/usr/bin/env node
/* GROUP day, Phase 2 — capture the check-ins' undrawn and stress states in one browser, one
   context at a time, at the sizes asked for:

     node .overhaul/dayp2-states.mjs [--sizes=393x852,375x667] [--only=name,name] [--scroll]

   Writes .overhaul/shots/dayp2/<name>@<WxH>.png (and .end.png scrolled to the end with --scroll),
   and prints, per shot, what overlaps what: a text run under a bottom control, and the hero's
   art box against the content above it (so a stack running into the art is a number, not a guess). */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const SIZES = String(flags.sizes ?? '393x852,375x667').split(',').map((s) => s.split('x').map(Number));
const only = flags.only ? String(flags.only).split(',') : null;
const OUT = '.overhaul/shots/dayp2';
fs.mkdirSync(OUT, { recursive: true });

const M = "await tap('Begin'); await __sleep(700);";
const TASK = M;
const LEDGER = `${M} await tap('Yes'); await __sleep(300); await tap('Next'); await __sleep(700);`;
const PLEDGE = `${LEDGER} await tap('Continue'); await __sleep(600); await tap('Continue'); await __sleep(600); await tap('Continue'); await __sleep(700);`;
const N = "await tap('Begin'); await __sleep(800);";
const EMO = `${N} await tap('Continue'); await __sleep(700);`;
const REA = `${EMO} await tap('Calm'); await __sleep(300); await tap('Next'); await __sleep(700);`;
const REF = `${REA} await tap('Loneliness'); await __sleep(300); await tap('Next'); await __sleep(800);`;
const REC = `${REF} await tap('Continue'); await __sleep(900);`;
const ACT = `${REC} await tap('Continue'); await __sleep(900);`;
const type = (text) => `{ const el = document.querySelector('textarea'); const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value'); d.set.call(el, ${JSON.stringify(text)}); el.dispatchEvent(new Event('input', { bubbles: true })); } await __sleep(500);`;
const LONG_REFLECTION = 'Sam called at the right moment. I had been on the sofa for an hour with the phone in my hand and the house quiet. We talked about nothing for twenty minutes and by the end I had forgotten what I was about to do. Tomorrow I want to plan the evening before it starts, not after.';

const STATES = [
  // stress: the longest copy real data puts on these boards
  { name: 'task-d59', route: '/day/morning', seed: '.overhaul/day-seed-long.js', do: `${TASK} await tap('Not yet'); await __sleep(400);` },
  { name: 'pledge-long', route: '/day/morning', seed: '.overhaul/day-seed-long.js', do: PLEDGE },
  { name: 'pledge-long-signed', route: '/day/morning', seed: '.overhaul/day-seed-long.js', do: `${PLEDGE} await tap('Sign for today'); await __sleep(700);` },
  { name: 'sheet-long', route: '/day/morning', seed: '.overhaul/day-seed-long.js', do: `${PLEDGE} await tap('Change the pledge'); await __sleep(900);` },
  { name: 'action-d64', route: '/day/night', seed: '.overhaul/day-seed-long-d64.js', do: ACT },
  { name: 'action-d58', route: '/day/night', seed: '.overhaul/curriculum-d58-night-seed.js', do: ACT },
  { name: 'reflection-long', route: '/day/night', seed: '.overhaul/day-seed.js', do: `${REF} ${type(LONG_REFLECTION)}` },
  // undrawn states
  { name: 'task-none', route: '/day/morning', seed: '.overhaul/day-seed.js', do: TASK },
  { name: 'ledger-neg', route: '/day/morning', seed: '.overhaul/day-seed-negatives.js', do: LEDGER },
  { name: 'record-neg', route: '/day/night', seed: '.overhaul/day-seed-negatives.js', do: REC },
  { name: 'action-none', route: '/day/night', seed: '.overhaul/day-seed-negatives.js', do: ACT },
  { name: 'emotions-none', route: '/day/night', seed: '.overhaul/day-seed.js', do: EMO },
  { name: 'reflection-empty', route: '/day/night', seed: '.overhaul/day-seed.js', do: REF },
  { name: 'checkin-1', route: '/checkin?part=evening', seed: '.overhaul/day-seed.js', do: '' },
  { name: 'checkin-3', route: '/checkin?part=evening', seed: '.overhaul/day-seed.js', do: "await tap('Continue'); await __sleep(700); await tap('Calm'); await __sleep(300); await tap('Next'); await __sleep(700);" },
];

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
try {
  for (const st of STATES) {
    if (only && !only.includes(st.name)) continue;
    for (const [W, H] of SIZES) {
      const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
      await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
      const seed = fs.readFileSync(st.seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
      await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('initseed: ' + e.message); }`);
      const page = await ctx.newPage();
      const tag = `${st.name}@${W}x${H}`;
      try {
        await page.goto('http://localhost:8096' + st.route, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        await page.evaluate(DRIVE);
        await page.waitForTimeout(1500);
        if (st.do) await page.evaluate(`(async () => { ${st.do} })()`);
        await page.waitForTimeout(1200);
        const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => f.family.includes('Lato') && f.status === 'loaded'); });
        const probe = await page.evaluate(() => {
          const vh = window.innerHeight, vw = window.innerWidth;
          const svgs = [...document.querySelectorAll('svg')].map((s) => s.getBoundingClientRect()).filter((r) => r.width > 300 && r.height > 100);
          const ctls = [...document.querySelectorAll('[role=button],[role=radio],[role=checkbox]')].map((e) => ({ t: (e.textContent.trim() || e.getAttribute('aria-label') || '?').slice(0, 24), r: e.getBoundingClientRect() })).filter((c) => c.r.top > vh * 0.6 && c.r.height > 20);
          const texts = [...document.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())).map((e) => ({ t: e.textContent.trim().slice(0, 30), r: e.getBoundingClientRect() })).filter((x) => x.r.height > 0 && x.r.bottom > 0 && x.r.top < vh);
          const lowest = texts.filter((x) => x.r.top < vh * 0.75).reduce((m, x) => Math.max(m, x.r.bottom), 0);
          const scrollers = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1).length;
          return { svgs: svgs.map((r) => `${Math.round(r.top)}..${Math.round(r.bottom)}`), controls: ctls.map((c) => `${c.t}@${Math.round(c.r.top)}`), lowestText: Math.round(lowest), scrollers, vw };
        });
        await page.screenshot({ path: `${OUT}/${tag}.png` });
        let end = '';
        if (flags.scroll) {
          const sc = await page.evaluate(() => { const all = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1); all.sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth); if (!all[0]) return false; all[0].scrollTop = all[0].scrollHeight; return true; });
          if (sc) { await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/${tag}.end.png` }); end = ' +end'; }
        }
        console.log(`${tag}${fonts ? '' : ' [fonts] Lato NOT loaded'}${end} ${JSON.stringify(probe)}`);
      } catch (e) {
        console.log(`${tag} FAILED ${String(e).slice(0, 200)}`);
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
