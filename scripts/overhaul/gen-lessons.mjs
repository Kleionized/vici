#!/usr/bin/env node
/**
 * The 84 lesson readers — `src/content/lessons.ts` — read straight out of the
 * 1,273 split Week frames (`.overhaul/final/Week-XX-…/L<n>-Frame-<k>.html`).
 *
 *   node scripts/overhaul/gen-lessons.mjs            write src/content/lessons.ts
 *   node scripts/overhaul/gen-lessons.mjs --check    compare with the file on disk, write nothing
 *
 * Pages are the frames 1:1 (the designer paginated with a cost-minimising DP
 * over measured line counts — `gen/lesson-v3.js paginate()` — so the app never
 * re-paginates). Every frame must decompose into the reader grammar of
 * lessons.md §3 with no residue; an unknown atom, a chrome that differs from
 * the shared one, a progress percent that is not `round(k / N × 100)` or a
 * vertical gap that is not one of the grammar's stops fails the run.
 *
 * The frames win, and they are then checked against the bundle's own clean
 * course, `Vici Overhaul/project/gen/lessons-v3.json`: titles, both quotes,
 * section titles, every reading piece in order, every visualisation payload,
 * questions, answers, practice pieces, "Done when" lines and the complete
 * line must all be equal (84 / 84) or the run fails. The only bundle data the
 * frames contradict is `gen/lesson-pool.json` (two mid-lesson illustrations,
 * L52 F8 and L68 F7) — the frames' `data-hero` is what is emitted.
 *
 * `BREAKS` is Chrome's own line breaks (`text-wrap: balance | pretty`) for the
 * runs whose breaks differ from greedy wrapping at the canvas width, measured
 * in the design server (`scripts/overhaul/lesson-breaks.json`, from
 * `.overhaul/understand/scratch-lessons/measure*.mjs`). Native has no
 * `text-wrap`; D332 gives fixed copy its breaks there and lets lesson body
 * wrap greedily, so body runs are left out.
 */
import fs from 'node:fs';
import path from 'node:path';

import { parse } from './decl.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const FINAL = path.join(ROOT, '.overhaul/final');
const OUT = path.join(ROOT, 'src/content/lessons.ts');
const V3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'Vici Overhaul/project/gen/lessons-v3.json'), 'utf8'));
const BREAKS_IN = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/overhaul/lesson-breaks.json'), 'utf8'));
const CHECK = process.argv.includes('--check');

const fail = [];
const die = (m) => fail.push(m);

/* ------------------------------------------------------------------ tree */

function tree(file) {
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
  // the phone chrome the app never draws (D009): status bar, home indicator
  frame.kids = frame.kids.filter(
    (k) => !(k.decls.height === '54px' && k.decls.top === '0' && k.decls.position === 'absolute') && !(k.decls.width === '139px' && k.decls.height === '5px'),
  );
  return frame;
}
const text = (n) => (n.tag === '#text' ? n.text : n.kids.map(text).join(' ')).replace(/\s+/g, ' ').trim();
const walk = (n, f) => { f(n); for (const k of n.kids || []) walk(k, f); };
const find = (n, pred) => { let hit = null; walk(n, (x) => { if (!hit && pred(x)) hit = x; }); return hit; };
const all = (n, pred) => { const out = []; walk(n, (x) => { if (pred(x)) out.push(x); }); return out; };

function lessonsOnDisk() {
  const out = [];
  for (const w of fs.readdirSync(FINAL).filter((d) => /^Week-\d\d-/.test(d)).sort()) {
    const by = new Map();
    for (const f of fs.readdirSync(path.join(FINAL, w))) {
      const m = /^L(\d+)-Frame-(\d+)\.html$/.exec(f);
      if (!m) continue;
      if (!by.has(+m[1])) by.set(+m[1], []);
      by.get(+m[1]).push([+m[2], f]);
    }
    for (const [n, fr] of [...by].sort((a, b) => a[0] - b[0])) {
      fr.sort((a, b) => a[0] - b[0]);
      fr.forEach(([k], i) => k !== i + 1 && die(`L${n}: frame numbers are not 1..N`));
      out.push({ week: +w.slice(5, 7), n, frames: fr.map(([k, f]) => ({ k, file: path.join(FINAL, w, f), label: `L${n} Frame ${k}` })) });
    }
  }
  return out;
}

/* --------------------------------------------------------------- grammar */

// type ramps by `font-size/line-height` (lessons.md §3.2), with the one stated
// colour/weight that tells the 15/22 and 16/22 runs apart
const RAMP = { '13/16': 'label', '24/31': 'title', '30/36': 'display', '18/28': 'body', '15/22': 'small', '16/22': 'cardT' };
const fsLh = (d) => `${parseFloat(d['font-size'])}/${parseFloat(d['line-height'])}`;

function chrome(frame, L, F) {
  const c = { close: false, header: null, progress: null, block: null, bottom: null, fade: false, noise: null, other: 0 };
  for (const k of frame.kids) {
    const d = k.decls;
    if (d['background-image']?.includes('noise-dark')) c.noise = d.opacity;
    else if (d.left === '22px' && d.top === '60px' && find(k, (x) => x.attrs?.d === 'M2 2l14 14M16 2L2 16')) c.close = true;
    else if (d.left === '0' && d.right === '0' && d.top === '60px') c.header = text(k);
    else if (d.top === '108px' && d.height === '3px') c.progress = k.kids[0].decls.width;
    else if (d.top === '140px' && d.bottom === '128px') c.block = k;
    else if (d.height === '58px' && d['border-radius'] === '29px' && d.bottom === '48px') c.bottom = { kind: 'primary', text: text(k) };
    else if (d.bottom === '52px' && find(k, (x) => x.decls?.width === '44px')) c.bottom = { kind: 'next' };
    else if (d.background?.includes('linear-gradient')) c.fade = d;
    else c.other++;
  }
  if (c.noise !== '0.06') die(`${F.label}: noise ${c.noise}`);
  if (!c.close) die(`${F.label}: no close`);
  if (c.other) die(`${F.label}: ${c.other} unknown root children`);
  if (!c.block) die(`${F.label}: no content band`);
  const pct = Math.round((F.k / L.frames.length) * 100) + '%';
  if (c.progress !== pct) die(`${F.label}: progress ${c.progress}, expected ${pct}`);
  if (F.k === 1 ? c.header : c.header !== `Lesson ${L.n}`) die(`${F.label}: header ${c.header}`);
  return c;
}

function vizOf(card, label) {
  const d = card.decls;
  const cap = card.kids[0]?.decls && RAMP[fsLh(card.kids[0].decls)] === 'label' ? text(card.kids[0]) : undefined;
  if (find(card, (x) => x.decls?.width === '12px' && x.decls?.['border-radius'] === '6px' && x.decls?.['margin-top'] === '5px')) {
    const steps = all(card, (x) => x.decls?.['font-size'] === '15px' && x.decls?.['line-height'] === '22px').map(text);
    const tag = all(card, (x) => x.decls?.height === '24px' && x.decls?.['border-radius'] === '12px').map(text)[0];
    const dots = all(card, (x) => x.decls?.width === '12px' && x.decls?.['border-radius'] === '6px');
    const mark = dots.findIndex((x) => x.decls.background === '#F2F0EC');
    return { type: 'chain', cap, steps, mark: mark >= 0 ? mark : undefined, tag };
  }
  if (d.display === 'flex' && d.gap === '10px') {
    const hi = card.kids.findIndex((c) => !!c.decls['box-shadow']);
    return {
      type: 'compare',
      items: card.kids.map((c) => ({ l: text(c.kids[0]), v: c.kids.length === 3 ? text(c.kids[1]) : undefined, t: text(c.kids[c.kids.length - 1]) })),
      hi: hi >= 0 ? hi : undefined,
    };
  }
  if (d.padding === '6px 20px') {
    const WL = parseFloat(card.kids[0].kids[0].decls.width);
    const variant = { 112: 'wide', 64: 'letters', 44: 'narrow' }[WL];
    if (!variant) die(`${label}: pairs left column ${WL}`);
    const isHead = (r) => r.decls.padding === '12px 0 10px';
    const head = isHead(card.kids[0]) ? card.kids[0].kids.map(text) : undefined;
    const rows = card.kids.filter((r) => !isHead(r)).map((r) => (variant === 'letters' ? [text(r.kids[0].kids[0]), text(r.kids[0].kids[1]), text(r.kids[1])] : r.kids.map(text)));
    return { type: 'pairs', variant, head, rows };
  }
  if (find(card, (x) => x.tag === 'svg' && x.attrs.viewBox === '0 0 289 96')) return { type: 'wave', tag: text(card.kids[0].kids[0]), cap: text(card.kids[card.kids.length - 1]) };
  if (find(card, (x) => x.decls?.height === '38px' && x.decls?.position === 'relative')) return { type: 'track', cap, nodes: all(card, (x) => x.decls?.top === '22px').map(text) };
  if (find(card, (x) => x.decls?.height === '8px' && x.decls?.['border-radius'] === '4px')) {
    const fills = all(card, (x) => x.decls?.height === '8px' && x.decls?.width?.endsWith('%'));
    const rows = all(card, (x) => x.decls?.['justify-content'] === 'space-between').map((r, i) => ({ label: text(r.kids[0]), value: text(r.kids[1]), pct: parseFloat(fills[i].decls.width) }));
    return { type: 'bars', cap, rows };
  }
  die(`${label}: unknown visualisation`);
  return null;
}

/** One child of the content band → an atom, plus every text run it draws with its ramp. */
function atom(n, label, runs) {
  const d = n.decls;
  const run = (ramp, t) => (runs.push({ ramp, text: t }), t);
  if (n.tag === '#text') return die(`${label}: bare text in the band`), { k: 'bad' };
  if (d.position === 'relative' && d.width === '393px') {
    const svg = n.kids.find((x) => x.tag === 'svg');
    return { k: 'hero', id: svg?.attrs['data-hero'], mt: d['margin-top'] ?? '0' };
  }
  if (find(n, (x) => x.attrs?.viewBox === '0 0 28 22')) return { k: 'quoteGlyph', mt: d['margin-top'] ?? '0' };
  if (find(n, (x) => x.decls?.width === '96px' && x.decls?.height === '96px')) return { k: 'checkCircle', mt: d['margin-top'] ?? '0' };
  if (d['font-size']) {
    const ramp = RAMP[fsLh(d)];
    if (!ramp) die(`${label}: unknown type ${fsLh(d)}`);
    return { k: ramp, t: run(ramp, text(n)), mt: d['margin-top'] ?? '0', center: d['text-align'] === 'center' };
  }
  if (find(n, (x) => x.tag === '#text' && x.text === 'Done when')) {
    const t = all(n, (x) => x.decls?.['font-size'] === '16px').map(text)[0];
    return { k: 'done', t: run('cardT', t), mt: d['margin-top'] };
  }
  if (d.height === '48px' && d['border-radius'] === '24px') return { k: 'noteField', t: text(n), mt: d['margin-top'] };
  if (d['flex-direction'] === 'column' && d.gap && n.kids.length && n.kids.every((x) => x.decls['min-height'])) {
    const o = n.kids[0].decls;
    return {
      k: 'options',
      mt: d['margin-top'],
      gap: d.gap,
      minH: o['min-height'],
      pad: o.padding,
      opts: n.kids.map((r) => ({ L: text(r.kids[0]), t: run('optQ', text(r.kids[1])), markR: r.kids[0].decls['border-radius'] })),
    };
  }
  if (d['margin-top'] === '16px' && n.kids.length && n.kids.every((x) => x.decls['border-radius'] === '18px' && x.decls.padding === '16px 18px')) {
    return { k: 'bestCards', mt: d['margin-top'], cards: n.kids.map((c) => ({ L: text(c.kids[0]), t: run('fbT', text(c.kids[1])), markR: c.kids[0].decls['border-radius'] })) };
  }
  if (d['flex-shrink'] === '0' && n.kids.length === 1) {
    const v = vizOf(n.kids[0], label);
    if (v) vizRuns(v, run);
    return { k: 'viz', viz: v, mt: d['margin-top'] ?? '0' };
  }
  die(`${label}: unknown band child ${JSON.stringify(d).slice(0, 120)}`);
  return { k: 'bad' };
}

function vizRuns(v, run) {
  if (v.cap) run(v.type === 'wave' ? 'vcap' : 'label', v.cap);
  if (v.type === 'chain') v.steps.forEach((s) => run('chainT', s));
  if (v.type === 'compare') v.items.forEach((i) => (run('cmpL', i.l), run('cmpT', i.t)));
  if (v.type === 'pairs') {
    v.head?.forEach((h) => run('label', h));
    v.rows.forEach((r) => (v.variant === 'letters' ? run('pairR', r[2]) : (run('pairL', r[0]), run('pairR', r[1]))));
  }
}

// every vertical gap the grammar states (lessons.md §3.3), keyed `previous→next`
const GAPS = {
  'first': ['0'],
  'hero→label': ['36px'], 'hero→body': ['36px'],
  'viz→label': ['28px'], 'viz→body': ['28px'],
  'label→title': ['12px'], 'label→display': ['12px'], 'label→bestCards': ['16px'],
  'title→body': ['28px'], 'bestCards→body': ['28px'], 'title→small': ['8px'],
  'body→body': ['22px'], 'body→done': ['28px'], 'body→noteField': ['32px'],
  'quoteGlyph→title': ['24px'], 'title→label': ['18px'],
  'checkCircle→display': ['36px'], 'display→body': ['14px'],
  'small→options': ['20px', '16px'],
};
const ATOM_NAME = (a) => a.k;

function checkGaps(atoms, label) {
  atoms.forEach((a, i) => {
    const key = i === 0 ? 'first' : `${ATOM_NAME(atoms[i - 1])}→${ATOM_NAME(a)}`;
    const ok = GAPS[key];
    if (!ok) return die(`${label}: no grammar for ${key}`);
    if (!ok.includes(a.mt ?? '0')) die(`${label}: ${key} margin ${a.mt}, grammar ${ok.join('|')}`);
  });
}

/* ----------------------------------------------------------------- model */

const DENSITY = {
  regular: { minH: '48px', pad: '13px 16px 13px 14px', gap: '8px', mt: '20px' },
  seven: { minH: '44px', pad: '11px 16px 11px 14px', gap: '6px', mt: '20px' },
  eight: { minH: '44px', pad: '11px 16px 11px 14px', gap: '5px', mt: '16px' },
};
const densityFor = (count) => (count <= 6 ? 'regular' : count === 7 ? 'seven' : 'eight');

/** "Choose F alone if it fits." / "Choose E or F alone if it fits." → the letters that clear the others */
function exclusiveOf(instr) {
  const m = /Choose ([A-I])(?: or ([A-I]))? alone if it fits\.$/.exec(instr);
  return m ? [m[1], m[2]].filter(Boolean) : undefined;
}

const model = [];
const runsByFrame = new Map();
const bandModes = { centre: [], tall: [], scroll: [] };

for (const L of lessonsOnDisk()) {
  const N = L.frames.length;
  const lesson = { n: L.n, week: L.week, title: null, hero: null, pages: [] };
  let quotes = 0;
  let question = null;
  for (const F of L.frames) {
    const fr = tree(F.file);
    const c = chrome(fr, L, F);
    if (!c.block) continue;
    const bd = c.block.decls;
    const runs = [];
    const A = c.block.kids.map((n) => atom(n, F.label, runs));
    runsByFrame.set(F.label, runs);
    checkGaps(A, F.label);
    const ks = A.map((a) => a.k);
    const has = (k) => ks.includes(k);
    const one = (k) => A.find((a) => a.k === k);
    const bodies = A.filter((a) => a.k === 'body').map((a) => a.t);
    const hero = one('hero')?.id;
    const viz = one('viz')?.viz;
    const centred = bd['text-align'] === 'center';
    const mode = c.fade ? 'scroll' : bd['padding-bottom'] === '0px' ? 'tall' : 'centre';
    bandModes[mode].push(F.label);
    if (mode === 'centre' && (bd['padding-bottom'] !== '24px' || bd['justify-content'] !== 'center')) die(`${F.label}: band ${bd['padding-bottom']} ${bd['justify-content']}`);
    if (mode === 'scroll' && bd['justify-content'] !== 'flex-start') die(`${F.label}: scroll band not top-aligned`);
    const bottom = c.bottom?.kind === 'primary' ? c.bottom.text : c.bottom?.kind === 'next' ? 'next' : die(`${F.label}: no bottom control`);
    const expectBottom = (want) => bottom !== want && die(`${F.label}: bottom ${bottom}, expected ${want}`);
    const expectCentred = (want) => centred !== want && die(`${F.label}: text-align centre ${centred}, expected ${want}`);

    let page;
    if (F.k === 1) {
      lesson.title = one('display').t;
      lesson.hero = hero;
      if (ks.join(' ') !== 'hero label display') die(`${F.label}: cover ${ks.join(' ')}`);
      if (one('label').t !== `Lesson ${L.n}`) die(`${F.label}: cover label`);
      expectBottom('Begin');
      expectCentred(true);
      page = { k: 'cover' };
    } else if (has('checkCircle')) {
      if (ks.join(' ') !== 'checkCircle display body' || one('display').t !== 'Lesson complete.') die(`${F.label}: complete ${ks.join(' ')}`);
      if (F.k !== N) die(`${F.label}: complete page is not last`);
      expectBottom('Done');
      expectCentred(true);
      page = { k: 'complete', line: bodies[0] };
    } else if (ks[0] === 'quoteGlyph') {
      if (ks.join(' ') !== 'quoteGlyph title label') die(`${F.label}: quote ${ks.join(' ')}`);
      expectBottom('next');
      expectCentred(true);
      quotes++;
      page = { k: 'quote', text: one('title').t, by: one('label').t };
    } else if (has('options')) {
      const o = one('options');
      if (ks.join(' ') !== 'label title small options' || one('label').t !== 'Question') die(`${F.label}: question ${ks.join(' ')}`);
      const density = Object.entries(DENSITY).find(([, v]) => v.minH === o.minH && v.pad === o.pad && v.gap === o.gap && v.mt === o.mt)?.[0];
      if (!density) die(`${F.label}: option density ${o.minH} ${o.pad} ${o.gap} ${o.mt}`);
      if (density !== densityFor(o.opts.length)) die(`${F.label}: ${o.opts.length} options drawn ${density}`);
      const multi = o.opts[0].markR === '7px';
      if (o.opts.some((x) => x.markR !== (multi ? '7px' : '12px'))) die(`${F.label}: mixed option marks`);
      o.opts.forEach((x, i) => x.L !== 'ABCDEFGHI'[i] && die(`${F.label}: option letter ${x.L}`));
      const instr = one('small').t;
      expectBottom('Continue');
      expectCentred(false);
      page = { k: 'question', prompt: one('title').t, instr, multi, exclusive: multi ? exclusiveOf(instr) : undefined, options: o.opts.map(({ L: l, t }) => ({ L: l, t })), density };
      if (!multi && exclusiveOf(instr)) die(`${F.label}: single choice with an exclusive letter`);
      question = page;
    } else if (has('bestCards')) {
      const b = one('bestCards');
      if (ks.join(' ') !== 'label bestCards body') die(`${F.label}: best ${ks.join(' ')}`);
      const multi = b.cards[0].markR === '8px';
      if (b.cards.some((x) => x.markR !== (multi ? '8px' : '14px'))) die(`${F.label}: mixed best marks`);
      if (!question || multi !== question.multi) die(`${F.label}: best-answer mark does not follow the question`);
      if (one('label').t !== (b.cards.length > 1 ? 'Best answers' : 'Best answer')) die(`${F.label}: best label ${one('label').t}`);
      expectBottom('Continue');
      page = { k: 'answer', multi, best: b.cards.map(({ L: l, t }) => ({ L: l, t })), body: bodies };
    } else if (has('noteField')) {
      if (ks.join(' ') !== 'label title body noteField' || one('label').t !== 'After choosing') die(`${F.label}: reflect ${ks.join(' ')}`);
      if (one('noteField').t !== 'Add a note (optional)') die(`${F.label}: note placeholder`);
      expectBottom('Continue');
      page = { k: 'reflect', lead: one('title').t, body: bodies };
    } else if (A.find((a) => a.k === 'label')?.t === 'Today’s task') {
      if (!/^(hero )?label title body( body)?$/.test(ks.join(' '))) die(`${F.label}: task ${ks.join(' ')}`);
      if (one('title').t !== lesson.title) die(`${F.label}: task title is not the lesson title`);
      if (hero && hero !== lesson.hero) die(`${F.label}: task hero ${hero} is not the cover's`);
      expectBottom('next');
      page = { k: 'task', hero, body: bodies };
    } else if (has('done')) {
      if (!/^body( body)* done$/.test(ks.join(' '))) die(`${F.label}: task end ${ks.join(' ')}`);
      expectBottom('Finish lesson');
      page = { k: 'taskEnd', body: bodies, done: one('done').t };
    } else {
      const lab = A.find((a) => a.k === 'label');
      if (lab && !/^Part \d+$/.test(lab.t)) die(`${F.label}: reading label ${lab.t}`);
      if (!/^(hero |viz )?(label title )?body( body)*$/.test(ks.join(' '))) die(`${F.label}: reading ${ks.join(' ')}`);
      expectBottom('next');
      expectCentred(false);
      page = { k: 'read', part: lab ? +lab.t.slice(5) : undefined, title: lab ? one('title').t : undefined, hero, viz, body: bodies };
    }
    lesson.pages.push(page);
  }
  if (quotes !== 2) die(`L${L.n}: ${quotes} quotes`);
  model.push(lesson);
}

/* ------------------------------------------------- lessons-v3 cross-check */

const V = V3.weeks.flatMap((w) => w.lessons.map((l) => ({ ...l, week: w.num })));
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clean = (o) => JSON.parse(JSON.stringify(o));
for (const M of model) {
  const v = V.find((x) => x.num === M.n);
  const tag = `L${M.n}`;
  if (!v) { die(`${tag}: not in lessons-v3.json`); continue; }
  if (v.week !== M.week) die(`${tag}: week ${M.week}, lessons-v3 ${v.week}`);
  if (v.title !== M.title) die(`${tag}: title "${M.title}", lessons-v3 "${v.title}"`);
  const q = M.pages.filter((p) => p.k === 'quote');
  if (!eq({ text: q[0].text, by: q[0].by }, v.openingQuote)) die(`${tag}: opening quote`);
  if (!eq({ text: q[1].text, by: q[1].by }, v.closingQuote)) die(`${tag}: closing quote`);
  const reading = M.pages.filter((p) => p.k === 'read');
  if (!eq(reading.filter((p) => p.part).map((p) => p.title), v.sections.map((s) => s.title))) die(`${tag}: section titles`);
  reading.filter((p) => p.part).forEach((p, i) => p.part !== i + 1 && die(`${tag}: Part ${p.part} out of order`));
  const fr = reading.flatMap((p) => [...(p.viz ? [{ viz: p.viz.type }] : []), ...p.body]);
  const vr = v.sections.flatMap((s) => s.items.map((it) => (typeof it === 'string' ? it : { viz: it.visual.type })));
  if (!eq(fr, vr)) die(`${tag}: reading pieces differ`);
  const fv = reading.filter((p) => p.viz).map((p) => p.viz);
  const vv = v.sections.flatMap((s) => s.items.filter((it) => typeof it !== 'string').map((it) => it.visual));
  fv.forEach((f, i) => {
    const w = vv[i];
    const ok = {
      chain: () => eq(f.steps, w.steps) && (f.cap ?? null) === (w.cap ?? null) && (f.tag ?? null) === (w.tag ?? null) && (f.mark ?? null) === (w.mark ?? null),
      compare: () => eq(clean(f.items), w.items.map((x) => clean({ l: x.l, v: x.v || undefined, t: x.t }))) && (f.hi ?? null) === (w.hi ?? null),
      pairs: () =>
        eq(f.variant === 'letters' ? f.rows.map((r) => [r[1], r[2]]) : f.rows, w.rows) &&
        (f.variant !== 'letters' || f.rows.every((r) => r[0] === r[1][0])) &&
        f.variant === (w.letters ? 'letters' : w.narrow ? 'narrow' : 'wide') &&
        eq(f.head ?? null, w.head ?? null),
      wave: () => f.cap === w.cap && f.tag === w.tag,
      track: () => eq(f.nodes, w.nodes) && (f.cap ?? null) === (w.cap ?? null),
      bars: () => eq(f.rows.map((r) => [r.label, r.pct, r.value]), w.rows) && (f.cap ?? null) === (w.cap ?? null),
    }[f.type];
    if (!w || !ok()) die(`${tag}: ${f.type} payload differs from lessons-v3`);
  });
  const qp = M.pages.find((p) => p.k === 'question');
  if (!!qp !== !!v.question) die(`${tag}: question presence`);
  if (qp && v.question) {
    if (qp.prompt !== v.question.prompt || qp.instr !== v.question.instr || qp.multi !== v.question.multi || !eq(qp.options, v.question.opts)) die(`${tag}: question differs`);
    const a = M.pages.find((p) => p.k === 'answer' || p.k === 'reflect');
    const fb = v.question.fb;
    if (fb.best ? a.k !== 'answer' || !eq(a.best, fb.best) || !eq(a.body, fb.items) : a.k !== 'reflect' || a.lead !== fb.lead || !eq(a.body, fb.items)) die(`${tag}: answer differs`);
  }
  const t = M.pages.find((p) => p.k === 'task');
  const te = M.pages.find((p) => p.k === 'taskEnd');
  if (!t || !te) die(`${tag}: task pages`);
  else {
    if (!eq([...t.body, ...te.body], v.practice)) die(`${tag}: practice differs`);
    if (te.done !== v.doneWhen) die(`${tag}: Done when differs`);
  }
  const line = v.question ? 'Your answers are saved to the log. One thing left today — the task.' : 'One thing left today — the task.';
  if (M.pages[M.pages.length - 1].line !== line) die(`${tag}: complete line`);
}

/* ---------------------------------------------------------------- breaks */

// letters' left cell is a 24/31 letter over a 13/16 word: both nowrap or a single
// glyph, so neither can carry a break; the classifier records only the right cell
const BREAKS = {};
let breakRuns = 0, bodySkipped = 0;
for (const [label, texts] of Object.entries(BREAKS_IN)) {
  const runs = runsByFrame.get(label);
  if (!runs) { die(`breaks: ${label} is not a lesson frame`); continue; }
  for (const [t, lines] of Object.entries(texts)) {
    if (lines.join(' ').replace(/\s+/g, ' ') !== t.replace(/\s+/g, ' ')) die(`breaks: ${label} lines do not rejoin to the run`);
    const hits = [...new Set(runs.filter((r) => r.text === t).map((r) => r.ramp))];
    if (hits.length !== 1) { die(`breaks: ${label} "${t.slice(0, 40)}" matches ramps ${hits.join(',') || 'none'}`); continue; }
    const ramp = hits[0];
    if (ramp === 'body') { bodySkipped++; continue; }
    const key = `${ramp}|${t}`;
    if (BREAKS[key] && !eq(BREAKS[key], lines)) die(`breaks: ${key} breaks differently on two frames`);
    BREAKS[key] = lines;
    breakRuns++;
  }
}

if (fail.length) {
  console.error(`gen-lessons: ${fail.length} problem(s)`);
  for (const f of fail.slice(0, 60)) console.error('  ' + f);
  process.exit(1);
}

/* ------------------------------------------------------------------ emit */

// drop undefined keys so the literal is exactly the data
const lit = (o) => JSON.stringify(clean(o));
const ids = [...new Set(model.flatMap((l) => [l.hero, ...l.pages.map((p) => p.hero).filter(Boolean)]))].sort();
const pagesTotal = model.reduce((a, l) => a + l.pages.length, 0);

let src = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 84 lesson readers of \`Vici Overhaul\`, read out of the ${pagesTotal} Week
 * frames (\`.overhaul/final/Week-XX-…/L<n>-Frame-<k>.html\`): one entry per frame,
 * in order, so page k of lesson n is \`L<n> Frame <k>\`. Checked against the
 * bundle's \`gen/lessons-v3.json\` (84 / 84). Fixed copy (Begin, Part n,
 * Today’s task, Done when, Lesson complete. …) lives in the reader's
 * components; this file is what changes from lesson to lesson.
 *
 * Rebuild: node scripts/overhaul/gen-lessons.mjs
 */
import type { HeroId } from './heroes';

export type LessonViz =
  | { type: 'chain'; cap?: string; steps: string[]; mark?: number; tag?: string }
  | { type: 'compare'; items: { l: string; v?: string; t: string }[]; hi?: number }
  /** \`letters\` rows are [letter, word, text]; the others [left, right] */
  | { type: 'pairs'; variant: 'wide' | 'narrow' | 'letters'; head?: string[]; rows: string[][] }
  | { type: 'wave'; tag: string; cap: string }
  | { type: 'track'; cap?: string; nodes: string[] }
  | { type: 'bars'; cap?: string; rows: { label: string; value: string; pct: number }[] };

export interface LessonOption {
  /** A…I */
  L: string;
  t: string;
}

/** Option-row geometry by count: 3–6 regular (48), 7 seven (44, gap 6), 8–9 eight (44, gap 5). */
export type OptionDensity = 'regular' | 'seven' | 'eight';

export type LessonPage =
  /** Frame 1: hero · \`Lesson n\` · title · Begin */
  | { k: 'cover' }
  /** the opening (frame 2) and closing (before the task) quotes */
  | { k: 'quote'; text: string; by: string }
  /** a reading page: \`part\` + \`title\` open a Part; a hero or a visualisation may lead */
  | { k: 'read'; part?: number; title?: string; hero?: HeroId; viz?: LessonViz; body: string[] }
  /** \`exclusive\`: the letters that clear the others ("Choose F alone if it fits.") */
  | { k: 'question'; prompt: string; instr: string; multi: boolean; exclusive?: string[]; options: LessonOption[]; density: OptionDensity }
  /** the designated best answer(s) — not the reader's choice */
  | { k: 'answer'; multi: boolean; best: LessonOption[]; body: string[] }
  /** "After choosing" + lead + one piece + the note field */
  | { k: 'reflect'; lead: string; body: string[] }
  /** \`Today’s task\` + the lesson title (+ the cover's hero when it fits) */
  | { k: 'task'; hero?: HeroId; body: string[] }
  /** the rest of the practice + the Done-when card · Finish lesson */
  | { k: 'taskEnd'; body: string[]; done: string }
  | { k: 'complete'; line: string };

export interface LessonContent {
  n: number;
  week: number;
  title: string;
  /** the cover's illustration */
  hero: HeroId;
  pages: LessonPage[];
}

export const LESSONS: Record<number, LessonContent> = {
`;
for (const L of model) {
  src += `  ${L.n}: {\n    n: ${L.n},\n    week: ${L.week},\n    title: ${JSON.stringify(L.title)},\n    hero: ${JSON.stringify(L.hero)},\n    pages: [\n`;
  for (const p of L.pages) src += `      ${lit(p)},\n`;
  src += `    ],\n  },\n`;
}
src += `};

/**
 * Chrome's own breaks for runs whose \`text-wrap: balance | pretty\` lines differ
 * from greedy wrapping at the canvas width, keyed \`<ramp>|<text>\`. Native only,
 * and only at the width they were measured at (D332, D312); lesson body is left
 * to wrap greedily.
 */
export const BREAKS: Record<string, readonly string[]> = {
`;
for (const [k, lines] of Object.entries(BREAKS).sort(([a], [b]) => (a < b ? -1 : 1))) src += `  ${JSON.stringify(k)}: ${JSON.stringify(lines)},\n`;
src += `};

/** The illustrations the readers use (${ids.length}). */
export const LESSON_HERO_IDS: readonly HeroId[] = ${JSON.stringify(ids)};
`;

if (CHECK) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  console.log(cur === src ? 'gen-lessons --check: up to date' : 'gen-lessons --check: src/content/lessons.ts is stale');
  process.exit(cur === src ? 0 : 1);
}
fs.writeFileSync(OUT, src);
console.log(
  `gen-lessons: ${model.length} lessons, ${pagesTotal} pages → src/content/lessons.ts ` +
    `(${(src.length / 1024).toFixed(0)} KB); lessons-v3 84/84; band modes centre ${bandModes.centre.length} · tall ${bandModes.tall.join(', ')} · scroll ${bandModes.scroll.join(', ')}; ` +
    `breaks ${breakRuns} runs (${bodySkipped} body runs left greedy), ${ids.length} hero ids`,
);
