// Shared helpers: parse a split lesson frame into a tree with the phone chrome removed.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
export const FINAL = path.join(ROOT, '.overhaul/final');
export const WEEKS = fs.readdirSync(FINAL).filter((d) => /^Week-\d\d/.test(d)).sort();

export function tree(file) {
  const rows = parse(fs.readFileSync(file, 'utf8'));
  const root = { tag: 'root', decls: {}, attrs: {}, kids: [], depth: -1 };
  const stack = [root];
  for (const r of rows) {
    const n = { ...r, kids: [] };
    while (stack.length && stack[stack.length - 1].depth >= r.depth) stack.pop();
    stack[stack.length - 1].kids.push(n);
    if (r.tag !== '#text') stack.push(n);
  }
  const frame = root.kids.find((k) => k.tag === 'div');
  // drop status bar + home indicator
  frame.kids = frame.kids.filter((k) => !(k.decls.height === '54px' && k.decls.top === '0' && k.decls.position === 'absolute') && !(k.decls.width === '139px' && k.decls.height === '5px'));
  return frame;
}

export const text = (n) => (n.tag === '#text' ? n.text : n.kids.map(text).join(' ')).replace(/\s+/g, ' ').trim();
export const walk = (n, f) => { f(n); for (const k of n.kids || []) walk(k, f); };
export const find = (n, pred) => { let hit = null; walk(n, (x) => { if (!hit && pred(x)) hit = x; }); return hit; };
export const all = (n, pred) => { const out = []; walk(n, (x) => { if (pred(x)) out.push(x); }); return out; };

export function lessons() {
  const out = [];
  for (const w of WEEKS) {
    const files = fs.readdirSync(path.join(FINAL, w)).filter((f) => /^L\d+-Frame-\d+\.html$/.test(f));
    const by = new Map();
    for (const f of files) { const [, l, k] = f.match(/^L(\d+)-Frame-(\d+)/); if (!by.has(+l)) by.set(+l, []); by.get(+l).push([+k, f]); }
    for (const [l, fs_] of [...by.entries()].sort((a, b) => a[0] - b[0])) {
      fs_.sort((a, b) => a[0] - b[0]);
      out.push({ week: +w.slice(5, 7), weekDir: w, n: l, frames: fs_.map(([k, f]) => ({ k, file: path.join(FINAL, w, f), label: `L${l} Frame ${k}` })) });
    }
  }
  return out;
}
