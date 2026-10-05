import fs from 'node:fs';
const M = JSON.parse(fs.readFileSync('lessons.model.json'));
const ROM = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const code = (p) => ({ cover: 'C', quote: 'Q', section: 'S', cont: 'c', question: '?', answer: 'A', reflect: 'R', task: 'T', taskEnd: 'E', complete: 'D' }[p.kind] + (p.hero ? 'h' : '') + (p.viz ? 'v' : ''));
const rows = [];
for (const L of M) {
  const q = L.pages.findIndex((p) => p.kind === 'question');
  const ex = [];
  L.pages.forEach((p, i) => { if (p.hero && p.kind !== 'cover') ex.push(`F${i + 1} ${p.hero}`); if (p.viz) ex.push(`F${i + 1} ${p.viz.type}`); });
  rows.push(`| ${L.n} | ${ROM[L.week - 1]} | ${L.title} | ${L.frames} | \`${L.hero}\` | ${L.pages.map(code).join(' ')} | ${q >= 0 ? `F${q + 1}–F${q + 2}` : '—'} | ${ex.join(', ')} |`);
}
console.log(rows.join('\n'));
