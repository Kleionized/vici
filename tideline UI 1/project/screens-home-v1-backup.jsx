// screens-home.jsx — VICI "Today" home. Flat, warm, paper-like ground,
// thin-line icon set (bold duotone reserved for the profile avatar), a
// "NEXT LESSON" focus card with a photographic mountain scene, divided
// week + steps cards, a "Feeling an urge?" help bar, and a nav with a
// raised central urge button.

const { useState: hState } = React;

// SF Pro (system font on Apple devices); Helvetica/Arial as fallbacks elsewhere.
const AV = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ── palette ──────────────────────────────────────────────────────────
const ST = {
  bg: '#F7F5F0',
  card: '#FCFBF8',
  ink: '#22221C',
  ink2: '#6A6A62',
  ink3: '#9C9C92',
  ink4: '#B6B6AC',
  line: 'rgba(0,0,0,0.09)',
  hair: 'rgba(0,0,0,0.08)',
  dark: '#33342B',
  check: '#1C1C16',
};

// ── weather icons (muted grey) ───────────────────────────────────────
// ── M3 reference palette + Material Symbols helper (week/steps cards) ─
const M3 = { onBg: '#1a1c1b', onVar: '#434843', outline: '#747872', outlineVar: '#c3c8c1', inv: '#2f3130', onInv: '#f1f1ef', tint: '#536254' };
function MSym({ name, size = 24, fill = false, color }) {
  return <span className={'material-symbols-outlined' + (fill ? ' fill' : '')} style={{ fontSize: size, color }}>{name}</span>;
}

const WX = '#ADAD9F';
const WXL = '#C4C4B8';

const WEATHER = {
  cloud: (s) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <path d="M11 28a6 6 0 0 1-.4-12 9 9 0 0 1 17.3 1.2A5.4 5.4 0 0 1 28 28z" fill={WX}/>
    </svg>
  ),
  sun: (s) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <g stroke="#4A4A42" strokeWidth="2.2" strokeLinecap="round">
        <path d="M20 6v3.5M20 30.5v3.5M6 20h3.5M30.5 20h3.5M10 10l2.5 2.5M27.5 27.5l2.5 2.5M30 10l-2.5 2.5M10 30l2.5-2.5"/>
      </g>
      <circle cx="20" cy="20" r="6" fill="#4A4A42"/>
    </svg>
  ),
  suncloud: (s) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <g stroke={WX} strokeWidth="1.9" strokeLinecap="round">
        <path d="M15 5v3M6.5 9l2.1 2.1M4 17.5h3M23.5 9l-2.1 2.1M25.5 17h.01"/>
      </g>
      <circle cx="15" cy="17.5" r="4.8" fill={WX}/>
      <path d="M14 33a5.4 5.4 0 0 1-.4-10.8 8.1 8.1 0 0 1 15.6 1.1A4.9 4.9 0 0 1 29 33z" fill="#8E8E80"/>
    </svg>
  ),
  storm: (s) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <path d="M11 24a6 6 0 0 1-.4-12 9 9 0 0 1 17.3 1.2A5.4 5.4 0 0 1 28 24z" fill={WX}/>
      <path d="M20 25l-4 6h3.4l-2 6 6.6-8h-3.6l2.2-4z" fill={WXL}/>
    </svg>
  ),
  rain: (s) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <path d="M11 24a6 6 0 0 1-.4-12 9 9 0 0 1 17.3 1.2A5.4 5.4 0 0 1 28 24z" fill={WX}/>
      <g stroke={WXL} strokeWidth="2.2" strokeLinecap="round">
        <path d="M14 28l-1.6 5M20 28l-1.6 5M26 28l-1.6 5"/>
      </g>
    </svg>
  ),
};

// mood-line glyph (small sun behind cloud)
const MoodGlyph = (s) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <g stroke="#4A4A42" strokeWidth="2.4" strokeLinecap="round">
      <path d="M15 4v3.5M5.5 8l2.4 2.4M3 17.5h3.5M24.5 8l-2.4 2.4"/>
    </g>
    <circle cx="15" cy="17" r="5.4" fill="#4A4A42"/>
    <path d="M13 34a6 6 0 0 1-.4-12 9 9 0 0 1 17.3 1.2A5.4 5.4 0 0 1 30 34z" fill="#4A4A42"/>
  </svg>
);

// clock for focus card meta
const Clock = (c) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.4" stroke={c} strokeWidth="1.7"/><path d="M12 7.6V12l3 2" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// ── step icons — solid muted-grey silhouettes, same voice as the week's weather icons ──
const StepIcon = {
  water: (c) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 3c3.4 4.5 5.5 7.6 5.5 10.5a5.5 5.5 0 0 1-11 0C6.5 10.6 8.6 7.5 12 3z" fill={WX}/></svg>,
  walk: (c) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="14" cy="4.9" r="2.05" fill={WX}/>
    <path d="M13.5 8.2 12.3 13.4M12.3 13.4 15.1 16 16.3 21.1M12.3 13.4 9.7 16.6 7.1 20.2M13.3 9.4 16.9 11.9M13.3 9.4 9.9 11.6" stroke={WX} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  lesson: (c) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M11.2 6.1C9.7 5 7.7 4.4 5.6 4.5a.5.5 0 0 0-.5.5v10.5c0 .3.2.5.5.5 2 0 4.1.6 5.6 1.7z" fill={WX}/>
    <path d="M12.8 6.1c1.5-1.1 3.5-1.7 5.6-1.6.3 0 .5.2.5.5v10.5c0 .3-.2.5-.5.5-2 0-4.1.6-5.6 1.7z" fill={WX}/>
  </svg>,
  pencil: (c) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z" fill={WX}/>
  </svg>,
};

// ── avatar (top-right) — bold duotone badge ───────────────────────────
function HomeAvatar() {
  return (
    <div style={{
      width: 42, height: 42, borderRadius: 9999, flexShrink: 0,
      background: '#FAF9F8',
      boxShadow: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8.6" r="3.5" fill={ST.ink}/>
        <path d="M5.4 19.8a6.6 6.6 0 0 1 13.2 0z" fill={ST.ink}/>
      </svg>
    </div>
  );
}

// ── next-lesson background art (user-supplied mountain illustration) ──
function Mountains() {
  return (
    <img
      src="assets/next-lesson-bg.webp"
      alt=""
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: '78% 42%', pointerEvents: 'none',
      }}
    />
  );
}

// ── section label ────────────────────────────────────────────────────
function Label({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <span style={{ fontFamily: AV, fontWeight: 600, fontSize: 18, lineHeight: '24px', letterSpacing: 'normal', color: M3.onBg, whiteSpace: 'nowrap' }}>{children}</span>
      {right ? <span style={{ fontFamily: AV, fontWeight: 400, fontSize: 14, lineHeight: '20px', color: M3.onVar, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>{right}</span> : null}
    </div>
  );
}

// ── card wrapper ─────────────────────────────────────────────────────
function HomeCard({ children, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      background: '#F9F7F3',
      borderRadius: 20,
      boxShadow: 'none',
      ...style,
    }}>
      {children}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: 'none' }}></span>
    </div>
  );
}

// ── hero focus card ──────────────────────────────────────────────────
function FocusCard() {
  return (
    <HomeCard style={{ position: 'relative', overflow: 'hidden', padding: '19px 20px 18px', minHeight: 186 }}>
      <Mountains />
      {/* frosted wash over the photo — strong at the text side, clearing toward the peak */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(100deg, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 60%)', maskImage: 'linear-gradient(100deg, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 60%)' }}>
        <div style={{ position: 'absolute', inset: 0, }}></div>
      </div>
      {/* legibility tint over the glass */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(252,251,248,0.5) 0%, rgba(252,251,248,0.14) 48%, rgba(252,251,248,0) 70%)', pointerEvents: 'none' }} />
      {/* glass bevel ring, matching the other cards */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 19, boxShadow: 'none', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 149 }}>
        <div style={{ fontFamily: AV, fontWeight: 600, fontSize: 9, color: ST.ink2, letterSpacing: '0.13em' }}>NEXT LESSON</div>
        <h2 style={{ fontFamily: AV, fontWeight: 550, fontSize: 16.5, lineHeight: 1.22, letterSpacing: '-0.005em', color: ST.ink, margin: '8px 0 11px' }}>Riding out a craving</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', marginBottom: 14 }}>
          <span style={{ display: 'inline-flex' }}>{Clock(ST.ink2)}</span>
          <span className="tnum" style={{ fontFamily: AV, fontWeight: 500, fontSize: 11.5, color: ST.ink2 }}>3 min</span>
        </div>
        <button className="tl-press" style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', color: '#F4F3EF',
          borderRadius: 9999, padding: '8.5px 14px', fontFamily: AV, fontWeight: 600, fontSize: 11.5,
          boxShadow: 'none',
          letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
        }}>
          Start lesson
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="#F4F3EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </HomeCard>
  );
}

// ── 7-day week strip — label / icon / prominent date; today seated in a
//    dark badge, oldest days faded (per reference) ─────────────────
function WeekStrip({ days }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      {days.map((dd) => (
        <div key={dd.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: dd.dim ? 0.5 : 1 }}>
          <span style={{ fontFamily: AV, fontWeight: dd.sel ? 500 : 400, fontSize: 10.5, lineHeight: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: dd.sel ? M3.onBg : M3.onVar }}>{dd.dow}</span>
          <span style={{ display: 'inline-flex', transform: 'translateY(2px)' }}><MSym name={dd.icon} size={24} fill={dd.fill} color={dd.ic} /></span>
          {dd.sel ? (
            <span className="tnum" style={{ width: 32, height: 32, borderRadius: 9999, background: M3.inv, color: M3.onInv, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AV, fontWeight: 400, fontSize: 14 }}>{dd.d}</span>
          ) : (
            <span className="tnum" style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AV, fontWeight: 400, fontSize: 15, color: M3.onBg }}>{dd.d}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── steps — bare rows on the paper, no card ────────────────────────
function StepsList() {
  const [steps, setSteps] = hState([
    { id: 'water', icon: 'water_drop', fill: true, label: 'Drink a glass of water', done: true },
    { id: 'walk', icon: 'directions_walk', fill: false, label: 'Take a 10-minute walk', done: true },
    { id: 'lesson', icon: 'menu_book', fill: false, label: "Read today's lesson", done: false },
    { id: 'log', icon: 'edit_note', fill: false, label: "Log how you're feeling", done: false },
  ]);
  const toggle = (id) => setSteps(steps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((s, i) => (
        <button key={s.id} onClick={() => toggle(s.id)} className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', width: '100%', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0, opacity: s.done ? 0.4 : 1, transition: 'opacity .25s' }}>
            <MSym name={s.icon} size={24} fill={s.fill} color={M3.tint} />
            <span style={{ flex: 1, textAlign: 'left', fontFamily: AV, fontWeight: 400, fontSize: 16, letterSpacing: 'normal', lineHeight: '24px', color: M3.onBg, textDecoration: s.done ? 'line-through' : 'none', textDecorationColor: 'rgba(67,72,67,0.5)', transition: 'color .25s' }}>{s.label}</span>
          </span>
          {s.done ? (
            <span style={{ width: 28, height: 28, borderRadius: 9999, flexShrink: 0, background: M3.inv, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MSym name="check" size={16} color={M3.onInv} />
            </span>
          ) : (
            <span style={{ width: 28, height: 28, borderRadius: 9999, flexShrink: 0, border: `2px solid ${M3.outlineVar}`, transition: 'border-color .2s' }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ── "feeling an urge?" help bar ──────────────────────────────────────
function UrgeBar() {
  return (
    <button className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', width: '100%', background: '#F0EFE9', borderRadius: 16, boxShadow: 'none', padding: '13px 17px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 28, height: 28, borderRadius: 9999, border: `1.5px solid ${ST.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Laurel size={17} color={ST.ink} />
      </span>
      <span style={{ flex: 1, textAlign: 'left', fontFamily: AV, fontWeight: 600, fontSize: 13.5, letterSpacing: 'normal', color: ST.ink }}>Feeling an urge?</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: AV, fontWeight: 600, fontSize: 13.5, color: ST.ink }}>
        Get help
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke={ST.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </button>
  );
}

// ── bottom nav — thin-line icons + raised central urge button ────────
const NAV_ICON = {
  home: (c, on) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4V15h-5.6v5.8H4.8A.8.8 0 0 1 4 20z" fill={on ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  journey: (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.8"/><path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  log: (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  you: (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke={c} strokeWidth="1.8"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
};
function StoicNav({ active = 'today' }) {
  const items = [
    ['today', 'home'],
    ['journey', 'journey'],
    ['urge', null],
    ['log', 'log'],
    ['you', 'you'],
  ];
  // bar silhouette: rounded rect (y 33→95) + a convex dome bulging out of the
  // top edge around the urge button. 366 = 402 screen − 2×18 padding.
  const BAR_PATH = "M26 33H152.5A37 37 0 0 1 213.5 33H340A26 26 0 0 1 366 59V69A26 26 0 0 1 340 95H26A26 26 0 0 1 0 69V59A26 26 0 0 1 26 33Z";
  const BAR_CLIP = `path('${BAR_PATH}')`;
  return (
    <div style={{ position: 'relative', padding: '0 18px 20px' }}>
      <div style={{ position: 'relative', height: 95 }}>
        {/* soft shadow following the humped silhouette */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, filter: 'blur(13px)', transform: 'translateY(9px)', opacity: 0.32, pointerEvents: 'none' }}>
          <div style={{ width: '100%', height: '100%', clipPath: BAR_CLIP, background: 'rgba(50,49,40,0.6)' }}></div>
        </div>
        {/* frosted-white bar — clip lives on the wrapper so the backdrop blur is clipped to the hump too (fixes the stray rectangle) */}
        <div style={{ position: 'absolute', inset: 0, clipPath: BAR_CLIP }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: '#FBFBF9',
            }}></div>
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'none' }}></span>
          <div style={{ position: 'absolute', left: 12, right: 12, top: 33, bottom: 0, display: 'flex', alignItems: 'center' }}>
            {items.map(([id, icon]) => {
              if (!icon) return <div key="sp" style={{ width: 78, flexShrink: 0 }}></div>;
              const on = id === active;
              const c = on ? ST.ink : ST.ink3;
              return (
                <button key={id} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '8px 0 0' }}>
                  {NAV_ICON[icon](c, on)}
                  <span style={{ width: 14, height: 2.5, borderRadius: 9999, background: on ? ST.ink : 'transparent' }}></span>
                </button>
              );
            })}
          </div>
        </div>
        {/* hairline edge tracing the silhouette */}
        <svg aria-hidden="true" width="366" height="95" viewBox="0 0 366 95" fill="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'block' }}>
          <path d={BAR_PATH} stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none"></path>
        </svg>
        {/* urge button, riding in the dome */}
        <div style={{ position: 'absolute', left: '50%', top: 54, transform: 'translate(-50%, -50%)' }}>
          <button className="tl-press" style={{
            appearance: 'none', border: 'none', cursor: 'pointer', width: 52, height: 52, borderRadius: 9999,
            background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'none',
          }}>
            <Laurel size={25} color={'#F4F3EF'} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── the screen ──────────────────────────────────────────────────────
function TodayScreen() {
  const days = [
    { dow: 'Sat', d: 22, icon: 'cloud', fill: true, ic: M3.outline, dim: true },
    { dow: 'Sun', d: 23, icon: 'partly_cloudy_day', fill: true, ic: M3.outline, dim: true },
    { dow: 'Mon', d: 24, icon: 'sunny', fill: false, ic: M3.onVar },
    { dow: 'Tue', d: 25, icon: 'partly_cloudy_day', fill: true, ic: M3.onVar },
    { dow: 'Wed', d: 26, icon: 'thunderstorm', fill: true, ic: M3.outline },
    { dow: 'Thu', d: 27, icon: 'rainy', fill: true, ic: M3.outline },
    { dow: 'Fri', d: 28, icon: 'partly_cloudy_day', fill: true, ic: M3.onVar, sel: true },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: ST.bg, fontFamily: AV, color: ST.ink, overflow: 'hidden' }}>
      {/* ambient tone pools — give the glass cards something to diffuse */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -90, right: -100, width: 360, height: 360, borderRadius: 9999, background: 'radial-gradient(circle, rgba(213,206,186,0.5), rgba(213,206,186,0) 66%)' }}></div>
        <div style={{ position: 'absolute', top: 320, left: -130, width: 400, height: 400, borderRadius: 9999, background: 'radial-gradient(circle, rgba(201,205,197,0.46), rgba(201,205,197,0) 66%)' }}></div>
        <div style={{ position: 'absolute', bottom: 30, right: -80, width: 320, height: 320, borderRadius: 9999, background: 'radial-gradient(circle, rgba(218,212,196,0.42), rgba(218,212,196,0) 66%)' }}></div>
      </div>
      {/* content scrolls under the glass nav */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '76px 24px 140px' }}>
        {/* header: title + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '38px 0 0' }}>
          <h1 className="tnum" style={{ fontFamily: AV, fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em', lineHeight: 0.98, color: ST.ink, margin: 0 }}>Day 24</h1>
          <HomeAvatar />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 46px' }}>
          <span style={{ display: 'inline-flex', width: 22, height: 22, flexShrink: 0 }}>{MoodGlyph(22)}</span>
          <span style={{ fontFamily: AV, fontWeight: 400, fontSize: 13.5, color: ST.ink3, whiteSpace: 'nowrap' }}>You're feeling <span style={{ color: ST.ink, fontWeight: 500 }}>good</span> today</span>
        </div>

        <FocusCard />

        <div style={{ marginTop: 54 }}>
          <Label right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>Analytics <MSym name="chevron_right" size={16} color={M3.onVar} /></span>}>Your week</Label>
          <HomeCard style={{ padding: '18px 12px 12px' }}><WeekStrip days={days} /></HomeCard>
        </div>

        <div style={{ marginTop: 46 }}>
          <Label right="2 of 4">Today's steps</Label>
          <HomeCard style={{ padding: '14px 20px' }}><StepsList /></HomeCard>
        </div>

        <div style={{ marginTop: 30 }}><UrgeBar /></div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5 }}><StoicNav active="today" /></div>
    </div>
  );
}

Object.assign(window, { TodayScreen });
