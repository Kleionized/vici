// Lesson reader v2 — one strict page system for all 84 lessons.
// Pages: cover · quote · section (Part label + title + body) · continuation (Part label + body) · question · task · task options · complete.
// Type scale: display 30/36 · title 24/31 · body 18/28 (strong = bold white) · small 15/22 · label 13/16 · UI 16/22.
// Illustrations always sit above the text. Every page's content block is optically centred in the same zone.
// Usage: const B = eval(src)(K, V4, META, DATA, BOUNDS, POOL); B.content(week, lesson); B.texts(C); B.setLines(map); B.weekFile(week)
(function (K, V4, META, DATA, BOUNDS, POOL) {
  const { INK, TXT, SUB, MUTE, LINE, ART, CARD, frame, caps, primary, check, chevronR, closeX } = K;
  const ON_INK = K.ON_INK || '#111111';
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const pad2 = n => String(n).padStart(2, '0');

  // ── geometry ──
  const ZONE_TOP = 140, ZONE_BOTTOM = 128, LIFT = 24; // content box 852-140-128-24 = 560
  const MAXH = 330, MAXH_HERO = 480, MAXQ = 560, IDEAL = 230, PAGE_COST = 4000;
  const G = { heroText: 36, labelTitle: 12, titleBody: 28, labelBody: 20, para: 22, ladder: 10 };

  // ── type scale ──
  const ST = {
    display: { fs: 30, lh: 36, fw: 700, ls: -0.6, c: TXT, wrap: 'balance', w: 329 },
    title: { fs: 24, lh: 31, fw: 700, ls: -0.4, c: TXT, wrap: 'balance', w: 329 },
    body: { fs: 18, lh: 28, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 329 },
    strong: { fs: 18, lh: 28, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 329 },
    small: { fs: 15, lh: 22, fw: 400, ls: 0, c: MUTE, wrap: 'pretty', w: 329 },
    label: { fs: 13, lh: 16, fw: 700, ls: 0.2, c: MUTE, wrap: 'balance', w: 329 },
    opt: { fs: 16, lh: 22, fw: 400, ls: 0, c: TXT, wrap: 'pretty', w: 289 },
    cardT: { fs: 16, lh: 22, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 247 },
    accT: { fs: 16, lh: 22, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 261 },
    accB: { fs: 15, lh: 22, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 289 }
  };
  const txt = (style, t, o = {}) => { const s = ST[style]; return `<div style="${o.mt ? `margin-top:${o.mt}px; ` : ''}font-size:${s.fs}px; font-weight:${s.fw}; line-height:${s.lh}px;${s.ls ? ` letter-spacing:${s.ls}px;` : ''} color:${o.color || s.c}; text-wrap:${s.wrap};${o.center ? ' text-align:center;' : ''}">${t}</div>`; };

  // ── measured line counts (filled by setLines; default 1 while collecting) ──
  let LINES = null;
  const lines = (style, t) => { if (!LINES) return 1; const v = LINES.get(style + '|' + t); if (v == null) throw new Error('unmeasured ' + style + ': ' + t.slice(0, 60)); return v; };
  const hOf = (style, t) => lines(style, t) * ST[style].lh;

  // ── copy ──
  const PATCH = {
    74: [['there always seems to be another day.', 'there always seems to be another day.¶Which good part of life do you keep postponing?']],
    27: [['Which of these could you actually do within a few minutes: leave the room, walk outside, shower, exercise briefly, or go somewhere other people are?', 'Which of these could you actually do within a few minutes?']],
    45: [['What do you usually say to yourself after a relapse? “I\'m pathetic.” “I have no discipline.” “I\'ve ruined everything.” “I should have known better.”', 'What do you usually say to yourself after a relapse?¶“I\'m pathetic”¶“I have no discipline”¶“I\'ve ruined everything”¶“I should have known better”'], ['the phone disappears from the analysis, now you are debating your worth, or whether you will ever be normal, and or what kind of person you are.', 'the phone disappears from the analysis. Now you are debating your worth, whether you will ever be normal, or what kind of person you are.']]
  };
  const patch = (n, p) => (PATCH[n] || []).reduce((s, [a, b]) => s.split(a).join(b), p);
  const clean = s => (s || '').replace(/\s+/g, ' ').trim().replace(/'/g, '’').replace(/"([^"]*)"/g, '“$1”');
  const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  const parseQuote = s => {
    const t = clean(s);
    const m = t.match(/^(.*[”"])\s*[–—-]\s*(.+)$/) || t.match(/^(.*?)\s+[–—]\s+(.+)$/);
    const text = (m ? m[1] : t).replace(/^[“"]|[”"]$/g, '').trim();
    return { text, by: m ? cap1(m[2].trim()) : '' };
  };
  const isOptionLike = s => s.length <= 72 && !/[.!?…:][”’)]*$/.test(s) && !/^[•\[]/.test(s);
  const isQuoted = t => /^[“‘]/.test(t) && /[”’]$/.test(t) && t.length <= 90;
  const kindOf = t => /:$/.test(t) ? 'body' : (t.length <= 52 || isQuoted(t)) ? 'strong' : 'body';
  // split very long paragraphs once, at the sentence boundary nearest the middle (abbreviation- and quote-aware)
  const ABBR = /(?:\b(?:a\.m|p\.m|e\.g|i\.e|etc|vs|Dr|Mr|Mrs|Ms|St|No))\.$/;
  const SPLIT = 200;
  const splitPara = t => {
    if (t.length <= SPLIT) return [t];
    const cuts = []; let depth = 0;
    for (let i = 0; i < t.length - 1; i++) {
      const ch = t[i];
      if (ch === '“') depth++; else if (ch === '”') depth = Math.max(0, depth - 1);
      if (/[.!?…]/.test(ch) && depth === 0) {
        let j = i + 1; while (/[”’)]/.test(t[j] || '')) j++;
        if (t[j] === ' ' && /[A-Z“‘(]/.test(t[j + 1] || '') && !ABBR.test(t.slice(Math.max(0, i - 4), i + 1))) cuts.push(j);
      }
    }
    if (!cuts.length) return [t];
    const mid = t.length / 2; const c = cuts.reduce((a, b) => Math.abs(b - mid) < Math.abs(a - mid) ? b : a);
    if (c < 70 || t.length - c < 70) return [t];
    return [...splitPara(t.slice(0, c).trim()), ...splitPara(t.slice(c).trim())];
  };

  // ── structured content for one lesson ──
  const content = (week, lesson) => {
    const n = lesson.num, M = META[n] || {}, pool = POOL[n] || ['sunrise', 'bench', 'compass'];
    const secs = lesson.sections.map(s => ({ title: s.title, paras: s.paras.flatMap(p => patch(n, p).split('¶')) }));
    const openQ = secs.find(s => /opening quote/i.test(s.title)), closeQ = secs.find(s => /closing quote/i.test(s.title));
    const taskSec = secs.find(s => /task/i.test(s.title));
    const body = secs.filter(s => s !== openQ && s !== closeQ && s !== taskSec);
    const words = secs.reduce((a, s) => a + s.paras.join(' ').split(/\s+/).length, 0);
    const sections = body.map((sec, si) => {
      const paras = sec.paras.map(clean).filter(Boolean);
      let qIdx = -1, optEnd = -1, qText = '', helper = '';
      for (let i = 0; i < paras.length; i++) {
        const m = paras[i].match(/^(.*\?)\s+((?:Select|Pick|Choose)[^?]*\.)$/);
        const q = m ? m[1] : /\?$/.test(paras[i]) ? paras[i] : '';
        if (!q || q.length > 160) continue;
        let j = i + 1; while (j < paras.length && isOptionLike(paras[j])) j++;
        if (j - i - 1 >= 3) { qIdx = i; optEnd = j; qText = q; helper = m ? m[2] : ''; break; }
      }
      const segs = []; let cur = [];
      const flush = () => { if (cur.length) segs.push({ kind: 'paras', items: cur }); cur = []; };
      paras.forEach((t, i) => {
        if (i === qIdx) { flush(); segs.push({ kind: 'q', q: qText, helper: helper || 'Pick the one that fits best.', opts: paras.slice(i + 1, optEnd) }); return; }
        if (qIdx >= 0 && i > qIdx && i < optEnd) return;
        for (const piece of splitPara(t)) cur.push({ t: piece, k: kindOf(piece) });
      });
      flush();
      return { part: si + 1, title: clean(sec.title), segs };
    }).filter(s => s.segs.length);
    const tParas = (taskSec ? taskSec.paras : []).map(clean);
    const summary = (tParas.find(t => /^\[TaskSummary\]/.test(t)) || '').replace(/^\[TaskSummary\]\s*/, '');
    const introT = tParas.find(t => !/^\[/.test(t) && !/^•/.test(t)) || '';
    const bullets = tParas.filter(t => /^•/.test(t)).map(t => { const m = t.replace(/^•\s*/, '').match(/^([^:]+):\s*(.+)$/); return m ? [m[1], m[2]] : [t.replace(/^•\s*/, ''), '']; });
    const doneTxt = clean((M.done || '').replace(/^Done when\s*/i, ''));
    const task = {
      label: /tonight/i.test(taskSec ? taskSec.title : '') ? 'Tonight’s task' : 'Today’s task',
      title: clean(M.t || summary || lesson.title), sub: clean(M.sub || introT),
      done: doneTxt ? cap1(doneTxt) : summary,
      optsTitle: clean(M.i2 || 'Pick what fits'),
      opts: (M.opts && M.opts.length ? M.opts.map(o => [clean(o[1]), clean(o[2])]) : bullets).slice(0, 4)
    };
    return {
      n, week, title: lesson.title, pool, mins: Math.max(3, Math.round(words / 140)),
      openQ: openQ && openQ.paras[0] ? parseQuote(openQ.paras[0]) : null,
      closeQ: closeQ && closeQ.paras[0] ? parseQuote(closeQ.paras[0]) : null,
      sections, task
    };
  };

  // every text whose line count drives layout, in a fixed order
  const texts = (C) => {
    const out = [['display', C.title]];
    for (const s of C.sections) { out.push(['title', s.title]); for (const g of s.segs) { if (g.kind === 'paras') g.items.forEach(it => out.push([it.k, it.t])); else { out.push(['title', g.q]); g.opts.forEach(o => out.push(['opt', o])); } } }
    out.push(['title', C.task.title], ['body', C.task.sub], ['cardT', C.task.done], ['title', C.task.optsTitle]);
    C.task.opts.forEach((o, i) => { out.push(['accT', o[0]]); if (i === 0) out.push(['accB', o[1]]); });
    return out;
  };
  const setLines = (map) => { LINES = map; };

  // ── components ──
  const heroFit = k => { const [t, b] = BOUNDS[k]; const st = Math.floor(190 + (t - 190) * 1.1), sb = Math.ceil(190 + (b - 190) * 1.1); return { st, h: sb - st }; };
  const hero = (k) => { const { st, h } = heroFit(k); return `<div style="position:relative; width:393px; height:${h}px; margin:0 -32px; flex-shrink:0;">${V4.svg(k).replace('top:0px;', `top:${-st}px;`)}</div>`; };
  const block = (children, o = {}) => `<div style="position:absolute; left:32px; right:32px; top:${ZONE_TOP}px; bottom:${ZONE_BOTTOM}px; padding-bottom:${o.tall ? 0 : LIFT}px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:${o.top ? 'flex-start' : 'center'};${o.center ? ' text-align:center;' : ''}">${children.join('')}</div>`;
  const hint = `<div style="position:absolute; left:0; right:0; bottom:52px; display:flex; justify-content:center;"><div style="width:44px; height:44px; border-radius:22px; box-shadow:0 0 0 1.5px ${LINE}; display:flex; align-items:center; justify-content:center;"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" fill="none" stroke="${TXT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div>`;
  const quoteGlyph = `<div style="display:flex; justify-content:center;"><svg width="28" height="22" viewBox="0 0 28 22"><path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill="${ART}"></path></svg></div>`;
  const gapOf = (a, b) => (/:$/.test(a.t) || (a.k === 'strong' && b.k === 'strong' && isQuoted(a.t) === isQuoted(b.t))) ? G.ladder : G.para;
  const bodyGroup = (items, first) => items.map((it, i) => txt(it.k, it.t, { mt: i === 0 ? first : gapOf(items[i - 1], it) })).join('');
  const itemsH = items => items.reduce((a, it, i) => a + hOf(it.k, it.t) + (i ? gapOf(items[i - 1], it) : 0), 0);
  const headFirstH = title => ST.label.lh + G.labelTitle + hOf('title', title) + G.titleBody;
  const headContH = ST.label.lh + G.labelBody;

  // ── pagination: contiguous partition minimising deviation from IDEAL ──
  const canBreak = (items, i) => { const a = items[i - 1], b = items[i]; if (/:$/.test(a.t) || /^[a-z…]/.test(b.t)) return false; if (isOptionLike(a.t) && isOptionLike(b.t)) return false; if (a.k === 'strong' && b.k === 'strong') { let s = i - 1; while (s > 0 && items[s - 1].k === 'strong') s--; let e = i; while (e < items.length - 1 && items[e + 1].k === 'strong') e++; if (e - s + 1 <= 4) return false; } return true; };
  const paginate = (items, firstHead) => {
    const n = items.length, best = Array(n + 1).fill(Infinity), prev = Array(n + 1).fill(-1); best[0] = 0;
    for (let j = 1; j <= n; j++) {
      for (let i = j - 1; i >= 0; i--) {
        const fill = (i === 0 ? firstHead : headContH) + itemsH(items.slice(i, j));
        if (fill > MAXH && j - i > 1) break;
        if (i > 0 && !canBreak(items, i)) continue;
        if (best[i] === Infinity) continue;
        const d = fill - IDEAL, cost = best[i] + d * d * (d > 0 ? 1.5 : 1) + PAGE_COST + (fill > MAXH ? 1e7 : 0);
        if (cost < best[j]) { best[j] = cost; prev[j] = i; }
      }
    }
    const ranges = []; for (let j = n; j > 0; j = prev[j]) { if (prev[j] < 0) throw new Error('no pagination'); ranges.unshift([prev[j], j]); }
    return ranges;
  };

  // ── pages ──
  const OPT = { h: 48, pv: 13, gap: 8 };
  const optsH = (opts, m) => opts.reduce((a, o, i) => a + Math.max(m.h, lines('opt', o) * 22 + 2 * m.pv) + (i ? m.gap : 0), 0);
  const questionPage = (part, q, opts, helper, first) => {
    const head = (first ? ST.label.lh + G.labelTitle : 0) + hOf('title', q) + 8 + ST.small.lh + 20;
    const m = OPT, H = head + optsH(opts, m);
    const list = `<div style="margin-top:20px; display:flex; flex-direction:column; gap:${m.gap}px;">${opts.map((t, i) => `<div style="min-height:${m.h}px; border-radius:${m.h / 2}px; background:${i === 0 ? INK : CARD}; display:flex; align-items:center; padding:${m.pv}px 20px; box-sizing:border-box;"><div style="flex:1; min-width:0; font-size:16px; font-weight:400; line-height:22px; color:${i === 0 ? ON_INK : TXT}; text-wrap:pretty;">${t}</div></div>`).join('')}</div>`;
    const scroll = H > MAXQ + LIFT + 6;
    return { kind: 'q', fill: H, scroll, html: block([...(first ? [txt('label', `Part ${part}`)] : []), txt('title', q, { mt: first ? G.labelTitle : 0 }), txt('small', helper, { mt: 8 }), list], { tall: H > MAXQ, top: scroll }) + (scroll ? `<div style="position:absolute; left:0; right:0; bottom:0; height:150px; background:linear-gradient(rgba(13,13,13,0), #0D0D0D 40%); z-index:5; pointer-events:none;"></div>` : '') + primary('Continue') };
  };
  const readingHTML = (p) => block([
    ...(p.hero ? [hero(p.hero)] : []),
    ...(p.kind === 'sec' ? [txt('label', `Part ${p.part}`, { mt: p.hero ? G.heroText : 0 }), txt('title', p.title, { mt: G.labelTitle }), bodyGroup(p.items, G.titleBody)] : [bodyGroup(p.items, p.hero ? G.heroText : 0)])
  ]) + hint;
  const quotePage = (q) => ({ kind: 'quote', html: block([quoteGlyph, txt('title', q.text, { mt: 24, center: true }), ...(q.by ? [txt('label', q.by, { mt: 18, center: true })] : [])], { center: true }) + hint });
  const coverPage = (C) => { const H = heroFit(C.pool[0]).h + G.heroText + ST.label.lh + G.labelTitle + hOf('display', C.title); return { kind: 'cover', fill: H, html: block([hero(C.pool[0]), txt('label', `Lesson ${C.n}`, { mt: G.heroText, center: true }), txt('display', C.title, { mt: G.labelTitle, center: true })], { center: true }) + primary('Begin') }; };
  const taskPage = (C) => {
    const T = C.task, cardH = 36 + Math.max(28, ST.label.lh + 4 + hOf('cardT', T.done));
    const base = G.heroText + ST.label.lh + G.labelTitle + hOf('title', T.title) + (T.sub ? 12 + hOf('body', T.sub) : 0) + 28 + cardH;
    const withHero = base + heroFit(C.pool[0]).h <= MAXQ;
    const card = `<div style="margin-top:28px; border-radius:20px; background:${CARD}; padding:18px 20px; box-sizing:border-box; display:flex; gap:14px; align-items:flex-start;"><div style="width:28px; height:28px; border-radius:14px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check(ON_INK, 12)}</div><div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">${txt('label', 'Done when')}${txt('cardT', T.done)}</div></div>`;
    return { kind: 'task', fill: withHero ? base + heroFit(C.pool[0]).h : base - G.heroText, html: block([...(withHero ? [hero(C.pool[0])] : []), txt('label', T.label, { mt: withHero ? G.heroText : 0 }), txt('title', T.title, { mt: G.labelTitle }), ...(T.sub ? [txt('body', T.sub, { mt: 12 })] : []), card]) + primary('Set it up') };
  };
  const taskOptsPage = (C) => {
    const T = C.task; if (!T.opts.length) return null;
    const acc = (o, open) => open
      ? `<div style="border-radius:18px; background:${CARD}; padding:18px 20px; box-sizing:border-box;"><div style="display:flex; align-items:flex-start; gap:14px;"><div style="flex:1; min-width:0;">${txt('accT', o[0])}</div><div style="height:22px; display:flex; align-items:center;"><div style="transform:rotate(90deg); display:flex;">${chevronR(TXT)}</div></div></div>${o[1] ? txt('accB', o[1], { mt: 8 }) : ''}</div>`
      : `<div style="border-radius:18px; background:${CARD}; padding:17px 20px; box-sizing:border-box; display:flex; align-items:center; gap:14px;"><div style="flex:1; min-width:0;">${txt('accT', o[0])}</div>${chevronR(ART)}</div>`;
    const H = hOf('title', T.optsTitle) + 28 + T.opts.reduce((a, o, i) => a + (i === 0 ? 36 + hOf('accT', o[0]) + (o[1] ? 8 + hOf('accB', o[1]) : 0) : 34 + hOf('accT', o[0])) + (i ? 12 : 0), 0);
    return { kind: 'opts', fill: H, html: block([txt('title', T.optsTitle), `<div style="margin-top:28px; display:flex; flex-direction:column; gap:12px;">${T.opts.map((o, i) => acc(o, i === 0)).join('')}</div>`]) + primary('Done') };
  };
  const completePage = () => ({ kind: 'done', html: block([`<div style="display:flex; justify-content:center;"><div style="width:96px; height:96px; border-radius:48px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check(ON_INK, 34)}</div></div>`, txt('display', 'Lesson complete.', { mt: G.heroText, center: true }), txt('body', 'Your answers are saved to the log. One thing left today — the task.', { mt: 14, center: true })], { center: true }) + primary('Done') });

  const lessonPages = (week, lesson) => {
    const C = content(week, lesson); const pages = [];
    pages.push(coverPage(C));
    if (C.openQ) pages.push(quotePage(C.openQ));
    for (const s of C.sections) {
      let first = true;
      for (const g of s.segs) {
        if (g.kind === 'q') { pages.push(questionPage(s.part, g.q, g.opts, g.helper, first)); first = false; continue; }
        const head = first ? headFirstH(s.title) : headContH;
        paginate(g.items, head).forEach(([a, b], ri) => { const isSec = first && ri === 0; const items = g.items.slice(a, b); pages.push({ kind: isSec ? 'sec' : 'cont', part: s.part, title: s.title, items, fill: (isSec ? head : headContH) + itemsH(items) }); });
        first = false;
      }
    }
    // mid-lesson illustrations: the two lightest reading pages that can hold one, kept apart from each other and from the cover/task art
    const firstTask = pages.length + (C.closeQ ? 1 : 0);
    const cand = pages.map((p, i) => ({ p, i })).filter(x => (x.p.kind === 'sec' || x.p.kind === 'cont') && x.i >= 3 && x.i <= firstTask - 2).sort((a, b) => a.p.fill - b.p.fill);
    const chosen = [];
    for (const x of cand) { if (chosen.length === 2) break; const k = C.pool[chosen.length + 1] || C.pool[1]; if (x.p.fill + G.heroText + heroFit(k).h > MAXH_HERO) continue; if (chosen.some(c => Math.abs(c.i - x.i) < 3)) continue; chosen.push(x); }
    chosen.sort((a, b) => a.i - b.i).forEach((x, ci) => { const k = C.pool[ci + 1]; if (x.p.fill + G.heroText + heroFit(k).h <= MAXH_HERO) { x.p.hero = k; x.p.fill += G.heroText + heroFit(k).h; } });
    pages.forEach(p => { if (p.kind === 'sec' || p.kind === 'cont') p.html = readingHTML(p); });
    if (C.closeQ) pages.push(quotePage(C.closeQ));
    pages.push(taskPage(C));
    const op = taskOptsPage(C); if (op) pages.push(op);
    pages.push(completePage());
    return { C, pages };
  };

  const chrome = (n, idx, total) => `<div style="position:absolute; left:22px; top:60px; height:40px; display:flex; align-items:center; z-index:5;">${closeX()}</div>
${idx === 1 ? '' : `<div style="position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:center; z-index:4;">${caps(`Lesson ${n}`, { center: true })}</div>`}
<div style="position:absolute; left:24px; right:24px; top:108px; height:3px; border-radius:2px; background:${LINE};"><div style="width:${Math.round(idx / total * 100)}%; height:3px; border-radius:2px; background:${INK};"></div></div>`;
  const lessonFrames = (week, lesson) => {
    const { pages } = lessonPages(week, lesson); const total = pages.length;
    return pages.map((p, i) => ({ kind: p.kind, fill: p.fill, scroll: p.scroll, label: `L${lesson.num} Frame ${i + 1}`, note: `Lesson ${lesson.num} · ${i + 1} of ${total}`, html: frame(`L${lesson.num} Frame ${i + 1}`, `${chrome(lesson.num, i + 1, total)}\n${p.html}`) }));
  };

  const pill = (t) => `<div style="align-self:flex-start; background:#FFFFFF; color:#5F5B55; font-family:'Lato',system-ui,sans-serif; font-size:12px; font-weight:700; letter-spacing:0.4px; padding:8px 12px; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.08);">${t}</div>`;
  const weekFile = (week) => {
    const stats = [];
    const lessons = week.lessons.map(l => {
      const frames = lessonFrames(week, l); stats.push(...frames.map(f => ({ L: l.num, kind: f.kind, fill: f.fill, scroll: f.scroll })));
      return `<div style="display:flex; flex-direction:column; gap:22px;">
${pill(`Week ${ROM[week.num - 1]} · ${week.name} — Lesson ${pad2(l.num)} · ${l.title} · ${frames.length} frames`)}
<div style="display:flex; gap:26px; align-items:flex-start;">
${frames.map(f => `<div style="display:flex; flex-direction:column; gap:14px; flex-shrink:0;">${pill(f.note)}${f.html}</div>`).join('\n')}
</div></div>`;
    });
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<meta name="design_doc_mode" content="canvas">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  body { margin:0; background:#E9E7E1; background-image:linear-gradient(rgba(40,38,32,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(40,38,32,0.07) 1px, transparent 1px); background-size:28px 28px; }
  a { color:#1D1C1A; } a:hover { color:#5F5B55; }
</style>
</helmet>
<div style="display:flex; flex-direction:column; gap:72px; padding:72px; width:max-content;">
${lessons.join('\n')}
</div>
</x-dc>
</body>
</html>
`;
    return { html, stats };
  };

  return { ST, txt, content, texts, setLines, lessonPages, lessonFrames, weekFile, heroFit };
})
