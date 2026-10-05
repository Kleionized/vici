// Library group, Phase 2: the unframed screens at the four phone sizes, one browser, one
// context at a time. Writes <out>/<slug>@<WxH>.png (+ .end.png when the main scroller
// scrolls) and prints the size-sweep probe's findings.
//   node .overhaul/scratch/lib/unframed.mjs <outdir> [--only=<slug,...>] [--sizes=393x852,...]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PROBE } from './probe-fn.js';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const OUT = argv.find((a) => !a.startsWith('--'));
fs.mkdirSync(OUT, { recursive: true });
const SIZES = String(flags.sizes ?? '393x852,375x667,390x844,430x932').split(',').map((s) => s.split('x').map(Number));
const LIB = '.overhaul/library-seed.js', D3 = '.overhaul/library-day3-seed.js';
const SCREENS = [
  { slug: 'lessons-browser', route: '/lessons-browser', seed: LIB, mid: true },
  { slug: 'search', route: '/search', seed: LIB },
  { slug: 'search-sleep', route: '/search', seed: LIB, do: "await tap('sleep')" },
  { slug: 'first-steps-d3', route: '/first-steps', seed: D3 },
  { slug: 'first-steps-d38', route: '/first-steps', seed: LIB },
  { slug: 'locked', route: '/locked', seed: LIB },
  { slug: 'journey', route: '/journey', seed: LIB, mid: true },
  { slug: 'journey-landing', route: '/journey/landing', seed: LIB },
  { slug: 'journey-crossing', route: '/journey/crossing', seed: LIB },
  { slug: 'journey-highlands', route: '/journey/highlands', seed: LIB },
  { slug: 'journey-watch', route: '/journey/watch', seed: LIB },
].filter((s) => !flags.only || String(flags.only).split(',').includes(s.slug));

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
for (const s of SCREENS) {
  for (const [W, H] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
    await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(st); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
    const seed = fs.readFileSync(s.seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
    await ctx.addInitScript(`try { ${seed} } catch (e) { console.error('initseed: ' + e.message); }`);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.error(`[pageerror ${s.slug}] ${e.message}`));
    const tag = `${s.slug}@${W}x${H}`;
    try {
      await page.goto('http://localhost:8096' + s.route, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.evaluate(DRIVE);
      await page.waitForTimeout(1500);
      if (s.do) await page.evaluate(`(async () => { ${s.do} })()`);
      await page.waitForTimeout(1200);
      const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 15px Lato'); });
      const probe = await page.evaluate(PROBE);
      await page.screenshot({ path: path.join(OUT, `${tag}.png`) });
      const scroll = async (f) => page.evaluate((f) => { const all = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1); all.sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth); if (!all[0]) return null; all[0].scrollTop = f * (all[0].scrollHeight - all[0].clientHeight); return all[0].scrollHeight - all[0].clientHeight; }, f);
      const n = Object.values(probe).reduce((a, v) => a + v.length, 0);
      let ends = '';
      if (s.mid) { const m = await scroll(0.5); if (m) { await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, `${tag}.mid.png`) }); ends += ' mid'; } }
      const e = await scroll(1);
      if (e) { await page.waitForTimeout(400); const p2 = await page.evaluate(PROBE); await page.screenshot({ path: path.join(OUT, `${tag}.end.png`) }); ends += ` end(${e}) ${JSON.stringify(p2)}`; }
      console.log(`${tag}: fonts=${fonts} ${n ? 'CHECK ' + JSON.stringify(probe) : 'ok'}${ends}`);
    } catch (err) {
      console.log(`${tag}: FAILED ${String(err).slice(0, 200)}`);
    }
    await ctx.close();
  }
}
await browser.close();
