#!/usr/bin/env node
/**
 * Generate the onboarding questionnaire's data from the `Vici Overhaul` frames.
 *
 * Forked from `scripts/vicifull/gen-funnel.mjs` and repointed at this drop
 * (`.overhaul/scenes/Email-Login.json`). The overhaul rebuilds every screen of
 * the funnel on two templates — a question (nav with eight dashes, a
 * left-aligned 26px title, an optional sub line, a spacer, then options,
 * chips, the name field or the age wheel, an optional spot illustration and
 * primary) and a statement (hero at 190, a centred title and paragraph at 451,
 * primary) — so the old generator's CSS patterns (22px centred titles, 60px
 * ringed rows, 94px glyph tiles, radial suns) match nothing here. What each
 * frame states is read off it below; the constants of the two templates live
 * in `src/components/onboarding/funnel.tsx`.
 *
 * The previous drop's `FUNNEL_GLYPHS` (the glyph-grid tiles) has no source in
 * this one and no consumer left (the tail's `planSignals()` filters on the
 * `11 · When` labels now), so it is no longer emitted.
 *
 * Writes `src/content/onboardingFunnel.ts`. Re-runnable: change nothing by hand.
 *
 *   node scripts/overhaul/gen-funnel.mjs [--out=<path>]   (a dry run elsewhere)
 */
import fs from 'node:fs';

const { frames, source } = JSON.parse(fs.readFileSync('.overhaul/scenes/Email-Login.json', 'utf8'));
const byLabel = new Map(frames.map((f) => [f.label, f]));
const HERO_IDS = new Set(
  [...fs.readFileSync('src/content/heroes.ts', 'utf8').matchAll(/^  '([A-Za-z0-9]+)',$/gm)].map((m) => m[1]),
);

const INK = '#F2F0EC';
const num = (v) => (v == null ? undefined : Number(String(v).replace(/px|%/g, '')));
const ENT = (s) =>
  s.replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…');

/** The index one past the last descendant of `i`. */
function endOf(nodes, i) {
  const d = nodes[i].d;
  let j = i + 1;
  while (j < nodes.length && nodes[j].d > d) j++;
  return j;
}
/** The direct element children of `i`. */
function kids(nodes, i) {
  const out = [];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) if (nodes[j].d === nodes[i].d + 1 && nodes[j].tag !== '#text') out.push(j);
  return out;
}
/** Every text run inside an element's subtree, joined as inline HTML would (the scene trims each run). */
function ownText(nodes, i) {
  const out = [];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) if (nodes[j].tag === '#text') out.push(nodes[j].text);
  return ENT(out.join(' ').replace(/\s+/g, ' ').trim());
}
/**
 * A paragraph's runs: its own text and every `font-weight:700` span, in order.
 * The scene trims each text node, and in the frames each bold span follows a
 * space ("…trying to stop. <span>Porn is.</span>"), so a run that is followed
 * by another gets its space back.
 */
function runs(nodes, i) {
  const out = [];
  for (let j = i + 1, e = endOf(nodes, i); j < e; j++) {
    if (nodes[j].tag !== '#text') continue;
    const parent = nodes.slice(0, j).reverse().find((x) => x.d === nodes[j].d - 1);
    const bold = parent !== nodes[i] && parent?.css?.['font-weight'] === '700';
    out.push({ text: ENT(String(nodes[j].text).replace(/\s+/g, ' ').trim()), ...(bold ? { bold: true } : {}) });
  }
  return out.map((r, k) => (k < out.length - 1 ? { ...r, text: r.text + ' ' } : r));
}

function screen(label) {
  const f = byLabel.get(label);
  if (!f) throw new Error('no frame ' + label);
  const n = f.nodes;
  const out = { dashes: null, stack: null, kind: null, title: null, sub: null, spacer: null, body: null, card: null, options: [], drawnSelected: [], hero: null, cta: null };

  // nav: `top 60, height 40`, the dash row in its middle (Start draws the back chevron only)
  const nav = n.findIndex((x) => x.d === 1 && x.css?.top === '60px' && x.css?.height === '40px');
  if (nav < 0) throw new Error(label + ': no nav row');
  for (const k of kids(n, nav)) {
    if (n[k].css?.display === 'flex' && n[k].css?.gap === '6px') {
      const dashes = kids(n, k).filter((d) => n[d].css?.width === '24px' && n[d].css?.height === '2px');
      if (dashes.length !== 8) throw new Error(label + ': ' + dashes.length + ' dashes');
      out.dashes = dashes.filter((d) => n[d].css.background === INK).length;
    }
  }

  // the spot illustration — the card's own `data-hero`, its top and its scale
  const svg = n.findIndex((x) => x.d === 1 && x.tag === 'svg' && x.attrs?.['data-hero']);
  if (svg >= 0) {
    const id = n[svg].attrs['data-hero'];
    if (!HERO_IDS.has(id)) throw new Error(label + ': unknown hero ' + id);
    const scale = /scale\(([\d.]+)\)/.exec(n[svg].css.transform ?? '');
    if (n[svg].css['transform-origin'] !== '196px 190px') throw new Error(label + ': hero origin ' + n[svg].css['transform-origin']);
    out.hero = { id, top: num(n[svg].css.top), scale: scale ? Number(scale[1]) : 1 };
  }

  // the primary pill, anchored `bottom 48`
  const cta = n.findIndex((x) => x.d === 1 && x.css?.bottom === '48px' && x.css?.height === '58px');
  if (cta >= 0) out.cta = ownText(n, cta);

  // Age's wheel: a full-width column at 236 of five numbers and two rules
  const wheel = n.findIndex((x) => x.d === 1 && x.css?.top === '236px' && x.css?.['flex-direction'] === 'column');
  if (wheel >= 0) {
    const rows = kids(n, wheel).filter((k) => n[k].css?.['font-size']);
    const values = rows.map((k) => Number(ownText(n, k)));
    out.kind = 'wheel';
    out.wheel = { values, selected: rows.findIndex((k) => n[k].css['font-size'] === '72px') };
  }

  // the stack: `left 24, right 24`, a column
  const stack = n.findIndex((x) => x.d === 1 && x.css?.left === '24px' && x.css?.right === '24px' && x.css?.['flex-direction'] === 'column' && x.css?.top);
  if (stack < 0) throw new Error(label + ': no stack');
  const sc = n[stack].css;
  out.stack = { top: num(sc.top), gap: num(sc.gap), center: sc['align-items'] === 'center' };
  if (out.stack.center) out.kind = 'statement';

  for (const k of kids(n, stack)) {
    const c = n[k].css ?? {};
    if (c['font-size'] === '26px') out.title = ownText(n, k);
    else if (c['font-size'] === '15px' && c['line-height'] === '22px') out.sub = ownText(n, k);
    else if (c['font-size'] === '15px' && c['line-height'] === '24px') out.body = ownText(n, k);
    else if (c.padding === '18px 22px' && c.background === '#1E1E1E') {
      if (c['margin-top'] !== '14px') throw new Error(label + ': card margin ' + c['margin-top']);
      out.card = runs(n, k);
    } else if (c.height === '60px' && c['border-radius'] === '18px') {
      out.kind = 'text';
      out.placeholder = ownText(n, k);
    } else if (c.height && Object.keys(c).length === 1) out.spacer = num(c.height);
    else if (c['flex-direction'] === 'column' && c.gap === '12px') {
      out.kind = 'list';
      kids(n, k).forEach((r, i) => {
        if (n[r].css.height !== '58px' || n[r].css['border-radius'] !== '18px') throw new Error(label + ': option row ' + JSON.stringify(n[r].css));
        out.options.push(ownText(n, r));
        if (n[r].css.background === INK) out.drawnSelected.push(i);
      });
    } else if (c['flex-wrap'] === 'wrap' && c.gap === '12px') {
      out.kind = 'chips';
      kids(n, k).forEach((r, i) => {
        if (n[r].css.height !== '48px' || n[r].css['border-radius'] !== '24px') throw new Error(label + ': chip ' + JSON.stringify(n[r].css));
        out.options.push(ownText(n, r));
        if (n[r].css.background === INK) out.drawnSelected.push(i);
      });
    } else throw new Error(label + ': unread stack child ' + JSON.stringify(c));
  }
  return out;
}

/**
 * id, frame label, canvas sticky note. The ids are the answer keys every later
 * screen reads, so they are unchanged from the previous drop; the order is the
 * canvas's own numbering.
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

const steps = FUNNEL.map(([id, label, note]) => {
  const s = screen(label);
  if (!s.title) throw new Error(label + ': no title');
  if ((s.kind === 'list' || s.kind === 'chips') && !s.options.length) throw new Error(label + ': no options');
  if (!s.kind) throw new Error(label + ': no kind');
  if (s.dashes == null && id !== 'start') throw new Error(label + ': no dashes');
  return { id, label, note, multi: s.kind === 'chips', ...s };
});

const j = (v) => JSON.stringify(v);
const out = [];
out.push(`/**`);
out.push(` * The onboarding questionnaire, read off the canvas.`);
out.push(` *`);
out.push(` * GENERATED FILE — do not edit by hand. \`scripts/overhaul/gen-funnel.mjs\` reads`);
out.push(` * \`${source}\` (via \`.overhaul/scenes/Email-Login.json\`) and writes this; the next`);
out.push(` * run reverts anything typed in here.`);
out.push(` *`);
out.push(` * Each step carries what its frame states and nothing the two templates fix:`);
out.push(` * the nav's inked dashes, the stack's top / gap / centring, the copy, the`);
out.push(` * spacer, the answers (with the ones the frame draws chosen, for recipes and`);
out.push(` * checks only — never read at runtime), the spot illustration's card id, top`);
out.push(` * and scale, and the primary's label (none on the single-select screens,`);
out.push(` * which turn themselves over).`);
out.push(` */`);
out.push('');
out.push("import type { HeroId } from './heroes';");
out.push('');
out.push('/** A run of a paragraph: the frames set the closing words of a line in 700 ink. */');
out.push('export type FunnelRun = { text: string; bold?: boolean };');
out.push('export type FunnelHero = { id: HeroId; top: number; scale: number };');
out.push('export type FunnelStep = {');
out.push('  id: string;');
out.push('  /** the canvas frame this screen is a port of */');
out.push('  label: string;');
out.push("  /** the canvas's own sticky note — its flow number and name */");
out.push('  note: string;');
out.push('  /** `text` the name field, `wheel` the age picker, `list` single-select rows, `chips` multi-select, `statement` the centred board */');
out.push("  kind: 'text' | 'wheel' | 'list' | 'chips' | 'statement';");
out.push('  multi: boolean;');
out.push('  /** inked dashes of the eight in the nav row; `null` where the frame draws no dash row (Start) */');
out.push('  dashes: number | null;');
out.push('  /** the content column: `left 24, right 24`, its canvas top and gap, centred on the statement boards */');
out.push('  stack: { top: number; gap: number; center: boolean };');
out.push('  title: string;');
out.push('  /** the 15/22 mute line under a question ("Select all that apply") */');
out.push('  sub: string | null;');
out.push('  /** the bare spacer div before the answers (10 after a sub, 18 without) */');
out.push('  spacer: number | null;');
out.push("  /** a statement board's 15/24 paragraph */");
out.push('  body: string | null;');
out.push("  /** Goal confirmation's card, as runs */");
out.push('  card: FunnelRun[] | null;');
out.push('  placeholder?: string;');
out.push('  /** Age: the five numbers the frame draws and which is chosen (reference only) */');
out.push('  wheel?: { values: number[]; selected: number };');
out.push('  options: string[];');
out.push('  /** the answers the frame draws chosen — recipes and checks only */');
out.push('  drawnSelected: number[];');
out.push('  hero: FunnelHero | null;');
out.push('  cta: string | null;');
out.push('  /**');
out.push("   * @deprecated The previous drop's Back-row top. Every overhaul frame puts the nav row at 60;");
out.push("   * kept (= 60) only because `welcome.tsx` still passes it to `O3Shell`, which ignores it.");
out.push('   */');
out.push('  backTop: number;');
out.push('};');
out.push('');
out.push('export const FUNNEL_STEPS: FunnelStep[] = [');
for (const s of steps) {
  const body = {
    id: s.id, label: s.label, note: s.note, kind: s.kind, multi: s.multi, dashes: s.dashes, stack: s.stack,
    title: s.title, sub: s.sub, spacer: s.spacer, body: s.body, card: s.card,
    ...(s.placeholder ? { placeholder: s.placeholder } : {}), ...(s.wheel ? { wheel: s.wheel } : {}),
    options: s.options, drawnSelected: s.drawnSelected, hero: s.hero, cta: s.cta, backTop: 60,
  };
  out.push('  ' + j(body) + ',');
}
out.push('];');
out.push('');
const OUT = (process.argv.find((a) => a.startsWith('--out=')) ?? '--out=src/content/onboardingFunnel.ts').slice(6);
fs.writeFileSync(OUT, out.join('\n'));
console.log(
  `${OUT} — ${steps.length} steps (${['text', 'wheel', 'list', 'chips', 'statement'].map((k) => `${steps.filter((s) => s.kind === k).length} ${k}`).join(', ')}), ` +
    `${steps.filter((s) => s.hero).length} heroes`,
);
