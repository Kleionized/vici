// Builds v3 lesson content from the revised course docs and renders all 12 Week files.
// Run via run_script: const R = await (eval(await readFile('gen/build-v3.js')))(mode)  — mode 'collect' | 'build'
(async (mode) => {
  const K = eval(await readFile('gen/mono-kit.js'));
  const V4 = eval(await readFile('gen/heroes-v4.js'));
  const OLD = JSON.parse(await readFile('lessons.json'));
  const BOUNDS = JSON.parse(await readFile('gen/hero-bounds.json'));
  const POOL = JSON.parse(await readFile('gen/lesson-pool.json'));
  const SRC = JSON.parse(await readFile('gen/src-days.json'));
  const AU = eval(await readFile('gen/v3-author.js'));
  const B = eval(await readFile('gen/lesson-v3.js'))(K, V4, BOUNDS, POOL);

  const clean = s => (s || '').replace(/\s+/g, ' ').trim().replace(/'/g, '’').replace(/"([^"]*)"/g, '“$1”');
  const strip = s => s.replace(/\s*\[\d+(?:\s*[,–-]\s*\d+)*\]/g, '');
  const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  const parseQuote = s => { const t = clean(s); const m = t.match(/^(.*[”"])\s*[–—-]\s*(.+)$/) || t.match(/^(.*?)\s+[–—]\s+(.+)$/); const text = (m ? m[1] : t).replace(/^[“"]|[”"]$/g, '').trim(); return { text, by: m ? cap1(m[2].trim()) : '' }; };
  const sents = t => { const out = []; let start = 0, depth = 0; for (let i = 0; i < t.length; i++) { const c = t[i]; if (c === '“') depth++; else if (c === '”') depth = Math.max(0, depth - 1); if (/[.!?…]/.test(c)) { let j = i + 1; while (j < t.length && /[.!?…”’)"]/.test(t[j])) { if (t[j] === '”') depth = Math.max(0, depth - 1); j++; } if (j >= t.length) break; if (depth === 0 && t[j] === ' ' && /[A-Z“‘(0-9]/.test(t[j + 1] || '')) { out.push(t.slice(start, j).trim()); start = j + 1; i = j; } else i = j - 1; } } out.push(t.slice(start).trim()); return out.filter(Boolean); };
  const split = (t, ov) => {
    const S = sents(t);
    if (S.join(' ') !== t) throw new Error('sentence split lost text: ' + t.slice(0, 60));
    if (ov) { const cuts = [0, ...ov, S.length]; return cuts.slice(0, -1).map((c, i) => S.slice(c, cuts[i + 1]).join(' ')); }
    if (t.length <= 210 || S.length < 2) return [t];
    const k = Math.ceil(t.length / 200); let best = null, bs = 1e9;
    const rec = (st, left, parts) => { if (left === 1) { const p = [...parts, S.slice(st).join(' ')]; const sc = Math.max(...p.map(x => x.length)) - Math.min(...p.map(x => x.length)) * 0.3; if (sc < bs) { bs = sc; best = p; } return; } for (let c = st + 1; c <= S.length - (left - 1); c++) rec(c, left - 1, [...parts, S.slice(st, c).join(' ')]); };
    for (let kk = Math.min(k, S.length); kk >= 2; kk--) rec(0, kk, []);
    return best;
  };

  const build = (w, l) => {
    const n = l.num, src = SRC.course[n], dly = SRC.daily[n];
    const oq = l.sections.find(s => /opening quote/i.test(s.title)), cq = l.sections.find(s => /closing quote/i.test(s.title));
    const paras = src.body.map(p => clean(strip(p)));
    const ov = AU.OV[n] || {};
    const pieces = paras.map((p, i) => split(p, ov[i]));
    const starts = AU.S[n].split('|').map(x => { const i = x.indexOf(':'); return [+x.slice(0, i), x.slice(i + 1)]; });
    if (starts[0][0] !== 0) throw new Error('L' + n + ' sections must start at 0');
    const V = AU.V[n];
    const sections = starts.map(([a, title], si) => {
      const b = si + 1 < starts.length ? starts[si + 1][0] : paras.length;
      if (b <= a || b > paras.length) throw new Error('L' + n + ' bad section range');
      const items = [];
      for (let pi = a; pi < b; pi++) { if (V && V.at === pi) items.push({ k: 'viz', v: V }); pieces[pi].forEach(t => items.push({ k: 'body', t, p: pi })); }
      return { part: si + 1, title, items };
    });
    if (V && (V.at < 0 || V.at >= paras.length)) throw new Error('L' + n + ' viz out of range');
    let q = null;
    if (dly.q) {
      const Q = dly.q;
      const instr = Q.instr.split(/\s{2,}/).map(s => s.trim()).filter(Boolean).map(s => /[.!?]$/.test(s) ? s : s + '.').join(' ');
      const opts = Q.opts.map(o => { const m = o.match(/^([A-Z])\s+(.*)$/); if (!m) throw new Error('L' + n + ' option ' + o); return { L: m[1], t: clean(m[2]) }; });
      const fb = clean(Q.fb.join(' '));
      const km = fb.match(/^([A-Z](?:(?:,| and|, and) [A-Z])*) (?:is|are) the best answers?\.\s*/);
      let F;
      if (km) { const Ls = km[1].match(/[A-Z]/g); F = { best: opts.filter(o => Ls.includes(o.L)), items: fb.slice(km[0].length) ? split(fb.slice(km[0].length)) : [] }; }
      else { const S = sents(fb); F = { best: null, lead: S[0], items: S.length > 1 ? split(S.slice(1).join(' ')) : [] }; }
      q = { prompt: clean(Q.prompt), instr, multi: /all that fit/i.test(instr), opts, fb: F, reflect: !km };
    }
    const practice = dly.practice.map(p => clean(strip(p))).flatMap((p, pi) => split(p).map(t => ({ t, p: pi })));
    const done = clean(dly.done.join(' '));
    return {
      n, week: w.num, title: AU.T[n] || clean(src.title), pool: POOL[n] || ['sunrise', 'bench', 'compass'],
      openQ: oq && oq.paras[0] ? parseQuote(oq.paras[0]) : null, closeQ: cq && cq.paras[0] ? parseQuote(cq.paras[0]) : null,
      sections, q, practice, done, taskLabel: 'Today’s task', words: [...paras, ...(q ? [q.prompt] : [])].join(' ').split(/\s+/).length
    };
  };

  const LES = OLD.weeks.map(w => ({ w, Cs: w.lessons.map(l => build(w, l)) }));
  if (mode === 'collect') {
    const seen = new Set(), items = [];
    for (const { Cs } of LES) for (const C of Cs) for (const [s, t] of B.texts(C)) { const k = s + '|' + t; if (!seen.has(k)) { seen.add(k); items.push([s, t]); } }
    const styles = {}; for (const [k, v] of Object.entries(B.ST)) styles[k] = { fs: v.fs, lh: v.lh, fw: v.fw, ls: v.ls, wrap: v.wrap, w: v.w };
    await saveFile('gen/measure-in.json', JSON.stringify({ styles, items }));
    return { count: items.length, LES };
  }
  const M = JSON.parse(await readFile('gen/lines-v3.json'));
  B.setLines(new Map(Object.entries(M)));
  const files = (await ls()).filter(f => /^Week \d\d .*\.dc\.html$/.test(f)).sort();
  const stats = [];
  for (const { w, Cs } of LES) { const f = files.find(x => x.startsWith('Week ' + String(w.num).padStart(2, '0') + ' ')); const r = B.weekFile(w, Cs); if (mode === 'build') await saveFile(f, r.html); stats.push(...r.stats); }
  return { stats, LES, B };
})
