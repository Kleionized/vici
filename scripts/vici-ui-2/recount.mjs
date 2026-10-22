// Pass 2's recount: the canvases that build their artboards at runtime, counted
// by label in WebKit and compared with the ledger, independent of render-designs.
//
//   node scripts/vici-ui-2/recount.mjs
import { webkit } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const { openCanvas } = await import(pathToFileURL(path.join(root, 'scripts/vici-ui-2/common.mjs')).href);
const rows = JSON.parse(fs.readFileSync(path.join(root, 'scripts/vici-ui-2/ledger.json'), 'utf8')).rows;
const { serve } = await import(pathToFileURL(path.join(root, 'scripts/vici-ui-2/serve.mjs')).href);
const server = await serve(path.join(root, 'Vici UI 2/project'), 4793);
const browser = await webkit.launch();
for (const f of ['Email Login.dc.html', 'Vici Relapse.dc.html', 'Vici SOS.dc.html']) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await openCanvas(page, `http://localhost:4793/${encodeURIComponent(f)}`);
  const labels = await page.$$eval('[data-screen-label]', (els) => els.map((e) => e.getAttribute('data-screen-label')));
  const led = rows.filter((r) => r.file === f).map((r) => r.screen);
  const a = new Map(); for (const l of labels) a.set(l, (a.get(l) ?? 0) + 1);
  const b = new Map(); for (const l of led) b.set(l, (b.get(l) ?? 0) + 1);
  const diff = [...new Set([...a.keys(), ...b.keys()])].filter((k) => a.get(k) !== b.get(k));
  console.log(f, 'canvas', labels.length, 'ledger', led.length, 'label mismatches', diff.length, diff.slice(0, 8));
  await page.close();
}
await browser.close();
server.close();
