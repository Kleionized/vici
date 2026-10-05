#!/usr/bin/env node
/**
 * Frame transcription with the canvas chrome removed.
 *
 * Every frame repeats the same 54px status bar (`· 9:41` plus three glyph SVGs)
 * and, on most, a home indicator. They are the canvas drawing an iPhone, not
 * screen content (DECISIONS.md D009), and they are 20 identical lines on every
 * single frame. This drops that subtree and prints the rest.
 *
 * Usage: node scripts/vicifull/body.mjs <frame.html> [--all]
 */
import fs from 'node:fs';
import { parse } from './decl.mjs';

const KEEP = null;
const [, , file, ...flags] = process.argv;
const rows = parse(fs.readFileSync(file, 'utf8'));
const out = [];
let skipDepth = null;
for (const r of rows) {
  if (skipDepth != null) {
    if (r.depth > skipDepth) continue;
    skipDepth = null;
  }
  // the status bar: an absolute 54-tall strip pinned to the top
  if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0' && r.decls.position === 'absolute') { skipDepth = r.depth; continue; }
  // the home indicator: a 139x5 pill at y 839
  if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px') { skipDepth = r.depth; continue; }
  out.push(r);
}
const SVG_ATTRS = ['viewBox', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2', 'points', 'd', 'fill', 'fill-opacity', 'fill-rule', 'opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'transform', 'clip-path', 'mask', 'src', 'alt', 'id', 'text-anchor', 'dominant-baseline', 'font-size', 'font-weight', 'letter-spacing', 'preserveAspectRatio'];
for (const r of out) {
  const pad = '  '.repeat(r.depth);
  if (r.tag === '#text') { console.log(pad + '· ' + r.text); continue; }
  const d = Object.entries(r.decls).map(([k, v]) => `${k}:${v}`);
  const a = SVG_ATTRS.filter((k) => r.attrs[k] != null).map((k) => `${k}="${r.attrs[k]}"`);
  console.log(pad + `<${r.tag}> ` + [...a, ...d].join('  '));
}
