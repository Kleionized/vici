// screens-lesson.jsx — interactive lesson + moment-log components for VICI.
// Recreates a set of generic guided-flow interaction patterns (tip card,
// word-chip collector, yes/no quiz, single-select picker, named-moment text
// entry, when-did-it-happen date picker, and a tabbed "patterns" board) in
// the VICI celestial system. Indigo accent, serif heroes, calm motion.
//
// Exports (to window): LessonTipScreen, LessonCollectScreen, LessonQuizScreen,
// LessonPickScreen, MomentNameScreen, MomentWhenScreen, PatternsBoardScreen,
// PatternsEmotionsScreen, InteractiveLessonFlow, MomentLogFlow.

const { useState: useLState, useRef: useLRef } = React;

// ── tones ───────────────────────────────────────────────────────────
const L_BG = 'var(--bg)';

// ── top: thin progress bar + icon row (back · bookmark · share · close) ─
function ProgressBar({ pct = 0.5 }) {
  return (
    <div style={{ height: 6, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', flexShrink: 0, boxShadow: 'none' }}>
      <div style={{ width: `${Math.round(pct * 100)}%`, height: '100%', background: 'var(--fill)', borderRadius: 9999, transition: 'width .35s cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

function LIcon({ name, c = 'var(--ink)' }) {
  const m = {
    back: <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    close: <path d="M5 5l14 14M19 5L5 19" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none" />,
    bookmark: <path d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill="none" />,
    bookmarkOn: <path d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z" fill={c} />,
    share: <g stroke={c} strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M12 15.4V3.8M12 3.8 8.3 7.5M12 3.8l3.7 3.7" /><path d="M5.4 11.6v7a1.5 1.5 0 0 0 1.5 1.5h10.2a1.5 1.5 0 0 0 1.5-1.5v-7" /></g>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block' }}>{m[name]}</svg>;
}

function LessonTopBar({ onBack, onClose, marked, onMark, share = true }) {
  const Btn = ({ children, onClick }) => (
    <button onClick={onClick} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex', borderRadius: 10 }}>{children}</button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 4, flexShrink: 0 }}>
      <Btn onClick={onBack}><LIcon name="back" /></Btn>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {onMark !== undefined && <Btn onClick={onMark}><LIcon name={marked ? 'bookmarkOn' : 'bookmark'} c={marked ? 'var(--accent)' : 'var(--ink)'} /></Btn>}
        {share && <Btn><LIcon name="share" c="var(--accent)" /></Btn>}
        <Btn onClick={onClose}><LIcon name="close" /></Btn>
      </div>
    </div>
  );
}

// primary full-width pill (matches the check-in CTA)
function CTA({ label = 'Continue', enabled = true, onClick, arrow = false }) {
  return (
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', width: '100%', cursor: enabled ? 'pointer' : 'default',
      background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5,
      borderRadius: 9999, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: enabled ? 1 : 0.32, letterSpacing: '0.01em',
      boxShadow: 'none',
    }}>
      {label}
      {arrow && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="var(--on-fill)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
// 1 · LESSON TIP — illustration + body with a bolded key phrase + CTA
// ════════════════════════════════════════════════════════════════════
function LessonTipScreen({ onBack, onClose, onContinue, pct = 0.82 }) {
  const [marked, setMarked] = useLState(false);
  return (
    <Shell top={72} bg={L_BG}>
      <ProgressBar pct={pct} />
      <LessonTopBar onBack={onBack} onClose={onClose} marked={marked} onMark={() => setMarked(!marked)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <div className="onb-rise" style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <TipScene />
        </div>
        <p className="onb-rise" style={{ fontFamily: 'var(--font)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', textAlign: 'center', margin: '0 0 14px' }}>
          A trick to make it stick
        </p>
        <p className="onb-rise" style={{ fontFamily: 'var(--font)', fontSize: 23, lineHeight: 1.45, fontWeight: 500, color: 'var(--ink2)', textAlign: 'center', margin: 0, textWrap: 'pretty', letterSpacing: '-0.005em' }}>
          <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Anchor your practice to something you already do every day</b> — like your evening tea. Then the kettle becomes your cue: <i style={{ color: 'var(--ink)', fontStyle: 'italic' }}>"Ah, time to check in."</i>
        </p>
      </div>
      <div style={{ paddingTop: 18, flexShrink: 0 }}>
        <CTA label="Pairing the habit" onClick={onContinue} />
      </div>
    </Shell>
  );
}

// the evening-tea cue, in the faceted paper language of the world art:
// a window onto a flat crescent moon + ridge, and a two-tone mug steaming
// on the sill. No gradients, no celestial rendering — lit/shade planes.
function TipScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 200 }}>
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" style={{ display: 'block' }}>
        {/* window frame */}
        <rect x="30" y="6" width="160" height="128" rx="16" fill="#EDEAE0" />
        <rect x="40" y="16" width="140" height="108" rx="10" fill="#F8F6EF" />
        {/* flat crescent moon */}
        <circle cx="146" cy="52" r="17" fill="#F4F2E9" stroke="#E1DECF" strokeWidth="1.4" />
        <path d="M146 35 a17 17 0 0 1 0 34 a22 22 0 0 0 0 -34 Z" fill="#E1DDCD" />
        <circle cx="140" cy="50" r="2.6" fill="#E7E4D7" />
        <circle cx="145" cy="59" r="1.8" fill="#E7E4D7" />
        {/* ridge line out the window */}
        <path d="M40 108 L78 82 L112 108 Z" fill="#E9E6D9" />
        <path d="M78 82 L112 108 L94 108 Z" fill="#E1DECF" />
        <path d="M96 108 L136 88 L180 108 Z" fill="#E1DDCD" opacity="0.8" />
        <rect x="40" y="108" width="140" height="16" fill="#DDD9C7" />
        {/* mullion */}
        <rect x="108" y="16" width="3.6" height="108" fill="#EDEAE0" />
        {/* the sill — lit top + shaded front */}
        <path d="M18 134 L202 134 L202 146 L18 146 Z" fill="#E1DDCD" />
        <path d="M18 146 L202 146 L196 168 L24 168 Z" fill="#C5C0AA" />
        {/* steam */}
        <g stroke="#B4AF98" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75">
          <path className="onb-bob" d="M142 106 c 6 -5 6 -11 0 -16" />
          <path className="onb-bob2" d="M156 106 c 6 -5 6 -11 0 -16" />
        </g>
        {/* the mug — lit body, shaded side, tea surface, handle */}
        <path d="M128 114 L170 114 L166 142 A10 10 0 0 1 156 150 L142 150 A10 10 0 0 1 132 142 Z" fill="#FCFBF8" />
        <path d="M154 114 L170 114 L166 142 A10 10 0 0 1 156 150 L150 150 C 154 138 155 126 154 114 Z" fill="#D2CDBA" />
        <ellipse cx="149" cy="114" rx="21" ry="5" fill="#C9C4AE" />
        <ellipse cx="149" cy="113.4" rx="17" ry="3.6" fill="#B4AF98" />
        <path d="M170 119 h5 a8 8 0 0 1 0 17 h-6" stroke="#D2CDBA" strokeWidth="3.4" fill="none" />
        {/* a small closed book beside it */}
        <path d="M52 138 L92 138 L92 148 L52 148 Z" fill="#D8D3C0" />
        <path d="M52 138 L92 138 L92 141 L52 141 Z" fill="#F4F2E9" />
        <path d="M56 128 L96 128 L96 138 L56 138 Z" fill="#C5C0AA" />
        <path d="M56 128 L96 128 L96 131 L56 131 Z" fill="#EDEAE0" />
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2 · COLLECT — icon + heading + fill-in-the-blank body + tappable chips
// ════════════════════════════════════════════════════════════════════
const SIGN_WORDS = ['Criticizing myself', 'Forcing a laugh', 'Going quiet', 'Tapping', 'Looking away', 'Getting fidgety', 'Feeling small', 'Over-explaining'];

function ChipPill({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, letterSpacing: 'normal',
      padding: '12px 18px', borderRadius: 9999,
      background: on ? 'var(--fill)' : 'var(--card)', color: on ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: 'none',
    }}>{label}</button>
  );
}

function LessonCollectScreen({ onBack, onClose, onContinue, pct = 0.62 }) {
  const [sel, setSel] = useLState(['Criticizing myself', 'Tapping']);
  const toggle = (w) => setSel(sel.includes(w) ? sel.filter((x) => x !== w) : [...sel, w]);
  return (
    <Shell top={72} bg={L_BG}>
      <ProgressBar pct={pct} />
      <LessonTopBar onBack={onBack} onClose={onClose} share={false} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 14, flexShrink: 0 }}>
        <div style={{
          width: 76, height: 76, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--fill)',
          boxShadow: 'none',
        }}>
          <GIcon el={Glyph.spark('var(--on-fill)')} size={36} />
        </div>
        <Hero size={30} style={{ marginTop: 18, textAlign: 'center' }}>A great start.</Hero>
      </div>
      <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, fontWeight: 400, color: 'var(--ink2)', textAlign: 'center', margin: '16px 4px 0', textWrap: 'pretty' }}>
        Memorise your signs now, so you know what to watch for: <i style={{ color: 'var(--ink)' }}>"If I notice I'm ____, I take a breath and reset."</i>
      </p>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignContent: 'center', minHeight: 0, padding: '8px 0' }}>
        {SIGN_WORDS.map((w) => <ChipPill key={w} label={w} on={sel.includes(w)} onClick={() => toggle(w)} />)}
      </div>
      <div style={{ flexShrink: 0 }}>
        <CTA label={sel.length ? `Continue · ${sel.length}` : 'Continue'} enabled={sel.length > 0} onClick={onContinue} />
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3 · QUIZ — "Question x of N" + term card + As-in note + No / Yes
// ════════════════════════════════════════════════════════════════════
const QUIZ = [
  { term: 'Criticizing myself', asin: 'Talking down my abilities and qualities', hue: 18 },
  { term: 'Forcing a laugh', asin: 'Laughing along to ease the tension', hue: 96 },
  { term: 'Going quiet', asin: 'Holding back what I actually think', hue: 256 },
  { term: 'Looking away', asin: 'Avoiding eye contact when it matters', hue: 304 },
  { term: 'Getting fidgety', asin: 'Tapping, shifting, never quite still', hue: 152 },
];

function QuizCard({ q }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden', flex: 1, minHeight: 0,
      background: 'var(--card)',
      boxShadow: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 26,
    }}>
      {/* floating accents */}
      <div className="onb-bob" style={{ position: 'absolute', top: 26, right: 30 }}>
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" fill="#F4F2E9" stroke="#E1DECF" strokeWidth="1.4" />
          <path d="M24 5 a19 19 0 0 1 0 38 a25 25 0 0 0 0 -38 Z" fill="#E1DDCD" />
          <circle cx="18" cy="22" r="2.8" fill="#E7E4D7" /><circle cx="23" cy="31" r="2" fill="#E7E4D7" />
        </svg>
      </div>
      <div className="onb-bob2" style={{ position: 'absolute', bottom: 34, left: 26, width: 26, height: 26, borderRadius: 9999, background: 'var(--soft2)' }} />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 33, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.08 }}>{q.term}</div>
        <p style={{ fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 400, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 260, lineHeight: 1.4, textWrap: 'pretty' }}>
          As in: {q.asin}
        </p>
      </div>
    </div>
  );
}

function YesNoButton({ kind, onClick }) {
  const yes = kind === 'yes';
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer', flex: 1, background: 'var(--card)', borderRadius: 20, padding: '18px 0 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      transition: 'transform .14s cubic-bezier(.34,1.45,.6,1)', boxShadow: 'none',
    }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 9999, border: `2.4px solid ${yes ? 'var(--fill)' : 'var(--soft2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {yes
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink2)" strokeWidth="2.6" strokeLinecap="round" /></svg>}
      </div>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, color: 'var(--ink)' }}>{yes ? 'Yes' : 'No'}</span>
    </button>
  );
}

function LessonQuizScreen({ onBack, onClose, onDone }) {
  const [i, setI] = useLState(0);
  const total = QUIZ.length;
  const answer = () => { if (i + 1 < total) setI(i + 1); else if (onDone) onDone(); };
  const q = QUIZ[i];
  return (
    <Shell top={72} bg={L_BG}>
      <ProgressBar pct={(i + 1) / total} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 14, flexShrink: 0 }}>
        <button onClick={i > 0 ? () => setI(i - 1) : onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex', borderRadius: 10 }}><LIcon name="back" /></button>
        <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)' }}>Question {i + 1} of {total}</span>
        <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex', borderRadius: 10 }}><LIcon name="close" /></button>
      </div>
      <Ask size={25} style={{ textAlign: 'center', marginBottom: 18, flexShrink: 0 }}>In tense moments, I'm sometimes…</Ask>
      <QuizCard q={q} />
      <div style={{ display: 'flex', gap: 14, paddingTop: 18, flexShrink: 0 }}>
        <YesNoButton kind="no" onClick={answer} />
        <YesNoButton kind="yes" onClick={answer} />
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4 · PICK — single-select list of routine rows (icon + label)
// ════════════════════════════════════════════════════════════════════
const ROUTINES = [
  ['Waking up', Glyph.sun],
  ['Your evening tea', Glyph.moon],
  ['The commute', Glyph.compass],
  ['Winding down at night', Glyph.bell],
  ['I have another in mind', Glyph.spark],
];

function PickRow({ label, icon, on, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, padding: '17px 20px', borderRadius: 18,
      background: on ? 'var(--card-2)' : 'var(--card)',
      border: 'none', boxShadow: on ? 'inset 0 0 0 1.8px var(--accent)' : 'none',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: on ? 'color-mix(in oklab, var(--accent) 24%, transparent)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
        <GIcon el={icon(on ? 'var(--accent)' : 'var(--ink2)')} size={21} />
      </div>
      <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, color: 'var(--ink)', letterSpacing: 'normal' }}>{label}</span>
      <div style={{ width: 22, height: 22, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '2px solid var(--soft2)', background: on ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </button>
  );
}

function LessonPickScreen({ onBack, onClose, onContinue, pct = 0.92 }) {
  const [pick, setPick] = useLState(1);
  return (
    <Shell top={72} bg={L_BG}>
      <ProgressBar pct={pct} />
      <LessonTopBar onBack={onBack} onClose={onClose} share={false} />
      <div style={{ marginTop: 18, flexShrink: 0 }}>
        <Ask size={28}>When will you open VICI and check in? While…</Ask>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, minHeight: 0 }}>
        {ROUTINES.map(([label, icon], idx) => (
          <PickRow key={label} label={label} icon={icon} on={pick === idx} onClick={() => setPick(idx)} />
        ))}
      </div>
      <div style={{ flexShrink: 0 }}>
        <CTA label="Continue" enabled={pick !== null} onClick={onContinue} />
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5 · NAME THE MOMENT — text entry + keyboard
// ════════════════════════════════════════════════════════════════════
function MomentNameScreen({ onBack, onClose, onContinue, initial = 'argument with a stranger' }) {
  const [val, setVal] = useLState(initial);
  return (
    <Shell pad={0} top={0} bg={L_BG}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '60px 29px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex', borderRadius: 10 }}><LIcon name="close" /></button>
          </div>
          <Ask size={26} style={{ textAlign: 'center', margin: '0 12px' }}>Give the moment a name — just describe what happened.</Ask>
          <div style={{ marginTop: 26, background: 'var(--card)', borderRadius: 18, padding: '17px 20px', display: 'flex', alignItems: 'center', boxShadow: 'none' }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 17, color: val ? 'var(--ink)' : 'var(--ink3)', letterSpacing: '-0.005em' }}>{val || 'What happened?'}</span>
            <span className="tl-caret" style={{ width: 2, height: 22, background: 'var(--accent)', marginLeft: 2, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 29px 12px', flexShrink: 0 }}>
          <CTA label="Continue" enabled={!!val} onClick={onContinue} />
        </div>
        <LessonKeyboard onKey={(k) => {
          if (k === '⌫') setVal(val.slice(0, -1));
          else if (k === 'space') setVal(val + ' ');
          else if (k === 'return') onContinue && onContinue();
          else if (k.length === 1) setVal(val + k);
        }} />
      </div>
    </Shell>
  );
}

function LessonKeyboard({ onKey }) {
  const rows = [['q','w','e','r','t','y','u','i','o','p'], ['a','s','d','f','g','h','j','k','l'], ['z','x','c','v','b','n','m']];
  const Key = ({ ch, flex, w, send }) => (
    <button onClick={() => onKey && onKey(send || ch)} style={{ appearance: 'none', border: 'none', flex: flex ? 1 : undefined, width: w, height: 42, background: 'var(--kbd-key)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, system-ui', fontSize: 20, color: 'var(--kbd-ink)', boxShadow: 'none', cursor: 'pointer' }}>{ch}</button>
  );
  return (
    <div style={{ background: 'var(--kbd-bg)', padding: '8px 4px 30px', display: 'flex', flexDirection: 'column', gap: 9, flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 5 }}>{rows[0].map(k => <Key key={k} ch={k} flex />)}</div>
      <div style={{ display: 'flex', gap: 5, padding: '0 16px' }}>{rows[1].map(k => <Key key={k} ch={k} flex />)}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Key ch="⇧" w={40} />
        <div style={{ display: 'flex', gap: 5, flex: 1 }}>{rows[2].map(k => <Key key={k} ch={k} flex />)}</div>
        <Key ch="⌫" w={40} send="⌫" />
      </div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Key ch="123" w={80} />
        <Key ch="space" flex send="space" />
        <button onClick={() => onKey && onKey('return')} style={{ appearance: 'none', border: 'none', width: 88, height: 42, background: 'var(--fill)', borderRadius: 6, color: 'var(--on-fill)', fontFamily: '-apple-system, system-ui', fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: 'none' }}>return</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 6 · WHEN DID IT HAPPEN — day chips + specify time + wheel picker
// ════════════════════════════════════════════════════════════════════
function MomentWhenScreen({ onBack, onClose, onCreate }) {
  const [day, setDay] = useLState(0);
  const [picker, setPicker] = useLState(false);
  const chips = ['Today', 'Yesterday', '2 days ago'];
  return (
    <Shell top={72} bg={L_BG}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6, flexShrink: 0 }}>
        <button onClick={onClose} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, display: 'flex' }}><LIcon name="close" /></button>
      </div>
      <Hero size={32} style={{ textAlign: 'center', flexShrink: 0 }}>When did it happen?</Hero>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexShrink: 0, flexWrap: 'wrap' }}>
        {chips.map((c, i) => (
          <button key={c} onClick={() => { setDay(i); setPicker(false); }} className="tl-press" style={{
            appearance: 'none', cursor: 'pointer', border: 'none',
            fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, padding: '13px 22px', borderRadius: 9999,
            background: day === i && !picker ? 'var(--fill)' : 'var(--card)', color: day === i && !picker ? 'var(--on-fill)' : 'var(--ink)',
            boxShadow: 'none',
          }}>{c}</button>
        ))}
      </div>
      <button onClick={() => setPicker(!picker)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--accent)', marginTop: 18, alignSelf: 'center', flexShrink: 0 }}>
        Specify time
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 0, paddingTop: 28 }}>
        {picker && <DateWheel onCancel={() => setPicker(false)} onSave={() => setPicker(false)} />}
      </div>

      <div style={{ flexShrink: 0 }}>
        <CTA label="Create moment" onClick={onCreate} arrow />
      </div>
    </Shell>
  );
}

// iOS-style date/time wheel (visual + selectable rows)
function DateWheel({ onCancel, onSave }) {
  const days = ['Sat Oct 4', 'Sun Oct 5', 'Mon Oct 6', 'Today', 'Wed Oct 8'];
  const Col = ({ items, sel = 2, w }) => (
    <div style={{ width: w, position: 'relative', height: 180, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
        {items.map((it, i) => {
          const d = i - sel;
          const op = d === 0 ? 1 : Math.abs(d) === 1 ? 0.42 : 0.16;
          return (
            <div key={i} style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, system-ui', fontSize: d === 0 ? 21 : 19, fontWeight: d === 0 ? 500 : 400, color: 'var(--ink)', opacity: op, transform: `scale(${1 - Math.abs(d) * 0.06})` }}>{it}</div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={{ width: '100%', background: 'var(--card)', borderRadius: 20, overflow: 'hidden', boxShadow: 'none' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '8px 12px' }}>
        <div style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 38, transform: 'translateY(-50%)', borderRadius: 10, background: 'var(--soft)' }} />
        <Col items={days} w={132} />
        <Col items={['11', '12', '1', '2', '3']} w={42} />
        <Col items={['37', '38', '39', '40', '41']} w={48} />
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
// 7 · PATTERNS BOARD — tabs + tip banner + masonry tiles + bottom sheet
// ════════════════════════════════════════════════════════════════════
const BOARD_TABS = ['My usuals', 'Trigger emotions', 'Thoughts', 'Body'];
const USUALS = [
  { label: 'Criticizing myself', count: 2, hue: 18, span: 2 },
  { label: 'Tapping', count: 1, hue: 96, span: 1 },
  { label: 'Getting fidgety', count: 1, hue: 152, span: 1 },
  { label: 'Feeling incapable', count: 1, hue: 256, span: 2 },
];
const EMOTIONS = ['Feeling unlikeable', 'Feeling stupid', 'Feeling incapable', 'Mistrustful of myself', 'Worried about worrying', 'Feeling unappreciated', 'Feeling attacked', 'Out of place', 'Feeling hungry', 'Feeling tired', 'Feeling hyper', 'Feeling unwell'];

function BoardTabs({ active, onSel }) {
  return (
    <div style={{ display: 'flex', gap: 22, marginTop: 6, marginBottom: 4, borderBottom: '1px solid var(--line)', overflowX: 'auto', flexShrink: 0 }}>
      {BOARD_TABS.map((t, i) => {
        const on = i === active;
        return (
          <button key={t} onClick={() => onSel(i)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0 12px', position: 'relative', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: on ? 'var(--ink)' : 'var(--ink3)', letterSpacing: 'normal', whiteSpace: 'nowrap', transition: 'color .18s' }}>{t}</span>
            {on && <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2.5, borderRadius: 9999, background: 'var(--accent)' }} />}
          </button>
        );
      })}
    </div>
  );
}

function TipBanner({ children }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--card)', borderRadius: 16, padding: '16px 18px', marginTop: 14, flexShrink: 0 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}><GIcon el={Glyph.spark('var(--accent)')} size={20} /></span>
      <p style={{ fontFamily: 'var(--font)', fontSize: 14.5, lineHeight: 1.4, fontWeight: 400, color: 'var(--ink2)', margin: 0, textWrap: 'pretty' }}>{children}</p>
    </div>
  );
}

function MasonryTile({ label, count, hue, span }) {
  return (
    <div style={{
      gridRow: `span ${span}`, background: 'var(--soft)', borderRadius: 18, padding: 18, position: 'relative',
      display: 'flex', alignItems: 'flex-start',
      minHeight: span === 2 ? 150 : 96, boxShadow: 'none',
    }}>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, color: 'var(--ink)', letterSpacing: '-0.005em', lineHeight: 1.2 }}>{label}</span>
      <span className="tnum" style={{ position: 'absolute', left: 16, bottom: 14, width: 26, height: 26, borderRadius: 9999, background: 'var(--card-2)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink2)' }}>{count}</span>
    </div>
  );
}

function PatternsBoardScreen({ onBack, sheet = true, startTab = 0 }) {
  const [tab, setTab] = useLState(startTab);
  return (
    <Shell top={72} bg={L_BG}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, marginLeft: -6, display: 'flex', borderRadius: 10 }}><LIcon name="back" /></button>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, color: 'var(--ink)', letterSpacing: '0.005em' }}>Warning signs</span>
          <span className="tl-press-soft" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink3)', cursor: 'pointer' }}>Save</span>
        </div>
        <BoardTabs active={tab} onSel={setTab} />
        {tab === 1 ? (
          <React.Fragment>
            <TipBanner>What underlying feelings can you identify in yourself?</TipBanner>
            <div style={{ flex: 1, overflow: 'hidden', marginTop: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px dashed var(--soft2)', borderRadius: 16, overflow: 'hidden' }}>
                {EMOTIONS.map((e, i) => (
                  <div key={e} style={{ minHeight: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 12, borderRight: i % 2 === 0 ? '1px dashed var(--soft2)' : 'none', borderBottom: i < EMOTIONS.length - 2 ? '1px dashed var(--soft2)' : 'none', background: 'color-mix(in oklab, var(--accent) 9%, transparent)' }}>
                    <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', letterSpacing: 'normal', textWrap: 'balance' }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TipBanner>What recurring signs show up in you? Keep them top of mind.</TipBanner>
            <div style={{ flex: 1, overflow: 'hidden', marginTop: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'minmax(64px, auto)', gap: 12 }}>
                {USUALS.map((u) => <MasonryTile key={u.label} {...u} />)}
              </div>
            </div>
          </React.Fragment>
        )}

        {sheet && (
          <div style={{ position: 'absolute', left: -29, right: -29, bottom: -52, background: 'var(--card)', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottom: 'none', padding: '26px 29px 60px', boxShadow: 'none' }}>
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 38, height: 4.5, borderRadius: 9999, background: 'var(--soft2)' }} />
            <Hero size={26} style={{ textAlign: 'center' }}>Now untangle it.</Hero>
            <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.45, fontWeight: 400, color: 'var(--ink2)', textAlign: 'center', margin: '10px 0 18px', textWrap: 'pretty' }}>
              What did you feel, think, and do? Tap signs to add them to "My usuals".
            </p>
            <CTA label="Let's explore" onClick={onBack} />
          </div>
        )}
      </div>
    </Shell>
  );
}

function PatternsEmotionsScreen({ onBack }) {
  return <PatternsBoardScreen onBack={onBack} sheet={false} startTab={1} />;
}

// ════════════════════════════════════════════════════════════════════
// LIVE FLOWS
// ════════════════════════════════════════════════════════════════════
function InteractiveLessonFlow() {
  const [step, setStep] = useLState(0);
  const back = () => setStep(Math.max(0, step - 1));
  const reset = () => setStep(0);
  if (step === 0) return <LessonTipScreen onBack={reset} onClose={reset} onContinue={() => setStep(1)} pct={0.5} />;
  if (step === 1) return <LessonCollectScreen onBack={back} onClose={reset} onContinue={() => setStep(2)} pct={0.66} />;
  if (step === 2) return <LessonQuizScreen onBack={back} onClose={reset} onDone={() => setStep(3)} />;
  return <LessonPickScreen onBack={back} onClose={reset} onContinue={reset} pct={1} />;
}

function MomentLogFlow() {
  const [step, setStep] = useLState(0);
  const reset = () => setStep(0);
  if (step === 0) return <MomentNameScreen onBack={reset} onClose={reset} onContinue={() => setStep(1)} />;
  if (step === 1) return <MomentWhenScreen onBack={() => setStep(0)} onClose={reset} onCreate={() => setStep(2)} />;
  return <PatternsBoardScreen onBack={reset} />;
}

Object.assign(window, {
  LessonTipScreen, LessonCollectScreen, LessonQuizScreen, LessonPickScreen,
  MomentNameScreen, MomentWhenScreen, PatternsBoardScreen, PatternsEmotionsScreen,
  InteractiveLessonFlow, MomentLogFlow,
});
