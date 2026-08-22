#!/usr/bin/env node
/**
 * Transcribe the 83 lesson-card plates out of `Lessons and Tasks.dc.html`.
 *
 * Each `Lesson NN` frame draws a 240 × 200 illustration at sheet (76, 150),
 * built the same way the task scenes are. Same lifter, different box.
 *
 * Rebuild: node scripts/uifinal/gen-lesson-art.mjs
 */
import fs from 'node:fs';

const LT = '.uifinal/final/Lessons and Tasks';

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
  const at = html.indexOf('position:absolute; inset:0; overflow:hidden');
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
    // `Lesson 23`, `Lesson 70` and `Lesson 74` each carry a stray `</svg>` that
    // closes nothing. A browser ignores it; this loop used to stop dead on it
    // and drop every layer after it — eight layers on day 23, four on day 70,
    // six on day 74. Step over an unmatched closing tag and keep reading.
    if (inner.startsWith('</', next)) {
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
        // and the one box in the corpus that holds a run of type
        text: (() => {
          const body = whole.slice(whole.indexOf('>') + 1, whole.lastIndexOf('</'));
          const run = body.trim();
          if (!run || run.includes('<')) return undefined;
          return {
            s: run,
            size: px(decl(style, 'font-size')),
            weight: decl(style, 'font-weight') ?? '400',
            color: decl(style, 'color'),
          };
        })(),
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


const plates = {};
const missing = [];
for (let day = 1; day <= 84; day++) {
  const file = `${LT}/Lesson-${String(day).padStart(2, '0')}.html`;
  if (!fs.existsSync(file)) {
    missing.push(day);
    continue;
  }
  const box = sceneBox(fs.readFileSync(file, 'utf8'));
  if (!box) {
    missing.push(day);
    continue;
  }
  plates[day] = layers(box);
}

const counts = Object.values(plates).map((l) => l.length);
console.log(`plates ${Object.keys(plates).length}, layers ${counts.reduce((a, b) => a + b, 0)} (min ${Math.min(...counts)}, max ${Math.max(...counts)})`);
if (missing.length) console.log(`no plate for days: ${missing.join(', ')}`);

const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 83 lesson-card plates, transcribed layer by layer out of the \`Lesson NN\`
 * frames in \`UI Final/project/Lessons and Tasks.dc.html\`. Coordinates are
 * plate-local against the canvas's own 240 × 200 box, which sits at sheet
 * (76, 150).
 *
 * Day 32 has no card frame in the bundle, so it has no plate.
 *
 * Rebuild: node scripts/uifinal/gen-lesson-art.mjs
 */

import type { TaskSceneLayer } from './taskScenes';

/** The box the canvas composes every plate against. */
export const LESSON_PLATE_W = 240;
export const LESSON_PLATE_H = 200;

export const LESSON_PLATES: Record<number, TaskSceneLayer[]> = `;

fs.writeFileSync('src/content/lessonPlates.ts', header + JSON.stringify(plates, null, 2) + ' as unknown as Record<number, TaskSceneLayer[]>;\n');
console.log('wrote src/content/lessonPlates.ts');
