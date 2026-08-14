// applyReminders(fromDay, toDay): replace NIGHT reminder art with darkened new scenes
globalThis.applyReminders = async (from, to) => {
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
    ['#F4F3F0','#8FA0B5'],['#EAF0F5','#2C3946'],
    ['#EAE9E3','#26303C'],['#E7EAE0','#26303C'],['#EFEDE6','#2A3542'],['#F1F0EA','#2A3542'],
    ['#E8E7E1','#2A3542'],['#D8D3C8','#3B4756'],['#D8D7D0','#38434F'],['#EDECE7','#232C38']
  ];
  const darken = s => { for (const [a,b] of darkMap) s = s.split(a).join(b); return s; };
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
    const rmark = `<!--TVIZR ${nn}-->`;
    let start, old;
    const rm = t.indexOf(rmark, ci);
    if (rm !== -1 && rm - ci < 14000) {
      start = rm; old = rmark + extractTag(t, t.indexOf('<div', rm), 'div');
    } else {
      start = t.indexOf('<svg width="258" height="152"', ci);
      if (start === -1 || start - ci > 14000) { log('MISS reminder', nn); continue; }
      old = extractTag(t, start, 'svg');
    }
    const neu = `${rmark}<div style="position:absolute; left:12px; bottom:-10px; width:258px; height:152px;"><div style="width:340px; height:200px; transform:scale(0.7588); transform-origin:top left;">${darken(scene)}</div></div>`;
    parts.push(t.slice(cursor, start), neu);
    cursor = start + old.length;
    done++;
  }
  parts.push(t.slice(cursor));
  t = parts.join('');
  await saveFile('Lessons and Tasks.dc.html', t);
  log('reminders replaced:', done, `(D${from}-D${to})`);
};
