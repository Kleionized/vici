import fs from 'node:fs';
import path from 'node:path';
const files = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|jsx?)$/.test(f)) files.push(p); } };
walk('src');
const resolve = (from, spec) => {
  let base;
  if (spec.startsWith('@/')) base = path.join('src', spec.slice(2));
  else if (spec.startsWith('.')) base = path.join(path.dirname(from), spec);
  else return null;
  for (const c of [base, base + '.ts', base + '.tsx', base + '.js', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.normalize(c);
  return null;
};
const deps = new Map();
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const out = new Set();
  for (const m of s.matchAll(/(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const r = resolve(f, m[1] ?? m[2] ?? m[3]);
    if (r) out.add(r);
  }
  deps.set(path.normalize(f), out);
}
const roots = files.filter((f) => f.startsWith('src/app/')).map((f) => path.normalize(f));
const seen = new Set(roots);
const q = [...roots];
while (q.length) { const f = q.pop(); for (const d of deps.get(f) ?? []) if (!seen.has(d)) { seen.add(d); q.push(d); } }
const dead = files.map((f) => path.normalize(f)).filter((f) => !seen.has(f));
console.log(dead.length + ' unreachable from src/app:\n' + dead.map((f) => `  ${f} (${fs.statSync(f).size >> 10} KB)`).join('\n'));
