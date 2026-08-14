// screens-onb3-tool.jsx — VICI onboarding v3 · part 3 of 3.
// The felt half of the funnel: First tool (the wave, ridden) → completion
// (deepening + letterpress + held beat) → The First Wave medallion (etch +
// seal) → Pledge → Letter → Day I → notification primer → Save → Plus →
// landing on a Today that is already his. Plus the flow orchestrator and
// static boards. Reuses UrgeWaveCanvas (screens-urge.jsx), SignaturePad
// (screens-onb-extra.jsx), Postmark (screens-letter.jsx), and the home
// grammar from stoic-kit.jsx.

const { useState: otState, useEffect: otEffect, useRef: otRef } = React;

// ── letterpress stamp — lines arrive with a press-and-settle ─────────
function O3Stamp({ lines, at = 0, gap = 0.55, size = 22, color = 'var(--ink)', style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center', ...style }}>
      {lines.map((l, i) => (
        <span key={i} className="o3-stamp" style={{ animationDelay: `${at + i * gap}s`, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: size, lineHeight: 1.3, color, textWrap: 'balance' }}>{l}</span>
      ))}
    </div>
  );
}

// ── the medallion: THE FIRST WAVE — line-art etching itself in ───────
// Strokes animate via dash-offset; the hatching fills last. `animate`
// re-keys to replay. On completion a double ring pulses — the visual
// echo of the firm double haptic (the wax-seal press).
function O3Medallion({ size = 190, animate = true, delay = 0, ink = 'var(--ink)' }) {
  const s = size / 190;
  const D = (d, dur, extra = {}) => (animate ? { className: 'o3-etch', style: { animationDuration: `${dur}s`, animationDelay: `${delay + (extra.at || 0)}s` } } : {});
  return (
    <svg width={size} height={size} viewBox="0 0 190 190" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {/* postmark ring */}
      <circle cx="95" cy="95" r="90" stroke={ink} strokeWidth="1.4" strokeDasharray="2.5 6.5" opacity="0.55" {...(animate ? { className: 'o3-riseline', style: { animationDelay: `${delay}s` } } : {})} />
      <circle cx="95" cy="95" r="76" stroke={ink} strokeWidth="1.8" pathLength="1" {...D(null, 0.8, { at: 0.15 })} />
      <circle cx="95" cy="95" r="70" stroke={ink} strokeWidth="0.9" opacity="0.6" pathLength="1" {...D(null, 0.8, { at: 0.3 })} />
      {/* the wave — one continuous engraved line, crest to spiral */}
      <path d="M38 118 C 62 114 76 102 88 82 C 96 68 106 58 118 57 C 138 56 150 70 148 87 C 147 100 136 108 124 104 C 115 101 112 91 118 85 C 122 81 128 82 130 87"
        stroke={ink} strokeWidth="2.6" strokeLinecap="round" pathLength="1" {...D(null, 1.1, { at: 0.45 })} />
      {/* the sea it lands in */}
      <path d="M40 126 q 9 -5 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0" stroke={ink} strokeWidth="1.6" strokeLinecap="round" pathLength="1" {...D(null, 0.7, { at: 1.1 })} />
      <path d="M56 136 h20 M96 136 h24 M134 136 h14" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" pathLength="1" {...D(null, 0.5, { at: 1.3 })} />
      {/* spray */}
      <path d="M112 46 l0 -6 M124 45 l2 -6 M136 49 l4 -5" stroke={ink} strokeWidth="1.6" strokeLinecap="round" pathLength="1" {...D(null, 0.4, { at: 1.25 })} />
      {/* cross-hatch shading inside the barrel */}
      <g opacity="0.5">
        {[[118, 66, 132, 80], [113, 72, 127, 86], [109, 79, 121, 91], [124, 64, 138, 78], [130, 63, 142, 75]].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={ink} strokeWidth="1" pathLength="1" {...D(null, 0.3, { at: 1.35 + i * 0.06 })} />
        ))}
      </g>
      {/* hatching under the shore line */}
      <g opacity="0.35">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${50 + i * 16} 146 l8 6`} stroke={ink} strokeWidth="1" pathLength="1" {...D(null, 0.25, { at: 1.5 + i * 0.04 })} />
        ))}
      </g>
      {/* the seal lands: a double pulse, timed to the double haptic */}
      {animate ? (
        <React.Fragment>
          <circle cx="95" cy="95" r="76" stroke={ink} strokeWidth="1.5" fill="none" className="o3-pulse-once" style={{ animationDelay: `${delay + 1.9}s` }} pathLength="1" />
          <circle cx="95" cy="95" r="76" stroke={ink} strokeWidth="1.5" fill="none" className="o3-pulse-once" style={{ animationDelay: `${delay + 2.12}s` }} pathLength="1" />
        </React.Fragment>
      ) : null}
    </svg>
  );
}

// ════════ 5 · FIRST TOOL — the wave, in the hand ═════════════════════
const O3_WAVE_SECONDS = 33; // compressed for the prototype; ships at 75s
const O3_WAVE_PHASES = [
  { at: 0.0, name: 'Notice it', tip: 'Breathe with the water. Nothing to fight.' },
  { at: 0.24, name: 'It rises', tip: 'Let it build. You are not the wave.' },
  { at: 0.48, name: 'The crest', tip: 'This is as strong as it gets.' },
  { at: 0.68, name: 'It breaks', tip: 'Feel it recede. It always does.' },
  { at: 0.87, name: 'Still water', tip: 'Notice the quiet.' },
];
function O3_Wave({ live = true, stage: fixedStage, next }) {
  const [stage, setStage] = otState(fixedStage || 'intro'); // intro → surf → after → medal
  const [pi, setPi] = otState(fixedStage === 'surf' ? 2 : 0);
  const progressRef = otRef(fixedStage === 'surf' ? 0.48 : 0);
  const raf = otRef(0);

  otEffect(() => {
    if (stage !== 'surf' || !live) return;
    let mounted = true;
    const t0 = performance.now();
    const loop = (now) => {
      if (!mounted) return;
      const p = Math.min(1, (now - t0) / 1000 / O3_WAVE_SECONDS);
      progressRef.current = p;
      let idx = 0;
      for (let k = 0; k < O3_WAVE_PHASES.length; k++) if (p >= O3_WAVE_PHASES[k].at) idx = k;
      setPi((v) => (v === idx ? v : idx));
      if (p >= 1) { setStage('after'); return; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { mounted = false; cancelAnimationFrame(raf.current); };
  }, [stage, live]);

  if (stage === 'intro') return (
    <O3Shell bar={false} lit>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <O3H style={{ marginTop: 12 }}>Before anything else, learn the one move you'll use most.</O3H>
        <O3Sub>A craving crests, and it breaks — usually inside fifteen minutes.</O3Sub>
        <div style={{ margin: '30px 0 0', display: 'flex', justifyContent: 'center' }}>
          <svg width="200" height="64" viewBox="0 0 200 64" fill="none" className="ci-breathe">
            <path d="M8 44 C 40 20 62 20 92 34 S 152 56 192 26" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M26 54 h28 M78 56 h20 M140 52 h24" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      </div>
      <O3CTA label="Begin the wave" onClick={() => (live ? setStage('surf') : next())} />
    </O3Shell>
  );

  if (stage === 'surf') return (
    <div style={{ position: 'absolute', inset: 0, background: '#131313', color: '#F5F4F1', fontFamily: 'var(--font)', overflow: 'hidden' }}>
      <UrgeWaveCanvas progressRef={progressRef} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 2, padding: '84px 30px 0', textAlign: 'center', pointerEvents: 'none' }}>
        <div key={pi} className="o3-riseline" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, letterSpacing: '0.008em', marginTop: 16, color: '#F5F4F1' }}>{O3_WAVE_PHASES[pi].name}</div>
        <div key={`t${pi}`} className="o3-riseline" style={{ animationDelay: '0.12s', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'rgba(245,244,241,0.62)', marginTop: 10, padding: '0 20px' }}>{O3_WAVE_PHASES[pi].tip}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, zIndex: 2, textAlign: 'center', pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.4)' }}>Breathe with the water</span>
      </div>
    </div>
  );

  if (stage === 'after') {
    // the deepening: the sea recedes to 20%, one truth stamps in at full
    // ink, the held beat, the short rule draws — then the flow continues.
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#131313', color: '#F5F4F1', fontFamily: 'var(--font)', overflow: 'hidden' }}>
        <div className="o3-dim" style={{ position: 'absolute', inset: 0, animationDelay: '0.3s' }}>
          <UrgeWaveCanvas progressRef={{ current: 1 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px' }}>
          <O3Stamp at={0.9} gap={0.85} size={25} color="#F5F4F1"
            lines={['That is how a craving passes.', 'It crests, and it breaks.', 'You just rode one out.']} />
          <span aria-hidden="true" className="o3-rulegrow" style={{ display: 'block', height: 1.5, background: '#F5F4F1', marginTop: 26, animationDelay: '4s' }} />
        </div>
        <div className="onb-rise" style={{ position: 'absolute', left: 0, right: 0, bottom: 44, zIndex: 2, animationDelay: '4.9s', animationDuration: '0.8s' }}>
          <O3CTA label="Continue" onClick={() => (live ? setStage('medal') : next())} style={{ background: '#F5F4F1', color: '#131313' }} />
        </div>
      </div>
    );
  }

  // stage === 'medal' — the first keepsake etches itself in
  return (
    <O3Shell bar={false} lit>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
        <div style={{ margin: '34px 0 0' }}>
          <O3Medallion size={196} animate delay={0.5} />
        </div>
        <div className="o3-stamp" style={{ animationDelay: '2.5s', marginTop: 30, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink)' }}>The First Wave</div>
          <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', marginTop: 8 }}>ridden this day · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
      <div className="onb-rise" style={{ animationDelay: '3.2s', animationDuration: '0.7s' }}>
        <O3CTA label="Carry it in" onClick={next} />
      </div>
    </O3Shell>
  );
}

// ════════ 6 · THE PLEDGE ═════════════════════════════════════════════
function O3_Pledge({ a, next }) {
  const [inked, setInked] = otState(false);
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <O3H size={24} style={{ marginTop: 10 }}>Set your mark.</O3H>
        <div style={{ marginTop: 20, borderRadius: 20, background: 'linear-gradient(180deg, #FBF9F3, #F0EDE3)', padding: '22px 22px 18px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 17.5, lineHeight: 1.6, color: '#22221C', margin: 0, textWrap: 'pretty' }}>
            I, {a.name || '————'}, am beginning a campaign of twelve weeks. A slip is a data point. I do not fail twice.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '16px 0 14px' }}>
            <span style={{ flex: 1, height: 1, background: 'rgba(34,34,28,0.14)' }} />
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(34,34,28,0.45)' }}>Week I of XII</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(34,34,28,0.14)' }} />
          </div>
          <SignaturePad onInk={setInked} />
        </div>
      </div>
      <div style={{ paddingTop: 14 }}>
        <O3CTA label="I set my mark" enabled={inked} onClick={next} />
      </div>
    </React.Fragment>
  );
}

// ════════ 7 · THE LETTER ═════════════════════════════════════════════
// No composing, no friction: he reads a letter from the man on the far
// side of the plan, folded from his own intake answers — how he made it
// out, and the ending he didn't meet.
function O3_Letter({ a, set, next }) {
  const name = (a.name || '').trim();
  const t = a.triggers || [];
  const trigLine = t.includes('Late at night') ? 'The late nights'
    : t.includes('Home alone for long stretches') ? 'The long stretches alone'
    : t.includes('After stress or a hard day') ? 'The hard-day evenings'
    : t.includes('Bored during the day') ? 'The slack afternoons'
    : 'The old window';
  const emos = (a.emotions || []).slice(0, 2).map((s) => s.split(' or ')[0].toLowerCase());
  const emoLine = emos.length >= 2 ? `the ${emos[0]} and the ${emos[1]}` : emos.length ? `the ${emos[0]}` : 'the restlessness';
  const costs = a.impact === 'Not really' ? 'the hours, the energy, the quiet' : 'the sleep, the work, the relationships, the money';
  const prize = (a.prize && a.prize.length ? a.prize : ['Focus', 'My evenings']).map((s) => 'the ' + s.toLowerCase().replace(/^my /, ''));
  const LSER = "'Newsreader', 'Spectral', Georgia, serif";
  const LP = ({ children, i }) => (
    <p className="ltr-line" style={{ fontFamily: LSER, fontWeight: 400, fontSize: 15.5, lineHeight: 1.62, color: '#3B3B33', margin: '0 0 14px', textWrap: 'pretty', animationDelay: `${0.25 + i * 0.18}s` }}>{children}</p>
  );
  return (
    <React.Fragment>
      <O3H size={23} style={{ marginTop: 10 }}>A letter from the man at week XII.</O3H>
      <div style={{ flex: 1, minHeight: 0, marginTop: 18, position: 'relative', background: 'linear-gradient(180deg, #FBF9F3, #F2EFE5)', borderRadius: 18, overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '34%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05) 18%, rgba(0,0,0,0.05) 82%, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '22px 24px 18px' }}>
          <div className="ltr-line" style={{ fontFamily: LSER, fontWeight: 500, fontSize: 22, color: '#26261F', margin: '0 0 14px', animationDelay: '0.1s' }}>{name ? `${name} —` : 'Friend —'}</div>
          <LP i={1}>It's week XII where I'm writing from, and the first thing to say is: we made it out.</LP>
          <LP i={2}>{trigLine} stopped being dangerous around week IV. The urges still came — they just got shorter, then quieter, then rare.</LP>
          <LP i={3}>There was another ending — the one where it kept feeding on {costs}, and {emoLine} stayed in charge. I never met that man. Tonight is the fork where he and I part ways.</LP>
          <LP i={4}>{`Everything you circled tonight — ${prize.join(', ')} — it all came back. It's here, waiting.`}</LP>
          <div className="ltr-line" style={{ display: 'flex', flexDirection: 'column', gap: 3, margin: '18px 0 0', animationDelay: '1.1s' }}>
            <span style={{ fontFamily: LSER, fontStyle: 'italic', fontWeight: 500, fontSize: 17.5, color: '#26261F' }}>— you, at week XII</span>
            <svg width="130" height="11" viewBox="0 0 130 11" fill="none"><path d="M2 7 C 30 2, 50 9, 74 5.5 S 116 4, 128 6.5" stroke="rgba(38,38,31,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 14 }}>
        <O3CTA label="Take his letter with you" enabled onClick={() => { set('letter', 'kept'); next(); }} />
      </div>
    </React.Fragment>
  );
}

// ════════ 8 · DAY I BEGINS ═══════════════════════════════════════════
function o3Window(a) {
  const t = a.triggers || [];
  if (t.includes('Late at night') || t.includes('On my phone in bed') || t.includes('When I can’t sleep')) return ['11:00 pm', 'before the tide rises'];
  if (t.includes('After stress or a hard day')) return ['6:00 pm', 'as the day lets go'];
  if (t.includes('Bored during the day')) return ['9:00 pm', 'when the evening goes slack'];
  return ['9:30 pm', 'before the quiet hours'];
}
function O3_DayOne({ a, set, next }) {
  const [time, why] = o3Window(a);
  const choose = (v) => { set('reminder', v); next(); };
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
        <div className="o3-stamp" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, letterSpacing: '0.26em', textIndent: '0.26em', textTransform: 'uppercase', color: 'var(--ink)' }}>Day I</div>
        <span aria-hidden="true" className="o3-rulegrow" style={{ display: 'block', height: 1.5, background: 'var(--ink)', marginTop: 12, animationDelay: '0.4s' }} />
        <div className="o3-riseline" style={{ animationDelay: '0.8s', marginTop: 34, width: '100%', background: 'var(--card)', borderRadius: 20, padding: '18px 20px', display: 'flex', gap: 15, alignItems: 'flex-start' }}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke="var(--ink)" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M9.8 18.8a2.2 2.2 0 0 0 4.4 0" stroke="var(--ink)" strokeWidth="1.7" />
          </svg>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>A quiet word at {time}</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 3 }}>Your window, {why}. One line, once a day. Never “your streak misses you.”</div>
          </div>
        </div>
      </div>
      <O3CTA label="Set the quiet word" onClick={() => choose(true)} />
      <O3CTA ghost label="You can ask for it later" onClick={() => choose(false)} />
    </React.Fragment>
  );
}

// ════════ 9 · NOTIFICATION PERMISSION (pre-screened) ═════════════════
function O3_Notify({ a, next }) {
  const [ask, setAsk] = otState(false);
  const [time] = o3Window(a);
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <O3H size={24}>Your phone will ask its own question now.</O3H>
        <O3Sub>One quiet word at {time}. Nothing else, ever.</O3Sub>
        {/* the word itself, as it will arrive */}
        <div className="o3-riseline" style={{ animationDelay: '0.3s', marginTop: 28, background: 'var(--card)', borderRadius: 18, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', transform: 'rotate(-1.5deg)' }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Laurel size={19} color={'var(--on-fill)'} />
          </span>
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <b style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>VICI</b>
              <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink3)' }}>{time}</span>
            </span>
          </span>
        </div>
      </div>
      <O3CTA label="Continue" onClick={() => setAsk(true)} />
      {/* the OS dialog, never fired cold */}
      {ask ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(19,19,19,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div className="onb-stamp" style={{ width: 268, borderRadius: 16, background: '#F6F5F2', textAlign: 'center', overflow: 'hidden', fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
            <div style={{ padding: '20px 20px 16px' }}>
              <div style={{ fontWeight: 600, fontSize: 15.5, color: '#111', letterSpacing: '-0.01em' }}>“VICI” Would Like to Send You Notifications</div>
              <div style={{ fontWeight: 400, fontSize: 12.5, color: '#4B4B4B', marginTop: 7, lineHeight: 1.4 }}>One quiet word a day, at the time you chose.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '0.8px solid rgba(0,0,0,0.16)' }}>
              <button onClick={next} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 0', fontSize: 15.5, color: '#0A66C2', fontWeight: 400, borderRight: '0.8px solid rgba(0,0,0,0.16)', fontFamily: 'inherit' }}>Don't Allow</button>
              <button onClick={next} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '13px 0', fontSize: 15.5, color: '#0A66C2', fontWeight: 600, fontFamily: 'inherit' }}>Allow</button>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

// ════════ 10 · SAVE YOUR CAMPAIGN ════════════════════════════════════
const O3_HOLDINGS = [
  ['Your map', 'ten grounds, routed', (c) => <g><path d="M8.6 4.5 4.3 6a1 1 0 0 0-.7.9v11.6a1 1 0 0 0 1.3.95L8.6 18zM10.2 4.4v13.6l3.6 1.2V5.6zM15.4 5.7v13.5l3.7-1.3a1 1 0 0 0 .7-.9V5.4a1 1 0 0 0-1.3-.95z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></g>],
  ['Your mark', 'the pledge, signed', (c) => <g><path d="M4 19.5 5 16 15 6l3 3L8 19zM16.5 4.5l1.4-1.4a1.5 1.5 0 0 1 2.1 0l.9.9a1.5 1.5 0 0 1 0 2.1L19.5 7.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></g>],
  ['His letter', 'from week XII, kept', (c) => <g><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke={c} strokeWidth="1.6" /><path d="M4 7 L12 13 L20 7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></g>],
  ['The First Wave', 'a medallion, earned', (c) => <g><circle cx="12" cy="12" r="8.6" stroke={c} strokeWidth="1.6" /><path d="M7 13.5 c 1.6 -2.6 3.4 -2.6 5 0 s 3.4 2.6 5 0" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none" /></g>],
  ['Day I', 'already lit', (c) => <g><path d="M7.5 2.8v3M16.5 2.8v3" stroke={c} strokeWidth="1.7" strokeLinecap="round" /><rect x="4" y="4.8" width="16" height="15.6" rx="2.4" stroke={c} strokeWidth="1.6" /><path d="M4 9.4h16" stroke={c} strokeWidth="1.5" /></g>],
];
function O3_Save({ next }) {
  return (
    <React.Fragment>
      <O3H size={24} style={{ marginTop: 10 }}>Keep your campaign safe.</O3H>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 20 }}>
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '2px 20px' }}>
          {O3_HOLDINGS.map(([t, s, icon], i) => (
            <div key={t} className="o3-riseline" style={{ animationDelay: `${0.08 + i * 0.09}s`, display: 'flex', alignItems: 'center', gap: 14, padding: '13.5px 0', borderBottom: i < O3_HOLDINGS.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>{icon('var(--ink)')}</svg>
              <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{t}</span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: 16 }}>
        <button onClick={next} className="tl-press" style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, borderRadius: 9999, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--on-fill)"><path d="M17.05 12.54c-.03-2.1 1.71-3.11 1.79-3.16-0.98-1.43-2.5-1.63-3.04-1.65-1.29-.13-2.53.76-3.18.76-.66 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.45 2.09-1.47 2.55-.37 6.32 1.06 8.39.7 1.01 1.53 2.15 2.62 2.11 1.05-.04 1.45-.68 2.72-.68 1.26 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.05.8-1.17 1.13-2.31 1.15-2.37-.03-.01-2.2-.84-2.2-3.38zM14.96 5.4c.58-.7.97-1.67.86-2.64-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.17z"/></svg>
          Save with Apple
        </button>
        <O3CTA ghost label="Use email instead" onClick={next} />
        <O3CTA ghost label="Later" onClick={next} style={{ fontSize: 12.5, color: 'var(--ink3)', paddingTop: 6 }} />
      </div>
    </React.Fragment>
  );
}

// ════════ 11 · PLUS — the paywall, honest ════════════════════════════
function O3_Paywall({ a, next, onFree }) {
  const [plan, setPlan] = otState('plus');
  const prize = (a.prize || []).slice(0, 3).map((x) => x.toLowerCase());
  const Row = ({ id, name, price, note }) => {
    const on = plan === id;
    return (
      <button onClick={() => setPlan(id)} className="tl-press-soft" style={{
        appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 13, background: 'var(--card)', borderRadius: 18,
        padding: '15px 17px', boxShadow: on ? 'inset 0 0 0 1.7px var(--ink)' : 'none',
      }}>
        <span style={{ width: 19, height: 19, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '1.6px solid var(--soft2)', background: on ? 'var(--fill)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {on ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5l4.6 4.6L19.5 7" stroke="var(--on-fill)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14.5, color: 'var(--ink)' }}>{name}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink2)', marginTop: 2 }}>{note}</span>
        </span>
        <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, color: 'var(--ink)', flexShrink: 0 }}>{price}<span style={{ fontWeight: 400, fontSize: 11.5, color: 'var(--ink3)' }}>/yr</span></span>
      </button>
    );
  };
  return (
    <React.Fragment>
      <O3Eyebrow>Vici Plus</O3Eyebrow>
      <O3H size={24} style={{ marginTop: 10 }}>The full campaign, to week XII.</O3H>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 16, paddingBottom: 4 }}>
        {/* his route, held small — the thing being unlocked */}
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '14px 14px 6px' }}>
          <O3MapRoute animate={false} />
        </div>
        <div style={{ margin: '14px 2px 0', padding: '2px 18px', background: 'var(--card)', borderRadius: 18 }}>
          {[
            ['All ten grounds', 'the campaign past the Landing'],
            ['Insights', prize.length ? `read off your logs — ${prize.join(', ')}` : 'read off your own logs'],
            ['Medallions & letters', 'earned, kept, delivered'],
          ].map(([t, s], i, arr) => (
            <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '11.5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ width: 5, height: 5, borderRadius: 9999, background: 'var(--ink)', flexShrink: 0, transform: 'translateY(-2px)' }} />
              <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{t}</span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink2)', minWidth: 0 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
          <Row id="plus" name="Yearly" price="$39.99" note="The full campaign · $3.33 a month" />
          <Row id="month" name="Monthly" price="$12.99" note="Month by month, cancel anytime" />
        </div>
      </div>
      <div style={{ paddingTop: 14 }}>
        <O3CTA label={plan === 'month' ? 'Continue — $12.99 a month' : 'Continue — $39.99 a year'} onClick={next} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <button onClick={onFree} className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1.4px solid var(--soft2)', borderRadius: 9999, padding: '11px 24px', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>Continue with the free tools</button>
        </div>
        <O3Note style={{ marginTop: 11 }}>The urge tool is free forever.</O3Note>
      </div>
    </React.Fragment>
  );
}

// ════════ LANDING — Today, already his ═══════════════════════════════
function O3_Landing({ a, onDone }) {
  const late = (a.triggers || []).includes('Late at night');
  const steps = [
    ['Read your first lesson', false],
    ['Put the phone outside the bedroom', false],
    ['A sealed letter waits in your Log — for the hard day', null], // noted, not a task
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '76px 26px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="o3-stamp" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, letterSpacing: '0.24em', textIndent: '0.24em', textTransform: 'uppercase', color: 'var(--ink)' }}>Day I</span>
          <span aria-hidden="true" className="o3-rulegrow" style={{ display: 'block', height: 1.5, background: 'var(--ink)', marginTop: 9, animationDelay: '0.35s' }} />
        </div>
        <div style={{ marginTop: 26 }}>
          <QuoteMark size={54} />
        </div>
        <div className="o3-riseline" style={{ animationDelay: '0.75s', marginTop: 30 }}>
          <SectionLabel right="wk I">Next lesson</SectionLabel>
          <DarkCard style={{ marginTop: 8 }} pad={20}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.55)' }}>{late ? 'The Landing · your late-night window' : 'The Landing · lesson one'}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, lineHeight: 1.2, color: '#F5F4F1', marginTop: 9, maxWidth: 240 }}>{late ? 'Why the pull comes at night' : 'Noticing the pull'}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <span className="tl-press" style={{ width: 44, height: 44, borderRadius: 9999, background: '#F5F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 22 22"><path d="M7 3l9 8-9 8" stroke="#131313" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </DarkCard>
        </div>
        <div className="o3-riseline" style={{ animationDelay: '0.95s', marginTop: 26 }}>
          <SectionLabel right="0 of 2">First steps</SectionLabel>
          <div style={{ background: 'var(--card)', borderRadius: 20, padding: '2px 20px', marginTop: 8 }}>
            {steps.map(([label, done], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                {done === null
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="var(--ink2)" strokeWidth="1.5" /><path d="M4 7 L12 13 L20 7" stroke="var(--ink2)" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  : <span style={{ width: 24, height: 24, borderRadius: 9999, flexShrink: 0, border: '1.6px solid var(--soft2)' }} />}
                <span style={{ fontFamily: done === null ? 'var(--font)' : 'var(--font-display)', fontWeight: done === null ? 400 : 400, fontSize: done === null ? 12.5 : 16.5, color: done === null ? 'var(--ink3)' : 'var(--ink)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0 }}><TabBar active="today" /></div>
      {/* the prototype's way out */}
      <button onClick={onDone} style={{ position: 'absolute', top: 62, right: 18, appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--ink4)', textTransform: 'uppercase' }}>restart</button>
    </div>
  );
}

// ════════ THE FLOW ═══════════════════════════════════════════════════
// [id, render(ctx), skip?(a), bare?] — bare screens own the whole frame
const O3_STEPS = [
  ['threshold', (c) => <O3_Threshold {...c} />, null, true],
  ['privacy', (c) => <O3_Privacy {...c} />],
  ['door', (c) => <O3_Door {...c} />],
  ['name', (c) => <O3_Name {...c} />],
  ...O3_QUESTIONS.map(([key, q]) => [key, (c) => (
    <O3Question key={key} title={q.title} sub={q.sub} eyebrow={q.eyebrow} kind={q.kind} options={q.options} multi={!!q.multi}
      value={c.a[key]} onSet={(v) => c.set(key, v)} next={c.next}
      reflect={q.reflect} note={q.note} ctaLabel={q.ctaLabel} skip={q.skip} />
  )]),
  ['pause', (c) => <O3_ReadingPause {...c} live />, null, true],
  ['root', (c) => <O3_Root {...c} />],
  ['costweek', (c) => <O3_CostPage {...c} h={0} />],
  ['costmonth', (c) => <O3_CostPage {...c} h={1} />],
  ['costyear', (c) => <O3_CostPage {...c} h={2} />],
  ['costdecade', (c) => <O3_CostPage {...c} h={3} />],
  ['streaks', (c) => <O3_Streaks {...c} />],
  ['rewire', (c) => <O3_Rewire {...c} />],
  ['reading', (c) => <O3_Reading {...c} />],
  ['wave', (c) => <O3_Wave {...c} live />, null, true, true],
  ['pledge', (c) => <O3_Pledge {...c} />],
  ['letter', (c) => <O3_Letter {...c} />],
  ['dayone', (c) => <O3_DayOne {...c} />],
  ['notify', (c) => <O3_Notify {...c} />, (a) => !a.reminder],
  ['save', (c) => <O3_Save {...c} />],
  ['paywall', (c) => <PaywallFlow embedded onDone={c.next} onFree={c.next} a={c.a} />],
  ['landing', (c) => <O3_Landing {...c} />, null, false, true],
];
const o3Idx = (id) => O3_STEPS.findIndex(([sid]) => sid === id);
// daylight breaks at the root — the first thing it lands on is the
// diagnosis, not the plan; dense screens calm the veil's horizon window
const o3Lit = (idx) => idx >= o3Idx('root');
const O3_CALM = ['privacy', 'root', 'streaks', 'reading', 'costweek', 'costmonth', 'costyear', 'costdecade', 'rewire', 'pledge', 'letter', 'save', 'paywall', 'notify'];

function Onboarding3Flow() {
  const [i, setI] = otState(0);
  const [a, setA] = otState({});
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const move = (from, dir) => {
    let n = from + dir;
    while (n > 0 && n < O3_STEPS.length && O3_STEPS[n][2] && O3_STEPS[n][2](a)) n += dir;
    return Math.max(0, Math.min(O3_STEPS.length - 1, n));
  };
  const next = () => setI((v) => move(v, 1));
  const back = () => setI((v) => move(v, -1));
  const [id, render, , noBar, bare] = O3_STEPS[i];
  const ctx = { a, set, next, back, onDone: () => { setI(0); setA({}); } };
  if (bare) return <React.Fragment key={id}>{render(ctx)}</React.Fragment>;
  return (
    <O3Shell progress={(i + 1) / O3_STEPS.length} onBack={i > 0 && id !== 'landing' ? back : null} bar={!noBar} lit={id === 'pause' ? 'fade' : o3Lit(i)} calm={O3_CALM.includes(id)}>
      <React.Fragment key={id}>{render(ctx)}</React.Fragment>
    </O3Shell>
  );
}

// ── static boards ────────────────────────────────────────────────────
function o3Board(id, over = {}, opts = {}) {
  return function O3StaticBoard() {
    const [a, setA] = otState({ ...O3_DEMO, ...over });
    const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
    const idx = o3Idx(id);
    const noop = () => {};
    const ctx = { a, set, next: noop, back: noop, onDone: noop, ...opts.ctx };
    const [, render, , noBar, bare] = O3_STEPS[idx];
    if (bare) return <React.Fragment>{render(ctx)}</React.Fragment>;
    return (
      <O3Shell progress={(idx + 1) / O3_STEPS.length} onBack={idx > 0 ? noop : null} bar={!noBar} lit={o3Lit(idx)} calm={O3_CALM.includes(id)}>
        {render(ctx)}
      </O3Shell>
    );
  };
}
const O3Board_Threshold = o3Board('threshold');
const O3Board_Privacy = o3Board('privacy');
const O3Board_Door = o3Board('door');
const O3Board_Name = o3Board('name');
const O3Board_Triggers = () => (
  <O3Shell progress={0.32} onBack={() => {}}>
    <O3Question eyebrow="When & why it happens" title="When are you most likely to slip?" multi kind="grid"
      options={['Late at night', 'First thing in the morning', 'Bored during the day', 'After stress or a hard day', 'When I can’t sleep', 'Weekends or days off', 'When I’ve been drinking', 'Home alone for long stretches', 'On my phone in bed']}
      value={['Late at night', 'Home alone for long stretches', 'After stress or a hard day']} onSet={() => {}} next={() => {}} />
  </O3Shell>
);
const O3Board_Emotions = () => (
  <O3Shell progress={0.4} onBack={() => {}}>
    <O3Question title="What feeling is most often underneath it?" multi kind="grid"
      options={['Loneliness', 'Anxiety or stress', 'Boredom', 'Sadness or low mood', 'Anger or frustration', 'Numbness — feeling nothing', 'Mostly automatic, just habit', 'Genuine desire or arousal']}
      value={['Loneliness', 'Anxiety or stress', 'Boredom']} onSet={() => {}} next={() => {}} />
  </O3Shell>
);
const O3Board_Streaks = o3Board('streaks');
const O3Board_Pause = () => (
  <O3Shell progress={0.58} bar={false}><O3_ReadingPause a={O3_DEMO} live={false} next={() => {}} /></O3Shell>
);
const O3Board_Creating = () => (
  <O3Shell progress={0.6} bar={false} lit><O3_ReadingPause a={O3_DEMO} live={false} phase={1} next={() => {}} /></O3Shell>
);
const O3Board_ReadingRoute = () => (
  <O3Shell progress={0.62} onBack={() => {}} lit calm><O3_Reading a={O3_DEMO} variant="route" next={() => {}} /></O3Shell>
);
const O3Board_ReadingChart = () => (
  <O3Shell progress={0.62} onBack={() => {}} lit calm><O3_Reading a={O3_DEMO} variant="chart" next={() => {}} /></O3Shell>
);
const O3Board_ReadingContents = () => (
  <O3Shell progress={0.62} onBack={() => {}} lit calm><O3_Reading a={O3_DEMO} variant="contents" next={() => {}} /></O3Shell>
);
const O3Board_WaveIntro = () => <O3_Wave live={false} stage="intro" next={() => {}} />;
const O3Board_WaveSurf = () => <O3_Wave live={false} stage="surf" next={() => {}} />;
const O3Board_WaveAfter = () => <O3_Wave live={false} stage="after" next={() => {}} />;
const O3Board_WaveMedal = () => <O3_Wave live={false} stage="medal" next={() => {}} />;
const O3Board_Pledge = o3Board('pledge');
const O3Board_Letter = o3Board('letter');
const O3Board_DayOne = o3Board('dayone');
const O3Board_Notify = o3Board('notify');
const O3Board_Save = o3Board('save');
const O3Board_Paywall = o3Board('paywall');
const O3Board_Landing = o3Board('landing');

// every intake question as its own static page — [key, def, Board]
const O3QBoards = O3_QUESTIONS.map(([key, q], i) => {
  function O3QuestionBoard() {
    const [v, setV] = otState(O3_DEMO[key]);
    return (
      <O3Shell progress={(5 + i) / O3_STEPS.length} onBack={() => {}}>
        <O3Question title={q.title} sub={q.sub} eyebrow={q.eyebrow} kind={q.kind} options={q.options} multi={!!q.multi}
          value={v} onSet={setV} next={() => {}} note={q.note} ctaLabel={q.ctaLabel} skip={q.skip} />
      </O3Shell>
    );
  }
  return [key, q, O3QuestionBoard];
});

Object.assign(window, {
  O3Stamp, O3Medallion, O3_Wave, O3_Pledge, O3_Letter, O3_DayOne, O3_Notify, O3_Save, O3_Paywall, O3_Landing,
  Onboarding3Flow, O3_STEPS,
  O3Board_Threshold, O3Board_Privacy, O3Board_Door, O3Board_Name, O3Board_Triggers, O3Board_Emotions, O3Board_Streaks,
  O3Board_Pause, O3Board_Creating, O3Board_ReadingRoute, O3Board_ReadingChart, O3Board_ReadingContents,
  O3Board_WaveIntro, O3Board_WaveSurf, O3Board_WaveAfter, O3Board_WaveMedal,
  O3Board_Pledge, O3Board_Letter, O3Board_DayOne, O3Board_Notify, O3Board_Save, O3Board_Paywall, O3Board_Landing, O3QBoards,
});
