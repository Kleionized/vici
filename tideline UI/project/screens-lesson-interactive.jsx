// screens-lesson-interactive.jsx — VICI · the interactive lesson pages.
// Five page kinds join the reader's display pages: teach (one body of
// text with a bold lead, the button restates the takeaway), check (a
// statement card, Not me / That's me), grid (pick all that apply),
// chain (pair the day's move with an existing habit), collect (a recap
// built from the answers). Answers live in one object `a`; branched
// copy is a function of it — the same convention as reflect(label) and
// o3Inputs(a) in onboarding v3. No page is a fake choice: the scouts
// claimed name the branched teach and the collect quote, the grid picks
// choose the early move, the anchor names the pairing.
//
// Pilot content: Day LXXXVI, "The early warnings" (Track leading
// indicators, crosscutting.md). The source day's @@ACTION and
// @@REFLECTION lines ride along verbatim in LESSON_D86.
//
// Exports: ILessonFlow, LESSON_D86 + one static board per page kind.

const { useState: ilState } = React;

// ── the day's fixed vocabulary ───────────────────────────────────────
const IL_SCOUTS = [
  { id: 'scrolling', term: 'Restless scrolling', asin: 'circling the same three apps, wanting none of them', quote: 'restless scrolling' },
  { id: 'sleep',     term: 'Putting off sleep',  asin: 'tired at eleven, still up at one, with nothing to show for it', quote: 'putting off sleep' },
  { id: 'fine',      term: 'Fake-fine answers',  asin: 'someone asks how you are and “fine” comes out flat', quote: 'fake-fine answers' },
  { id: 'alone',     term: 'Planning to be alone', asin: 'quietly arranging an evening where nobody will be around', quote: 'planning to be alone' },
];
const IL_UNDER = ['Lonely', 'Wound up', 'Bored', 'Low', 'Irritable', 'Numb', 'Tired', 'Out of place', 'Hungry'];
const IL_ANCHORS = [
  { label: 'Morning coffee',      short: 'morning coffee',     icon: 'cup' },
  { label: 'Brushing your teeth', short: 'brushing your teeth', icon: 'brush' },
  { label: 'The commute',         short: 'the commute',        icon: 'tram' },
  { label: 'Winding down in bed', short: 'winding down',       icon: 'bed' },
  { label: 'A habit of my own',   short: 'my own habit',       icon: 'spark' },
];

// ── the branches — every one a function of the answers object ────────
function ilClaimed(a) { return IL_SCOUTS.filter((s) => (a.scouts || {})[s.id]); }

// screen 8, sentence 1 ← the first scout claimed
function ilLead(a) {
  const c = ilClaimed(a)[0];
  if (!c) return {
    lead: 'Today’s list didn’t fit, which is fine;',
    rest: 'your scouts exist, they just wear different clothes. For one week, note what shows up in the hour before trouble.',
  };
  return {
    scrolling: { lead: 'For you the wave announces itself as restless scrolling:', rest: 'the same three apps, over and over, wanting none of them.' },
    sleep:     { lead: 'For you the wave announces itself as the stretched night:', rest: 'still up at one with nothing to show for it.' },
    fine:      { lead: 'For you the wave announces itself as the flat “fine”:', rest: 'the answer that closes the conversation.' },
    alone:     { lead: 'For you the wave announces itself as the cleared evening:', rest: 'the plan to be where nobody is.' },
  }[c.id];
}

// screen 8, sentence 2 ← the highest-priority grid pick
function ilMove(a) {
  const u = a.under || [];
  const has = (...xs) => xs.some((x) => u.includes(x));
  if (has('Lonely', 'Out of place')) return 'And since it’s usually loneliness underneath, the early move is contact: one message tonight does more than an hour of resolve at midnight.';
  if (has('Wound up', 'Irritable'))  return 'And since it’s usually a wound-up charge underneath, the early move is to move: a walk drains it faster than gritting your teeth holds it.';
  if (has('Tired', 'Low'))           return 'And since you’re usually running low underneath, the early move is sleep: protect tonight like it’s the whole plan.';
  if (has('Bored', 'Numb'))          return 'And since it’s usually flatness underneath, the early move is shape: give tomorrow one fixed thing with a time and a place.';
  if (has('Hungry'))                 return 'And since it’s often plain hunger underneath, the early move is the boring one: eat properly and re-check.';
  return '';
}

// the collect quote ← every scout claimed
function ilQuote(a) {
  const c = ilClaimed(a).map((s) => s.quote);
  if (!c.length) return 'When one of my scouts shows, the wave is coming, and I go to the tools first.';
  const list = c.length === 1 ? c[0] : c.slice(0, -1).join(', ') + ' or ' + c[c.length - 1];
  return 'If I notice I’m ' + list + ', the wave is coming, and I go to the tools first.';
}

// the chain CTA ← the anchor picked
function ilPaired(a) {
  const hit = IL_ANCHORS.find((x) => x.label === a.anchor);
  return hit ? 'Paired with ' + hit.short : 'Pick one to pair';
}

// ── the day ──────────────────────────────────────────────────────────
const LESSON_D86 = {
  day: 86,
  title: 'The early warnings',
  eyebrow: 'Ground VII · Lesson II',
  minutes: 'Two minutes',
  // carried verbatim from crosscutting.md, Day 86
  action: 'Track your leading indicators (sleep, mood, connection, structure) daily, and watch for storms forming.',
  reflection: 'Pick your three most predictive leading indicators (e.g. sleep, connection, structure). Commit to glancing at them daily, and name what you’ll do when you see a storm forming.',
  pages: [
    { kind: 'title' },
    { kind: 'teach', vignette: 'scouts', lead: 'The wave never ambushes.', rest: 'It sends scouts first: restlessness, a reach for the phone, a door quietly closed. Learn your scouts and the wave loses its surprise.', cta: 'Scouts before waves' },
    { kind: 'teach', vignette: 'ahead', lead: 'A streak only reports the past.', rest: 'How you slept, what the day took, whether you’ve seen anyone: those run ahead of a slip. They’re called leading indicators, and they warn you while there’s still time to act.', cta: 'Watch what runs ahead' },
    { kind: 'check', scout: 0 },
    { kind: 'check', scout: 1 },
    { kind: 'check', scout: 2 },
    { kind: 'check', scout: 3 },
    { kind: 'grid', title: 'And underneath them, usually?', sub: 'Pick every one that rings true.', cta: 'Continue' },
    { kind: 'teach', branch: true, cta: 'Early beats strong' },
    { kind: 'chain', eyebrow: 'While...', title: 'Chain the scout check to something you already do.', sub: 'Two seconds, once a day: any scouts about?' },
    { kind: 'collect' },
    { kind: 'done' },
  ],
};

// demo answers for the static boards — one plausible man
const IL_DEMO = { scouts: { scrolling: true, sleep: true, fine: false, alone: false }, under: ['Lonely', 'Wound up', 'Tired'], anchor: 'Morning coffee' };
const IL_FRESH = () => ({ scouts: {}, under: [], anchor: null });

// ── chrome: top bar (back · adaptive segments · close) + CTA ─────────
function ILTopBar({ index, total, onBack, onClose }) {
  return (
    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', padding: '60px 29px 0', gap: 12, flexShrink: 0 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', flex: '0 0 auto' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 5, width: '100%', maxWidth: 230 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 26, height: 4, borderRadius: 9999, background: i <= index ? 'var(--fill)' : 'var(--soft2)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>
      <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex', flex: '0 0 auto' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

const ILCTA = ({ label = 'Continue', enabled = true, onClick }) => (
  <div style={{ position: 'relative', zIndex: 2, padding: '0 29px 34px', flexShrink: 0 }}>
    <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default', width: '100%',
      background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600,
      fontSize: 15.5, borderRadius: 9999, padding: '16px 24px', letterSpacing: '0.01em',
      opacity: enabled ? 1 : 0.28, transition: 'opacity .25s ease',
    }}>{label}</button>
  </div>
);

const ILFrame = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
);

// ── vignettes — faceted paper, no gradients ──────────────────────────
function ILVignette({ stage }) {
  if (stage === 'ahead') {
    // a dotted path running ahead of the walker to a small flag
    return (
      <svg width="280" height="130" viewBox="0 0 300 140" fill="none" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M14 112 L286 112" stroke="#DDD9C7" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 108 C 90 96, 150 88, 236 62" stroke="#C5C0AA" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 12" />
        <circle cx="30" cy="108" r="5" fill="#B4AF98" />
        <path d="M248 58 v-30" stroke="#B4AF98" strokeWidth="3" strokeLinecap="round" />
        <path d="M248 28 l22 7 -22 7 z" fill="#DDD9C7" />
        <path d="M248 28 l22 7 -11 3.5 z" fill="#C5C0AA" />
      </svg>
    );
  }
  // 'scouts' — the calm sea band, two pennants posted at the waterline
  return (
    <svg width="280" height="130" viewBox="0 0 300 140" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M22 78 C 70 70, 110 84, 150 78 S 240 70, 278 78" stroke="#DDD9C7" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M14 96 L286 96 L280 122 L20 122 Z" fill="#EDEAE0" />
      <path d="M14 96 L286 96 L285 106 L15 106 Z" fill="#E1DDCD" />
      <path d="M92 92 v-38" stroke="#B4AF98" strokeWidth="3" strokeLinecap="round" />
      <path d="M92 54 l20 6.5 -20 6.5 z" fill="#C5C0AA" />
      <path d="M206 92 v-30" stroke="#B4AF98" strokeWidth="3" strokeLinecap="round" />
      <path d="M206 62 l17 5.5 -17 5.5 z" fill="#DDD9C7" />
      <circle cx="52" cy="112" r="2.6" fill="#C5C0AA" />
      <circle cx="246" cy="114" r="2.6" fill="#C5C0AA" />
    </svg>
  );
}

// small stroke icons for the chain rows
function ILIcon({ name, c = 'var(--ink2)' }) {
  const m = {
    cup: <g><path d="M6 8h11l-1 8.5A3.6 3.6 0 0 1 12.4 20h-1.8A3.6 3.6 0 0 1 7 16.5z" /><path d="M17 10h1.6a2.6 2.6 0 0 1 0 5.2H16.4M8.5 4.6c0 1 1.4 1 1.4 2M12 4.6c0 1 1.4 1 1.4 2" /></g>,
    brush: <g><path d="M5 19 16.6 7.4a2.4 2.4 0 0 1 3.4 3.4L8.4 22.4" /><path d="M5 19l3.4 3.4M13.5 10.5l3.4 3.4" /></g>,
    tram: <g><rect x="6" y="4.5" width="12" height="13" rx="2.6" /><path d="M6 10.5h12M9.5 21l-1.5 1.8M14.5 21l1.5 1.8M9 17.5h.01M15 17.5h.01" /></g>,
    bed: <g><path d="M3.5 18.5v-8M3.5 14h17v4.5" /><path d="M3.5 14V8.5h6.5c2.4 0 3.8 1.3 3.8 3.3V14" /><circle cx="7" cy="11" r="1.2" /></g>,
    spark: <g><path d="M12 4v4.2M12 15.8V20M4 12h4.2M15.8 12H20M6.6 6.6l2.6 2.6M14.8 14.8l2.6 2.6M17.4 6.6l-2.6 2.6M9.2 14.8l-2.6 2.6" /></g>,
  };
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{m[name]}</svg>;
}

// ── page kinds ───────────────────────────────────────────────────────
function ILTeach({ page, a }) {
  const b = page.branch ? ilLead(a) : { lead: page.lead, rest: page.rest };
  const move = page.branch ? ilMove(a) : '';
  return (
    <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
      {page.vignette ? (
        <div className="ci-breathe" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <ILVignette stage={page.vignette} />
        </div>
      ) : null}
      <p className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 20, lineHeight: 1.5, letterSpacing: '-0.005em', color: 'var(--ink2)', margin: '0 auto', maxWidth: 302, textWrap: 'pretty' }}>
        <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{b.lead}</b> {b.rest}{move ? ' ' + move : ''}
      </p>
    </div>
  );
}

function ILCheck({ page, index, onAnswer }) {
  const s = IL_SCOUTS[page.scout];
  const numerals = ['I', 'II', 'III', 'IV'];
  const Btn = ({ yes }) => (
    <button onClick={() => onAnswer(s.id, yes)} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', flex: 1, background: 'var(--card)', borderRadius: 20,
      padding: '17px 0 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 9999, border: '2.2px solid ' + (yes ? 'var(--fill)' : 'var(--soft2)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {yes
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--ink2)" strokeWidth="2.5" strokeLinecap="round" /></svg>}
      </div>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, color: 'var(--ink)' }}>{yes ? 'That’s me' : 'Not me'}</span>
    </button>
  );
  return (
    <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '18px 29px 0' }}>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)', textAlign: 'center' }}>Self-check · {numerals[page.scout]} of IV</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 25, lineHeight: 1.22, color: 'var(--ink)', margin: '14px auto 0', maxWidth: 300, textAlign: 'center', textWrap: 'balance' }}>In the hours before a slip, I’m sometimes...</h1>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 0' }}>
        <div style={{ background: 'var(--card)', borderRadius: 20, padding: '38px 26px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.12, color: 'var(--ink)', textWrap: 'balance' }}>{s.term}</div>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink2)', margin: '13px auto 0', maxWidth: 250, textWrap: 'pretty' }}>As in: {s.asin}.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 13, paddingBottom: 34, flexShrink: 0 }}>
        <Btn yes={false} />
        <Btn yes={true} />
      </div>
    </div>
  );
}

function ILGrid({ page, a, setA, onNext }) {
  const sel = a.under || [];
  const toggle = (w) => setA({ ...a, under: sel.includes(w) ? sel.filter((x) => x !== w) : [...sel, w] });
  return (
    <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '18px 29px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.2, color: 'var(--ink)', margin: '10px auto 0', maxWidth: 280, textAlign: 'center', textWrap: 'balance' }}>{page.title}</h1>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink3)', margin: '10px auto 0', textAlign: 'center' }}>{page.sub}</p>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11, width: '100%' }}>
          {IL_UNDER.map((w) => {
            const on = sel.includes(w);
            return (
              <button key={w} onClick={() => toggle(w)} className="tl-press" style={{
                appearance: 'none', border: 'none', cursor: 'pointer', minHeight: 72, borderRadius: 16,
                background: on ? 'var(--fill)' : 'var(--card)', color: on ? 'var(--on-fill)' : 'var(--ink)',
                fontFamily: 'var(--font)', fontWeight: on ? 600 : 500, fontSize: 13.5, lineHeight: 1.25,
                padding: '10px 8px', textAlign: 'center', transition: 'background .15s, color .15s',
              }}>{w}</button>
            );
          })}
        </div>
      </div>
      <ILCTA label={page.cta} enabled={sel.length > 0} onClick={onNext} />
    </div>
  );
}

function ILChain({ page, a, setA }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '18px 29px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, lineHeight: 1.22, color: 'var(--ink)', margin: '10px auto 0', maxWidth: 300, textAlign: 'center', textWrap: 'balance' }}>{page.title}</h1>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink3)', margin: '10px auto 0', textAlign: 'center', maxWidth: 260 }}>{page.sub}</p>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)', textAlign: 'center', marginTop: 20 }}>{page.eyebrow}</div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, paddingTop: 12 }}>
        {IL_ANCHORS.map((r) => {
          const on = a.anchor === r.label;
          return (
            <button key={r.label} onClick={() => setA({ ...a, anchor: r.label })} className="tl-press" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 18,
              background: 'var(--card)', boxShadow: on ? 'inset 0 0 0 1.8px var(--ink)' : 'none',
            }}>
              <span style={{ width: 38, height: 38, borderRadius: 9999, background: on ? 'var(--fill)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
                <ILIcon name={r.icon} c={on ? 'var(--on-fill)' : 'var(--ink2)'} />
              </span>
              <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, color: 'var(--ink)' }}>{r.label}</span>
              <span style={{ width: 21, height: 21, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '2px solid var(--soft2)', background: on ? 'var(--fill)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on ? <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'var(--on-fill)' }} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ height: 12 }} />
    </div>
  );
}

function ILCollect({ a }) {
  const claimed = ilClaimed(a);
  const under = (a.under || []).map((x) => x.toLowerCase());
  return (
    <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
      <Laurel size={34} color="var(--ink)" />
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 29, lineHeight: 1.16, color: 'var(--ink)', margin: '20px 0 0' }}>Your scouts, on record.</h1>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: 'var(--ink)', margin: '18px auto 0', maxWidth: 290, textWrap: 'pretty' }}>
        “{ilQuote(a)}”
      </p>
      {claimed.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 22, maxWidth: 300 }}>
          {claimed.map((s) => (
            <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink)', background: 'var(--card)', padding: '9px 14px', borderRadius: 9999 }}>
              <span style={{ width: 5.5, height: 5.5, borderRadius: 9999, background: 'var(--ink)' }} />{s.term}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink3)', marginTop: 22 }}>Watching for mine this week.</div>
      )}
      {under.length ? (
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', marginTop: 16 }}>Underneath them, usually: {under.join(', ')}.</div>
      ) : null}
    </div>
  );
}

// ── the flow ─────────────────────────────────────────────────────────
function ILessonFlow({ lesson = LESSON_D86, start = 0, demo = null }) {
  const [i, setI] = ilState(start);
  const [a, setA] = ilState(demo ? demo : IL_FRESH());
  const pages = lesson.pages;
  const page = pages[i];
  const next = () => setI(Math.min(i + 1, pages.length - 1));
  const back = () => setI(Math.max(0, i - 1));
  const reset = () => { setI(start); setA(demo ? demo : IL_FRESH()); };

  // title page
  if (page.kind === 'title') return (
    <ILFrame>
      <ILTopBar index={i} total={pages.length} onBack={back} onClose={reset} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
        <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11, letterSpacing: '0.24em', textIndent: '0.24em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{lesson.eyebrow}</div>
        <span aria-hidden="true" className="onb-rise" style={{ display: 'block', width: 40, height: 1.5, background: 'var(--ink)', margin: '18px 0 22px' }} />
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 36, lineHeight: 1.14, letterSpacing: '0.005em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>{lesson.title}</h1>
        <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', marginTop: 18 }}>{lesson.minutes}</div>
      </div>
      <ILCTA label="Begin" onClick={next} />
    </ILFrame>
  );

  // done page
  if (page.kind === 'done') return (
    <ILFrame>
      <ILTopBar index={i} total={pages.length} onBack={back} onClose={reset} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 34px', textAlign: 'center' }}>
        <div className="o3-stamp" style={{ display: 'flex', justifyContent: 'center' }}>
          <Laurel size={46} color="var(--ink)" />
        </div>
        <h1 className="onb-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 33, lineHeight: 1.16, color: 'var(--ink)', margin: '24px 0 0' }}>Scouts, posted.</h1>
        <div className="onb-rise" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', marginTop: 16 }}>{lesson.eyebrow}</div>
      </div>
      <ILCTA label="Back to Today" onClick={reset} />
    </ILFrame>
  );

  // the five kinds
  return (
    <ILFrame>
      <ILTopBar index={i} total={pages.length} onBack={back} onClose={reset} />
      {page.kind === 'teach' ? (
        <React.Fragment key={i}>
          <ILTeach page={page} a={a} />
          <ILCTA label={page.cta} onClick={next} />
        </React.Fragment>
      ) : null}
      {page.kind === 'check' ? (
        <ILCheck key={i} page={page} index={i}
          onAnswer={(id, yes) => { setA({ ...a, scouts: { ...a.scouts, [id]: yes } }); next(); }} />
      ) : null}
      {page.kind === 'grid' ? <ILGrid key={i} page={page} a={a} setA={setA} onNext={next} /> : null}
      {page.kind === 'chain' ? (
        <React.Fragment key={i}>
          <ILChain page={page} a={a} setA={setA} />
          <ILCTA label={ilPaired(a)} enabled={!!a.anchor} onClick={next} />
        </React.Fragment>
      ) : null}
      {page.kind === 'collect' ? (
        <React.Fragment key={i}>
          <ILCollect a={a} />
          <ILCTA label="Memorised. I’ll know them." onClick={next} />
        </React.Fragment>
      ) : null}
    </ILFrame>
  );
}

// ── static boards ────────────────────────────────────────────────────
const ILPgLive = () => <ILessonFlow />;
const ILPgTeach = () => <ILessonFlow start={1} demo={IL_DEMO} />;
const ILPgChain = () => <ILessonFlow start={9} demo={IL_DEMO} />;
const ILPgCheck = () => <ILessonFlow start={3} demo={IL_DEMO} />;
const ILPgGrid = () => <ILessonFlow start={7} demo={IL_DEMO} />;
const ILPgTeachBranch = () => <ILessonFlow start={8} demo={IL_DEMO} />;
const ILPgCollect = () => <ILessonFlow start={10} demo={IL_DEMO} />;

Object.assign(window, {
  ILessonFlow, LESSON_D86,
  ILPgLive, ILPgTeach, ILPgChain, ILPgCheck, ILPgGrid, ILPgTeachBranch, ILPgCollect,
});
