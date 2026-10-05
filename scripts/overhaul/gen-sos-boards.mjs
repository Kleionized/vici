#!/usr/bin/env node
/**
 * Generate `src/content/sosResponses.ts` — the SOS response boards — from the
 * `Vici Overhaul` frames (sos-boards §8). Replaces `scripts/vicifull/` and
 * `scripts/uifinal1/gen-sos-responses.mjs`, which read the previous drop's
 * bespoke CSS scenes; nothing should run those again.
 *
 * The thirty `SOS-Loc-*` / `SOS-Feel-*` / `SOS-Trig-*` frames are one template
 * in two variants (sos-boards §0): a kicker in the nav, a shared hero at 190
 * (scale 1.1), a centred title 30/36 and body 15/24 at 452, and the primary at
 * bottom 48 — or 96 over the "Give me another" ghost on the feeling branch.
 * `SOS-Challenge` is the same board with a back chevron and 7/8 dashes, its
 * hero at 111, a 26/33 title at 372 and the challenge card. Per board the only
 * data is the strings, the hero id and the variant; every template value is
 * **asserted** against the frame, so a later drop that moves one board stops
 * the run instead of drawing it wrong.
 *
 * The hero is not copied: each board's `<svg data-hero>` is asserted to be its
 * Lesson-Illustrations-v4 card byte for byte (whitespace-normalised), and the
 * board draws the shared hero (`src/content/heroes.ts`, `mono/Hero`).
 *
 * Line breaks: the frames carry none, but they set titles in `text-wrap:
 * balance` and bodies in `pretty`. Where that breaks differently from a greedy
 * wrap at 393, `BREAKS` gives the frame's lines (D332; native wraps greedily).
 * `node scripts/overhaul/sos-breaks.mjs` re-measures every frame and checks
 * the emitted file against them.
 *
 * Usage: node scripts/overhaul/gen-sos-boards.mjs [--out=<file>]   (default: writes src/content/sosResponses.ts)
 */
import fs from 'node:fs';
import path from 'node:path';

import { parse } from './decl.mjs';

const FINAL = '.overhaul/final';
const DIR = path.join(FINAL, 'Email-Login');
const CARDS = path.join(FINAL, 'Lesson-Illustrations-v4');
const OUT = (process.argv.find((a) => a.startsWith('--out=')) ?? '--out=src/content/sosResponses.ts').slice(6);

const fail = (msg) => {
  console.error('gen-sos-boards: ' + msg);
  process.exit(1);
};

/** The canvas's own order (FLOW badges 95A–97J, then the challenge) — groups.json lists them so. */
const FRAMES = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'))['sos-boards'].map((f) => f.replace(/\.html$/, ''));
if (FRAMES.length !== 31) fail(`expected 31 frames in groups.json sos-boards, found ${FRAMES.length}`);

/**
 * The six runs whose `balance`/`pretty` break differs from greedy at 393
 * (sos-boards §6, re-measured by `sos-breaks.mjs`). Each must equal the frame's
 * text with its `\n`s read as spaces.
 */
const BREAKS = {
  'SOS-Feel-Rejected': { title: 'Leave it alone\nfor ten minutes.' },
  'SOS-Loc-Elsewhere': { title: 'Get somewhere\nless private.' },
  'SOS-Trig-Habit': { title: 'Change what\nhappens next.' },
  'SOS-Loc-Bed': { body: 'Both feet on the floor. Stand up and leave\nthe bedroom.' },
  'SOS-Loc-Work': { body: 'Put your phone away. Don’t move somewhere\nmore private.' },
  'SOS-Feel-Unknown': { body: 'You don’t need to know why right now. Change\nrooms and put some distance between you and\nthe phone.' },
};

/** The canvas writes some punctuation as entities; the app renders characters. */
const ENTITIES = {
  '&rsquo;': '’', '&lsquo;': '‘', '&rdquo;': '”', '&ldquo;': '“',
  '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&middot;': '·',
  '&times;': '×', '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'",
};
const decode = (v) => v.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);
const num = (v) => Number(String(v).replace('px', ''));
const norm = (s) => s.replace(/\s+/g, ' ').trim();

// ── the hero cards ─────────────────────────────────────────────────────────

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

/** Every `<svg data-hero=…>` in a file: id, open tag, normalised inner markup. */
function heroSvgs(html) {
  const out = [];
  const re = /<svg\b[^>]*\bdata-hero="([^"]*)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const svg = svgAt(html, m.index);
    out.push({ id: m[1], open: m[0], inner: norm(svg.slice(m[0].length, svg.length - '</svg>'.length)) });
    re.lastIndex = m.index + svg.length;
  }
  return out;
}

/** id → the card's first (current) 393×240 drawing. */
const CARD = new Map();
for (const f of fs.readdirSync(CARDS).filter((x) => x.endsWith('.html') && !x.startsWith('_'))) {
  const first = heroSvgs(fs.readFileSync(path.join(CARDS, f), 'utf8')).find((h) => /viewBox="0 0 393 240"/.test(h.open));
  if (first && !CARD.has(first.id)) CARD.set(first.id, first.inner);
}
const HERO_IDS = new Set(fs.readFileSync('src/content/heroes.ts', 'utf8').match(/^export const HERO_IDS = \[([\s\S]*?)\] as const;/m)?.[1].match(/'([A-Za-z0-9]+)'/g)?.map((s) => s.slice(1, -1)) ?? []);
if (HERO_IDS.size < 50) fail('could not read HERO_IDS from src/content/heroes.ts');

// ── one frame ──────────────────────────────────────────────────────────────

/** The text an element carries: every text run below it, in order. */
function textOf(rows, i) {
  const d = rows[i].depth;
  const parts = [];
  for (let j = i + 1; j < rows.length && rows[j].depth > d; j++) if (rows[j].tag === '#text') parts.push(rows[j].text);
  return decode(parts.join(' '));
}
/** Indices of the direct element children of row `i`. */
function childrenOf(rows, i) {
  const d = rows[i].depth;
  const out = [];
  for (let j = i + 1; j < rows.length && rows[j].depth > d; j++) if (rows[j].depth === d + 1 && rows[j].tag !== '#text') out.push(j);
  return out;
}
function expect(frame, what, got, want) {
  if (got !== want) fail(`${frame}: ${what} is ${JSON.stringify(got)}, the template says ${JSON.stringify(want)}`);
}
/** Assert a set of declarations on a row. */
function decls(frame, what, row, want) {
  for (const [k, v] of Object.entries(want)) expect(frame, `${what} ${k}`, row.decls[k], v);
}

function board(frame) {
  const html = fs.readFileSync(path.join(DIR, frame + '.html'), 'utf8');
  const rows = parse(html);
  const kind = /^SOS-Loc-/.test(frame) ? 'location' : /^SOS-Feel-/.test(frame) ? 'feeling' : /^SOS-Trig-/.test(frame) ? 'trigger' : frame === 'SOS-Challenge' ? 'challenge' : fail(`${frame}: unknown kind`);
  const challenge = kind === 'challenge';

  // ground + noise
  decls(frame, 'frame', rows[0], { width: '393px', height: '852px', background: '#0D0D0D' });
  const noise = rows.find((r) => r.decls['background-image']);
  decls(frame, 'noise', noise, { 'background-image': "url('noise.png')", opacity: '0.05', inset: '0' });

  // nav row
  const navI = rows.findIndex((r) => r.decls.top === '60px' && r.decls.height === '40px');
  if (navI < 0) fail(`${frame}: no nav row`);
  decls(frame, 'nav', rows[navI], { padding: '0 22px', 'z-index': '5', 'justify-content': 'space-between' });
  const [leftI, midI, rightI] = childrenOf(rows, navI);
  decls(frame, 'nav left', rows[leftI], { width: '36px', height: '40px' });
  decls(frame, 'nav right', rows[rightI], { width: '36px', height: '40px', 'justify-content': 'flex-end' });
  const close = rows.slice(rightI).find((r) => r.tag === 'path');
  expect(frame, '✕ path', close?.attrs.d, 'M2 2l14 14M16 2L2 16');
  const back = childrenOf(rows, leftI).length > 0;
  expect(frame, 'back chevron', back, challenge);
  let kicker;
  let nav;
  if (challenge) {
    const chevron = rows.slice(leftI).find((r) => r.tag === 'path');
    expect(frame, 'chevron path', chevron?.attrs.d, 'M10 2L2 10l8 8');
    const dashes = childrenOf(rows, midI).map((j) => rows[j].decls.background);
    expect(frame, 'dash count', dashes.length, 8);
    const step = dashes.filter((c) => c === '#F2F0EC').length;
    expect(frame, 'dashes', dashes.join(' '), [...Array(8)].map((_, i) => (i < step ? '#F2F0EC' : '#2E2E2E')).join(' '));
    nav = { back: true, step, of: 8 };
  } else {
    decls(frame, 'kicker', rows[midI], { 'font-size': '13px', 'font-weight': '700', 'white-space': 'nowrap', color: '#9B968E' });
    kicker = textOf(rows, midI);
  }

  // hero
  const heroes = heroSvgs(html);
  expect(frame, 'hero count', heroes.length, 1);
  const [h] = heroes;
  const heroRow = rows.find((r) => r.attrs['data-hero']);
  decls(frame, 'hero', heroRow, { position: 'absolute', left: '0', overflow: 'visible', 'transform-origin': '196px 190px' });
  if (!HERO_IDS.has(h.id)) fail(`${frame}: hero ${h.id} is not in src/content/heroes.ts`);
  if (CARD.get(h.id) !== h.inner) fail(`${frame}: its ${h.id} drawing is not the Lesson-Illustrations-v4 card's — the board would draw the card, not this`);
  const heroTop = num(heroRow.decls.top);
  const heroScale = Number((heroRow.decls.transform.match(/^scale\(([\d.]+)\)$/) ?? fail(`${frame}: hero transform ${heroRow.decls.transform}`))[1]);
  expect(frame, 'hero top', heroTop, challenge ? 111 : 190);
  expect(frame, 'hero scale', heroScale, 1.1);

  // the text stack
  const stackI = rows.findIndex((r) => r.decls.left === '24px' && r.decls.right === '24px' && r.decls['flex-direction'] === 'column' && r.decls.top);
  if (stackI < 0) fail(`${frame}: no text stack`);
  decls(frame, 'stack', rows[stackI], { gap: '18px', 'align-items': 'center', 'text-align': 'center' });
  const stackTop = num(rows[stackI].decls.top);
  expect(frame, 'stack top', stackTop, challenge ? 372 : 452);
  const kids = childrenOf(rows, stackI);
  expect(frame, 'stack children', kids.length, challenge ? 4 : 2);
  const [titleI, bodyI, spacerI, cardI] = kids;
  const titleSize = challenge ? 26 : 30;
  decls(frame, 'title', rows[titleI], { width: '100%', 'font-size': `${titleSize}px`, 'font-weight': '700', 'letter-spacing': '-0.6px', 'line-height': challenge ? '33px' : '36px', color: '#F2F0EC', 'text-wrap': 'balance', 'text-align': 'center' });
  decls(frame, 'body', rows[bodyI], { width: '100%', 'font-size': '15px', 'font-weight': '400', 'line-height': '24px', color: '#B5B0A8', 'text-wrap': 'pretty', 'text-align': 'center' });
  let title = textOf(rows, titleI);
  let body = textOf(rows, bodyI);

  let challengeLabel;
  let challengeText;
  if (challenge) {
    decls(frame, 'spacer', rows[spacerI], { height: '2px' });
    decls(frame, 'card', rows[cardI], { 'border-radius': '24px', background: '#1E1E1E', padding: '22px 22px 24px' });
    const [colI] = childrenOf(rows, cardI);
    decls(frame, 'card column', rows[colI], { 'flex-direction': 'column', gap: '10px', 'align-items': 'center', 'text-align': 'center' });
    const [capsI, textI] = childrenOf(rows, colI);
    decls(frame, 'card caps', rows[capsI], { width: '100%', 'white-space': 'nowrap', 'font-size': '13px', 'font-weight': '700', color: '#9B968E' });
    decls(frame, 'card text', rows[textI], { 'font-size': '18px', 'font-weight': '700', 'line-height': '27px', color: '#F2F0EC' });
    challengeLabel = textOf(rows, capsI);
    challengeText = textOf(rows, textI);
  }

  // primary + ghost
  const pillI = rows.findIndex((r) => r.decls.height === '58px' && r.decls['border-radius'] === '29px');
  if (pillI < 0) fail(`${frame}: no primary`);
  decls(frame, 'primary', rows[pillI], { left: '24px', right: '24px', background: '#F2F0EC', 'z-index': '6' });
  const spanI = childrenOf(rows, pillI)[0];
  decls(frame, 'primary label', rows[spanI], { 'font-size': '16px', 'font-weight': '700', 'letter-spacing': '0.1px', 'white-space': 'nowrap', color: '#111111' });
  const cta = textOf(rows, pillI);
  const ctaBottom = num(rows[pillI].decls.bottom);
  const ghostRow = rows.find((r) => r.decls.bottom === '60px');
  const ghostI = rows.indexOf(ghostRow);
  const another = ghostI >= 0;
  if (another) {
    decls(frame, 'ghost', ghostRow, { left: '0', right: '0', 'text-align': 'center', 'font-size': '15px', 'font-weight': '400', color: '#9B968E', 'z-index': '6' });
    expect(frame, 'ghost text', textOf(rows, ghostI), 'Give me another');
  }
  expect(frame, 'primary bottom', ctaBottom, another ? 96 : 48);
  expect(frame, 'ghost on the feeling branch', another, kind === 'feeling' || challenge);

  // explicit breaks
  const br = BREAKS[frame] ?? {};
  for (const [field, broken] of Object.entries(br)) {
    const plain = field === 'title' ? title : body;
    if (broken.replace(/\n/g, ' ') !== plain) fail(`${frame}: BREAKS.${field} ${JSON.stringify(broken)} is not the frame's ${JSON.stringify(plain)}`);
  }
  if (br.title) title = br.title;
  if (br.body) body = br.body;

  return {
    kind,
    ...(kicker ? { kicker } : {}),
    ...(nav ? { nav } : {}),
    hero: h.id,
    heroTop,
    heroScale,
    stackTop,
    titleSize,
    title,
    body,
    ...(challenge ? { challengeLabel, challenge: challengeText } : {}),
    cta,
    ctaBottom,
    ...(another ? { another: true } : {}),
  };
}

const boards = FRAMES.map((f) => [f, board(f)]);
for (const k of Object.keys(BREAKS)) if (!FRAMES.includes(k)) fail(`BREAKS names ${k}, which is not a board`);

const out = `/**
 * The SOS response boards — GENERATED FILE — do not edit by hand.
 * Written by \`node scripts/overhaul/gen-sos-boards.mjs\` from the \`Vici Overhaul\`
 * frames (\`.overhaul/final/Email-Login/SOS-{Loc,Feel,Trig}-*.html\`, \`SOS-Challenge.html\`);
 * \`node scripts/overhaul/sos-breaks.mjs\` checks the line breaks against them.
 *
 * One board per answer — seven locations, thirteen feelings, ten triggers — and
 * \`SOS-Challenge\`, the same board with a challenge card, reached only by
 * "Give me another". Every board draws the shared hero its frame names (the
 * Lesson-Illustrations-v4 card, asserted identical); \`\\n\` marks a break the
 * frame's \`text-wrap: balance\`/\`pretty\` makes and a greedy wrap would not (D332).
 */
import type { HeroId } from './heroes';

export type SosBoardKind = 'location' | 'trigger' | 'feeling' | 'challenge';

export const SOS_BOARD_KEYS = [
${boards.map(([k]) => `  '${k}',`).join('\n')}
] as const;
export type SosBoardKey = (typeof SOS_BOARD_KEYS)[number];

export interface SosResponse {
  kind: SosBoardKind;
  /** The nav's centre title — \`Where you are\`, \`What’s feeding it\`, \`What’s underneath\`. */
  kicker?: string;
  /** The challenge draws a back chevron and dashes (\`step\` of \`of\` lit) instead of a kicker. */
  nav?: { back: true; step: number; of: number };
  hero: HeroId;
  /** The hero's canvas \`top\` (190; the challenge 111) and \`transform: scale\`. */
  heroTop: number;
  heroScale: number;
  /** The text stack's canvas \`top\` (452; the challenge 372). */
  stackTop: number;
  /** 30/36 on the boards, 26/33 on the challenge. */
  titleSize: 26 | 30;
  title: string;
  body: string;
  /** Only \`SOS-Challenge\`: the card's caps line and its sentence. */
  challengeLabel?: string;
  challenge?: string;
  cta: string;
  /** 48, or 96 over the ghost link. */
  ctaBottom: 48 | 96;
  /** Drawn only where the frame draws the "Give me another" link. */
  another?: true;
}

export const SOS_RESPONSES: Record<SosBoardKey, SosResponse> = {
${boards.map(([k, b]) => `  ${JSON.stringify(k)}: ${JSON.stringify(b)},`).join('\n')}
};

export function isSosBoardKey(key: string | undefined): key is SosBoardKey {
  return key != null && Object.prototype.hasOwnProperty.call(SOS_RESPONSES, key);
}
`;
fs.writeFileSync(OUT, out);
const n = (k) => boards.filter(([, b]) => b.kind === k).length;
console.log(`gen-sos-boards: ${boards.length} boards (${n('location')} location, ${n('feeling')} feeling, ${n('trigger')} trigger, ${n('challenge')} challenge), ${new Set(boards.map(([, b]) => b.hero)).size} heroes → ${OUT}`);
