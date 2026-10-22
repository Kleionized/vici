// A section's spec from the ruler: for each artboard, every text run with its
// box, face and colour, and every painted box (fill, radius, border, shadow),
// in points from the artboard's top-left — what an implementation is checked
// against property by property. The status bar (0–54) and home indicator are
// left out (D2). With a change list (change-kinds.py --detail output), each
// artboard also carries what the new bundle changed from the previous one.
//
//   node scripts/vici-ui-2/spec-from-boxes.mjs <out.md> "<title>" <changes.txt|-> <boxes id> [<id> ...]
import fs from 'node:fs';

const [out, title, changesPath, ...ids] = process.argv.slice(2);
const changes = {};
if (changesPath !== '-') {
  let cur = null;
  for (const line of fs.readFileSync(changesPath, 'utf8').split('\n')) {
    const m = /^OTHER (.+)$/.exec(line);
    if (m) { cur = m[1]; changes[cur] ??= []; continue; }
    if (cur && /^\s{5}\S/.test(line)) changes[cur].push(line.trim());
  }
}
const rgb = (s) => s.replace(/rgba?\(([^)]+)\)/g, (_, v) => {
  const [r, g, b, a] = v.split(',').map((x) => Number(x.trim()));
  const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  return a !== undefined && a !== 1 ? `${hex}@${a}` : hex;
});
const doc = [`# ${title} — spec`, '', 'Generated from the ruler (`specs/vici-ui-2/boxes/<id>.txt`, `scripts/vici-ui-2/boxes.mjs`) by `scripts/vici-ui-2/spec-from-boxes.mjs`. Points in the 393 × 852 frame; colours exact (`@a` = alpha). Status bar 0–54 and home indicator drawn by iOS (D2). Shared frame: 393 × 852 `#0D0D0D`, grain `noise.png` 96 × 96 at opacity 0.05.', ''];
for (const id of ids) {
  const txt = fs.readFileSync(`specs/vici-ui-2/boxes/${id}.txt`, 'utf8').split('\n');
  const head = txt[0].replace(/^# /, '');
  const screen = (/\(([^()]+)\)$/.exec(head) ?? [])[1];
  doc.push(`## ${id} — ${head.split(' · ').slice(2).join(' · ')}`, '');
  if (screen && changes[screen]?.length) {
    doc.push('Changed from the previous bundle:', '', ...changes[screen].map((c) => `- ${c.replace(/\|/g, '\\|')}`), '');
  }
  const text = [], paint = [];
  for (const line of txt.slice(3)) {
    const m = /^(\s*)(\w+) \[([-\d.]+), ([-\d.]+), ([-\d.]+)×([-\d.]+)\] ?(.*?)(?: “(.*)”)?$/.exec(line);
    if (!m) continue;
    const [, , tag, x, y, w, h, style, own] = m;
    const Y = Number(y);
    if (Y + Number(h) <= 54 && Y >= 0 && Number(h) < 54) continue; // status bar
    if (Number(x) === 127 && Y === 839) continue; // home indicator
    const box = `${x}, ${y}, ${w} × ${h}`;
    const st = rgb(style);
    if (own) text.push(`| ${own.replace(/\|/g, '\\|').slice(0, 90)} | ${box} | ${st.replace(/\|/g, '\\|')} |`);
    else if (/bg:|border:|shadow:|radius:/.test(style) || tag === 'svg' || tag === 'img') paint.push(`| ${tag} | ${box} | ${st.replace(/\|/g, '\\|')} |`);
  }
  if (text.length) doc.push('| text | box | type & colour |', '|---|---|---|', ...text, '');
  if (paint.length) doc.push('| painted | box | fill, radius, border, shadow |', '|---|---|---|', ...paint, '');
}
fs.writeFileSync(out, doc.join('\n'));
console.log(`${out}: ${ids.length} artboards`);
