/* Does Chrome honour rx/ry on <radialGradient>? (the pass-1 WeekScene form) */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args:['--disable-gpu'] });
const p = await b.newPage();
await p.setContent(`<svg id="s" width="393" height="258" style="background:#fff">
<defs>
 <radialGradient id="old" cx="169" cy="81" rx="53" ry="53" gradientUnits="userSpaceOnUse">
   <stop offset="0" stop-color="#E2BA78" stop-opacity="0.42"/><stop offset="0.74" stop-color="#E2BA78" stop-opacity="0"/></radialGradient>
 <radialGradient id="new"><stop offset="0" stop-color="#E2BA78" stop-opacity="0.42"/><stop offset="0.74" stop-color="#E2BA78" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="169" cy="81" rx="53" ry="53" fill="url(#old)"/>
<ellipse cx="169" cy="200" rx="53" ry="53" fill="url(#new)"/>
</svg>`);
const shot = await p.locator('#s').screenshot();
const { PNG } = await import('pngjs');
const I = PNG.sync.read(shot);
const at=(x,y)=>[0,1,2].map(c=>I.data[(y*I.width+x)*4+c]).join(',');
console.log('OLD form (rx/ry + userSpaceOnUse): centre', at(169,81), ' r=40', at(209,81), ' r=53(edge)', at(221,81));
console.log('NEW form (bare, objectBoundingBox): centre', at(169,200), ' r=40', at(209,200), ' r=53(edge)', at(221,200));
await b.close();
