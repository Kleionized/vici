// screens-onb-art.jsx — visual + helper primitives for the VICI onboarding funnel.
// Calm-monochrome base, now with a subtle low-chroma "atmosphere" layer (Aura + dot
// field) whose hue shifts through the funnel, plus refined, lightly-animated
// illustrations and finer data-viz. Colour is kept low-chroma so it stays VICI-calm.
//
// Exports (to window): Stage, OnbBar, PagerDots, NextPill, PressRow, SlideArt, TideScene,
// OptionRow, ProjectionChart, PatternMeter, StatRow, LoadingRing, Testimonial,
// AvatarStack, MiniStars, BigStat, tint.

const { useId: oaId } = React;

// neutral paper tint — hue/chroma are intentionally ignored so every
// screen in the funnel reads as one calm, ink-toned system (no colour
// accents anywhere). `l` still drives light↔dark so washes, borders and
// glows keep the same shape they always had — just in grayscale-warm ink.
const tint = (hue, l = 0.66, c = 0.085, a = 1) => `oklch(${l} 0.006 90 / ${a})`;

// ── ambient atmosphere: drifting colour washes + sparse dot field ────
const DOTS = [
  [12, 22, 1.4], [28, 64, 1], [41, 14, 1.2], [55, 48, 1], [68, 80, 1.5], [82, 30, 1.1],
  [90, 66, 1.3], [18, 86, 1], [36, 38, 1.1], [62, 18, 1.2], [74, 54, 1], [8, 50, 1.2],
  [48, 90, 1.1], [86, 12, 1], [22, 6, 1.1], [58, 70, 1.3], [94, 44, 1], [33, 76, 1.2],
];
function DotField({ hue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {DOTS.map(([x, y, r], k) => (
        <div key={k} className={k % 3 === 0 ? 'onb-twinkle' : undefined} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: r * 1.7, height: r * 1.7, borderRadius: '50%', background: 'var(--ink4)',
          opacity: 0.1 + r * 0.1,
          animationDelay: `${(k % 6) * 0.7}s`,
        }} />
      ))}
    </div>
  );
}
function Aura({ hue = 210, intensity = 1, dots = true }) {
  const g = (typeof window !== 'undefined' && window.CURRENT_GLOW != null ? window.CURRENT_GLOW : 1) * intensity;
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* soft warm wash, upper right — the home signature, in daylight */}
      <div className="onb-drift" style={{ position: 'absolute', top: '-6%', right: '-18%', width: '86%', height: '54%', borderRadius: '50%', background: `radial-gradient(circle at 62% 46%, color-mix(in oklab, var(--fill) ${9 * g}%, transparent), transparent 70%)`, filter: 'blur(6px)' }} />
      {/* a second, fainter lift up top-left for depth */}
      <div className="onb-drift2" style={{ position: 'absolute', top: '-14%', left: '-16%', width: '76%', height: '50%', borderRadius: '50%', background: `radial-gradient(circle at 38% 40%, color-mix(in oklab, var(--ink) ${6 * g}%, transparent), transparent 66%)`, filter: 'blur(6px)' }} />
      {dots ? <DotField hue={hue} /> : null}
    </div>
  );
}

function Stage({ hue = 210, intensity = 1, dots = true, pad = 26, top = 74, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', fontFamily: 'var(--font)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Aura hue={hue} intensity={intensity} dots={dots} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: `${top}px ${pad}px 54px` }}>
        {children}
      </div>
    </div>
  );
}
// ── top progress: back · continuous global fill · close, with a small
// phase label + step counter so the whole funnel reads as one journey ─
function OnbBar({ i = 1, n = 13, phase, hue = 210, onBack, onClose }) {
  const pct = Math.max(0, Math.min(1, i / n));
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', opacity: onBack ? 1 : 0.25, borderRadius: 10 }}>
          <svg width="13" height="22" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke="var(--ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 9999, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', transition: 'width .5s cubic-bezier(.4,0,.1,1)' }} />
        </div>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 10 }}>
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink3)" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      {phase ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 31px 0' }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{phase}</span>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink3)', letterSpacing: '0.02em' }}>{i} of {n}</span>
        </div>
      ) : null}
    </div>
  );
}

// ── pager dots (educational carousel) ────────────────────────────────
function PagerDots({ n = 3, i = 0, hue = 200 }) {
  return (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: n }).map((_, k) => (
        <div key={k} style={{
          height: 7, borderRadius: 9999, width: k === i ? 22 : 7,
          background: k === i ? 'var(--fill)' : 'var(--soft2)',
          transition: 'width .3s, background .3s',
        }} />
      ))}
    </div>
  );
}

// ── primary full-width pill with trailing arrow ──────────────────────
function NextPill({ label = 'Continue', enabled = true, arrow = true, dark = true, onClick, style = {} }) {
  return (
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', width: '100%', cursor: enabled ? 'pointer' : 'default',
      background: dark ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)', color: dark ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: dark
        ? (enabled ? 'none' : 'none')
        : 'none',
      fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 12, padding: '15px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: enabled ? 1 : 0.32, letterSpacing: '0.03em', ...style,
    }}>
      {label}
      {arrow ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke={dark ? 'var(--on-fill)' : 'var(--ink)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
    </button>
  );
}

// ── "as featured in" credibility row (text wordmarks, monochrome) ────
function PressRow({ label = 'As featured in' }) {
  const names = [
    ['Forbes', { fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 19, letterSpacing: '0.01em' }],
    ['WIRED', { fontFamily: 'var(--font)', fontWeight: 900, fontSize: 14.5, letterSpacing: '0.06em' }],
    ['The Atlantic', { fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 14.5, fontStyle: 'italic' }],
    ['TechTimes', { fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, letterSpacing: 'normal' }],
  ];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 14 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '14px 22px', opacity: 0.55 }}>
        {names.map(([n, st]) => (<span key={n} style={{ color: 'var(--ink)', ...st }}>{n}</span>))}
      </div>
    </div>
  );
}

// ── visualization mount — the illustration floats directly on the
// Stage atmosphere (no framed card), with a soft aura giving it focal
// presence. Keeps a fixed height so surrounding layout is unchanged. ──
function HeroCard({ hue = 262, h = 248, children, style = {} }) {
  return (
    <div style={{
      width: '100%', height: h, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '80%', borderRadius: '50%', background: `radial-gradient(circle, ${tint(hue, 0.8, 0.1, 0.16)}, transparent 70%)` }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── the signature VICI scene — the full faceted shore (scenes-core.jsx):
// sun over a layered sea, a boat setting out, surf reaching the sand.
function TideScene({ hue = 262, w = 250, h = 158 }) {
  return <SceneShore w={w} h={h} />;
}

// ── the onboarding lesson illustrations — full faceted-planar scenes
// (scenes-core.jsx), one landscape metaphor per lesson:
//   wave   · the urge as a curling crest
//   rewire · the fork: worn track vs the new path up the lit hill
//   steps  · the staircase hill, a cairn at every turn
//   anchor · the harbour still-life: anchor, bollard, calm water
const SlideArt = {
  wave: () => <SceneWave />,
  rewire: () => <SceneRewire />,
  steps: () => <SceneSteps />,
  anchor: () => <SceneAnchor />,
};

// ── quiz option row (single or multi select) ─────────────────────────
function OptionRow({ label, sub, icon, selected, single = false, hue = 210, onClick }) {
  return (
    <button onClick={onClick} className={'tl-press' + (selected ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14,
      background: selected ? 'var(--card)' : 'transparent',
      boxShadow: selected ? 'inset 0 0 0 1.6px var(--fill)' : 'none',
    }}>
      {icon ? <span style={{ flexShrink: 0, display: 'inline-flex', width: 24, height: 24, color: selected ? 'var(--warm)' : 'var(--ink)' }}>{icon}</span> : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: selected ? 500 : 500, fontSize: 14.5, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</div>
        {sub ? <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>{sub}</div> : null}
      </div>
      <div style={{
        flexShrink: 0, width: 24, height: 24, borderRadius: single ? 9999 : 8,
        border: selected ? 'none' : '2px solid var(--soft2)',
        background: selected ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'transparent',
        boxShadow: selected ? 'none' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .15s, box-shadow .15s',
      }}>
        {selected ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--on-fill)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
      </div>
    </button>
  );
}

// ── projection chart: quiet ink — one rising line, one fading sawtooth ─
function ProjectionChart() {
  const W = 320, H = 196, x0 = 8, x1 = 312, yBot = 154;
  const up = `M${x0} 140 C 70 134, 96 98, 150 76 S 252 32, ${x1} 24`;
  const upArea = `${up} L ${x1} ${yBot} L ${x0} ${yBot} Z`;
  const flat = `M${x0} 130 L 82 98 L 82 142 L 168 94 L 168 142 L 246 106 L 246 142 L ${x1} 134`;
  const dots = [[124, 86, 'Day 7'], [222, 48, 'Day 30'], [x1, 24, 'Day 90']];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="var(--line)" strokeWidth="1" />
      <path d={upArea} fill="color-mix(in oklab, var(--ink) 6%, transparent)" />
      <path d={flat} stroke="var(--ink4)" strokeWidth="1.8" strokeDasharray="3 5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="onb-draw" d={up} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" pathLength="1" />
      {/* you-are-here */}
      <circle cx={x0} cy={140} r="8" className="onb-pulse" fill="var(--ink)" opacity="0.4" />
      <circle cx={x0} cy={140} r="4.5" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.6" />
      <text x={x0} y={140 + 22} fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.08em' }}>TODAY</text>
      {dots.map(([x, y, lab], k) => (
        <g key={k}>
          <circle cx={x} cy={y} r={k === 2 ? 6 : 4.5} fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.6" />
          <text x={x === x1 ? x - 2 : x} y={y - 14} textAnchor={x === x1 ? 'end' : 'middle'} fill="var(--ink2)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11 }}>{lab}</text>
        </g>
      ))}
      <text x={x1} y={yBot + 18} textAnchor="end" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5 }}>streaks reset · progress doesn’t</text>
    </svg>
  );
}

// ── pattern meter: finer gradient track + glowing thumb ──────────────
function PatternMeter({ level = 0.56, label = 'Moderate' }) {
  return (
    <div>
      <div style={{ position: 'relative', height: 12, borderRadius: 9999, background: 'var(--soft2)', overflow: 'visible', boxShadow: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'linear-gradient(90deg, var(--ink4), var(--ink3), var(--ink))' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${level * 100}%`, transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: 9999, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {['Light', 'Moderate', 'Heavy'].map((m) => (
          <span key={m} style={{ fontFamily: 'var(--font)', fontWeight: m === label ? 500 : 500, fontSize: 13, color: m === label ? 'var(--ink)' : 'var(--ink3)' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0' }}>
      <span style={{ flexShrink: 0, display: 'inline-flex', width: 22, height: 22, color: 'var(--ink2)' }}>{icon}</span>
      <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal', textAlign: 'right', maxWidth: 150 }}>{value}</span>
    </div>
  );
}

// ── loading ring: gradient arc + soft glow + slow shimmer halo ────────
function LoadingRing({ pct = 0.66, size = 138, hue = 200 }) {
  const uid = oaId().replace(/[:]/g, '');
  const r = size / 2 - 10, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`lr-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tint(hue, 0.6, 0.11)} /><stop offset="1" stopColor="var(--ink)" />
        </linearGradient>
        <filter id={`lr-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle className="onb-spin" cx={size / 2} cy={size / 2} r={r + 6} fill="none" stroke={tint(hue, 0.65, 0.09, 0.5)} strokeWidth="1.5" strokeDasharray="2 10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--soft2)" strokeWidth="7" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#lr-${uid})`} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter={`url(#lr-glow-${uid})`} style={{ transition: 'stroke-dashoffset .45s ease' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="var(--ink)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 28, letterSpacing: '-0.01em' }}>{Math.round(pct * 100)}%</text>
    </svg>
  );
}

// ── tiny inline stars ────────────────────────────────────────────────
function MiniStars({ n = 5, size = 14, color = 'var(--ink)' }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, k) => (
        <svg key={k} width={size} height={size} viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z" fill={color} /></svg>
      ))}
    </span>
  );
}

// ── stacked initials avatars (subtle hue tints) ──────────────────────
function AvatarStack({ items = ['J', 'M', 'A', 'K'], size = 34 }) {
  const shades = [0.62, 0.72, 0.66, 0.78];
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {items.map((it, k) => (
        <div key={k} style={{
          width: size, height: size, borderRadius: 9999, background: tint(0, shades[k % shades.length], 0.006, 1),
          boxShadow: 'none', marginLeft: k ? -size * 0.34 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: items.length - k,
          fontFamily: 'var(--font)', fontWeight: 500, fontSize: size * 0.38, color: 'var(--ink)',
        }}>{it}</div>
      ))}
    </div>
  );
}

function Testimonial({ initials, name, handle, quote, hue = 262 }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 9999, background: 'var(--soft2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', flexShrink: 0 }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)' }}>{handle}</div>
        </div>
        <MiniStars n={5} size={13} color={tint(40, 0.62, 0.13)} />
      </div>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, lineHeight: 1.5, color: 'var(--ink)', margin: 0, textWrap: 'pretty' }}>{quote}</p>
    </div>
  );
}

function BigStat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 30, color: 'var(--ink)', letterSpacing: '-0.012em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ── celebration layer: calm = nothing (bloom handled by caller); medium
// = slow low-chroma motes drifting up; full = livelier confetti fall. ─
const CELEB_SHADES = [0.3, 0.55, 0.85, 0.45, 0.7];
function _seed(n) { let s = n * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function Particles({ mode = 'medium' }) {
  if (mode === 'calm') return null;
  const full = mode === 'full';
  const count = full ? 40 : 18;
  const rnd = _seed(full ? 7 : 3);
  const bits = Array.from({ length: count }).map((_, k) => {
    const x = rnd() * 100;
    const size = full ? 5 + rnd() * 6 : 3 + rnd() * 3.4;
    const dur = full ? 2.6 + rnd() * 2.4 : 6.5 + rnd() * 5.5;
    const delay = -rnd() * dur;
    const shade = CELEB_SHADES[k % CELEB_SHADES.length];
    const round = full ? rnd() > 0.5 : true;
    return { k, x, y: 22 + rnd() * 66, size, dur, delay, col: tint(0, shade, 0.006, full ? 0.85 : 0.7), full, round };
  });
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {bits.map((b) => (
        <span key={b.k} className={b.full ? 'onb-confetti' : 'onb-float'} style={{
          position: 'absolute', left: `${b.x}%`, top: b.full ? 0 : `${b.y}%`,
          width: b.size, height: b.full && !b.round ? b.size * 1.8 : b.size,
          borderRadius: b.round ? 9999 : 2, background: b.col,
          animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ── quiet milestone seal: a stamped dark disc + check, soft tinted halo,
// small caption. Stamps in on mount. ─────────────────────────────
function SealBadge({ label, hue = 168, size = 72 }) {
  return (
    <div className="onb-stamp" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', inset: -11, borderRadius: 9999, background: tint(hue, 0.72, 0.1, 0.22), filter: 'blur(2.5px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--on-fill)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      {label ? <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: tint(hue, 0.5, 0.11) }}>{label}</span> : null}
    </div>
  );
}

Object.assign(window, {
  Stage, OnbBar, PagerDots, NextPill, PressRow, SlideArt, TideScene, HeroCard, OptionRow, ProjectionChart,
  PatternMeter, StatRow, LoadingRing, MiniStars, AvatarStack, Testimonial, BigStat, tint,
  Particles, SealBadge,
});
