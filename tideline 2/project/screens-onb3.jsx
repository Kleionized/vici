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

// demo answers for static boards
const O3_DEMO = {
  arrival: ['relapsed', 'resolved'],
  name: 'Marcus', age: '25–34', gender: 'Male',
  duration: 'Most of my life', freq: 'Daily',
  triggers: ['Late at night', 'Alone', 'Under stress'],
  costs: ['Focus', 'Self-respect', 'Time', 'Sleep'],
  attempts: "I've lost count", breaks: 'The counter hitting zero',
  knows: 'No one', prize: ['Focus', 'Self-respect', 'My evenings'],
  reminder: true, letter: '',
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
  const lit = !sky || litProp === true;
  const darkUI = sky && litProp !== true;
  return (
    <div className={darkUI ? 'o3-night' : undefined} style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {sky ? (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <O3Ambient t={progress} lit={lit} calm={calm} />
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
function O3Question({ title, sub, options, value, multi = false, onSet, next, reflect, note, ctaLabel, skip }) {
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
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 26px' }} />
      <O3H>{title}</O3H>
      {sub ? <O3Sub>{sub}</O3Sub> : null}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30, paddingBottom: 4, justifyContent: options.length <= 5 ? 'center' : 'flex-start' }}>
        {options.map((label) => (
          <O3Chip key={label} label={label}
            on={multi ? (value || []).includes(label) : value === label}
            picked={!multi && picked === label}
            onClick={() => pick(label)} />
        ))}
      </div>
      <div style={{ paddingTop: 14, flexShrink: 0, minHeight: multi ? 0 : 86, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {rLine ? <O3Reflect style={{ marginBottom: multi ? 18 : 6 }}>{rLine}</O3Reflect> : null}
        {note && !rLine ? <O3Note style={{ marginBottom: multi ? 13 : 6 }}>{note}</O3Note> : null}
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
        <O3Sub style={{ marginTop: 22 }}>“I conquered.” A campaign of twelve weeks — won once, not defended forever.</O3Sub>
      </div>
      <O3CTA label="Begin" onClick={next} />
      <O3CTA ghost label="I already have a campaign" onClick={() => {}} style={{ fontSize: 12.5, color: 'var(--ink3)' }} />
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
        <O3Eyebrow>Before anything is asked</O3Eyebrow>
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
        <O3Note style={{ marginTop: 18 }}>The one tool you'll use mid-crisis is free, forever, and never behind a lock.</O3Note>
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
const O3_ARRIVAL_REFLECT = {
  relapsed: 'Then you came at the hardest hour. That counts for something.',
  cycling: 'Wanting it badly was never the missing piece. A method is.',
  resolved: 'Good. Resolve cools — we will set it in ink before it does.',
  curious: 'A fair question. The next few minutes answer it plainly.',
};
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
      <O3Sub>Everything true tonight. No one reads this but you.</O3Sub>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30, justifyContent: 'center' }}>
        {O3_ARRIVAL.map(([label, k]) => <O3Chip key={k} label={label} on={sel.includes(k)} onClick={() => toggle(k)} />)}
      </div>
      <div style={{ paddingTop: 14, flexShrink: 0 }}>
        {sel.length ? <O3Reflect style={{ marginBottom: 18 }}>{O3_ARRIVAL_REFLECT[o3Register(a)]}</O3Reflect> : null}
        <O3CTA label="Continue" enabled={sel.length > 0} onClick={next} />
      </div>
    </React.Fragment>
  );
}

// the assessment table — [id, props]
const O3_QUESTIONS = [
  ['age', {
    title: 'How old are you?',
    options: ['Under 18', '18–24', '25–34', '35–44', '45+'],
    note: 'It sets the pace. Nothing else.', skip: true,
  }],
  ['gender', {
    title: 'How do you identify?',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    note: 'The campaign reads the same either way — the examples don’t.', skip: true,
  }],
  ['duration', {
    title: 'How long has this been part of your life?',
    options: ['Under a year', 'A few years', 'Most of a decade', 'Most of my life'],
    reflect: (v) => v === 'Most of my life' ? 'Long habits feel like character. They are not.' : v === 'Most of a decade' ? 'A decade is a long siege. It still lifts.' : null,
  }],
  ['freq', {
    title: 'How often, lately?',
    options: ['A few times a month', 'Weekly', 'Several times a week', 'Daily', 'More than daily'],
    note: 'The honest answer is the useful one.',
  }],
  ['triggers', {
    title: 'When does the pull run strongest?', multi: true,
    options: ['Late at night', 'Alone', 'Under stress', 'Bored', 'After drinking', 'While scrolling'],
    reflect: (v) => (v || []).includes('Late at night') ? 'Late nights. The most common ground there is.' : (v || []).includes('Under stress') ? 'Stress. The oldest recruiter the habit has.' : 'Noted. The campaign starts on this ground.',
  }],
  ['costs', {
    title: 'What has it cost you?', multi: true, ctaLabel: 'Name it',
    options: ['Focus', 'Relationships', 'Self-respect', 'Time', 'Sleep', 'Desire for real intimacy'],
    reflect: (v) => (v || []).length >= 3 ? 'That list is the case. You just made it yourself.' : null,
    note: 'Stays on this device.',
  }],
  ['attempts', {
    title: 'Have you tried to stop before?',
    options: ['Never, seriously', 'Once or twice', 'Several times', "I've lost count"],
    reflect: (v) => v === "I've lost count" ? 'Attempts are not failures. They are reconnaissance.' : v === 'Several times' ? 'Several attempts means several maps of the ground.' : null,
  }],
  ['breaks', {
    title: 'What usually breaks an attempt?',
    options: ['A bad night, alone', 'The counter hitting zero', 'Boredom creeping back', 'Stress piling up', 'I never had a method'],
  }],
  ['knows', {
    title: 'Who knows about this?',
    options: ['No one', 'One person', 'A few people'],
    reflect: (v) => v === 'No one' ? 'Most begin at no one. A campaign needs no audience.' : 'Someone in your corner is worth a legion.',
  }],
  ['prize', {
    title: 'And when it is won — what returns?', multi: true, ctaLabel: 'Claim these',
    options: ['Focus', 'Self-respect', 'Real intimacy', 'My evenings', 'A quiet mind'],
    reflect: () => 'Kept. The whole campaign points at these.',
  }],
];

// Q2 — the name. The one early keyboard, kept from v2: being addressed
// by name is what the reflections and the pledge trade on later.
function O3_Name({ a, set, next }) {
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 26px' }} />
      <O3H>What should we call you?</O3H>
      <O3Sub>A first name, or an alias. Whatever feels safe.</O3Sub>
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

// ── the streak interstitial (kept from v2, set in ink) ───────────────
function O3StreakChart() {
  const W = 320, H = 156, yB = 128;
  const streak = `M10 ${yB} L74 52 L74 ${yB} L168 36 L168 ${yB} L226 80 L226 ${yB} L256 104`;
  const camp = `M10 ${yB - 8} C 60 ${yB - 34}, 72 ${yB - 40}, 98 ${yB - 48} L106 ${yB - 41} C 152 ${yB - 58}, 166 ${yB - 66}, 188 ${yB - 72} L194 ${yB - 67} C 252 ${yB - 88}, 286 ${yB - 98}, 310 ${yB - 106}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="10" y1={yB} x2="310" y2={yB} stroke="var(--line)" strokeWidth="1" />
      {[74, 168, 226].map((x) => (
        <text key={x} x={x} y={yB + 14} textAnchor="middle" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5, letterSpacing: '0.04em' }}>to zero</text>
      ))}
      <path d={streak} stroke="var(--ink4)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="3 4" fill="none" />
      <path className="onb-draw" d={camp} stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" fill="none" pathLength="1" />
      <circle cx="310" cy={yB - 106} r="4.5" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.2" />
      <text x="12" y="14" fill="var(--ink4)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.08em' }}>A STREAK</text>
      <text x="12" y="28" fill="var(--ink)" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.08em' }}>A CAMPAIGN</text>
    </svg>
  );
}
function O3_Streaks({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
        <O3H>A streak resets. A campaign doesn't.</O3H>
        <div style={{ margin: '26px 0 0', background: 'var(--card)', borderRadius: 20, padding: '18px 15px 10px' }}><O3StreakChart /></div>
        <O3Sub style={{ marginTop: 22 }}>A counter only measures days, and when it breaks it says you lost everything. That lie turns one bad night into a lost week.</O3Sub>
        <O3Sub style={{ marginTop: 12 }}>Here, ground taken stays taken. A slip is a data point — it is never a reset to zero.</O3Sub>
      </div>
      <O3CTA label="That is what happened to me" onClick={next} />
    </React.Fragment>
  );
}

// ════════ 4 · THE READING — the constructed pause ════════════════════
function o3Inputs(a) {
  const t = (a.triggers || []);
  const l1 = t.length
    ? `${t.slice(0, 2).map((x) => x.toLowerCase()).join(', ')} — mostly.`
    : 'The pattern, plainly.';
  const dur = { 'Under a year': 'Under a year', 'A few years': 'A few years', 'Most of a decade': 'Most of a decade', 'Most of my life': 'Most of a life' }[a.duration] || 'Years';
  const att = { "I've lost count": 'more attempts than you counted', 'Several times': 'several attempts', 'Once or twice': 'two attempts', 'Never, seriously': 'a first attempt' }[a.attempts] || 'past attempts';
  return [l1, `${dur}. And ${att}.`];
}
function O3_ReadingPause({ a, live = true, next }) {
  const [l1, l2] = o3Inputs(a);
  o3Effect(() => {
    if (!live) return;
    const id = setTimeout(next, 3000);
    return () => clearTimeout(id);
  }, [live]);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingBottom: 40 }}>
      <svg width="52" height="26" viewBox="0 0 52 26" fill="none" className="ci-breathe" style={{ marginBottom: 26, opacity: 0.75 }}>
        <path d="M3 17 C 10 7 17 7 26 13 S 43 20 49 10" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <O3H size={24}>Reading your answers…</O3H>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="o3-riseline" style={{ animationDelay: '0.7s', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink2)' }}>{l1}</span>
        <span className="o3-riseline" style={{ animationDelay: '1.6s', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink2)' }}>{l2}</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  o3Roman, O3_DEMO, o3Register, o3Inputs,
  O3Shell, O3Ambient, O3H, O3Sub, O3Eyebrow, O3Reflect, O3Note, O3CTA, O3Chip, O3Question,
  O3_Threshold, O3_Privacy, O3_Door, O3_Name, O3_QUESTIONS, O3_Streaks, O3StreakChart, O3_ReadingPause,
});
