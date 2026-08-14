// screens-urge.jsx — Urge surfing + Relapse for VICI.
//
// Light, airy "calm beach" treatment: a warm cream page, the full-colour
// wave illustration floating at the top, a segmented progress bar with a
// settings glyph + close, a bold slate title, a quiet 3-line subline and
// a solid slate action.
//
//   Surf series: where are you → how strong → (tailored advice steps)
//   …then an immersive breathing screen → you rode it out.
//   The path adapts: a flicker skips the escape step; “about to give in”
//   goes straight to action.
//   Relapse series (3): you slipped → don't fail twice → begin again.
//
// Exports: UrgeScreen, UrgeRelapseScreen (live flows) + every page as a
// standalone screen for the canvas.

const { useState: uState, useEffect: uEffect, useRef: uRef } = React;

// ── palette (matches the device mockup) ─────────────────────────────
const CREAM    = 'var(--bg)';     // (icon cut-outs) paper page
const CCEL     = 'var(--bg)';
const SLATE    = 'var(--ink)';    // title / icons
const SUBINK   = 'var(--ink2)';   // muted subline
const BTN       = 'var(--warm)';  // primary action
const BTN_HI    = 'var(--warm2)';
const PROG_ON  = 'var(--fill)';
const PROG_OFF = 'var(--soft2)';
const LINK     = 'var(--ink2)';
const WAVE     = 'celestial';             // wave motif flag
const INK_DARK = '#131313'; // the immersive breathing screen — night water: black ground, white/grey waves
const FONT     = "var(--font)";

// ── glyphs ──────────────────────────────────────────────────────────
const SlidersIcon = ({ c = SLATE }) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round">
    <path d="M4 7h9M19 7h1M4 12h1M11 12h9M4 17h6M16 17h4" />
    <circle cx="15.5" cy="7" r="2.1" fill={CREAM} /><circle cx="7" cy="12" r="2.1" fill={CREAM} /><circle cx="12.5" cy="17" r="2.1" fill={CREAM} />
  </svg>
);
const CloseIcon = ({ c = SLATE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2.1" strokeLinecap="round" /></svg>
);
const BackIcon = ({ c = SLATE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const PeopleIcon = () => null;

// ── top bar: settings / back · segmented progress · close ───────────
function TopBar({ total, index, onBack, onClose, first = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '60px 29px 0', gap: 12 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', flex: '0 0 auto' }}>
        {first ? <SlidersIcon /> : <BackIcon />}
      </button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: 36, height: 4, borderRadius: 9999, background: i <= index ? PROG_ON : PROG_OFF, transition: 'background .3s' }} />
          ))}
        </div>
      </div>
      <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex', flex: '0 0 auto' }}>
        <CloseIcon />
      </button>
    </div>
  );
}

// ── the solid slate action ──────────────────────────────────────────
function SlateButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} className="tl-press"
      style={{
        appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
        background: 'var(--fill)', color: 'var(--on-fill)',
        fontFamily: 'var(--font)', fontWeight: 600,
        fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em',
        boxShadow: 'none',
        ...style,
      }}>{children}</button>
  );
}

// ── support link ────────────────────────────────────────────────────
function SupportLink() { return null; }

// ── the floating illustration — faceted paper vignettes, one scene per
// idea (scenes-core.jsx). The surf series walks the wave's whole life:
// rising → passing → remove (the path off the beach) → name (the
// pennant) → calm; the relapse series keeps slip → twice → begin.
const ID_STAGE = { 'relapse-slip': 'slip', 'relapse-twice': 'twice', 'relapse-begin': 'begin' };
function Illustration({ id, placeholder, art, w = 360 }) {
  const W = Math.min(w, 320);
  const stage = art ? (art === 'celestial' ? 'rising' : art) : ID_STAGE[id];
  if (stage) return (
    <div className="ci-breathe" style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={W} height="180" viewBox="0 0 320 180" fill="none" style={{ display: 'block', overflow: 'visible' }}>
        <UrgeVignette stage={stage} />
      </svg>
    </div>
  );
  return <PhotoSlot id={id} placeholder={placeholder} height={210} radius={26} scrim={false} style={{ width: 240 }} />;
}

// ── the calm page template (one idea) ───────────────────────────────
function JourneyPage({ total, index, first = false, onBack = () => {}, onClose = () => {}, label, headline, sub, slotId, slotHint, slotArt, onNext = () => {}, nextLabel = 'Continue' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: CCEL, fontFamily: FONT, color: SLATE, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <TopBar total={total} index={index} first={first} onBack={onBack} onClose={onClose} />

      <div style={{ flex: 1 }} />

      {/* the single illustration — gets the room to breathe */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 18px' }}>
        <Illustration id={slotId} placeholder={slotHint} art={slotArt} />
      </div>

      {/* one headline, one quiet line, sitting in the middle */}
      <div style={{ padding: '32px 29px 0', textAlign: 'center' }}>
        {label ? <div style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 12 }}>{label}</div> : null}
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: '0.01em', margin: 0, color: SLATE, textWrap: 'balance' }}>{headline}</h2>
        {sub ? <p style={{ fontSize: 13.5, lineHeight: 1.5, fontWeight: 400, color: SUBINK, margin: '14px 0 0', textWrap: 'pretty' }}>{sub}</p> : null}
      </div>

      <div style={{ flex: 1.15 }} />

      {/* one action, anchored at the foot */}
      <div style={{ padding: '0 29px 30px', textAlign: 'center' }}>
        <SlateButton onClick={onNext}>{nextLabel}</SlateButton>
      </div>
    </div>
  );
}

// THE TWO ASKS — where are you · how strong is it. Same fast selection
// grammar as the urge log: white cells, a round chip that fills ink
// when picked, one tap → Continue.
const PlaceGlyph = {
  bed: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-8.5M3 13h18v5" /><path d="M3 13V7.5h7c2.5 0 4 1.4 4 3.5v2" /><circle cx="6.8" cy="10.2" r="1.3" /></svg>,
  bathroom: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20c-1.8-1.2-3-3.2-3-5.5h16c0 2.3-1.2 4.3-3 5.5M6 20l-.8 1.6M18 20l.8 1.6" /><path d="M6 14.5V6a2.2 2.2 0 014.4 0" /><path d="M13 7.5l1-1.4M15.6 9l1.4-1M14 11h1.8" /></svg>,
  desk: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="10" rx="1.6" /><path d="M9.5 19h5M12 15v4" /></svg>,
  couch: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11V8.5A2.5 2.5 0 017.5 6h9A2.5 2.5 0 0119 8.5V11" /><path d="M3.5 13.5a2 2 0 012-2c1.1 0 2 .9 2 2V14h9v-.5a2 2 0 114 0V17a1.5 1.5 0 01-1.5 1.5h-14A1.5 1.5 0 013.5 17z" /><path d="M5.5 18.5V20M18.5 18.5V20" /></svg>,
  outside: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17.5" cy="6.5" r="2.5" /><path d="M9 8.5L4.5 21M9 8.5c2.4 0 4.2 1.2 5.2 3.4M9 8.5C7 8.5 5.4 9.6 4.5 11.4" /><path d="M12 21c.4-3.2 1.6-5.8 3.6-7.8M19.5 21H3" /></svg>,
  elsewhere: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6.5-5.4-6.5-10.2A6.3 6.3 0 0112 4.5a6.3 6.3 0 016.5 6.3C18.5 15.6 12 21 12 21z" /><circle cx="12" cy="10.8" r="2.2" /></svg>,
};

const PLACES = [
  ['bed', 'In bed'],
  ['couch', 'On the couch'],
  ['bathroom', 'In the bathroom'],
  ['desk', 'At my desk'],
  ['outside', 'Outside'],
  ['elsewhere', 'Somewhere else'],
];

// tailored escape advice per place — the “remove yourself” step, made
// specific to where the urge found you
const PLACE_MOVE = {
  bed: { headline: 'Get out of bed', sub: 'Feet on the floor, lights on. The urge lives in the warm dark — stand up and walk to another room.', cta: "I'm up" },
  couch: { headline: 'Stand up off the couch', sub: 'Put the phone on the far side of the room and walk to the kitchen. Change what your hands are holding.', cta: "I'm up" },
  bathroom: { headline: 'Step out of the bathroom', sub: 'Cold water on your face, door open, out. Don\u2019t linger where it\u2019s easiest to hide.', cta: "I've stepped out" },
  desk: { headline: 'Push back from the desk', sub: 'Close the tabs, stand, and walk to a window. The work will keep for five minutes — the scene won\u2019t.', cta: "I've moved" },
  outside: { headline: 'Keep moving', sub: 'Pick a point ahead and walk to it. New street, new input — don\u2019t stop where the pull started.', cta: "I'm moving" },
  elsewhere: { headline: 'Change the room you\u2019re in', sub: 'Any room will do. The urge is attached to the scene — break the scene.', cta: "I've moved" },
};

const STRENGTHS = [
  ['A flicker', 'Noticeable, but quiet', 0.3],
  ['Pulling hard', 'It has my full attention', 0.62],
  ['About to give in', 'I need the fastest way out', 0.95],
];

// small wave mark whose crest grows with the pull
const StrengthMark = ({ t, c }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M3 ${17 - t * 2} C 6 ${17 - t * 12} 9 ${17 - t * 12} 12 ${17 - t * 4} S 18 ${17 + t * 1} 21 ${16 - t * 3}`} />
    <path d="M3 20h18" opacity="0.45" />
  </svg>
);

function UrgeHeading({ children, sub }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 28, lineHeight: 1.14, letterSpacing: '0.01em', margin: 0, color: SLATE, textWrap: 'balance' }}>{children}</h2>
      {sub ? <p style={{ fontSize: 13.5, lineHeight: 1.45, fontWeight: 400, color: SUBINK, margin: '10px 14px 0', textWrap: 'pretty' }}>{sub}</p> : null}
    </div>
  );
}

// ask 1 · where are you?
function UrgeAskWhere({ total = 6, index = 0, value = null, onPick = () => {}, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  const [sel, setSel] = uState(value);
  const pick = (k) => { setSel(k); onPick(k); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: CCEL, fontFamily: FONT, color: SLATE, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <TopBar total={total} index={index} first onBack={onBack} onClose={onClose} />
      <div style={{ padding: '26px 29px 0' }}>
        <UrgeHeading sub="So the way out starts from where you're standing.">Where are you right now?</UrgeHeading>
      </div>
      <div style={{ flex: 1, padding: '26px 29px 0', minHeight: 0, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
          {PLACES.map(([k, label]) => {
            const on = sel === k;
            return (
              <button key={k} onClick={() => pick(k)} className="tl-press-soft" style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                background: 'var(--card)', borderRadius: 18, padding: '18px 8px 15px',
                boxShadow: on ? 'inset 0 0 0 1.8px var(--ink)' : 'none',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--fill)' : 'var(--soft)', transition: 'background .15s' }}>
                  {PlaceGlyph[k](on ? 'var(--on-fill)' : 'var(--ink)')}
                </div>
                <span style={{ fontFamily: FONT, fontWeight: on ? 600 : 500, fontSize: 13.5, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '20px 29px 30px' }}>
        <SlateButton onClick={sel ? onNext : undefined} style={{ opacity: sel ? 1 : 0.34, cursor: sel ? 'pointer' : 'default' }}>Continue</SlateButton>
      </div>
    </div>
  );
}

// ask 2 · how strong is it?
function UrgeAskStrength({ total = 6, index = 1, value = null, onPick = () => {}, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  const [sel, setSel] = uState(value);
  const pick = (i) => { setSel(i); onPick(i); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: CCEL, fontFamily: FONT, color: SLATE, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <TopBar total={total} index={index} onBack={onBack} onClose={onClose} />
      <div style={{ padding: '26px 29px 0' }}>
        <UrgeHeading sub="Honest answer — it decides how fast we move.">How strong is the urge?</UrgeHeading>
      </div>
      <div style={{ flex: 1, padding: '24px 29px 0', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10 }}>
        {STRENGTHS.map(([label, note, t], i) => {
          const on = sel === i;
          return (
            <button key={label} onClick={() => pick(i)} className="tl-press-soft" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--card)', borderRadius: 18, padding: '15px 16px',
              boxShadow: on ? 'inset 0 0 0 1.8px var(--ink)' : 'none',
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 9999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--fill)' : 'var(--soft)', transition: 'background .15s' }}>
                <StrengthMark t={t} c={on ? 'var(--on-fill)' : 'var(--ink)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontWeight: on ? 600 : 500, fontSize: 15, color: 'var(--ink)' }}>{label}</div>
                <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>{note}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '20px 29px 30px' }}>
        <SlateButton onClick={sel != null ? onNext : undefined} style={{ opacity: sel != null ? 1 : 0.34, cursor: sel != null ? 'pointer' : 'default' }}>
          {sel === 2 ? 'Get me out of it' : 'Continue'}
        </SlateButton>
      </div>
    </div>
  );
}

// ════════ SURF SERIES (4) + BREATHE + DONE ═══════════════════════════
function UrgePageWave({ total = 6, index = 2, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  return <JourneyPage total={total} index={index} onBack={onBack} onClose={onClose}
    headline="The urge is a wave"
    sub={<>It rises, peaks, and passes.<br />You don't have to obey it.<br />Stay with it for a moment.</>}
    slotArt="rising" onNext={onNext} nextLabel="I'm ready" />;
}

function UrgePagePass({ total = 6, index = 2, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  return <JourneyPage total={total} index={index} onBack={onBack} onClose={onClose}
    headline="It always passes"
    sub={<>Usually within minutes — often less.<br />You don't have to fight it.</>}
    slotArt="passing" onNext={onNext} />;
}

// the escape step — advice tailored to where the urge found you
function UrgeStepRemove({ total = 6, index = 3, place = 'elsewhere', urgent = false, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  const m = PLACE_MOVE[place] || PLACE_MOVE.elsewhere;
  return <JourneyPage total={total} index={index} onBack={onBack} onClose={onClose}
    label={urgent ? 'Right now · step one' : 'Step one'}
    headline={m.headline}
    sub={m.sub}
    slotArt="remove" onNext={onNext} nextLabel={m.cta} />;
}

function UrgeStepName({ total = 6, index = 4, onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  return <JourneyPage total={total} index={index} onBack={onBack} onClose={onClose}
    label="Step two"
    headline="Name the urge out loud"
    sub={'Say it plainly: \u201cI\u2019m having the urge to ___.\u201d Named, it shrinks.'}
    slotArt="name" onNext={onNext} nextLabel="I named it" />;
}

// ── the polished water canvas (immersive breathing step) ─────────────
// A self-contained, GPU-light sea in the paper palette: parallax swell
// layers (waterHi → waterDeep) traced with foam hairlines, drifting
// foam flecks, gulls, a soft sun — and a breathing guide dot that rises
// on the inhale and settles on the exhale. swell = sin(progress·π):
// the water rises to a peak then recedes — the urge cresting and passing.
function UrgeWaveCanvas({ progressRef }) {
  const canvasRef = uRef(null);
  uEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0, mounted = true;
    let CW = 0, CH = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.2);
      CW = r.width; CH = r.height;
      canvas.width = Math.round(CW * dpr);
      canvas.height = Math.round(CH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ease = (x) => x * x * (3 - 2 * x);
    const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

    const surfaceY = (u, yBase, amp, freq, speed, t, ph) => yBase
      + Math.sin(u * 6.2832 * freq - t * speed + ph) * amp
      + Math.sin(u * 6.2832 * freq * 0.5 - t * speed * 0.6 + ph * 1.3) * amp * 0.3
      + Math.sin(u * 6.2832 * freq * 2.1 - t * speed * 1.4 + ph * 2.1) * amp * 0.12;

    const buildPts = (yBase, amp, freq, speed, t, ph) => {
      const steps = 60, pts = [];
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        pts.push([u * CW, surfaceY(u, yBase, amp, freq, speed, t, ph)]);
      }
      return pts;
    };

    const fillSurface = (pts, top, bot) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.lineTo(CW, CH); ctx.lineTo(0, CH); ctx.closePath();
      const g = ctx.createLinearGradient(0, pts[0][1] - 30, 0, CH);
      g.addColorStop(0, top); g.addColorStop(1, bot);
      ctx.fillStyle = g; ctx.fill();
    };

    const strokeSurface = (pts, color, w, dy = 0) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1] + dy);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1] + dy);
      ctx.strokeStyle = color; ctx.lineWidth = w;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    };

    // night-water inks — white/grey on the black ground
    const FOAM = '250,249,245';
    const gull = (gx, gy, s, o) => {
      ctx.strokeStyle = `rgba(245,244,241,${o})`;
      ctx.lineWidth = 1.4 * s; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gx - 7 * s, gy);
      ctx.quadraticCurveTo(gx - 2.4 * s, gy - 4.6 * s, gx, gy);
      ctx.quadraticCurveTo(gx + 2.4 * s, gy - 4.6 * s, gx + 7 * s, gy);
      ctx.stroke();
    };
    const FLECKS = [[0.08, 6, 1.5, 0.5], [0.2, 13, 1, 0.35], [0.34, 8, 1.6, 0.55], [0.52, 15, 0.9, 0.3], [0.68, 7, 1.3, 0.45], [0.84, 12, 1, 0.35], [0.94, 6, 1.4, 0.5]];

    const start = performance.now();
    const draw = (now) => {
      if (!mounted) return;
      if (!CW || !CH) { resize(); raf = requestAnimationFrame(draw); return; }
      const t = (now - start) / 1000;
      const p = clamp01(progressRef.current);
      const swell = Math.sin(p * Math.PI);
      const lift = ease(swell);

      const BREATH = 10;
      const bp = (t % BREATH) / BREATH;
      const inhale = 0.4;
      const breath = bp < inhale ? ease(bp / inhale) : 1 - ease((bp - inhale) / (1 - inhale));

      ctx.clearRect(0, 0, CW, CH);

      // gulls drifting between the words and the water
      gull(CW * 0.24 + Math.sin(t * 0.35) * 6, CH * 0.335 + Math.sin(t * 0.8) * 3, 1, 0.38);
      gull(CW * 0.33 + Math.sin(t * 0.3 + 1) * 5, CH * 0.305 + Math.sin(t * 0.7 + 2) * 3, 0.72, 0.26);

      const lvl = 0.47 - lift * 0.07;
      const baseAmp = 12 + lift * 5;
      const frontY = CH * lvl - breath * 11;

      // distant horizon hairline
      const hz = buildPts(frontY - CH * 0.045, 1.4, 0.7, 0.05, t, 3.1);
      strokeSurface(hz, `rgba(${FOAM},0.4)`, 1);
      strokeSurface(hz, 'rgba(255,255,255,0.12)', 0.8, 1.4);

      const back = buildPts(frontY + CH * 0.055, baseAmp * 0.55, 0.9, 0.085, t, 0.6);
      fillSurface(back, 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.11)');
      strokeSurface(back, `rgba(${FOAM},0.3)`, 1.1);

      const mid = buildPts(frontY + CH * 0.024, baseAmp * 0.75, 1.2, 0.13, t, 2.4);
      fillSurface(mid, 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.2)');
      strokeSurface(mid, `rgba(${FOAM},0.5)`, 1.5);
      strokeSurface(mid, `rgba(${FOAM},0.22)`, 0.9, 5);

      const FF = 1.0, FS = 0.18, FP = 4.2;
      const front = buildPts(frontY, baseAmp, FF, FS, t, FP);

      const fg2 = ctx.createLinearGradient(0, frontY - 24, 0, CH);
      fg2.addColorStop(0, 'rgba(222,220,213,0.98)');
      fg2.addColorStop(0.4, 'rgba(178,176,168,0.98)');
      fg2.addColorStop(1, 'rgba(112,110,103,0.98)');
      ctx.beginPath();
      ctx.moveTo(front[0][0], front[0][1]);
      for (let i = 1; i < front.length; i++) ctx.lineTo(front[i][0], front[i][1]);
      ctx.lineTo(CW, CH); ctx.lineTo(0, CH); ctx.closePath();
      ctx.fillStyle = fg2; ctx.fill();

      strokeSurface(front, `rgba(255,255,255,0.95)`, 2.2);
      strokeSurface(front, 'rgba(255,255,255,0.5)', 1, -2.4);
      strokeSurface(front, `rgba(${FOAM},0.38)`, 0.9, 7);
      strokeSurface(front, `rgba(${FOAM},0.22)`, 0.8, 15);
      strokeSurface(front, `rgba(${FOAM},0.12)`, 0.8, 26);

      // drifting foam flecks on the front face
      for (const [u0, dyF, r, o] of FLECKS) {
        const u = (u0 + t * 0.006) % 1;
        const fy = surfaceY(u, frontY, baseAmp, FF, FS, t, FP) + dyF;
        ctx.globalAlpha = o;
        ctx.fillStyle = `rgba(${FOAM},0.95)`;
        ctx.beginPath(); ctx.arc(u * CW, fy, r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;

      const dotX = CW / 2;
      const dotY = surfaceY(0.5, frontY, baseAmp, FF, FS, t, FP);
      const dotR = 5.5 + breath * 3;
      const glowR = 16 + breath * 16;
      const dg = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, glowR);
      dg.addColorStop(0, `rgba(255,255,255,${0.5 + breath * 0.3})`);
      dg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(dotX, dotY, glowR, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.98)';
      ctx.beginPath(); ctx.arc(dotX, dotY, dotR, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = 'rgba(19,19,19,0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(dotX, dotY, dotR, 0, 6.2832); ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw(performance.now());
    raf = requestAnimationFrame(draw);
    return () => { mounted = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 1 }} />;
}

const SURF_SECONDS = 180;
const PHASES = [
  { at: 0.00, name: 'Notice it', tip: 'The urge is here. Don\u2019t push it away.' },
  { at: 0.22, name: 'It\u2019s rising', tip: 'Let it build. You are not the wave.' },
  { at: 0.46, name: 'Cresting', tip: 'This is the peak. Breathe slow and wide.' },
  { at: 0.66, name: 'Passing', tip: 'Feel it recede. It always does.' },
  { at: 0.86, name: 'Calm returns', tip: 'You rode it out. Notice the quiet.' },
];

function UrgeSurfScreen({ live = false, onDone = () => {}, onBack = () => {} }) {
  const [progress, setProgress] = uState(live ? 0 : 0.46);
  const [remaining, setRemaining] = uState(SURF_SECONDS);
  const progressRef = uRef(live ? 0 : 0.46);
  const raf = uRef(0);
  const start = uRef(0);

  uEffect(() => {
    if (!live) return;
    let mounted = true, lastUi = 0;
    start.current = performance.now();
    const loop = (now) => {
      if (!mounted) return;
      const elapsed = (now - start.current) / 1000;
      const p = Math.min(1, elapsed / SURF_SECONDS);
      progressRef.current = p;
      if (now - lastUi > 110) {
        lastUi = now;
        setProgress(p);
        setRemaining(Math.max(0, Math.ceil(SURF_SECONDS - elapsed)));
      }
      if (p < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { mounted = false; cancelAnimationFrame(raf.current); };
  }, [live]);

  const cur = PHASES.reduce((acc, ph) => (progress >= ph.at ? ph : acc), PHASES[0]);
  const mm = String(Math.floor(remaining / 60)).padStart(1, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div style={{ position: 'absolute', inset: 0, background: INK_DARK, fontFamily: 'var(--font)', color: '#F5F4F1', overflow: 'hidden' }}>
      <UrgeWaveCanvas progressRef={progressRef} />

      <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 29px 0' }}>
        <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex' }}>
          <BackIcon c="#F5F4F1" />
        </button>
        <span className="tnum" style={{ fontWeight: 500, fontSize: 15.5, letterSpacing: '0.02em', color: 'rgba(245,244,241,0.65)' }}>{mm}:{ss}</span>
      </div>

      <div style={{ position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', padding: '0 36px', zIndex: 3 }}>
        <div style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.5)' }}>{cur.name}</div>
        <p key={cur.name} className="urge-fade" style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, lineHeight: 1.24, letterSpacing: '0.01em', margin: '14px 0 0', textWrap: 'balance', color: '#F5F4F1' }}>{cur.tip}</p>
      </div>

      <div style={{ position: 'absolute', bottom: 36, left: 29, right: 29, zIndex: 3 }}>
        <button onClick={onDone} className="tl-press" style={{ appearance: 'none', cursor: 'pointer', width: '100%', background: '#FBFAF9', color: 'var(--ink)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em', border: 'none', boxShadow: 'none' }}>
          It passed — I'm through it
        </button>
      </div>
    </div>
  );
}

// you rode it out — the moment sealed in a dark card, like home's
// Next lesson surface
function UrgeDoneScreen({ onClose = () => {} }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: CCEL, fontFamily: FONT, color: SLATE, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 29px 0' }}>
        <Illustration art="calm" w={320} />
      </div>
      <div style={{ padding: '0 29px 30px' }}>
        <DarkCard pad={24}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: DARK.mut }}>The wave broke</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 31, lineHeight: 1.08, letterSpacing: '0.005em', margin: '12px 0 0', color: DARK.paper }}>You rode it out.</h2>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, fontWeight: 400, color: DARK.mut, margin: '12px 0 0', textWrap: 'pretty' }}>
            It rose, crested, and passed — and you were still here.
          </p>
          <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: 24, background: DARK.paper, color: 'var(--ink)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '15px 24px', letterSpacing: '0.01em' }}>
            Done
          </button>
        </DarkCard>
      </div>
    </div>
  );
}

// ════════ RELAPSE SERIES (3) ═════════════════════════════════════════
function UrgeRelapseSlip({ onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  return <JourneyPage total={3} index={0} first onBack={onBack} onClose={onClose}
    label="It happened"
    headline="You slipped"
    sub="That's all it is — one moment, now behind you."
    slotId="relapse-slip" slotHint="A single dip / quiet dusk"
    onNext={onNext} />;
}

function UrgeRelapseTwice({ onBack = () => {}, onClose = () => {}, onNext = () => {} }) {
  return <JourneyPage total={3} index={1} onBack={onBack} onClose={onClose}
    label="The one rule"
    headline="Don't fail twice"
    sub="A slip isn't a collapse. The streak resets; your progress doesn't."
    slotId="relapse-twice" slotHint="Trough that recovers"
    onNext={onNext} />;
}

function UrgeRelapseBegin({ onBack = () => {}, onClose = () => {}, onRestart = () => {} }) {
  return <JourneyPage total={3} index={2} onBack={onBack} onClose={onClose}
    label="Right now"
    headline="Begin again"
    sub="The next choice is the one that counts. Start fresh from here."
    slotId="relapse-begin" slotHint="Sunrise / a path forward"
    onNext={onRestart} nextLabel="Start again" />;
}

// ════════ LIVE FLOWS ═════════════════════════════════════════════════
// The path adapts to the two asks:
//   flicker          → wave · name · surf        (no need to flee)
//   pulling hard     → wave · move · name · surf  (the full drill)
//   about to give in → move · surf                (fastest way out)
function UrgeScreen() {
  const [i, setI] = uState(0);
  const [place, setPlace] = uState(null);
  const [strength, setStrength] = uState(null);

  const path = strength === 2 ? ['move', 'surf']
    : strength === 0 ? ['wave', 'name', 'surf']
    : ['wave', 'move', 'name', 'surf'];
  const steps = ['where', 'strength', ...path, 'done'];
  const total = steps.length - 1; // 'done' isn't a bar

  const next = () => setI((v) => Math.min(steps.length - 1, v + 1));
  const back = () => setI((v) => Math.max(0, v - 1));
  const close = () => { setI(0); setPlace(null); setStrength(null); };
  const urgent = strength === 2;

  const step = steps[i];
  const common = { total, index: i, onBack: i === 0 ? close : back, onClose: close, onNext: next };
  switch (step) {
    case 'where': return <UrgeAskWhere {...common} value={place} onPick={setPlace} />;
    case 'strength': return <UrgeAskStrength {...common} value={strength} onPick={setStrength} />;
    case 'wave': return <UrgePageWave {...common} />;
    case 'move': return <UrgeStepRemove {...common} place={place || 'elsewhere'} urgent={urgent} />;
    case 'name': return <UrgeStepName {...common} />;
    case 'surf': return <UrgeSurfScreen live onBack={back} onDone={next} />;
    default: return <UrgeDoneScreen onClose={close} />;
  }
}

function UrgeRelapseScreen() {
  const [i, setI] = uState(0);
  const next = () => setI((v) => v + 1);
  const back = () => setI((v) => Math.max(0, v - 1));
  const close = () => setI(0);
  if (i === 0) return <UrgeRelapseSlip onBack={close} onClose={close} onNext={next} />;
  if (i === 1) return <UrgeRelapseTwice onBack={back} onClose={close} onNext={next} />;
  return <UrgeRelapseBegin onBack={back} onClose={close} onRestart={close} />;
}

Object.assign(window, {
  UrgeScreen, UrgeRelapseScreen, UrgeWaveCanvas,
  UrgeAskWhere, UrgeAskStrength,
  UrgePageWave, UrgePagePass, UrgeStepRemove, UrgeStepName, UrgeSurfScreen, UrgeDoneScreen,
  UrgeRelapseSlip, UrgeRelapseTwice, UrgeRelapseBegin,
});
