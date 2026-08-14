// motion-vocab.jsx — VICI Phase 3 · motion & reward vocabulary, live.
// The app is black and white, so reward feedback can't come from hue —
// it comes from darkness (contrast), craft (drawn detail), touch
// (haptics) and time (pace). These five specimens are the entire
// vocabulary, built to be reused verbatim across the app.
// Boards: ink bleed · letterpress + seal · engraving draw-in ·
// deepening + held beat · haptic choreography.

const { useState: mvState, useEffect: mvEffect, useRef: mvRef } = React;

// ── specimen chrome ──────────────────────────────────────────────────
function MVFrame({ n, name, line, children, notes = [] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '68px 26px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Motion · specimen {n}</span>
        <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: 'var(--ink3)' }}>{o3Roman(parseInt(n, 10) || 1)}</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, lineHeight: 1.15, margin: '14px 0 0', color: 'var(--ink)' }}>{name}</h1>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--ink2)', margin: '10px 0 0', textWrap: 'pretty' }}>{line}</p>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
      {notes.length ? (
        <div style={{ flexShrink: 0, borderTop: '1px solid var(--line)' }}>
          {notes.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '9px 0', borderBottom: i < notes.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{k}</span>
              <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
function MVReplay({ onClick, label = 'Replay' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
      <button onClick={onClick} className="tl-press-soft" style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1.4px solid var(--soft2)', borderRadius: 9999, padding: '9px 20px', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 12.5, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4.5 5.5v4.5h4.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13a7.5 7.5 0 1 0 1.8-6.8L4.5 9.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {label}
      </button>
    </div>
  );
}

// ── the checklist row + ink bleed (shared with the reward loop) ──────
// 28px circle → the ink floods from center (~180ms), feathers at the
// edge, the check draws in, the label strikes through and fades.
function MVChecklistRow({ label, done, onToggle, last = false }) {
  return (
    <button onClick={onToggle} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 15, padding: '15px 0', borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <span style={{ position: 'relative', width: 28, height: 28, borderRadius: 9999, flexShrink: 0, boxShadow: 'inset 0 0 0 1.6px var(--soft2)', overflow: 'hidden' }}>
        {done ? <span className="o3-bleed" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'var(--fill)' }} /> : null}
        {done ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 7.5, top: 7.5 }}>
            <path className="o3-check" d="M4 12.5l5 5L20 6.5" stroke="var(--on-fill)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
          </svg>
        ) : null}
      </span>
      <span style={{ position: 'relative', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17, color: done ? 'var(--ink3)' : 'var(--ink)', transition: 'color .35s ease .15s' }}>
        {label}
        {done ? <span className="o3-strike" style={{ position: 'absolute', left: -2, right: -2, top: '54%', height: 1.4, background: 'var(--ink3)' }} /> : null}
      </span>
    </button>
  );
}
function MVInkBleedScreen() {
  const [done, setDone] = mvState({ 0: false, 1: true, 2: false });
  const toggle = (i) => setDone((s) => ({ ...s, [i]: !s[i] }));
  return (
    <MVFrame n="1" name="Ink bleed" line="The everyday reward. A drop lands at the center, floods to the edge, and settles — like ink on paper. The check draws itself; the label strikes and fades. One light haptic."
      notes={[['Flood', '180ms · ease-out'], ['Feather & settle', '+100ms'], ['Check draw', '220ms · 150ms after touch'], ['Haptic', 'light tick, on the flood']]}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '4px 20px' }}>
        <MVChecklistRow label="Drink a glass of water" done={done[0]} onToggle={() => toggle(0)} />
        <MVChecklistRow label="Take a 10-minute walk" done={done[1]} onToggle={() => toggle(1)} />
        <MVChecklistRow label="Read today's lesson" done={done[2]} onToggle={() => toggle(2)} last />
      </div>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink3)', textAlign: 'center', marginTop: 14 }}>Tap a row. Tap again to un-ink it.</div>
    </MVFrame>
  );
}

// ── letterpress stamp + the wax seal ─────────────────────────────────
function MVLetterpressScreen() {
  const [k, setK] = mvState(0);
  const words = ['Don\u2019t', 'fail', 'twice.'];
  return (
    <MVFrame n="2" name="Letterpress stamp" line="Confirmations. Letters arrive with a slight press-and-settle, timed to the haptic hit. Seals land as a wax press — down, firm double haptic, done."
      notes={[['Per word', '90ms apart · press 1.12 → 0.985 → 1'], ['Blur on entry', '1.2px → 0'], ['Seal press', '500ms · scale 1.5 → 0.94 → 1'], ['Haptic', 'single press · firm double on the seal']]}>
      <div key={k} style={{ background: 'var(--card)', borderRadius: 20, padding: '38px 24px 34px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {words.map((w, i) => (
            <span key={i} className="o3-stamp" style={{ animationDelay: `${0.15 + i * 0.09}s`, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--ink)' }}>{w}</span>
          ))}
        </div>
        <div className="o3-seal" style={{ animationDelay: '0.8s', margin: '26px auto 0', width: 58, height: 58, borderRadius: 9999, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="14" viewBox="0 0 34 20" fill="none"><path d="M3 13 C 8 5 13 5 18 10 s 10 5 13 -3" stroke="var(--on-fill)" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </div>
      </div>
      <MVReplay onClick={() => setK((v) => v + 1)} />
    </MVFrame>
  );
}

// ── engraving draw-in ────────────────────────────────────────────────
function MVEtchScreen() {
  const [k, setK] = mvState(0);
  return (
    <MVFrame n="3" name="Engraving draw-in" line="Milestones. Line art etches itself in — strokes by dash-offset, cross-hatching last — slow enough to watch, made to be screen-recorded. Nothing bursts."
      notes={[['Strokes', '≈1.2s total · staggered dash-offset'], ['Hatching', 'last 400ms'], ['End state', 'stillness — no loop'], ['Haptic', 'firm double press as the ring closes']]}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div key={k}><O3Medallion size={200} animate delay={0.25} /></div>
      </div>
      <div className="o3-stamp" key={`c${k}`} style={{ animationDelay: '2.3s', textAlign: 'center', marginTop: 20, fontFamily: 'var(--font)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink)' }}>The First Wave</div>
      <MVReplay onClick={() => setK((v) => v + 1)} />
    </MVFrame>
  );
}

// ── deepening + the held beat ────────────────────────────────────────
// The contrast spike: the rewarded line goes to full ink while the rest
// of the screen recedes to ~20% for a beat, then recovers. Slowness is
// the fanfare — the short rule draws beneath the line before life resumes.
function MVDeepeningScreen() {
  const [ph, setPh] = mvState('idle'); // idle → deep → recover
  const run = () => {
    if (ph !== 'idle') return;
    setPh('deep');
    setTimeout(() => setPh('recover'), 2600);
    setTimeout(() => setPh('idle'), 3400);
  };
  const dim = ph === 'deep';
  const fade = { transition: 'opacity .55s ease', opacity: dim ? 0.2 : 1 };
  return (
    <MVFrame n="4" name="Deepening · the held beat" line="For “you did it” moments. The eye gets its jolt from contrast, not hue — and the win is given a full beat of silence before the flow continues."
      notes={[['Recede', 'rest of screen → 20% · 550ms'], ['The hold', 'one full beat, ≈900ms'], ['The rule', '40px · draws in 500ms'], ['Recover', 'everything returns · 600ms']]}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '22px 22px 18px' }}>
        <div style={fade}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)' }}>Today's steps</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, color: 'var(--ink2)', padding: '13px 0', borderBottom: '1px solid var(--line)', textDecoration: 'line-through', textDecorationThickness: '1px' }}>Drink a glass of water</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, color: 'var(--ink2)', padding: '13px 0', borderBottom: '1px solid var(--line)', textDecoration: 'line-through', textDecorationThickness: '1px' }}>Take a 10-minute walk</div>
        </div>
        <div style={{ padding: '20px 0 6px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 21, color: 'var(--ink)', transition: 'transform .5s ease', transform: dim ? 'scale(1.02)' : 'none' }}>The day is kept.</div>
          <span aria-hidden="true" style={{ display: 'block', height: 1.5, background: 'var(--ink)', margin: '14px auto 0', width: dim ? 40 : 0, transition: 'width .5s ease .8s' }} />
        </div>
      </div>
      <MVReplay onClick={run} label={ph === 'idle' ? 'Complete the day' : '…'} />
    </MVFrame>
  );
}

// ── haptic choreography ──────────────────────────────────────────────
// Touch does the work color usually does. The palette, drawn as timing
// diagrams; tap a row to play its pulse pattern. The signature is the
// breathing-wave pattern — swelling on the crest, releasing at the break.
const MV_HAPTICS = [
  ['Light tick', 'selection · a chip picked', [[0, 0.28]]],
  ['Single press', 'a row completed', [[0, 0.75]]],
  ['Firm double', 'a seal, a milestone', [[0, 0.9], [0.22, 0.9]]],
  ['The wave', 'swells on the crest, releases at the break', 'wave'],
];
function MVPulseRow({ name, use, pattern, playing, onPlay }) {
  const isWave = pattern === 'wave';
  return (
    <button onClick={onPlay} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'var(--card)', cursor: 'pointer', width: '100%', textAlign: 'left', borderRadius: 18, padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>{name}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink2)', marginTop: 2 }}>{use}</span>
      </span>
      <span style={{ position: 'relative', width: 96, height: 34, flexShrink: 0 }}>
        {/* the timeline */}
        <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'var(--line)' }} />
        {isWave ? (
          <svg width="96" height="34" viewBox="0 0 96 34" style={{ position: 'absolute', inset: 0 }} fill="none">
            <path d="M2 26 C 20 26 30 6 48 6 C 66 6 72 26 94 26" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
            {playing ? <circle className="mv-travel" r="4" fill="var(--fill)" style={{ offsetPath: "path('M2 26 C 20 26 30 6 48 6 C 66 6 72 26 94 26')" }} /> : null}
          </svg>
        ) : (
          pattern.map(([at, str], i) => (
            <span key={i} style={{ position: 'absolute', left: `${12 + at * 90}%`, top: '50%', transform: 'translate(-50%,-50%)' }}>
              <span style={{ display: 'block', width: 5 + str * 6, height: 5 + str * 6, borderRadius: 9999, background: 'var(--ink)', opacity: 0.9 }} />
              {playing ? <span className="mv-ping" style={{ position: 'absolute', inset: -3, borderRadius: 9999, border: '1.4px solid var(--ink)', animationDelay: `${at * 0.9}s` }} /> : null}
            </span>
          ))
        )}
      </span>
    </button>
  );
}
function MVHapticsScreen() {
  const [playing, setPlaying] = mvState(null);
  const timer = mvRef(null);
  const play = (i) => {
    clearTimeout(timer.current);
    setPlaying(null);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setPlaying(i);
      timer.current = setTimeout(() => setPlaying(null), 2400);
    }));
  };
  return (
    <MVFrame n="5" name="Haptic choreography" line="A monochrome app rewards through the hand. Four patterns, used exactly and sparingly — the wave pattern runs under the breathing tool so an urge is physically felt passing."
      notes={[['Acknowledge', 'every tap, within one frame'], ['Feedback window', '200–350ms'], ['Transitions', '≤300ms · ease-out entrances'], ['Never', 'shake · bounce · burst · hue-shift']]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {MV_HAPTICS.map(([name, use, pattern], i) => (
          <MVPulseRow key={name} name={name} use={use} pattern={pattern} playing={playing === i} onPlay={() => play(i)} />
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink3)', textAlign: 'center', marginTop: 14 }}>Tap a pattern to play it.</div>
    </MVFrame>
  );
}

Object.assign(window, {
  MVFrame, MVReplay, MVChecklistRow,
  MVInkBleedScreen, MVLetterpressScreen, MVEtchScreen, MVDeepeningScreen, MVHapticsScreen,
});
