#!/usr/bin/env node
/**
 * Pass 2 — the copy sweep.
 *
 * Pass 3's sweep compared colour and type *literals*. Nothing had yet checked
 * the other half of the brief's "never invent copy" rule: that every word the
 * canvas draws exists verbatim somewhere in the app.
 *
 * So this walks every frame that has an app target, tokenises out every text
 * run it draws, and looks for that run in the app's source. A run that is not
 * found is either copy the run invented, copy it dropped, or copy it retyped
 * with a different character — all three are defects, all three are invisible
 * to a colour sweep, and all three are easy to miss by re-reading two boards
 * that say roughly the same thing.
 *
 *   node scripts/uifinal/copy-sweep.mjs [--bundle <name>] [--frames <substring>]
 */
import fs from 'node:fs';
import path from 'node:path';

import { mapFor } from './map.mjs';

const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal/final');

/* --------------------------------------------------------------- entities */

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…',
  '&times;': '×', '&deg;': '°', '&apos;': "'", '&#39;': "'", '&minus;': '−',
  '&rarr;': '→', '&larr;': '←',
};
const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);

/* ------------------------------------------------------- the app's own text */

/** Every source file whose strings could reach the screen. */
function sourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * The app writes copy as JSX text, as string literals and as template strings,
 * and a line break in the source is not a line break on screen. Normalising
 * whitespace on both sides is what makes the comparison a test of the words
 * rather than of how the file happens to be wrapped.
 */
const squash = (s) =>
  s
    .replace(/\{'\s*'\}/g, ' ')
    .replace(/\\n/g, ' ')
    // The app writes some copy with escaped code points (`Where you’re
    // starting`) and some with the character itself. Both render the same, so
    // both have to read the same here or the escape looks like missing copy.
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\(['"`])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * `&rsquo;` in JSX text and in a JSX string attribute is decoded by the
 * transform, so the app's source spelling of a character is not what reaches
 * the screen. Decoding here compares rendered text to rendered text.
 * (`scripts/uifinal/entity-sweep.mjs` separately proves no entity survives into
 * a position where it *would* render literally.)
 */
const CORPUS = squash(
  decode(
    sourceFiles(path.join(ROOT, 'src'))
      .map((f) => fs.readFileSync(f, 'utf8'))
      .join('\n \n'),
  ),
);

/* ------------------------------------------------- the canvas's drawn text */

/**
 * Text runs, read with a tag stack rather than a regex — a regex desyncs on
 * HTML comments and on attribute values that contain `>`.
 */
function textRuns(html) {
  const runs = [];
  let i = 0;
  let skip = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (lt > i && !skip) {
      const text = decode(html.slice(i, lt)).replace(/\s+/g, ' ').trim();
      if (text) runs.push(text);
    }
    if (html.startsWith('<!--', lt)) {
      i = html.indexOf('-->', lt) + 3;
      continue;
    }
    if (html.startsWith('<!', lt)) {
      i = html.indexOf('>', lt) + 1;
      continue;
    }
    let j = lt + 1;
    let quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
      j++;
    }
    const raw = html.slice(lt, j + 1);
    const closing = raw[1] === '/';
    const tag = (raw.match(/^<\/?\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    // <style>/<script> bodies are not drawn text.
    if (tag === 'style' || tag === 'script') skip = closing ? Math.max(0, skip - 1) : skip + 1;
    i = j + 1;
  }
  return runs;
}

/* --------------------------------------------------------------- the sweep */

const arg = (flag) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : null);
const onlyBundle = arg('--bundle');
const onlyFrames = arg('--frames');

/** Runs that are never app copy: single glyphs, bare numbers, CSS fragments. */
function isCopy(run) {
  if (run.length < 3) return false;
  if (/^[\d\s.,:%+–—\-/·×°]+$/.test(run)) return false;
  if (/[{};]\s*$/.test(run) || /^[a-z-]+\s*:\s*\S+;/.test(run)) return false;
  return /[A-Za-z]{2}/.test(run);
}

/**
 * The app composes most of its short runs at runtime — `Mood 4/5 · 7h sleep`
 * is four interpolations and a separator, and no source file contains it whole.
 * So a whole-run miss is not itself a finding. Break the run at the seams the
 * app actually composes on (the middot, the dash, any number) and report the
 * *phrases*: a phrase of three or more words that appears nowhere in `src/` is
 * copy the app does not have, whoever composed it.
 */
function phrases(run) {
  return run
    .split(/\s*[·—|]\s*|\d[\d,.:/]*\s*(?:pm|am|h|%)?/gi)
    .map((p) => p.replace(/^[^A-Za-z“”‘’']+|[^A-Za-z“”‘’'.?!]+$/g, '').trim())
    .filter((p) => p.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length >= 3);
}

const results = [];
let framesRead = 0;
let runsRead = 0;

for (const bundle of fs.readdirSync(SPLIT)) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  if (onlyBundle && bundle !== onlyBundle) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const { target } = mapFor(bundle, frame.label);
    // Only frames the run undertook to build. Dispositioned rows (superseded
    // canvases, harness renders, specimen cards) are closed on other evidence.
    if (!target || !target.startsWith('src/')) continue;
    if (onlyFrames && !frame.label.includes(onlyFrames)) continue;
    framesRead++;
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    const runs = [...new Set(textRuns(html).filter(isCopy))];
    runsRead += runs.length;
    const misses = [];
    for (const run of runs) {
      if (CORPUS.includes(squash(run))) continue;
      // Whole run absent — now ask whether its *phrases* are absent too, which
      // is what separates a defect from a string the app composes at runtime.
      for (const p of phrases(run)) if (!CORPUS.includes(squash(p))) misses.push(p);
    }
    const unique = [...new Set(misses)];
    if (unique.length) results.push({ bundle, label: frame.label, target, misses: unique, total: runs.length });
  }
}

console.log(`frames swept: ${framesRead}`);
console.log(`distinct text runs checked: ${runsRead}`);
console.log(`frames with a run not found in src/: ${results.length}`);
console.log(`runs not found: ${results.reduce((n, r) => n + r.misses.length, 0)}`);
console.log('');
for (const r of results) {
  console.log(`## [${r.bundle}] ${r.label}  (${r.misses.length}/${r.total}) -> ${r.target}`);
  for (const m of r.misses) console.log(`   - ${JSON.stringify(m)}`);
}
