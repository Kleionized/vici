// screens-money.jsx — Paywall, Locked feature, Manage subscription.
// Redesigned around air: the summit scene leads the paywall, plans are
// two quiet rows, the feature list is an unboxed two-column checklist.
// The locked curriculum shows the road disappearing into mist; manage-
// subscription opens on an unboxed membership block.

function PaywallScreen({ onClose = () => {}, onSubscribe = () => {}, onMaybeLater = null }) {
  const [plan, setPlan] = React.useState('year');
  const incl = ['Progress that never resets', 'Full 12-week curriculum', 'Unlimited urge support', 'Insights & weekly reports', 'Private journal', 'All 10 worlds'];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* the summit — where the road leads */}
      <div style={{ position: 'relative', height: 296, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><WorldArt scene="summit" w={402} h={300} /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0.55) 0%, rgba(247,245,240,0.06) 34%, rgba(247,245,240,0.62) 74%, rgba(247,245,240,0.94) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 60, left: 29, right: 29, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={onClose} className="tl-press tl-glass" style={{ width: 34, height: 34, borderRadius: 9999, cursor: 'pointer', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </div>
          <span className="tl-press-soft" style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)', cursor: 'pointer' }}>Restore</span>
        </div>
        <div style={{ position: 'absolute', left: 29, right: 29, bottom: 18, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 15, letterSpacing: '0.24em', color: 'var(--ink)' }}>VICI</span>
            <span style={{ fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-fill)', background: 'var(--fill)', boxShadow: 'none', borderRadius: 7, padding: '3px 8px' }}>Plus</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 38, lineHeight: 1.04, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)' }}>The long road,<br />together</h1>
        </div>
      </div>

      {/* scroll body — quiet, unboxed */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '26px 29px 0' }}>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink2)', margin: '0 0 34px', fontWeight: 400, maxWidth: 330, textWrap: 'pretty' }}>
          Recovery isn’t a streak to protect — it’s progress that builds and stays.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <PlanRow active={plan === 'year'} onClick={() => setPlan('year')} tag="" name="Yearly" price="$39.99" per="/year" sub="7-day free trial" />
          <PlanRow active={plan === 'coach'} onClick={() => setPlan('coach')} tag="Best value" name="Yearly + Coach" price="$99.99" per="/year" sub="3-day free trial" />
        </div>
        <div style={{ margin: '42px 2px 20px' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Everything, unlocked</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 18px', marginTop: 22 }}>
            {incl.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2.5 }}><path d="M4 12.5l4.8 4.8L20 6.5" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.35, color: 'var(--ink2)', letterSpacing: 'normal' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer CTA */}
      <div style={{ flexShrink: 0, padding: '20px 29px 30px', background: 'linear-gradient(0deg, var(--bg) 74%, transparent)' }}>
        <PillButton full size={15.5} style={{ padding: '16px 0', marginBottom: 14 }} onClick={onSubscribe}>Try 7 days free</PillButton>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink3)', fontWeight: 400, lineHeight: 1.5 }}>
          {plan === 'year' ? '$39.99/year ($3.33/mo) after trial · cancel anytime' : '$99.99/year ($8.33/mo) after trial · cancel anytime'}
        </div>
        {onMaybeLater ? <div style={{ textAlign: 'center', marginTop: 10 }}><GhostButton size={14.5} onClick={onMaybeLater}>Maybe later</GhostButton></div> : null}
      </div>
    </div>
  );
}

// plan row — flat paper; the chosen plan turns into the home screen's
// dark #131313 card. No gradients, no blur.
function PlanRow({ active, onClick, tag, name, price, per, sub }) {
  const paper = '#F5F4F1';
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
      display: 'flex', alignItems: 'center', gap: 14,
      background: active ? '#131313' : 'var(--card)',
      borderRadius: 18, padding: '18px 18px', position: 'relative', border: 'none',
      boxShadow: 'none',
      fontFamily: 'var(--font)', color: active ? paper : 'var(--ink)',
      transition: 'background .18s',
    }}>
      <div style={{ width: 23, height: 23, borderRadius: 9999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? paper : 'transparent', border: active ? 'none' : '2px solid var(--soft2)', transition: 'background .15s' }}>
        {active ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#131313" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: 'normal' }}>{name}</span>
          {tag ? <span style={{ fontWeight: 500, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? paper : 'var(--ink2)', border: `1px solid ${active ? 'rgba(245,244,241,0.4)' : 'var(--soft2)'}`, borderRadius: 9999, padding: '3px 8px' }}>{tag}</span> : null}
        </div>
        <div style={{ fontWeight: 400, fontSize: 13, color: active ? 'rgba(245,244,241,0.62)' : 'var(--ink2)', marginTop: 3 }}>{sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="tnum" style={{ fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em' }}>{price}</div>
        <div style={{ fontWeight: 400, fontSize: 12, color: active ? 'rgba(245,244,241,0.45)' : 'var(--ink3)' }}>{per}</div>
      </div>
    </button>
  );
}

// kept for call-site compatibility elsewhere
function PlanCard({ active, onClick, tag, name, price, per, sub }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer', textAlign: 'left', flex: 1,
      background: active ? 'var(--fill)' : 'var(--card)', color: active ? 'var(--on-fill)' : 'var(--ink)',
      borderRadius: 20, padding: '18px 18px 20px', position: 'relative',
      border: 'none', boxShadow: active ? 'none' : 'none',
      fontFamily: 'var(--font)',
    }}>
      <div style={{ height: 16, marginBottom: 6 }}>
        {tag && <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: active ? 'var(--on-fill-2)' : 'var(--ink3)',
        }}>{tag}</span>}
      </div>
      <div style={{ fontWeight: 500, fontSize: 15.5, letterSpacing: '-0.01em', marginBottom: 8 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap' }}>
        <span style={{ fontWeight: 500, fontSize: 20, letterSpacing: '-0.01em' }}>{price}</span>
        <span style={{ fontWeight: 500, fontSize: 12, color: active ? 'var(--on-fill-2)' : 'var(--ink3)' }}>{per}</span>
      </div>
      <div style={{ fontWeight: 500, fontSize: 13, marginTop: 6, color: active ? 'var(--on-fill-2)' : 'var(--ink2)' }}>{sub}</div>
      {active && <div style={{ position: 'absolute', top: 14, right: 14 }}>{Glyph.check('var(--on-fill)', 3)}</div>}
    </button>
  );
}

// ── the road ahead, lost in mist — the locked curriculum's vignette ──
function MistPathArt() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="240" height="112" viewBox="0 0 240 112" fill="none" style={{ display: 'block' }}>
      {/* ground */}
      <path d={K.lens(120, 94, 112, 13)} fill={SC.fgLit} />
      <path d="M36 100 C 80 96 150 96 202 100 C 160 106 84 106 36 100 Z" fill={SC.fgShade} opacity="0.5" />
      {/* the path, winding up and into the mist */}
      <path d="M102 108 C 110 94 120 84 128 76 C 134 70 137 63 135 56 L126 56 C 127 63 123 69 117 75 C 108 84 98 94 90 108 Z" fill={SC.path} />
      {/* the summit flag beyond, faint through the mist */}
      <g opacity="0.45">
        <path d="M166 42 L166 20" stroke={SC.ink} strokeWidth="2" strokeLinecap="round" />
        <path d="M166 21 L151 25.5 L166 31 Z" fill={SC.ink} />
      </g>
      {/* mist bank swallowing the road */}
      <path d="M18 56 C 32 46 56 42 80 46 C 90 36 114 34 128 42 C 146 34 174 36 190 44 C 206 40 220 44 226 50 C 232 56 226 62 214 62 L38 62 C 26 62 18 60 18 56 Z" fill="#FBFAF4" opacity="0.95" />
      <path d="M38 66 C 78 62 148 62 202 66 C 168 72 88 72 38 66 Z" fill="#FFFFFF" opacity="0.7" />
      <K.SPine x={46} y={94} s={0.8} />
      <K.SCairn x={196} y={90} s={0.7} />
      <K.SGull x={58} y={24} s={0.75} o={0.4} />
    </svg>
  );
}

function LockedScreen() {
  const locked = [
    ['Week II · Riding the wave', 'Urge surfing & the 20-minute rule'],
    ['Week III · Your triggers, mapped', 'Spot the leading indicators early'],
    ['Week IV · Never fail twice', 'A plan for the moment after a lapse'],
  ];
  return (
    <Shell pad={0} top={0} tab={<TabBar active="journey" />}>
      <div style={{ padding: '60px 0 104px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={150} eyebrow="Curriculum" title="Weeks" />
        <div style={{ padding: '0 29px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* week 1 — walked */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0 18px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--fill)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {Glyph.check('var(--on-fill)', 3)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal' }}>Week I · The first calm</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>Completed · 5 lessons</div>
            </div>
          </div>
          {/* the weeks beyond — ghosted rows, hairline separated */}
          {locked.map(([t, s], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderTop: '1px solid var(--line)', opacity: 0.55 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GIcon el={Glyph.lock('var(--ink2)')} size={19} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal' }}>{t}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>{s}</div>
              </div>
            </div>
          ))}

          <div style={{ flex: 1 }} />

          {/* the road continues into the mist */}
          <div style={{ textAlign: 'center', paddingBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><MistPathArt /></div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 21, letterSpacing: '0.005em', marginTop: 8 }}>11 more weeks ahead</div>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, color: 'var(--ink2)', lineHeight: 1.45, margin: '8px auto 0', maxWidth: 270, textWrap: 'pretty' }}>
              You’ve finished week one. The road carries on past the mist.
            </p>
            <div style={{ marginTop: 18 }}><PillButton full size={15.5}>Unlock VICI</PillButton></div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ManageSubScreen() {
  return (
    <Shell pad={0} top={0}>
      <div style={{ padding: '60px 0 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={230} eyebrow="Account" title="Subscription" onBack={() => {}} />

        {/* membership — unboxed monument */}
        <div style={{ padding: '4px 29px 0', marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 25, letterSpacing: '0.01em' }}>Yearly + Coach</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, color: 'var(--ink2)', marginTop: 5 }}>$99.99 / year · renews 14 Mar 2027</div>
            </div>
            <span style={{
              fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--on-fill)', background: 'var(--fill)',
              boxShadow: 'none',
              borderRadius: 9999, padding: '6px 12px', flexShrink: 0, marginTop: 3,
            }}>Active</span>
          </div>
          <div style={{ height: 1, background: 'var(--line)', margin: '18px 0 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font)', fontSize: 14 }}>
            <span style={{ color: 'var(--ink2)', fontWeight: 400 }}>Next charge</span>
            <span className="tnum" style={{ fontWeight: 500 }}>$99.99 on 14 Mar 2027</span>
          </div>
        </div>

        <SettingsGroup header="Plan">
          <Row icon={<IconChip icon={Glyph.compass('var(--ink)')} />} title="Change plan" detail="Yearly · $39.99" />
          <Row icon={<IconChip icon={Glyph.gift('var(--ink)')} />} title="Redeem a code" />
          <Row icon={<IconChip icon={Glyph.restore('var(--ink)')} />} title="Restore purchases" last />
        </SettingsGroup>

        <SettingsGroup header="Billing">
          <Row icon={<IconChip icon={Glyph.card('var(--ink)')} />} title="Payment method" detail="Apple ID" />
          <Row icon={<IconChip icon={Glyph.doc('var(--ink)')} />} title="Receipts & invoices" last />
        </SettingsGroup>

        <div style={{ padding: '0 29px 0' }}>
          <GhostButton size={15} style={{ color: 'var(--ink3)', padding: '12px 0' }}>Cancel subscription</GhostButton>
        </div>

        {/* the shore, seeing you out */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 24, opacity: 0.8 }}>
          <SceneShore w={176} h={111} />
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink3)', marginTop: 2 }}>the long road, together.</div>
        </div>
      </div>
    </Shell>
  );
}

// shared settings list primitives (used across account screens too) —
// one white paper card per group, hairline-divided rows (home checklist
// grammar), section label outside the card
function SettingsGroup({ header, children, footer }) {
  const rows = React.Children.toArray(children);
  return (
    <div style={{ marginBottom: 40 }}>
      {header && <SectionLabel style={{ padding: '0 33px 12px' }}>{header}</SectionLabel>}
      <div style={{
        position: 'relative', margin: '0 29px',
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: 'none',
        overflow: 'hidden', padding: '4px 20px',
      }}>
        {rows}
      </div>
      {footer && <div style={{ padding: '12px 33px 0', fontFamily: 'var(--font)', fontSize: 12.5, color: 'var(--ink3)', lineHeight: 1.5, fontWeight: 400 }}>{footer}</div>}
    </div>
  );
}

function Row({ title, detail, last, control, icon, danger, onDark }) {
  const ink = danger ? 'var(--danger)' : 'var(--ink)';
  return (
    <div className="tl-press-soft" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', minHeight: 24, cursor: 'pointer', borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
      {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
      <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 450, fontSize: 15, letterSpacing: '0.01em', color: ink }}>{title}</span>
      {detail && <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink3)', marginRight: 2 }}>{detail}</span>}
      {control !== undefined ? control : (!danger && Glyph.chevR('var(--ink3)'))}
    </div>
  );
}

Object.assign(window, { PaywallScreen, LockedScreen, ManageSubScreen, SettingsGroup, Row, PlanCard, PlanRow });
