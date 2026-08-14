// screens-letter.jsx — "The letter" · for the slip. A sealed envelope
// waits in the Log; the morning after a relapse it arrives over the home
// screen. Breaking the wax unfolds a letter from the man who makes it
// out — don't fail twice — then tucks itself back into the Log.
//
// Exports (to window): LetterFlow, LetterArrivalScreen, LetterReadScreen.

const { useState: ltState, useEffect: ltEffect, useId: ltId } = React;

const LETTER_SERIF = "'Newsreader', 'Spectral', Georgia, serif";

// ── the postmark: dashed ring, arced wordmark, cancellation waves ────
function Postmark({ size = 86, style = {}, day = 3, ink = 'rgba(74,74,66,0.62)' }) {
  const uid = ltId().replace(/[:]/g, '');
  const cx = size / 2, r = size / 2 - 13;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ display: 'block', ...style }}>
      <defs>
        <path id={`pm-${uid}`} d={`M ${cx - r} ${cx} a ${r} ${r} 0 1 1 ${2 * r} 0`} />
      </defs>
      <circle cx={cx} cy={cx} r={size / 2 - 2} stroke={ink} strokeWidth="1.6" strokeDasharray="3 5" />
      <circle cx={cx} cy={cx} r={size / 2 - 9.5} stroke={ink} strokeWidth="1" />
      <text style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.2, letterSpacing: '0.2em' }} fill={ink}>
        <textPath href={`#pm-${uid}`} startOffset="50%" textAnchor="middle">VICI POST</textPath>
      </text>
      <text x={cx} y={cx - 4} textAnchor="middle" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 7.5, letterSpacing: '0.18em' }} fill={ink}>DAY</text>
      <text x={cx} y={cx + 16} textAnchor="middle" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: String(day).length > 1 ? 18 : 21, letterSpacing: '0' }} fill={ink}>{day}</text>
    </svg>
  );
}

// ── the wax seal: an ink blob, impressed wave, soft top light ────────
function WaxSeal({ size = 58, cracking = false }) {
  const uid = ltId().replace(/[:]/g, '');
  return (
    <div className={cracking ? 'ltr-seal-crack' : undefined} style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox="0 0 58 58" fill="none" style={{ display: 'block' }}>
        <defs>
          <radialGradient id={`wax-${uid}`} cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#4E4F43" />
            <stop offset="62%" stopColor="#383930" />
            <stop offset="100%" stopColor="#26271F" />
          </radialGradient>
        </defs>
        {/* irregular wax silhouette — a blob, not a perfect circle */}
        <circle cx="29" cy="29" r="22.5" fill={`url(#wax-${uid})`} />
        <circle cx="12" cy="22" r="6.5" fill={`url(#wax-${uid})`} />
        <circle cx="47" cy="24" r="5.5" fill={`url(#wax-${uid})`} />
        <circle cx="42" cy="46" r="6" fill={`url(#wax-${uid})`} />
        <circle cx="15" cy="42" r="5" fill={`url(#wax-${uid})`} />
        <circle cx="29" cy="8.5" r="4.5" fill={`url(#wax-${uid})`} />
        {/* impressed ring + wave */}
        <circle cx="29" cy="29" r="15" stroke="rgba(244,243,239,0.22)" strokeWidth="1.6" />
        <path d="M17 31c3-4.5 6-4.5 9 0s6 4.5 9 0 4.5-3.4 6-1.5" stroke="#C9C7B8" strokeWidth="2.3" strokeLinecap="round" opacity="0.9" />
        {/* top-left catchlight */}
        <ellipse cx="21" cy="17" rx="8" ry="4.5" fill="rgba(255,255,255,0.14)" transform="rotate(-24 21 17)" />
      </svg>
    </div>
  );
}

// ── the envelope — the supplied artwork: sealed paper on a dark ground.
// phase: 'sealed' (idle breathing) | 'opening' (slow push-in while the
// card departs). `fill` stretches it into a host block (arrival card).
function EnvelopeArt({ phase = 'sealed', w = 246, h = 158, day = 3, fill = false }) {
  const opening = phase === 'opening';
  return (
    <div style={{
      position: 'relative', width: fill ? '100%' : w, height: fill ? '100%' : h + 44,
      borderRadius: fill ? 0 : 20, overflow: 'hidden', background: '#131313',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="assets/envelope-seal.png"
          alt="" aria-hidden="true"
          className={opening ? undefined : 'ci-breathe'}
          style={{
            width: '74%', display: 'block', pointerEvents: 'none',
            transform: opening ? 'scale(1.12)' : 'none',
            transition: 'transform 1.5s cubic-bezier(.3,.7,.2,1)',
          }}
        />
      </div>
      {/* corner kept clean — the wax seal carries the object */}
    </div>
  );
}

// ── the letter body copy ─────────────────────────────────────────────
const LT_INK = '#3B3B33';
function LetterParagraphs({ name = 'Sam', why = 'I want to be present for the people I love' }) {
  const P = ({ children, i }) => (
    <p className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontWeight: 400, fontSize: 18, lineHeight: 1.66, color: LT_INK, margin: '0 0 18px', textWrap: 'pretty', animationDelay: `${0.3 + i * 0.16}s` }}>{children}</p>
  );
  return (
    <React.Fragment>
      <div className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontWeight: 500, fontSize: 29, letterSpacing: '-0.005em', color: '#26261F', margin: '0 0 18px', animationDelay: '0.18s' }}>Dear {name},</div>
      <P i={1}>If you're reading this, it happened. Good — you opened the letter instead of disappearing. That's the only door that matters this morning.</P>
      <P i={2}>One slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started: <em style={{ fontStyle: 'italic', fontWeight: 500, color: '#26261F', textDecoration: 'underline', textDecorationColor: 'rgba(0,0,0,0.28)', textDecorationThickness: 1.5, textUnderlineOffset: 4 }}>{why}</em>. All still yours.</P>
      <P i={3}>The only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don't fail twice.</P>
      <P i={4}>I'll see you tonight, steadier.</P>
      <div className="ltr-line" style={{ display: 'flex', flexDirection: 'column', gap: 3, margin: '26px 0 0', animationDelay: '1.05s' }}>
        <span style={{ fontFamily: LETTER_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 21, color: '#26261F' }}>— the you who makes it out</span>
        <svg width="150" height="12" viewBox="0 0 150 12" fill="none"><path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </div>
      <p className="ltr-line" style={{ fontFamily: LETTER_SERIF, fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.5, color: 'rgba(59,59,51,0.62)', margin: '24px 0 0', animationDelay: '1.2s' }}>
        P.S. — the urge to spiral is also a wave. It passes too.
      </p>
    </React.Fragment>
  );
}

// ── the reading sheet ────────────────────────────────────────────────
function LetterSheet({ name, why, kept = false, onKeep = () => {}, onClose = () => {} }) {
  return (
    <div className="ltr-sheet" style={{
      position: 'absolute', inset: '64px 16px 44px', borderRadius: 26,
      background: 'linear-gradient(180deg, #FDFBF5, #F9F6EE)',
      boxShadow: 'none',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* fold creases */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '31%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.055) 18%, rgba(0,0,0,0.055) 82%, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '63%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.045) 18%, rgba(0,0,0,0.045) 82%, transparent)', pointerEvents: 'none' }} />
      {/* wave watermark */}
      <svg width="190" height="120" viewBox="0 0 190 120" fill="none" style={{ position: 'absolute', right: -26, bottom: 44, opacity: 0.05, pointerEvents: 'none' }}>
        <path d="M6 78c22-34 44-34 66 0s44 34 66 0 34-26 46-12" stroke="#22221C" strokeWidth="9" strokeLinecap="round" />
        <path d="M6 104c22-26 44-26 66 0" stroke="#22221C" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      </svg>
      {/* one pass of light across the paper as it opens */}
      <div className="ltr-sheen" style={{ position: 'absolute', top: '-30%', left: 0, width: '52%', height: '160%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)', pointerEvents: 'none', opacity: 0 }} />

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 22px 0', flexShrink: 0 }}>
        <span style={{ width: 34 }}></span>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', background: '#FBFAF9', cursor: 'pointer', width: 34, height: 34, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* the letter */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 30px 8px' }}>
        <LetterParagraphs name={name} why={why} />
      </div>

      {/* keep it */}
      <div style={{ padding: '12px 22px 20px', flexShrink: 0 }}>
        <button onClick={onKeep} className="tl-press" style={{
          appearance: 'none', border: 'none', width: '100%', cursor: 'pointer',
          background: 'var(--fill)', color: 'var(--on-fill)',
          fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '15px 24px',
          boxShadow: 'none',
          letterSpacing: '0.03em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z" stroke="var(--on-fill)" strokeWidth="2" strokeLinejoin="round" /></svg>
          Tuck it into your Log
        </button>
      </div>

      {/* KEPT stamp */}
      {kept ? (
        <div className="onb-stamp" style={{ position: 'absolute', right: 26, top: '38%', transform: 'rotate(-11deg)', border: '2.5px solid rgba(59,59,51,0.7)', borderRadius: 10, padding: '8px 15px', mixBlendMode: 'multiply', background: '#F9F7F3' }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, letterSpacing: '0.16em', color: 'rgba(59,59,51,0.82)' }}>KEPT</span>
        </div>
      ) : null}
    </div>
  );
}

// ── the arrival popup over Today ─────────────────────────────────────
function LetterArrivalCard({ phase = 'arrive', onOpen = () => {}, onLater = () => {} }) {
  const opening = phase === 'opening';
  return (
    <div className={opening ? 'ltr-away' : 'ltr-drop'} style={{
      position: 'absolute', left: 24, right: 24, top: '50%', transform: 'translateY(-54%)',
      background: 'var(--card)', borderRadius: 24,
      boxShadow: 'none',
      padding: 0, textAlign: 'center', overflow: 'hidden',
    }}>
      {/* the envelope — full-bleed dark section, like home's Next lesson card */}
      <div style={{ position: 'relative', height: 212 }}>
        <EnvelopeArt fill phase={opening ? 'opening' : 'sealed'} />
        {/* dismiss — saves it for tonight */}
        <button onClick={onLater} className="tl-press" style={{ position: 'absolute', top: 14, right: 14, zIndex: 7, appearance: 'none', border: 'none', background: 'rgba(245,244,241,0.94)', cursor: 'pointer', width: 34, height: 34, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: opening ? 0 : 1, transition: 'opacity .3s ease' }}>
          <svg width="15" height="15" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ padding: '26px 28px 28px', opacity: opening ? 0 : 1, transition: 'opacity .3s ease' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, letterSpacing: '0.01em', lineHeight: 1.12, color: 'var(--ink)', margin: 0 }}>A letter for the slip.</h2>
        <div style={{ marginTop: 24 }}>
          <button onClick={onOpen} className="tl-press" style={{
            appearance: 'none', border: 'none', width: '100%', cursor: 'pointer',
            background: 'var(--fill)', color: 'var(--on-fill)',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '15px 24px',
            boxShadow: 'none',
            letterSpacing: '0.03em',
          }}>Break the seal</button>
        </div>
      </div>
    </div>
  );
}

// ── glass toast over the home screen ─────────────────────────────────
function LetterToast({ label = 'Tucked into your Log' }) {
  return (
    <div style={{ position: 'absolute', left: '50%', bottom: 132, transform: 'translateX(-50%)', zIndex: 9 }}>
      <div className="ltr-line tl-glass" style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px 11px 12px',
        borderRadius: 9999, boxShadow: 'none', whiteSpace: 'nowrap',
      }}>
      <span style={{ width: 24, height: 24, borderRadius: 9999, background: 'var(--fill)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l5 5L20 6.5" stroke="var(--on-fill)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
      </div>
    </div>
  );
}

// ── composition: dimmed Today behind, letter states in front ─────────
function LetterStage({ phase, name, why, onOpen, onLater, onKeep, onClose, onReset }) {
  const overlayUp = phase === 'arrive' || phase === 'opening' || phase === 'read' || phase === 'kept';
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: overlayUp ? 'scale(1.012)' : 'none', filter: overlayUp ? 'blur(2.5px)' : 'none', transition: 'filter .5s ease, transform .5s ease' }}>
        <TodayScreen />
      </div>
      {overlayUp ? (
        <div className="ltr-dim" style={{ position: 'absolute', inset: 0, background: 'rgba(38,37,30,0.42)', zIndex: 5 }} />
      ) : null}
      {(phase === 'arrive' || phase === 'opening') ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}>
          <Particles mode="medium" />
          <LetterArrivalCard phase={phase} onOpen={onOpen} onLater={onLater} />
        </div>
      ) : null}
      {(phase === 'read' || phase === 'kept') ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}>
          <LetterSheet name={name} why={why} kept={phase === 'kept'} onKeep={onKeep} onClose={onClose} />
        </div>
      ) : null}
      {phase === 'after' ? (
        <div onClick={onReset} style={{ position: 'absolute', inset: 0, zIndex: 6, cursor: 'pointer' }}>
          <LetterToast />
        </div>
      ) : null}
      {phase === 'later' ? (
        <div onClick={onReset} style={{ position: 'absolute', inset: 0, zIndex: 6, cursor: 'pointer' }}>
          <LetterToast label="It'll be there if you need it" />
        </div>
      ) : null}
    </div>
  );
}

// ── live flow ────────────────────────────────────────────────────────
function LetterFlow({ name = 'Sam', why = 'I want to be present for the people I love' }) {
  const [phase, setPhase] = ltState('arrive');
  ltEffect(() => {
    if (phase === 'opening') {
      const id = setTimeout(() => setPhase('read'), 1500);
      return () => clearTimeout(id);
    }
    if (phase === 'kept') {
      const id = setTimeout(() => setPhase('after'), 1350);
      return () => clearTimeout(id);
    }
  }, [phase]);
  return (
    <LetterStage
      phase={phase} name={name} why={why}
      onOpen={() => setPhase('opening')}
      onLater={() => setPhase('later')}
      onKeep={() => setPhase('kept')}
      onClose={() => setPhase('arrive')}
      onReset={() => setPhase('arrive')}
    />
  );
}

// ── static boards ────────────────────────────────────────────────────
const LetterArrivalScreen = () => (
  <LetterStage phase="arrive" name="Sam" why="I want to be present for the people I love" onOpen={() => {}} onLater={() => {}} onKeep={() => {}} onClose={() => {}} onReset={() => {}} />
);
const LetterReadScreen = () => (
  <LetterStage phase="read" name="Sam" why="I want to be present for the people I love" onOpen={() => {}} onLater={() => {}} onKeep={() => {}} onClose={() => {}} onReset={() => {}} />
);

Object.assign(window, { LetterFlow, LetterArrivalScreen, LetterReadScreen, EnvelopeArt, WaxSeal, Postmark });
