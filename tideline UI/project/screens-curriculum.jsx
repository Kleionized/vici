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

          <Hero size={40} style={{ margin: '24px 0 10px' }}>The shore</Hero>
          <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.45, fontWeight: 400, color: 'var(--ink2)', margin: 0, textWrap: 'pretty' }}>
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

// 2 ─ Week roadmap: connected lesson nodes with states
function WeekRoadmapScreen() {
  const lessons = [
    ['Why it grips you', '4 min · story', 'done'],
    ['The first calm', '5 min · story + practice', 'current'],
    ['Name the pull', '3 min · practice', 'locked'],
    ['Ride the wave', '6 min · story + practice', 'locked'],
    ['Come back gently', '4 min · story', 'locked'],
  ];
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

        <div style={{ padding: '20px 29px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative' }}>
            {/* connector line */}
            <div style={{ position: 'absolute', left: 21, top: 22, bottom: 22, width: 2, background: 'var(--soft2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lessons.map(([t, m, st], i) => {
                const done = st === 'done', cur = st === 'current';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 9999, flexShrink: 0, zIndex: 1,
                      background: done ? 'var(--fill)' : cur ? 'var(--card)' : 'var(--bg)',
                      border: cur ? '2px solid var(--ink)' : done ? 'none' : '2px solid var(--soft2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'none',
                    }}>
                      {done ? <GIcon el={Glyph.check('var(--on-fill)', 3)} size={20} />
                        : st === 'locked' ? <GIcon el={Glyph.lock('var(--ink3)')} size={18} />
                        : <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, color: 'var(--ink)' }}>{i + 1}</span>}
                    </div>
                    <Card pad={18} style={{ flex: 1, opacity: st === 'locked' ? 0.55 : 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal' }}>{t}</div>
                        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 1 }}>{m}</div>
                      </div>
                      {cur && <span className="tl-press" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, cursor: 'pointer', color: 'var(--on-fill)', background: 'var(--fill)', boxShadow: 'none', borderRadius: 9999, padding: '6px 13px' }}>Resume</span>}
                    </Card>
                  </div>
                );
              })}
            </div>
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
