/* Evaluate an expression against a design frame served at :8097. */
import { chromium } from 'playwright-core';
const [bundle, frame, expr] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const c = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const p = await c.newPage();
await p.goto(`http://localhost:8097/f/${bundle}/${frame}`, { waitUntil: 'networkidle' });
console.log(JSON.stringify(await p.evaluate(`(() => { ${expr} })()`), null, 1));
await b.close();
