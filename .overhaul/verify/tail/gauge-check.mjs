import fs from 'node:fs';
const html = fs.readFileSync('.overhaul/final/Email-Login/Starting-Score.html', 'utf8');
const svg = html.slice(html.indexOf('<svg width="300"'), html.indexOf('</svg>', html.indexOf('<svg width="300"')));
const paths = [...svg.matchAll(/<path ([^>]*)>/g)].map((m) => Object.fromEntries([...m[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]])));
const circ = [...svg.matchAll(/<circle ([^>]*)>/g)].map((m) => Object.fromEntries([...m[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]])));
const f1 = (v) => v.toFixed(1);
function app(score) {
  const share = Math.max(0, Math.min(score, 1000)) / 1000;
  const ticks = Array.from({ length: 49 }, (_, i) => {
    const a = ((180 - 3.75 * i) * Math.PI) / 180; const on = i / 48 <= share; const r0 = on ? 108 : 119;
    const cos = Math.cos(a), sin = Math.sin(a);
    return { d: `M${f1(150 + r0 * cos)} ${f1(156 - r0 * sin)}L${f1(150 + 128 * cos)} ${f1(156 - 128 * sin)}`, w: on ? 3.4 : 2 };
  });
  const m = Math.PI * (1 - share);
  return { ticks, cx: f1(150 + 96 * Math.cos(m)), cy: f1(156 - 96 * Math.sin(m)) };
}
const A = app(842);
let bad = 0;
console.log('frame paths', paths.length, 'circles', circ.length);
paths.forEach((p, i) => { const t = A.ticks[i]; if (!t || t.d !== p.d || String(t.w) !== p['stroke-width']) { bad++; console.log('DIFF', i, p.d, p['stroke-width'], '| app', t && t.d, t && t.w); } });
console.log('marker frame', circ.map((c) => `${c.cx},${c.cy} r${c.r}`).join(' '), '| app', A.cx, A.cy);
console.log('tick mismatches', bad);
console.log(svg.match(/<text[^>]*>[^<]*<\/text>/g).join('\n'));
