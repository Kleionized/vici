// screens-onb.jsx — VICI onboarding funnel (20 screens).
// Calm-monochrome base + QUITTR-style funnel momentum + an immersive atmosphere
// layer (Stage/Aura) whose subtle low-chroma hue shifts through the funnel.
// Pairs with screens-onb-art.jsx.

const { useState: oState, useEffect: oEffect, useRef: oRef } = React;

// accent hue — tuned to the home screen's periwinkle-blue (--warm / #A8B4DC).
// The whole funnel's chrome/illustration glow stays in this cool band so it
// reads as the same app as Today (no turquoise/teal/green in the chrome).
const BRAND = 262;
const HUE = {
  welcome: BRAND, lesson: [BRAND, BRAND, BRAND], assess: BRAND, quiz: BRAND, scroll: BRAND,
  why: BRAND, analysis: BRAND, plan: BRAND, social: 40, pledge: BRAND, notify: BRAND, signin: BRAND, done: BRAND,
};

// unified funnel progress: one continuous bar across the 13 guided steps
const PROG_N = 17;
const PHASE = { assess: 'Assessment', plan: 'Your plan', commit: 'Commitment', setup: 'Setup' };

// ── content model ────────────────────────────────────────────────────
const Q_FREQ = [
  ['Several times a day', 'It interrupts the day'],
  ['About once a day', 'A familiar daily pull'],
  ['A few times a week', 'It comes and goes'],
  ['Now and then', 'Occasional, but real'],
];
const Q_DURATION = [
  ['Under a year', null], ['1–3 years', null], ['3–5 years', null],
  ['More than 5 years', null], ['As long as I can remember', null],
];
const Q_TRIGGERS = [
  ['Late at night', (c) => Glyph.moon(c)],
  ['Stress or anxiety', (c) => Glyph.wave(c)],
  ['Boredom', (c) => Glyph.clock(c)],
  ['Feeling low', (c) => Glyph.heart(c)],
  ['Loneliness', (c) => Glyph.user(c)],
  ['Endless scrolling', (c) => Glyph.search(c)],
  ['Tired & depleted', (c) => Glyph.leaf(c)],
  ['After a win', (c) => Glyph.star(c)],
];
const Q_IMPACT = [
  ['Focus & memory', (c) => Glyph.spark(c)],
  ['Energy & drive', (c) => Glyph.sun(c)],
  ['Mood', (c) => Glyph.heart(c)],
  ['Sleep', (c) => Glyph.moon(c)],
  ['Confidence', (c) => Glyph.shield(c)],
  ['Relationships', (c) => Glyph.user(c)],
];
const Q_GOALS = ['Clear focus', 'Steady energy', 'Real confidence', 'A calmer mood', 'Deeper relationships', 'Self-respect', 'Better sleep', 'To feel free'];

// ── shared layout helpers ────────────────────────────────────────────
function OnbBody({ children }) {
  return <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>;
}
function OnbFoot({ children }) {
  return <div style={{ paddingTop: 16 }}>{children}</div>;
}
function OnbEyebrow({ children, hue = 200, style = {} }) {
  return <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink3)', ...style }}>{children}</span>;
}
function Lead({ children, style = {} }) {
  return <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink2)', fontWeight: 500, margin: 0, textWrap: 'pretty', ...style }}>{children}</p>;
}
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', borderRadius: 10 }}>
      <svg width="13" height="22" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke="var(--ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}

// ── 1 · WELCOME A (the tide motif) ───────────────────────────────────
function OnbWelcomeA({ onNext, onSignIn }) {
  return (
    <Stage hue={HUE.welcome} pad={26} top={74}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 16, letterSpacing: '0.26em', color: 'var(--ink)' }}>VICI</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="onb-rise" style={{ width: '100%', marginBottom: 36 }}><HeroCard hue={HUE.welcome} h={272}><TideScene hue={HUE.welcome} w={244} h={156} /></HeroCard></div>
        <Hero size={42} style={{ textAlign: 'center' }}>Conquer it for good.</Hero>
      </div>
      <OnbFoot>
        <NextPill label="Begin" onClick={onNext} />
        <div style={{ textAlign: 'center', marginTop: 12 }}><GhostButton size={15} onClick={onSignIn}>I already have an account</GhostButton></div>
      </OnbFoot>
    </Stage>
  );
}

// ── WELCOME B (manifesto) ────────────────────────────────────────────
function OnbWelcomeB({ onNext, onSignIn }) {
  return (
    <Stage hue={HUE.welcome} pad={26} top={74}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 16, letterSpacing: '0.26em', color: 'var(--ink)' }}>VICI</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, lineHeight: 1.12, letterSpacing: '0.01em', color: 'var(--ink)', margin: 0, textWrap: 'balance' }}>
          You came.<br />
          You see it clearly.<br />
          Now, conquer it.
        </h1>
        <div className="onb-bob" style={{ marginTop: 30, maxWidth: 280 }}>{Illo.waveline(tint(HUE.welcome, 0.55, 0.09), { w: 280, h: 26, opacity: 0.8 })}</div>
      </div>
      <OnbFoot>
        <NextPill label="Start" onClick={onNext} />
        <div style={{ textAlign: 'center', marginTop: 12 }}><GhostButton size={15} onClick={onSignIn}>I already have an account</GhostButton></div>
      </OnbFoot>
    </Stage>
  );
}

// ── 2–4 · EDUCATIONAL CAROUSEL ───────────────────────────────────────
const LESSONS = [
  {
    art: SlideArt.wave, hue: HUE.lesson[0], title: 'It’s not a willpower problem.',
    body: (<span>Every time you used porn, your brain banked a fast hit of dopamine and wired a shortcut to get it again. <strong style={{ color: 'var(--ink)' }}>Willpower fights that wiring. VICI rewires it.</strong></span>),
    short: 'Your brain wired a shortcut. We rewire it.',
    press: false,
  },
  {
    art: SlideArt.rewire, hue: HUE.lesson[1], title: 'Your brain can change.',
    body: (<span>The same system that built the habit can take it apart. With the right daily reps, most people feel the fog start to lift inside <strong style={{ color: 'var(--ink)' }}>the first two weeks</strong>.</span>),
    short: 'Most feel the fog lift within two weeks.',
    press: true,
  },
  {
    art: SlideArt.steps, hue: HUE.lesson[2], title: 'Small steps beat big resets.',
    body: (<span>Forget all-or-nothing. A slip isn’t a failure — it’s data. <strong style={{ color: 'var(--ink)' }}>One honest check-in a day</strong> is what actually moves the needle.</span>),
    short: 'Progress that builds — not a streak that resets.',
    press: false,
  },
  {
    art: SlideArt.anchor, hue: BRAND, title: 'You won’t do it on willpower alone.',
    short: 'A calm urge tool for the five minutes that decide it.',
    press: false,
  },
  {
    art: SlideArt.wave, hue: BRAND, title: '80,000 people, same tide.',
    short: 'A private circle that has walked this exact path.',
    press: false,
  },
];
function OnbLesson({ idx, onNext, onBack }) {
  const L = LESSONS[idx];
  return (
    <Stage hue={L.hue} intensity={0.9} pad={26} top={74}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}><BackBtn onClick={onBack} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div key={idx} className="onb-rise" style={{ width: '100%', marginBottom: 38 }}><HeroCard hue={L.hue} h={252}>{L.art(L.hue)}</HeroCard></div>
        <Hero size={32} style={{ textAlign: 'center', maxWidth: 330 }}>{L.title}</Hero>
        {L.press ? <div style={{ marginTop: 34, width: '100%' }}><PressRow /></div> : null}
      </div>
      <OnbFoot>
        <div style={{ marginBottom: 20 }}><PagerDots n={LESSONS.length} i={idx} hue={L.hue} /></div>
        <NextPill label={idx === LESSONS.length - 1 ? 'Continue' : 'Next'} onClick={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 5 · ASSESSMENT INTRO ─────────────────────────────────────────────
function OnbAssessIntro({ onNext, onBack }) {
  return (
    <Stage hue={HUE.assess} pad={26} top={74}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}><BackBtn onClick={onBack} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="onb-rise" style={{ width: '100%', marginBottom: 34 }}><HeroCard hue={HUE.assess} h={232}>{SlideArt.anchor(HUE.assess)}</HeroCard></div>
        <OnbEyebrow hue={HUE.assess}>2 minutes</OnbEyebrow>
        <Hero size={34} style={{ textAlign: 'center', marginTop: 16, maxWidth: 320 }}>A few honest questions.</Hero>
      </div>
      <OnbFoot><NextPill label="Start" onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 6 · NAME ─────────────────────────────────────────────────────────
function OnbName({ value, onChange, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.quiz} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={30}>What should we call you?</Ask>
        <div style={{ marginTop: 32 }}>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Your name"
            style={{ width: '100%', appearance: 'none', border: 'none', outline: 'none', background: 'var(--card)', boxShadow: 'none', borderRadius: 16, padding: '18px 20px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.005em' }} />
        </div>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" enabled={!!(value || '').trim()} onClick={onNext} />
        <div style={{ textAlign: 'center', marginTop: 10 }}><GhostButton size={15} onClick={onNext}>Skip for now</GhostButton></div>
      </OnbFoot>
    </Stage>
  );
}

// ── 7–8 · SINGLE-SELECT QUESTION ─────────────────────────────────────
function OnbSingle({ title, lead, options, value, onPick, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.quiz} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.quiz} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>{title}</Ask>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 30, overflow: 'auto', paddingBottom: 4 }}>
          {options.map(([label, sub]) => (
            <OptionRow key={label} label={label} sub={sub} single hue={HUE.quiz} selected={value === label} onClick={() => onPick(label)} />
          ))}
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Continue" enabled={!!value} onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 9 · MULTI-SELECT LIST (triggers, with icons) ─────────────────────
function OnbMultiList({ title, lead, options, selected, onToggle, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>{title}</Ask>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28, overflow: 'auto', paddingBottom: 4 }}>
          {options.map(([label, icon]) => (
            <OptionRow key={label} label={label} icon={icon('var(--ink)')} hue={HUE.scroll} selected={selected.includes(label)} onClick={() => onToggle(label)} />
          ))}
        </div>
      </OnbBody>
      <OnbFoot><NextPill label={selected.length ? `Continue · ${selected.length}` : 'Continue'} enabled={selected.length > 0} onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 10 · MULTI-SELECT TILES (impact, 2-col) ──────────────────────────
function ImpactTile({ label, icon, on, onClick }) {
  return (
    <button onClick={onClick} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, padding: '18px 18px', borderRadius: 18,
      background: on ? tint(HUE.scroll, 0.68, 0.07, 0.16) : 'var(--card)',
      boxShadow: on ? `inset 0 0 0 1.8px ${tint(HUE.scroll, 0.55, 0.1)}` : 'none',
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: on ? tint(HUE.scroll, 0.5, 0.12) : 'var(--soft)', boxShadow: on ? 'none' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s, box-shadow .15s' }}>
        <span style={{ display: 'inline-flex', width: 22, height: 22 }}>{icon(on ? '#fff' : 'var(--ink)')}</span>
      </div>
      <span style={{ fontFamily: 'var(--font)', fontWeight: on ? 500 : 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal', textAlign: 'left' }}>{label}</span>
    </button>
  );
}
function OnbImpact({ selected, onToggle, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>What has it been touching?</Ask>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28, overflow: 'auto', paddingBottom: 4 }}>
          {Q_IMPACT.map(([label, icon]) => (
            <ImpactTile key={label} label={label} icon={icon} on={selected.includes(label)} onClick={() => onToggle(label)} />
          ))}
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Continue" enabled={selected.length > 0} onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 11 · GOALS (pill wrap) ───────────────────────────────────────────
function GoalPill({ label, on, onClick }) {
  return (
    <button onClick={onClick} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none', fontFamily: 'var(--font)', fontWeight: on ? 500 : 500, fontSize: 14.5,
      padding: '13px 19px', borderRadius: 9999, letterSpacing: '-0.005em',
      background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)', color: on ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: on ? 'none' : 'none',
    }}>{label}</button>
  );
}
function OnbGoals({ selected, onToggle, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>What do you want back?</Ask>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11, marginTop: 30, alignContent: 'flex-start', overflow: 'auto' }}>
          {Q_GOALS.map((g) => <GoalPill key={g} label={g} on={selected.includes(g)} onClick={() => onToggle(g)} />)}
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Continue" enabled={selected.length > 0} onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 12 · WHY (free-write) ────────────────────────────────────────────
function OnbWhy({ value, onChange, onNext, onBack, barI }) {
  return (
    <Stage hue={HUE.why} intensity={0.5} pad={26} top={74}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.why} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>Last one — why now?</Ask>
        <div style={{ marginTop: 28, flex: 1, minHeight: 0 }}>
          <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="I want this because…"
            style={{ width: '100%', height: '100%', minHeight: 150, resize: 'none', appearance: 'none', border: 'none', outline: 'none', background: 'var(--card)', boxShadow: 'none', borderRadius: 18, padding: '18px 20px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, lineHeight: 1.5, color: 'var(--ink)' }} />
        </div>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Build my plan" enabled={!!(value || '').trim()} onClick={onNext} />
        <div style={{ textAlign: 'center', marginTop: 10 }}><GhostButton size={15} onClick={onNext}>Skip — I’ll add this later</GhostButton></div>
      </OnbFoot>
    </Stage>
  );
}

// ── 13 · ANALYSIS (loading) ──────────────────────────────────────────
const ANALYSIS_STEPS = ['Reading your answers', 'Mapping your triggers', 'Shaping your 90-day plan'];
function OnbAnalysis({ live = false, onDone }) {
  const [pct, setPct] = oState(live ? 0 : 1);
  oEffect(() => {
    if (!live) return;
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(1, v + 0.025);
      setPct(v);
      if (v >= 1) { clearInterval(id); setTimeout(() => onDone && onDone(), 760); }
    }, 55);
    return () => clearInterval(id);
  }, [live]);
  const done = Math.floor(pct * 3 + 0.0001);
  const complete = pct >= 1;
  const celeb = (window.CURRENT_ONB && window.CURRENT_ONB.celebrate) || 'medium';
  return (
    <Stage hue={HUE.analysis} intensity={0.95} pad={26} top={74}>
      {complete ? <Particles mode={celeb} /> : null}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingRing pct={pct} hue={HUE.analysis} />
        <Hero size={26} style={{ marginTop: 30, textAlign: 'center' }}>{complete ? 'Your plan is ready.' : 'Building your plan…'}</Hero>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14, width: 250 }}>
          {ANALYSIS_STEPS.map((s, k) => {
            const isDone = k < done || pct >= 1;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: k <= done || pct >= 1 ? 1 : 0.35, transition: 'opacity .3s' }}>
                <div style={{ width: 22, height: 22, borderRadius: 9999, flexShrink: 0, background: isDone ? tint(HUE.analysis, 0.5, 0.12) : 'transparent', boxShadow: isDone ? 'none' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .25s, box-shadow .25s' }}>
                  {isDone ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </div>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

// ── 14 · PATTERN READOUT (your plan) ─────────────────────────────────
function OnbPattern({ name = 'there', topTrigger = 'Late nights', toll = 'Focus & sleep', onNext, onBack }) {
  return (
    <Stage hue={HUE.plan} intensity={0.9} pad={26} top={74}>
      <OnbBar i={12} n={PROG_N} phase={PHASE.plan} hue={HUE.plan} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <div style={{ overflow: 'auto', paddingBottom: 8 }}>
          <OnbEyebrow hue={HUE.plan}>Your pattern</OnbEyebrow>
          <Hero size={32} style={{ marginTop: 14 }}>A moderate, workable pattern.</Hero>
          <div style={{ margin: '46px 2px 0' }}><PatternMeter level={0.56} label="Moderate" /></div>
          <div style={{ marginTop: 42 }}>
            <StatRow icon={Glyph.wave('var(--ink2)')} label="Most active trigger" value={topTrigger} />
            <div style={{ height: 1, background: 'var(--line)' }} />
            <StatRow icon={Glyph.spark('var(--ink2)')} label="Likely toll" value={toll} />
            <div style={{ height: 1, background: 'var(--line)' }} />
            <StatRow icon={Glyph.flag('var(--ink2)')} label="Your edge" value="You showed up" />
          </div>
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="See what’s ahead" onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 15 · PROJECTION ──────────────────────────────────────────────────
function OnbProjection({ onNext, onBack }) {
  const milestones = [
    ['Day 7', 'The fog starts to lift'],
    ['Day 30', 'Urges get quieter, shorter'],
    ['Day 90', 'A new normal — by default'],
  ];
  return (
    <Stage hue={HUE.plan} intensity={0.9} pad={26} top={74}>
      <OnbBar i={13} n={PROG_N} phase={PHASE.plan} hue={HUE.plan} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <div style={{ overflow: 'auto', paddingBottom: 8 }}>
          <OnbEyebrow hue={HUE.plan}>Your 90 days</OnbEyebrow>
          <Hero size={32} style={{ marginTop: 14 }}>It builds — and it stays.</Hero>
          <div style={{ margin: '34px 0 8px' }}><ProjectionChart /></div>
          <div style={{ marginTop: 26 }}>
            {milestones.map(([d, t], i) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                <div style={{ width: 58, flexShrink: 0, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{d}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Continue" onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 16 · SOCIAL PROOF ────────────────────────────────────────────────
function OnbSocial({ onNext, onBack }) {
  return (
    <Stage hue={HUE.social} intensity={0.85} pad={26} top={74}>
      <OnbBar i={15} n={PROG_N} phase={PHASE.plan} hue={HUE.social} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <div style={{ overflow: 'auto', paddingBottom: 8 }}>
          <Hero size={33}>You’re in good company.</Hero>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
            <AvatarStack items={['J', 'M', 'A', 'K']} />
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink2)' }}>
              <strong style={{ color: 'var(--ink)' }}>80,000+</strong> people starting over
            </div>
          </div>
          {/* one voice, given room — no boxes */}
          <div style={{ margin: '48px 2px 0' }}>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 42, lineHeight: 0.6, color: 'var(--ink4)' }}>“</div>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 19, lineHeight: 1.5, color: 'var(--ink)', margin: '12px 0 0', letterSpacing: '-0.005em', textWrap: 'pretty' }}>
              The plan felt like it actually knew me. Three months in and the constant noise in my head is just… gone.
            </p>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', marginTop: 14 }}>Marcus · three months in</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '42px 2px 0', paddingTop: 22, borderTop: '1px solid var(--line)' }}>
            <MiniStars n={5} size={13} color="var(--ink)" />
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink2)' }}>4.8 on the App Store · 12k reviews</span>
          </div>
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Continue" onClick={onNext} /></OnbFoot>
    </Stage>
  );
}

// ── 17 · COMMITMENT / PLEDGE ─────────────────────────────────────────
function OnbPledge({ name = '', why = '', onNext, onBack }) {
  const [signed, setSigned] = oState(false);
  return (
    <Stage hue={HUE.pledge} intensity={0.85} pad={26} top={74}>
      <OnbBar i={11} n={PROG_N} phase={PHASE.commit} hue={HUE.pledge} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <OnbEyebrow hue={HUE.pledge}>Commitment</OnbEyebrow>
        <Hero size={32} style={{ marginTop: 14 }}>Make it yours.</Hero>
        <div style={{ marginTop: 22, background: 'var(--card)', borderRadius: 'var(--radius)', padding: 22, boxShadow: 'var(--shadow-pop)' }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 18, lineHeight: 1.5, color: 'var(--ink)', margin: 0 }}>
            I’m choosing to show up — not to be perfect, but to begin.{why ? <span style={{ color: 'var(--ink2)' }}> {why.trim().replace(/\.$/, '')}.</span> : ''} Today is day zero.
          </p>
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px dashed var(--soft2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)' }}>{name || 'You'}</div>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', marginTop: 4, letterSpacing: '0.04em' }}>SIGNED · DAY 0</div>
            </div>
            {signed
              ? <div key="seal" className="onb-stamp" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9999, background: tint(HUE.pledge, 0.5, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tint(HUE.pledge, 0.5, 0.11) }}>Sealed</span>
                </div>
              : Glyph.anchor(tint(HUE.pledge, 0.55, 0.1))}
          </div>
        </div>
      </OnbBody>
      <OnbFoot>
        <button onClick={() => setSigned((s) => !s)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 16px', width: '100%' }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: signed ? tint(HUE.pledge, 0.5, 0.12) : 'transparent', boxShadow: signed ? 'none' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s, box-shadow .2s' }}>
            {signed ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
          </div>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', textAlign: 'left' }}>I’m committing to myself, starting now.</span>
        </button>
        <NextPill label="Continue" enabled={signed} onClick={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 18 · NOTIFICATIONS ───────────────────────────────────────────────
function OnbNotify({ onNext, onBack }) {
  // the nudge itself, exactly as it will arrive — shown, not described
  const NudgeBanner = ({ time, title, body, ghost = false }) => (
    <div className={ghost ? undefined : 'tl-glass'} style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: ghost ? 'rgba(255,255,255,0.62)' : undefined,
      borderRadius: 20, padding: '13px 16px',
      boxShadow: ghost ? 'none' : 'none',
      opacity: ghost ? 0.55 : 1, transform: ghost ? 'scale(0.97)' : 'none', transformOrigin: 'top center',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Laurel size={20} color={'var(--on-fill)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink)' }}>VICI</span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink3)' }}>{time}</span>
        </div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', marginTop: 2 }}>{title}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink2)', marginTop: 1, lineHeight: 1.35 }}>{body}</div>
      </div>
    </div>
  );
  return (
    <Stage hue={HUE.notify} intensity={0.85} pad={26} top={74}>
      <OnbBar i={17} n={PROG_N} phase={PHASE.setup} hue={HUE.notify} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 26px' }}>
          <div className="onb-bob" style={{ width: 84, height: 84, borderRadius: 9999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 6px rgba(0,0,0,0.05), 0 16px 36px ${tint(HUE.notify, 0.6, 0.1, 0.18)}` }}>{Glyph.bell('var(--ink)')}</div>
        </div>
        <Hero size={31} style={{ textAlign: 'center' }}>One gentle nudge a day.</Hero>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 42 }}>
          <NudgeBanner time="now" title="Morning check-in" body="Twenty seconds — where’s your head at today?" />
          <NudgeBanner ghost time="10:41 PM" title="Late night ahead" body="Your risky window. The wave tool is one tap away." />
        </div>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink3)', textAlign: 'center', margin: '28px auto 0', maxWidth: 280, lineHeight: 1.45 }}>
          Never a streak alarm — just a note worth opening.
        </p>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Turn on reminders" onClick={onNext} arrow={false} />
        <div style={{ textAlign: 'center', marginTop: 10 }}><GhostButton size={15} onClick={onNext}>Not now</GhostButton></div>
      </OnbFoot>
    </Stage>
  );
}

// ── 19 · SIGN IN ─────────────────────────────────────────────────────
function AuthButton({ icon, label, dark = false, onClick }) {
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, padding: '17px 22px', borderRadius: 9999,
      background: dark ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)', color: dark ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: dark ? 'none' : 'none',
      fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, letterSpacing: 'normal',
    }}>
      <span style={{ display: 'inline-flex', width: 20, height: 20 }}>{icon(dark ? 'var(--on-fill)' : 'var(--ink)')}</span>
      {label}
    </button>
  );
}
function OnbSignIn({ onNext, onBack }) {
  const apple = (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M17.05 12.5c0-2.1 1.7-3.1 1.8-3.16-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.3 1.05 8.36.69 1.01 1.51 2.14 2.59 2.1 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.03 2.51-2.04.79-1.17 1.12-2.3 1.13-2.36-.02-.01-2.17-.83-2.19-3.29zM15.1 6.2c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.52.6-.98 1.58-.86 2.5.91.07 1.84-.46 2.41-1.13z" /></svg>;
  const google = (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12.2c0-.66-.06-1.3-.17-1.9H12v3.6h5.05a4.3 4.3 0 01-1.87 2.83v2.35h3.02C19.96 17.4 21 15 21 12.2z" fill={c}/><path d="M12 21.5c2.53 0 4.65-.84 6.2-2.27l-3.02-2.35c-.84.56-1.92.9-3.18.9-2.44 0-4.5-1.65-5.24-3.87H3.64v2.43A9.5 9.5 0 0012 21.5z" fill={c} opacity="0.75"/><path d="M6.76 13.91a5.7 5.7 0 010-3.82V7.66H3.64a9.5 9.5 0 000 8.68l3.12-2.43z" fill={c} opacity="0.5"/><path d="M12 6.6c1.38 0 2.61.47 3.58 1.4l2.68-2.68A9.5 9.5 0 003.64 7.66l3.12 2.43C7.5 8.25 9.56 6.6 12 6.6z" fill={c} opacity="0.9"/></svg>;
  return (
    <Stage hue={HUE.signin} pad={26} top={74}>
      <OnbBar i={17} n={PROG_N} phase={PHASE.setup} hue={HUE.signin} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100%', marginBottom: 28 }}><HeroCard hue={HUE.signin} h={220}><TideScene hue={HUE.signin} w={210} h={132} /></HeroCard></div>
          <Hero size={32} style={{ textAlign: 'center' }}>Save your progress.</Hero>
        </div>
      </OnbBody>
      <OnbFoot>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <AuthButton icon={apple} label="Continue with Apple" dark onClick={onNext} />
          <AuthButton icon={google} label="Continue with Google" onClick={onNext} />
          <AuthButton icon={(c) => Glyph.pen(c)} label="Continue with email" onClick={onNext} />
        </div>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.4 }}>By continuing you agree to our Terms & Privacy Policy.</p>
      </OnbFoot>
    </Stage>
  );
}

// ── 20 · DONE ────────────────────────────────────────────────────────
function OnbDone({ name = '', why = '', goals = [], onEnter }) {
  const celeb = (window.CURRENT_ONB && window.CURRENT_ONB.celebrate) || 'medium';
  return (
    <Stage hue={HUE.done} pad={26} top={74}>
      <Particles mode={celeb} />
      <OnbBody>
        <div style={{ overflow: 'auto', paddingBottom: 8 }}>
          <div className="onb-rise" style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 16px' }}><TideScene hue={HUE.done} w={208} h={130} /></div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div className="onb-bloom" style={{ position: 'absolute', top: '50%', left: '50%', width: 130, height: 130, marginLeft: -65, marginTop: -65, borderRadius: 9999, background: tint(HUE.done, 0.7, 0.1, 0.3) }} />
            <SealBadge label="Day 0 · Ready" hue={HUE.done} />
          </div>
          <Hero size={36} style={{ textAlign: 'center' }}>{name ? `You’re set, ${name}.` : 'You’re set.'}</Hero>
          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <OnbEyebrow style={{ display: 'block' }}>Your why</OnbEyebrow>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: 'var(--ink)', margin: '12px auto 0', maxWidth: 300, letterSpacing: '-0.005em', textWrap: 'pretty' }}>
              “{((why || '').trim() || 'To feel like myself again.').replace(/\.$/, '')}.”
            </p>
          </div>
          {goals.length ? (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <OnbEyebrow style={{ display: 'block', marginBottom: 14 }}>You’re tracking</OnbEyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
                {goals.map((g) => <span key={g} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', background: 'var(--soft)', boxShadow: 'none', padding: '8px 14px', borderRadius: 9999 }}>{g}</span>)}
              </div>
            </div>
          ) : null}
        </div>
      </OnbBody>
      <OnbFoot><NextPill label="Enter VICI" onClick={onEnter} arrow={false} /></OnbFoot>
    </Stage>
  );
}

// ════════════════════════════════════════════════════════════════════
// LIVE FLOW
// ════════════════════════════════════════════════════════════════════
function OnboardingFlow() {
  const opening = (window.CURRENT_ONB && window.CURRENT_ONB.opening) || 'tide';
  const [step, setStep] = oState(0);
  const [d, setD] = oState({ name: '', age: '', freqLevel: 0.5, duration: '', tried: '', streak: '', triggers: [], symptoms: [], impact: [], goals: [], why: '' });
  const set = (k, v) => setD((s) => ({ ...s, [k]: v }));
  const toggle = (k) => (x) => setD((s) => ({ ...s, [k]: s[k].includes(x) ? s[k].filter((y) => y !== x) : [...s[k], x] }));
  const go = (n) => setStep(n);
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setStep(0); };

  switch (step) {
    // opening + educational carousel
    case 0: return opening === 'manifesto'
      ? <OnbWelcomeB onNext={next} onSignIn={() => go(27)} />
      : <OnbWelcomeA onNext={next} onSignIn={() => go(27)} />;
    case 1: return <OnbLesson idx={0} onNext={next} onBack={back} />;
    case 2: return <OnbLesson idx={1} onNext={next} onBack={back} />;
    case 3: return <OnbLesson idx={2} onNext={next} onBack={back} />;
    case 4: return <OnbLesson idx={3} onNext={next} onBack={back} />;
    case 5: return <OnbLesson idx={4} onNext={next} onBack={back} />;
    case 6: return <OnbAssessIntro onNext={next} onBack={back} />;
    // assessment
    case 7: return <OnbName value={d.name} onChange={(v) => set('name', v)} onNext={next} onBack={back} barI={1} />;
    case 8: return <OnbAge value={d.age} onPick={(v) => set('age', v)} onNext={next} onBack={back} barI={2} n={PROG_N} />;
    case 9: return <OnbFreqSlider value={d.freqLevel} onChange={(v) => set('freqLevel', v)} onNext={next} onBack={back} barI={3} n={PROG_N} />;
    case 10: return <OnbSingle title="How long has this been part of your life?" options={Q_DURATION} value={d.duration} onPick={(v) => set('duration', v)} onNext={next} onBack={back} barI={4} />;
    case 11: return <OnbTriedBefore value={d.tried} onPick={(v) => set('tried', v)} onNext={next} onBack={back} barI={5} n={PROG_N} />;
    case 12: return <OnbStreak value={d.streak} onPick={(v) => set('streak', v)} onNext={next} onBack={back} barI={6} n={PROG_N} />;
    case 13: return <OnbStreakInsight failed={!!d.streak && !/never/i.test(d.streak)} onNext={next} onBack={back} />;
    case 14: return <OnbMultiList title="When does it usually hit?" lead="Pick all that ring true." options={Q_TRIGGERS} selected={d.triggers} onToggle={toggle('triggers')} onNext={next} onBack={back} barI={7} />;
    case 15: return <OnbSymptoms selected={d.symptoms} onToggle={toggle('symptoms')} onNext={next} onBack={back} barI={8} n={PROG_N} />;
    case 16: return <OnbImpact selected={d.impact} onToggle={toggle('impact')} onNext={next} onBack={back} barI={9} />;
    case 17: return <OnbGoalsColored selected={d.goals} onToggle={toggle('goals')} onNext={next} onBack={back} barI={10} n={PROG_N} />;
    case 18: return <OnbWhy value={d.why} onChange={(v) => set('why', v)} onNext={next} onBack={back} barI={11} />;
    // analysis → plan reveal
    case 19: return <OnbAnalysis live onDone={next} />;
    case 20: return <OnbCelebrate name={d.name} onNext={next} />;
    case 21: return <OnbPattern name={d.name || 'there'} topTrigger={d.triggers[0] || 'Late nights'} toll={d.impact.slice(0, 2).join(' & ') || 'Focus & sleep'} onNext={next} onBack={back} />;
    case 22: return <OnbProjection onNext={next} onBack={back} />;
    case 23: return <OnbRating onNext={next} onBack={back} barI={14} n={PROG_N} />;
    case 24: return <OnbSocial onNext={next} onBack={back} />;
    // commitment + setup
    case 25: return <OnbSignPledge name={d.name} why={d.why} onNext={next} onBack={back} barI={16} n={PROG_N} />;
    case 26: return <OnbNotify onNext={next} onBack={back} />;
    case 27: return <OnbSignIn onNext={next} onBack={back} />;
    // checkout
    case 28: return <PaywallScreen onSubscribe={() => go(30)} onMaybeLater={() => go(29)} onClose={() => go(30)} />;
    case 29: return <OnbOneTimeOffer live onClaim={() => go(30)} onClose={() => go(30)} />;
    default: return <OnbDone name={d.name} why={d.why} goals={d.goals} onEnter={restart} />;
  }
}

// ════════════════════════════════════════════════════════════════════
// STATIC BOARDS (for the canvas)
// ════════════════════════════════════════════════════════════════════
const OnbWelcomeAScreen = () => <OnbWelcomeA onNext={() => {}} onSignIn={() => {}} />;
const OnbWelcomeBScreen = () => <OnbWelcomeB onNext={() => {}} onSignIn={() => {}} />;
const OnbLessonScreen = () => <OnbLesson idx={1} onNext={() => {}} onBack={() => {}} />;
const OnbAssessScreen = () => <OnbAssessIntro onNext={() => {}} onBack={() => {}} />;
function OnbSingleScreen() {
  const [v, setV] = oState('A few times a week');
  return <OnbSingle title="How often do the urges show up?" options={Q_FREQ} value={v} onPick={setV} onNext={() => {}} onBack={() => {}} barI={2} />;
}
function OnbTriggersScreen() {
  const [sel, setSel] = oState(['Late at night', 'Stress or anxiety', 'Endless scrolling']);
  const t = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <OnbMultiList title="When does it usually hit?" lead="Pick all that ring true." options={Q_TRIGGERS} selected={sel} onToggle={t} onNext={() => {}} onBack={() => {}} barI={4} />;
}
function OnbGoalsScreen() {
  const [sel, setSel] = oState(['Clear focus', 'Real confidence', 'Better sleep']);
  const t = (x) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]);
  return <OnbGoals selected={sel} onToggle={t} onNext={() => {}} onBack={() => {}} barI={6} />;
}
function OnbWhyScreen() {
  const [v, setV] = oState('I want to be present for my kids and stop hiding from myself.');
  return <OnbWhy value={v} onChange={setV} onNext={() => {}} onBack={() => {}} barI={7} />;
}
const OnbAnalysisScreen = () => <OnbAnalysis live={false} />;
const OnbPatternScreen = () => <OnbPattern name="Sam" topTrigger="Late nights" toll="Focus & sleep" onNext={() => {}} onBack={() => {}} />;
const OnbProjectionScreen = () => <OnbProjection onNext={() => {}} onBack={() => {}} />;
const OnbSocialScreen = () => <OnbSocial onNext={() => {}} onBack={() => {}} />;
const OnbPledgeScreen = () => <OnbPledge name="Sam" why="I want to be present for the people I love." onNext={() => {}} onBack={() => {}} />;
const OnbNotifyScreen = () => <OnbNotify onNext={() => {}} onBack={() => {}} />;
const OnbSignInScreen = () => <OnbSignIn onNext={() => {}} onBack={() => {}} />;
const OnbDoneScreen = () => <OnbDone name="Sam" why="I want to be present for the people I love." goals={['Clear focus', 'Real confidence', 'Better sleep']} onEnter={() => {}} />;

Object.assign(window, {
  OnboardingFlow,
  OnbWelcomeAScreen, OnbWelcomeBScreen, OnbLessonScreen, OnbAssessScreen,
  OnbSingleScreen, OnbTriggersScreen, OnbGoalsScreen, OnbWhyScreen,
  OnbAnalysisScreen, OnbPatternScreen, OnbProjectionScreen, OnbSocialScreen,
  OnbPledgeScreen, OnbNotifyScreen, OnbSignInScreen, OnbDoneScreen,
});
