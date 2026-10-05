#!/usr/bin/env node
/**
 * The parity audit, in one browser: every Email-Login frame replayed from its recipe, captured, and
 * compared with the design frame by pixels (pxdiff's rule) and by layout signature (sigdiff).
 *
 *   node scripts/overhaul/audit-fast.mjs [--group=<key>] [--frame=<label>] [--out=.overhaul/audit]
 *
 * Same recipes and the same report as audit.mjs (`report.json`, `report.md`, one strip per frame in
 * `strips/`), but a fresh browser *context* per frame instead of a fresh node + Chrome process, which
 * makes a full pass about ten times faster. A frame is CLEAN when its pixel mismatch is under 0.5 %;
 * the signature's verdict is reported alongside (`net` = differing rows not explained by radius
 * notation or an SVG-drawn box) for the reviewer, not used to gate.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const OUT = String(flags.out ?? '.overhaul/audit');
fs.mkdirSync(path.join(OUT, 'strips'), { recursive: true });
const T = 24;

const groupsOf = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'));
const groupByFile = new Map(Object.entries(groupsOf).flatMap(([g, fl]) => fl.map((f) => [f, g])));
const frames = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames.map((f) => ({ label: f.label, file: f.file, group: groupByFile.get(f.file) }));
const recipes = new Map();
for (const f of fs.readdirSync('.overhaul/recipes').filter((x) => x.endsWith('.json')).sort()) {
  let list; try { list = JSON.parse(fs.readFileSync(path.join('.overhaul/recipes', f), 'utf8')); } catch (e) { console.error(`! ${f}: ${e.message}`); continue; }
  for (const r of list) if (r.frame && !r.frame.includes('*') && !r.size && !r.sizes) recipes.set(r.frame, { ...r, recipeFile: f });
}

const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const PROBE = fs.readFileSync('.overhaul/probe.js', 'utf8');
const CHROME = [[0, 0, 393, 54], [120, 834, 153, 14]];

function pixels(dPath, aBuf, slug, ignore = []) {
  const D = PNG.sync.read(fs.readFileSync(dPath)), A = PNG.sync.read(aBuf);
  const dpr = 2, w = Math.min(D.width, A.width), h = Math.min(D.height, A.height);
  const ign = [...CHROME, ...ignore].map((r) => r.map((v) => v * dpr));
  const CELL = 4 * dpr, gw = Math.ceil(w / CELL), gh = Math.ceil(h / CELL), grid = new Uint32Array(gw * gh);
  const diff = new PNG({ width: w, height: h });
  let bad = 0, n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const kd = (D.width * y + x) << 2, ka = (A.width * y + x) << 2, k = (w * y + x) << 2;
    const skip = ign.some(([ix, iy, iw, ih]) => x >= ix && x < ix + iw && y >= iy && y < iy + ih);
    const m = Math.max(Math.abs(D.data[kd] - A.data[ka]), Math.abs(D.data[kd + 1] - A.data[ka + 1]), Math.abs(D.data[kd + 2] - A.data[ka + 2]));
    const red = !skip && m > T;
    if (!skip) { n++; if (red) { bad++; grid[Math.floor(y / CELL) * gw + Math.floor(x / CELL)]++; } }
    const l = 200 + Math.round((0.3 * D.data[kd] + 0.59 * D.data[kd + 1] + 0.11 * D.data[kd + 2]) * 0.2);
    diff.data[k] = red ? 230 : l; diff.data[k + 1] = red ? 20 : l; diff.data[k + 2] = red ? 20 : l; diff.data[k + 3] = 255;
  }
  // regions: connected cells with ≥ 3 % mismatching pixels
  const seen = new Uint8Array(gw * gh), regions = [], minCell = Math.max(1, Math.round(CELL * CELL * 0.03));
  for (let i = 0; i < gw * gh; i++) {
    if (seen[i] || grid[i] < minCell) continue;
    const q = [i]; seen[i] = 1; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, px = 0;
    while (q.length) { const c = q.pop(), cx = c % gw, cy = (c / gw) | 0; px += grid[c]; x0 = Math.min(x0, cx); y0 = Math.min(y0, cy); x1 = Math.max(x1, cx); y1 = Math.max(y1, cy); for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) { if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue; const j = ny * gw + nx; if (!seen[j] && grid[j] >= minCell) { seen[j] = 1; q.push(j); } } }
    regions.push({ x: x0 * 4, y: y0 * 4, w: (x1 - x0 + 1) * 4, h: (y1 - y0 + 1) * 4, px });
  }
  regions.sort((a, b) => b.px - a.px);
  // strip: design | app | diff at 1x
  const sw = w / dpr, sh = h / dpr, GAP = 8, strip = new PNG({ width: sw * 3 + GAP * 2, height: sh });
  strip.data.fill(255);
  const blit = (src, sW, ox) => { for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const s = (sW * y * dpr + x * dpr) << 2, t = (strip.width * y + ox + x) << 2; strip.data[t] = src.data[s]; strip.data[t + 1] = src.data[s + 1]; strip.data[t + 2] = src.data[s + 2]; strip.data[t + 3] = 255; } };
  blit(D, D.width, 0); blit(A, A.width, sw + GAP); blit(diff, w, 2 * (sw + GAP));
  fs.writeFileSync(path.join(OUT, 'strips', `${slug}.strip.png`), PNG.sync.write(strip));
  return { share: Number(((100 * bad) / n).toFixed(3)), regions: regions.slice(0, 8) };
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const rows = [];
for (const fr of frames) {
  if (flags.group && fr.group !== flags.group) continue;
  if (flags.frame && fr.label !== flags.frame) continue;
  const r = recipes.get(fr.label);
  if (!r) { rows.push({ frame: fr.label, group: fr.group, status: 'NO RECIPE' }); continue; }
  if (r.unreachable) { rows.push({ frame: fr.label, group: fr.group, status: 'UNREACHABLE', note: r.unreachable }); continue; }
  const slug = fr.label.replace(/[^A-Za-z0-9]+/g, '-');
  const dBundle = r.designBundle ?? 'Email-Login', dFile = (r.designFile ?? fr.file).replace(/\.html$/, '');
  const dPng = `.overhaul/shots/design/${dBundle}/${dFile}.png`, dSig = `d-${dBundle}-${dFile}`;
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
  const seed = r.initseed ?? r.seedScript ?? (r.seed === 'init' ? '.overhaul/day-seed.js' : null);
  if (seed) {
    if (!fs.existsSync(seed)) { rows.push({ frame: fr.label, group: fr.group, status: 'CAPTURE FAILED', note: `seed missing: ${seed}` }); await ctx.close(); continue; }
    const s = fs.readFileSync(seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
    await ctx.addInitScript(`try { ${s} } catch (e) { console.error('initseed: ' + e.message); }`);
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto('http://localhost:8096' + (r.route.startsWith('/') ? r.route : '/' + r.route), { waitUntil: 'domcontentloaded', timeout: 120000 });
    if (!r.fast) await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    if (r.seed === true || r.seed === 'reload') { await page.evaluate(fs.readFileSync('.overhaul/reseed.js', 'utf8')); await page.reload({ waitUntil: 'networkidle' }); }
    await page.evaluate(DRIVE);
    const settle = r.settle != null ? Number(r.settle) : (r.do || r.script ? 1500 : 0);
    if (settle) await page.waitForTimeout(settle);
    if (r.do) await page.evaluate(`(async () => { ${r.do} })()`);
    if (r.script) await page.evaluate(`(async () => { ${fs.readFileSync(r.script, 'utf8')} })()`);
    await page.waitForTimeout(Number(r.wait ?? 1600));
    await page.evaluate(async () => { await document.fonts.ready; });
    if (r.scroll != null) await page.evaluate((y) => { const all = [...document.querySelectorAll('*')].filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1); all.sort((a, b) => b.clientHeight * b.clientWidth - a.clientHeight * a.clientWidth); if (all[0]) all[0].scrollTop = y === 'end' ? all[0].scrollHeight : Number(y); }, String(r.scroll)).then(() => page.waitForTimeout(400));
    await page.evaluate(PROBE);
    const sigName = `au-a-${slug}`;
    fs.writeFileSync(`.overhaul/sig/${sigName}.txt`, await page.evaluate((n) => window.__sigRows(n), sigName));
    const buf = await page.screenshot();
    const px = pixels(dPng, buf, slug, r.ignore ?? []);
    let sig = null;
    try {
      const out = execFileSync('node', ['scripts/overhaul/sigdiff.mjs', dSig, sigName], { encoding: 'utf8' }).trim().split('\n').pop();
      const m = /(\d+) differing, (\d+) missing, (\d+) extra/.exec(out);
      const rn = /(\d+) radius-notation only/.exec(out), sv = /(\d+) paint-absent-geometry-exact/.exec(out);
      if (m) sig = { differing: +m[1], missing: +m[2], extra: +m[3], net: +m[1] - (rn ? +rn[1] : 0) - (sv ? +sv[1] : 0) };
    } catch {}
    rows.push({ frame: fr.label, group: fr.group, recipe: r.recipeFile, status: px.share < 0.5 ? 'CLEAN' : 'DIFF', px: px.share, regions: px.regions, sig, errors: errors.slice(0, 2) });
    process.stderr.write(`${fr.label}: ${px.share}%${px.share >= 0.5 ? '  DIFF' : ''}${errors.length ? '  [pageerror]' : ''}\n`);
  } catch (e) {
    rows.push({ frame: fr.label, group: fr.group, status: 'CAPTURE FAILED', note: String(e).slice(0, 300) });
    process.stderr.write(`${fr.label}: CAPTURE FAILED ${String(e).slice(0, 120)}\n`);
  }
  await ctx.close();
}
await browser.close();

let all = rows;
const rp = path.join(OUT, 'report.json');
if ((flags.group || flags.frame) && fs.existsSync(rp)) {
  const prev = JSON.parse(fs.readFileSync(rp, 'utf8'));
  const fresh = new Set(rows.map((r) => r.frame));
  const order = new Map(frames.map((f, i) => [f.label, i]));
  all = [...prev.filter((r) => !fresh.has(r.frame)), ...rows].sort((a, b) => (order.get(a.frame) ?? 1e9) - (order.get(b.frame) ?? 1e9));
}
fs.writeFileSync(rp, JSON.stringify(all, null, 1));
const md = ['| Frame | Group | Status | px % | top regions (x,y w×h) | sig net/missing/extra |', '|---|---|---|---|---|---|'];
for (const r of all) md.push(`| ${r.frame} | ${r.group ?? ''} | ${r.status} | ${r.px ?? ''} | ${(r.regions ?? []).slice(0, 3).map((g) => `${g.x},${g.y} ${g.w}×${g.h}`).join('; ')}${r.note ? ' ' + r.note.slice(0, 80) : ''} | ${r.sig ? `${r.sig.net}/${r.sig.missing}/${r.sig.extra}` : ''} |`);
fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n') + '\n');
const by = (s) => all.filter((r) => r.status === s).length;
console.log(`${all.length} frames — clean ${by('CLEAN')}, diff ${by('DIFF')}, unreachable ${by('UNREACHABLE')}, failed ${by('CAPTURE FAILED')}, no recipe ${by('NO RECIPE')} -> ${OUT}/report.md`);
