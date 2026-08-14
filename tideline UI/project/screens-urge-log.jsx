// screens-urge-log.jsx — "Log an urge" flow for VICI.
//
// The urge SURF series (screens-urge.jsx) is the in-the-moment exercise.
// This is the record-keeping companion: a calm, fast capture of an urge —
// how strong it was, what set it off, what you did about it, and when —
// landing on a quiet confirmation. Built in the urge section's own
// celestial-wave vocabulary (CCEL page, warm slate action, serif heroes,
// segmented progress) so it reads as one family.
//
// Exports: UrgeLogScreen (live flow) + UrgeLogIntensity, UrgeLogTrigger,
// UrgeLogOutcome, UrgeLogWhen, UrgeLogDone (standalone screens).

const { useState: ulState, useRef: ulRef, useCallback: ulCb } = React;

const UL_BG = 'var(--bg)';
const UL_FONT = 'var(--font)';

// intensity bands (low → high) — neutral ink scale, faint (pale) to
// overwhelming (richest ink). No hue swing — matches the home system.
const BANDS = ['Faint', 'Mild', 'Strong', 'Intense', 'Overwhelming'];
const bandIndex = (t) => Math.min(BANDS.length - 1, Math.round(t * (BANDS.length - 1)));
function ulTone(t) {
  const L = 0.46 - t * 0.22;
  const C = 0.01;
  return (a = 1) => `oklch(${L} ${C} 90 / ${a})`;
}

// ── top bar: back · segmented progress · close ──────────────────────
function ULTop({ total, index, onBack, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '60px 29px 0', gap: 12, flexShrink: 0 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: 36, height: 4, borderRadius: 9999, background: i <= index ? 'var(--fill)' : 'var(--soft2)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>
      <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

function ULButton({ children, enabled = true, onClick, style = {} }) {
  return (
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default', width: '100%',
      background: 'var(--fill)', color: 'var(--on-fill)',
      fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em',
      opacity: enabled ? 1 : 0.34,
      boxShadow: 'none', ...style,
    }}>{children}</button>
  );
}

function ULHeading({ children, sub }) {
  return (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 26, lineHeight: 1.14, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)', textWrap: 'balance' }}>{children}</h2>
      {sub ? <p style={{ fontFamily: UL_FONT, fontSize: 13.5, lineHeight: 1.45, fontWeight: 400, color: 'var(--ink2)', margin: '10px 14px 0', textWrap: 'pretty' }}>{sub}</p> : null}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 1 · INTENSITY — a vertical list of five bands (matches the urge-surf ask)
// ════════════════════════════════════════════════════════════════════
// intensity marks — same circular grammar as the urge-surf strength ask:
// a ring that fills with ink as the band rises.
const ULStrengthMark = ({ t, c }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="13" cy="13" r="11" stroke={c} strokeWidth="1.5" opacity="0.5" />
    <circle cx="13" cy="13" r={3.2 + t * 7.3} fill={c} />
  </svg>
);

// five bands, short factual descriptors
const UL_BANDS = [
  ['Faint', 'Barely noticeable'],
  ['Mild', 'Easy to set aside'],
  ['Strong', 'Hard to ignore'],
  ['Intense', 'Hard to resist'],
  ['Overwhelming', 'Almost gave in'],
];

function UrgeLogIntensity({ value = 0.62, onChange = () => {}, onBack = () => {}, onClose = () => {}, onContinue = () => {} }) {
  const [sel, setSel] = ulState(bandIndex(value));
  const pick = (i) => { setSel(i); onChange(i / (UL_BANDS.length - 1)); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: UL_BG, fontFamily: UL_FONT, display: 'flex', flexDirection: 'column' }}>
      <ULTop total={4} index={0} onBack={onBack} onClose={onClose} />
      <div style={{ padding: '26px 29px 0' }}><ULHeading>How strong was the urge?</ULHeading></div>
      <div style={{ flex: 1, padding: '24px 29px 0', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10 }}>
        {UL_BANDS.map(([label, note], i) => {
          const on = sel === i;
          return (
            <button key={label} onClick={() => pick(i)} className="tl-press-soft" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--card)', borderRadius: 18, padding: '15px 16px',
              boxShadow: on ? 'inset 0 0 0 1.8px var(--ink)' : 'none',
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 9999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--fill)' : 'var(--soft)', transition: 'background .15s' }}>
                <ULStrengthMark t={i / (UL_BANDS.length - 1)} c={on ? 'var(--on-fill)' : 'var(--ink)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: UL_FONT, fontWeight: on ? 600 : 500, fontSize: 15, color: 'var(--ink)' }}>{label}</div>
                <div style={{ fontFamily: UL_FONT, fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>{note}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '20px 29px 30px', flexShrink: 0 }}>
        <ULButton enabled={sel != null} onClick={onContinue}>Continue</ULButton>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2 · TRIGGER — multi-select grid of what set it off
// ════════════════════════════════════════════════════════════════════
const TIcon = {
  stress: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M13 2L4 13h6l-1 9 9-12h-6z" fill={c} /></svg>,
  bored: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2.1" /><path d="M8.5 14.5h7" stroke={c} strokeWidth="2.1" strokeLinecap="round" /><circle cx="9" cy="10" r="1.2" fill={c} /><circle cx="15" cy="10" r="1.2" fill={c} /></svg>,
  lonely: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill={c} /><path d="M4.5 20c0-3.9 3.4-6.2 7.5-6.2S19.5 16.1 19.5 20z" fill={c} /></svg>,
  tired: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 3h6l-6 7h6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 13h5l-5 6h5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  social: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="8.5" cy="8.5" r="3.3" fill={c} /><circle cx="16" cy="9.5" r="2.7" fill={c} /><path d="M2.5 19c0-3.2 2.7-5 6-5s6 1.8 6 5z" fill={c} /><path d="M14.5 14.2c2.6.2 5 1.8 5 4.8h-3.2" fill={c} /></svg>,
  phone: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="3" fill={c} /><rect x="8" y="5" width="8" height="11" rx="1" fill="var(--bg)" /><circle cx="12" cy="18.6" r="1" fill="var(--bg)" /></svg>,
  night: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path fillRule="evenodd" d="M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1ZM9.4 11.3a1.4 1.4 0 1 0 .001 0ZM12.8 16.1a1 1 0 1 0 .001 0Z" fill={c} /></svg>,
  argument: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h9A1.5 1.5 0 0 1 15 5.5v5A1.5 1.5 0 0 1 13.5 12H8l-3.4 3v-3H4.5A1.5 1.5 0 0 1 3 10.5z" fill={c} /><path d="M17 9h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1v2.5L16.5 16H12a1 1 0 0 1-1-1" fill={c} opacity="0.55" /></svg>,
  craving: (c) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 22c4.5-2.4 7-5.6 7-9.4 0-3-2-5-4.3-5-1.5 0-2.4.8-2.7 2-.3-1.2-1.2-2-2.7-2C7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z" fill={c} /></svg>,
};
const TRIGGERS = [
  ['Stress', TIcon.stress], ['Boredom', TIcon.bored], ['Lonely', TIcon.lonely],
  ['Tired', TIcon.tired], ['Social', TIcon.social], ['Phone', TIcon.phone],
  ['Late night', TIcon.night], ['Argument', TIcon.argument], ['Craving', TIcon.craving],
];

function TriggerCell({ label, icon, on, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '18px 8px', borderRadius: 18,
      background: on ? 'var(--card-2)' : 'var(--card)',
      boxShadow: on ? 'inset 0 0 0 1.8px var(--warm)' : 'none',
    }}>
      <div style={{ width: 46, height: 46, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'var(--fill)' : 'var(--soft)',
        boxShadow: 'none',
        transition: 'background .15s, box-shadow .15s' }}>
        <span style={{ display: 'inline-flex', width: 24, height: 24 }}>{icon(on ? 'var(--on-fill)' : 'var(--ink)')}</span>
      </div>
      <span style={{ fontFamily: UL_FONT, fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
    </button>
  );
}

function UrgeLogTrigger({ selected = ['Late night', 'Boredom'], onToggle, onBack = () => {}, onClose = () => {}, onContinue = () => {} }) {
  const [sel, setSel] = ulState(selected);
  const toggle = (x) => { const next = sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]; setSel(next); onToggle && onToggle(next); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: UL_BG, fontFamily: UL_FONT, display: 'flex', flexDirection: 'column' }}>
      <ULTop total={4} index={1} onBack={onBack} onClose={onClose} />
      <div style={{ padding: '26px 29px 0' }}><ULHeading sub="Tap all that apply.">What set it off?</ULHeading></div>
      <div style={{ flex: 1, padding: '26px 29px 0', minHeight: 0, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
          {TRIGGERS.map(([label, icon]) => <TriggerCell key={label} label={label} icon={icon} on={sel.includes(label)} onClick={() => toggle(label)} />)}
        </div>
      </div>
      <div style={{ padding: '20px 29px 30px', flexShrink: 0 }}>
        <ULButton enabled={sel.length > 0} onClick={onContinue}>{sel.length ? `Continue · ${sel.length}` : 'Continue'}</ULButton>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3 · OUTCOME — single-select: what you did about it
// ════════════════════════════════════════════════════════════════════
const OUTCOMES = [
  ['Rode it out', 'Waited; it passed', Glyph.wave, false],
  ['Surfed with the timer', 'Used the breathing exercise', Glyph.anchor, false],
  ['Distracted myself', 'Did something else', Glyph.compass, false],
  ['Reached out', 'Told someone', Glyph.heart, false],
  ['I slipped', 'It happened', Glyph.moon, true],
];

function OutcomeRow({ label, note, icon, slip, on, onClick }) {
  const ring = on ? (slip ? 'var(--danger)' : 'var(--warm)') : 'var(--line)';
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 18, border: 'none',
      background: on ? 'var(--card-2)' : 'var(--card)', boxShadow: `inset 0 0 0 ${on ? 1.8 : 1.5}px ${ring}, var(--shadow-card)`,
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? (slip ? 'color-mix(in oklab, var(--danger) 24%, transparent)' : 'var(--warm)') : 'var(--soft)', transition: 'background .15s' }}>
        <GIcon el={icon(on ? (slip ? 'var(--danger)' : 'var(--on-fill)') : 'var(--ink2)')} size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: UL_FONT, fontWeight: 500, fontSize: 15, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</div>
        <div style={{ fontFamily: UL_FONT, fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', marginTop: 1 }}>{note}</div>
      </div>
      <div style={{ width: 22, height: 22, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '2px solid var(--soft2)',
        background: on ? (slip ? 'var(--danger)' : 'var(--warm)') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </button>
  );
}

function UrgeLogOutcome({ pick = 0, onPick, onBack = () => {}, onClose = () => {}, onContinue = () => {} }) {
  const [p, setP] = ulState(pick);
  const set = (i) => { setP(i); onPick && onPick(i); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: UL_BG, fontFamily: UL_FONT, display: 'flex', flexDirection: 'column' }}>
      <ULTop total={4} index={2} onBack={onBack} onClose={onClose} />
      <div style={{ padding: '26px 29px 0' }}><ULHeading>What did you do?</ULHeading></div>
      <div style={{ flex: 1, padding: '24px 29px 0', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        {OUTCOMES.map(([label, note, icon, slip], i) => (
          <OutcomeRow key={label} label={label} note={note} icon={icon} slip={slip} on={p === i} onClick={() => set(i)} />
        ))}
      </div>
      <div style={{ padding: '20px 29px 30px', flexShrink: 0 }}>
        <ULButton onClick={onContinue}>Continue</ULButton>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4 · WHEN — day chips + an iOS time wheel
// ════════════════════════════════════════════════════════════════════
function UrgeLogWhen({ onBack = () => {}, onClose = () => {}, onSave = () => {} }) {
  const [day, setDay] = ulState(0);
  const [picker, setPicker] = ulState(false);
  const chips = ['Just now', 'Earlier today', 'Yesterday'];
  return (
    <div style={{ position: 'absolute', inset: 0, background: UL_BG, fontFamily: UL_FONT, display: 'flex', flexDirection: 'column' }}>
      <ULTop total={4} index={3} onBack={onBack} onClose={onClose} />
      <div style={{ padding: '30px 29px 0' }}><ULHeading>When was it?</ULHeading></div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap', padding: '0 16px', flexShrink: 0 }}>
        {chips.map((c, i) => (
          <button key={c} onClick={() => { setDay(i); setPicker(false); }} className="tl-press" style={{
            appearance: 'none', cursor: 'pointer', border: 'none', fontFamily: UL_FONT, fontWeight: 500, fontSize: 14,
            padding: '13px 20px', borderRadius: 9999,
            background: day === i && !picker ? 'var(--fill)' : 'var(--card)', color: day === i && !picker ? 'var(--on-fill)' : 'var(--ink)',
            boxShadow: day === i && !picker ? 'none' : 'none',
          }}>{c}</button>
        ))}
      </div>
      <button onClick={() => setPicker(!picker)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: UL_FONT, fontWeight: 500, fontSize: 14, color: 'var(--accent)', marginTop: 18, alignSelf: 'center', flexShrink: 0 }}>Specify time</button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '26px 29px 0', minHeight: 0 }}>
        {picker && <ULWheel onCancel={() => setPicker(false)} onSave={() => setPicker(false)} />}
      </div>
      <div style={{ padding: '0 29px 30px', flexShrink: 0 }}>
        <ULButton onClick={onSave}>Log the urge</ULButton>
      </div>
    </div>
  );
}

function ULWheel({ onCancel, onSave }) {
  const Col = ({ items, sel = 2, w }) => (
    <div style={{ width: w, position: 'relative', height: 168, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
        {items.map((it, i) => {
          const d = i - sel, op = d === 0 ? 1 : Math.abs(d) === 1 ? 0.42 : 0.16;
          return <div key={i} style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, system-ui', fontSize: d === 0 ? 21 : 18, fontWeight: d === 0 ? 500 : 400, color: 'var(--ink)', opacity: op, transform: `scale(${1 - Math.abs(d) * 0.06})` }}>{it}</div>;
        })}
      </div>
    </div>
  );
  return (
    <div style={{ width: '100%', background: 'var(--card)', borderRadius: 20, overflow: 'hidden', boxShadow: 'none' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '8px 12px' }}>
        <div style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 36, transform: 'translateY(-50%)', borderRadius: 10, background: 'var(--soft)' }} />
        <Col items={['Sat Oct 4', 'Sun Oct 5', 'Today', 'Wed Oct 8', 'Thu Oct 9']} w={132} />
        <Col items={['7', '8', '9', '10', '11']} w={42} />
        <Col items={['12', '13', '14', '15', '16']} w={48} />
        <Col items={['AM', 'PM', '', '', '']} sel={1} w={42} />
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
        <button onClick={onCancel} className="tl-press-soft" style={{ flex: 1, appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '15px 0', fontFamily: '-apple-system, system-ui', fontSize: 17, color: 'var(--accent)' }}>Cancel</button>
        <div style={{ width: 1, background: 'var(--line)' }} />
        <button onClick={onSave} className="tl-press-soft" style={{ flex: 1, appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '15px 0', fontFamily: '-apple-system, system-ui', fontSize: 15.5, fontWeight: 500, color: 'var(--accent)' }}>Save</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5 · DONE — quiet confirmation + a summary of what was logged
// ════════════════════════════════════════════════════════════════════
function UrgeLogDone({ intensity = 0.62, triggers = ['Late night', 'Boredom'], outcome = 0, onClose = () => {} }) {
  const band = BANDS[bandIndex(intensity)];
  const out = OUTCOMES[outcome] || OUTCOMES[0];
  const slip = out[3];
  return (
    <div style={{ position: 'absolute', inset: 0, background: UL_BG, fontFamily: UL_FONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 29px 0', position: 'relative', zIndex: 1 }}>
        <div className="ci-breathe">
          <SceneLoggedMini slip={slip} />
        </div>
        <div style={{ fontFamily: UL_FONT, fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 22 }}>Logged</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 33, lineHeight: 1.08, letterSpacing: '0.01em', margin: '10px 0 0', color: 'var(--ink)' }}>{slip ? 'Logged.' : 'Urge logged.'}</h2>
        <p style={{ fontFamily: UL_FONT, fontSize: 13.5, lineHeight: 1.45, fontWeight: 400, color: 'var(--ink2)', margin: '14px 10px 0', textWrap: 'pretty' }}>
          {slip ? 'A slip is data, not failure.' : 'Each one adds to your pattern data.'}
        </p>

        {/* one card, hairline-divided rows — the home checklist's grammar */}
        <div style={{ width: '100%', marginTop: 28, background: 'var(--card)', borderRadius: 18, padding: '4px 20px', textAlign: 'left' }}>
          <SummaryRow label="Intensity" value={band} />
          <SummaryRow label="Set off by" value={triggers.length ? triggers.join(' · ') : '—'} />
          <SummaryRow label="What I did" value={out[0]} last />
        </div>
      </div>
      <div style={{ padding: '0 29px 30px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <ULButton onClick={onClose}>Done</ULButton>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, last = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 0', borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: UL_FONT, fontWeight: 600, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink3)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: UL_FONT, fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', textAlign: 'right', letterSpacing: 'normal' }}>{value}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LIVE FLOW
// ════════════════════════════════════════════════════════════════════
function UrgeLogScreen() {
  const [step, setStep] = ulState(0);
  const [intensity, setIntensity] = ulState(0.62);
  const [triggers, setTriggers] = ulState(['Late night', 'Boredom']);
  const [outcome, setOutcome] = ulState(0);
  const reset = () => { setStep(0); setIntensity(0.62); setTriggers(['Late night', 'Boredom']); setOutcome(0); };
  const back = () => setStep(Math.max(0, step - 1));
  if (step === 0) return <UrgeLogIntensity value={intensity} onChange={setIntensity} onBack={reset} onClose={reset} onContinue={() => setStep(1)} />;
  if (step === 1) return <UrgeLogTrigger selected={triggers} onToggle={setTriggers} onBack={back} onClose={reset} onContinue={() => setStep(2)} />;
  if (step === 2) return <UrgeLogOutcome pick={outcome} onPick={setOutcome} onBack={back} onClose={reset} onContinue={() => setStep(3)} />;
  if (step === 3) return <UrgeLogWhen onBack={back} onClose={reset} onSave={() => setStep(4)} />;
  return <UrgeLogDone intensity={intensity} triggers={triggers} outcome={outcome} onClose={reset} />;
}

Object.assign(window, {
  UrgeLogScreen, UrgeLogIntensity, UrgeLogTrigger, UrgeLogOutcome, UrgeLogWhen, UrgeLogDone,
});
