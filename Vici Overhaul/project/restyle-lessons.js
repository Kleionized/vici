// Shared transform used by run_script: normalises type scale/spacing and splits long text frames.
window.restyleLesson = function(html){
  const COL = '<div style="display:flex; flex-direction:column; gap:18px; flex-shrink:0;">';
  const SECT = '<div style="align-self:flex-start; background:#FFD34D;';
  const END = 'background:#B4B1AB;"></div></div>';
  const MAX = 190; const PARA = 150;
  const rep = (s, a, b) => s.split(a).join(b);

  function restyleFrame(f){
    const isQ = f.includes('top:118px; bottom:100px;');
    const isList = f.includes('top:126px; bottom:56px;');
    const isQuote = f.includes("'Iowan Old Style'");
    if (isQ){
      f = rep(f, 'font-size:26px; font-weight:500; line-height:38px;', 'font-size:24px; font-weight:500; line-height:32px;');
      f = rep(f, 'font-size:20px; font-weight:500; line-height:28px; text-align:center; color:#1D1C1A; text-wrap:balance; max-width:310px;', 'font-size:24px; font-weight:500; line-height:32px; text-align:center; color:#1D1C1A; text-wrap:balance; max-width:310px;');
      f = rep(f, 'justify-content:center; gap:32px; padding:0 38px;', 'justify-content:center; gap:40px; padding:0 38px;');
      f = rep(f, 'justify-content:center; gap:24px; padding:0 38px;', 'justify-content:center; gap:40px; padding:0 38px;');
      f = rep(f, 'gap:10px; align-self:stretch;', 'gap:12px; align-self:stretch;');
      f = rep(f, 'font-size:16px; font-weight:600; color:#1D1C1A;', 'font-size:17px; font-weight:600; color:#1D1C1A;');
      f = rep(f, 'font-size:16px; font-weight:500; color:#1D1C1A;', 'font-size:17px; font-weight:500; color:#1D1C1A;');
    }
    if (isList){
      f = rep(f, 'top:126px; bottom:56px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:40px; padding:70px 32px 0;',
                 'top:118px; bottom:48px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:34px; padding:0 32px;');
      f = rep(f, 'gap:18px; align-self:stretch;', 'gap:26px; align-self:stretch;');
    }
    f = rep(f, 'font-size:26px; font-weight:500; line-height:38px;', 'font-size:24px; font-weight:500; line-height:32px;');
    f = rep(f, 'font-size:28px; font-weight:500; line-height:40px;', 'font-size:24px; font-weight:500; line-height:32px;');
    f = rep(f, 'font-size:28px; font-weight:500; line-height:44px;', 'font-size:26px; font-weight:500; line-height:39px;');
    f = rep(f, 'font-size:21px; font-weight:400; line-height:36px;', 'font-size:17px; font-weight:400; line-height:26px;');
    f = rep(f, 'font-size:22px; font-weight:500; line-height:32px;', 'font-size:20px; font-weight:500; line-height:28px;');
    f = rep(f, 'font-size:16px; font-weight:600; line-height:22px;', 'font-size:17px; font-weight:600; line-height:22px;');
    f = rep(f, 'margin-top:4px; font-size:13px; font-weight:400; line-height:19px;', 'margin-top:3px; font-size:15px; font-weight:400; line-height:21px;');
    f = rep(f, 'font-size:16px; font-weight:600; line-height:21px;', 'font-size:17px; font-weight:600; line-height:21px;');
    f = rep(f, 'font-size:16px; font-weight:500; line-height:21px;', 'font-size:17px; font-weight:500; line-height:21px;');
    f = rep(f, 'justify-content:center; gap:48px; padding:0 38px;', isQuote ? 'justify-content:center; gap:36px; padding:0 38px;' : 'justify-content:center; gap:22px; padding:0 38px;');
    f = rep(f, 'justify-content:center; gap:44px; padding:0 38px;', 'justify-content:center; gap:30px; padding:0 38px;');
    f = rep(f, 'justify-content:center; gap:30px; padding:0 38px;', 'justify-content:center; gap:24px; padding:0 38px;');
    return f;
  }

  // Returns array of frames (1 or more) after splitting long flat text frames.
  function splitFrame(f){
    const i = f.indexOf(END); if (i < 0) return [f];
    const head = f.slice(0, i + END.length);
    const body = f.slice(i + END.length);
    const wo = body.match(/^<div style="position:absolute; inset:0;[^"]*">/);
    if (!wo) return [f];
    const rest = body.slice(wo[0].length);
    const m = rest.match(/^((?:<div style="[^"]*">[^<]*<\/div>)+)<\/div><\/div>$/);
    if (!m) return [f];
    const kids = [...m[1].matchAll(/<div style="([^"]*)">([^<]*)<\/div>/g)].map(x => ({style:x[1], text:x[2]}));
    const isBody = k => k.style.includes('font-size:17px;');
    if (!kids.some(k => isBody(k) && k.text.length > PARA) && kids.filter(isBody).reduce((a,k)=>a+k.text.length,0) <= MAX) return [f];
    const out = [];
    const chunk = (text) => {
      const sents = text.split(/(?<=[.!?…][”’"']?)\s+/);
      if (sents.length < 2) return [text];
      const n = Math.ceil(text.length / PARA);
      let bestParts = null, bestScore = Infinity;
      const rec = (start, left, parts) => {
        if (left === 1){ const p = parts.concat([sents.slice(start).join(' ')]); const s = Math.max(...p.map(x=>x.length)); if (s < bestScore){ bestScore = s; bestParts = p; } return; }
        for (let c = start + 1; c <= sents.length - (left - 1); c++) rec(c, left - 1, parts.concat([sents.slice(start, c).join(' ')]));
      };
      rec(0, Math.min(n, sents.length), []);
      return bestParts || [text];
    };
    for (const k of kids){
      if (isBody(k) && k.text.length > PARA){ for (const t of chunk(k.text)) out.push({style:k.style, text:t}); continue; }
      out.push(k);
    }
    const frames = []; let cur = []; let len = 0;
    for (const k of out){
      if (!isBody(k)){ if (cur.length && len > 0){ frames.push(cur); cur = []; len = 0; } cur.push(k); continue; }
      if (cur.length && len > 0 && len + k.text.length > MAX){ frames.push(cur); cur = []; len = 0; }
      cur.push(k); len += k.text.length;
    }
    if (cur.length) frames.push(cur);
    return frames.map(ks => {
      if (ks.every(isBody)) ks = ks.map((k, i) => ({text: k.text, style: k.style.replace(/color:#(55534E|1D1C1A);/, i === ks.length - 1 ? 'color:#1D1C1A;' : 'color:#55534E;')}));
      return head + wo[0] + ks.map(k => `<div style="${k.style}">${k.text}</div>`).join('') + '</div></div>';
    });
  }

  const labelText = f => {
    const b = f.slice(f.indexOf(END)); const t = [...b.matchAll(/font-size:(?:24|17|20)px;[^"]*">([^<]+)<\/div>/g)].map(x=>x[1])[0] || '';
    return t.length > 30 ? t.slice(0, 30).trimEnd() + '…' : t;
  };

  const sections = html.split(SECT);
  for (let s = 1; s < sections.length; s++){
    const sec = SECT + sections[s];
    const pieces = sec.split(COL);
    const nFrames = (sec.match(/data-screen-label=/g) || []).length;
    const cols = []; let inCols = 0;
    for (let p = 1; p < pieces.length; p++){
      const pm = pieces[p].match(/^\n(<div style="align-self:flex-start; background:#FFE885;[^"]*">)(?:\d+ of \d+ &middot; )?([^<]*)<\/div>\n([\s\S]*?)\n<\/div>\n([\s\S]*)$/);
      if (!pm){ cols.push({raw: pieces[p]}); continue; }
      const rawFrames = pm[3].split(/\n+/).filter(x => x.length);
      if (!rawFrames.length || !rawFrames.every(x => x.startsWith('<div data-screen-label='))){ cols.push({raw: pieces[p]}); continue; }
      inCols += rawFrames.length;
      cols.push({labelOpen: pm[1], text: pm[2], groups: rawFrames.map(rf => splitFrame(restyleFrame(rf))), after: pm[4]});
    }
    if (inCols !== nFrames || cols.some(c => c.raw !== undefined)){
      // structure not understood: restyle in place only
      sections[s] = sec.split(/(?=<div data-screen-label=)/).map((chunk, ci) => {
        if (ci === 0) return chunk;
        const nl = chunk.indexOf('\n'); const fr = nl < 0 ? chunk : chunk.slice(0, nl);
        return restyleFrame(fr) + chunk.slice(fr.length);
      }).join('').slice(SECT.length);
      continue;
    }
    let total = 0; cols.forEach(c => c.groups.forEach(g => total += g.length));
    const lessonTag = (sec.match(/data-screen-label="(L\d+) Frame/) || [,'L'])[1];
    let n = 0; let outStr = pieces[0];
    for (const c of cols){
      c.groups.forEach((g, gi) => g.forEach((fr, fi) => {
        n++;
        const lbl = (gi === 0 && fi === 0 && c.text !== 'Close') ? c.text : labelText(fr);
        const labelOpen = c.labelOpen.replace(/rotate\(-?0\.7deg\)/, `rotate(${n % 2 ? '-0.7deg' : '0.7deg'})`);
        fr = fr.replace(/data-screen-label="L\d+ Frame \d+"/, `data-screen-label="${lessonTag} Frame ${String(n).padStart(2,'0')}"`);
        fr = fr.replace(/width:\d+%; border-radius:1px; background:#B4B1AB;/, `width:${Math.floor(n/total*100)}%; border-radius:1px; background:#B4B1AB;`);
        const last = gi === c.groups.length - 1 && fi === g.length - 1;
        outStr += `${COL}\n${labelOpen}${n} of ${total} &middot; ${lbl}</div>\n${fr}\n</div>\n${last ? c.after : ''}`;
      }));
    }
    sections[s] = outStr.slice(SECT.length);
  }
  return sections.join(SECT);
};
