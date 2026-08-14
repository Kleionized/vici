// screens-letter-drops.jsx — post from VICI, beyond the slip.
// The same sealed envelope now arrives whenever a medallion is earned;
// the card outside always says only "You received a letter." Inside, a
// short letter presents the medallion — and can carry an enclosure: the
// yearly plan at a drop price (a quiet thank-you, VII days, no timer).
//
// Exports: MedallionPostFlow, MedallionLetterScreen, YearlyDropScreen.

const { useState: lpState, useEffect: lpEffect } = React;

const LP_SERIF = "'Newsreader', 'Spectral', Georgia, serif";
const LP_INK = '#3B3B33';
const LP_DARKINK = '#26261F';

// ── dimmed Today behind everything ───────────────────────────────────
function LPStage({ children, dim = true }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: dim ? 'scale(1.012)' : 'none', filter: dim ? 'blur(2.5px)' : 'none', transition: 'filter .5s ease, transform .5s ease' }}>
        <TodayScreen />
      </div>
      {dim ? <div className="ltr-dim" style={{ position: 'absolute', inset: 0, background: 'rgba(38,37,30,0.42)', zIndex: 5 }} /> : null}
      <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}>{children}</div>
    </div>
  );
}

// ── the paper sheet chrome (same stock as the slip letter) ───────────
function LPSheet({ children, footer = null, onClose = () => {} }) {
  return (
    <div className="ltr-sheet" style={{
      position: 'absolute', inset: '64px 16px 44px', borderRadius: 26,
      background: 'linear-gradient(180deg, #FDFBF5, #F9F6EE)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '31%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.055) 18%, rgba(0,0,0,0.055) 82%, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '63%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.045) 18%, rgba(0,0,0,0.045) 82%, transparent)', pointerEvents: 'none' }} />
      <div className="ltr-sheen" style={{ position: 'absolute', top: '-30%', left: 0, width: '52%', height: '160%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)', pointerEvents: 'none', opacity: 0 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '20px 22px 0', flexShrink: 0 }}>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: '#FBFAF9', cursor: 'pointer', width: 34, height: 34, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 30px 8px' }}>{children}</div>
      {footer ? <div style={{ padding: '12px 22px 20px', flexShrink: 0 }}>{footer}</div> : null}
    </div>
  );
}

const LPBtn = ({ label, onClick, ghost = false }) => ghost ? (
  <button onClick={onClick} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'rgba(59,59,51,0.66)', padding: '12px 4px 2px' }}>{label}</button>
) : (
  <button onClick={onClick} className="tl-press" style={{ appearance: 'none', border: 'none', width: '100%', cursor: 'pointer', background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '15px 24px', letterSpacing: '0.03em' }}>{label}</button>
);

// ── the medallion letter — sent the moment one is earned ─────────────
function MedallionLetterSheet({ name = 'Sam', onOffer = () => {}, onKeep = () => {}, onClose = () => {} }) {
  const P = ({ children, i }) => (
    <p className="ltr-line" style={{ fontFamily: LP_SERIF, fontWeight: 400, fontSize: 18, lineHeight: 1.66, color: LP_INK, margin: '0 0 18px', textWrap: 'pretty', animationDelay: `${0.3 + i * 0.16}s` }}>{children}</p>
  );
  return (
    <LPSheet onClose={onClose} footer={
      <React.Fragment>
        <LPBtn label="Open the enclosure" onClick={onOffer} />
        <LPBtn ghost label="Tuck it into your Log" onClick={onKeep} />
      </React.Fragment>
    }>
      <div className="ltr-line" style={{ fontFamily: LP_SERIF, fontWeight: 500, fontSize: 29, letterSpacing: '-0.005em', color: LP_DARKINK, margin: '0 0 18px', animationDelay: '0.18s' }}>Dear {name},</div>
      <P i={1}>Last night an urge rose, crested, and left without you. And this morning you opened the app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back.</P>
      {/* the medallion, presented */}
      <div className="ltr-line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, margin: '6px 0 22px', animationDelay: '0.55s' }}>
        <KKMedallion scene={KK_SCENES.backondeck} size={118} earned tier={1} tierMax={4} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: LP_DARKINK }}>Back on deck</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(59,59,51,0.6)', marginTop: 4 }}>EARNED · DAY XXIV</div>
        </div>
      </div>
      <P i={4}>The return is the strongest predictor there is — stronger than any count. So this one isn't for resisting. It's for coming back.</P>
      <div className="ltr-line" style={{ display: 'flex', flexDirection: 'column', gap: 3, margin: '20px 0 0', animationDelay: '0.95s' }}>
        <span style={{ fontFamily: LP_SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 21, color: LP_DARKINK }}>— VICI Post</span>
        <svg width="150" height="12" viewBox="0 0 150 12" fill="none"><path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </div>
      <p className="ltr-line" style={{ fontFamily: LP_SERIF, fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.5, color: 'rgba(59,59,51,0.62)', margin: '22px 0 4px', animationDelay: '1.1s' }}>
        P.S. — something is enclosed with this one. It keeps for seven days.
      </p>
    </LPSheet>
  );
}

// ── the enclosure: the yearly plan, at a drop ────────────────────────
function YearlyDropCard({ onClaim = () => {}, onLater = () => {} }) {
  const mut = 'rgba(245,244,241,0.62)', paper = '#F5F4F1';
  return (
    <div className="ltr-drop" style={{
      position: 'absolute', left: 24, right: 24, top: '50%', transform: 'translateY(-53%)',
      background: '#131313', borderRadius: 26, padding: '30px 26px 26px', textAlign: 'center', overflow: 'hidden',
    }}>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: mut }}>Enclosed with Back on deck</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, letterSpacing: '0.005em', lineHeight: 1.1, color: paper, margin: '12px 0 0' }}>The year, at a drop.</h2>
      {/* the price */}
      <div className="tnum" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginTop: 22 }}>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 17, color: 'rgba(245,244,241,0.45)', textDecoration: 'line-through', textDecorationThickness: 1.5 }}>$39.99</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 46, lineHeight: 1, color: paper, letterSpacing: '0.005em' }}>$26.99</span>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: mut }}>/year</span>
      </div>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: mut, marginTop: 8 }}>$2.25 a month · billed once</div>
      <div style={{ height: 1, background: 'rgba(245,244,241,0.14)', margin: '20px 0' }} />
      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.55, color: mut, margin: '0 8px', textWrap: 'pretty' }}>
        A quiet thank-you for coming back. Good for VII days, then it expires on its own — no timer chasing you.
      </p>
      <button onClick={onClaim} className="tl-press" style={{ appearance: 'none', border: 'none', width: '100%', cursor: 'pointer', background: paper, color: '#131313', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '15px 24px', letterSpacing: '0.02em', marginTop: 20 }}>
        Claim the year — $26.99
      </button>
      <button onClick={onLater} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: mut, padding: '14px 6px 0' }}>
        Maybe later — it keeps
      </button>
    </div>
  );
}

// ── live flow: earned → post arrives → letter → enclosure → claimed ──
function MedallionPostFlow({ name = 'Sam' }) {
  const [phase, setPhase] = lpState('arrive');
  lpEffect(() => {
    if (phase === 'opening') { const id = setTimeout(() => setPhase('read'), 1500); return () => clearTimeout(id); }
  }, [phase]);
  const toast = (label) => (
    <div onClick={() => setPhase('arrive')} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}>
      <LetterToast label={label} />
    </div>
  );
  return (
    <LPStage dim={phase === 'arrive' || phase === 'opening' || phase === 'read' || phase === 'offer'}>
      {(phase === 'arrive' || phase === 'opening') ? (
        <React.Fragment>
          <Particles mode="medium" />
          <LetterArrivalCard phase={phase} onOpen={() => setPhase('opening')} onLater={() => setPhase('later')} />
        </React.Fragment>
      ) : null}
      {phase === 'read' ? (
        <MedallionLetterSheet name={name} onOffer={() => setPhase('offer')} onKeep={() => setPhase('kept')} onClose={() => setPhase('arrive')} />
      ) : null}
      {phase === 'offer' ? (
        <YearlyDropCard onClaim={() => setPhase('claimed')} onLater={() => setPhase('kept')} />
      ) : null}
      {phase === 'claimed' ? toast('The year is yours — Plus unlocked') : null}
      {phase === 'kept' ? toast('Tucked into your Log') : null}
      {phase === 'later' ? toast("It'll be there if you need it") : null}
    </LPStage>
  );
}

// ── static boards ────────────────────────────────────────────────────
const MedallionLetterScreen = () => (
  <LPStage><MedallionLetterSheet /></LPStage>
);
const YearlyDropScreen = () => (
  <LPStage><YearlyDropCard /></LPStage>
);

Object.assign(window, { MedallionPostFlow, MedallionLetterScreen, YearlyDropScreen });
