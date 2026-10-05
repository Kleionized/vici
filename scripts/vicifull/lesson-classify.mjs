#!/usr/bin/env node
/**
 * Classify every reader frame in the twelve `Week NN` canvases.
 *
 * The new bundle authors a body for all 83 lessons the last drop left without
 * one — 1,372 frames. Before any of it can be transcribed, the taxonomy has to
 * be known: writing an extractor against a guess at the page kinds would
 * silently drop whatever the guess missed.
 *
 * So this reads each frame's *shape* rather than its words — the ordered list
 * of type ramps in the content column, plus the structural markers (an options
 * column, a pick list, a mark) — and groups frames by that signature. A
 * signature with one member is as interesting as one with four hundred: it is
 * either a page kind of its own or a frame that breaks the pattern.
 *
 *   node scripts/vicifull/lesson-classify.mjs [--sig <signature>] [--limit N]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.vicifull/lessons');

const arg = (f) => (process.argv.includes(f) ? process.argv[process.argv.indexOf(f) + 1] : null);
const ONLY_SIG = arg('--sig');
const LIMIT = Number(arg('--limit') ?? 0);

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…',
  '&times;': '×', '&deg;': '°', '&apos;': "'", '&#39;': "'",
};
export const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);

const decl = (style, prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();

/**
 * The frame's drawn elements, in document order, with the style of the element
 * each run of text sits directly inside. Tokenised with a tag stack: a regex
 * desyncs on comments and on `>` inside an attribute value.
 */
export function elements(html) {
  const out = [];
  const stack = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (lt > i) {
      const text = decode(html.slice(i, lt)).replace(/\s+/g, ' ').trim();
      // The canvas prefixes some runs with a stray "· " that is not drawn copy;
      // it marks an edited node in the design tool.
      if (text) out.push({ kind: 'text', text: text.replace(/^·\s+/, ''), style: stack[stack.length - 1]?.style ?? '', tag: stack[stack.length - 1]?.tag ?? '' });
    }
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    if (html.startsWith('<!', lt)) { i = html.indexOf('>', lt) + 1; continue; }
    let j = lt + 1, quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) { if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
      j++;
    }
    const raw = html.slice(lt, j + 1);
    const closing = raw[1] === '/';
    const tag = (raw.match(/^<\/?\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    const selfClosing = raw.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'stop'].includes(tag);
    if (closing) stack.pop();
    else {
      const style = (raw.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
      out.push({ kind: 'open', tag, style, raw });
      if (!selfClosing) stack.push({ tag, style });
    }
    i = j + 1;
  }
  return out;
}

/** Everything the status bar and the page chrome draw is not the page. */
const CHROME = (t) => ['9:41', 'Close', 'Back'].includes(t);

/**
 * A frame's signature: the ordered type ramps of its copy, plus the structural
 * features that distinguish two pages that happen to share a ramp.
 */
export function signature(html) {
  const els = elements(html);
  const parts = [];
  let listRows = 0;
  let optionRows = 0;
  let hasSvgMark = false;
  let hasCta = false;

  for (const e of els) {
    if (e.kind === 'open') {
      // A pick row: a bordered pill with a text cell.
      if (/border-radius:1[24]px/.test(e.style) && /border:1(\.\d+)?px/.test(e.style)) listRows++;
      // An option row on a task board: the 40pt plate or the flex row.
      if (/display:flex; align-items:flex-start; gap:/.test(e.style)) optionRows++;
      if (e.tag === 'svg' && !/width="1[0-9]"/.test(e.raw)) hasSvgMark = true;
      if (/background:#131313/.test(e.style) && /border-radius:2[4-9]px/.test(e.style)) hasCta = true;
      continue;
    }
    if (CHROME(e.text)) continue;
    const fs = decl(e.style, 'font-size');
    const fw = decl(e.style, 'font-weight');
    const ff = decl(e.style, 'font-family');
    if (!fs) continue;
    parts.push(`${parseFloat(fs)}${fw && fw !== '400' ? '/' + fw : ''}${ff ? '/serif' : ''}`);
  }
  const feat = [];
  if (listRows) feat.push(`pick${listRows}`);
  if (optionRows) feat.push(`opt${optionRows}`);
  if (hasSvgMark) feat.push('mark');
  if (hasCta) feat.push('cta');
  return { sig: parts.join(' ') + (feat.length ? ' | ' + feat.join(',') : ''), parts, feat };
}

/* ------------------------------------------------------------------- main */

const groups = new Map();
let frames = 0;

for (const bundle of fs.readdirSync(SPLIT).filter((d) => d.startsWith('Week '))) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    const { sig } = signature(html);
    frames++;
    const g = groups.get(sig) ?? { n: 0, examples: [] };
    g.n++;
    if (g.examples.length < 4) g.examples.push(`${bundle} / ${frame.label}`);
    groups.set(sig, g);
  }
}

const sorted = [...groups].sort((a, b) => b[1].n - a[1].n);
console.log(`frames classified: ${frames}`);
console.log(`distinct signatures: ${sorted.length}`);
console.log('');
let shown = 0;
for (const [sig, g] of sorted) {
  if (ONLY_SIG && !sig.includes(ONLY_SIG)) continue;
  if (LIMIT && shown++ >= LIMIT) break;
  console.log(`${String(g.n).padStart(4)}×  ${sig}`);
  for (const ex of g.examples) console.log(`        ${ex}`);
}
