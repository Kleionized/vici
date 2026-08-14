// screens-worlds.jsx — the journey overview LIST + immersive per-world HUB.
// Paper daylight system: the sea-to-summit metaphor stays, redrawn as a
// warm, ink-toned terrain map instead of a night sky. Pairs with
// screens-worlds-art.jsx (WORLDS / SIDE / WorldArt / wa — wa() is neutral).

const { useState: wState } = React;

// ── the overview: an itinerary of worlds, sea to summit ─────────────
// Each world is a large card led by its full faceted landscape; state
// lives in the ink (crossed stamps, progress, ghosted art) rather than
// a game map. Cards open the same per-world hubs.

const WORLD_ORDER_ALL = [...WORLDS];
// week/ground numerals — the campaign counts in Roman, app-wide
const W_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// vertical focus of the 402×300 art inside each card's crop, per world (px)
const ART_FOCUS = {
  shore: -58, sailing: -44, deep: -40, island: -46, base: -46, climb: -42,
  cave: -40, higher: -44, clouds: -38, summit: -52, curio: -42, help: -42,
};

function WorldCardArt({ w, height, ghost = false, children }) {
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', background: '#EFECE1' }}>
      <div className="wla" style={{
        position: 'absolute', left: 0, right: 0, top: ART_FOCUS[w.key] != null ? ART_FOCUS[w.key] : -46,
        filter: ghost ? 'grayscale(0.55) contrast(0.94)' : 'none',
        opacity: ghost ? 0.42 : 1,
      }}>
        <WorldArt scene={w.key} hue={w.hue} w={402} h={300} />
      </div>
      {/* settle the art into the paper with a whisper of an inner edge */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'none', pointerEvents: 'none' }} />
      {children}
    </div>
  );
}

// the state chip that leads each card's text row
function WorldStateChip({ w }) {
  const st = w.state;
  if (st === 'done') {
    return (
      <span style={{ width: 36, height: 36, borderRadius: 9999, flexShrink: 0, background: 'var(--fill)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--on-fill)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    );
  }
  if (st === 'locked') {
    return (
      <span style={{ width: 36, height: 36, borderRadius: 9999, flexShrink: 0, background: 'var(--soft)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--ink3)" strokeWidth="2" /><path d="M8 11V8a4 4 0 018 0v3" stroke="var(--ink3)" strokeWidth="2" /></svg>
      </span>
    );
  }
  // current / open — numbered, ringed
  return (
    <span className="tnum" style={{ width: 36, height: 36, borderRadius: 9999, flexShrink: 0, background: 'var(--card)', boxShadow: 'inset 0 0 0 2px var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{w.n}</span>
  );
}

// one leg of the journey — a big illustrated card
function WorldListCard({ w, prevName, onOpen, artHeight = 148 }) {
  const cur = w.state === 'current';
  const locked = w.state === 'locked';
  const done = w.state === 'done';
  const pct = cur ? (w.done || 0) / w.count : done ? 1 : 0;
  return (
    <button onClick={() => onOpen(w.key)} className="tl-press-soft" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      background: 'var(--card)', borderRadius: 20, overflow: 'hidden', padding: 0,
      boxShadow: 'none',
    }}>
      <WorldCardArt w={w} height={cur ? 176 : artHeight} ghost={locked}>
        {/* world eyebrow, frosted onto the art */}
        <span className="tl-glass" style={{ position: 'absolute', top: 12, left: 12, borderRadius: 9999, padding: '5px 11px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink2)', boxShadow: 'none' }}>
          Ground {W_ROMAN[w.n - 1]} of X
        </span>
        {done ? (
          <span style={{ position: 'absolute', top: 14, right: 12, transform: 'rotate(8deg)', border: '2.2px solid rgba(59,59,51,0.65)', borderRadius: 9, padding: '5px 10px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.15em', color: 'rgba(59,59,51,0.75)', mixBlendMode: 'multiply', background: '#F7F6F2' }}>CROSSED</span>
        ) : null}
        {locked ? (
          <span className="tl-glass" style={{ position: 'absolute', bottom: 12, right: 12, borderRadius: 9999, padding: '5px 11px', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink2)', boxShadow: 'none' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--ink2)" strokeWidth="2.4" /><path d="M8 11V8a4 4 0 018 0v3" stroke="var(--ink2)" strokeWidth="2.4" /></svg>
            After {prevName}
          </span>
        ) : null}
      </WorldCardArt>

      <div style={{ padding: '15px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <WorldStateChip w={w} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20.5, letterSpacing: '0.005em', color: locked ? 'var(--ink2)' : 'var(--ink)', lineHeight: 1.12 }}>{w.name}</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink3)', marginTop: 4 }}>{w.sub}</div>
          </div>
          <div className="tnum" style={{ flexShrink: 0, textAlign: 'right', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12, color: 'var(--ink3)', lineHeight: 1.35 }}>
            {w.count} lessons{w.mins ? <React.Fragment><br />~{w.mins} min each</React.Fragment> : null}
          </div>
        </div>
        {cur ? (
          <div style={{ marginTop: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 5, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ width: `${Math.max(4, pct * 100)}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
              </div>
              <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)', flexShrink: 0 }}>{w.done || 0} of {w.count}</span>
            </div>
            <div className="tl-press" style={{
              marginTop: 14, borderRadius: 9999, padding: '13px 20px', textAlign: 'center',
              background: 'var(--fill)', color: 'var(--on-fill)',
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14.5,
              boxShadow: 'none',
              letterSpacing: '0.01em',
            }}>Continue · lesson {(w.done || 0) + 1}</div>
          </div>
        ) : null}
      </div>
    </button>
  );
}

// dotted leg between cards — the path, quieted to punctuation
function LegDots() {
  return (
    <div aria-hidden style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '9px 0' }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 3.5, height: 3.5, borderRadius: 9999, background: 'var(--ink4)', opacity: 0.75 - i * 0.18 }} />)}
    </div>
  );
}

// side quests — smaller companions at the foot of the list
function SideQuestCard({ w, onOpen }) {
  return (
    <button onClick={() => onOpen(w.key)} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
      background: 'var(--card)', borderRadius: 20, overflow: 'hidden',
      boxShadow: 'none',
    }}>
      <WorldCardArt w={w} height={88} />
      <div style={{ padding: '12px 14px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
            {w.crisis
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3L12 3z" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" /><path d="M12 10v4M12 17v.5" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="var(--ink)" strokeWidth="2.2" /><path d="M12 8.5v7M8.5 12h7" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" /></svg>}
          </span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, letterSpacing: 'normal', color: 'var(--ink)', lineHeight: 1.15 }}>{w.name.split(' & ')[0]}</span>
        </div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink3)', marginTop: 4 }}>{w.sub}</div>
      </div>
    </button>
  );
}

// ── 1 · the overview LIST ───────────────────────────────────────────
function WorldMapScreen({ onOpen = () => {} }) {
  const lessonsDone = WORLDS.reduce((n, w) => n + (w.state === 'done' ? w.count : w.done || 0), 0);
  const lessonsAll = WORLDS.reduce((n, w) => n + w.count, 0);
  const curIdx = Math.max(0, WORLDS.findIndex((w) => w.state === 'current'));
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflow: 'hidden', fontFamily: 'var(--font)' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '64px 29px 128px' }}>
        {/* header */}
        <div style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 8 }}>Your journey</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '0.01em', color: 'var(--ink)', margin: '8px 0 0' }}>The campaign</h1>
        <p style={{ fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--ink2)', margin: '10px 0 0', maxWidth: 300, textWrap: 'pretty' }}>
          Ten grounds between the landing and the triumph. Taken at your pace — and kept.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 26px' }}>
          <div style={{ flex: 1, height: 4.5, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
            <div style={{ width: `${Math.max(3, (lessonsDone / lessonsAll) * 100)}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
          </div>
          <span className="tnum" style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)', flexShrink: 0 }}>Ground {W_ROMAN[curIdx]} of X · {lessonsDone} lessons in</span>
        </div>

        {/* the worlds, shore first */}
        {WORLDS.map((w, i) => (
          <React.Fragment key={w.key}>
            {i > 0 ? <LegDots /> : null}
            <WorldListCard w={w} prevName={i > 0 ? WORLDS[i - 1].name : ''} onOpen={onOpen}
              artHeight={w.state === 'locked' ? 118 : 148} />
          </React.Fragment>
        ))}

        {/* side quests */}
        <div style={{ margin: '38px 0 12px' }}>
          <SectionLabel>Off the path</SectionLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SIDE.map((w) => <SideQuestCard key={w.key} w={w} onOpen={onOpen} />)}
        </div>
      </div>

      {/* glass tab bar — this is the Journey tab's root */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6 }}><TabBar active="journey" /></div>
    </div>
  );
}

// ── back chrome shared by hubs ──────────────────────────────────────
function HubChrome({ onBack, index, total, hue }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 29px 0' }}>
      <button onClick={onBack} className="tl-press tl-glass" style={{ appearance: 'none', width: 38, height: 38, borderRadius: 9999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {total ? (
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === index ? 20 : 6, height: 6, borderRadius: 9999, background: i <= index ? 'var(--fill)' : 'var(--soft2)', transition: 'width .25s ease' }} />
          ))}
        </div>
      ) : <div />}
      <div style={{ width: 38 }} />
    </div>
  );
}

// ── lesson presentation: a timeline rail + cards carrying illustration tiles ──
const LESSON_TYPES = ['Article', 'Practice', 'Article', 'Practice', 'Article', 'Practice', 'Article', 'Practice', 'Article'];

function lessonGlyph(i, color) {
  const set = [Glyph.moon, Glyph.wave, Glyph.star, Glyph.anchor, Glyph.sun, Glyph.leaf, Glyph.spark, Glyph.heart, Glyph.book, Glyph.compass];
  return set[i % set.length](color);
}

// the illustration tile at a card's right — a soft paper chip with a
// flat duotone glyph in the home icon greys, contained inside the card
function LessonTile({ i, hue, locked, dark = false }) {
  return (
    <div style={{
      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
      width: 72, height: 72, borderRadius: 18,
      background: dark ? 'rgba(245,244,241,0.1)' : 'var(--soft)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ display: 'inline-flex', width: 34, height: 34 }}>
        <GIcon el={locked ? Glyph.lock('var(--ink4)') : lessonGlyph(i, dark ? '#F5F4F1' : '#4A4A42')} size={34} />
      </span>
    </div>
  );
}

// one timeline row: a rail (continuous line + state node) on the left, an illustrated lesson card on the right
function LessonCard({ i, title, mins, type, state, hue, last, topAccent, bottomAccent }) {
  const accent = 'var(--fill)';
  const done = state === 'done', cur = state === 'current', locked = state === 'locked', open = state === 'open' || state === 'avail';
  const RAIL_X = 30, NODE_C = 58, lineGray = 'var(--line)';
  const nodeSz = (done || cur) ? 30 : 22;
  return (
    <div style={{ position: 'relative', height: last ? 100 : 112 }}>
      {/* connector */}
      <div style={{ position: 'absolute', left: RAIL_X, top: 0, height: NODE_C, width: 2.5, transform: 'translateX(-50%)', background: topAccent ? accent : lineGray }} />
      {!last && <div style={{ position: 'absolute', left: RAIL_X, top: NODE_C, bottom: 0, width: 2.5, transform: 'translateX(-50%)', background: bottomAccent ? accent : lineGray }} />}
      {/* state node */}
      <div style={{
        position: 'absolute', left: RAIL_X, top: NODE_C, transform: 'translate(-50%,-50%)',
        width: nodeSz, height: nodeSz, borderRadius: 9999, zIndex: 1,
        background: done ? 'var(--fill)' : 'var(--card)',
        border: done ? 'none' : `2.5px solid ${cur || open ? accent : 'var(--line)'}`,
        opacity: locked ? 0.7 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'none',
      }}>
        {done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--on-fill)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        {open && !cur && <span style={{ width: 7, height: 7, borderRadius: 9999, background: accent }} />}
      </div>
      {/* card — the current lesson is the home screen's dark Next-lesson surface */}
      <div className={locked ? undefined : 'tl-press-soft'} style={{
        position: 'absolute', left: 68, right: 0, top: 12, height: 92,
        borderRadius: 20, overflow: 'hidden', cursor: locked ? 'default' : 'pointer',
        background: cur ? '#131313' : 'var(--card)',
        border: 'none',
        opacity: locked ? 0.5 : 1,
        boxShadow: 'none',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ padding: '0 96px 0 20px', minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: cur ? 600 : 400, fontSize: cur ? 10.5 : 13, letterSpacing: cur ? '0.2em' : 'normal', textTransform: cur ? 'uppercase' : 'none', color: cur ? 'rgba(245,244,241,0.62)' : 'var(--ink3)' }}>{cur ? 'Next lesson' : `${type} · ${mins} min`}</div>
          <div style={{ fontFamily: cur ? 'var(--serif)' : 'var(--font)', fontWeight: 500, fontSize: cur ? 18 : 15.5, color: cur ? '#F5F4F1' : 'var(--ink)', letterSpacing: cur ? '0.005em' : '-0.005em', marginTop: 5, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
          {cur ? <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'rgba(245,244,241,0.55)', marginTop: 5 }}>{type} · {mins} min</div> : null}
        </div>
        <LessonTile i={i} hue={hue} locked={locked} dark={cur} />
      </div>
    </div>
  );
}

// ── 2 · the immersive per-world HUB ─────────────────────────────────
// the section header that opens a world's timeline (date-style meta · title · subtitle)
function SectionHeaderRow({ meta, title, sub, reached, hue, first, topAccent, bottomAccent }) {
  const accent = 'var(--fill)';
  const RAIL_X = 30, lineGray = 'var(--line)';
  const gapTop = first ? 0 : 40;
  const NODE_C = gapTop + 30;
  return (
    <div style={{ position: 'relative', minHeight: NODE_C + 94 }}>
      {!first && <div style={{ position: 'absolute', left: 68, right: 0, top: 20, height: 1, background: 'var(--line)' }} />}
      {!first && <div style={{ position: 'absolute', left: RAIL_X, top: 0, height: NODE_C, width: 2.5, transform: 'translateX(-50%)', background: topAccent ? accent : lineGray }} />}
      <div style={{ position: 'absolute', left: RAIL_X, top: NODE_C, bottom: 0, width: 2.5, transform: 'translateX(-50%)', background: bottomAccent ? accent : lineGray }} />
      <div style={{
        position: 'absolute', left: RAIL_X, top: NODE_C, transform: 'translate(-50%,-50%)',
        width: 30, height: 30, borderRadius: 9999, zIndex: 1,
        background: reached ? 'var(--fill)' : 'var(--card)',
        border: reached ? 'none' : '2.5px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'none',
      }}>
        {reached && <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="var(--on-fill)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <div style={{ marginLeft: 68, paddingTop: gapTop + 16, paddingRight: 6 }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{meta}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, letterSpacing: '0.01em', lineHeight: 1.14, color: 'var(--ink)', margin: '8px 0 0', textWrap: 'balance' }}>{title}</h2>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, color: 'var(--ink2)', marginTop: 8, lineHeight: 1.4, textWrap: 'pretty' }}>{sub}</div>
      </div>
    </div>
  );
}

// the fixed top bar (back · guide title · share) — floats over the kept visualization
function HubHeaderBar({ onBack, title, eyebrow }) {
  const btn = { appearance: 'none', border: 'none', cursor: 'pointer', width: 42, height: 42, borderRadius: 9999, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'none' };
  return (
    <div className="tl-glass" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, paddingTop: 54, paddingBottom: 14, borderBottom: '1px solid var(--line)', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
        <button onClick={onBack} className="tl-press" style={btn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 8px' }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 3 }}>{eyebrow}</div>
        </div>
        <button className="tl-press" style={btn} aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15V4.2M12 4.2 8 8.2M12 4.2l4 4" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6" stroke="var(--ink)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

function WorldHubScreen({ world, onBack = () => {}, onOpen = () => {} }) {
  const w = world;
  const sections = w.sections || [{ title: w.name, sub: w.sub, lessons: w.lessons || [] }];
  const total = sections.reduce((n, s) => n + s.lessons.length, 0);
  const extra = Math.max(0, w.count - total);
  const doneIdx = w.done || 0;
  const currentG = w.state === 'locked' ? -1 : w.state === 'done' ? total : (w.crisis || w.state === 'open') ? 0 : doneIdx;
  const lessonState = (g) => {
    if (w.crisis) return g === 0 ? 'current' : 'avail';
    if (w.state === 'current') return g < doneIdx ? 'done' : g === doneIdx ? 'current' : 'locked';
    if (w.state === 'open') return g === 0 ? 'current' : 'locked';
    return 'locked';
  };

  // flatten the sub-sections into one ordered list of rail nodes (headers + lessons)
  const nodes = [];
  let g = 0;
  sections.forEach((sec, si) => {
    nodes.push({ kind: 'section', si, first: si === 0, title: sec.title, sub: sec.sub, reached: g <= currentG });
    sec.lessons.forEach((t, li) => {
      nodes.push({ kind: 'lesson', gi: g, t, state: lessonState(g), reached: g <= currentG });
      g += 1;
    });
  });
  const lastIdx = nodes.length - 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflow: 'hidden', fontFamily: 'var(--font)' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        {/* the kept visualization on top — clears the header bar, then
            settles into the page with a short fade */}
        <div style={{ position: 'relative', height: 268, overflow: 'hidden' }}>
          <WorldArt scene={w.key} hue={w.hue} w={402} h={300} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0) 0%, rgba(247,245,240,0) 56%, rgba(247,245,240,0.5) 80%, var(--bg) 98%)' }} />
        </div>

        {/* the timeline of dated sub-sections */}
        <div style={{ position: 'relative', padding: '26px 29px 44px 0' }}>
          {nodes.map((nd, idx) => {
            const topAccent = nd.reached;
            const bottomAccent = idx < lastIdx ? nodes[idx + 1].reached : false;
            if (nd.kind === 'section') {
              return (
                <SectionHeaderRow key={`s${nd.si}`} meta={`Part ${nd.si + 1}`} title={nd.title} sub={nd.sub}
                  reached={nd.reached} hue={w.hue} first={nd.first} topAccent={topAccent} bottomAccent={bottomAccent} />
              );
            }
            const last = idx === lastIdx && extra === 0;
            return (
              <LessonCard key={`l${nd.gi}`} i={nd.gi} title={nd.t} mins={w.mins || 5} type={LESSON_TYPES[nd.gi % LESSON_TYPES.length]}
                state={nd.state} hue={w.hue} last={last} topAccent={topAccent} bottomAccent={bottomAccent} />
            );
          })}
          {extra > 0 && (
            <div style={{ position: 'relative', height: 54 }}>
              <div style={{ position: 'absolute', left: 30, top: 0, height: 27, width: 2.5, transform: 'translateX(-50%)', background: 'var(--line)' }} />
              <div style={{ position: 'absolute', left: 30, top: 27, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: 9999, background: 'var(--soft2)' }} />
              <div style={{ position: 'absolute', left: 68, top: 27, transform: 'translateY(-50%)', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink3)' }}>
                + {extra} more {w.crisis ? 'resource' : 'lesson'}{extra > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      <HubHeaderBar onBack={onBack} title={w.name} eyebrow={w.side ? 'Side quest' : `Ground ${W_ROMAN[w.n - 1]} of X`} />
    </div>
  );
}

// ── live flow: map ⇄ hub ────────────────────────────────────────────
function WorldsJourney() {
  const [openKey, setOpen] = wState(null);
  if (openKey) return <WorldHubScreen world={worldByKey(openKey)} onBack={() => setOpen(null)} />;
  return <WorldMapScreen onOpen={(k) => setOpen(k)} />;
}

// per-world hub components for the canvas boards
const HUBS = {};
ALL_WORLDS.forEach((w) => { HUBS['Hub_' + w.key] = () => <WorldHubScreen world={w} />; });

Object.assign(window, { WorldMapScreen, WorldHubScreen, WorldsJourney, ...HUBS });
