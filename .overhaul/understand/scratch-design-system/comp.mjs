#!/usr/bin/env node
// Detect kit components in every Email-Login frame and group instances into exact variants.
// Usage: node comp.mjs [component] [--bundle=Email-Login|weeks|all]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

const ROOT = '/Users/admin/Documents/Vici/.overhaul/final';
const args = process.argv.slice(2);
const want = args.find((a) => !a.startsWith('--'));
const bundleArg = (args.find((a) => a.startsWith('--bundle=')) || '--bundle=Email-Login').split('=')[1];
const bundles = bundleArg === 'all' ? fs.readdirSync(ROOT).filter((d) => d !== 'Lesson-Illustrations-v4' && !d.includes('.'))
  : bundleArg === 'weeks' ? fs.readdirSync(ROOT).filter((d) => d.startsWith('Week-')) : [bundleArg];

const D = (r, ks) => ks.filter((k) => r.decls[k] != null).map((k) => `${k}:${r.decls[k]}`).join('; ');
const ALLD = (r) => Object.entries(r.decls).filter(([k]) => k !== 'cursor').map(([k, v]) => `${k}:${v}`).join('; ');
const sub = (rows, i) => { const out = []; for (let j = i + 1; j < rows.length && rows[j].depth > rows[i].depth; j++) out.push(rows[j]); return out; };
const subDesc = (rows, i, max = 6) => sub(rows, i).slice(0, max).map((c) => c.tag === '#text' ? `"${c.text.slice(0, 20)}"` : c.tag === 'path' ? `path[${c.attrs.d?.slice(0, 18)}|${c.attrs.stroke || c.attrs.fill}|${c.attrs['stroke-width'] || ''}]` : c.tag === 'svg' ? `svg${c.attrs.width}x${c.attrs.height}/${c.attrs.viewBox}` : `<${c.tag} ${ALLD(c)}>`).join(' ');

const C = {
  primary: (r) => r.decls.height === '58px' && r.decls['border-radius'] === '29px',
  ghost: (r, rows, i) => r.depth === 1 && r.decls.position === 'absolute' && r.decls.left === '0' && r.decls.right === '0' && r.decls.bottom && r.decls['text-align'] === 'center',
  fab: (r) => r.decls.width === '60px' && r.decls.height === '60px' && r.decls.position === 'absolute',
  ring44: (r) => r.decls.width === '44px' && r.decls.height === '44px',
  option: (r) => r.decls.height === '58px' && r.decls['border-radius'] === '18px',
  grid: (r) => r.decls['grid-template-columns'] != null,
  chip48: (r) => r.decls.height === '48px' && r.decls['border-radius'] === '24px',
  chipMin: (r) => r.decls['min-height'] && r.decls['border-radius'],
  pill: (r) => /^(24|28|30|32|34|36|44)px$/.test(r.decls.height || '') && r.decls['border-radius'] === `${parseInt(r.decls.height) / 2}px` && !r.decls.width,
  segmented: (r) => r.decls.height === '44px' && r.decls.padding === '4px',
  card: (r) => /^(18|20|22|24|26)px$/.test(r.decls['border-radius'] || '') && !r.decls.height && (r.decls.background === '#1E1E1E' || r.decls['box-shadow']),
  listRow: (r) => /solid #2E2E2E/.test(r.decls['border-top'] || ''),
  toggle: (r) => r.decls.width === '50px' && r.decls.height === '30px',
  tabbar: (r) => r.decls.bottom === '0' && r.decls.height === '104px',
  sheet: (r) => /28px 28px 0 0|24px 24px 0 0/.test(r.decls['border-radius'] || '') || /rgba\(0,0,0,0\.68\)/.test(r.decls.background || ''),
  dots: (r, rows, i) => r.decls.gap === '7px' && r.decls['justify-content'] === 'center',
  input: (r) => /^(2px)$/.test(r.decls.width || '') && /^(22px|24px)$/.test(r.decls.height || ''),
  h1: (r) => r.decls['font-size'] && parseInt(r.decls['font-size']) >= 22 && r.decls['font-weight'] === '700',
  caps: (r) => r.decls['font-size'] === '13px' && r.decls['font-weight'] === '700',
  body: (r) => r.decls['font-weight'] === '400' && r.decls['line-height'],
  check: (r) => r.tag === 'path' && r.attrs.d === 'M2 7.5l3.2 3L12 3.5',
  chevR: (r) => r.tag === 'path' && r.attrs.d === 'M5 2l5 5-5 5',
  chevL: (r) => r.tag === 'path' && r.attrs.d === 'M10 2L2 10l8 8',
  chevD: (r) => r.tag === 'path' && r.attrs.d === 'M2 5l5 5 5-5',
  closeX: (r) => r.tag === 'path' && r.attrs.d === 'M2 2l14 14M16 2L2 16',
  fabChev: (r) => r.tag === 'path' && r.attrs.d === 'M2 2l8 8-8 8',
  share: (r) => r.tag === 'path' && /^M9 11V2/.test(r.attrs.d || ''),
  img: (r) => r.tag === 'img',
  hero: (r) => r.tag === 'svg' && r.decls.transform && /scale/.test(r.decls.transform),
  gradient: (r) => /gradient/.test(r.decls.background || ''),
  scrim: (r) => r.depth === 1 && r.decls.inset === '0' && !r.decls['background-image'],
  big: (r) => r.decls['font-size'] && parseInt(r.decls['font-size']) >= 40,
};

const res = {};
for (const b of bundles) {
  for (const f of fs.readdirSync(path.join(ROOT, b)).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
    const frame = (b === 'Email-Login' ? '' : b.slice(5, 7) + '/') + f.replace(/\.html$/, '');
    const rows = parse(fs.readFileSync(path.join(ROOT, b, f), 'utf8'));
    let skip = null;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (skip != null) { if (r.depth > skip) continue; skip = null; }
      if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0') { skip = r.depth; continue; }
      if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px') { skip = r.depth; continue; }
      if (r.tag === '#text') continue;
      for (const [name, pred] of Object.entries(C)) {
        if (want && want !== name) continue;
        if (!pred(r, rows, i)) continue;
        let key;
        if (r.tag === 'path' || r.tag === 'img') key = `${r.tag} ${Object.entries(r.attrs).map(([k, v]) => `${k}=${v}`).join(' ')} ${ALLD(r)}`;
        else if (['h1', 'caps', 'body', 'big'].includes(name)) key = D(r, ['font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'color', 'text-align', 'text-wrap', 'white-space', 'max-width', 'width']);
        else key = `${ALLD(r)}  ⟶  ${subDesc(rows, i, name === 'tabbar' ? 40 : name === 'dots' ? 3 : 4)}`;
        key = key.replace(/"[^"]*"/g, '"…"');
        const e = ((res[name] ||= {})[key] ||= { n: 0, frames: new Set(), txt: new Set() });
        e.n++; e.frames.add(frame);
        const t = sub(rows, i).find((c) => c.tag === '#text'); if (t) e.txt.add(t.text.slice(0, 30));
      }
    }
  }
}
for (const [name, vs] of Object.entries(res)) {
  console.log(`\n################ ${name} — ${Object.keys(vs).length} variants`);
  for (const [k, e] of Object.entries(vs).sort((a, b) => b[1].n - a[1].n)) {
    const fr = [...e.frames];
    console.log(`\n  [${e.n}× in ${fr.length}f] ${k}`);
    console.log(`     frames: ${fr.slice(0, 14).join(' ')}${fr.length > 14 ? ` …(+${fr.length - 14})` : ''}`);
    if (e.txt.size) console.log(`     text: ${[...e.txt].slice(0, 8).join(' | ')}`);
  }
}
