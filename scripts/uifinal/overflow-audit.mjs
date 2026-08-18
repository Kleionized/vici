#!/usr/bin/env node
/**
 * Text that can outgrow the box it is pinned in.
 *
 * The canvas composes every board with one specimen sentence, so a caption it
 * draws on two lines gets exactly the room two lines need. The app's real copy
 * is longer and varies per day, per lesson and per user — and where the app
 * copied the frame literally, a third line lands on the edge and a fourth is
 * cut off by the `overflow: hidden` that rounds the card's corners.
 *
 * The shape that actually loses text is narrow: a box that **fixes a height**
 * and **clips**, holding text that **wraps** (both edges bound) and sits low
 * enough that few lines fit. Anything else either grows or spills visibly, and
 * spilling is a design question rather than lost words.
 *
 * Nesting is read from indentation — this codebase is prettier-formatted, so a
 * child of a tag opening at column N opens at column N+2 or deeper.
 *
 *   node scripts/uifinal/overflow-audit.mjs [--lines N] [--all]
 */
import fs from 'node:fs';
import path from 'node:path';

const arg = (f) => (process.argv.includes(f) ? process.argv[process.argv.indexOf(f) + 1] : null);
const LIMIT = Number(arg('--lines') ?? 3);
const ALL = process.argv.includes('--all');
/**
 * The other way varying copy breaks these boards. Every canvas screen pins its
 * parts at absolute tops, so a sentence that runs one line longer than the
 * frame's specimen does not clip — it walks into whatever is pinned beneath it.
 * This measures each wrapping text against the next `top` below it in the same
 * component and reports how many lines fit before they touch.
 */
const COLLIDE = process.argv.includes('--collide');

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files(full, out);
    else if (/\.tsx$/.test(e.name)) out.push(full);
  }
  return out;
}

const num = (block, prop) => {
  const m = block.match(new RegExp(`(?:^|[,{\\s])${prop}:\\s*(-?[\\d.]+)`));
  return m ? Number(m[1]) : undefined;
};

/** The whole opening tag starting at `i`, however many lines it spans. */
function openingTag(lines, i) {
  let out = '';
  let depth = 0;
  for (let k = i; k < Math.min(i + 40, lines.length); k++) {
    out += lines[k] + ' ';
    for (const ch of lines[k]) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth <= 0 && /(\/>|>)\s*$/.test(lines[k].trimEnd())) break;
  }
  return out;
}

const findings = [];

for (const file of files('src')) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  /** Open ancestors, as { indent, height, clips }. */
  const stack = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    // A new top-level declaration is a new tree: without this the open
    // ancestors of one component leak into the next and claim its text, which
    // is how a 58-tall button two hundred lines up came to "contain" a caption.
    if (/^(export\s+)?(function|const|class)\s/.test(raw)) stack.length = 0;

    // A closing tag ends its element: without popping here a sibling that has
    // already closed stays on the stack and claims whatever follows it.
    const closed = raw.match(/^(\s*)<\/([A-Za-z][\w.]*)>/);
    if (closed) {
      const at = closed[1].length;
      while (stack.length && stack[stack.length - 1].indent >= at) stack.pop();
      continue;
    }

    const m = raw.match(/^(\s*)<([A-Za-z][\w.]*)/);
    if (!m) continue;
    const indent = m[1].length;
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();

    const tag = openingTag(lines, i);
    const height = /minHeight:\s*\d/.test(tag) ? undefined : num(tag, 'height');
    const clips = /overflow:\s*'hidden'/.test(tag);

    // Is this a wrapping text pinned low inside a clipping, fixed-height box?
    const isAbs = /position:\s*'absolute'/.test(tag);
    const top = num(tag, 'top');
    const fontSize = num(tag, 'fontSize');
    const bothEdges = /(?:^|[,{\s])left:/.test(tag) && /(?:^|[,{\s])right:/.test(tag);
    const clamped = /numberOfLines/.test(tag);

    if (isAbs && top != null && fontSize != null && bothEdges && !clamped) {
      const lh = num(tag, 'lineHeight') ?? Math.round(fontSize * 1.3);
      const owner = [...stack].reverse().find((a) => a.height != null && (ALL || a.clips));
      if (owner) {
        const fits = Math.floor((owner.height - top) / lh);
        if (fits <= LIMIT) {
          findings.push({
            file: path.relative(process.cwd(), file),
            line: i + 1,
            boxLine: owner.line,
            boxHeight: owner.height,
            clips: owner.clips,
            top,
            lh,
            fits,
            spare: owner.height - top - fits * lh,
            text: raw.trim().slice(0, 58),
          });
        }
      }
    }

    if (!/\/>\s*$/.test(tag.trimEnd())) stack.push({ indent, height, clips, line: i + 1 });
  }
}

if (COLLIDE) {
  findings.length = 0;
  for (const file of files('src')) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    // Absolutely positioned parts, grouped by the component they belong to.
    let group = [];
    const groups = [group];
    for (let i = 0; i < lines.length; i++) {
      if (/^(export\s+)?(function|const|class)\s/.test(lines[i])) { group = []; groups.push(group); }
      const m = lines[i].match(/^(\s*)<([A-Za-z][\w.]*)/);
      if (!m) continue;
      const tag = openingTag(lines, i);
      if (!/position:\s*'absolute'/.test(tag)) continue;
      const top = num(tag, 'top');
      if (top == null) continue;
      group.push({
        line: i + 1,
        indent: m[1].length,
        top,
        fontSize: num(tag, 'fontSize'),
        lineHeight: num(tag, 'lineHeight'),
        wraps: /(?:^|[,{\s])left:/.test(tag) && /(?:^|[,{\s])right:/.test(tag),
        clamped: /numberOfLines/.test(tag),
        // Copy the frame hardcodes cannot grow; only an interpolation can. The
        // children are whatever follows the opening tag up to the close.
        variable: (() => {
          const body = lines.slice(i, Math.min(i + 12, lines.length)).join('\n');
          const kids = body.slice(body.indexOf('>') + 1).split(/<\/[A-Za-z]/)[0];
          return /\{/.test(kids);
        })(),
        text: lines[i].trim().slice(0, 56),
      });
    }
    for (const g of groups) {
      const sorted = [...g].sort((a, b) => a.top - b.top);
      for (const part of g) {
        if (!part.wraps || part.fontSize == null || part.clamped || !part.variable) continue;
        // the nearest part pinned below it, at the same nesting level
        const below = sorted.find((o) => o.top > part.top && Math.abs(o.indent - part.indent) <= 2);
        if (!below) continue;
        const lh = part.lineHeight ?? Math.round(part.fontSize * 1.3);
        const room = below.top - part.top;
        const fits = Math.floor(room / lh);
        if (fits <= LIMIT) {
          findings.push({
            file: path.relative(process.cwd(), file),
            line: part.line,
            boxLine: below.line,
            boxHeight: below.top,
            clips: false,
            top: part.top,
            lh,
            fits,
            spare: room - fits * lh,
            text: part.text,
          });
        }
      }
    }
  }
}

findings.sort((a, b) => a.fits - b.fits || a.spare - b.spare);
const what = COLLIDE ? `wrapping text that meets the next pinned part within ${LIMIT} lines` : `wrapping text inside a ${ALL ? 'fixed-height' : 'clipping fixed-height'} box with room for ${LIMIT} lines or fewer`;
console.log(`${what}: ${findings.length}\n`);
for (const f of findings) {
  console.log(`${f.file}:${f.line}   ${f.fits} line${f.fits === 1 ? '' : 's'} fit, ${f.spare} spare`);
  if (COLLIDE) console.log(`   text at ${f.top} · ${f.lh} leading · next part pinned at ${f.boxHeight} (line ${f.boxLine})`);
  else console.log(`   box ${f.boxHeight} tall${f.clips ? ' and clipping' : ''} (line ${f.boxLine}) · text at ${f.top} · ${f.lh} leading`);
  console.log(`   ${f.text}`);
}
