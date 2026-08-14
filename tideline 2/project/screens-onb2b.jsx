// screens-onb2b.jsx — VICI onboarding v2 · spec build, part 2 of 2.
// PHASE 3 REFRAME → PHASE 7 DAY ZERO (S23–S38), the branching flow
// orchestrator, and the static canvas boards. Pairs with screens-onb2.jsx.

const { useState: o2bState, useEffect: o2bEffect } = React;

// ════════ PHASE 3 · REFRAME ══════════════════════════════════════════
const O2_EDU = [
  { key: 'enemy', title: 'It was never a fair fight.',
    body: "The algorithm on the other side is tuned by thousands of engineers to keep you watching. Your brain evolved for a world where one image was rare — against infinite novelty it never stood a chance. It was never weakness. You were outgunned." },
  { key: 'mechanism', title: 'Your brain did exactly what brains do.',
    body: "Dopamine tags whatever predicts reward, then demands escalation as tolerance builds. That's why the content got more extreme while normal life went gray. The good news: tolerance reverses — a process with a timeline, not a mystery." },
];
function O2Edu({ idx, next }) {
  const e = O2_EDU[idx];
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
          <O2Eyebrow tone="var(--ink2)">Why this happened</O2Eyebrow>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink3)' }}>{idx + 1} / 2</span>
        </div>
        <O2H size={29}>{e.title}</O2H>
        <O2Sub style={{ fontSize: 15.5, marginTop: 18 }}>{e.body}</O2Sub>
      </div>
      <O2CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}
// S25 — the tide (brand-defining)
function O2TideArt() {
  return (
    <svg width="100%" height="150" viewBox="0 0 358 150" fill="none" style={{ display: 'block' }}>
      <defs><linearGradient id="o2t" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="var(--fill-lo)" stopOpacity="0.25" /><stop offset="50%" stopColor="var(--accent)" /><stop offset="100%" stopColor="var(--fill-lo)" stopOpacity="0.25" /></linearGradient></defs>
      <g className="o2-swell">
        <path d="M0 84 C 50 66 92 60 128 74 C 156 85 152 104 128 102 C 112 100 110 88 122 82" stroke="url(#o2t)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M150 96 C 210 80 268 82 358 70" stroke="color-mix(in oklab, var(--fill) 50%, transparent)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
      <path d="M0 122 H358" stroke="color-mix(in oklab, var(--fill) 60%, transparent)" strokeWidth="1.6" strokeDasharray="1 7" strokeLinecap="round" />
      <text x="6" y="140" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9, letterSpacing: '0.14em' }}>THE VICI</text>
      <circle cx="128" cy="30" r="2" fill="rgba(234,242,241,0.5)" className="onb-twinkle" />
      <circle cx="310" cy="22" r="1.6" fill="rgba(234,242,241,0.4)" className="onb-twinkle" style={{ animationDelay: '1.4s' }} />
    </svg>
  );
}
// the breaking wave — the shared scene-kit crest, panoramic. Paper mode
// renders the same faceted wave as the lessons + urge flow (no ink
// outline); night keeps a light-line treatment for the dark theme.
function O2WaveArt({ night = false }) {
  if (!night) {
    const K = window.SceneKit, C = K.SC;
    const Crest = K.WaveCrest, Gull = K.SGull, lensP = K.lens;
    return (
      <svg width="100%" viewBox="0 0 358 204" fill="none" style={{ display: 'block', overflow: 'visible' }}>
        {/* (the shell's ambient sky provides the sun/moon postmark) */}
        <Gull x={58} y={44} s={0.95} />
        <Gull x={84} y={32} s={0.72} o={0.5} />
        {/* horizon slivers — kept left, clear of the ambient sun */}
        <path d={lensP(150, 118, 80, 5.5)} fill={C.waterHi} />
        <path d="M78 116 C 108 111 140 110 168 112 C 192 114 214 118 228 121" stroke={C.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" fill="none" />
        <path d="M56 128 C 92 123 136 122 176 124 C 204 126 226 129 240 132" stroke={C.foam} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" fill="none" />
        {/* the crest */}
        <g className="o2-swell"><Crest x={158} y={166} s={1.06} /></g>
        {/* trough — light band, fine foam echoes */}
        <path d={lensP(182, 182, 166, 9)} fill={C.waterLo} />
        <path d={lensP(190, 184, 124, 5.5)} fill={C.waterDeep} opacity="0.4" />
        <path d="M32 179 C 84 171 146 169 198 171 C 244 173 288 178 316 182" stroke={C.foam} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M64 184 C 112 178 168 176 214 178 C 250 179 282 183 304 186" stroke={C.foam} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.5" />
        <circle cx="98" cy="175" r="1.8" fill={C.foam} /><circle cx="118" cy="170" r="1.3" fill={C.foam} />
        <circle cx="256" cy="176" r="1.3" fill={C.foam} opacity="0.7" /><circle cx="280" cy="181" r="1" fill={C.foam} opacity="0.55" />
      </svg>
    );
  }
  const ink = 'rgba(234,242,241,0.85)';
  const lit = 'rgba(43,212,192,0.10)';
  const shade = 'rgba(43,212,192,0.2)';
  const sea = 'rgba(21,158,146,0.16)';
  const foam = '#EAF2F1';
  return (
    <svg width="100%" viewBox="0 0 358 204" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {/* small ringed moon, postmark language */}
      <circle cx="299" cy="46" r="15" fill="transparent" stroke={ink} strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="299" cy="46" r="24" stroke={ink} strokeOpacity="0.28" strokeWidth="1.4" strokeDasharray="2.5 6" />
      {/* the wave body — face rising from the left, barrel over on the right */}
      <g className="o2-swell">
        {/* face fill */}
        <path d="M14 154 C 72 146 110 126 138 86 C 152 64 168 49 190 47 C 227 44 250 70 247 99 L 247 154 Z" fill={lit} />
        {/* barrel shadow — the inside of the curl */}
        <path d="M190 47 C 227 44 250 70 247 99 C 245 122 225 137 204 130 C 219 126 232 112 231 95 C 230 73 213 58 190 56 Z" fill={shade} />
        {/* the curve itself: one continuous line, crest to spiral */}
        <path d="M14 154 C 72 146 110 126 138 86 C 152 64 168 49 190 47 C 227 44 250 70 247 99 C 245 122 225 137 204 130 C 188 124 183 106 193 95 C 199 88 210 88 214 96" stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* lip foam at the spiral's mouth */}
        <circle cx="216" cy="101" r="4.5" fill={foam} stroke={ink} strokeWidth="2" />
        <circle cx="224" cy="110" r="3" fill={foam} stroke={ink} strokeWidth="1.8" />
        <circle cx="215" cy="114" r="2.2" fill={foam} stroke={ink} strokeWidth="1.6" />
        {/* spray off the crest */}
        <g stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.6">
          <path d="M186 34 l0 -7M201 32 l2 -7M216 36 l4 -6" />
        </g>
        <circle cx="175" cy="31" r="1.8" fill={ink} opacity="0.5" />
        <circle cx="228" cy="27" r="1.6" fill={ink} opacity="0.4" />
      </g>
      {/* sea it lands in */}
      <rect x="0" y="154" width="358" height="50" fill={sea} opacity="0.55" />
      <path d="M0 154 H358" stroke={foam} strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      {/* whitewater running out ahead of the broken wave */}
      <path d="M252 154 q 14 -7 28 0 t 28 0 t 28 0" stroke={ink} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M24 176 h36M84 186 h24M270 176 h30M318 186 h22" stroke={foam} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function O2S25_Tide({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <div style={{ margin: '2px 6px 28px' }}><O2WaveArt night={o2Night()} /></div>
        <O2H size={32}>Urges are waves.</O2H>
        <O2Sub style={{ fontSize: 15.5 }}>They peak, then pass — usually inside 15 minutes. Nobody beats the ocean. You outlast one wave at a time.</O2Sub>
        <O2Sub style={{ fontSize: 15.5, marginTop: 18 }}>And if one takes you down, the tide goes back out. You get back up. The line keeps moving.</O2Sub>
      </div>
      <O2CTA label="One wave at a time" onClick={next} />
    </React.Fragment>
  );
}
const O2_METHOD = [
  ['Build', 'Recovery Score — grows with every skill learned and urge outlasted. Dents, never zeroes.', 'M4 17 L10 11 L14 14 L20 7', 'M20 7 v4 M20 7 h-4'],
  ['Block', 'Content blocker armed at your trigger hours.', 'M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z', 'M9 12h6'],
  ['Break glass', 'Panic button for the 15-minute wave.', 'M12 4v8M12 4l-3.4 3.4M12 4l3.4 3.4', 'M5 16 q 3.5 -3 7 0 t 7 0'],
  ['Backup', 'Anonymous brotherhood + AI coach, 24/7.', 'M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z M2.8 19c.6-3.2 2.9-5 5.7-5s5.1 1.8 5.7 5', 'M16 10.5a2.6 2.6 0 1 0 0-5.2 M17.4 14.2c2.2.4 3.8 1.9 4.3 4.3'],
];
function O2S26_Method({ a, next }) {
  return (
    <React.Fragment>
      <O2H>Willpower isn't a plan. This is:</O2H>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 13, marginTop: 22, paddingBottom: 4 }}>
        {O2_METHOD.map(([t, s, p1, p2], i) => (
          <O2Card key={t} className="o2-tick" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '15px 17px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d={p1} stroke="var(--on-fill)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /><path d={p2} stroke="var(--on-fill)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{t}</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink2)', marginTop: 3 }}>{s}</div>
            </div>
          </O2Card>
        ))}
      </div>
      <O2CTA label="Build my plan" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 4 · PLAN ═════════════════════════════════════════════
function O2S27_PlanBuild({ a, live = true, next }) {
  o2bEffect(() => { if (live) { const id = setTimeout(next, 2800); return () => clearTimeout(id); } }, [live]);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="onb-spin" style={{ width: 54, height: 54, borderRadius: 9999, border: '2px dashed color-mix(in oklab, var(--fill) 50%, transparent)', marginBottom: 22 }} />
      <O2H size={23}>Assembling {a.name || 'your'}{a.name ? "'s" : ''} plan…</O2H>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 22, maxWidth: 300 }}>
        {(a.prize || []).slice(0, 3).map((g, i) => (
          <span key={g} className="o2-tick" style={{ animationDelay: `${0.4 + i * 0.5}s`, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink)', background: 'var(--card)', boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--fill) 40%, transparent)', padding: '8px 14px', borderRadius: 9999 }}>{g}</span>
        ))}
      </div>
    </div>
  );
}
function O2S28_Plan({ a, next }) {
  const goals = (a.prize || []).slice(0, 2).map((g) => g.toLowerCase()).join(', ') || 'confidence, real intimacy';
  const trig = ((a.triggers || [])[0] || 'late at night').toLowerCase();
  const phases = [
    ['Days 1–14', 'Stabilize', `Panic button armed for your ${trig} window, blocker on, daily 2-min check-in.`],
    ['Days 15–45', 'Rebuild', `Energy & focus protocols, urge-surfing training.`],
    ['Days 46–90', 'Rewire', `Real-life reconnection goals: ${goals}.`],
  ];
  return (
    <React.Fragment>
      <O2Eyebrow>Built from your answers</O2Eyebrow>
      <O2H style={{ marginTop: 9 }}>{a.name ? `${a.name}'s` : 'Your'} 90-Day Rewire</O2H>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 20, paddingBottom: 4 }}>
        {phases.map(([meta, t, s], i) => (
          <div key={t} className="o2-tick" style={{ animationDelay: `${0.12 + i * 0.12}s`, position: 'relative', paddingLeft: 44, paddingBottom: i < phases.length - 1 ? 18 : 0 }}>
            {/* rail + node */}
            {i < phases.length - 1 ? <span style={{ position: 'absolute', left: 15, top: 34, bottom: -2, width: 2, background: 'var(--soft2)', borderRadius: 9999 }} /> : null}
            <span className="tnum" style={{ position: 'absolute', left: 0, top: 2, width: 32, height: 32, borderRadius: 9999, background: i === 0 ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)', color: i === 0 ? 'var(--on-fill)' : 'var(--ink)', boxShadow: i === 0 ? 'none' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5 }}>{i + 1}</span>
            <O2Card style={{ padding: '15px 17px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, letterSpacing: '-0.005em', color: 'var(--ink)' }}>{t}</span>
                <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', flexShrink: 0 }}>{meta}</span>
              </div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 6 }}>{s}</div>
            </O2Card>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 2px 0', padding: '13px 15px', borderRadius: 14, background: 'color-mix(in oklab, var(--fill) 6%, var(--card))', boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--fill) 25%, transparent)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M4 17 L10 11 L14 14 L20 7" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 7 v4 M20 7 h-4" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink)' }}>Measured by your <b>Recovery Score</b> — not a streak. Every action builds it. Nothing zeroes it.</span>
        </div>
      </div>
      <O2CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}
function O2S29_QuitDate({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        {/* a torn-off calendar leaf */}
        <div className="o2-tick" style={{ width: 108, borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-pop)', margin: '0 auto 26px', background: 'var(--card-solid)', }}>
          <div style={{ background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', padding: '7px 0 6px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.22em', color: 'var(--on-fill)' }}>JULY</span>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 44, letterSpacing: '-0.012em', color: 'var(--ink)', lineHeight: 1 }}>3</span>
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 11 }}>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Day one</span>
          </div>
        </div>
        <O2H size={32}>Your Day 1 is today — July 3.</O2H>
        <O2Sub style={{ fontSize: 15.5 }}>Not Monday. Not "after this weekend." Men who start the day they decide have double the 90-day completion rate.</O2Sub>
      </div>
      <O2CTA label="Today is Day 1" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 5 · VOW ══════════════════════════════════════════════
function O2S30_Vow({ a, next }) {
  const [inked, setInked] = o2bState(false);
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <O2H>Sign it, {a.name || 'friend'}.</O2H>
        <div style={{ marginTop: 18, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(180deg, #F7F5EE, #EBE8DC)', boxShadow: 'none', padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 21c3.5-1 5-3 5-3s4-1.5 6-5c2.4-4.2 1-9 1-9s-4.8-1.4-9 1c-3.5 2-5 6-5 6s-2 1.5-3 5" stroke="#5A594E" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A887A' }}>The vow · July 3, 2026</span>
          </div>
          <p style={{ fontFamily: LETTER_SERIF, fontWeight: 500, fontSize: 15, lineHeight: 1.62, color: '#22221C', margin: 0 }}>
            I, {a.name || '________'}, choose to take back control of my own mind. Not because I'm broken, but because I'm done. Waves will come. I will get back up. Every time.
          </p>
          <div style={{ marginTop: 16 }}><SignaturePad onInk={setInked} /></div>
        </div>
      </div>
      <div style={{ paddingTop: 16 }}><O2CTA label="I sign" enabled={inked} onClick={next} /></div>
    </React.Fragment>
  );
}
// iOS-style toggle, inked
function O2Toggle({ on = true }) {
  return (
    <span style={{ width: 46, height: 28, borderRadius: 9999, flexShrink: 0, position: 'relative', display: 'inline-block',
      background: on ? 'linear-gradient(180deg, var(--fill-lo), var(--fill-hi))' : 'var(--soft2)',
      boxShadow: on ? 'none' : 'none', transition: 'background .25s ease' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 24, height: 24, borderRadius: 9999,
        background: 'linear-gradient(180deg, #FFFFFF, #F4F3EE)', boxShadow: 'var(--shadow-knob)', transition: 'left .22s cubic-bezier(.32,1.35,.55,1)' }} />
    </span>
  );
}

function O2S31_Notify({ a, set, next }) {
  const night = ((a.triggers || [])[0] || 'Late at night').toLowerCase().includes('night');
  const trig = night ? '12–3am' : 'trigger-hour';
  const rows = [
    ['Night watch', night ? '12:00 AM' : '10:30 PM', true],
    ['Morning check-in', '8:00 AM', true],
  ];
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 10px' }} />
      <O2H>Your plan has a {trig} guard shift. Want us on it?</O2H>
      <O2Sub>You're about <b style={{ color: 'var(--ink)' }}>3× more likely</b> to reach Day 30 with check-ins on.</O2Sub>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* the mock notification, mid-delivery */}
        <div className="o2-tick tl-glass" style={{ transform: 'rotate(-2.5deg)', borderRadius: 19, boxShadow: 'none', padding: '13px 15px', display: 'flex', gap: 12, alignItems: 'flex-start', margin: '0 2px 22px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="13" viewBox="0 0 34 20" fill="none"><path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke="var(--on-fill)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <b style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>VICI</b>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, color: 'var(--ink3)' }}>now</span>
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.45, color: 'var(--ink2)', marginTop: 2 }}>Still up? The wave passes in 15 minutes. Ride it with me.</span>
          </span>
        </div>
        {/* his shifts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {rows.map(([label, time, on]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', borderRadius: 18, padding: '13px 16px 13px 18px', boxShadow: 'none', opacity: on ? 1 : 0.62 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink2)' }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 21, letterSpacing: '-0.01em', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{time}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="var(--ink3)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <O2Toggle on={on} />
            </div>
          ))}
        </div>
      </div>
      <O2Note style={{ marginBottom: 13 }}>Guard shift set from your answers — change it anytime.</O2Note>
      <O2CTA label="Arm my reminders" onClick={() => { set('notify', true); next(); }} />
      <O2CTA ghost label="Not now" onClick={() => { set('notify', false); next(); }} />
    </React.Fragment>
  );
}
function O2S32_Rating({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <svg width="30" height="46" viewBox="0 0 34 52" fill="none" style={{ opacity: 0.55 }}><path d="M30 6C16 8 8 20 9 34c0 5 2 9 4 12" stroke="var(--ink2)" strokeWidth="3" strokeLinecap="round" /><path d="M26 16c-7 1-11 6-12 12M24 28c-6 0-9 3-10 8" stroke="var(--ink2)" strokeWidth="2.4" strokeLinecap="round" /></svg>
          <span style={{ display: 'inline-flex', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => <svg key={i} width="24" height="24" viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z" fill="var(--ink)" /></svg>)}
          </span>
          <svg width="30" height="46" viewBox="0 0 34 52" fill="none" style={{ opacity: 0.55, transform: 'scaleX(-1)' }}><path d="M30 6C16 8 8 20 9 34c0 5 2 9 4 12" stroke="var(--ink2)" strokeWidth="3" strokeLinecap="round" /><path d="M26 16c-7 1-11 6-12 12M24 28c-6 0-9 3-10 8" stroke="var(--ink2)" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </div>
        <O2H>One favor before your plan unlocks.</O2H>
        <O2Sub style={{ fontSize: 15, maxWidth: 300 }}>VICI grows when men who need it can find it. If this felt different, a rating helps the next guy at 2am find us.</O2Sub>
      </div>
      <O2CTA label="Leave a rating" onClick={next} />
      <O2CTA ghost label="Maybe later" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 6 · INVESTMENT ═══════════════════════════════════════
function O2S33_OTO({ a, live = true, next, onOther }) {
  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span className="tnum tl-glass" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink2)', borderRadius: 9999, padding: '6px 12px', boxShadow: 'none' }}>Holds for <b style={{ color: 'var(--ink)' }}><Countdown from={300} live={live} /></b></span>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.13em', color: 'var(--ink3)' }}>APPEARS ONCE</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <O2H size={29}>{a.name || 'Friend'}, your plan is ready.</O2H>
        <div className="o2-tick" style={{ margin: '24px auto 0', width: '100%', maxWidth: 320, borderRadius: 24, background: 'var(--card)', boxShadow: 'inset 0 0 0 1.8px var(--fill)', padding: '22px 20px 18px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--on-fill)', background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', borderRadius: 9999, padding: '5px 12px', boxShadow: 'none', whiteSpace: 'nowrap' }}>80% OFF · FIRST YEAR</span>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink3)', textDecoration: 'line-through' }}>$99.99</span>
          <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 54, letterSpacing: '-0.04em', color: 'var(--ink)', lineHeight: 1.02, marginTop: 2 }}>$19.99<span style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink3)' }}>/year</span></div>
          <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', marginTop: 7 }}>$1.67 a month · renews at the same price</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 18 }}>
          {(a.prize || []).slice(0, 3).map((g) => (
            <span key={g} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink)', background: 'var(--soft)', boxShadow: 'none', padding: '7px 13px', borderRadius: 9999 }}>{g}</span>
          ))}
        </div>
      </div>
      <O2CTA label="Claim my plan — $19.99/year" onClick={next} />
      <O2CTA ghost label="See other options" onClick={onOther} />
    </React.Fragment>
  );
}
// small laurel, for ratings moments
function O2Laurel({ flip = false }) {
  return (
    <svg width="17" height="27" viewBox="0 0 34 52" fill="none" style={{ opacity: 0.6, transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M30 6C16 8 8 20 9 34c0 5 2 9 4 12" stroke="var(--ink2)" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 16c-7 1-11 6-12 12M24 28c-6 0-9 3-10 8" stroke="var(--ink2)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function O2S34_Paywall({ a, next, onClose }) {
  const [plan, setPlan] = o2bState('year');
  const buyback = (a.costs || []).slice(0, 3).map((c) => c.split(' / ')[0].split(' & ')[0].toLowerCase());
  const PLANS = {
    year: ['Yearly', '$39.99', '/year', '7-day free trial · $3.33/mo'],
    month: ['Monthly', '$8.99', '/month', 'Flexible · cancel anytime'],
  };
  const Cell = ({ id, tag }) => {
    const on = plan === id;
    const [name, price, per, note] = PLANS[id];
    return (
      <button onClick={() => setPlan(id)} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
        position: 'relative', appearance: 'none', border: 'none', cursor: 'pointer', borderRadius: 24,
        padding: '24px 12px 18px', minHeight: 148, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
        background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)',
        color: on ? 'var(--on-fill)' : 'var(--ink)',
        boxShadow: on ? 'none' : 'none',
      }}>
        {tag ? <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9, letterSpacing: '0.15em', color: on ? 'var(--ink)' : 'var(--on-fill)', background: on ? 'var(--card-solid, #FCFBF8)' : 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: on ? 'none' : 'none', borderRadius: 9999, padding: '5px 11px' }}>BEST VALUE</span> : null}
        {on ? (
          <span style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 9999, background: 'rgba(255,255,255,0.18)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--on-fill)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        ) : null}
        <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, letterSpacing: '-0.005em' }}>{name}</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.015em' }}>{price}</span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, opacity: 0.65 }}>{per}</span>
        </span>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, opacity: on ? 0.78 : 0.55, lineHeight: 1.35, maxWidth: 130 }}>{note}</span>
      </button>
    );
  };
  const summary = { year: 'Yearly · $39.99 annually ($3.33/month)', month: 'Monthly · $8.99 a month' }[plan];
  return (
    <React.Fragment>
      {/* ghost wave watermark, like stoic's oversized bird */}
      <div aria-hidden style={{ position: 'absolute', right: -90, top: '30%', opacity: 0.055, pointerEvents: 'none', transform: 'rotate(-6deg)' }}>
        <svg width="340" height="300" viewBox="0 0 340 300" fill="none">
          <path d="M20 210 C 70 90, 190 60, 250 100 C 300 135, 280 190, 236 182 C 205 176, 198 145, 220 132" stroke="var(--ink)" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M6 258 q 40 -18 80 0 t 80 0 t 80 0 t 80 0" stroke="var(--ink)" strokeWidth="18" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <O2Laurel /><span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink2)' }}>4.8 ★ · 12,400 ratings</span><O2Laurel flip />
        </span>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 10, opacity: 0.6 }}>
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink2)" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative' }}>
        <div style={{ height: 8 }} />
        <O2H size={27}>{a.name ? `${a.name} — invest` : 'Invest'} in the man on Day 90.</O2H>
        <O2Sub>Buy back {buyback.length ? buyback.map((b, i) => <b key={b} style={{ color: 'var(--ink)' }}>{i ? ' · ' : ''}your {b}</b>) : 'your focus · your energy · real intimacy'}.</O2Sub>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, margin: '24px 0 0' }}>
          <Cell id="year" tag />
          <Cell id="month" />
        </div>
        <O2Quote text="Cheaper than what the habit costs you in a single week of lost hours." who="The honest math" style={{ marginTop: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, margin: '14px 0 6px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, color: 'var(--ink3)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" stroke="var(--ink3)" strokeWidth="2.2" strokeLinejoin="round" /></svg>
          <span>Private</span><span>·</span><span>Cancel anytime</span><span>·</span><span>No data sold</span>
        </div>
      </div>
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--line)', marginTop: 4 }}>
        <O2Note style={{ marginBottom: 12 }}><b className="tnum" style={{ color: 'var(--ink)' }}>{summary}</b><br />Reminder before any charge · cancel in two taps</O2Note>
        <O2CTA label={plan === 'year' ? 'Try 7 days free' : 'Start monthly — $8.99'} onClick={next} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 22, paddingTop: 13 }}>
          <span className="tl-press-soft" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', cursor: 'pointer' }}>Restore purchase</span>
          <span className="tl-press-soft" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', cursor: 'pointer' }}>Terms</span>
        </div>
      </div>
    </React.Fragment>
  );
}
function O2S35_Trial({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <O2H>Not sure? Let Day 1–3 prove it.</O2H>
        <O2Sub style={{ fontSize: 15.5 }}>3 days free. Full plan, panic button, everything. If the wave comes tonight, you'll have backup.</O2Sub>
        <O2Card style={{ marginTop: 20, padding: '6px 17px' }}>
          {[['Today', 'Full access — plan, blocker, panic button', true], ['Day 2', "We'll remind you before any charge", false], ['Day 3', 'Keep going, or cancel in two taps', false]].map(([d, s, on], i, arr) => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span className="tnum" style={{ width: 46, flexShrink: 0, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: on ? 'var(--ink)' : 'var(--ink3)' }}>{d}</span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: on ? 'var(--ink)' : 'var(--ink2)' }}>{s}</span>
            </div>
          ))}
        </O2Card>
      </div>
      <O2CTA label="Start 3 days free" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 7 · DAY ZERO ═════════════════════════════════════════
function O2S36_Letter({ a, set, next }) {
  return (
    <React.Fragment>
      <O2H>Write one sentence to the {a.name || 'you'} who will want to give up.</O2H>
      <O2Sub>We'll show it to him at the exact moment he needs it — mid-panic-button, or after a relapse.</O2Sub>
      <div style={{ flex: 1, minHeight: 0, marginTop: 18 }}>
        <textarea value={a.letter || ''} onChange={(e) => set('letter', e.target.value)}
          placeholder={'Remember how you felt at 1:47am on July 3rd. Never again. Get back up.'}
          style={{ width: '100%', height: '100%', minHeight: 130, resize: 'none', appearance: 'none', border: 'none', outline: 'none', background: 'linear-gradient(180deg, #FDFBF5, #F8F5EC)', boxShadow: 'none', borderRadius: 18, padding: '18px 20px', fontFamily: LETTER_SERIF, fontWeight: 500, fontSize: 15.5, lineHeight: 1.6, color: '#22221C' }} />
      </div>
      <div style={{ paddingTop: 14 }}><O2CTA label="Seal it" enabled={!!(a.letter || '').trim()} onClick={next} /></div>
    </React.Fragment>
  );
}
function o2FutureLetter(a) {
  const bits = [];
  if ((a.costs || []).some((c) => c.includes('fog'))) bits.push('The fog you wrote about tonight does lift. I can think again.');
  if ((a.costs || []).some((c) => c.includes('numb'))) bits.push('Things feel good again. Ordinary things.');
  if ((a.triggers || []).some((c) => c.includes('night'))) bits.push('The late-night window that owned us stopped being scary around week three.');
  if (!bits.length) bits.push('The hardest part was shorter than we feared.');
  return bits.slice(0, 2).join(' ');
}
function O2S36b_FromFuture({ a, next }) {
  const [ph, setPh] = o2bState('sealed'); // sealed → opening → read
  o2bEffect(() => {
    if (ph !== 'opening') return;
    const id = setTimeout(() => setPh('read'), 1450);
    return () => clearTimeout(id);
  }, [ph]);
  const open = () => { if (ph === 'sealed') setPh('opening'); };

  if (ph !== 'read') return (
    <React.Fragment>
      <O2H>One arrived for you, too.</O2H>
      <O2Sub>Postmarked Day 90 — it's been riding ahead of you this whole time.</O2Sub>
      {/* the sealed envelope: drifts in, hovers, cracks open on tap */}
      <div onClick={open} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: ph === 'sealed' ? 'pointer' : 'default' }}>
        <div className="onb-rise" style={{ position: 'relative' }}>
          <EnvelopeArt phase={ph === 'opening' ? 'opening' : 'sealed'} day={90} />
        </div>
      </div>
      <div style={{ opacity: ph === 'opening' ? 0 : 1, transition: 'opacity .3s ease' }}>
        <O2Note style={{ marginBottom: 13 }}>Sealed by the person you're about to become.</O2Note>
        <O2CTA label="Break the seal" onClick={open} />
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Particles mode="medium" />
      <div className="ltr-sheet" style={{ flex: 1, minHeight: 0, position: 'relative', background: 'linear-gradient(180deg, #FDFBF5, #F6F3E9)', borderRadius: 22, boxShadow: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* fold crease + one pass of light as it opens */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05) 18%, rgba(0,0,0,0.05) 82%, transparent)', pointerEvents: 'none' }} />
        <div className="ltr-sheen" style={{ position: 'absolute', top: '-30%', left: 0, width: '52%', height: '160%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)', pointerEvents: 'none', opacity: 0 }} />
        {/* postmark riding the top corner */}
        <div className="ltr-line" style={{ position: 'absolute', top: 14, right: 14, transform: 'rotate(7deg)', animationDelay: '0.55s', opacity: 0.9, pointerEvents: 'none' }}>
          <Postmark size={62} day={90} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 24px 20px' }}>
          <div className="ltr-line" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(74,74,66,0.55)', animationDelay: '0.12s' }}>Postmarked · Day 90</div>
          <p className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontWeight: 400, fontSize: 15.5, lineHeight: 1.64, color: '#2A2A24', margin: '16px 0 0', animationDelay: '0.3s', maxWidth: 264 }}>
            {a.name || 'You'} — it's you, ninety days out. I'll keep it short.
          </p>
          <p className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontWeight: 400, fontSize: 15.5, lineHeight: 1.64, color: '#2A2A24', margin: '14px 0 0', animationDelay: '0.52s' }}>
            {o2FutureLetter(a)}
          </p>
          <p className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontWeight: 400, fontSize: 15.5, lineHeight: 1.64, color: '#2A2A24', margin: '14px 0 0', animationDelay: '0.74s' }}>
            And that feeling you have right now — the one that made you sign your name? I still have it. It grew. <em style={{ fontStyle: 'italic' }}>Keep going. I'm proof it works.</em>
          </p>
          <div className="ltr-line" style={{ display: 'flex', flexDirection: 'column', gap: 3, margin: '18px 0 0', animationDelay: '0.95s' }}>
            <span style={{ fontFamily: LETTER_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 16, color: '#26261F' }}>— you, Day 90</span>
            <svg width="120" height="11" viewBox="0 0 150 12" fill="none"><path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 16 }}><O2CTA label="See you there" onClick={next} /></div>
    </React.Fragment>
  );
}
function O2S37_Panic({ a, next }) {
  const trig = ((a.triggers || [])[0] || 'late at night').toLowerCase();
  const steps = [
    'Open VICI → hold the button', '90-second cold-water / breath protocol', 'Your letter appears', 'Straight into brotherhood chat',
  ];
  return (
    <React.Fragment>
      <O2H>Set your break-glass plan.</O2H>
      <O2Sub>When it's {trig} and the wave hits:</O2Sub>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 6px' }}>
        <div style={{ position: 'relative', width: 92, height: 92 }}>
          <span className="onb-pulse" style={{ position: 'absolute', inset: 0, borderRadius: 9999, border: '1.5px solid var(--fill)', opacity: 0.4 }} />
          <div className="tl-press" style={{ position: 'absolute', inset: 6, borderRadius: 9999, cursor: 'pointer', background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <svg width="24" height="16" viewBox="0 0 34 20" fill="none"><path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke="var(--on-fill)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5, letterSpacing: '0.14em', color: 'var(--on-fill)' }}>HOLD</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 10, paddingBottom: 4 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ position: 'relative', paddingLeft: 40, paddingBottom: i < steps.length - 1 ? 14 : 0 }}>
            {i < steps.length - 1 ? <span style={{ position: 'absolute', left: 12.5, top: 28, bottom: -2, width: 2, background: 'var(--soft2)', borderRadius: 9999 }} /> : null}
            <span className="tnum" style={{ position: 'absolute', left: 0, top: 0, width: 27, height: 27, borderRadius: 9999, background: 'var(--card)', boxShadow: 'inset 0 0 0 1.6px color-mix(in oklab, var(--fill) 50%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink)' }}>{i + 1}</span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, lineHeight: 1.45, color: 'var(--ink)', display: 'block', paddingTop: 3 }}>{s}</span>
          </div>
        ))}
      </div>
      <O2CTA label="Test it now" onClick={next} />
      <O2CTA ghost label="Arm it, test later" onClick={next} />
    </React.Fragment>
  );
}
function O2S38_Score({ a, onDone }) {
  const checks = [
    ['score', 'Recovery Score started — 4 points banked', 'check'],
    ['panic', 'Panic button armed for your 12–3am window', 'check'],
    ['letter', 'Your letter is sealed — it opens the moment you need it', 'seal'],
  ];
  const Icon = ({ kind }) => (
    <span style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: 'var(--soft)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {kind === 'score' ? <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 17 L10 11 L14 14 L20 7" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 7 v4 M20 7 h-4" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></svg>
        : kind === 'panic' ? <svg width="19" height="13" viewBox="0 0 34 20" fill="none"><path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6" width="17" height="13" rx="2.5" stroke="var(--ink)" strokeWidth="1.9" /><path d="M4 7.5 L12 13.5 L20 7.5" stroke="var(--ink)" strokeWidth="1.9" strokeLinejoin="round" /></svg>}
    </span>
  );
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <O2H size={30} style={{ marginTop: 6 }}>That's day one, {a.name || 'friend'}.</O2H>
        <O2Sub>Everything is armed. Here's where you stand:</O2Sub>
        {/* score ring, compact */}
        <div style={{ position: 'relative', width: 124, height: 124, margin: '22px auto 0' }}>
          <svg width="124" height="124" viewBox="0 0 124 124" fill="none" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="62" cy="62" r="55" stroke="var(--soft2)" strokeWidth="7.5" />
            <circle cx="62" cy="62" r="55" stroke="url(#o2sc)" strokeWidth="7.5" strokeLinecap="round" pathLength="100"
              strokeDasharray="4 100" transform="rotate(-90 62 62)" className="o2-gauge" style={{ '--o2-gfrom': 104 }} />
            <defs><linearGradient id="o2sc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--fill-lo)" /><stop offset="100%" stopColor="var(--fill-hi)" /></linearGradient></defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 40, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--ink)' }}>4</span>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--ink3)', marginTop: 3 }}>RECOVERY</span>
          </div>
        </div>
        {/* what he banked — stoic checklist cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 22, textAlign: 'left' }}>
          {checks.map(([k, label, trail], i) => (
            <div key={k} className="o2-tick" style={{ animationDelay: `${0.25 + i * 0.3}s`, display: 'flex', alignItems: 'center', gap: 13, background: 'var(--card)', borderRadius: 19, padding: '13px 16px', boxShadow: 'none' }}>
              <Icon kind={k} />
              <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, lineHeight: 1.4, color: 'var(--ink)' }}>{label}</span>
              {trail === 'check' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M4 12.5l5 5L20 6.5" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 9999, flexShrink: 0, background: 'radial-gradient(circle at 38% 30%, #4E4F43, #26271F)', boxShadow: 'none' }} />
              )}
            </div>
          ))}
        </div>
        {/* the boat sets out — day 1 of 90 */}
        <div style={{ margin: '24px 6px 0' }}>
          <div style={{ position: 'relative', height: 26 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, height: 4, borderRadius: 9999, background: 'var(--soft2)' }} />
            <div style={{ position: 'absolute', left: 0, bottom: 4, width: '5%', height: 4, borderRadius: 9999, background: 'linear-gradient(90deg, var(--fill-hi), var(--fill-lo))' }} />
            <svg className="o2-swell" width="26" height="22" viewBox="0 0 26 22" fill="none" style={{ position: 'absolute', left: 'calc(5% - 10px)', bottom: 5 }}>
              <path d="M3 16 L23 16 L18.5 21 L7.5 21 Z" fill="var(--ink)" />
              <path d="M13 14 L13 1 L21.5 11.5 Z" fill="var(--ink)" opacity="0.82" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink2)' }}>Day 1 · 0h 14m clean</span>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink3)' }}>Day 90</span>
          </div>
        </div>
        {/* tonight's assignment */}
        <O2Card style={{ marginTop: 18, textAlign: 'left', boxShadow: 'inset 0 0 0 1.4px color-mix(in oklab, var(--fill) 50%, transparent)', padding: '15px 17px' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Tonight's whole assignment</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, lineHeight: 1.45, color: 'var(--ink)', marginTop: 5 }}>Put your phone outside the bedroom. <b>+2 recovery.</b></div>
        </O2Card>
      </div>
      <div style={{ paddingTop: 14 }}>
        <O2Note style={{ marginBottom: 12 }}>A relapse can dent this number — nothing can zero it.</O2Note>
        <O2CTA label="Enter VICI" onClick={onDone} />
      </div>
    </React.Fragment>
  );
}

// ════════ THE FLOW ═══════════════════════════════════════════════════
// step table: [id, render(ctx), skip?(answers)]
const O2_STEPS = [
  ['S1', (c) => <O2S1_Door {...c} />],
  ['S2', (c) => <O2S2_Promise {...c} />],
  ['S3', (c) => <O2S3_Framing {...c} />],
  ['S3b', (c) => <O2S3b_Vault {...c} />],
  ['S4', (c) => <O2S4_Name {...c} />],
  ['S5', (c) => <O2Question title="How old are you?" options={['Under 18', '18–24', '25–34', '35–44', '45+']} value={c.a.age} onSet={(v) => c.set('age', v)} next={c.next} skip note="Your answers shape the plan — they never limit it." />],
  ['S6', (c) => <O2Question title="How do you identify?" sub="Recovery looks different for everyone — this shapes your plan and community spaces." options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} value={c.a.gender} onSet={(v) => c.set('gender', v)} next={c.next} skip />],
  ['S7', (c) => <O2Question title="How long has porn been part of your life?" options={['Under a year', '1–3 years', '3–10 years', 'Most of my life']} value={c.a.duration} onSet={(v) => c.set('duration', v)} next={c.next} />],
  ['S8', (c) => <O2Question title="How often do you currently watch?" options={['A few times a month', 'Weekly', 'Several times a week', 'Daily', 'Multiple times a day']} value={c.a.freq} onSet={(v) => c.set('freq', v)} next={c.next} />],
  ['S9', (c) => <O2Question title="Has the content become more extreme over time?" options={['Yes, significantly', 'Somewhat', 'Not really', "I don't want to answer"]} value={c.a.escal} onSet={(v) => c.set('escal', v)} next={c.next} note="The honest answer is the useful one. Nobody sees it but you." />],
  ['S10', (c) => <O2S10_Valid1 {...c} />],
  ['S11', (c) => <O2Question title="Have you tried to quit before?" options={[['Never tried', null], ['Once or twice', null], ['Several times', 'Attempts aren\'t failures — they\'re reps'], ["I've lost count", 'Most men who recover tried 5+ times first']]} value={c.a.attempts} onSet={(v) => c.set('attempts', v)} next={c.next} />],
  ['S11b', (c) => <O2Question title="When you tried — what was the method?" multi options={['Pure willpower ("just stop")', 'A streak counter', 'Blockers only', 'Cold turkey after a bad night', 'Prayer / accountability partner', 'Never really had a method']} value={c.a.methods} onSet={(v) => c.set('methods', v)} next={c.next} />, (a) => a.attempts === 'Never tried'],
  ['S11c', (c) => <O2S11c_Streaks {...c} />],
  ['S12', (c) => <O2Question title="When did you last watch?" options={['Within the last few hours', 'Today', 'This week', 'Over a week ago']} value={c.a.last} onSet={(v) => c.set('last', v)} next={c.next} />, (a) => (a.arrival || []).includes('relapsed')],
  ['S13', (c) => <O2S13_Reframe {...c} />, (a) => !((a.arrival || []).includes('relapsed') || ['Within the last few hours', 'Today'].includes(a.last))],
  ['S14', (c) => <O2Question title="When are urges strongest?" multi options={['Late at night', "When I'm alone", 'When stressed or anxious', 'When bored', 'After drinking', 'Scrolling social media']} value={c.a.triggers} onSet={(v) => c.set('triggers', v)} next={c.next} />],
  ['S15', (c) => <O2Question title="What has it been costing you?" multi options={["Brain fog / can't focus", 'Low energy & motivation', 'Less attraction to real partners', 'Damage to my relationship', 'Performance problems', 'Wasted hours & lost sleep', 'Shame and secrecy', 'Feeling numb / nothing excites me']} value={c.a.costs} onSet={(v) => c.set('costs', v)} next={c.next} note="Everything stays on this device." />],
  ['S16', (c) => <O2Question title="If nothing changes — where is this in 5 years?" options={["I don't want to think about it", 'Worse than today', 'Same cycle, older me', "Honestly, I'm scared"]} value={c.a.stakes} onSet={(v) => c.set('stakes', v)} next={c.next} />],
  ['S17', (c) => <O2Question title="And if you quit — what do you want back?" multi ctaLabel="Claim these" options={['Confidence & self-respect', 'Real relationships / real intimacy', 'Focus & mental clarity', 'Energy & drive', 'Control of my own mind', 'Alignment with my faith/values']} value={c.a.prize} onSet={(v) => c.set('prize', v)} next={c.next} />],
  ['S18', (c) => <O2S18_Analysis live next={c.next} />],
  ['S19', (c) => <O2S19_Score {...c} />],
  ['S20', (c) => <O2S20_Mirror {...c} />],
  ['S21', (c) => <O2S21_Proof {...c} />],
  ['S22', (c) => <O2S22_Prognosis {...c} />],
  ['S23', (c) => <O2Edu idx={0} next={c.next} />],
  ['S24', (c) => <O2Edu idx={1} next={c.next} />],
  ['S25', (c) => <O2S25_Tide {...c} />],
  ['S26', (c) => <O2S26_Method {...c} />],
  ['S27', (c) => <O2S27_PlanBuild {...c} live />],
  ['S28', (c) => <O2S28_Plan {...c} />],
  ['S29', (c) => <O2S29_QuitDate {...c} />],
  ['S30', (c) => <O2S30_Vow {...c} />],
  ['S31', (c) => <O2S31_Notify {...c} />],
  ['S32', (c) => <O2S32_Rating {...c} />],
  ['S33', (c) => <O2S33_OTO {...c} live onOther={c.next} />],
  ['S34', (c) => <O2S34_Paywall {...c} onClose={c.next} />],
  ['S35', (c) => <O2S35_Trial {...c} />],
  ['S36', (c) => <O2S36_Letter {...c} />],
  ['S36b', (c) => <O2S36b_FromFuture {...c} />],
  ['S37', (c) => <O2S37_Panic {...c} />],
  ['S38', (c) => <O2S38_Score {...c} />],
];
const o2StepIndex = (id) => O2_STEPS.findIndex(([sid]) => sid === id);
// content-dense screens: fill the veil's horizon window too
const O2_CALM = ['S38'];
// phase label derived from step IDs (indices drift past the b-screens)
const O2_PHASE_AT = { S4: 'About you', S7: 'The habit', S11: 'Your attempts', S14: 'The cost', S18: 'Your results', S23: 'The method', S27: 'Your plan', S30: 'The vow', S33: 'Unlock', S36: 'Day zero' };
function o2PhaseOf(idx) {
  let p = '';
  for (let k = 0; k <= idx && k < O2_STEPS.length; k++) { const lbl = O2_PHASE_AT[O2_STEPS[k][0]]; if (lbl) p = lbl; }
  return p;
}

function Onboarding2Flow() {
  const [i, setI] = o2bState(0);
  const [a, setA] = o2bState({});
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const move = (from, dir) => {
    let n = from + dir;
    while (n > 0 && n < O2_STEPS.length && O2_STEPS[n][2] && O2_STEPS[n][2](a)) n += dir;
    return Math.max(0, Math.min(O2_STEPS.length - 1, n));
  };
  const next = () => setI((v) => move(v, 1));
  const back = () => setI((v) => move(v, -1));
  const [id, render] = O2_STEPS[i];
  const lit = i >= o2StepIndex('S19'); // daylight reaches the UI at the score reveal
  // S33 "claim" and S34 "purchase" both jump past S35 to S36
  const ctx = {
    a, set, back,
    next: id === 'S33' || id === 'S34' ? () => setI(o2StepIndex('S36')) : id === 'S38' ? () => {} : next,
    onOther: () => setI(o2StepIndex('S34')),
    onClose: () => setI(o2StepIndex('S35')),
    onDone: () => { setI(0); setA({}); },
  };
  return (
    <O2Shell step={i + 1} total={O2_STEPS.length} onBack={i > 0 ? back : null} bar={!['S1', 'S18', 'S27', 'S38'].includes(id)} phase={o2PhaseOf(i)} lit={lit} calm={O2_CALM.includes(id)}>
      <React.Fragment key={id}>{render(ctx)}</React.Fragment>
    </O2Shell>
  );
}

// ── static boards ────────────────────────────────────────────────────
function o2Static(id, over = {}) {
  return function O2Static() {
    const [a, setA] = o2bState({ ...O2_DEMO, ...over });
    const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
    const idx = o2StepIndex(id);
    const noop = () => {};
    const ctx = { a, set, next: noop, back: noop, onOther: noop, onClose: noop, onDone: noop };
    return (
      <O2Shell step={idx + 1} total={O2_STEPS.length} onBack={idx > 0 ? noop : null} bar={!['S1', 'S18', 'S27', 'S38'].includes(id)} phase={o2PhaseOf(idx)} lit={idx >= o2StepIndex('S19')} calm={O2_CALM.includes(id)}>
        {O2_STEPS[idx][1](ctx)}
      </O2Shell>
    );
  };
}
const O2Board_Door = o2Static('S1', { arrival: ['relapsed', 'resolved'] });
const O2Board_Promise = o2Static('S2');
const O2Board_Vault = o2Static('S3b');
const O2Board_Escalation = o2Static('S9');
const O2Board_Valid1 = o2Static('S10');
const O2Board_Methods = o2Static('S11b');
const O2Board_Streaks = o2Static('S11c');
const O2Board_Reframe = o2Static('S13');
const O2Board_Costs = o2Static('S15');
const O2Board_Analysis = () => (
  <O2Shell step={19} total={O2_STEPS.length} bar={false}><O2S18_Analysis live={false} next={() => {}} /></O2Shell>
);
const O2Board_Score = o2Static('S19');
const O2Board_Mirror = o2Static('S20');
const O2Board_Proof = o2Static('S21');
const O2Board_Prognosis = o2Static('S22');
const O2Board_Tide = o2Static('S25');
const O2Board_Method = o2Static('S26');
const O2Board_Plan = o2Static('S28');
const O2Board_QuitDate = o2Static('S29');
const O2Board_Vow = o2Static('S30');
const O2Board_OTO = () => {
  const [a] = o2bState(O2_DEMO);
  const idx = o2StepIndex('S33');
  return (
    <O2Shell step={idx + 1} total={O2_STEPS.length} onBack={() => {}} phase={o2PhaseOf(idx)}>
      <O2S33_OTO a={a} live={false} next={() => {}} onOther={() => {}} />
    </O2Shell>
  );
};
const O2Board_Paywall = o2Static('S34');
const O2Board_Trial = o2Static('S35');
const O2Board_Letter = o2Static('S36');
const O2Board_FromFuture = o2Static('S36b');
const O2Board_Panic = o2Static('S37');
const O2Board_DayZero = o2Static('S38');

Object.assign(window, {
  Onboarding2Flow, O2_STEPS,
  O2Board_Door, O2Board_Promise, O2Board_Vault, O2Board_Escalation, O2Board_Valid1, O2Board_Methods,
  O2Board_Streaks, O2Board_Reframe, O2Board_Costs, O2Board_Analysis, O2Board_Score, O2Board_Mirror,
  O2Board_Proof, O2Board_Prognosis, O2Board_Tide, O2Board_Method, O2Board_Plan, O2Board_QuitDate,
  O2Board_Vow, O2Board_OTO, O2Board_Paywall, O2Board_Trial, O2Board_Letter, O2Board_FromFuture,
  O2Board_Panic, O2Board_DayZero,
});
