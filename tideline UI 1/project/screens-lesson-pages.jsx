// screens-lesson-pages.jsx — VICI · interactive lesson pages.
// The reader's display pages (title / idea / image / done) gain five
// interactive kinds, shown on Ground II's "The early warnings":
//   teach   — a scene + one idea, CTA named after the takeaway
//   pick    — pair the daily lesson with an existing routine
//   check   — self-check, one sign per page, No / Yes
//   grid    — what's underneath them, multi-select
//   collect — your signs, gathered into one memorized line
//
// Exports: LessonPagesFlow + one static board per kind.

const { useState: lpgState, useEffect: lpgEffect } = React;

const LPG_COUNT = 6; // teach · pick · check ×2 · grid · collect

// ── lesson chrome: dashed progress + collapse header + close ─────────
function LPGBar({ index, onBack = () => {}, onClose = () => {} }) {
  const dashCount = 14;
  return (
    <div style={{ position: 'relative', zIndex: 2, padding: '60px 32px 28px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Array.from({ length: dashCount }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i < LPG_COUNT && i <= index ? 'var(--fill)' : 'var(--soft2)', transition: 'background .3s' }} />
        ))}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 50, marginTop: 28 }}>
        <button onClick={onBack} className="tl-press tl-glass" aria-label="Collapse lesson" style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: 50, height: 50, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1, color: 'var(--ink)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5.5 9l6.5 6.5L18.5 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', left: 54, right: 54, textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, lineHeight: 1.2, color: 'var(--ink)', letterSpacing: '-0.012em', textWrap: 'balance' }}>The early warnings</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, lineHeight: 1.2, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 4 }}>Ground II · 5 min</div>
        </div>
        <button onClick={onClose} className="tl-press" aria-label="Close lesson" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', width: 44, height: 44, marginRight: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}

function LPGShell({ index, children, onBack, onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <LPGBar index={index} onBack={onBack} onClose={onClose} />
      {children}
    </div>
  );
}

const LPGCta = ({ label = 'Continue', enabled = true, onClick }) => (
  <div style={{ position: 'relative', zIndex: 2, padding: '18px 29px 38px', flexShrink: 0 }}>
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default', width: '100%',
      background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600,
      fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em',
      opacity: enabled ? 1 : 0.26, transition: 'opacity .25s ease',
    }}>{label}</button>
  </div>
);

const LPGCaps = { fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)', textAlign: 'center' };

// ── the signs & feelings this lesson trades in ───────────────────────
const LPG_SIGNS = ['Restless scrolling', 'Putting off sleep', 'Fake-fine answers', 'Planning to be alone'];
const LPG_CHECKS = [
  { term: 'Restless scrolling', asIn: 'Circling the same three apps, wanting none of them' },
  { term: 'Putting off sleep', asIn: 'Finding reasons to stay up after you meant to stop' },
];
const LPG_FEELINGS = ['Lonely', 'Wound up', 'Bored', 'Low', 'Irritable', 'Numb', 'Tired', 'Out of place', 'Hungry'];

// ═════ 1 · TEACH — a scene, one idea, the takeaway as the button ═════
function LPGSceneScouts() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="290" height="150" viewBox="0 0 320 166" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {/* the scouts, out ahead of the weather */}
      <K.SGull x={118} y={38} s={0.95} o={0.7} />
      <K.SGull x={152} y={26} s={0.7} o={0.5} />
      {/* the sea */}
      <path d="M0 104 C 60 101, 260 101, 320 104 L320 166 L0 166 Z" fill={SC.waterHi} />
      <path d="M0 104 C 60 101, 260 101, 320 104" stroke={SC.foam} strokeWidth="2" strokeLinecap="round" />
      <path d="M0 128 h320 v38 h-320 Z" fill={SC.water} />
      <path d="M0 150 h320 v16 h-320 Z" fill={SC.waterLo} />
      {/* the wave itself, still far right */}
      <path d="M236 104 C 246 82 262 82 272 104" fill={SC.water} stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="243" cy="88" r="1.8" fill={SC.foam} />
      {/* the boat, with time to see it coming */}
      <K.SBoat x={64} y={92} s={0.6} />
    </svg>
  );
}
function LPG_Teach({ index = 0, next = () => {}, back = () => {}, close = () => {} }) {
  return (
    <LPGShell index={index} onBack={back} onClose={close}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div className="ci-breathe" style={{ marginBottom: 34 }}><LPGSceneScouts /></div>
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.16, letterSpacing: '0.005em', margin: 0, maxWidth: 300, textWrap: 'balance' }}>The wave never ambushes.</h1>
        <p className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink2)', margin: '16px auto 0', maxWidth: 288, textWrap: 'pretty' }}>
          <b style={{ color: 'var(--ink)' }}>It sends scouts first</b> — restlessness, a reach for the phone, a door quietly closed. Learn your scouts, and the wave loses its surprise.
        </p>
      </div>
      <LPGCta label="Scouts before waves" onClick={next} />
    </LPGShell>
  );
}

// ═════ 2 · PICK — pair the lesson with a routine you already have ════
const lpgG = (kids) => (c) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{kids}</svg>;
const LPG_ROUTINES = [
  ['Morning coffee', lpgG(<g><path d="M5 8.5h11v6.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 15z" /><path d="M16 10.5h1.6a2.6 2.6 0 0 1 0 5.2H16M8 5.5c0-1 .8-1.2.8-2M11.5 5.5c0-1 .8-1.2 .8-2" /></g>)],
  ['Brushing your teeth', lpgG(<g><path d="M4.5 19.5 15.8 8.2" /><path d="M14.6 5.4l4 4 1.6-1.6a1.4 1.4 0 0 0 0-2l-2-2a1.4 1.4 0 0 0-2 0z" /><path d="M16.2 9.8l-1.2 1.2M14.2 7.8 13 9" /></g>)],
  ['The commute', lpgG(<g><rect x="5" y="4" width="14" height="13" rx="2.6" /><path d="M5 9.5h14M9 20.5l-1.2 1.5M15 20.5l1.2 1.5M8.8 13.8h.01M15.2 13.8h.01" /></g>)],
  ['Winding down in bed', lpgG(<g><path d="M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2" /><circle cx="7.1" cy="11.4" r="1.2" /></g>)],
  ['A habit of my own', lpgG(<path d="M12 4v16M4 12h16M6.6 6.6l10.8 10.8M17.4 6.6 6.6 17.4" />)],
];
function LPG_Pick({ index = 1, value: v0 = null, next = () => {}, back = () => {}, close = () => {} }) {
  const [v, setV] = lpgState(v0);
  return (
    <LPGShell index={index} onBack={back} onClose={close}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '32px 32px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.18, letterSpacing: '0.005em', margin: '0 auto', maxWidth: 320, textAlign: 'center', textWrap: 'balance' }}>Chain the day's lesson to something you already do.</h1>
        <p style={{ ...LPGCaps, margin: '18px 0 0' }}>While…</p>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18, paddingBottom: 4 }}>
          {LPG_ROUTINES.map(([label, icon]) => {
            const on = v === label;
            return (
              <button key={label} onClick={() => setV(label)} className="tl-press" style={{
                appearance: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--card)', borderRadius: 20, padding: '16px 18px', minHeight: 60, textAlign: 'left',
                boxShadow: on ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
              }}>
                <span style={{ width: 38, height: 38, borderRadius: 9999, background: on ? 'var(--fill)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
                  {icon(on ? 'var(--on-fill)' : 'var(--ink)')}
                </span>
                <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: on ? 600 : 500, fontSize: 15, color: 'var(--ink)' }}>{label}</span>
                {on ? <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'var(--ink)', flexShrink: 0 }} /> : null}
              </button>
            );
          })}
        </div>
      </div>
      <LPGCta label={v ? `Paired with ${v.toLowerCase()}` : 'Pair it'} enabled={!!v} onClick={next} />
    </LPGShell>
  );
}

// ═════ 3 · CHECK — one sign per page, No / Yes ═══════════════════════
function LPG_Check({ index = 2, q = 0, next = () => {}, back = () => {}, close = () => {} }) {
  const { term, asIn } = LPG_CHECKS[q] || LPG_CHECKS[0];
  const [picked, setPicked] = lpgState(null);
  const pick = (val) => { if (picked) return; setPicked(val); setTimeout(next, 620); };
  const btn = (val, glyph, label) => {
    const on = picked === val;
    return (
      <button onClick={() => pick(val)} className="tl-press" style={{
        appearance: 'none', border: 'none', cursor: 'pointer', flex: 1, position: 'relative', overflow: 'hidden',
        background: 'var(--card)', borderRadius: 20, padding: '20px 10px 17px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
      }}>
        {on ? <span className="o3-bleed" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--fill)' }} /> : null}
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ position: 'relative' }}>
          {glyph === 'x'
            ? <g stroke={on ? 'var(--on-fill)' : 'var(--ink)'} strokeWidth="2.1" strokeLinecap="round"><circle cx="13" cy="13" r="11" fill="none" /><path d="M9 9l8 8M17 9l-8 8" /></g>
            : <g stroke={on ? 'var(--on-fill)' : 'var(--ink)'} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="13" r="11" fill="none" /><path d="M8 13.5l3.4 3.4L18 10" fill="none" /></g>}
        </svg>
        <span style={{ position: 'relative', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, color: on ? 'var(--on-fill)' : 'var(--ink)', transition: 'color .12s ease .06s' }}>{label}</span>
      </button>
    );
  };
  return (
    <LPGShell index={index} onBack={back} onClose={close}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '32px 32px 0' }}>
        <div style={LPGCaps}>Self-check · {['I', 'II'][q] || 'I'} of II</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, lineHeight: 1.18, letterSpacing: '0.005em', margin: '16px auto 0', maxWidth: 310, textAlign: 'center', textWrap: 'balance' }}>In the hours before a slip, I'm sometimes…</h1>
        {/* the sign, held up on its own card */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card)', borderRadius: 24, padding: '44px 26px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.15, letterSpacing: '0.005em', color: 'var(--ink)' }}>{term}</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)', marginTop: 14, textWrap: 'pretty' }}>As in: {asIn.toLowerCase()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, paddingBottom: 34 }}>
          {btn('no', 'x', 'Not me')}
          {btn('yes', 'check', 'That’s me')}
        </div>
      </div>
    </LPGShell>
  );
}

// ═════ 4 · GRID — what's usually underneath, multi-select ════════════
function LPG_Grid({ index = 4, value: v0 = ['Lonely', 'Wound up'], next = () => {}, back = () => {}, close = () => {} }) {
  const [sel, setSel] = lpgState(v0);
  const toggle = (f) => setSel((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  return (
    <LPGShell index={index} onBack={back} onClose={close}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '32px 32px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.18, letterSpacing: '0.005em', margin: '0 auto', maxWidth: 300, textAlign: 'center', textWrap: 'balance' }}>And underneath them, usually?</h1>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 15, lineHeight: 1.65, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 280, textAlign: 'center' }}>Pick every one that rings true.</p>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 22, paddingBottom: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {LPG_FEELINGS.map((f) => {
              const on = sel.includes(f);
              return (
                <button key={f} onClick={() => toggle(f)} className="tl-press" style={{
                  appearance: 'none', border: 'none', cursor: 'pointer', aspectRatio: '1 / 0.92',
                  background: on ? 'var(--fill)' : 'var(--card)', borderRadius: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
                  transition: 'background .18s ease',
                }}>
                  <span style={{ fontFamily: 'var(--font)', fontWeight: on ? 600 : 500, fontSize: 14, lineHeight: 1.25, color: on ? 'var(--on-fill)' : 'var(--ink)', textAlign: 'center', transition: 'color .18s ease' }}>{f}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <LPGCta label="Continue" enabled={sel.length > 0} onClick={next} />
    </LPGShell>
  );
}

// ═════ 5 · COLLECT — the signs, gathered and memorized ═══════════════
function LPG_Collect({ index = 5, next = () => {}, back = () => {}, close = () => {} }) {
  return (
    <LPGShell index={index} onBack={back} onClose={close}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div className="o3-stamp"><Laurel size={40} color="var(--ink)" /></div>
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, lineHeight: 1.16, letterSpacing: '0.005em', margin: '20px 0 0', maxWidth: 300, textWrap: 'balance' }}>Your scouts, on record.</h1>
        <p className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 17, lineHeight: 1.5, color: 'var(--ink2)', margin: '16px auto 0', maxWidth: 290 }}>
          “If I notice I'm <span style={{ display: 'inline-block', width: 52, borderBottom: '1.5px solid var(--ink3)', transform: 'translateY(-3px)' }} />, the wave is coming — and I go to the tools first.”
        </p>
        <div className="onb-rise" style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center', marginTop: 26 }}>
          {LPG_SIGNS.map((s) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink)', background: 'var(--card)', borderRadius: 9999, padding: '10px 16px' }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--ink)' }} />{s}
            </span>
          ))}
        </div>
      </div>
      <LPGCta label="Memorized — I'll know them" onClick={next} />
    </LPGShell>
  );
}

// ── live flow ────────────────────────────────────────────────────────
function LessonPagesFlow() {
  const [i, setI] = lpgState(0);
  const next = () => setI((v) => (v + 1) % LPG_COUNT);
  const back = () => setI((v) => Math.max(0, v - 1));
  const close = () => setI(0);
  const P = [
    <LPG_Teach key="t" index={0} next={next} back={back} close={close} />,
    <LPG_Pick key="p" index={1} next={next} back={back} close={close} />,
    <LPG_Check key="c1" index={2} q={0} next={next} back={back} close={close} />,
    <LPG_Check key="c2" index={3} q={1} next={next} back={back} close={close} />,
    <LPG_Grid key="g" index={4} next={next} back={back} close={close} />,
    <LPG_Collect key="k" index={5} next={close} back={back} close={close} />,
  ];
  return P[i];
}

// ── static boards ────────────────────────────────────────────────────
const LPGBoard_Teach = () => <LPG_Teach />;
const LPGBoard_Pick = () => <LPG_Pick value="Morning coffee" />;
const LPGBoard_Check = () => <LPG_Check />;
const LPGBoard_Grid = () => <LPG_Grid />;
const LPGBoard_Collect = () => <LPG_Collect />;

Object.assign(window, { LessonPagesFlow, LPGBoard_Teach, LPGBoard_Pick, LPGBoard_Check, LPGBoard_Grid, LPGBoard_Collect });
