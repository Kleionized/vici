// v2 redesign: medallions · tiers · detail · log · urge overview · weekly report. Airy, stoic-style, no insight blurbs.
// Usage: const build = eval(await readFile('gen/v2.js')); const screens = build(K);
(function (K) {
  const { INK, TXT, SUB, MUTE, LINE, ART, CARD, GROUND, FONT, h1, p, stack, primary, tabBar, check, chevronL, medal, tierName, roman, segmented, backRow, shareIcon } = K;
  const ON = '#111111';
  const S = []; const add = (note, html) => S.push({ note, html });
  const frame = (label, inner) => K.frame(label, inner)
    .replace("background-image:url('noise-dark.png'); opacity:0.06;", "background-image:url('noise.png'); opacity:0.05;")
    .replace('box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(20,20,22,0.14);', 'box-shadow:0 0 0 1px rgba(0,0,0,0.12), 0 16px 40px rgba(20,20,22,0.18);')
    .replace(/#FFFFFF/g, ON);
  const sp = (h) => `<div style="height:${h}px;"></div>`;
  const titleHead = (title, right) => `${backRow(`<div style="width:36px; height:40px; display:flex; align-items:center;">${chevronL()}</div>`, right ? `<div style="height:40px; display:flex; align-items:center;">${right}</div>` : '')}<div style="position:absolute; left:24px; right:24px; top:108px;">${h1(title, { size: 32, lh: 38 })}</div>`;
  const pill = (t) => `<div style="height:32px; border-radius:16px; background:${CARD}; display:inline-flex; align-items:center; padding:0 14px; font-size:13px; font-weight:700; white-space:nowrap; color:${TXT};">${t}</div>`;
  const center = (top, children, gap = 8, inset = 24) => `<div style="position:absolute; left:${inset}px; right:${inset}px; top:${top}px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${gap}px;">${children.join('')}</div>`;
  const big = (t, size = 56, lh) => `<div style="font-size:${size}px; font-weight:700; letter-spacing:${(-size * 0.035).toFixed(1)}px; line-height:${lh || Math.round(size * 1.05)}px; color:${TXT}; white-space:nowrap;">${t}</div>`;
  const cap = (t, o = {}) => `<div style="font-size:${o.size || 15}px; font-weight:${o.w || 400}; line-height:${o.lh || 22}px; color:${o.color || MUTE}; text-align:center; white-space:nowrap;">${t}</div>`;
  const kicker = (t, o = {}) => `<div style="font-size:13px; font-weight:700; color:${o.color || MUTE}; white-space:nowrap; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const rows = (items, o = {}) => `<div style="display:flex; flex-direction:column;">${items.map((r, i) => `<div style="display:flex; align-items:center; justify-content:space-between; gap:14px; height:${o.h || 52}px; padding:0 2px; ${i ? `border-top:1px solid ${LINE};` : ''}"><span style="font-size:15px; font-weight:700; color:${TXT}; white-space:nowrap;">${r[0]}</span>${r[1] != null ? `<span style="font-size:14px; font-weight:700; white-space:nowrap; color:${r[2] ? TXT : MUTE}; display:flex; align-items:center; gap:8px;">${r[2] ? `<span style="width:6px; height:6px; border-radius:3px; background:${TXT}; display:inline-block;"></span>` : ''}${r[1]}</span>` : ''}</div>`).join('')}</div>`;
  const node = (i, ns, achieved) => `<div style="width:${ns}px; height:${ns}px; border-radius:50%; background:${GROUND};">${medal(i, ns, '', { dim: i > achieved })}</div>`;
  const tierPath = (achieved, frac, thresholds, o = {}) => {
    const ns = o.size || 36; const fill = achieved < 0 ? 0 : Math.min(1, (achieved + frac) / 4);
    return `<div style="display:flex; flex-direction:column; gap:10px;"><div style="position:relative; height:${ns}px;"><div style="position:absolute; left:10%; right:10%; top:${ns / 2 - 1}px; height:2px; background:${LINE};"></div>${fill ? `<div style="position:absolute; left:10%; width:${(fill * 80).toFixed(1)}%; top:${ns / 2 - 1}px; height:2px; background:${INK};"></div>` : ''}<div style="position:absolute; inset:0; display:flex;">${[0, 1, 2, 3, 4].map(i => `<div style="flex:1; display:flex; justify-content:center;">${node(i, ns, achieved)}</div>`).join('')}</div></div><div style="display:flex;">${[0, 1, 2, 3, 4].map(i => `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;"><span style="font-size:13px; font-weight:700; color:${i <= achieved ? TXT : MUTE};">${tierName[i]}</span>${thresholds ? `<span style="font-size:12px; font-weight:700; color:${i <= achieved ? SUB : ART}; white-space:nowrap;">${thresholds[i]}</span>` : ''}</div>`).join('')}</div></div>`;
  };

  // ── 88 · Medallions album ──
  const cell = (name, sub, tier, glyph, o = {}) => `<div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;">${medal(tier, 64, glyph, { dim: o.dim })}<div style="display:flex; flex-direction:column; gap:2px;"><span style="font-size:15px; font-weight:700; letter-spacing:-0.2px; color:${o.dim ? MUTE : TXT}; white-space:nowrap;">${name}</span><span style="font-size:12px; font-weight:700; color:${MUTE}; white-space:nowrap;">${sub}</span></div>${o.progress != null ? `<div style="width:56px; height:3px; border-radius:2px; background:${LINE};"><div style="width:${o.progress}%; height:3px; border-radius:2px; background:${INK};"></div></div>` : ''}</div>`;
  const album = (label, note, sel, count, cells, o = {}) => add(note, frame(label, `${titleHead('Medallions')}
<div style="position:absolute; left:16px; right:16px; top:164px;">${segmented(['Earned', 'Still to earn'], sel)}</div>
<div style="position:absolute; left:0; right:0; top:238px;">${cap(count, { size: 13, w: 600 })}</div>
<div style="position:absolute; left:24px; right:24px; top:288px; display:${o.flex ? 'flex; justify-content:center; gap:48px;' : 'grid; grid-template-columns:1fr 1fr 1fr; row-gap:36px; column-gap:8px;'}">${cells.join('')}</div>
${tabBar('Journey')}`));
  album('Medallions', '88 · Medallions', 0, '10 of 12 earned', [cell('Veni', 'Jun 9', 4, ''), cell('First light', 'Jun 9', 4, ''), cell('Vidi', 'Tier I · Day 7', 0, 'I'), cell('Vici', 'Tier I · ×5', 0, 'I'), cell('Breakwater', 'Tier I · ×1', 0, 'I'), cell('Rebound', 'Tier I · ×1', 0, 'I')]);
  album('Medallions Still To Earn', '88B · Medallions — Still to earn', 1, '2 still to earn', [cell('Archive', '9 of 10 entries', 0, 'I', { dim: true, progress: 90 }), cell('Return', 'After 7 days away', 4, '', { dim: true })], { flex: true });
  album('Album Earned II', '88C · Medallions — Earned II', 0, '10 of 12 earned', [cell('Logbook', 'Tier II · ×25', 1, 'II'), cell('Pulse', 'Tier I · ×5', 0, 'I'), cell('Black Box', 'Jul 20', 4, ''), cell('Lessons', 'Tier I · ×5', 0, 'I')]);

  // ── 88D–H, 89 · medallion detail ──
  const detail = (label, note, name, desc, tier, tierLabel, quote, o = {}) => add(note, frame(label, `${backRow(`<div style="width:36px; height:40px; display:flex; align-items:center;">${chevronL()}</div>`, `<div style="width:36px; height:40px; display:flex; align-items:center; justify-content:flex-end;">${shareIcon()}</div>`)}
<div style="position:absolute; left:0; right:0; top:118px; display:flex; justify-content:center;">${medal(tier, 168, o.pending ? '' : roman[tier], { dim: o.pending })}</div>
${center(314, [h1(name, { center: true, size: 32, lh: 38 }), p(desc, { center: true, size: 15, lh: 22 }), sp(4), kicker(tierLabel, { center: true, color: o.pending ? ART : MUTE })], 8)}
<div style="position:absolute; left:24px; right:24px; top:456px;">${tierPath(o.pending ? -1 : tier, 0, null, { size: 30 })}</div>
<div style="position:absolute; left:44px; right:44px; top:556px; text-align:center; font-size:18px; font-style:italic; font-weight:400; line-height:28px; color:${TXT}; text-wrap:pretty;">${quote}</div>
${primary(o.pending ? 'Back to medallions' : 'Share this')}`));
  const BW = 'An overwhelming urge that ended without a slip.';
  [['Paper', 0, 'Tier I · ×1', '“The first wave broke against you, not over you.”'], ['Bronze', 1, 'Tier II · ×5', '“Five storms met at full height. The wall is real now.”'], ['Silver', 2, 'Tier III · ×10', '“Ten overwhelming urges, none of them decisive.”'], ['Gold', 3, 'Tier IV · ×25', '“Twenty-five. What used to flood you now only gets loud.”'], ['Platinum', 4, 'Tier V · ×50', '“Fifty waves. The sea hasn’t changed. The wall did.”']].forEach((r, i) => detail(`Breakwater ${r[0]}`, `88${'DEFGH'[i]} · Breakwater — ${r[0]}`, 'Breakwater', BW, r[1], r[2], r[3]));
  const VD = 'Urges met and outlasted — the conquering half of the campaign.';
  detail('Detail Paper', '89A · Vici Detail — Paper', 'Vici', VD, 0, 'Not yet · first at ×1', '“Nine minutes, start to finish. You watched it rise, crest, and leave without you.”', { pending: true });
  [['Bronze', 1, 'Tier II · ×25', '“Twenty-five behind you now — the pattern is unmistakable.”'], ['Silver', 2, 'Tier III · ×100', '“A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.”'], ['Gold', 3, 'Tier IV · ×250', '“Two hundred and fifty. The sea keeps coming. You keep standing.”'], ['Platinum', 4, 'Tier V · ×1,000', '“A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.”']].forEach((r, i) => detail(`Detail ${r[0]}`, `89${'CDEF'[i]} · Vici Detail — ${r[0]}`, 'Vici', VD, r[1], r[2], r[3]));

  // ── 88I–P · tiers ──
  // same skeleton as detail(): medal · name · desc · tier line · path · (progress in place of the quote)
  const tiers = (label, note, name, desc, thresholds, achieved, current, nextText, frac) => add(note, frame(label, `${backRow(`<div style="width:36px; height:40px; display:flex; align-items:center;">${chevronL()}</div>`)}
<div style="position:absolute; left:0; right:0; top:118px; display:flex; justify-content:center;">${medal(Math.max(achieved, 0), 168, achieved < 0 ? '' : roman[achieved], { dim: achieved < 0 })}</div>
${center(314, [h1(name, { center: true, size: 32, lh: 38 }), p(desc, { center: true, size: 15, lh: 22 }), sp(4), kicker(achieved < 0 ? `Not yet · first at ${thresholds[0]}` : `Tier ${roman[achieved]} · ${thresholds[achieved]}`, { center: true, color: achieved < 0 ? ART : MUTE })], 8)}
<div style="position:absolute; left:24px; right:24px; top:456px;">${tierPath(achieved, frac, thresholds, { size: 30 })}</div>
${center(566, [big(current, 48), cap(nextText)], 6)}
${primary('Back to medallions')}`));
  tiers('Tiers Vidi', '88I · Tiers — Vidi', 'Vidi', 'Days Vici was opened and something recorded.', ['Day 7', 'Day 30', 'Day 90', 'Day 180', 'Day 365'], 0, 'Day 13', '17 days to Bronze', 0.26);
  tiers('Tiers Vici', '88J · Tiers — Vici', 'Vici', 'Urge logs that did not end in a slip.', ['×5', '×25', '×100', '×250', '×1,000'], 0, '×23', '2 more to Bronze', 0.9);
  tiers('Tiers Rebound', '88K · Tiers — Rebound', 'Rebound', 'A check-in on the day after a slip.', ['×1', '×10', '×25', '×50', '×100'], 0, '×2', '8 more to Bronze', 0.11);
  tiers('Tiers Breakwater', '88L · Tiers — Breakwater', 'Breakwater', BW, ['×1', '×5', '×10', '×25', '×50'], 0, '×3', '2 more to Bronze', 0.5);
  tiers('Tiers Logbook', '88M · Tiers — Logbook', 'Logbook', 'Urge logs saved, whatever the outcome.', ['×5', '×25', '×75', '×200', '×500'], 1, '×26', '49 more to Silver', 0.02);
  tiers('Tiers Pulse', '88N · Tiers — Pulse', 'Pulse', 'Check-ins completed.', ['×5', '×25', '×75', '×200', '×500'], 0, '×19', '6 more to Bronze', 0.7);
  tiers('Tiers Archive', '88O · Tiers — Archive', 'Archive', 'Journal entries saved.', ['×10', '×50', '×100', '×200', '×365'], -1, '×9', '1 more to Paper', 0);
  tiers('Tiers Lessons', '88P · Tiers — Lessons', 'Lessons', 'Lessons completed.', ['×5', '×25', '×50', '×75', '×110'], 0, '×12', '13 more to Bronze', 0.35);
  const once = (name, sub, date, on) => `<div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:12px;">${medal(4, 84, '', { dim: !on })}<div style="display:flex; flex-direction:column; gap:3px;"><span style="font-size:17px; font-weight:700; letter-spacing:-0.2px; color:${on ? TXT : MUTE}; white-space:nowrap;">${name}</span><span style="font-size:13px; font-weight:400; line-height:18px; color:${MUTE}; white-space:nowrap;">${sub}</span><span style="font-size:12px; font-weight:700; color:${on ? SUB : ART}; white-space:nowrap; margin-top:2px;">${date}</span></div></div>`;
  add('88Q · Tiers — One-offs', frame('Tiers One-offs', `${titleHead('Earned once')}
${stack(160, [p('One tier. Kept for good.', { size: 15, lh: 22 })])}
<div style="position:absolute; left:32px; right:32px; top:240px; display:grid; grid-template-columns:1fr 1fr; row-gap:44px; column-gap:16px;">${once('Veni', 'Finished onboarding', 'Jun 9', true)}${once('First light', 'The first check-in', 'Jun 9', true)}${once('Black Box', 'First slip logged', 'Jul 20', true)}${once('Return', 'Back after 7+ days away', 'Not yet', false)}</div>`));

  // ── 91 · Your log ──
  const logHead = (sel) => `${titleHead('Your log')}<div style="position:absolute; left:16px; right:16px; top:164px;">${segmented(['Urges', 'Check-ins', 'Reports'], sel)}</div>`;
  const dayDots = (vals, render, today) => `<div style="display:flex; justify-content:space-between;">${vals.map((v, i) => `<div style="width:36px; display:flex; flex-direction:column; align-items:center; gap:10px;"><div style="height:36px; display:flex; align-items:center; justify-content:center;">${render(v, i)}</div><span style="font-size:11px; font-weight:700; color:${today === i ? TXT : ART};">${'MTWTFSS'[i]}</span></div>`).join('')}</div>`;
  const urgeDot = (v) => v ? `<div style="width:34px; height:34px; border-radius:17px; background:${INK}; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:${ON};">${v}</div>` : `<div style="width:8px; height:8px; border-radius:4px; background:${LINE};"></div>`;
  const moodDot = (m) => m ? `<div style="width:${12 + m * 4.4}px; height:${12 + m * 4.4}px; border-radius:50%; background:${INK};"></div>` : `<div style="width:8px; height:8px; border-radius:4px; background:${LINE};"></div>`;
  const section = (title, items, o) => `<div style="display:flex; flex-direction:column; gap:8px;">${title ? kicker(title) : ''}${rows(items, o)}</div>`;
  add('91 · Log — Urges', frame('Log Urges', `${logHead(0)}
${center(236, [big('3', 64), cap('urges this week')], 10)}
<div style="position:absolute; left:32px; right:32px; top:352px;">${dayDots([0, 1, 0, 1, 1, 0, 0], urgeDot, 6)}</div>
<div style="position:absolute; left:24px; right:24px; top:440px;">${section('', [['Fri · 9:05 pm', 'Strong'], ['Thu · 3:10 pm', 'Mild'], ['Tue · 11:40 pm', 'Intense'], ['Sun · 10:22 pm', 'Slipped', true], ['Wed · 12:05 am', 'Mild']])}</div>
${tabBar('Log')}`));
  add('91-2 · Log — Check-ins', frame('Log Check-ins', `${logHead(1)}
${center(236, [big('12', 64), cap('days in a row')], 10)}
<div style="position:absolute; left:32px; right:32px; top:352px;">${dayDots([4, 3, 4, 4, 3, 4, 4], moodDot, 6)}</div>
<div style="position:absolute; left:24px; right:24px; top:440px;">${section('', [['Today', 'Steady'], ['Yesterday', 'Flat'], ['Friday', 'Good'], ['Thursday', 'Good'], ['Wednesday', 'Calm']])}</div>
${tabBar('Log')}`));
  const spark = `<svg width="220" height="56" viewBox="0 0 220 56"><path d="M4 48 C 40 46, 60 38, 90 36 C 120 34, 140 22, 170 16 C 190 12, 204 8, 216 6" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"></path><circle cx="216" cy="6" r="5" fill="${INK}"></circle></svg>`;
  add('91-3 · Log — Reports', frame('Log Reports', `${logHead(2)}
${center(236, [big('1,240', 64), cap('+12 this week')], 10)}
<div style="position:absolute; left:0; right:0; top:352px; display:flex; justify-content:center;">${spark}</div>
<div style="position:absolute; left:24px; right:24px; top:432px; height:52px; border-radius:26px; background:${INK}; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:${ON}; cursor:pointer;">Open this week’s report</div>
<div style="position:absolute; left:24px; right:24px; top:518px;">${section('', [['Jul 7–13', '+8'], ['Jun 30 – Jul 6', '−4'], ['Jun 23–29', '+6'], ['Jun 16–22', '+5']])}</div>
${tabBar('Log')}`));

  // ── 91A–D · Urge overview ──
  const ovHead = (sel) => `${titleHead('Urge overview', pill('Last 30 days'))}<div style="position:absolute; left:16px; right:16px; top:164px;">${segmented(['Overview', 'Strength', 'Mood', 'Timing'], sel)}</div>`;
  const trio = (items) => `<div style="display:flex;">${items.map(s => `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center;"><span style="font-size:${s[0].length > 3 ? 26 : 40}px; font-weight:700; letter-spacing:-1px; line-height:44px; color:${TXT}; white-space:nowrap;">${s[0]}</span><span style="font-size:12px; font-weight:700; color:${MUTE}; white-space:nowrap;">${s[1]}</span></div>`).join('')}</div>`;
  const dotRows = (items) => `<div style="display:flex; flex-direction:column;">${items.map((r, i) => `<div style="display:flex; align-items:center; gap:14px; height:46px; padding:0 2px; ${i ? `border-top:1px solid ${LINE};` : ''}"><span style="width:96px; font-size:15px; font-weight:700; color:${TXT}; white-space:nowrap;">${r[0]}</span><div style="flex:1; display:flex; gap:6px; align-items:center;">${Array.from({ length: r[1] }, () => `<span style="width:9px; height:9px; border-radius:50%; background:${INK}; display:inline-block;"></span>`).join('')}</div><span style="font-size:14px; font-weight:700; color:${MUTE};">${r[1]}</span></div>`).join('')}</div>`;
  add('91A · Urge Overview — Summary', frame('Urge Overview Summary', `${ovHead(0)}
${center(236, [big('9', 64), cap('urges · 7 ridden out')], 10)}
<div style="position:absolute; left:24px; right:24px; top:372px;">${section('', [['Jul 19', 'Slipped', true], ['Jul 17', '6 min'], ['Jul 15', '4 min'], ['Jul 13', 'Slipped', true], ['Jul 9', '3 min']])}</div>`));
  const dist = [1, 1, 3, 3, 1];
  const dotCols = `<div style="display:flex; flex-direction:column; gap:12px;"><div style="display:flex; align-items:flex-end; height:96px;">${dist.map(n => `<div style="flex:1; display:flex; flex-direction:column-reverse; align-items:center; gap:7px;">${Array.from({ length: n }, () => `<div style="width:12px; height:12px; border-radius:6px; background:${INK};"></div>`).join('')}</div>`).join('')}</div><div style="height:1px; background:${LINE};"></div><div style="display:flex;">${[1, 2, 3, 4, 5].map((n, i) => `<div style="flex:1; text-align:center; font-size:13px; font-weight:700; color:${dist[i] ? TXT : ART};">${n}</div>`).join('')}</div></div>`;
  add('91B · Urge Overview — Strength', frame('Urge Overview', `${ovHead(1)}
${center(236, [big('Strong', 44, 67), cap('most urges')], 10)}
<div style="position:absolute; left:40px; right:40px; top:352px;">${dotCols}</div>
<div style="position:absolute; left:24px; right:24px; top:524px;">${dotRows([['Stress', 5], ['Late night', 4], ['Boredom', 3], ['Tiredness', 1]])}</div>`));
  const bubble = (name, pct, d) => `<div style="display:flex; flex-direction:column; align-items:center; gap:12px;"><div style="height:92px; display:flex; align-items:flex-end;"><div style="width:${d}px; height:${d}px; border-radius:50%; background:${INK};"></div></div><div style="display:flex; flex-direction:column; align-items:center; gap:2px;"><span style="font-size:14px; font-weight:700; color:${TXT};">${name}</span><span style="font-size:12px; font-weight:700; color:${MUTE};">${pct}</span></div></div>`;
  add('91C · Urge Overview — Mood', frame('Urge Overview Mood', `${ovHead(2)}
${center(236, [big('Tense', 44, 67), cap('before most urges')], 10)}
<div style="position:absolute; left:24px; right:24px; top:352px; display:flex; justify-content:center; align-items:flex-start; gap:26px;">${bubble('Tense', '6', 88)}${bubble('Flat', '4', 66)}${bubble('Restless', '3', 54)}${bubble('Low', '1', 36)}</div>`));
  const hourCounts = { 0: 2, 1: 1, 15: 1, 19: 1, 21: 1, 22: 1, 23: 2 };
  const R = 96, C = 118;
  const pt = (h, r) => { const a = (h / 24) * Math.PI * 2 - Math.PI / 2; return [(C + Math.cos(a) * r).toFixed(1), (C + Math.sin(a) * r).toFixed(1)]; };
  const ticks = Array.from({ length: 24 }, (_, h) => { const major = h % 6 === 0; const [x1, y1] = pt(h, R - (major ? 10 : 6)); const [x2, y2] = pt(h, R); return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${major ? MUTE : LINE}" stroke-width="${major ? 2 : 1.5}" stroke-linecap="round"></path>`; }).join('');
  const dots = Object.entries(hourCounts).map(([h, n]) => { const [x, y] = pt(+h + 0.5, R); return `<circle cx="${x}" cy="${y}" r="${5 + n * 2.5}" fill="${INK}"></circle>`; }).join('');
  const lbl = (h, t, dx, dy) => { const [x, y] = pt(h, R + 18); return `<text x="${(+x + dx).toFixed(1)}" y="${(+y + dy).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="700" fill="${MUTE}">${t}</text>`; };
  const clock = `<svg width="236" height="236" viewBox="0 0 236 236" style="overflow:visible;"><circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${LINE}" stroke-width="2"></circle>${ticks}${dots}${lbl(0, '12 am', 0, 4)}${lbl(6, '6 am', 4, 4)}${lbl(12, '12 pm', 0, 6)}${lbl(18, '6 pm', -4, 4)}<text x="${C}" y="${C + 2}" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="700" letter-spacing="-0.4" fill="${TXT}">11 pm – 1 am</text><text x="${C}" y="${C + 24}" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="600" fill="${MUTE}">most urges</text></svg>`;
  add('91D · Urge Overview — When &amp; Where', frame('Urge Overview When', `${ovHead(3)}
<div style="position:absolute; left:0; right:0; top:248px; display:flex; justify-content:center;">${clock}</div>
<div style="position:absolute; left:24px; right:24px; top:540px;">${dotRows([['Bedroom', 5], ['Desk', 3], ['Bathroom', 1]])}</div>`));

  // ── 91C0–3 · Weekly report ──
  const repHead = () => `${titleHead('Weekly report', pill('Jul 14–20'))}<div style="position:absolute; left:16px; right:16px; top:164px;">${segmented(['Score', 'Days', 'Urges'], REP_TAB)}</div>`;
  let REP_TAB = 0;
  const vals = [1228, 1230, 1232, 1233, 1236, 1238, 1240];
  const px = (i) => 16 + i * 49.7, py = (v) => 108 - (v - 1228) / 12 * 88;
  const lineChart = `<svg width="100%" height="140" viewBox="0 0 330 140" preserveAspectRatio="none" style="display:block;"><path d="${vals.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>${vals.map((v, i) => i < 6 ? `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4.5" fill="${GROUND}" stroke="${INK}" stroke-width="2.5"></circle>` : `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="6.5" fill="${INK}"></circle>`).join('')}${'MTWTFSS'.split('').map((d, i) => `<text x="${px(i).toFixed(1)}" y="136" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="${i === 6 ? 800 : 600}" fill="${i === 6 ? TXT : MUTE}">${d}</text>`).join('')}</svg>`;
  const scoreBody = `${center(236, [big('1,240', 64), cap('+12 this week')], 10)}
<div style="position:absolute; left:32px; right:32px; top:352px;">${lineChart}</div>`;
  REP_TAB = 0; add('91C · Weekly Report — Score', frame('Weekly Report', `${repHead()}${scoreBody}`));
  const wave = `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 9c2.5 0 3-4 5-4s3 4 5 4 2-2 2-2" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"></path></svg>`;
  const dayCell = (st) => st === 1 ? `<div style="width:40px; height:40px; border-radius:20px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check(ON, 16)}</div>` : `<div style="width:40px; height:40px; border-radius:20px; box-shadow:0 0 0 2px ${INK} inset; display:flex; align-items:center; justify-content:center;">${wave}</div>`;
  const days = `<div style="display:flex; justify-content:space-between;">${[1, 1, 1, 1, 2, 1, 1].map((st, i) => `<div style="width:40px; display:flex; flex-direction:column; align-items:center; gap:10px;">${dayCell(st)}<span style="font-size:11px; font-weight:700; color:${i === 6 ? TXT : ART};">${'MTWTFSS'[i]}</span></div>`).join('')}</div>`;
  const lastWeek = `<div style="display:flex; justify-content:space-between; padding:0 11px;">${[1, 1, 0, 1, 1, 0, 1].map(v => `<div style="width:18px; height:18px; border-radius:9px; background:${v ? INK : 'transparent'}; box-shadow:${v ? 'none' : `0 0 0 1.5px ${LINE} inset`};"></div>`).join('')}</div>`;
  REP_TAB = 1; add('91C2 · Weekly Report — Days', frame('Weekly Report Days', `${repHead()}
${center(236, [big('7 of 7', 64), cap('clean days')], 10)}
<div style="position:absolute; left:32px; right:32px; top:352px;">${days}</div>
<div style="position:absolute; left:32px; right:32px; top:450px; display:flex; flex-direction:column; gap:16px;">${kicker('Last week', { center: true })}${lastWeek}</div>`));
  REP_TAB = 2; add('91C3 · Weekly Report — Urges', frame('Weekly Report Urges', `${repHead()}
${center(236, [big('3', 64), cap('urges · all ridden out')], 10)}
<div style="position:absolute; left:24px; right:24px; top:372px;">${section('', [['Tue · 11:40 pm', 'Intense'], ['Thu · 3:10 pm', 'Mild'], ['Fri · 9:05 pm', 'Strong']], { h: 56 })}</div>`));
  REP_TAB = 0; add('93D · Weekly report', frame('Settings Weekly Report', `${repHead()}${scoreBody}`));

  // ── 21D2 / 21E5 · check-in records (plain rows, more air) ──
  const { nav, H } = K;
  const recordRows = (items) => `<div style="display:flex; flex-direction:column;">${items.map((r, i) => `<div style="display:flex; align-items:center; gap:14px; height:58px; padding:0 2px; ${i ? `border-top:1px solid ${LINE};` : ''}"><div style="width:22px; height:22px; border-radius:11px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check(ON, 11)}</div><span style="flex:1; font-size:16px; font-weight:400; color:${TXT}; white-space:nowrap;">${r[0]}</span>${r[1] ? `<span style="font-size:15px; font-weight:700; color:${TXT}; white-space:nowrap;">${r[1]}</span>` : ''}</div>`).join('')}</div>`;
  add('21D2 · Morning — Yesterday', frame('Morning 1 Yesterday', `${nav({ step: 2, total: 5, close: true })}
${stack(136, [h1('Yesterday’s record.')])}
<div style="position:absolute; left:24px; right:24px; top:208px;">${recordRows([['Recovery score', '+12 → 1,240'], ['Pledge kept'], ['One urge surfed'], ['0 slips'], ['Part III finished']])}</div>
${H.sunrise(500)}
${primary('Continue')}`));
  add('21E5 · Night — Record', frame('Night 2 Record', `${nav({ step: 5, total: 6, close: true })}
${stack(136, [h1('Today’s record.')])}
<div style="position:absolute; left:24px; right:24px; top:208px;">${recordRows([['Pledge kept'], ['One urge surfed'], ['0 slips'], ['Part IV finished']])}</div>
<div style="position:absolute; left:0; right:0; top:470px; display:flex; justify-content:center;"><div style="height:44px; border-radius:22px; box-shadow:0 0 0 1.5px ${LINE}; display:inline-flex; align-items:center; gap:8px; padding:0 18px; font-size:15px; font-weight:700; color:${TXT}; white-space:nowrap;"><span style="font-size:18px; line-height:1;">+</span>Add to the record</div></div>
${primary('Continue')}`));

  return S;
})
