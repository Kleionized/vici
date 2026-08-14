// screens-paywall.jsx — VICI Plus paywall: ONE page over a full-bleed
// summit painting. All text sits in frosted boxes so the art reads
// through — badge + headline + sub in a glass sheet, four feature tiles,
// near-white plan rows ($39.99/yr · $12.99/mo), black CTA. Pressing ✕
// (or declining in the funnel) is rescued ONCE by a 3-day free-trial
// offer; declining that really closes. Then the Apple-Pay sheet and the
// confirmed screen. Works standalone or embedded in the onboarding shell.
//
// Exports: PaywallFlow, PaywallPitchBoard (the page), PaywallTrialBoard,
// PaywallPlansBoard (alias), PaywallSheetBoard, PaywallConfirmedBoard.

const { useState: pwState } = React;

// demo answers for the standalone boards; the onboarding embed passes real ones
const PW_DEMO = { name: 'Marcus', goalPorn: 'Quit it completely', triggers: ['Late at night'], emotions: ['Loneliness'], load: 'One small lesson' };

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
        <span key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 9999, background: k === i ? 'var(--ink)' : 'rgba(31,30,28,0.22)', transition: 'width .25s, background .25s' }} />
      ))}
    </div>
  );
}
const PwX = ({ onClick }) => (
  <button onClick={onClick} className="tl-press tl-glass" style={{ appearance: 'none', border: 'none', width: 34, height: 34, borderRadius: 9999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="15" height="15" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /></svg>
  </button>
);
const PwCTA = ({ label, onClick }) => (
  <PillButton full size={15.5} style={{ padding: '16px 0' }} onClick={onClick}>{label}</PillButton>
);

// ═════ THE PAGE — full-bleed summit; the text lives in glass ═════════
const PW_TILES = [
  ['filter_hdr', 'Daily lessons', '+ conquest'],
  ['waves', 'Urge surfing', 'support'],
  ['wb_twilight', 'Insights +', 'custom advice'],
  ['lock', 'Private', 'journal'],
];
function PwPlanRow({ active, onClick, tag, name, per, price, cycle }) {
  return (
    <div onClick={onClick} className="tl-press" style={{
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      background: 'rgba(253,252,250,0.9)', borderRadius: 16, padding: '12px 13px 12px 15px',
      boxShadow: active ? 'inset 0 0 0 1.8px var(--ink)' : 'inset 0 0 0 1px rgba(31,30,28,0.08)',
      transition: 'box-shadow .18s',
    }}>
      {tag ? <span style={{ flexShrink: 0, fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--on-fill)', background: 'var(--fill)', borderRadius: 8, padding: '5px 8px' }}>{tag}</span> : null}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{name}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{per}</span>
      </span>
      <span style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{price}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{cycle}</span>
      </span>
      {active ? (
        <span style={{ width: 26, height: 26, borderRadius: 9999, background: 'var(--fill)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5l4.8 4.8L19.5 6.8" stroke="var(--on-fill)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      ) : (
        <span style={{ width: 26, height: 26, borderRadius: 9999, boxSizing: 'border-box', border: '1.6px solid rgba(31,30,28,0.25)', flexShrink: 0 }} />
      )}
    </div>
  );
}

function PwMain({ plan, setPlan, onPay, onDecline, onClose, embedded, P = {} }) {
  return (
    <React.Fragment>
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* chrome: ✕ · dots · restore */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 34, flexShrink: 0 }}>
          <div style={{ width: 70 }}>{!embedded && onClose ? <PwX onClick={onClose} /> : null}</div>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}><PwDots i={0} /></div>
          <div style={{ width: 70, display: 'flex', justifyContent: 'flex-end' }}>
            <span className="tl-press-soft" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink2)', cursor: 'pointer' }}>Restore</span>
          </div>
        </div>

        {/* let the summit breathe */}
        <div style={{ flex: 1, minHeight: 36 }} />

        {/* the glass sheet — everything written sits in here */}
        <div style={{ flexShrink: 0, borderRadius: 26, padding: '18px 14px 14px', background: 'rgba(249,247,243,0.55)', backdropFilter: 'blur(16px) saturate(1.05)', WebkitBackdropFilter: 'blur(16px) saturate(1.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 14, letterSpacing: '0.24em', color: 'var(--ink)' }}>VICI</span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-fill)', background: 'var(--fill)', borderRadius: 7, padding: '3px 8px' }}>Plus</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 31, lineHeight: 1.08, letterSpacing: '0.01em', margin: '10px 0 0', color: 'var(--ink)' }}>
            {P.name ? <React.Fragment>{P.name} — let’s<br />finish this.</React.Fragment> : <React.Fragment>Let’s finish<br />this, together.</React.Fragment>}
          </h1>

          {/* four tiles — they ARE the pitch; no paragraph needed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 15 }}>
            {PW_TILES.map(([icon, l1, l2]) => (
              <div key={icon} style={{ background: 'rgba(253,252,250,0.62)', borderRadius: 15, padding: '11px 4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: 'inset 0 0 0 1px rgba(31,30,28,0.05)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--ink)' }}>{icon}</span>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, lineHeight: 1.3, color: 'var(--ink2)', textAlign: 'center' }}>{l1}<br />{l2}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--ink2)' }}>verified_user</span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink2)' }}>Secure payment · Cancel anytime</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 10 }}>
            <PwPlanRow active={plan === 'year'} onClick={() => setPlan('year')} tag="Best value" name="12 Months" per="$3.33 / month" price="$39.99" cycle="billed yearly" />
            <PwPlanRow active={plan === 'month'} onClick={() => setPlan('month')} name="1 Month" per="$12.99 / month" price="$12.99" cycle="billed monthly" />
          </div>
        </div>

        <div style={{ flexShrink: 0, paddingTop: 11 }}>
          <PwCTA label="Start Vici Plus" onClick={onPay} />
          <div style={{ textAlign: 'center', marginTop: 9 }}>
            <button onClick={onDecline} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 10px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)' }}>Continue with the free tools</button>
          </div>
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
  const [plan, setPlan] = pwState('year');
  const [checkout, setCheckout] = pwState(null);     // what the sheet charges: year · month · trial
  const [base, setBase] = pwState(startStage === 'offer' ? 'offer' : 'pages');
  const [sheet, setSheet] = pwState(startStage === 'sheet');
  const [done, setDone] = pwState(startStage === 'done');
  const [offered, setOffered] = pwState(startStage === 'offer');
  const P = a && (a.name || (a.triggers || []).length) ? a : PW_DEMO;

  // walking away gets one rescue: 3 days free
  const decline = (exit) => () => {
    if (!offered) { setOffered(true); setBase('offer'); return; }
    exit();
  };

  if (done) return <PwConfirmed plan={checkout || plan} onDone={onDone} P={P} />;

  // the summit — painted on the wrapper itself so nothing insets it
  const art = base === 'pages' ? (
    <img src="assets/paywall-summit-full.webp" alt="" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 0%', zIndex: 0, pointerEvents: 'none' }} />
  ) : null;

  const inner = (
    <React.Fragment>
      {base === 'offer' ? (
        <div className="urge-fade" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PwTrialOffer embedded={embedded} P={P}
            onStart={() => { setCheckout('trial'); setSheet(true); }}
            onNo={() => (embedded ? onFree() : onClose())} />
        </div>
      ) : (
        <div className="urge-fade" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PwMain plan={plan} setPlan={setPlan} embedded={embedded} P={P}
            onPay={() => { setCheckout(plan); setSheet(true); }}
            onDecline={decline(embedded ? onFree : onClose)}
            onClose={decline(onClose)} />
        </div>
      )}
      {sheet ? <PwPaySheet plan={checkout || plan} onCancel={() => setSheet(false)} onPay={() => setDone(true)} /> : null}
    </React.Fragment>
  );
  if (embedded) return <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{art}{inner}</div>;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '54px 18px 24px' }}>
      {art}
      {inner}
    </div>
  );
}

// ── static boards ────────────────────────────────────────────────────
const PaywallPitchBoard = () => <PaywallFlow />;
const PaywallPlansBoard = PaywallPitchBoard; // merged into the one page
const PaywallTrialBoard = () => <PaywallFlow startStage="offer" />;
const PaywallSheetBoard = () => <PaywallFlow startStage="sheet" />;
const PaywallConfirmedBoard = () => <PaywallFlow startStage="done" />;

Object.assign(window, { PaywallFlow, PaywallPitchBoard, PaywallTrialBoard, PaywallPlansBoard, PaywallSheetBoard, PaywallConfirmedBoard, PwPaySheet, PwConfirmed });
