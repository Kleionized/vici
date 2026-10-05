// Lesson reader generator — all 84 lessons from lessons.json in the unified dark style.
// Usage: const build = eval(await readFile('gen/mono-lessons.js')); const { lessonFrames, weekFile } = build(K, META, lessonsJson);
(function (K, META, DATA) {
  const { INK, TXT, SUB, MUTE, LINE, ART, CARD, GROUND, FONT, frame, h1, p, caps, primary, stack, options, card, check, chevronR, closeX, H, roman } = K;
  const W = '#FFFFFF';
  const sp = (h) => `<div style="height:${h}px;"></div>`;
  const rom = (n) => (typeof roman === 'function' ? roman(n) : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n - 1]);

  // ── type tiers (the only four used in a lesson) ──
  const display = (t, o = {}) => `<div style="font-size:34px; font-weight:700; letter-spacing:-0.8px; line-height:40px; color:${o.color || TXT}; text-wrap:pretty; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const stmt = (t, o = {}) => `<div style="font-size:28px; font-weight:700; letter-spacing:-0.6px; line-height:36px; color:${o.color || TXT}; text-wrap:pretty; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const body = (t, o = {}) => `<div style="font-size:19px; font-weight:${o.weight || 400}; line-height:30px; color:${o.color || SUB}; text-wrap:pretty; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const meta = (t, o = {}) => `<div style="font-size:15px; font-weight:400; line-height:22px; color:${o.color || MUTE}; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const mid = (children, o = {}) => `<div style="position:absolute; left:32px; right:32px; top:${o.top ?? 140}px; bottom:${o.bottom ?? 120}px; display:flex; flex-direction:column; justify-content:center; gap:${o.gap ?? 22}px; ${o.center ? 'align-items:center; text-align:center;' : ''}">${children.join('')}</div>`;
  const head = (n, t) => `<div style="display:flex; flex-direction:column; gap:14px;">${caps(`Part ${n}`)}${stmt(t)}</div>`;

  // ── hero pools per lesson [cover/task, mid A, mid B] ──
  const POOL = {"1":["nightPhone","bed","charger"],"2":["sunrise","notebook","openDoor"],"3":["bench","signpost","sneaker"],"4":["bed","clock","lamp"],"5":["books","pencil","notebook"],"6":["twoCups","envelope","bench"],"7":["cake","calendar","flag"],"8":["calendar","chartUp","notebook"],"9":["sunrise","halfMast","compass"],"10":["scale","dominoes","signpost"],"11":["chartUp","mountain","hourglass"],"12":["idCard","mirror","flag"],"13":["compass","scale","fountainPen"],"14":["signpost","sneaker","flag"],"15":["stopwatch","thermometer","hourglass"],"16":["thermometer","bubbles","brain"],"17":["sneaker","openDoor","stairs"],"18":["signpost","compass","door"],"19":["kettle","bed","twoCups"],"20":["lighthouse","hourglass","bench"],"21":["shower","bed","clock"],"22":["brain","battery","bell"],"23":["brain","compass","kettle"],"24":["kettle","bed","battery"],"25":["thunderCloud","twoCups","bench"],"26":["tab","feedOff","phoneTable"],"27":["shower","sneaker","thermometer"],"28":["dominoes","compass","phoneTable"],"29":["scale","hourglass","balloon"],"30":["tab","feedOff","scale"],"31":["envelopeOpen","mirror","calendar"],"32":["clock","battery","hourglass"],"33":["calendar","hourglass","halfMast"],"34":["scale","chartUp","sunrise"],"35":["scale","plant","sunrise"],"36":["battery","stopwatch","match"],"37":["sneaker","dominoes2","stopwatch"],"38":["halfMast","mirror","thunderCloud"],"39":["compass","sneaker","calendar"],"40":["thunderCloud","bubbles","brain"],"41":["signpost","compass","door"],"42":["umbrella","halfMast","sunrise"],"43":["halfMast","sunrise","lighthouse"],"44":["notebook","clipboard","pencil"],"45":["mirror","umbrella","twoCups"],"46":["thunderCloud","umbrella","kettle"],"47":["mountain","umbrella","lighthouse"],"48":["door","envelopeOpen","stairs"],"49":["calendar","sunrise","stopwatch"],"50":["clock","phoneTable","hourglass"],"51":["tab","feedOff","bench"],"52":["bench","lighthouse","hourglass"],"53":["phoneTable","charger","clock"],"54":["feedOff","plant","sunrise"],"55":["sunrise","clock","compass"],"56":["compass","mountain","plant"],"57":["twoCups","bench","envelope"],"58":["bench","nightMoon","lamp"],"59":["bench","campfire","lighthouse"],"60":["twoCups","envelope","phoneTable"],"61":["twoCups","campfire","cake"],"62":["thunderCloud","dominoes","halfMast"],"63":["twoCups","plant","campfire"],"64":["umbrella","lighthouse","envelopeOpen"],"65":["plant","nightMoon","door"],"66":["mirror","bubbles","pencil"],"67":["mirror","thunderCloud","lamp"],"68":["plant","umbrella","twoCups"],"69":["compass","calendar","flag"],"70":["chartUp","sneaker","books"],"71":["mirror","notebook","compass"],"72":["umbrella","lighthouse","sunrise"],"73":["hourglass","calendar","nightMoon"],"74":["sunrise","stopwatch","sneaker"],"75":["calendar","signpost","flag"],"76":["lighthouse","bench","plant"],"77":["envelope","calendar","mountain"],"78":["lighthouse","compass","flag"],"79":["calendar","signpost","mirror"],"80":["brain","chartUp","plant"],"81":["flag","mountain","medal"],"82":["books","twoCups","signpost"],"83":["envelopeOpen","halfMast","sunrise"],"84":["sunrise","lighthouse","flag"]};

  const heroBlock = (name, inset = 32) => `<div style="position:relative; width:393px; height:240px; margin-left:-${inset}px; flex-shrink:0;">${hero(name, 0)}</div>`;
  const doneDisc = () => `<div style="width:112px; height:112px; border-radius:56px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check(ON_INK_, 40)}</div>`;
  const hero = (name, top) => (H[name] || H.sunrise)(top).replace('<svg ', `<svg data-hero="${H[name] ? name : 'sunrise'}" `);

  // ── text classification ──
  const clean = (s) => s.replace(/\s+/g, ' ').trim().replace(/'/g, '’').replace(/"([^"]*)"/g, '“$1”');
  const isShort = (s) => s.length <= 52 && !/^[•\[]/.test(s);
  const isOptionLike = (s) => s.length <= 44 && !/[.!…]$/.test(s) && !/^[•\[]/.test(s);
  const parseQuote = (s) => { const m = clean(s).match(/^[“"]?(.+?)[”"]?\s*[–—-]\s*(.+)$/); return m ? { text: m[1].replace(/^[“"]|[”"]$/g, ''), by: m[2] } : { text: clean(s).replace(/^[“"]|[”"]$/g, ''), by: '' }; };
  const sentences = (s) => s.split(/(?<=[.!?…][”’"']?)\s+/);
  const splitLong = (s, max = 230) => {
    if (s.length <= max) return [s];
    const parts = sentences(s); const out = []; let cur = '';
    for (const x of parts) { if (cur && (cur + ' ' + x).length > max) { out.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; }
    if (cur) out.push(cur); return out;
  };

  // ── per-lesson frames ──
  const lessonFrames = (week, lesson) => {
    const n = lesson.num, M = META[n] || {}, pool = POOL[n] || ['sunrise', 'bench', 'compass'];
    const secs = lesson.sections;
    const openQ = secs.find(s => /opening quote/i.test(s.title)), closeQ = secs.find(s => /closing quote/i.test(s.title));
    const taskSec = secs.find(s => /task/i.test(s.title));
    const content = secs.filter(s => s !== openQ && s !== closeQ && s !== taskSec);
    const words = secs.reduce((a, s) => a + s.paras.join(' ').split(/\s+/).length, 0);
    const mins = Math.max(3, Math.round(words / 140));
    const inner = []; // array of { body:html, noHint?:bool }
    const push = (html, noHint) => inner.push({ html, noHint });

    // cover
    push(`${mid([caps(`Week ${rom(week.num)} · ${week.name}`, { center: true }), display(lesson.title, { center: true }), meta(`${mins} min · Lesson ${String(n).padStart(2, '0')}`, { center: true }), sp(14), heroBlock(pool[0])], { top: 140, bottom: 130, gap: 12, center: true })}
${primary('Begin')}`, true);
    // opening quote
    const quoteFrame = (q) => mid([`<svg width="34" height="26" viewBox="0 0 28 22"><path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill="${ART}"></path></svg>`, stmt(q.text, { center: true }), q.by ? caps(q.by, { center: true }) : ''], { center: true, gap: 22 });
    if (openQ && openQ.paras[0]) push(quoteFrame(parseQuote(openQ.paras[0])));

    // content sections
    let heroUsed = 0, heroSi = -9;
    content.forEach((sec, si) => {
      const paras = sec.paras.map(clean).filter(Boolean);
      // detect question + options
      let qIdx = -1, optEnd = -1;
      for (let i = 0; i < paras.length; i++) {
        if (/\?$/.test(paras[i]) && paras[i].length <= 90) { let j = i + 1; while (j < paras.length && isOptionLike(paras[j])) j++; if (j - i - 1 >= 2) { qIdx = i; optEnd = j; break; } }
      }
      const items = []; // flat list: {k:'body'|'stmt'|'q', t, opts}
      paras.forEach((t, i) => {
        if (qIdx >= 0 && i === qIdx) { items.push({ k: 'q', t, opts: paras.slice(i + 1, optEnd) }); return; }
        if (qIdx >= 0 && i > qIdx && i < optEnd) return;
        if (isShort(t)) items.push({ k: 'stmt', t }); else splitLong(t).forEach(x => items.push({ k: 'body', t: x }));
      });
      // group into frames
      const groups = []; let cur = [];
      const flush = () => { if (cur.length) groups.push(cur); cur = []; };
      const cost = (g) => g.reduce((a, it) => a + (it.k === 'stmt' ? it.t.length * 1.7 : it.t.length), 0);
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.k === 'q') { flush(); groups.push([it]); continue; }
        if (it.k === 'stmt') {
          // run of statements
          let j = i; while (j < items.length && items[j].k === 'stmt') j++;
          const run = items.slice(i, j);
          if (run.length >= 2) { flush(); groups.push(run); i = j - 1; continue; }
          if (cur.length && cur.every(x => x.k === 'body') && cost(cur) + it.t.length * 1.7 <= 260) { cur.push(it); flush(); continue; }
          flush(); cur.push(it); flush(); continue;
        }
        if (cur.length && cur.every(x => x.k === 'body') && cost(cur) + it.t.length <= 235) { cur.push(it); continue; }
        flush(); cur.push(it);
      }
      flush();
      // render
      groups.forEach((g, gi) => {
        if (g[0].k === 'q') {
          const q = g[0], nOpt = q.opts.length;
          // budget: frame content must end above the Continue button (top 746)
          const linesAt = (t, cpl) => Math.max(1, Math.ceil(t.length / cpl));
          const layouts = [
            { fs: 16, cpl: 34, padY: 17, gap: 12, qs: 28, qlh: 36, qcpl: 22, top: 150, pre: 16 },
            { fs: 16, cpl: 34, padY: 13, gap: 8, qs: 26, qlh: 33, qcpl: 24, top: 150, pre: 8 },
            { fs: 15, cpl: 38, padY: 11, gap: 8, qs: 24, qlh: 31, qcpl: 26, top: 136, pre: 6 },
            { fs: 15, cpl: 38, padY: 9, gap: 6, qs: 22, qlh: 28, qcpl: 28, top: 130, pre: 4 },
          ];
          const height = (L) => L.top + (gi === 0 ? 30 : 0) + linesAt(q.t, L.qcpl) * L.qlh + 10 + 22 + L.pre + q.opts.reduce((s, t) => s + linesAt(t, L.cpl) * 20 + L.padY * 2, 0) + (nOpt - 1) * L.gap;
          const L = layouts.find(x => height(x) <= 730) || layouts[layouts.length - 1];
          const optRows = `<div style="display:flex; flex-direction:column; gap:${L.gap}px;">${q.opts.map((t, i) => `<div style="min-height:${L.padY * 2 + 20}px; border-radius:${L.padY + 11}px; background:${i === 0 ? INK : CARD}; display:flex; align-items:center; padding:${L.padY}px 20px; box-sizing:border-box;"><span style="font-size:${L.fs}px; font-weight:400; line-height:20px; color:${i === 0 ? ON_INK_ : TXT}; text-wrap:pretty;">${t}</span></div>`).join('')}</div>`;
          push(`${stack(L.top, [...(gi === 0 ? [caps(`Part ${si + 1} · ${sec.title}`)] : []), h1(q.t, { size: L.qs, lh: L.qlh }), meta('Pick the one that fits best.'), sp(L.pre - 4), optRows], { gap: 10, inset: 32 })}${primary('Continue')}`, true); return;
        }
        if (gi === 0) {
          // section head frame: Part + title + first item (body or statement)
          const first = g[0];
          if (g.length === 1 && first.k === 'stmt') { push(mid([head(si + 1, sec.title), stmt(first.t, { color: SUB })], { gap: 28 })); return; }
          if (g.every(x => x.k === 'stmt')) { push(mid([head(si + 1, sec.title)])); push(mid(g.map((x, i) => stmt(x.t, { color: i === g.length - 1 ? TXT : MUTE })), { gap: 10 })); return; }
          push(mid([head(si + 1, sec.title), ...g.map(x => x.k === 'stmt' ? stmt(x.t) : body(x.t))], { gap: 24 })); return;
        }
        const allStmt = g.every(x => x.k === 'stmt');
        if (allStmt && g.length >= 3 && g.every(x => x.t.length <= 36)) {
          // ladder: muted lines building to a display line
          push(mid([...g.slice(0, -1).map(x => body(x.t, { color: MUTE })), sp(6), display(g[g.length - 1].t)], { gap: 8 })); return;
        }
        if (allStmt && g.length >= 2) { push(mid(g.map((x, i) => stmt(x.t, { color: i === g.length - 1 ? TXT : MUTE })), { gap: 10 })); return; }
        if (g.length === 1 && g[0].k === 'stmt') {
          // lone statement → display, with a hero if any remain
          if (heroUsed < 2 && si >= heroSi + 2) { heroUsed++; heroSi = si; push(mid([display(g[0].t, { center: true }), heroBlock(pool[heroUsed])], { gap: 28, center: true })); }
          else push(mid([display(g[0].t)]));
          return;
        }
        if (g.length === 1 && g[0].k === 'body' && heroUsed < 2 && si >= 1 && si >= heroSi + 2 && g[0].t.length <= 200) {
          heroUsed++; heroSi = si; push(mid([heroBlock(pool[heroUsed]), body(g[0].t)], { gap: 32 })); return;
        }
        push(mid(g.map(x => x.k === 'stmt' ? stmt(x.t) : body(x.t)), { gap: 22 }));
      });
    });

    // closing quote
    if (closeQ && closeQ.paras[0]) push(quoteFrame(parseQuote(closeQ.paras[0])));

    // task
    const tParas = (taskSec ? taskSec.paras : []).map(clean);
    const summary = (tParas.find(t => /^\[TaskSummary\]/.test(t)) || '').replace(/^\[TaskSummary\]\s*/, '');
    const introT = tParas.find(t => !/^\[/.test(t) && !/^•/.test(t)) || M.sub || '';
    const bullets = tParas.filter(t => /^•/.test(t)).map(t => { const m = t.replace(/^•\s*/, '').match(/^([^:]+):\s*(.+)$/); return m ? [m[1], m[2]] : [t.replace(/^•\s*/, ''), '']; });
    const taskLabel = /tonight/i.test(taskSec ? taskSec.title : '') ? 'Tonight’s task' : 'Today’s task';
    const doneTxt = (M.done || '').replace(/^Done when\s*/i, '');
    push(`<div style="position:absolute; left:24px; right:24px; top:150px; bottom:124px; display:flex; flex-direction:column;"><div style="display:flex; flex-direction:column; gap:12px;">${[caps(taskLabel), h1(M.t || summary || lesson.title, { size: 28, lh: 36 }), p(M.sub || introT, { size: 17, lh: 26 }), sp(4), card(`<div style="display:flex; gap:14px; align-items:flex-start;"><div style="width:28px; height:28px; border-radius:14px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check(ON_INK_, 12)}</div><div style="display:flex; flex-direction:column; gap:4px;">${caps('Done when')}<div style="font-size:17px; font-weight:700; line-height:26px; color:${TXT};">${doneTxt ? doneTxt[0].toUpperCase() + doneTxt.slice(1) : summary}</div></div></div>`, { pad: '18px 20px' })].join('')}</div><div style="flex:1; display:flex; align-items:center; justify-content:center;">${heroBlock(pool[0], 24)}</div></div>${primary('Set it up')}`, true);
    // task options accordion
    const opts = (M.opts && M.opts.length ? M.opts.map(o => [o[1], o[2]]) : bullets).slice(0, 4);
    if (opts.length) {
      const acc = (title, bodyT, open) => `<div style="border-radius:20px; background:${CARD}; padding:${open ? '18px 20px 20px' : '0 20px'}; box-sizing:border-box; ${open ? '' : 'height:58px; display:flex; align-items:center; justify-content:space-between;'}">${open ? `<div style="display:flex; flex-direction:column; gap:8px;"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="flex:1; font-size:16px; font-weight:700; color:${TXT};">${title}</span><div style="transform:rotate(90deg); display:flex;">${chevronR(TXT)}</div></div><div style="font-size:15px; line-height:23px; color:${SUB}; text-wrap:pretty;">${bodyT}</div></div>` : `<span style="flex:1; font-size:16px; font-weight:700; color:${TXT};">${title}</span>${chevronR(ART)}`}</div>`;
      push(`${stack(150, [h1(M.i2 || 'Pick what fits', { size: 28, lh: 36 }), sp(4), ...opts.map((o, i) => acc(o[0], o[1], i === 0))], { gap: 10 })}${primary('Done')}`, true);
    }
    // complete
    push(`${mid([doneDisc(), sp(10), display('Lesson complete.', { center: true }), body('Your answers are saved to the log. One thing left today — the task.', { center: true })], { top: 140, bottom: 130, gap: 14, center: true })}${primary('Done')}`, true);

    // wrap in reader chrome
    const TOTAL = inner.length;
    return inner.map((f, i) => {
      const idx = i + 1;
      const chrome = `<div style="position:absolute; left:22px; top:60px; height:40px; display:flex; align-items:center; z-index:5;">${closeX()}</div>
<div style="position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:center; z-index:4;">${caps(`Lesson ${String(n).padStart(2, '0')}`, { center: true })}</div>
<div style="position:absolute; left:24px; right:24px; top:108px; height:3px; border-radius:2px; background:${LINE};"><div style="width:${Math.round(idx / TOTAL * 100)}%; height:3px; border-radius:2px; background:${INK};"></div></div>
${f.html}
${f.noHint ? '' : `<div style="position:absolute; left:0; right:0; bottom:52px; display:flex; justify-content:center;"><div style="width:44px; height:44px; border-radius:22px; box-shadow:0 0 0 1.5px ${LINE}; display:flex; align-items:center; justify-content:center;"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" fill="none" stroke="${TXT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div>`}`;
      return { label: `L${n} Frame ${idx}`, note: `Lesson ${n} · ${idx} of ${TOTAL}`, html: frame(`L${n} Frame ${idx}`, chrome) };
    });
  };
  const ON_INK_ = K.ON_INK || '#111111';

  // ── week file ──
  const weekFile = (week) => {
    const pill = (t) => `<div style="align-self:flex-start; background:#FFFFFF; color:#5F5B55; font-family:'Lato',system-ui,sans-serif; font-size:12px; font-weight:700; letter-spacing:0.4px; padding:8px 12px; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.08);">${t}</div>`;
    const lessons = week.lessons.map(l => {
      const frames = lessonFrames(week, l);
      return `<div style="display:flex; flex-direction:column; gap:22px;">
${pill(`Week ${rom(week.num)} · ${week.name} — Lesson ${String(l.num).padStart(2, '0')} · ${l.title} · ${frames.length} frames`)}
<div style="display:flex; gap:26px; align-items:flex-start;">
${frames.map(f => `<div style="display:flex; flex-direction:column; gap:14px; flex-shrink:0;">${pill(f.note)}${f.html}</div>`).join('\n')}
</div></div>`;
    });
    return `<!DOCTYPE html>
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
  a, a:hover { color:#7fd8e8; }
</style>
</helmet>
<div style="display:flex; flex-direction:column; gap:72px; padding:72px; width:max-content;">
${lessons.join('\n')}
</div>
</x-dc>
</body>
</html>
`;
  };
  return { lessonFrames, weekFile };
})
