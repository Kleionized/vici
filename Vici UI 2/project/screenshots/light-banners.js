// applyLightBanners(from,to): card banners show the light scene as-is on a paper bg
globalThis.applyLightBanners = async (from, to) => {
  let t = await readFile('Lessons and Tasks.dc.html');
  function extractTag(src, startIdx, tag) {
    let i = startIdx + 1, depth = 1;
    while (depth > 0 && i < src.length) {
      const open = src.indexOf('<' + tag, i), close = src.indexOf('</' + tag + '>', i);
      if (close === -1) return null;
      if (open !== -1 && open < close) { depth++; i = open + tag.length + 1; }
      else { depth--; i = close + tag.length + 3; }
    }
    return src.slice(startIdx, i);
  }
  const parts = [];
  let cursor = 0, done = 0;
  for (let n = from; n <= to; n++) {
    const nn = String(n).padStart(2, '0');
    const li = t.indexOf(`data-screen-label="Task D${nn} Intro"`, cursor);
    const mk = t.indexOf(`<!--TVIZ ${nn}-->`, li);
    if (li === -1 || mk === -1) { log('MISS scene', nn); continue; }
    const wrap = extractTag(t, t.indexOf('<div', mk), 'div');
    const j = wrap.indexOf('overflow:hidden;">');
    const scene = wrap.slice(j + 18, wrap.length - 12);
    const ci = t.indexOf(`data-screen-label="Task D${nn} Card"`, mk);
    // top banner (369x124): fit-height scene, centered
    const dm = t.indexOf(`<!--TVIZD ${nn}-->`, ci);
    if (dm === -1) { log('MISS D', nn); continue; }
    const oldD = `<!--TVIZD ${nn}-->` + extractTag(t, t.indexOf('<div', dm), 'div');
    const neuD = `<!--TVIZD ${nn}--><div style="position:absolute; inset:0; overflow:hidden; background:#F4F3F0;"><div style="position:absolute; left:50%; top:0; width:340px; height:200px; transform:translateX(-50%) scale(0.72); transform-origin:top center;">${scene}</div></div>`;
    parts.push(t.slice(cursor, dm), neuD);
    cursor = dm + oldD.length;
    // reminder banner (281x248): fit-width scene, vertically centered
    const rm = t.indexOf(`<!--TVIZR ${nn}-->`, cursor);
    if (rm === -1) { log('MISS R', nn); continue; }
    const oldR = `<!--TVIZR ${nn}-->` + extractTag(t, t.indexOf('<div', rm), 'div');
    const neuR = `<!--TVIZR ${nn}--><div style="position:absolute; inset:0; overflow:hidden; background:#F4F3F0;"><div style="position:absolute; left:50%; top:41px; width:340px; height:200px; transform:translateX(-50%) scale(0.826); transform-origin:top center;">${scene}</div></div>`;
    parts.push(t.slice(cursor, rm), neuR);
    cursor = rm + oldR.length;
    done++;
  }
  parts.push(t.slice(cursor));
  t = parts.join('');
  await saveFile('Lessons and Tasks.dc.html', t);
  log('light banners:', done, `(D${from}-D${to})`);
};
