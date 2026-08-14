// screens-lesson-flow.jsx — VICI · inside a lesson.
// The reader is paged, not scrolled: one idea per page in the urge-flow
// grammar — segmented progress, back, ✕, a vignette or full-bleed image
// given the room, one serif line, at most one quiet sub. Lesson shown:
// Ground I · Lesson IV, "Riding out a craving."
//
// Exports: LessonFlow + one static board per page kind.

const { useState: lfState } = React;

// ── page data — minimal text, one idea each ──────────────────────────
const LF_PAGES = [
  { kind: 'title' },
  { vignette: 'rising', title: 'A craving is not a command.', sub: 'It’s a wave of chemistry. Waves break.' },
  { img: 'assets/urge-wave.webp', title: 'Twenty minutes.', sub: 'The usual life of one, start to finish.' },
  { vignette: 'name', title: 'Name it when it rises.', sub: '“This is a wave.” Said out loud, it loosens.' },
  { vignette: 'remove', title: 'Move one room away.', sub: 'Distance beats willpower.' },
  { img: 'assets/urge-calm.webp', title: 'You don’t fight the water. You outlast it.' },
  { kind: 'done' },
];

// ── top bar: back · segments · close ─────────────────────────────────
function LFTopBar({ index, onBack, onClose }) {
  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', padding: '60px 29px 0', gap: 12, flexShrink: 0 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', flex: '0 0 auto' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {LF_PAGES.map((_, i) => (
            <div key={i} style={{ width: 26, height: 4, borderRadius: 9999, background: i <= index ? 'var(--fill)' : 'var(--soft2)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>
      <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex', flex: '0 0 auto' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

const LFCTA = ({ label = 'Continue', onClick }) => (
  <div style={{ position: 'relative', zIndex: 2, padding: '0 29px 34px', flexShrink: 0 }}>
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
      background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600,
      fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em',
    }}>{label}</button>
  </div>
);

// ── one page ─────────────────────────────────────────────────────────
function LFPage({ index, page, onBack, onClose, onNext }) {
  const full = !!page.img;
  const lightVars = full ? { '--ink': '#F5F4F1', '--ink2': 'rgba(245,244,241,0.72)', '--fill': '#F5F4F1', '--on-fill': '#131313', '--soft2': 'rgba(245,244,241,0.3)' } : null;

  // title page
  if (page.kind === 'title') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <LFTopBar index={index} onBack={onBack} onClose={onClose} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
          <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11, letterSpacing: '0.24em', textIndent: '0.24em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Ground I · Lesson IV</div>
          <span aria-hidden="true" className="onb-rise" style={{ display: 'block', width: 40, height: 1.5, background: 'var(--ink)', margin: '18px 0 22px' }} />
          <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 36, lineHeight: 1.14, letterSpacing: '0.005em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>Riding out a craving</h1>
          <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', marginTop: 18 }}>Three minutes</div>
        </div>
        <LFCTA label="Begin" onClick={onNext} />
      </div>
    );
  }

  // done page
  if (page.kind === 'done') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <LFTopBar index={index} onBack={onBack} onClose={onClose} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
          <div className="o3-stamp" style={{ display: 'flex', justifyContent: 'center' }}>
            <Laurel size={46} color="var(--ink)" />
          </div>
          <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 33, lineHeight: 1.16, color: 'var(--ink)', margin: '24px 0 0' }}>Lesson IV, ridden.</h1>
          <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', marginTop: 16 }}>Ground I · V of XX</div>
        </div>
        <LFCTA label="Back to Today" onClick={onNext} />
      </div>
    );
  }

  // idea pages — paper with a vignette, or a full-bleed image beat
  return (
    <div style={{ position: 'absolute', inset: 0, background: full ? '#0B0B0C' : 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(lightVars || {}) }}>
      {full ? (
        <React.Fragment>
          <img src={page.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,8,10,0.55) 0%, rgba(7,8,10,0.1) 30%, rgba(7,8,10,0.16) 56%, rgba(7,8,10,0.72) 100%)' }} />
        </React.Fragment>
      ) : null}
      <LFTopBar index={index} onBack={onBack} onClose={onClose} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: full ? 'flex-end' : 'center', padding: '0 34px 0', textAlign: 'center' }}>
        {!full && page.vignette ? (
          <div className="ci-breathe" style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
            <svg width="300" height="170" viewBox="0 0 320 180" fill="none" style={{ display: 'block', overflow: 'visible' }}>
              <UrgeVignette stage={page.vignette} />
            </svg>
          </div>
        ) : null}
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 31, lineHeight: 1.16, letterSpacing: '0.005em', color: 'var(--ink)', margin: '0 auto', maxWidth: 300, textWrap: 'balance' }}>{page.title}</h1>
        {page.sub ? (
          <p className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, lineHeight: 1.55, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 270, textWrap: 'pretty' }}>{page.sub}</p>
        ) : null}
        <div style={{ height: full ? 26 : 0 }} />
      </div>
      <LFCTA onClick={onNext} />
    </div>
  );
}

// ── the flow ─────────────────────────────────────────────────────────
function LessonFlow({ start = 0 }) {
  const [i, setI] = lfState(start);
  const back = () => setI(Math.max(0, i - 1));
  const next = () => setI(i + 1 < LF_PAGES.length ? i + 1 : 0);
  return <LFPage key={i} index={i} page={LF_PAGES[i]} onBack={back} onClose={() => setI(0)} onNext={next} />;
}

// ── static boards ────────────────────────────────────────────────────
const LessonPgTitle = () => <LessonFlow start={0} />;
const LessonPgIdea = () => <LessonFlow start={1} />;
const LessonPgImage = () => <LessonFlow start={2} />;
const LessonPgName = () => <LessonFlow start={3} />;
const LessonPgCalm = () => <LessonFlow start={5} />;
const LessonPgDone = () => <LessonFlow start={6} />;

Object.assign(window, { LessonFlow, LessonPgTitle, LessonPgIdea, LessonPgImage, LessonPgName, LessonPgCalm, LessonPgDone });
