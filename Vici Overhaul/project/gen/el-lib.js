// Helpers for in-place edits of Email Login frames. const L = eval(await readFile('gen/el-lib.js'))(V4, HB);
(function (V4, HB) {
  const MARK = '<div data-screen-label="';
  const VOID = new Set(['img', 'br', 'input', 'hr', 'meta', 'link', 'source', 'wbr']);
  const split = s => { const p = s.split(MARK); return { head: p[0], frames: p.slice(1), join: fr => [p[0], ...fr].join(MARK) }; };
  const kids = (f) => { const from = f.indexOf('>') + 1; const out = []; let depth = 0, cur = null; const re = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g; re.lastIndex = from; let m;
    while ((m = re.exec(f))) { const close = m[1] === '/', tag = m[2].toLowerCase(), self = m[4] === '/' || VOID.has(tag);
      if (close) { if (depth === 0) break; depth--; if (depth === 0 && cur) { cur.end = re.lastIndex; out.push(cur); cur = null; } continue; }
      if (depth === 0) { cur = { start: m.index, tagEnd: re.lastIndex, tag }; if (self) { cur.end = re.lastIndex; out.push(cur); cur = null; continue; } }
      if (!self) depth++; }
    out.forEach(k => { k.open = f.slice(k.start, k.tagEnd); k.html = f.slice(k.start, k.end); k.style = (k.open.match(/style="([^"]*)"/) || [, ''])[1]; k.hero = (k.open.match(/data-hero="([^"]+)"/) || [, ''])[1]; });
    return out; };
  const px = (st, prop) => { const m = new RegExp('(?:^|;)\\s*' + prop + ':\\s*(-?[\\d.]+)px').exec(st); return m ? +m[1] : null; };
  const setProp = (open, prop, val) => open.replace(/style="([^"]*)"/, (mm, st) => { const re = new RegExp('((?:^|;)\\s*)' + prop + ':\\s*[^;]*'); return 'style="' + (re.test(st) ? st.replace(re, '$1' + prop + ':' + val) : st.replace(/;?\s*$/, '; ' + prop + ':' + val + ';')) + '"'; });
  // replace children by index map {ci: newHtml}; returns new frame text
  const edit = (f, map) => { const ks = kids(f); let out = f; [...ks.keys()].sort((a, b) => b - a).forEach(ci => { if (!(ci in map)) return; const k = ks[ci]; out = out.slice(0, k.start) + map[ci] + out.slice(k.end); }); return out; };
  const insertAfter = (f, ci, html) => { const ks = kids(f); const k = ks[ci]; return f.slice(0, k.end) + html + f.slice(k.end); };
  const heroKey = n => n === 'windowNight' ? 'nightMoon' : n;
  // absolute hero svg whose ink bottom lands at frame y=inkBottom, at scale sc
  const heroAt = (name, sc, inkBottom, extra = '') => { const k = heroKey(name); const b = HB[k][1]; const top = +(inkBottom - 190 - (b - 190) * sc).toFixed(1);
    return '<svg data-hero="' + name + '" width="393" height="240" viewBox="0 0 393 240" style="position:absolute; left:0; top:' + top + 'px; overflow:visible; transform:scale(' + sc + '); transform-origin:196px 190px;' + extra + '">' + V4.H[k]() + '</svg>'; };
  const heroH = (name, sc) => { const [t, b] = HB[heroKey(name)]; return (b - t) * sc; };
  // largest scale <= maxSc so that hero fits in height h
  const fitScale = (name, h, maxSc = 1.1) => { const [t, b] = HB[heroKey(name)]; return Math.min(maxSc, +(h / (b - t)).toFixed(3)); };
  return { MARK, split, kids, px, setProp, edit, insertAfter, heroAt, heroH, fitScale, heroKey };
})
