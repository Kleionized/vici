#!/usr/bin/env node
// Inventory every small inline SVG (<= 44px) across Email-Login (+ weeks): its geometry with colours
// abstracted, the colours it is drawn in, and the frames it appears in.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

const ROOT = '/Users/admin/Documents/Vici/.overhaul/final';
const bundles = process.argv.includes('--weeks') ? fs.readdirSync(ROOT).filter((d) => d.startsWith('Week-')) : ['Email-Login'];
const bag = {};
const COLS = ['fill', 'stroke', 'stop-color'];
for (const b of bundles) for (const f of fs.readdirSync(path.join(ROOT, b)).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
  const rows = parse(fs.readFileSync(path.join(ROOT, b, f), 'utf8'));
  let skip = null;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (skip != null) { if (r.depth > skip) continue; skip = null; }
    if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0') { skip = r.depth; continue; }
    if (r.tag !== 'svg') continue;
    const w = parseFloat(r.attrs.width), h = parseFloat(r.attrs.height);
    if (!(w <= 44 && h <= 44)) continue;
    const parts = []; const cols = new Set();
    for (let j = i + 1; j < rows.length && rows[j].depth > r.depth; j++) {
      const c = rows[j]; if (c.tag === '#text') { parts.push(`text"${c.text}"`); continue; }
      const a = { ...c.attrs }; for (const k of COLS) if (a[k] && a[k] !== 'none') { cols.add(`${k}=${a[k]}`); a[k] = '§'; }
      parts.push(`<${c.tag} ${Object.entries(a).map(([k, v]) => `${k}=${v}`).join(' ')}>`);
    }
    const key = `svg ${r.attrs.width}x${r.attrs.height} vb=${r.attrs.viewBox} :: ${parts.join(' ')}`;
    const e = (bag[key] ||= { n: 0, frames: new Set(), cols: {} });
    e.n++; e.frames.add(f.replace('.html', ''));
    const ck = [...cols].join(' '); e.cols[ck] = (e.cols[ck] || 0) + 1;
  }
}
for (const [k, e] of Object.entries(bag).sort((a, b) => b[1].frames.size - a[1].frames.size)) {
  const fr = [...e.frames];
  console.log(`\n[${e.n}× ${fr.length}f] ${k.slice(0, 600)}`);
  console.log(`   colours: ${Object.entries(e.cols).map(([c, n]) => `${c}×${n}`).join(' | ')}`);
  console.log(`   frames: ${fr.slice(0, 12).join(' ')}${fr.length > 12 ? ' …' : ''}`);
}
