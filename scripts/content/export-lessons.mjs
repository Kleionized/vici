// Exports the 84 lessons as the reader shows them: every quote, reading page,
// diagram, question, best answer, reflection, task and "Done when" line, in
// order, grouped by week with the week's name and subtitle.
//
//   node scripts/content/export-lessons.mjs [outDir]
//
// Writes `VICI-lessons.md` and `VICI-lessons.blocks.json` (the same content as
// a list of blocks, for the Word export) to outDir (default `exports/`). Reads
// src/content/lessons.ts and src/content/curriculum84.ts through esbuild, so
// the export is the app's own content, not a copy of it.
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const outDir = path.resolve(process.argv[2] ?? 'exports');
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lessons-')), 'lessons.mjs');
await build({
  stdin: {
    contents: `export { LESSONS } from './src/content/lessons'; export { CURRICULUM_84 } from './src/content/curriculum84';`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: tmp,
  logLevel: 'error',
  // the two files import types only; anything else is an inert stand-in
  plugins: [{ name: 'stub', setup(b) { b.onResolve({ filter: /^@\// }, (a) => ({ path: a.path, namespace: 'stub' })); b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'module.exports = {};', loader: 'js' })); } }],
});
const { LESSONS, CURRICULUM_84 } = await import(pathToFileURL(tmp).href);

/** @type {{ t: string; text?: string; items?: string[]; rows?: string[][]; head?: string[] }[]} */
const blocks = [];
const add = (t, rest = {}) => blocks.push({ t, ...rest });

function viz(v) {
  if (v.type === 'chain') {
    add('label', { text: `Diagram${v.cap ? `: ${v.cap}` : ''}` });
    add('olist', { items: v.steps.map((s, i) => (i === v.mark && v.tag ? `${s} (${v.tag})` : s)) });
  } else if (v.type === 'compare') {
    add('label', { text: 'Diagram: comparison' });
    add('table', { head: ['', '', ''], rows: v.items.map((it, i) => [`${it.l}${i === v.hi ? ' (highlighted)' : ''}`, it.v ?? '', it.t]) });
  } else if (v.type === 'pairs') {
    add('label', { text: 'Diagram' });
    add('table', { head: v.head ?? [], rows: v.rows });
  } else if (v.type === 'wave') {
    add('label', { text: `Diagram: ${v.tag}` });
    add('p', { text: v.cap });
  } else if (v.type === 'track') {
    add('label', { text: `Diagram${v.cap ? `: ${v.cap}` : ''}` });
    add('olist', { items: v.nodes });
  } else if (v.type === 'bars') {
    add('label', { text: `Diagram${v.cap ? `: ${v.cap}` : ''}` });
    add('table', { head: ['', ''], rows: v.rows.map((r) => [r.label, r.value]) });
  }
}

add('title', { text: 'VICI: the 84 lessons' });
add('p', { text: `Exported from the app's lesson content on ${new Date().toISOString().slice(0, 10)}. Each lesson is shown in the order the reader shows it.` });

for (const week of CURRICULUM_84) {
  add('h1', { text: `Week ${week.roman} · ${week.name}` });
  add('sub', { text: week.blurb });
  for (const meta of week.lessons) {
    const lesson = LESSONS[meta.day];
    if (!lesson) continue;
    add('h2', { text: `Lesson ${lesson.n} · ${lesson.title}` });
    for (const page of lesson.pages) {
      switch (page.k) {
        case 'cover':
        case 'complete':
          break;
        case 'quote':
          add('quote', { text: page.text });
          add('by', { text: page.by });
          break;
        case 'read':
          if (page.title) add('h3', { text: `Part ${page.part} · ${page.title}` });
          if (page.viz) viz(page.viz);
          for (const p of page.body) add('p', { text: p });
          break;
        case 'question':
          add('label', { text: 'Question' });
          add('p', { text: page.prompt, strong: true });
          if (page.instr) add('note', { text: page.instr });
          add('list', { items: page.options.map((o) => `${o.L}. ${o.t}`) });
          break;
        case 'answer':
          add('label', { text: page.best.length > 1 ? 'Best answers' : 'Best answer' });
          add('list', { items: page.best.map((o) => `${o.L}. ${o.t}`) });
          for (const p of page.body) add('p', { text: p });
          break;
        case 'reflect':
          add('label', { text: 'After choosing' });
          add('p', { text: page.lead, strong: true });
          for (const p of page.body) add('p', { text: p });
          break;
        case 'task':
          add('h3', { text: 'Today’s task' });
          for (const p of page.body) add('p', { text: p });
          break;
        case 'taskEnd':
          for (const p of page.body) add('p', { text: p });
          add('done', { text: page.done });
          break;
      }
    }
  }
}

// ── Markdown ─────────────────────────────────────────────────────────
const md = [];
for (const b of blocks) {
  if (b.t === 'title') md.push(`# ${b.text}`, '');
  else if (b.t === 'h1') md.push(`# ${b.text}`, '');
  else if (b.t === 'sub') md.push(`*${b.text}*`, '');
  else if (b.t === 'h2') md.push(`## ${b.text}`, '');
  else if (b.t === 'h3') md.push(`### ${b.text}`, '');
  else if (b.t === 'quote') md.push(`> ${b.text}`, '>');
  else if (b.t === 'by') md.push(`> ${b.text}`, '');
  else if (b.t === 'label') md.push(`**${b.text}**`, '');
  else if (b.t === 'note') md.push(`*${b.text}*`, '');
  else if (b.t === 'done') md.push(`**Done when:** ${b.text}`, '');
  else if (b.t === 'list') md.push(...b.items.map((i) => `- ${i}`), '');
  else if (b.t === 'olist') md.push(...b.items.map((i, n) => `${n + 1}. ${i}`), '');
  else if (b.t === 'table') {
    const cols = Math.max(b.head.length, ...b.rows.map((r) => r.length));
    const head = Array.from({ length: cols }, (_, i) => b.head[i] ?? '');
    md.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...b.rows.map((r) => `| ${Array.from({ length: cols }, (_, i) => (r[i] ?? '').replace(/\|/g, '/')).join(' | ')} |`), '');
  } else md.push(b.strong ? `**${b.text}**` : b.text, '');
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'VICI-lessons.md'), md.join('\n'));
fs.writeFileSync(path.join(outDir, 'VICI-lessons.blocks.json'), JSON.stringify(blocks));
const n = blocks.filter((b) => b.t === 'h2').length;
console.log(`${n} lessons, ${blocks.length} blocks → ${path.relative(root, outDir)}/`);
