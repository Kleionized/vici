// Screens 51–101: subscription, check-in times, Today home, score, morning/night check-ins, week covers.
// Usage: const build = eval(await readFile('gen/mono-core.js')); const screens = build(K);
(function (K) {
  const { INK, TXT, SUB, MUTE, LINE, ART, CARD, GROUND, FONT, frame, nav, h1, p, caps, primary, ghost, stack, nextFab, options, grid2, chips, card, listRows, toggle, tabBar, header, weekStrip, pager, moodFace, check, chevronL, chevronR, chevronD, svgWrap, H } = K;
  const S = []; const add = (note, html) => S.push({ note, html });
  const NAME = 'Jerry';

  // 51 Manage subscription
  add('15 · Manage Subscription', frame('Manage Subscription', `${nav({ title: 'Subscription' })}
${stack(136, [
    card(`<div style="display:flex; justify-content:space-between; align-items:flex-start;"><div><div style="font-size:24px; font-weight:700; letter-spacing:-0.5px; color:${TXT};">Yearly</div><div style="margin-top:4px; font-size:14px; color:${SUB};">$39.99 / year · renews 10 Jul 2027</div></div><div style="height:28px; border-radius:14px; background:${INK}; display:flex; align-items:center; padding:0 12px; font-size:12px; font-weight:700; color:#FFFFFF;">Active</div></div><div style="margin-top:20px; padding-top:16px; border-top:1px solid ${LINE}; display:flex; justify-content:space-between; font-size:15px;"><span style="color:${MUTE};">Next charge</span><span style="font-weight:700; color:${TXT};">$39.99 on 10 Jul 2027</span></div>`),
    '<div style="height:10px;"></div>', caps('Plan'), listRows([{ label: 'Change plan', value: 'Yearly' }, { label: 'Redeem a code' }, { label: 'Restore purchases' }]),
    '<div style="height:10px;"></div>', caps('Billing'), listRows([{ label: 'Payment method', value: 'Apple ID' }, { label: 'Receipts &amp; invoices' }])], { gap: 18 })}
${ghost('Cancel subscription', { bottom: 56 })}`));

  // 52/53 time pickers
  const col = (items, sel, w = 70) => `<div style="width:${w}px; display:flex; flex-direction:column; align-items:center;">${items.map((t, i) => { const d = Math.abs(i - sel); return `<div style="height:44px; display:flex; align-items:center; font-size:${d === 0 ? 30 : 22}px; font-weight:${d === 0 ? 900 : 400}; color:${d === 0 ? TXT : d === 1 ? MUTE : LINE};">${t}</div>`; }).join('')}</div>`;
  const timePicker = (hours, mins, ampm) => `<div style="position:relative; height:220px; display:flex; justify-content:center; gap:10px;"><div style="position:absolute; left:40px; right:40px; top:88px; height:44px; border-radius:14px; background:${CARD};"></div><div style="position:relative; display:flex; gap:12px;">${col(hours, 2)}<div style="height:220px; display:flex; align-items:center; font-size:30px; font-weight:700; color:${TXT}; margin-top:0;">:</div>${col(mins, 2)}${col(ampm, 2, 60)}</div></div>`;
  const dayToggles = (on) => `<div style="display:flex; justify-content:space-between;">${['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map((d, i) => `<div style="width:42px; height:42px; border-radius:21px; background:${on[i] ? INK : CARD}; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:${on[i] ? '#FFFFFF' : TXT};">${d}</div>`).join('')}</div>`;
  const timeScreen = (label, note, q, hours, mins, ampm) => add(note, frame(label, `${nav({})}
${stack(136, [h1(q), '<div style="height:6px;"></div>', caps('Select time'), timePicker(hours, mins, ampm), '<div style="height:6px;"></div>', caps('Select days'), dayToggles([1, 1, 1, 1, 1, 1, 1])], { gap: 18 })}
${primary('Save time')}`));
  timeScreen('Morning Check-in Time', '19B · Morning check-in time', 'When should the morning check-in come?', ['6', '7', '8', '9', '10'], ['58', '59', '00', '01', '02'], ['', '', 'AM', 'PM', '']);
  timeScreen('Nightly Check-in Time', '19C · Nightly check-in time', 'When should the nightly check-in come?', ['8', '9', '10', '11', '12'], ['28', '29', '30', '31', '32'], ['', 'AM', 'PM', '', '']);

  // ── Today home ──
  const days = [{ d: 'Su', v: '13' }, { d: 'Mo', v: 'check' }, { d: 'Tu', v: 'check' }, { d: 'We', v: 'check' }, { d: 'Th', v: 'check' }, { d: 'Fr', v: 'check', today: true }, { d: 'Sa', v: '19', future: true }];
  const spark = `<svg width="200" height="48" viewBox="0 0 200 48"><path d="M0 40 C 20 38, 30 30, 50 32 C 70 34, 80 22, 100 24 C 120 26, 130 14, 150 12 C 170 10, 185 8, 200 4" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"></path><circle cx="200" cy="4" r="4" fill="${INK}"></circle></svg>`;
  const rankBar = (from, to, pct, fromN, toN) => `<div style="display:flex; flex-direction:column; gap:8px;"><div style="height:6px; border-radius:3px; background:${LINE}; position:relative;"><div style="position:absolute; left:0; top:0; bottom:0; width:${pct}%; border-radius:3px; background:${INK};"></div><div style="position:absolute; left:${pct}%; top:-4px; width:14px; height:14px; margin-left:-7px; border-radius:7px; background:${GROUND}; box-shadow:0 0 0 3px ${INK} inset;"></div></div><div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; color:${MUTE}; white-space:nowrap;"><span>${from} · ${fromN}</span><span>${to} · ${toN}</span></div></div>`;
  add('21 · Today', frame('Today Home', `${header('Good morning.', '41')}
${weekStrip(days)}
${stack(206, [card(`<div style="display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center;">${caps('Recovery score')}<div style="font-size:60px; font-weight:700; letter-spacing:-2.4px; line-height:66px; color:${TXT};">1,240</div><div style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:${SUB}; white-space:nowrap;"><span style="height:26px; border-radius:13px; background:${CARD}; display:inline-flex; align-items:center; padding:0 10px; gap:4px; font-weight:700; color:${TXT};"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 9V1M1.5 4.5L5 1l3.5 3.5" fill="none" stroke="${TXT}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>18</span>last 30 days</div><div style="margin:8px 0 4px;">${spark}</div><div style="width:100%; margin-top:6px;">${rankBar('Navigator', 'Helmsman', 60, '1,150', '1,300')}</div></div>`, { outline: true, r: 28, pad: '26px 24px' })], { inset: 16 })}
<div style="position:absolute; left:0; right:0; top:568px; text-align:center;">${caps('This morning')}</div>
<div style="position:absolute; left:0; right:0; top:600px; display:flex; justify-content:center; gap:10px;">
<div style="height:44px; border-radius:22px; background:${CARD}; display:flex; align-items:center; gap:10px; padding:0 18px 0 8px;">${moodFace(3, 30, false)}<span style="font-size:15px; font-weight:700; color:${TXT};">Fine</span></div>
<div style="height:44px; border-radius:22px; background:${CARD}; display:flex; align-items:center; gap:10px; padding:0 18px 0 8px;"><div style="width:30px; height:30px; border-radius:15px; box-shadow:0 0 0 1.5px ${LINE}; display:flex; align-items:center; justify-content:center;"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M8 1L2 8h5l-1 5 6-7H7z" fill="${TXT}"></path></svg></div><span style="font-size:15px; font-weight:700; color:${TXT};">Low energy</span></div></div>
${tabBar('Today')}`));

  // Today II / task
  const lessonCard = (num, title, sub, w = 250) => `<div style="width:${w}px; flex-shrink:0; border-radius:24px; background:${CARD}; padding:20px 20px 18px; box-sizing:border-box; display:flex; flex-direction:column; gap:6px;"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:12px; font-weight:700; letter-spacing:2px; color:${MUTE};">${sub}</span><span style="font-size:15px; font-weight:700; letter-spacing:1px; color:${MUTE};">${num}</span></div><div style="font-size:19px; font-weight:700; letter-spacing:-0.3px; color:${TXT}; margin-top:4px;">${title}</div><div style="margin-top:12px; align-self:flex-start; height:40px; border-radius:20px; background:${INK}; display:flex; align-items:center; padding:0 20px; font-size:14px; font-weight:700; color:#FFFFFF;">Begin</div></div>`;
  const thisWeek = (top) => `<div style="position:absolute; left:0; right:0; top:${top}px; text-align:center;">${caps('This week')}</div><div style="position:absolute; left:16px; right:-60px; top:${top + 32}px; display:flex; gap:12px; overflow:hidden;">${lessonCard('05', 'Naming your triggers', 'Lesson 5 · Week II')}${lessonCard('—', 'Urge surfing', 'Ride it out')}</div>`;
  const taskCard = (kicker, title, body, done) => card(`<div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;">${caps(kicker)}${title ? `<div style="font-size:22px; font-weight:700; letter-spacing:-0.4px; color:${TXT};">${title}</div>` : ''}<div style="font-size:17px; line-height:26px; color:${title ? SUB : TXT}; font-weight:${title ? 400 : 700}; max-width:280px;">${body}</div><div style="margin-top:8px; width:44px; height:44px; border-radius:22px; background:${done ? INK : 'transparent'}; box-shadow:${done ? 'none' : `0 0 0 1.5px ${LINE}`}; display:flex; align-items:center; justify-content:center;">${done ? check('#FFFFFF', 18) : ''}</div></div>`, { outline: true, r: 28, pad: '28px 22px' });
  add('21 · Today — p2', frame('Today Home II', `${header('Good morning.', '41')}${weekStrip(days)}
${stack(206, [taskCard('Today’s task', '', 'Put your phone somewhere difficult to access before you sleep.', false)], { inset: 16 })}
${thisWeek(500)}
${tabBar('Today')}`));
  add('21p2B · Today — Task summary', frame('Today Home Task', `${header('Good morning.', '41')}${weekStrip(days)}
${stack(206, [taskCard('Today’s task', 'Surviving the night', 'Put the device you use for porn out of reach before you sleep.', true)], { inset: 16 })}
${thisWeek(528)}
${tabBar('Today')}`));
  // Today III — pledge with bleeding hero
  add('21 · Today — p3', frame('Today Home III', `${header('Good evening.', '41')}${weekStrip(days)}
<div style="position:absolute; left:0; right:0; top:206px; text-align:center;">${caps('Your pledge')}</div>
<svg width="150" height="170" viewBox="0 0 150 170" style="position:absolute; left:-30px; top:240px; overflow:visible;"><path d="M-40 170 C -40 120, 0 40, 70 40 C 105 40, 122 62, 118 94 C 114 122, 92 140, 66 150 C 40 160, 0 166, -40 170 Z" fill="${INK}"></path><path d="M30 122 C 38 88, 58 66, 84 60" fill="none" stroke="${GROUND}" stroke-width="3.5" stroke-linecap="round"></path><circle cx="92" cy="60" r="3" fill="${GROUND}"></circle></svg>
<div style="position:absolute; left:124px; right:20px; top:256px; display:flex; flex-direction:column; gap:10px;"><div style="font-size:22px; font-weight:700; letter-spacing:-0.3px; line-height:31px; color:${TXT};">The mornings are mine again.</div><div style="font-size:16px; font-style:italic; font-weight:700; color:${MUTE};">${NAME}</div><div style="display:flex; gap:10px; margin-top:6px;">${['M3 9h12M9 3v12', 'M9 3l1.8 3.8 4.2.6-3 3 .7 4.2L9 12.6l-3.7 2 .7-4.2-3-3 4.2-.6z', 'M9 11V3M6 6l3-3 3 3M4 11v3h10v-3'].map(d => `<div style="width:42px; height:42px; border-radius:21px; box-shadow:0 0 0 1.5px ${LINE}; display:flex; align-items:center; justify-content:center;"><svg width="18" height="18" viewBox="0 0 18 18"><path d="${d}" fill="none" stroke="${TXT}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>`).join('')}</div></div>
<div style="position:absolute; left:0; right:0; top:470px; text-align:center;">${caps('Tonight')}</div>
${stack(502, [card(`<div style="display:flex; align-items:center; gap:16px;"><div style="width:52px; height:52px; border-radius:26px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><svg width="26" height="26" viewBox="0 0 26 26"><path d="M3 17c4 0 5-6 10-6s6 6 10 6" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"></path><path d="M3 21c4 0 5-4 10-4s6 4 10 4" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 5"></path></svg></div><div style="display:flex; flex-direction:column; gap:3px; flex:1;"><span style="font-size:18px; font-weight:700; color:${TXT};">Urge surfing</span><span style="font-size:14px; color:${SUB};">Five minutes. Ride the next one out.</span></div>${chevronR()}</div>`, { pad: '18px 20px' })], { inset: 16 })}
${tabBar('Today')}`));

  // ── Score detail (Journey) ──
  const scoreHead = (bottomCaps) => `<div style="position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; box-sizing:border-box;">${chevronL()}<div style="height:44px; border-radius:22px; background:${CARD}; display:flex; align-items:center; gap:10px; padding:0 18px; font-size:15px; font-weight:700; color:${TXT};">Months ${chevronD()}</div></div>
<div style="position:absolute; left:0; right:0; top:128px; text-align:center;">${caps('Recovery score')}</div>
<div style="position:absolute; left:0; right:0; top:150px; text-align:center; font-size:60px; font-weight:700; letter-spacing:-2.4px; line-height:70px; color:${TXT};">1,240</div>
<div style="position:absolute; left:0; right:0; top:232px; display:flex; justify-content:center;"><div style="height:32px; border-radius:16px; background:${CARD}; display:inline-flex; align-items:center; gap:8px; padding:0 14px; font-size:13px; font-weight:700; color:${TXT}; white-space:nowrap;"><div style="width:8px; height:8px; border-radius:4px; background:${INK};"></div>Navigator · II</div></div>`;
  const chart = `<svg width="393" height="230" viewBox="0 0 393 230" style="position:absolute; left:0; top:296px;">
<path d="M0 60H393" stroke="${LINE}" stroke-width="1"></path><path d="M0 200H393" stroke="${LINE}" stroke-width="1"></path>
<text x="369" y="52" text-anchor="end" font-family="${FONT}" font-size="11" font-weight="600" fill="${ART}">1,400</text><text x="369" y="194" text-anchor="end" font-family="${FONT}" font-size="11" font-weight="600" fill="${ART}">1,000</text>
<path d="M-5 170 C 60 168, 90 150, 140 150 C 190 150, 220 126, 270 128 C 320 130, 350 118, 400 116" fill="none" stroke="${ART}" stroke-width="5" stroke-linecap="round"></path>
<path d="M-5 178 C 50 176, 80 160, 120 150 C 160 140, 180 124, 220 118 C 260 112, 280 100, 310 92 C 340 84, 360 80, 400 76" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"></path>
<circle cx="372" cy="80" r="7" fill="${GROUND}" stroke="${INK}" stroke-width="4"></circle>
<text x="40" y="226" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="600" fill="${MUTE}">May</text><text x="196" y="226" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="600" fill="${MUTE}">Jun</text><text x="352" y="226" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="${TXT}">Jul</text></svg>`;
  const legend = (top) => `<div style="position:absolute; left:0; right:0; top:${top}px; display:flex; justify-content:center; gap:24px; font-size:13px; font-weight:700; color:${SUB}; white-space:nowrap;"><div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; border-radius:6px; background:${INK};"></div>This quarter</div><div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; border-radius:6px; background:${ART};"></div>Previous</div></div>`;
  const insight = (top, big, small) => `<div style="position:absolute; left:24px; right:24px; top:${top}px; display:flex; align-items:center; gap:16px;"><div style="width:44px; height:44px; border-radius:22px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div style="display:flex; flex-direction:column; gap:2px;"><span style="font-size:18px; font-weight:700; letter-spacing:-0.2px; color:${TXT};">${big}</span><span style="font-size:15px; color:${SUB};">${small}</span></div></div>`;
  add('21B · Score Detail', frame('Score Detail', `${scoreHead()}${chart}${legend(540)}
${insight(586, '+90 points this quarter', 'vs Apr 3 – May 3')}
<div style="position:absolute; left:24px; right:24px; top:656px; font-size:15px; line-height:22px; color:${SUB};">Keep going. You’re building real momentum.</div>
${tabBar('Journey')}`));
  const moveRow = (label, v, max) => { const neg = v < 0; const w = Math.round(Math.abs(v) / max * 100); return `<div style="display:flex; align-items:center; gap:14px; height:44px;"><span style="width:112px; font-size:15px; font-weight:700; color:${neg ? MUTE : TXT};">${label}</span><div style="flex:1; height:12px; position:relative;"><div style="position:absolute; left:0; top:0; height:12px; width:${w}%; border-radius:6px; background:${neg ? 'transparent' : INK}; box-shadow:${neg ? `0 0 0 1.5px ${INK} inset` : 'none'};"></div></div><span style="width:44px; text-align:right; font-size:15px; font-weight:700; color:${TXT};">${neg ? '−' : '+'}${Math.abs(v)}</span></div>`; };
  add('20B · Score Detail — What Moved It', frame('Score Detail Moves', `${scoreHead()}
<div style="position:absolute; left:0; right:0; top:300px; text-align:center;">${caps('What moved it · this month')}</div>
${stack(334, [card([['Clean days', 64], ['Check-ins', 18], ['Lessons', 12], ['Urges ridden', 8], ['Slip · Jul 8', -16]].map(r => moveRow(r[0], r[1], 64)).join('') + `<div style="margin-top:12px; padding-top:14px; border-top:1px solid ${LINE}; display:flex; justify-content:space-between; align-items:baseline;"><span style="font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${MUTE};">Net this month</span><span style="font-size:26px; font-weight:700; letter-spacing:-0.6px; color:${TXT};">+86</span></div>`, { pad: '16px 20px 18px' })], { inset: 16 })}
<div style="position:absolute; left:24px; right:24px; top:680px; font-size:15px; line-height:22px; color:${SUB};">Clean days do the heavy lifting. Keep the evenings boring.</div>
${tabBar('Journey')}`));
  const rankRow = (name, n, state, last) => `<div style="display:flex; gap:18px;"><div style="display:flex; flex-direction:column; align-items:center; width:26px;"><div style="width:26px; height:26px; border-radius:13px; background:${state === 'here' ? INK : state === 'done' ? INK : CARD}; box-shadow:${state === 'todo' ? `0 0 0 1.5px ${INK}` : 'none'}; display:flex; align-items:center; justify-content:center;">${state === 'done' ? check('#FFFFFF', 12) : state === 'here' ? `<div style="width:8px; height:8px; border-radius:4px; background:#FFFFFF;"></div>` : ''}</div>${last ? '' : `<div style="flex:1; border-left:2px ${state === 'todo' ? 'dashed' : 'solid'} ${state === 'todo' ? ART : INK}; margin:4px 0;"></div>`}</div><div style="flex:1; display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:${last ? 0 : 30}px;"><div style="display:flex; flex-direction:column; gap:2px;"><span style="font-size:18px; font-weight:${state === 'here' ? 900 : 700}; color:${state === 'todo' ? MUTE : TXT};">${name}</span>${state === 'here' ? `<span style="font-size:13px; font-weight:700; color:${SUB};">You’re here · 60 to go</span>` : ''}</div><span style="font-size:15px; font-weight:700; color:${state === 'todo' ? MUTE : TXT};">${n}</span></div></div>`;
  add('20C · Score Detail — Ranks', frame('Score Detail Ranks', `${scoreHead()}
<div style="position:absolute; left:0; right:0; top:300px; text-align:center;">${caps('The ranks')}</div>
${stack(334, [card([['Captain', '1,500', 'todo'], ['Helmsman', '1,300', 'todo'], ['Navigator', '1,150', 'here'], ['Deckhand', '1,000', 'done']].map((r, i, a) => rankRow(r[0], r[1], r[2], i === a.length - 1)).join(''), { pad: '22px 22px 20px' })], { inset: 16 })}
<div style="position:absolute; left:24px; right:24px; top:668px; font-size:15px; line-height:22px; color:${SUB};">About a week at this pace. Steady beats fast.</div>
${tabBar('Journey')}`));

  // ── Morning check-in ──
  add('21D0 · Morning — Check-in', frame('Morning Check-in Cover', `${nav({ close: true, noBack: true })}
${H.sunrise(150)}
${stack(430, [caps('Day 13 · two minutes', { center: true }), h1('Morning check-in.', { center: true, size: 36, lh: 42 })], { center: true, gap: 12 })}
${primary('Begin day 13')}`));
  const M = 5;
  add('21D1 · Morning — Yesterday’s task', frame('Morning Task Check', `${nav({ step: 1, total: M, close: true })}
${stack(136, [h1('Did you complete this task?'), '<div style="height:4px;"></div>', card(`<div style="display:flex; flex-direction:column; gap:8px;">${caps('Yesterday')}<div style="font-size:19px; font-weight:700; line-height:28px; color:${TXT};">Write down each trigger the moment you notice it.</div></div>`), '<div style="height:4px;"></div>', grid2(['Yes', 'Not yet'], [0])], { gap: 18 })}
${nextFab()}`));
  const recordRows = (rows) => `<div style="display:flex; flex-direction:column; gap:10px;">${rows.map(r => `<div style="display:flex; align-items:center; gap:16px; height:64px; border-radius:20px; background:${CARD}; padding:0 18px;"><div style="width:30px; height:30px; border-radius:15px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${check('#FFFFFF', 13)}</div><span style="font-size:16px; font-weight:400; color:${TXT}; flex:1;">${r[0]}</span>${r[1] ? `<span style="font-size:15px; font-weight:700; color:${TXT};">${r[1]}</span>` : ''}</div>`).join('')}</div>`;
  add('21D2 · Morning — Yesterday', frame('Morning 1 Yesterday', `${nav({ step: 2, total: M, close: true })}
${stack(136, [h1('Yesterday’s record.'), '<div style="height:4px;"></div>', recordRows([['Recovery score', '+12 → 1,240'], ['Pledge kept'], ['One urge surfed'], ['0 relapses'], ['Part III finished']])], { gap: 18 })}
${primary('Continue')}`));
  const moodRow = (sel) => `<div style="display:flex; justify-content:center; gap:14px;">${[0, 1, 2, 3, 4].map(i => moodFace(i, i === sel ? 74 : 52, i === sel)).join('')}</div>`;
  add('21D3 · Morning — Feeling', frame('Morning Feeling', `${nav({ step: 3, total: M, close: true })}
${stack(136, [h1('How are you feeling?')])}
<div style="position:absolute; left:0; right:0; top:300px; display:flex; align-items:center; justify-content:center;">${moodRow(2)}</div>
${stack(420, [`<div style="font-size:30px; font-weight:700; letter-spacing:-0.6px; color:${TXT};">Steady</div>`, p('On level ground', { center: true })], { center: true, gap: 6 })}
${primary('Continue')}`));
  const energyBars = (sel) => `<div style="display:flex; align-items:flex-end; justify-content:center; gap:14px; height:150px;">${[0, 1, 2, 3, 4].map(i => `<div style="width:44px; height:${50 + i * 25}px; border-radius:14px; background:${i <= sel ? INK : CARD}; box-shadow:${i <= sel ? 'none' : `0 0 0 1.5px ${LINE}`};"></div>`).join('')}</div>`;
  add('21D4 · Morning — Energy', frame('Morning Energy', `${nav({ step: 4, total: M, close: true })}
${stack(136, [h1('Where’s your energy?')])}
<div style="position:absolute; left:0; right:0; top:280px;">${energyBars(1)}</div>
${stack(470, [`<div style="font-size:30px; font-weight:700; letter-spacing:-0.6px; color:${TXT};">Low</div>`, p('Still warming up', { center: true })], { center: true, gap: 6 })}
${primary('Continue')}`));
  const pledgeCard = (signed) => card(`<div style="display:flex; flex-direction:column; gap:22px;">${caps('Your pledge')}<div style="font-size:24px; font-weight:700; letter-spacing:-0.4px; line-height:33px; color:${TXT};">The mornings are mine again.</div><div style="padding-top:12px; border-bottom:1.5px ${signed ? 'solid' : 'dashed'} ${signed ? INK : ART}; height:44px; display:flex; align-items:flex-end; padding-bottom:8px; font-size:${signed ? 28 : 15}px; font-weight:${signed ? 700 : 400}; font-style:${signed ? 'italic' : 'normal'}; color:${signed ? TXT : MUTE};">${signed ? NAME : 'Sign here'}</div></div>`, { pad: '24px 24px 20px' });
  add('21D5 · Morning — Re-sign your pledge', frame('Morning Resign Pledge', `${nav({ step: 5, total: M, close: true })}
${stack(136, [h1('Re-sign your pledge.'), '<div style="height:6px;"></div>', pledgeCard(false)], { gap: 18 })}
${primary('Sign for today', { bottom: 96 })}${ghost('Change the pledge', { bottom: 60 })}`));
  add('21D5B · Morning — Pledge signed', frame('Morning Pledge Signed', `${nav({ step: 5, total: M, close: true })}
${stack(136, [h1('Re-sign your pledge.'), '<div style="height:6px;"></div>', pledgeCard(true)], { gap: 18 })}
${primary('Confirm', { bottom: 96 })}${ghost('Change the pledge', { bottom: 60 })}`));
  add('21D6 · Morning — Change the pledge', frame('Change Pledge Sheet', `<div style="position:absolute; inset:0; background:rgba(0,0,0,0.5);"></div>
<div style="position:absolute; left:0; right:0; top:120px; bottom:0; border-radius:28px 28px 0 0; background:${GROUND};"><div style="position:absolute; left:50%; top:10px; width:40px; height:4px; margin-left:-20px; border-radius:2px; background:${LINE};"></div>
<div style="position:absolute; left:24px; right:24px; top:44px; display:flex; flex-direction:column; gap:12px;">${h1('Change the pledge')}${p('One promise you can keep every day.')}<div style="height:8px;"></div><div style="min-height:100px; border-radius:20px; background:${CARD}; padding:20px 22px; box-sizing:border-box; font-size:20px; font-weight:700; line-height:29px; color:${TXT};">Phone stays out of the bedroom<span style="display:inline-block; width:2px; height:22px; background:${INK}; vertical-align:-3px; margin-left:2px;"></span></div></div></div>
${primary('Sign the new pledge', { bottom: 96 })}${ghost('Keep current pledge', { bottom: 60 })}`));
  add('21D7 · Morning — Done', frame('Morning 5 Done', `${nav({ noBack: true, close: true })}
<div style="position:absolute; left:0; right:0; top:266px; display:flex; justify-content:center;"><div style="width:132px; height:132px; border-radius:66px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check('#FFFFFF', 56)}</div></div>
${stack(436, [h1('Day 13, underway.', { center: true }), caps('Pledge re-signed · Day 13', { center: true })], { center: true, gap: 14 })}
${primary('Done')}`));

  // ── Night check-in ──
  add('21E0 · Night — Check-in', frame('Night Check-in Cover', `${nav({ close: true, noBack: true, dark: true })}
${H.nightMoon(150)}
${stack(430, [caps('Day 13 · two minutes', { center: true, color: 'rgba(255,255,255,0.55)' }), h1('Night check-in.', { center: true, size: 36, lh: 42, color: '#FFFFFF' })], { center: true, gap: 12 })}
${primary('Close the day', { dark: true })}`, { dark: true }));
  const N = 6;
  add('21E1 · Night — How was today', frame('Night 1 Mood', `${nav({ step: 1, total: N, close: true })}
${stack(136, [h1('How was today?')])}
<div style="position:absolute; left:0; right:0; top:300px; display:flex; align-items:center; justify-content:center;">${moodRow(2)}</div>
${stack(420, [`<div style="font-size:30px; font-weight:700; letter-spacing:-0.6px; color:${TXT};">Mixed</div>`, p('Some of both', { center: true })], { center: true, gap: 6 })}
${primary('Continue')}`));
  add('21E2 · Night — Emotions', frame('Checkin Emotions', `${nav({ step: 2, total: N, close: true })}
${stack(136, [h1('What did today feel like?'), p('Select all that apply.', { size: 15, lh: 22, color: MUTE })], { gap: 8 })}
<div style="position:absolute; left:0; right:0; top:228px; display:flex; justify-content:center;">${moodFace(2, 56, false)}</div>
${stack(304, [grid2(['Calm', 'Tense', 'Tired', 'Hopeful', 'Flat', 'Proud', 'Lonely', 'Restless'], [0, 2])])}
${nextFab()}`));
  add('21E3 · Night — What caused it', frame('Checkin Reasons', `${nav({ step: 3, total: N, close: true })}
${stack(136, [h1('What caused the feeling?'), p('Select all that apply.', { size: 15, lh: 22, color: MUTE })], { gap: 8 })}
${stack(232, [grid2(['Relationship', 'Family', 'School / work', 'Money', 'Self-image', 'Loneliness', 'Health', 'None / unknown'], [2, 5])])}
${nextFab()}`));
  add('21E4 · Night — Reflection', frame('Night 3 Reflection', `${nav({ step: 4, total: N, close: true })}
${stack(136, [h1('Anything worth keeping?'), caps('Optional'), '<div style="height:6px;"></div>', `<div style="font-size:22px; font-weight:400; line-height:34px; color:${TXT};">Sam called at the right moment…<span style="display:inline-block; width:2px; height:24px; background:${INK}; vertical-align:-4px; margin-left:2px;"></span></div>`], { gap: 14 })}
${primary('Close the day')}`));
  add('21E5 · Night — Record', frame('Night 2 Record', `${nav({ step: 5, total: N, close: true })}
${stack(136, [h1('Today’s record.'), '<div style="height:4px;"></div>', recordRows([['Pledge kept'], ['One urge surfed'], ['0 relapses'], ['Part IV finished']]), `<div style="display:flex; justify-content:center; margin-top:6px;"><div style="height:44px; border-radius:22px; box-shadow:0 0 0 1.5px ${LINE}; display:inline-flex; align-items:center; gap:8px; padding:0 18px; font-size:15px; font-weight:700; color:${TXT};"><span style="font-size:18px; line-height:1;">+</span>Add to the record</div></div>`], { gap: 18 })}
${primary('Continue')}`));
  add('21E5B · Night — Tonight’s action', frame('Night Action Reminder', `${nav({ step: 6, total: N, close: true })}
${stack(136, [caps('Tonight’s action'), h1('Surviving the night'), p('Put the device you use for porn out of reach before you sleep.')], { gap: 14 })}
${H.charger(300)}
${primary('Done', { bottom: 96 })}${ghost('Skip tonight', { bottom: 60 })}`));
  add('21E6 · Night — Closed', frame('Night 4 Closed', `${nav({ noBack: true, close: true, dark: true })}
${H.nightMoon(150)}
${stack(430, [h1('Day 13, closed.', { center: true, size: 36, lh: 42, color: '#FFFFFF' }), p('See you in the morning.', { center: true, color: 'rgba(255,255,255,0.6)' })], { center: true, gap: 12 })}
${primary('Goodnight', { dark: true })}`, { dark: true }));

  // ── Week covers (Library) ──
  const weekHero = { I: H.nightPhone, II: H.signpost, III: H.wave, IV: H.brain, V: H.scale, VI: H.flag, VII: H.sunrise, VIII: H.hourglass, IX: H.connection, X: H.mirror, XI: H.mountain, XII: H.door };
  const CURRENT = 38; // lesson in progress
  const lessonRow = (num, title) => { const n = +num; const state = n < CURRENT ? 'done' : n === CURRENT ? 'here' : 'todo'; return `<div style="height:58px; border-radius:18px; background:${state === 'here' ? INK : CARD}; display:flex; align-items:center; gap:16px; padding:0 18px; box-sizing:border-box;"><div style="width:28px; display:flex; justify-content:center;">${state === 'done' ? `<div style="width:24px; height:24px; border-radius:12px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check('#FFFFFF', 12)}</div>` : `<span style="font-size:14px; font-weight:700; letter-spacing:1px; color:${state === 'here' ? 'rgba(255,255,255,0.6)' : MUTE};">${num}</span>`}</div><span style="flex:1; font-size:15px; font-weight:700; color:${state === 'here' ? '#FFFFFF' : TXT};">${title}</span>${state === 'here' ? `<span style="font-size:12px; font-weight:700; letter-spacing:1.5px; color:#FFFFFF;">CONTINUE</span>` : chevronR(state === 'todo' ? ART : MUTE)}</div>`; };
  const weekCover = (label, note, roman, name, sub, lessons) => add(note, frame(label, `<div style="position:absolute; left:22px; top:60px; height:40px; display:flex; align-items:center; z-index:5;">${chevronL()}</div>
${weekHero[roman](60)}
${stack(316, [caps(`Week ${roman}`, { center: true }), h1(name, { center: true, size: 32, lh: 38 }), p(sub, { center: true, size: 15, lh: 22 })], { center: true, gap: 8 })}
${stack(lessons.length === 4 ? 466 : 484, [`<div style="display:flex; flex-direction:column; gap:8px;">${lessons.map(l => lessonRow(l[1], l[0])).join('')}</div>`], { inset: 16 })}
${tabBar('Library')}`));
  const W = [['I', 'Reset', 'Survive the nights and steady the basics.'], ['II', 'Changing Your Mindset', 'Streaks, relapses, and how you talk to yourself.'], ['III', 'In the Moment', 'What to do in the sixty seconds that matter.'], ['IV', 'Know Your Brain', 'The machinery behind the pull.'], ['V', 'Why It Feels Worth It', 'The honest math of what it gives and takes.'], ['VI', 'Discipline', 'Training the response you want on hard nights.'], ['VII', 'Relapse and Adversity', 'Falling without unraveling.'], ['VIII', 'Boredom and Meaning', 'Empty hours, and what fills them well.'], ['IX', 'Connection', 'The people side of recovery.'], ['X', 'Yourself', 'Repairing how you see and treat yourself.'], ['XI', 'Build a Life You Want', 'Point the freed-up energy at something.'], ['XII', 'Leave It Behind', 'Make it permanent, then let it go.']];
  const L = {
    I: [['Surviving the Night', '01'], ['A New Start', '02'], ['Get Outside', '03'], ['Fix Your Sleep', '04'], ['What Replaces Porn?', '05'], ['Isolation', '06'], ['One Week In', '07']],
    II: [['More Than a Streak', '08'], ['After a Relapse', '09'], ['The All-or-Nothing Trap', '10'], ['Progress Isn’t Linear', '11'], ['Identity', '12'], ['Values, Not Shame', '13'], ['Keep Going', '14']],
    III: [['The Life of an Urge', '15'], ['What’s the Urge Really For?', '16'], ['Move First', '17'], ['Redirection', '18'], ['HALT', '19'], ['Urge Surfing', '20'], ['Masturbation', '21']],
    IV: [['The Reward System', '22'], ['The Control Center', '23'], ['Hungry and Tired', '24'], ['Angry and Lonely', '25'], ['The Pull of Novelty', '26'], ['Change Your State', '27'], ['Autopilot', '28']],
    V: [['The Scale', '29'], ['The “Benefits” of Porn', '30'], ['The Hidden Reward', '31'], ['The Short-Term Cost', '32'], ['The Long-Term Cost', '33'], ['Tipping the Scale', '34'], ['Repairing the Scale', '35']],
    VI: [['What is Willpower?', '36'], ['Train Your Response', '37'], ['What Discipline Isn’t', '38'], ['What Discipline Is', '39'], ['Thoughts and Feelings', '40'], ['Choose Your Action', '41'], ['Damage Control', '42']],
    VII: [['Relapse Isn’t the End', '43'], ['Learn From the Relapse', '44'], ['Don’t Punish Yourself', '45'], ['Rough Days', '46'], ['When Life Gets Hard', '47'], ['Face What You’re Avoiding', '48'], ['Don’t Wait for Tomorrow', '49']],
    VIII: [['Boredom', '50'], ['Escaping Boredom', '51'], ['Learn to Be Bored', '52'], ['Screen Boundaries', '53'], ['Dopamine Detox', '54'], ['Wake Up With Purpose', '55'], ['Meaning', '56']],
    IX: [['Why Relationships Matter', '57'], ['Loneliness', '58'], ['Solitude', '59'], ['What Porn Replaces', '60'], ['Friendship', '61'], ['Unhealthy Relationships', '62'], ['Healthy Relationships', '63']],
    X: [['Trauma', '64'], ['Your Environment', '65'], ['Self-Criticism', '66'], ['Self-Loathing', '67'], ['Self-Compassion', '68'], ['Self-Trust', '69'], ['Self-Improvement', '70']],
    XI: [['Know Yourself', '71'], ['Amor Fati', '72'], ['Memento Mori', '73'], ['Carpe Diem', '74'], ['The Next 90 Days', '75'], ['Peace of Mind', '76'], ['This Time Next Year', '77']],
    XII: [['What Forever Means', '78'], ['Twelve Weeks Ago', '79'], ['What Changed in Your Brain', '80'], ['Winning the Battle', '81'], ['Lessons From Addiction Recovery', '82'], ['Saying Goodbye', '83'], ['The Future', '84']]
  };
  const codes = 'ABCDEFGHIJKL';
  W.forEach((w, i) => {
    const [r, name, sub] = w; const ls = L[r];
    weekCover(`Week ${r} ${name}`, `92${codes[i]} · Week ${r} — ${name} · i`, r, name, sub, ls.slice(0, 4));
    weekCover(`Week ${r} ${name} P2`, `92${codes[i]}2 · Week ${r} — ${name} · ii`, r, name, sub, ls.slice(4));
  });

  return S;
})
