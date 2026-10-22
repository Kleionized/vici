// Lists the artboards in the designer's QA pages (screenshots/*.html, gen/*.html): label, size, first words.
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';

const root = 'Vici UI 2/project';
const server = await serve(root, 4795);
const files = [...fs.readdirSync(`${root}/screenshots`).filter((f) => f.endsWith('.html')).map((f) => `screenshots/${f}`), ...fs.readdirSync(`${root}/gen`).filter((f) => f.endsWith('.html')).map((f) => `gen/${f}`)];
const browser = await webkit.launch();
const out = {};
for (const f of files) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(`http://localhost:4795/${f.split('/').map(encodeURIComponent).join('/')}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  out[f] = await page.evaluate(() => [...document.querySelectorAll('[data-screen-label]')].map((el) => { const r = el.getBoundingClientRect(); return { screen: el.getAttribute('data-screen-label'), w: Math.round(r.width), h: Math.round(r.height), text: el.innerText.replace(/\s+/g, ' ').slice(0, 80) }; }));
  if (out[f].length) console.log(f, out[f].length, out[f].map((x) => x.screen).join(' | ').slice(0, 300));
  await page.close();
}
fs.writeFileSync('pixel-diff/probe-qa.json', JSON.stringify(out, null, 1));
await browser.close();
server.close();
