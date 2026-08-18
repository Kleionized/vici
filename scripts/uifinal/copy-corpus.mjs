#!/usr/bin/env node
/**
 * Every line of copy the app itself says, gathered in one place.
 *
 * The lessons are authored content and live in `src/content`; this walks what
 * the app says in its own voice — screens, cards, labels, empty states — so a
 * prose pass can be run over the whole of it rather than screen by screen.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src/app', 'src/components', 'src/lib'];
const SKIP_DIRS = new Set(['node_modules', '__tests__']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, out);
    } else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

/** A run of prose, not a class name, a path, a hex colour or an enum. */
function isProse(s) {
  if (s.length < 4 || s.length > 400) return false;
  if (!/\s/.test(s)) return false;
  if (!/[a-z]{2}/.test(s)) return false;
  if (/^[#.\/@]/.test(s)) return false;
  if (/^https?:/.test(s)) return false;
  // style values: "0 0 0 1px rgba(...)", "1 2", "M12 4L3 9"
  if (/^[-\d.\s,]+$/.test(s)) return false;
  if (/rgba?\(|px\b|deg\b|^[MmLlHhVvCcSsQqTtAaZz][\d\s.,-]/.test(s)) return false;
  if (/^[a-z-]+(\s+[a-z-]+)*$/.test(s) && s.split(/\s+/).length <= 2 && /^(flex|row|column|center|space|wrap|none|auto|bold|normal)/.test(s)) return false;
  // fragments of expressions the line scanner picked up between > and <
  if (/[{}=<>|&]|\?\s|\)\s*:|=>|\[\]|\.\w+\(/.test(s)) return false;
  if (/^[^A-Za-z'“]/.test(s)) return false;
  if (/,\s*(sans-serif|serif|cursive|monospace)$/.test(s)) return false;
  // needs two real words
  if ((s.match(/\b[A-Za-z][A-Za-z'’-]{2,}\b/g) ?? []).length < 2) return false;
  return true;
}

const strings = new Map(); // text -> [locations]
const add = (text, file, line) => {
  const key = text.trim();
  if (!key || !isProse(key)) return;
  if (!strings.has(key)) strings.set(key, []);
  strings.get(key).push(`${file}:${line}`);
};

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = relative(process.cwd(), file);
    const src = readFileSync(file, 'utf8');
    const lines = src.split('\n');

    lines.forEach((raw, i) => {
      const line = i + 1;
      // skip comment-only lines: the prose in them is for us, not the user
      const trimmed = raw.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
      if (/^import\b|^export .*from '/.test(trimmed)) return;

      // quoted string literals
      for (const m of raw.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)) {
        add((m[1] ?? m[2]).replace(/\\'/g, "'"), rel, line);
      }
      // template literals with no substitution
      for (const m of raw.matchAll(/`([^`$]*)`/g)) add(m[1], rel, line);
      // bare JSX text: >Some words<
      for (const m of raw.matchAll(/>([^<>{}]+)</g)) add(m[1], rel, line);
    });
  }
}

const rows = [...strings.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [text, where] of rows) {
  console.log(`${where[0]}\t${text}`);
}
console.error(`${rows.length} distinct strings`);
