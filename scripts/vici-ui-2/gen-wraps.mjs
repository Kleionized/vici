// Reads, out of the WebKit render of every `Vici UI 2` canvas, each text run set
// in `text-wrap: balance` or `pretty` that wraps, and the lines WebKit broke it
// into, and writes them to src/content/wraps.ts for `wrapAs` (src/lib/wrap.ts).
//
//   node scripts/vici-ui-2/gen-wraps.mjs [fileFilter]
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';

const BUNDLE = path.resolve('Vici UI 2/project');
const OUT = 'src/content/wraps.ts';
const FILTER = process.argv[2] ?? '';
const PORT = 4793;
const LATO = 'node_modules/@expo-google-fonts/lato';
const FACES = [['400', 'normal', '400Regular/Lato_400Regular.ttf'], ['700', 'normal', '700Bold/Lato_700Bold.ttf'], ['900', 'normal', '900Black/Lato_900Black.ttf'], ['700', 'italic', '700Bold_Italic/Lato_700Bold_Italic.ttf'], ['400', 'italic', '400Regular_Italic/Lato_400Regular_Italic.ttf']];
const FONT_CSS = FACES.map(([w, s, f]) => `@font-face{font-family:'Lato';font-style:${s};font-weight:${w};src:url(/__font/${path.basename(f)}) format('truetype');}`).join('\n');

const server = await serve(BUNDLE, PORT);
const browser = await webkit.launch();
const files = fs.readdirSync(BUNDLE).filter((f) => f.endsWith('.dc.html') && f.includes(FILTER)).sort();
const table = {};
let conflicts = 0;

for (const f of files) {
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  await page.clock.install({ time: new Date('2026-10-21T09:41:00') });
  await page.clock.pauseAt(new Date('2026-10-21T09:41:00'));
  await page.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: FONT_CSS }));
  await page.route('**/fonts.gstatic.com/**', (r) => r.abort());
  await page.route('**/__font/*', (r) => {
    const face = FACES.find((x) => path.basename(x[2]) === path.basename(new URL(r.request().url()).pathname));
    r.fulfill({ status: 200, contentType: 'font/ttf', body: fs.readFileSync(path.join(LATO, face[2])) });
  });
  await page.goto(`http://localhost:${PORT}/${encodeURIComponent(f)}`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(2000);
  await page.waitForTimeout(1500);
  const runs = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('[data-screen-label] *')) {
      const cs = getComputedStyle(el);
      const mode = cs.textWrapStyle || cs.textWrap;
      if (!/balance|pretty/.test(mode)) continue;
      // a leaf: text only (template-bound text sits between comment markers)
      if (el.children.length !== 0) continue;
      const nodes = [...el.childNodes].filter((n) => n.nodeType === 3);
      if (!nodes.length) continue;
      const text = nodes.map((n) => n.textContent).join('');
      if (!text.trim()) continue;
      // where in which text node the i-th character of `text` sits
      const at = (i) => { for (const n of nodes) { if (i < n.textContent.length) return [n, i]; i -= n.textContent.length; } return null; };
      // the line each word starts on, by its first glyph's top
      const lines = [];
      let lastTop = null;
      let start = 0;
      // a line can start at a word, or after a hyphen inside one ("five-|minute")
      const re = /[^\s-]+-?|-+/g;
      let m;
      while ((m = re.exec(text))) {
        const [node, off] = at(m.index);
        const r = document.createRange();
        r.setStart(node, off);
        r.setEnd(node, off + 1);
        const top = Math.round(r.getClientRects()[0]?.top ?? 0);
        if (lastTop !== null && top > lastTop + 2) {
          lines.push(text.slice(start, m.index).trimEnd());
          start = m.index;
        }
        lastTop = top;
      }
      lines.push(text.slice(start).trimEnd());
      if (lines.length > 1) lines[0] = lines[0].trimStart();
      if (lines.length < 2) continue;
      // the width the run had to wrap in: its parent's content box (a centred
      // flex item hugs its text, so its own box is the longest line, not the room)
      const p = el.parentElement;
      const ps = getComputedStyle(p);
      const room = p.getBoundingClientRect().width - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight) - parseFloat(ps.borderLeftWidth) - parseFloat(ps.borderRightWidth) - parseFloat(cs.marginLeft) - parseFloat(cs.marginRight);
      const own = el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const row = ps.display.includes('flex') && !ps.flexDirection.startsWith('column');
      out.push({ size: parseFloat(cs.fontSize), text: text.trim(), w: Math.round((row ? own : room - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * 100) / 100, lines });
    }
    return out;
  });
  for (const r of runs) {
    const key = `${r.size}|${r.text}`;
    const list = (table[key] ??= []);
    const same = list.find((e) => Math.abs(e.w - r.w) < 0.5);
    if (!same) list.push({ w: r.w, lines: r.lines });
    else if (same.lines.join('\n') !== r.lines.join('\n')) conflicts++;
  }
  console.log(f, runs.length, 'wrapped runs');
  await page.close();
}
await browser.close();
server.close();
const body = `// Generated by scripts/vici-ui-2/gen-wraps.mjs from the WebKit renders of \`Vici UI 2\`. Do not edit by hand.\n\n` +
  `/** \`size|text\` → the box widths it was drawn at and the lines WebKit broke it into there. */\n` +
  `export const WRAPS: Record<string, { w: number; lines: string[] }[]> = ${JSON.stringify(table, null, 1)};\n`;
fs.writeFileSync(OUT, body);
console.log(Object.keys(table).length, 'runs,', conflicts, 'conflicts');
