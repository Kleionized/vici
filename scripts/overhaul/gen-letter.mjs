#!/usr/bin/env node
/**
 * Pull `39 · A Letter From Week XII`'s prose out of the frame.
 *
 * Forked from `scripts/uifinal1/gen-letter.mjs` and repointed at this drop's
 * split frame (`.overhaul/final/Email-Login/Letter-Week-XII.html`). The drop
 * cut the letter from twelve paragraphs to four and set one run in bold
 * (`<span style="font-weight:700; color:#F2F0EC">`), so each paragraph is
 * written as runs — `{ text, bold? }` — with the frame's own spaces either side
 * of the span kept, and the plain text joined from them for the Log's copy.
 *
 * Writes `src/content/weekXiiLetter.ts`.
 */
import fs from 'node:fs';

const SRC = '.overhaul/final/Email-Login/Letter-Week-XII.html';
const html = fs.readFileSync(SRC, 'utf8');

// the paragraph column: the card's `gap:14px` flex column, one `<div>` per paragraph
const open = html.indexOf('flex-direction:column; gap:14px; font-size:15px; line-height:24px;');
if (open < 0) throw new Error('no paragraph column in ' + SRC);
const start = html.indexOf('>', open) + 1;
const end = html.indexOf('</div></div>', start) + '</div>'.length;
const column = html.slice(start, end);

const paras = [...column.matchAll(/<div>(.*?)<\/div>/g)].map((m) => {
  const runs = [];
  let rest = m[1];
  for (;;) {
    const i = rest.indexOf('<span');
    if (i < 0) break;
    if (i > 0) runs.push({ text: rest.slice(0, i) });
    const style = rest.slice(i, rest.indexOf('>', i));
    if (!/font-weight:700/.test(style)) throw new Error('a span that is not the bold run: ' + style);
    const close = rest.indexOf('</span>', i);
    runs.push({ text: rest.slice(rest.indexOf('>', i) + 1, close), bold: true });
    rest = rest.slice(close + '</span>'.length);
  }
  if (rest) runs.push({ text: rest });
  for (const r of runs) if (/[<>&]/.test(r.text)) throw new Error('markup left in a run: ' + r.text);
  return runs;
});
if (paras.length !== 4) throw new Error(`expected 4 paragraphs, found ${paras.length}`);
if (paras.flat().filter((r) => r.bold).length !== 1) throw new Error('expected exactly one bold run');

const run = (r) => (r.bold ? `{ text: ${JSON.stringify(r.text)}, bold: true }` : `{ text: ${JSON.stringify(r.text)} }`);
const out = [
  '/**',
  ' * `39 · A Letter From Week XII` — the letter, word for word off the frame.',
  ' *',
  ' * GENERATED FILE — do not edit by hand. Written by `scripts/overhaul/gen-letter.mjs`',
  ' * from `.overhaul/final/Email-Login/Letter-Week-XII.html`. Re-run the generator instead.',
  ' *',
  ' * Four paragraphs as runs (the frame sets one in 700 ink); only the name is his.',
  ' */',
  '',
  'export type LetterRun = { text: string; bold?: boolean };',
  '',
  '/** Each paragraph as the frame draws it — the bold run marked. */',
  'export const WEEK_XII_RUNS: LetterRun[][] = [',
  ...paras.map((p) => `  [${p.map(run).join(', ')}],`),
  '];',
  '',
  '/** The same paragraphs as plain text (the journal entry, and callers that pass strings). */',
  "export const WEEK_XII_LETTER: string[] = WEEK_XII_RUNS.map((p) => p.map((r) => r.text).join(''));",
  '',
].join('\n');
fs.writeFileSync('src/content/weekXiiLetter.ts', out);
console.log(`src/content/weekXiiLetter.ts — ${paras.length} paragraphs, ${paras.flat().length} runs`);
