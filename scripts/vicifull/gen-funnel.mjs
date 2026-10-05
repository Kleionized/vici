#!/usr/bin/env node
/**
 * Generate the onboarding funnel's data table from the canvas frames.
 *
 * Forked from `scripts/uifinal1/gen-funnel.mjs` and repointed at this drop
 * (`.vicifull/scenes/Email-Login.json`). `Latest Vici FULL` re-cuts the funnel
 * again: three screens are withdrawn (`What Happens First`, `We Have Enough`,
 * `What It Affects`), five are new (`V3 Q3b`, `What starts it`, `Transition`,
 * `What it affects`, `Goal Confirmation`), most of the copy is rewritten, and —
 * the big one — nine of the question boards gained a bespoke header drawing and
 * every answer row on them gained its own 30 x 30 mark. All of that is read off
 * the frames here rather than typed.
 *
 * Writes `src/content/onboardingFunnel.ts`. Re-runnable: change nothing by hand.
 */
import fs from 'node:fs';

const { frames, source } = JSON.parse(fs.readFileSync('.vicifull/scenes/Email-Login.json', 'utf8'));
const byLabel = new Map(frames.map((f) => [f.label, f]));
const SVG_KIDS = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'g', 'text', 'defs', 'lineargradient', 'radialgradient', 'stop']);

const num = (v) => (v == null ? undefined : Number(String(v).replace(/px|%/g, '')));
const hex = (r, g, b) => '#' + [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
const rgbHex = (s) => {
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(s ?? '');
  return m ? hex(m[1], m[2], m[3]) : '';
};
const ENT = (s) =>
  s.replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…');

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
    // `16 · Impact` draws no low sun at all — the only funnel frame that does not.
    sun: sm ? { size: num(sun.css.width), bottom: num(sun.css.bottom), color: hex(sm[1], sm[2], sm[3]), a0: Number(sm[4]), a45: Number(sm[5]) } : null,
  };
}

/** The index one past the last descendant of `i`. */
function endOf(nodes, i) {
  const d = nodes[i].d;
  let j = i + 1;
  while (j < nodes.length && nodes[j].d > d) j++;
  return j;
}

/** Every text run inside an element's subtree, joined. */
function ownText(nodes, i) {
  const out = [];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) if (nodes[j].tag === '#text') out.push(nodes[j].text);
  return ENT(out.join(' ').replace(/\s+/g, ' ').trim());
}

/** The same text, but split where the canvas puts an explicit `<br>`. */
function ownLines(nodes, i) {
  const lines = [''];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) {
    if (nodes[j].tag === 'br') lines.push('');
    else if (nodes[j].tag === '#text') lines[lines.length - 1] += (lines[lines.length - 1] ? ' ' : '') + nodes[j].text;
  }
  return lines.map((s) => ENT(s.replace(/\s+/g, ' ').trim())).filter(Boolean);
}

/** One SVG element's children, as a tree, verbatim but for `style`. */
function svgKids(nodes, i) {
  const root = [];
  const stack = [{ d: nodes[i].d, kids: root, el: null }];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) {
    const n = nodes[j];
    while (stack.length > 1 && n.d <= stack[stack.length - 1].d) stack.pop();
    if (n.tag === '#text') {
      // `<text>` is the only SVG element in the bundle that carries a run; it
      // is the frame on top of the stack, not its last child.
      const holder = stack[stack.length - 1];
      if (holder.el) holder.el.text = ENT(String(n.text).trim());
      continue;
    }
    if (!SVG_KIDS.has(n.tag)) continue;
    const a = { ...n.attrs };
    delete a.style;
    const kid = { tag: n.tag, attrs: a };
    stack[stack.length - 1].kids.push(kid);
    stack.push({ d: n.d, kids: (kid.kids = []), el: kid });
  }
  const prune = (ks) => { for (const k of ks) { if (k.kids && !k.kids.length) delete k.kids; else if (k.kids) prune(k.kids); } };
  prune(root);
  return root;
}

/**
 * A row mark is drawn in the tile's ink, and a selected tile flips from night
 * to paper. The frame draws exactly one row selected, so its mark comes out in
 * `#131313`; both are normalised to the night reading here and `O3FunnelStep`
 * swaps the pair back when the row is chosen.
 */
const NIGHTEN = [['#131313', '#F4F3F0'], ['rgba(19,19,19,0.14)', 'rgba(244,243,240,0.18)']];
function nighten(kids) {
  for (const k of kids) {
    for (const key of Object.keys(k.attrs)) {
      for (const [ink, night] of NIGHTEN) if (k.attrs[key] === ink) k.attrs[key] = night;
    }
    if (k.kids) nighten(k.kids);
  }
  return kids;
}

/** The first `<svg>` of a given width inside an element's subtree. */
function svgAt(nodes, i, width) {
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) {
    if (nodes[j].tag === 'svg' && nodes[j].attrs?.width === width) return j;
  }
  return -1;
}

function glyphAt(nodes, i) {
  const g = svgAt(nodes, i, '22');
  if (g < 0) return null;
  const kids = svgKids(nodes, g);
  // The canvas hard-codes the tile's ink into the glyph. The tile flips between
  // #131313 on paper and #F4F3F0 on night, so the colour is the tile's, not the
  // glyph's: it is dropped here and applied at render.
  const strip = (ks) => { for (const k of ks) { for (const key of ['fill', 'stroke']) if (k.attrs[key] && k.attrs[key] !== 'none') delete k.attrs[key]; if (k.kids) strip(k.kids); } };
  strip(kids);
  return { viewBox: nodes[g].attrs.viewBox, kids };
}

/**
 * The header drawing nine question boards now carry: a blurred bloom behind a
 * centred SVG, inside a full-width block the frame tops and heights itself.
 *
 * `10 · First principle` draws its stage differently — two washes and an
 * absolutely-placed SVG, not a centred flex row — so it is not matched here and
 * stays hand-built in `v3.tsx`.
 */
function artAt(nodes, i) {
  const e = endOf(nodes, i);
  let bloom = null;
  let stage = -1;
  for (let j = i + 1; j < e; j++) {
    const c = nodes[j].css;
    if (!c) continue;
    if (nodes[j].tag === 'div' && /radial-gradient/.test(c.background ?? '')) {
      const m = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/.exec(c.background);
      bloom = { w: num(c.width), h: num(c.height), color: hex(m[1], m[2], m[3]), a0: Number(m[4]) };
    }
    if (nodes[j].tag === 'div' && c.position === 'relative' && c['justify-content'] === 'center') stage = j;
  }
  if (stage < 0) return null;
  const s = svgAt(nodes, stage, undefined) < 0 ? -1 : 0;
  let svg = -1;
  for (let j = stage + 1, se = endOf(nodes, stage); j < se; j++) if (nodes[j].tag === 'svg') { svg = j; break; }
  if (svg < 0) return null;
  void s;
  return {
    top: num(nodes[i].css.top),
    height: num(nodes[i].css.height),
    bloom,
    w: Number(nodes[svg].attrs.width),
    h: Number(nodes[svg].attrs.height),
    viewBox: nodes[svg].attrs.viewBox,
    kids: svgKids(nodes, svg),
  };
}

function screen(label) {
  const f = byLabel.get(label);
  if (!f) throw new Error('no frame ' + label);
  const n = f.nodes;
  // Every funnel frame draws its own Back row; `10 · First principle` puts it
  // 2px lower than the rest, which is exactly the kind of difference the
  // similarity trap hides.
  const backRow = n.find((x) => x.css && x.css.left === '16px' && x.css.display === 'flex' && x.css.gap === '9px');
  const out = { label, field: field(f), backTop: num(backRow?.css?.top) ?? 94, title: null, hint: null, note: null, fine: null, art: null, options: [], cta: null, kind: 'statement' };
  for (let i = 0; i < n.length; i++) {
    const e = n[i];
    if (e.tag === '#text' || !e.css) continue;
    const c = e.css;
    const t = ownText(n, i);
    if (c['font-size'] === '22px' && c['text-align'] === 'center') out.title = { text: t, top: num(c.top), size: 22, lineHeight: 1.32, tracking: 0.1, inset: num(c.left), wrap: c['text-wrap'] };
    else if (c['font-size'] === '26px' && c['text-align'] === 'center') out.title = { text: t, top: num(c.top), size: 26, lineHeight: 1.3, tracking: -0.2, inset: num(c.left), wrap: c['text-wrap'] };
    else if (c['font-size'] === '13px' && c['text-align'] === 'center' && c['font-weight'] === '500') out.hint = { text: t, top: num(c.top) };
    else if (c['font-size'] === '15.5px' && c['text-align'] === 'center' && num(c.top) > 300) out.note = { text: t, top: num(c.top), size: 15.5, lineHeight: num(c['line-height']), inset: num(c.left), wrap: c['text-wrap'] };
    else if (c['font-size'] === '13.5px' && c['text-align'] === 'center') out.note = { text: t, top: num(c.top), size: 13.5, lineHeight: num(c['line-height']), inset: num(c.left), wrap: c['text-wrap'] };
    // `23 · Goal confirmation` adds a third, quieter line under the note.
    else if (c['font-size'] === '14.5px' && c['text-align'] === 'center') out.fine = { text: t, top: num(c.top), size: 14.5, lineHeight: num(c['line-height']), inset: num(c.left), wrap: c['text-wrap'] };
    else if (c.height === '60px' && c['border-radius'] === '16px' && c['justify-content'] === 'space-between') {
      const si = i + 1 + n.slice(i + 1, endOf(n, i)).findIndex((x) => x.tag === 'span');
      const mark = svgAt(n, i, '30');
      out.kind = 'list';
      out.options.push({
        label: ownText(n, si), size: num(n[si]?.css?.['font-size']) ?? 17, top: num(c.top),
        // The boards that gained a mark also stretched their label to fill the
        // row; `05 · Gender`, which gained neither, still lets the span take
        // its own words' width.
        ...(n[si]?.css?.flex === '1' ? { flex1: true } : {}),
        ...(mark < 0 ? {} : { mark: { size: 30, viewBox: n[mark].attrs.viewBox, kids: nighten(svgKids(n, mark)) } }),
      });
    } else if (c.height === '94px' && c['border-radius'] === '16px') {
      const si = i + 1 + n.slice(i + 1, endOf(n, i)).findIndex((x) => x.tag === 'span');
      const lines = ownLines(n, si);
      out.kind = 'grid';
      out.options.push({
        label: ownText(n, si), size: 12, glyph: glyphAt(n, i),
        ...(lines.length > 1 ? { lines } : {}),
        ...(n[si]?.css?.['max-width'] ? { maxWidth: num(n[si].css['max-width']) } : {}),
      });
    } else if (c.height === '52px' && c['border-radius'] === '15px') {
      const si = i + 1 + n.slice(i + 1, endOf(n, i)).findIndex((x) => x.tag === 'span');
      const mark = svgAt(n, i, '26');
      out.kind = 'check';
      out.options.push({
        label: ownText(n, si), size: 15.5, top: num(c.top),
        ...(mark < 0 ? {} : { mark: { size: 26, viewBox: n[mark].attrs.viewBox, kids: svgKids(n, mark) } }),
      });
    } else if (c.height === '60px' && c['border-radius'] === '16px') {
      // the typed field: a caret bar and a placeholder, no chevron
      out.kind = 'typed';
      out.fieldTop = num(c.top);
      out.placeholder = t;
    } else if ((c.height === '58px' || c.height === '56px') && /^(28|29)px$/.test(c['border-radius'] ?? '')) {
      const si = i + 1 + n.slice(i + 1, endOf(n, i)).findIndex((x) => x.tag === 'span');
      out.cta = { label: t, top: num(c.top), height: num(c.height), radius: num(c['border-radius']), size: num(n[si]?.css?.['font-size']), tracking: num(n[si]?.css?.['letter-spacing']) ?? 0 };
    } else if (c.left === '0' && c.right === '0' && c.height && !c['font-size'] && !c.display) {
      const a = artAt(n, i);
      if (a) out.art = a;
    }
  }
  // Grid rows are flex rows placed at their own tops; record them.
  if (out.kind === 'grid') out.rowTops = n.filter((x) => x.css && x.css.display === 'flex' && x.css.gap === '10px' && x.css.position === 'absolute').map((x) => num(x.css.top));
  return out;
}

/**
 * id, frame label, canvas sticky note. The order is the canvas's own numbering
 * (`node scripts/vicifull/notes.mjs Email-Login`), which is the flow's
 * authority: `09B` is new behind `09A`, `14`/`15` land between the place board
 * and the impact question, `17` replaces the withdrawn `What It Affects`, and
 * `23` closes the questionnaire before the plan is built.
 */
const FUNNEL = [
  ['name', 'V3 Q24 Name', '03 · Name'],
  ['ageYears', 'V3 Q25 Age', '04 · Age'],
  ['gender', 'V3 Q26 Gender', '05 · Gender'],
  ['start', 'Onboarding Start', '06 · Start'],
  ['freq', 'V3 Q1', '07 · Frequency'],
  ['duration', 'V3 Q2', '08 · How long'],
  ['quitAttempts', 'V3 Q3', '09A · Previous quit attempts'],
  ['relapseSpan', 'V3 Q3b', '09B · Relapse'],
  ['firstPrinciple', 'First Principle', '10 · First principle'],
  ['triggers', 'V3 Q5', '11 · When'],
  ['emotions', 'V3 Q6', '12 · Beforehand'],
  ['places', 'V3 Q7', '13 · Place'],
  ['before', 'What starts it', '14 · What starts it'],
  ['transition', 'Transition', '15 · Transition'],
  ['impact', 'V3 Q21', '16 · Impact'],
  ['affects', 'What it affects', '17 · What it affects'],
  ['lonely', 'V3 Q10', '18 · Loneliness'],
  ['alone', 'V3 Q13', '19 · Time alone'],
  ['goalPorn', 'V3 Q15', '20 · Goal'],
  ['goalMast', 'V3 Q16', '21 · Masturbation goal'],
  ['tried', 'V3 Q17', '22 · What you’ve tried'],
  ['goalConfirm', 'Goal Confirmation', '23 · Goal confirmation'],
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
out.push(` * GENERATED FILE — do not edit by hand. \`scripts/vicifull/gen-funnel.mjs\` reads`);
out.push(` * \`${source}\` and writes this; the next run reverts anything typed in here.`);
out.push(` *`);
out.push(` * Every number is the frame's own: the night field's two gradient ends, the low`);
out.push(` * sun's box and stops, the progress rule's stated width, each screen's copy and`);
out.push(` * its \`top\`, every option with the font size the canvas gives it, the header`);
out.push(` * drawing nine of the boards now carry, and each answer row's own 30 x 30 mark.`);
out.push(` *`);
out.push(` * The rule widths are NOT monotonic in this order, and the fields do not ramp.`);
out.push(` * That is what the canvas draws — see DECISIONS.md D014 for the evidence that`);
out.push(` * each frame kept the value it had when the funnel was reordered, and for why`);
out.push(` * it is implemented as drawn rather than recomputed.`);
out.push(` */`);
out.push('');
out.push('export type FunnelSun = { size: number; bottom: number; color: string; a0: number; a45: number };');
out.push('export type FunnelField = { top: string; bottom: string; rule: number; sun: FunnelSun | null };');
out.push("/** One SVG element off the canvas, attributes verbatim. */");
out.push('export type FunnelSvgKid = { tag: string; attrs: Record<string, string>; text?: string; kids?: FunnelSvgKid[] };');
out.push("/** The 30 x 30 gauge (or 26 x 26 glyph) a row carries, in the night ink. */");
out.push('export type FunnelMark = { size: number; viewBox: string; kids: FunnelSvgKid[] };');
out.push("/** A board's header drawing: a blurred bloom, then a centred SVG. */");
out.push('export type FunnelArt = {');
out.push('  top: number;');
out.push('  height: number;');
out.push('  bloom: { w: number; h: number; color: string; a0: number } | null;');
out.push('  w: number;');
out.push('  h: number;');
out.push('  viewBox: string;');
out.push('  kids: FunnelSvgKid[];');
out.push('};');
out.push('export type FunnelOption = { label: string; size: number; top?: number; flex1?: boolean; lines?: string[]; maxWidth?: number; mark?: FunnelMark };');
out.push("/** `wrap` is the frame's own `text-wrap` — `balance` on the three statement");
out.push(' * boards, `pretty` on everything else. */');
out.push("export type FunnelCopy = { text: string; top: number; size?: number; lineHeight?: number; tracking?: number; inset?: number; wrap?: 'balance' | 'pretty' };");
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
out.push("  /** `23 · Goal confirmation`'s quieter third line. */");
out.push('  fine: FunnelCopy | null;');
out.push('  art: FunnelArt | null;');
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
    field: s.field, backTop: s.backTop, title: s.title, hint: s.hint, note2: s.copy, fine: s.fine,
    art: s.art, options: s.options, ...(s.rowTops ? { rowTops: s.rowTops } : {}),
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
out.push(' * Note that `17 · What it affects` reuses `11 · When`’s glyphs positionally —');
out.push(' * its "Relationships" tile carries the bed, "Sex or intimacy" the calendar and');
out.push(' * "Feeling in control" the house. That is what the canvas draws.');
out.push(' */');
out.push('export type FunnelGlyph = { viewBox: string; kids: FunnelSvgKid[] };');
out.push('export const FUNNEL_GLYPHS: Record<string, FunnelGlyph> = {');
for (const [k, v] of glyphs) out.push(`  ${j(k)}: ${j(v)},`);
out.push('};');
out.push('');
fs.writeFileSync('src/content/onboardingFunnel.ts', out.join('\n'));
console.log(`src/content/onboardingFunnel.ts — ${steps.length} steps, ${glyphs.size} glyphs, ${steps.filter((s) => s.art).length} header drawings`);
