// What the run's design-side scripts share: canvas keys, the frozen clock, and
// the font routing that hands WebKit the app's own Lato files.
import fs from 'node:fs';
import path from 'node:path';

export const FILE_KEYS = {
  'Email Login.dc.html': 'app',
  'Email Login (before label pass).dc.html': 'app-before',
  'Vici SOS.dc.html': 'sos',
  'Vici Relapse.dc.html': 'relapse',
  'Lesson Illustrations v4.dc.html': 'illus',
};
export const fileKey = (f) => FILE_KEYS[f] ?? (f.match(/^Week (\d\d)/) ? 'w' + f.match(/^Week (\d\d)/)[1] : f.replace(/\W+/g, '-'));
export const slug = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

/** The renders' clock (D4): 9:41 on the day the bundle was handed over, advanced SETTLE_MS after load. */
export const CLOCK = '2026-10-21T09:41:00';
export const SETTLE_MS = 2000;

const LATO = 'node_modules/@expo-google-fonts/lato';
const FACES = [['400', 'normal', '400Regular/Lato_400Regular.ttf'], ['700', 'normal', '700Bold/Lato_700Bold.ttf'], ['900', 'normal', '900Black/Lato_900Black.ttf'], ['700', 'italic', '700Bold_Italic/Lato_700Bold_Italic.ttf'], ['400', 'italic', '400Regular_Italic/Lato_400Regular_Italic.ttf']];
const FONT_CSS = FACES.map(([w, s, f]) => `@font-face{font-family:'Lato';font-style:${s};font-weight:${w};src:url(/__font/${path.basename(f)}) format('truetype');}`).join('\n');

/** Answer Google's Lato stylesheet with the app's own TTFs (D5). */
export async function routeFonts(page) {
  await page.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: FONT_CSS }));
  await page.route('**/fonts.gstatic.com/**', (r) => r.abort());
  await page.route('**/__font/*', (r) => {
    const face = FACES.find((x) => path.basename(x[2]) === path.basename(new URL(r.request().url()).pathname));
    r.fulfill({ status: 200, contentType: 'font/ttf', body: fs.readFileSync(path.join(LATO, face[2])) });
  });
}

/** Open a canvas with the frozen clock and the app's fonts, settled. */
export async function openCanvas(page, url) {
  await page.clock.install({ time: new Date(CLOCK) });
  await page.clock.pauseAt(new Date(CLOCK));
  await routeFonts(page);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(SETTLE_MS);
  await page.waitForTimeout(1500);
}
