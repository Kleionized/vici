// Laurel — the wreath mark, from the supplied image. Plain <img> (robust
// in exports); light-on-dark contexts get a CSS invert, muted inks an opacity.
function Laurel({ size = 20, color = 'var(--ink)', style = {} }) {
  const c = String(color);
  const light = /on-fill|F5F4F1|F4F3EF|FDFDFC|FFFFFF|#fff\b|paper/i.test(c);
  const muted = /ink2|ink3|8B8882|55534E|4A4A42/i.test(c);
  return <img src="assets/laurel-mark.webp" alt="" aria-hidden="true" width={size} height={size}
    style={{ display: 'inline-block', width: size, height: size, flexShrink: 0, objectFit: 'contain',
      transform: 'scale(1.32)', transformOrigin: 'center',
      filter: light ? 'invert(1)' : 'none', opacity: muted ? 0.68 : 1, ...style }} />;
}
// stoic-kit.jsx — VICI shared primitives, unified with the Today home
// screen's monochrome serif system: parchment ground, EB Garamond display
// voice, Gill Sans caps/labels, flat paper cards with a hairline inset
// (no glass/blur), solid engraved icons, and a flat edge-to-edge 5-tab
// nav with an inline dark urge button.
// Exports (to window): Shell, Hero, Ask, SectionLabel, Card, PillButton,
// GhostButton, TabBar, OnboardTop, FAB, Chip, Glyph, Toggle, Avatar,
// DuoGlyph, Illo, IconChip, GIcon, ScreenHeader, BackChevron, Moon,
// Starfield, GlowOrb, PhotoSlot, PhotoBanner, Tint, SKY_BG.

const T = {
  bg: 'var(--bg)', card: 'var(--card)', ink: 'var(--ink)',
  ink2: 'var(--ink2)', ink3: 'var(--ink3)', line: 'var(--line)',
  radius: 'var(--radius)', accent: 'var(--accent)', font: 'var(--font)',
  display: 'var(--font-display)', serif: 'var(--serif)', warm: 'var(--warm)', warm2: 'var(--warm2)',
  cool: 'var(--accent)', cool2: 'var(--accent-2)',
  warmGrad: 'var(--fill)',
};

// ── the paper canvas — flat, matching the home screen exactly (no wash) ─
const SKY_BG = 'var(--bg)';

// legacy heading span — now inherits so titles stay single-colour
function Tint({ children, style = {} }) {
  return <span style={{ color: 'inherit', ...style }}>{children}</span>;
}

// ── full-screen shell (clears status bar, optional tab bar) ──────────
function Shell({ children, pad = 29, top = 56, tab = null, bg, sky = true, stars = 0, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg || SKY_BG,
      fontFamily: T.font, color: T.ink, display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      {/* flat paper — matches the home screen exactly (no ambient pools) */}
      <div style={{
        flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1,
        padding: `${top}px ${pad}px ${tab ? 0 : 52}px`,
        display: 'flex', flexDirection: 'column', minHeight: 0,
      }}>{children}</div>
      {/* the tab bar sits flat below the content, like home */}
      {tab ? <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6 }}>{tab}</div> : null}
    </div>
  );
}

// ── big hero header — EB Garamond, echoing "Day XXIV" on home ─────
function Hero({ children, size = 37, style = {} }) {
  return (
    <h1 style={{
      fontFamily: T.serif, fontWeight: 500, fontSize: size, lineHeight: 1.08,
      letterSpacing: '0.008em', color: T.ink, margin: 0, ...style,
    }}>{children}</h1>
  );
}

// ── smaller bold "question" header (onboarding body) ────────────────
function Ask({ children, size = 29, style = {} }) {
  return (
    <h2 style={{
      fontFamily: T.serif, fontWeight: 500, fontSize: size, lineHeight: 1.12,
      letterSpacing: '0.008em', color: T.ink, margin: 0, textWrap: 'pretty', ...style,
    }}>{children}</h2>
  );
}

// tiny uppercase eyebrow — home's "NEXT LESSON" kicker exactly
function Eyebrow({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: T.font, fontWeight: 600, fontSize: 10.5,
      letterSpacing: '0.2em', textTransform: 'uppercase', color: T.ink3,
      ...style,
    }}>{children}</div>
  );
}

// section label — the home screen's "TODAY'S STEPS" pattern exactly:
// caps outside the card, semibold, wide tracking, with an optional muted
// right-side meta ("Analytics ›", "2 of 4")
function SectionLabel({ children, right, style = {} }) {
  const capsStyle = {
    fontFamily: T.font, fontWeight: 600, fontSize: 13, lineHeight: '20px',
    letterSpacing: '0.18em', textTransform: 'uppercase', color: T.ink, whiteSpace: 'nowrap',
  };
  if (right != null) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px', ...style }}>
        <span style={capsStyle}>{children}</span>
        <span className="tnum" style={{ fontFamily: T.font, fontWeight: 500, fontSize: 13.5, lineHeight: '20px', color: T.ink3, whiteSpace: 'nowrap', textTransform: 'none', letterSpacing: '0.01em' }}>{right}</span>
      </div>
    );
  }
  return (
    <div style={{ ...capsStyle, padding: '0 4px', ...style }}>{children}</div>
  );
}

// flat paper card — hairline inset + soft drop, EXACT recipe of the
// home screen's cards so every card in the app matches it.
function Card({ children, style = {}, pad = 20, onDark = false }) {
  return (
    <div style={{
      position: 'relative',
      background: 'var(--card)',
      border: 'none',
      borderRadius: T.radius, padding: pad,
      boxShadow: 'none',
      ...style,
    }}>
      {children}
    </div>
  );
}

function PillButton({ children, dark = true, full = false, size = 15.5, style = {}, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      background: dark ? 'var(--fill)' : 'var(--card)',
      color: dark ? 'var(--on-fill)' : 'var(--ink)',
      fontFamily: T.font, fontWeight: 600, fontSize: size - 1,
      borderRadius: 9999, padding: '15px 30px', width: full ? '100%' : 'auto',
      boxShadow: dark
        ? 'none'
        : `inset 0 0 0 1.5px ${T.line}`,
      letterSpacing: '0.01em', ...style,
    }}>{children}</button>
  );
}

function GhostButton({ children, size = 14.5, style = {}, onClick }) {
  return (
    <button onClick={onClick} className="tl-press-soft" style={{
      appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
      fontFamily: T.font, fontWeight: 500, fontSize: size, color: T.ink2,
      padding: '8px 4px', letterSpacing: '-0.005em', ...style,
    }}>{children}</button>
  );
}

// ── screen header: neutral eyebrow + clean title. `hue` is accepted for
// call-site compatibility but no longer tints anything — every screen
// stays on the one calm, ink-toned system. ──────────────────────────
function BackChevron({ onClick, color = 'var(--ink)' }) {
  return (
    <button onClick={onClick} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 8px', margin: '-6px -4px -6px -8px', display: 'flex', borderRadius: 10 }}>
      <svg width="12" height="20" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

function ScreenHeader({ eyebrow, title, sub, hue = 215, onBack, trailing, pad = 29 }) {
  return (
    <div style={{ position: 'relative', padding: `0 ${pad}px`, marginBottom: 32 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 30, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {onBack ? <BackChevron onClick={onBack} /> : null}
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        </div>
        {trailing || null}
      </div>
      <h1 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 28, letterSpacing: '0.008em', lineHeight: 1.12, margin: 0, color: T.ink }}>{title}</h1>
      {sub ? <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.ink2, fontWeight: 400, margin: '12px 0 0', lineHeight: 1.5, letterSpacing: '0.01em', textWrap: 'pretty' }}>{sub}</p> : null}
    </div>
  );
}

// ── bottom tab bar — the home screen's nav EXACTLY: flat parchment bar,
// thin stroke-line icons, Gill Sans labels, a raised dark urge circle ─
const NAV_ICON = {
  home: (c, on) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4V15h-5.6v5.8H4.8A.8.8 0 0 1 4 20z" fill={on ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  journey: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke={c} strokeWidth="1.8"/><path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  log: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  you: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" fill="none" stroke={c} strokeWidth="1.8"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
};
function TabBar({ active = 'today' }) {
  const tab = (id, icon, label) => {
    const on = id === active;
    const c = on ? 'var(--ink)' : 'var(--ink3)';
    return (
      <button className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 0 }}>
        {NAV_ICON[icon](c, on)}
        <span style={{ fontFamily: T.font, fontWeight: on ? 600 : 400, fontSize: 12, color: c, letterSpacing: '0.02em' }}>{label}</span>
      </button>
    );
  };
  return (
    <div style={{
      background: 'var(--bg)',
      display: 'flex', alignItems: 'flex-end', padding: '14px 18px 24px',
    }}>
      {tab('today', 'home', 'Today')}
      {tab('journey', 'journey', 'Journey')}
      <div style={{ flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <div className="tl-press" style={{
          width: 52, height: 52, borderRadius: 9999, cursor: 'pointer',
          background: 'var(--fill)',
          boxShadow: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Laurel size={27} color={'var(--on-fill)'} />
        </div>
      </div>
      {tab('log', 'log', 'Log')}
      {tab('you', 'you', 'You')}
    </div>
  );
}

// ── the home screen's mood ramp — the single source of truth for any
// mood-mapped tone in the app (week rings, check-in, analytics) ─────
const MOOD_TONES = ['#C9C6BE', '#AFACA3', '#918E85', '#6B6960', '#33312D'];

// ── dark section card — the home screen's NEXT LESSON surface: solid
// #131313, radius 20, white serif voice. Every black section in the app
// is built from this. ──────────────────────────────────────
const DARK = { bg: '#131313', paper: '#F5F4F1', mut: 'rgba(245,244,241,0.62)', mut2: 'rgba(245,244,241,0.45)', hair: 'rgba(245,244,241,0.14)' };
function DarkCard({ children, pad = 22, style = {}, art = null }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: 20,
      background: DARK.bg, color: DARK.paper,
      ...style,
    }}>
      {art}
      <div style={{ position: 'relative', padding: pad }}>{children}</div>
    </div>
  );
}

// ── the big grey quotation mark — home's editorial flourish ────────
function QuoteMark({ size = 60, color = 'rgba(29,28,26,0.2)', style = {} }) {
  return (
    <div aria-hidden="true" style={{ textAlign: 'center', height: Math.round(size * 0.53), overflow: 'visible', lineHeight: 1, ...style }}>
      <span style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 500, fontSize: size, lineHeight: 1, color }}>“</span>
    </div>
  );
}

// ── hairline + wave-in-circle divider — the home footer's motif ────
function WaveDivider({ style = {} }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', ...style }}>
      <div style={{ height: 1, background: 'rgba(0,0,0,0.1)' }} />
      <span style={{
        position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)',
        width: 38, height: 38, borderRadius: 9999, background: '#FDFDFC',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none"><path d="M1 5.5C3 1.5 5 1.5 8 4s5 2.5 7-1.5" stroke="var(--ink2)" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </span>
    </div>
  );
}

// ── onboarding top: dashed progress + back / close ──────────────────
function OnboardTop({ step = 1, total = 9, onlyClose = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
      {!onlyClose && (
        <svg width="13" height="22" viewBox="0 0 13 22" style={{ flexShrink: 0 }}><path d="M11 2L2 11l9 9" stroke={T.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center', padding: onlyClose ? 0 : '0 4px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 9999,
            background: i < step ? 'var(--fill)' : 'var(--soft2)',
            transition: 'background .35s ease',
          }} />
        ))}
      </div>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}><path d="M3 3l14 14M17 3L3 17" stroke={T.ink} strokeWidth="2.4" strokeLinecap="round" /></svg>
    </div>
  );
}

function FAB({ dir = 'next', style = {} }) {
  return (
    <div className="tl-press" style={{
      width: 62, height: 62, borderRadius: 9999, cursor: 'pointer',
      background: 'var(--fill)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'none',
      ...style,
    }}>
      <svg width="22" height="22" viewBox="0 0 22 22">
        {dir === 'next'
          ? <path d="M7 3l9 8-9 8" stroke="var(--on-fill)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M15 3l-9 8 9 8" stroke="var(--on-fill)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </div>
  );
}

// ── round chip with glyph + caption ─────────────────────────────────
function Chip({ icon, label, size = 76 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: size, height: size, borderRadius: 9999,
        background: 'var(--card)',
        boxShadow: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <span style={{ fontFamily: T.font, fontWeight: 500, fontSize: 12.5, color: T.ink2 }}>{label}</span>
    </div>
  );
}

function Toggle({ on = true }) {
  return (
    <div style={{
      width: 51, height: 31, borderRadius: 9999, flexShrink: 0, cursor: 'pointer',
      background: on ? 'linear-gradient(180deg, var(--fill-lo), var(--fill-hi))' : 'var(--soft2)',
      boxShadow: on ? 'none' : 'none',
      position: 'relative', transition: 'background .25s ease',
    }}>
      <div style={{
        position: 'absolute', top: 2.5, left: on ? 22.5 : 2.5, width: 26, height: 26,
        borderRadius: 9999, background: 'linear-gradient(180deg, #FFFFFF, #F4F3EE)',
        boxShadow: 'var(--shadow-knob)',
        transition: 'left .22s cubic-bezier(.32,1.35,.55,1)',
      }} />
    </div>
  );
}

function Avatar({ initials = 'JR', size = 64 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999,
      background: 'var(--card)',
      boxShadow: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink)', fontFamily: T.serif, fontWeight: 500, fontSize: size * 0.34,
      letterSpacing: '0.01em',
    }}>{initials}</div>
  );
}

// ── icon set — thin stroke for chrome/utility glyphs, flat single-fill
// silhouette for symbolic/content glyphs (mirrors the home screen's own
// mixed nav-vs-mood-glyph approach). Colour is always passed in via `c`
// so every call site stays neutral automatically. ───────────────────
const Glyph = {
  home: (c) => <svg width="26" height="26" viewBox="0 0 24 24"><path d="M11.3 3.2 3.4 10a1.6 1.6 0 0 0-.4 1V20a1 1 0 0 0 1 1H9v-6h6v6h4.9a1 1 0 0 0 1-1v-9a1.6 1.6 0 0 0-.4-1l-7.9-6.8a1.1 1.1 0 0 0-1.3 0z" fill={c} /></svg>,
  compass: (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.6" stroke={c} strokeWidth="1.8" /><path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  pen: (c) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3.8 20.2 4.9 16 14.9 6l3.1 3.1L8 19.1zM16.3 4.6l1.6-1.6a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3l-1.6 1.6z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>,
  spark: (c) => <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 2.8c.7 6.1 2.7 8.1 9 9.2-6.3 1.1-8.3 3.1-9 9.2-.7-6.1-2.7-8.1-9-9.2 6.3-1.1 8.3-3.1 9-9.2z" fill={c} /></svg>,
  lock: (c) => <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" stroke={c} strokeWidth="1.8" /><rect x="4.4" y="10" width="15.2" height="11.5" rx="2.6" stroke={c} strokeWidth="1.8" /></svg>,
  bell: (c) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 2.4a6.2 6.2 0 0 1 6.2 6.2v3.9l1.9 2.6a1 1 0 0 1-.8 1.6H4.7a1 1 0 0 1-.8-1.6l1.9-2.6V8.6A6.2 6.2 0 0 1 12 2.4z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /><path d="M9.6 19.2a2.4 2.4 0 0 0 4.8 0" stroke={c} strokeWidth="1.7" /></svg>,
  book: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5.4c-2-1.1-4.4-1.6-6.9-1.6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1c2.5 0 4.9.5 6.9 1.6 2-1.1 4.4-1.6 6.9-1.6a1 1 0 0 0 1-1v-13a1 1 0 0 0-1-1c-2.5 0-4.9.5-6.9 1.6z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 5.4v14.6" stroke={c} strokeWidth="1.6" /></svg>,
  search: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="7.1" stroke={c} strokeWidth="1.9" /><path d="M15.8 15.8 20.5 20.5" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>,
  shield: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11.4 2.7 5 5.3a1.4 1.4 0 0 0-.9 1.3V11c0 5.3 3.3 8.9 7.5 10.8 4.2-1.9 7.5-5.5 7.5-10.8V6.6a1.4 1.4 0 0 0-.9-1.3l-6.4-2.6a1.6 1.6 0 0 0-1.2 0z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>,
  download: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3.5v11.2M8 11l4 4 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 18.5h15" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>,
  trash: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 2.6h6a1 1 0 0 1 1 1V5h4v2H4V5h4V3.6a1 1 0 0 1 1-1z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M5.6 8.5h12.8l-.9 11.6a1.6 1.6 0 0 1-1.6 1.5H8.1a1.6 1.6 0 0 1-1.6-1.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  face: (c) => <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 8.5V6.4A1.4 1.4 0 0 1 6.4 5H8.5M15.5 5h2.1A1.4 1.4 0 0 1 19 6.4V8.5M19 15.5v2.1a1.4 1.4 0 0 1-1.4 1.4H15.5M8.5 19H6.4A1.4 1.4 0 0 1 5 17.6V15.5" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M9.3 10v1.2M14.7 10v1.2" stroke={c} strokeWidth="2.4" strokeLinecap="round" /><path d="M9.6 14.6a4 4 0 0 0 4.8 0" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  flag: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5.5 2.5v19" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M6.2 3.6h10.3a1 1 0 0 1 .8 1.6L14.7 8l2.6 2.8a1 1 0 0 1-.8 1.6H6.2z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>,
  user: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.4" r="4" stroke={c} strokeWidth="1.8" /><path d="M4 20.2a8 8 0 0 1 16 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>,
  doc: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7.4 2.5H13l5.4 5.4v11.6a1.5 1.5 0 0 1-1.5 1.5H7.4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 7.4 2.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M13 3.6v4.4h4.4" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  check: (c, w = 3) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l4.8 4.8L20 6.5" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>,
  chevR: (c) => <svg width="9" height="16" viewBox="0 0 9 16" fill="none"><path d="M1.5 1l6 7-6 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  star: (c) => <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 2.6l2.8 5.8 6.4.8-4.7 4.4 1.2 6.3L12 17.8l-5.7 2.9 1.2-6.3-4.7-4.4 6.4-.8z" fill={c} /></svg>,
  anchor: (c) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.4" r="2.4" fill={c} /><path d="M12 7.8V21M4.4 13.2a7.6 7.6 0 0 0 15.2 0M7.6 12.2H4.4M19.6 12.2h-3.2" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  wave: (c) => <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M2 13.9c2-2.3 4-2.3 6 0s4 2.3 6 0 4-2.3 6 0" stroke={c} strokeWidth="1.9" strokeLinecap="round" /><path d="M2 10.4c2-2.3 4-2.3 6 0s4 2.3 6 0 4-2.3 6 0" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>,
  sun: (c) => <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill={c} /><path d="M12 1.6v2.6M12 19.8v2.6M1.6 12h2.6M19.8 12h2.6M4.3 4.3l1.8 1.8M17.9 17.9l1.8 1.8M19.7 4.3l-1.8 1.8M6.1 17.9l-1.8 1.8" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>,
  moon: (c) => <svg width="22" height="22" viewBox="0 0 24 24"><path fillRule="evenodd" d="M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1ZM9.4 11.3a1.4 1.4 0 1 0 .001 0ZM12.8 16.1a1 1 0 1 0 .001 0Z" fill={c} /></svg>,
  clock: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.4" stroke={c} strokeWidth="1.7" /><path d="M12 7.6V12l3 2" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  calendar: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7.5 2.4v3.2M16.5 2.4v3.2" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><rect x="4" y="4.6" width="16" height="16" rx="2.4" stroke={c} strokeWidth="1.7" /><path d="M4 9.6h16" stroke={c} strokeWidth="1.6" /></svg>,
  heart: (c) => <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 20.7C8.7 18.6 3.5 14.8 3.5 9.2A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.5 2.7c0 5.6-5.2 9.4-8.5 11.5z" fill={c} /></svg>,
  leaf: (c) => <svg width="22" height="22" viewBox="0 0 24 24"><path d="M20.5 3.5c.6 8-3.8 14.4-11 14.9l-2 2.6-1.6-1.2 2-2.6C4.4 14.1 6.8 6.4 14 4.4c2-.5 4.3-.8 6.5-.9z" fill={c} /></svg>,
  map: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8.6 3.5 3.7 5.1A1 1 0 0 0 3 6v13.3a1 1 0 0 0 1.3.95l4.3-1.45zM10.2 3.4v15.2l3.6 1.2V4.6zM15.4 4.7v15.1l4.3-1.45a1 1 0 0 0 .7-.95V4.1a1 1 0 0 0-1.3-.95z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>,
  card: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2.4" stroke={c} strokeWidth="1.7" /><path d="M2.5 9.7h19" stroke={c} strokeWidth="1.7" /><path d="M5.5 15h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>,
  gift: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.6" y="9" width="16.8" height="3" rx="0.6" stroke={c} strokeWidth="1.5" /><path d="M5 12.6h14v7.4A1.5 1.5 0 0 1 17.5 21.5h-11A1.5 1.5 0 0 1 5 20z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M12 9v12.5" stroke={c} strokeWidth="1.5" /><path d="M12 8.4c-1-3-2.5-3.8-3.8-3.1-1.5.8.6 3.1 3.8 3.1zM12 8.4c1-3 2.5-3.8 3.8-3.1 1.5.8-.6 3.1-3.8 3.1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>,
  restore: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4.5 5.5v4.5h4.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13a7.5 7.5 0 1 0 1.8-6.8L4.5 9.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

// ── celestial-turned-daylight VICI motif: the moon still governs
// the tides, now drawn as a soft paper-toned disc over layered lines ──
const Illo = {
  tide: (c = 'var(--ink)', { w = 220, h = 132 } = {}) => (
    <svg width={w} height={h} viewBox="0 0 220 132" fill="none">
      <defs>
        <radialGradient id="il-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="il-moon" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor={c} stopOpacity="0.85" />
          <stop offset="1" stopColor={c} stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="46" r="44" fill="url(#il-halo)" />
      <circle cx="110" cy="46" r="22" fill="url(#il-moon)" />
      <path d="M2 86c20-13 38-13 54 0s38 13 54 0 38-13 54 0 38 13 54 0" stroke={c} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M2 104c20-12 38-12 54 0s38 12 54 0 38-12 54 0 38 12 54 0" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M2 121c20-11 38-11 54 0s38 11 54 0 38-11 54 0 38 11 54 0" stroke={c} strokeWidth="2.6" strokeLinecap="round" opacity="0.18" />
    </svg>
  ),
  waveline: (c = 'var(--ink)', { w = 320, h = 26, opacity = 1 } = {}) => (
    <svg width={w} height={h} viewBox="0 0 320 26" fill="none" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d="M0 13c26-11 53-11 80 0s53 11 80 0 53-11 80 0 53 11 80 0" stroke={c} strokeWidth="2.4" strokeLinecap="round" opacity={opacity} />
    </svg>
  ),
  // sea-to-summit: paper moon + ridges with an ascending trail
  journey: (c = 'var(--ink)', { w = 402, h = 250, light = '#fff' } = {}) => (
    <svg width={w} height={h} viewBox="0 0 402 250" fill="none" preserveAspectRatio="xMidYMax meet" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="jr-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jr-moon" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#fff" /><stop offset="0.62" stopColor={c} stopOpacity="0.82" /><stop offset="1" stopColor={c} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="60" r="58" fill="url(#jr-halo)" />
      <circle cx="300" cy="60" r="26" fill="url(#jr-moon)" />
      <path d="M0 150C60 122 108 134 150 150 200 170 244 122 300 134 340 142 382 152 402 146V250H0Z" fill={c} opacity="0.1" />
      <path d="M0 188C52 152 92 170 138 152L186 108 236 160C284 142 336 170 402 150V250H0Z" fill={c} opacity="0.16" />
      <path d="M186 108L170 136C178 130 194 130 202 136Z" fill={light} opacity="0.9" />
      <path d="M0 250V200C72 172 124 204 204 200 284 196 336 218 402 202V250Z" fill={c} opacity="0.24" />
      <path d="M186 108V86" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M186 87L205 93 186 99Z" fill="var(--fill)" />
      {[[58, 240], [86, 232], [114, 224], [142, 216], [168, 208]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill="var(--accent)" opacity="0.35" />
      ))}
      <circle cx="190" cy="201" r="6" fill="var(--fill)" stroke="var(--bg)" strokeWidth="2.4" />
    </svg>
  ),
  // shorter banner version (moon + ridges) for lesson headers
  crest: (c = 'var(--ink)', { w = 402, h = 140, light = '#fff' } = {}) => (
    <svg width={w} height={h} viewBox="0 0 402 140" fill="none" preserveAspectRatio="xMidYMax slice" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cr-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.14" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cr-moon" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#fff" /><stop offset="0.62" stopColor={c} stopOpacity="0.82" /><stop offset="1" stopColor={c} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="40" r="50" fill="url(#cr-halo)" />
      <circle cx="320" cy="40" r="22" fill="url(#cr-moon)" />
      <path d="M0 92C52 64 96 78 150 70L196 36 244 84C296 66 348 92 402 74V140H0Z" fill={c} opacity="0.14" />
      <path d="M196 36L181 62C189 56 205 56 213 62Z" fill={light} opacity="0.9" />
      <path d="M0 140V104C70 82 128 108 206 104 284 100 340 120 402 106V140Z" fill={c} opacity="0.26" />
    </svg>
  ),
};

// ── celestial primitives, re-tinted for daylight paper ──────────────
function Moon({ size = 120, phase = 0.82, halo = true, style = {} }) {
  const uid = React.useMemo(() => 'mn' + Math.random().toString(36).slice(2, 8), []);
  const shadowDx = (1 - phase) * 78;
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      {halo ? <div className="cc-glow" style={{ position: 'absolute', inset: '-32%', borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in oklab, var(--ink) 12%, transparent), transparent 68%)', filter: 'blur(6px)' }} /> : null}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'relative', display: 'block' }}>
        <defs>
          <radialGradient id={`${uid}-b`} cx="36%" cy="32%" r="74%">
            <stop offset="0" stopColor="#FFFDF8" /><stop offset="0.55" stopColor="#E7E3D8" /><stop offset="1" stopColor="#B9B3A2" />
          </radialGradient>
          <radialGradient id={`${uid}-s`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#22221C" stopOpacity="0.5" /><stop offset="1" stopColor="#22221C" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-c`}><circle cx="50" cy="50" r="40" /></clipPath>
        </defs>
        <circle cx="50" cy="50" r="40" fill={`url(#${uid}-b)`} />
        <g clipPath={`url(#${uid}-c)`}>
          <circle cx="38" cy="40" r="6" fill="#9C9C92" opacity="0.3" />
          <circle cx="61" cy="58" r="8.5" fill="#9C9C92" opacity="0.24" />
          <circle cx="64" cy="34" r="3.6" fill="#9C9C92" opacity="0.28" />
          <circle cx="44" cy="64" r="4.4" fill="#9C9C92" opacity="0.22" />
        </g>
        {phase < 0.99 ? <circle cx={50 + shadowDx} cy="50" r="44" fill={`url(#${uid}-s)`} clipPath={`url(#${uid}-c)`} /> : null}
      </svg>
    </div>
  );
}

// sparse, still dots — a hint of paper grain rather than a night sky
function Starfield({ count = 22, style = {} }) {
  const stars = React.useMemo(() => Array.from({ length: count }).map((_, i) => ({
    x: (i * 67 + 13) % 100, y: (i * 41 + 7) % 100,
    s: (i % 5 === 0) ? 2.6 : (i % 3 === 0 ? 2 : 1.3),
    d: (i % 6) * 0.7, tw: i % 4 === 0,
  })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', ...style }}>
      {stars.map((s, i) => (
        <div key={i} className={s.tw ? 'cc-twinkle' : undefined} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s,
          borderRadius: '50%', background: 'var(--ink4)', opacity: s.tw ? 0.4 : 0.18 + s.s * 0.05,
          animationDelay: s.tw ? `${s.d}s` : undefined,
        }} />
      ))}
    </div>
  );
}

// dark focal disc for hero moments — a graphic accent shape, not a glow-lamp
function GlowOrb({ size = 200, tone = 'warm', icon, style = {}, pulse = true }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <div className={pulse ? 'cc-glow' : undefined} style={{ position: 'absolute', inset: '-4%', borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in oklab, var(--ink) 12%, transparent), transparent 66%)', filter: 'blur(8px)' }} />
      <div style={{
        position: 'relative', width: '78%', height: '92%', borderRadius: '50%',
        background: 'radial-gradient(120% 120% at 50% 8%, #3E3D34, #1B1B15 72%)',
        boxShadow: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon || (
          <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5l1.7 4.8L18.5 9l-4.8 1.7L12 15.5l-1.7-4.8L5.5 9l4.8-1.7z" fill="#fff" />
            <path d="M19 13.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#fff" opacity="0.8" />
          </svg>
        )}
      </div>
    </div>
  );
}

// photographic hero — a user-fillable image slot with a paper scrim
function PhotoSlot({ id, placeholder = 'Drop a photo', radius = 24, scrim = true, height = 220, children, style = {} }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: radius, overflow: 'hidden', ...style }}>
      <image-slot id={id} shape="rounded" radius={radius} placeholder={placeholder} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      {scrim ? <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0) 38%, rgba(247,245,240,0.9) 100%)', pointerEvents: 'none' }} /> : null}
      {children ? <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{children}</div> : null}
    </div>
  );
}

// full-bleed photographic banner that melts into the paper canvas at its
// foot — the home screen's hero treatment, reusable as a screen header.
function PhotoBanner({ id, placeholder = 'Drop a calm, cinematic scene', height = 168, children, style = {} }) {
  return (
    <div style={{ position: 'relative', height, flexShrink: 0, overflow: 'hidden', ...style }}>
      <image-slot id={id} shape="rect" placeholder={placeholder} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0.4) 0%, rgba(247,245,240,0.02) 32%, rgba(247,245,240,0.5) 74%, var(--bg) 100%)', pointerEvents: 'none' }} />
      {children ? <div style={{ position: 'absolute', inset: 0 }}>{children}</div> : null}
    </div>
  );
}

// normalize any glyph svg to an exact box size
function GIcon({ el, size = 21 }) {
  return <span className="gicofit" style={{ display: 'inline-flex', width: size, height: size }}>{el}</span>;
}

// round/soft-square chip holding a monotone glyph. `hue` accepted for
// call-site compatibility but ignored — every chip stays neutral.
function IconChip({ icon, size = 38, radius = 12, tone = 'soft', iconSize = 21, hue = null }) {
  const bg = tone === 'ink' ? 'var(--fill)' : tone === 'plain' ? 'transparent' : 'var(--soft)';
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}><GIcon el={icon} size={iconSize} /></div>
  );
}

// ── flat-fill icon set (kept for call-site compatibility — same shapes
// as Glyph's nav-adjacent set, single-colour, no duotone) ────────────
const DuoGlyph = {
  user: (c) => Glyph.user(c),
  home: (c) => Glyph.home(c),
  compass: (c) => Glyph.compass(c),
  pen: (c) => Glyph.pen(c),
  spark: (c) => Glyph.spark(c),
  wave: (c) => Glyph.wave(c),
  calendar: (c) => Glyph.calendar(c),
};

Object.assign(window, {
  Shell, Hero, Ask, SectionLabel, Eyebrow, Card, PillButton, GhostButton,
  TabBar, OnboardTop, FAB, Chip, Toggle, Avatar, Glyph, DuoGlyph, Illo, IconChip, GIcon,
  ScreenHeader, BackChevron, Moon, Starfield, GlowOrb, PhotoSlot, PhotoBanner, Tint, SKY_BG,
  MOOD_TONES, DARK, DarkCard, QuoteMark, WaveDivider,
});

Object.assign(window, { Laurel });
