import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [out, img, X, Y, W, H, S] = process.argv.slice(2);
const d = 'data:image/png;base64,' + fs.readFileSync(img).toString('base64');
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const p = await b.newPage({ viewport: { width: +W * +S, height: +H * +S } });
await p.setContent(`<body style="margin:0;overflow:hidden"><img src="${d}" style="position:absolute;left:${-X * S}px;top:${-Y * S}px;width:${430 * S}px;image-rendering:pixelated"></body>`);
await p.screenshot({ path: out }); await b.close(); console.log('ok');
