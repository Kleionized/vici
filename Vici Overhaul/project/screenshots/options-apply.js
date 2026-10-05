// applyOptions(from,to): rebuild Task Options content with full copy from task-src.json
globalThis.applyOptions = async (from, to) => {
  let t = await readFile('Lessons and Tasks.dc.html');
  const src = JSON.parse(await readFile('task-src.json'));
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g,'&rsquo;').replace(/’/g,'&rsquo;').replace(/“/g,'&ldquo;').replace(/”/g,'&rdquo;').replace(/—/g,'&mdash;');
  const cpl = (w, f) => Math.floor(w / (f * 0.555));
  const presets = {
    A: { desc:14, descLh:20, gap:16, tile:40, icon:20, head:15, headLh:21, body:13, bodyLh:18, listTop:24, extraF:12.5, extraLh:17 },
    B: { desc:13.5, descLh:19, gap:12, tile:36, icon:18, head:14.5, headLh:20, body:12.5, bodyLh:17, listTop:18, extraF:12, extraLh:16 },
    C: { desc:13, descLh:18, gap:10, tile:24, icon:0, head:14, headLh:19, body:12, bodyLh:16, listTop:16, extraF:11.5, extraLh:15 },
    D: { desc:12.5, descLh:17, gap:8, tile:22, icon:0, head:13.5, headLh:18, body:11.5, bodyLh:15, listTop:13, extraF:11, extraLh:14 }
  };
  const estimate = (d, p, chips) => {
    const introChars = d.intro.join(' ').length;
    let h = Math.ceil(introChars / cpl(300, p.desc)) * p.descLh;
    h += p.listTop;
    const bw = 345 - (chips ? 24+12 : p.tile+14);
    d.bullets.forEach((b, i) => {
      const hl = Math.ceil(b.head.length / cpl(bw, p.head)) * p.headLh;
      const bl = Math.ceil(b.body.length / cpl(bw, p.body)) * p.bodyLh;
      h += Math.max(chips ? 24 : p.tile, hl + 2 + bl);
      if (i < d.bullets.length-1) h += p.gap;
    });
    if (d.extra) h += 14 + Math.ceil(d.extra.length / cpl(333, p.extraF)) * p.extraLh;
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
    // extract existing icons in order (from original rows or a previous TOPT block)
    const seg = t.slice(li, dotsI);
    const icons = [];
    const re = /justify-content:center; flex-shrink:0;">(<svg[^]*?<\/svg>)<\/div>/g;
    let m; while ((m = re.exec(seg))) icons.push(m[1]);
    // content start: previous TOPT marker or first original row
    const mark = `<!--TOPT ${nn}-->`;
    let start = t.indexOf(mark, li);
    if (start === -1 || start > dotsI) {
      const rowM = seg.match(/<div style="position:absolute; left:24px; right:24px; top:2\d\dpx; display:flex; align-items:flex-start; gap:16px;/);
      start = rowM ? li + seg.indexOf(rowM[0]) : dotsI;
    }
    // long titles wrap to 2 lines
    const twoLine = d.title.length > 22;
    const topStart = twoLine ? 232 : 196;
    // pick preset
    const avail = 692 - topStart;
    let p = presets.A, chips = d.bullets.length > icons.length;
    if (estimate(d, p, chips) > avail) { p = presets.B; }
    if (estimate(d, p, chips) > avail) { p = presets.C; chips = true; }
    if (estimate(d, p, chips) > avail) { p = presets.D; chips = true; }
    // build html
    let rows = '';
    d.bullets.forEach((b, i) => {
      const marker = chips
        ? `<div style="width:24px; height:24px; border-radius:50%; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.09); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;"><span style="font-size:12px; font-weight:600; color:#55534E;">${i+1}</span></div>`
        : `<div style="width:${p.tile}px; height:${p.tile}px; border-radius:12px; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06); display:flex; align-items:center; justify-content:center; flex-shrink:0;">${icons[i] || ''}</div>`;
      rows += `<div style="display:flex; align-items:flex-start; gap:${chips?12:14}px;">${marker}<div style="flex:1; min-width:0;"><div style="font-size:${p.head}px; font-weight:600; line-height:${p.headLh}px; color:#1D1C1A;">${esc(b.head)}</div><div style="margin-top:2px; font-size:${p.body}px; font-weight:400; line-height:${p.bodyLh}px; color:#767370; text-wrap:pretty;">${esc(b.body)}</div></div></div>`;
    });
    const extraHtml = d.extra ? `<div style="margin-top:14px; padding-top:11px; border-top:1px solid rgba(0,0,0,0.07); font-size:${p.extraF}px; font-weight:400; line-height:${p.extraLh}px; color:#8B8882; text-wrap:pretty;">${esc(d.extra)}</div>` : '';
    const block = `${mark}<div style="position:absolute; left:24px; right:24px; top:${topStart}px; bottom:110px; display:flex; flex-direction:column; overflow:hidden;"><div style="font-size:${p.desc}px; font-weight:400; line-height:${p.descLh}px; color:#55534E; text-align:center; padding:0 12px; text-wrap:pretty; flex-shrink:0;">${esc(d.intro.join(' '))}</div><div style="display:flex; flex-direction:column; gap:${p.gap}px; margin-top:${p.listTop}px;">${rows}</div>${extraHtml}</div>`;
    parts.push(t.slice(cursor, start), block);
    cursor = dotsI;
  }
  parts.push(t.slice(cursor));
  t = parts.join('');
  await saveFile('Lessons and Tasks.dc.html', t);
  log(`options rebuilt D${from}-D${to}`);
};
