import { chromium } from 'playwright-core';
const BG = 'rgb(30,29,27)';
const html = `<!doctype html><html><body style="margin:0;background:${BG}">
<div style="position:relative;width:300px;height:138px;background:${BG}">
  <div style="position:absolute;left:60px;top:60px;width:180px;height:18px;border-radius:50%;background:rgba(0,0,0,0.4);filter:blur(10px)"></div>
</div>
<div style="position:relative;width:300px;height:138px;background:${BG}">
  <svg width="300" height="138"><defs><filter id="f1" filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="138"><feGaussianBlur stdDeviation="10"/></filter></defs>
  <ellipse cx="150" cy="69" rx="90" ry="9" fill="#000000" fill-opacity="0.4" filter="url(#f1)"/></svg>
</div>
<div style="position:relative;width:300px;height:138px;background:${BG}">
  <svg width="300" height="138"><defs><filter id="f2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" x="0" y="0" width="300" height="138"><feGaussianBlur stdDeviation="10"/></filter></defs>
  <ellipse cx="150" cy="69" rx="90" ry="9" fill="#000000" fill-opacity="0.4" filter="url(#f2)"/></svg>
</div>
</body></html>`;
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage','--disable-extensions','--no-first-run'] });
const ctx = await b.newContext({ viewport:{width:300,height:420}, deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.setContent(html);
const px = await p.evaluate(async () => {
  const c = document.createElement('canvas');
  return null;
});
await p.screenshot({ path: '.vicifull/shots/rfunnel/blur.png' });
await b.close();
