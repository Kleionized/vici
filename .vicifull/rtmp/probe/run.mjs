import { chromium } from 'playwright-core';
const br = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await br.newContext({ viewport: { width: 260, height: 300 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('file://' + process.cwd() + '/.vicifull/rtmp/probe/glow.html');
const out = await p.evaluate(async () => {
  const c = document.createElement('canvas');
  return 'see shot';
});
await p.screenshot({ path: '.vicifull/rtmp/probe/glow.png' });
await br.close();
