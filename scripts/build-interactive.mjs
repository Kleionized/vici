/**
 * Turns the authored `@@`-directive lesson files in src/content/interactive/
 * into a typed TypeScript module the app imports directly.
 *
 *   node scripts/build-interactive.mjs
 *
 * The DSL is line-based and pipe-delimited. Every lesson runs the same shape:
 * two teach pages, an ask (multi-select), a grid (multi-select), a branch page
 * whose copy is chosen by what was selected, a single-select pick, and a
 * collect page that writes the lesson's takeaway back in the reader's words.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '..', 'src', 'content', 'interactive');
const OUT = join(here, '..', 'src', 'content', 'interactiveLessons.ts');

// The authored files are split for editing convenience; `b` files continue the
// part before them and carry no @@IWEEK of their own.
const ORDER = ['p0', 'p1', 'p1b', 'p2', 'p2b', 'p3', 'p4', 'p5', 'p5b', 'p6', 'p7', 'p8', 'p9'];

const files = ORDER.map((key) => {
  const name = `interactive_${key}.md`;
  if (!readdirSync(SRC).includes(name)) throw new Error(`missing ${name}`);
  return { key, text: readFileSync(join(SRC, name), 'utf8') };
});

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

/** Split a directive line into its fields. */
function fields(line) {
  return line.slice(line.indexOf('|') + 1).split('|');
}

const weeks = [];
let week = null;
let sub = null;
let lesson = null;
let order = 0;

for (const { key: file, text } of files) {
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('@@')) continue;
    const tag = line.slice(2).split('|')[0];
    const f = fields(line);

    switch (tag) {
      case 'IWEEK': {
        const [title, blurb] = f;
        // "Ground I · The Landing. The rest of the description."
        const stop = blurb.indexOf('. ');
        const ground = stop === -1 ? '' : blurb.slice(0, stop);
        const description = stop === -1 ? blurb : blurb.slice(stop + 2);
        week = { n: weeks.length + 1, title, ground, description, subs: [] };
        weeks.push(week);
        sub = null;
        break;
      }
      case 'ISUB': {
        const [code, title, description] = f;
        sub = { code, title, description, lessons: [] };
        week.subs.push(sub);
        break;
      }
      case 'IDAY': {
        // "Lesson 12 — Sleep is impulse control"
        const match = /^Lesson\s+(\d+)\s*[—-]\s*(.*)$/.exec(f[0]);
        lesson = {
          number: match ? Number(match[1]) : order + 1,
          heading: match ? match[2] : f[0],
          title: '',
          tag: '',
          tagColor: '',
          sub: sub ? sub.code : '',
          week: week.n,
          day: sub ? sub.lessons.length + 1 : 1,
          order: order++,
          slug: '',
          pages: [],
          sources: '',
          action: '',
          reflection: '',
        };
        // dayInWeek counts across the whole week, not the subsection.
        lesson.day = week.subs.reduce((total, s) => total + s.lessons.length, 0) + 1;
        sub.lessons.push(lesson);
        break;
      }
      case 'ITITLE':
        lesson.title = f[0];
        lesson.slug = `${slugify(f[0])}-${lesson.number}`;
        break;
      case 'ITAG':
        lesson.tag = f[0];
        lesson.tagColor = `#${f[1]}`;
        break;
      case 'TEACH':
        lesson.pages.push({ kind: 'teach', headline: f[0], body: f[1], cta: f[2] });
        break;
      // @@LIST|ordered|item;;item;;item|optional trailing note — attaches to
      // the teach page above it, the way @@CHECK attaches to @@ASK.
      case 'LIST': {
        const teach = [...lesson.pages].reverse().find((p) => p.kind === 'teach');
        if (!teach) throw new Error(`@@LIST with no @@TEACH above it (${lesson.slug ?? file})`);
        const items = f[1].split(';;').map((x) => x.trim()).filter(Boolean);
        if (items.length < 2) throw new Error(`@@LIST needs at least two items (${lesson.slug ?? file})`);
        teach.list = { ordered: f[0] === 'ordered', items, note: f[2] || undefined };
        break;
      }
      // @@QUOTE|text|who — a pull-quote shown on a page of its own straight
      // after the teach page it hangs off, like @@LIST it attaches upward.
      case 'QUOTE': {
        const teach = [...lesson.pages].reverse().find((p) => p.kind === 'teach');
        if (!teach) throw new Error(`@@QUOTE with no @@TEACH above it (${lesson.slug ?? file})`);
        if (!f[0] || !f[1]) throw new Error(`@@QUOTE needs text and an attribution (${lesson.slug ?? file})`);
        teach.quote = { text: f[0], who: f[1] };
        break;
      }
      case 'ASK':
        lesson.pages.push({ kind: 'ask', headline: f[0], checks: [] });
        break;
      case 'CHECK': {
        const ask = [...lesson.pages].reverse().find((p) => p.kind === 'ask');
        ask.checks.push({ key: f[0], label: f[1], asIn: f[2], short: f[3] });
        break;
      }
      case 'GRID':
        lesson.pages.push({
          kind: 'grid',
          key: f[0],
          headline: f[1],
          helper: f[2],
          options: f[3].split(';'),
          cta: f[4],
        });
        break;
      case 'BTEACH':
        lesson.pages.push({ kind: 'branch', title: f[0], fromChecks: [], fromGrid: [] });
        break;
      case 'B1': {
        const branch = [...lesson.pages].reverse().find((p) => p.kind === 'branch');
        branch.fromChecks.push({ key: f[0], headline: f[1], body: f[2] });
        break;
      }
      case 'B2': {
        const branch = [...lesson.pages].reverse().find((p) => p.kind === 'branch');
        branch.fromGrid.push({ options: f[0].split(';'), body: f[1] });
        break;
      }
      case 'PICK':
        lesson.pages.push({
          kind: 'pick',
          key: f[0],
          headline: f[1],
          helper: f[2],
          options: f[3].split(';'),
          result: f[4],
        });
        break;
      case 'COLLECT':
        lesson.pages.push({
          kind: 'collect',
          title: f[0],
          template: f[1],
          fallback: f[2],
          source: f[3] === 'grid' ? 'grid' : 'checks',
          label: f[4] === '-' ? '' : f[4],
          cta: f[5],
        });
        break;
      case 'ISOURCES':
        lesson.sources = f[0];
        break;
      case 'ACTION':
        lesson.action = f[0];
        break;
      case 'REFLECTION':
        lesson.reflection = f[0];
        break;
      case 'WAS':
      case 'IEND':
        break;
      default:
        throw new Error(`unknown directive @@${tag}`);
    }
  }
}

// ── sanity checks: every lesson must be complete before we emit ──────
const problems = [];
for (const w of weeks) {
  for (const s of w.subs) {
    for (const l of s.lessons) {
      const kinds = l.pages.map((p) => p.kind);
      for (const required of ['teach', 'ask', 'grid', 'branch', 'pick', 'collect']) {
        if (!kinds.includes(required)) problems.push(`${l.slug}: no ${required} page`);
      }
      if (!l.title) problems.push(`${l.slug || l.heading}: no title`);
      if (!l.reflection) problems.push(`${l.slug}: no reflection`);
      const ask = l.pages.find((p) => p.kind === 'ask');
      if (ask && ask.checks.length === 0) problems.push(`${l.slug}: ask with no checks`);
    }
  }
}
if (problems.length) {
  console.error(problems.slice(0, 20).join('\n'));
  throw new Error(`${problems.length} content problems`);
}

const lessonCount = weeks.reduce((n, w) => n + w.subs.reduce((m, s) => m + s.lessons.length, 0), 0);
const slugs = new Set();
for (const w of weeks) for (const s of w.subs) for (const l of s.lessons) {
  if (slugs.has(l.slug)) throw new Error(`duplicate slug ${l.slug}`);
  slugs.add(l.slug);
}

const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Source: src/content/interactive/*.md
 * Rebuild: node scripts/build-interactive.mjs
 *
 * ${weeks.length} parts · ${lessonCount} lessons.
 */

import type { InteractiveWeek } from '@/lib/types';

export const INTERACTIVE_WEEKS: InteractiveWeek[] = `;

writeFileSync(OUT, `${banner}${JSON.stringify(weeks, null, 2)};\n`, 'utf8');
console.log(`wrote ${OUT}: ${weeks.length} parts, ${lessonCount} lessons`);
