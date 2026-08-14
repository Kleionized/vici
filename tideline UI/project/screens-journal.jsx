// screens-journal.jsx — Journal list (searchable) + Entry editor

function JournalListScreen({ empty = false }) {
  const entries = [
    { d: 'Today', t: '8:12 AM', title: 'A quiet win', tag: 'Reflection', ic: Glyph.spark,
      body: 'Felt the pull around 9 last night and just… went to bed instead. First time that felt easy rather than heroic.' },
    { d: 'Yesterday', t: '10:40 PM', title: 'What I learned from that urge', tag: 'Urge', ic: Glyph.wave,
      body: 'It spiked right after a tense call with mum. The feeling wasn\'t really wanting — it was wanting to not feel this.' },
    { d: 'Mon', t: '7:05 AM', title: 'Week I, lesson 3', tag: 'Lesson', ic: Glyph.book,
      body: 'The idea that a lapse is data, not a verdict, is sticking with me. Trying to stay curious instead of ashamed.' },
    { d: 'Sun', t: '9:30 PM', title: 'Three good hours', tag: 'Reflection', ic: Glyph.spark,
      body: 'Walked the long way home with no phone. Noticed I felt steadier afterwards.' },
  ];
  const tagStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
    fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.06em',
    textTransform: 'uppercase', padding: '4px 9px 4px 7px', borderRadius: 9999,
    background: 'var(--soft)', color: 'var(--ink2)',
  };
  const TAG_HUE = { Reflection: 150, Urge: 215, Lesson: 285 };
  return (
    <Shell pad={0} top={0} tab={<TabBar active="log" />}>
      <div style={{ padding: '60px 0 108px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={150} eyebrow="Your practice" title="Journal"
          trailing={(
            <div className="tl-press" style={{ width: 44, height: 44, borderRadius: 9999, cursor: 'pointer', background: 'var(--fill)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="var(--on-fill)" strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
          )} />

        {/* search */}
        <div style={{ padding: '0 29px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', borderRadius: 9999, padding: '13px 18px', boxShadow: 'none' }}>
            {Glyph.search('var(--ink3)')}
            <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink3)', fontWeight: 400 }}>Search your entries</span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '0 29px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {empty ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 60 }}>
              <QuoteMark size={52} />
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, lineHeight: 1.3, color: 'var(--ink)', maxWidth: 240, marginTop: 4 }}>Nothing logged yet.</div>
              <button className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1.4px solid var(--soft2)', borderRadius: 9999, padding: '11px 22px', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginTop: 22 }}>Write the first line</button>
            </div>
          ) : entries.map((e, i) => (
            <Card key={i} pad={20} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 9 }}>
                <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{e.d} · {e.t}</span>
                <span style={tagStyle}><GIcon el={e.ic('var(--ink2)')} size={13} />{e.tag}</span>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 19.5, letterSpacing: '0.005em', marginBottom: 5, color: 'var(--ink)' }}>{e.title}</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.45, color: 'var(--ink2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function JournalEditorScreen({ onCancel, onSave }) {
  return (
    <Shell pad={0} top={0}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* top bar */}
        <div style={{ padding: '60px 29px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <GhostButton size={16.5} style={{ fontWeight: 500 }} onClick={onCancel}>Cancel</GhostButton>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink3)' }}>Today · 8:12 AM</span>
          <button onClick={onSave} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'var(--fill)', color: 'var(--on-fill)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, borderRadius: 9999, padding: '8px 18px', cursor: 'pointer', boxShadow: 'none' }}>Save</button>
        </div>

        {/* tag chips */}
        <div style={{ padding: '4px 29px 14px', display: 'flex', gap: 8 }}>
          {[['Reflection', true], ['Urge', false], ['Lesson', false]].map(([t, on], i) => (
            <span key={i} className="tl-press" style={{
              fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, letterSpacing: '0.04em', cursor: 'pointer',
              padding: '7px 13px', borderRadius: 9999,
              background: on ? 'var(--fill)' : 'transparent', color: on ? 'var(--on-fill)' : 'var(--ink2)',
              boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--line)',
            }}>{t}</span>
          ))}
        </div>

        {/* body */}
        <div style={{ flex: 1, padding: '6px 29px', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, letterSpacing: '0.01em', marginBottom: 12, color: 'var(--ink)' }}>A quiet win</div>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 15.5, lineHeight: 1.5, color: 'var(--ink)', margin: 0, letterSpacing: '-0.005em' }}>
            Felt the pull around 9 last night and just… went to bed instead. First time that felt easy rather than heroic.<span className="tl-caret" style={{ display: 'inline-block', width: 2, height: 22, background: 'var(--ink)', marginLeft: 1, verticalAlign: -3 }}></span>
          </p>
        </div>

        {/* format toolbar */}
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, background: 'var(--card)', borderRadius: 14, padding: 6, flex: 1, boxShadow: 'none' }}>
            {[['B', 800, true], ['I', 600, false], ['U', 600, false]].map(([l, w, on], i) => (
              <div key={i} style={{
                flex: 1, height: 40, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: on ? 'var(--fill)' : 'transparent', color: on ? 'var(--on-fill)' : 'var(--ink)',
                fontFamily: 'var(--font)', fontWeight: w, fontSize: 18, fontStyle: l === 'I' ? 'italic' : 'normal',
                textDecoration: l === 'U' ? 'underline' : 'none',
              }}>{l}</div>
            ))}
            <div style={{ flex: 1, height: 40, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
              <svg width="22" height="18" viewBox="0 0 24 20"><path d="M3 5h18M3 11h18M3 17h12" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        <KeyboardLite />
      </div>
    </Shell>
  );
}

// compact keyboard echo (visual only, matches stoic capture)
function KeyboardLite() {
  const rows = [['q','w','e','r','t','y','u','i','o','p'], ['a','s','d','f','g','h','j','k','l'], ['z','x','c','v','b','n','m']];
  const Key = ({ ch, flex, w }) => (
    <div style={{ flex: flex ? 1 : undefined, width: w, height: 42, background: 'var(--kbd-key)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, system-ui', fontSize: 22, color: 'var(--kbd-ink)', boxShadow: 'none' }}>{ch}</div>
  );
  return (
    <div style={{ background: 'var(--kbd-bg)', padding: '8px 4px 4px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', gap: 5 }}>{rows[0].map(k => <Key key={k} ch={k} flex />)}</div>
      <div style={{ display: 'flex', gap: 5, padding: '0 16px' }}>{rows[1].map(k => <Key key={k} ch={k} flex />)}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Key ch="⇧" w={40} />
        <div style={{ display: 'flex', gap: 5, flex: 1 }}>{rows[2].map(k => <Key key={k} ch={k} flex />)}</div>
        <Key ch="⌫" w={40} />
      </div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Key ch="123" w={80} />
        <Key ch="space" flex />
        <div style={{ width: 88, height: 42, background: 'var(--fill)', borderRadius: 6, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-fill)', fontFamily: '-apple-system, system-ui', fontSize: 14, fontWeight: 500 }}>return</div>
      </div>
    </div>
  );
}

const JournalEmptyScreen = () => <JournalListScreen empty />;
Object.assign(window, { JournalListScreen, JournalEditorScreen, JournalEmptyScreen });
