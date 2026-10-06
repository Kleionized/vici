#!/usr/bin/env node
/**
 * Replay every recipe at other phone sizes and look for layout faults.
 *
 *   node scripts/overhaul/size-sweep.mjs --size=375x667 [--group=<key>] [--frame=<label>] [--scroll]
 *
 * For each frame with a recipe (`.overhaul/recipes/*.json`, same keys audit.mjs reads) this opens a fresh
 * context at the size (dpr 2), applies the recipe's initseed / do / script, captures the screen and probes
 * the DOM for:
 *   - overflowX   a visible box or text run that ends past the window's right edge or starts left of 0
 *                 (full-bleed art is exempt: an <svg> wider than the window is by design)
 *   - underCtl    a text run that overlaps a bottom control (pill, ring, FAB, tab bar) it is not part of
 *   - clipped     a text run whose box is cut by an ancestor with overflow hidden
 *   - offscreen   a control that cannot be reached: below the window and not inside a scroller
 * With `--scroll` it also captures the main scroller at its end.
 * Writes .overhaul/size-sweep/<WxH>/<slug>.png, findings.json, report.md and contact sheets
 * (sheet-NN.png, 12 screens each at half size) to look through by eye.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [W, H] = String(flags.size ?? '375x667').split('x').map(Number);
const OUT = `.overhaul/size-sweep/${W}x${H}`;
fs.mkdirSync(OUT, { recursive: true });

const groupsOf = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'));
const groupByFile = new Map(Object.entries(groupsOf).flatMap(([g, fl]) => fl.map((f) => [f, g])));
const frames = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames.map((f) => ({ label: f.label, file: f.file, group: groupByFile.get(f.file) }));
const recipes = new Map();
for (const f of fs.readdirSync('.overhaul/recipes').filter((x) => x.endsWith('.json'))) {
  let list; try { list = JSON.parse(fs.readFileSync(path.join('.overhaul/recipes', f), 'utf8')); } catch { continue; }
  for (const r of list) if (r.frame && !r.frame.includes('*')) recipes.set(r.frame, { ...r, file: f });
}

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const launch = () => chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
// A long sweep can outlive one Chrome on an 8 GB machine; a closed browser is relaunched, not fatal.
let browser = await launch();
const freshContext = async (opts) => {
  try { return await browser.newContext(opts); }
  catch (e) { process.stderr.write(`  (browser closed — relaunching: ${String(e).slice(0, 80)})\n`); try { await browser.close(); } catch {} browser = await launch(); return browser.newContext(opts); }
};
const findings = [];
const shots = [];
for (const fr of frames) {
  if (flags.group && fr.group !== flags.group) continue;
  if (flags.frame && fr.label !== flags.frame) continue;
  const r = recipes.get(fr.label);
  if (!r || r.unreachable) { findings.push({ frame: fr.label, group: fr.group, status: r ? 'UNREACHABLE' : 'NO RECIPE' }); continue; }
  const ctx = await freshContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
  const seed = r.initseed ?? r.seedScript ?? (r.seed === 'init' ? '.overhaul/day-seed.js' : null);
  if (seed && fs.existsSync(seed)) {
    const s = fs.readFileSync(seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
    await ctx.addInitScript(`try { ${s} } catch (e) { console.error('initseed: ' + e.message); }`);
  }
  const page = await ctx.newPage();
  const slug = fr.label.replace(/[^A-Za-z0-9]+/g, '-');
  try {
    await page.goto('http://localhost:8096' + (r.route.startsWith('/') ? r.route : '/' + r.route), { waitUntil: 'domcontentloaded', timeout: 120000 });
    if (!r.fast) await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    if (r.seed === true || r.seed === 'reload') { await page.evaluate(fs.readFileSync('.overhaul/reseed.js', 'utf8')); await page.reload({ waitUntil: 'networkidle' }); }
    await page.evaluate(DRIVE);
    const settle = r.settle != null ? Number(r.settle) : (r.do || r.script ? 1500 : 0);
    if (settle) await page.waitForTimeout(settle);
    if (r.do) await page.evaluate(`(async () => { ${r.do} })()`);
    if (r.script) await page.evaluate(`(async () => { ${fs.readFileSync(r.script, 'utf8')} })()`);
    await page.waitForTimeout(Number(r.wait ?? 1200));
    await page.evaluate(async () => { await document.fonts.ready; });
    const probe = await page.evaluate(() => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const vis = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05; };
      const scroller = (el, axis) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (axis === 'x' ? /(auto|scroll)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1 : /(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1) return p; } return null; };
      // A sheet's scrim (rgba(0,0,0,0.68)) covers the screen behind it: when one is up, only what is
      // painted after it (the panel and its buttons) can collide with anything.
      const scrim = [...document.querySelectorAll('div,button')].find((d) => { const cs = getComputedStyle(d); const r = d.getBoundingClientRect(); return cs.backgroundColor === 'rgba(0, 0, 0, 0.68)' && r.width >= vw - 1 && r.height >= vh * 0.6; });
      const onTop = (el) => !scrim || !!(scrim.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) || scrim.contains(el);
      const textEls = [...document.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && vis(e) && onTop(e));
      const out = { overflowX: [], underCtl: [], clipped: [], offscreen: [] };
      for (const e of textEls) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // a pager's neighbouring page lies wholly off-screen by design; only a run that straddles an edge is cut
        const offPage = r.right <= 0.5 || r.left >= vw - 0.5;
        if (!offPage && (r.right > vw + 0.5 || r.left < -0.5) && !scroller(e, 'x')) out.overflowX.push(`${e.textContent.trim().slice(0, 40)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
        if (offPage || r.bottom <= 0 || r.top >= vh) continue;
        for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.overflow === 'visible' && cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
          if (/(auto|scroll)/.test(cs.overflowY) || /(auto|scroll)/.test(cs.overflowX)) break; // a scroller: reachable
          const pr = p.getBoundingClientRect();
          const straddles = (r.right > pr.right + 1 && r.left < pr.right) || (r.left < pr.left - 1 && r.right > pr.left) || (r.bottom > pr.bottom + 1 && r.top < pr.bottom);
          if (straddles) out.clipped.push(`${e.textContent.trim().slice(0, 40)}`);
          break;
        }
      }
      // bottom controls: buttons / tabs in the lowest 30 % of the window
      const ctls = [...document.querySelectorAll('[role=button],[role=tab]')].filter((e) => vis(e) && onTop(e)).map((e) => ({ e, r: e.getBoundingClientRect() })).filter((x) => x.r.top > vh * 0.7 && x.r.height > 20 && x.r.width > 20 && x.r.left < vw && x.r.right > 0);
      for (const t of textEls) {
        const r = t.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
        // a control's own label is the top layer, not content running under one
        if (t.closest('[role=tab],[role=tablist]')) continue;
        for (const c of ctls) {
          if (c.e.contains(t) || t.contains(c.e)) continue;
          const top = Math.max(r.top, c.r.top), bot = Math.min(r.bottom, c.r.bottom);
          const left = Math.max(r.left, c.r.left), right = Math.min(r.right, c.r.right);
          if (bot - top <= 2 || right - left <= 2) continue;
          // the text is a control's label lying over content (the SOS disc over a row): the
          // content underneath is what must be reachable — judge the row, not the label
          const own = t.closest('[role=button]');
          if (own && own !== c.e) {
            const or = own.getBoundingClientRect();
            const csc = scroller(c.e, 'y');
            if (csc && c.r.bottom - (csc.scrollHeight - csc.clientHeight - csc.scrollTop) <= or.top + 1) continue;
          }
          // content a scroller can bring clear of the control is reachable, not cut
          const sc = scroller(t, 'y');
          if (sc && r.bottom - (sc.scrollHeight - sc.clientHeight - sc.scrollTop) <= c.r.top + 1) continue;
          // covered by another layer away from the control (a sheet's scrim over the screen behind
          // it): hidden by design. Probe a point of the text outside the control's box.
          const px = r.top < c.r.top - 2 ? [(left + right) / 2, r.top + 2] : r.bottom > c.r.bottom + 2 ? [(left + right) / 2, r.bottom - 2] : r.left < c.r.left - 2 ? [r.left + 2, (top + bot) / 2] : r.right > c.r.right + 2 ? [r.right - 2, (top + bot) / 2] : null;
          if (px) { const h2 = document.elementFromPoint(px[0], px[1]); if (h2 && !(t.contains(h2) || h2.contains(t))) continue; }
          // what is actually on top at the overlap: the text or the control is a collision;
          // anything else (a sheet's scrim, the tab bar's ground) hides the text by design
          const hit = document.elementFromPoint((left + right) / 2, (top + bot) / 2);
          if (!hit || !(t.contains(hit) || hit.contains(t) || c.e.contains(hit))) continue;
          out.underCtl.push(`${t.textContent.trim().slice(0, 40)} under ${c.e.textContent.trim().slice(0, 20) || c.e.getAttribute('aria-label') || 'control'}`);
          break;
        }
      }
      for (const b of [...document.querySelectorAll('[role=button]')].filter(vis)) {
        const r = b.getBoundingClientRect();
        if (r.top < vh || r.left >= vw || r.right <= 0) continue;
        if (!scroller(b, 'y')) out.offscreen.push((b.textContent.trim() || b.getAttribute('aria-label') || '?').slice(0, 30));
      }
      for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].slice(0, 8);
      return out;
    });
    await page.evaluate(async () => {
      // every image decoded (the noise tile is a background image backed by an <img>),
      // then two frames so RN-web's onLoad re-render has painted it
      await Promise.all([...document.images].map((i) => (i.complete ? (i.decode ? i.decode().catch(() => {}) : null) : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });
    const png = path.join(OUT, `${slug}.png`);
    await page.screenshot({ path: png });
    shots.push({ label: fr.label, png });
    if (flags.scroll) {
      // the scroller on screen — a pager mounts its neighbours' scrollers off-screen, at equal size
      const sc = await page.evaluate(() => { const vw = innerWidth, vh = innerHeight; const vis = (el) => { const r = el.getBoundingClientRect(); return Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)); }; const all = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && vis(el) > 0); all.sort((a, b) => vis(b) - vis(a)); if (!all[0]) return false; all[0].scrollTop = all[0].scrollHeight; return true; });
      if (sc) { await page.waitForTimeout(400); const p2 = path.join(OUT, `${slug}.end.png`); await page.screenshot({ path: p2 }); shots.push({ label: fr.label + ' (end)', png: p2 }); }
    }
    const n = Object.values(probe).reduce((a, v) => a + v.length, 0);
    findings.push({ frame: fr.label, group: fr.group, status: n ? 'CHECK' : 'ok', ...probe });
    process.stderr.write(`${fr.label}: ${n ? 'CHECK ' + JSON.stringify(probe).slice(0, 200) : 'ok'}\n`);
  } catch (e) {
    findings.push({ frame: fr.label, group: fr.group, status: 'CAPTURE FAILED', note: String(e).slice(0, 200) });
    // the app server gone: stop rather than record every remaining frame as failed
    if (/ERR_CONNECTION_REFUSED/.test(String(e)) && findings.slice(-3).every((f) => /ERR_CONNECTION_REFUSED/.test(f.note ?? ''))) {
      process.stderr.write('app server unreachable — stopping the sweep\n');
      await ctx.close().catch(() => {});
      break;
    }
  }
  await ctx.close().catch(() => {});
}
await browser.close().catch(() => {});

// contact sheets: 12 per sheet, half size, labelled by order in report.md
const PER = 12, COLS = 6, sw = W, sh = H; // half of the dpr-2 capture = 1x
for (let s = 0; s * PER < shots.length; s++) {
  const batch = shots.slice(s * PER, s * PER + PER);
  const rows = Math.ceil(batch.length / COLS), GAP = 10;
  const sheet = new PNG({ width: COLS * sw + (COLS - 1) * GAP, height: rows * sh + (rows - 1) * GAP });
  sheet.data.fill(255);
  batch.forEach((b, i) => {
    const P = PNG.sync.read(fs.readFileSync(b.png));
    const ox = (i % COLS) * (sw + GAP), oy = Math.floor(i / COLS) * (sh + GAP);
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const ks = (P.width * y * 2 + x * 2) << 2, kt = (sheet.width * (oy + y) + ox + x) << 2;
      sheet.data[kt] = P.data[ks]; sheet.data[kt + 1] = P.data[ks + 1]; sheet.data[kt + 2] = P.data[ks + 2]; sheet.data[kt + 3] = 255;
    }
  });
  const tag = flags.group ? `${flags.group}-` : flags.frame ? 'frame-' : '';
  fs.writeFileSync(path.join(OUT, `sheet-${tag}${String(s + 1).padStart(2, '0')}.png`), PNG.sync.write(sheet));
}
// A --group / --frame run merges into the full sweep's findings rather than replacing them.
let merged = findings;
const fp = path.join(OUT, 'findings.json');
if ((flags.group || flags.frame) && fs.existsSync(fp)) {
  const prev = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const fresh = new Set(findings.map((f) => f.frame));
  const order = new Map(frames.map((f, i) => [f.label, i]));
  merged = [...prev.filter((f) => !fresh.has(f.frame)), ...findings].sort((a, b) => (order.get(a.frame) ?? 1e9) - (order.get(b.frame) ?? 1e9));
}
fs.writeFileSync(fp, JSON.stringify(merged, null, 1));
const md = [`# Size sweep ${W}×${H}`, '', 'Contact sheets: sheet-NN.png, 12 screens each in this order.', '', '| # | frame | group | status | findings |', '|---|---|---|---|---|'];
let i = 0;
for (const f of merged) md.push(`| ${f.status === 'ok' || f.status === 'CHECK' ? ++i : ''} | ${f.frame} | ${f.group ?? ''} | ${f.status} | ${['overflowX', 'underCtl', 'clipped', 'offscreen'].filter((k) => f[k]?.length).map((k) => `${k}: ${f[k].join('; ')}`).join(' · ')}${f.note ?? ''} |`);
fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n') + '\n');
const by = (s) => findings.filter((f) => f.status === s).length;
console.log(`${W}x${H}: ${findings.length} frames — ok ${by('ok')}, check ${by('CHECK')}, no recipe ${by('NO RECIPE')}, unreachable ${by('UNREACHABLE')}, failed ${by('CAPTURE FAILED')} -> ${OUT}/report.md`);
