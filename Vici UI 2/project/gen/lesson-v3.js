// Lesson reader v3 — v2 page system + revised course content: authored sections, inline visualisations, question + answer pages, paginated practice.
// Pages: cover · quote · section · continuation · question · answer · quote · task (1–2) · complete.
// Type scale unchanged from v2: display 30/36 · title 24/31 · body 18/28 · small 15/22 · label 13/16 · UI 16/22. Visualisations use small/label sizes on CARD.
// Usage: const B = eval(src)(K, V4, BOUNDS, POOL); B.texts(C); B.setLines(map); B.weekFile(week, lessonsC)
(function (K, V4, BOUNDS, POOL) {
  const { INK, TXT, SUB, MUTE, LINE, ART, CARD, frame, caps, primary, check, closeX } = K;
  const ON_INK = K.ON_INK || '#111111';
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const pad2 = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const ZONE_TOP = 140, ZONE_BOTTOM = 128, LIFT = 24; // content box 560
  const MAXH = 330, MAXH_HERO = 480, MAXV = 520, MAXQ = 560, IDEAL = 230, PAGE_COST = 4000;
  const T_IDEAL = 300, T_MAX = 470, IN_PARA = 9000;
  const G = { heroText: 36, vizText: 28, labelTitle: 12, titleBody: 28, labelBody: 20, para: 22 };

  const ST = {
    display: { fs: 30, lh: 36, fw: 700, ls: -0.6, c: TXT, wrap: 'balance', w: 329 },
    title: { fs: 24, lh: 31, fw: 700, ls: -0.4, c: TXT, wrap: 'balance', w: 329 },
    body: { fs: 18, lh: 28, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 329 },
    small: { fs: 15, lh: 22, fw: 400, ls: 0, c: MUTE, wrap: 'pretty', w: 329 },
    label: { fs: 13, lh: 16, fw: 700, ls: 0.2, c: MUTE, wrap: 'balance', w: 329 },
    cardT: { fs: 16, lh: 22, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 247 },
    optQ: { fs: 16, lh: 22, fw: 400, ls: 0, c: TXT, wrap: 'pretty', w: 263 },
    fbT: { fs: 16, lh: 22, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 251 },
    chainT: { fs: 15, lh: 22, fw: 400, ls: 0, c: TXT, wrap: 'pretty', w: 263 },
    cmpL: { fs: 13, lh: 16, fw: 700, ls: 0.2, c: MUTE, wrap: 'balance', w: 127.5 },
    cmpT: { fs: 15, lh: 22, fw: 400, ls: 0, c: TXT, wrap: 'pretty', w: 127.5 },
    pairL: { fs: 15, lh: 22, fw: 700, ls: 0, c: TXT, wrap: 'pretty', w: 112 },
    pairR: { fs: 15, lh: 22, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 161 },
    pairRn: { fs: 15, lh: 22, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 229 },
    pairRl: { fs: 15, lh: 22, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 209 },
    vcap: { fs: 15, lh: 22, fw: 400, ls: 0, c: SUB, wrap: 'pretty', w: 289 }
  };
  const txt = (style, t, o = {}) => { const s = ST[style]; return `<div style="${o.mt ? `margin-top:${o.mt}px; ` : ''}font-size:${s.fs}px; font-weight:${s.fw}; line-height:${s.lh}px;${s.ls ? ` letter-spacing:${s.ls}px;` : ''} color:${o.color || s.c}; text-wrap:${s.wrap};${o.center ? ' text-align:center;' : ''}">${esc(t)}</div>`; };
  const label = (t, o = {}) => txt('label', t, o);

  let LINES = null;
  const lines = (style, t) => { if (!LINES) return 1; const v = LINES.get(style + '|' + t); if (v == null) throw new Error('unmeasured ' + style + ': ' + t.slice(0, 60)); return v; };
  const hOf = (style, t) => lines(style, t) * ST[style].lh;
  const setLines = (map) => { LINES = map; };

  // ── visualisations (all sit above the text they explain) ──
  const VIZ = {
    chain: {
      texts: v => v.steps.map(s => ['chainT', s]),
      h: v => 40 + (v.cap ? 30 : 0) + v.steps.reduce((a, s, i) => a + hOf('chainT', s) + (v.mark === i ? 32 : 0) + (i < v.steps.length - 1 ? 16 : 0), 0),
      html: v => {
        const n = v.steps.length;
        const rows = v.steps.map((s, i) => { const last = i === n - 1, m = v.mark === i;
          return `<div style="display:flex; gap:14px;"><div style="width:12px; flex-shrink:0; display:flex; flex-direction:column; align-items:center;"><div style="margin-top:5px; width:12px; height:12px; border-radius:6px; box-sizing:border-box; flex-shrink:0; ${m ? `background:${INK};` : `border:2px solid ${MUTE};`}"></div>${last ? '' : `<div style="flex:1; width:2px; margin-top:5px; background:${ART};"></div>`}</div><div style="flex:1; min-width:0; padding-bottom:${last ? 0 : 16}px;">${txt('chainT', s)}${m ? `<div style="margin-top:8px; display:flex;"><div style="height:24px; padding:0 10px; border-radius:12px; background:${INK}; display:flex; align-items:center; font-size:13px; font-weight:700; line-height:16px; color:${ON_INK}; white-space:nowrap;">${esc(v.tag)}</div></div>` : ''}</div></div>`; }).join('');
        return `<div style="border-radius:20px; background:${CARD}; padding:20px; box-sizing:border-box;">${v.cap ? label(v.cap) : ''}<div style="${v.cap ? 'margin-top:14px; ' : ''}display:flex; flex-direction:column;">${rows}</div></div>`;
      }
    },
    compare: {
      texts: v => v.items.flatMap(it => [['cmpL', it.l], ['cmpT', it.t]]),
      h: v => Math.max(...v.items.map(it => 32 + hOf('cmpL', it.l) + (it.v ? 39 : 0) + 8 + hOf('cmpT', it.t))),
      html: v => `<div style="display:flex; gap:10px; align-items:stretch;">${v.items.map((it, i) => `<div style="flex:1 1 0; min-width:0; border-radius:18px; background:${CARD}; padding:16px; box-sizing:border-box;${v.hi === i ? ` box-shadow:inset 0 0 0 1.5px ${INK};` : ''}">${txt('cmpL', it.l)}${it.v ? `<div style="margin-top:8px; font-size:24px; font-weight:700; line-height:31px; letter-spacing:-0.4px; color:${TXT}; white-space:nowrap;">${esc(it.v)}</div>` : ''}${txt('cmpT', it.t, { mt: 8 })}</div>`).join('')}</div>`
    },
    pairs: {
      kind: v => v.letters ? ['pairRl', 64] : v.narrow ? ['pairRn', 44] : ['pairR', 112],
      texts: v => { const [rs] = VIZ.pairs.kind(v); return v.rows.flatMap(r => [...(v.letters || v.narrow ? [] : [['pairL', r[0]]]), [rs, r[1]]]); },
      h: v => { const [rs] = VIZ.pairs.kind(v); return 12 + (v.head ? 38 : 0) + v.rows.reduce((a, r, i) => a + 28 + Math.max(v.letters ? 49 : v.narrow ? 22 : hOf('pairL', r[0]), hOf(rs, r[1])) + (i || v.head ? 1 : 0), 0); },
      html: v => {
        const [rs, WL] = VIZ.pairs.kind(v);
        const head = v.head ? `<div style="display:flex; gap:16px; padding:12px 0 10px;"><div style="width:${WL}px; flex-shrink:0;">${label(v.head[0])}</div><div style="flex:1; min-width:0;">${label(v.head[1])}</div></div>` : '';
        const left = r => v.letters ? `<div style="font-size:24px; font-weight:700; line-height:31px; color:${TXT};">${esc(r[0][0])}</div><div style="margin-top:2px; font-size:13px; font-weight:700; line-height:16px; letter-spacing:0.2px; color:${MUTE}; white-space:nowrap;">${esc(r[0])}</div>` : v.narrow ? `<div style="font-size:15px; font-weight:700; line-height:22px; color:${TXT};">${esc(r[0])}</div>` : txt('pairL', r[0]);
        const rows = v.rows.map((r, i) => `<div style="display:flex; gap:16px; padding:14px 0;${v.letters ? ' align-items:center;' : ''}${i || v.head ? ` border-top:1px solid ${LINE};` : ''}"><div style="width:${WL}px; flex-shrink:0;">${left(r)}</div><div style="flex:1; min-width:0;">${txt(rs, r[1])}</div></div>`).join('');
        return `<div style="border-radius:20px; background:${CARD}; padding:6px 20px; box-sizing:border-box;">${head}${rows}</div>`;
      }
    },
    wave: {
      texts: v => [['vcap', v.cap]],
      h: v => 40 + 144 + 16 + hOf('vcap', v.cap),
      html: v => {
        const MX = 40, MY = 50;
        const curve = 'M0 84 C28 82 52 14 96 10 C134 7 150 56 182 60 C206 63 214 38 236 40 C258 42 270 70 289 76';
        const svg = `<svg width="289" height="96" viewBox="0 0 289 96" style="position:absolute; left:0; top:32px; overflow:visible;"><path d="${curve} L289 88 L0 88 Z" fill="${ART}" fill-opacity="0.35"></path><path d="M0 88 H289" stroke="${ART}" stroke-width="1.5"></path><path d="${curve}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M${MX} -8 V88" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 4"></path><circle cx="${MX}" cy="${MY}" r="6" fill="${INK}" stroke="${CARD}" stroke-width="3"></circle></svg>`;
        return `<div style="border-radius:20px; background:${CARD}; padding:20px; box-sizing:border-box;"><div style="position:relative; height:144px;"><div style="position:absolute; left:${MX - 12}px; top:0; height:24px; padding:0 10px; border-radius:12px; background:${INK}; display:flex; align-items:center; font-size:13px; font-weight:700; line-height:16px; color:${ON_INK}; white-space:nowrap;">${esc(v.tag)}</div><div style="position:absolute; right:0; top:4px; font-size:13px; font-weight:700; line-height:16px; letter-spacing:0.2px; color:${MUTE};">Urge</div>${svg}<div style="position:absolute; right:0; top:128px; font-size:13px; font-weight:700; line-height:16px; letter-spacing:0.2px; color:${MUTE};">Time</div></div>${txt('vcap', v.cap, { mt: 16 })}</div>`;
      }
    },
    track: {
      texts: () => [],
      h: v => 40 + (v.cap ? 34 : 0) + 38,
      html: v => {
        const n = v.nodes.length, cw = 289 / n, cx = i => +(cw * i + cw / 2).toFixed(1);
        const nodes = v.nodes.map((t, i) => `<div style="position:absolute; left:${cx(i) - 6}px; top:0; width:12px; height:12px; border-radius:6px; box-sizing:border-box; ${i === 0 ? `background:${INK};` : `background:${CARD}; border:2px solid ${MUTE};`}"></div><div style="position:absolute; top:22px; left:${+(cw * i).toFixed(1)}px; width:${+cw.toFixed(1)}px; text-align:center; font-size:13px; font-weight:700; line-height:16px; letter-spacing:0.2px; color:${i === 0 ? TXT : MUTE}; white-space:nowrap;">${esc(t)}</div>`).join('');
        return `<div style="border-radius:20px; background:${CARD}; padding:20px; box-sizing:border-box;">${v.cap ? label(v.cap) : ''}<div style="position:relative; height:38px;${v.cap ? ' margin-top:18px;' : ''}"><div style="position:absolute; left:${cx(0)}px; right:${cx(0)}px; top:5px; height:2px; background:${ART};"></div>${nodes}</div></div>`;
      }
    },
    bars: {
      texts: () => [],
      h: v => 40 + (v.cap ? 32 : 0) + v.rows.length * 38 + (v.rows.length - 1) * 16,
      html: v => `<div style="border-radius:20px; background:${CARD}; padding:20px; box-sizing:border-box;">${v.cap ? label(v.cap) : ''}<div style="${v.cap ? 'margin-top:16px; ' : ''}display:flex; flex-direction:column; gap:16px;">${v.rows.map((r, i) => `<div><div style="display:flex; justify-content:space-between; gap:12px; font-size:15px; line-height:22px; color:${TXT};"><span style="font-weight:400; white-space:nowrap;">${esc(r[0])}</span><span style="font-weight:700; white-space:nowrap;">${esc(r[2])}</span></div><div style="margin-top:8px; height:8px; border-radius:4px; background:${LINE};"><div style="width:${r[1]}%; height:8px; border-radius:4px; background:${i === v.rows.length - 1 ? INK : MUTE};"></div></div></div>`).join('')}</div></div>`
    }
  };
  const vizH = v => VIZ[v.type].h(v);
  const vizHTML = (v, mt) => `<div style="${mt ? `margin-top:${mt}px; ` : ''}flex-shrink:0;">${VIZ[v.type].html(v)}</div>`;

  // every [style, text] whose line count drives layout
  const texts = (C) => {
    const out = [['display', C.title]];
    for (const s of C.sections) { out.push(['title', s.title]); for (const it of s.items) { if (it.k === 'viz') out.push(...VIZ[it.v.type].texts(it.v)); else out.push([it.k, it.t]); } }
    if (C.q) { out.push(['title', C.q.prompt], ['small', C.q.instr]); C.q.opts.forEach(o => out.push(['optQ', o.t])); const F = C.q.fb; if (F.best) F.best.forEach(o => out.push(['fbT', o.t])); else out.push(['title', F.lead]); F.items.forEach(t => out.push(['body', t])); }
    out.push(['title', C.title]); C.practice.forEach(x => out.push(['body', x.t])); out.push(['cardT', C.done]);
    return out;
  };

  // ── components ──
  const heroFit = k => { const [t, b] = BOUNDS[k]; const st = Math.floor(190 + (t - 190) * 1.1), sb = Math.ceil(190 + (b - 190) * 1.1); return { st, h: sb - st }; };
  const hero = (k) => { const { st, h } = heroFit(k); return `<div style="position:relative; width:393px; height:${h}px; margin:0 -32px; flex-shrink:0;">${V4.svg(k).replace('top:0px;', `top:${-st}px;`)}</div>`; };
  const block = (children, o = {}) => `<div style="position:absolute; left:32px; right:32px; top:${ZONE_TOP}px; bottom:${ZONE_BOTTOM}px; padding-bottom:${o.tall ? 0 : LIFT}px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:${o.top ? 'flex-start' : 'center'};${o.center ? ' text-align:center;' : ''}">${children.join('')}</div>`;
  const hint = `<div style="position:absolute; left:0; right:0; bottom:52px; display:flex; justify-content:center;"><div style="width:44px; height:44px; border-radius:22px; box-shadow:0 0 0 1.5px ${LINE}; display:flex; align-items:center; justify-content:center;"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" fill="none" stroke="${TXT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div>`;
  const quoteGlyph = `<div style="display:flex; justify-content:center;"><svg width="28" height="22" viewBox="0 0 28 22"><path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill="${ART}"></path></svg></div>`;
  const doneH = t => 36 + Math.max(28, ST.label.lh + 4 + hOf('cardT', t));
  const doneCard = (t, mt) => `<div style="margin-top:${mt}px; border-radius:20px; background:${CARD}; padding:18px 20px; box-sizing:border-box; display:flex; gap:14px; align-items:flex-start; flex-shrink:0;"><div style="width:28px; height:28px; border-radius:14px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check(ON_INK, 12)}</div><div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">${label('Done when')}${txt('cardT', t)}</div></div>`;

  // items: {k:'body', t} | {k:'viz', v} | {k:'done', t}
  const itH = it => it.k === 'viz' ? vizH(it.v) : it.k === 'done' ? doneH(it.t) : hOf(it.k, it.t);
  const gapOf = (a, b) => a.k === 'viz' ? G.vizText : b.k === 'done' ? 28 : G.para;
  const itemsH = items => items.reduce((a, it, i) => a + itH(it) + (i ? gapOf(items[i - 1], it) : 0), 0);
  const renderItems = (items, first) => items.map((it, i) => { const mt = i === 0 ? first : gapOf(items[i - 1], it); return it.k === 'viz' ? vizHTML(it.v, mt) : it.k === 'done' ? doneCard(it.t, mt) : txt(it.k, it.t, { mt }); }).join('');
  const headFirstH = title => ST.label.lh + G.labelTitle + hOf('title', title) + G.titleBody;
  const headContH = ST.label.lh + G.labelBody;

  // contiguous partition; a visualisation always opens its page and never ends one; the done card never starts one
  const paginate = (items, firstHead, o = {}) => {
    const ideal = o.ideal || IDEAL, maxT = o.max || MAXH;
    const n = items.length, best = Array(n + 1).fill(Infinity), prev = Array(n + 1).fill(-1); best[0] = 0;
    for (let j = 1; j <= n; j++) {
      for (let i = j - 1; i >= 0; i--) {
        const seg = items.slice(i, j);
        if (seg.slice(1).some(x => x.k === 'viz')) break;
        if (seg[seg.length - 1].k === 'viz') continue;
        if (seg[0].k === 'done') continue;
        if (best[i] === Infinity) continue;
        const v = seg[0].k === 'viz' ? itH(seg[0]) + G.vizText : 0;
        const fill = (i === 0 ? firstHead : headContH) + itemsH(seg);
        const textFill = fill - v, lim = v ? MAXV : maxT;
        if (fill > lim && seg.length > (v ? 2 : 1) + (seg[seg.length - 1].k === 'done' ? 1 : 0)) { if (!v) break; continue; }
        const d = textFill - ideal, cost = best[i] + d * d * (d > 0 ? 1.5 : 1) + PAGE_COST + (fill > lim ? 1e7 : 0) + (i > 0 && items[i - 1].p != null && items[i - 1].p === items[i].p ? IN_PARA : 0);
        if (cost < best[j]) { best[j] = cost; prev[j] = i; }
      }
    }
    const ranges = []; for (let j = n; j > 0; j = prev[j]) { if (prev[j] < 0) throw new Error('no pagination'); ranges.unshift([prev[j], j]); }
    return ranges;
  };

  // ── pages ──
  const readingHTML = (p) => {
    const lead = p.items[0].k === 'viz' ? p.items[0] : null, rest = lead ? p.items.slice(1) : p.items;
    const top = [...(p.hero ? [hero(p.hero)] : []), ...(lead ? [vizHTML(lead.v, 0)] : [])];
    const gap0 = p.hero ? G.heroText : lead ? G.vizText : 0;
    return block([...top, ...(p.kind === 'sec' ? [label(`Part ${p.part}`, { mt: gap0 }), txt('title', p.title, { mt: G.labelTitle }), renderItems(rest, G.titleBody)] : [renderItems(rest, gap0)])]) + hint;
  };
  const quotePage = (q) => ({ kind: 'quote', html: block([quoteGlyph, txt('title', q.text, { mt: 24, center: true }), ...(q.by ? [label(q.by, { mt: 18, center: true })] : [])], { center: true }) + hint });
  const coverPage = (C) => ({ kind: 'cover', html: block([hero(C.pool[0]), label(`Lesson ${C.n}`, { mt: G.heroText, center: true }), txt('display', C.title, { mt: G.labelTitle, center: true })], { center: true }) + primary('Begin') });

  const noteField = (mt) => `<div style="margin-top:${mt}px; height:48px; border-radius:24px; box-shadow:inset 0 0 0 1.5px ${LINE}; display:flex; align-items:center; gap:12px; padding:0 20px; box-sizing:border-box; flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 16 16" style="flex-shrink:0;"><path d="M3 13l1-3.5L10.5 3l2.5 2.5L6.5 12z" fill="none" stroke="${MUTE}" stroke-width="1.6" stroke-linejoin="round"></path></svg><div style="flex:1; min-width:0; font-size:16px; line-height:22px; color:${MUTE}; white-space:nowrap;">Add a note (optional)</div></div>`;
  const questionPage = (Q) => {
    const OPT = Q.opts.length >= 8 ? { h: 44, pv: 11, gap: 5, mt: 16 } : Q.opts.length >= 7 ? { h: 44, pv: 11, gap: 6, mt: 20 } : { h: 48, pv: 13, gap: 8, mt: 20 };
    const optsH = Q.opts.reduce((a, o, i) => a + Math.max(OPT.h, lines('optQ', o.t) * 22 + 2 * OPT.pv) + (i ? OPT.gap : 0), 0);
    const H = ST.label.lh + G.labelTitle + hOf('title', Q.prompt) + 8 + hOf('small', Q.instr) + OPT.mt + optsH;
    const mark = (o) => `<div style="width:24px; height:24px; border-radius:${Q.multi ? 7 : 12}px; box-shadow:inset 0 0 0 1.5px ${MUTE}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:12px; font-weight:700; line-height:16px; color:${SUB};">${o.L}</div>`;
    const list = `<div style="margin-top:${OPT.mt}px; display:flex; flex-direction:column; gap:${OPT.gap}px;">${Q.opts.map(o => `<div style="min-height:${OPT.h}px; border-radius:${OPT.h / 2}px; background:${CARD}; display:flex; align-items:center; gap:12px; padding:${OPT.pv}px 16px ${OPT.pv}px 14px; box-sizing:border-box;">${mark(o)}<div style="flex:1; min-width:0; font-size:16px; font-weight:400; line-height:22px; color:${TXT}; text-wrap:pretty;">${esc(o.t)}</div></div>`).join('')}</div>`;
    const scroll = H > MAXQ + LIFT;
    return { kind: 'q', fill: H, scroll, html: block([label('Question'), txt('title', Q.prompt, { mt: G.labelTitle }), txt('small', Q.instr, { mt: 8 }), list], { tall: H > MAXQ, top: scroll }) + (scroll ? `<div style="position:absolute; left:0; right:0; bottom:0; height:150px; background:linear-gradient(rgba(13,13,13,0), #0D0D0D 40%); z-index:5; pointer-events:none;"></div>` : '') + primary('Continue') };
  };
  const answerPage = (Q) => {
    const F = Q.fb;
    if (F.best) {
      const cards = F.best.map((o, i) => `<div style="${i ? 'margin-top:10px; ' : ''}border-radius:18px; background:${CARD}; padding:16px 18px; box-sizing:border-box; display:flex; gap:14px; align-items:flex-start;"><div style="width:28px; height:28px; border-radius:${Q.multi ? 8 : 14}px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:13px; font-weight:700; color:${ON_INK};">${o.L}</div><div style="flex:1; min-width:0; padding-top:3px;">${txt('fbT', o.t)}</div></div>`).join('');
      const H = ST.label.lh + 16 + F.best.reduce((a, o, i) => a + 32 + Math.max(28, hOf('fbT', o.t) + 3) + (i ? 10 : 0), 0) + (F.items.length ? G.titleBody + itemsH(F.items.map(t => ({ k: 'body', t }))) : 0);
      return { kind: 'a', fill: H, html: block([label(F.best.length > 1 ? 'Best answers' : 'Best answer'), `<div style="margin-top:16px;">${cards}</div>`, renderItems(F.items.map(t => ({ k: 'body', t })), G.titleBody)]) + primary('Continue') };
    }
    const H = ST.label.lh + G.labelTitle + hOf('title', F.lead) + (F.items.length ? G.titleBody + itemsH(F.items.map(t => ({ k: 'body', t }))) : 0) + 32 + 48;
    return { kind: 'a', fill: H, html: block([label('After choosing'), txt('title', F.lead, { mt: G.labelTitle }), renderItems(F.items.map(t => ({ k: 'body', t })), G.titleBody), noteField(32)]) + primary('Continue') };
  };
  const taskPages = (C) => {
    const items = [...C.practice.map(x => ({ k: 'body', t: x.t, p: x.p })), { k: 'done', t: C.done }];
    const head = headFirstH(C.title);
    const ranges = paginate(items, head, { ideal: T_IDEAL, max: T_MAX });
    return ranges.map(([a, b], ri) => {
      const seg = items.slice(a, b), first = ri === 0, last = ri === ranges.length - 1;
      const fill = (first ? head : 0) + itemsH(seg);
      const withHero = first && fill + G.heroText + heroFit(C.pool[0]).h <= MAXQ - 40;
      const kids = first ? [...(withHero ? [hero(C.pool[0])] : []), label(C.taskLabel, { mt: withHero ? G.heroText : 0 }), txt('title', C.title, { mt: G.labelTitle }), renderItems(seg, G.titleBody)] : [renderItems(seg, 0)];
      return { kind: 'task', fill: fill + (withHero ? G.heroText + heroFit(C.pool[0]).h : 0), html: block(kids) + (last ? primary('Finish lesson') : hint) };
    });
  };
  const completePage = (C) => ({ kind: 'done', html: block([`<div style="display:flex; justify-content:center;"><div style="width:96px; height:96px; border-radius:48px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check(ON_INK, 34)}</div></div>`, txt('display', 'Lesson complete.', { mt: G.heroText, center: true }), txt('body', C.q ? 'Your answers are saved to the log. One thing left today — the task.' : 'One thing left today — the task.', { mt: 14, center: true })], { center: true }) + primary('Done') });

  const lessonPages = (C) => {
    const pages = [coverPage(C)];
    if (C.openQ) pages.push(quotePage(C.openQ));
    for (const s of C.sections) {
      const head = headFirstH(s.title);
      paginate(s.items, head).forEach(([a, b], ri) => { const items = s.items.slice(a, b); const isSec = ri === 0; pages.push({ kind: isSec ? 'sec' : 'cont', part: s.part, title: s.title, items, viz: items[0].k === 'viz', fill: (isSec ? head : headContH) + itemsH(items) }); });
    }
    // mid-lesson illustrations: lightest reading pages that can hold one, away from visualisations, each other, and the cover
    const nRead = pages.length, vizAt = pages.map((p, i) => p.viz ? i : -1).filter(i => i >= 0);
    const maxH = vizAt.length ? 1 : 2;
    const cand = pages.map((p, i) => ({ p, i })).filter(x => (x.p.kind === 'sec' || x.p.kind === 'cont') && !x.p.viz && x.i >= 3 && x.i <= nRead - 2 && !vizAt.some(v => Math.abs(v - x.i) < 2)).sort((a, b) => a.p.fill - b.p.fill);
    const chosen = [];
    for (const x of cand) { if (chosen.length === maxH) break; const k = C.pool[chosen.length + 1] || C.pool[1]; if (x.p.fill + G.heroText + heroFit(k).h > MAXH_HERO) continue; if (chosen.some(c => Math.abs(c.i - x.i) < 3)) continue; chosen.push(x); }
    chosen.sort((a, b) => a.i - b.i).forEach((x, ci) => { const k = C.pool[ci + 1]; if (x.p.fill + G.heroText + heroFit(k).h <= MAXH_HERO) { x.p.hero = k; x.p.fill += G.heroText + heroFit(k).h; } });
    pages.forEach(p => { if (p.kind === 'sec' || p.kind === 'cont') p.html = readingHTML(p); });
    if (C.q) { pages.push(questionPage(C.q)); pages.push(answerPage(C.q)); }
    if (C.closeQ) pages.push(quotePage(C.closeQ));
    pages.push(...taskPages(C));
    pages.push(completePage(C));
    return pages;
  };

  const chrome = (n, idx, total) => `<div style="position:absolute; left:22px; top:60px; height:40px; display:flex; align-items:center; z-index:5;">${closeX()}</div>
${idx === 1 ? '' : `<div style="position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:center; z-index:4;">${caps(`Lesson ${n}`, { center: true })}</div>`}
<div style="position:absolute; left:24px; right:24px; top:108px; height:3px; border-radius:2px; background:${LINE};"><div style="width:${Math.round(idx / total * 100)}%; height:3px; border-radius:2px; background:${INK};"></div></div>`;
  const lessonFrames = (C) => {
    const pages = lessonPages(C); const total = pages.length;
    return pages.map((p, i) => ({ kind: p.kind, fill: p.fill, scroll: p.scroll, viz: p.viz, label: `L${C.n} Frame ${i + 1}`, note: `Lesson ${C.n} · ${i + 1} of ${total}`, html: frame(`L${C.n} Frame ${i + 1}`, `${chrome(C.n, i + 1, total)}\n${p.html}`) }));
  };

  const pill = (t) => `<div style="align-self:flex-start; background:#FFFFFF; color:#5F5B55; font-family:'Lato',system-ui,sans-serif; font-size:12px; font-weight:700; letter-spacing:0.4px; padding:8px 12px; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.08);">${t}</div>`;
  const weekFile = (week, Cs) => {
    const stats = [];
    const lessons = Cs.map(C => {
      const frames = lessonFrames(C); stats.push(...frames.map(f => ({ L: C.n, kind: f.kind, fill: f.fill, scroll: f.scroll, viz: f.viz })));
      return `<div style="display:flex; flex-direction:column; gap:22px;">
${pill(`Week ${ROM[week.num - 1]} · ${week.name} — Lesson ${pad2(C.n)} · ${esc(C.title)} · ${frames.length} frames`)}
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

  return { ST, VIZ, texts, setLines, lessonPages, lessonFrames, weekFile, heroFit };
})
