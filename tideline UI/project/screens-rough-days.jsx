// screens-rough-days.jsx — the "Rough Days" in-the-moment book, in the
// urge flow's grammar: one idea per page (a few lines, one action at the
// foot, segmented progress up top), and every situational fork asked as
// a quick questionnaire page BEFORE its tailored instruction. Data comes
// from rough-days-data.jsx.
//
// Exports: First90Screen, RoughDaysScreen, ProtocolView, RoughDaysFlow,
//          First90Board, ProtocolBoard.

const { useState: rdState } = React;

// fit any Glyph into a set box
const RDGlyph = ({ name, color = 'var(--ink)', size = 20 }) =>
  <GIcon el={(Glyph[name] || Glyph.compass)(color)} size={size} />;

const rdSectionOf = (key) => RD_SECTIONS.find((s) => s.keys.includes(key));
const rdClean = (l) => { const t = l.replace(/^if\s+/i, ''); return t.charAt(0).toUpperCase() + t.slice(1); };

// ═════ THE URGE GRAMMAR, REPLICATED ══════════════════════════════════
// segmented progress + back + close, exactly like the urge flow's TopBar
function RDTop({ total, index, onBack, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '60px 29px 0', gap: 14, flexShrink: 0 }}>
      <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex', visibility: onBack ? 'visible' : 'hidden' }}>
        <svg width="10" height="17" viewBox="0 0 10 18"><path d="M8.5 1.5L1.5 9l7 7.5" stroke="var(--ink)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= index ? 'var(--ink)' : 'var(--soft2)', transition: 'background .25s' }} />
        ))}
      </div>
      <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex' }}>
        <svg width="16" height="16" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink2)" strokeWidth="2.3" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

// one calm page: label · headline · a few quiet lines · one action
function RDPage({ label, headline, sub, small, cta = 'Done — next', onNext, ghost, hSize = 30 }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1 }} />
      <div className="urge-fade" style={{ padding: '0 30px', textAlign: 'center' }}>
        {label ? <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 14 }}>{label}</div> : null}
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: hSize, lineHeight: 1.16, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)', textWrap: 'balance' }}>{headline}</h2>
        {sub ? <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.55, fontWeight: 400, color: 'var(--ink2)', margin: '15px auto 0', maxWidth: 300, textWrap: 'pretty' }}>{sub}</p> : null}
        {small}
      </div>
      <div style={{ flex: 1.15 }} />
      <div style={{ padding: '0 29px 30px', flexShrink: 0 }}>
        <PillButton full size={15.5} style={{ padding: '16px 0' }} onClick={onNext}>{cta}</PillButton>
        {ghost}
      </div>
    </React.Fragment>
  );
}

// the questionnaire page: white cells, a radio that floods ink, Continue
function RDAsk({ label, title, options, onPick }) {
  const [sel, setSel] = rdState(null);
  return (
    <React.Fragment>
      <div className="urge-fade" style={{ padding: '26px 29px 0', textAlign: 'center' }}>
        {label ? <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 12 }}>{label}</div> : null}
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 28, lineHeight: 1.14, letterSpacing: '0.01em', margin: 0, color: 'var(--ink)', textWrap: 'balance' }}>{title}</h2>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 29px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(([k, lab], i) => {
          const on = sel === i;
          return (
            <button key={k || i} onClick={() => setSel(i)} className="tl-press-soft" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              display: 'flex', alignItems: 'center', gap: 13, background: 'var(--card)', borderRadius: 18,
              padding: '16px 17px', boxShadow: on ? 'inset 0 0 0 1.8px var(--ink)' : 'none', flexShrink: 0,
            }}>
              <span style={{ width: 19, height: 19, borderRadius: 9999, flexShrink: 0, border: on ? 'none' : '1.6px solid var(--soft2)', background: on ? 'var(--fill)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                {on ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5l4.6 4.6L19.5 7" stroke="var(--on-fill)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              </span>
              <span style={{ fontFamily: 'var(--font)', fontWeight: on ? 600 : 500, fontSize: 14.5, lineHeight: 1.35, color: 'var(--ink)' }}>{lab}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '20px 29px 30px', flexShrink: 0 }}>
        <PillButton full size={15.5} style={{ padding: '16px 0', opacity: sel == null ? 0.34 : 1 }} onClick={sel == null ? undefined : () => onPick(sel, options[sel][0])}>Continue</PillButton>
      </div>
    </React.Fragment>
  );
}

// the flow shell — paper ground, progress, one page at a time
function RDShell({ total, index, onBack, onClose, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', fontFamily: 'var(--font)', color: 'var(--ink)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <RDTop total={total} index={index} onBack={onBack} onClose={onClose} />
      <div key={index} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

// ═════ 1 · THE FIRST 90 SECONDS — two asks, then one move per page ═══
function First90Screen({ onClose = () => {}, onLibrary = () => {}, onDone = () => {} }) {
  const [i, setI] = rdState(0);
  const [where, setWhere] = rdState('phone');
  const [tap, setTap] = rdState('yes');
  const steps = RD_FIRST90.steps(where, tap);
  // pages: ask(where) · steps 1-3 · ask(tap) · steps 4-6 · done
  const total = 9;
  const next = () => setI((v) => Math.min(total - 1, v + 1));
  const back = i > 0 ? () => setI(i - 1) : null;
  const stepPage = (s, n) => (
    <RDPage label={`Move ${n} of 6`} headline={s.h} sub={s.s} cta={n === 6 ? 'Done' : 'Done — next'} onNext={next} />
  );
  return (
    <RDShell total={total} index={i} onBack={back} onClose={onClose}>
      {i === 0 ? <RDAsk label="The First 90 Seconds" title={RD_FIRST90.where.q} options={RD_FIRST90.where.options} onPick={(_, k) => { setWhere(k); next(); }} /> : null}
      {i >= 1 && i <= 3 ? stepPage(steps[i - 1], i) : null}
      {i === 4 ? <RDAsk label="One more thing" title={RD_FIRST90.tap.q} options={RD_FIRST90.tap.options} onPick={(_, k) => { setTap(k); next(); }} /> : null}
      {i >= 5 && i <= 7 ? stepPage(steps[i - 2], i - 1) : null}
      {i === 8 ? (
        <RDPage label="The interrupt, run" headline="Most urges are past their peak by now." sub="If your day has a specific shape to it, take the page that matches." cta="Find the page for my day" onNext={onLibrary}
          ghost={<div style={{ textAlign: 'center', marginTop: 12 }}><button onClick={onDone} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink2)', padding: '4px 8px' }}>I’m steady now</button></div>} />
      ) : null}
    </RDShell>
  );
}

// ═════ 2 · A PROTOCOL — moment → do-this-first → ask → move → hold ═══
// builds the page list from the data: any step with 2+ situational
// variants gets a questionnaire page before its tailored instruction
function pfPages(p) {
  const pages = [{ kind: 'moment' }];
  p.first.forEach((_, i) => pages.push({ kind: 'first', i }));
  p.steps.forEach((s, i) => {
    if (s.ifs && s.ifs.length >= 2) pages.push({ kind: 'ask', i });
    pages.push({ kind: 'step', i });
  });
  if (p.still) pages.push({ kind: 'still' });
  pages.push({ kind: 'hold' });
  return pages;
}

function ProtocolView({ pkey, onBack = () => {}, onFirst90 = () => {} }) {
  const p = RD_PROTOCOLS[pkey];
  const [i, setI] = rdState(0);
  const [ans, setAns] = rdState({});
  if (!p) return null;
  const pages = pfPages(p);
  const pg = pages[i];
  const next = () => (i + 1 >= pages.length ? onBack() : setI(i + 1));
  const back = i > 0 ? () => setI(i - 1) : null;
  const nSteps = p.steps.length;

  let body = null;
  if (pg.kind === 'moment') {
    body = <RDPage label={rdSectionOf(pkey) ? rdSectionOf(pkey).label : 'Rough days'} headline={p.title} sub={p.moment} cta="Begin" onNext={next}
      ghost={<div style={{ textAlign: 'center', marginTop: 12 }}><button onClick={onFirst90} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink2)', padding: '4px 8px' }}>Urge live right now? <b style={{ color: 'var(--ink)', fontWeight: 600 }}>First 90 Seconds</b> →</button></div>} />;
  } else if (pg.kind === 'first') {
    body = <RDPage label="Do this first" headline={p.first[pg.i]} hSize={27} cta="Done" onNext={next} />;
  } else if (pg.kind === 'ask') {
    const s = p.steps[pg.i];
    const opts = s.ifs.map(([l], k) => [k, rdClean(l)]);
    if (s.d) opts.push([-1, 'Neither, really']);
    body = <RDAsk key={`a${pg.i}`} label={`Step ${pg.i + 1} of ${nSteps}`} title="Which is closest?" options={opts}
      onPick={(idx, k) => { setAns((a) => ({ ...a, [pg.i]: opts[idx][0] })); next(); }} />;
  } else if (pg.kind === 'step') {
    const s = p.steps[pg.i];
    const pick = ans[pg.i];
    let sub = s.d || null, small = null;
    if (s.ifs && s.ifs.length >= 2) {
      sub = pick === -1 || pick == null ? (s.d || s.ifs[0][1]) : s.ifs[pick][1];
    } else if (s.ifs && s.ifs.length === 1) {
      small = <p style={{ fontFamily: 'var(--font)', fontSize: 12.5, lineHeight: 1.5, fontWeight: 400, color: 'var(--ink3)', margin: '12px auto 0', maxWidth: 290 }}><b style={{ color: 'var(--ink2)', fontWeight: 600 }}>{rdClean(s.ifs[0][0])}:</b> {s.ifs[0][1]}</p>;
    }
    body = <RDPage label={`Step ${pg.i + 1} of ${nSteps}`} headline={s.t} sub={sub} small={small} hSize={28}
      cta={pg.i + 1 === nSteps && !p.still ? 'Done' : 'Done — next'} onNext={next} />;
  } else if (pg.kind === 'still') {
    body = <RDPage label="One more, if you need it" headline="If it’s still loud" sub={p.still} hSize={28} cta="Okay" onNext={next} />;
  } else {
    body = <RDPage label="Hold the line" headline={p.hold} hSize={25} cta="I got through it" onNext={onBack}
      small={p.basis ? <p style={{ fontFamily: 'var(--font)', fontSize: 11.5, lineHeight: 1.5, fontWeight: 400, color: 'var(--ink3)', margin: '16px auto 0', maxWidth: 280 }}>{p.basis}</p> : null} />;
  }

  return <RDShell total={pages.length} index={i} onBack={back} onClose={onBack}>{body}</RDShell>;
}

// ═════ 3 · THE LIBRARY — unchanged: the whole book, grouped ══════════
function RoughDaysScreen({ onOpen = () => {}, onFirst90 = () => {} }) {
  return (
    <Shell pad={0} top={0} tab={<TabBar active="log" />}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '60px 26px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}><BackChevron onClick={() => {}} /></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '0.01em', color: 'var(--ink)', margin: '12px 0 0' }}>Rough days</h1>
        <p style={{ fontFamily: 'var(--font)', fontSize: 14.5, lineHeight: 1.5, fontWeight: 400, color: 'var(--ink2)', margin: '10px 0 0', textWrap: 'pretty' }}>Open the page that matches your moment. One move at a time — no reading ahead.</p>

        {/* the universal interrupt — always first, always one tap away */}
        <button onClick={onFirst90} className="tl-press-soft" style={{ appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: 22, background: '#141414', borderRadius: 20, padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 9999, background: 'rgba(245,244,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RDGlyph name="spark" color="#F5F4F1" size={24} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.55)' }}>An urge, right now?</span>
            <span style={{ display: 'block', fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20, color: '#F5F4F1', marginTop: 4 }}>The First 90 Seconds</span>
          </span>
          <span style={{ flexShrink: 0 }}><RDGlyph name="chevR" color="rgba(245,244,241,0.5)" size={14} /></span>
        </button>

        {/* the sections */}
        {RD_SECTIONS.map((sec) => (
          <div key={sec.label} style={{ marginTop: 32 }}>
            <SectionLabel right={`${sec.keys.length}`}>{sec.label}</SectionLabel>
            <div style={{ background: 'var(--card)', borderRadius: 20, marginTop: 10, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)' }}>
              {sec.keys.map((key, i) => {
                const p = RD_PROTOCOLS[key];
                return (
                  <button key={key} onClick={() => onOpen(key)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', background: 'transparent', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < sec.keys.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <IconChip icon={<RDGlyph name={p.icon} color="var(--ink)" size={19} />} size={38} />
                    <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, color: 'var(--ink)' }}>{p.title}</span>
                    <span style={{ flexShrink: 0 }}><RDGlyph name="chevR" color="var(--ink4)" size={13} /></span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 16, lineHeight: 1.45, color: 'var(--ink3)', textAlign: 'center', margin: '34px auto 0', maxWidth: 260, textWrap: 'balance' }}>Nothing here resets your progress. A hard day is weather, not a verdict.</p>
      </div>
    </Shell>
  );
}

// ═════ FLOW + BOARDS ═════════════════════════════════════════════════
function RoughDaysFlow() {
  const [route, setRoute] = rdState({ v: 'lib', key: null });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <RoughDaysScreen onOpen={(key) => setRoute({ v: 'protocol', key })} onFirst90={() => setRoute({ v: 'first90' })} />
      {route.v === 'protocol' ? <ProtocolView key={route.key} pkey={route.key} onBack={() => setRoute({ v: 'lib' })} onFirst90={() => setRoute({ v: 'first90' })} /> : null}
      {route.v === 'first90' ? <First90Screen onClose={() => setRoute({ v: 'lib' })} onLibrary={() => setRoute({ v: 'lib' })} onDone={() => setRoute({ v: 'lib' })} /> : null}
    </div>
  );
}

const First90Board = () => <First90Screen />;
const ProtocolBoard = () => <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><ProtocolView pkey="loneliness" onBack={() => {}} /></div>;

Object.assign(window, { First90Screen, RoughDaysScreen, ProtocolView, RoughDaysFlow, First90Board, ProtocolBoard });
