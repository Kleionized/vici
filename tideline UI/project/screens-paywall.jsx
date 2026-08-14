// screens-paywall.jsx — VICI Plus paywall, rebuilt in the current home/
// paywall grammar: the summit hero, the unboxed checklist, and the long
// PlanRows where the chosen plan floods dark (#131313). Two pages —
// pitch → plans ($39.99/yr · $12.99/mo, no trial up front). Pressing ✕
// on the plans page (or declining in the funnel) is rescued ONCE by a
// 3-day free-trial offer; declining that really closes. Works standalone
// or embedded inside the onboarding shell.
//
// Exports: PaywallFlow, PaywallPitchBoard, PaywallTrialBoard (the offer),
// PaywallPlansBoard, PaywallSheetBoard, PaywallConfirmedBoard.

const { useState: pwState } = React;

const PW_INCL = ['Progress that never resets', 'Full 12-week curriculum', 'Unlimited urge support', 'Insights & weekly reports', 'Private journal', 'All 10 worlds'];
// demo answers for the standalone boards; the onboarding embed passes real ones
const PW_DEMO = { name: 'Marcus', goalPorn: 'Quit it completely', triggers: ['Late at night'], emotions: ['Loneliness'], load: 'One small lesson' };
const pwTrig = (P) => ((P.triggers || [])[0] || 'late night').toLowerCase();
const pwEmo = (P) => ((P.emotions || [])[0] || 'loneliness').toLowerCase();

// what each checkout actually charges
const PW_CHECKOUT = {
  trial: { app: 'VICI Plus — Yearly', trial: '3 days free, then $39.99/year', due: '$0.00', note: '$39.99 on Jul 13, 2026 · cancel anytime' },
  year:  { app: 'VICI Plus — Yearly', trial: null, due: '$39.99', note: 'Renews Jul 10, 2027 · cancel anytime' },
  month: { app: 'VICI Plus — Monthly', trial: null, due: '$12.99', note: 'Renews Aug 10, 2026 · cancel anytime' },
};

// ── small shared pieces ──────────────────────────────────────────────
function PwDots({ i }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0, 1].map((k) => (
        <span key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 9999, background: k === i ? 'var(--ink)' : 'var(--soft2)', transition: 'width .25s, background .25s' }} />
      ))}
    </div>
  );
}
const PwX = ({ onClick }) => (
  <button onClick={onClick} className="tl-press tl-glass" style={{ appearance: 'none', border: 'none', width: 34, height: 34, borderRadius: 9999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="15" height="15" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /></svg>
  </button>
);
function PwHeader({ i, onBack, onClose, embedded }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 34, flexShrink: 0 }}>
      <div style={{ width: 70, display: 'flex', justifyContent: 'flex-start' }}>
        {onBack ? <BackChevron onClick={onBack} /> : (!embedded && onClose ? <PwX onClick={onClose} /> : null)}
      </div>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}><PwDots i={i} /></div>
      <div style={{ width: 70, display: 'flex', justifyContent: 'flex-end' }}>
        {onBack && !embedded && onClose
          ? <PwX onClick={onClose} />
          : <span className="tl-press-soft" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink2)', cursor: 'pointer' }}>Restore</span>}
      </div>
    </div>
  );
}
const PwCTA = ({ label, onClick }) => (
  <PillButton full size={15.5} style={{ padding: '16px 0' }} onClick={onClick}>{label}</PillButton>
);

// ═════ PAGE 1 · THE PITCH — what Plus is, in one look ════════════════
function PwPitch({ onNext, onClose, embedded, P = {} }) {
  return (
    <React.Fragment>
      {/* the summit — where the road leads */}
      <div style={{ position: 'relative', height: embedded ? 208 : 240, flexShrink: 0, borderRadius: 20, overflow: 'hidden', marginTop: 14 }}>
        <div style={{ position: 'absolute', inset: 0 }}><WorldArt scene="summit" w={402} h={300} /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0.12) 0%, rgba(247,245,240,0.04) 40%, rgba(247,245,240,0.9) 96%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 14, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 14, letterSpacing: '0.24em', color: 'var(--ink)' }}>VICI</span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-fill)', background: 'var(--fill)', borderRadius: 7, padding: '3px 8px' }}>Plus</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 33, lineHeight: 1.05, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)' }}>{P.name ? <React.Fragment>{P.name} — let’s<br />finish this.</React.Fragment> : <React.Fragment>Let’s finish<br />this, together.</React.Fragment>}</h1>
        </div>
      </div>

      {/* everything, unlocked — the unboxed checklist */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '26px 2px 8px' }}>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink2)', margin: '0 0 20px', textWrap: 'pretty' }}>
          Built from your answers tonight — the {pwTrig(P)} window guarded first, the {pwEmo(P)} protocol pinned, {P.load === 'Just the bad-day tools for now' ? 'tools before the course' : 'one small lesson a day'}.
        </p>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Everything, unlocked</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 18px', marginTop: 18 }}>
          {PW_INCL.map((f) => (
            <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2.5 }}><path d="M4 12.5l4.8 4.8L20 6.5" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.35, color: 'var(--ink2)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, paddingTop: 12 }}>
        <PwCTA label="Continue" onClick={onNext} />
      </div>
    </React.Fragment>
  );
}

// ═════ PAGE 2 · THE PLANS — the long rows, chosen plan floods dark ═══
function PwPlans({ plan, setPlan, onDone, onFree, P = {} }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: 22 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: '0.005em', color: 'var(--ink)', margin: '4px 0 0' }}>Choose your plan.</h1>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink2)', margin: '10px 0 0', textWrap: 'pretty' }}>You did the work tonight{P.name ? `, ${P.name}` : ''}. Let’s keep it.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 24 }}>
          <PlanRow active={plan === 'year'} onClick={() => setPlan('year')} tag="Best value" name="Yearly" price="$39.99" per="/year" sub="$3.33 a month" />
          <PlanRow active={plan === 'month'} onClick={() => setPlan('month')} tag="" name="Monthly" price="$12.99" per="/month" sub="Cancel anytime" />
        </div>
        <div style={{ marginTop: 18, textAlign: 'center', fontFamily: 'var(--font)', fontSize: 12.5, color: 'var(--ink3)', fontWeight: 400 }}>The urge tool is free forever.</div>
      </div>

      <div style={{ flexShrink: 0, paddingTop: 12 }}>
        <PwCTA label={plan === 'month' ? 'Continue — $12.99/month' : 'Continue — $39.99/year'} onClick={onDone} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <button onClick={onFree} className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1.4px solid var(--soft2)', borderRadius: 9999, padding: '11px 24px', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>Continue with the free tools</button>
        </div>
      </div>
    </React.Fragment>
  );
}

// ═════ THE RESCUE — 3 days free, shown once when he walks ════════════
const PW_OFFER = [
  ['today', 'Today — everything unlocks',
    (c) => <g><path d="M7.5 10.5V7a4.5 4.5 0 0 1 8.6-1.8" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><rect x="4.4" y="10" width="15.2" height="10.5" rx="2.6" stroke={c} strokeWidth="1.8" /><path d="M12 14v2.6" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></g>],
  ['day2', 'Day 2 — a reminder, before any charge',
    (c) => <g><path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /><path d="M10 19.6a2.2 2.2 0 0 0 4 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></g>],
  ['day3', 'Day 3 — $39.99/year begins, unless you cancel',
    (c) => <g><rect x="3.5" y="5.5" width="17" height="13.5" rx="2.6" stroke={c} strokeWidth="1.8" /><path d="M3.5 9.5h17" stroke={c} strokeWidth="1.8" /><path d="M7 15h4" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></g>],
];
function PwTrialOffer({ onStart, onNo, embedded, P = {} }) {
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 34, flexShrink: 0 }}>
        {embedded ? null : <PwX onClick={onNo} />}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: 18 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: '0.005em', color: 'var(--ink)', margin: '4px 0 0', textWrap: 'balance' }}>Before you go — three days on us.</h1>
        <div style={{ position: 'relative', margin: '30px 0 0' }}>
          <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'var(--soft2)' }} />
          {PW_OFFER.map(([k, t, icon], i) => (
            <div key={k} style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0' }}>
              <span style={{ width: 40, height: 40, borderRadius: 9999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? 'var(--fill)' : 'var(--card)' }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none">{icon(i === 0 ? 'var(--on-fill)' : 'var(--ink)')}</svg>
              </span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, lineHeight: 1.35, color: 'var(--ink)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, paddingTop: 12 }}>
        <PwCTA label="Start my 3 free days" onClick={onStart} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={onNo} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)' }}>No thanks</button>
        </div>
      </div>
    </React.Fragment>
  );
}

// ═════ THE PAYMENT — the actual purchase, in the flow ═══════════════
const PW_SYS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif";
function PwPaySheet({ plan = 'year', onCancel, onPay }) {
  const C = PW_CHECKOUT[plan] || PW_CHECKOUT.year;
  const SheetRow = ({ label, value, chev, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
      <span style={{ width: 76, flexShrink: 0, fontSize: 12.5, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
      <span style={{ flex: 1, fontSize: 13.5, color: '#111', fontWeight: 400 }}>{value}</span>
      {chev ? <svg width="7" height="12" viewBox="0 0 8 14"><path d="M1.5 1.5 6 7l-4.5 5.5" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 9, fontFamily: PW_SYS }}>
      <div className="ltr-dim" onClick={onCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      {/* the side button, armed */}
      <div className="urge-fade" style={{ position: 'absolute', right: -2, top: 168, width: 5, height: 76, borderRadius: 4, background: '#2E63F6', boxShadow: '0 0 10px rgba(46,99,246,0.65)' }} />
      <div className="ltr-drop" style={{ position: 'absolute', left: 5, right: 5, bottom: 5, background: '#FCFCFE', borderRadius: 34, padding: '16px 20px 20px', boxShadow: '0 -10px 44px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 21, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}><span style={{ fontFamily: PW_SYS }}>{'\uF8FF'}</span> Pay</span>
          <button onClick={onCancel} style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: 27, height: 27, borderRadius: 9999, background: 'rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="rgba(0,0,0,0.55)" strokeWidth="2.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <SheetRow label="App" value={C.app} />
        {C.trial ? <SheetRow label="Trial" value={C.trial} /> : null}
        <SheetRow label="Account" value="jordan@hey.com" />
        <SheetRow label="Payment" value="Visa •••• 4271" chev />
        <SheetRow label="Billing" value="J. Reyes · Portland, OR" chev last />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1.5px solid rgba(0,0,0,0.12)', marginTop: 4, paddingTop: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Due today</span>
          <span style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 17, fontWeight: 600, color: '#111' }}>{C.due}</span>
            <span style={{ display: 'block', fontSize: 11.5, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>{C.note}</span>
          </span>
        </div>
        <button onClick={onPay} className="tl-press" style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'transparent', padding: '6px 0 2px' }}>
          <svg width="22" height="30" viewBox="0 0 22 30" fill="none"><rect x="8" y="2" width="6" height="26" rx="3" stroke="#2E63F6" strokeWidth="2" /><path d="M18 9l2.5 2M18 15l2.5 2" stroke="#2E63F6" strokeWidth="2" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2E63F6' }}>Confirm with Side Button</span>
        </button>
      </div>
    </div>
  );
}

function PwConfirmed({ plan = 'year', onDone = () => {}, P = {} }) {
  const line = plan === 'trial'
    ? 'Let’s take the first ground. Nothing is charged until Jul 13 — cancelling is one tap in Settings.'
    : plan === 'month'
      ? 'Let’s take the first ground. The campaign is unlocked, month by month.'
      : 'Let’s take the first ground. The whole campaign is yours until July 2027.';
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '58px 29px 30px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="o3-stamp" style={{ width: 84, height: 84, borderRadius: 9999, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5l4.8 4.8L19.5 6.8" stroke="var(--on-fill)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '0.01em', margin: 0 }}>{P.name ? `We’re in, ${P.name}.` : 'You’re in.'}</h1>
        <p style={{ fontFamily: 'var(--font)', fontSize: 14.5, lineHeight: 1.55, fontWeight: 400, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 280, textWrap: 'pretty' }}>{line}</p>
      </div>
      <div style={{ flexShrink: 0 }}>
        <PillButton full size={15.5} style={{ padding: '16px 0' }} onClick={onDone}>Begin Day I</PillButton>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink3)', fontWeight: 400, marginTop: 12 }}>Receipt sent to jordan@hey.com</div>
      </div>
    </div>
  );
}

// ═════ THE FLOW ══════════════════════════════════════════════════════
function PaywallFlow({ onDone = () => {}, onFree = () => {}, onClose = () => {}, embedded = false, start = 0, startStage = 'pages', a = null }) {
  const [i, setI] = pwState(start);
  const [plan, setPlan] = pwState('year');           // selection on the plans page
  const [checkout, setCheckout] = pwState(null);     // what the sheet charges: year · month · trial
  const [base, setBase] = pwState(startStage === 'offer' ? 'offer' : 'pages');
  const [sheet, setSheet] = pwState(startStage === 'sheet');
  const [done, setDone] = pwState(startStage === 'done');
  const [offered, setOffered] = pwState(startStage === 'offer');
  const P = a && (a.name || (a.triggers || []).length) ? a : PW_DEMO;

  // walking away from the plans page gets one rescue: 3 days free
  const decline = (exit) => () => {
    if (!offered) { setOffered(true); setBase('offer'); return; }
    exit();
  };

  if (done) return <PwConfirmed plan={checkout || plan} onDone={onDone} P={P} />;

  const pages = [
    <PwPitch key="p1" embedded={embedded} onNext={() => setI(1)} onClose={onClose} P={P} />,
    <PwPlans key="p2" plan={plan} setPlan={setPlan} onDone={() => { setCheckout(plan); setSheet(true); }} onFree={decline(onFree)} P={P} />,
  ];
  const inner = (
    <React.Fragment>
      {base === 'offer' ? (
        <div className="urge-fade" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PwTrialOffer embedded={embedded} P={P}
            onStart={() => { setCheckout('trial'); setSheet(true); }}
            onNo={() => (embedded ? onFree() : onClose())} />
        </div>
      ) : (
        <React.Fragment>
          <PwHeader i={i} embedded={embedded}
            onClose={i === 1 ? decline(onClose) : onClose}
            onBack={i > 0 ? () => setI(i - 1) : null} />
          <div key={i} className="urge-fade" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{pages[i]}</div>
        </React.Fragment>
      )}
      {sheet ? <PwPaySheet plan={checkout || plan} onCancel={() => setSheet(false)} onPay={() => setDone(true)} /> : null}
    </React.Fragment>
  );
  if (embedded) return <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{inner}</div>;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '58px 29px 30px' }}>
      {inner}
    </div>
  );
}

// ── static boards, one per page ──────────────────────────────────────
const PaywallPitchBoard = () => <PaywallFlow start={0} />;
const PaywallPlansBoard = () => <PaywallFlow start={1} />;
const PaywallTrialBoard = () => <PaywallFlow start={1} startStage="offer" />;
const PaywallSheetBoard = () => <PaywallFlow start={1} startStage="sheet" />;
const PaywallConfirmedBoard = () => <PaywallFlow start={1} startStage="done" />;

Object.assign(window, { PaywallFlow, PaywallPitchBoard, PaywallTrialBoard, PaywallPlansBoard, PaywallSheetBoard, PaywallConfirmedBoard, PwPaySheet, PwConfirmed });
