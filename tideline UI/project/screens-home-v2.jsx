// screens-home-v2.jsx — "Today" home redesigned in the whisker reference style:
// big friendly greeting + circular bell, two soft action tiles, a hero card
// with a large arc gauge + outlined "view" pill, a full-height pill-bar week
// chart with a tooltip badge on today, icon-in-circle steps list, and a flat
// white bottom nav. Colors stay VICI paper/ink — only the style changes.

const { useState: h2State } = React;

const HV = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const H2 = {
  bg: '#F7F5F0',
  card: '#FCFBF8',
  ink: '#22221C',
  ink2: '#6A6A62',
  ink3: '#9C9C92',
  ink4: '#B6B6AC',
  line: 'rgba(0,0,0,0.09)',
  hair: 'rgba(0,0,0,0.08)',
  soft: 'rgba(0,0,0,0.045)',
  tile: '#EDEBE4',
  check: '#1C1C16',
};

// ── line icons (drawn at 24, scaled by size prop) ────────────────────
const H2Icon = {
  bell: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.6 5.4 2.2 6.2.3.4 0 .8-.5.8H4.3c-.5 0-.8-.4-.5-.8C4.4 15.4 6 14 6 10z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M10 20a2.2 2.2 0 0 0 4 0" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  suncloud: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <g stroke={c} strokeWidth="2" strokeLinecap="round">
        <path d="M15 6v3M7 9.5l2.1 2.1M4.5 17.5h3M23 9.5l-2.1 2.1"/>
      </g>
      <circle cx="15" cy="17.5" r="5" stroke={c} strokeWidth="2"/>
      <path d="M14 33a5.4 5.4 0 0 1-.4-10.8 8.1 8.1 0 0 1 15.6 1.1A4.9 4.9 0 0 1 29 33z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  wave: (s, c, w = 2) => (
    <Laurel size={s} color={c} />
  ),
  compass: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.8"/>
      <path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  chevR: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 5.5 15.5 12 9 18.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  water: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5c3.2 4.3 5.2 7.3 5.2 10a5.2 5.2 0 0 1-10.4 0c0-2.7 2-5.7 5.2-10z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  walk: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="14" cy="4.9" r="1.9" stroke={c} strokeWidth="1.6"/>
      <path d="M13.5 8.2 12.3 13.4M12.3 13.4 15.1 16 16.3 21.1M12.3 13.4 9.7 16.6 7.1 20.2M13.3 9.4 16.9 11.9M13.3 9.4 9.9 11.6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  book: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 6c-1.6-1.2-3.8-1.8-6-1.7V16c2.2-.1 4.4.5 6 1.7M12 6c1.6-1.2 3.8-1.8 6-1.7V16c-2.2-.1-4.4.5-6 1.7M12 6v11.7" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pencil: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
  home: (s, c, on) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4V15h-5.6v5.8H4.8A.8.8 0 0 1 4 20z" fill={on ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  you: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.6" stroke={c} strokeWidth="1.8"/>
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
};

// ── header: greeting + bell ──────────────────────────────────────────
function H2Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontFamily: HV, fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1.05, color: H2.ink, margin: 0 }}>Good morning</h1>
        <p style={{ fontFamily: HV, fontWeight: 500, fontSize: 15, color: H2.ink2, margin: '8px 0 0', lineHeight: 1.35 }}>
          Day 24 — you're feeling <span style={{ color: H2.ink, fontWeight: 500 }}>good</span> today
        </p>
      </div>
      <button className="tl-press" style={{
        appearance: 'none', cursor: 'pointer', width: 46, height: 46, borderRadius: 9999, flexShrink: 0,
        background: H2.card, border: `1px solid ${H2.line}`, boxShadow: 'var(--shadow-card)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {H2Icon.bell(23, H2.ink)}
      </button>
    </div>
  );
}

// ── two soft action tiles ────────────────────────────────────────────
function H2Tiles() {
  const tile = {
    appearance: 'none', cursor: 'pointer', flex: 1, borderRadius: 24, padding: '22px 12px 19px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
  };
  return (
    <div style={{ display: 'flex', gap: 13, marginTop: 24 }}>
      <button className="tl-press" style={{ ...tile, background: H2.tile, border: `1px solid ${H2.line}` }}>
        <span style={{ display: 'inline-flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>{H2Icon.suncloud(32, H2.ink)}</span>
        <span style={{ fontFamily: HV, fontWeight: 500, fontSize: 14.5, letterSpacing: '-0.01em', color: H2.ink }}>Daily check-in</span>
      </button>
      <button className="tl-press" style={{ ...tile, background: H2.card, border: `1px solid ${H2.line}`, boxShadow: 'var(--shadow-card)' }}>
        <span style={{ display: 'inline-flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>{H2Icon.wave(30, H2.ink, 2.2)}</span>
        <span style={{ fontFamily: HV, fontWeight: 500, fontSize: 14.5, letterSpacing: '-0.01em', color: H2.ink }}>Urge help</span>
      </button>
    </div>
  );
}

// ── section header ───────────────────────────────────────────────────
function H2Label({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 2px', marginBottom: 14 }}>
      <span style={{ fontFamily: HV, fontWeight: 700, fontSize: 18, letterSpacing: '-0.015em', color: H2.ink, whiteSpace: 'nowrap' }}>{children}</span>
      {right ? <span style={{ fontFamily: HV, fontWeight: 500, fontSize: 13.5, color: H2.ink2, whiteSpace: 'nowrap' }}>{right}</span> : null}
    </div>
  );
}

function H2Card({ children, style = {} }) {
  return <div style={{ background: H2.card, border: `1px solid ${H2.line}`, borderRadius: 24, boxShadow: 'var(--shadow-card)', ...style }}>{children}</div>;
}

// ── hero: big arc gauge (day 24 of 90) + outlined pill ───────────────
function H2Gauge() {
  const R = 84, C = 2 * Math.PI * R;
  const track = C * 0.75;               // 270° sweep
  const p = 24 / 90;
  return (
    <H2Card style={{ padding: '19px 19px 17px' }}>
      {/* top row — plan + week, like the ref's name/date row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ width: 38, height: 38, borderRadius: 9999, background: H2.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {H2Icon.wave(19, H2.ink, 2.4)}
        </span>
        <span style={{ flex: 1, fontFamily: HV, fontWeight: 500, fontSize: 15.5, letterSpacing: '-0.01em', color: H2.ink }}>90-Day Rewire</span>
        <span className="tnum" style={{ fontFamily: HV, fontWeight: 500, fontSize: 13, color: H2.ink3 }}>Week 4</span>
      </div>

      {/* the gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 2px' }}>
        <div style={{ position: 'relative', width: 208, height: 176 }}>
          <svg width="208" height="208" viewBox="0 0 208 208" style={{ position: 'absolute', top: 0, left: 0 }}>
            <g transform="rotate(135 104 104)">
              <circle cx="104" cy="104" r={R} fill="none" stroke={H2.soft} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${track} ${C}`}/>
              <circle className="o2-gauge" cx="104" cy="104" r={R} fill="none" stroke="url(#h2fill)" strokeWidth="13" strokeLinecap="round"
                strokeDasharray={`${track * p} ${C}`} style={{ '--o2-gfrom': track * p + 40 }}/>
            </g>
            <defs>
              <linearGradient id="h2fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--fill-hi)"/><stop offset="1" stopColor="var(--fill-lo)"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center' }}>
            <div className="tnum" style={{ fontFamily: HV, fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', lineHeight: 1, color: H2.ink }}>24</div>
            <div style={{ fontFamily: HV, fontWeight: 500, fontSize: 14, color: H2.ink2, marginTop: 7 }}>days steady</div>
          </div>
        </div>
      </div>

      {/* outlined "view" pill, per the ref */}
      <button className="tl-press-soft" style={{
        appearance: 'none', cursor: 'pointer', width: '100%', height: 52, borderRadius: 16,
        background: 'transparent', border: `1px solid ${H2.line}`,
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 15px',
      }}>
        <span style={{ display: 'inline-flex' }}>{H2Icon.compass(21, H2.ink)}</span>
        <span style={{ flex: 1, textAlign: 'left', fontFamily: HV, fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', color: H2.ink }}>View journey</span>
        {H2Icon.chevR(18, H2.ink2)}
      </button>
    </H2Card>
  );
}

// ── week: full-height pill bars, today filled + tooltip badge ────────
function H2Week() {
  const days = [
    { dow: 'Sat', d: 22, v: 0.42 },
    { dow: 'Sun', d: 23, v: 0.55 },
    { dow: 'Mon', d: 24, v: 0.78 },
    { dow: 'Tue', d: 25, v: 0.6 },
    { dow: 'Wed', d: 26, v: 0.26 },
    { dow: 'Thu', d: 27, v: 0.46 },
    { dow: 'Fri', d: 28, v: 0.7, sel: true },
  ];
  const TRACK = 116, PW = 24;
  return (
    <H2Card style={{ padding: '52px 20px 16px' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {days.map((dd) => (
          <div key={dd.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: PW, height: TRACK }}>
              {dd.sel ? (
                <span style={{
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -38,
                  background: H2.check, color: '#F4F3EF', borderRadius: 9, padding: '5px 10px',
                  fontFamily: HV, fontWeight: 500, fontSize: 11.5, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                  boxShadow: 'none',
                }}>
                  Good
                  <span style={{ position: 'absolute', left: '50%', bottom: -4, transform: 'translateX(-50%) rotate(45deg)', width: 8, height: 8, background: H2.check, borderRadius: 1.5 }} />
                </span>
              ) : null}
              <span style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: H2.soft }} />
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: 9999,
                height: `${Math.round(dd.v * 100)}%`,
                background: dd.sel ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'rgba(0,0,0,0.13)',
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontFamily: HV, fontWeight: 500, fontSize: 11, color: dd.sel ? H2.ink : H2.ink3 }}>{dd.dow}</span>
              <span className="tnum" style={{ fontFamily: HV, fontWeight: 400, fontSize: 10, color: H2.ink4 }}>{dd.d}</span>
            </div>
          </div>
        ))}
      </div>
    </H2Card>
  );
}

// ── steps: icon-in-circle rows + round checks ────────────────────────
function H2Steps() {
  const [steps, setSteps] = h2State([
    { id: 'water', kind: 'water', label: 'Drink a glass of water', done: true },
    { id: 'walk', kind: 'walk', label: 'Take a 10-minute walk', done: true },
    { id: 'lesson', kind: 'book', label: "Read today's lesson", done: false },
    { id: 'log', kind: 'pencil', label: "Log how you're feeling", done: false },
  ]);
  const toggle = (id) => setSteps(steps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  return (
    <H2Card style={{ padding: '4px 18px' }}>
      {steps.map((s, i) => (
        <button key={s.id} onClick={() => toggle(s.id)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderTop: i === 0 ? 'none' : `1px solid ${H2.hair}` }}>
          <span style={{ width: 42, height: 42, borderRadius: 9999, background: H2.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: s.done ? 0.55 : 1, transition: 'opacity .25s' }}>
            {H2Icon[s.kind](23, H2.ink)}
          </span>
          <span style={{ flex: 1, textAlign: 'left', fontFamily: HV, fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', lineHeight: 1.3, color: s.done ? H2.ink3 : H2.ink, textDecoration: s.done ? 'line-through' : 'none', textDecorationColor: H2.ink4, transition: 'color .25s' }}>{s.label}</span>
          {s.done ? (
            <span style={{ width: 24, height: 24, borderRadius: 9999, flexShrink: 0, background: H2.check, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l5 5L20 6.5" stroke="#F4F3EF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          ) : (
            <span style={{ width: 24, height: 24, borderRadius: 9999, flexShrink: 0, border: `1.6px solid ${H2.ink4}` }} />
          )}
        </button>
      ))}
    </H2Card>
  );
}

// ── flat whisker-style nav ───────────────────────────────────────────
function H2Nav({ active = 'today' }) {
  const items = [
    ['today', 'Today', (c, on) => H2Icon.home(26, c, on)],
    ['journey', 'Journey', (c) => H2Icon.compass(26, c)],
    ['urge', 'Urge', (c) => H2Icon.wave(27, c, 2.2)],
    ['log', 'Log', (c) => H2Icon.pencil(26, c)],
    ['you', 'You', (c) => H2Icon.you(26, c)],
  ];
  return (
    <div style={{ background: H2.card, borderTop: `1px solid ${H2.hair}` }}>
      <div style={{ display: 'flex', padding: '12px 10px 28px' }}>
        {items.map(([id, label, icon]) => {
          const on = id === active;
          const c = on ? H2.ink : H2.ink3;
          return (
            <button key={id} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '4px 0' }}>
              <span style={{ display: 'inline-flex', height: 27, alignItems: 'center' }}>{icon(c, on)}</span>
              <span style={{ fontFamily: HV, fontWeight: on ? 600 : 500, fontSize: 11.5, letterSpacing: '0.01em', color: c }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── the screen ──────────────────────────────────────────────────────
function TodayScreenV2() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: H2.bg, fontFamily: HV, color: H2.ink, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '72px 24px 124px' }}>
        <div style={{ marginTop: 16 }}><H2Header /></div>
        <H2Tiles />

        <div style={{ marginTop: 30 }}>
          <H2Label right="See all">Your journey</H2Label>
          <H2Gauge />
        </div>

        <div style={{ marginTop: 30 }}>
          <H2Label right="Analytics ›">Your week</H2Label>
          <H2Week />
        </div>

        <div style={{ marginTop: 30 }}>
          <H2Label right="2 of 4">Today's steps</H2Label>
          <H2Steps />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5 }}><H2Nav active="today" /></div>
    </div>
  );
}

Object.assign(window, { TodayScreenV2 });
