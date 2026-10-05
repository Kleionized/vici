#!/usr/bin/env node
/**
 * Migration lint for the overhaul: what in src/ still speaks the old system.
 *
 *   node scripts/overhaul/lint-mono.mjs [--files] [path ...]
 *
 * Counts, per file: raw `fontWeight` other than 'normal' (synthesises a second
 * bold over a Lato family on web, and is ignored on native), the system/serif
 * font names the old drops used, `StatusBar style="dark"` (dark glyphs on the
 * #0D0D0D ground), `fontStyle: 'italic'` (slants the italic family twice), and
 * hex colours that are not in the canvas's palette. A file is "clean" when all
 * counts are zero; colours outside the palette are listed so a judgement call
 * (a medallion's metal, a chart tint the canvas draws) can be told from a leftover.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const showFiles = args.includes('--files');
const roots = args.filter((a) => !a.startsWith('--'));
const PALETTE = new Set(['#0D0D0D', '#1E1E1E', '#2E2E2E', '#5A574F', '#F2F0EC', '#B5B0A8', '#9B968E', '#111111', '#FFFFFF', '#000000']);
// colours the frames themselves draw beyond the kit palette are added here as the
// design-system extraction finds them
const extra = fs.existsSync('.overhaul/understand/tokens.json') ? JSON.parse(fs.readFileSync('.overhaul/understand/tokens.json', 'utf8')) : null;
// every hex the frames draw (tokens.json `color`, nested: dark frame, tone ramp, illustration palette …)
const walkColors = (o) => { if (typeof o === 'string') { for (const m of o.matchAll(/#[0-9A-Fa-f]{6}\b/g)) PALETTE.add(m[0].toUpperCase()); } else if (o && typeof o === 'object') Object.values(o).forEach(walkColors); };
if (extra?.color) walkColors(extra.color);

const files = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const st = fs.statSync(p); if (st.isDirectory()) walk(p); else if (/\.(tsx?|jsx?)$/.test(f)) files.push(p); } };
for (const r of roots.length ? roots : ['src']) fs.statSync(r).isDirectory() ? walk(r) : files.push(r);

const rows = [];
const tot = { fontWeight: 0, oldFont: 0, statusDark: 0, italic: 0, offPalette: 0 };
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (/GENERATED FILE/.test(s.slice(0, 400)) && !args.includes('--generated')) continue;
  const c = {
    fontWeight: (s.match(/fontWeight:\s*['"](?!normal)[^'"]+['"]/g) || []).length + (s.match(/fontWeight:\s*[0-9]/g) || []).length,
    oldFont: (s.match(/'System'|Georgia|Snell Roundhand|-apple-system|SF Pro|Newsreader|Fraunces|HankenGrotesk|EBGaramond/g) || []).length,
    statusDark: (s.match(/StatusBar style="dark"/g) || []).length,
    italic: (s.match(/fontStyle:\s*['"]italic['"]/g) || []).length,
    offPalette: 0,
  };
  const off = new Map();
  for (const m of s.matchAll(/#[0-9A-Fa-f]{6}\b/g)) { const h = m[0].toUpperCase(); if (!PALETTE.has(h)) { off.set(h, (off.get(h) || 0) + 1); c.offPalette++; } }
  for (const k of Object.keys(tot)) tot[k] += c[k];
  if (Object.values(c).some(Boolean)) rows.push({ f, c, off });
}
rows.sort((a, b) => Object.values(b.c).reduce((x, y) => x + y) - Object.values(a.c).reduce((x, y) => x + y));
if (showFiles) for (const r of rows) console.log(`${r.f}  fw=${r.c.fontWeight} font=${r.c.oldFont} status=${r.c.statusDark} ital=${r.c.italic} hex=${r.c.offPalette}${r.off.size ? '  [' + [...r.off].slice(0, 8).map(([h, n]) => `${h}×${n}`).join(' ') + ']' : ''}`);
console.log(`files scanned ${files.length}, with findings ${rows.length} — fontWeight ${tot.fontWeight}, old font names ${tot.oldFont}, StatusBar dark ${tot.statusDark}, italic ${tot.italic}, off-palette hex ${tot.offPalette}`);
