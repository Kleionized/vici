// Prototype: extract the full lesson content model from the 1,273 week-canvas frames
// (frames win), then cross-check it against the bundle's own gen/lessons-v3.json.
// Usage: node extract.mjs [--out lessons.model.json]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './tree.mjs';

const args = process.argv.slice(2);
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const R = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'frames.json')));
const V3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'Vici Overhaul/project/gen/lessons-v3.json')));
const POOL = JSON.parse(fs.readFileSync(path.join(ROOT, 'Vici Overhaul/project/gen/lesson-pool.json')));

const vizOf = (a) => {
  const { k, mt, ...v } = a; return v;
};
const model = [];
const problems = [];
for (const L of R) {
  const pages = [];
  let lesson = { n: L.n, week: L.week, frames: L.frames, title: null, hero: null, pages };
  let qs = 0;
  for (const p of L.pages) {
    const A = p.atoms;
    const hero = A.find((a) => a.k === 'hero')?.id ?? null;
    const viz = A.find((a) => a.k === 'viz');
    const bodies = A.filter((a) => a.k === 'body').map((a) => a.t);
    let pg;
    switch (p.kind) {
      case 'cover':
        lesson.title = A.find((a) => a.k === 'display').t; lesson.hero = hero;
        if (A.find((a) => a.k === 'label').t !== `Lesson ${L.n}`) problems.push(`${p.label} cover label`);
        pg = { kind: 'cover' }; break;
      case 'quote':
        pg = { kind: 'quote', which: qs++ === 0 ? 'open' : 'close', text: A.find((a) => a.k === 'title').t, by: A.find((a) => a.k === 'label')?.t ?? '' }; break;
      case 'section': {
        const lab = A.find((a) => a.k === 'label').t;
        pg = { kind: 'section', part: +lab.replace('Part ', ''), title: A.find((a) => a.k === 'title').t, ...(hero ? { hero } : {}), ...(viz ? { viz: vizOf(viz) } : {}), body: bodies }; break;
      }
      case 'continuation':
        pg = { kind: 'cont', ...(hero ? { hero } : {}), ...(viz ? { viz: vizOf(viz) } : {}), body: bodies }; break;
      case 'question': {
        const o = A.find((a) => a.k === 'options');
        pg = { kind: 'question', prompt: A.find((a) => a.k === 'title').t, instr: A.find((a) => a.k === 'small').t, multi: o.opts[0].markR === '7px', options: o.opts.map(({ L: l, t }) => ({ L: l, t })), density: o.minH === '48px' ? 'regular' : o.gap === '6px' ? 'seven' : 'eight', layout: p.fade ? 'scroll' : p.block.pb === '0px' ? 'tall' : 'centre' }; break;
      }
      case 'answer-best': {
        const b = A.find((a) => a.k === 'bestCards');
        pg = { kind: 'answer', label: A.find((a) => a.k === 'label').t, multi: b.cards[0].markR === '8px', best: b.cards.map(({ L: l, t }) => ({ L: l, t })), body: bodies }; break;
      }
      case 'answer-reflect':
        pg = { kind: 'reflect', lead: A.find((a) => a.k === 'title').t, body: bodies, note: A.find((a) => a.k === 'noteField').t }; break;
      case 'task-first':
        pg = { kind: 'task', ...(hero ? { hero } : {}), title: A.find((a) => a.k === 'title').t, body: bodies };
        if (A.find((a) => a.k === 'label').t !== 'Today’s task') problems.push(`${p.label} task label`);
        break;
      case 'task-cont':
        pg = { kind: 'taskEnd', body: bodies, done: A.find((a) => a.k === 'done').t }; break;
      case 'complete':
        pg = { kind: 'complete', title: A.find((a) => a.k === 'display').t, body: bodies[0] }; break;
    }
    pages.push(pg);
  }
  model.push(lesson);
}

// ── cross-check against lessons-v3.json ──
const V = V3.weeks.flatMap((w) => w.lessons.map((l) => ({ ...l, week: w.num, weekName: w.name })));
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let checked = 0;
const kindsSeq = {};
for (const M of model) {
  const v = V.find((x) => x.num === M.n);
  const tag = `L${M.n}`;
  if (!v) { problems.push(`${tag} missing in v3`); continue; }
  checked++;
  if (v.week !== M.week) problems.push(`${tag} week ${v.week} vs ${M.week}`);
  if (v.title !== M.title) problems.push(`${tag} title v3 "${v.title}" frame "${M.title}"`);
  if (POOL[M.n][0] !== M.hero) problems.push(`${tag} cover hero ${M.hero} vs pool ${POOL[M.n][0]}`);
  const quotes = M.pages.filter((p) => p.kind === 'quote');
  if (!eq(quotes[0] && { text: quotes[0].text, by: quotes[0].by }, v.openingQuote)) problems.push(`${tag} opening quote ${JSON.stringify(quotes[0])} vs ${JSON.stringify(v.openingQuote)}`);
  if (!eq(quotes[1] && { text: quotes[1].text, by: quotes[1].by }, v.closingQuote)) problems.push(`${tag} closing quote ${JSON.stringify(quotes[1])} vs ${JSON.stringify(v.closingQuote)}`);
  // reading items in order
  const fr = []; const secTitles = [];
  for (const p of M.pages) if (p.kind === 'section' || p.kind === 'cont') {
    if (p.kind === 'section') secTitles.push(p.title);
    if (p.viz) fr.push({ viz: p.viz.type });
    fr.push(...p.body);
  }
  const vr = []; for (const s of v.sections) for (const it of s.items) vr.push(typeof it === 'string' ? it : { viz: it.visual.type });
  if (!eq(secTitles, v.sections.map((s) => s.title))) problems.push(`${tag} section titles differ`);
  if (!eq(fr, vr)) {
    for (let i = 0; i < Math.max(fr.length, vr.length); i++) if (!eq(fr[i], vr[i])) { problems.push(`${tag} reading item ${i}: frame ${JSON.stringify(fr[i])?.slice(0, 90)} | v3 ${JSON.stringify(vr[i])?.slice(0, 90)}`); break; }
  }
  // visual payloads
  const fv = M.pages.filter((p) => p.viz).map((p) => p.viz);
  const vv = v.sections.flatMap((s) => s.items.filter((it) => typeof it !== 'string').map((it) => it.visual));
  fv.forEach((f, i) => {
    const w = vv[i]; if (!w) return;
    const chk = { chain: () => eq(f.steps, w.steps) && (f.cap ?? null) === (w.cap ?? null) && f.tag === w.tag && (f.mark ?? null) === (w.mark ?? null), compare: () => eq(f.items, w.items.map((x) => ({ l: x.l, ...(x.v ? { v: x.v } : {}), t: x.t }))) && (f.hi ?? null) === (w.hi ?? null), pairs: () => eq(f.rows, w.rows) && eq(f.head ?? null, w.head ?? null), wave: () => f.cap === w.cap && f.tag === w.tag, track: () => eq(f.nodes, w.nodes) && (f.cap ?? null) === (w.cap ?? null), bars: () => eq(f.rows.map((r) => [r.label, r.pct, r.value]), w.rows) && (f.cap ?? null) === (w.cap ?? null) }[f.type];
    if (chk && !chk()) problems.push(`${tag} viz ${f.type} payload differs: ${JSON.stringify(f).slice(0, 140)} | ${JSON.stringify(w).slice(0, 140)}`);
  });
  // question
  const q = M.pages.find((p) => p.kind === 'question');
  if (!!q !== !!v.question) problems.push(`${tag} question presence`);
  if (q && v.question) {
    if (q.prompt !== v.question.prompt || q.instr !== v.question.instr || q.multi !== v.question.multi || !eq(q.options, v.question.opts)) problems.push(`${tag} question differs`);
    const a = M.pages.find((p) => p.kind === 'answer' || p.kind === 'reflect');
    const F = v.question.fb;
    if (F.best) { if (a.kind !== 'answer' || !eq(a.best, F.best) || !eq(a.body, F.items)) problems.push(`${tag} answer differs`); }
    else if (a.kind !== 'reflect' || a.lead !== F.lead || !eq(a.body, F.items)) problems.push(`${tag} reflect differs`);
  }
  // task
  const t = M.pages.find((p) => p.kind === 'task'); const te = M.pages.find((p) => p.kind === 'taskEnd');
  if (t.title !== M.title) problems.push(`${tag} task title "${t.title}" != lesson title`);
  if (!eq([...t.body, ...te.body], v.practice)) problems.push(`${tag} practice differs`);
  if (te.done !== v.doneWhen) problems.push(`${tag} done differs: ${te.done} | ${v.doneWhen}`);
  const c = M.pages.find((p) => p.kind === 'complete');
  const expect = v.question ? 'Your answers are saved to the log. One thing left today — the task.' : 'One thing left today — the task.';
  if (c.body !== expect) problems.push(`${tag} complete body "${c.body}"`);
  const seq = M.pages.map((p) => p.kind).join(' ').replace(/(section( cont)*)( section( cont)*)*/, 'READING');
  kindsSeq[seq] = (kindsSeq[seq] || 0) + 1;
  // mid-lesson heroes from pool
  const mids = M.pages.filter((p) => (p.kind === 'section' || p.kind === 'cont') && p.hero).map((p) => p.hero);
  const pool = POOL[M.n];
  mids.forEach((h, i) => { if (h !== pool[i + 1]) problems.push(`${tag} mid hero ${i} ${h} vs pool ${pool[i + 1]}`); });
  if (t.hero && t.hero !== M.hero) problems.push(`${tag} task hero ${t.hero} != cover ${M.hero}`);
}
console.log('checked', checked, 'lessons against lessons-v3.json');
console.log('page sequences (reading pages collapsed):'); for (const [k, v] of Object.entries(kindsSeq)) console.log(String(v).padStart(4), k);
console.log('problems', problems.length); for (const p of problems) console.log('  ' + p);
if (out) fs.writeFileSync(out, JSON.stringify(model, null, 1));
// stats
const all = model.flatMap((m) => m.pages);
console.log('pages', all.length, 'with hero', all.filter((p) => p.hero).length, 'with viz', all.filter((p) => p.viz).length, 'questions', all.filter((p) => p.kind === 'question').length);
console.log('task pages with hero', model.filter((m) => m.pages.find((p) => p.kind === 'task').hero).length);
const lens = all.flatMap((p) => p.body || []).map((s) => s.length); console.log('body pieces', lens.length, 'max chars', Math.max(...lens));
