#!/usr/bin/env node
/**
 * Pass 2 — the apostrophe sweep.
 *
 * The canvas is not consistent with itself here: 385 of its text runs use a
 * curly apostrophe and 85 use a straight one, and there is no rule to derive
 * which from — each string simply states its own. The brief makes the design
 * the source of truth for anything visual, and the shape of a quote mark is
 * visual, so the resolution is per string rather than per app.
 *
 * This finds the runs where the two disagree: a canvas string whose only
 * difference from the app's is the apostrophe. Anything it prints is a glyph
 * the app draws differently from the frame it was built from.
 *
 *   node scripts/uifinal/apostrophe-sweep.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

import { mapFor } from './map.mjs';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal/final');

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…',
  '&times;': '×', '&deg;': '°', '&apos;': "'", '&#39;': "'", '&minus;': '−',
};
const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);

function sourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const FILES = sourceFiles(path.join(ROOT, 'src'));
const norm = (s) =>
  decode(s)
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\(['"`])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const CORPUS = FILES.map((f) => ({ file: path.relative(ROOT, f), text: norm(fs.readFileSync(f, 'utf8')) }));

/** Both apostrophes and both sets of quote marks folded to one shape. */
const fold = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"');

const findings = [];
const seen = new Set();

for (const bundle of fs.readdirSync(SPLIT)) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const { target } = mapFor(bundle, frame.label);
    if (!target || !target.startsWith('src/')) continue;
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    for (const m of html.matchAll(/>([^<>]{4,})</g)) {
      const run = norm(m[1]);
      if (!/['’]/.test(run) || seen.has(run)) continue;
      seen.add(run);
      // Present as drawn? Then there is nothing to say.
      if (CORPUS.some((c) => c.text.includes(run))) continue;
      // Present but for the apostrophe's shape?
      const hit = CORPUS.find((c) => fold(c.text).includes(fold(run)));
      if (hit) findings.push({ bundle, label: frame.label, target, run, file: hit.file });
    }
  }
}

console.log(`runs the app draws with a different apostrophe: ${findings.length}`);
console.log('');
for (const f of findings) {
  console.log(`${f.file}   [${f.label}]`);
  console.log(`   canvas: ${JSON.stringify(f.run)}`);
}
