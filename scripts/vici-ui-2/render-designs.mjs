// Renders every artboard ([data-screen-label]) of every design canvas in WebKit
// at deviceScaleFactor 3, one PNG per artboard, plus an index of what each is.
//
//   node scripts/vici-ui-2/render-designs.mjs [bundleDir] [outDir] [fileFilter]
//
// Google's Lato stylesheet is answered with @font-face rules that point at the
// exact TTFs the app bundles (@expo-google-fonts/lato), so a diff can never be
// a font-file difference.
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';

const BUNDLE = path.resolve(process.argv[2] ?? 'Vici UI 2/project');
const OUT = path.resolve(process.argv[3] ?? 'pixel-diff/design');
const FILTER = process.argv[4] ?? '';
const PORT = 4792;
export const CLOCK = '2026-10-21T09:41:00';
export const SETTLE_MS = 2000;

export const FILE_KEYS = {
  'Email Login.dc.html': 'app',
  'Email Login (before label pass).dc.html': 'app-before',
  'Vici SOS.dc.html': 'sos',
  'Vici Relapse.dc.html': 'relapse',
  'Lesson Illustrations v4.dc.html': 'illus',
};
export const fileKey = f => FILE_KEYS[f] ?? (f.match(/^Week (\d\d)/) ? 'w' + f.match(/^Week (\d\d)/)[1] : f.replace(/\W+/g, '-'));
export const slug = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const LATO = 'node_modules/@expo-google-fonts/lato';
const FACES = [['400', 'normal', '400Regular/Lato_400Regular.ttf'], ['700', 'normal', '700Bold/Lato_700Bold.ttf'], ['900', 'normal', '900Black/Lato_900Black.ttf'], ['700', 'italic', '700Bold_Italic/Lato_700Bold_Italic.ttf'], ['400', 'italic', '400Regular_Italic/Lato_400Regular_Italic.ttf']];
const FONT_CSS = FACES.map(([w, s, f]) => `@font-face{font-family:'Lato';font-style:${s};font-weight:${w};src:url(/__font/${path.basename(f)}) format('truetype');}`).join('\n');

const server = await serve(BUNDLE, PORT);
const browser = await webkit.launch();
const files = fs.readdirSync(BUNDLE).filter(f => f.endsWith('.dc.html') && f.includes(FILTER)).sort();
fs.mkdirSync(OUT, { recursive: true });
const index = fs.existsSync(path.join(OUT, 'index.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'index.json'), 'utf8')) : {};

for (const f of files) {
  const key = fileKey(f);
  const ctx = await browser.newContext({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  // A frozen clock: every frame that reads the time (the status bar, an urge's
  // elapsed timer, the breathing phase) renders the same on every run. The
  // fixed moment is 9:41 on the day the bundle was handed over.
  await page.clock.install({ time: new Date(CLOCK) });
  await page.clock.pauseAt(new Date(CLOCK));
  await page.route('**/fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: FONT_CSS }));
  await page.route('**/fonts.gstatic.com/**', r => r.abort());
  await page.route('**/__font/*', r => {
    const name = path.basename(new URL(r.request().url()).pathname);
    const face = FACES.find(x => path.basename(x[2]) === name);
    r.fulfill({ status: 200, contentType: 'font/ttf', body: fs.readFileSync(path.join(LATO, face[2])) });
  });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(`http://localhost:${PORT}/${encodeURIComponent(f)}`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(SETTLE_MS);
  await page.waitForTimeout(1500);
  // Settle every finite entrance animation on its last frame.
  await page.evaluate(() => document.getAnimations().forEach(a => { try { if (a.effect?.getTiming().iterations !== Infinity) a.finish(); } catch {} }));
  await page.waitForTimeout(300);
  const faces = await page.evaluate(() => [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family + ' ' + x.weight + ' ' + x.style));
  const frames = await page.$$('[data-screen-label]');
  const rows = [];
  for (let i = 0; i < frames.length; i++) {
    const el = frames[i];
    const meta = await el.evaluate(n => {
      const label = n.previousElementSibling?.textContent?.trim() ?? '';
      let sec = '', p = n.parentElement;
      while (p && !sec) { const t = p.previousElementSibling; if (t && getComputedStyle(t).borderRadius === '100px') sec = t.textContent.trim(); p = p.parentElement; }
      const r = n.getBoundingClientRect();
      return { screen: n.getAttribute('data-screen-label'), label, sec, w: r.width, h: r.height };
    });
    const name = `${key}__${String(i).padStart(3, '0')}__${slug(meta.label || meta.screen)}`;
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: path.join(OUT, name + '.png'), animations: 'disabled' });
    rows.push({ name, ...meta });
  }
  index[f] = { key, faces, errs, rows };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));
  console.log(f, rows.length, 'frames', faces.length, 'faces', errs.length ? 'ERR ' + errs[0] : '');
  await ctx.close();
}
await browser.close();
server.close();
