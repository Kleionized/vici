#!/usr/bin/env node
/**
 * Transcribe the reader's two remaining drawings out of `Email Login.dc.html`:
 * the 340 × 200 night room on `Lesson Scroll 23`, and the same scene on
 * `Lesson Scroll 18` (the two frames are byte-identical subtrees).
 *
 * Rebuild: node scripts/uifinal/gen-reader-art.mjs
 */
import fs from 'node:fs';

const EL = '.uifinal/final/Email Login';

/** Lift the balanced subtree starting at `start` (which points at a `<tag`). */
function subtree(html, start, tag) {
  let depth = 0;
  let i = start;
  const open = `<${tag}`;
  const close = `</${tag}>`;
  while (i < html.length) {
    const o = html.indexOf(open, i);
    const c = html.indexOf(close, i);
    if (c < 0) return html.slice(start);
    if (o >= 0 && o < c) {
      depth++;
      i = o + open.length;
    } else {
      depth--;
      i = c + close.length;
      if (depth === 0) return html.slice(start, i);
    }
  }
  return html.slice(start);
}

/** The plate: the inner div that holds the layers. */
function sceneBox(html) {
  const at = html.indexOf('width:340px; height:200px; overflow:hidden');
  if (at < 0) return null;
  const start = html.lastIndexOf('<div', at);
  return subtree(html, start, 'div');
}

const attrs = (tagText) => {
  const out = {};
  for (const m of tagText.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
};

const decl = (style, prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
const px = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));

/** SVG children, as a flat element list with their attributes. */
function svgTree(svgText) {
  const openTag = svgText.slice(0, svgText.indexOf('>') + 1);
  const inner = svgText.slice(openTag.length, svgText.lastIndexOf('</svg>'));
  const kids = [];
  for (const m of inner.matchAll(/<(path|rect|circle|ellipse|line|polygon|polyline|g|defs|lineargradient|radialgradient|stop)\b([^>]*)>/gi)) {
    kids.push({ tag: m[1].toLowerCase(), attrs: attrs(m[2]) });
  }
  return { attrs: attrs(openTag), children: kids };
}

/** Every direct child of the scene box, in paint order. */
function layers(box) {
  const inner = box.slice(box.indexOf('>') + 1, box.lastIndexOf('</div>'));
  const out = [];
  let i = 0;
  while (i < inner.length) {
    const next = inner.indexOf('<', i);
    if (next < 0) break;
    if (inner.startsWith('<!', next)) {
      i = inner.indexOf('>', next) + 1;
      continue;
    }
    const tag = (inner.slice(next).match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    if (!tag) break;
    const whole = subtree(inner, next, tag);
    const openTag = whole.slice(0, whole.indexOf('>') + 1);
    const style = (openTag.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
    if (tag === 'svg') {
      out.push({
        kind: 'svg',
        left: px(decl(style, 'left')),
        top: px(decl(style, 'top')),
        width: px(attrs(openTag).width) ?? px(decl(style, 'width')),
        height: px(attrs(openTag).height) ?? px(decl(style, 'height')),
        viewBox: attrs(openTag).viewBox,
        svg: svgTree(whole),
      });
    } else {
      const radius = decl(style, 'border-radius');
      out.push({
        kind: 'box',
        left: px(decl(style, 'left')),
        right: px(decl(style, 'right')),
        top: px(decl(style, 'top')),
        width: px(decl(style, 'width')),
        height: px(decl(style, 'height')),
        radius,
        background: decl(style, 'background') ?? decl(style, 'background-image'),
        blur: Number((decl(style, 'filter')?.match(/blur\(([0-9.]+)px\)/) || [])[1]) || undefined,
        rotate: Number((decl(style, 'transform')?.match(/rotate\((-?[0-9.]+)deg\)/) || [])[1]) || undefined,
        opacity: Number(decl(style, 'opacity')) || undefined,
        shadow: decl(style, 'box-shadow'),
        mask: decl(style, 'mask') ?? decl(style, '-webkit-mask'),
        // nested children of a plain box, one level deep
        children: (whole.match(/<div/g) || []).length > 1 ? layers(whole) : undefined,
      });
    }
    i = next + whole.length;
  }
  return out;
}

/** The four 22 x 22 option glyphs each Options board carries, in row order. */
function optionIcons(day) {
  const file = `${LT}/Task-D${String(day).padStart(2, '0')}-Options.html`;
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, 'utf8');
  const out = [];
  let i = 0;
  while (true) {
    const at = html.indexOf('<svg', i);
    if (at < 0) break;
    const whole = subtree(html, at, 'svg');
    const a = attrs(whole.slice(0, whole.indexOf('>') + 1));
    // the status bar's three glyphs are 19/17/27 wide; the option glyphs are 22
    if (a.width === '22') out.push(svgTree(whole));
    i = at + whole.length;
  }
  return out;
}



const scenes = {};
for (const [key, slug] of [['room', 'Lesson-Scroll-23'], ['room18', 'Lesson-Scroll-18']]) {
  const file = `${EL}/${slug}.html`;
  if (!fs.existsSync(file)) continue;
  const box = sceneBox(fs.readFileSync(file, 'utf8'));
  if (!box) {
    console.log(`no scene box in ${slug}`);
    continue;
  }
  scenes[key] = layers(box);
}

for (const [k, v] of Object.entries(scenes)) console.log(`${k}: ${v.length} layers`);
const same = JSON.stringify(scenes.room) === JSON.stringify(scenes.room18);
console.log(`frames 18 and 23 identical: ${same}`);

const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * The reader's night room, transcribed layer by layer off \`Lesson Scroll 23\`
 * in \`UI Final/project/Email Login.dc.html\`. Frame 18 draws the same subtree,
 * so both boards share it. Coordinates are scene-local against the canvas's own
 * 340 × 200 box, which the boards scale to 0.85.
 *
 * Rebuild: node scripts/uifinal/gen-reader-art.mjs
 */

import type { TaskSceneLayer } from './taskScenes';

export const READER_ROOM_W = 340;
export const READER_ROOM_H = 200;

export const READER_ROOM: TaskSceneLayer[] = `;

fs.writeFileSync('src/content/readerRoom.ts', header + JSON.stringify(scenes.room ?? [], null, 2) + ' as unknown as TaskSceneLayer[];\n');
console.log('wrote src/content/readerRoom.ts');
