// apply-tasks.js — shared batch applier. Usage: eval libs, then applyTasks(scenes)
globalThis.applyTasks = async (scenes) => {
  let t = await readFile('Lessons and Tasks.dc.html');
  const darkMap = [
    ['rgba(255,255,255','rgba(190,205,220'],['rgba(244,243,240','rgba(190,205,220'],
    ['#F7F6F2','#232C38'],['#FBFAF7','#26303C'],['#EFEEE8','#26303C'],['#EDECE6','#212932'],
    ['#E4E3DE','#333F4D'],['#E9E8E2','#26303C'],['#ECEBE5','#26303C'],['#E2E1DB','#212B36'],
    ['#E0DFDA','#3E4A59'],['#DEDDD7','#3B4756'],['#DEDDD6','#3B4756'],['#DDDCD5','#3A4653'],
    ['#D6D5D0','#3B4756'],['#D6D5CE','#3B4756'],['#D2D1CB','#38434F'],['#C6C5C0','#465364'],
    ['#C5C4BD','#465364'],['#C9C8C1','#42505F'],['#C0BFB8','#414E5C'],['#B4B1AB','#526072'],
    ['#CFCEC7','#3F4C5A'],['#55534E','#8FA0B5'],['#3A3934','#9FB0C4'],['#6B6862','#5E6C7E'],
    ['#8A857C','#6E7D90'],['#C9D7E3','#2E4356'],['#C8D7E5','#31465A'],['#D5E1EA','#31465A'],
    ['#C9CEC1','#465648'],['#D3D7CB','#4E5E50'],['#BEC4B4','#3F4F44'],['#CDD2C5','#495A4C'],
    ['#A9AF9E','#4E5A50'],['#9EB7CD','#54708A'],['#B9C3CC','#54708A'],['#FFFFFF','#7E8EA1'],
    ['#F4F3F0','#8FA0B5'],['#EAF0F5','#2C3946']
  ];
  const darken = s => { for (const [a,b] of darkMap) s = s.split(a).join(b); return s; };
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
  for (const nn of Object.keys(scenes)) {
    const scene = scenes[nn];
    // --- intro ---
    const li = t.indexOf(`data-screen-label="Task D${nn} Intro"`);
    if (li === -1) { log('MISS intro', nn); continue; }
    const mark = `<!--TVIZ ${nn}-->`;
    let a = t.indexOf(mark, li), old, start;
    if (a !== -1 && a - li < 9000) {
      start = a;
      old = mark + extractTag(t, t.indexOf('<div', a), 'div');
    } else {
      start = t.indexOf('<svg width="340" height="200"', li);
      if (start === -1 || start - li > 9000) { log('MISS svg', nn); continue; }
      old = extractTag(t, start, 'svg');
    }
    const neu = `${mark}<div style="position:absolute; left:26px; top:236px; width:340px; height:200px;"><div style="position:absolute; inset:0; overflow:hidden;">${scene}</div></div>`;
    t = t.slice(0, start) + neu + t.slice(start + old.length);
    // --- card dark banner ---
    const ci = t.indexOf(`data-screen-label="Task D${nn} Card"`);
    if (ci === -1) { log('MISS card', nn); continue; }
    const dmark = `<!--TVIZD ${nn}-->`;
    let b = t.indexOf(dmark, ci), old2, start2;
    if (b !== -1 && b - ci < 9000) {
      start2 = b;
      old2 = dmark + extractTag(t, t.indexOf('<div', b), 'div');
    } else {
      start2 = t.indexOf('<svg width="232" height="136"', ci);
      if (start2 === -1 || start2 - ci > 9000) { log('MISS cardsvg', nn); continue; }
      old2 = extractTag(t, start2, 'svg');
    }
    const neu2 = `${dmark}<div style="position:absolute; left:131px; bottom:-10px; width:232px; height:136px;"><div style="width:340px; height:200px; transform:scale(0.682); transform-origin:top left;">${darken(scene)}</div></div>`;
    t = t.slice(0, start2) + neu2 + t.slice(start2 + old2.length);
    log('ok', nn);
  }
  await saveFile('Lessons and Tasks.dc.html', t);
  return t;
};
globalThis.regenTaskGrid = async (t) => {
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
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#DDDBD4;font-family:-apple-system,system-ui,sans-serif;} .grid{display:grid;grid-template-columns:repeat(3,356px);gap:14px;padding:14px;} .cell{background:#F4F3F0;border-radius:8px;padding:8px 8px 4px;box-shadow:0 1px 3px rgba(0,0,0,0.15);} .cap{font-size:11px;font-weight:600;color:#333;margin-bottom:4px;} .viz{outline:1px dashed rgba(0,0,0,0.15); position:relative; width:340px; height:200px; overflow:hidden;} .new .viz{outline-color:rgba(196,152,86,0.8);}</style></head><body><div class="grid">`;
  for (let n = 1; n <= 84; n++) {
    const nn = String(n).padStart(2, '0');
    const li = t.indexOf(`data-screen-label="Task D${nn} Intro"`);
    const ti = t.indexOf('text-wrap:balance;">', li);
    const title = t.slice(ti + 20, t.indexOf('<', ti + 20));
    const mark = `<!--TVIZ ${nn}-->`;
    let a = t.indexOf(mark, li), inner, isNew = false;
    if (a !== -1 && a - li < 9000) {
      const wrap = extractTag(t, t.indexOf('<div', a), 'div');
      const j = wrap.indexOf('overflow:hidden;">');
      inner = wrap.slice(j + 18, wrap.length - 12);
      isNew = true;
    } else {
      const sv = t.indexOf('<svg width="340" height="200"', li);
      inner = extractTag(t, sv, 'svg').replace('style="position:absolute; left:26px; top:236px;"', 'style="position:absolute; left:0; top:0;"');
    }
    html += `<div class="cell${isNew ? ' new' : ''}" id="c${nn}"><div class="cap">D${nn} · ${title}</div><div class="viz">${inner}</div></div>`;
  }
  html += `</div></body></html>`;
  await saveFile('screenshots/task-grid.html', html);
};

globalThis.regenBatchGrid = async (t, days) => {
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
  let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#DDDBD4;font-family:-apple-system,system-ui,sans-serif;} .grid{display:grid;grid-template-columns:repeat(3,356px);gap:14px;padding:14px;} .cell{background:#F4F3F0;border-radius:8px;padding:8px 8px 4px;box-shadow:0 1px 3px rgba(0,0,0,0.15);} .cap{font-size:11px;font-weight:600;color:#333;margin-bottom:4px;} .viz{outline:1px dashed rgba(0,0,0,0.15); position:relative; width:340px; height:200px; overflow:hidden;}</style></head><body><div class="grid">';
  for (const nn of days) {
    const li = t.indexOf('data-screen-label="Task D' + nn + ' Intro"');
    const ti = t.indexOf('text-wrap:balance;">', li);
    const title = t.slice(ti + 20, t.indexOf('<', ti + 20));
    const mark = '<!--TVIZ ' + nn + '-->';
    const a = t.indexOf(mark, li);
    if (a === -1) { continue; }
    const wrap = extractTag(t, t.indexOf('<div', a), 'div');
    const j = wrap.indexOf('overflow:hidden;">');
    const inner = wrap.slice(j + 18, wrap.length - 12);
    html += '<div class="cell" id="c' + nn + '"><div class="cap">D' + nn + ' · ' + title + '</div><div class="viz">' + inner + '</div></div>';
  }
  html += '</div></body></html>';
  await saveFile('screenshots/task-batch.html', html);
};
