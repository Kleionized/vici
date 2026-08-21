#!/usr/bin/env node
/**
 * Generate the onboarding funnel's data table from the canvas frames.
 *
 * `UI Final 1` reshuffles and re-cuts the funnel: the account moves to the
 * front (`02 · Login`), eleven questions, seven section intros and three of the
 * four lesson interstitials are withdrawn, and eight screens are new. Typing
 * twenty questions, ninety options, their per-option font sizes, their glyph
 * paths and each frame's own night field back out of the canvas by hand would
 * be four hundred numbers copied by eye. This reads them off the frames.
 *
 * Writes `src/content/onboardingFunnel.ts`. Re-runnable: change nothing by hand.
 */
import fs from 'node:fs';

const { frames, source } = JSON.parse(fs.readFileSync('.uifinal1/scenes/Email-Login.json', 'utf8'));
const byLabel = new Map(frames.map((f) => [f.label, f]));
const SVG_KIDS = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'g']);

const num = (v) => (v == null ? undefined : Number(String(v).replace(/px|%/g, '')));
const hex = (r, g, b) => '#' + [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
const rgbHex = (s) => {
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(s ?? '');
  return m ? hex(m[1], m[2], m[3]) : '';
};
const ENT = (s) =>
  s.replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…');

function field(f) {
  const root = f.nodes[0].css;
  const g = /linear-gradient\(180deg,\s*(rgb\([^)]*\)) 0%,\s*(rgb\([^)]*\)) 100%\)/.exec(root.background ?? '');
  const rule = f.nodes.find((n) => n.css && n.css.height === '4px' && n.css.width);
  const sun = f.nodes.find((n) => n.css && n.css.bottom && /radial-gradient/.test(n.css.background ?? ''));
  const sm = sun && /rgba\((\d+),(\d+),(\d+),([\d.]+)\),rgba\(\d+,\d+,\d+,([\d.]+)\)45%/.exec(sun.css.background.replace(/\s+/g, ''));
  return {
    top: rgbHex(g?.[1]),
    bottom: rgbHex(g?.[2]),
    rule: num(rule?.css.width) ?? 0,
    sun: sm ? { size: num(sun.css.width), bottom: num(sun.css.bottom), color: hex(sm[1], sm[2], sm[3]), a0: Number(sm[4]), a45: Number(sm[5]) } : null,
  };
}

/** Every text run inside an element's subtree, joined. */
function ownText(nodes, i) {
  const el = nodes[i];
  const out = [];
  for (let j = i + 1; j < nodes.length; j++) {
    if (nodes[j].tag !== '#text' && nodes[j].d <= el.d) break;
    if (nodes[j].tag === '#text') out.push(nodes[j].text);
  }
  return ENT(out.join(' ').replace(/\s+/g, ' ').trim());
}

/** The 22px glyph inside a grid tile, transcribed child by child. */
function glyphAt(nodes, i) {
  const el = nodes[i];
  let g = -1;
  for (let j = i + 1; j < nodes.length && !(nodes[j].tag !== '#text' && nodes[j].d <= el.d); j++) {
    if (nodes[j].tag === 'svg' && nodes[j].attrs?.width === '22') { g = j; break; }
  }
  if (g < 0) return null;
  const kids = [];
  for (let j = g + 1; j < nodes.length && nodes[j].d > nodes[g].d; j++) {
    if (!SVG_KIDS.has(nodes[j].tag)) continue;
    const a = { ...nodes[j].attrs };
    delete a.style;
    // The canvas hard-codes the tile's ink into the glyph. The tile flips
    // between #131313 on paper and #F4F3F0 on night, so the colour is the
    // tile's, not the glyph's: it is dropped here and applied at render.
    for (const k of ['fill', 'stroke']) if (a[k] && a[k] !== 'none') delete a[k];
    kids.push({ tag: nodes[j].tag, attrs: a });
  }
  return { viewBox: nodes[g].attrs.viewBox, kids };
}

function screen(label) {
  const f = byLabel.get(label);
  if (!f) throw new Error('no frame ' + label);
  const n = f.nodes;
  // Every funnel frame draws its own Back row; `10 · First Principle` puts it
  // 2px lower than the rest, which is exactly the kind of difference the
  // similarity trap hides.
  const backRow = n.find((x) => x.css && x.css.left === '16px' && x.css.display === 'flex' && x.css.gap === '9px');
  const out = { label, field: field(f), backTop: num(backRow?.css?.top) ?? 94, title: null, hint: null, note: null, options: [], cta: null, kind: 'statement' };
  for (let i = 0; i < n.length; i++) {
    const e = n[i];
    if (e.tag === '#text' || !e.css) continue;
    const c = e.css;
    const t = ownText(n, i);
    if (c['font-size'] === '22px' && c['text-align'] === 'center') out.title = { text: t, top: num(c.top), size: 22, lineHeight: 1.32, tracking: 0.1, inset: num(c.left) };
    else if (c['font-size'] === '26px' && c['text-align'] === 'center') out.title = { text: t, top: num(c.top), size: 26, lineHeight: 1.3, tracking: -0.2, inset: num(c.left) };
    else if (c['font-size'] === '13px' && c['text-align'] === 'center' && c['font-weight'] === '500') out.hint = { text: t, top: num(c.top) };
    else if (c['font-size'] === '15.5px' && c['text-align'] === 'center' && num(c.top) > 300) out.note = { text: t, top: num(c.top), size: 15.5, lineHeight: num(c['line-height']), inset: num(c.left) };
    else if (c['font-size'] === '13.5px' && c['text-align'] === 'center') out.note = { text: t, top: num(c.top), size: 13.5, lineHeight: num(c['line-height']), inset: num(c.left) };
    else if (c.height === '60px' && c['border-radius'] === '16px' && c['justify-content'] === 'space-between') {
      const span = n.slice(i + 1).find((x) => x.tag === 'span');
      out.kind = 'list';
      out.options.push({ label: t, size: num(span?.css?.['font-size']) ?? 17, top: num(c.top) });
    } else if (c.height === '94px' && c['border-radius'] === '16px') {
      out.kind = 'grid';
      out.options.push({ label: t, size: 12, glyph: glyphAt(n, i) });
    } else if (c.height === '52px' && c['border-radius'] === '15px') {
      out.kind = 'check';
      out.options.push({ label: t, size: 15.5, top: num(c.top) });
    } else if (c.height === '60px' && c['border-radius'] === '16px') {
      // the typed field: a caret bar and a placeholder, no chevron
      out.kind = 'typed';
      out.fieldTop = num(c.top);
      out.placeholder = t;
    } else if ((c.height === '58px' || c.height === '56px') && /^(28|29)px$/.test(c['border-radius'] ?? '')) {
      const span = n.slice(i + 1).find((x) => x.tag === 'span');
      out.cta = { label: t, top: num(c.top), height: num(c.height), radius: num(c['border-radius']), size: num(span?.css?.['font-size']), tracking: num(span?.css?.['letter-spacing']) ?? 0 };
    }
  }
  // Grid rows are flex rows placed at their own tops; record them.
  if (out.kind === 'grid') out.rowTops = n.filter((x) => x.css && x.css.display === 'flex' && x.css.gap === '10px' && x.css.position === 'absolute').map((x) => num(x.css.top));
  return out;
}

/** id, frame label, canvas note. The order is the canvas's own numbering. */
const FUNNEL = [
  ['name', 'V3 Q24 Name', '03 · Name'],
  ['ageYears', 'V3 Q25 Age', '04 · Age'],
  ['gender', 'V3 Q26 Gender', '05 · Gender'],
  ['start', 'Onboarding Start', '06 · Start'],
  ['freq', 'V3 Q1', '07 · Frequency'],
  ['duration', 'V3 Q2', '08 · Duration'],
  ['control', 'V3 Q3', '09 · Control'],
  ['firstPrinciple', 'First Principle', '10 · First Principle'],
  ['triggers', 'V3 Q5', '11 · Risky Times'],
  ['emotions', 'V3 Q6', '12 · Before the Urge'],
  ['places', 'V3 Q7', '13 · Place'],
  ['before', 'What Happens First', '14 · What Happens First'],
  ['enough', 'We Have Enough', '15 · We Have Enough'],
  ['impact', 'V3 Q21', '16 · Impact'],
  ['affects', 'What It Affects', '17 · What It Affects'],
  ['lonely', 'V3 Q10', '18 · Loneliness'],
  ['alone', 'V3 Q13', '19 · Time Alone'],
  ['goalPorn', 'V3 Q15', '20 · Porn Goal'],
  ['goalMast', 'V3 Q16', '21 · Masturbation'],
  ['tried', 'V3 Q17', '22 · What You Have Tried'],
];

const TYPED = { name: 'text', ageYears: 'number' };
const CARD = new Set(['firstPrinciple']);
const MULTI = new Set(['triggers', 'emotions', 'places', 'before', 'affects', 'tried']);

const steps = FUNNEL.map(([id, label, note]) => {
  const s = screen(label);
  // `...s` last would clobber both `note` (the canvas sticky note) and `kind`.
  return { ...s, id, label, note, kind: TYPED[id] ?? (CARD.has(id) ? 'card' : s.kind), multi: MULTI.has(id), copy: s.note };
});

const glyphs = new Map();
for (const s of steps) for (const o of s.options) if (o.glyph) { if (!glyphs.has(o.label)) glyphs.set(o.label, o.glyph); delete o.glyph; }

const j = (v) => JSON.stringify(v);
const out = [];
out.push(`/**`);
out.push(` * The onboarding funnel, read off the canvas.`);
out.push(` *`);
out.push(` * GENERATED by \`scripts/uifinal1/gen-funnel.mjs\` from`);
out.push(` * \`${source}\`. Do not edit by hand — re-run the generator.`);
out.push(` *`);
out.push(` * Every number here is the frame's own: the night field's two gradient ends,`);
out.push(` * the low sun's box and stops, the progress rule's stated width, each screen's`);
out.push(` * copy and its \`top\`, and every option with the font size the canvas gives it`);
out.push(` * (the long ones drop 17 → 15.5).`);
out.push(` *`);
out.push(` * The rule widths are NOT monotonic in this order, and the fields do not ramp.`);
out.push(` * That is what the canvas draws — see DECISIONS.md D014 for the evidence that`);
out.push(` * each frame kept the value it had before the funnel was reordered, and for why`);
out.push(` * it is implemented as drawn rather than recomputed.`);
out.push(` */`);
out.push('');
out.push('export type FunnelSun = { size: number; bottom: number; color: string; a0: number; a45: number };');
out.push('export type FunnelField = { top: string; bottom: string; rule: number; sun: FunnelSun | null };');
out.push('export type FunnelOption = { label: string; size: number; top?: number };');
out.push('export type FunnelCopy = { text: string; top: number; size?: number; lineHeight?: number; tracking?: number; inset?: number };');
out.push('export type FunnelCta = { label: string; top: number; height: number; radius: number; size: number; tracking: number };');
out.push('export type FunnelStep = {');
out.push('  id: string;');
out.push('  /** the canvas frame this screen is a port of */');
out.push('  label: string;');
out.push("  /** the canvas's own sticky note — its flow number and name */");
out.push('  note: string;');
out.push("  kind: 'text' | 'number' | 'list' | 'grid' | 'check' | 'statement' | 'card';");
out.push('  multi: boolean;');
out.push('  field: FunnelField;');
out.push("  /** The Back row's own top on this frame — 94 everywhere but one. */");
out.push('  backTop: number;');
out.push('  title: FunnelCopy | null;');
out.push('  hint: FunnelCopy | null;');
out.push('  note2: FunnelCopy | null;');
out.push('  options: FunnelOption[];');
out.push('  rowTops?: number[];');
out.push('  fieldTop?: number;');
out.push('  placeholder?: string;');
out.push('  cta: FunnelCta | null;');
out.push('};');
out.push('');
out.push('export const FUNNEL_STEPS: FunnelStep[] = [');
for (const s of steps) {
  const body = {
    id: s.id, label: s.label, note: s.note, kind: s.kind, multi: s.multi,
    field: s.field, backTop: s.backTop, title: s.title, hint: s.hint, note2: s.copy,
    options: s.options, ...(s.rowTops ? { rowTops: s.rowTops } : {}),
    ...(s.fieldTop ? { fieldTop: s.fieldTop } : {}), ...(s.placeholder ? { placeholder: s.placeholder } : {}),
    cta: s.cta,
  };
  out.push('  ' + j(body) + ',');
}
out.push('];');
out.push('');
out.push('/**');
out.push(' * The 22 × 22 glyph each grid tile carries, transcribed child by child.');
out.push(' *');
out.push(" * `fill` and `stroke` are dropped: the canvas bakes the tile's ink into the");
out.push(' * glyph, and the tile flips between #131313 on the selected paper tile and');
out.push(' * #F4F3F0 on the unselected night one, so the colour belongs to the tile.');
out.push(' *');
out.push(' * Note that `What It Affects` reuses `V3 Q5`’s glyphs positionally — its');
out.push(' * "Relationships" tile carries the bed, "Sex or intimacy" the calendar and');
out.push(' * "Self-control" the house. That is what the canvas draws.');
out.push(' */');
out.push('export type FunnelGlyph = { viewBox: string; kids: { tag: string; attrs: Record<string, string> }[] };');
out.push('export const FUNNEL_GLYPHS: Record<string, FunnelGlyph> = {');
for (const [k, v] of glyphs) out.push(`  ${j(k)}: ${j(v)},`);
out.push('};');
out.push('');
fs.writeFileSync('src/content/onboardingFunnel.ts', out.join('\n'));
console.log(`src/content/onboardingFunnel.ts — ${steps.length} steps, ${glyphs.size} glyphs`);
