// Splits each static canvas of `Vici UI 2` into one file per artboard, in the
// layout the previous run's generators read (.overhaul/final/<bundle>/…):
// .vici-ui-2/final/<Bundle-Slug>/<Label-Slug>.html and _index.json
// ({ source, count, frames: [{ label, file, bytes, start, end }] }).
//
//   node scripts/vici-ui-2/split.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'Vici UI 2/project';
const OUT = '.vici-ui-2/final';
const slug = (s) => s.replace(/\.dc\.html$/, '').replace(/[’']/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The end of the element that opens at `start` (div depth). */
function endOf(html, start) {
  const re = /<(\/?)div\b[^>]*>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (!m[1]) depth++;
    else if (--depth === 0) return re.lastIndex;
  }
  throw new Error('unclosed div');
}

for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.dc.html'))) {
  const html = fs.readFileSync(path.join(SRC, f), 'utf8');
  const dir = path.join(OUT, slug(f));
  fs.mkdirSync(dir, { recursive: true });
  const frames = [];
  const used = new Map();
  for (const m of html.matchAll(/<div data-screen-label="([^"]*)"/g)) {
    if (m[1].includes('{{')) continue; // a template's frame, filled at runtime: not static
    const start = m.index;
    const end = endOf(html, start);
    const base = slug(m[1]) || 'frame';
    const k = (used.get(base) ?? 0) + 1;
    used.set(base, k);
    const file = `${k > 1 ? `${base}-${k}` : base}.html`;
    fs.writeFileSync(path.join(dir, file), html.slice(start, end));
    frames.push({ label: m[1], file, bytes: end - start, start, end });
  }
  fs.writeFileSync(path.join(dir, '_index.json'), JSON.stringify({ source: path.join(SRC, f), count: frames.length, frames }, null, 2));
  console.log(`${f}: ${frames.length} static frames`);
}
