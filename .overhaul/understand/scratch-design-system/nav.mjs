#!/usr/bin/env node
// Catalogue the top-60 nav rows of every Email-Login frame: left slot, centre, right slot.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

const DIR = '/Users/admin/Documents/Vici/.overhaul/final/Email-Login';
const variants = {};
const desc = (rows, i) => {
  // summarise the subtree at rows[i]
  const r = rows[i]; const out = [];
  for (let j = i + 1; j < rows.length && rows[j].depth > r.depth; j++) {
    const c = rows[j];
    if (c.tag === 'svg') out.push(`svg${c.attrs.width}x${c.attrs.height}`);
    else if (c.tag === 'path') out.push(`path(${c.attrs.d?.slice(0, 22)} ${c.attrs.stroke || c.attrs.fill} sw${c.attrs['stroke-width'] || ''})`);
    else if (c.tag === '#text') out.push(`"${c.text.slice(0, 26)}"`);
    else if (c.tag === 'div' && c.decls.width === '24px' && c.decls.height === '2px') out.push(c.decls.background === '#F2F0EC' || c.decls.background === '#FFFFFF' ? 'D' : 'd');
    else if (c.tag === 'div' || c.tag === 'span') {
      const t = ['font-size', 'font-weight', 'color', 'letter-spacing', 'width', 'height'].filter((k) => c.decls[k]).map((k) => `${k.replace('font-', '')}:${c.decls[k]}`).join(',');
      if (t) out.push(`<${c.tag} ${t}>`);
    }
  }
  return out.join(' ').replace(/(?:[Dd] ?){2,}/g, (m) => `[${m.replace(/ /g, '')}]`);
};
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
  const rows = parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const name = f.replace('.html', '');
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.depth !== 1 || r.decls.top !== '60px' || r.decls.height !== '40px') continue;
    const own = ['left', 'right', 'padding', 'justify-content', 'z-index'].map((k) => `${k}:${r.decls[k] ?? '-'}`).join(' ');
    // children at depth 2
    const kids = [];
    for (let j = i + 1; j < rows.length && rows[j].depth > 1; j++) if (rows[j].depth === 2) {
      const c = rows[j];
      const box = ['width', 'height', 'font-size', 'font-weight', 'color', 'position', 'left', 'right'].filter((k) => c.decls[k]).map((k) => `${k}:${c.decls[k]}`).join(',');
      kids.push(`{${c.tag} ${box} :: ${c.tag === '#text' ? c.text : desc(rows, j)}}`);
    }
    const key = `${own}\n      ${kids.join('\n      ')}`.replace(/"[^"]*"/g, '"…"');
    (variants[key] ||= []).push(name + ' :: ' + kids.map((k) => (k.match(/"([^"]*)"/g) || []).join(' ')).join(' | '));
  }
}
for (const [k, v] of Object.entries(variants).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n=== ${v.length} frames\n   ${k}`);
  for (const x of v) console.log('    - ' + x);
}
