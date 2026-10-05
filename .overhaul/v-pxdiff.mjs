import fs from 'node:fs';
import { chromium } from 'playwright-core';
const pairs = JSON.parse(process.argv[2]);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
for (const [d, a, label] of pairs) {
  const bd = fs.readFileSync(`.overhaul/shots/${d}.png`).toString('base64');
  const ba = fs.readFileSync(`.overhaul/shots/${a}.png`).toString('base64');
  const out = await p.evaluate(async ([x, y]) => {
    const load = async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; c.getContext('2d').drawImage(i, 0, 0); return c.getContext('2d').getImageData(0, 0, i.width, i.height); };
    const A = await load(x), B = await load(y);
    if (A.width !== B.width || A.height !== B.height) return { err: 'size' };
    let sum = 0, over8 = 0, over32 = 0, worst = 0, wx = 0, wy = 0;
    // skip the canvas's status bar (top 54*2) — the app never draws it
    const skipTop = 108;
    for (let i = 0; i < A.data.length; i += 4) {
      const px = (i / 4) % A.width, py = Math.floor((i / 4) / A.width);
      if (py < skipTop) continue;
      const dd = Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2]));
      sum += dd; if (dd > 8) over8++; if (dd > 32) over32++;
      if (dd > worst) { worst = dd; wx = px; wy = py; }
    }
    const n = A.width * (A.height - skipTop);
    return { mean: +(sum / n).toFixed(2), pct8: +(100 * over8 / n).toFixed(2), pct32: +(100 * over32 / n).toFixed(2), worst, wx: Math.round(wx/2), wy: Math.round(wy/2) };
  }, [bd, ba]);
  console.log(label.padEnd(26), JSON.stringify(out));
}
await b.close();
