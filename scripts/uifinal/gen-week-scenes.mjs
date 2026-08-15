#!/usr/bin/env node
/**
 * Transcribe the twelve week-overview scenes out of the canvas into data.
 *
 * Each `Week …` frame draws its picture as a stack of absolutely-positioned
 * divs inside a 258pt band. Rather than retype 150-odd boxes, this reads them
 * straight off the frame: every layer's box, radius, fill, transform and blur,
 * in paint order, band-local (so no −54 is owed — the band's own top pays it).
 *
 * Rebuild: node scripts/uifinal/gen-week-scenes.mjs
 */
import fs from 'node:fs';

const EL = '.uifinal/final/Email Login';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Split into tags/text, tracking depth, so a subtree can be lifted out whole. */
function sceneBand(html) {
  // The band is the div whose style carries the scene gradient.
  const marker = "linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)";
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = html.lastIndexOf('<div', at);
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const open = html.indexOf('<div', i);
    const close = html.indexOf('</div>', i);
    if (close < 0) break;
    if (open >= 0 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      i = close + 6;
      if (depth === 0) return html.slice(start, i);
    }
  }
  return null;
}

const num = (s) => (s == null ? undefined : Number(s));

/** Every direct child box of the band, in paint order. */
function layers(band) {
  const out = [];
  // Skip the band's own opening tag, then read each child's opening tag.
  const inner = band.slice(band.indexOf('>') + 1);
  const re = /<(div|svg)([^>]*)>/g;
  let m;
  let depth = 0;
  let i = 0;
  // Walk with a depth counter so only depth-0 children are collected.
  const parts = inner.split(/(<[^>]*>)/g).filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('</')) {
      depth--;
      continue;
    }
    if (part.startsWith('<') && !part.startsWith('<!')) {
      const name = (part.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
      const style = (part.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
      if (depth === 0) {
        const g = (prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
        // An <svg> layer carries its size on attributes and its geometry as
        // inner markup, so reading only `style` left three birds as empty stubs.
        if (name === 'svg') {
          const rest = inner.slice(inner.indexOf(part));
          const end = rest.indexOf('</svg>');
          const kids = [];
          for (const k of rest.slice(0, end).matchAll(/<(path|circle|rect|ellipse|line|polygon|polyline)\b([^>]*)>/gi)) {
            const a = {};
            for (const at of k[2].matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) a[at[1]] = at[2];
            kids.push({ tag: k[1].toLowerCase(), attrs: a });
          }
          const attr = (n2) => (part.match(new RegExp(`\\s${n2}="([^"]*)"`)) || [])[1];
          out.push({
            svgLayer: true,
            left: num(g('left')?.replace('px', '')),
            top: num(g('top')?.replace('px', '')),
            svgWidth: num(attr('width')),
            svgHeight: num(attr('height')),
            viewBox: attr('viewBox'),
            children: kids,
          });
          depth++;
          continue;
        }
        out.push({
          tag: name,
          left: num(g('left')?.replace('px', '')),
          right: num(g('right')?.replace('px', '')),
          top: num(g('top')?.replace('px', '')),
          bottom: g('bottom'),
          width: g('width'),
          height: g('height'),
          radius: g('border-radius'),
          background: g('background') ?? g('background-image'),
          filter: g('filter'),
          transform: g('transform'),
          clipPath: g('clip-path'),
          opacity: num(g('opacity')),
          raw: part.length > 400 ? part.slice(0, 400) + '…' : part,
        });
      }
      const selfClosing = part.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source'].includes(name);
      if (!selfClosing) depth++;
    }
  }
  return out;
}

const scenes = {};
for (const file of fs.readdirSync(EL)) {
  const m = file.match(/^Week-([IVX]+)-(.*)\.html$/);
  if (!m || /-P2\.html$/.test(file)) continue;
  const n = ROMAN.indexOf(m[1]) + 1;
  const band = sceneBand(fs.readFileSync(`${EL}/${file}`, 'utf8'));
  if (!band) throw new Error(`no scene band in ${file}`);
  scenes[n] = layers(band);
}

const counts = Object.entries(scenes).map(([n, l]) => `W${n}:${l.length}`).join(' ');
console.log(`scenes: ${Object.keys(scenes).length} — layers ${counts}`);
fs.mkdirSync('.uifinal/extract', { recursive: true });
fs.writeFileSync('.uifinal/extract/week-scenes.json', JSON.stringify(scenes, null, 2));

/* ------------------------------------------------------------------- emit */

const px = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));
const q = (v) => JSON.stringify(v);

/** `50% 50% 0 0 / 26px 26px 0 0` -> 26; `8px` -> 8; `50%` -> 'circle'. */
function radiusOf(r) {
  if (!r) return { kind: 'none' };
  if (r === '50%') return { kind: 'ellipse' };
  const dome = r.match(/^50% 50% 0 0 \/ ([0-9.]+)px/);
  if (dome) return { kind: 'dome', ry: Number(dome[1]) };
  const parts = r.split(/\s+/).map((p) => Number(p.replace('px', '')));
  if (parts.length === 1) return { kind: 'round', r: parts[0] };
  return { kind: 'corners', corners: parts };
}

const lines = [];
lines.push('/**');
lines.push(' * GENERATED FILE — do not edit by hand.');
lines.push(' *');
lines.push(' * The twelve week-overview scenes, transcribed layer by layer out of the');
lines.push(' * `Week …` frames in `UI Final/project/Email Login.dc.html`. Coordinates are');
lines.push(" * band-local: the band's own top already pays the canvas's 54pt status bar.");
lines.push(' *');
lines.push(' * Rebuild: node scripts/uifinal/gen-week-scenes.mjs');
lines.push(' */');
lines.push('');
lines.push('export interface WeekSceneLayer {');
lines.push('  left?: number;');
lines.push('  right?: number;');
lines.push('  top?: number;');
lines.push("  /** `bottom:0` on the closing fade. */");
lines.push('  bottom?: number;');
lines.push('  width?: number;');
lines.push('  height?: number;');
lines.push("  /** How the box's corners are cut. */");
lines.push("  radius: { kind: 'none' } | { kind: 'ellipse' } | { kind: 'round'; r: number } | { kind: 'dome'; ry: number } | { kind: 'corners'; corners: number[] };");
lines.push("  /** An inline `<svg>` layer: the canvas draws a few birds this way. */");
lines.push('  svg?: { left: number; top: number; width: number; height: number; viewBox: string; children: { tag: string; attrs: Record<string, string> }[] };');
lines.push('  background?: string;');
lines.push("  /** CSS blur radius, in px — folded into a gradient falloff when drawn. */");
lines.push('  blur?: number;');
lines.push("  /** Degrees, about the box's own centre. */");
lines.push('  rotate?: number;');
lines.push("  /** A `polygon(…)` clip, as its raw percentage/px point list. */");
lines.push('  clip?: string;');
lines.push('  opacity?: number;');
lines.push('}');
lines.push('');
lines.push('export const WEEK_SCENES: Record<number, WeekSceneLayer[]> = {');
for (const n of Object.keys(scenes).map(Number).sort((a, b) => a - b)) {
  lines.push(`  ${n}: [`);
  for (const l of scenes[n]) {
    if (l.svgLayer) {
      const kids = l.children.map((k) => `{ tag: ${q(k.tag)}, attrs: ${JSON.stringify(k.attrs)} }`).join(', ');
      lines.push(
        `    { svg: { left: ${l.left ?? 0}, top: ${l.top ?? 0}, width: ${l.svgWidth}, height: ${l.svgHeight}, viewBox: ${q(l.viewBox)}, children: [${kids}] }, radius: { kind: 'none' } },`,
      );
      continue;
    }
    const fields = [];
    if (l.left != null) fields.push(`left: ${l.left}`);
    if (l.right != null) fields.push(`right: ${l.right}`);
    if (l.top != null) fields.push(`top: ${l.top}`);
    if (l.bottom != null) fields.push(`bottom: ${px(l.bottom) ?? 0}`);
    const w = px(l.width);
    const h = px(l.height);
    if (w != null && !Number.isNaN(w)) fields.push(`width: ${w}`);
    if (h != null && !Number.isNaN(h)) fields.push(`height: ${h}`);
    fields.push(`radius: ${JSON.stringify(radiusOf(l.radius))}`);
    if (l.background) fields.push(`background: ${q(l.background)}`);
    const blur = l.filter && l.filter.match(/blur\(([0-9.]+)px\)/);
    if (blur) fields.push(`blur: ${Number(blur[1])}`);
    const rot = l.transform && l.transform.match(/rotate\((-?[0-9.]+)deg\)/);
    if (rot) fields.push(`rotate: ${Number(rot[1])}`);
    if (l.clipPath) fields.push(`clip: ${q(l.clipPath)}`);
    if (l.opacity != null) fields.push(`opacity: ${l.opacity}`);
    lines.push(`    { ${fields.join(', ')} },`);
  }
  lines.push('  ],');
}
lines.push('};');
lines.push('');
fs.writeFileSync('src/content/weekScenes.ts', lines.join('\n'));
console.log(`wrote src/content/weekScenes.ts (${lines.length} lines)`);
