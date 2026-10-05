#!/usr/bin/env node
// Group every painted box (has background / shadow / border / radius) by its visual signature,
// and print each signature with its count, frames and the type style of its first text child.
// Usage: node shapes.mjs [--bundle=Email-Login] [--min=1] [--grep=re]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

const ROOT = '/Users/admin/Documents/Vici/.overhaul/final';
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const only = args.bundle ? [args.bundle] : fs.readdirSync(ROOT).filter((d) => d !== 'Lesson-Illustrations-v4' && fs.statSync(path.join(ROOT, d)).isDirectory());
const SIG = ['width', 'height', 'min-width', 'min-height', 'border-radius', 'background', 'box-shadow', 'border', 'border-top', 'border-bottom', 'border-left', 'padding', 'opacity'];
const bag = {};
for (const b of only) {
  for (const f of fs.readdirSync(path.join(ROOT, b)).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
    const frame = b === 'Email-Login' ? f.replace(/\.html$/, '') : `${b.slice(0, 7)}/${f.replace(/\.html$/, '')}`;
    const rows = parse(fs.readFileSync(path.join(ROOT, b, f), 'utf8'));
    let skip = null;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (skip != null) { if (r.depth > skip) continue; skip = null; }
      if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0') { skip = r.depth; continue; }
      if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px') { skip = r.depth; continue; }
      if (r.tag === '#text' || ['svg', 'path', 'rect', 'circle', 'ellipse', 'g', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'lineargradient', 'stop', 'radialgradient', 'clippath', 'mask'].includes(r.tag)) continue;
      const d = r.decls;
      if (!(d.background || d['box-shadow'] || d.border || d['border-radius'] || d['border-top'] || d['border-left'] || d['border-bottom'])) continue;
      if (d['background-image']) continue;
      if (d.width === '393px' && d.height === '852px') continue;
      const key = SIG.filter((k) => d[k] != null).map((k) => `${k}:${d[k]}`).join('; ');
      // first text below + its type
      let txt = '', type = '';
      for (let j = i + 1; j < rows.length && rows[j].depth > r.depth; j++) {
        if (rows[j].tag === '#text') {
          txt = rows[j].text.slice(0, 24);
          const p = rows.slice(i, j).reverse();
          const eff = {};
          for (const a of p) for (const k of ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'font-style']) if (eff[k] == null && a.decls[k] != null && a.depth < rows[j].depth) eff[k] = a.decls[k];
          type = ['font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'color'].filter((k) => eff[k]).map((k) => eff[k]).join(' ');
          break;
        }
      }
      let svg = '';
      for (let j = i + 1; j < rows.length && rows[j].depth > r.depth; j++) if (rows[j].tag === 'svg') { const n = rows[j + 1]; svg = `svg${rows[j].attrs.width}x${rows[j].attrs.height}` + (n ? ` ${n.tag}${n.attrs.d ? ' d=' + n.attrs.d.slice(0, 30) : ''} ${n.attrs.stroke ? 'stroke=' + n.attrs.stroke : ''}${n.attrs.fill ? ' fill=' + n.attrs.fill : ''}` : ''); break; }
      const e = (bag[key] ||= { n: 0, frames: new Set(), txt: {}, type: {}, svg: {}, layout: {} });
      e.n++; e.frames.add(frame);
      if (txt) e.txt[txt] = (e.txt[txt] || 0) + 1;
      if (type) e.type[type] = (e.type[type] || 0) + 1;
      if (svg) e.svg[svg] = (e.svg[svg] || 0) + 1;
      const lay = ['display', 'align-items', 'justify-content', 'gap', 'flex-direction', 'position', 'left', 'right', 'top', 'bottom', 'margin-top', 'flex'].filter((k) => d[k] != null).map((k) => `${k}:${d[k]}`).join(' ');
      e.layout[lay] = (e.layout[lay] || 0) + 1;
    }
  }
}
const min = +(args.min || 1);
const re = args.grep ? new RegExp(args.grep) : null;
const top = (o, n = 4) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k}×${v}`).join(' | ');
for (const [k, e] of Object.entries(bag).sort((a, b) => b[1].n - a[1].n)) {
  if (e.n < min) continue;
  if (re && !re.test(k)) continue;
  const fr = [...e.frames];
  console.log(`${String(e.n).padStart(5)} ${String(fr.length).padStart(4)}f  ${k}`);
  if (Object.keys(e.type).length) console.log(`              type: ${top(e.type, 3)}   txt: ${top(e.txt, 4)}`);
  if (Object.keys(e.svg).length) console.log(`              svg: ${top(e.svg, 2)}`);
  console.log(`              layout: ${top(e.layout, 2)}`);
  console.log(`              frames: ${fr.slice(0, 10).join(' ')}${fr.length > 10 ? ' …' : ''}`);
}
