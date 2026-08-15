#!/usr/bin/env node
/**
 * Pass 2 — the position sweep.
 *
 * Pass 3's literal sweep compared every colour and font-size in the app against
 * every one in the canvas. It did not compare *positions*, which is most of
 * what these frames actually state: each absolutely-positioned box carries a
 * `top` and a `left`, and the app owes `top - 54` for the status bar it never
 * builds.
 *
 * So for every frame with an app target, this collects the distinct `top`
 * values it states and asks whether the target file contains each one, in app
 * space. A frame where most are present and one is missing is usually a real
 * miss. A frame where none are present means the app lays that screen out some
 * other way — in flow, or from shared furniture — and needs reading, not
 * patching.
 *
 * This is a pointer, not a verdict: it cannot see a number the app computes.
 * It is here to say *where to look*, which for 575 frames is the hard part.
 *
 *   node scripts/uifinal/position-sweep.mjs [--min <coverage>]
 */
import fs from 'node:fs';
import path from 'node:path';

import { mapFor } from './map.mjs';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal/final');
const STATUS_BAR = 54;

const arg = (flag) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : null);
const MIN = Number(arg('--min') ?? 1);

const fileCache = new Map();
function read(rel) {
  if (!fileCache.has(rel)) {
    const full = path.join(ROOT, rel);
    fileCache.set(rel, fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null);
  }
  return fileCache.get(rel);
}

/**
 * Every number the app source states, as a set. Reading it as numbers rather
 * than as text keeps `top: 171` from matching the `171` inside `1710`.
 */
const numbersCache = new Map();

/**
 * The transcribed artwork lives in `src/content/*.ts`, not in the screen that
 * draws it, so a scene layer's top is "in the app" even though the route file
 * has never heard of it. Those files are read alongside the target.
 */
const CONTENT = fs
  .readdirSync(path.join(ROOT, 'src/content'))
  .filter((f) => /\.ts$/.test(f))
  .map((f) => `src/content/${f}`);

/**
 * Several screens are a route that renders a component: `src/app/index.tsx` is
 * eight lines of routing and its two launch scenes live in
 * `src/components/ui/Waterline.tsx`. Checking only the mapped file therefore
 * says "missing" about geometry that is present one import away, so a number
 * absent from the target is re-checked against all of `src/` before it counts.
 */
function allSources(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) allSources(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}
const CORPUS_NUMS = new Set(
  (allSources(path.join(ROOT, 'src'))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n')
    .match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number),
);

function numbersIn(rel) {
  if (!numbersCache.has(rel)) {
    const src = read(rel);
    if (!src) return numbersCache.set(rel, null).get(rel);
    const all = [src, ...CONTENT.map(read).filter(Boolean)].join('\n');
    numbersCache.set(rel, new Set((all.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)));
  }
  return numbersCache.get(rel);
}

const rows = [];
for (const bundle of fs.readdirSync(SPLIT)) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const { target } = mapFor(bundle, frame.label);
    if (!target || !target.startsWith('src/')) continue;
    const nums = numbersIn(target);
    if (!nums) {
      rows.push({ bundle, label: frame.label, target, missingFile: true });
      continue;
    }
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    // Only absolutely-positioned boxes state a top the app owes 54 on.
    const tops = new Set();
    for (const m of html.matchAll(/position:absolute;[^"]*?\btop:(-?[\d.]+)px/g)) tops.add(Number(m[1]));
    if (!tops.size) continue;
    const found = [...tops].filter((t) => nums.has(t - STATUS_BAR) || nums.has(t));
    rows.push({
      bundle,
      label: frame.label,
      target,
      tops: tops.size,
      found: found.length,
      missing: [...tops].filter((t) => !nums.has(t - STATUS_BAR) && !nums.has(t)).sort((a, b) => a - b),
      // Absent from every file in `src/`, not merely from the mapped one.
      absent: [...tops]
        .filter((t) => !CORPUS_NUMS.has(t - STATUS_BAR) && !CORPUS_NUMS.has(t))
        .sort((a, b) => a - b),
    });
  }
}

const scored = rows.filter((r) => !r.missingFile);
const coverage = (r) => r.found / r.tops;

console.log(`frames with stated positions: ${scored.length}`);
console.log(`fully accounted for:          ${scored.filter((r) => coverage(r) === 1).length}`);
console.log(`no position accounted for:    ${scored.filter((r) => r.found === 0).length}`);
console.log('');

// The finding is a top that appears nowhere in `src/` at all. A top missing
// from the mapped file but present elsewhere is usually the screen's component
// living one import away, or a value the app computes.
const hard = scored.filter((r) => r.absent.length >= MIN).sort((a, b) => b.absent.length - a.absent.length);
console.log(`## tops that appear nowhere in src/ (${hard.length} frames)`);
for (const r of hard) {
  console.log(`${r.absent.length} of ${r.tops}  [${r.bundle}] ${r.label} -> ${r.target}`);
  console.log(`   ${r.absent.join(', ')}`);
}
