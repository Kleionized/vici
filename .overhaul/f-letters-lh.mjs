/* Is Chrome's used line-height for a unitless ratio floored or rounded to 1/64? */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const p = await (await b.newContext({ viewport:{width:393,height:852}, deviceScaleFactor:2 })).newPage();
const cases = [[15.5,1.8],[15.5,1.9],[16,1.7],[15,1.55],[17,1.35],[13.5,1.62]];
await p.setContent('<div id="w" style="width:325px;font-family:-apple-system,system-ui,sans-serif"></div>');
for (const [fs, r] of cases) {
  const h = await p.evaluate(([fs,r]) => {
    const w = document.getElementById('w');
    w.innerHTML = `<p id="x" style="font-size:${fs}px;line-height:${r};margin:0">a<br>b<br>c<br>d<br>e<br>f<br>g<br>h</p>`;
    return document.getElementById('x').getBoundingClientRect().height;
  }, [fs, r]);
  const used = h / 8;
  const exact = fs * r;
  console.log(`${fs}×${r} = ${exact}  used ${used}  floor ${Math.floor(exact*64)/64}  round ${Math.round(exact*64)/64}  -> ${used === Math.floor(exact*64)/64 ? 'FLOOR' : used === Math.round(exact*64)/64 ? 'ROUND' : 'neither'}`);
}
await b.close();
