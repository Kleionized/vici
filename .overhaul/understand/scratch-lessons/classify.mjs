// Classify every week-canvas lesson frame by structure.
// Usage: node classify.mjs [--json out.json] [--dump]
import fs from 'node:fs';
import { tree, text, find, all, lessons } from './tree.mjs';

const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

const TYPE = {
  '13/16': 'label', '24/31': 'title', '30/36': 'display', '18/28': 'body', '15/22': 'small', '16/22': 'cardT',
};
const fsLh = (d) => `${parseFloat(d['font-size'])}/${parseFloat(d['line-height'])}`;

function classifyChrome(frame) {
  const c = { close: false, header: null, progress: null, block: null, bottom: null, fade: false, noise: false, other: [] };
  for (const k of frame.kids) {
    const d = k.decls;
    if (d['background-image']?.includes('noise-dark')) { c.noise = d.opacity; continue; }
    if (d.left === '22px' && d.top === '60px' && find(k, (x) => x.attrs?.d === 'M2 2l14 14M16 2L2 16')) { c.close = true; continue; }
    if (d.left === '0' && d.right === '0' && d.top === '60px') { c.header = text(k); continue; }
    if (d.top === '108px' && d.height === '3px') { c.progress = k.kids[0].decls.width; continue; }
    if (d.top === '140px' && d.bottom === '128px') { c.block = k; continue; }
    if (d.height === '58px' && d['border-radius'] === '29px') { c.bottom = { kind: 'primary', text: text(k), bottom: d.bottom }; continue; }
    if (d.bottom === '52px' && find(k, (x) => x.decls?.width === '44px')) { c.bottom = { kind: 'next' }; continue; }
    if (d['background']?.includes('linear-gradient')) { c.fade = d; continue; }
    c.other.push(k);
  }
  return c;
}

// classify one child of the content block
function atom(n) {
  const d = n.decls;
  if (n.tag === '#text') return { k: 'rawtext', t: n.text };
  if (d.position === 'relative' && d.width === '393px') {
    const svg = n.kids.find((x) => x.tag === 'svg');
    return { k: 'hero', id: svg?.attrs['data-hero'], h: parseFloat(d.height), top: svg?.decls.top, g: svg?.kids.filter((x) => x.tag === 'g' && x.attrs.transform).map((x) => x.attrs.transform), transform: svg?.decls.transform, origin: svg?.decls['transform-origin'], mt: d['margin-top'] };
  }
  if (find(n, (x) => x.attrs?.viewBox === '0 0 28 22')) return { k: 'quoteGlyph' };
  if (find(n, (x) => x.decls?.width === '96px' && x.decls?.height === '96px')) return { k: 'checkCircle' };
  if (d['font-size']) {
    const t = TYPE[fsLh(d)] || `type(${fsLh(d)})`;
    return { k: t, t: text(n), mt: d['margin-top'] || '0', center: d['text-align'] === 'center', color: d.color, fw: d['font-weight'], ls: d['letter-spacing'] };
  }
  if (find(n, (x) => x.tag === '#text' && x.text === 'Done when')) {
    const val = all(n, (x) => x.decls?.['font-size'] === '16px').map(text)[0];
    return { k: 'done', t: val, mt: d['margin-top'] };
  }
  if (d['margin-top'] && d.height === '48px' && d['border-radius'] === '24px') return { k: 'noteField', mt: d['margin-top'], t: text(n) };
  // question options list
  if (d['flex-direction'] === 'column' && d.gap && n.kids.length && n.kids.every((x) => x.decls['min-height'])) {
    return { k: 'options', mt: d['margin-top'], gap: d.gap, minH: n.kids[0].decls['min-height'], radius: n.kids[0].decls['border-radius'], pad: n.kids[0].decls.padding, n: n.kids.length, opts: n.kids.map((o) => ({ L: text(o.kids[0]), t: text(o.kids[1]), markR: o.kids[0].decls['border-radius'] })) };
  }
  if (d['margin-top'] === '16px' && n.kids.length && n.kids.every((x) => x.decls['border-radius'] === '18px' && x.decls.padding === '16px 18px')) {
    return { k: 'bestCards', n: n.kids.length, cards: n.kids.map((o) => ({ L: text(o.kids[0]), t: text(o.kids[1]), markR: o.kids[0].decls['border-radius'] })) };
  }
  if (d['flex-shrink'] === '0' && n.kids.length === 1) {
    const v = vizKind(n.kids[0]);
    return { k: 'viz', type: v.type, mt: d['margin-top'] || '0', ...v };
  }
  return { k: 'unknown', d, t: text(n).slice(0, 80) };
}

function vizKind(card) {
  const d = card.decls;
  const cap = card.kids[0] && TYPE[fsLh(card.kids[0].decls || {})] === 'label' ? text(card.kids[0]) : null;
  if (find(card, (x) => x.decls?.width === '12px' && x.decls?.['border-radius'] === '6px' && x.decls?.['margin-top'] === '5px')) {
    const rows = all(card, (x) => x.decls?.['font-size'] === '15px' && x.decls?.['line-height'] === '22px').map(text);
    const tag = all(card, (x) => x.decls?.height === '24px' && x.decls?.['border-radius'] === '12px').map(text)[0];
    const dots = all(card, (x) => x.decls?.width === '12px' && x.decls?.['border-radius'] === '6px');
    const mark = dots.findIndex((x) => x.decls.background === '#F2F0EC');
    return { type: 'chain', ...(cap ? { cap } : {}), steps: rows, ...(mark >= 0 ? { mark } : {}), ...(tag ? { tag } : {}) };
  }
  if (d.display === 'flex' && d.gap === '10px') {
    const hi = card.kids.findIndex((c) => !!c.decls['box-shadow']);
    return { type: 'compare', items: card.kids.map((c) => ({ l: text(c.kids[0]), ...(c.kids.length === 3 ? { v: text(c.kids[1]) } : {}), t: text(c.kids[c.kids.length - 1]) })), ...(hi >= 0 ? { hi } : {}) };
  }
  if (d.padding === '6px 20px') {
    const WL = parseFloat(card.kids[0].kids[0].decls.width);
    const variant = WL === 112 ? 'wide' : WL === 64 ? 'letters' : 'narrow';
    const isHead = (r) => r.decls.padding === '12px 0 10px';
    const head = isHead(card.kids[0]) ? card.kids[0].kids.map(text) : null;
    const rows = card.kids.filter((r) => !isHead(r)).map((r) => variant === 'letters' ? [text(r.kids[0].kids[1]), text(r.kids[1])] : r.kids.map(text));
    return { type: 'pairs', variant, ...(head ? { head } : {}), rows };
  }
  if (find(card, (x) => x.tag === 'svg' && x.attrs.viewBox === '0 0 289 96')) return { type: 'wave', cap: text(card.kids[card.kids.length - 1]), tag: text(card.kids[0].kids[0]) };
  if (find(card, (x) => x.decls?.height === '38px' && x.decls?.position === 'relative')) return { type: 'track', ...(cap ? { cap } : {}), nodes: all(card, (x) => x.decls?.top === '22px').map(text) };
  if (find(card, (x) => x.decls?.height === '8px' && x.decls?.['border-radius'] === '4px')) return { type: 'bars', ...(cap ? { cap } : {}), rows: all(card, (x) => x.decls?.['justify-content'] === 'space-between').map((r) => ({ label: text(r.kids[0]), value: text(r.kids[1]) })).map((r, i) => ({ ...r, pct: parseFloat(all(card, (x) => x.decls?.height === '8px' && x.decls?.width?.endsWith('%'))[i].decls.width) })) };
  return { type: 'unknownViz', t: text(card).slice(0, 100) };
}

function pageKind(atoms, c, k, N) {
  const ks = atoms.map((a) => a.k);
  if (k === 1) return 'cover';
  if (ks.includes('checkCircle')) return 'complete';
  if (ks[0] === 'quoteGlyph') return 'quote';
  if (ks.includes('options')) return 'question';
  if (ks.includes('bestCards')) return 'answer-best';
  if (ks.includes('noteField')) return 'answer-reflect';
  const lab = atoms.find((a) => a.k === 'label' && a.t !== undefined);
  if (lab && lab.t === 'Today’s task') return 'task-first';
  if (ks.includes('done')) return 'task-cont';
  if (lab && /^Part \d+$/.test(lab.t)) return 'section';
  return 'continuation';
}

const report = [];
const anomalies = [];
for (const L of lessons()) {
  const N = L.frames.length;
  const pages = [];
  for (const F of L.frames) {
    const fr = tree(F.file);
    const c = classifyChrome(fr);
    if (!c.block) { anomalies.push(`${F.label}: no content block`); continue; }
    const bd = c.block.decls;
    const atoms = c.block.kids.map(atom);
    const kind = pageKind(atoms, c, F.k, N);
    const expectPct = Math.round((F.k / N) * 100) + '%';
    if (c.progress !== expectPct) anomalies.push(`${F.label}: progress ${c.progress} != ${expectPct}`);
    if (F.k === 1 ? c.header : c.header !== `Lesson ${L.n}`) anomalies.push(`${F.label}: header ${c.header}`);
    if (!c.close) anomalies.push(`${F.label}: no close`);
    if (c.other.length) anomalies.push(`${F.label}: other root kids ${c.other.length}`);
    for (const a of atoms) if (a.k === 'unknown' || a.type === 'unknownViz' || a.k === 'rawtext' || /^type\(/.test(a.k)) anomalies.push(`${F.label}: ${JSON.stringify(a).slice(0, 160)}`);
    const sig = atoms.map((a) => a.k === 'viz' ? `viz:${a.type}` : a.k).join(' ');
    pages.push({
      k: F.k, label: F.label, kind, sig, atoms,
      block: { pb: bd['padding-bottom'], jc: bd['justify-content'], center: bd['text-align'] === 'center' },
      bottom: c.bottom, fade: c.fade ? c.fade : null, progress: c.progress, noise: c.noise,
    });
  }
  report.push({ week: L.week, n: L.n, frames: N, pages });
}

if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));

// summary
const kinds = {}; const sigs = {}; const blocks = {}; const bottoms = {};
for (const L of report) for (const p of L.pages) {
  kinds[p.kind] = (kinds[p.kind] || 0) + 1;
  const key = p.kind + ' :: ' + p.sig;
  (sigs[key] ||= []).push(p.label);
  const bk = `${p.kind} pb=${p.block.pb} jc=${p.block.jc} center=${p.block.center} fade=${!!p.fade}`;
  blocks[bk] = (blocks[bk] || 0) + 1;
  const bt = `${p.kind} ${p.bottom?.kind} ${p.bottom?.text || ''}`;
  bottoms[bt] = (bottoms[bt] || 0) + 1;
}
console.log('lessons', report.length, 'frames', report.reduce((a, l) => a + l.frames, 0));
console.log('frames per lesson', Object.entries(report.reduce((a, l) => (a[l.frames] = (a[l.frames] || 0) + 1, a), {})));
console.log('\nKINDS', kinds);
console.log('\nBLOCK VARIANTS'); for (const [k, v] of Object.entries(blocks).sort()) console.log(String(v).padStart(5), k);
console.log('\nBOTTOM CONTROLS'); for (const [k, v] of Object.entries(bottoms).sort()) console.log(String(v).padStart(5), k);
console.log('\nSIGNATURES'); for (const [k, v] of Object.entries(sigs).sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(5), k, v.length <= 4 ? ' <- ' + v.join(', ') : '');
console.log('\nANOMALIES', anomalies.length); for (const a of anomalies.slice(0, 80)) console.log('  ' + a);
