#!/usr/bin/env node
/**
 * Re-run every kit-lab replica against its design frame in one browser.
 *
 *   node scripts/overhaul/lab-audit.mjs [--only=Key,Key] [--t=24]
 *
 * Keys come from `src/components/mono/lab/*.tsx`; a key's frame is its stem before `@`, looked up in
 * Email-Login, then in the Week bundles. Partial replicas (only one part of a frame built) report their
 * whole-frame share, so read the strip before calling one wrong. Writes .overhaul/lab-audit/report.md
 * and a strip per replica over 0.3 %.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const T = Number(flags.t ?? 24);
const OUT = '.overhaul/lab-audit';
fs.mkdirSync(path.join(OUT, 'strips'), { recursive: true });

const keys = new Set();
for (const f of fs.readdirSync('src/components/mono/lab').filter((x) => x.endsWith('.tsx') || x === 'index.ts')) {
  const s = fs.readFileSync(path.join('src/components/mono/lab', f), 'utf8');
  for (const m of s.matchAll(/^\s*'([A-Za-z0-9][A-Za-z0-9@_.-]*)'\s*:/gm)) keys.add(m[1]);
}
const only = flags.only ? new Set(String(flags.only).split(',')) : null;
const bundles = ['Email-Login', ...fs.readdirSync('.overhaul/shots/design').filter((d) => d.startsWith('Week-'))];
const designFor = (stem) => {
  for (const b of bundles) { const p = `.overhaul/shots/design/${b}/${stem}.png`; if (fs.existsSync(p)) return p; }
  return null;
};

const CHROME = [[0, 0, 393, 54], [120, 834, 153, 14]];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
const page = await ctx.newPage();
const rows = [];
for (const key of [...keys].sort()) {
  if (only && !only.has(key)) continue;
  const stem = key.split('@')[0];
  const d = designFor(stem);
  if (!d) { rows.push({ key, note: 'no design frame (bench key)' }); continue; }
  await page.goto(`http://localhost:8096/kit-lab?f=${encodeURIComponent(key)}`, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(900);
  await page.evaluate(async () => {
    // every image decoded (the noise tile is a background image backed by an <img>),
    // then two frames so RN-web's onLoad re-render has painted it
    await Promise.all([...document.images].map((i) => (i.complete ? (i.decode ? i.decode().catch(() => {}) : null) : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  const A = PNG.sync.read(await page.screenshot());
  const D = PNG.sync.read(fs.readFileSync(d));
  const dpr = 2, w = Math.min(A.width, D.width), h = Math.min(A.height, D.height);
  let bad = 0, n = 0;
  const diff = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = (w * y + x) << 2, ka = (A.width * y + x) << 2, kd = (D.width * y + x) << 2;
    const skip = CHROME.some(([ix, iy, iw, ih]) => x >= ix * dpr && x < (ix + iw) * dpr && y >= iy * dpr && y < (iy + ih) * dpr);
    const m = Math.max(Math.abs(A.data[ka] - D.data[kd]), Math.abs(A.data[ka + 1] - D.data[kd + 1]), Math.abs(A.data[ka + 2] - D.data[kd + 2]));
    const red = !skip && m > T;
    if (!skip) { n++; if (red) bad++; }
    const l = 200 + Math.round(D.data[kd] * 0.2);
    diff.data[k] = red ? 230 : l; diff.data[k + 1] = red ? 20 : l; diff.data[k + 2] = red ? 20 : l; diff.data[k + 3] = 255;
  }
  const share = (100 * bad) / n;
  if (share > 0.3) {
    const sw = w / dpr, sh = h / dpr, GAP = 8, strip = new PNG({ width: sw * 3 + GAP * 2, height: sh });
    strip.data.fill(255);
    const blit = (src, sW, ox) => { for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const s = (sW * y * dpr + x * dpr) << 2, t = (strip.width * y + ox + x) << 2; strip.data[t] = src.data[s]; strip.data[t + 1] = src.data[s + 1]; strip.data[t + 2] = src.data[s + 2]; strip.data[t + 3] = 255; } };
    blit(D, D.width, 0); blit(A, A.width, sw + GAP); blit(diff, w, 2 * (sw + GAP));
    fs.writeFileSync(path.join(OUT, 'strips', `${key.replace(/[^A-Za-z0-9@_-]/g, '_')}.strip.png`), PNG.sync.write(strip));
  }
  rows.push({ key, share: Number(share.toFixed(2)) });
  process.stderr.write(`${key}: ${share.toFixed(2)}%\n`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'report.md'), ['| key | mismatch % | note |', '|---|---|---|', ...rows.map((r) => `| ${r.key} | ${r.share ?? ''} | ${r.note ?? ''} |`)].join('\n') + '\n');
const over = rows.filter((r) => r.share > 0.3);
console.log(`${rows.length} replicas — ${over.length} over 0.3 %: ${over.map((r) => `${r.key} ${r.share}`).join(', ')}`);
