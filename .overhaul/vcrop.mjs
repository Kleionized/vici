import fs from 'node:fs';
import { chromium } from 'playwright-core';
// usage: node crop.mjs out.png x y w h scale a.png b.png
const [out, X, Y, W, H, S, ...imgs] = process.argv.slice(2);
const x = +X, y = +Y, w = +W, h = +H, s = +S;
const b64 = imgs.map((p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64'));
const html = `<body style="margin:0;background:#333;display:flex;gap:8px">` +
  b64.map((d) => `<div style="width:${w*s}px;height:${h*s}px;overflow:hidden;position:relative">
    <img src="${d}" style="position:absolute;left:0;top:0;margin-left:${-x*s}px;margin-top:${-y*s}px;width:393px;image-rendering:pixelated;transform-origin:0 0;transform:scale(${s})">
  </div>`).join('') + `</body>`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: Math.ceil(imgs.length*(w*s+8)), height: Math.ceil(h*s) } });
await page.setContent(html);
await page.screenshot({ path: out });
await browser.close();
console.log('ok');
