// The ruler: every visible element of one or more artboards, with its box in
// points (relative to the artboard) and the computed styles that place and
// paint it. Written to specs/vici-ui-2/boxes/<id>.txt, one line per element.
//
//   node scripts/vici-ui-2/boxes.mjs "<canvas file>" <artboard index> [<index> ...]
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileKey, CLOCK, SETTLE_MS } from './render-designs.mjs';
import { serve } from './serve.mjs';

const [file, ...idx] = process.argv.slice(2);
const BUNDLE = path.resolve('Vici UI 2/project');
const PORT = 4794;
const LATO = 'node_modules/@expo-google-fonts/lato';
const FACES = [['400', 'normal', '400Regular/Lato_400Regular.ttf'], ['700', 'normal', '700Bold/Lato_700Bold.ttf'], ['900', 'normal', '900Black/Lato_900Black.ttf'], ['700', 'italic', '700Bold_Italic/Lato_700Bold_Italic.ttf'], ['400', 'italic', '400Regular_Italic/Lato_400Regular_Italic.ttf']];
const FONT_CSS = FACES.map(([w, s, f]) => `@font-face{font-family:'Lato';font-style:${s};font-weight:${w};src:url(/__font/${path.basename(f)}) format('truetype');}`).join('\n');

const server = await serve(BUNDLE, PORT);
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
await page.clock.install({ time: new Date(CLOCK) });
await page.clock.pauseAt(new Date(CLOCK));
await page.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: FONT_CSS }));
await page.route('**/fonts.gstatic.com/**', (r) => r.abort());
await page.route('**/__font/*', (r) => {
  const face = FACES.find((x) => path.basename(x[2]) === path.basename(new URL(r.request().url()).pathname));
  r.fulfill({ status: 200, contentType: 'font/ttf', body: fs.readFileSync(path.join(LATO, face[2])) });
});
await page.goto(`http://localhost:${PORT}/${encodeURIComponent(file)}`, { waitUntil: 'networkidle', timeout: 180000 });
await page.evaluate(() => document.fonts.ready);
await page.clock.runFor(SETTLE_MS);
await page.waitForTimeout(1500);
fs.mkdirSync('specs/vici-ui-2/boxes', { recursive: true });
for (const i of idx) {
  const lines = await page.evaluate((i) => {
    const root = document.querySelectorAll('[data-screen-label]')[i];
    const R = root.getBoundingClientRect();
    const r1 = (v) => Math.round(v * 100) / 100;
    const out = [];
    const walk = (el, depth) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && el.tagName !== 'svg') return;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
      const st = [];
      const add = (k, v, skip) => { if (v && v !== skip) st.push(`${k}:${v}`); };
      if (own) { add('font', `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontStyle}`); add('ls', cs.letterSpacing, 'normal'); add('color', cs.color); add('align', cs.textAlign, 'start'); add('wrap', cs.textWrapStyle || cs.textWrap, 'wrap'); }
      add('bg', cs.backgroundColor, 'rgba(0, 0, 0, 0)');
      add('radius', cs.borderRadius, '0px');
      add('shadow', cs.boxShadow, 'none');
      add('border', cs.borderTopWidth !== '0px' || cs.borderBottomWidth !== '0px' ? `${cs.borderTopWidth} ${cs.borderTopColor} / ${cs.borderBottomWidth} ${cs.borderBottomColor}` : '');
      add('opacity', cs.opacity, '1');
      add('transform', cs.transform, 'none');
      const tag = el.tagName.toLowerCase();
      out.push(`${'  '.repeat(depth)}${tag} [${r1(r.left - R.left)}, ${r1(r.top - R.top)}, ${r1(r.width)}×${r1(r.height)}] ${st.join(' ')}${own ? ` “${own}”` : ''}`);
      if (tag === 'svg') return;
      for (const c of el.children) walk(c, depth + 1);
    };
    walk(root, 0);
    return out;
  }, Number(i));
  const meta = await page.evaluate((i) => { const el = document.querySelectorAll('[data-screen-label]')[i]; return { screen: el.getAttribute('data-screen-label'), label: el.previousElementSibling?.textContent?.trim() }; }, Number(i));
  const name = `${fileKey(file)}__${String(i).padStart(3, '0')}`;
  fs.writeFileSync(`specs/vici-ui-2/boxes/${name}.txt`, `# ${file} · artboard ${i} · ${meta.label} (${meta.screen})\n# [x, y, w×h] in points from the artboard's top-left; computed styles.\n\n${lines.join('\n')}\n`);
  console.log(name, lines.length, 'elements');
}
await browser.close();
server.close();
