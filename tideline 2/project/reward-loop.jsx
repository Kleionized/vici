// reward-loop.jsx — VICI Phase 5 · the daily loop's rewards, honest.
// The loop is trigger → action → reward → investment, but the reward
// register is earned quiet: ink fills, the week strip darkens, the day
// count climbs in numerals. Variability only from real variety.
// Boards: the day kept (live) · a slip, logged · a keepsake, earned.

const { useState: rlState, useEffect: rlEffect } = React;

// ── the week strip — mood-ramp days, today rings then fills ──────────
function RLWeekStrip({ todayDone }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const past = [1, 2, 3, 2]; // mood-ramp indices for the four kept days
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
      {days.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
          <span style={{ position: 'relative', width: 26, height: 26, borderRadius: 9999, overflow: 'hidden',
            background: i < 4 ? MOOD_TONES[past[i]] : 'transparent',
            boxShadow: i === 4 && !todayDone ? 'inset 0 0 0 1.6px var(--ink)' : i > 4 ? 'inset 0 0 0 1.4px var(--soft2)' : 'none' }}>
            {i === 4 && todayDone ? <span className="o3-bleed" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'var(--fill)' }} /> : null}
          </span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: i === 4 ? 600 : 400, fontSize: 10, letterSpacing: '0.08em', color: i === 4 ? 'var(--ink)' : 'var(--ink3)' }}>{d}</span>
        </div>
      ))}
    </div>
  );
}

// ── 1 · the day kept — the whole loop's reward, live ─────────────────
// Complete the last step: ink bleed → the week strip darkens → the one
// line deepens while the rest recedes → the rule draws → life resumes.
function RLDailyLoopScreen() {
  const [done, setDone] = rlState(false);
  const [ph, setPh] = rlState('idle'); // idle → deep → after
  const complete = () => {
    if (done) { setDone(false); setPh('idle'); return; }
    setDone(true);
    setTimeout(() => setPh('deep'), 700);
    setTimeout(() => setPh('after'), 3300);
  };
  const dim = ph === 'deep';
  const fade = { transition: 'opacity .55s ease', opacity: dim ? 0.2 : 1 };
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '70px 26px 36px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...fade }}>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, letterSpacing: '0.24em', textIndent: '0.24em', textTransform: 'uppercase', color: 'var(--ink)' }}>Day {done ? 'XXIV' : 'XXIV'}</span>
        <span aria-hidden="true" style={{ display: 'block', width: 40, height: 1.5, background: 'var(--ink)', marginTop: 9 }} />
      </div>
      <div style={{ marginTop: 24, ...fade }}>
        <SectionLabel right={done ? '3 of 3' : '2 of 3'}>Today's steps</SectionLabel>
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '2px 20px', marginTop: 8 }}>
          <MVChecklistRow label="Morning check-in" done onToggle={() => {}} />
          <MVChecklistRow label="Read today's lesson" done onToggle={() => {}} />
          <MVChecklistRow label="Ten quiet breaths" done={done} onToggle={complete} last />
        </div>
      </div>
      {/* the reward line — the element that deepens */}
      <div style={{ marginTop: 30, textAlign: 'center', minHeight: 86 }}>
        {done ? (
          <React.Fragment>
            <div className="o3-stamp" style={{ animationDelay: '0.75s', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, color: 'var(--ink)' }}>The day is kept.</div>
            <span aria-hidden="true" className="o3-rulegrow" style={{ display: 'block', height: 1.5, background: 'var(--ink)', margin: '14px auto 0', animationDelay: '1.7s' }} />
            <div className="o3-riseline" style={{ animationDelay: '2.6s', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', marginTop: 12 }}>Tomorrow wakes as Day XXV.</div>
          </React.Fragment>
        ) : (
          <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink3)', paddingTop: 8 }}>One step left. No fanfare waiting — just the quiet.</div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={fade}>
        <SectionLabel right="wk IV">This week</SectionLabel>
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '16px 18px', marginTop: 8 }}>
          <RLWeekStrip todayDone={done} />
        </div>
      </div>
      <div style={{ ...fade, marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink3)' }}>The reward register</span>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: 'var(--ink2)' }}>ink fill · strip darkens · numeral climbs</span>
      </div>
    </div>
  );
}

// ── 2 · a slip, logged — the same calm UI as logging a win ───────────
function RLSlipScreen() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '70px 26px 40px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Logged · Day XXIV</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.2, margin: '14px auto 0', maxWidth: 300, color: 'var(--ink)' }}>A wave took you. It's on the page now.</h1>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '4px 20px' }}>
          {[['When', '1:47 am · the late window'], ['What set it off', 'alone · scrolling'], ['What it taught', 'the phone sleeps outside the room']].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{k}</span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '18px 10px 6px' }}>
          <QuoteMark size={46} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, color: 'var(--ink)', marginTop: 2 }}>Don't fail twice.</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink2)', marginTop: 10, textWrap: 'pretty' }}>A slip is a data point. Day XXIV stands; tomorrow is Day XXV either way. The campaign holds its ground.</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="tl-press" style={{ appearance: 'none', border: 'none', cursor: 'pointer', background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15, borderRadius: 9999, padding: '16px 34px', minWidth: 232 }}>Back to the day</button>
      </div>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: 'var(--ink3)', textAlign: 'center', marginTop: 12 }}>Same screen grammar as logging a win. No red. Nothing resets.</div>
    </div>
  );
}

// ── 3 · a keepsake, earned — real actions only ───────────────────────
function RLKeepsakeScreen() {
  const [k, setK] = rlState(0);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '70px 26px 40px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Keepsake · earned</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.2, margin: '12px auto 0', color: 'var(--ink)' }}>Ten waves, ridden.</h1>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div key={k} style={{ position: 'relative' }}>
          <O3Medallion size={196} animate delay={0.25} />
          {/* tier pips — ×10 fills the first */}
          <div style={{ position: 'absolute', left: '50%', bottom: -26, transform: 'translateX(-50%)', display: 'flex', gap: 7 }}>
            {[1, 0, 0, 0].map((on, i) => (
              <span key={i} className={on ? 'o3-riseline' : undefined} style={{ animationDelay: on ? '2s' : undefined, width: 7, height: 7, borderRadius: 9999, background: on ? 'var(--ink)' : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 1.3px var(--soft2)' }} />
            ))}
          </div>
        </div>
        <div className="o3-stamp" key={`t${k}`} style={{ animationDelay: '2.2s', marginTop: 44, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink)' }}>Wave Rider · I</div>
          <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', marginTop: 7 }}>×10 · next tier at ×25</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
        {[['Earned for', 'ten urges outlasted — logged, not claimed'], ['Never for', 'opening the app · paying · showing up hollow']].map(([a, b], i, arr) => (
          <div key={a} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{a}</span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink)', textAlign: 'right' }}>{b}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <button onClick={() => setK((v) => v + 1)} className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1.4px solid var(--soft2)', borderRadius: 9999, padding: '8px 18px', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 12, color: 'var(--ink)' }}>Replay the etch</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RLWeekStrip, RLDailyLoopScreen, RLSlipScreen, RLKeepsakeScreen });
