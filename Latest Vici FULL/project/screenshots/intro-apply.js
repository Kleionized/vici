// v2: intro gets full description (viz shifts/scales); done-card repositions
globalThis.applyIntroDesc = async (from, to) => {
  let t = await readFile('Lessons and Tasks.dc.html');
  const src = JSON.parse(await readFile('task-src.json'));
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g,'&rsquo;').replace(/’/g,'&rsquo;').replace(/“/g,'&ldquo;').replace(/”/g,'&rdquo;').replace(/—/g,'&mdash;');
  function extractTag(srcS, startIdx, tag) {
    let i = startIdx + 1, depth = 1;
    while (depth > 0 && i < srcS.length) {
      const open = srcS.indexOf('<' + tag, i), close = srcS.indexOf('</' + tag + '>', i);
      if (close === -1) return null;
      if (open !== -1 && open < close) { depth++; i = open + tag.length + 1; }
      else { depth--; i = close + tag.length + 3; }
    }
    return srcS.slice(startIdx, i);
  }
  let done = 0;
  for (let n = from; n <= to; n++) {
    const nn = String(n).padStart(2, '0');
    const d = src[n-1];
    const li = t.indexOf(`data-screen-label="Task D${nn} Intro"`);
    if (li === -1) { log('MISS', nn); continue; }
    const ti = t.indexOf('text-wrap:balance;">', li);
    const titleLines = nn === '82' ? 2 : 1;
    const descTop = 144 + titleLines*35 + 14;
    const intro = d.intro.join(' ');
    const descLines = Math.ceil(intro.length / 44);
    let vizTop = descTop + descLines*21 + 16;
    let s = 1;
    if (vizTop + 286 > 690) s = Math.max(0.68, Math.round(((690 - 86 - vizTop) / 200) * 100) / 100);
    const cardTop = Math.round(vizTop + 200*s + 20);
    // 1) description
    const dmark = `<!--TDESC ${nn}-->`;
    let dstart = t.indexOf(dmark, li), dOld;
    if (dstart !== -1 && dstart - li < 6000) {
      dOld = dmark + extractTag(t, t.indexOf('<div', dstart), 'div');
    } else {
      let si = t.indexOf('top:192px; text-align:center; font-size:15px;', li);
      if (si === -1 || si - li > 6000) si = t.indexOf('top:222px; text-align:center; font-size:15px;', li);
      if (si === -1 || si - li > 6000) { log('MISS subtitle', nn); continue; }
      dstart = t.lastIndexOf('<div', si);
      dOld = extractTag(t, dstart, 'div');
    }
    const dNew = `${dmark}<div style="position:absolute; left:38px; right:38px; top:${descTop}px; text-align:center; font-size:14.5px; font-weight:400; line-height:21px; color:#55534E; text-wrap:pretty;">${esc(intro)}</div>`;
    t = t.slice(0, dstart) + dNew + t.slice(dstart + dOld.length);
    // 2) viz wrapper reposition/scale
    const vm = t.indexOf(`<!--TVIZ ${nn}-->`, dstart);
    const wStart = t.indexOf('<div', vm);
    const wrap = extractTag(t, wStart, 'div');
    const j = wrap.indexOf('overflow:hidden;">');
    const inner = wrap.slice(j + 18, wrap.length - 12);
    const wNew = `<div style="position:absolute; left:26px; top:${vizTop}px; width:340px; height:${Math.round(200*s)}px;"><div style="position:absolute; left:0; top:0; width:340px; height:200px; overflow:hidden;${s<1?` transform:scale(${s}); transform-origin:top center;`:''}">${inner}</div></div>`;
    t = t.slice(0, wStart) + wNew + t.slice(wStart + wrap.length);
    // 3) done-card top
    const cm = t.indexOf('height:68px; border-radius:16px;', wStart);
    if (cm !== -1 && cm - wStart < wNew.length + 900) {
      const os = t.lastIndexOf('<div style="', cm);
      const openEnd = t.indexOf('>', cm);
      let openTag = t.slice(os, openEnd);
      openTag = openTag.replace(/top:\d+px;/, `top:${cardTop}px;`);
      t = t.slice(0, os) + openTag + t.slice(openEnd);
    } else { log('no done-card', nn); }
    done++;
  }
  await saveFile('Lessons and Tasks.dc.html', t);
  log('intro descs:', done, `(D${from}-D${to})`);
};
// options v2: no description; list only + inlined footer note; roomier spacing
globalThis.applyOptionsV2 = async (from, to) => {
  let t = await readFile('Lessons and Tasks.dc.html');
  const src = JSON.parse(await readFile('task-src.json'));
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g,'&rsquo;').replace(/’/g,'&rsquo;').replace(/“/g,'&ldquo;').replace(/”/g,'&rdquo;').replace(/—/g,'&mdash;');
  const cpl = (w, f) => Math.floor(w / (f * 0.555));
  const presets = {
    A: { gap:22, tile:40, head:15.5, headLh:21, body:13, bodyLh:19, extraTop:40, extraF:13, extraLh:19 },
    B: { gap:16, tile:36, head:15, headLh:20, body:13, bodyLh:18.5, extraTop:32, extraF:13, extraLh:18 },
    C: { gap:13, tile:24, head:14.5, headLh:19.5, body:12.5, bodyLh:17.5, extraTop:28, extraF:12.5, extraLh:17 },
    D: { gap:10, tile:22, head:14, headLh:19, body:12.5, bodyLh:17, extraTop:24, extraF:12.5, extraLh:16 }
  };
  const estimate = (d, p, chips) => {
    let h = 0;
    const bw = 345 - (chips ? 24+12 : p.tile+14);
    d.bullets.forEach((b, i) => {
      const hl = Math.ceil(b.head.length / cpl(bw, p.head)) * p.headLh;
      const bl = Math.ceil(b.body.length / cpl(bw, p.body)) * p.bodyLh;
      h += Math.max(chips ? 24 : p.tile, hl + 3 + bl);
      if (i < d.bullets.length-1) h += p.gap;
    });
    const ex = [d.closing, d.extra].filter(Boolean).join(' ');
    if (ex) h += p.extraTop + Math.ceil(ex.length / cpl(333, p.extraF)) * p.extraLh + 10;
    return h;
  };
  function extractTag(srcS, startIdx, tag) {
    let i = startIdx + 1, depth = 1;
    while (depth > 0 && i < srcS.length) {
      const open = srcS.indexOf('<' + tag, i), close = srcS.indexOf('</' + tag + '>', i);
      if (close === -1) return null;
      if (open !== -1 && open < close) { depth++; i = open + tag.length + 1; }
      else { depth--; i = close + tag.length + 3; }
    }
    return srcS.slice(startIdx, i);
  }
  const parts = [];
  let cursor = 0;
  for (let n = from; n <= to; n++) {
    const nn = String(n).padStart(2, '0');
    const d = src[n-1];
    const li = t.indexOf(`data-screen-label="Task D${nn} Options"`, cursor);
    if (li === -1) { log('MISS', nn); continue; }
    const dotsI = t.indexOf('<div style="position:absolute; left:0; right:0; top:706px;', li);
    const titleLines = ['13','26','55','58','72'].includes(nn) ? 2 : 1;
    const listTop = 144 + titleLines*35 + 46;
    const bullets = d.bullets.slice();
    let closing = '';
    if (bullets.length > 1) {
      const last = bullets[bullets.length-1];
      if (!last.body && last.head.trim().length <= 120) {
        bullets.pop();
        const h = last.head.trim();
        if (h.replace(/[^a-zA-Z]/g,'').length > 18) closing = h;
      }
    }
    const d2 = { bullets, extra: d.extra, closing };
    const seg = t.slice(li, dotsI);
    const icons = [];
    const re = /justify-content:center; flex-shrink:0;">(<svg[^]*?<\/svg>)<\/div>/g;
    let m; while ((m = re.exec(seg))) icons.push(m[1]);
    const stock = [
      '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="4.5" y="3" width="11" height="14" rx="2" fill="none" stroke="#3A3934" stroke-width="1.6"></rect><path d="M7.5 7.5h5M7.5 10.5h5M7.5 13.5h3" stroke="#3A3934" stroke-width="1.5" stroke-linecap="round"></path></svg>',
      '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#3A3934" stroke-width="1.6"></circle><path d="M6.8 10.2l2.2 2.2 4.2-4.8" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 16l1-3.5L13.5 4a1.6 1.6 0 012.4 0l.1.1a1.6 1.6 0 010 2.3L7.5 15 4 16z" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linejoin="round"></path></svg>',
      '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#3A3934" stroke-width="1.6"></circle><path d="M10 6.5V10l2.5 2" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path></svg>',
      '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#3A3934" stroke-width="1.6"></circle><circle cx="10" cy="10" r="2.6" fill="none" stroke="#3A3934" stroke-width="1.6"></circle></svg>'
    ];
    let si = 0;
    while (icons.length < d.bullets.length && si < stock.length) icons.push(stock[si++]);
    const mark = `<!--TOPT ${nn}-->`;
    let start = t.indexOf(mark, li);
    if (start === -1 || start > dotsI) start = dotsI;
    const avail = 692 - listTop;
    let p = presets.A, chips = d2.bullets.length > icons.length;
    let listTopUse = listTop;
    for (const key of ['A','B','C','D']) {
      p = presets[key];
      if (key === 'C' || key === 'D') chips = true;
      if (estimate(d2, p, chips) <= avail) break;
    }
    if (estimate(d2, p, chips) > avail) listTopUse = listTop - 16;
    const slack = Math.max(0, avail - estimate(d2, p, chips));
    const extraBoost = d.extra ? Math.min(26, Math.round(slack*0.6)) : 0;
    let rows = '';
    d2.bullets.forEach((b, i) => {
      const marker = chips
        ? `<div style="width:24px; height:24px; border-radius:50%; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.09); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;"><span style="font-size:12px; font-weight:600; color:#55534E;">${i+1}</span></div>`
        : `<div style="width:${p.tile}px; height:${p.tile}px; border-radius:12px; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06); display:flex; align-items:center; justify-content:center; flex-shrink:0;">${icons[i] || ''}</div>`;
      const headHtml = b.body
        ? `<div style="font-size:${p.head}px; font-weight:600; line-height:${p.headLh}px; color:#1D1C1A;">${esc(b.head)}</div><div style="margin-top:3px; font-size:${p.body}px; font-weight:400; line-height:${p.bodyLh}px; color:#767370; text-wrap:pretty;">${esc(b.body)}</div>`
        : `<div style="font-size:${p.head}px; font-weight:400; line-height:${p.headLh+1}px; color:#3A3934; text-wrap:pretty;">${esc(b.head)}</div>`;
      rows += `<div style="display:flex; align-items:flex-start; gap:${chips?12:14}px;">${marker}<div style="flex:1; min-width:0;">${headHtml}</div></div>`;
    });
    const paras = [d2.closing, d.extra].filter(Boolean);
    const extraHtml = paras.map((tx, i) => `<div style="margin-top:${i === 0 ? p.extraTop + extraBoost : 10}px; font-size:${p.extraF}px; font-weight:400; line-height:${p.extraLh}px; color:#767370; text-wrap:pretty;">${esc(tx)}</div>`).join('');
    const block = `${mark}<div style="position:absolute; left:24px; right:24px; top:${listTopUse}px; bottom:108px; display:flex; flex-direction:column; overflow:hidden;"><div style="display:flex; flex-direction:column; gap:${p.gap}px;">${rows}</div>${extraHtml}</div>`;
    parts.push(t.slice(cursor, start), block);
    cursor = dotsI;
  }
  parts.push(t.slice(cursor));
  t = parts.join('');
  await saveFile('Lessons and Tasks.dc.html', t);
  log(`options v2 D${from}-D${to}`);
};
