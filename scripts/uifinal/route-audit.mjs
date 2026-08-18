#!/usr/bin/env node
/**
 * Navigation that goes nowhere.
 *
 * A control wired to `router.push('/thing')` looks correct in review and does
 * nothing at runtime if `/thing` is not a route. Expo Router resolves files, so
 * every target can be checked against the tree.
 *
 *   node scripts/uifinal/route-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const APP = 'src/app';

/** Every route the app actually has, as expo-router would resolve it. */
function routes(dir, base = '', out = new Set()) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // (groups) do not appear in the URL
      const seg = /^\(.*\)$/.test(e.name) ? base : `${base}/${e.name}`;
      routes(full, seg, out);
    } else if (/\.tsx$/.test(e.name) && !/^_layout|^\+/.test(e.name)) {
      const name = e.name.replace(/\.tsx$/, '');
      out.add(name === 'index' ? base || '/' : `${base}/${name}`);
    }
  }
  return out;
}

const have = routes(APP);
/** A route with a [param] matches any value in that position. */
const patterns = [...have].map((r) => ({
  route: r,
  re: new RegExp('^' + r.replace(/\[\.\.\.(\w+)\]/g, '.+').replace(/\[(\w+)\]/g, '[^/]+') + '$'),
}));

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files(full, out);
    else if (/\.tsx?$/.test(e.name)) out.push(full);
  }
  return out;
}

const bad = [];
let checked = 0;

for (const file of files('src')) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(/router\.(push|replace|navigate)\(\s*(?:\{\s*pathname:\s*)?['"`]([^'"`]+)['"`]/g)) {
      let target = m[2];
      checked++;
      // strip a query string and any group segments
      target = target.split('?')[0].replace(/\/\([^)]*\)/g, '');
      // a template literal's ${...} stands for a param
      const probe = target.replace(/\$\{[^}]*\}/g, 'X');
      if (!patterns.some((p) => p.re.test(probe))) {
        bad.push({ at: `${path.relative(process.cwd(), file)}:${i + 1}`, target: m[2], line: lines[i].trim().slice(0, 70) });
      }
    }
  }
}

console.log(`navigation calls checked: ${checked}`);
console.log(`routes in the app:        ${have.size}`);
console.log(`targets that resolve to nothing: ${bad.length}`);
for (const b of bad) console.log(`\n   ${b.at}\n   -> ${b.target}\n      ${b.line}`);
