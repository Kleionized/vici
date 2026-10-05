import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
const pts = [[556,340,'bite'],[510,380,'lit'],[544,354,'ctr'],[544,320,'r18u'],[544,306,'r24u'],[544,292,'r31u'],[588,354,'r22R'],[620,354,'r38R'],[500,354,'r22L'],[544,400,'r23D'],[300,354,'far bg']];
for (const f of ['day-d-nclose','day-a-nclose']) {
  const buf = (await import('node:fs')).readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
  const out = await p.evaluate(async ([b64, pts]) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    return pts.map(([x, y, l]) => l + ' ' + [...g.getImageData(x, y, 1, 1).data].slice(0, 3).join(','));
  }, [buf, pts]);
  console.log(f, JSON.stringify(out));
}
await b.close();
