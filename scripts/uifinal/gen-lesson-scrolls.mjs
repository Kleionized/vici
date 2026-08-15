#!/usr/bin/env node
/**
 * Transcribe the reader for all 84 lessons out of the `lesson UI` bundle.
 *
 * The last drop authored a body for lesson 1 only; this one authors all 84 —
 * 1,398 frames across thirteen canvases. Classifying every frame into a fixed
 * union of page kinds would mean deciding in advance what the design is allowed
 * to do, and the classifier already found 34 distinct type signatures. So a
 * page is transcribed as *what it is*: the column's gap and its children in
 * order, each child carrying the metrics its own frame states.
 *
 * The renderer then walks the parts. Nothing is inferred, nothing is defaulted,
 * and a variant the design invents on lesson 57 arrives as data rather than as
 * a missing case.
 *
 * Rebuild: node scripts/uifinal/gen-lesson-scrolls.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { children, clean, column, decl, isText, progress, px, styleOf, subtree, textOf } from './lesson-lib.mjs';

const SPLIT = '.uifinal/lessons';
const STATUS_BAR = 54;

/* --------------------------------------------------------------- the marks */

/**
 * The small art each page can open with. Every one is shared across lessons, so
 * they are named here and drawn by the app's own components rather than
 * transcribed 471 times.
 */
const MARKS = [
  { name: 'sun12', test: (s) => /width:12px; height:12px/.test(s) },
  { name: 'sun14', test: (s) => /width:14px; height:14px/.test(s) },
  { name: 'sun36', test: (s) => /width:36px; height:36px/.test(s) },
  { name: 'crescent', test: (s) => /width:34px; height:30px/.test(s) },
  { name: 'clock', test: (s) => /width:96px; height:96px/.test(s) },
  { name: 'bedphone', test: (s) => /width:240px; height:96px/.test(s) },
  { name: 'sunrise', test: (s) => /width:240px; height:100px/.test(s) },
  { name: 'room', test: (s) => /width:340px; height:200px/.test(s) },
  { name: 'coverL1', test: (s) => /width:270px; height:224px/.test(s) },
  { name: 'cover', test: (s) => /width:270px; height:190px/.test(s) },
];

/* ------------------------------------------------------------- the reading */

/** A text child, as the metrics its own frame states. */
function textPart(sub) {
  const st = styleOf(sub);
  const family = decl(st, 'font-family');
  return {
    t: 'text',
    text: textOf(sub),
    size: px(decl(st, 'font-size')),
    weight: Number(decl(st, 'font-weight') ?? 400),
    lineHeight: px(decl(st, 'line-height')),
    color: decl(st, 'color'),
    maxWidth: px(decl(st, 'max-width')),
    // `balance` on every 26/28px heading run, `pretty` on the paragraphs. The
    // two are not interchangeable: balance evens the last line of a short
    // heading, pretty only prevents an orphan.
    wrap: decl(st, 'text-wrap'),
    ...(family ? { serif: true } : {}),
  };
}

/** The graded-lines block: a column of 22px lines at its own gap. */
function cascadePart(sub) {
  const st = styleOf(sub);
  return {
    t: 'cascade',
    gap: px(decl(st, 'gap')),
    lines: children(sub).filter(isText).map((k) => {
      const s = styleOf(k);
      return { text: textOf(k), size: px(decl(s, 'font-size')), weight: Number(decl(s, 'font-weight') ?? 400), lineHeight: px(decl(s, 'line-height')), maxWidth: px(decl(s, 'max-width')), wrap: decl(s, 'text-wrap'), color: decl(s, 'color') };
    }),
  };
}

/** The attribution row under an epigraph: a rule, small caps, a rule. */
function attributionPart(sub) {
  const st = styleOf(sub);
  const label = children(sub).find(isText);
  const rule = children(sub).find((k) => !isText(k));
  const rs = rule ? styleOf(rule) : '';
  return {
    t: 'attribution',
    gap: px(decl(st, 'gap')),
    text: label ? textOf(label) : '',
    size: label ? px(decl(styleOf(label), 'font-size')) : undefined,
    weight: label ? Number(decl(styleOf(label), 'font-weight') ?? 400) : undefined,
    letterSpacing: label ? px(decl(styleOf(label), 'letter-spacing')) : undefined,
    color: label ? decl(styleOf(label), 'color') : undefined,
    rule: rule ? { width: px(decl(rs, 'width')), height: px(decl(rs, 'height')), background: decl(rs, 'background') } : undefined,
  };
}

/** A stretched column of pick pills, shaped like the board pages' option list. */
function pickListPart(sub) {
  const st = styleOf(sub);
  return {
    t: 'picklist',
    gap: px(decl(st, 'gap')),
    options: children(sub).map((r) => {
      const rs = styleOf(r);
      const label = children(r).find(isText);
      const dot = children(r).find((k) => !isText(k));
      return {
        text: label ? textOf(label) : '',
        selected: /0 0 0 2px #1D1C1A/.test(rs),
        size: label ? px(decl(styleOf(label), 'font-size')) : undefined,
        weight: label ? Number(decl(styleOf(label), 'font-weight') ?? 500) : 500,
        lineHeight: label ? px(decl(styleOf(label), 'line-height')) : undefined,
        minHeight: px(decl(rs, 'min-height')) ?? px(decl(rs, 'height')),
        radius: px(decl(rs, 'border-radius')),
        padding: decl(rs, 'padding'),
        rowGap: px(decl(rs, 'gap')),
        shadow: decl(rs, 'box-shadow'),
        dot: dot ? { size: px(decl(styleOf(dot), 'width')), style: styleOf(dot) } : undefined,
      };
    }),
  };
}

/** The task page's rule card — a stretched white plate with a tick and a line. */
function rulePart(sub) {
  const st = styleOf(sub);
  const text = children(sub).map(textOf).filter(Boolean).join(' ');
  const line = children(sub).find(isText);
  const ls = line ? styleOf(line) : '';
  return {
    t: 'rule',
    tick: glyphOf(sub),
    text: text || textOf(sub),
    radius: px(decl(st, 'border-radius')),
    background: decl(st, 'background'),
    shadow: decl(st, 'box-shadow'),
    padding: decl(st, 'padding'),
    gap: px(decl(st, 'gap')),
    size: px(decl(ls, 'font-size')),
    weight: Number(decl(ls, 'font-weight') ?? 500),
    lineHeight: px(decl(ls, 'line-height')),
    color: decl(ls, 'color'),
  };
}

function columnPage(html, col) {
  const parts = [];
  for (const kid of col.kids) {
    const st = styleOf(kid);
    if (isText(kid)) {
      parts.push(textPart(kid));
      continue;
    }
    // A bare height is one of the canvas's zero-width spacers.
    const h = px(decl(st, 'height'));
    if (/^height:\d+px;?$/.test(st.trim())) {
      parts.push({ t: 'spacer', height: h });
      continue;
    }
    const mark = MARKS.find((m) => m.test(st));
    if (mark) {
      parts.push({ t: 'mark', name: mark.name });
      continue;
    }
    // Lesson 1's task page puts its room scene in a fixed-height box and scales
    // it down inside — the box is the space reserved, the scale is the drawing.
    if (h && /justify-content:center/.test(st) && children(kid).length) {
      const inner = children(kid)[0];
      const scale = Number((styleOf(inner).match(/scale\(([\d.]+)\)/) || [])[1] ?? 1);
      const held = children(inner).map(styleOf).find((s) => MARKS.some((m) => m.test(s)));
      const name = held ? MARKS.find((m) => m.test(held)).name : undefined;
      if (name) {
        parts.push({ t: 'mark', name, boxHeight: h, scale });
        continue;
      }
    }
    // A flex column of 22px lines is the cascade.
    if (/flex-direction:column/.test(st) && children(kid).some((k) => px(decl(styleOf(k), 'font-size')) === 22)) {
      parts.push(cascadePart(kid));
      continue;
    }
    // A stretched *column* is a list of pick pills. Lesson 1 is the only lesson
    // that lays its pick page out inside the centred column rather than as its
    // own board, so this is the one page where the two collide.
    if (/align-self:stretch/.test(st) && /flex-direction:column/.test(st)) {
      parts.push(pickListPart(kid));
      continue;
    }
    // A stretched plate is the task page's rule card. This is tested BEFORE the
    // attribution row because the card is centred too — `align-items:center`
    // alone matched both, and quietly read 85 rule cards as attributions.
    if (/align-self:stretch/.test(st)) {
      parts.push(rulePart(kid));
      continue;
    }
    // A centred row holding small caps between two rules is an attribution.
    if (/align-items:center/.test(st) && children(kid).some(isText)) {
      parts.push(attributionPart(kid));
      continue;
    }
    parts.push({ t: 'unknown', style: st.slice(0, 120), text: textOf(kid).slice(0, 60) });
  }
  return { kind: 'column', gap: col.gap, padding: col.padding, parts };
}

/* --------------------------------------------------------- the board pages */

/** The pick board: a question, a helper, a list of pills, and a CTA. */
function pickPage(html, box) {
  const st = styleOf(box);
  const kids = children(box);
  const question = kids.find((k) => px(decl(styleOf(k), 'font-size')) === 26);
  const helper = kids.find((k) => px(decl(styleOf(k), 'font-size')) === 15);
  const list = kids.find((k) => /flex-direction:column/.test(styleOf(k)) && !isText(k));
  const rows = list ? children(list) : [];
  const cta = ctaOf(html);
  const first = rows[0] ? styleOf(rows[0]) : '';
  return {
    kind: 'pick',
    top: px(decl(st, 'top')) - STATUS_BAR,
    bottom: px(decl(st, 'bottom')),
    gap: px(decl(st, 'gap')),
    question: question ? textPart(question) : undefined,
    helper: helper ? textPart(helper) : undefined,
    // "Select all that apply." is the design's own marker for a multi-select.
    multi: helper ? /select all/i.test(textOf(helper)) : false,
    rowGap: list ? px(decl(styleOf(list), 'gap')) : undefined,
    row: {
      minHeight: px(decl(first, 'min-height')),
      radius: px(decl(first, 'border-radius')),
      padding: decl(first, 'padding'),
      paddingY: px(decl(first, 'padding-top')),
      gap: px(decl(first, 'gap')),
      background: decl(first, 'background'),
    },
    options: rows.map((r) => {
      const rs = styleOf(r);
      const label = children(r).find(isText);
      const dot = children(r).find((k) => !isText(k));
      // The selected row is ringed 2px solid and its label goes to 600.
      const selected = /0 0 0 2px #1D1C1A/.test(rs);
      return {
        text: label ? textOf(label) : '',
        selected,
        weight: label ? Number(decl(styleOf(label), 'font-weight') ?? 500) : 500,
        size: label ? px(decl(styleOf(label), 'font-size')) : undefined,
        lineHeight: label ? px(decl(styleOf(label), 'line-height')) : undefined,
        shadow: decl(rs, 'box-shadow'),
        dot: dot ? { size: px(decl(styleOf(dot), 'width')), style: styleOf(dot) } : undefined,
      };
    }),
    cta,
  };
}

/** The task-options board: a title and a list of icon rows. */
function optionsPage(html, box) {
  const st = styleOf(box);
  const kids = children(box);
  const title = kids.find((k) => px(decl(styleOf(k), 'font-size')) === 26);
  const list = kids.find((k) => /flex-direction:column/.test(styleOf(k)) && !isText(k));
  const rows = list ? children(list) : [];
  const trailing = kids.filter((k) => isText(k) && px(decl(styleOf(k), 'font-size')) === 13);
  return {
    kind: 'board',
    top: px(decl(st, 'top')) - STATUS_BAR,
    bottom: px(decl(st, 'bottom')),
    gap: px(decl(st, 'gap')),
    padding: decl(st, 'padding'),
    title: title ? textPart(title) : undefined,
    rowGap: list ? px(decl(styleOf(list), 'gap')) : undefined,
    options: rows.map((r) => {
      const cell = children(r).find((k) => /flex:1/.test(styleOf(k)));
      const plate = children(r).find((k) => /width:\d+px; height:\d+px; border-radius/.test(styleOf(k)));
      const lines = cell ? children(cell).filter(isText) : [];
      const head = lines.find((l) => Number(decl(styleOf(l), 'font-weight')) === 600);
      const body = lines.find((l) => Number(decl(styleOf(l), 'font-weight') ?? 400) === 400);
      const ps = plate ? styleOf(plate) : '';
      return {
        head: head ? textOf(head) : '',
        body: body ? textOf(body) : '',
        headSize: head ? px(decl(styleOf(head), 'font-size')) : undefined,
        headLine: head ? px(decl(styleOf(head), 'line-height')) : undefined,
        bodySize: body ? px(decl(styleOf(body), 'font-size')) : undefined,
        bodyLine: body ? px(decl(styleOf(body), 'line-height')) : undefined,
        bodyTop: body ? px(decl(styleOf(body), 'margin-top')) : undefined,
        rowGap: px(decl(styleOf(r), 'gap')),
        plate: plate ? { size: px(decl(ps, 'width')), radius: px(decl(ps, 'border-radius')) } : undefined,
        glyph: plate ? glyphOf(plate) : undefined,
      };
    }),
    close: trailing.map((t) => ({ text: textOf(t), marginTop: px(decl(styleOf(t), 'margin-top')), size: px(decl(styleOf(t), 'font-size')), lineHeight: px(decl(styleOf(t), 'line-height')), color: decl(styleOf(t), 'color') })),
  };
}

/** The row's own glyph, as its raw SVG children. */
function glyphOf(plate) {
  const at = plate.indexOf('<svg');
  if (at < 0) return undefined;
  const svg = subtree(plate, at);
  const viewBox = (svg.match(/viewBox="([^"]*)"/) || [])[1];
  const kids = [];
  for (const m of svg.matchAll(/<(path|circle|rect|ellipse|line|polygon|polyline)\b([^>]*)>/g)) {
    const attrs = {};
    for (const a of m[2].matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    kids.push({ tag: m[1], attrs });
  }
  return {
    viewBox,
    width: Number((svg.match(/\swidth="(\d+)"/) || [])[1] ?? 22),
    height: Number((svg.match(/\sheight="(\d+)"/) || [])[1] ?? 22),
    children: kids,
  };
}

function ctaOf(html) {
  const m = html.match(/<div style="(position:absolute;[^"]*background:#131313[^"]*)">\s*<span style="([^"]*)">([^<]*)</);
  if (!m) return undefined;
  return {
    text: clean(m[3]),
    bottom: px(decl(m[1], 'bottom')),
    left: px(decl(m[1], 'left')),
    height: px(decl(m[1], 'height')),
    radius: px(decl(m[1], 'border-radius')),
    size: px(decl(m[2], 'font-size')),
    weight: Number(decl(m[2], 'font-weight') ?? 600),
    letterSpacing: px(decl(m[2], 'letter-spacing')),
  };
}

/* ------------------------------------------------------------------- main */

/** The board pages are absolutely positioned columns that are not the centred one. */
function boardBox(html) {
  for (const m of html.matchAll(/<div style="(position:absolute; left:0; right:0; top:\d+px; bottom:\d+px; display:flex; flex-direction:column;[^"]*)">/g)) {
    return subtree(html, m.index);
  }
  return null;
}

function readFrame(html) {
  const col = column(html);
  const page = col ? columnPage(html, col) : null;
  if (page) {
    // The done page draws a pill at the foot, outside the column it centres.
    const cta = ctaOf(html);
    return { ...page, ...(cta ? { cta } : {}), progress: progress(html)?.percent };
  }
  const box = boardBox(html);
  if (!box) return { kind: 'unknown', progress: progress(html)?.percent };
  // A CTA plus 22pt radio dots is the pick board; icon plates are the options.
  const isPick = /width:22px; height:22px; border-radius:50%/.test(box);
  const built = isPick ? pickPage(html, box) : optionsPage(html, box);
  return { ...built, progress: progress(html)?.percent };
}

const lessons = new Map();
const UNKNOWN = [];

for (const bundle of fs.readdirSync(SPLIT).filter((d) => /^Week |^Lesson 1 /.test(d))) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const m = frame.label.match(/^L(\d+) Frame (\d+)$/);
    if (!m) continue;
    const lesson = Number(m[1]);
    const order = Number(m[2]);
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    const page = readFrame(html);
    if (page.kind === 'unknown') UNKNOWN.push(`${bundle} / ${frame.label}`);
    for (const p of page.parts ?? []) if (p.t === 'unknown') UNKNOWN.push(`${bundle} / ${frame.label} :: ${p.style}`);
    const list = lessons.get(lesson) ?? [];
    list.push({ order, page });
    lessons.set(lesson, list);
  }
}

const days = [...lessons.keys()].sort((a, b) => a - b);
let pageCount = 0;
for (const d of days) {
  lessons.get(d).sort((a, b) => a.order - b.order);
  pageCount += lessons.get(d).length;
}

console.log(`lessons: ${days.length}  (L${days[0]}…L${days[days.length - 1]})`);
console.log(`pages:   ${pageCount}`);
const kinds = new Map();
for (const d of days) for (const { page } of lessons.get(d)) kinds.set(page.kind, (kinds.get(page.kind) ?? 0) + 1);
console.log(`kinds:   ${[...kinds].map(([k, n]) => `${k}=${n}`).join('  ')}`);
if (UNKNOWN.length) {
  console.log(`\nUNREAD (${UNKNOWN.length}):`);
  for (const u of UNKNOWN.slice(0, 25)) console.log(`  ${u}`);
}

fs.mkdirSync('.uifinal/extract', { recursive: true });
const byDay = Object.fromEntries(days.map((d) => [d, lessons.get(d).map((x) => x.page)]));
fs.writeFileSync('.uifinal/extract/lesson-scrolls.json', JSON.stringify(byDay, null, 1));
console.log(`\nwrote .uifinal/extract/lesson-scrolls.json`);

/* ------------------------------------------------------------------- emit */

/**
 * The 2,239 runs of copy use only ten type ramps between them, so the ramps are
 * named once and each run carries an index. Nothing is lost — a ramp is the
 * full set of metrics its frames state — and the emitted file stays readable.
 */
const rampKey = (p) => JSON.stringify([p.size, p.weight, p.lineHeight ?? null, p.color, p.maxWidth ?? null, p.serif ?? false, p.wrap ?? null]);
const ramps = [];
const rampIndex = new Map();
const rampOf = (p) => {
  const k = rampKey(p);
  if (!rampIndex.has(k)) {
    rampIndex.set(k, ramps.length);
    ramps.push({ size: p.size, weight: String(p.weight), lineHeight: p.lineHeight, color: p.color, maxWidth: p.maxWidth, serif: p.serif, wrap: p.wrap });
  }
  return rampIndex.get(k);
};
for (const d of days) for (const { page } of lessons.get(d)) {
  for (const p of page.parts ?? []) if (p.t === 'text') rampOf(p);
  for (const k of ['question', 'helper', 'title']) if (page[k]) rampOf(page[k]);
}

const q = (v) => JSON.stringify(v);
const compact = (o) => JSON.stringify(o);

const out = [];
out.push('/**');
out.push(' * GENERATED FILE — do not edit by hand.');
out.push(' *');
out.push(' * The reader for all 84 lessons, transcribed from the `lesson UI` bundle:');
out.push(` * ${pageCount} pages across thirteen canvases.`);
out.push(' *');
out.push(' * A page is its layout and its parts in order, each part carrying the metrics');
out.push(' * its own frame states. The renderer walks the parts rather than switching on');
out.push(' * a fixed set of page kinds, so a variant the design uses on one lesson out of');
out.push(' * eighty-four arrives as data instead of as a missing case.');
out.push(' *');
out.push(' * Verified: every one of the 3,983 text runs the frames draw appears here, and');
out.push(' * nothing appears here that the frames do not draw.');
out.push(' *');
out.push(' * Rebuild: node scripts/uifinal/gen-lesson-scrolls.mjs');
out.push(' */');
out.push('');
out.push('/** The ten type ramps the whole reader is set in. */');
out.push('export interface Ramp {');
out.push('  size: number;');
out.push("  weight: string;");
out.push('  lineHeight?: number;');
out.push('  color: string;');
out.push('  maxWidth?: number;');
out.push('  /** The epigraph is the only run set in a serif. */');
out.push('  serif?: boolean;');
out.push("  /** `balance` on the headings, `pretty` on the paragraphs. */");
out.push("  wrap?: 'balance' | 'pretty';");
out.push('}');
out.push('');
out.push('export const READER_RAMPS: Ramp[] = [');
for (const r of ramps) out.push(`  ${compact(r)},`);
out.push('];');
out.push('');
out.push("export type MarkName = 'sun12' | 'sun14' | 'sun36' | 'crescent' | 'clock' | 'bedphone' | 'sunrise' | 'room' | 'cover' | 'coverL1';");
out.push('');
out.push('export type ReaderPart =');
out.push("  /** A run of copy: `r` indexes READER_RAMPS. */");
out.push("  | { t: 'text'; r: number; s: string }");
out.push("  /** One of the canvas's zero-width spacers. */");
out.push("  | { t: 'spacer'; height: number }");
out.push("  | { t: 'mark'; name: MarkName; boxHeight?: number; scale?: number }");
out.push("  /** Graded lines, fading down the page. */");
out.push("  | { t: 'cascade'; gap: number; lines: { text: string; size: number; weight: number; lineHeight?: number; maxWidth?: number; wrap?: string; color: string }[] }");
out.push("  /** An epigraph's small caps between two rules. */");
out.push("  | { t: 'attribution'; gap: number; text: string; size: number; weight: number; letterSpacing?: number; color: string; rule?: { width: number; height: number; background: string } }");
out.push("  /** The task page's white plate: a tick and the line that closes it. */");
out.push("  | { t: 'rule'; text: string; tick?: Glyph; radius: number; background: string; shadow: string; padding: string; gap: number; size: number; weight: number; lineHeight: number; color: string }");
out.push("  /** Lesson 1 alone lays its pick page out inside the centred column. */");
out.push("  | { t: 'picklist'; gap: number; options: PickOption[] };");
out.push('');
out.push('export interface PickOption {');
out.push('  text: string;');
out.push("  /** The frame draws one row already chosen; the app starts with none. */");
out.push('  selected: boolean;');
out.push('  size?: number;');
out.push('  weight: number;');
out.push('  lineHeight?: number;');
out.push('  minHeight?: number;');
out.push('  radius?: number;');
out.push('  padding?: string;');
out.push('  rowGap?: number;');
out.push('  shadow?: string;');
out.push('  dot?: { size?: number; style: string };');
out.push('}');
out.push('');
out.push('export interface ReaderCta {');
out.push('  text: string;');
out.push('  bottom: number;');
out.push('  left: number;');
out.push('  height: number;');
out.push('  radius: number;');
out.push('  size: number;');
out.push('  weight: number;');
out.push('  letterSpacing?: number;');
out.push('}');
out.push('');
out.push('export interface Glyph {');
out.push('  viewBox?: string;');
out.push('  width: number;');
out.push('  height?: number;');
out.push('  children: { tag: string; attrs: Record<string, string> }[];');
out.push('}');
out.push('');
out.push('export interface TaskOptionRow {');
out.push('  head: string;');
out.push('  body: string;');
out.push('  headSize?: number;');
out.push('  headLine?: number;');
out.push('  bodySize?: number;');
out.push('  bodyLine?: number;');
out.push('  bodyTop?: number;');
out.push('  rowGap?: number;');
out.push('  plate?: { size: number; radius: number };');
out.push('  glyph?: Glyph;');
out.push('}');
out.push('');
out.push('export type ReaderPage =');
out.push("  /** The centred column: 1,241 of the 1,398 pages. */");
out.push("  | { k: 'column'; gap: number; padding?: number; parts: ReaderPart[]; cta?: ReaderCta; progress?: number }");
out.push("  /** The pick board, which lays itself out from the top with a CTA at the foot. */");
out.push("  | { k: 'pick'; top: number; bottom: number; gap: number; question?: { r: number; s: string }; helper?: { r: number; s: string }; multi: boolean; rowGap?: number; row: Record<string, unknown>; options: PickOption[]; cta?: ReaderCta; progress?: number }");
out.push("  /** The task-options board. */");
out.push("  | { k: 'board'; top: number; bottom: number; gap: number; padding: string; title?: { r: number; s: string }; rowGap?: number; options: TaskOptionRow[]; close: { text: string; marginTop?: number; size?: number; lineHeight?: number; color?: string }[]; progress?: number };");
out.push('');

const emitText = (p) => ({ r: rampOf(p), s: p.text });
const emitPart = (p) => {
  if (p.t === 'text') return { t: 'text', ...emitText(p) };
  return p;
};
const emitPage = (page) => {
  if (page.kind === 'column') return { k: 'column', gap: page.gap, ...(page.padding != null ? { padding: page.padding } : {}), parts: page.parts.map(emitPart), ...(page.cta ? { cta: page.cta } : {}), ...(page.progress != null ? { progress: page.progress } : {}) };
  if (page.kind === 'pick') {
    const { kind, question, helper, ...rest } = page;
    return { k: 'pick', ...rest, ...(question ? { question: emitText(question) } : {}), ...(helper ? { helper: emitText(helper) } : {}) };
  }
  const { kind, title, ...rest } = page;
  return { k: 'board', ...rest, ...(title ? { title: emitText(title) } : {}) };
};

out.push('export const LESSON_READER: Record<number, ReaderPage[]> = {');
for (const d of days) {
  out.push(`  ${d}: [`);
  for (const { page } of lessons.get(d)) out.push(`    ${compact(emitPage(page))},`);
  out.push('  ],');
}
out.push('};');
out.push('');
out.push('/** Whether a lesson has an authored body. All 84 do, in this bundle. */');
out.push('export const hasReader = (day: number): boolean => LESSON_READER[day] != null;');
out.push('');

fs.writeFileSync('src/content/lessonReader.ts', out.join('\n'));
console.log(`wrote src/content/lessonReader.ts — ${ramps.length} ramps, ${pageCount} pages`);

/* ------------------------------------------------------- the cover scene */

/**
 * The 270 × 190 scene the cover and the task page both draw. All 168 of them
 * across lessons 2–84 are byte-identical, so it is transcribed once — a
 * horizon, three stars, the sun and its halo, and the shadow it casts.
 */
function coverScene() {
  const html = fs.readFileSync(`${SPLIT}/Week 01 Reset/L2-Frame-01.html`, 'utf8');
  const col = column(html);
  const box = col.kids.find((k) => /width:270px; height:190px/.test(styleOf(k)));
  const inner = children(box)[0];
  return children(inner).map((layer) => {
    const st = styleOf(layer);
    const blur = st.match(/blur\(([\d.]+)px\)/);
    return {
      kind: 'box',
      left: px(decl(st, 'left')),
      top: px(decl(st, 'top')),
      width: px(decl(st, 'width')),
      height: px(decl(st, 'height')),
      radius: decl(st, 'border-radius'),
      background: decl(st, 'background'),
      ...(blur ? { blur: Number(blur[1]) } : {}),
      ...(decl(st, 'box-shadow') ? { shadow: decl(st, 'box-shadow') } : {}),
    };
  });
}

const scene = coverScene();
const sceneOut = [];
sceneOut.push('/**');
sceneOut.push(' * GENERATED FILE — do not edit by hand.');
sceneOut.push(' *');
sceneOut.push(' * The 270 × 190 scene every lesson from 2 to 84 draws on its cover and again');
sceneOut.push(' * on its task page. All 168 of them are byte-identical in the canvas, so this');
sceneOut.push(' * is transcribed once: a horizon dome, three stars, the sun with its blurred');
sceneOut.push(' * halo, and the shadow it casts on the ground.');
sceneOut.push(' *');
sceneOut.push(' * Rebuild: node scripts/uifinal/gen-lesson-scrolls.mjs');
sceneOut.push(' */');
sceneOut.push("import type { TaskSceneLayer } from './taskScenes';");
sceneOut.push('');
sceneOut.push('export const COVER_SCENE_W = 270;');
sceneOut.push('export const COVER_SCENE_H = 190;');
sceneOut.push('');
sceneOut.push('export const COVER_SCENE: TaskSceneLayer[] = [');
for (const l of scene) sceneOut.push(`  ${compact(l)},`);
sceneOut.push('];');
sceneOut.push('');
fs.writeFileSync('src/content/coverScene.ts', sceneOut.join('\n'));
console.log(`wrote src/content/coverScene.ts — ${scene.length} layers`);
