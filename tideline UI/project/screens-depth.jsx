// screens-depth.jsx — Library search
// (Milestones merged into the Keepsakes album — see screens-keepsakes.jsx)

function LibrarySearchScreen({ noResults = false }) {
  const recent = ['urge surfing', 'shame', 'sleep'];
  const query = noResults ? 'wilpower' : 'urge';
  const results = [
    { type: 'Lesson', t: 'Riding the wave', s: 'Week II · 6 min', g: Glyph.wave },
    { type: 'Lesson', t: 'When the urge feels like wanting', s: 'Week II · 4 min', g: Glyph.book },
    { type: 'Practice', t: 'The 20-minute rule', s: '3 min · breathing', g: Glyph.anchor },
    { type: 'Story', t: 'Marco, on his second year', s: '8 min read', g: Glyph.user },
  ];
  return (
    <Shell pad={0} top={0}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* search bar */}
        <div style={{ padding: '60px 29px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', borderRadius: 9999, padding: '13px 18px', boxShadow: 'none' }}>
            {Glyph.search('var(--ink)')}
            <span style={{ fontFamily: 'var(--font)', fontSize: 14.5, color: 'var(--ink)', fontWeight: 500 }}>{query}<span className="tl-caret" style={{ display: 'inline-block', width: 2, height: 18, background: 'var(--ink)', verticalAlign: -3, marginLeft: 1 }}></span></span>
          </div>
          <GhostButton size={16} style={{ color: 'var(--ink)', fontWeight: 500 }}>Cancel</GhostButton>
        </div>

        {/* recent chips */}
        <div style={{ padding: '0 29px 18px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {recent.map((r, i) => (
            <span key={i} className="tl-press" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, cursor: 'pointer', color: 'var(--ink2)', background: 'var(--card)', padding: '8px 14px', borderRadius: 9999, boxShadow: 'none' }}>{r}</span>
          ))}
        </div>

        <Eyebrow style={{ padding: '0 29px 12px' }}>{noResults ? 'No results' : '4 results'}</Eyebrow>
        <div style={{ flex: 1, overflow: 'hidden', padding: '0 29px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {noResults ? (
            <div style={{ paddingTop: 26, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20, lineHeight: 1.35, color: 'var(--ink)', maxWidth: 250, margin: '0 auto' }}>No pages for “wilpower”.</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 10 }}>Close, though — try one of these:</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                {['the willpower myth', 'urge surfing', 'why streaks fail'].map((s) => (
                  <span key={s} className="tl-press" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, cursor: 'pointer', color: 'var(--ink)', background: 'var(--card)', padding: '9px 15px', borderRadius: 9999 }}>{s}</span>
                ))}
              </div>
            </div>
          ) : results.map((r, i) => (
            <Card key={i} pad={18} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {r.g('var(--ink)')}
              </div>
              <div style={{ flex: 1 }}>
                <Eyebrow style={{ marginBottom: 3 }}>{r.type}</Eyebrow>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal', lineHeight: 1.15 }}>{r.t}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>{r.s}</div>
              </div>
              {Glyph.chevR('var(--ink3)')}
            </Card>
          ))}
        </div>
        <KeyboardLite />
      </div>
    </Shell>
  );
}

const SearchEmptyScreen = () => <LibrarySearchScreen noResults />;
Object.assign(window, { LibrarySearchScreen, SearchEmptyScreen });
