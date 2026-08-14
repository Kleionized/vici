// screens-onb3.jsx — VICI onboarding v3 · "the campaign" funnel, part 1 of 3.
// The merged build: the pasted overhaul spec's 11-step funnel, keeping v2's
// best screens (the door, the reflections, the streak chart, the signature)
// and cutting what the spec bans (scores, comparison stats, countdowns,
// fake discounts, fabricated social proof).
// This file: shell + primitives + Threshold, Privacy oath, the Assessment
// (8 questions + steady reflections + the streak interstitial), and the
// reading pause. Part 2 (screens-onb3-map.jsx): the campaign-map reveal ×3.
// Part 3 (screens-onb3-tool.jsx): wave → pledge → letter → day I → paywall
// → landing + the flow orchestrator.

const { useState: o3State, useEffect: o3Effect, useRef: o3Ref } = React;

// ── roman numerals — days and weeks are counted in them, app-wide ────
function o3Roman(n) {
  const T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = '', v = Math.max(1, Math.round(n));
  for (const [k, r] of T) while (v >= k) { s += r; v -= k; }
  return s;
}

// demo answers for static boards — one plausible man, in the intake's fields
const O3_DEMO = {
  arrival: ['relapsed', 'resolved'],
  name: 'Marcus', age: '25–34',
  freq: 'About once a day', duration: 'I can’t remember a time without it',
  control: 'I resist, but usually give in', pattern: 'A way I unwind, numb out, or escape',
  triggers: ['Late at night', 'Home alone for long stretches', 'After stress or a hard day'],
  emotions: ['Loneliness', 'Anxiety or stress', 'Boredom'],
  places: ['Bedroom', 'On my phone, anywhere'],
  energy: 'Up and down', meaning: 'Some, but it feels thin', connection: 'A few people, but distant',
  relationship: 'Single', alone: 'Yes, most days', framing: 'No — my reasons are practical',
  goalPorn: 'Quit it completely', goalMast: 'Keep it, just without porn',
  tried: ['Blockers or filters', 'Going cold turkey', 'Deleting accounts or apps'],
  readiness: 'Ready to start', load: 'One small lesson',
  checkins: ['Morning', 'Late night — my danger zone'],
  impact: 'Quite a bit', coping: 'No', mood: 'Some days',
  prize: ['Focus', 'Self-respect', 'My evenings'],
  reminder: true,
};

// ── the ambient: solid black → light, as gradients ─────────────────
// No scene, no boat, no sun disc. The funnel opens on near-solid black;
// light gathers low and slow as the questions pass — a pale wide bloom
// first, a warmer core later — and breaks to paper at the reading,
// where morning is again only a wash of gradient, not an object.
function O3Ambient({ t = 0, lit = false, calm = false }) {
  const e = 1 - (1 - t) * (1 - t); // ease-out across the funnel
  const dim = calm ? 0.55 : 1;
  if (!lit) {
    const a1 = (0.06 + e * 0.5) * dim;         // pale first light — wide, low
    const a2 = Math.pow(e, 1.6) * 0.5 * dim;   // warm core — arrives later
    const a3 = e * 0.18 * dim;                 // faint lift of the whole ground
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(214,204,186,0) 38%, rgba(214,204,186,${a3.toFixed(3)}) 100%)` }} />
        <div style={{ position: 'absolute', left: '-35%', right: '-35%', bottom: '-24%', height: '80%', background: `radial-gradient(ellipse at 50% 100%, rgba(228,216,194,${a1.toFixed(3)}), rgba(228,216,194,0) 70%)` }} />
        <div style={{ position: 'absolute', left: '-18%', right: '-18%', bottom: '-28%', height: '60%', background: `radial-gradient(ellipse at 50% 106%, rgba(224,170,106,${a2.toFixed(3)}), rgba(224,170,106,0) 64%)` }} />
      </React.Fragment>
    );
  }
  const m = Math.max(0, Math.min(1, (t - 0.5) / 0.5));
  const w1 = (0.22 + m * 0.16) * dim;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(199,208,216,${(0.14 * dim).toFixed(3)}) 0%, rgba(199,208,216,0) 22%)` }} />
      <div style={{ position: 'absolute', left: '-30%', right: '-30%', bottom: '-20%', height: '64%', background: `radial-gradient(ellipse at 50% 100%, rgba(233,196,140,${w1.toFixed(3)}), rgba(233,196,140,0) 68%)` }} />
    </React.Fragment>
  );
}

// ── the shell: black ground, gathering light, a growing ink rule ────
// Progress is the 40px-rule motif stretched across the top: a hairline
// track, an ink fill that only ever grows. No numerals, no percentages.
function O3Shell({ progress = 0, onBack, children, bar = true, pad = 26, lit: litProp, calm = false }) {
  const sky = (window.CURRENT_ONB3 || {}).sky !== false;
  // lit='fade' — the screen mounts dark, then daylight arrives DURING it:
  // the o3-daybreak class puts long transitions on every color while the
  // night theme class drops away, and the two ambient states cross-fade.
  const fade = litProp === 'fade';
  const [dawned, setDawned] = o3State(false);
  o3Effect(() => {
    if (!fade) { setDawned(false); return; }
    const t = setTimeout(() => setDawned(true), 900);
    return () => clearTimeout(t);
  }, [fade]);
  const lit = !sky || litProp === true || (fade && dawned);
  const darkUI = sky && !lit;
  return (
    <div className={[darkUI ? 'o3-night' : '', fade ? 'o3-daybreak' : ''].filter(Boolean).join(' ') || undefined} style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {sky ? (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {fade ? (
            <React.Fragment>
              <div style={{ position: 'absolute', inset: 0, opacity: lit ? 0 : 1, transition: 'opacity 4.5s ease' }}><O3Ambient t={progress} lit={false} calm={calm} /></div>
              <div style={{ position: 'absolute', inset: 0, opacity: lit ? 1 : 0, transition: 'opacity 4.5s ease' }}><O3Ambient t={progress} lit={true} calm={calm} /></div>
            </React.Fragment>
          ) : <O3Ambient t={progress} lit={lit} calm={calm} />}
        </div>
      ) : null}
      <div style={{ position: 'relative', zIndex: 1, padding: `64px ${pad}px 0`, flexShrink: 0 }}>
        {bar ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 24 }}>
            <button onClick={onBack} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: onBack ? 'pointer' : 'default', padding: '4px 6px 4px 0', marginLeft: -2, display: 'flex', opacity: onBack ? 0.75 : 0.16 }}>
              <svg width="11" height="18" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke="var(--ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div style={{ flex: 1, position: 'relative', height: 14, display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'var(--line)' }} />
              <div style={{ position: 'absolute', left: 0, height: 2, width: `${Math.max(3, progress * 100)}%`, background: 'var(--ink)', transition: 'width .7s cubic-bezier(.3,.7,.2,1)' }} />
            </div>
          </div>
        ) : <div style={{ height: 24 }} />}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: `18px ${pad}px 44px`, position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// serif voice — centered, one idea per screen
function O3H({ children, size = 29, style = {} }) {
  return <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: size, lineHeight: 1.18, letterSpacing: '0.008em', color: 'var(--ink)', margin: '0 auto', textWrap: 'pretty', textAlign: 'center', maxWidth: 330, flexShrink: 0 }}>{children}</h1>;
}
function O3Sub({ children, style = {} }) {
  return <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, lineHeight: 1.55, color: 'var(--ink2)', margin: '14px auto 0', textWrap: 'pretty', textAlign: 'center', maxWidth: 306, flexShrink: 0, ...style }}>{children}</p>;
}
function O3Eyebrow({ children, style = {} }) {
  return <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)', textAlign: 'center', flexShrink: 0, ...style }}>{children}</div>;
}
// the steady reflection line — serif, quiet, appears after key answers
function O3Reflect({ children, delay = 0, style = {} }) {
  return (
    <div className="o3-reflect" style={{ animationDelay: `${delay}s`, textAlign: 'center', margin: '0 auto', maxWidth: 300, ...style }}>
      <span aria-hidden="true" style={{ display: 'block', width: 24, height: 1.5, background: 'var(--ink)', margin: '0 auto 12px', opacity: 0.85 }} />
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 16.5, lineHeight: 1.45, color: 'var(--ink)', textWrap: 'pretty' }}>{children}</span>
    </div>
  );
}
function O3Note({ children, style = {} }) {
  return <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, lineHeight: 1.5, color: 'var(--ink3)', textAlign: 'center', margin: '0 auto', maxWidth: 280, flexShrink: 0, ...style }}>{children}</div>;
}
// primary action — the one dark object on most screens
function O3CTA({ label, onClick, enabled = true, ghost = false, style = {} }) {
  if (ghost) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={onClick} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)', padding: '14px 20px 0', ...style }}>{label}</button>
    </div>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
        appearance: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default',
        background: 'var(--fill)', color: 'var(--on-fill)',
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15,
        borderRadius: 9999, padding: '16px 34px', minWidth: 232,
        letterSpacing: '0.02em', opacity: enabled ? 1 : 0.26,
        transition: 'opacity .25s ease', ...style,
      }}>{label}</button>
    </div>
  );
}

// ── option glyphs — small monotone strokes for the icon-grid questions ─
const o3i = (kids) => (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{kids}</svg>;
const O3_ICON = {
  _dot: (c) => <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill={c} /></svg>,
  // when it happens
  'Late at night': o3i(<path d="M19.5 14.5A8.3 8.3 0 0 1 9.6 4.3a8.3 8.3 0 1 0 9.9 10.2z" />),
  'First thing in the morning': o3i(<g><path d="M6.5 15.5a5.5 5.5 0 0 1 11 0" /><path d="M12 6.2V3.8M5.4 9.1 3.7 7.4M18.6 9.1l1.7-1.7M3 15.5h18" /></g>),
  'Bored during the day': o3i(<g><circle cx="12" cy="12" r="8.4" /><path d="M12 7.4V12l3.2 3.2" /></g>),
  'After stress or a hard day': o3i(<path d="M13.5 3.5 6 13h5l-1.5 7.5L17 11h-5z" />),
  'When I can’t sleep': o3i(<g><path d="M3.5 12c2.2-3.4 5.2-5.1 8.5-5.1s6.3 1.7 8.5 5.1c-2.2 3.4-5.2 5.1-8.5 5.1S5.7 15.4 3.5 12z" /><circle cx="12" cy="12" r="2.4" /></g>),
  'Weekends or days off': o3i(<g><rect x="4" y="5.5" width="16" height="15" rx="2.4" /><path d="M8 3.5v3.4M16 3.5v3.4M4 10h16" /><circle cx="15.4" cy="15" r="1.6" fill={'currentColor'} stroke="none" opacity="0" /><circle cx="15.4" cy="15" r="1.4" /></g>),
  'When I’ve been drinking': o3i(<g><path d="M7 3.8h10l-1.3 9.2a3.7 3.7 0 0 1-7.4 0z" /><path d="M12 13.5v6.7M8.8 20.2h6.4M7.6 7.6h8.8" /></g>),
  'Home alone for long stretches': o3i(<g><path d="M4.5 11 12 4.5 19.5 11" /><path d="M6.3 9.6V19a1 1 0 0 0 1 1h9.4a1 1 0 0 0 1-1V9.6" /></g>),
  'On my phone in bed': o3i(<g><rect x="8" y="3.5" width="8" height="14" rx="2" /><path d="M11 15.2h2M4 20.5h16" /></g>),
  // the feeling underneath
  'Loneliness': o3i(<g><circle cx="12" cy="8.6" r="3.6" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></g>),
  'Anxiety or stress': o3i(<path d="M3.5 12h3l2-5 3 10 2.5-7.5 1.5 2.5h5" />),
  'Boredom': o3i(<g><circle cx="12" cy="12" r="8.4" /><path d="M8.5 15h7M9 9.6h.01M15 9.6h.01" /></g>),
  'Sadness or low mood': o3i(<g><path d="M12 3.8c3.4 4.2 5.6 7.2 5.6 10a5.6 5.6 0 1 1-11.2 0c0-2.8 2.2-5.8 5.6-10z" /></g>),
  'Anger or frustration': o3i(<g><path d="M6 6l12 12M18 6 6 18" /></g>),
  'Numbness — feeling nothing': o3i(<circle cx="12" cy="12" r="8" strokeDasharray="3.4 4.4" />),
  'Mostly automatic, just habit': o3i(<g><path d="M17.5 8.5A6.5 6.5 0 1 0 18.5 12" /><path d="M18.8 4.6v4h-4" /></g>),
  'Genuine desire or arousal': o3i(<path d="M12 4c1 3-1.8 4.6-1.8 7a4.4 4.4 0 0 0 3 4.2c-.3-1.6.4-2.6 1.4-3.4.5 1.7 2.4 2.6 2.4 5A5.2 5.2 0 0 1 6.6 17c0-4.6 4.6-6.4 5.4-13z" />),
  // where it happens
  'Bedroom': o3i(<g><path d="M3.5 18.5v-8M3.5 14h17v4.5" /><path d="M3.5 14V8.5h6.5c2.4 0 3.8 1.3 3.8 3.3V14" /><circle cx="7" cy="11" r="1.2" /></g>),
  'Bathroom': o3i(<g><path d="M5.5 12.5h13a6.5 4.8 0 0 1-13 0z" /><path d="M6.5 12.5V6a2.1 2.1 0 0 1 4.2 0M8 19.5l-.8 1.4M16 19.5l.8 1.4" /></g>),
  'Home office or desk': o3i(<g><rect x="4" y="5" width="16" height="10.5" rx="1.8" /><path d="M9.5 19.5h5M12 15.5v4" /></g>),
  'Living room': o3i(<g><path d="M5 11V9a2.4 2.4 0 0 1 2.4-2.4h9.2A2.4 2.4 0 0 1 19 9v2" /><path d="M3.8 13.4a1.9 1.9 0 0 1 3.8 0v.7h8.8v-.7a1.9 1.9 0 1 1 3.8 0v3.2a1.5 1.5 0 0 1-1.5 1.5H5.3a1.5 1.5 0 0 1-1.5-1.5z" /></g>),
  'On my phone, anywhere': o3i(<g><rect x="7.5" y="3.5" width="9" height="17" rx="2.2" /><path d="M11 17.6h2" /></g>),
  'Away from home': o3i(<g><path d="M12 21s-6.4-5.3-6.4-10a6.4 6.4 0 1 1 12.8 0c0 4.7-6.4 10-6.4 10z" /><circle cx="12" cy="10.8" r="2.3" /></g>),
  // what you've tried
  'Blockers or filters': o3i(<path d="M11.4 3.3 5.2 5.8a1.4 1.4 0 0 0-.9 1.3v4.1c0 5 3.2 8.5 7.7 10.4 4.5-1.9 7.7-5.4 7.7-10.4V7.1a1.4 1.4 0 0 0-.9-1.3l-6.2-2.5a1.6 1.6 0 0 0-1.2 0z" />),
  'Going cold turkey': o3i(<g><path d="M12 3.5v17M12 3.5 9.4 6.1M12 3.5l2.6 2.6M12 20.5l-2.6-2.6M12 20.5l2.6-2.6M4.6 7.75l14.8 8.5M4.6 7.75 8.1 8.7M4.6 7.75l.95-3.5M19.4 16.25l-3.5-.95M19.4 16.25l-.95 3.5M19.4 7.75 4.6 16.25M19.4 7.75 15.9 8.7M19.4 7.75l-.95-3.5M4.6 16.25l3.5-.95M4.6 16.25l.95 3.5" strokeWidth="1.5" /></g>),
  'An accountability partner': o3i(<g><circle cx="8.6" cy="9" r="3" /><path d="M3.4 19.5a5.2 5.2 0 0 1 10.4 0" /><path d="M15.5 6.6a3 3 0 0 1 0 4.9M17.3 19.5a5.2 5.2 0 0 0-3-4.7" /></g>),
  'Deleting accounts or apps': o3i(<g><path d="M9.5 3.8h5a.9.9 0 0 1 .9.9V6h3.8v1.9H4.8V6h3.8V4.7a.9.9 0 0 1 .9-.9z" /><path d="M6.2 7.9l.9 11.3a1.4 1.4 0 0 0 1.4 1.3h7a1.4 1.4 0 0 0 1.4-1.3l.9-11.3" /></g>),
  'Therapy or counselling': o3i(<path d="M12 4c4.8 0 8.5 3 8.5 7s-3.7 7-8.5 7c-.8 0-1.6-.1-2.3-.3L5 20l1.3-3.6C4.6 15.1 3.5 13.2 3.5 11c0-4 3.7-7 8.5-7z" />),
  'Replacing it with other habits': o3i(<g><path d="M4 8.5h13M13.5 4.5l4 4-4 4" /><path d="M20 15.5H7M10.5 19.5l-4-4 4-4" /></g>),
  'Nothing structured yet': o3i(<rect x="4.5" y="4.5" width="15" height="15" rx="3" strokeDasharray="3.4 4" />),
};

// ── the chip — tappable, zero typing ─────────────────────────────────
// Multi-select: paper capsule, selected = hairline ink ring + a small
// ink dot (dark surfaces stay rationed). Single-select: on pick the ink
// bleeds across the chip (the everyday reward) as the screen advances.
function O3Chip({ label, on, picked = false, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', border: 'none', width: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      padding: '17px 26px', borderRadius: 9999, minHeight: 55,
      background: 'var(--card)',
      boxShadow: on && !picked ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
      color: 'var(--ink)', textAlign: 'center',
    }}>
      {/* the ink bleed — floods on single-select pick */}
      {picked ? <span className="o3-bleed" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--fill)', borderRadius: 'inherit' }} /> : null}
      {on && !picked ? (
        <span style={{ position: 'relative', width: 7, height: 7, borderRadius: 9999, background: 'var(--ink)', flexShrink: 0 }} />
      ) : null}
      <span style={{ position: 'relative', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, letterSpacing: '-0.005em', lineHeight: 1.25, color: picked ? 'var(--on-fill)' : 'var(--ink)', transition: 'color .12s ease .06s' }}>{label}</span>
    </button>
  );
}

// ── the question screen ──────────────────────────────────────────────
// One idea per screen. Single-select: pick → ink bleeds → the reflection
// (if any) surfaces alone for a steady beat → advance. Multi-select:
// reflection appears above the Continue once something is chosen.
function O3Question({ title, sub, eyebrow, options, value, multi = false, onSet, next, reflect, note, ctaLabel, skip, kind = 'pills' }) {
  const [picked, setPicked] = o3State(null);
  const [showR, setShowR] = o3State(false);
  const pick = (label) => {
    if (multi) {
      const cur = value || [];
      onSet(cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]);
      return;
    }
    if (picked) return;
    onSet(label);
    setPicked(label);
    const r = reflect ? reflect(label) : null;
    if (r) { setTimeout(() => setShowR(true), 260); setTimeout(next, 2050); }
    else setTimeout(next, 560);
  };
  const count = multi ? (value || []).length : 0;
  const rLine = multi
    ? (count > 0 && reflect ? reflect(value) : null)
    : (showR && reflect ? reflect(picked) : null);
  const isOn = (label) => (multi ? (value || []).includes(label) : value === label);

  // ── the four presentations ──
  let body = null;
  if (kind === 'grid') {
    body = (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 26, paddingBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          {options.map((label) => {
            const on = isOn(label), pk = !multi && picked === label;
            return (
              <button key={label} onClick={() => pick(label)} className="tl-press" style={{
                appearance: 'none', border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
                background: 'var(--card)', borderRadius: 18, padding: '15px 10px 12px',
                boxShadow: on && !pk ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
              }}>
                {pk ? <span className="o3-bleed" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--fill)' }} /> : null}
                <span style={{ position: 'relative', width: 42, height: 42, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: pk ? 'rgba(245,244,241,0.16)' : on ? 'var(--fill)' : 'var(--soft)', transition: 'background .15s' }}>
                  {(O3_ICON[label] || O3_ICON._dot)(pk || on ? 'var(--on-fill)' : 'var(--ink)')}
                </span>
                <span style={{ position: 'relative', fontFamily: 'var(--font)', fontWeight: on || pk ? 600 : 500, fontSize: 12.5, lineHeight: 1.25, textAlign: 'center', color: pk ? 'var(--on-fill)' : 'var(--ink)', minHeight: 30, display: 'flex', alignItems: 'center', transition: 'color .12s ease .06s' }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  } else if (kind === 'scale') {
    body = (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28, paddingBottom: 4, justifyContent: options.length <= 5 ? 'center' : 'flex-start' }}>
        {options.map((label, i) => {
          const on = isOn(label), pk = !multi && picked === label;
          return (
            <button key={label} onClick={() => pick(label)} className="tl-press" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              background: 'var(--card)', borderRadius: 16, padding: '15px 18px', minHeight: 54,
              boxShadow: on && !pk ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
            }}>
              {pk ? <span className="o3-bleed" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--fill)' }} /> : null}
              <span style={{ position: 'relative', display: 'flex', gap: 3, flexShrink: 0 }} aria-hidden="true">
                {options.map((_, k) => (
                  <span key={k} style={{ width: 4.5, height: 15, borderRadius: 2.5, background: pk ? (k <= i ? 'var(--on-fill)' : 'rgba(245,244,241,0.25)') : k <= i ? 'var(--ink)' : 'var(--soft2)', transition: 'background .12s ease .06s' }} />
                ))}
              </span>
              <span style={{ position: 'relative', flex: 1, fontFamily: 'var(--font)', fontWeight: on || pk ? 600 : 500, fontSize: 14.5, lineHeight: 1.3, color: pk ? 'var(--on-fill)' : 'var(--ink)', transition: 'color .12s ease .06s' }}>{label}</span>
            </button>
          );
        })}
      </div>
    );
  } else if (kind === 'wrap') {
    body = (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30, paddingBottom: 4, justifyContent: 'center', alignContent: 'center' }}>
        {options.map((label) => {
          const on = isOn(label), pk = !multi && picked === label;
          return (
            <button key={label} onClick={() => pick(label)} className="tl-press" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--card)', borderRadius: 9999, padding: '14px 21px',
              boxShadow: on && !pk ? 'inset 0 0 0 1.6px var(--ink)' : 'none',
            }}>
              {pk ? <span className="o3-bleed" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--fill)', borderRadius: 'inherit' }} /> : null}
              {on && !pk ? <span style={{ position: 'relative', width: 6.5, height: 6.5, borderRadius: 9999, background: 'var(--ink)', flexShrink: 0 }} /> : null}
              <span style={{ position: 'relative', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: pk ? 'var(--on-fill)' : 'var(--ink)', transition: 'color .12s ease .06s' }}>{label}</span>
            </button>
          );
        })}
      </div>
    );
  } else {
    body = (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30, paddingBottom: 4, justifyContent: options.length <= 5 ? 'center' : 'flex-start' }}>
        {options.map((label) => (
          <O3Chip key={label} label={label}
            on={isOn(label)}
            picked={!multi && picked === label}
            onClick={() => pick(label)} />
        ))}
      </div>
    );
  }
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 26px' }} />
      {eyebrow ? <O3Eyebrow style={{ marginBottom: 12 }}>{eyebrow}</O3Eyebrow> : null}
      <O3H>{title}</O3H>
      {sub ? <O3Sub>{sub}</O3Sub> : null}
      {body}
      <div style={{ paddingTop: 14, flexShrink: 0, minHeight: multi ? 0 : 86, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {note ? <O3Note style={{ marginBottom: multi ? 13 : 6 }}>{note}</O3Note> : null}
        {multi ? <O3CTA label={ctaLabel || 'Continue'} enabled={count > 0} onClick={next} /> : null}
        {skip && !picked ? <O3CTA ghost label="Skip" onClick={next} style={{ fontSize: 13, color: 'var(--ink3)' }} /> : null}
      </div>
    </React.Fragment>
  );
}

// ════════ 1 · THRESHOLD ══════════════════════════════════════════════
function O3_Threshold({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 15, letterSpacing: '0.34em', textIndent: '0.34em', color: 'var(--ink)' }}>VICI</div>
        <span aria-hidden="true" style={{ width: 40, height: 1.5, background: 'var(--ink)', margin: '16px 0 0' }} />
        <div style={{ flex: '0 0 64px' }} />
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 31, lineHeight: 1.32, letterSpacing: '0.008em', color: 'var(--ink)', margin: 0, textAlign: 'center', maxWidth: 300, textWrap: 'balance' }}>
          One day you close this app for good, and it says <em style={{ fontStyle: 'italic' }}>vici.</em>
        </h1>
      </div>
      <O3CTA label="Begin" onClick={next} />
      <O3CTA ghost label="I already have an account" onClick={() => {}} style={{ fontSize: 12.5, color: 'var(--ink3)' }} />
    </React.Fragment>
  );
}

// ════════ 2 · PRIVACY OATH ═══════════════════════════════════════════
const O3_OATH = [
  ['Everything stays on this device.', 'Your answers are stored here, not on a server. We could not read them if we wanted to.',
    (c) => <g><rect x="6.5" y="3.5" width="11" height="17" rx="2.4" stroke={c} strokeWidth="1.7" /><path d="M10 17.8h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></g>],
  ['Face ID locks the door.', 'Nothing on your screen says what this app is for unless you open it.',
    (c) => <g><path d="M5 8.5V6.4A1.4 1.4 0 0 1 6.4 5H8.5M15.5 5h2.1A1.4 1.4 0 0 1 19 6.4V8.5M19 15.5v2.1a1.4 1.4 0 0 1-1.4 1.4H15.5M8.5 19H6.4A1.4 1.4 0 0 1 5 17.6V15.5" stroke={c} strokeWidth="1.7" strokeLinecap="round" /><path d="M9.5 10.2v1M14.5 10.2v1M9.8 14.2a3.4 3.4 0 0 0 4.4 0" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></g>],
  ['No feed. No followers.', 'Recovery here is not performed for anyone. There is no audience to disappoint.',
    (c) => <g><circle cx="12" cy="12" r="8.4" stroke={c} strokeWidth="1.7" /><path d="M6.3 6.3l11.4 11.4" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></g>],
];
function O3_Privacy({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 60 }}>
        <O3H style={{ marginTop: 12 }}>What happens here stays in your hands.</O3H>
        <div style={{ marginTop: 30, background: 'var(--card)', borderRadius: 20, padding: '4px 20px' }}>
          {O3_OATH.map(([t, s, icon], i) => (
            <div key={t} className="o3-riseline" style={{ animationDelay: `${0.12 + i * 0.14}s`, display: 'flex', gap: 15, alignItems: 'flex-start', padding: '17px 0', borderBottom: i < O3_OATH.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>{icon('var(--ink)')}</svg>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{t}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 3, textWrap: 'pretty' }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <O3CTA label="Understood" onClick={next} />
    </React.Fragment>
  );
}

// ════════ 3 · THE ASSESSMENT — 8 questions, steady reflections ═══════
const O3_ARRIVAL = [
  ['I just slipped', 'relapsed'],
  ['I keep stopping, then sliding back', 'cycling'],
  ["I'm ready to be done with it", 'resolved'],
  ["I'm not sure it's a problem yet", 'curious'],
];
const O3_ARRIVAL_REFLECT = {};
function o3Register(a) {
  const s = a.arrival || [];
  for (const r of ['relapsed', 'cycling', 'resolved', 'curious']) if (s.includes(r)) return r;
  return 'resolved';
}
// Q1 — the door (kept from v2: the mirror that starts the funnel)
function O3_Door({ a, set, next }) {
  const sel = a.arrival || [];
  const toggle = (k) => set('arrival', sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 26px' }} />
      <O3H>What brings you to the door?</O3H>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30, justifyContent: 'center' }}>
        {O3_ARRIVAL.map(([label, k]) => <O3Chip key={k} label={label} on={sel.includes(k)} onClick={() => toggle(k)} />)}
      </div>
      <div style={{ paddingTop: 14, flexShrink: 0 }}>
        <O3CTA label="Continue" enabled={sel.length > 0} onClick={next} />
      </div>
    </React.Fragment>
  );
}

// the assessment table — [id, props]. This is the Personalized Intake:
// a three-minute, quick-tap setup whose every answer shapes the plan —
// which lessons lead, which Rough Days tools get pinned, how fast it
// moves, how it talks, and when it checks in. Grouped into the intake's
// six sections plus a gentle wellbeing check at the end.
const O3_QUESTIONS = [
  // Section 1 · Where you're starting
  ['freq', {
    kind: 'scale',
    title: 'How often are you using porn right now?',
    options: ['Several times a day', 'About once a day', 'A few times a week', 'About once a week', 'A few times a month', 'Less than once a month'],
  }],
  ['duration', {
    kind: 'scale',
    title: 'How long have you wanted to change this?',
    options: ['Less than a year', '1–3 years', '4–10 years', 'More than 10 years', 'I can’t remember a time without it'],
  }],
  ['control', {
    title: 'How much control do you feel over it right now?',
    options: ['I feel powerless over it', 'I resist, but usually give in', 'I win about half the time', 'Mostly in control — but I want to be free of it'],
  }],
  ['pattern', {
    title: 'Which of these sounds most like your pattern?',
    options: ['A quick habit I barely think about', 'A way I unwind, numb out, or escape', 'Something I binge on for hours', 'Escalating — I look for more, or more extreme', 'It comes in waves — intense, then quiet'],
  }],
  // Section 2 · When & why it happens
  ['triggers', {
    kind: 'grid',
    title: 'When are you most likely to slip?', multi: true,
    options: ['Late at night', 'First thing in the morning', 'Bored during the day', 'After stress or a hard day', 'When I can’t sleep', 'Weekends or days off', 'When I’ve been drinking', 'Home alone for long stretches', 'On my phone in bed'],
  }],
  ['emotions', {
    kind: 'grid',
    title: 'What feeling is most often underneath it?', multi: true,
    options: ['Loneliness', 'Anxiety or stress', 'Boredom', 'Sadness or low mood', 'Anger or frustration', 'Numbness — feeling nothing', 'Mostly automatic, just habit', 'Genuine desire or arousal'],
  }],
  ['places', {
    kind: 'grid',
    title: 'Where does it usually happen?', multi: true,
    options: ['Bedroom', 'Bathroom', 'Home office or desk', 'Living room', 'On my phone, anywhere', 'Away from home'],
  }],
  // Section 3 · How you've been feeling lately
  ['energy', {
    kind: 'scale',
    title: 'How are your energy and drive most days?',
    options: ['Running on empty most of the time', 'Low more often than not', 'Up and down', 'Generally good'],
  }],
  ['meaning', {
    title: 'How much sense of purpose do you feel right now?',
    options: ['I feel pretty lost', 'Some, but it feels thin', 'It comes and goes', 'I’m clear on what matters to me'],
  }],
  ['connection', {
    kind: 'scale',
    title: 'How connected do you feel to the people around you?',
    options: ['Pretty isolated', 'A few people, but distant', 'Reasonably connected', 'Strongly connected'],
  }],
  // Section 4 · A little about your life
  ['age', {
    kind: 'wrap',
    title: 'Your age range.',
    options: ['Under 18', '18–24', '25–34', '35–44', '45 or older'],
  }],
  ['relationship', {
    title: 'Relationship status.',
    options: ['Single', 'Dating or in a relationship', 'Married or living together', 'It’s complicated'],
  }],
  ['alone', {
    title: 'Do you have a lot of unstructured time alone?',
    options: ['Yes, most days', 'Sometimes', 'Rarely'],
  }],
  ['framing', {
    title: 'Does faith or a moral code play a part in why you want to stop?',
    options: ['Yes — it’s central for me', 'Somewhat', 'No — my reasons are practical', 'Prefer not to say'],
  }],
  // Section 5 · What you want
  ['goalPorn', {
    title: 'What’s your goal with porn?',
    options: ['Quit it completely', 'Cut it down a lot', 'Keep it to a level I set', 'Not sure yet — exploring'],
    note: 'Porn and masturbation are two separate choices.',
  }],
  ['goalMast', {
    title: 'And masturbation?',
    options: ['Stop too — a full reset', 'Keep it, just without porn', 'Cut it down', 'Not trying to change that'],
  }],
  ['tried', {
    kind: 'grid',
    title: 'What have you already tried?', multi: true,
    options: ['Blockers or filters', 'Going cold turkey', 'An accountability partner', 'Deleting accounts or apps', 'Therapy or counselling', 'Replacing it with other habits', 'Nothing structured yet'],
  }],
  ['readiness', {
    kind: 'scale',
    title: 'How ready do you feel to change right now?',
    options: ['Just exploring', 'Thinking about it', 'Ready to start', 'Already started — I want structure'],
  }],
  // Section 6 · How the plan runs
  ['load', {
    title: 'How much do you want to do each day?',
    options: ['One small lesson', 'A lesson plus a task', 'As much as I can', 'Just the bad-day tools for now'],
  }],
  ['checkins', {
    kind: 'wrap',
    title: 'When should we check in with you?', multi: true, ctaLabel: 'Set reminders',
    options: ['Morning', 'Midday', 'Evening', 'Late night — my danger zone', 'No reminders'],
  }],
  // A quick wellbeing check
  ['impact', {
    kind: 'scale',
    title: 'Is this affecting your sleep, work, relationships, or money?',
    options: ['Not really', 'A little', 'Quite a bit', 'A lot'],
    note: 'Not a test, not a diagnosis. Nobody sees this but you.',
  }],
  ['coping', {
    title: 'Are you mainly using porn to cope with something heavy right now?',
    options: ['No', 'Maybe', 'Yes'],
  }],
  ['mood', {
    kind: 'scale',
    title: 'In the last two weeks, how often have you felt down or hopeless?',
    options: ['Not at all', 'Some days', 'Most days', 'Nearly every day'],
  }],
];

// Q2 — the name. The one early keyboard, kept from v2: being addressed
// by name is what the reflections and the pledge trade on later.
function O3_Name({ a, set, next }) {
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 26px' }} />
      <O3H>What should we call you?</O3H>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input value={a.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Your name"
          style={{ width: '100%', appearance: 'none', border: 'none', outline: 'none', background: 'var(--card)', borderRadius: 9999, padding: '19px 24px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 18, color: 'var(--ink)', textAlign: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="var(--ink3)" strokeWidth="2" /><path d="M8.2 10.5V7.8a3.8 3.8 0 017.6 0v2.7" stroke="var(--ink3)" strokeWidth="2" /></svg>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)' }}>Stays on this device.</span>
        </div>
      </div>
      <O3CTA label="Continue" enabled={!!(a.name || '').trim()} onClick={next} />
      <O3CTA ghost label="Stay unnamed" onClick={next} style={{ fontSize: 13, color: 'var(--ink3)' }} />
    </React.Fragment>
  );
}

// ── the streak sawtooth — every climb shorter, every reset to zero ────
function O3StreakChart() {
  const yB = 146, pxd = 8.6, pxv = 7, runs = [14, 9, 5, 2];
  let x = 12; const segs = [];
  for (const d of runs) { const x2 = x + d * pxd; segs.push([x, x2, yB - d * pxv]); x = x2; }
  const dPath = `M12 ${yB} ` + segs.map(([x1, x2, y]) => `L${x2} ${y} L${x2} ${yB}`).join(' ') + ` L${x + 22} ${yB}`;
  const lbl = [['14 days', 1.05], ['9', 1.7], ['5', 2.05], ['2', 2.3]];
  return (
    <svg width="100%" viewBox="0 0 320 176" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="10" y1={yB} x2="310" y2={yB} stroke="var(--line)" strokeWidth="1.2" />
      <path className="o3-drawslow" pathLength="1" d={dPath} stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      {segs.map(([x1, x2, y], i) => (
        <g key={i} className="o3-riseline" style={{ animationDelay: `${lbl[i][1]}s` }}>
          <circle cx={x2} cy={y} r="3.2" fill="var(--ink)" />
          <text x={x2 - 5} y={y - 9} textAnchor="end" fill="var(--ink)" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11 }}>{lbl[i][0]}</text>
          <path d={`M${x2 - 3.2} ${yB + 9} l6.4 6.4 M${x2 + 3.2} ${yB + 9} l-6.4 6.4`} stroke="var(--ink3)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      <text x={segs[0][1] + 9} y={yB + 19} fill="var(--ink3)" className="o3-riseline" style={{ animationDelay: '1.2s', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 8.5, letterSpacing: '0.12em' }}>RESET</text>
    </svg>
  );
}
// Follows the day-grids: the obvious answer — count days — shown failing.
function O3_Streaks({ a = {}, next = () => {} }) {
  const tried = (a.tried || []).filter((x) => x !== 'Nothing structured yet');
  const cyc = (a.arrival || []).includes('cycling');
  const hasTried = tried.length > 0 || cyc;
  const fences = tried.slice(0, 2).map((t) => t.toLowerCase()).join(' and ');
  const caption = fences
    ? `You’ve run this with ${fences} — each climb comes back shorter, and the zero erases all of it.`
    : 'Each climb starts strong and ends at zero — and every climb comes back shorter.';
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 24 }}>
        <O3Eyebrow style={{ marginBottom: 12 }}>The obvious tool</O3Eyebrow>
        <O3H size={26}>A streak resets. A campaign doesn’t.</O3H>
        <div style={{ margin: '26px 0 0', background: 'var(--card)', borderRadius: 20, padding: '20px 12px 4px' }}><O3StreakChart /></div>
        <O3Note style={{ marginTop: 16, minHeight: 36 }}>{caption}</O3Note>
      </div>
      <O3CTA label={hasTried ? 'That is what happened to me' : 'So what works?'} onClick={next} />
    </React.Fragment>
  );
}

// ════════ 4 · THE READING — the constructed pause ════════════════════
function o3Inputs(a) {
  const t = (a.triggers || []);
  const l1 = t.length
    ? `${t.slice(0, 2).map((x) => x.toLowerCase()).join(', ')} — mostly.`
    : 'The pattern, plainly.';
  const dur = { 'Less than a year': 'Under a year', '1–3 years': 'A few years', '4–10 years': 'Most of a decade', 'More than 10 years': 'Over a decade', 'I can’t remember a time without it': 'Most of a life' }[a.duration] || 'Years';
  const tried = (a.tried || []).filter((x) => x !== 'Nothing structured yet').length;
  const att = tried >= 3 ? 'three ways already tried' : tried > 0 ? 'real attempts behind you' : 'a first structured attempt';
  return [l1, `${dur}. And ${att}.`];
}
// what the engine pinned — the plan chips that tick in while it builds
function o3PlanChips(a) {
  const chips = [];
  chips.push({ 'Quit it completely': 'Full-stop track', 'Cut it down a lot': 'Reduction track', 'Keep it to a level I set': 'Reduction track', 'Not sure yet — exploring': 'Exploration track' }[a.goalPorn] || 'Full-stop track');
  const t0 = (a.triggers || [])[0];
  chips.push(t0 ? `${t0} — window guarded` : 'Check-in windows set');
  const e0 = (a.emotions || [])[0];
  if (e0) chips.push(`${e0} protocol, pinned`);
  chips.push({ 'One small lesson': 'One small lesson a day', 'A lesson plus a task': 'A lesson + a task, daily', 'As much as I can': 'Full pace', 'Just the bad-day tools for now': 'Tools first, course later' }[a.load] || 'One small lesson a day');
  return chips.slice(0, 4);
}
function O3_ReadingPause({ a, live = true, phase = null, next }) {
  const [ph, setPh] = o3State(phase == null ? 0 : phase);
  const [w, setW] = o3State(live ? 4 : (phase === 1 ? 78 : 38));
  const [l1, l2] = o3Inputs(a);
  o3Effect(() => {
    if (!live) return;
    const t0 = setTimeout(() => setW(52), 60);
    const t1 = setTimeout(() => { setPh(1); setW(100); }, 2900);
    const t2 = setTimeout(next, 6600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [live]);
  // one geometry for both phases — a real loading bar, one title line,
  // then exactly four fixed-height line slots. Nothing ever moves; only
  // the words and the fill change (and daylight, via the shell's fade).
  const slots = ph === 0
    ? [[l1, 0.7], [l2, 1.6], [null, 0], [null, 0]].map(([text, d], i) => text ? (
      <span key={`r${i}`} className="o3-riseline" style={{ animationDelay: `${d}s`, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink2)' }}>{text}</span>
    ) : null)
    : o3PlanChips(a).map((g, i) => (
      <span key={g} className="o3-riseline" style={{ animationDelay: `${0.35 + i * 0.5}s`, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink)', background: 'var(--card)', padding: '8px 14px', borderRadius: 9999 }}>{g}</span>
    ));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingBottom: 40 }}>
      {/* the loading bar — fills across both phases from the same spot */}
      <div style={{ width: 212, height: 3, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden' }}>
        <div style={{ width: `${w}%`, height: '100%', borderRadius: 9999, background: 'var(--ink)', transition: live ? `width ${ph === 0 ? 2.8 : 3.5}s cubic-bezier(.25,.6,.3,1), background-color 4.5s ease` : 'none' }} />
      </div>
      <div style={{ minHeight: 36, display: 'flex', alignItems: 'center', marginTop: 26 }}>
        <O3H size={24}>{ph === 0 ? 'Reading your answers…' : <React.Fragment>Creating {a.name ? `${a.name}’s` : 'your'} plan…</React.Fragment>}</O3H>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{slots[i] || null}</div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  o3Roman, O3_DEMO, o3Register, o3Inputs,
  O3Shell, O3Ambient, O3H, O3Sub, O3Eyebrow, O3Reflect, O3Note, O3CTA, O3Chip, O3Question,
  O3_Threshold, O3_Privacy, O3_Door, O3_Name, O3_QUESTIONS, O3_Streaks, O3StreakChart, O3_ReadingPause,
});
