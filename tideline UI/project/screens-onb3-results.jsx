// screens-onb3-results.jsx — the reveal pages after the reading: what
// the intake found, made personal. Two beats between the reading and
// the first tool: the arithmetic of leaving it alone (the stakes,
// stated without shame) and the projected rewiring timeline (the hope,
// with a shape). Both read straight off the intake answers.
//
// Exports: O3_Cost, O3_Rewire, O3Board_Cost, O3Board_Rewire.

const { useState: orState } = React;

const OR_FREQ_YEAR = {
  'Several times a day': ['900+', 'times'], 'About once a day': ['~365', 'times'],
  'A few times a week': ['~180', 'times'], 'About once a week': ['~52', 'times'],
  'A few times a month': ['~36', 'times'], 'Less than once a month': ['~12', 'times'],
};
const OR_DUR = {
  'Less than a year': 'under a year', '1–3 years': 'a few years', '4–10 years': 'most of a decade',
  'More than 10 years': 'over a decade', 'I can’t remember a time without it': 'most of a life',
};

// ═════ 1 · THE ARITHMETIC — the cost of unchanged, no shame ══════════
function O3_Cost({ a = {}, next = () => {} }) {
  const [n, unit] = OR_FREQ_YEAR[a.freq] || ['~365', 'times'];
  const dur = OR_DUR[a.duration] || 'years';
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 30 }}>
        <O3H size={26}>Unchanged, this happens about <span className="tnum" style={{ whiteSpace: 'nowrap' }}>{n} more {unit}</span> by next July.</O3H>
        <O3Sub style={{ marginTop: 16 }}>That’s just your own answer, multiplied by a year. It’s had {dur} — it isn’t planning to stop on its own.</O3Sub>
        {/* the drift — a quiet line that only rises */}
        <div style={{ margin: '30px 0 0', background: 'var(--card)', borderRadius: 20, padding: '18px 18px 12px' }}>
          <svg width="100%" viewBox="0 0 300 120" fill="none" style={{ display: 'block' }}>
            <path d="M14 96 h272" stroke="var(--soft2)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 78 C 80 74, 150 66, 210 52 C 240 45, 268 36, 286 26" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" className="o3-drawline" />
            <circle cx="286" cy="26" r="3.4" fill="var(--ink)" />
            <text x="14" y="112" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.08em">NOW</text>
            <text x="286" y="112" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.08em" textAnchor="end">A YEAR ON</text>
            <text x="282" y="18" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)" textAnchor="end">the pull, unattended</text>
          </svg>
        </div>
        <O3Note style={{ marginTop: 16 }}>No shame in the number. It’s only the direction that matters.</O3Note>
      </div>
      <O3CTA label="Show me the other path" onClick={next} />
    </React.Fragment>
  );
}

// ═════ 2 · THE REWIRE — projected timeline, weeks I–XII ══════════════
function O3_Rewire({ a = {}, next = () => {} }) {
  const dur = OR_DUR[a.duration] || 'years';
  const trig = ((a.triggers || [])[0] || 'late night').toLowerCase();
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 30 }}>
        <O3H size={26}>{a.name ? `${a.name} — your` : 'Your'} brain can rewire. Here’s the projected shape.</O3H>
        <O3Sub style={{ marginTop: 14 }}>After {dur}, the pathway runs deep — and it is still plastic. Twelve weeks of small, kept days bend it back.</O3Sub>
        <div style={{ margin: '28px 0 0', background: 'var(--card)', borderRadius: 20, padding: '18px 18px 10px' }}>
          <svg width="100%" viewBox="0 0 300 150" fill="none" style={{ display: 'block' }}>
            {/* left alone — the grey drift up */}
            <path d="M14 58 C 90 54, 190 46, 286 34" stroke="var(--ink4)" strokeWidth="1.8" strokeDasharray="2 6" strokeLinecap="round" />
            <text x="284" y="26" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" textAnchor="end">left alone</text>
            {/* the plan — urge grip falling in three phases */}
            <path d="M14 62 C 46 66, 66 78, 92 88 C 140 106, 196 116, 244 121 C 260 122.5, 274 123, 286 123.5" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" className="o3-drawline" />
            <circle cx="14" cy="62" r="3.4" fill="var(--ink)" />
            <circle cx="92" cy="88" r="3" fill="var(--ink)" />
            <circle cx="244" cy="121" r="3" fill="var(--ink)" />
            <text x="20" y="44" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)">{trig} window guarded</text>
            <text x="98" y="80" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)">urges shorten</text>
            <text x="282" y="112" fontFamily="var(--font)" fontSize="10.5" fill="var(--ink2)" textAnchor="end">just Tuesday</text>
            {/* week axis */}
            <path d="M14 132 h272" stroke="var(--soft2)" strokeWidth="1.5" strokeLinecap="round" />
            <text x="14" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">WK I</text>
            <text x="105" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">III</text>
            <text x="200" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em">VIII</text>
            <text x="286" y="147" fontFamily="var(--font)" fontSize="10" fill="var(--ink3)" letterSpacing="0.06em" textAnchor="end">XII</text>
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14 }}>
          {[['Stabilise', 'I–II'], ['Rewire', 'III–VIII'], ['Steady', 'IX–XII']].map(([t, w]) => (
            <span key={t} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink2)', background: 'var(--soft)', borderRadius: 9999, padding: '6px 12px' }}>{t} <span className="tnum" style={{ color: 'var(--ink3)' }}>{w}</span></span>
          ))}
        </div>
      </div>
      <O3CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}

// ── static boards ────────────────────────────────────────────────────
const O3Board_Cost = () => (
  <O3Shell progress={0.62} onBack={() => {}} lit calm><O3_Cost a={O3_DEMO} next={() => {}} /></O3Shell>
);
const O3Board_Rewire = () => (
  <O3Shell progress={0.64} onBack={() => {}} lit calm><O3_Rewire a={O3_DEMO} next={() => {}} /></O3Shell>
);

Object.assign(window, { O3_Cost, O3_Rewire, O3Board_Cost, O3Board_Rewire });
