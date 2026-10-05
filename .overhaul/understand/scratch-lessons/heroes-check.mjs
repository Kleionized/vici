import fs from 'node:fs';
const R = JSON.parse(fs.readFileSync('frames.json'));
const B = JSON.parse(fs.readFileSync('../../../Vici Overhaul/project/gen/hero-bounds.json'));
const by = {};
for (const L of R) for (const p of L.pages) for (const a of p.atoms) if (a.k === 'hero') {
  const key = a.id; (by[key] ||= new Set()).add(`h=${a.h} top=${a.top} tf=${a.transform} origin=${a.origin} mt=${a.mt||''}`);
  const [t, b] = B[key] || [];
  const st = Math.floor(190 + (t - 190) * 1.1), sb = Math.ceil(190 + (b - 190) * 1.1);
  if (`${-st}px` !== a.top || sb - st !== a.h) console.log('MISMATCH', p.label, key, a.top, a.h, -st, sb - st);
}
for (const [k, v] of Object.entries(by)) console.log(k.padEnd(14), [...v].join(' || '), JSON.stringify(B[k]));
