#!/usr/bin/env node
/**
 * The hero registry: every illustration the bundle draws at 393 × 240, as data
 * `react-native-svg` can render, keyed by the cards' own `data-hero` ids.
 *
 *   node scripts/overhaul/gen-heroes.mjs                 → src/content/heroes.ts
 *   node scripts/overhaul/gen-heroes.mjs --verify-paint  → also rasterise every card
 *                                                          in headless Chrome and check
 *                                                          the bounds cover what it paints
 *
 * Source: the 53 `Lesson-Illustrations-v4` cards (`.overhaul/final/…`). A card
 * carries two svgs with the same `data-hero` — the current art, then a small
 * `Before` thumbnail of the art it replaced — so only the **first** 393 × 240
 * svg is read (CRITIC §1.5).
 *
 * What it guarantees, or it throws (CRITIC §7.1):
 *  - nothing is dropped: every card svg is parsed into a tree that serialises
 *    back to the card's own markup byte for byte, and any attribute this file
 *    has no React Native name for stops the run;
 *  - `paint-order="stroke"` (22 shapes in 17 cards — the stroke drawn *under*
 *    the fill, so only its outer half shows) becomes two shapes, because
 *    react-native-svg ignores the property: the shape as written, then the same
 *    shape again with `stroke="none"`, whose fill covers the stroke's inner half
 *    exactly as the browser's fill-over-stroke order does;
 *  - every hero on the 254 Email-Login frames and the 1,273 lesson frames is
 *    byte-identical to the card its `data-hero` names, through one alias:
 *    `Checkin-Emotions` is tagged `windowNight`, which no card has, and its art
 *    is the `nightMoon` card's (D338);
 *  - `HERO_BOX` (the lesson reader's hero box, from the designer's own
 *    `heroFit`) reproduces the box height and svg top of all 284 lesson heroes;
 *  - the Today crop (today-day §0.5) reproduces both cropped frames' viewBox,
 *    width and height from the same bounds.
 *
 * `HERO_BOUNDS` is the designer's `gen/hero-bounds.json` verbatim — the canvas
 * computed the lesson boxes and the Today crops from it, so those numbers are
 * the spec even where they differ from the painted extents (they run about a
 * point outside the paint, top and bottom; left/right leave out the full-bleed
 * floor lines). `--verify-paint` measures the painted extents and asserts the
 * vertical bounds contain them — that is what lets `Hero` size its canvas from
 * them without clipping a stroke.
 */
import fs from 'node:fs';
import path from 'node:path';

import { tokens } from './decl.mjs';

const ROOT = process.cwd();
const FINAL = path.join(ROOT, '.overhaul/final');
const CARDS = path.join(FINAL, 'Lesson-Illustrations-v4');
const BOUNDS_SRC = path.join(ROOT, 'Vici Overhaul/project/gen/hero-bounds.json');
const OUT = path.join(ROOT, 'src/content/heroes.ts');

const ALIASES = { windowNight: 'nightMoon' };

/* SVG attribute → react-native-svg prop. Anything not listed throws. */
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

/* Lato as the app loads it: a weight is a family (theme.ts `sans()`), and the
   family is registered at `font-weight: normal`. The medal's `V` asks for
   'Lato' 700; the app's face for that is `Lato_700Bold`. */
const LATO_FAMILY = { 400: 'Lato_400Regular', 700: 'Lato_700Bold', 900: 'Lato_900Black' };

const fail = (msg) => { console.error('gen-heroes: ' + msg); process.exit(1); };

/** The markup of the svg element that starts at `start` (depth-aware). */
function svgAt(html, start) {
  let depth = 0;
  const re = /<(\/?)svg\b/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html))) {
    if (!m[1]) depth++;
    else if (--depth === 0) return html.slice(start, html.indexOf('>', m.index) + 1);
  }
  fail('unclosed svg');
}

/** Every `<svg data-hero=…>` in a file: id, its open tag, its inner markup. */
function heroSvgs(html) {
  const out = [];
  const re = /<svg\b[^>]*\bdata-hero="([^"]*)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const svg = svgAt(html, m.index);
    out.push({ id: m[1], open: m[0], inner: svg.slice(m[0].length, svg.length - '</svg>'.length) });
    re.lastIndex = m.index + svg.length;
  }
  return out;
}

const attrsOf = (tag) => [...tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]);

/** Inner svg markup → tree of { t, a: [[name, value]…], c, s }. */
function tree(inner) {
  const root = { c: [] };
  const stack = [root];
  for (const tk of tokens(inner)) {
    const top = stack[stack.length - 1];
    if (tk.kind === 'text') { top.s = (top.s ?? '') + tk.value; continue; }
    if (tk.value.startsWith('</')) { stack.pop(); continue; }
    const t = tk.value.match(/^<\s*([A-Za-z0-9-]+)/)[1];
    const node = { t, a: attrsOf(tk.value), c: [] };
    top.c.push(node);
    if (!tk.value.endsWith('/>')) stack.push(node);
  }
  if (stack.length !== 1) fail('unbalanced markup');
  return root.c;
}

/**
 * Art that is meant to run off both edges but stops just past the 393 frame:
 * the lighthouse's two beams end at x 14 and 378, which at scale 1.1 is past
 * the frame on both sides — and 14 pt short of both edges on a 430 phone,
 * where they end in hard cuts. Each beam is extended along its own two edges
 * to the floor lines' −40 … 433, so inside 393 nothing changes (the added
 * length is off-frame there) and on a wider phone the beams reach the edges.
 */
const BEAM_EXTENSIONS = {
  lighthouse: ['M184 84 L14 60 V108 Z M208 84 L378 60 V108 Z', 'M184 84 L-40 52.38 V115.62 Z M208 84 L433 52.24 V115.76 Z'],
};
function extendBeams(id, nodes) {
  const ext = BEAM_EXTENSIONS[id];
  if (!ext) return;
  let hit = 0;
  const walk = (ns) => ns.forEach((n) => { if (n.p?.d === ext[0]) { n.p.d = ext[1]; hit++; } walk(n.c ?? []); });
  walk(nodes);
  if (hit !== 1) fail(`beam extension for ${id}: matched ${hit} paths, expected 1`);
}

/** Painted x-extent per card, measured in the browser (scripts/overhaul/measure-hero-paint.mjs). */
const PAINT = JSON.parse(fs.readFileSync('scripts/overhaul/hero-paint.json', 'utf8'));

const serialise = (nodes) =>
  nodes.map((n) => `<${n.t}${n.a.map(([k, v]) => ` ${k}="${v}"`).join('')}>${n.s ?? ''}${serialise(n.c)}</${n.t}>`).join('');

/** One canvas element → one or two react-native-svg nodes (paint-order split). */
function toNodes(n, counts) {
  if (!TAGS.has(n.t)) fail(`unknown element <${n.t}>`);
  const p = {};
  let paintOrder = null;
  const a = Object.fromEntries(n.a);
  for (const [k, v] of n.a) {
    if (k === 'paint-order') { paintOrder = v; continue; }
    if (k === 'font-family') continue; // folded into the Lato family below
    const name = PROP[k];
    if (!name) fail(`no react-native-svg prop for ${k}="${v}" on <${n.t}>`);
    p[name] = v;
  }
  if (n.t === 'text') {
    if (!/^'Lato'/.test(a['font-family'] ?? '')) fail('svg text in a face other than Lato');
    const w = Number(a['font-weight'] ?? 400);
    p.fontFamily = LATO_FAMILY[w] ?? fail(`no Lato face for weight ${w}`);
    p.fontWeight = 'normal';
  }
  const node = { t: n.t, p };
  if (n.c.length) node.c = n.c.flatMap((c) => toNodes(c, counts));
  if (n.s != null) node.s = n.s;
  if (paintOrder == null) return [node];
  if (paintOrder !== 'stroke') fail(`paint-order="${paintOrder}"`);
  if (n.c.length || !p.stroke || p.stroke === 'none' || !p.fill || p.fill === 'none') fail('paint-order on a shape without both fill and stroke');
  if (p.fillOpacity != null || p.opacity != null) fail('paint-order on a translucent shape — the two-shape split would double its fill');
  counts.paintOrder++;
  return [node, { t: n.t, p: { ...p, stroke: 'none' } }];
}

// ── 1. The cards ──────────────────────────────────────────────────────────
const index = JSON.parse(fs.readFileSync(path.join(CARDS, '_index.json'), 'utf8'));
const cards = [];
const counts = { paintOrder: 0, paintOrderCards: 0 };
for (const f of index.frames) {
  const html = fs.readFileSync(path.join(CARDS, f.file), 'utf8');
  const cardId = (html.match(/^<div id="([^"]+)"/) ?? [])[1];
  const first = heroSvgs(html)[0];
  if (!first) fail(`${f.file}: no hero svg`);
  if (!/viewBox="0 0 393 240"/.test(first.open) || !/width="393" height="240"/.test(first.open)) fail(`${f.file}: first svg is not 393×240`);
  if (first.id !== cardId) fail(`${f.file}: card id ${cardId} ≠ data-hero ${first.id}`);
  const scale = Number((first.open.match(/transform:scale\(([\d.]+)\)/) ?? [])[1]);
  if (!scale) fail(`${f.file}: no scale`);
  if (!/transform-origin:196px 190px/.test(first.open)) fail(`${f.file}: transform-origin is not 196px 190px`);
  const t = tree(first.inner);
  if (serialise(t) !== first.inner) fail(`${f.file}: the parsed tree does not serialise back to the card`);
  const before = counts.paintOrder;
  const nodes = t.flatMap((n) => toNodes(n, counts));
  extendBeams(first.id, nodes);
  if (counts.paintOrder > before) counts.paintOrderCards++;
  cards.push({ id: first.id, label: f.label, file: f.file, scale, inner: first.inner, nodes });
}
if (cards.length !== 53) fail(`expected 53 cards, found ${cards.length}`);
if (counts.paintOrder !== 22 || counts.paintOrderCards !== 17) fail(`paint-order: ${counts.paintOrder} shapes in ${counts.paintOrderCards} cards (expected 22 in 17)`);
const byId = new Map(cards.map((c) => [c.id, c]));
for (const [a, to] of Object.entries(ALIASES)) if (byId.has(a) || !byId.has(to)) fail(`alias ${a} → ${to} is not an alias`);

// ── 2. Bounds ─────────────────────────────────────────────────────────────
const BOUNDS = JSON.parse(fs.readFileSync(BOUNDS_SRC, 'utf8'));
for (const c of cards) if (!BOUNDS[c.id]) fail(`no bounds for ${c.id}`);
for (const k of Object.keys(BOUNDS)) if (!byId.has(k)) fail(`bounds for a hero no card draws: ${k}`);

/* The designer's `heroFit` (gen/lesson-v3.js): the lesson box hugs the art's
   vertical bounds at scale 1.1 — for every id, `medal` (drawn at scale 1)
   included. */
const heroFit = (id) => {
  const [t, b] = BOUNDS[id];
  const st = Math.floor(190 + (t - 190) * 1.1), sb = Math.ceil(190 + (b - 190) * 1.1);
  return { h: sb - st, top: -st };
};

/* Today II / Task / III (today-day §0.5): a viewBox crop instead of a scale. */
const r2 = (v) => Math.round(v * 100) / 100;
const r1 = (v) => Math.round(v * 10) / 10;
const crop = (id, W = 393) => {
  const [t, b] = BOUNDS[id];
  const vy = t - 3, vh = b - t + 6, s = r2(148 / vh), vw = W / s, vx = 196.5 - vw / 2;
  return { vx: r2(vx), vy, vw: r2(vw), vh, width: W, height: r1(vh * s) };
};

// ── 3. Every hero the bundle draws is its card ───────────────────────────
const resolve = (id) => ALIASES[id] ?? id;
const tally = { email: 0, emailMatch: 0, aliased: [], lesson: 0, lessonMatch: 0, boxes: 0, crops: 0 };
const mismatches = [];
const scan = (bundle, isLesson) => {
  const dir = path.join(FINAL, bundle);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const h of heroSvgs(html)) {
      const card = byId.get(resolve(h.id));
      const ok = card && card.inner === h.inner;
      if (isLesson) { tally.lesson++; if (ok) tally.lessonMatch++; } else { tally.email++; if (ok) tally.emailMatch++; }
      if (ok && h.id !== card.id) tally.aliased.push(`${f} (${h.id} → ${card.id})`);
      if (!ok) mismatches.push(`${bundle}/${f}: ${h.id}`);
      // the lesson reader's hero box: `<div style="position:relative; width:393px; height:Hpx; margin:0 -32px; …"><svg … top:Tpx; …>`
      const at = html.indexOf(h.open);
      const box = html.slice(Math.max(0, at - 200), at).match(/<div style="position:relative; width:393px; height:([\d.]+)px; margin:0 -32px;[^"]*">$/);
      if (box) {
        const want = heroFit(card.id);
        const top = Number((h.open.match(/top:(-?[\d.]+)px/) ?? [])[1]);
        if (Number(box[1]) !== want.h || top !== want.top) fail(`${bundle}/${f}: hero box ${box[1]}/${top}, heroFit says ${want.h}/${want.top}`);
        tally.boxes++;
      }
      // the Today crop
      if (!/viewBox="0 0 393 240"/.test(h.open)) {
        const c = crop(card.id);
        const want = `width="${c.width}" height="${c.height}" viewBox="${c.vx} ${c.vy} ${c.vw} ${c.vh}"`;
        if (!h.open.includes(want)) fail(`${bundle}/${f}: crop ${h.open} ≠ derived ${want}`);
        tally.crops++;
      }
    }
  }
};
scan('Email-Login', false);
for (const b of fs.readdirSync(FINAL).filter((x) => /^Week-\d\d-/.test(x))) scan(b, true);
if (mismatches.length) fail('heroes that are not their card:\n  ' + mismatches.join('\n  '));
if (tally.email !== 151 || tally.lesson !== 284) fail(`expected 151 + 284 heroes, found ${tally.email} + ${tally.lesson}`);
const used = new Set();
for (const b of ['Email-Login', ...fs.readdirSync(FINAL).filter((x) => /^Week-\d\d-/.test(x))]) {
  const dir = path.join(FINAL, b);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) for (const h of heroSvgs(fs.readFileSync(path.join(dir, f), 'utf8'))) used.add(resolve(h.id));
}
const unused = cards.filter((c) => !used.has(c.id)).map((c) => c.id);
if (unused.length) fail('cards no frame draws: ' + unused.join(', '));

// ── 4. Optional: rasterise and check the bounds contain the paint ────────
if (process.argv.includes('--verify-paint')) {
  const { chromium } = await import('playwright-core');
  const { PNG } = await import('pngjs');
  const K = 4, OX = 200, OY = 200;
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: K });
  await page.setContent(`<body style="margin:0;background:transparent"><svg id="s" width="800" height="600" viewBox="${-OX} ${-OY} 800 600" style="position:absolute;left:0;top:0"></svg></body>`);
  let worst = Infinity;
  for (const c of cards) {
    await page.evaluate((inner) => { document.getElementById('s').innerHTML = inner; }, c.inner);
    const png = PNG.sync.read(await page.screenshot({ omitBackground: true }));
    let y0 = Infinity, y1 = -1;
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4 + 3] > 0) { if (y < y0) y0 = y; y1 = y; }
    const [t, b] = BOUNDS[c.id];
    const top = y0 / K - OY, bottom = (y1 + 1) / K - OY;
    const margin = Math.min(top - t, b - bottom);
    worst = Math.min(worst, margin);
    if (margin < 0) fail(`${c.id}: paints ${top}…${bottom}, bounds say ${t}…${b}`);
  }
  await browser.close();
  console.log(`paint: every card's vertical bounds contain its painted extent (closest: ${worst.toFixed(2)} user units)`);
}

// ── 5. Write ──────────────────────────────────────────────────────────────
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k));
const emit = (n, pad) => {
  const p = Object.entries(n.p).map(([k, v]) => `${key(k)}: ${q(v)}`).join(', ');
  const s = n.s != null ? `, s: ${q(n.s)}` : '';
  if (!n.c) return `${pad}{ t: '${n.t}', p: { ${p} }${s} },`;
  return [`${pad}{ t: '${n.t}', p: { ${p} }${s}, c: [`, ...n.c.map((c) => emit(c, pad + '  ')), `${pad}] },`].join('\n');
};

const out = [];
out.push(`/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 53 illustrations of \`Lesson-Illustrations-v4\` — every hero the bundle
 * draws (151 on the Email-Login frames, 284 in the lesson readers, all
 * byte-identical to their card) — as data for \`react-native-svg\`, keyed by the
 * cards' own \`data-hero\` ids. Art is in the card's 393 × 240 user space;
 * \`src/components/mono/Hero.tsx\` places it.
 *
 * Attribute values are the canvas's strings, verbatim; names are
 * react-native-svg's. \`paint-order="stroke"\` shapes appear twice (as written,
 * then \`stroke: 'none'\`), and the medal's \`V\` names the app's Lato face.
 *
 * Rebuild: node scripts/overhaul/gen-heroes.mjs
 */

export type HeroTag = 'g' | 'rect' | 'path' | 'circle' | 'ellipse' | 'text';

export interface HeroNode {
  t: HeroTag;
  /** react-native-svg props, values verbatim from the card */
  p: Readonly<Record<string, string>>;
  /** children (\`g\`) */
  c?: readonly HeroNode[];
  /** text content (\`text\`) */
  s?: string;
}

/** Card order, as the illustration canvas lays them out. */
export const HERO_IDS = [
${cards.map((c) => `  ${q(c.id)},`).join('\n')}
] as const;

export type HeroId = (typeof HERO_IDS)[number];

/** Ids a frame uses that no card has. \`Checkin-Emotions\` tags its art \`windowNight\`; the art is \`nightMoon\`'s, byte for byte (D338). */
export const HERO_ALIASES = { windowNight: 'nightMoon' } as const satisfies Record<string, HeroId>;

export type HeroKey = HeroId | keyof typeof HERO_ALIASES;

export function heroId(key: HeroKey): HeroId {
  return (HERO_ALIASES as Record<string, HeroId>)[key] ?? (key as HeroId);
}

/** The card's own label. */
export const HERO_LABEL: Record<HeroId, string> = {
${cards.map((c) => `  ${key(c.id)}: ${q(c.label)},`).join('\n')}
};

/** The scale the card draws its art at (\`transform: scale(s)\` about 196 190) — 1.1, except the medal's 1. */
export const HERO_SCALE: Record<HeroId, number> = {
${cards.map((c) => `  ${key(c.id)}: ${c.scale},`).join('\n')}
};

/**
 * The designer's \`gen/hero-bounds.json\`, verbatim: [top, bottom, left, right]
 * in user units. Top/bottom contain everything the art paints (strokes
 * included); left/right are the object's, without full-bleed floor lines.
 */
export const HERO_BOUNDS: Record<HeroId, readonly [number, number, number, number]> = {
${cards.map((c) => `  ${key(c.id)}: [${BOUNDS[c.id].join(', ')}],`).join('\n')}
};

/**
 * Each card's painted x-extent in user units (floors run −40 … 433 past the
 * 393 viewBox). The crop mode uses it so a full-bleed floor still reaches both
 * screen edges on a phone wider than the frame.
 */
export const HERO_PAINT_X: Record<HeroId, readonly [number, number]> = {
${cards.map((c) => `  ${key(c.id)}: [${(PAINT[c.id] ?? [0, 393]).join(', ')}],`).join('\n')}
};

/**
 * The lesson reader's hero box (lessons §5, the designer's \`heroFit\`): a
 * \`393 × h\` box with the svg at \`top\` inside it, scale 1.1 about 196 190.
 * Checked against all 284 lesson heroes.
 */
export const HERO_BOX: Record<HeroId, { h: number; top: number }> = {
${cards.map((c) => { const b = heroFit(c.id); return `  ${key(c.id)}: { h: ${b.h}, top: ${b.top} },`; }).join('\n')}
};

export const HEROES: Record<HeroId, readonly HeroNode[]> = {
${cards.map((c) => [`  ${key(c.id)}: [`, ...c.nodes.map((n) => emit(n, '    ')), '  ],'].join('\n')).join('\n')}
};
`);
fs.writeFileSync(OUT, out.join(''));

console.log(`cards: ${cards.length} · paint-order: ${counts.paintOrder} shapes in ${counts.paintOrderCards} cards (split in two)`);
console.log(`Email-Login heroes: ${tally.emailMatch}/${tally.email} byte-match their card${tally.aliased.length ? ` (via alias: ${tally.aliased.join(', ')})` : ''}`);
console.log(`lesson heroes: ${tally.lessonMatch}/${tally.lesson} byte-match their card`);
console.log(`hero boxes checked: ${tally.boxes} · Today crops checked: ${tally.crops} · cards used: ${used.size}/53`);
console.log(`wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
