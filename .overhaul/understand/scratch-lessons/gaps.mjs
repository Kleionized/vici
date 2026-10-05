import fs from 'node:fs';
const R = JSON.parse(fs.readFileSync('frames.json'));
const g = {};
const typ = {};
for (const L of R) for (const p of L.pages) {
  p.atoms.forEach((a, i) => {
    const prev = i ? (p.atoms[i - 1].k === 'viz' ? 'viz' : p.atoms[i - 1].k) : '(first)';
    const cur = a.k === 'viz' ? 'viz' : a.k;
    const key = `${p.kind.padEnd(14)} ${prev.padEnd(10)} -> ${cur.padEnd(10)} mt=${a.mt ?? '-'}`;
    g[key] = (g[key] || 0) + 1;
    if (a.color) { const tk = `${a.k} color=${a.color} fw=${a.fw} ls=${a.ls||''} center=${a.center}`; typ[tk] = (typ[tk] || 0) + 1; }
  });
}
for (const [k, v] of Object.entries(g).sort()) console.log(String(v).padStart(5), k);
console.log();
for (const [k, v] of Object.entries(typ).sort()) console.log(String(v).padStart(5), k);
