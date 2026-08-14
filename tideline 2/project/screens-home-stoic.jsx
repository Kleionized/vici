// screens-home-stoic.jsx — "Day 24" serif home. The reference screen's
// layout language (letterspaced caps, big serif, engraved card, checklist
// card, floating pill tab bar with a raised center button) carrying the
// REAL VICI home content — streak, mood line, next lesson, today's
// steps, the week strip, and the urge shortcut — in strict black & white.
// Fonts are hard-coded on purpose — this screen must not follow the
// canvas-wide font tweak.

const { useState: shState } = React;

// ── monochrome palette ───────────────────────────────────────────────
const SH = {
  bg: '#F4F3F0',
  card: '#FAF9F6',
  ink: '#1D1C1A',
  ink2: '#55534E',
  ink3: '#8B8882',
  ink4: '#B4B1AB',
  hair: 'rgba(0,0,0,0.09)',
  btnTop: '#26251F',
  btnBot: '#161511',
  paper: '#F5F4F1',
  serif: "'EB Garamond', 'Iowan Old Style', Georgia, 'Times New Roman', serif",
  sans: "'Gill Sans', 'Gill Sans MT', 'Gill Sans Nova', 'Trebuchet MS', Calibri, sans-serif",
};

const shCaps = (size, color, ls = '0.18em', weight = 600) => ({
  fontFamily: SH.sans, fontWeight: weight, fontSize: size,
  letterSpacing: ls, textTransform: 'uppercase', color,
});

// ── glyphs (thin ink lines, all monochrome) ──────────────────────────
const SHWave = ({ w = 24, color = SH.ink, sw = 2 }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 34 20" fill="none">
    <path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SHDrop = ({ size = 19, color = '#5A5751' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.6c3.6 4.7 5.8 8 5.8 11a5.8 5.8 0 0 1-11.6 0c0-3 2.2-6.3 5.8-11z" fill={color}/>
    <path d="M8.9 13.4a3.2 3.2 0 0 0 2.1 3.2" stroke="#FAF9F6" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85"/>
    <circle cx="9.4" cy="11.2" r="0.8" fill="#FAF9F6" opacity="0.85"/>
  </svg>
);
const SHWalk = ({ size = 19, color = '#5A5751' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="13.6" cy="4.2" r="2.2" fill={color}/>
    <path d="M13 7.4c1 0 1.8.6 2.1 1.5l1 2.6 2.3 1.3a1 1 0 0 1-1 1.8l-2.6-1.5a1.9 1.9 0 0 1-.8-.9l-.5-1.2-1.2 3.8 2.3 2.3c.3.3.4.6.5 1l.6 3.5a1.1 1.1 0 0 1-2.1.4l-.6-3.2-2.7-2.6-2 2.8-2.6 2.9a1.05 1.05 0 0 1-1.6-1.4l2.5-2.8 1.7-2.6 1.3-4.4-1.3.8-1 2.5a1 1 0 0 1-1.9-.7l1.1-2.9c.1-.4.4-.7.8-.9l3.3-1.9c.6-.3 1-.4 1.6-.4z" fill={color}/>
  </svg>
);
const SHBook = ({ size = 19, color = '#5A5751' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M11.3 5.8C9.8 4.7 7.7 4.1 5.5 4.2c-.3 0-.6.3-.6.6v11.4c0 .3.3.6.6.6 2.1 0 4.3.6 5.8 1.8z" fill={color}/>
    <path d="M12.7 5.8c1.5-1.1 3.6-1.7 5.8-1.6.3 0 .6.3.6.6v11.4c0 .3-.3.6-.6.6-2.1 0-4.3.6-5.8 1.8z" fill={color}/>
    <path d="M7 7.3c1.1.1 2.1.4 3 .9M7 9.8c1.1.1 2.1.4 3 .9M14 8.2c.9-.5 1.9-.8 3-.9M14 10.7c.9-.5 1.9-.8 3-.9" stroke="#FAF9F6" strokeWidth="0.9" strokeLinecap="round" opacity="0.8"/>
    <path d="M4.2 18.6c2.6-.2 5.6.3 7.8 1.9 2.2-1.6 5.2-2.1 7.8-1.9" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const SHQuill = ({ size = 19, color = '#5A5751' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.2 3.1c-4.6.4-8.2 2-10.5 4.8-1.6 1.9-2.5 4.3-2.7 6.9 1.1.2 2.2.2 3.2.1 3-.4 5.5-1.8 7.2-4.2 1.4-2 2.3-4.6 2.8-7.6z" fill={color}/>
    <path d="M17.8 5.6c-3.2 2.3-6 5.2-8.5 8.7" stroke="#FAF9F6" strokeWidth="1" strokeLinecap="round" opacity="0.85"/>
    <path d="M8.6 15.5 5 20.3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M4.4 21.2l1.7-.5-1.1-1.2z" fill={color}/>
  </svg>
);
const SHClock = ({ size = 15, color = SH.ink2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.6a9.4 9.4 0 1 0 0 18.8 9.4 9.4 0 0 0 0-18.8zm0 1.8a7.6 7.6 0 1 1 0 15.2 7.6 7.6 0 0 1 0-15.2z" fill={color}/>
    <path d="M12 7v5.3l3.6 2.1" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SHCheck = ({ size = 10, color = '#F5F4F1' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="m5 12.5 4.5 4.5L19 7.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SHChevron = ({ size = 11, color = SH.ink2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="m9 5.4 6.6 6.6L9 18.6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SHArrow = ({ w = 15, color = '#F5F4F1' }) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 22 14" fill="none">
    <path d="M1 7h19M14.6 1.4 20.4 7l-5.8 5.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SHAvatarGlyph = ({ size = 16, color = SH.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8.6" r="3.8" fill={color}/>
    <path d="M4.8 20.4a7.2 7.2 0 0 1 14.4 0z" fill={color}/>
  </svg>
);
// laurel wreath, drawn programmatically — monochrome brand mark
function SHLaurel({ size = 30, color = '#3A3835', open = 34 }) {
  const leaves = [];
  const N = 9, R = 30;
  for (const s of [-1, 1]) {
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const aDeg = -78 + t * (180 - open + 78 - 90);
      const a = (aDeg * Math.PI) / 180;
      const x = s * Math.cos(a) * R * -1;
      const y = -Math.sin(a) * R;
      const len = 10.5 - t * 3.6, wid = 3.6 - t * 1.1;
      const rot = s * (-aDeg - 90 + 38);
      leaves.push(
        <g key={s + '-' + i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <ellipse cx="0" cy={-len / 2} rx={wid / 2} ry={len / 2} fill={color} />
        </g>
      );
      leaves.push(
        <g key={s + '-' + i + 'b'} transform={`translate(${x * 0.86} ${y * 0.86 + 1.5}) rotate(${rot + s * 26})`}>
          <ellipse cx="0" cy={-len / 2.3} rx={wid / 2.4} ry={len / 2.4} fill={color} opacity="0.85" />
        </g>
      );
    }
  }
  return (
    <svg width={size} height={size} viewBox="-40 -40 80 80" style={{ display: 'block' }}>
      <path d="M -8 34 Q -30 24 -30 -14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 8 34 Q 30 24 30 -14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(0 4)">{leaves}</g>
    </svg>
  );
}
// flame — week-strip marker (layered: outer flame + inner tongue)
const SHFlame = ({ size = 15, color = '#9C9993' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M13.4 2.2c.7 2.9.1 5.3-1.5 7.3-.9 1.2-2 2.2-2.6 3.6-.8-.7-1.4-1.7-1.6-2.8-1.6 1.6-2.5 3.5-2.5 5.4A6.8 6.8 0 0 0 12 22.2a6.8 6.8 0 0 0 6.8-6.5c0-3.4-2.2-5.8-4.1-8.1-.6-.7-1-1.3-1.3-2z" fill={color}/>
    <path d="M12 21.2c-1.9 0-3.4-1.5-3.4-3.3 0-1.5 1-2.7 2-3.9.4-.5.9-1 1.2-1.6.4.6.8 1.1 1.3 1.6 1 1.2 2.1 2.4 2.1 3.9 0 1.8-1.4 3.3-3.2 3.3z" fill="#FAF9F6" opacity="0.55"/>
  </svg>
);
// tab icons — solid silhouettes with engraved detail
const SHTabHome = ({ size = 21, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.8 2.6 9.4l.9 1.3L12 4.7l8.5 6 .9-1.3z" fill={color}/>
    <path d="M4.8 11.3 12 6.2l7.2 5.1v8.5a1 1 0 0 1-1 1h-4V15h-4.4v5.8h-4a1 1 0 0 1-1-1z" fill={color}/>
  </svg>
);
const SHTabJourney = ({ size = 21, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2zm4 5.6-2.5 5.8a1 1 0 0 1-.5.5L7.2 16.8a.45.45 0 0 1-.6-.6l2.5-5.8a1 1 0 0 1 .5-.5l5.8-2.5a.45.45 0 0 1 .6.6z" fill={color}/>
    <circle cx="12" cy="12" r="1.3" fill="#FAF9F6"/>
  </svg>
);
const SHTabLog = ({ size = 21, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15.9 3.9a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L9 19.2l-4.8 1.3a.5.5 0 0 1-.6-.6L4.8 15z" fill={color}/>
    <path d="m14.2 5.6 4.2 4.2" stroke="#FAF9F6" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
    <path d="m5.4 15.7 2.9 2.9" stroke="#FAF9F6" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
  </svg>
);
const SHTabYou = ({ size = 21, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7.4" r="4" fill={color}/>
    <path d="M12 13.2c-4.2 0-7.4 2.6-7.9 6.3-.05.4.25.8.7.8h14.4c.45 0 .75-.4.7-.8-.5-3.7-3.7-6.3-7.9-6.3z" fill={color}/>
    <path d="M12 13.2v7.1" stroke="#FAF9F6" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

// ── section label: | CAPS ─── right link ─────────────────────────────
function SHLabel({ children, right }) {
  return (
    <div style={{ margin: '0 26px', display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={shCaps(14, '#3F3C36', '0.16em', 600)}>{children}</span>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// ── steps rows (actual: 2 of 4 done) ─────────────────────────────────
function SHStepRow({ icon, label, done, onClick }) {
  return (
    <button onClick={onClick} className="tl-press-soft" style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px',
      height: 56, borderRadius: 13, background: SH.card,
      boxShadow: 'none',
    }}>
      <span style={{ width: 32, display: 'flex', justifyContent: 'center', flexShrink: 0, opacity: done ? 0.4 : 1 }}>{icon}</span>
      <span style={{
        fontFamily: SH.sans, fontWeight: 500, fontSize: 16.5, color: SH.ink, letterSpacing: '0.015em', textAlign: 'left',
        fontVariantNumeric: 'lining-nums', flex: 1, opacity: done ? 0.42 : 1,
        textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'rgba(29,28,26,0.45)', textDecorationThickness: '1px',
      }}>{label}</span>
      {done ? (
        <span style={{ width: 20, height: 20, borderRadius: 9999, background: SH.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SHCheck size={9.5} />
        </span>
      ) : (
        <span style={{ width: 20, height: 20, borderRadius: 9999, border: '1.5px solid #ADAAA3', flexShrink: 0 }} />
      )}
    </button>
  );
}

function SHTab({ icon, label, active }) {
  const c = active ? SH.ink : SH.ink3;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      {icon(c)}
      <span style={{ fontFamily: SH.sans, fontWeight: active ? 600 : 400, fontSize: 12.5, color: c, letterSpacing: '0.02em' }}>{label}</span>
    </div>
  );
}

// ── the screen ───────────────────────────────────────────────────────
// ── week strip card + nav bar (shared with the bottom-detail board) ──
const shDays = [
  { l: 'S', d: 22, dim: true },
  { l: 'S', d: 23, dim: true },
  { l: 'M', d: 24 },
  { l: 'T', d: 25 },
  { l: 'W', d: 26 },
  { l: 'T', d: 27 },
  { l: 'F', d: 28, sel: true },
];
function SHWeekCard() {
  return (
    <div style={{
      margin: '14px 26px 0', borderRadius: 13, background: SH.card,
      boxShadow: 'none',
      padding: '15px 14px 14px', display: 'flex',
    }}>
      {shDays.map((dd, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: dd.dim ? 0.45 : 1 }}>
          <span style={{ fontFamily: SH.sans, fontWeight: 600, fontSize: 13.5, color: SH.ink2 }}>{dd.l}</span>
          <span style={{ display: 'inline-flex', height: 23, alignItems: 'center' }}><SHFlame size={23} color={dd.sel ? '#3A3835' : '#A5A29B'} /></span>
          {dd.sel ? (
            <span className="tnum" style={{ width: 25, height: 25, borderRadius: 9999, background: SH.ink, color: SH.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SH.sans, fontWeight: 600, fontSize: 13 }}>{dd.d}</span>
          ) : (
            <span className="tnum" style={{ height: 25, display: 'flex', alignItems: 'center', fontFamily: SH.sans, fontWeight: 500, fontSize: 14, color: SH.ink }}>{dd.d}</span>
          )}
        </div>
      ))}
    </div>
  );
}
function SHNavBar() {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <div style={{
        background: SH.bg,
        display: 'flex', alignItems: 'flex-end', padding: '20px 20px 26px',
      }}>
        <SHTab icon={(c) => <SHTabHome size={24} color={c} />} label="Today" active />
        <SHTab icon={(c) => <SHTabJourney size={24} color={c} />} label="Journey" />
        <div style={{ flex: 1.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 54, height: 54, borderRadius: 9999,
            background: `radial-gradient(90% 90% at 50% 22%, #34322C 0%, #191813 78%)`,
            boxShadow: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SHWave w={25} color="#F5F4F1" sw={2.4} />
          </div>
        </div>
        <SHTab icon={(c) => <SHTabLog size={24} color={c} />} label="Log" />
        <SHTab icon={(c) => <SHTabYou size={24} color={c} />} label="You" />
      </div>
    </div>
  );
}

function HomeStoicScreen() {
  const [steps, setSteps] = shState([
    { id: 'water', icon: <SHDrop size={28} />, label: 'Drink a glass of water', done: true },
    { id: 'walk', icon: <SHWalk size={28} />, label: 'Take a 10-minute walk', done: true },
    { id: 'lesson', icon: <SHBook size={28} />, label: "Read today's lesson", done: false },
    { id: 'log', icon: <SHQuill size={28} />, label: "Log how you're feeling", done: false },
  ]);
  const toggle = (id) => setSteps(steps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: `radial-gradient(120% 90% at 50% 0%, #F6F5F2 0%, ${SH.bg} 60%, #F0EFEB 100%)`,
      fontFamily: SH.serif, color: SH.ink,
    }}>
      {/* scrolling content — the pill nav floats above it */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 130 }}>
      {/* ── header: laurel · avatar ── */}
      <div style={{ padding: '60px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SHLaurel size={36} color="#3A3835" />
        <div style={{
          width: 38, height: 38, borderRadius: 9999, background: SH.card,
          boxShadow: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SHAvatarGlyph size={19} color="#2E2D2A" />
        </div>
      </div>

      {/* ── hero: Day XXIV + mood line ── */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 13 }}>
        <span style={{ width: 52, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.22))' }} />
        <span style={{ fontFamily: SH.serif, fontWeight: 600, fontSize: 35, lineHeight: 1, color: SH.ink, letterSpacing: '0.015em' }}>Day XXIV</span>
        <span style={{ width: 52, height: 1, background: 'linear-gradient(90deg, rgba(0,0,0,0.22), transparent)' }} />
      </div>
      <p style={{ margin: '11px 0 0', textAlign: 'center', ...shCaps(11.5, SH.ink2, '0.17em', 600) }}>
        You’re feeling good today
      </p>

      {/* ── next lesson (actual focus card) — tall, reaches mid-page ── */}
      <div style={{
        margin: '38px 26px 0', position: 'relative', borderRadius: 13, overflow: 'hidden',
        background: SH.card, minHeight: 222,
        boxShadow: 'none',
        display: 'flex',
      }}>
        <img src="assets/next-lesson-bg.webp" alt="" aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, height: '100%', width: '58%', objectFit: 'cover', objectPosition: '80% 40%',
          filter: 'grayscale(1) contrast(0.92) brightness(1.06)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 96%)',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 96%)',
        }} />
        <div style={{ position: 'relative', padding: '26px 26px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={shCaps(11.5, SH.ink2, '0.2em')}>Next lesson</div>
          <div style={{ fontFamily: SH.serif, fontWeight: 500, fontSize: 27, lineHeight: 1.15, color: SH.ink, marginTop: 13, whiteSpace: 'nowrap', letterSpacing: '0.012em' }}>
            Riding out a craving
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 13 }}>
            <SHClock size={15} color={SH.ink2} />
            <span style={{ fontFamily: SH.serif, fontWeight: 400, fontSize: 15, color: SH.ink2, fontVariantNumeric: 'lining-nums', letterSpacing: '0.02em' }}>3 min read</span>
          </div>
          <button className="tl-press" style={{
            appearance: 'none', cursor: 'pointer', marginTop: 'auto', alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7.5px 17px 8.5px', borderRadius: 9, border: 'none',
            background: `linear-gradient(180deg, ${SH.btnTop}, ${SH.btnBot})`,
            boxShadow: 'none',
          }}>
            <span style={{ fontFamily: SH.serif, fontWeight: 500, fontSize: 14.5, color: SH.paper, letterSpacing: '0.03em' }}>Start lesson</span>
            <SHArrow w={14} />
          </button>
        </div>
      </div>

      {/* ── today's steps (actual checklist, 2 of 4) ── */}
      <div style={{ marginTop: 48 }}>
        <SHLabel right={<span className="tnum" style={{ fontFamily: SH.sans, fontWeight: 500, fontSize: 14.5, color: SH.ink2 }}>{doneCount} of {steps.length}</span>}>
          Today’s steps
        </SHLabel>
      </div>
      <div style={{
        margin: '14px 26px 0', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {steps.map((s) => (
          <SHStepRow key={s.id} icon={s.icon} label={s.label} done={s.done} onClick={() => toggle(s.id)} />
        ))}
      </div>

      {/* ── your week (actual week strip) ── */}
      <div style={{ marginTop: 40 }}>
        <SHLabel right={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: SH.sans, fontWeight: 500, fontSize: 14.5, color: SH.ink2 }}>Analytics</span>
            <SHChevron size={12} color={SH.ink3} />
          </span>
        }>Your week</SHLabel>
      </div>
      <SHWeekCard />

      </div>

      <SHNavBar />
    </div>
  );
}

// ── bottom-detail board: just the week strip + nav bar, unobstructed ──
function HomeStoicBottomScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: `radial-gradient(120% 90% at 50% 0%, #F6F5F2 0%, ${SH.bg} 60%, #F0EFEB 100%)`,
      fontFamily: SH.serif, color: SH.ink,
    }}>
      <div style={{ paddingTop: 64 }}>
        <SHLabel right={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: SH.sans, fontWeight: 500, fontSize: 14.5, color: SH.ink2 }}>Analytics</span>
            <SHChevron size={12} color={SH.ink3} />
          </span>
        }>Your week</SHLabel>
        <SHWeekCard />
      </div>
      <SHNavBar />
    </div>
  );
}

Object.assign(window, { HomeStoicScreen, HomeStoicBottomScreen });
