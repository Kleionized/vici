#!/usr/bin/env node
/**
 * Pull the 83 lesson-card rows out of `Lessons and Tasks.dc.html`'s split frames
 * and the 84 daily tasks out of the bundle's own `task-src.json`, and emit them
 * as one content module.
 *
 * The cards are read from the canvas rather than retyped so the copy is the
 * design's, character for character.
 */
import fs from 'node:fs';

const DIR = '.uifinal/final/Lessons and Tasks';

/** HTML entities the canvas uses, resolved to the characters they name. */
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
  '&nbsp;': ' ',
  '&times;': '×',
};
const decode = (s) => s.replace(/&[a-z]+;/g, (m) => ENTITIES[m] ?? m);

/** Every text node in the frame, in document order, with the style it sits in. */
function textNodes(html) {
  const out = [];
  const re = /<([a-z]+)([^>]*)>([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const text = decode(m[3]).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const style = (m[2].match(/style="([^"]*)"/) || [])[1] ?? '';
    out.push({ tag: m[1], style, text });
  }
  return out;
}

const pick = (nodes, test) => nodes.find(test)?.text;

const cards = [];
for (const file of fs.readdirSync(DIR)) {
  const m = file.match(/^Lesson-(\d+)\.html$/);
  if (!m) continue;
  const nodes = textNodes(fs.readFileSync(`${DIR}/${file}`, 'utf8'));
  const eyebrow = pick(nodes, (n) => /letter-spacing:1\.4px/.test(n.style));
  // The canvas steps the title down for long ones, so the size is data too.
  // Long titles step down to 20/27 at top 396; the rest are 23/30 at 392.
  const titleNode = nodes.find((n) => /left:36px; right:36px; top:39[26]px/.test(n.style));
  const title = titleNode?.text;
  const titleSize = Number((titleNode?.style.match(/font-size:([0-9.]+)px/) || [])[1]);
  const titleTop = Number((titleNode?.style.match(/top:([0-9.]+)px/) || [])[1]);
  const titleLeading = Number((titleNode?.style.match(/line-height:([0-9.]+)px/) || [])[1]);
  const summary = pick(nodes, (n) => /font-size:15\.5px/.test(n.style));
  const cta = pick(nodes, (n) => /color:#FFFFFF/.test(n.style));
  const back = pick(nodes, (n) => /font-size:15px/.test(n.style) && /color:#8B8882/.test(n.style));
  cards.push({ n: Number(m[1]), eyebrow, title, titleSize, titleTop, titleLeading, summary, cta, back });
}
cards.sort((a, b) => a.n - b.n);

const missing = cards.filter((c) => !c.title || !c.summary || !c.eyebrow);
console.log(`cards: ${cards.length}, incomplete: ${missing.length}`);
if (missing.length) console.log(missing.slice(0, 5));

const tasks = JSON.parse(fs.readFileSync('UI Final/project/task-src.json', 'utf8'));
console.log(`tasks: ${tasks.length}`);

fs.mkdirSync('.uifinal/extract', { recursive: true });
fs.writeFileSync('.uifinal/extract/lesson-cards.json', JSON.stringify(cards, null, 2));
console.log('wrote .uifinal/extract/lesson-cards.json');
console.log(JSON.stringify(cards.slice(0, 3), null, 2));
