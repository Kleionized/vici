#!/usr/bin/env node
/**
 * Generate `src/content/curriculum84.ts` from the `Vici Overhaul` bundle.
 *
 * The frames are the source; the designer's own data files only cross-check them.
 *
 *  - `.overhaul/final/Email-Login/Week-<R>-<Name>.html` (+ `-P2`) — the twelve week
 *    pages: caps `Week <R>`, the week's name, its blurb, its hero's `data-hero`, and
 *    the seven lesson rows (four on the page, three more on P2).
 *  - `.overhaul/final/Week-NN-<Name>/L<n>-Frame-<k>.html` — the 84 lesson readers:
 *    the cover (`Frame 1`: `Lesson <n>`, the title, the hero's `data-hero`), the
 *    first reading page (`Part 1`), and the two task pages (`Today’s task` + the
 *    title + practice, then more practice + the `Done when` card).
 *  - `.overhaul/final/Lesson-Illustrations-v4/*.html` — the 53 hero ids; every id
 *    the curriculum names must be one of them.
 *  - `.overhaul/final/Email-Login/{Today-Home-Task,Night-Action-Reminder}.html` —
 *    day 1's task sentence (`task.cardSummary`), the one both frames draw under
 *    lesson 1's title. Days 2–84 take the first sentence of the lesson's own
 *    task, `practice[0]` (D339): no frame draws their line, and the previous
 *    drop's sentence often named a different task from the new lesson's.
 *  - `Vici Overhaul/project/task-src.json` — day 1's `summary` only, as a check:
 *    the frames' sentence is the previous drop's task (lessons §10.3), curled.
 *  - `Vici Overhaul/project/gen/lessons-v3.json` — the designer's clean course:
 *    week names, titles, practice, "Done when" and each lesson's first reading
 *    piece must equal what the frames draw, or the run fails.
 *  - `scripts/overhaul/curriculum-legacy.json` — the previous drop's week names,
 *    frozen from the last `scripts/vicifull` build, for the cross-check. Its
 *    one-line summaries were written for the previous course and no longer
 *    describe these lessons, so `summary` is now the lesson's own task sentence
 *    (`cardSummary`, D339 / D401); its two-board task layouts are not emitted.
 *
 * Usage:
 *   node scripts/overhaul/gen-curriculum.mjs            write src/content/curriculum84.ts
 *   node scripts/overhaul/gen-curriculum.mjs --check    exit 1 if the file on disk differs
 *   node scripts/overhaul/gen-curriculum.mjs --table    print the old → new title table
 *   node scripts/overhaul/gen-curriculum.mjs --freeze-legacy
 *        snapshot the legacy fields of the current curriculum84.ts into
 *        curriculum-legacy.json (run once, before the first regeneration)
 */
import fs from 'node:fs';
import path from 'node:path';
import { tokens } from './decl.mjs';

const OUT = 'src/content/curriculum84.ts';
const FINAL = '.overhaul/final';
const EL = `${FINAL}/Email-Login`;
const ILLUS = `${FINAL}/Lesson-Illustrations-v4`;
const LEGACY = 'scripts/overhaul/curriculum-legacy.json';
const BUNDLE = 'Vici Overhaul/project';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const args = new Set(process.argv.slice(2));

/* ------------------------------------------------------------ legacy freeze */

if (args.has('--freeze-legacy')) {
  const ts = (await import('typescript')).default;
  const src = fs.readFileSync(OUT, 'utf8');
  // Only the previous drop's build is legacy; a regenerated file would freeze the new titles.
  if (src.includes('practice: [')) throw new Error(`${OUT} is already regenerated — keep ${LEGACY} as it is`);
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  const tmp = path.join(fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'curriculum-')), 'c.mjs');
  fs.writeFileSync(tmp, js);
  const { CURRICULUM_84, CURRICULUM_84_DAYS } = await import(tmp);
  const weeks = CURRICULUM_84.map((w) => ({ n: w.n, roman: w.roman, name: w.name, blurb: w.blurb }));
  const days = CURRICULUM_84_DAYS.map((l) => ({ day: l.day, title: l.title, titleSize: l.titleSize, summary: l.summary, task: l.task }));
  if (days.length !== 84) throw new Error(`expected 84 lessons, found ${days.length}`);
  fs.writeFileSync(LEGACY, JSON.stringify({ from: `${OUT} as built by scripts/vicifull/gen-curriculum.mjs (Latest Vici FULL)`, weeks, days }, null, 1) + '\n');
  console.log(`froze ${days.length} legacy lessons into ${LEGACY}`);
  process.exit(0);
}

/* ------------------------------------------------------------------- frames */

const ENTITIES = { '&middot;': '·', '&mdash;': '—', '&ndash;': '–', '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&hellip;': '…', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&times;': '×' };
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'use']);

/** The frame as a tree, so a run's text is its whole subtree and order is document order. */
function tree(file) {
  const root = { tag: '#root', attrs: {}, style: {}, children: [] };
  const stack = [root];
  for (const t of tokens(fs.readFileSync(file, 'utf8'))) {
    const top = stack[stack.length - 1];
    if (t.kind === 'text') { top.children.push({ tag: '#text', text: t.value, attrs: {}, style: {}, children: [] }); continue; }
    const tag = t.value;
    if (tag.startsWith('<!')) continue;
    if (tag.startsWith('</')) { if (stack.length > 1) stack.pop(); continue; }
    const name = (tag.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase() ?? '?';
    const attrs = {};
    for (const m of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g)) attrs[m[1]] = m[2];
    const style = {};
    for (const d of (attrs.style ?? '').split(';')) {
      const i = d.indexOf(':');
      if (i > 0) style[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    const node = { tag: name, attrs, style, children: [] };
    top.children.push(node);
    if (!tag.endsWith('/>') && !VOID.has(name)) stack.push(node);
  }
  return root;
}

const text = (n) => {
  const raw = n.tag === '#text' ? n.text : n.children.map((c) => (c.tag === '#text' ? c.text : text(c))).join('');
  return raw.replace(/&[a-z]+;/g, (m) => ENTITIES[m] ?? m).replace(/\s+/g, ' ').trim();
};
function* walk(n) {
  for (const c of n.children) {
    yield c;
    yield* walk(c);
  }
}
const find = (n, pred) => { for (const c of walk(n)) if (pred(c)) return c; return null; };
const findAll = (n, pred) => [...walk(n)].filter(pred);
const heroOf = (n) => find(n, (c) => c.tag === 'svg' && c.attrs['data-hero'])?.attrs['data-hero'] ?? null;

/** The reader's content column: `left 32 right 32 top 140 bottom 128` on all 1,273 frames. */
const band = (root) => {
  const b = find(root, (c) => c.style.top === '140px' && c.style.bottom === '128px' && c.style.left === '32px');
  if (!b) throw new Error('no band');
  return b;
};
const isCaps = (n) => n.style?.['font-size'] === '13px' && n.style['font-weight'] === '700' && n.style.color === '#9B968E';
const isBody = (n) => n.style?.['font-size'] === '18px' && n.style['font-weight'] === '400' && n.style.color === '#B5B0A8';

/* -------------------------------------------------------------------- heroes */

const HERO_IDS = new Set();
for (const f of fs.readdirSync(ILLUS).filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  for (const m of fs.readFileSync(`${ILLUS}/${f}`, 'utf8').matchAll(/data-hero="([^"]+)"/g)) HERO_IDS.add(m[1]);
}
if (HERO_IDS.size !== 53) throw new Error(`expected 53 illustration ids, found ${HERO_IDS.size}`);
const hero = (id, where) => {
  if (!HERO_IDS.has(id)) throw new Error(`${where}: data-hero "${id}" is not one of the 53 Lesson-Illustrations-v4 cards`);
  return id;
};

/* --------------------------------------------------------------------- weeks */

const weeks = new Map();
// P1 before P2: the four rows on the page, then the three the scrolled page adds.
const weekFiles = fs.readdirSync(EL).map((f) => [f, f.match(/^Week-([IVX]+)-(.+?)(-P2)?\.html$/)]).filter(([, m]) => m);
weekFiles.sort(([a, ma], [b, mb]) => ROMAN.indexOf(ma[1]) - ROMAN.indexOf(mb[1]) || Number(Boolean(ma[3])) - Number(Boolean(mb[3])));
for (const [file, m] of weekFiles) {
  const root = tree(`${EL}/${file}`);
  const stack = find(root, (c) => c.style.top === '338px' && c.style['flex-direction'] === 'column');
  const [caps, h1, p] = stack.children.filter((c) => c.tag !== '#text');
  const roman = text(caps).replace(/^Week /, '');
  if (roman !== m[1]) throw new Error(`${file}: caps "${text(caps)}"`);
  const n = ROMAN.indexOf(roman) + 1;
  const rows = findAll(root, (c) => c.tag === 'span' && c.style.flex === '1' && c.style['font-size'] === '15px').map(text);
  const page = { n, roman, name: text(h1), blurb: text(p), hero: hero(heroOf(root), file), rows };
  const w = weeks.get(n);
  if (!w) weeks.set(n, { ...page, rows: [...rows] });
  else {
    for (const k of ['name', 'blurb', 'hero']) if (w[k] !== page[k]) throw new Error(`Week ${roman}: P1 and P2 disagree on ${k}`);
    for (const r of rows) if (!w.rows.includes(r)) w.rows.push(r);
  }
}
if (weeks.size !== 12) throw new Error(`expected 12 weeks, found ${weeks.size}`);

/* ------------------------------------------------------------------- lessons */

const weekDirs = fs.readdirSync(FINAL).filter((d) => /^Week-\d\d-/.test(d)).sort();
if (weekDirs.length !== 12) throw new Error(`expected 12 week bundles, found ${weekDirs.length}`);

const lessons = [];
for (const dir of weekDirs) {
  const week = Number(dir.slice(5, 7));
  const byLesson = new Map();
  for (const f of fs.readdirSync(`${FINAL}/${dir}`)) {
    const m = f.match(/^L(\d+)-Frame-(\d+)\.html$/);
    if (!m) continue;
    const n = Number(m[1]);
    if (!byLesson.has(n)) byLesson.set(n, []);
    byLesson.get(n)[Number(m[2]) - 1] = `${FINAL}/${dir}/${f}`;
  }
  for (const day of [...byLesson.keys()].sort((a, b) => a - b)) {
    const frames = byLesson.get(day);
    if (frames.some((f) => !f)) throw new Error(`L${day}: a frame is missing`);
    const pages = frames.map((f) => band(tree(f)));

    // Cover: caps `Lesson <n>`, the 30/36 display title, the hero.
    const cover = pages[0];
    const coverCaps = cover.children.find(isCaps);
    if (text(coverCaps) !== `Lesson ${day}`) throw new Error(`L${day} F1: caps "${text(coverCaps)}"`);
    const title = text(cover.children.find((c) => c.style?.['font-size'] === '30px'));
    const coverHero = hero(heroOf(cover), `L${day} F1`);

    // The first reading piece: the first body run from the `Part 1` page on. Only
    // cross-checked against lessons-v3; `summary` keeps the previous string (D396).
    const part1 = pages.findIndex((b) => b.children.some((c) => isCaps(c) && text(c) === 'Part 1'));
    if (part1 < 0) throw new Error(`L${day}: no Part 1 page`);
    const firstPiece = pages.slice(part1).map((b) => b.children.find(isBody)).find(Boolean);

    // Task: `Today’s task` + title + practice, then the next page's practice + `Done when`.
    const t = pages.findIndex((b) => b.children.some((c) => isCaps(c) && text(c) === 'Today’s task'));
    if (t < 0 || t + 1 >= pages.length) throw new Error(`L${day}: no task pages`);
    const taskTitle = text(pages[t].children.find((c) => c.style?.['font-size'] === '24px'));
    if (taskTitle !== title) throw new Error(`L${day}: task title "${taskTitle}" ≠ cover "${title}"`);
    const practice = [...pages[t].children.filter(isBody), ...pages[t + 1].children.filter(isBody)].map(text);
    const doneCard = pages[t + 1].children.find((c) => c.style?.['border-radius'] === '20px' && c.style.background === '#1E1E1E');
    const doneLabel = doneCard && find(doneCard, isCaps);
    if (!doneLabel || text(doneLabel) !== 'Done when') throw new Error(`L${day}: no Done when card on F${t + 2}`);
    const doneWhen = text(find(doneCard, (c) => c.style?.['font-size'] === '16px' && c.style['font-weight'] === '700'));

    lessons.push({ day, week, frames: frames.length, title, hero: coverHero, firstPiece: text(firstPiece), practice, doneWhen });
  }
}
if (lessons.length !== 84 || lessons.some((l, i) => l.day !== i + 1)) throw new Error('lessons are not 1…84 in order');
for (const l of lessons) if (l.week !== Math.ceil(l.day / 7)) throw new Error(`L${l.day} sits in week ${l.week}`);

/* -------------------------------------------------------------- cross-checks */

const problems = [];
// The week pages list the same seven titles as the covers, in order.
for (const w of weeks.values()) {
  const covers = lessons.filter((l) => l.week === w.n).map((l) => l.title);
  if (JSON.stringify(w.rows) !== JSON.stringify(covers)) problems.push(`Week ${w.roman} rows ${JSON.stringify(w.rows)} ≠ covers ${JSON.stringify(covers)}`);
}
// The designer's clean course agrees with the frames.
const v3 = JSON.parse(fs.readFileSync(`${BUNDLE}/gen/lessons-v3.json`, 'utf8'));
for (const vw of v3.weeks) {
  if (weeks.get(vw.num)?.name !== vw.name) problems.push(`Week ${vw.num} name: frame "${weeks.get(vw.num)?.name}" vs lessons-v3 "${vw.name}"`);
  for (const vl of vw.lessons) {
    const l = lessons[vl.num - 1];
    const first = vl.sections[0].items.find((x) => typeof x === 'string');
    if (l.title !== vl.title) problems.push(`L${vl.num} title: "${l.title}" vs "${vl.title}"`);
    if (JSON.stringify(l.practice) !== JSON.stringify(vl.practice)) problems.push(`L${vl.num} practice differs`);
    if (l.doneWhen !== vl.doneWhen) problems.push(`L${vl.num} doneWhen: "${l.doneWhen}" vs "${vl.doneWhen}"`);
    if (l.firstPiece !== first) problems.push(`L${vl.num} first piece: "${l.firstPiece}" vs "${first}"`);
  }
}
const LEGACY_DATA = JSON.parse(fs.readFileSync(LEGACY, 'utf8'));
const legacy = new Map(LEGACY_DATA.days.map((d) => [d.day, d]));
for (const l of lessons) {
  l.legacy = legacy.get(l.day);
  if (!l.legacy) problems.push(`L${l.day}: no legacy entry`);
}

/* ------------------------------------------------------------ task sentence */

// Day 1: the sentence `Today Home Task` and `Night Action Reminder` draw under
// lesson 1's title — read off both frames, which must agree with each other and
// with the bundle's `task-src.json` day 1 (curled), the line they were drawn from.
/** The element after the first one `pred` matches, among its siblings. */
const after = (root, pred) => {
  const parent = find(root, (c) => c.children.some(pred));
  if (!parent) return null;
  const els = parent.children.filter((c) => c.tag !== '#text');
  return els[els.findIndex(pred) + 1] ?? null;
};
const L1 = lessons[0];
const homeTask = tree(`${EL}/Today-Home-Task.html`);
const homeLine = after(homeTask, (c) => c.tag !== '#text' && text(c) === `Today’s task: ${L1.title}`);
const night = tree(`${EL}/Night-Action-Reminder.html`);
const nightTitle = after(night, (c) => c.tag !== '#text' && text(c) === 'Tonight’s action');
const nightLine = nightTitle && text(nightTitle) === L1.title ? after(night, (c) => c === nightTitle) : null;
const curl = (s) => s
  .replace(/(\w)'(\w)/g, '$1’$2')
  .replace(/(^|[\s(])"/g, '$1“')
  .replace(/"/g, '”')
  .replace(/(^|[\s(])'/g, '$1‘')
  .replace(/'/g, '’');
const taskSrc1 = curl(JSON.parse(fs.readFileSync(`${BUNDLE}/task-src.json`, 'utf8')).find((t) => t.day === 1).summary);
if (!homeLine || !nightLine || text(homeLine) !== text(nightLine) || text(homeLine) !== taskSrc1) {
  problems.push(`day 1 sentence: Today-Home-Task "${homeLine && text(homeLine)}" · Night-Action-Reminder "${nightLine && text(nightLine)}" · task-src "${taskSrc1}"`);
}

// Days 2–84: the first sentence of the lesson's own task (D339) — the bundle's
// words, and the task the line opens (`/lesson/day/<n>?page=task`). Every
// practice[0] is plain prose: no abbreviation, no stop inside a quote.
const sentences = (p) => p.match(/[^.!?]+[.!?]+(?=\s|$)/g)?.map((s) => s.trim()) ?? [];
// One paragraph opens with a note about the task rather than the task: L64's
// "This exercise is optional." On Morning's "Did you complete this task?" that
// line would be what the reader is asked whether they did, so the card takes the
// paragraph's next sentence, the task itself, still in the bundle's words. The
// run fails if any other lesson opens this way, or L64 stops doing so.
const PREFACE = new Set(['This exercise is optional.']);
for (const l of lessons) {
  if (l.day === 1) { l.cardSummary = homeLine ? text(homeLine) : ''; continue; }
  const all = sentences(l.practice[0]);
  if (all.join(' ') !== l.practice[0]) { problems.push(`L${l.day} practice[0] does not split into sentences cleanly`); continue; }
  const skipped = all.findIndex((s) => !PREFACE.has(s));
  if ((skipped > 0) !== (l.day === 64)) problems.push(`L${l.day}: opening sentence "${all[0]}" ${skipped > 0 ? 'is' : 'is not'} a preface`);
  l.cardSummary = all[skipped];
}
// Week names and blurbs did not change between the drops (library §1); say so if they ever do.
for (const w of weeks.values()) {
  const old = LEGACY_DATA.weeks.find((o) => o.n === w.n);
  if (!old || old.roman !== w.roman || old.name !== w.name || old.blurb !== w.blurb) problems.push(`Week ${w.roman}: name/blurb differ from the app's`);
}
if (problems.length) {
  console.error(`${problems.length} cross-check failure(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
const longest = lessons.reduce((a, l) => (l.cardSummary.length > a.cardSummary.length ? l : a));

/* --------------------------------------------------------------------- table */

if (args.has('--table')) {
  console.log('| L | Wk | old title | new title | cover hero |');
  console.log('|---|---|---|---|---|');
  for (const l of lessons) console.log(`| ${l.day} | ${ROMAN[l.week - 1]} | ${l.legacy.title} | ${l.title} | \`${l.hero}\` |`);
  process.exit(0);
}

/* ---------------------------------------------------------------------- emit */

const q = (s) => JSON.stringify(s);
const ids = [...new Set([...[...weeks.values()].map((w) => w.hero), ...lessons.map((l) => l.hero)])].sort();

const out = [];
const P = (s = '') => out.push(s);
P(`/**`);
P(` * GENERATED FILE — do not edit by hand.`);
P(` *`);
P(` * The twelve-week, eighty-four-lesson curriculum the \`Vici Overhaul\` bundle`);
P(` * draws: week names, blurbs and heroes from the twelve Email-Login week pages;`);
P(` * each lesson's title and hero from its reader's cover (\`L<n> Frame 1\`), and`);
P(` * its task — the practice and the "Done when" line — from the reader's two`);
P(` * task pages. The short task sentence (\`cardSummary\`) is the first sentence`);
P(` * of the lesson's own task (D339); day 1 keeps the one \`Today Home Task\` and`);
P(` * \`Night Action Reminder\` draw. No frame draws a one-line \`summary\`; it is`);
P(` * the same task sentence (D401).`);
P(` *`);
P(` * Rebuild: node scripts/overhaul/gen-curriculum.mjs`);
P(` */`);
P();
P(`/** A \`data-hero\` id of the \`Lesson-Illustrations-v4\` card the frame draws (\`src/content/heroes.ts\`). */`);
P(`export type CurriculumHeroId =`);
for (const [i, id] of ids.entries()) P(`  | ${q(id)}${i === ids.length - 1 ? ';' : ''}`);
P();
P(`/**`);
P(` * The day's task. It lives inside the lesson: \`Today’s task\` + the lesson title`);
P(` * + \`practice\`, then a \`Done when\` card (\`doneWhen\`) and "Finish lesson".`);
P(` * \`cardTitle\`/\`cardSummary\` are how Today, the night reminder and the morning`);
P(` * check name it. (The previous drop's two-board \`/task/[day]\` layout is gone:`);
P(` * that route and \`/lesson-card/[day]\` redirect into the reader, D324.)`);
P(` */`);
P(`export interface DailyTask {`);
P(`  day: number;`);
P(`  /** How the task is named on the Today home and in the night reminder — the lesson's title. */`);
P(`  cardTitle: string;`);
P(`  /**`);
P(`   * The one-line task sentence Today, the night reminder and the morning check draw:`);
P(`   * the first sentence of \`practice[0]\` (D339; L64 skips its opening "This exercise`);
P(`   * is optional."). Day 1 keeps the sentence \`Today Home Task\` and \`Night Action`);
P(`   * Reminder\` draw; its task sets the same step ("put the phone out of reach from bed").`);
P(`   * ${lessons.filter((l) => l.day > 1).reduce((a, l) => Math.min(a, l.cardSummary.length), Infinity)}–${longest.cardSummary.length} characters; the longest is L${longest.day}'s.`);
P(`   */`);
P(`  cardSummary: string;`);
P(`  /** The task's paragraphs, in reading order, across the reader's two task pages. */`);
P(`  practice: string[];`);
P(`  /** The sentence on the reader's \`Done when\` card. */`);
P(`  doneWhen: string;`);
P(`}`);
P();
P(`export interface Curriculum84Lesson {`);
P(`  day: number;`);
P(`  week: number;`);
P(`  /** The cover's title — sentence case, the same string the week page lists. */`);
P(`  title: string;`);
P(`  /** The cover's hero. */`);
P(`  hero: CurriculumHeroId;`);
P(`  /**`);
P(`   * The line under the title in search and first steps: the lesson's own task sentence`);
P(`   * (\`task.cardSummary\`). No frame draws a one-line summary, and the previous course's`);
P(`   * described other lessons (D401). Read by search, first-steps and \`lib/curriculum\`.`);
P(`   */`);
P(`  summary: string;`);
P(`  task: DailyTask;`);
P(`}`);
P();
P(`export interface Curriculum84Week {`);
P(`  n: number;`);
P(`  roman: string;`);
P(`  name: string;`);
P(`  blurb: string;`);
P(`  /** The week page's hero — not its first lesson's cover. */`);
P(`  hero: CurriculumHeroId;`);
P(`  lessons: Curriculum84Lesson[];`);
P(`}`);
P();
P(`export const CURRICULUM_84: Curriculum84Week[] = [`);
for (const w of [...weeks.values()].sort((a, b) => a.n - b.n)) {
  P(`  {`);
  P(`    n: ${w.n},`);
  P(`    roman: ${q(w.roman)},`);
  P(`    name: ${q(w.name)},`);
  P(`    blurb: ${q(w.blurb)},`);
  P(`    hero: ${q(w.hero)},`);
  P(`    lessons: [`);
  for (const l of lessons.filter((x) => x.week === w.n)) {
    P(`      {`);
    P(`        day: ${l.day},`);
    P(`        week: ${l.week},`);
    P(`        title: ${q(l.title)},`);
    P(`        hero: ${q(l.hero)},`);
    P(`        summary: ${q(l.cardSummary)},`);
    P(`        task: {`);
    P(`          day: ${l.day},`);
    P(`          cardTitle: ${q(l.title)},`);
    P(`          cardSummary: ${q(l.cardSummary)},`);
    P(`          practice: [`);
    for (const p of l.practice) P(`            ${q(p)},`);
    P(`          ],`);
    P(`          doneWhen: ${q(l.doneWhen)},`);
    P(`        },`);
    P(`      },`);
  }
  P(`    ],`);
  P(`  },`);
}
P(`];`);
P();
P(`/** Every lesson, flattened, in day order. */`);
P(`export const CURRICULUM_84_DAYS: Curriculum84Lesson[] = CURRICULUM_84.flatMap((w) => w.lessons);`);
P();
P(`export function lessonForDay(day: number): Curriculum84Lesson | undefined {`);
P(`  return CURRICULUM_84_DAYS.find((l) => l.day === day);`);
P(`}`);
P();
P(`export function weekFor(n: number): Curriculum84Week | undefined {`);
P(`  return CURRICULUM_84.find((w) => w.n === n);`);
P(`}`);
P();

const next = out.join('\n');
if (args.has('--check')) {
  const same = fs.existsSync(OUT) && fs.readFileSync(OUT, 'utf8') === next;
  console.log(same ? `${OUT} is up to date` : `${OUT} is stale — run node scripts/overhaul/gen-curriculum.mjs`);
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(OUT, next);
console.log(`wrote ${OUT} (${out.length} lines): ${weeks.size} weeks, ${lessons.length} lessons, ${ids.length} hero ids; frames ${lessons.reduce((a, l) => a + l.frames, 0)}; longest task sentence L${longest.day} (${longest.cardSummary.length} characters)`);
