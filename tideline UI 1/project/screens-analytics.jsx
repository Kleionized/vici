// screens-analytics.jsx — Insights for the "You" section of VICI.
//
// Minimal rebuild. One idea per section, one format per idea:
//  · Analytics — a mood heatmap (one tinted cell per day, range set by
//    a 2W / 4W / 12W filter), three numerals, four trigger bars. Done.
//  · Weekly report — a verdict line, this week vs last as two heatmap
//    rows, three numerals, one focus. Done.
//
// Exports: AnalyticsScreen, WeeklyReportScreen.

// ── mood scale (worst → best): THE home week-ring ramp, shared via
// stoic-kit — pale for low, richest ink for radiant. No hue anywhere. ──
const MTONE = MOOD_TONES;
const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];
const moodC = (v, a) => (a == null ? MTONE[v] : `color-mix(in oklab, ${MTONE[v]} ${a}%, transparent)`);

// ── fabricated-but-coherent logged data: 84 days ending "today" ─────
const AN_DAYS = 84;
const AN_DATA = (() => {
  let s = 11;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const moods = [], urges = [];
  for (let i = 0; i < AN_DAYS; i++) {
    const p = i / (AN_DAYS - 1);
    const skip = rnd() < 0.18 - 0.13 * p;             // fewer missed days lately
    const w = 1.0 + 2.1 * p + 0.7 * Math.sin(i / 3.9) + (rnd() - 0.5) * 1.5;
    const m = skip ? null : Math.max(0, Math.min(4, Math.round(w)));
    moods.push(m);
    const pull = (m == null ? 0.95 : m <= 1 ? 1.2 : m === 2 ? 0.8 : 0.6) * (1 - 0.25 * p);
    urges.push(rnd() < pull * 0.85 ? (rnd() < 0.22 ? 2 : 1) : 0);
  }
  moods[AN_DAYS - 1] = 3;                             // today: Good
  return { moods, urges };
})();
const AN_RELAPSES = [18, 44, 61, 74];                 // day indices; latest = 10 days ago
const AN_END = new Date(2026, 9, 7);                  // "today" in this fiction
const anDate = (back) => new Date(2026, 9, 7 - back).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const AN_RANGES = [
  { label: '2W', days: 14, h: 44, r: 12 },
  { label: '4W', days: 28, h: 40, r: 10 },
  { label: '12W', days: 84, h: 20, r: 6 },
];

const THIS_WEEK = [2, 3, 2, 3, 4, 3, 3];   // avg ≈ Good
const LAST_WEEK = [1, 2, 2, 1, 2, 3, 2];   // avg ≈ Fine
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;

// apportion a total across weighted shares (largest remainder) so the
// trigger counts always sum to exactly the range's logged urges
function anSplit(total, weights) {
  const raw = weights.map((w) => total * w);
  const base = raw.map(Math.floor);
  let left = total - base.reduce((s, x) => s + x, 0);
  raw.map((r, i) => [r - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i], k) => { if (k < left) base[i]++; });
  return base;
}

// quiet inline delta — no chip, just a small triangle + text
function Delta({ children, down = false, dark = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: dark ? 'rgba(245,244,241,0.62)' : 'var(--ink2)' }}>
      <svg width="9" height="9" viewBox="0 0 12 12" style={{ transform: down ? 'scaleY(-1)' : 'none', flexShrink: 0 }}><path d="M6 2.5l4 5H2z" fill={dark ? 'rgba(245,244,241,0.5)' : 'var(--ink3)'} /></svg>
      {children}
    </span>
  );
}

// section header — the home screen's "TODAY'S STEPS" caps exactly
function AnLabel({ children, style = {} }) {
  return (
    <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink)', ...style }}>{children}</div>
  );
}
const AN_CAPS = { fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink4)' };

// ── heatmap primitives ──────────────────────────────────────────────
function AnDowHeader({ style = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, ...style }}>
      {DOW.map((d, i) => <span key={i} style={{ ...AN_CAPS, textAlign: 'center' }}>{d}</span>)}
    </div>
  );
}

// one row of 7 day-cells; v: 0–4 mood, null = no check-in
function AnWeekRow({ week, h, r, alpha, todayIdx = -1, style = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, ...style }}>
      {week.map((v, i) => (
        <div key={i} style={{
          height: h, borderRadius: r,
          background: v == null ? 'var(--soft)' : moodC(v, alpha),
          boxShadow: i === todayIdx ? '0 0 0 2px var(--bg), 0 0 0 3.5px var(--ink)' : 'none',
        }} />
      ))}
    </div>
  );
}

function AnLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 3.5 }}>
          {MTONE.map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: 3, background: c }} />)}
        </div>
        <span style={AN_CAPS}>Low → Radiant</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--soft)' }} />
        <span style={AN_CAPS}>No check-in</span>
      </div>
    </div>
  );
}

// the date-range filter — quiet caps, an ink rule under the active one
function AnRangeFilter({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {AN_RANGES.map((rg) => {
        const on = rg.days === value;
        return (
          <button key={rg.label} className="tl-press" onClick={() => onChange(rg.days)} style={{
            background: 'none', border: 'none', padding: '0 0 4px', cursor: 'pointer',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: 12, letterSpacing: '0.1em',
            color: on ? 'var(--ink)' : 'var(--ink3)',
            borderBottom: on ? '1.5px solid var(--ink)' : '1.5px solid transparent',
          }}>{rg.label}</button>
        );
      })}
    </div>
  );
}

// the airy numeral row — hairline-separated monuments
function AnStats({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      {stats.map(([v, l], i) => (
        <div key={l} style={{ textAlign: 'center', padding: '4px 0', borderLeft: i ? '1px solid var(--line)' : 'none' }}>
          <div className="tnum" style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 37, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1 }}>{v}</div>
          <div style={{ ...AN_CAPS, color: 'var(--ink3)', marginTop: 9 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ANALYTICS — heatmap · numerals · triggers. Nothing else.
// ════════════════════════════════════════════════════════════════════
function AnalyticsScreen() {
  const [range, setRange] = React.useState(14);
  const cfg = AN_RANGES.find((r) => r.days === range);

  const moods = AN_DATA.moods.slice(-range);
  const weeks = [];
  for (let i = 0; i < moods.length; i += 7) weeks.push(moods.slice(i, i + 7));

  const checkins = moods.filter((v) => v != null).length;
  const urges = AN_DATA.urges.slice(-range).reduce((s, x) => s + x, 0);
  const kept = range - AN_RELAPSES.filter((d) => d >= AN_DAYS - range).length;
  const tNames = ['Late night', 'Boredom', 'Stress', 'Phone'];
  const triggers = anSplit(urges, [0.40, 0.28, 0.19, 0.13]).map((n, i) => [tNames[i], n]).filter(([, n]) => n > 0);
  const tMax = Math.max(...triggers.map(([, n]) => n), 1);

  return (
    <Shell pad={0} top={0} tab={<TabBar active="you" />}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '60px 0 0' }}>
          <ScreenHeader hue={230} eyebrow="Insights" title="Your patterns" onBack={() => {}}
            trailing={<AnRangeFilter value={range} onChange={setRange} />} />
        </div>

        {/* mood, one cell per day */}
        <div style={{ padding: '4px 29px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <AnLabel>Mood, day by day</AnLabel>
            <span className="tnum" style={AN_CAPS}>{anDate(range - 1)} – {anDate(0)}</span>
          </div>
          <AnDowHeader style={{ margin: '20px 0 8px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {weeks.map((w, i) => (
              <AnWeekRow key={i} week={w} h={cfg.h} r={cfg.r}
                todayIdx={i === weeks.length - 1 ? 6 : -1} />
            ))}
          </div>
          <AnLegend />
        </div>

        {/* the numerals */}
        <div style={{ margin: '52px 29px 0' }}>
          <AnStats stats={[[checkins, 'Check-ins'], [urges, 'Urges logged'], [kept, 'Days kept']]} />
        </div>

        {/* top triggers — four thin bars */}
        <div style={{ padding: '52px 29px 136px' }}>
          <AnLabel>What sets it off</AnLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 21, marginTop: 24 }}>
            {triggers.map(([label, n]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 84, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 3, borderRadius: 9999, background: 'var(--soft)' }}>
                  <div style={{ width: `${(n / tMax) * 100}%`, height: '100%', borderRadius: 9999, background: 'var(--ink)' }} />
                </div>
                <span className="tnum" style={{ width: 20, textAlign: 'right', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', flexShrink: 0 }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink4)', marginTop: 18 }}>From the {urges} urge{urges === 1 ? '' : 's'} you logged in this range</div>
        </div>
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════════════
// WEEKLY REPORT — verdict · two heatmap rows · numerals · one focus.
// ════════════════════════════════════════════════════════════════════
function WeeklyReportScreen() {
  const tw = avg(THIS_WEEK), lw = avg(LAST_WEEK);
  const wkLabel = { ...AN_CAPS, width: 74, flexShrink: 0 };
  return (
    <Shell pad={0} top={0} tab={<TabBar active="you" />}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '60px 0 0' }}>
          <ScreenHeader hue={150} eyebrow="Weekly report" title="This week" onBack={() => {}}
            trailing={<span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink3)' }}>Oct 1–7</span>} />
        </div>

        {/* the verdict */}
        <div style={{ padding: '2px 29px 0' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 31, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.08, margin: 0, textWrap: 'balance' }}>
            Steadier than last week.
          </h2>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, color: 'var(--ink2)', margin: '12px 0 0', lineHeight: 1.5, textWrap: 'pretty' }}>
            Your mood averaged <b style={{ color: 'var(--ink)' }}>{MOOD_NAME[Math.round(tw)]}</b>, up from <b style={{ color: 'var(--ink)' }}>{MOOD_NAME[Math.round(lw)]}</b>.
          </p>
        </div>

        {/* day by day — the same cell language as the patterns heatmap */}
        <div style={{ padding: '48px 29px 0' }}>
          <AnLabel>Day by day</AnLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 8px' }}>
            <span style={wkLabel} />
            <AnDowHeader style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={wkLabel}>Last week</span>
              <AnWeekRow week={LAST_WEEK} h={34} r={9} alpha={30} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={wkLabel}>This week</span>
              <AnWeekRow week={THIS_WEEK} h={34} r={9} style={{ flex: 1 }} />
            </div>
          </div>
        </div>

        {/* the numerals, with quiet deltas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '52px 29px 0' }}>
          {[['3', 'Urges', <Delta down>2</Delta>], ['0', 'Relapses', <Delta down>1</Delta>], ['7', 'Check-ins', <Delta>1</Delta>]].map(([v, l, d], i) => (
            <div key={l} style={{ textAlign: 'center', padding: '4px 0', borderLeft: i ? '1px solid var(--line)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
                <span className="tnum" style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 37, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1 }}>{v}</span>
                {d}
              </div>
              <div style={{ ...AN_CAPS, color: 'var(--ink3)', marginTop: 9 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* one focus — plain, no card */}
        <div style={{ padding: '56px 29px 136px' }}>
          <WaveDivider style={{ marginBottom: 40 }} />
          <AnLabel>Next week's focus</AnLabel>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 27, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.1, margin: '12px 0 0' }}>Protect your wind-down.</div>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', margin: '12px 0 0', lineHeight: 1.5, textWrap: 'pretty' }}>
            When you stayed up past midnight, the next day's mood was reliably lower.
          </p>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { AnalyticsScreen, WeeklyReportScreen });
