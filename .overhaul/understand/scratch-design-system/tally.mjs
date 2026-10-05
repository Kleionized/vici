#!/usr/bin/env node
// Tally the visual vocabulary of every split frame (Email-Login + the 12 week canvases).
// Usage: node .overhaul/understand/scratch-design-system/tally.mjs > out.txt
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

const ROOT = '/Users/admin/Documents/Vici/.overhaul/final';
const OUT = '/Users/admin/Documents/Vici/.overhaul/understand/scratch-design-system';
const bundles = fs.readdirSync(ROOT).filter((d) => fs.statSync(path.join(ROOT, d)).isDirectory());

const COLOR_RE = /#[0-9A-Fa-f]{3,8}\b|rgba?\([^)]*\)|\btransparent\b|\bwhite\b|\bblack\b/g;
const INHERIT = ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'font-style', 'font-family', 'text-align', 'white-space', 'text-wrap', 'text-transform'];

const T = {
  colors: {}, // color -> {n, props:{}, bundles:{}}
  type: {}, // combo -> {n, frames:Set}
  radius: {}, shadow: {}, opacity: {}, letterSpacing: {}, lineHeight: {}, fontSize: {}, fontWeight: {}, fontStyle: {},
  frameBg: {}, frameShadow: {}, noise: {}, statusColor: {}, homeColor: {},
  absPos: {}, // depth-1 absolute element geometry signature
  transform: {}, filter: {}, border: {}, svgText: {}, imgs: {}, textWrap: {}, gap: {}, padding: {},
};
const bump = (bag, key, frame, extra) => {
  const e = (bag[key] ||= { n: 0, frames: new Set() });
  e.n++; e.frames.add(frame);
  if (extra) for (const [k, v] of Object.entries(extra)) { e[k] ||= {}; e[k][v] = (e[k][v] || 0) + 1; }
};
const perFrame = {};

for (const b of bundles) {
  const dir = path.join(ROOT, b);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
    const frame = `${b}/${f.replace(/\.html$/, '')}`;
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    const rows = parse(html);
    const stack = []; // ancestors by depth
    let skipDepth = null, skipKind = null;
    const pf = (perFrame[frame] = { bundle: b });
    // the root: first div with width 393px (frames) or the illustration card
    const root = rows.find((r) => r.tag === 'div' && r.decls.width === '393px' && r.decls.height === '852px');
    if (root) {
      pf.bg = root.decls.background; pf.shadow = root.decls['box-shadow'];
      bump(T.frameBg, root.decls.background || '(none)', frame);
      bump(T.frameShadow, root.decls['box-shadow'] || '(none)', frame);
    }
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      stack.length = r.depth; stack[r.depth] = r;
      // status bar / home indicator subtrees
      if (skipDepth != null) {
        if (r.depth > skipDepth) {
          if (skipKind === 'status' && r.tag === 'span' && r.decls.color) { pf.status = r.decls.color; bump(T.statusColor, r.decls.color, frame); }
          continue;
        }
        skipDepth = null;
      }
      if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0' && r.decls.position === 'absolute') { skipDepth = r.depth; skipKind = 'status'; continue; }
      if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px') { pf.home = r.decls.background; bump(T.homeColor, r.decls.background, frame); skipDepth = r.depth; skipKind = 'home'; continue; }

      // noise overlay
      if (r.decls['background-image'] && /noise/.test(r.decls['background-image'])) {
        const key = `${r.decls['background-image']} op ${r.decls.opacity} ${r.decls.inset ? 'inset:' + r.decls.inset : ''} on ${pf.bg}`;
        bump(T.noise, key, frame);
        if (r.depth === 1) pf.noise = key;
      }
      if (r.tag === '#text') {
        // effective type from the ancestor chain (closest declaration wins)
        const eff = {};
        for (let d = r.depth - 1; d >= 0; d--) {
          const a = stack[d]; if (!a) continue;
          for (const k of INHERIT) if (eff[k] == null && a.decls[k] != null) eff[k] = a.decls[k];
          // SVG <text>
          if (a.tag === 'text' || a.tag === 'tspan') {
            if (eff['font-size'] == null && a.attrs['font-size']) eff['font-size'] = a.attrs['font-size'] + '(svg)';
            if (eff['font-weight'] == null && a.attrs['font-weight']) eff['font-weight'] = a.attrs['font-weight'];
            if (eff.color == null && a.attrs.fill) eff.color = a.attrs.fill;
            if (eff['letter-spacing'] == null && a.attrs['letter-spacing']) eff['letter-spacing'] = a.attrs['letter-spacing'];
          }
        }
        const fs_ = eff['font-size'] || '16px(default)';
        const fw = eff['font-weight'] || '400';
        const lh = eff['line-height'] || 'normal';
        const ls = eff['letter-spacing'] || '0';
        const c = eff.color || '(inherit-none)';
        const st = eff['font-style'] && eff['font-style'] !== 'normal' ? ` ${eff['font-style']}` : '';
        const key = `${fs_} / ${fw}${st} / lh ${lh} / ls ${ls} / ${c}`;
        bump(T.type, key, frame, { sample: r.text.slice(0, 40) });
        bump(T.fontSize, fs_, frame); bump(T.fontWeight, fw + st, frame);
        if (st) bump(T.fontStyle, `${eff['font-style']} ${fw}`, frame, { sample: r.text.slice(0, 60) });
        if (eff['text-wrap']) bump(T.textWrap, eff['text-wrap'], frame);
        continue;
      }
      // declarations
      for (const [k, v] of Object.entries(r.decls)) {
        for (const m of String(v).matchAll(COLOR_RE)) bump(T.colors, m[0].replace(/\s+/g, ''), frame, { props: k, bundle: b });
        if (k === 'border-radius' || /radius/.test(k)) bump(T.radius, `${k}:${v}`, frame);
        if (k === 'box-shadow') bump(T.shadow, v, frame);
        if (k === 'opacity') bump(T.opacity, v, frame, { tag: r.tag });
        if (k === 'letter-spacing') bump(T.letterSpacing, v, frame);
        if (k === 'line-height') bump(T.lineHeight, v, frame);
        if (k === 'transform') bump(T.transform, v, frame);
        if (k === 'filter' || k === 'backdrop-filter') bump(T.filter, `${k}:${v}`, frame);
        if (/^border(-top|-bottom|-left|-right)?$/.test(k)) bump(T.border, `${k}:${v}`, frame);
        if (k === 'gap') bump(T.gap, v, frame);
      }
      for (const k of ['fill', 'stroke', 'stop-color']) {
        if (r.attrs[k]) for (const m of r.attrs[k].matchAll(COLOR_RE)) bump(T.colors, m[0].replace(/\s+/g, ''), frame, { props: `svg:${k}`, bundle: b });
      }
      if (r.attrs.opacity || r.attrs['fill-opacity'] || r.attrs['stroke-opacity'] || r.attrs['stop-opacity']) {
        for (const k of ['opacity', 'fill-opacity', 'stroke-opacity', 'stop-opacity']) if (r.attrs[k]) bump(T.opacity, `svg ${k}=${r.attrs[k]}`, frame, { tag: r.tag });
      }
      if (r.tag === 'img') bump(T.imgs, `${r.attrs.src} ${r.attrs.width}x${r.attrs.height} ${r.decls.filter || ''}`, frame);
      if (r.depth === 1 && r.decls.position === 'absolute') {
        const g = ['left', 'right', 'top', 'bottom', 'width', 'height', 'inset'].filter((k) => r.decls[k] != null).map((k) => `${k}:${r.decls[k]}`).join(' ');
        bump(T.absPos, g, frame);
      }
    }
  }
}

const ser = (bag, limit = 9999, minN = 1) => Object.entries(bag)
  .sort((a, b) => b[1].n - a[1].n)
  .filter(([, v]) => v.n >= minN)
  .slice(0, limit)
  .map(([k, v]) => {
    const o = { key: k, n: v.n, frames: v.frames.size };
    const fl = [...v.frames];
    o.ex = fl.slice(0, 6);
    for (const kk of ['props', 'bundle', 'sample', 'tag']) if (v[kk]) o[kk] = Object.entries(v[kk]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([x, n]) => `${x}×${n}`).join(', ');
    return o;
  });

const out = {};
for (const [k, bag] of Object.entries(T)) out[k] = ser(bag);
fs.writeFileSync(path.join(OUT, 'tally.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(OUT, 'perframe.json'), JSON.stringify(perFrame, null, 1));

const show = (title, list, limit = 60) => {
  console.log(`\n## ${title} (${list.length} distinct)`);
  for (const e of list.slice(0, limit)) console.log(`${String(e.n).padStart(6)} ${String(e.frames).padStart(5)}f  ${e.key}${e.props ? '   [' + e.props + ']' : ''}${e.bundle ? '   {' + e.bundle + '}' : ''}${e.sample ? '   «' + e.sample + '»' : ''}   e.g. ${e.ex.slice(0, 3).join(' ')}`);
};
show('frame backgrounds', out.frameBg);
show('frame shadows', out.frameShadow);
show('noise layers', out.noise);
show('status bar text colour', out.statusColor);
show('home indicator colour', out.homeColor);
show('colours', out.colors, 200);
show('font sizes', out.fontSize, 100);
show('font weights', out.fontWeight);
show('font styles', out.fontStyle);
show('letter-spacing', out.letterSpacing, 100);
show('line-height', out.lineHeight, 100);
show('border-radius', out.radius, 150);
show('box-shadow', out.shadow, 100);
show('opacity', out.opacity, 100);
show('borders', out.border, 100);
show('filters', out.filter);
show('transforms', out.transform, 80);
show('images', out.imgs);
show('text-wrap', out.textWrap);
show('type combos', out.type, 400);
show('depth-1 absolute positions', out.absPos, 150);
