#!/usr/bin/env node
/**
 * Transcribe a split design frame into a flat declaration list.
 *
 * Every element on a canvas frame carries its geometry as literal numbers in an
 * inline `style`, so the frame can be read exactly without rendering it. This
 * walks the tag stream (never a regex over `<tag …>text`, which desyncs on HTML
 * comments and on attribute values containing `>`), and prints one line per
 * element: depth, tag, the style declarations that matter, the attributes SVG
 * geometry lives in, and the element's own text.
 *
 * Usage: node scripts/overhaul/decl.mjs <frame.html> [--all] [--text]
 *        --all   keep every declaration, not just the visual ones
 *        --text  print only text runs with their type metrics
 */
import fs from 'node:fs';

const KEEP = new Set([
  'position', 'left', 'right', 'top', 'bottom', 'width', 'height', 'min-width', 'max-width',
  'min-height', 'max-height', 'inset', 'margin', 'margin-left', 'margin-right', 'margin-top',
  'margin-bottom', 'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
  'display', 'flex', 'flex-direction', 'flex-wrap', 'flex-shrink', 'flex-grow', 'align-items',
  'align-self', 'justify-content', 'gap', 'row-gap', 'column-gap', 'grid-template-columns',
  'background', 'background-color', 'background-image', 'background-size', 'backdrop-filter',
  'border', 'border-top', 'border-bottom', 'border-left', 'border-right', 'border-radius',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius',
  'border-bottom-right-radius', 'box-shadow', 'opacity', 'filter', 'mix-blend-mode',
  'color', 'font-size', 'font-weight', 'font-family', 'font-style', 'font-feature-settings',
  'font-variant-numeric', 'letter-spacing', 'line-height', 'text-align', 'text-transform',
  'text-decoration', 'white-space', 'text-overflow', 'overflow', 'overflow-x', 'overflow-y',
  '-webkit-line-clamp', '-webkit-box-orient', 'transform', 'transform-origin', 'z-index',
  'aspect-ratio', 'box-sizing', 'animation', 'transition', 'cursor', 'object-fit',
]);
const SVG_ATTRS = ['viewBox', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2', 'points', 'd', 'fill', 'fill-opacity', 'fill-rule', 'opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'transform', 'clip-path', 'mask', 'src', 'alt', 'id', 'text-anchor', 'dominant-baseline', 'font-size', 'font-weight', 'letter-spacing', 'preserveAspectRatio', 'paint-order', 'data-hero', 'font-family', 'font-style', 'text-decoration', 'clipPathUnits', 'patternUnits'];

const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'use']);

/** Tokenise into tags, comments and text runs. */
export function tokens(html) {
  const out = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) { const t = html.slice(i); if (t.trim()) out.push({ kind: 'text', value: t }); break; }
    if (lt > i) { const t = html.slice(i, lt); if (t.trim()) out.push({ kind: 'text', value: t }); }
    if (html.startsWith('<!--', lt)) { const end = html.indexOf('-->', lt); i = end < 0 ? html.length : end + 3; continue; }
    // Walk to the tag's own '>' respecting quoted attribute values.
    let j = lt + 1, q = null;
    while (j < html.length) {
      const c = html[j];
      if (q) { if (c === q) q = null; }
      else if (c === '"' || c === "'") q = c;
      else if (c === '>') break;
      j++;
    }
    out.push({ kind: 'tag', value: html.slice(lt, j + 1) });
    i = j + 1;
  }
  return out;
}

export function parse(html) {
  const rows = [];
  let depth = 0;
  for (const t of tokens(html)) {
    if (t.kind === 'text') {
      const s = t.value.replace(/\s+/g, ' ').trim();
      if (s) rows.push({ depth, tag: '#text', text: s, decls: {}, attrs: {} });
      continue;
    }
    const tag = t.value;
    if (tag.startsWith('</')) { depth = Math.max(0, depth - 1); continue; }
    const name = (tag.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase() ?? '?';
    const attrs = {};
    for (const m of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)) attrs[m[1]] = m[2];
    const decls = {};
    if (attrs.style) {
      for (const d of attrs.style.split(';')) {
        const k = d.slice(0, d.indexOf(':')).trim();
        const v = d.slice(d.indexOf(':') + 1).trim();
        if (k) decls[k] = v;
      }
      delete attrs.style;
    }
    rows.push({ depth, tag: name, decls, attrs, text: '' });
    if (!tag.endsWith('/>') && !VOID.has(name) && !tag.startsWith('<!')) depth++;
  }
  return rows;
}

// Only act as a CLI when run directly — `body.mjs` imports `parse` from here,
// and a module-level `process.argv` read would otherwise print the frame twice.
const [, , file, ...flags] = process.argv;
if (file && import.meta.url.endsWith('/decl.mjs') && process.argv[1]?.endsWith('decl.mjs')) {
  const all = flags.includes('--all');
  const textOnly = flags.includes('--text');
  const rows = parse(fs.readFileSync(file, 'utf8'));
  for (const r of rows) {
    const pad = '  '.repeat(r.depth);
    if (r.tag === '#text') { console.log(pad + '· ' + r.text); continue; }
    if (textOnly) continue;
    const d = Object.entries(r.decls).filter(([k]) => all || KEEP.has(k)).map(([k, v]) => `${k}:${v}`);
    const a = SVG_ATTRS.filter((k) => r.attrs[k] != null).map((k) => `${k}="${r.attrs[k]}"`);
    console.log(pad + `<${r.tag}> ` + [...a, ...d].join('  '));
  }
}
