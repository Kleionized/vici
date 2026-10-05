// Generator for the monochrome onboarding screens (0–50) of Email Login.dc.html
// Returns an array of wrapper HTML strings. Evaluated inside run_script.
(function () {
  const INK = '#111111', TXT = '#17160F', SUB = '#5F5B55', MUTE = '#8C877F', LINE = '#DDD9D2', ART = '#C6C1B8', CARD = '#FFFFFF', GROUND = '#F4F2EE';
  const FONT = "'Lato',-apple-system,system-ui,sans-serif";
  const NAME = 'Sam';

  const esc = s => s;
  const status = (dark) => {
    const c = dark ? '#FFFFFF' : TXT;
    return `<div style="position:absolute; top:0; left:0; right:0; height:54px; display:flex; align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20;"><span style="font-size:17px; font-weight:700; color:${c}; letter-spacing:-0.2px;">9:41</span><div style="display:flex; align-items:center; gap:7px;"><svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="${c}"></rect><rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="${c}"></rect><rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="${c}"></rect><rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="${c}"></rect></svg><svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="${c}"></path><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="${c}"></path><circle cx="8.5" cy="10.5" r="1.5" fill="${c}"></circle></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="${c}" stroke-opacity="0.35" fill="none"></rect><rect x="2" y="2" width="20" height="9" rx="2" fill="${c}"></rect><path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="${c}" fill-opacity="0.4"></path></svg></div></div>`;
  };
  const home = (dark) => `<div style="position:absolute; left:127px; top:839px; width:139px; height:5px; border-radius:100px; background:${dark ? '#FFFFFF' : INK}; z-index:30;"></div>`;

  const frame = (label, inner, o = {}) => {
    const dark = !!o.dark;
    const bg = o.bg || (dark ? INK : GROUND);
    return `<div data-screen-label="${label}" style="width:393px; height:852px; position:relative; overflow:hidden; background:${bg}; font-family:${FONT}; -webkit-font-smoothing:antialiased; flex-shrink:0; box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(20,20,22,0.14);">
<div style="position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:${dark ? 0.09 : 0.06}; pointer-events:none;"></div>
${status(dark)}
${inner}
${home(dark)}
</div>`;
  };

  // ── primitives ─────────────────────────────────────────────
  const chevronL = (c = TXT) => `<svg width="12" height="20" viewBox="0 0 12 20"><path d="M10 2L2 10l8 8" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const closeX = (c = TXT) => `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 2l14 14M16 2L2 16" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"></path></svg>`;
  const check = (c = '#FFFFFF', s = 14) => `<svg width="${s}" height="${s}" viewBox="0 0 14 14"><path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

  // top nav: back chevron, 8 progress dashes, close
  const nav = (step, total, o = {}) => {
    const n = 8, active = step == null ? 0 : Math.max(1, Math.round((step / total) * n));
    const dashes = step == null ? '' : `<div style="display:flex; gap:6px; align-items:center;">${Array.from({ length: n }, (_, i) => `<div style="width:24px; height:2px; border-radius:1px; background:${i < active ? INK : LINE};"></div>`).join('')}</div>`;
    return `<div style="position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; box-sizing:border-box; z-index:5;">
<div style="width:36px; height:40px; display:flex; align-items:center; cursor:pointer;">${o.noBack ? '' : chevronL()}</div>
${dashes}
<div style="width:36px; height:40px; display:flex; align-items:center; justify-content:flex-end; cursor:pointer;">${o.close ? closeX() : ''}</div>
</div>`;
  };

  const h1 = (t, o = {}) => `<div style="width:100%; font-size:${o.size || 27}px; font-weight:700; letter-spacing:-0.6px; line-height:${o.lh || 34}px; color:${o.color || TXT}; text-wrap:balance; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const p = (t, o = {}) => `<div style="width:100%; font-size:${o.size || 16}px; font-weight:400; line-height:${o.lh || 25}px; color:${o.color || SUB}; text-wrap:pretty; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;
  const caps = (t, o = {}) => `<div style="width:100%; white-space:nowrap; font-size:11px; font-weight:700; letter-spacing:2.6px; text-transform:uppercase; color:${o.color || MUTE}; ${o.center ? 'text-align:center;' : ''}">${t}</div>`;

  const primary = (t, o = {}) => `<div style="position:absolute; left:24px; right:24px; bottom:${o.bottom ?? 48}px; height:58px; border-radius:29px; background:${o.dark ? '#FFFFFF' : INK}; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:6;"><span style="font-size:16px; font-weight:700; letter-spacing:0.1px; color:${o.dark ? INK : '#FFFFFF'};">${t}</span></div>`;
  const ghost = (t, o = {}) => `<div style="position:absolute; left:0; right:0; bottom:${o.bottom ?? 62}px; text-align:center; font-size:15px; font-weight:400; color:${o.dark ? 'rgba(255,255,255,0.6)' : MUTE}; cursor:pointer; z-index:6;">${t}</div>`;
  const stack = (top, children, o = {}) => `<div style="position:absolute; left:24px; right:24px; top:${top}px; ${o.bottom != null ? `bottom:${o.bottom}px;` : ''} display:flex; flex-direction:column; gap:${o.gap ?? 20}px; ${o.center ? 'align-items:center; text-align:center;' : ''}">${children.join('')}</div>`;

  const options = (items, sel = []) => `<div style="display:flex; flex-direction:column; gap:12px;">${items.map((t, i) => {
    const on = sel.includes(i);
    return `<div style="height:58px; border-radius:18px; background:${on ? INK : CARD}; display:flex; align-items:center; padding:0 22px; box-sizing:border-box; cursor:pointer; box-shadow:${on ? 'none' : '0 1px 2px rgba(0,0,0,0.04)'};"><span style="font-size:16px; font-weight:400; color:${on ? '#FFFFFF' : TXT}; white-space:nowrap;">${t}</span></div>`;
  }).join('')}</div>`;

  const chips = (items, sel = []) => `<div style="display:flex; flex-wrap:wrap; gap:12px;">${items.map((t, i) => {
    const on = sel.includes(i);
    return `<div style="height:48px; border-radius:24px; background:${on ? INK : CARD}; display:flex; align-items:center; gap:8px; padding:0 20px; box-sizing:border-box; cursor:pointer; box-shadow:${on ? 'none' : '0 1px 2px rgba(0,0,0,0.04)'};">${on ? check('#FFFFFF', 13) : ''}<span style="font-size:15px; font-weight:400; color:${on ? '#FFFFFF' : TXT}; white-space:nowrap;">${t}</span></div>`;
  }).join('')}</div>`;

  // ── scenery + heroes (all SVG, 393×240, horizon y=190) ─────
  const hills = (o = {}) => `<path d="M40 190 C 90 150, 150 140, 200 160 C 250 180, 300 150, 360 168" fill="none" stroke="#E4E0D9" stroke-width="1.2"></path><path d="M0 190.5H393" stroke="#D3CEC6" stroke-width="1.2"></path>
<path d="M-10 190 C 30 158, 78 154, 118 176 C 140 188, 158 190, 172 190" fill="#FBFAF7" stroke="${ART}" stroke-width="1.4"></path>
<path d="M60 190 C 78 176, 98 170, 118 178 C 130 184, 140 190, 150 190" fill="#FBFAF7" stroke="${ART}" stroke-width="1.4"></path>
<path d="M228 190 C 258 172, 300 150, 350 162 C 380 170, 395 185, 410 190" fill="#FBFAF7" stroke="${ART}" stroke-width="1.4"></path>
<path d="M290 190 C 306 178, 330 172, 356 180 C 372 186, 386 190, 400 190" fill="#FBFAF7" stroke="${ART}" stroke-width="1.4"></path>`;
  const moon = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"></circle><circle cx="${cx + r * 0.42}" cy="${cy - r * 0.32}" r="${r * 0.82}" fill="${GROUND}"></circle>`;
  const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="192.5" rx="${rx}" ry="3" fill="${INK}"></ellipse>`;
  const svgWrap = (inner, top, h = 240, sc = 1.24) => `<svg width="393" height="${h}" viewBox="0 0 393 ${h}" style="position:absolute; left:0; top:${top}px; overflow:visible; transform:scale(${sc}); transform-origin:196px 190px;">${inner}</svg>`;

  const heroNightPhone = (top) => svgWrap(`${hills()}${moon(300, 82, 20)}
<rect x="172" y="104" width="48" height="86" rx="9" fill="${INK}"></rect>
<rect x="179" y="114" width="34" height="58" rx="3" fill="${GROUND}"></rect>
<rect x="188" y="108" width="16" height="2.5" rx="1.25" fill="${GROUND}"></rect>
<circle cx="196" cy="180" r="3" fill="${GROUND}"></circle>
<path d="M186 130h20M186 140h14" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"></path>
${shadow(196, 34)}`, top);

  const heroWave = (top) => svgWrap(`${hills()}
<path d="M20 190 C 90 188, 130 156, 168 112 C 196 80, 232 66, 258 82 C 276 94, 270 118, 250 118 C 238 118, 234 108, 240 102 C 232 100, 224 108, 230 118 C 240 134, 262 126, 270 112 C 268 136, 250 156, 226 168 C 250 174, 290 182, 330 190 Z" fill="${INK}"></path>
<path d="M60 186 C 110 178, 140 156, 168 124" fill="none" stroke="${GROUND}" stroke-width="3.5" stroke-linecap="round"></path>
<path d="M186 108 C 206 88, 230 80, 252 90" fill="none" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
<path d="M140 176 C 170 166, 196 158, 214 152" fill="none" stroke="${GROUND}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6"></path>`, top);

  const heroSignpost = (top) => svgWrap(`${hills()}
<rect x="193" y="70" width="6" height="120" fill="${INK}"></rect>
<path d="M150 82h70l14 12-14 12h-70z" fill="${INK}"></path>
<path d="M242 124h-70l-14 12 14 12h70z" fill="${INK}"></path>
<path d="M162 94h34" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
<path d="M196 136h34" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
${shadow(196, 26)}`, top);

  const heroFlag = (top) => svgWrap(`${hills()}
<rect x="164" y="64" width="5" height="126" fill="${INK}"></rect>
<path d="M169 68h100l-18 24 18 24h-100z" fill="${INK}"></path>
<path d="M184 92h46" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
<circle cx="166.5" cy="62" r="4" fill="${INK}"></circle>
${shadow(166, 22)}`, top);

  const bedOutline = (x) => `<g transform="translate(${x} 0)" fill="#FBFAF7" stroke="${ART}" stroke-width="1.4"><rect x="0" y="130" width="8" height="60" rx="2"></rect><rect x="0" y="164" width="120" height="20" rx="5"></rect><rect x="4" y="184" width="6" height="6"></rect><rect x="110" y="184" width="6" height="6"></rect><rect x="14" y="154" width="34" height="11" rx="5"></rect></g>`;

  const heroBedPhone = (top) => svgWrap(`${hills()}${moon(318, 80, 18)}
<rect x="104" y="112" width="10" height="78" rx="3" fill="${INK}"></rect>
<rect x="104" y="156" width="184" height="24" rx="6" fill="${INK}"></rect>
<rect x="110" y="180" width="8" height="10" fill="${INK}"></rect><rect x="274" y="180" width="8" height="10" fill="${INK}"></rect>
<rect x="120" y="144" width="46" height="13" rx="6" fill="${GROUND}" stroke="${INK}" stroke-width="2"></rect>
<rect x="218" y="132" width="18" height="30" rx="3.5" fill="${GROUND}" stroke="${INK}" stroke-width="2.2"></rect>
<path d="M227 118v-8M215 124l-6-6M239 124l6-6" stroke="${INK}" stroke-width="2" stroke-linecap="round"></path>
`, top);

  const heroCharger = (top) => svgWrap(`${hills()}${moon(300, 78, 16)}${bedOutline(24)}
<rect x="196" y="140" width="96" height="50" rx="5" fill="${INK}"></rect>
<rect x="204" y="150" width="80" height="2.5" rx="1.25" fill="${GROUND}"></rect>
<circle cx="244" cy="170" r="3" fill="${GROUND}"></circle>
<rect x="232" y="96" width="24" height="44" rx="5" fill="${INK}"></rect>
<rect x="236" y="102" width="16" height="30" rx="2" fill="${GROUND}"></rect>
<path d="M256 118 C 300 118, 330 150, 334 186" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"></path>
<rect x="326" y="180" width="16" height="10" rx="2" fill="${INK}"></rect>
${shadow(244, 46)}`, top);

  const heroPlug = (top) => svgWrap(`${hills()}
<rect x="182" y="66" width="8" height="26" rx="2" fill="${INK}"></rect><rect x="204" y="66" width="8" height="26" rx="2" fill="${INK}"></rect>
<rect x="164" y="90" width="66" height="54" rx="14" fill="${INK}"></rect>
<path d="M176 112 c0-8 6-14 14-14" fill="none" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
<path d="M197 144 C 197 184, 130 168, 60 190" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"></path>
${shadow(197, 30)}`, top);

  const heroDoor = (top) => svgWrap(`${hills()}
<rect x="150" y="62" width="94" height="128" rx="4" fill="${INK}"></rect>
<rect x="160" y="72" width="26" height="118" fill="${GROUND}"></rect>
<path d="M186 72 L 246 88 V 190 H 186 Z" fill="${INK}"></path>
<circle cx="236" cy="138" r="3.2" fill="${GROUND}"></circle>
<path d="M160 190 L 120 190 L 100 232 L 186 232 Z" fill="${GROUND}" opacity="0.001"></path>
<path d="M160 190 L 140 190" stroke="${GROUND}" stroke-width="2"></path>
${shadow(214, 30)}`, top);

  const heroEnvelope = (top) => svgWrap(`${hills()}
<rect x="122" y="100" width="150" height="92" rx="10" fill="${INK}"></rect>
<path d="M130 108 L197 164 L264 108" fill="none" stroke="${GROUND}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M130 184 L176 146 M264 184 L218 146" stroke="${GROUND}" stroke-width="2" stroke-linecap="round"></path>
<circle cx="197" cy="164" r="4" fill="${GROUND}"></circle>`, top);

  const heroMedal = (top) => svgWrap(`
<path d="M168 20h24v74l-12-9-12 9z" fill="${INK}"></path><path d="M201 20h24v74l-12-9-12 9z" fill="${INK}"></path>
<circle cx="196.5" cy="146" r="64" fill="${INK}"></circle>
<circle cx="196.5" cy="146" r="53" fill="none" stroke="${GROUND}" stroke-width="1.6"></circle>
<text x="196.5" y="170" text-anchor="middle" font-family="${FONT}" font-size="66" font-weight="700" fill="${GROUND}">V</text>`, top, 240, 1);

  const heroSunrise = (top) => svgWrap(`${hills()}
<path d="M122 190 A 74 74 0 0 1 270 190 Z" fill="${INK}"></path>
<path d="M150 170h92" stroke="${GROUND}" stroke-width="2.4" stroke-linecap="round"></path>
<path d="M164 152h64" stroke="${GROUND}" stroke-width="2.4" stroke-linecap="round"></path>
<path d="M196 90V72M150 108l-12-12M243 108l12-12" stroke="${INK}" stroke-width="3" stroke-linecap="round"></path>`, top);

  const heroBell = (top) => svgWrap(`${hills()}
<circle cx="196" cy="74" r="6" fill="${INK}"></circle>
<path d="M196 78 c-32 0 -46 26 -46 54 v30 h92 v-30 c0 -28 -14 -54 -46 -54 z" fill="${INK}"></path>
<rect x="140" y="160" width="112" height="6" rx="3" fill="${INK}"></rect>
<circle cx="196" cy="176" r="9" fill="${INK}"></circle>
<path d="M168 128 c2 -18 12 -32 26 -36" fill="none" stroke="${GROUND}" stroke-width="3" stroke-linecap="round"></path>
${shadow(196, 40)}`, top);

  const heroMark = (top) => svgWrap(hills(), top) + `<img src="laurel-mark.webp" alt="" width="84" height="84" style="position:absolute; left:154px; top:${top + 84}px; filter:brightness(0);">`;

  // ── screen builders ────────────────────────────────────────
  const T = 22; // quiz total steps

  const quiz = (label, step, q, items, o = {}) => frame(label, `${nav(step, T)}
${stack(140, [h1(q), ...(o.sub ? [p(o.sub, { size: 15, lh: 22, color: MUTE })] : []), `<div style="height:${o.sub ? 10 : 18}px;"></div>`, o.multi ? chips(items, o.sel) : options(items, o.sel)], { gap: 14 })}
${o.multi ? primary('Continue') : ''}`);

  const hero = (label, art, title, body, cta, o = {}) => frame(label, `${nav(o.step ?? null, T, { noBack: o.noBack, close: o.close })}
${art(o.artTop ?? 96)}
${stack(o.textTop ?? 412, [h1(title, { center: true }), ...(body ? [p(body, { center: true })] : [])], { center: true, gap: 14 })}
${primary(cta, { bottom: o.ghost ? 96 : 48 })}
${o.ghost ? ghost(o.ghost, { bottom: 60 }) : ''}`);

  const screens = [];
  const add = (note, html) => screens.push({ note, html });

  // 0 Splash
  add('01 · Splash', frame('Splash', `${heroMark(300)}
<div style="position:absolute; left:0; right:0; top:584px; text-align:center; font-size:14px; font-weight:700; letter-spacing:7px; color:${TXT};">VICI</div>`));

  const authBtn = (t, o = {}) => `<div style="height:58px; border-radius:29px; background:${o.solid ? INK : CARD}; box-shadow:${o.solid ? 'none' : `0 0 0 1.5px ${LINE}`}; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer;">${o.icon || ''}<span style="font-size:17px; font-weight:700; color:${o.solid ? '#FFFFFF' : TXT};">${t}</span></div>`;
  const appleIcon = `<svg width="16" height="19" viewBox="0 0 16 19"><path d="M13.3 10c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.8 3-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.3 3.1-2.5.6-.9 1.1-1.9 1.4-2.9-.1 0-2.9-1.1-2.9-4.1zM10.9 2.7c.7-.9 1.2-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3z" fill="#FFFFFF"></path></svg>`;
  const googleIcon = `<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.5" fill="none" stroke="${TXT}" stroke-width="2"></circle><path d="M9 9h7" stroke="${TXT}" stroke-width="2"></path></svg>`;
  const authScreen = (label, title, sub, emailLabel, footQ, footA) => frame(label, `${heroMark(70)}
${stack(360, [h1(title, { center: true }), p(sub, { center: true })], { center: true, gap: 12 })}
${stack(492, [authBtn('Continue with Apple', { solid: true, icon: appleIcon }), authBtn('Continue with Google', { icon: googleIcon }), `<div style="display:flex; align-items:center; gap:12px; padding:2px 0;"><div style="flex:1; height:1px; background:${LINE};"></div><span style="font-size:13px; font-weight:700; color:${MUTE};">or</span><div style="flex:1; height:1px; background:${LINE};"></div></div>`, authBtn(emailLabel)], { gap: 18 })}
<div style="position:absolute; left:0; right:0; bottom:82px; text-align:center; font-size:15px; color:${SUB};">${footQ} <span style="font-weight:700; color:${TXT}; cursor:pointer;">${footA}</span></div>
<div style="position:absolute; left:0; right:0; bottom:54px; text-align:center; font-size:12px; font-weight:700; letter-spacing:0.4px; color:${MUTE};">Terms · Privacy</div>`);

  add('02 · Login', authScreen('Login', 'Welcome to VICI.', 'Sign in or create an account to keep your plan and progress.', 'Continue with email', 'Already have an account?', 'Sign in'));
  add('02B · Welcome back', authScreen('Welcome Back', 'Welcome back.', 'Sign in to pick up where you left off.', 'Sign in with email', 'New here?', 'Create an account'));

  // 3 Name
  add('03 · Name', frame('V3 Q24 Name', `${nav(1, T)}
${stack(140, [h1('What should we call you?'), p('All your data will be encrypted.', { size: 15, lh: 22, color: MUTE }), '<div style="height:10px;"></div>',
    `<div style="height:60px; border-radius:18px; background:${CARD}; display:flex; align-items:center; padding:0 22px; box-sizing:border-box; gap:2px;"><div style="width:2px; height:24px; background:${INK}; border-radius:1px;"></div><span style="font-size:17px; font-weight:400; color:${MUTE};">Your name</span></div>`], { gap: 14 })}
${primary('Continue')}`));

  // 4 Age
  add('04 · Age', frame('V3 Q25 Age', `${nav(2, T)}
${stack(140, [h1('How old are you?')])}
<div style="position:absolute; left:0; right:0; top:300px; display:flex; flex-direction:column; align-items:center; gap:0;">
<div style="font-size:30px; font-weight:700; color:${LINE}; line-height:56px;">22</div>
<div style="font-size:34px; font-weight:700; color:${ART}; line-height:60px;">23</div>
<div style="width:200px; height:1.5px; background:${INK};"></div>
<div style="font-size:72px; font-weight:700; letter-spacing:-2px; color:${TXT}; line-height:100px;">24</div>
<div style="width:200px; height:1.5px; background:${INK};"></div>
<div style="font-size:34px; font-weight:700; color:${ART}; line-height:60px;">25</div>
<div style="font-size:30px; font-weight:700; color:${LINE}; line-height:56px;">26</div>
</div>
${primary('Continue')}`));

  // 5 Gender
  add('05 · Gender', quiz('V3 Q26 Gender', 3, 'How do you describe your gender?', ['Male', 'Female', 'Non-binary', 'Another identity', 'Prefer not to say'], { sel: [0] }));

  // 6 Start
  add('06 · Start', hero('Onboarding Start', heroNightPhone, `${NAME}, let’s figure out what usually leads you back to porn.`, 'It’ll take about two minutes. Then we’ll show you what we’d change first.', 'Start', { textTop: 380, artTop: 100 }));

  // 7–10
  add('07 · Frequency', quiz('V3 Q1', 4, 'How often are you watching porn right now?', ['More than once a day', 'About once a day', 'A few times a week', 'About once a week', 'A few times a month', 'Less than once a month'], { sel: [2] }));
  add('08 · How long', quiz('V3 Q2', 5, 'How long have you wanted to quit or cut down?', ['Less than 3 months', '3–12 months', '1–3 years', '3–5 years', '5+ years'], { sel: [2] }));
  add('09A · Previous quit attempts', quiz('V3 Q3', 6, 'Have you tried to quit before?', ['Yes, several times', 'Yes, once or twice', 'No'], { sel: [0] }));
  add('09B · Relapse', quiz('V3 Q3b', 7, 'When you’ve tried to quit, how long do you usually make it before watching again?', ['Less than a day', 'A few days', 'About a week', 'A few weeks', 'A month or longer'], { sel: [1] }));

  // 11 First principle
  add('10 · First principle', hero('First Principle', heroWave, 'An urge doesn’t stay at its worst for very long.', 'The first job is getting through the part where giving in feels easiest.', 'Continue', { step: 8, textTop: 384 }));

  // 12–15 multi
  add('11 · When', quiz('V3 Q5', 9, 'When do you usually end up watching?', ['Late at night', 'In the morning', 'When I’m bored', 'When I’m stressed', 'When I can’t sleep', 'On weekends', 'After drinking', 'When I’m home alone', 'While scrolling'], { multi: true, sub: 'Select all that apply', sel: [0, 4, 7, 8] }));
  add('12 · Beforehand', quiz('V3 Q6', 10, 'What are you usually feeling right before?', ['Horny', 'Bored', 'Lonely', 'Stressed', 'Low', 'Angry', 'Numb', 'Tired', 'Nothing in particular'], { multi: true, sub: 'Select all that apply', sel: [1, 2, 7] }));
  add('13 · Place', quiz('V3 Q7', 11, 'Where are you usually watching?', ['In bed', 'In the bathroom', 'At my desk', 'In the living room', 'Somewhere else at home', 'Outside home'], { multi: true, sub: 'Select all that apply', sel: [0] }));
  add('14 · What starts it', quiz('What starts it', 12, 'What usually sets it off?', ['I see something sexual online', 'I start scrolling', 'I can’t sleep', 'I’ve had a stressful day', 'I argue with someone or feel rejected', 'I start fantasising', 'Nothing obvious'], { multi: true, sub: 'Select all that apply', sel: [1, 2] }));

  // 16 Transition
  add('15 · Transition', hero('Transition', heroSignpost, 'Okay. That’s enough to see where things usually start.', 'A few more questions, then we’ll show you what we’d change first.', 'Continue', { step: 13, textTop: 384 }));

  // 17–23
  add('16 · Impact', quiz('V3 Q21', 14, 'How much is porn getting in the way of your life?', ['Not really', 'A little', 'Quite a bit', 'A lot'], { sel: [2] }));
  add('17 · What it affects', quiz('What it affects', 15, 'What does it affect most?', ['Time', 'Focus', 'Sleep', 'Confidence', 'Relationships', 'Sex or intimacy', 'Energy', 'Feeling in control', 'Peace of mind'], { multi: true, sub: 'Choose up to three', sel: [1, 2, 3] }));
  add('18 · Loneliness', quiz('V3 Q10', 16, 'How often have you felt lonely lately?', ['Rarely', 'Sometimes', 'Often', 'Most days'], { sel: [1] }));
  add('19 · Time alone', quiz('V3 Q13', 17, 'How often are you on your own for long stretches?', ['Most days', 'A few days a week', 'Now and then', 'Rarely'], { sel: [1] }));
  add('20 · Goal', quiz('V3 Q15', 18, 'What are you aiming for with porn?', ['Stop completely', 'Watch much less', 'Set a limit and stick to it', 'I’m not sure yet'], { sel: [0] }));
  add('21 · Masturbation goal', quiz('V3 Q16', 19, 'What about masturbation?', ['Stop for now', 'Do it less', 'Keep it, just without porn', 'I’m not sure yet'], { sel: [2] }));
  add('22 · What you’ve tried', quiz('V3 Q17', 20, 'What have you tried already?', ['Blocking sites or apps', 'Going cold turkey', 'Asking someone to keep me accountable', 'Deleting apps or accounts', 'Therapy or counselling', 'Replacing it with other habits', 'Nothing yet'], { multi: true, sub: 'Select all that apply', sel: [0, 1] }));

  // 24 Goal confirmation
  add('23 · Goal confirmation', frame('Goal Confirmation', `${nav(21, T)}
${heroFlag(96)}
${stack(384, [h1('You want to stop.', { center: true }), p('That’s what we’ll work toward.', { center: true }), `<div style="margin-top:14px; padding:18px 22px; border-radius:18px; background:${CARD}; font-size:15px; line-height:23px; color:${SUB}; text-align:left;">Masturbation isn’t part of what you’re trying to stop. <span style="font-weight:700; color:${TXT};">Porn is.</span></div>`], { center: true, gap: 14 })}
${primary('Continue')}`));

  // 25 Building plan
  const planRow = (t, state) => `<div style="display:flex; align-items:center; gap:14px;"><div style="width:26px; height:26px; border-radius:13px; background:${state === 'done' ? INK : CARD}; box-shadow:${state === 'done' ? 'none' : `0 0 0 1.5px ${state === 'now' ? INK : LINE}`}; display:flex; align-items:center; justify-content:center;">${state === 'done' ? check('#FFFFFF', 13) : state === 'now' ? `<div style="width:8px; height:8px; border-radius:4px; background:${INK};"></div>` : ''}</div><span style="font-size:16px; font-weight:${state === 'todo' ? 400 : 700}; color:${state === 'todo' ? MUTE : TXT};">${t}</span></div>`;
  add('24 · Build plan', frame('Enlisting Aegis', `
<div style="position:absolute; left:0; right:0; top:236px; display:flex; justify-content:center;"><svg width="88" height="88" viewBox="0 0 88 88"><circle cx="44" cy="44" r="38" fill="none" stroke="${LINE}" stroke-width="4"></circle><path d="M44 6 A38 38 0 0 1 82 44" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"></path></svg></div>
${stack(352, [h1('Putting your plan together…', { center: true })], { center: true })}
${stack(462, [planRow('Finding where you usually struggle', 'done'), planRow('Looking at what tends to set it off', 'now'), planRow('Choosing where to start', 'todo')], { gap: 18 })}`));

  // 26 Where we'd start
  const pill = (t) => `<div style="height:44px; border-radius:22px; background:${INK}; display:inline-flex; align-items:center; padding:0 18px; font-size:15px; font-weight:700; color:#FFFFFF;">${t}</div>`;
  add('25 · This Is Where We’d Start', frame('Where We’d Start', `${nav(null, T, { noBack: true })}
${heroBedPhone(84)}
${stack(348, [h1(`${NAME}, this is where we’d start.`, { center: true }), `<div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:4px;">${pill('Late at night')}${pill('Home alone')}${pill('Phone in bed')}</div>`, p('These came up together in your answers.', { center: true }), p('You don’t need to change everything at once. <span style="font-weight:700; color:' + TXT + ';">Start with this.</span>', { center: true })], { center: true, gap: 16 })}
${primary('Continue')}`));

  // 27 Start here
  add('26 · Start Here', hero('Start Here', heroCharger, 'Keep your phone out of bed tonight.', 'Late night, bed and scrolling came up together in your answers.', 'I can do that', { noBack: true, ghost: 'Choose another', textTop: 384 }));
  add('26A · Start Here — Step 1', frame('Start Here Step 1', `${nav(null, T)}
<div style="position:absolute; left:0; right:0; top:70px; text-align:center;">${caps('Step 1 of 2')}</div>
${heroPlug(96)}
${stack(384, [h1('Charge it away from the bed.', { center: true }), p('Tonight, before you lie down.', { center: true })], { center: true, gap: 16 })}
${primary('Next')}`));
  add('26A2 · Start Here — Step 2', frame('Start Here Step 2', `${nav(null, T)}
<div style="position:absolute; left:0; right:0; top:70px; text-align:center;">${caps('Step 2 of 2')}</div>
${heroDoor(96)}
${stack(384, [h1('Can’t sleep? Get out of bed before you start scrolling.', { center: true }), p('One change tonight. Build from there.', { center: true })], { center: true, gap: 16 })}
${primary('Continue')}`));

  // 30 Your plan
  const iconMoon = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M14 3a8 8 0 1 0 3 12.5A7 7 0 0 1 14 3z" fill="#FFFFFF"></path></svg>`;
  const iconBed = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 6v9M3 12h14v3M17 12v-3a2 2 0 0 0-2-2H8v4" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const iconScroll = `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="2.5" width="10" height="15" rx="2.5" fill="none" stroke="#FFFFFF" stroke-width="2"></rect><path d="M10 7v6M8 11l2 2 2-2" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const iconPlug = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0z M10 15v3" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  const iconBolt = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M11 2L4 11h6l-1 7 7-9h-6z" fill="#FFFFFF"></path></svg>`;
  const planItem = (icon, t, s) => `<div style="display:flex; align-items:center; gap:16px; padding:16px 18px; border-radius:18px; background:${CARD};"><div style="width:42px; height:42px; border-radius:21px; background:${INK}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${icon}</div><div style="display:flex; flex-direction:column; gap:2px;"><span style="font-size:16px; font-weight:700; color:${TXT};">${t}</span><span style="font-size:13px; color:${MUTE};">${s}</span></div></div>`;
  add('27 · Your Plan', frame('Your Plan', `${nav(null, T)}
${stack(140, [h1('Your plan'), '<div style="height:6px;"></div>', planItem(iconMoon, 'Late at night', 'When it usually happens'), planItem(iconBed, 'In bed', 'Where it usually happens'), planItem(iconScroll, 'Scrolling', 'What tends to set it off'), planItem(iconPlug, 'Phone out of bed', 'Your first change'), planItem(iconBolt, 'SOS gets you out first', 'When an urge hits')], { gap: 14 })}
${primary('Continue')}`));

  // 31 Starting score
  add('28 · Your VICI Rating', frame('Starting Score', `${nav(null, T)}
<div style="position:absolute; left:0; right:0; top:150px; text-align:center;">${caps('Your VICI rating')}</div>
<div style="position:absolute; left:0; right:0; top:190px; display:flex; justify-content:center;"><svg width="280" height="170" viewBox="0 0 280 170"><path d="M20 150 A120 120 0 0 1 260 150" fill="none" stroke="${LINE}" stroke-width="10" stroke-linecap="round"></path><path d="M20 150 A120 120 0 0 1 140 30" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"></path><circle cx="140" cy="30" r="9" fill="${GROUND}" stroke="${INK}" stroke-width="4"></circle><text x="140" y="132" text-anchor="middle" font-family="${FONT}" font-size="84" font-weight="700" letter-spacing="-3" fill="${TXT}">842</text></svg></div>
<div style="position:absolute; left:0; right:0; top:378px; display:flex; justify-content:center;"><div style="height:34px; border-radius:17px; background:${CARD}; box-shadow:0 0 0 1.5px ${LINE}; display:inline-flex; align-items:center; padding:0 16px; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${TXT}; white-space:nowrap;">Starting point</div></div>
${stack(440, [p('This is where you start. What you do from here matters more than the questionnaire.', { center: true })], { center: true })}
${primary('Next')}`));

  // 32 Cost next 30
  const relapseIdx = new Set([2, 6, 9, 13, 16, 20, 23, 27, 29]);
  const dots30 = Array.from({ length: 30 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6); const x = 22 + c * 58, y = 22 + r * 50; return relapseIdx.has(i) ? `<circle cx="${x}" cy="${y}" r="14" fill="${CARD}" stroke="${ART}" stroke-width="1.6"></circle>` : `<circle cx="${x}" cy="${y}" r="15" fill="${INK}"></circle>`; }).join('');
  add('29 · The Next 30 Days', frame('Cost Next 30', `${nav(null, T)}
${stack(140, [h1('This is your next 30 days.'), p('If the rate you reported stayed the same, about <span style="font-weight:700; color:' + TXT + ';">9 of the next 30 days</span> could end with porn.')], { gap: 18 })}
<div style="position:absolute; left:24px; right:24px; top:330px; display:flex; justify-content:center;"><svg width="334" height="244" viewBox="0 0 334 244">${dots30}</svg></div>
<div style="position:absolute; left:0; right:0; top:590px; display:flex; justify-content:center; gap:28px;"><div style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:${SUB};"><div style="width:12px; height:12px; border-radius:6px; background:${CARD}; box-shadow:0 0 0 1.5px ${ART};"></div>Relapse</div><div style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:${SUB};"><div style="width:12px; height:12px; border-radius:6px; background:${INK};"></div>Clean day</div></div>
<div style="position:absolute; left:24px; right:24px; top:640px; text-align:center; font-size:15px; line-height:22px; color:${MUTE};">The line can start changing with the next one.</div>
${primary('Next')}`));

  // 33 Cost 365
  let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const cells = []; const cols = 25, rows = 15; let dark = 0;
  for (let i = 0; i < 365; i++) { const c = i % cols, r = Math.floor(i / cols); const isDark = dark < 110 && rnd() < 0.31; if (isDark) dark++; cells.push(`<circle cx="${7 + c * 13.8}" cy="${7 + r * 13.8}" r="${isDark ? 4.4 : 2.4}" fill="${isDark ? INK : ART}"></circle>`); }
  add('30 · One Year From Now', frame('Cost Next 365', `${nav(null, T)}
${stack(140, [h1('One year from now.')])}
<div style="position:absolute; left:24px; top:210px;"><svg width="345" height="208" viewBox="0 0 345 208">${cells.join('')}</svg></div>
${stack(456, [`<div style="font-size:44px; font-weight:700; letter-spacing:-1.5px; line-height:52px; color:${TXT};">About 110 days</div>`, p('Where you’re predicted to relapse.')], { gap: 6 })}
${primary('Next')}`));

  // 34 By age 80 (black)
  seed = 3; const field = []; for (let r = 0; r < 71; r++) for (let c = 0; c < 33; c++) { const on = rnd() < 0.3; field.push(`<circle cx="${6 + c * 12}" cy="${6 + r * 12}" r="${on ? 2.6 : 1.6}" fill="${on ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}"></circle>`); }
  add('31 · If Nothing Changes', frame('Cost By Age 80', `${nav(null, T)}
<div style="position:absolute; inset:0;"><svg width="393" height="852" viewBox="0 0 393 852">${field.join('')}</svg><div style="position:absolute; left:0; right:0; top:96px; height:230px; background:linear-gradient(180deg, #111111 0%, #111111 62%, rgba(17,17,17,0) 100%);"></div></div>
<div style="position:absolute; left:24px; top:126px; z-index:2;">${caps('By age 80', { color: 'rgba(255,255,255,0.55)' })}</div>
<div style="position:absolute; left:24px; top:160px; z-index:2; font-size:44px; font-weight:700; letter-spacing:-1.5px; line-height:52px; color:#FFFFFF;">About 6,100 days</div>
<div style="position:absolute; left:24px; top:222px; z-index:2; font-size:17px; line-height:26px; color:rgba(255,255,255,0.75);">If nothing changes.</div>
${primary('Next', { dark: true })}`, { dark: true }));

  // 35 Change the line (two screens: nothing changes / with the plan)
  const lineChart = (mode) => {
    const ny = mode === 'plan' ? 172 : 104, freq = mode === 'plan' ? '2× a week' : '5× a week';
    const line = mode === 'plan' ? `<path d="M86 150 C 140 138, 190 172, 240 190 C 272 200, 304 206, 330 208" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"></path>` : `<path d="M86 150 C 170 128, 250 92, 330 58" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"></path>`;
    const lx = 208, ly = ny - 58;
    return `<svg width="345" height="270" viewBox="0 0 345 270"><text x="0" y="16" font-family="${FONT}" font-size="14" font-weight="700" fill="${TXT}">Relapse frequency</text><path d="M0 236H345" stroke="${LINE}" stroke-width="1.5"></path><path d="M0 172 C 30 168, 60 158, 86 150" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"></path>${line}<path d="M208 ${ny}V236" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 5"></path><rect x="${lx - 64}" y="${ly}" width="128" height="40" rx="10" fill="${INK}"></rect><text x="${lx}" y="${ly + 16}" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="1.2" fill="rgba(255,255,255,0.6)">3 MONTHS</text><text x="${lx}" y="${ly + 32}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="#FFFFFF">${freq}</text><circle cx="208" cy="${ny}" r="9" fill="${GROUND}" stroke="${INK}" stroke-width="4"></circle></svg>`;
  };
  add('32 · If Nothing Changes', frame('Line If Nothing Changes', `${nav(null, T)}
${stack(140, [h1('If nothing changes.'), p('The line keeps climbing. Relapses get more frequent, not less.')], { gap: 18 })}
<div style="position:absolute; left:24px; top:330px;">${lineChart('nothing')}</div>
${primary('Next')}`));
  add('32A · With the Plan', frame('Line With the Plan', `${nav(null, T)}
${stack(140, [h1('With the plan.'), p('You only have to make the next decision different. Then the next one. Then come back tomorrow.')], { gap: 18 })}
<div style="position:absolute; left:24px; top:330px;">${lineChart('plan')}</div>
${primary('Start with today')}`));

  // 36 A clean day (white)
  add('32B · A Clean Day', frame('A Clean Day', `${nav(null, T)}
<div style="position:absolute; left:0; right:0; top:266px; display:flex; justify-content:center;"><div style="width:132px; height:132px; border-radius:66px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check('#FFFFFF', 56)}</div></div>
${stack(436, [h1('One clean day.', { center: true }), p('That’s all today has to be.', { center: true })], { center: true, gap: 14 })}
${primary('Continue')}`, { bg: '#FFFFFF' }));

  // 37 One bad day
  const bad = Array.from({ length: 7 }, (_, i) => i === 3 ? `<circle cx="${22 + i * 50}" cy="22" r="17" fill="${GROUND}" stroke="${INK}" stroke-width="3"></circle>` : `<circle cx="${22 + i * 50}" cy="22" r="18" fill="${INK}"></circle>`).join('');
  add('33 · One Bad Day', frame('One Bad Day', `${nav(null, T)}
<div style="position:absolute; left:0; right:0; top:236px; display:flex; justify-content:center;"><svg width="344" height="44" viewBox="0 0 344 44">${bad}</svg></div>
${stack(330, [h1('One bad day is one bad day.', { center: true }), p('It doesn’t erase the work before it. Your lessons, logs, rating history and medallions stay.', { center: true }), p('What matters is that you come back.', { center: true, color: TXT })], { center: true, gap: 16 })}
${primary('Continue')}`));

  // 38 What you want back
  const bigPill = (t) => `<div style="height:64px; border-radius:32px; background:${INK}; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; letter-spacing:4px; color:#FFFFFF;">${t}</div>`;
  add('34 · What You Want Back', frame('What You Want Back', `${nav(null, T)}
${stack(140, [h1('This is what you’re doing it for.'), '<div style="height:10px;"></div>', bigPill('FOCUS'), bigPill('SLEEP'), bigPill('CONFIDENCE'), '<div style="height:10px;"></div>', p('Not a perfect streak for its own sake.'), p('More of your time and attention going where you actually want them.', { color: TXT })], { gap: 18 })}
${primary('See the twelve weeks')}`));

  // 39–41 Campaign maps
  const mapRow = (num, name, state, last) => `<div style="display:flex; gap:18px; align-items:stretch;"><div style="display:flex; flex-direction:column; align-items:center; width:46px; flex-shrink:0;"><div style="width:46px; height:46px; border-radius:23px; background:${state === 'here' ? INK : CARD}; box-shadow:${state === 'here' ? 'none' : `0 0 0 1.5px ${INK}`}; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; letter-spacing:0.5px; color:${state === 'here' ? '#FFFFFF' : TXT};">${num}</div>${last ? '' : `<div style="flex:1; width:0; border-left:2px dashed ${ART}; margin:6px 0;"></div>`}</div><div style="display:flex; flex-direction:column; gap:3px; padding-top:4px; padding-bottom:${last ? 0 : 26}px;"><span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${MUTE};">Week ${num}</span><span style="font-size:18px; font-weight:700; color:${TXT};">${name}</span>${state === 'here' ? `<span style="margin-top:6px; align-self:flex-start; height:26px; border-radius:13px; background:${CARD}; box-shadow:0 0 0 1.5px ${LINE}; display:inline-flex; align-items:center; padding:0 12px; font-size:12px; font-weight:700; color:${TXT}; white-space:nowrap;">You are here</span>` : ''}</div></div>`;
  const map = (label, rowsArr, caption, cta) => frame(label, `${nav(null, T)}
${stack(140, [h1('The next twelve weeks.')])}
${stack(214, rowsArr.map((r, i) => mapRow(r[0], r[1], r[2], i === rowsArr.length - 1)), { gap: 0 })}
<div style="position:absolute; left:24px; right:24px; bottom:126px; font-size:15px; line-height:23px; color:${SUB}; text-wrap:pretty;">${caption}</div>
${primary(cta)}`);
  add('35 · Twelve Weeks — I–IV', map('Campaign Map', [['I', 'Reset', 'here'], ['II', 'Changing Your Mindset'], ['III', 'In the Moment'], ['IV', 'Know Your Brain']], 'In the first four weeks, you’ll reset, rethink the habit, and learn what to do in the moment.', 'Next'));
  add('36 · Twelve Weeks — V–VIII', map('Campaign Map II', [['V', 'Why It Feels Worth It'], ['VI', 'Discipline'], ['VII', 'Relapse and Adversity'], ['VIII', 'Boredom and Meaning']], 'In weeks five to eight, you’ll build discipline and learn how to handle relapse and boredom.', 'Next'));
  add('37 · Twelve Weeks — IX–XII', map('Campaign Map III', [['IX', 'Connection'], ['X', 'Yourself'], ['XI', 'Build a Life You Want'], ['XII', 'Leave It Behind']], 'By week XII, the aim is simple: porn takes up less of your time, attention, and headspace.', 'Continue'));

  // 42 Letter received
  add('38 · A Letter Arrived', hero('Letter Received', heroEnvelope, 'A letter arrived.', 'From you, twelve weeks from now.', 'Open it', { noBack: true, ghost: 'Save it for later', textTop: 384 }));

  // 43 Letter
  const letter = ['I’m writing this at the end of week XII.', 'I remember where you are right now. You want this to be the time it finally changes, but part of you is already wondering how long you’ll last. I was thinking the same thing.', 'So here is the part I wish you knew: you do not need twelve perfect weeks. You need to stop turning one bad night into a reason to quit.', 'There were nights when I wanted to watch badly. Some days the only thing I did right was get through the evening. That still counted.', 'And there were bad days. What changed was what happened after them. I stopped saying “I’ve ruined it now, so what is the point?” I came back the next morning. I logged what happened. I carried on.', 'At the start, porn still felt like the quickest relief when I was bored, stressed, lonely, or fed up. That did not disappear in a week. But every time I waited one out, left the room, or used the SOS instead, I learned the same thing: the urge ends whether you obey it or not.'];
  add('39 · A Letter From Week XII', frame('Letter Week XII', `${nav(null, T, { close: true, noBack: true })}
<div style="position:absolute; left:24px; right:24px; top:112px; bottom:0; border-radius:24px 24px 0 0; background:${CARD}; padding:34px 28px 0; box-sizing:border-box; overflow:hidden;">
<div style="font-size:11px; font-weight:700; letter-spacing:2.6px; text-transform:uppercase; color:${MUTE}; margin-bottom:18px;">Week XII · From ${NAME}</div>
<div style="font-size:26px; font-weight:700; letter-spacing:-0.6px; color:${TXT}; margin-bottom:18px;">${NAME} —</div>
<div style="display:flex; flex-direction:column; gap:16px; font-size:16px; line-height:26px; color:${TXT};">${letter.map(t => `<div>${t}</div>`).join('')}</div>
</div>
<div style="position:absolute; left:24px; right:24px; bottom:0; height:220px; background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 55%); pointer-events:none;"></div>
${primary('Continue', { bottom: 96 })}
${ghost('Keep this letter', { bottom: 60 })}`));

  // 44 The vow (white)
  add('40 · The Vow', frame('The Vow', `${nav(null, T, { close: true, noBack: true })}
${stack(150, [caps('Day 0 · Jun 9'), h1('The vow.', { size: 40, lh: 46 }), `<div style="font-size:21px; font-weight:400; line-height:33px; color:${TXT}; margin-top:8px;">I’m giving this twelve weeks. I don’t need to be perfect. When I want to watch, I’ll use the plan first. If I have a bad day, I’ll come back the next day.</div>`], { gap: 18 })}
<div style="position:absolute; left:24px; right:24px; top:530px;"><div style="font-size:30px; font-weight:700; font-style:italic; letter-spacing:-0.5px; color:${TXT}; padding-bottom:10px; border-bottom:1.5px solid ${INK};">${NAME}</div><div style="margin-top:10px; font-size:13px; font-weight:700; letter-spacing:0.5px; color:${MUTE};">Signed on day 0</div></div>
${primary('I sign it', { bottom: 96 })}
${ghost('Not now', { bottom: 60 })}`, { bg: '#FFFFFF' }));

  // 45 Medallion
  add('41 · Medallion Earned', frame('Medallion Received', `${nav(null, T, { noBack: true })}
${heroMedal(150)}
${stack(392, [caps('Veni', { center: true }), h1('Your first medallion.', { center: true }), p('You started.', { center: true })], { center: true, gap: 12 })}
${primary('Take it')}`));

  // 46 Reminders
  const notif = (title, when, body) => `<div style="border-radius:20px; background:${CARD}; padding:16px 18px; display:flex; gap:14px; align-items:flex-start; box-shadow:0 1px 2px rgba(0,0,0,0.04);"><img src="laurel-mark.webp" alt="" width="40" height="40" style="filter:brightness(0); flex-shrink:0; border-radius:10px;"><div style="display:flex; flex-direction:column; gap:3px; flex:1;"><div style="display:flex; justify-content:space-between; align-items:baseline;"><span style="font-size:15px; font-weight:700; color:${TXT};">${title}</span><span style="font-size:12px; font-weight:700; color:${MUTE};">${when}</span></div><span style="font-size:14px; line-height:20px; color:${SUB};">${body}</span></div></div>`;
  add('42 · Reminders', frame('Reminders Setup', `${nav(null, T, { noBack: true })}
${heroBell(60)}
${stack(320, [h1('Late night is when you’re most likely to watch.'), p('Want VICI there before that time?')], { gap: 18 })}
${stack(470, [notif('Morning check-in', 'now', 'Twenty seconds — where’s your head at today?'), notif('Late night ahead', 'You pick the time', 'The time you told us about. SOS is one tap away.')], { gap: 14 })}
${primary('Turn on reminders', { bottom: 96 })}
${ghost('Not now', { bottom: 60 })}`));

  // 47 Paywall
  const feat = (t) => `<div style="display:flex; flex-direction:column; align-items:center; gap:8px; flex:1;"><div style="width:34px; height:34px; border-radius:17px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check('#FFFFFF', 14)}</div><span style="font-size:12px; font-weight:700; line-height:16px; text-align:center; color:${SUB};">${t}</span></div>`;
  add('43 · Paywall', frame('Paywall', `
<div style="position:absolute; right:24px; top:70px; font-size:15px; font-weight:700; color:${MUTE}; cursor:pointer;">Restore</div>
<div style="position:absolute; left:24px; top:66px; display:flex; align-items:center; gap:10px;"><img src="laurel-mark.webp" alt="" width="28" height="28" style="filter:brightness(0);"><span style="font-size:12px; font-weight:700; letter-spacing:3px; color:${TXT}; white-space:nowrap;">VICI UNLIMITED</span></div>
${stack(130, [h1('Take your life back.', { size: 34, lh: 40 }), p('Break the cycle, rebuild your self-control, and become someone you can trust again.')], { gap: 14 })}
<div style="position:absolute; left:24px; right:24px; top:318px; display:flex; gap:12px;">
<div style="flex:1; border-radius:22px; background:${INK}; padding:20px 18px 18px; position:relative;"><div style="position:absolute; top:-12px; left:18px; height:24px; border-radius:12px; background:${CARD}; box-shadow:0 0 0 1.5px ${INK}; display:flex; align-items:center; padding:0 10px; font-size:11px; font-weight:700; letter-spacing:1px; color:${TXT};">SAVE 74%</div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:18px; font-weight:700; color:#FFFFFF;">Yearly</span><div style="width:22px; height:22px; border-radius:11px; background:#FFFFFF; display:flex; align-items:center; justify-content:center;">${check(INK, 12)}</div></div><div style="margin-top:6px; font-size:12px; font-weight:700; color:rgba(255,255,255,0.6);">Best value</div><div style="margin-top:22px; font-size:26px; font-weight:700; letter-spacing:-0.8px; color:#FFFFFF;">$39.99<span style="font-size:13px; font-weight:700; color:rgba(255,255,255,0.6); letter-spacing:0;">/year</span></div><div style="margin-top:2px; font-size:13px; font-weight:700; color:rgba(255,255,255,0.7);">$3.33 a month</div></div>
<div style="flex:1; border-radius:22px; background:${CARD}; box-shadow:0 0 0 1.5px ${LINE}; padding:20px 18px 18px;"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:18px; font-weight:700; color:${TXT};">Monthly</span><div style="width:22px; height:22px; border-radius:11px; box-shadow:0 0 0 1.5px ${LINE};"></div></div><div style="margin-top:6px; font-size:12px; font-weight:700; color:${MUTE};">Cancel anytime</div><div style="margin-top:22px; font-size:26px; font-weight:700; letter-spacing:-0.8px; color:${TXT};">$12.99<span style="font-size:13px; font-weight:700; color:${MUTE}; letter-spacing:0;">/month</span></div><div style="margin-top:2px; font-size:13px; font-weight:700; color:${MUTE};">Billed monthly</div></div>
</div>
<div style="position:absolute; left:24px; right:24px; top:520px;">${caps('What you get')}</div>
<div style="position:absolute; left:24px; right:24px; top:552px; display:flex; gap:8px;">${feat('12-week plan')}${feat('SOS help')}${feat('Weekly insights')}${feat('Progress tracking')}</div>
${primary('Continue', { bottom: 82 })}
<div style="position:absolute; left:0; right:0; bottom:52px; text-align:center; font-size:12px; font-weight:700; letter-spacing:0.4px; color:${MUTE};">Terms · Restore</div>`));

  // 48 Day zero
  add('44 · Day 0', frame('Day Zero', `${nav(null, T, { noBack: true })}
${heroSunrise(84)}
${stack(348, [caps('Today', { center: true }), h1('Day 0', { size: 44, lh: 50, center: true })], { center: true, gap: 8 })}
${stack(470, [`<div style="border-radius:20px; background:${CARD}; padding:18px 20px; display:flex; flex-direction:column; gap:4px; text-align:left;"><span style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${MUTE};">Lesson I · Seven minutes</span><span style="font-size:19px; font-weight:700; color:${TXT};">Surviving the Night</span></div>`, p('Your first lesson is ready. Start with one thing today.', { center: true, size: 15, lh: 22 })], { center: true, gap: 14 })}
${primary('Begin')}`));

  // 49 Paywall rescue
  const tRow = (t, state, last) => `<div style="display:flex; gap:16px;"><div style="display:flex; flex-direction:column; align-items:center; width:22px; flex-shrink:0;"><div style="width:22px; height:22px; border-radius:11px; background:${state === 'now' ? INK : CARD}; box-shadow:${state === 'now' ? 'none' : `0 0 0 1.5px ${INK}`}; display:flex; align-items:center; justify-content:center;">${state === 'now' ? check('#FFFFFF', 11) : ''}</div>${last ? '' : `<div style="flex:1; border-left:2px dashed ${ART}; margin:6px 0;"></div>`}</div><div style="padding-bottom:${last ? 0 : 26}px; font-size:16px; line-height:24px; color:${TXT}; font-weight:${state === 'now' ? 700 : 400};">${t}</div></div>`;
  add('11B · Paywall — Three Days Free', frame('Paywall Rescue', `${nav(null, T, { close: true, noBack: true })}
${stack(140, [h1('Before you go — three days on us.')])}
${stack(250, [tRow('Today — everything unlocks', 'now'), tRow('Day 2 — a reminder, before any charge', 'todo'), tRow('Day 3 — $39.99/year begins, unless you cancel', 'todo', true)], { gap: 0 })}
${primary('Start my 3 free days', { bottom: 96 })}
${ghost('No thanks', { bottom: 60 })}`));

  // 50 Paywall confirmed
  add('11C · Paywall — Confirmed', frame('Paywall Confirmed', `${nav(null, T, { noBack: true })}
<div style="position:absolute; left:0; right:0; top:266px; display:flex; justify-content:center;"><div style="width:132px; height:132px; border-radius:66px; background:${INK}; display:flex; align-items:center; justify-content:center;">${check('#FFFFFF', 56)}</div></div>
${stack(436, [h1(`We’re in, ${NAME}.`, { center: true }), p('Let’s take the first ground. Nothing is charged until Jul 24 — cancelling is one tap in Settings.', { center: true })], { center: true, gap: 14 })}
${primary('Begin Day I', { bottom: 82 })}
<div style="position:absolute; left:0; right:0; bottom:52px; text-align:center; font-size:12px; font-weight:700; color:${MUTE};">Receipt sent to sam@hey.com</div>`));

  return screens;
})();
