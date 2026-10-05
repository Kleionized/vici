import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args:['--disable-gpu','--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 600, height: 200 }, deviceScaleFactor: 1 });
await p.goto('file://' + process.argv[2]);
const r = await p.evaluate(async () => {
  return null;
});
await p.screenshot({ path: process.argv[3] });
await b.close();
