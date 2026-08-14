#!/usr/bin/env node
/**
 * Split a Claude Design `.dc.html` canvas into one HTML file per screen.
 *
 * Every screen frame in the canvas is a `<div data-screen-label="...">` whose
 * subtree is the whole 393x852 phone frame. This walks the raw source counting
 * `<div`/`</div>` tokens to find the balanced end of each frame, then writes
 * the frame verbatim to `<out>/<slug>.html`.
 *
 * Usage: node scripts/uifinal/split.mjs <input.dc.html> <outDir>
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , input, outDir] = process.argv;
if (!input || !outDir) {
  console.error('usage: split.mjs <input.dc.html> <outDir>');
  process.exit(1);
}

const src = fs.readFileSync(input, 'utf8');

/** Find the index of the `<div` that opens the tag containing `attrIdx`. */
function openTagStart(s, attrIdx) {
  const i = s.lastIndexOf('<div', attrIdx);
  if (i < 0) throw new Error('no <div before attribute at ' + attrIdx);
  return i;
}

/** Walk forward from an opening `<div` to its matching `</div>`; returns end index (exclusive). */
function matchDiv(s, start) {
  const OPEN = '<div';
  const CLOSE = '</div>';
  let depth = 0;
  let i = start;
  while (i < s.length) {
    const nOpen = s.indexOf(OPEN, i);
    const nClose = s.indexOf(CLOSE, i);
    if (nClose < 0) throw new Error('unbalanced div from ' + start);
    if (nOpen >= 0 && nOpen < nClose) {
      // Ensure it is a real tag: `<div` followed by whitespace or `>`.
      const c = s[nOpen + OPEN.length];
      if (c === ' ' || c === '>' || c === '\n' || c === '\t' || c === '\r') depth++;
      i = nOpen + OPEN.length;
    } else {
      depth--;
      i = nClose + CLOSE.length;
      if (depth === 0) return i;
    }
  }
  throw new Error('unbalanced div from ' + start);
}

function slugify(label) {
  return label
    .replace(/&amp;/g, '&')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ATTR = 'data-screen-label="';
const frames = [];
let cursor = 0;
while (true) {
  const at = src.indexOf(ATTR, cursor);
  if (at < 0) break;
  const labelEnd = src.indexOf('"', at + ATTR.length);
  const label = src.slice(at + ATTR.length, labelEnd);
  const start = openTagStart(src, at);
  const end = matchDiv(src, start);
  frames.push({ label, start, end, html: src.slice(start, end) });
  cursor = end;
}

fs.mkdirSync(outDir, { recursive: true });
// Head/shared styles from the canvas <helmet> so a split frame renders standalone.
const helmet = (() => {
  const m = src.match(/<helmet>([\s\S]*?)<\/helmet>/);
  return m ? m[1] : '';
})();
fs.writeFileSync(path.join(outDir, '_helmet.html'), helmet);

const index = [];
const seen = new Map();
for (const f of frames) {
  let slug = slugify(f.label);
  const n = (seen.get(slug) ?? 0) + 1;
  seen.set(slug, n);
  if (n > 1) slug = `${slug}__${n}`;
  const file = `${slug}.html`;
  fs.writeFileSync(path.join(outDir, file), f.html);
  index.push({ label: f.label, file, bytes: f.html.length, start: f.start, end: f.end });
}
fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify({ source: input, count: frames.length, frames: index }, null, 2));
console.log(`${input} -> ${outDir}: ${frames.length} frames`);
