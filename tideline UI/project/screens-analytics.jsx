// screens-analytics.jsx — Insights for the "You" section of VICI.
//
// Redesigned around air and imagery: almost nothing lives in a boxed
// card. Each screen opens with a full-bleed faceted-planar scene in
// which the DATA IS THE LANDSCAPE — the 14-day mood curve drawn as a
// layered sea, the week's verdict as weather clearing left to right.
// Below, quiet editorial sections separated by whitespace and
// hairlines: one thin bar list, one row of monument numerals, and
// small scene-marks instead of icon chips.
//
// Exports: AnalyticsScreen, WeeklyReportScreen.

// ── mood scale (worst → best): THE home week-ring ramp, shared via
// stoic-kit — pale for low, richest ink for radiant. No hue anywhere. ──
const MTONE = MOOD_TONES;
const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];
const moodC = (v, a) => (a == null ? MTONE[v] : `color-mix(in oklab, ${MTONE[v]} ${a}%, transparent)`);

// ── fabricated-but-coherent logged data ─────────────────────────────
const TREND = [1, 2, 1, 2, 3, 2, 1, 2, 3, 3, 2, 3, 4, 3];
const THIS_WEEK = [2, 3, 2, 3, 4, 3, 3];   // avg ≈ Good
const LAST_WEEK = [1, 2, 2, 1, 2, 3, 2];   // avg ≈ Fine
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;

const TOP_TRIGGERS = [['Late night', 8], ['Boredom', 6], ['Stress', 5], ['Phone', 4], ['Lonely', 2]];
const TOP_REASONS = [['Sleep', 7], ['Work', 5], ['People', 4], ['Health', 2]];
const TOP_FEELINGS = ['Restless', 'Tired', 'Anxious', 'Foggy'];

// smooth Catmull-Rom-ish curve through points
function anSmooth(pts, k = 0.18) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) * k} ${p1[1] + (p2[1] - p0[1]) * k}, ${p2[0] - (p3[0] - p1[0]) * k} ${p2[1] - (p3[1] - p1[1]) * k}, ${p2[0]} ${p2[1]}`;
  }
  return d;
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

// ════════════════════════════════════════════════════════════════════
// THE TIDE CHART — 14 days of mood drawn as a layered sea. The curve
// IS the data: higher water = higher mood. Whitecaps mark the hard
// days; the boat rides today's swell.
// ════════════════════════════════════════════════════════════════════
function TideChart({ data }) {
  const K = window.SceneKit, SC = K.SC;
  const x0 = 12, x1 = 390;
  const pts = data.map((v, i) => [x0 + (i * (x1 - x0)) / (data.length - 1), 156 - (v / 4) * 70]);
  const curve = anSmooth(pts);
  const area = `${curve} L${x1} 220 L${x0} 220 Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width="100%" viewBox="0 0 402 212" fill="none" style={{ display: 'block' }}>
      {/* band guides — drawn UNDER the sea so they read like tide marks:
          visible in the sky, swallowed wherever the water rises past them */}
      <g fontFamily="var(--font)" fontSize="9.5" fontWeight="600" letterSpacing="0.1em">
        <text x={12} y={80} fill="var(--ink4)">RADIANT</text>
        <text x={12} y={115} fill="var(--ink4)">FINE</text>
        <text x={12} y={176} fill="#FBFAF4" opacity="0.95">LOW</text>
      </g>
      <path d="M12 86 H390" stroke="var(--ink4)" strokeWidth="1" strokeDasharray="1.5 4.5" opacity="0.6" />
      <path d="M12 121 H390" stroke="var(--ink4)" strokeWidth="1" strokeDasharray="1.5 4.5" opacity="0.45" />
      {/* the sea — the mood curve, banded like every VICI water */}
      <path d={area} fill={SC.waterHi} />
      <path d={curve} stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" />
      <g transform="translate(0 20)"><path d={area} fill={SC.water} /><path d={curve} stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" /></g>
      <g transform="translate(0 42)"><path d={area} fill={SC.waterLo} /><path d={curve} stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" /></g>
      {/* one reading per day — the checked-in points riding the waterline */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 2.3} fill={SC.ink}
          stroke={SC.foam} strokeWidth={i === pts.length - 1 ? 2 : 1.2} opacity={i === pts.length - 1 ? 1 : 0.82} />
      ))}
      {/* whitecaps on the hard days */}
      {data.map((v, i) => (v <= 1 ? <circle key={i} cx={pts[i][0]} cy={pts[i][1] - 7} r="1.8" fill={SC.foam} /> : null))}
      {/* the boat sails just ahead of today's reading */}
      <K.SBoat x={last[0] - 26} y={last[1] + 1} s={0.52} />
    </svg>
  );
}

// ── small scene-marks for the correlation rows ──────────────────────
function MarkNight() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" style={{ display: 'block' }}>
      <K.SMoonF cx={22} cy={15} r={10} phase={0.3} />
      <circle cx="38" cy="8" r="1.2" fill={SC.farShade} /><circle cx="7" cy="10" r="1" fill={SC.farShade} />
      <path d="M3 33 C 12 30 22 29 30 31 C 36 32 41 33 44 34" stroke={SC.waterLo} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function MarkLowSun() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" style={{ display: 'block' }}>
      <circle cx="23" cy="27" r="9" fill={SC.sun} stroke={SC.sunEdge} strokeWidth="1.3" />
      <path d="M2 27 H44 V40 H2 Z" fill={SC.water} />
      <path d="M2 27 H44" stroke={SC.foam} strokeWidth="2" strokeLinecap="round" />
      <path d="M23 10 v4 M10 14 l2.4 2.4 M36 14 l-2.4 2.4" stroke={SC.fgShade} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function MarkIdleBuoy() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" style={{ display: 'block' }}>
      <K.SBuoy x={23} y={26} s={0.85} lean={3} />
      <path d="M4 33 q 9 -2.5 19 0 t 19 0" stroke={SC.waterLo} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── when in the day — 2-hour buckets, 6 AM → 6 AM, dark hours washed ─
const HOUR_BUCKETS = [0, 0, 1, 0, 1, 0, 1, 1, 4, 2, 1, 0]; // Σ = 11 logged urges
function WhenInTheDay() {
  const K = window.SceneKit;
  const max = Math.max(...HOUR_BUCKETS);
  const BAR_H = 62;
  return (
    <div style={{ padding: '52px 29px 0' }}>
      <AnLabel>When they hit</AnLabel>
      <div style={{ position: 'relative', marginTop: 26 }}>
        {/* the dark hours — 10 PM to 6 AM */}
        <div style={{ position: 'absolute', left: `${(8 / 12) * 100}%`, right: 0, top: -12, height: BAR_H + 13, background: 'var(--soft)', borderRadius: 12 }} />
        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" style={{ position: 'absolute', right: 4, top: -7 }}>
          <K.SMoonF cx={11} cy={10} r={7} phase={0.32} />
        </svg>
        {/* one bar per two hours */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 6, height: BAR_H }}>
          {HOUR_BUCKETS.map((n, i) => (
            <div key={i} style={{ flex: 1, height: n ? 9 + (n / max) * (BAR_H - 9) : 3.5, borderRadius: n ? 4.5 : 2, background: n ? 'var(--ink)' : 'var(--soft2)', opacity: n ? 0.4 + 0.6 * (n / max) : 1 }} />
          ))}
        </div>
        <div style={{ height: 1, background: 'var(--line)' }} />
        {/* hour marks */}
        <div style={{ position: 'relative', height: 15, marginTop: 8 }}>
          {[['6 AM', 0], ['NOON', 25], ['6 PM', 50], ['MIDNIGHT', 75]].map(([l, p]) => (
            <span key={l} style={{ position: 'absolute', left: `${p}%`, transform: p ? 'translateX(-50%)' : 'none', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink4)' }}>{l}</span>
          ))}
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', margin: '14px 0 0', lineHeight: 1.45, textWrap: 'pretty' }}>
        <b style={{ color: 'var(--ink)' }}>7 of 11</b> landed after 10 PM — a narrow window, and the same one every week.
      </p>
    </div>
  );
}

// unboxed correlation row
function TideSays({ mark, finding, detail, first = false }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 0', borderTop: first ? 'none' : '1px solid var(--line)' }}>
      <div style={{ flexShrink: 0, width: 46, marginTop: 2 }}>{mark}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal', lineHeight: 1.3 }}>{finding}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', marginTop: 5, lineHeight: 1.45, textWrap: 'pretty' }}>{detail}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ANALYTICS — the standing dashboard, now one calm column of air
// ════════════════════════════════════════════════════════════════════
function AnalyticsScreen() {
  return (
    <Shell pad={0} top={0} tab={<TabBar active="you" />}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '60px 0 0' }}>
          <ScreenHeader hue={230} eyebrow="Insights" title="Your patterns" onBack={() => {}}
            trailing={<span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink3)' }}>30 days</span>} />
        </div>

        {/* the tide of you — full-bleed, no card */}
        <div style={{ marginTop: 4 }}><TideChart data={TREND} /></div>
        <div style={{ padding: '0 29px', display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--ink4)' }}>14 DAYS AGO</span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--ink3)' }}>TODAY</span>
        </div>
        {/* the verdict — sealed dark, like home's Next lesson card */}
        <div style={{ padding: '26px 29px 0' }}>
          <DarkCard pad={22}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: DARK.mut }}>Mood · last 14 days</div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 30, color: DARK.paper, letterSpacing: '0.005em', marginTop: 10, lineHeight: 1.05 }}>The tide is rising.</div>
            <div style={{ marginTop: 12 }}><Delta dark>18% higher than the two weeks before</Delta></div>
          </DarkCard>
        </div>

        {/* monument numerals — one airy row, hairline separated */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '44px 29px 0' }}>
          {[['26', 'Check-ins'], ['11', 'Urges logged'], ['24', 'Days kept']].map(([v, l], i) => (
            <div key={l} style={{ textAlign: 'center', padding: '4px 0', borderLeft: i ? '1px solid var(--line)' : 'none' }}>
              <div className="tnum" style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 37, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 9 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* what sets it off — one pebble per logged urge */}
        <div style={{ padding: '52px 29px 0' }}>
          <AnLabel>What sets it off</AnLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 19, marginTop: 22 }}>
            {TOP_TRIGGERS.map(([label, n], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 92, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', flexShrink: 0, letterSpacing: 'normal' }}>{label}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5.5 }}>
                  {Array.from({ length: n }).map((_, j) => (
                    <span key={j} style={{ width: 7.5, height: 7.5, borderRadius: 9999, background: 'var(--ink)', opacity: 0.92 - i * 0.15 }} />
                  ))}
                </div>
                <span className="tnum" style={{ width: 18, textAlign: 'right', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)', flexShrink: 0 }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink4)', marginTop: 16 }}>Each dot is one logged urge · last 30 days</div>
        </div>

        <WhenInTheDay />

        {/* behind the lows — quiet editorial lines, unboxed */}
        <div style={{ padding: '52px 29px 0' }}>
          <AnLabel>Behind the lows</AnLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', marginTop: 18 }}>
            {TOP_REASONS.map(([r, n]) => (
              <span key={r} style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>
                {r} <span style={{ color: 'var(--ink3)', fontWeight: 500, fontSize: 12.5 }}>×{n}</span>
              </span>
            ))}
          </div>
          <AnLabel style={{ marginTop: 34 }}>The words you reached for</AnLabel>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 16, fontStyle: 'italic', color: 'var(--ink2)', margin: '14px 0 0', letterSpacing: '-0.005em', lineHeight: 1.5 }}>
            {TOP_FEELINGS.join(' · ')}
          </p>
        </div>

        {/* what the tide says — scene-marks, hairline rows */}
        <div style={{ padding: '52px 29px 136px' }}>
          <AnLabel style={{ marginBottom: 6 }}>What the tide says</AnLabel>
          <TideSays first mark={<MarkLowSun />} finding="Low sleep, lower mood"
            detail="On days you logged “Sleep” as a reason, your mood averaged a full band lower." />
          <TideSays mark={<MarkIdleBuoy />} finding="Boredom is your main pull"
            detail="Idle evenings drive most urges. A planned wind-down ritual could blunt it." />
        </div>
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════════════
// WEEKLY REPORT — the week, clearing. One scene, then quiet numbers.
// ════════════════════════════════════════════════════════════════════
// weather clearing left → right: the storm leaves the frame, the sea
// settles toward the sun, the boat sails into the clear.
function ClearingScene() {
  const K = window.SceneKit, SC = K.SC;
  const calm = (y, amps, x0 = -4, x1 = 406) => {
    const seg = (x1 - x0) / amps.length;
    let d = `M${x0} ${y}`;
    amps.forEach((a, i) => { const sx = x0 + i * seg, dir = i % 2 ? 1 : -1; d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`; });
    return d;
  };
  return (
    <svg width="100%" viewBox="0 0 402 188" fill="none" style={{ display: 'block' }}>
      <K.SSun cx={310} cy={46} r={17} glow={2.8} />
      {/* the storm, already leaving the frame */}
      <g opacity="0.9">
        <path d="M-30 58 C -34 42 -18 30 0 34 C 6 18 34 13 48 28 C 62 20 80 30 78 44 C 88 47 86 58 74 58 Z" fill={SC.nearShade} />
        <path d="M-26 58 L74 58 C 73 62 67 65 58 65 L-12 65 C -20 65 -25 62 -26 58 Z" fill={SC.fgShade} opacity="0.7" />
        <g stroke="#948F77" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <path d="M6 72 l-3.4 11 M28 74 l-3.4 11 M50 72 l-3.4 11" />
        </g>
      </g>
      <K.SGull x={346} y={82} s={0.85} o={0.6} /><K.SGull x={368} y={72} s={0.65} o={0.45} />
      {/* the sea settles as it leaves the storm behind */}
      <path d={`${calm(108, [10, 7, 4, 2])} L406 188 L-4 188 Z`} fill={SC.waterHi} />
      <path d={calm(108, [10, 7, 4, 2])} stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`${calm(134, [8, 5.5, 3, 1.5])} L406 188 L-4 188 Z`} fill={SC.water} />
      <path d={calm(134, [8, 5.5, 3, 1.5])} stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d={`${calm(160, [6, 4, 2, 1])} L406 188 L-4 188 Z`} fill={SC.waterLo} />
      <path d={calm(160, [6, 4, 2, 1])} stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      {/* chop only under the storm */}
      <circle cx="30" cy="102" r="1.8" fill={SC.foam} /><circle cx="52" cy="98" r="1.4" fill={SC.foam} />
      <circle cx="74" cy="103" r="1.5" fill={SC.foam} opacity="0.8" />
      {/* sailing into the clear */}
      <K.SBoat x={258} y={94} s={0.62} />
    </svg>
  );
}

// three shrinking crests — "the wave is getting smaller"
function MarkShrinkingWaves() {
  const K = window.SceneKit, SC = K.SC;
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" style={{ display: 'block' }}>
      <path d="M2 32 C 6 16 12 16 16 32" stroke={SC.waterDeep} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M19 32 C 22 21 27 21 30 32" stroke={SC.waterDeep} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M33 32 C 35 26 38 26 40 32" stroke={SC.waterLo} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="13" r="1.6" fill={SC.foam} stroke={SC.waterLo} strokeWidth="0.6" />
      <path d="M2 36 h42" stroke={SC.waterLo} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function WeeklyReportScreen() {
  const tw = avg(THIS_WEEK), lw = avg(LAST_WEEK);
  return (
    <Shell pad={0} top={0} tab={<TabBar active="you" />}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '60px 0 0' }}>
          <ScreenHeader hue={150} eyebrow="Weekly report" title="This week" onBack={() => {}}
            trailing={<span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink3)' }}>Oct 1–7</span>} />
        </div>

        <div style={{ padding: '30px 29px 0' }}>
          <AnLabel>How you're feeling</AnLabel>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 31, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1.08, margin: '10px 0 0', textWrap: 'balance' }}>
            Steadier than last week.
          </h2>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14, color: 'var(--ink2)', margin: '12px 0 0', maxWidth: 280, lineHeight: 1.5, textWrap: 'pretty' }}>
            Your mood averaged <b style={{ color: 'var(--ink)' }}>{MOOD_NAME[Math.round(tw)]}</b>, up from <b style={{ color: 'var(--ink)' }}>{MOOD_NAME[Math.round(lw)]}</b>.
          </p>
        </div>

        {/* day by day — paired columns; height and tone are both the mood */}
        <div style={{ padding: '48px 29px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <AnLabel>Day by day</AnLabel>
            <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, color: 'var(--ink3)' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: moodC(3, 30) }} /> Last week
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, color: 'var(--ink3)' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: moodC(3) }} /> This week
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 92, marginTop: 20, borderBottom: '1px solid var(--line)' }}>
            {DOW.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                <div style={{ flex: 1, height: `${16 + (LAST_WEEK[i] / 4) * 80}%`, borderRadius: '4px 4px 0 0', background: moodC(LAST_WEEK[i], 30) }} />
                <div style={{ flex: 1, height: `${16 + (THIS_WEEK[i] / 4) * 80}%`, borderRadius: '4px 4px 0 0', background: moodC(THIS_WEEK[i]) }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {DOW.map((d, i) => <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, color: 'var(--ink4)' }}>{d}</span>)}
          </div>
        </div>

        {/* the counts — two quiet monuments */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '48px 29px 0' }}>
          <div style={{ padding: '2px 18px 2px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 37, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1 }}>3</span>
              <Delta down>2</Delta>
            </div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 9 }}>Urges</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink2)', marginTop: 5 }}>Down from 5 last week</div>
          </div>
          <div style={{ padding: '2px 0 2px 22px', borderLeft: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 37, color: 'var(--ink)', letterSpacing: '0.005em', lineHeight: 1 }}>0</span>
              <Delta down>1</Delta>
            </div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 9 }}>Relapses</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink2)', marginTop: 5 }}>One slip last week</div>
          </div>
        </div>

        {/* easier to ride — one unboxed reading */}
        <div style={{ padding: '44px 29px 0' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingTop: 22, borderTop: '1px solid var(--line)' }}>
            <div style={{ flexShrink: 0, width: 46, marginTop: 2 }}><MarkShrinkingWaves /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>Urges are getting easier to ride</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', marginTop: 5, lineHeight: 1.45, textWrap: 'pretty' }}>
                40% fewer than last week, and the average pull dropped from Strong to Mild. The wave is shrinking.
              </div>
            </div>
          </div>
        </div>

        {/* where it's hardest */}
        <div style={{ padding: '44px 29px 0' }}>
          <AnLabel>Where it's hardest</AnLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <div style={{ flexShrink: 0, width: 46 }}><MarkNight /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', letterSpacing: 'normal' }}>Late nights</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, color: 'var(--ink2)', marginTop: 3 }}>Tied to 4 of your 5 toughest days</div>
            </div>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 29, color: 'var(--ink)', letterSpacing: '0.005em', flexShrink: 0 }}>80%</span>
          </div>
        </div>

        {/* next week's focus — sealed dark */}
        <div style={{ padding: '48px 29px 0' }}>
          <WaveDivider style={{ marginBottom: 40 }} />
          <DarkCard pad={22}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: DARK.mut }}>Next week's focus</div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 27, color: DARK.paper, letterSpacing: '0.005em', lineHeight: 1.1, margin: '10px 0 0' }}>Protect your wind-down.</div>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: DARK.mut, margin: '12px 0 0', lineHeight: 1.5, textWrap: 'pretty' }}>
              When you stayed up past midnight, the next day's mood was reliably lower.
            </p>
          </DarkCard>
        </div>

        <div style={{ padding: '16px 29px 136px' }}>
          <PillButton full onClick={() => {}}>Set next week's focus</PillButton>
        </div>
      </div>
    </Shell>
  );
}

Object.assign(window, { AnalyticsScreen, WeeklyReportScreen });
