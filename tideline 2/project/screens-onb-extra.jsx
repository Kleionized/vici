// screens-onb-extra.jsx — extra onboarding formats to bring the VICI
// funnel to full depth: a slider question, age + tried-before single-selects,
// a categorized symptom checklist, vivid colour-coded goals, a rating /
// testimonial screen, a celebration interstitial, a draw-your-signature
// pledge, and a one-time-offer paywall with a live countdown.
// Calm dusk palette throughout. Pairs with screens-onb.jsx + screens-onb-art.jsx.

const { useState: xState, useRef: xRef, useEffect: xEffect, useCallback: xCb } = React;

// ── local layout helpers (mirror onb.jsx internals, kept self-contained) ─
function XBody({ children }) {
  return <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>;
}
function XFoot({ children }) {
  return <div style={{ paddingTop: 16 }}>{children}</div>;
}
function XEyebrow({ children, hue = 200 }) {
  return <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{children}</span>;
}
function XLead({ children, style = {} }) {
  return <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink2)', fontWeight: 500, margin: 0, textWrap: 'pretty', ...style }}>{children}</p>;
}

const XHUE = { quiz: 262, scroll: 262, symptom: 262, goals: 262, rating: 40, celebrate: 262, pledge: 262, offer: 40 };
const XPHASE = { assess: 'Assessment', plan: 'Your plan', commit: 'Commitment' };

// ════════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════════

// ── slider question: drag a thumb across a labelled track; the active
// band label + a short caption update live. A new quiz format. ────────
function SliderQuestion({ value, onChange, bands, hue = 220 }) {
  const ref = xRef(null);
  const dragging = xRef(false);
  const set = xCb((clientX) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  }, [onChange]);
  const down = (e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); };
  const move = (e) => { if (dragging.current) set(e.clientX); };
  const up = (e) => { dragging.current = false; try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {} };
  const idx = Math.round(value * (bands.length - 1));
  const c = tint(hue, 0.62, 0.12);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 34 }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 30, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.05 }}>{bands[idx][0]}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)', marginTop: 8 }}>{bands[idx][1]}</div>
      </div>
      <div ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ position: 'relative', height: 46, display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 10, borderRadius: 9999, background: 'var(--soft2)', boxShadow: 'none' }} />
        <div style={{ position: 'absolute', left: 0, width: `calc(${value} * (100% - 28px) + 28px)`, height: 10, borderRadius: 9999, background: `linear-gradient(90deg, ${tint(hue, 0.55, 0.1)}, ${c})`, boxShadow: 'none' }} />
        <div style={{ position: 'absolute', left: `calc(${value} * (100% - 28px))`, width: 28, height: 34, borderRadius: 12,
          background: 'linear-gradient(180deg, #FFFFFF, #F6F5F1)', boxShadow: `0 1px 2px rgba(25,25,20,0.22), 0 4px 12px rgba(25,25,20,0.18), 0 0 0 5px ${tint(hue, 0.6, 0.12, 0.22)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5 }}>
          <span style={{ width: 1.5, height: 11, borderRadius: 1, background: 'rgba(0,0,0,0.13)' }} />
          <span style={{ width: 1.5, height: 11, borderRadius: 1, background: 'rgba(0,0,0,0.13)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        {bands.map((b, i) => (
          <span key={b[0]} style={{ fontFamily: 'var(--font)', fontSize: 10.5, fontWeight: i === idx ? 500 : 500, color: i === idx ? 'var(--ink)' : 'var(--ink3)', flex: 1, textAlign: i === 0 ? 'left' : i === bands.length - 1 ? 'right' : 'center', transition: 'color .15s' }}>{b[2]}</span>
        ))}
      </div>
    </div>
  );
}

// ── vivid colour-coded goal row: colour icon tile + tinted row + tick ─
function ColoredGoalRow({ label, hue, icon, on, onClick }) {
  return (
    <button onClick={onClick} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 9999,
      background: on ? `linear-gradient(90deg, ${tint(hue, 0.5, 0.14, 0.42)}, ${tint(hue, 0.5, 0.14, 0.14)})` : 'var(--card)',
      boxShadow: on ? `inset 0 0 0 1.6px ${tint(hue, 0.62, 0.13, 0.8)}` : 'none',
    }}>
      <span style={{ width: 38, height: 38, borderRadius: 9999, flexShrink: 0, background: tint(hue, 0.58, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px -8px ${tint(hue, 0.55, 0.15, 0.9)}` }}>
        <span style={{ display: 'inline-flex', width: 21, height: 21 }}>{icon('#fff')}</span>
      </span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font)', fontWeight: on ? 500 : 500, fontSize: 15, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
      <span style={{ width: 24, height: 24, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '2px solid var(--soft2)', background: on ? tint(hue, 0.6, 0.14) : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
      </span>
    </button>
  );
}

// ── draw-your-name signature pad (canvas) — parchment card on the dusk ─
function SignaturePad({ onInk }) {
  const ref = xRef(null);
  const drawing = xRef(false);
  const last = xRef(null);
  const [hasInk, setHasInk] = xState(false);
  xEffect(() => {
    const cv = ref.current; if (!cv) return;
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#20222B';
    ref.current._ctx = ctx;
  }, []);
  const pos = (e) => { const r = ref.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const down = (e) => { drawing.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} last.current = pos(e); };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = ref.current._ctx; const p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.current[0], last.current[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
    last.current = p;
    if (!hasInk) { setHasInk(true); onInk && onInk(true); }
  };
  const up = (e) => { drawing.current = false; try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {} };
  const clear = () => { const cv = ref.current; cv._ctx.clearRect(0, 0, cv.width, cv.height); setHasInk(false); onInk && onInk(false); };
  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: 196, borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, #F5F3EC, #E9E7DD)', boxShadow: 'none' }}>
        <canvas ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }} />
        {!hasInk ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" style={{ opacity: 0.3 }}><path d="M3.8 20.2 4.9 16 14.9 6l3.1 3.1L8 19.1zM16.3 4.6l1.6-1.6a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3l-1.6 1.6z" fill="#20222B" /></svg>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'rgba(32,34,43,0.42)', marginTop: 8 }}>Sign with your finger</span>
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 34, height: 1, background: 'rgba(32,34,43,0.18)' }} />
        <span style={{ position: 'absolute', left: 20, bottom: 16, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(32,34,43,0.3)' }}>×  sign here</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button onClick={clear} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink3)', padding: 4 }}>Clear</button>
      </div>
    </div>
  );
}

// ── live mm:ss countdown ──────────────────────────────────────────────
function Countdown({ from = 300, live = true }) {
  const [s, setS] = xState(from);
  xEffect(() => {
    if (!live) return;
    const id = setInterval(() => setS((v) => (v <= 0 ? 0 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [live]);
  const m = Math.floor(s / 60), ss = String(s % 60).padStart(2, '0');
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{m}:{ss}</span>;
}

// ════════════════════════════════════════════════════════════════════
// SCREENS
// ════════════════════════════════════════════════════════════════════

// ── AGE (single-select) ──────────────────────────────────────────────
const AGES = [['Under 18', null], ['18–24', 'The most common age here'], ['25–34', null], ['35–44', null], ['45 or older', null]];
function OnbAge({ value, onPick, onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.quiz} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>How old are you?</Ask>
        <XLead style={{ marginTop: 10 }}>It helps us set the right pace.</XLead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26, overflow: 'auto', paddingBottom: 4 }}>
          {AGES.map(([label, sub]) => (
            <OptionRow key={label} label={label} sub={sub} single hue={XHUE.quiz} selected={value === label} onClick={() => onPick(label)} />
          ))}
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" enabled={!!value} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── HOW OFTEN (slider) ───────────────────────────────────────────────
const FREQ_BANDS = [
  ['Now and then', 'Occasional, but real', 'Rarely'],
  ['A few times a week', 'It comes and goes', 'Weekly'],
  ['Most days', 'A familiar daily pull', 'Daily'],
  ['Several times a day', 'It interrupts the day', 'Often'],
  ['I’ve lost count', 'It runs the show right now', 'Constant'],
];
function OnbFreqSlider({ value, onChange, onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.quiz} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>How often lately?</Ask>
        <XLead style={{ marginTop: 10 }}>Drag to the honest answer — no judgment.</XLead>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <SliderQuestion value={value} onChange={onChange} bands={FREQ_BANDS} hue={XHUE.quiz} />
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── TRIED BEFORE (single-select) ─────────────────────────────────────
const TRIED = [
  ['This is my first real try', 'A brave place to start'],
  ['I’ve tried once or twice', 'You know it’s hard — that’s useful'],
  ['Many times', 'It keeps pulling you back. We’ll change that'],
];
function OnbTriedBefore({ value, onPick, onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.quiz} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>Have you tried to quit before?</Ask>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28, overflow: 'auto', paddingBottom: 4 }}>
          {TRIED.map(([label, sub]) => (
            <OptionRow key={label} label={label} sub={sub} single hue={XHUE.quiz} selected={value === label} onClick={() => onPick(label)} />
          ))}
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" enabled={!!value} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── SYMPTOMS (categorized multi-select, with a highlight banner) ─────
const SYMPTOM_GROUPS = [
  ['Body', ['Low energy', 'Broken sleep', 'Restless & wired', 'Numb, flat feeling']],
  ['Mind', ['Brain fog', 'Hard to focus', 'Low motivation', 'Anxiety', 'Shame afterwards']],
  ['Life', ['Pulling away from people', 'Lost hours', 'Less drawn to real intimacy', 'Hiding it']],
];
function OnbSymptoms({ selected, onToggle, onNext, onBack, barI, n }) {
  const Chip = ({ label, on, onClick }) => (
    <button onClick={onClick} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none', fontFamily: 'var(--font)',
      fontWeight: on ? 500 : 500, fontSize: 14.5, letterSpacing: 'normal',
      padding: '11px 17px', borderRadius: 9999,
      background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)', color: on ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: on ? 'none' : 'none',
    }}>{label}</button>
  );
  return (
    <Stage hue={XHUE.symptom} intensity={0.6} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.symptom} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>Where has it left a mark?</Ask>
        <XLead style={{ marginTop: 10 }}>Naming the quiet marks is the first thing that makes them fade.</XLead>
        <div style={{ marginTop: 6, overflow: 'auto', paddingBottom: 4 }}>
          {SYMPTOM_GROUPS.map(([cat, items]) => (
            <div key={cat} style={{ marginTop: 28 }}>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 13 }}>{cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {items.map((label) => (
                  <Chip key={label} label={label} on={selected.includes(label)} onClick={() => onToggle(label)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </XBody>
      <XFoot><NextPill label={selected.length ? `Continue · ${selected.length}` : 'Continue'} enabled={selected.length > 0} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── GOALS (vivid colour-coded rows) ──────────────────────────────────
const GOALS_C = [
  ['Clear focus', 262, (c) => Glyph.spark(c)],
  ['Steady energy', 52, (c) => Glyph.sun(c)],
  ['Real confidence', 304, (c) => Glyph.shield(c)],
  ['A calmer mood', 152, (c) => Glyph.heart(c)],
  ['Deeper relationships', 16, (c) => Glyph.user(c)],
  ['Better sleep', 275, (c) => Glyph.moon(c)],
  ['Self-respect', 256, (c) => Glyph.anchor(c)],
  ['To feel free', 96, (c) => Glyph.leaf(c)],
];
function OnbGoalsColored({ selected, onToggle, onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.goals} intensity={0.55} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.goals} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>What do you want back?</Ask>
        <XLead style={{ marginTop: 10 }}>Pick the wins you’ll track along the way.</XLead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24, overflow: 'auto', paddingBottom: 4 }}>
          {GOALS_C.map(([label, hue, icon]) => (
            <ColoredGoalRow key={label} label={label} hue={hue} icon={icon} on={selected.includes(label)} onClick={() => onToggle(label)} />
          ))}
        </div>
      </XBody>
      <XFoot><NextPill label="Track these goals" enabled={selected.length > 0} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── RATING / TESTIMONIALS ("built for people like you") ──────────────
function LaurelStars() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <svg width="34" height="52" viewBox="0 0 34 52" fill="none" style={{ opacity: 0.9 }}><path d="M30 6C16 8 8 20 9 34c0 5 2 9 4 12" stroke={tint(XHUE.rating, 0.62, 0.09)} strokeWidth="3" strokeLinecap="round" /><path d="M26 16c-7 1-11 6-12 12M24 28c-6 0-9 3-10 8" stroke={tint(XHUE.rating, 0.62, 0.09)} strokeWidth="2.4" strokeLinecap="round" /></svg>
      <MiniStars n={5} size={30} color={tint(XHUE.rating, 0.66, 0.14)} />
      <svg width="34" height="52" viewBox="0 0 34 52" fill="none" style={{ opacity: 0.9, transform: 'scaleX(-1)' }}><path d="M30 6C16 8 8 20 9 34c0 5 2 9 4 12" stroke={tint(XHUE.rating, 0.62, 0.09)} strokeWidth="3" strokeLinecap="round" /><path d="M26 16c-7 1-11 6-12 12M24 28c-6 0-9 3-10 8" stroke={tint(XHUE.rating, 0.62, 0.09)} strokeWidth="2.4" strokeLinecap="round" /></svg>
    </div>
  );
}
function OnbRating({ onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.rating} intensity={0.75} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.plan} hue={XHUE.rating} onBack={onBack} onClose={onBack} />
      <XBody>
        <div style={{ overflow: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, marginBottom: 26 }}><LaurelStars /></div>
          <Hero size={31} style={{ textAlign: 'center' }}>Built for people like you.</Hero>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)', textAlign: 'center', margin: '14px 0 0' }}>4.8 · from 12,000 reviews</p>
          {/* one voice, centered, no box */}
          <div style={{ margin: '50px 6px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 42, lineHeight: 0.6, color: 'var(--ink4)' }}>“</div>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 19, lineHeight: 1.5, color: 'var(--ink)', margin: '12px auto 0', maxWidth: 310, letterSpacing: '-0.005em', textWrap: 'pretty' }}>
              No guilt, no streak alarms. The urge tool got me through the first week — clearest I’ve been in years.
            </p>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', marginTop: 16 }}>Tom · six months in</div>
          </div>
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── CELEBRATION interstitial ─────────────────────────────────────────
function OnbCelebrate({ name = '', onNext }) {
  const celeb = (window.CURRENT_ONB && window.CURRENT_ONB.celebrate) || 'medium';
  return (
    <Stage hue={XHUE.celebrate} intensity={1} pad={26} top={74}>
      <Particles mode={celeb === 'calm' ? 'medium' : celeb} />
      <button onClick={onNext} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 0 }}>
        <div className="onb-rise" style={{ marginBottom: 22 }}><TideScene hue={XHUE.celebrate} w={230} h={146} /></div>
        <Hero size={34} style={{ textAlign: 'center', maxWidth: 320 }}>{name ? `Nice work, ${name}.` : 'Nice work.'}</Hero>
        <XLead style={{ marginTop: 14, fontSize: 17, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Your answers are in. You’re off to a real start — let’s look at what they say.</XLead>
        <span style={{ marginTop: 40, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink3)' }} className="onb-twinkle">Tap to continue</span>
      </button>
    </Stage>
  );
}

// ── SIGN YOUR COMMITMENT (draw signature) ────────────────────────────
function OnbSignPledge({ name = '', why = '', onNext, onBack, barI, n }) {
  const [inked, setInked] = xState(false);
  return (
    <Stage hue={XHUE.pledge} intensity={0.85} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.commit} hue={XHUE.pledge} onBack={onBack} onClose={onBack} />
      <XBody>
        <div style={{ overflow: 'auto', paddingBottom: 4 }}>
          <XEyebrow hue={XHUE.pledge}>Commitment</XEyebrow>
          <Hero size={31} style={{ marginTop: 14 }}>Sign your commitment.</Hero>
          <XLead style={{ marginTop: 12, fontSize: 15.5 }}>
            Not a contract — a line you draw for yourself.{why ? <span style={{ color: 'var(--ink)' }}> {why.trim().replace(/\.$/, '')}.</span> : ' Today is day zero.'}
          </XLead>
          <div style={{ marginTop: 20 }}><SignaturePad onInk={setInked} /></div>
          <div style={{ marginTop: 6, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', textAlign: 'center' }}>
            {name ? `${name} · Day 0` : 'Day 0'}
          </div>
        </div>
      </XBody>
      <XFoot><NextPill label="Seal it" enabled={inked} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── ONE-TIME OFFER — a quiet editorial page: a dawn mark, one monument
// number, a soft countdown, a single hairlined price line. No tiles. ─
function OnbOneTimeOffer({ live = true, onClaim, onClose }) {
  const SC = window.SceneKit.SC;
  return (
    <Stage hue={XHUE.offer} intensity={0.9} pad={26} top={74}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 10 }}>
          <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink3)" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {/* dawn — a gentler start */}
        <svg width="64" height="42" viewBox="0 0 64 42" fill="none" style={{ display: 'block', marginBottom: 20 }}>
          <circle cx="32" cy="27" r="11" fill={SC.sun} stroke={SC.sunEdge} strokeWidth="1.5" />
          <path d="M5 27 H59" stroke={SC.waterLo} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M32 7 v5 M15 12 l3 3 M49 12 l-3 3" stroke={SC.fgShade} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <XEyebrow hue={XHUE.offer}>One-time offer</XEyebrow>
        <Hero size={33} style={{ marginTop: 14, textAlign: 'center' }}>A gentler price to begin.</Hero>
        <XLead style={{ marginTop: 12, maxWidth: 290, marginLeft: 'auto', marginRight: 'auto' }}>For finishing your plan — half off your first year.</XLead>
        {/* the number, monumental and unboxed */}
        <div style={{ marginTop: 38, lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 92, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            50<span style={{ fontSize: 46, letterSpacing: '-0.01em' }}>%</span>
          </span>
        </div>
        <div style={{ marginTop: 12, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Off your first year</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 34 }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Holds for</span>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 29, letterSpacing: '-0.01em', color: 'var(--ink)' }}><Countdown from={300} live={live} /></span>
        </div>
      </div>
      <div>
        {/* one price, hairlines instead of a box */}
        <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '16px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal', color: 'var(--ink)' }}>Yearly · the lowest we offer</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', marginTop: 3 }}><span style={{ textDecoration: 'line-through' }}>$39.99</span>{'  '}$19.99 for 12 months</div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em', color: 'var(--ink)', flexShrink: 0 }}>$1.67<span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink3)' }}>/mo</span></div>
        </div>
        <NextPill label="Claim my offer" onClick={onClaim} arrow={false} />
        <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink3)' }}>Cancel anytime · <span style={{ textDecoration: 'underline' }}>Restore purchase</span></div>
      </div>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════
// STREAKS → PROGRESS  (the core hook)
// ════════════════════════════════════════════════════════════════════

// ── streak-vs-progress chart: the day-counter sawtooths to zero on every
// slip; real progress keeps compounding through the dips. ────────────
function StreakVsProgressChart() {
  const W = 320, H = 188, x0 = 12, x1 = 308, yBot = 150;
  // streak: climbs, resets to baseline at each slip (sawtooth)
  const streak = `M${x0} ${yBot} L104 62 L104 ${yBot} L196 54 L196 ${yBot} L266 96 L266 ${yBot} L308 128`;
  // progress: compounds upward, only a small plateau at each slip
  const prog = `M${x0} 146 C 70 132, 92 118, 118 110 C 150 100, 170 100, 196 92 C 240 80, 270 52, ${x1} 34`;
  const progArea = `${prog} L ${x1} ${yBot} L ${x0} ${yBot} Z`;
  const slips = [104, 196, 266];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="var(--line)" strokeWidth="1" />
      {/* slip markers */}
      {slips.map((x, k) => (
        <g key={k}>
          <line x1={x} y1="20" x2={x} y2={yBot} stroke="var(--danger)" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 5" />
          <text x={x} y="14" textAnchor="middle" fill="var(--danger)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5, opacity: 0.7 }}>slip</text>
        </g>
      ))}
      {/* streak sawtooth */}
      <path d={streak} stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" strokeDasharray="4 4" />
      {/* progress line + area */}
      <path d={progArea} fill="color-mix(in oklab, var(--ink) 7%, transparent)" />
      <path d={prog} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={x1} cy="34" r="5.5" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.8" />
    </svg>
  );
}

function ChartLegend() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 4 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)' }}>
        <span style={{ width: 18, height: 0, borderTop: '2.4px dashed var(--danger)', opacity: 0.85 }} />Streak counter
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink)' }}>
        <span style={{ width: 18, height: 3, borderRadius: 2, background: 'var(--ink)' }} />Real progress
      </span>
    </div>
  );
}

// ── STREAK QUESTION (single-select, validates the frustration) ───────
const STREAKS = [
  ['Yes — it reset and I gave up', 'One slip wiped the whole count'],
  ['I chased the number, not the change', 'The streak became the point'],
  ['It worked for a while, then broke', null],
  ['I’ve never used a streak counter', null],
];
function OnbStreak({ value, onPick, onNext, onBack, barI, n }) {
  return (
    <Stage hue={XHUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={n} phase={XPHASE.assess} hue={XHUE.quiz} onBack={onBack} onClose={onBack} />
      <XBody>
        <Ask size={29}>Have streak counters let you down?</Ask>
        <XLead style={{ marginTop: 10 }}>The day-since apps — did they hold up?</XLead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 24, overflow: 'auto', paddingBottom: 4 }}>
          {STREAKS.map(([label, sub]) => (
            <OptionRow key={label} label={label} sub={sub} single hue={XHUE.quiz} selected={value === label} onClick={() => onPick(label)} />
          ))}
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" enabled={!!value} onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ── STREAK INSIGHT (reactive education: progress, not streaks) ───────
function OnbStreakInsight({ failed = true, onNext, onBack }) {
  return (
    <Stage hue={XHUE.quiz} intensity={0.7} pad={26} top={74}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', borderRadius: 10 }}>
          <svg width="13" height="22" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke="var(--ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <XBody>
        <div style={{ overflow: 'auto', paddingBottom: 4 }}>
          <XEyebrow hue={XHUE.quiz}>Why this is different</XEyebrow>
          <Hero size={31} style={{ marginTop: 14 }}>Progress that doesn’t reset.</Hero>
          <XLead style={{ marginTop: 12, fontSize: 15.5 }}>
            {failed ? <span style={{ color: 'var(--ink)' }}>That wasn’t weak willpower. </span> : null}
            A streak is one number that only counts down. Miss once and it says zero — as if the work never happened.
          </XLead>
          <div style={{ margin: '34px 2px 0' }}>
            <StreakVsProgressChart />
            <ChartLegend />
          </div>
          <XLead style={{ marginTop: 20, fontSize: 15.5 }}>
            VICI measures what actually changes — urges you ride out, triggers you learn, the days you show up. <span style={{ color: 'var(--ink)' }}>A slip is data, not a reset.</span>
          </XLead>
        </div>
      </XBody>
      <XFoot><NextPill label="Continue" onClick={onNext} /></XFoot>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════
// STATIC BOARDS (for the canvas)
// ════════════════════════════════════════════════════════════════════
function OnbAgeScreen() { const [v, setV] = xState('18–24'); return <OnbAge value={v} onPick={setV} onNext={() => {}} onBack={() => {}} barI={2} n={16} />; }
function OnbFreqSliderScreen() { const [v, setV] = xState(0.62); return <OnbFreqSlider value={v} onChange={setV} onNext={() => {}} onBack={() => {}} barI={3} n={16} />; }
function OnbTriedScreen() { const [v, setV] = xState('Many times'); return <OnbTriedBefore value={v} onPick={setV} onNext={() => {}} onBack={() => {}} barI={5} n={17} />; }
function OnbStreakScreen() { const [v, setV] = xState('Yes — it reset and I gave up'); return <OnbStreak value={v} onPick={setV} onNext={() => {}} onBack={() => {}} barI={6} n={17} />; }
const OnbStreakInsightScreen = () => <OnbStreakInsight failed onNext={() => {}} onBack={() => {}} />;
function OnbSymptomsScreen() {
  const [sel, setSel] = xState(['Brain fog', 'Low motivation', 'Broken sleep', 'Pulling away from people']);
  const t = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <OnbSymptoms selected={sel} onToggle={t} onNext={() => {}} onBack={() => {}} barI={7} n={16} />;
}
function OnbGoalsColoredScreen() {
  const [sel, setSel] = xState(['Clear focus', 'Real confidence', 'Better sleep']);
  const t = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <OnbGoalsColored selected={sel} onToggle={t} onNext={() => {}} onBack={() => {}} barI={9} n={16} />;
}
const OnbRatingScreen = () => <OnbRating onNext={() => {}} onBack={() => {}} barI={13} n={16} />;
const OnbCelebrateScreen = () => <OnbCelebrate name="Sam" onNext={() => {}} />;
const OnbSignPledgeScreen = () => <OnbSignPledge name="Sam" why="I want to be present for the people I love." onNext={() => {}} onBack={() => {}} barI={15} n={16} />;
const OnbOneTimeOfferScreen = () => <OnbOneTimeOffer live={false} onClaim={() => {}} onClose={() => {}} />;

Object.assign(window, {
  SliderQuestion, ColoredGoalRow, SignaturePad, Countdown, StreakVsProgressChart, ChartLegend,
  OnbAge, OnbFreqSlider, OnbTriedBefore, OnbStreak, OnbStreakInsight, OnbSymptoms, OnbGoalsColored, OnbRating, OnbCelebrate, OnbSignPledge, OnbOneTimeOffer,
  OnbAgeScreen, OnbFreqSliderScreen, OnbTriedScreen, OnbStreakScreen, OnbStreakInsightScreen, OnbSymptomsScreen, OnbGoalsColoredScreen,
  OnbRatingScreen, OnbCelebrateScreen, OnbSignPledgeScreen, OnbOneTimeOfferScreen,
  AGES, FREQ_BANDS, TRIED, STREAKS, SYMPTOM_GROUPS, GOALS_C,
});
