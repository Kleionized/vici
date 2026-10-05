#!/usr/bin/env node
/**
 * Turn every split frame into a structured scene JSON.
 *
 * The point is to stop transcribing frames by hand. Each frame becomes a list
 * of nodes carrying the declarations and SVG attributes verbatim, plus a
 * *structural signature* — the shape of the frame with all numbers and words
 * removed. Frames that share a signature share a template, which is how 30 SOS
 * pickers or 83 task boards get specced once and verified 83 times.
 *
 * Usage: node scripts/overhaul/scene.mjs <bundleSlug> [...]
 * Writes .overhaul/scenes/<bundle>.json
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from './decl.mjs';

const SPLIT = '.overhaul/final';
const OUT = '.overhaul/scenes';

/** Chrome the canvas draws because it is drawing a phone, not a screen. */
function stripChrome(rows) {
  const out = [];
  let skip = null;
  for (const r of rows) {
    if (skip != null) { if (r.depth > skip) continue; skip = null; }
    if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0' && r.decls.position === 'absolute') { skip = r.depth; continue; }
    if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px' && r.decls['border-radius'] === '100px') { skip = r.depth; continue; }
    out.push(r);
  }
  return out;
}

/** The frame's shape with every number, colour and word removed. */
function signature(rows) {
  const parts = [];
  for (const r of rows) {
    if (r.tag === '#text') { parts.push('  '.repeat(r.depth) + 't'); continue; }
    const keys = Object.keys(r.decls).sort().join(',');
    const attrs = Object.keys(r.attrs).filter((k) => k !== 'style').sort().join(',');
    parts.push('  '.repeat(r.depth) + r.tag + '{' + keys + '}' + (attrs ? '[' + attrs + ']' : ''));
  }
  return parts.join('\n');
}

for (const bundle of process.argv.slice(2)) {
  const idx = JSON.parse(fs.readFileSync(path.join(SPLIT, bundle, '_index.json'), 'utf8'));
  const frames = [];
  for (const f of idx.frames) {
    const rows = stripChrome(parse(fs.readFileSync(path.join(SPLIT, bundle, f.file), 'utf8')));
    const sig = signature(rows);
    frames.push({
      label: f.label,
      file: f.file,
      sig: crypto.createHash('sha1').update(sig).digest('hex').slice(0, 12),
      sigText: sig,
      nodes: rows.map((r) => ({ d: r.depth, tag: r.tag, ...(r.tag === '#text' ? { text: r.text } : { css: r.decls, attrs: r.attrs }) })),
      // every literal string on the frame, in document order
      text: rows.filter((r) => r.tag === '#text').map((r) => r.text),
    });
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, bundle + '.json'), JSON.stringify({ bundle, source: idx.source, frames }));
  const groups = new Map();
  for (const f of frames) { if (!groups.has(f.sig)) groups.set(f.sig, []); groups.get(f.sig).push(f.label); }
  console.log(`${bundle}: ${frames.length} frames, ${groups.size} distinct structures`);
}
