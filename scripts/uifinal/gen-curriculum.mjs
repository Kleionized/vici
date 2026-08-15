#!/usr/bin/env node
/**
 * Generate `src/content/curriculum84.ts` from the `UI Final` bundle.
 *
 * Sources, all inside the bundle:
 *  - `.uifinal/final/Lessons and Tasks/Lesson-NN.html` — the 83 lesson cards
 *    (number, week, title, one-line summary), read off the canvas so the copy
 *    is the design's character for character.
 *  - `.uifinal/final/Email Login/Week-*.html` — the twelve week overviews, which
 *    carry each week's name, its one-line description, and the seven lessons it
 *    holds with their numbers. This is where lesson 32 comes from: its card
 *    frame is missing from the canvas but Week V still lists it.
 *  - `UI Final/project/task-src.json` — all 84 daily tasks, as data.
 */
import fs from 'node:fs';

const ENTITIES = {
  '&middot;': '·',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&hellip;': '…',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&times;': '×',
};
const decode = (s) => s.replace(/&[a-z]+;/g, (m) => ENTITIES[m] ?? m);

/**
 * Every text run in the frame, in document order, tagged with the style of the
 * element it sits directly inside. Tokenised rather than regexed out, because a
 * `>` inside an attribute value makes a naive `<tag …>text` pattern swallow
 * markup — which it silently did on the longest intro lines.
 */
const STRAY = [];

function textNodes(html) {
  const out = [];
  const stack = [];
  for (const part of html.split(/(<[^>]*>)/g)) {
    if (!part) continue;
    if (part.startsWith('</')) {
      stack.pop();
      continue;
    }
    if (part.startsWith('<!')) continue; // comments and doctypes carry no text
    if (part.startsWith('<')) {
      const name = (part.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
      const selfClosing = part.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source'].includes(name);
      const style = (part.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
      if (!selfClosing) stack.push(style);
      continue;
    }
    const text = decode(part).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    // A few frames carry a stray fragment of a style attribute as raw text —
    // a botched string replacement in the canvas itself. Drop it rather than
    // letting it shift every board's children by one.
    if (/^[a-z-]*:[^ ]*;.*px;/.test(text) || /^[a-z-]+:\s*(absolute|relative)/.test(text)) {
      STRAY.push(text.slice(0, 80));
      continue;
    }
    out.push({ style: stack[stack.length - 1] ?? '', text });
  }
  return out;
}

/* --------------------------------------------------------- the option rows */

/**
 * The options board, read as rows rather than as a flat list of text.
 *
 * Pairing consecutive text nodes two at a time — which is what this did — is
 * only correct when every row is exactly a heading and a body. Three things
 * break that, and each one shifts every row after it:
 *
 *  - nine days draw a numbered step badge, whose `<span>1</span>` is a text
 *    node sitting between the rows;
 *  - some rows are a heading with no body at all;
 *  - most boards close with a note under the last row, which pairs with
 *    whatever precedes it.
 *
 * So walk the column's children instead. A row is the flex container; its
 * heading and body are the children of the row's text cell, in that order.
 */
function optionRows(html) {
  // The column is usually the absolutely-positioned box the rows live in.
  // `Task D01` predates the batch that applied the others and lays its board
  // out in flow instead, so fall back to the whole frame — the rows themselves
  // are built the same way in both, which is what this reads.
  const at = html.search(/<div style="position:absolute; left:24px; right:24px; top:\d+px; bottom:\d+px;/);
  const column = at >= 0;

  // Walk with a depth counter so rows are found at the right level and their
  // own inner divs are not mistaken for rows.
  const parts = html.slice(column ? at : 0).split(/(<[^>]*>)/g).filter(Boolean);
  const options = [];
  const close = [];
  let depth = 0;
  let row = null; // { depth, cell: number|null, texts: [] }
  let note = null; // depth of the current closing paragraph's own div
  let afterRows = null; // depth of the column, once its rows are behind us
  let gap = 0;
  for (const part of parts) {
    if (part.startsWith('<!')) continue;
    if (part.startsWith('</')) {
      depth--;
      if (row && depth <= row.depth) {
        if (row.texts.length) options.push({ head: row.texts[0], body: row.texts[1] ?? '' });
        row = null;
      }
      if (note != null && depth <= note) note = null;
      if (afterRows != null && depth < afterRows) afterRows = null;
      if (column && depth < 0) break; // left the column
      continue;
    }
    if (part.startsWith('<')) {
      const name = (part.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
      const style = (part.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
      const selfClosing = part.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source'].includes(name);
      // A row: the flex container that holds a badge and a text cell.
      if (!row && /display:flex; align-items:flex-start; gap:/.test(style)) row = { depth, texts: [], cell: null };
      // The text cell inside it — everything in the badge is art or a step
      // number, and neither is copy.
      if (row && /flex:1; min-width:0/.test(style)) row.cell = depth;
      // The closing note is the column's own trailing child: it carries a type
      // ramp and is set off from the last row by a margin far larger than the
      // 3-4pt that separates an option body from its heading.
      // Day 43 closes with two paragraphs, the second only 10pt under the
      // first, so "set off by a big margin" identifies where the closing note
      // *starts* — after that, every sibling text div belongs to it.
      if (!row && note == null && /font-size:/.test(style)) {
        const mt = Number((style.match(/margin-top:([\d.]+)px/) || [])[1] ?? 0);
        if (mt >= 20 || (afterRows != null && depth === afterRows)) {
          note = depth;
          afterRows = depth;
          gap = mt;
        }
      }
      if (!selfClosing) depth++;
      continue;
    }
    const text = decode(part).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    if (/^[a-z-]*:[^ ]*;.*px;/.test(text)) continue; // the canvas's stray style fragments
    if (row && row.cell != null && depth > row.cell) row.texts.push(text);
    else if (note != null && depth > note) close.push({ text, marginTop: gap });
  }
  if (row?.texts.length) options.push({ head: row.texts[0], body: row.texts[1] ?? '' });
  return { options, close };
}

/**
 * How the options board is laid out on a given day.
 *
 * The app built one board and used it for all 84, but the canvas draws two and
 * varies the metrics of both:
 *
 *  - `icon` — a 40pt rounded-square plate holding a drawn glyph. 74 days.
 *  - `step` — a 24pt white disc holding the step's number. 9 days, and the one
 *    the flat text pairing scrambled, because the number is a text node.
 *
 * Column top is 209, 225 or 260 on the canvas; row gap runs 10 · 13 · 16 · 18 ·
 * 22; the heading ramp has five variants. None of that is derivable, so it is
 * read per day and travels with the task.
 */
/** The board 74 of the 83 framed days draw, verbatim off those frames. */
const CANONICAL_BOARD = {
  kind: 'icon',
  top: 171,
  bottom: 54,
  rowGap: 22,
  cellGap: 14,
  badge: { size: 40, radius: 12 },
  head: { size: 15.5, lineHeight: 21 },
  body: { marginTop: 3, size: 13, lineHeight: 19 },
};

function boardGeometry(html) {
  const decl = (style, prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
  const px = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));

  const col = html.match(/<div style="position:absolute; left:24px; right:24px; top:(\d+)px; bottom:(\d+)px;[^"]*">\s*<div style="([^"]*)"/);
  const stepBadge = /border-radius:50%;[^"]*"><span style="font-size:12px; font-weight:600; color:#55534E;">\d+<\/span>/.test(html);

  // The first row, whose declarations stand for the board's.
  const rowGapAll = [...html.matchAll(/display:flex; align-items:flex-start; gap:([\d.]+)px;/g)];
  const head = html.match(/font-size:([\d.]+)px; font-weight:600; line-height:([\d.]+)px; color:#1D1C1A;/);
  const body = html.match(/margin-top:([\d.]+)px; font-size:([\d.]+)px; font-weight:400; line-height:([\d.]+)px; color:#767370;/);
  const badge = html.match(/width:(\d+)px; height:\1px; border-radius:(50%|\d+px);/);

  return {
    kind: stepBadge ? 'step' : 'icon',
    // The canvas's 54pt status bar is not built, so the app's top is 54 less.
    top: col ? px(col[1]) - 54 : null,
    bottom: col ? px(col[2]) - 54 : null,
    rowGap: px(decl(col?.[3] ?? '', 'gap')),
    cellGap: rowGapAll.length ? Number(rowGapAll[0][1]) : undefined,
    badge: badge ? { size: Number(badge[1]), radius: badge[2] === '50%' ? 'round' : Number(badge[2].replace('px', '')) } : undefined,
    head: head ? { size: Number(head[1]), lineHeight: Number(head[2]) } : undefined,
    body: body ? { marginTop: Number(body[1]), size: Number(body[2]), lineHeight: Number(body[3]) } : undefined,
  };
}

/* ------------------------------------------------------------------- weeks */

const EL = '.uifinal/final/Email Login';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const weekFiles = fs.readdirSync(EL).filter((f) => /^Week-[IVX]+-/.test(f));
const weeks = new Map();
for (const file of weekFiles) {
  const nodes = textNodes(fs.readFileSync(`${EL}/${file}`, 'utf8'));
  // "Week VII · Falling without unraveling."
  const line = nodes.find((n) => /^Week [IVX]+ ·/.test(n.text));
  if (!line) throw new Error(`no week line in ${file}`);
  const roman = line.text.split(' ')[1];
  const n = ROMAN.indexOf(roman) + 1;
  const name = nodes.find((n2) => /font-size:3[0-9]px|font-size:2[6-9]px/.test(n2.style))?.text ?? nodes[1].text;
  const blurb = line.text.replace(/^Week [IVX]+ · /, '');
  const entry = weeks.get(n) ?? { n, roman, name, blurb, lessons: new Map() };
  // Each lesson row is a title followed by its two-digit number.
  for (let i = 0; i < nodes.length - 1; i++) {
    const num = nodes[i + 1].text;
    if (!/^\d{2}$/.test(num)) continue;
    const title = nodes[i].text;
    if (/^Week [IVX]+ ·/.test(title) || title === '9:41') continue;
    entry.lessons.set(Number(num), title);
  }
  weeks.set(n, entry);
}

/* ------------------------------------------------------------------- cards */

const LT = '.uifinal/final/Lessons and Tasks';
const cards = new Map();
for (const file of fs.readdirSync(LT)) {
  const m = file.match(/^Lesson-(\d+)\.html$/);
  if (!m) continue;
  const nodes = textNodes(fs.readFileSync(`${LT}/${file}`, 'utf8'));
  const titleNode = nodes.find((n) => /left:36px; right:36px; top:39[26]px/.test(n.style));
  cards.set(Number(m[1]), {
    title: titleNode?.text,
    titleSize: Number((titleNode?.style.match(/font-size:([0-9.]+)px/) || [])[1]),
    summary: nodes.find((n) => /font-size:15\.5px/.test(n.style))?.text,
  });
}

/* ------------------------------------------------------------------- tasks */

/**
 * The canvas is the authority: `task-src.json` and `taskgen-meta.js` are the two
 * intermediates the frames were generated from, and the frames take the title,
 * the second title and the "done" line from the meta file while taking the intro
 * and the option bodies from the JSON. Reading the rendered frames avoids having
 * to know which. Day 32 has no frames at all, so it falls back to the JSON.
 */
const srcTasks = JSON.parse(fs.readFileSync('UI Final/project/task-src.json', 'utf8'));
const srcByDay = new Map(srcTasks.map((t) => [t.day, t]));

const size = (n) => (n ? Number((n.style.match(/font-size:([0-9.]+)px/) || [])[1]) : NaN);

function taskFromFrames(day) {
  const nn = String(day).padStart(2, '0');
  const intro = `${LT}/Task-D${nn}-Intro.html`;
  if (!fs.existsSync(intro)) {
    const j = srcByDay.get(day);
    return {
      day,
      title: j.title,
      secondTitle: j.title,
      label: j.label,
      intro: j.intro.join(' '),
      done: j.done,
      options: j.bullets.map((b) => ({ head: b.head, body: b.body })),
      // Day 32 has no frames at all — no card, no intro, no options board — so
      // there is no geometry to read. It takes the board 74 of the other 83
      // days draw, which is the closest thing the canvas states to a default.
      board: CANONICAL_BOARD,
      cardTitle: j.title,
      cardSummary: j.summary,
      fromCanvas: false,
    };
  }
  // Read by position, not by font size: `Task D01` was applied by an earlier
  // script and carries the older metrics (26 / 21 / 15 / 16) while the other 82
  // carry the batch-applied ones (27 / 14.5 / 13.5 / 15.5). The order of the
  // boards' children is the same in both.
  const i = textNodes(fs.readFileSync(intro, 'utf8'));
  const o = textNodes(fs.readFileSync(`${LT}/Task-D${nn}-Options.html`, 'utf8'));
  const c = textNodes(fs.readFileSync(`${LT}/Task-D${nn}-Card.html`, 'utf8'));
  const { options, close } = optionRows(fs.readFileSync(`${LT}/Task-D${nn}-Options.html`, 'utf8'));
  const body = o.slice(4, -1);
  return {
    day,
    title: i[3]?.text,
    secondTitle: o[3]?.text,
    // "DAY 2 · TODAY'S TASK" -> the part after the middot
    label: (i[2]?.text ?? '').split('· ')[1] ?? '',
    intro: i[4]?.text,
    done: i[5]?.text,
    options,
    close,
    board: boardGeometry(fs.readFileSync(`${LT}/Task-D${nn}-Options.html`, 'utf8')),
    cardTitle: c[2]?.text,
    cardSummary: c[3]?.text,
    metrics: { title: size(i[3]), intro: size(i[4]), done: size(i[5]), optionHead: size(body[0]), optionBody: size(body[1]) },
    fromCanvas: true,
  };
}

const taskByDay = new Map();
for (let day = 1; day <= 84; day++) taskByDay.set(day, taskFromFrames(day));
const tasks = [...taskByDay.values()];

/* ------------------------------------------------------------------- emit */

const EMPTY_OPTIONS = [];
const rows = [];
for (const n of [...weeks.keys()].sort((a, b) => a - b)) {
  const w = weeks.get(n);
  for (const day of [...w.lessons.keys()].sort((a, b) => a - b)) {
    const card = cards.get(day);
    const task = taskByDay.get(day);
    if (!task) throw new Error(`no task for day ${day}`);
    if (!task.title || !task.intro || !task.done) {
      throw new Error(`incomplete task for day ${day}: ${JSON.stringify(task)}`);
    }
    if (task.options.length === 0) EMPTY_OPTIONS.push(day);
    rows.push({
      day,
      week: n,
      // The week list and the card can disagree on capitalisation; the card is
      // the lesson's own board, so it wins where it exists.
      title: card?.title ?? w.lessons.get(day),
      weekListTitle: w.lessons.get(day),
      titleSize: card?.titleSize ?? 23,
      summary: card?.summary ?? task.cardSummary,
      hasCard: Boolean(card),
      task,
    });
  }
}

const disagree = rows.filter((r) => r.hasCard && r.title !== r.weekListTitle);
console.log(`weeks: ${weeks.size}, lessons: ${rows.length}, cards: ${cards.size}, tasks: ${tasks.length}`);
console.log(`week-list / card title disagreements: ${disagree.length}`);
for (const d of disagree) console.log(`  day ${d.day}: card "${d.title}" vs week list "${d.weekListTitle}"`);
const noCard = rows.filter((r) => !r.hasCard);
if (STRAY.length) {
  console.log(`stray style fragments dropped from the canvas: ${STRAY.length}`);
  for (const t of [...new Set(STRAY)]) console.log(`  ${t}`);
}
if (EMPTY_OPTIONS.length) console.log(`task frames whose options board is empty: ${EMPTY_OPTIONS.join(', ')}`);
console.log(`lessons with no card frame: ${noCard.map((r) => r.day).join(', ') || 'none'}`);

const q = (s) => JSON.stringify(s);

const out = [];
out.push(`/**`);
out.push(` * GENERATED FILE — do not edit by hand.`);
out.push(` *`);
out.push(` * The twelve-week, eighty-four-lesson curriculum \`UI Final\` describes, read`);
out.push(` * straight off the canvas: the week names and blurbs from the twelve`);
out.push(` * \`Week …\` overview frames, the lesson titles and one-line summaries from the`);
out.push(` * eighty-three \`Lesson NN\` cards, and the daily tasks from the bundle's own`);
out.push(` * \`task-src.json\`.`);
out.push(` *`);
out.push(` * Rebuild: node scripts/uifinal/gen-curriculum.mjs`);
out.push(` */`);
out.push('');
out.push(`/** How a day's options board is laid out. The canvas draws two, and varies both. */`);
out.push(`export interface TaskBoard {`);
out.push(`  /** \`icon\` is a 40pt glyph plate; \`step\` is a 24pt numbered disc. */`);
out.push(`  kind: 'icon' | 'step';`);
out.push(`  /** Column top and bottom, already less the canvas's 54pt status bar. */`);
out.push(`  top: number | null;`);
out.push(`  bottom: number | null;`);
out.push(`  /** Gap between option rows. */`);
out.push(`  rowGap?: number;`);
out.push(`  /** Gap between a row's badge and its text. */`);
out.push(`  cellGap?: number;`);
out.push(`  badge?: { size: number; radius: number | 'round' };`);
out.push(`  head?: { size: number; lineHeight: number };`);
out.push(`  body?: { marginTop: number; size: number; lineHeight: number };`);
out.push(`}`);
out.push('');
out.push(`export interface TaskOption {`);
out.push(`  /** The heading on the option row. */`);
out.push(`  head: string;`);
out.push(`  body: string;`);
out.push(`}`);
out.push('');
out.push(`export interface DailyTask {`);
out.push(`  day: number;`);
out.push(`  /** The heading the intro board carries. */`);
out.push(`  title: string;`);
out.push(`  /** The heading the options board carries — a different line. */`);
out.push(`  secondTitle: string;`);
out.push(`  /** The eyebrow's second half — "TONIGHT'S TASK", "TODAY'S TASK", … */`);
out.push(`  label: string;`);
out.push(`  intro: string;`);
out.push(`  options: TaskOption[];`);
out.push(`  /** What finishing it means, said plainly. */`);
out.push(`  done: string;`);
out.push(`  /**`);
out.push(`   * The note under the last option row. Most days repeat the intro's rule`);
out.push(`   * here; 23 say something else, so it cannot be derived from \`done\`.`);
out.push(`   */`);
out.push(`  close?: { text: string; marginTop: number }[];`);
out.push(`  /** How the options board is laid out — the canvas varies it by day. */`);
out.push(`  board: TaskBoard;`);
out.push(`  /** How the task reads on the Today home and in the night reminder. */`);
out.push(`  cardTitle: string;`);
out.push(`  cardSummary: string;`);
out.push(`}`);
out.push('');
out.push(`export interface Curriculum84Lesson {`);
out.push(`  day: number;`);
out.push(`  week: number;`);
out.push(`  title: string;`);
out.push(`  /** The canvas steps long titles down from 23/30 to 20/27. */`);
out.push(`  titleSize: number;`);
out.push(`  summary: string;`);
out.push(`  task: DailyTask;`);
out.push(`}`);
out.push('');
out.push(`export interface Curriculum84Week {`);
out.push(`  n: number;`);
out.push(`  roman: string;`);
out.push(`  name: string;`);
out.push(`  blurb: string;`);
out.push(`  lessons: Curriculum84Lesson[];`);
out.push(`}`);
out.push('');
out.push(`export const CURRICULUM_84: Curriculum84Week[] = [`);
for (const n of [...weeks.keys()].sort((a, b) => a - b)) {
  const w = weeks.get(n);
  out.push(`  {`);
  out.push(`    n: ${w.n},`);
  out.push(`    roman: ${q(w.roman)},`);
  out.push(`    name: ${q(w.name)},`);
  out.push(`    blurb: ${q(w.blurb)},`);
  out.push(`    lessons: [`);
  for (const r of rows.filter((r) => r.week === n)) {
    const t = r.task;
    out.push(`      {`);
    out.push(`        day: ${r.day},`);
    out.push(`        week: ${r.week},`);
    out.push(`        title: ${q(r.title)},`);
    out.push(`        titleSize: ${r.titleSize},`);
    out.push(`        summary: ${q(r.summary)},`);
    out.push(`        task: {`);
    out.push(`          day: ${t.day},`);
    out.push(`          title: ${q(t.title)},`);
    out.push(`          secondTitle: ${q(t.secondTitle)},`);
    out.push(`          label: ${q(t.label)},`);
    out.push(`          intro: ${q(t.intro)},`);
    out.push(`          options: [`);
    for (const b of t.options) out.push(`            { head: ${q(b.head)}, body: ${q(b.body)} },`);
    out.push(`          ],`);
    out.push(`          done: ${q(t.done)},`);
    if (t.close?.length) out.push(`          close: ${JSON.stringify(t.close)},`);
    out.push(`          board: ${JSON.stringify(t.board)},`);
    out.push(`          cardTitle: ${q(t.cardTitle)},`);
    out.push(`          cardSummary: ${q(t.cardSummary)},`);
    out.push(`        },`);
    out.push(`      },`);
  }
  out.push(`    ],`);
  out.push(`  },`);
}
out.push(`];`);
out.push('');
out.push(`/** Every lesson, flattened, in day order. */`);
out.push(`export const CURRICULUM_84_DAYS: Curriculum84Lesson[] = CURRICULUM_84.flatMap((w) => w.lessons);`);
out.push('');
out.push(`export function lessonForDay(day: number): Curriculum84Lesson | undefined {`);
out.push(`  return CURRICULUM_84_DAYS.find((l) => l.day === day);`);
out.push(`}`);
out.push('');
out.push(`export function weekFor(n: number): Curriculum84Week | undefined {`);
out.push(`  return CURRICULUM_84.find((w) => w.n === n);`);
out.push(`}`);
out.push('');

fs.writeFileSync('src/content/curriculum84.ts', out.join('\n'));
console.log(`wrote src/content/curriculum84.ts (${out.length} lines)`);
