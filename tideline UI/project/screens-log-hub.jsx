// screens-log-hub.jsx — the Log tab's one front door.
//
// A chooser asks WHAT you're capturing — daily check-in, an urge, a
// moment, or a journal entry — then hands off to the flow that already
// exists for it. Closing any flow lands back on the chooser.
//
// Exports: LogChooserScreen (standalone), LogHubFlow (live).

const { useState: lhState } = React;

// ── small scene-marks, one per log kind (SceneKit prims) — each one
// grounded on a horizon so nothing floats; dark-aware for the primary
// card. Day sun = check-in · crest = urge · buoy = moment · moon = journal.
function LHMarkCheckin({ dark = false }) {
  const K = window.SceneKit, SC = K.SC;
  const ln = dark ? 'rgba(245,244,241,0.8)' : SC.waterLo;
  return (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none" style={{ display: 'block' }}>
      <K.SSun cx={28} cy={16} r={8.5} glow={2.1} pulse={false} />
      {/* the horizon it rose over, and its light on the water */}
      <path d="M6 33 h44" stroke={ln} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 38.5 h10 M25.5 44 h5" stroke={ln} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
function LHMarkUrge({ dark = false }) {
  const K = window.SceneKit, SC = K.SC;
  const deep = dark ? '#F5F4F1' : SC.waterDeep;
  const ln = dark ? 'rgba(245,244,241,0.8)' : SC.waterLo;
  return (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none" style={{ display: 'block' }}>
      {/* one crest, curling and meeting the water it came from */}
      <path d="M8 40 C 14 16, 30 10, 38 18 C 44 24, 41 32, 34 30.5 C 29 29.5, 29 23.5, 33 22.5" stroke={deep} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="12" r="1.8" fill={ln} opacity="0.8" />
      <circle cx="47" cy="18" r="1.3" fill={ln} opacity="0.55" />
      <path d="M6 40 h44" stroke={ln} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
function LHMarkMoment({ dark = false }) {
  const K = window.SceneKit, SC = K.SC;
  const deep = dark ? '#F5F4F1' : SC.waterDeep;
  const ln = dark ? 'rgba(245,244,241,0.8)' : SC.waterLo;
  return (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none" style={{ display: 'block' }}>
      {/* a marker buoy, floating ON the waterline */}
      <path d="M28 34 V 12" stroke={deep} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M28 12 L 41 16.5 L 28 21 Z" fill={deep} />
      <path d="M20.5 36 a 7.5 4.6 0 0 1 15 0 Z" fill={ln} />
      <path d="M6 36 h44" stroke={ln} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M14 42.5 q 7 -2.4 14 0 t 14 0" stroke={ln} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  );
}
function LHMarkJournal({ dark = false }) {
  const K = window.SceneKit, SC = K.SC;
  const ln = dark ? 'rgba(245,244,241,0.8)' : SC.waterLo;
  return (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none" style={{ display: 'block' }}>
      <K.SMoonF cx={28} cy={15} r={9.5} phase={0.72} />
      <circle cx="10" cy="10" r="1.2" fill={dark ? 'rgba(245,244,241,0.7)' : SC.farShade} />
      <circle cx="46" cy="13" r="1" fill={dark ? 'rgba(245,244,241,0.6)' : SC.farShade} />
      {/* the night horizon, and the moon's light on the water */}
      <path d="M6 33 h44" stroke={ln} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M24 38.5 h8 M26 44 h4.5" stroke={ln} strokeWidth="1.9" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ── one option row — big target, mark + words + chevron. `dark` renders
// it as the home screen's #131313 card (the daily primary). ────────
function LogOption({ mark, title, note, onClick, dark = false }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 15, padding: '17px 18px 17px 14px', borderRadius: 20,
      background: dark ? '#131313' : 'var(--card)', boxShadow: 'none',
    }}>
      <div style={{ width: 56, height: 48, flexShrink: 0 }}>{React.cloneElement(mark, { dark })}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 16, color: dark ? '#F5F4F1' : 'var(--ink)', letterSpacing: '-0.005em' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: dark ? 'rgba(245,244,241,0.6)' : 'var(--ink2)', marginTop: 3, lineHeight: 1.35 }}>{note}</div>
      </div>
      <span style={{ flexShrink: 0, display: 'flex' }}>{Glyph.chevR(dark ? 'rgba(245,244,241,0.55)' : 'var(--ink3)')}</span>
    </button>
  );
}

// ── the chooser ──────────────────────────────────────────────────────
function LogChooserScreen({ onPick = () => {}, onClose = () => {} }) {
  const OPTIONS = [
    ['checkin', <LHMarkCheckin />, 'Daily check-in', 'Your mood today, in twenty seconds'],
    ['urge', <LHMarkUrge />, 'An urge', 'How strong, what fed it, how it went'],
    ['moment', <LHMarkMoment />, 'A moment', 'A warning sign worth remembering'],
    ['journal', <LHMarkJournal />, 'Journal entry', 'Free words, at your own pace'],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 29px 0', flexShrink: 0 }}>
        <span style={{ width: 30 }} />
        <Eyebrow>Your log</Eyebrow>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ padding: '28px 29px 0', textAlign: 'center', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)', textWrap: 'balance' }}>What are you logging?</h2>
      </div>
      <div style={{ flex: 1, padding: '32px 29px 0', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {OPTIONS.map(([kind, mark, title, note], i) => (
          <LogOption key={kind} mark={mark} title={title} note={note} dark={i === 0} onClick={() => onPick(kind)} />
        ))}
      </div>
    </div>
  );
}

// ── embedded flows that return to the chooser ────────────────────────
function LHUrge({ onExit }) {
  const [step, setStep] = lhState(0);
  const [intensity, setIntensity] = lhState(0.62);
  const [triggers, setTriggers] = lhState(['Late night', 'Boredom']);
  const [outcome, setOutcome] = lhState(0);
  const back = () => (step === 0 ? onExit() : setStep(step - 1));
  if (step === 0) return <UrgeLogIntensity value={intensity} onChange={setIntensity} onBack={back} onClose={onExit} onContinue={() => setStep(1)} />;
  if (step === 1) return <UrgeLogTrigger selected={triggers} onToggle={setTriggers} onBack={back} onClose={onExit} onContinue={() => setStep(2)} />;
  if (step === 2) return <UrgeLogOutcome pick={outcome} onPick={setOutcome} onBack={back} onClose={onExit} onContinue={() => setStep(3)} />;
  if (step === 3) return <UrgeLogWhen onBack={back} onClose={onExit} onSave={() => setStep(4)} />;
  return <UrgeLogDone intensity={intensity} triggers={triggers} outcome={outcome} onClose={onExit} />;
}

function LHMoment({ onExit }) {
  const [step, setStep] = lhState(0);
  if (step === 0) return <MomentNameScreen onBack={onExit} onClose={onExit} onContinue={() => setStep(1)} />;
  if (step === 1) return <MomentWhenScreen onBack={() => setStep(0)} onClose={onExit} onCreate={() => setStep(2)} />;
  return <PatternsBoardScreen onBack={onExit} />;
}

// ── the live hub ─────────────────────────────────────────────────────
function LogHubFlow() {
  const [mode, setMode] = lhState(null);
  const home = () => setMode(null);
  if (mode === 'checkin') return <CheckInScreen onExit={home} />;
  if (mode === 'urge') return <LHUrge onExit={home} />;
  if (mode === 'moment') return <LHMoment onExit={home} />;
  if (mode === 'journal') return <JournalEditorScreen onCancel={home} onSave={home} />;
  return <LogChooserScreen onPick={setMode} onClose={home} />;
}

Object.assign(window, { LogChooserScreen, LogHubFlow });
