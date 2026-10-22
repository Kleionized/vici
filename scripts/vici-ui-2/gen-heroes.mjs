#!/usr/bin/env node
/**
 * The hero registry for `Vici UI 2`: every illustration the screens draw, as
 * data react-native-svg can render, keyed by `data-hero` id.
 *
 *   node scripts/vici-ui-2/hero-usage.mjs     (renders every canvas, → pixel-diff/hero-usage.json)
 *   node scripts/vici-ui-2/gen-heroes.mjs     (→ src/content/heroes.ts)
 *
 * Source: the heroes as the screens draw them — the app canvas, the twelve
 * week canvases and the SOS — not the illustration catalog
 * (`Lesson Illustrations v4.dc.html`), whose cards no longer match what the
 * screens use for most ids (D24). Every id is drawn identically wherever a
 * screen uses it (once the canvas's `data-dc-tpl` template marks are removed);
 * the generator throws if that stops being true. Ids only the catalog draws
 * keep the catalog card's art.
 *
 * Unchanged from the previous registry: the 393 × 240 user space, the scale
 * about (196, 190), the designer's `gen/hero-bounds.json` (the new drawings
 * sit inside the old bounds through their own wrapping transform), the
 * lesson-box rule (`heroFit`) and the Today crop. `paint-order="stroke"`
 * shapes are split in two as before; the painted x-extent is measured afresh.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const USAGE = path.join(ROOT, 'pixel-diff/hero-usage.json');
const BOUNDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'Vici UI 2/project/gen/hero-bounds.json'), 'utf8'));
const OUT = path.resolve(ROOT, process.argv[2] ?? 'src/content/heroes.ts');
const fail = (msg) => { console.error('gen-heroes: ' + msg); process.exit(1); };

const PROP = {
  x: 'x', y: 'y', width: 'width', height: 'height', rx: 'rx', ry: 'ry', cx: 'cx', cy: 'cy', r: 'r', d: 'd',
  fill: 'fill', 'fill-opacity': 'fillOpacity', 'fill-rule': 'fillRule',
  stroke: 'stroke', 'stroke-width': 'strokeWidth', 'stroke-opacity': 'strokeOpacity',
  'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray', 'stroke-dashoffset': 'strokeDashoffset',
  opacity: 'opacity', transform: 'transform',
  'text-anchor': 'textAnchor', 'font-size': 'fontSize', 'font-weight': 'fontWeight', 'font-family': 'fontFamily',
  'letter-spacing': 'letterSpacing',
};
const TAGS = new Set(['g', 'rect', 'path', 'circle', 'ellipse', 'text']);
const LATO_FAMILY = { 400: 'Lato_400Regular', 700: 'Lato_700Bold', 900: 'Lato_900Black' };

const norm = (s) => s.replace(/ data-dc-tpl="\d+"/g, '');
const attrsOf = (tag) => [...tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]);

/** Inner markup → tree of { t, a, c, s }. The browser's serialisation: every element closed explicitly. */
function tree(inner) {
  const root = { c: [] };
  const stack = [root];
  const re = /<\/?[^>]+>|[^<]+/g;
  let m;
  while ((m = re.exec(inner))) {
    const tk = m[0];
    const top = stack[stack.length - 1];
    if (!tk.startsWith('<')) { if (tk.trim()) top.s = (top.s ?? '') + tk; continue; }
    if (tk.startsWith('</')) { stack.pop(); continue; }
    const t = tk.match(/^<\s*([A-Za-z0-9-]+)/)[1];
    const node = { t, a: attrsOf(tk), c: [] };
    top.c.push(node);
    if (!tk.endsWith('/>')) stack.push(node);
  }
  if (stack.length !== 1) fail('unbalanced markup');
  return root.c;
}

const counts = { paintOrder: 0 };
function toNodes(n) {
  if (!TAGS.has(n.t)) fail(`unknown element <${n.t}>`);
  const p = {};
  let paintOrder = null;
  const a = Object.fromEntries(n.a);
  for (const [k, v] of n.a) {
    if (k === 'paint-order') { paintOrder = v; continue; }
    if (k === 'font-family') continue;
    const name = PROP[k];
    if (!name) fail(`no react-native-svg prop for ${k}="${v}" on <${n.t}>`);
    p[name] = v;
  }
  if (n.t === 'text') {
    if (!/Lato/.test(a['font-family'] ?? '')) fail('svg text in a face other than Lato');
    const w = Number(a['font-weight'] ?? 400);
    p.fontFamily = LATO_FAMILY[w] ?? fail(`no Lato face for weight ${w}`);
    p.fontWeight = 'normal';
  }
  const node = { t: n.t, p };
  if (n.c.length) node.c = n.c.flatMap(toNodes);
  if (n.s != null) node.s = n.s;
  if (paintOrder == null) return [node];
  if (paintOrder !== 'stroke') fail(`paint-order="${paintOrder}"`);
  if (n.c.length || !p.stroke || p.stroke === 'none' || !p.fill || p.fill === 'none') fail('paint-order on a shape without both fill and stroke');
  if (p.fillOpacity != null || p.opacity != null) fail('paint-order on a translucent shape');
  counts.paintOrder++;
  // the shape as written (its stroke on top), then its fill again over the stroke's inner half
  return [node, { t: n.t, p: { ...p, stroke: 'none' } }];
}

// ── 1. The screens' drawings ──────────────────────────────────────────────
const { uses, drawings } = JSON.parse(fs.readFileSync(USAGE, 'utf8'));
const ALIASES = { windowNight: 'nightMoon' };
const byId = new Map();
const scaleOf = new Map();
for (const u of uses) {
  const id = ALIASES[u.id] ?? u.id;
  const inner = norm(drawings[`${u.id}:${u.h}`]);
  if (!byId.has(id)) byId.set(id, new Map());
  const v = byId.get(id);
  v.set(inner, [...(v.get(inner) ?? []), u]);
  const s = Number((u.attrs.style?.match(/transform:\s*scale\(([\d.]+)\)/) ?? [])[1]);
  if (u.file !== 'illus' && s) scaleOf.set(id, [...(scaleOf.get(id) ?? []), s]);
}
const heroes = [];
const exceptions = [];
const extra = [];
/**
 * Ids no screen of `Vici UI 2` draws but the app still uses on states the
 * bundle does not frame (Today's second day step, Rough Days' loneliness page):
 * the previous bundle's card, first (current) drawing (D24).
 */
const LEGACY = { twoCups: '.overhaul/final/Lesson-Illustrations-v4/Two-cups.html' };
for (const [id, file] of Object.entries(LEGACY)) {
  const html = fs.readFileSync(file, 'utf8');
  const open = html.match(new RegExp(`<svg\\b[^>]*data-hero="${id}"[^>]*>`));
  const start = open.index + open[0].length;
  let depth = 1;
  const re = /<(\/?)svg\b[^>]*>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html))) { if (!m[1]) depth++; else if (--depth === 0) break; }
  extra.push({ id, inner: html.slice(start, m.index), from: 'previous bundle', scale: 1.1 });
}
for (const [id, variants] of byId) {
  const onScreens = [...variants].filter(([, us]) => us.some((u) => u.file !== 'illus'));
  let inner;
  let from;
  if (onScreens.length) {
    onScreens.sort((a, b) => b[1].filter((u) => u.file !== 'illus').length - a[1].filter((u) => u.file !== 'illus').length);
    inner = onScreens[0][0];
    from = 'screens';
    // a frame that draws the id its own way gets the drawing under an id of its own (`calendar2`)
    onScreens.slice(1).forEach(([other, us], i) => {
      const alt = `${id}${i + 2}`;
      exceptions.push(`${alt}: ${id} as ${us.filter((u) => u.file !== 'illus').map((u) => `${u.file}#${u.frame}`).join(', ')} draw it`);
      extra.push({ id: alt, inner: other, from: 'screens', base: id });
    });
  } else {
    // only the catalog draws it: its card's art (the first, current drawing)
    inner = [...variants].sort((a, b) => a[1][0].frame - b[1][0].frame || 0)[0][0];
    from = 'catalog';
  }
  const sc = scaleOf.get(id) ?? [1.1];
  heroes.push({ id, inner, from, scale: sc.sort((a, b) => sc.filter((v) => v === b).length - sc.filter((v) => v === a).length)[0] });
}
for (const e of extra) heroes.push({ ...e, scale: heroes.find((h) => h.id === e.base)?.scale ?? 1.1 });
if (exceptions.length) console.log('frames drawing an id their own way:\n  ' + exceptions.join('\n  '));
heroes.sort((a, b) => a.id.localeCompare(b.id));
/**
 * Drawings drawn without their shelf (D56): the owner found a table under the
 * open book needless. The board and its two legs are dropped, each by its exact
 * rect, before the drawing is measured; a rect that no longer matches stops the
 * run. Its bounds stay the designer's, so the book sits where it did.
 */
const NO_SHELF = { notebook: ['x="72" y="188" width="248"', 'x="84" y="195" width="6"', 'x="302" y="195" width="6"'] };
for (const [id, rects] of Object.entries(NO_SHELF)) {
  const h = heroes.find((x) => x.id === id);
  if (!h) fail(`${id}: no such drawing`);
  for (const r of rects) {
    const re = new RegExp(`<rect ${r}[^>]*>(</rect>)?`);
    if (!re.test(h.inner)) fail(`${id}: no shelf rect ${r}`);
    h.inner = h.inner.replace(re, '');
  }
}
for (const h of heroes) {
  if (h.base && BOUNDS[h.base] && !BOUNDS[h.id]) BOUNDS[h.id] = BOUNDS[h.base];
  h.nodes = tree(h.inner).flatMap(toNodes);
}
/** Ids the designer's bounds file does not know (new drawings): their measured paint, a point outside it (D24). */
const MEASURED = new Set(heroes.filter((h) => !BOUNDS[h.id]).map((h) => h.id));

// ── 2. Painted x-extent (for the crop mode's full-bleed floors) ──────────
const { webkit } = await import('playwright-core');
const { PNG } = await import('pngjs');
const K = 4, OX = 200, OY = 200;
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: K });
await page.setContent(`<body style="margin:0;background:transparent"><svg id="s" width="800" height="600" viewBox="${-OX} ${-OY} 800 600" style="position:absolute;left:0;top:0"></svg></body>`);
let worst = Infinity;
const overruns = [];
for (const h of heroes) {
  await page.evaluate((inner) => { document.getElementById('s').innerHTML = inner; }, h.inner);
  const png = PNG.sync.read(await page.screenshot({ omitBackground: true }));
  let y0 = Infinity, y1 = -1, x0 = Infinity, x1 = -1;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4 + 3] > 0) { y0 = Math.min(y0, y); y1 = y; x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  const top = y0 / K - OY, bottom = (y1 + 1) / K - OY;
  h.paintX = [Math.floor(x0 / K - OX), Math.ceil((x1 + 1) / K - OX)];
  h.paintY = [Math.floor((top - 0.5) * 10) / 10, Math.ceil((bottom + 0.5) * 10) / 10];
  if (MEASURED.has(h.id)) BOUNDS[h.id] = [Math.floor(top - 1), Math.ceil(bottom + 1), h.paintX[0], h.paintX[1]];
  const [t, b] = BOUNDS[h.id];
  worst = Math.min(worst, top - t, b - bottom);
  if (top < t - 0.5 || bottom > b + 0.5) overruns.push(`${h.id} ${top.toFixed(1)}…${bottom.toFixed(1)} (bounds ${t}…${b})`);
}
await browser.close();

// ── 3. Write ──────────────────────────────────────────────────────────────
const heroFit = (id) => {
  const [t, b] = BOUNDS[id];
  const st = Math.floor(190 + (t - 190) * 1.1), sb = Math.ceil(190 + (b - 190) * 1.1);
  return { h: sb - st, top: -st };
};
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k));
const emit = (n, pad) => {
  const p = Object.entries(n.p).map(([k, v]) => `${key(k)}: ${q(v)}`).join(', ');
  const s = n.s != null ? `, s: ${q(n.s)}` : '';
  if (!n.c) return `${pad}{ t: '${n.t}', p: { ${p} }${s} },`;
  return [`${pad}{ t: '${n.t}', p: { ${p} }${s}, c: [`, ...n.c.map((c) => emit(c, pad + '  ')), `${pad}] },`].join('\n');
};
const LABEL = Object.fromEntries(heroes.map((h) => [h.id, h.id.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/ (\w)/g, (m, c) => ' ' + c.toLowerCase())]));

fs.writeFileSync(OUT, `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Every illustration the \`Vici UI 2\` screens draw (the app canvas, the twelve
 * week canvases, the SOS), as data for \`react-native-svg\`, keyed by
 * \`data-hero\` id. Art is in the 393 × 240 user space the screens draw it in;
 * \`src/components/mono/Hero.tsx\` places it. ${heroes.filter((h) => h.from === 'catalog').length} ids only the illustration
 * catalog draws keep its card's art.
 *
 * Attribute values are the canvas's strings, verbatim; names are
 * react-native-svg's. \`paint-order="stroke"\` shapes appear twice (as written,
 * then \`stroke: 'none'\`).
 *
 * Rebuild: node scripts/vici-ui-2/hero-usage.mjs && node scripts/vici-ui-2/gen-heroes.mjs
 */

export type HeroTag = 'g' | 'rect' | 'path' | 'circle' | 'ellipse' | 'text';

export interface HeroNode {
  t: HeroTag;
  /** react-native-svg props, values verbatim from the canvas */
  p: Readonly<Record<string, string>>;
  /** children (\`g\`) */
  c?: readonly HeroNode[];
  /** text content (\`text\`) */
  s?: string;
}

export const HERO_IDS = [
${heroes.map((h) => `  ${q(h.id)},`).join('\n')}
] as const;

export type HeroId = (typeof HERO_IDS)[number];

/** Ids a frame uses for another's art. \`Checkin-Emotions\` tags its art \`windowNight\`; the art is \`nightMoon\`'s (D338). */
export const HERO_ALIASES = { windowNight: 'nightMoon' } as const satisfies Record<string, HeroId>;

export type HeroKey = HeroId | keyof typeof HERO_ALIASES;

export function heroId(key: HeroKey): HeroId {
  return (HERO_ALIASES as Record<string, HeroId>)[key] ?? (key as HeroId);
}

/** A name for each drawing (accessibility, the kit lab). */
export const HERO_LABEL: Record<HeroId, string> = {
${heroes.map((h) => `  ${key(h.id)}: ${q(LABEL[h.id])},`).join('\n')}
};

/** The scale the screens draw the art at (\`transform: scale(s)\` about 196 190). */
export const HERO_SCALE: Record<HeroId, number> = {
${heroes.map((h) => `  ${key(h.id)}: ${h.scale},`).join('\n')}
};

/**
 * The designer's \`gen/hero-bounds.json\`, verbatim: [top, bottom, left, right]
 * in user units. The redrawn art is fitted into these bounds by its own
 * wrapping transform.
 */
export const HERO_BOUNDS: Record<HeroId, readonly [number, number, number, number]> = {
${heroes.map((h) => `  ${key(h.id)}: [${BOUNDS[h.id].join(', ')}],`).join('\n')}
};

/** Each drawing's painted x-extent in user units, measured in WebKit. */
export const HERO_PAINT_X: Record<HeroId, readonly [number, number]> = {
${heroes.map((h) => `  ${key(h.id)}: [${h.paintX.join(', ')}],`).join('\n')}
};

/**
 * Each drawing's painted y-extent in user units (half a unit outside the
 * paint), measured in WebKit. The redrawn art runs past the designer's
 * bounds (HERO_BOUNDS) for ${overruns.length} ids, so the band \`Hero\` draws in spans
 * both.
 */
export const HERO_PAINT_Y: Record<HeroId, readonly [number, number]> = {
${heroes.map((h) => `  ${key(h.id)}: [${h.paintY.join(', ')}],`).join('\n')}
};

/** The lesson reader's hero box (the designer's \`heroFit\`): a \`393 × h\` box with the svg at \`top\`. */
export const HERO_BOX: Record<HeroId, { h: number; top: number }> = {
${heroes.map((h) => { const b = heroFit(h.id); return `  ${key(h.id)}: { h: ${b.h}, top: ${b.top} },`; }).join('\n')}
};

export const HEROES: Record<HeroId, readonly HeroNode[]> = {
${heroes.map((h) => [`  ${key(h.id)}: [`, ...h.nodes.map((n) => emit(n, '    ')), '  ],'].join('\n')).join('\n')}
};
`);
console.log(`art past the designer's bounds: ${overruns.length}`);
console.log(`${heroes.length} heroes (${heroes.filter((h) => h.from === 'catalog').map((h) => h.id).join(', ') || 'none'} from the catalog) · paint-order: ${counts.paintOrder} shapes split · closest bound to paint: ${worst.toFixed(2)} → ${path.relative(ROOT, OUT)}`);
