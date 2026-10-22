// The WebKit side of the vertical text lab (VLab in src/dev/TextLab.tsx): the same runs at the same boxes.
//   node scripts/vici-ui-2/vlab.mjs <out.png>
import { webkit } from 'playwright-core';
import fs from 'node:fs';
const pairs = [[48,50],[56,56],[44,52],[40,46],[60,70],[34,40],[26,33],[32,38]];
const font = fs.readFileSync('node_modules/@expo-google-fonts/lato/700Bold/Lato_700Bold.ttf').toString('base64');
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3 });
await page.setContent(`<style>@font-face{font-family:L;font-weight:700;src:url(data:font/ttf;base64,${font})} body{margin:0;background:#000} div{position:absolute;left:24px;color:#fff;font-family:L;font-weight:700;-webkit-font-smoothing:antialiased;white-space:nowrap}</style>` + pairs.map(([s,l],i)=>`<div style="top:${80+90*i}px;font-size:${s}px;line-height:${l}px">×23 Hg</div>`).join(''));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: process.argv[2] });
await browser.close();
