// node .overhaul/f-sosb-rp-sweep.mjs <outDir> — every Rough Days protocol page (7 × 3) at 393×852, 375×667,
// 390×844 and 430×932, in one browser: a PNG per page (dpr 1), one contact sheet per size, and per page the
// lines of every text run (orphan = a last line of one word; dash = a line opening with an em dash) and the
// gap between the stack's last text and the primary's top. sos-boards Phase 2 (unframed screens, D266).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const OUT = process.argv[2] ?? '.overhaul/shots/sosb/rp';
fs.mkdirSync(OUT, { recursive: true });
const KEYS = ['loneliness', 'anxiety', 'stress', 'boredom', 'latenight', 'homealone', 'argument'];
const SIZES = [[393, 852], [375, 667], [390, 844], [430, 932]];
const SEED = fs.readFileSync('.overhaul/settings-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const report = [];
for (const [W, H] of SIZES) {
  const shots = [];
  for (const key of KEYS) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
    await ctx.addInitScript(`try { ${SEED} } catch (e) { console.error('initseed: ' + e.message); }`);
    const page = await ctx.newPage();
    await page.goto(`http://localhost:8096/rough-protocol?key=${key}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.evaluate(`waitFor('Walk through it', 15000)`);
    for (let i = 0; i < 3; i++) {
      if (i > 0) await page.evaluate(`tap(${JSON.stringify(i === 1 ? 'Walk through it' : 'Next')})`);
      await page.waitForTimeout(900);
      await page.evaluate(async () => { await document.fonts.ready; });
      const probe = await page.evaluate(() => {
        const vis = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05; };
        const runs = [...document.querySelectorAll('div')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && vis(e) && !e.closest('[role=button]'));
        const lines = (el) => {
          const tn = [...el.childNodes].find((c) => c.nodeType === 3);
          const text = tn.textContent; const r = document.createRange(); const out = []; let cur = '', top = null;
          for (let k = 0; k < text.length; k++) {
            r.setStart(tn, k); r.setEnd(tn, k + 1); const rc = r.getClientRects()[0];
            if (!rc) { cur += text[k]; continue; }
            if (top !== null && rc.top > top + 4) { out.push(cur.trim()); cur = ''; }
            if (top === null || rc.top > top + 4) top = rc.top;
            cur += text[k];
          }
          out.push(cur.trim());
          return out;
        };
        const items = runs.map((e) => ({ text: e.textContent.trim(), lines: lines(e), r: e.getBoundingClientRect() }));
        const pill = [...document.querySelectorAll('[role=button]')].map((b) => b.getBoundingClientRect()).filter((r) => r.height === 58).sort((a, b) => a.top - b.top)[0];
        const stackBottom = Math.max(...items.filter((x) => x.r.top > 200 && (!pill || x.r.top < pill.top)).map((x) => x.r.bottom));
        return { items: items.map(({ text, lines }) => ({ text, lines })), gap: pill ? Math.round(pill.top - stackBottom) : null };
      });
      const flags = [];
      for (const it of probe.items) {
        if (it.lines.length > 1 && !/\s/.test(it.lines[it.lines.length - 1])) flags.push(`orphan "${it.lines[it.lines.length - 1]}" in "${it.text.slice(0, 30)}"`);
        if (it.lines.some((l, n) => n > 0 && /^[—–]/.test(l))) flags.push(`dash opens a line in "${it.text.slice(0, 30)}"`);
      }
      if (probe.gap !== null && probe.gap < 16) flags.push(`stack ${probe.gap} pt from the pill`);
      const png = path.join(OUT, `${W}x${H}-${key}-${i + 1}.png`);
      await page.screenshot({ path: png });
      shots.push(png);
      report.push({ size: `${W}x${H}`, key, page: i + 1, gap: probe.gap, flags, lines: probe.items.filter((x) => x.lines.length > 1).map((x) => x.lines.join(' ⏎ ')) });
      console.log(`${W}x${H} ${key} ${i + 1}: gap ${probe.gap}${flags.length ? ' — ' + flags.join('; ') : ''}`);
    }
    await ctx.close();
  }
  // contact sheet: 7 rows (protocols) × 3 pages
  const imgs = shots.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="height:${Math.round(H * 0.42)}px">`).join('');
  const sheet = await (await browser.newContext({ viewport: { width: Math.round(W * 0.42 * 3 + 40), height: 400 }, deviceScaleFactor: 1 })).newPage();
  await sheet.setContent(`<html><body style="margin:0;background:#777;display:grid;grid-template-columns:repeat(3,auto);gap:6px;padding:6px;justify-content:start">${imgs}</body></html>`);
  await sheet.screenshot({ path: path.join(OUT, `sheet-${W}x${H}.png`), fullPage: true });
}
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
await browser.close();
