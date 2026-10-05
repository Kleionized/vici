#!/usr/bin/env node
/**
 * Generate the SOS response boards from the frames themselves.
 *
 * Frames 117–146 draw one board per answer — seven locations, thirteen
 * feelings, ten triggers — and `SOS-Challenge` draws a thirty-first in the same
 * shape with a challenge card added. Each is a bespoke scene of six to fourteen
 * layers over a title, a body and a pill, and a few carry a "Give me another"
 * link. None of it is typed by hand: every layer, string and colour below is
 * read out of the frame's own markup.
 *
 * Usage: node scripts/vicifull/gen-sos-responses.mjs > src/content/sosResponses.ts
 */
import { parse } from './decl.mjs';
import fs from 'node:fs';

const DIR = '.vicifull/final/Email-Login';

/** The canvas writes its punctuation as entities; the app renders characters. */
const ENTITIES = {
  '&rsquo;': '\u2019', '&lsquo;': '\u2018', '&rdquo;': '\u201d', '&ldquo;': '\u201c',
  '&mdash;': '\u2014', '&ndash;': '\u2013', '&hellip;': '\u2026', '&middot;': '\u00b7',
  '&times;': '\u00d7', '&amp;': '&', '&nbsp;': '\u00a0', '&quot;': '"', '&#39;': "'",
};
const decode = (v) => (v == null ? v : v.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e));

const num = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));

/**
 * `border-radius` in the four shapes these frames use: a flat number, `50%`,
 * four corners, and — on three layers — an elliptical `a b c d / e f g h`,
 * which React Native cannot express at all and which is drawn as an SVG arc
 * (`DECISIONS.md` D015).
 */
function radius(v, w, h) {
  if (!v) return undefined;
  if (v === '50%') return { kind: 'pill' };
  if (v.includes('/')) {
    const [hh, vv] = v.split('/').map((x) => x.trim().split(/\s+/));
    return { kind: 'elliptic', h: hh, v: vv };
  }
  // A percentage corner resolves against the box's own side; a few layers mix
  // percentages and points in one declaration.
  const side = Math.min(w ?? 0, h ?? 0);
  const one = (x) => (String(x).endsWith('%') ? (parseFloat(x) / 100) * side : num(x) || 0);
  const parts = v.split(/\s+/);
  if (parts.length === 1) return { kind: 'all', r: one(parts[0]) };
  return { kind: 'corners', corners: parts.map(one) };
}

/** `background` in the three shapes these frames use. */
function background(v) {
  if (!v) return undefined;
  if (v.startsWith('linear-gradient')) {
    const stops = [...v.matchAll(/(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\))/g)].map((m) => m[1]);
    return { kind: 'linear', stops };
  }
  if (v.startsWith('radial-gradient')) {
    const colours = [...v.matchAll(/(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\))/g)].map((m) => m[1]);
    const stop = v.match(/\)\s*(\d+)%/);
    return { kind: 'radial', from: colours[0], to: colours[colours.length - 1], stop: stop ? Number(stop[1]) / 100 : 1 };
  }
  return { kind: 'solid', color: v };
}

function board(file) {
  const all = parse(fs.readFileSync(`${DIR}/${file}`, 'utf8'));
  // Drop the canvas's own iPhone chrome the way `body.mjs` does, so the clock
  // never turns up as a headline (DECISIONS.md D009).
  const nodes = [];
  let skipDepth = null;
  for (const r of all) {
    if (skipDepth != null) {
      if (r.depth > skipDepth) continue;
      skipDepth = null;
    }
    if (r.tag === 'div' && r.decls.height === '54px' && r.decls.top === '0' && r.decls.position === 'absolute') { skipDepth = r.depth; continue; }
    if (r.tag === 'div' && r.decls.width === '139px' && r.decls.height === '5px') { skipDepth = r.depth; continue; }
    nodes.push(r);
  }
  const layers = [];
  const text = [];
  let inArt = false;
  let artDepth = 0;
  for (const n of nodes) {
    if (n.tag === '#text') { text.push(decode(n.text)); continue; }
    const css = n.decls ?? {};
    // the art box: `left:76 top:180 240x220`
    if (css.left === '76px' && css.top === '180px' && css.width === '240px') { inArt = true; artDepth = n.depth; continue; }
    if (inArt && n.depth <= artDepth) inArt = false;
    if (!inArt) continue;
    // the clip child the canvas wraps every scene in
    if (css.inset === '0' && css.overflow === 'hidden') continue;
    if (n.tag === 'svg') { layers.push({ svg: { viewBox: n.attrs.viewBox, width: num(n.attrs.width), height: num(n.attrs.height), left: num(css.left), top: num(css.top) }, parts: [] }); continue; }
    if (n.tag === 'path' && layers.length && layers[layers.length - 1].svg) {
      const p = {};
      for (const k of ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']) if (n.attrs?.[k] != null) p[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = n.attrs[k];
      layers[layers.length - 1].parts.push(p);
      continue;
    }
    const l = {};
    for (const k of ['left', 'top', 'right', 'bottom', 'width', 'height']) if (css[k] != null) l[k] = num(css[k]);
    // A CSS border triangle: a zero-size box whose visible borders make an
    // arrowhead. React Native has no equivalent, so it is emitted as a
    // direction, a size and a colour and drawn as an SVG polygon.
    const bl = css['border-left'];
    const br = css['border-right'];
    const bt = css['border-top'];
    if (css.width === '0' && css.height === '0' && (bl || br)) {
      const side = (bl && !bl.includes('transparent') ? bl : br) ?? '';
      const half = num(bt?.split(' ')[0]) ?? 0;
      l.tri = { dir: bl && !bl.includes('transparent') ? 'right' : 'left', w: num(side.split(' ')[0]) ?? 0, h: half * 2, color: side.split(' ').pop() };
      layers.push(l);
      continue;
    }
    const bg = background(css.background);
    if (bg) l.bg = bg;
    const r = radius(css['border-radius'], l.width, l.height);
    if (r) l.radius = r;
    if (css.filter) l.blur = Number(css.filter.match(/blur\(([0-9.]+)px\)/)?.[1] ?? 0);
    if (css['box-shadow']) l.shadow = css['box-shadow'];
    if (css.transform) l.transform = css.transform;
    // CSS rotates about the box's centre unless told otherwise; a few layers
    // pin the origin to an edge, and the difference is visible.
    if (css['transform-origin']) l.origin = css['transform-origin'];
    layers.push(l);
  }
  // the strings, in the frame's own order: title, body, [challenge eyebrow,
  // challenge], cta, [another]
  const challenge = text.indexOf('THE CHALLENGE');
  const out = { title: text[0], body: text[1] };
  if (challenge >= 0) {
    out.title = text[0];
    out.body = text[1];
    out.challenge = text[challenge + 1];
    out.cta = text[challenge + 2];
    if (text[challenge + 3]) out.another = true;
  } else {
    out.cta = text[2];
    if (text[3] === 'Give me another') out.another = true;
  }
  out.layers = layers;
  return out;
}

const FILES = fs.readdirSync(DIR).filter((f) => /^SOS-(Loc|Feel|Trig)-/.test(f)).sort();
const key = (f) => f.replace(/\.html$/, '');

const entries = FILES.map((f) => [key(f), board(f)]);
entries.push(['SOS-Challenge', board('SOS-Challenge.html')]);

const j = (v) => JSON.stringify(v);
process.stdout.write(`/**
 * The SOS response boards, generated from the frames by
 * \`scripts/vicifull/gen-sos-responses.mjs\` — do not edit by hand.
 *
 * One board per answer: seven locations, thirteen feelings, ten triggers, and
 * \`SOS-Challenge\`, which is the same board with a challenge card in it. Every
 * string, layer, colour and radius below is the canvas's own.
 */

export interface SosLayerBg {
  kind: 'solid' | 'linear' | 'radial';
  color?: string;
  stops?: string[];
  from?: string;
  to?: string;
  stop?: number;
}

export interface SosLayer {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  bg?: SosLayerBg;
  radius?:
    | { kind: 'pill' }
    | { kind: 'all'; r: number }
    | { kind: 'corners'; corners: number[] }
    /** \`a b c d / e f g h\` — the canvas's own strings, drawn as an arc. */
    | { kind: 'elliptic'; h: string[]; v: string[] };
  /** \`filter: blur(Npx)\` — redrawn as a falloff, never as a filter. */
  blur?: number;
  shadow?: string;
  transform?: string;
  /** \`transform-origin\`, where the canvas moves it off the centre. */
  origin?: string;
  /** A CSS border triangle, drawn as an SVG polygon. */
  tri?: { dir: 'left' | 'right'; w: number; h: number; color: string };
  /** An inline \`<svg>\` layer and its paths. */
  svg?: { viewBox: string; width: number; height: number; left?: number; top?: number };
  parts?: { d?: string; fill?: string; stroke?: string; strokeWidth?: string; strokeLinecap?: string; strokeLinejoin?: string }[];
}

export interface SosResponse {
  title: string;
  body: string;
  cta: string;
  /** Drawn only where the frame draws the "Give me another" link. */
  another?: boolean;
  /** Only \`SOS-Challenge\` carries one. */
  challenge?: string;
  layers: SosLayer[];
}

export const SOS_RESPONSES: Record<string, SosResponse> = {
${entries.map(([k, v]) => `  ${j(k)}: ${j(v)},`).join('\n')}
};
`);
