// screens-home.jsx — VICI "Today" home, redesigned to the editorial
// reference: laurel + avatar header, letterspaced DAY XXIV, a huge serif
// maxim, one dark NEXT LESSON card (inverted faceted-mountain art, white
// circular go button), a hairline-divided checklist, and a flat bottom
// nav with a raised dark urge circle. Solid fills only — no shadows,
// no glass, no card borders.
// (previous design preserved in screens-home-v1-backup.jsx)

const { useState: hState } = React;

// ── palette — the app's paper/ink system ─────────────────────────────
const ST = {
  bg: '#F4F3F0',
  ink: '#1D1C1A',
  ink2: '#55534E',
  ink3: '#8B8882',
  ring: '#B9B6AF',
  hair: 'rgba(0,0,0,0.1)',
  dark: '#131313',        // lesson card + center button — matches the night art
  paper: '#F5F4F1',       // light-on-dark
};
const SERIF = 'var(--serif)';
const SERIF2 = "'Newsreader', 'Iowan Old Style', Georgia, serif"; // headers — sharper than Garamond
const SANS = 'var(--font)';
const CARD_BG = '#FFFFFF';

// ── streak pill — flame + day count (replaces the laurel) ──────────
function HomeLaurel() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#FFFFFF', borderRadius: 9999, padding: '7px 13px 7px 11px',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.2c.4 2.6-.9 4.1-2.3 5.6C8.2 10.4 7 12 7 14.4A5.4 5.4 0 0 0 12.4 19.8 5.6 5.6 0 0 0 18 14.2c0-2.1-1-3.6-2.1-4.9-.3 1-.9 1.9-1.9 2.4.3-2.7-.6-6.3-2-8.5z" fill={ST.ink}/>
      </svg>
      <span className="tnum" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14.5, color: ST.ink }}>24</span>
    </div>
  );
}

// ── avatar (top-right) — bare line glyph, no badge ───────────────────
function HomeAvatar() {
  return (
    <button aria-label="Profile" className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
      <span style={{
        width: 34, height: 34, borderRadius: 9999, background: ST.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9.2" r="3.1" stroke={ST.paper} strokeWidth="1.6"/>
          <path d="M5.9 18.4c1-2.7 3.4-4.2 6.1-4.2s5.1 1.5 6.1 4.2" stroke={ST.paper} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </span>
    </button>
  );
}

// ── the dark NEXT LESSON card ────────────────────────────────────────
function FocusCard() {
  return (
    <div className="tl-press-soft" style={{
      position: 'relative', overflow: 'hidden', borderRadius: 20,
      background: ST.dark, height: 214, cursor: 'pointer',
    }}>
      {/* supplied night-mountain scene — the winding path */}
      <img
        src="assets/next-lesson-dark.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 32%', pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', height: '100%', padding: '22px 22px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.62)' }}>Next lesson</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 24, lineHeight: 1.14, letterSpacing: '0.005em', color: ST.paper, margin: '8px 0 0', whiteSpace: 'nowrap' }}>
          Riding out a craving
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="rgba(245,244,241,0.65)" strokeWidth="1.8"/><path d="M12 7.5V12l3 2" stroke="rgba(245,244,241,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="tnum" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 13.5, letterSpacing: '0.02em', color: 'rgba(245,244,241,0.65)' }}>3 min read</span>
        </div>
        <button className="tl-press" aria-label="Start lesson" style={{
          appearance: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto',
          width: 42, height: 42, borderRadius: 9999, background: ST.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4.5 12h14M12.5 5.5 19 12l-6.5 6.5" stroke={ST.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── section header — lives outside the cards, bold editorial ───────
function SectionHead({ title, meta }) {
  return (
    <div style={{ padding: '0 4px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: ST.ink }}>{title}</div>
        {meta && <div className="tnum" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 13.5, color: ST.ink3 }}>{meta}</div>}
      </div>
    </div>
  );
}

// ── checklist — today's steps, composed as a solid card ──────────
function StepsList() {
  const [steps, setSteps] = hState([
    { id: 'water', label: 'Drink a glass of water', done: true },
    { id: 'walk', label: 'Take a 10-minute walk', done: true },
    { id: 'lesson', label: "Read today's lesson", done: false },
    { id: 'log', label: "Log how you're feeling", done: false },
  ]);
  const toggle = (id) => setSteps(steps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  const doneCount = steps.filter((s) => s.done).length;
  return (
    <div>
      <SectionHead title="Today's steps" meta={`${doneCount} of ${steps.length}`} />
      <div style={{ background: CARD_BG, borderRadius: 18, padding: '4px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((s, i) => (
            <button key={s.id} onClick={() => toggle(s.id)} className="tl-press-soft" style={{
              appearance: 'none', cursor: 'pointer', width: '100%', background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0',
              borderBottom: i < steps.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 9999, flexShrink: 0, boxSizing: 'border-box',
                background: s.done ? ST.ink : 'transparent',
                border: s.done ? 'none' : `1.5px solid ${ST.ring}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .18s, border-color .18s',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: s.done ? 1 : 0, transform: s.done ? 'scale(1)' : 'scale(0.5)', transition: 'opacity .18s, transform .18s' }}><path d="m5 12.5 4.5 4.5L19 7.5" stroke={ST.paper} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span style={{ flex: 1, textAlign: 'left', fontFamily: SANS, fontWeight: 450, fontSize: 17, letterSpacing: '0.01em', lineHeight: '26px', color: s.done ? ST.ink3 : ST.ink, textDecoration: s.done ? 'line-through' : 'none', textDecorationColor: 'rgba(29,28,26,0.45)', textDecorationThickness: '1px', transition: 'color .18s' }}>{s.label}</span>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ flexShrink: 0 }}><path d="m1.5 1.5 5 5.5-5 5.5" stroke={ST.ink3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── your week moods — 7-day strip, past five logged ────────────────
const MOOD_TONES = ['#C9C6BE', '#AFACA3', '#918E85', '#6B6960', '#33312D'];
function MoodCheckin() {
  // mood: 0–4 index into tones · null = not logged
  const [week, setWeek] = hState([
    { d: 'M', mood: 0 }, { d: 'T', mood: 1 }, { d: 'W', mood: 2 },
    { d: 'T', mood: 2 }, { d: 'F', mood: 3 },
    { d: 'S', mood: 4, today: true }, { d: 'S', mood: null, future: true },
  ]);
  const cycleToday = () => setWeek(week.map((w) => (w.today ? { ...w, mood: w.mood === null ? 2 : (w.mood + 1) % 5 } : w)));
  return (
    <div>
      <SectionHead title="Your week moods" meta="steady" />
      <div style={{ background: CARD_BG, borderRadius: 20, padding: '18px 20px 19px' }}>
        <div style={{ display: 'flex' }}>
        {week.map((w, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: SANS, fontWeight: w.today ? 700 : 500, fontSize: 11, letterSpacing: '0.06em', color: w.today ? ST.ink : ST.ink3 }}>{w.d}</span>
            {w.today ? (
              <button onClick={cycleToday} aria-label="Log today's mood" className="tl-press" style={{
                appearance: 'none', cursor: 'pointer', width: 34, height: 34, borderRadius: 9999, boxSizing: 'border-box',
                background: 'transparent', border: `1.5px solid ${ST.ink}`, padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  width: 25, height: 25, borderRadius: 9999, boxSizing: 'border-box',
                  background: w.mood === null ? 'transparent' : MOOD_TONES[w.mood],
                  border: w.mood === null ? `1.5px dashed ${ST.ring}` : 'none',
                  transition: 'background .18s',
                }} />
              </button>
            ) : w.mood === null ? (
              <span style={{ width: 30, height: 30, borderRadius: 9999, boxSizing: 'border-box', border: `1px solid ${ST.ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={ST.ink3} strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
            ) : (
              <span style={{ width: 30, height: 30, borderRadius: 9999, background: MOOD_TONES[w.mood] }} />
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

// ── bottom nav — flat on the paper, dark raised urge circle ──────────
const NAV_ICON = {
  home: (c, on) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4V15h-5.6v5.8H4.8A.8.8 0 0 1 4 20z" fill={on ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  journey: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.8"/><path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  log: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  you: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke={c} strokeWidth="1.8"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
};
function HomeTab({ id, icon, label, active }) {
  const c = active ? ST.ink : ST.ink3;
  return (
    <button className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 0 }}>
      {NAV_ICON[icon](c, active)}
      <span style={{ fontFamily: SANS, fontWeight: active ? 600 : 400, fontSize: 12, letterSpacing: '0.02em', color: c }}>{label}</span>
    </button>
  );
}
function StoicNav({ active = 'today' }) {
  return (
    <div style={{ background: ST.bg, display: 'flex', alignItems: 'flex-end', padding: '14px 18px 24px' }}>
      <HomeTab icon="home" label="Today" active={active === 'today'} />
      <HomeTab icon="journey" label="Journey" active={active === 'journey'} />
      <div style={{ flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <button className="tl-press" aria-label="Feeling an urge?" style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          width: 52, height: 52, borderRadius: 9999, background: ST.dark,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="25" height="17" viewBox="0 0 34 20" fill="none"><path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke={ST.paper} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <HomeTab icon="log" label="Log" active={active === 'log'} />
      <HomeTab icon="you" label="You" active={active === 'you'} />
    </div>
  );
}

// ── the screen ──────────────────────────────────────────────────────
function TodayScreen({ scrollToBottom }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: ST.bg, fontFamily: SANS, color: ST.ink, overflow: 'hidden' }}>
      {/* content — nav sits below it, flat */}
      <div ref={(el) => { if (el && scrollToBottom) el.scrollTop = el.scrollHeight; }} style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '64px 29px 120px' }}>
        {/* header: laurel · day · avatar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <HomeLaurel />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: ST.ink, textIndent: '0.24em' }}>Day XXIV</span>
            <span aria-hidden="true" style={{ width: 40, height: 1.5, background: ST.ink }} />
          </div>
          <HomeAvatar />
        </div>

        {/* quote */}
        <div aria-hidden="true" style={{ textAlign: 'center', marginTop: 34, height: 32, overflow: 'visible' }}>
          <span style={{ fontFamily: SERIF2, fontWeight: 500, fontSize: 60, lineHeight: 1, color: 'rgba(29,28,26,0.2)' }}>“</span>
        </div>
        <h1 style={{ fontFamily: SERIF2, fontWeight: 500, fontSize: 24, lineHeight: 1.22, letterSpacing: '-0.003em', color: ST.ink, margin: '0 auto 0', maxWidth: 280, textAlign: 'center', textWrap: 'balance' }}>
          A craving is a tide — it rises, peaks, and always recedes.
        </h1>

        {/* next lesson */}
        <div style={{ marginTop: 48 }}><FocusCard /></div>

        {/* today's steps */}
        <div style={{ marginTop: 46 }}><StepsList /></div>

        {/* week moods */}
        <div style={{ marginTop: 40 }}><MoodCheckin /></div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5 }}><StoicNav active="today" /></div>
    </div>
  );
}

// ── detail board: the scrolled state — sticky header + steps + moods + nav ──
function TodayScreenMoods() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: ST.bg, fontFamily: SANS, color: ST.ink, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', padding: '0 29px' }}>
        {/* sticky header — persists while the page scrolls */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 64 }}>
          <HomeLaurel />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 64 + 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: ST.ink, textIndent: '0.24em' }}>Day XXIV</span>
            <span aria-hidden="true" style={{ width: 40, height: 1.5, background: ST.ink }} />
          </div>
          <HomeAvatar />
        </div>
        <div style={{ marginTop: 40 }}><StepsList /></div>
        <div style={{ marginTop: 40 }}><MoodCheckin /></div>

        {/* footer — wave divider + maxim */}
        <div style={{ marginTop: 44, position: 'relative' }}>
          <div aria-hidden="true" style={{ height: 1, background: ST.hair }} />
          <span style={{
            position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)',
            width: 38, height: 38, borderRadius: 9999, background: '#FDFDFC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none"><path d="M1 5.5C3 1.5 5 1.5 8 4s5 2.5 7-1.5" stroke={ST.ink2} strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
        </div>
        <p style={{ fontFamily: SERIF2, fontWeight: 500, fontSize: 19, lineHeight: 1.4, color: ST.ink, textAlign: 'center', margin: '38px auto 0', maxWidth: 250 }}>
          Small steps. Steady days.<br />That’s how it changes.
        </p>

        {/* valley river — grounds the page, runs under the nav */}
        <div style={{ position: 'relative', width: 'calc(100% + 58px)', margin: '30px -29px 0', height: 300 }}>
          <img
            src="assets/valley-river.webp"
            alt=""
            aria-hidden="true"
            style={{
              display: 'block', width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 42%', pointerEvents: 'none',
              maskImage: 'linear-gradient(180deg, transparent 0, #000 26%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 26%)',
            }}
          />
          {/* dim wash so the river doesn't glare */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(244,243,240,0) 0%, rgba(58,56,52,0.14) 46%, rgba(43,41,38,0.3) 100%)',
          }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5 }}><StoicNav active="today" /></div>
    </div>
  );
}

Object.assign(window, { TodayScreen, TodayScreenMoods });
