#!/usr/bin/env node
/**
 * Completeness check by words: every literal string the canvas draws, looked up
 * in the app's own source.
 *
 * It cannot prove a screen is laid out right, but it does prove a screen — or a
 * sentence, or a button — is not there at all, across all 267 frames in a
 * second. Strings the app builds by concatenation or holds in generated content
 * are found too, because it greps `src/` whole.
 *
 * Usage: node scripts/vicifull/copy-sweep.mjs [bundle] [--missing] [--frame=Label]
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const bundle = args.find((a) => !a.startsWith('--')) ?? 'Email-Login';
const onlyMissing = args.includes('--missing');
const frameFilter = (args.find((a) => a.startsWith('--frame=')) ?? '').slice(8);

/** Every .ts/.tsx under src/, concatenated once. */
function corpus(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) corpus(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(fs.readFileSync(p, 'utf8'));
  }
  return acc;
}
const SRC = corpus('src').join('\n');

const ENT = (s) =>
  s
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–').replace(/&middot;/g, '·').replace(/&hellip;/g, '…')
    .replace(/&minus;/g, '−').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    // `&ldquo;`/`&rdquo;` were missing from this table, so every canvas string
    // with a curly double quote was compared against source that carries the
    // character and reported missing — two false positives on `Lessons-and-Tasks`.
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&times;/g, '×')
    .replace(/\s+/g, ' ')
    .trim();

/** The strings that are chrome, a clock, or a single glyph — not copy. */
const NOISE = new Set(['9:41', '·', '', '—', '–']);

const { frames } = JSON.parse(fs.readFileSync(`.vicifull/scenes/${bundle}.json`, 'utf8'));
let total = 0;
let missing = 0;
const report = [];
for (const f of frames) {
  if (frameFilter && f.label !== frameFilter) continue;
  const strings = [...new Set(f.text.map(ENT))].filter((s) => s && !NOISE.has(s) && s.length > 1);
  // A string the app composes from a template — `Back to Week ${roman}` — is
  // present without appearing whole. Fall back to its longest run of words that
  // has no obvious substitution in it, so composition does not read as absence.
  const window = (s) => {
    const w = s.split(' ');
    let best = '';
    for (let n = w.length; n >= 4; n--) {
      for (let i = 0; i + n <= w.length; i++) {
        const run = w.slice(i, i + n).join(' ');
        if (SRC.includes(run) && run.length > best.length) best = run;
      }
      if (best) break;
    }
    return best;
  };
  /* A middot joins a template's parts — `Week I · <blurb>`, `Navigator · 1,150`,
     `Lesson 5 · Week II`. Check each part on its own and ignore the parts that
     are only a number, a roman numeral, a price or a date. */
  const FILLER = /^[\s\d.,:$£€%+\-—–·]*$|^[IVXLC]+$|^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i;
  const composed = (s) => {
    const parts = s.split(/\s+·\s+/).map((x) => x.trim()).filter(Boolean);
    if (parts.length < 2) return false;
    return parts.every((x) => FILLER.test(x) || SRC.includes(x) || (x.split(' ').length >= 5 && window(x).split(' ').length >= x.split(' ').length - 2));
  };
  const gone = strings.filter(
    (s) => !SRC.includes(s) && !(s.split(' ').length >= 5 && window(s).split(' ').length >= s.split(' ').length - 2) && !composed(s),
  );
  total += strings.length;
  missing += gone.length;
  if (gone.length || !onlyMissing) {
    report.push(`${gone.length ? '✗' : '✓'} ${f.label}  (${strings.length - gone.length}/${strings.length})`);
    for (const s of gone) report.push(`    - ${JSON.stringify(s)}`);
  }
}
console.log(report.join('\n'));
console.log(`\n--- ${bundle}: ${total} strings, ${total - missing} found in src/, ${missing} missing`);
