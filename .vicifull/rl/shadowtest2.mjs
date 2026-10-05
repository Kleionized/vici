import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport:{width:393,height:700}, deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.goto('file://' + process.cwd() + '/.vicifull/rl/shadowtest.html');
await p.waitForTimeout(400);
for (const id of ['A','T0','T1','T2']) await (await p.$('#'+id)).screenshot({ path: `.vicifull/rl/st-${id}.png` });
await b.close();
