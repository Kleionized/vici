// screens-checkin.jsx — Daily check-in flow for VICI.
// Three steps: (1) mood slider with a central visual that morphs by mood,
// (2) feeling-word selection that adapts to the chosen mood, (3) the
// reasons/factors behind it. Plus a closing summary. Built entirely in the
// VICI calm-monochrome system; only the central visual + slider track
// carry a mood-mapped tone (cool → warm).
//
// Exports (to window): CheckInScreen (full live flow), MoodLowScreen,
// MoodFineScreen, MoodRadiantScreen, FeelingsScreen, ReasonsScreen.

const { useState, useRef, useCallback } = React;

// ── mood model ──────────────────────────────────────────────────────
const CKBG = 'var(--bg)'; // flat paper, exactly like home

const MOODS = [
  { key: 'low',     label: 'Low' },
  { key: 'down',    label: 'Down' },
  { key: 'fine',    label: 'Fine' },
  { key: 'good',    label: 'Good' },
  { key: 'radiant', label: 'Radiant' },
];

// a supportive line under the mood label, per band
const SUBLINE = {
  low:     "It's okay to start here.",
  down:    "Be gentle with yourself today.",
  fine:    "Steady is a good place to be.",
  good:    "Nice \u2014 let's build on it.",
  radiant: "Beautiful. Soak it in.",
};

// candidate feeling words per mood band (what best describes it)
const FEELINGS = {
  low:     ['Drained', 'Anxious', 'Overwhelmed', 'Numb', 'Lonely', 'Defeated', 'Tense', 'Foggy', 'Irritable'],
  down:    ['Angry', 'Annoyed', 'Restless', 'Worried', 'Insecure', 'Distracted', 'Tired', 'Discouraged', 'Bored'],
  fine:    ['Okay', 'Steady', 'Neutral', 'Settled', 'Present', 'Reserved', 'Even', 'Quiet', 'Patient'],
  good:    ['Content', 'Motivated', 'Hopeful', 'Focused', 'Rested', 'Grateful', 'Capable', 'Connected', 'Light'],
  radiant: ['Energised', 'Joyful', 'Grateful', 'Proud', 'Inspired', 'Confident', 'Playful', 'Alive', 'Free'],
};

// ── filled ("full") icon set — solid silhouettes, evenodd cut-outs for
// inner detail so the holes pick up the container colour. (c) = fill colour.
const FIcon = {
  work:    (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 2.5h6.1L18 6.9V20a1.6 1.6 0 01-1.6 1.6H7.6A1.6 1.6 0 016 20V4.1A1.6 1.6 0 017.6 2.5zM8.5 9.2h7v1.7h-7zM8.5 12.7h7v1.7h-7zM8.5 16.2h4.6v1.7H8.5z" fill={c} /></svg>,
  sleep:   (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1ZM9.4 11.3a1.4 1.4 0 1 0 .001 0ZM12.8 16.1a1 1 0 1 0 .001 0Z" fill={c} /></svg>,
  health:  (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 21S3.4 14.4 3.4 8.7A4.5 4.5 0 0112 6a4.5 4.5 0 018.6 2.7C20.6 14.4 12 21 12 21z" fill={c} /></svg>,
  people:  (c) => <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="7.7" r="4.1" fill={c} /><path d="M3.6 20.4c0-4.2 3.8-6.6 8.4-6.6s8.4 2.4 8.4 6.6z" fill={c} /></svg>,
  money:   (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4 5.5h16a2 2 0 012 2V16.5a2 2 0 01-2 2H4a2 2 0 01-2-2V7.5a2 2 0 012-2zM2 9.3h20v2.1H2zM5.5 14.4h4v1.7h-4z" fill={c} /></svg>,
  weather: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.7" fill={c} /><g stroke={c} strokeWidth="2.1" strokeLinecap="round"><path d="M12 2.4v2.6M12 19v2.6M2.4 12H5M19 12h2.6M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M18.9 5.1l-1.8 1.8M6.9 17.1l-1.8 1.8" /></g></svg>,
  rest:    (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20.5 3.5C12 3 5 7 4.4 14.2c-.3 3.6 1.7 5.4 1.7 5.4S7 14 11 11c0 0-3.4 3.4-4.4 8.8 0 0 9.8 1.6 13-7.2 1.2-3.3 1.4-6.6.9-9.1z" fill={c} /></svg>,
  focus:   (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 4.5C5.5 4.5 2 12 2 12s3.5 7.5 10 7.5S22 12 22 12 18.5 4.5 12 4.5zM12 8.6a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8z" fill={c} /></svg>,
  time:    (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.7a9.3 9.3 0 100 18.6 9.3 9.3 0 000-18.6zM11.1 6.6h1.8v6.1l4.2 2.4-.9 1.6-5.1-3z" fill={c} /></svg>,
};

// reasons / factors (universal) with filled icons
const REASONS = [
  ['Work', FIcon.work], ['Sleep', FIcon.sleep], ['Health', FIcon.health],
  ['People', FIcon.people], ['Money', FIcon.money], ['Weather', FIcon.weather],
  ['Rest', FIcon.rest], ['Focus', FIcon.focus], ['Time', FIcon.time],
];

const lerp = (a, b, t) => a + (b - a) * t;
const moodIndex = (t) => Math.round(t * (MOODS.length - 1));
// mood tone — the home screen's week-ring ramp, shared via stoic-kit
const ckTone = (t) => MOOD_TONES[moodIndex(t)];

// ── the central visual: full faceted-planar mood scenes, in the same
// language as the home illustration and TipScene (see scenes-mood.jsx).
// Every kind — weather, tide, moon, bloom, rings, aurora, orb — is one
// scene that morphs continuously with t as the slider is dragged.
function MoodVisual({ t, kind, vivid }) {
  const map = window.MoodScenes || {};
  const V = map[kind] || map.weather;
  return V ? <V t={t} /> : null;
}

// ── draggable mood slider — home's flat vocabulary: a soft grey track
// that fills with dark ink up to the thumb, a plain white pill thumb ──
function MoodSlider({ value, onChange, vivid }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const set = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let t = (clientX - r.left) / r.width;
    onChange(Math.max(0, Math.min(1, t)));
  }, [onChange]);
  const down = (e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); };
  const move = (e) => { if (dragging.current) set(e.clientX); };
  const up = (e) => { dragging.current = false; try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {} };
  const idx = moodIndex(value);

  return (
    <div style={{ width: '100%', padding: '0 16px' }}>
      <div
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none' }}
      >
        {/* the whole ramp lives on the track — pale low → near-black radiant */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 10, borderRadius: 9999, background: `linear-gradient(90deg, ${MOOD_TONES.join(', ')})` }} />
        <div style={{
          position: 'absolute', left: `calc(${value} * (100% - 26px) + 13px)`, top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 26, height: 32, borderRadius: 11,
          background: 'linear-gradient(180deg, #FFFFFF, #F6F5F1)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5,
        }}>
          <span style={{ width: 1.5, height: 10, borderRadius: 1, background: 'rgba(0,0,0,0.13)' }} />
          <span style={{ width: 1.5, height: 10, borderRadius: 1, background: 'rgba(0,0,0,0.13)' }} />
        </div>
      </div>
    </div>
  );
}

// ── shared top bar: back chevron + slim 3-step progress ─────────────
function CheckTop({ step = 0, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 9, width: '70%' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i <= step ? 'var(--fill)' : 'var(--soft2)', transition: 'background .2s' }} />
          ))}
        </div>
      </div>
      <div style={{ width: 22, flexShrink: 0 }} />
    </div>
  );
}

// primary full-width pill — home's flat dark button, scaled up. `tone`
// is accepted for call-site compatibility but ignored: every CTA is the
// same solid ink, exactly like the home screen's "Start lesson".
function ContinueButton({ label = 'Continue', enabled = true, onClick, tone }) {
  return (
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', width: '100%',
      cursor: enabled ? 'pointer' : 'default',
      background: 'var(--fill)', color: 'var(--on-fill)',
      fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5,
      borderRadius: 9999, padding: '15px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      opacity: enabled ? 1 : 0.35,
      boxShadow: 'none',
      letterSpacing: '0.01em',
    }}>
      {label}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="var(--on-fill)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

// ── STEP 1 · mood slider ────────────────────────────────────────────
function MoodStep({ value, onChange, onBack, onContinue, kind, vivid }) {
  const idx = moodIndex(value);
  const mood = MOODS[idx];
  // continuous tone — blends between adjacent ramp stops as you drag
  const seg = Math.min(3.999, Math.max(0, value * 4));
  const segI = Math.floor(seg), segF = seg - segI;
  const smoothTone = `color-mix(in oklab, ${MOOD_TONES[Math.min(4, segI + 1)]} ${Math.round(segF * 100)}%, ${MOOD_TONES[segI]})`;
  return (
    <Shell top={60} bg={CKBG}>
      <CheckTop step={0} onBack={onBack} />
      <div style={{ marginTop: 30, marginBottom: 4, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.16, letterSpacing: '0.01em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>
          How are you feeling right now?
        </h2>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* the mood IS the colour — the disc takes the home ramp tone and
            the weather is drawn inside it in a contrasting ink (white
            sunlight on the dark radiant disc). 'tone' = plain disc. */}
        {kind === 'tone' ? (
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 146 + 54 * value, height: 146 + 54 * value, borderRadius: '50%', background: smoothTone }} />
          </div>
        ) : (
          <MoodVisual t={value} kind={kind} vivid={vivid} />
        )}
        <div key={mood.key} className="urge-fade" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '0.012em', lineHeight: 1, marginTop: 28, color: 'var(--ink)' }}>{mood.label}</div>
        <p key={mood.key + '-s'} className="urge-fade" style={{ fontFamily: 'var(--font)', fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink2)', fontWeight: 400, margin: '12px 0 0', textAlign: 'center', textWrap: 'balance' }}>
          {SUBLINE[mood.key]}
        </p>
      </div>
      <div style={{ paddingBottom: 34 }}>
        <MoodSlider value={value} onChange={onChange} vivid={vivid} />
      </div>
      <div style={{ paddingLeft: 2, paddingRight: 2, marginBottom: 8 }}>
        <ContinueButton onClick={onContinue} />
      </div>
    </Shell>
  );
}

// selectable word pill
function WordPill({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5,
      padding: '12px 18px', borderRadius: 9999, letterSpacing: '-0.005em',
      background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)',
      color: on ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: on ? 'none' : 'none',
    }}>{label}</button>
  );
}

// donut-segment path helper for the emotion wheel
function wedgePath(cx, cy, r, R, a0deg, a1deg) {
  const a0 = a0deg * Math.PI / 180, a1 = a1deg * Math.PI / 180;
  const x0o = cx + R * Math.cos(a0), y0o = cy + R * Math.sin(a0);
  const x1o = cx + R * Math.cos(a1), y1o = cy + R * Math.sin(a1);
  const x1i = cx + r * Math.cos(a1), y1i = cy + r * Math.sin(a1);
  const x0i = cx + r * Math.cos(a0), y0i = cy + r * Math.sin(a0);
  const large = (a1deg - a0deg) % 360 > 180 ? 1 : 0;
  return `M${x0o} ${y0o} A${R} ${R} 0 ${large} 1 ${x1o} ${y1o} L${x1i} ${y1i} A${r} ${r} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

// ── the emotion wheel: a ring of wedges — selected ones take the mood's
// tone from the home week-ring ramp ──────────────────────────
function MoodWheel({ words, selected, onToggle, toneIdx = 2 }) {
  const N = words.length;
  const cx = 162, cy = 162, r = 50, R = 158;
  const step = 360 / N, gap = 0;
  const tone = MOOD_TONES[toneIdx];
  const onText = toneIdx >= 3 ? '#F5F4F1' : '#1D1C1A';
  return (
    <svg viewBox="0 0 324 324" style={{ width: '100%', maxWidth: 330, display: 'block' }}>
      {words.map((w, i) => {
        const a0 = -90 + i * step + gap / 2, a1 = -90 + (i + 1) * step - gap / 2;
        const mid = (a0 + a1) / 2, midR = mid * Math.PI / 180;
        const on = selected.includes(w);
        const lr = (r + R) / 2 + 2;
        const lx = cx + Math.cos(midR) * lr, ly = cy + Math.sin(midR) * lr;
        return (
          <g key={w} onClick={() => onToggle(w)} style={{ cursor: 'pointer' }}>
            <path d={wedgePath(cx, cy, r, R, a0, a1)} fill={on ? tone : 'var(--card)'}
              stroke={on ? tone : 'var(--line)'} strokeWidth={on ? 1.8 : 1}
              style={{ transition: 'fill .15s' }} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: 'var(--font)', fontSize: 11.5, fontWeight: on ? 600 : 500, fill: on ? onText : 'var(--ink2)', pointerEvents: 'none' }}>{w}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r - 8} fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: 'var(--font)', fontSize: 22, fontWeight: 500, fill: 'var(--ink)' }}>{selected.length || ''}</text>
      <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: 'var(--font)', fontSize: 10.5, fontWeight: 500, fill: 'var(--ink3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{selected.length ? 'picked' : 'tap'}</text>
    </svg>
  );
}

// ── STEP 2 · feeling words (adapts to mood) ─────────────────────────
function FeelingsStep({ moodKey, selected, onToggle, onBack, onContinue }) {
  const words = FEELINGS[moodKey] || FEELINGS.fine;
  const bandIdx = Math.max(0, MOODS.findIndex((m) => m.key === moodKey));
  const label = (MOODS[bandIdx] || MOODS[2]).label.toLowerCase();
  return (
    <Shell top={60} bg={CKBG}>
      <CheckTop step={1} onBack={onBack} />
      <div style={{ marginTop: 30, marginBottom: 4, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.16, letterSpacing: '0.01em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>What best describes it?</h2>
        <p style={{ fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--ink2)', fontWeight: 400, margin: '12px 0 0', lineHeight: 1.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <span style={{ width: 12, height: 12, borderRadius: 9999, background: MOOD_TONES[bandIdx], display: 'inline-block', flexShrink: 0 }} />
          You're feeling {label}. Tap the emotions that fit.
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <MoodWheel words={words} selected={selected} onToggle={onToggle} toneIdx={bandIdx} />
      </div>
      <div style={{ paddingTop: 16 }}>
        <ContinueButton enabled={selected.length > 0} onClick={onContinue}
          label={selected.length ? `Continue · ${selected.length}` : 'Continue'} />
      </div>
    </Shell>
  );
}

// reason cell (icon + label), multi-select
function ReasonCell({ label, icon, on, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      padding: '18px 8px', borderRadius: 18,
      background: on ? 'var(--soft)' : 'var(--card)',
      boxShadow: on ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--soft)',
        boxShadow: on ? 'none' : 'none',
        transition: 'background .15s, box-shadow .15s',
      }}>
        <span style={{ display: 'inline-flex', width: 24, height: 24 }}>{icon(on ? 'var(--on-fill)' : 'var(--ink)')}</span>
      </div>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
    </button>
  );
}

// ── STEP 3 · reasons / factors ──────────────────────────────────────
function ReasonsStep({ selected, onToggle, onBack, onContinue }) {
  return (
    <Shell top={60} bg={CKBG}>
      <CheckTop step={2} onBack={onBack} />
      <div style={{ marginTop: 30, marginBottom: 4, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.16, letterSpacing: '0.01em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>What's behind it?</h2>
        <p style={{ fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--ink2)', fontWeight: 400, margin: '12px 0 0', lineHeight: 1.45 }}>
          Tap any that played a part.
        </p>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignContent: 'flex-start', marginTop: 26 }}>
        {REASONS.map(([label, icon]) => (
          <ReasonCell key={label} label={label} icon={icon} on={selected.includes(label)} onClick={() => onToggle(label)} />
        ))}
      </div>
      <div style={{ paddingTop: 16 }}>
        <ContinueButton enabled={selected.length > 0} onClick={onContinue} label="Save check-in" />
      </div>
    </Shell>
  );
}

// ── STEP 4 · summary / done ─────────────────────────────────────────
function DoneStep({ value, feelings, reasons, onRestart, kind, vivid }) {
  const idx = moodIndex(value);
  const mood = MOODS[idx];
  const tone = MOOD_TONES[idx];
  return (
    <Shell top={60} bg={CKBG}>
      <CheckTop step={3} onBack={onRestart} />
      <div style={{ flex: 1, overflowY: 'auto', margin: '0 -29px', padding: '14px 29px 12px' }}>
        {/* the day, sealed — dark like home's Next lesson card */}
        <DarkCard pad={22}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: DARK.mut }}>Checked in</div>
            <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: DARK.mut2 }}>Day XXIV</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <span style={{ width: 44, height: 44, borderRadius: 9999, background: tone, flexShrink: 0 }} />
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 27, lineHeight: 1.1, letterSpacing: '0.005em', color: DARK.paper, margin: 0 }}>
              Feeling {mood.label.toLowerCase()}.
            </h2>
          </div>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: DARK.mut, margin: '16px 0 0' }}>{SUBLINE[mood.key]}</p>
        </DarkCard>

        <div style={{ marginTop: 38 }}>
          <SectionLabel right={`${feelings.length || 0} picked`} style={{ marginBottom: 12 }}>In words</SectionLabel>
          <Card pad={20}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(feelings.length ? feelings : ['—']).map((w) => (
                <span key={w} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', background: 'var(--soft)', padding: '7px 13px', borderRadius: 9999 }}>{w}</span>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ marginTop: 34 }}>
          <SectionLabel right={`${reasons.length || 0} picked`} style={{ marginBottom: 12 }}>Behind it</SectionLabel>
          <Card pad={20}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(reasons.length ? reasons : ['—']).map((r) => (
                <span key={r} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', background: 'var(--soft)', padding: '7px 13px', borderRadius: 9999 }}>{r}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div style={{ paddingTop: 12 }}>
        <ContinueButton label="Done" onClick={onRestart} />
      </div>
    </Shell>
  );
}

// Visual config is published by App on every render (mirrors CURRENT_DARK),
// so a tweak change re-renders App → these screens read the fresh value.
function getVis() {
  const v = window.CURRENT_CHECKIN || {};
  return { kind: v.kind || 'weather', vivid: !!v.vivid };
}

// ── live, end-to-end flow ───────────────────────────────────────────
function CheckInScreen({ onExit }) {
  const { kind, vivid } = getVis();

  const [step, setStep] = useState(0);
  const [value, setValue] = useState(0.78);
  const [feelings, setFeelings] = useState([]);
  const [reasons, setReasons] = useState([]);
  const moodKey = MOODS[moodIndex(value)].key;

  const toggle = (list, set) => (x) => set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const restart = () => { setStep(0); setFeelings([]); setReasons([]); };
  // when embedded (Log hub), leaving hands control back to the host
  const leave = () => { restart(); onExit && onExit(); };

  if (step === 0) return <MoodStep value={value} onChange={setValue} kind={kind} vivid={vivid} onBack={leave} onContinue={() => setStep(1)} />;
  if (step === 1) return <FeelingsStep moodKey={moodKey} selected={feelings} onToggle={toggle(feelings, setFeelings)} onBack={() => setStep(0)} onContinue={() => setStep(2)} />;
  if (step === 2) return <ReasonsStep selected={reasons} onToggle={toggle(reasons, setReasons)} onBack={() => setStep(1)} onContinue={() => setStep(3)} />;
  return <DoneStep value={value} feelings={feelings} reasons={reasons} kind={kind} vivid={vivid} onRestart={leave} />;
}

// ── static single-screen variants for the canvas ────────────────────
function makeMoodScreen(initial) {
  return function MoodScreen() {
    const { kind, vivid } = getVis();
    const [value, setValue] = useState(initial);
    return <MoodStep value={value} onChange={setValue} kind={kind} vivid={vivid} onBack={() => {}} onContinue={() => {}} />;
  };
}
const MoodLowScreen = makeMoodScreen(0.0);
const MoodDownScreen = makeMoodScreen(0.25);
const MoodFineScreen = makeMoodScreen(0.5);
const MoodGoodScreen = makeMoodScreen(0.75);
const MoodRadiantScreen = makeMoodScreen(1.0);

function FeelingsScreen() {
  const [sel, setSel] = useState(['Tired', 'Annoyed']);
  const toggle = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <FeelingsStep moodKey="down" selected={sel} onToggle={toggle} onBack={() => {}} onContinue={() => {}} />;
}

function ReasonsScreen() {
  const [sel, setSel] = useState(['Work', 'Sleep']);
  const toggle = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <ReasonsStep selected={sel} onToggle={toggle} onBack={() => {}} onContinue={() => {}} />;
}

Object.assign(window, {
  CheckInScreen, MoodLowScreen, MoodDownScreen, MoodFineScreen, MoodGoodScreen, MoodRadiantScreen, FeelingsScreen, ReasonsScreen,
});
