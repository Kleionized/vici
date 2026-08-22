#!/usr/bin/env node
/**
 * Transcribe the 83 task scenes out of `Lessons and Tasks.dc.html` into data.
 *
 * Each `Task DNN Intro` frame draws its picture in a 340 × 200 box built from
 * absolutely-positioned divs, with a handful of `<svg>` subtrees among them.
 * This lifts every layer whole — the divs as boxes, the SVGs as a small element
 * tree — so `TaskScene` can render them without anyone retyping 1,500 shapes.
 *
 * Rebuild: node scripts/uifinal/gen-task-art.mjs
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

/** The scene box: the inner div that holds the layers. */
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
const icons = {};
const missing = [];
for (let day = 1; day <= 84; day++) {
  const file = `${LT}/Task-D${String(day).padStart(2, '0')}-Intro.html`;
  if (!fs.existsSync(file)) {
    missing.push(day);
    continue;
  }
  const box = sceneBox(fs.readFileSync(file, 'utf8'));
  if (!box) {
    missing.push(day);
    continue;
  }
  scenes[day] = layers(box);
  icons[day] = optionIcons(day);
}

const counts = Object.values(scenes).map((l) => l.length);
const svgCount = Object.values(scenes).flat().filter((l) => l.kind === 'svg').length;
console.log(`scenes ${Object.keys(scenes).length}, layers ${counts.reduce((a, b) => a + b, 0)} (min ${Math.min(...counts)}, max ${Math.max(...counts)}), svg layers ${svgCount}`);
if (missing.length) console.log(`no scene for days: ${missing.join(', ')}`);

fs.mkdirSync('src/content', { recursive: true });
const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 83 task scenes, transcribed layer by layer out of the \`Task DNN Intro\`
 * frames in \`UI Final/project/Lessons and Tasks.dc.html\`. Coordinates are
 * scene-local against the canvas's own 340 × 200 box.
 *
 * Day 32 has no frames in the bundle at all, so it has no scene.
 *
 * Rebuild: node scripts/uifinal/gen-task-art.mjs
 */

export interface TaskSvgChild {
  tag: string;
  attrs: Record<string, string>;
}

export interface TaskSceneSvg {
  kind: 'svg';
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  svg: { attrs: Record<string, string>; children: TaskSvgChild[] };
}

export interface TaskSceneBox {
  kind: 'box';
  left?: number;
  right?: number;
  top?: number;
  width?: number;
  height?: number;
  /** The raw CSS \`border-radius\`, including the elliptical \`/\` form. */
  radius?: string;
  background?: string;
  /** CSS blur radius in px — folded into a gradient falloff when drawn. */
  blur?: number;
  rotate?: number;
  opacity?: number;
  shadow?: string;
  mask?: string;
  children?: TaskSceneLayer[];
  /**
   * A run of type inside the box. Exactly one layer in the whole art corpus
   * carries one — the gold \`?\` on \`Lesson 21\`'s plate — and without it the
   * app paints an empty card where the canvas paints a glyph.
   */
  text?: { s: string; size: number; weight: string; color: string };
}

export type TaskSceneLayer = TaskSceneBox | TaskSceneSvg;

/** The box the canvas composes every scene against. */
export const TASK_SCENE_W = 340;
export const TASK_SCENE_H = 200;

export const TASK_SCENES: Record<number, TaskSceneLayer[]> = `;

fs.writeFileSync(
  'src/content/taskScenes.ts',
  header +
    JSON.stringify(scenes, null, 2) +
    ' as unknown as Record<number, TaskSceneLayer[]>;\n\n' +
    '/** The option glyphs, 22 in a 20-unit box, in the order the rows draw them. */\n' +
    'export const TASK_OPTION_ICONS: Record<number, { attrs: Record<string, string>; children: TaskSvgChild[] }[]> = ' +
    JSON.stringify(icons, null, 2) +
    ' as unknown as Record<number, { attrs: Record<string, string>; children: TaskSvgChild[] }[]>;\n',
);
console.log('wrote src/content/taskScenes.ts');
console.log('option glyphs:', Object.values(icons).reduce((a, b) => a + b.length, 0));
