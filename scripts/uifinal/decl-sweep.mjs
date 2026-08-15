#!/usr/bin/env node
/**
 * Pass 3 — the declaration sweep.
 *
 * Pass 3's first sweep compared colours and font sizes. The position sweep
 * added `top`. That still leaves most of what a frame states unchecked: `left`,
 * `width`, `height`, `border-radius` and `letter-spacing` had never been
 * compared against the app at all.
 *
 * For each property this collects the distinct values a frame states and asks
 * whether the app carries each one. Two thresholds matter, and they are
 * reported separately, because they mean different things:
 *
 *  - absent from the mapped file — often the screen's component living one
 *    import away, or a value the app computes;
 *  - absent from every file in `src/` — the app does not have this number.
 *
 * Only the second is treated as a finding, and even then it is a pointer: a
 * computed value has no literal to find. Every hit still has to be read.
 *
 *   node scripts/uifinal/decl-sweep.mjs [--prop <name>] [--min <n>]
 */
import fs from 'node:fs';
import path from 'node:path';

import { mapFor } from './map.mjs';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal/final');

const arg = (flag) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : null);
const ONLY = arg('--prop');
const MIN = Number(arg('--min') ?? 1);

/**
 * `left` and `width` are in the same space in both, so they are compared
 * straight. `top` is the one that owes the 54pt status bar, and it already has
 * its own sweep — it is here only so the totals are complete.
 */
const PROPS = [
  { name: 'left', re: /(?:^|;)\s*left:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'top', re: /(?:^|;)\s*top:\s*(-?[\d.]+)px/g, offset: 54 },
  { name: 'width', re: /(?:^|;)\s*width:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'height', re: /(?:^|;)\s*height:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'border-radius', re: /(?:^|;)\s*border-radius:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'letter-spacing', re: /(?:^|;)\s*letter-spacing:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'line-height', re: /(?:^|;)\s*line-height:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'gap', re: /(?:^|;)\s*gap:\s*(-?[\d.]+)px/g, offset: 0 },
  { name: 'opacity', re: /(?:^|;)\s*opacity:\s*([\d.]+)\s*(?:;|$)/g, offset: 0 },
  { name: 'font-weight', re: /(?:^|;)\s*font-weight:\s*(\d+)/g, offset: 0 },
  { name: 'stroke-width', re: /\sstroke-width="([\d.]+)"/g, offset: 0 },
  { name: 'font-size', re: /(?:^|;)\s*font-size:\s*([\d.]+)px/g, offset: 0 },
];

function allSources(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) allSources(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const numbersOf = (text) => new Set((text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number));
const CORPUS_NUMS = numbersOf(
  allSources(path.join(ROOT, 'src'))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n'),
);

const findings = [];
let framesRead = 0;
const totals = new Map(PROPS.map((p) => [p.name, { stated: 0, absent: 0 }]));

for (const bundle of fs.readdirSync(SPLIT)) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const { target } = mapFor(bundle, frame.label);
    if (!target || !target.startsWith('src/')) continue;
    framesRead++;
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    for (const prop of PROPS) {
      if (ONLY && prop.name !== ONLY) continue;
      const stated = new Set();
      prop.re.lastIndex = 0;
      for (const m of html.matchAll(prop.re)) stated.add(Number(m[1]));
      if (!stated.size) continue;
      const t = totals.get(prop.name);
      t.stated += stated.size;
      const absent = [...stated].filter((v) => !CORPUS_NUMS.has(v - prop.offset) && !CORPUS_NUMS.has(v)).sort((a, b) => a - b);
      t.absent += absent.length;
      if (absent.length >= MIN) findings.push({ bundle, label: frame.label, target, prop: prop.name, absent, stated: stated.size });
    }
  }
}

console.log(`frames swept: ${framesRead}`);
console.log('');
console.log('property        distinct values stated   absent from src/');
for (const [name, t] of totals) {
  if (ONLY && name !== ONLY) continue;
  console.log(`${name.padEnd(16)}${String(t.stated).padStart(14)}${String(t.absent).padStart(19)}`);
}
console.log('');

const byProp = new Map();
for (const f of findings) byProp.set(f.prop, [...(byProp.get(f.prop) ?? []), f]);
for (const [prop, list] of byProp) {
  console.log(`## ${prop} — ${list.length} frames with a value absent from src/`);
  for (const f of list.sort((a, b) => b.absent.length - a.absent.length).slice(0, 25)) {
    console.log(`   ${f.absent.length}/${f.stated}  [${f.bundle}] ${f.label} -> ${f.target}`);
    console.log(`      ${f.absent.join(', ')}`);
  }
  console.log('');
}
