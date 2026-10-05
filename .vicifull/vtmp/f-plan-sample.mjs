/* Sample the same canvas-coordinate points out of a design PNG and an app PNG.
   Both are captured at 393x852 CSS px, deviceScaleFactor 2, and the app's root
   injects the 54pt safe-area inset, so one coordinate addresses both. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [a, b, ptsArg] = process.argv.slice(2);
const pts = JSON.parse(fs.readFileSync(ptsArg, 'utf8'));
const load = (n) => fs.readFileSync(`.vicifull/shots/${n}.png`).toString('base64');
const br = await chromium.launch({ channel: 'chrome', headless: true });
const p = await br.newPage();
const out = await p.evaluate(async ([A, B, pts]) => {
  const get = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const g = c.getContext('2d'); g.drawImage(i, 0, 0); return { g, dev: i.width / 393 }; };
  const ga = await get(A), gb = await get(B);
  /* 3x3 mean: the frame paints a 0.12 grain over everything and a single
     device pixel is dithered by it, so a lone sample is +/-6 of the truth. */
  const px = (o, x, y) => { const d = o.g.getImageData(Math.round(x*o.dev)-1, Math.round(y*o.dev)-1, 3, 3).data;
    const s=[0,0,0]; for (let i=0;i<9;i++){s[0]+=d[i*4];s[1]+=d[i*4+1];s[2]+=d[i*4+2];}
    return s.map((v)=>Math.round(v/9)); };
  return pts.map(([x, y, label]) => {
    const A2 = px(ga, x, y), B2 = px(gb, x, y);
    const dmax = Math.max(...A2.map((v,i)=>Math.abs(v-B2[i])));
    return { label, at: [x,y], design: A2.join(','), app: B2.join(','), d: dmax };
  });
}, [load(a), load(b), pts]);
for (const r of out) console.log(String(r.label).padEnd(28), String(r.at).padEnd(10), 'design', r.design.padEnd(12), 'app', r.app.padEnd(12), 'Δ' + r.d);
await br.close();
