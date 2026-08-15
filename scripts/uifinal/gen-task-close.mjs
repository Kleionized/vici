#!/usr/bin/env node
/**
 * The closing note on each `Task DNN Options` board.
 *
 * Pass 2's copy sweep found 23 Options frames drawing a sentence the app has
 * nowhere. It is the last child of the options column, and it is *not* the
 * Intro board's rule line: day 45 closes its intro with "Done when the note is
 * written and pinned." and its options with "Save the three time blocks in a
 * pinned note."
 *
 * The other days repeat the intro's rule here, which is exactly why only 23
 * showed up as missing text and why re-reading the two boards would not have
 * caught it — on most days the two lines agree.
 *
 * Telling the note from an option body is a matter of the gap above it: an
 * option body sits `margin-top:3px` under its own heading, the closing note
 * sits 40–66pt under the last row. The canvas also varies its line-height by
 * day (18, 18.5, 19), so the metrics travel with the text.
 *
 * Rebuild: node scripts/uifinal/gen-task-close.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = '.uifinal/final/Lessons and Tasks';

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…',
  '&times;': '×', '&deg;': '°', '&apos;': "'", '&#39;': "'",
};
const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);

const decl = (style, prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
const px = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));

const notes = {};
for (const file of fs.readdirSync(DIR)) {
  const m = file.match(/^Task-D(\d+)-Options\.html$/);
  if (!m) continue;
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  let found = null;
  for (const hit of html.matchAll(/<div style="([^"]*)">([^<]+)<\/div>/g)) {
    const style = hit[1];
    if (px(decl(style, 'font-size')) !== 13) continue;
    const top = px(decl(style, 'margin-top'));
    // An option body is 3pt under its heading; the closing note is set off.
    if (top == null || top < 20) continue;
    found = {
      text: decode(hit[2]).replace(/\s+/g, ' ').trim(),
      marginTop: top,
      lineHeight: px(decl(style, 'line-height')),
      color: decl(style, 'color'),
    };
  }
  if (found) notes[Number(m[1])] = found;
}

const days = Object.keys(notes).map(Number).sort((a, b) => a - b);
console.log(`Options frames carrying a closing note: ${days.length}`);

const metrics = new Map();
for (const d of days) {
  const k = `${notes[d].marginTop}/${notes[d].lineHeight}/${notes[d].color}`;
  metrics.set(k, (metrics.get(k) ?? 0) + 1);
}
console.log('margin-top/line-height/colour:');
for (const [k, n] of [...metrics].sort((a, b) => b[1] - a[1])) console.log(`  ${k}  ×${n}`);

/* --------- which of them differ from the intro rule the app already has ---- */

const curriculum = fs.readFileSync('src/content/curriculum84.ts', 'utf8');
const absent = days.filter((d) => !curriculum.includes(JSON.stringify(notes[d].text).slice(1, -1)));
console.log(`\nclosing notes whose text the app carries nowhere: ${absent.length} — days ${absent.join(', ')}`);

fs.mkdirSync('.uifinal/extract', { recursive: true });
fs.writeFileSync('.uifinal/extract/task-close.json', JSON.stringify(notes, null, 2));

const lines = [];
lines.push('/**');
lines.push(' * GENERATED FILE — do not edit by hand.');
lines.push(' *');
lines.push(' * The closing note each `Task DNN Options` board draws under its last option');
lines.push(" * row. On most days it repeats the Intro board's rule; on 23 it says something");
lines.push(' * else entirely, which is why it has to travel separately from `task.done`.');
lines.push(' *');
lines.push(' * `marginTop` is the gap the canvas leaves under the last option row, and');
lines.push(' * `lineHeight` varies by day (18, 18.5, 19) — both are stated, not derived.');
lines.push(' *');
lines.push(' * Rebuild: node scripts/uifinal/gen-task-close.mjs');
lines.push(' */');
lines.push('');
lines.push('export interface TaskClosingNote {');
lines.push('  text: string;');
lines.push("  /** Gap under the last option row, in pt. */");
lines.push('  marginTop: number;');
lines.push('  lineHeight: number;');
lines.push('  color: string;');
lines.push('}');
lines.push('');
lines.push('export const TASK_CLOSING_NOTE: Record<number, TaskClosingNote> = {');
for (const d of days) {
  const n = notes[d];
  lines.push(`  ${d}: { text: ${JSON.stringify(n.text)}, marginTop: ${n.marginTop}, lineHeight: ${n.lineHeight}, color: ${JSON.stringify(n.color)} },`);
}
lines.push('};');
lines.push('');
fs.writeFileSync('src/content/taskClosing.ts', lines.join('\n'));
console.log(`wrote src/content/taskClosing.ts (${days.length} days)`);
