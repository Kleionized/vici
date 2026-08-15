#!/usr/bin/env node
/**
 * Every distinct mark the reader frames draw, across all 84 lessons.
 *
 * Each page opens with a small piece of art above its copy. Lesson 1 needed
 * seven, each transcribed by hand. Whether the other 83 lessons need eighty
 * more or reuse the same handful decides how this is built, so: pull the mark
 * block out of every frame, normalise it, and count the distinct ones.
 *
 * The mark is the first child of the centred content column that is not a text
 * run — a positioned box of art, or an `<svg>`.
 *
 *   node scripts/uifinal/lesson-marks.mjs [--show <hash>]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal/lessons');
const SHOW = process.argv.includes('--show') ? process.argv[process.argv.indexOf('--show') + 1] : null;

/** The centred content column every reader frame lays its page out in. */
const COLUMN = /<div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:(\d+)px;[^"]*">/;

/** Balanced end of the tag that starts at `from`. */
function subtree(html, from) {
  let depth = 0;
  let i = from;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    let j = lt + 1, quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) { if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
      j++;
    }
    const raw = html.slice(lt, j + 1);
    const tag = (raw.match(/^<\/?\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    const selfClosing = raw.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'stop', 'use'].includes(tag);
    if (raw[1] === '/') { depth--; if (depth === 0) return html.slice(from, j + 1); }
    else if (!selfClosing) depth++;
    i = j + 1;
  }
  return html.slice(from);
}

/** The column's direct children, as raw subtrees. */
function children(column) {
  const inner = column.slice(column.indexOf('>') + 1);
  const out = [];
  let i = 0;
  while (i < inner.length) {
    const lt = inner.indexOf('<', i);
    if (lt < 0) break;
    if (inner.startsWith('</', lt)) break; // the column's own close
    const sub = subtree(inner, lt);
    out.push(sub);
    i = lt + sub.length;
  }
  return out;
}

/** A child that draws art rather than copy. */
const isArt = (sub) => !/^<div style="[^"]*font-size:/.test(sub) && !/^<div style="[^"]*font-family:/.test(sub);

const marks = new Map();
let frames = 0;
let withMark = 0;

for (const bundle of fs.readdirSync(SPLIT)) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  if (!/^Week |^Lesson 1 /.test(bundle)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    const m = html.match(COLUMN);
    if (!m) continue;
    frames++;
    const column = subtree(html, m.index);
    for (const child of children(column)) {
      if (!isArt(child)) continue;
      // Normalise whitespace only — every number stays, so two marks that
      // differ by a single radius count as two.
      const norm = child.replace(/\s+/g, ' ').trim();
      const hash = crypto.createHash('sha1').update(norm).digest('hex').slice(0, 10);
      const g = marks.get(hash) ?? { n: 0, raw: norm, where: [] };
      g.n++;
      if (g.where.length < 3) g.where.push(`${bundle} / ${frame.label}`);
      marks.set(hash, g);
      withMark++;
      break; // the mark is the first art child
    }
  }
}

if (SHOW) {
  const g = marks.get(SHOW);
  console.log(g ? g.raw : `no mark ${SHOW}`);
  process.exit(0);
}

const sorted = [...marks].sort((a, b) => b[1].n - a[1].n);
console.log(`reader frames read:        ${frames}`);
console.log(`frames drawing a mark:     ${withMark}`);
console.log(`distinct marks:            ${sorted.length}`);
console.log('');
for (const [hash, g] of sorted) {
  console.log(`${String(g.n).padStart(4)}×  ${hash}  ${g.raw.slice(0, 110)}`);
  console.log(`        ${g.where[0]}`);
}
