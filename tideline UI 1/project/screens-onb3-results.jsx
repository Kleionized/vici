// screens-onb3-results.jsx — the reveal pages after the reading pause.
// Visualization-first: every screen is one animated picture plus ONE
// caption line beneath it. No paragraphs, no aphorisms.
//   1 · O3_Root      — the loop, drawn from their answers
//   2 · O3_CostPage  — if nothing changes: four day-grid pages
//                      (week · month · year · decade), counts animated
//   3 · (streaks — lives in screens-onb3.jsx, follows the grids)
//   4 · O3_Rewire    — the projected rewiring curve
//
// Exports: o3Issue, O3_Root, O3_CostPage, O3_Rewire + static boards.

const { useState: orState, useEffect: orEffect } = React;

// ── the diagnosis: pick the underlying issue off the intake ─────────
const O3_ISSUE = {
  'Loneliness': { kind: 'feel', word: 'loneliness' },
  'Anxiety or stress': { kind: 'feel', word: 'stress' },
  'Boredom': { kind: 'feel', word: 'boredom' },
  'Sadness or low mood': { kind: 'feel', word: 'low mood' },
  'Anger or frustration': { kind: 'feel', word: 'frustration' },
  'Numbness — feeling nothing': { kind: 'feel', word: 'numbness' },
  'Mostly automatic, just habit': { kind: 'auto', word: 'autopilot' },
  'Genuine desire or arousal': { kind: 'auto', word: 'wiring' },
};
function o3Issue(a = {}) {
  const list = a.emotions || [];
  for (const e of list) { const hit = O3_ISSUE[e]; if (hit && hit.kind === 'feel') return hit; }
  return O3_ISSUE[list[0]] || { kind: 'feel', word: 'restlessness' };
}
const orCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// one-line caption under every visualization
function OrCaption({ children }) {
  return <O3Note style={{ marginTop: 16, minHeight: 36 }}>{children}</O3Note>;
}

// ═════ 1 · THE ROOT — the loop, drawn ════════════════════════════════
function O3LoopArt({ stations }) {
  const knock = { paintOrder: 'stroke', stroke: 'var(--card)', strokeWidth: 7, strokeLinejoin: 'round' };
  return (
    <svg width="100%" viewBox="0 0 300 172" fill="none" style={{ display: 'block' }}>
      <ellipse className="o3-drawslow" pathLength="1" cx="150" cy="86" rx="104" ry="55" stroke="var(--ink3)" strokeWidth="1.7" strokeLinecap="round" />
      {/* clockwise — down on the right, up on the left */}
      <g className="o3-riseline" style={{ animationDelay: '2.1s' }}>
        <path d="M249 80 h11 l-5.5 10 z" fill="var(--ink3)" />
        <path d="M40 92 h11 l-5.5 -10 z" fill="var(--ink3)" />
      </g>
      {[[150, 36, stations[0], true], [254, 90, stations[1]], [150, 143, stations[2]], [46, 90, stations[3]]].map(([x, y, label, lead], i) => (
        <text key={i} className="o3-riseline" style={{ animationDelay: `${0.55 + i * 0.42}s`, ...knock }} x={x} y={y} textAnchor="middle"
          fontFamily="var(--font)" fontWeight={lead ? 600 : 400} fontSize={lead ? 11.5 : 11} fill={lead ? 'var(--ink)' : 'var(--ink2)'}>{label}</text>
      ))}
    </svg>
  );
}
function O3_Root({ a = {}, next = () => {} }) {
  const issue = o3Issue(a);
  const t = (a.triggers || []).slice(0, 2).map((x) => x.toLowerCase());
  const when = t.length ? t.join(', ') : 'the same hours each time';
  const feel = issue.kind === 'feel';
  const head = feel
    ? <React.Fragment>Porn isn’t the problem{a.name ? `, ${a.name}` : ''}. It’s your anesthetic for {issue.word}.</React.Fragment>
    : <React.Fragment>Porn isn’t a decision{a.name ? `, ${a.name}` : ''}. It’s a loop on autopilot.</React.Fragment>;
  const stations = feel
    ? [`the ${issue.word} rises`, 'the escape', 'minutes of relief', 'back — deeper']
    : ['the cue', 'autopilot', 'the release', 'the groove deepens'];
  const caption = feel
    ? `${orCap(when)} — the ${issue.word} rises, relief lasts minutes, and the loop turns again.`
    : `The cue arrives — ${when} — and the hands run the loop without you.`;
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 24 }}>
        <O3Eyebrow style={{ marginBottom: 12 }}>What your answers show</O3Eyebrow>
        <O3H size={25}>{head}</O3H>
        <div style={{ margin: '26px 0 0', background: 'var(--card)', borderRadius: 20, padding: '18px 12px 12px' }}>
          <O3LoopArt stations={stations} />
        </div>
        <OrCaption>{caption}</OrCaption>
      </div>
      <O3CTA label="Follow it forward" onClick={next} />
    </React.Fragment>
  );
}

// ═════ 2 · IF NOTHING CHANGES — four day-grid pages ══════════════════
// week · month · year · decade. Same geometry on every page: a counting
// numeral, the grid filling in, one caption line. Each dark cell = a day.
const O3_NUMS = {
  'Several times a day': [18, 75, 900, 9000],
  'About once a day': [7, 30, 365, 3650],
  'A few times a week': [4, 15, 180, 1800],
  'About once a week': [1, 4, 52, 520],
  'A few times a month': [1, 3, 36, 360],
  'Less than once a month': [0, 1, 12, 120],
};
const orFrac = (x) => x - Math.floor(x);
const orMark = (i, rate) => orFrac(i * 0.6180339887 + 0.37) < rate + 1e-9;

// numeral count-up, eased
function orCount(n) {
  const [v, setV] = orState(0);
  orEffect(() => {
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1500);
      setV(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);
  return v;
}

// a field of day-cells that flood in one by one
function OrCells({ n, rate, cols, rows, flowCol = false, cellH, r, gap, delayEach }) {
  const wrap = flowCol
    ? { gridTemplateRows: `repeat(${rows}, ${cellH}px)`, gridAutoFlow: 'column', gridAutoColumns: '1fr' }
    : { gridTemplateColumns: `repeat(${cols}, 1fr)` };
  return (
    <div style={{ display: 'grid', width: '100%', gap, ...wrap }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="o3-cellin" style={{
          animationDelay: `${0.25 + i * delayEach}s`,
          height: cellH, borderRadius: r,
          background: orMark(i, rate) ? 'var(--ink)' : 'var(--soft2)',
        }} />
      ))}
    </div>
  );
}

// the decade: ten bands of day-dots, revealed top to bottom
function OrDecade({ rate }) {
  const dot = `color-mix(in oklab, var(--ink) ${Math.round(25 + 75 * rate)}%, var(--soft2))`;
  return (
    <div className="o3-wipereveal" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {Array.from({ length: 10 }, (_, y) => (
        <div key={y} style={{
          height: 17, borderRadius: 5,
          background: `radial-gradient(${dot} 1.25px, transparent 1.4px)`,
          backgroundSize: '4.6px 4.6px', backgroundPosition: '1.6px 1.8px',
        }} />
      ))}
    </div>
  );
}

const OR_DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function O3_CostPage({ a = {}, next = () => {}, h = 0 }) {
  const nums = O3_NUMS[a.freq] || O3_NUMS['About once a day'];
  const times = nums[h];
  const days = [7, 30, 365, 3650][h];
  const rate = Math.min(1, times / days);
  const shown = orCount(times);
  const m = h <= 1 ? Array.from({ length: days }, (_, i) => orMark(i, rate)).filter(Boolean).length : 0;
  const unit = ['times · the next week', 'times · the next month', 'times · the next year', 'times · the next ten years'][h];
  const fmtN = times.toLocaleString('en-US');
  const caption = [
    m === 7 ? (times > 7 ? 'Every one of the next seven days goes dark — some more than once.' : 'Every one of the next seven days goes dark.')
      : m === 0 ? 'A quiet week is likely — the month tells more.' : `${m} of the next seven days go dark.`,
    `${m === 30 ? 'All thirty' : m} of the next thirty days — the pace doesn’t pause on its own.`,
    `Fifty-two weeks side by side — ${fmtN} more times before this date next year.`,
    `Each band is a year. ${fmtN} more times in the next ten — unless the wiring changes.`,
  ][h];
  const cta = ['The next month', 'The next year', 'The next ten years', 'I want the other ending'][h];
  let grid;
  if (h === 0) grid = (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 7, marginBottom: 9 }}>
        {OR_DOW.map((d, i) => <span key={i} style={{ textAlign: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink4)' }}>{d}</span>)}
      </div>
      <OrCells n={7} rate={rate} cols={7} cellH={38} r={10} gap={7} delayEach={0.12} />
    </div>
  );
  else if (h === 1) grid = <OrCells n={30} rate={rate} cols={7} cellH={27} r={7} gap={6} delayEach={0.045} />;
  else if (h === 2) grid = <OrCells n={365} rate={rate} rows={7} flowCol cellH={4.4} r={1.6} gap={1.6} delayEach={0.0038} />;
  else grid = <OrDecade rate={rate} />;
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 24 }}>
        <O3Eyebrow>If nothing changes</O3Eyebrow>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 56, lineHeight: 1, minHeight: 56, color: 'var(--ink)', letterSpacing: '0.005em' }}>{shown.toLocaleString('en-US')}</div>
          <div style={{ marginTop: 9, fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{unit}</div>
        </div>
        <div style={{ margin: '22px 0 0', background: 'var(--card)', borderRadius: 20, padding: '0 18px', height: 258, display: 'flex', alignItems: 'center' }}>
          {grid}
        </div>
        <OrCaption>{caption}</OrCaption>
      </div>
      <O3CTA label={cta} onClick={next} />
    </React.Fragment>
  );
}

// ═════ 4 · THE REWIRE — projected curve, weeks I–XII ═════════════════
function O3_Rewire({ a = {}, next = () => {} }) {
  const trig = ((a.triggers || [])[0] || 'late night').toLowerCase().replace(/^after /, '');
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 24 }}>
        <O3Eyebrow style={{ marginBottom: 12 }}>The other ending</O3Eyebrow>
        <O3H size={26}>{a.name ? `${a.name}, your` : 'Your'} brain can rewire.</O3H>
        <div style={{ margin: '26px 0 0', background: 'var(--card)', borderRadius: 20, padding: '20px 16px 10px' }}>
          <svg width="100%" viewBox="0 0 300 150" fill="none" style={{ display: 'block' }}>
            {/* left alone — the grey drift up */}
            <path d="M14 58 C 90 54, 190 46, 286 34" stroke="var(--ink4)" strokeWidth="1.8" strokeDasharray="2 6" strokeLinecap="round" />
            <text x="284" y="26" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" textAnchor="end">left alone</text>
            {/* the plan — urge grip falling in three phases */}
            <path className="o3-drawslow" pathLength="1" d="M14 62 C 46 66, 66 78, 92 88 C 140 106, 196 116, 244 121 C 260 122.5, 274 123, 286 123.5" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
            {[[14, 62, 3.4], [92, 88, 3], [244, 121, 3]].map(([cx, cy, r], i) => <circle key={i} className="o3-riseline" style={{ animationDelay: `${0.5 + i * 0.7}s` }} cx={cx} cy={cy} r={r} fill="var(--ink)" />)}
            <text className="o3-riseline" style={{ animationDelay: '0.6s' }} x="20" y="44" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)">{trig} window guarded</text>
            <text className="o3-riseline" style={{ animationDelay: '1.3s' }} x="98" y="80" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)">urges shorten</text>
            <text className="o3-riseline" style={{ animationDelay: '2s' }} x="282" y="112" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)" textAnchor="end">just Tuesday</text>
            {/* week axis */}
            <path d="M14 132 h272" stroke="var(--soft2)" strokeWidth="1.5" strokeLinecap="round" />
            <text x="14" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">WK I</text>
            <text x="105" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">III</text>
            <text x="200" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">VIII</text>
            <text x="286" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em" textAnchor="end">XII</text>
          </svg>
        </div>
        <OrCaption>Twelve weeks of kept days — the {trig} window guarded, urges shorter each week, until an evening is just an evening.</OrCaption>
      </div>
      <O3CTA label="Show me my campaign" onClick={next} />
    </React.Fragment>
  );
}

// ── static boards ────────────────────────────────────────────────────
const O3Board_Root = () => (
  <O3Shell progress={0.6} onBack={() => {}} lit calm><O3_Root a={O3_DEMO} next={() => {}} /></O3Shell>
);
const O3Board_CostWeek = () => (
  <O3Shell progress={0.61} onBack={() => {}} lit calm><O3_CostPage a={O3_DEMO} h={0} next={() => {}} /></O3Shell>
);
const O3Board_CostMonth = () => (
  <O3Shell progress={0.62} onBack={() => {}} lit calm><O3_CostPage a={O3_DEMO} h={1} next={() => {}} /></O3Shell>
);
const O3Board_CostYear = () => (
  <O3Shell progress={0.63} onBack={() => {}} lit calm><O3_CostPage a={O3_DEMO} h={2} next={() => {}} /></O3Shell>
);
const O3Board_CostDecade = () => (
  <O3Shell progress={0.64} onBack={() => {}} lit calm><O3_CostPage a={O3_DEMO} h={3} next={() => {}} /></O3Shell>
);
const O3Board_Rewire = () => (
  <O3Shell progress={0.66} onBack={() => {}} lit calm><O3_Rewire a={O3_DEMO} next={() => {}} /></O3Shell>
);

Object.assign(window, {
  o3Issue, O3_Root, O3_CostPage, O3_Rewire,
  O3Board_Root, O3Board_CostWeek, O3Board_CostMonth, O3Board_CostYear, O3Board_CostDecade, O3Board_Rewire,
});
