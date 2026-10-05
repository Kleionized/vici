import fs from 'node:fs';
const M = JSON.parse(fs.readFileSync('measure.json'));
const R = JSON.parse(fs.readFileSync('frames.json'));
const kind = {}; for (const L of R) for (const p of L.pages) kind[p.label] = p;
console.log('frames measured', Object.keys(M).length);
// overflow of the content box (box 140..712 with pb 24 => usable 140..688 when pb=24; centred in 140..700)
const over = [];
let maxH = 0;
for (const [lab, m] of Object.entries(M)) {
  const p = kind[lab];
  const usable = p.block.pb === '0px' ? 584 : 560;
  if (m.h > maxH) maxH = m.h;
  if (m.top < 140 - 0.5 || m.bottom > 724 + 0.5 || m.h > usable + 0.5) over.push(`${lab} ${p.kind} h=${m.h} top=${m.top} bottom=${m.bottom} usable=${usable}`);
}
console.log('max content height', maxH);
console.log('over box', over.length); over.forEach((o) => console.log('  ' + o));
// histogram of content heights by kind
const hist = {};
for (const [lab, m] of Object.entries(M)) { const k = kind[lab].kind; (hist[k] ||= []).push(m.h); }
for (const [k, v] of Object.entries(hist)) { v.sort((a, b) => a - b); console.log(k.padEnd(15), 'n', v.length, 'min', v[0], 'median', v[v.length >> 1], 'max', v[v.length - 1]); }
// device fit: available content height = H - (safeTop + 86) - 128 - 24 (pb)
const devs = { '375x667 (SE, top 20)': [375, 667, 20], '390x844 (top 47)': [390, 844, 47], '393x852 (canvas, top 54)': [393, 852, 54], '430x932 (top 59)': [430, 932, 59] };
for (const [name, [W, H, top]] of Object.entries(devs)) {
  const avail = H - top - 86 - 128 - 24;
  const col = W === 375 ? '375' : W === 430 ? '430' : '393';
  const bad = Object.entries(M).filter(([lab, m]) => m.natural[col] > avail + (kind[lab].block.pb === '0px' ? 24 : 0));
  const byKind = {}; bad.forEach(([lab]) => { const k = kind[lab].kind; byKind[k] = (byKind[k] || 0) + 1; });
  console.log(name, 'avail', avail, 'pages taller than box:', bad.length, JSON.stringify(byKind), 'max', Math.max(...Object.values(M).map((m) => m.natural[col])));
}
