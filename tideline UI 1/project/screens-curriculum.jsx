// screens-curriculum.jsx — visual lesson screens: Journey hero, Week roadmap, Lesson reader

// 1 ─ Journey: hero current-week card + big title + roadmap copy + scene
function JourneyScreen() {
  return (
    <Shell pad={0} top={0} tab={<TabBar active="weeks" />}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, paddingBottom: 96 }}>
        <div style={{ padding: '60px 29px 0' }}>
          <ScreenHeader pad={0} hue={150} eyebrow="Your roadmap" title="Your journey" />

          <SectionLabel style={{ marginBottom: 12 }}>Current week</SectionLabel>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 196, boxShadow: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><div style={{ marginTop: -52 }}><WorldArt scene="shore" w={402} h={300} /></div></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0.55) 0%, rgba(247,245,240,0.06) 34%, rgba(247,245,240,0.62) 74%, rgba(247,245,240,0.94) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink2)' }}>Week I of XII</div>
                <div className="tl-glass" style={{ width: 30, height: 30, borderRadius: 9999, border: '1.5px solid var(--ink3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, flexShrink: 0 }}>i</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 27, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.05 }}>The first calm</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, color: 'var(--ink2)', marginTop: 3 }}>Build a steady foundation</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
                    <div style={{ width: '20%', height: '100%', background: 'var(--fill)', borderRadius: 9999 }} />
                  </div>
                  <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>20%</span>
                </div>
              </div>
            </div>
          </div>

          <Hero size={40} style={{ margin: '28px 0 10px' }}>The shore</Hero>
          <p style={{ fontFamily: 'var(--font)', fontSize: 14.5, lineHeight: 1.55, fontWeight: 400, color: 'var(--ink2)', margin: 0, textWrap: 'pretty' }}>
            Your roadmap for the next two weeks. You'll learn to notice the pull, ride it out, and come back gently — one small lesson a day.
          </p>
        </div>

        <div style={{ marginTop: 18, flexShrink: 0 }}>
          {Illo.journey('var(--ink)', { w: 402, h: 250, light: 'var(--bg)' })}
        </div>
      </div>
    </Shell>
  );
}

// 2 ─ Week roadmap: spacious editorial lesson list
function WeekRoadmapScreen() {
  const lessons = [
    { title: 'Why it grips you', mins: 4, type: 'Story', state: 'done', excerpt: 'The loop that keeps the habit alive, and where it breaks.' },
    { title: 'The first calm', mins: 5, type: 'Story + practice', state: 'current', excerpt: 'A simple way to create space before the pull takes over.' },
    { title: 'Name the pull', mins: 3, type: 'Practice', state: 'locked', excerpt: 'Put precise words around the feeling so it loses its fog.' },
    { title: 'Ride the wave', mins: 6, type: 'Story + practice', state: 'locked', excerpt: 'Let the urge rise and fall without turning it into an order.' },
    { title: 'Come back gently', mins: 4, type: 'Story', state: 'locked', excerpt: 'Use a lapse as information, then return without punishment.' },
  ];
  const numerals = ['I', 'II', 'III', 'IV', 'V'];
  return (
    <Shell pad={0} top={0}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* photographic banner */}
        <div style={{ position: 'relative', height: 172, flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ marginTop: -40 }}><WorldArt scene="shore" w={402} h={300} /></div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(247,245,240,0.5) 0%, rgba(247,245,240,0.02) 30%, rgba(247,245,240,0.55) 76%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 52, left: 29 }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ position: 'absolute', left: 29, right: 29, bottom: 14 }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink2)', marginBottom: 6 }}>Week I · 1 of 5 done</div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 32, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.0 }}>The first calm</div>
          </div>
        </div>

        <div style={{ padding: '4px 29px 20px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div>
            {lessons.map((lesson, i) => {
                const done = lesson.state === 'done', cur = lesson.state === 'current', locked = lesson.state === 'locked';
                return (
                  <div key={lesson.title} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 0', borderBottom: i < lessons.length - 1 ? '1px solid var(--line)' : 'none', opacity: locked ? 0.55 : 1 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, lineHeight: 1.3, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
                        Lesson {numerals[i]} · {lesson.mins} min · {lesson.type}
                      </div>
                      <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, lineHeight: 1.15, letterSpacing: '0.005em', color: 'var(--ink)', marginTop: 8, textWrap: 'balance' }}>{lesson.title}</div>
                      <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 8, maxWidth: 238, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.excerpt}</div>
                      {cur && <span className="tl-press" style={{ display: 'inline-flex', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11.5, lineHeight: 1, cursor: 'pointer', color: 'var(--on-fill)', background: 'var(--fill)', borderRadius: 9999, padding: '7px 12px', marginTop: 12 }}>Resume</span>}
                    </div>
                    <div style={{ width: 64, height: 64, borderRadius: 18, flexShrink: 0, background: done ? 'var(--fill)' : cur ? 'var(--card)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done ? <GIcon el={Glyph.check('var(--on-fill)', 3)} size={22} />
                        : locked ? <GIcon el={Glyph.lock('var(--ink3)')} size={19} />
                        : <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, color: 'var(--ink)' }}>{numerals[i]}</span>}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Shell>
  );
}

// 3 ─ Lesson reader: series progress + collapse header + serif headline + image section + action dock
function LessonReaderScreen() {
  // local UI glyphs (not in the shared set)
  const chevDown = (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5.5 9l6.5 6.5L18.5 9" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const bookmark = (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 4.6h12a1 1 0 0 1 1 1v14.1a.8.8 0 0 1-1.26.65L12 16.6l-5.74 3.75A.8.8 0 0 1 5 19.7V5.6a1 1 0 0 1 1-1z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>;
  const share = (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15.2V3.6M12 3.6 8.2 7.4M12 3.6l3.8 3.8" stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.2 11.5v7a1.5 1.5 0 0 0 1.5 1.5h10.6a1.5 1.5 0 0 0 1.5-1.5v-7" stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const headphones = (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4.6 13.4v-1.2a7.4 7.4 0 0 1 14.8 0v1.2" stroke={c} strokeWidth="2.1" strokeLinecap="round"/><rect x="3" y="12.8" width="4.4" height="7.2" rx="2.2" fill={c}/><rect x="16.6" y="12.8" width="4.4" height="7.2" rx="2.2" fill={c}/></svg>;
  const penIcon = (c) => <svg width="19" height="19" viewBox="0 0 24 24"><path d="M3.8 20.2 4.9 16 14.9 6l3.1 3.1L8 19.1zM16.3 4.6l1.6-1.6a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3l-1.6 1.6z" fill={c}/></svg>;

  const ActionBtn = ({ icon }) => (
    <div className="tl-press" style={{
      width: 56, height: 56, borderRadius: 9999, cursor: 'pointer',
      background: 'var(--card)', boxShadow: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <GIcon el={icon('var(--ink)')} size={20} />
    </div>
  );

  return (
    <Shell pad={0} top={0}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, padding: '60px 29px 0' }}>
        {/* series progress — dashed, first lesson active */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26, flexShrink: 0 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 9999,
              flex: i === 0 ? 0.5 : 1,
              background: i === 0 ? 'var(--fill)' : 'var(--soft2)',
            }} />
          ))}
        </div>

        {/* collapse control + centered title / eyebrow */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: 50, marginBottom: 20, flexShrink: 0 }}>
          <div className="tl-glass" style={{
            width: 50, height: 50, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1,
            boxShadow: 'none',
          }}>
            <GIcon el={chevDown('var(--ink)')} size={22} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, color: 'var(--ink)', letterSpacing: '-0.012em' }}>Ride the Wave</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 4 }}>Urges · 5 min</div>
          </div>
        </div>

        {/* big serif headline */}
        <Hero size={44} style={{ marginBottom: 20, letterSpacing: '-0.01em', flexShrink: 0 }}>Ride the wave</Hero>

        {/* the maxim — grey quotation mark + serif lede, home's editorial flourish */}
        <div style={{ flexShrink: 0 }}>
          <QuoteMark size={54} style={{ textAlign: 'left', height: 24 }} />
          <p style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 500, fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.003em', color: 'var(--ink)', margin: 0, textWrap: 'pretty' }}>
            An urge is a wave. It rises, builds, and — if you let it — crests and falls on its own.
          </p>
        </div>

        {/* body */}
        <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, fontWeight: 400, color: 'var(--ink2)', margin: '14px 0 0', textWrap: 'pretty', flexShrink: 0 }}>
          The instinct is to fight the water. The way through is to float: notice the pull without acting on it, and let the sea do what the sea always does.
        </p>

        {/* image section — fills the remaining space */}
        <div style={{ flex: 1, minHeight: 190, marginTop: 22, position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><WorldArt scene="deep" w={402} h={300} /></div>
        </div>

        {/* action dock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 2px 8px', flexShrink: 0 }}>
          <ActionBtn icon={bookmark} />
          <div style={{ display: 'flex', gap: 14 }}>
            <ActionBtn icon={headphones} />
            <ActionBtn icon={penIcon} />
            <ActionBtn icon={share} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { JourneyScreen, WeekRoadmapScreen, LessonReaderScreen });
