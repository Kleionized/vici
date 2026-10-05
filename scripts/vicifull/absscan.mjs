#!/usr/bin/env node
/**
 * Find absolutely-positioned boxes that CSS clamps and Yoga does not.
 *
 * The canvas writes `position:absolute; left:24` and nothing else, and the
 * browser shrink-to-fits the box to the space left inside its containing block
 * — so a sentence wraps at the frame's edge. Yoga has no shrink-to-fit: an
 * absolute node with `left` and no `right`/`width` sizes to its CONTENT, so the
 * same sentence lays out on one line and runs off the screen.
 *
 * The whole parity run was measured on the web build, where this is invisible.
 * This lists every style object that states `position: 'absolute'` with a
 * horizontal anchor but no opposing anchor and no width.
 *
 * Usage: node scripts/vicifull/absscan.mjs [--all]
 */
import fs from 'node:fs';
import path from 'node:path';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
})('src');

/** Balanced `{ … }` starting at `i` (which points at the brace). */
function objAt(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}') {
      depth--;
      if (depth === 0) return s.slice(i, j + 1);
    }
  }
  return null;
}

const hits = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  let idx = 0;
  while (true) {
    const at = src.indexOf("position: 'absolute'", idx);
    if (at < 0) break;
    idx = at + 1;
    // walk back to the enclosing object literal
    let open = -1, depth = 0;
    for (let j = at; j >= 0; j--) {
      if (src[j] === '}') depth++;
      else if (src[j] === '{') { if (depth === 0) { open = j; break; } depth--; }
    }
    if (open < 0) continue;
    const obj = objAt(src, open);
    if (!obj) continue;
    const has = (k) => new RegExp('(^|[^A-Za-z])' + k + '\\s*:').test(obj);
    const horizontal = has('left') || has('right');
    const bounded = (has('left') && has('right')) || has('width') || has('inset');
    if (!horizontal || bounded) continue;
    const line = src.slice(0, open).split('\n').length;
    /* Only a box that lays out TEXT can overflow this way — a row of glyphs or
       an <Svg> with its own width is bounded already. Look back for the opening
       tag this style belongs to. */
    const head = src.slice(Math.max(0, open - 400), open);
    const tag = (head.match(/<([A-Za-z][A-Za-z0-9_.]*)[^<>]*$/) || [])[1] ?? '?';
    const isText = /^(AppText|Text|Animated\.Text)$/.test(tag);
    hits.push({ file: f, line, tag, isText, text: lines[line - 1].trim().slice(0, 150) });
  }
}

const textOnly = !process.argv.includes('--all');
const shown = textOnly ? hits.filter((h) => h.isText) : hits;
const byFile = new Map();
for (const h of shown) {
  if (!byFile.has(h.file)) byFile.set(h.file, []);
  byFile.get(h.file).push(h);
}
for (const [f, hs] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${f}  (${hs.length})`);
  for (const h of hs) console.log(`  ${String(h.line).padStart(5)}  ${h.text}`);
}
console.log(`\n--- ${shown.length} unbounded absolute ${textOnly ? 'TEXT ' : ''}boxes in ${byFile.size} files (${hits.length} absolute boxes unbounded in total; --all to list them)`);
