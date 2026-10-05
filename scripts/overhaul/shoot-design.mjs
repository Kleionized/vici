#!/usr/bin/env node
/**
 * Capture every frame of a design bundle in one browser: PNG + layout signature.
 *
 *   node scripts/overhaul/shoot-design.mjs <bundle> [--only=Frame-A.html,Frame-B.html] [--dpr=2]
 *
 * Writes .overhaul/shots/design/<bundle>/<Frame>.png and the signature to
 * .overhaul/sig/d-<bundle>-<Frame>.txt (name usable with sigdiff.mjs as
 * `d-<bundle>-<Frame>`). One Chrome for the whole bundle, so a full pass over
 * 254 frames costs about what a dozen single captures do.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [bundle] = argv.filter((a) => !a.startsWith('--'));
const idx = JSON.parse(fs.readFileSync(`.overhaul/final/${bundle}/_index.json`, 'utf8'));
const only = flags.only ? new Set(String(flags.only).split(',')) : null;
const PROBE = fs.readFileSync('.overhaul/probe.js', 'utf8');
const outDir = `.overhaul/shots/design/${bundle}`;
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync('.overhaul/sig', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: Number(flags.dpr ?? 2) });
const page = await ctx.newPage();
let n = 0, bad = 0;
for (const f of idx.frames) {
  if (only && !only.has(f.file)) continue;
  await page.goto(`http://localhost:8097/f/${bundle}/${f.file}`, { waitUntil: 'networkidle' });
  const ok = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((x) => /Lato/.test(x.family) && x.status === 'loaded'); });
  if (!ok) { bad++; console.error(`[fonts] Lato not loaded on ${f.file}`); }
  await page.evaluate(PROBE);
  const sigName = `d-${bundle}-${f.file.replace(/\.html$/, '')}`;
  const rows = await page.evaluate((nm) => window.__sigRows(nm), sigName);
  fs.writeFileSync(`.overhaul/sig/${sigName.replace(/[^A-Za-z0-9._-]/g, '_')}.txt`, rows);
  await page.screenshot({ path: path.join(outDir, f.file.replace(/\.html$/, '.png')) });
  n++;
}
await browser.close();
console.log(`${bundle}: ${n} frames -> ${outDir}${bad ? `  (${bad} without Lato!)` : ''}`);
