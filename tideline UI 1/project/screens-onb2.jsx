// screens-onb2.jsx — VICI onboarding v2 · spec build, part 1 of 2.
// Night-tide theme (scoped .o2-night var override). This file: shared
// scaffolding + PHASE 0 HOOK, PHASE 1 QUIZ, PHASE 2 MIRROR (S1–S22).
// Part 2 (screens-onb2b.jsx): S23–S38 + the branching flow orchestrator.
// All top-level names are o2/O2-prefixed (script scopes share globals).

const { useState: o2State, useEffect: o2Effect, useRef: o2Ref } = React;

// ── demo answers (static boards + flow defaults) ─────────────────────
const O2_DEMO = {
  arrival: ['relapsed', 'resolved'], name: 'Marcus', age: '25–34', gender: 'Male',
  duration: 'Most of my life', freq: 'Daily', escal: 'Somewhat',
  attempts: "I've lost count", methods: ['A streak counter', 'Pure willpower ("just stop")'],
  last: 'Within the last few hours',
  triggers: ['Late at night', "When I'm alone", 'Scrolling social media'],
  costs: ['Brain fog / can\'t focus', 'Low energy & motivation', 'Less attraction to real partners'],
  stakes: "Honestly, I'm scared",
  prize: ['Focus & mental clarity', 'Real relationships / real intimacy', 'Confidence & self-respect'],
  notify: true, letter: 'Remember how you felt at 1:47am on July 3rd. Never again. Get back up.',
};

// primary register: relapsed > cycling > resolved > curious (+ combo override)
function o2Register(a) {
  const s = a.arrival || [];
  if (s.includes('relapsed') && s.includes('resolved')) return 'combo';
  for (const r of ['relapsed', 'cycling', 'resolved', 'curious']) if (s.includes(r)) return r;
  return 'resolved';
}
function o2Score(a) {
  let s = 30;
  s += { 'A few times a month': 2, 'Weekly': 6, 'Several times a week': 10, 'Daily': 15, 'Multiple times a day': 19 }[a.freq] || 0;
  s += { 'Yes, significantly': 14, 'Somewhat': 8, 'Not really': 0, "I don't want to answer": 10 }[a.escal] || 0;
  s += { 'Never tried': 0, 'Once or twice': 4, 'Several times': 7, "I've lost count": 9 }[a.attempts] || 0;
  s += Math.min(16, (a.costs || []).length * 2.5);
  s += { 'Under a year': 0, '1–3 years': 3, '3–10 years': 6, 'Most of my life': 8 }[a.duration] || 0;
  return Math.min(96, Math.round(s));
}

// ── scaffolding ──────────────────────────────────────────────────────
const O2_PHASES = [[1, ''], [4, 'About you'], [7, 'The habit'], [11, 'Your attempts'], [14, 'The cost'], [18, 'Your results'], [23, 'The method'], [27, 'Your plan'], [30, 'The vow'], [33, 'Unlock'], [36, 'Day zero']];
function o2Phase(n) { let p = ''; for (const [at, label] of O2_PHASES) if (n >= at) p = label; return p; }

const o2Night = () => ((window.CURRENT_ONB2 || {}).theme || 'paper') === 'night';

// ── the ambient seascape: night → dawn as the funnel progresses ─────
const o2Lerp = (a, b, t) => a + (b - a) * t;
const o2Mix = (c1, c2, t) => `rgb(${Math.round(o2Lerp(c1[0], c2[0], t))},${Math.round(o2Lerp(c1[1], c2[1], t))},${Math.round(o2Lerp(c1[2], c2[2], t))})`;
const o2MixT = (c1, c2, t) => `${Math.round(o2Lerp(c1[0], c2[0], t))},${Math.round(o2Lerp(c1[1], c2[1], t))},${Math.round(o2Lerp(c1[2], c2[2], t))}`;
// three-stop interpolation: midnight → dawn → morning
const o2L3 = (a, b, c, u) => u < 0.5 ? o2Lerp(a, b, u * 2) : o2Lerp(b, c, (u - 0.5) * 2);
const o2C3 = (A, B, C, u, aMul = 1) => `rgba(${Math.round(o2L3(A[0], B[0], C[0], u))},${Math.round(o2L3(A[1], B[1], C[1], u))},${Math.round(o2L3(A[2], B[2], C[2], u))},${(o2L3(A[3] != null ? A[3] : 1, B[3] != null ? B[3] : 1, C[3] != null ? C[3] : 1, u) * aMul).toFixed(3)})`;
const O2_STARS = [[30, 64], [86, 38], [142, 96], [201, 52], [258, 110], [310, 70], [356, 34], [58, 148], [330, 150], [178, 30], [22, 118], [118, 58], [164, 140], [238, 26], [286, 132], [372, 96], [46, 22], [210, 150], [104, 168], [300, 20], [350, 124], [132, 20]];
const O2_GLINTS = [[0.3, 0.8], [0.62, 0.84], [0.48, 0.9], [0.72, 0.79], [0.24, 0.9], [0.56, 0.78], [0.38, 0.84]];

function O2Ambient({ t = 0, night = false, mix = 1, lit = true, w = 393, h = 852 }) {
  const uid = React.useId().replace(/[:]/g, '');
  const e = 1 - (1 - t) * (1 - t); // easeOut across the funnel
  const u = night ? e * 0.4 : e;   // scene time: midnight → first light → morning
  const k = night ? 0 : mix;       // canvas blend: 0 = dark ground · 1 = paper ground
  const horizon = h * 0.745;
  const bell0 = Math.exp(-Math.pow(u - 0.46, 2) / 0.055); // dawn glow, peaks mid-funnel
  // morning effects (rays, glints, gulls) arrive only once daylight reaches the UI
  const dayness = lit ? Math.max(0, (u - 0.62) / 0.38) : 0;

  // palettes: [midnight, dawn, morning] × (N: on dark canvas · L: on paper)
  const N = {
    skyTop: [[8, 14, 24, 0.55], [34, 36, 60, 0.5], [122, 142, 170, 0.28]],
    skyMid: [[10, 18, 28, 0.4], [98, 64, 74, 0.4], [170, 162, 150, 0.22]],
    skyHrz: [[14, 24, 34, 0.32], [216, 126, 62, 0.36], [238, 198, 122, 0.3]],
    cloud: [[214, 226, 234, 0.06], [232, 172, 116, 0.16], [250, 246, 238, 0.3]],
    sea: [[6, 13, 21, 1], [20, 26, 38, 1], [52, 70, 76, 1]],
    star: [[234, 242, 241, 0.8], [234, 242, 241, 0.8], [234, 242, 241, 0.8]],
    crest: [[214, 232, 236, 0.42], [230, 222, 212, 0.5], [244, 244, 238, 0.6]],
    glint: [[190, 214, 220, 0.8], [252, 206, 138, 0.9], [250, 222, 150, 0.9]],
  };
  const L = {
    skyTop: [[46, 52, 80, 0.13], [92, 72, 96, 0.12], [190, 206, 220, 0.11]],
    skyMid: [[82, 84, 104, 0.09], [212, 134, 92, 0.11], [236, 224, 196, 0.09]],
    skyHrz: [[140, 138, 138, 0.08], [242, 164, 88, 0.24], [250, 226, 164, 0.15]],
    cloud: [[64, 70, 92, 0.1], [240, 168, 110, 0.2], [255, 252, 244, 0.55]],
    sea: [[26, 32, 44, 1], [74, 62, 64, 1], [84, 96, 92, 1]],
    star: [[74, 74, 66, 0.62], [74, 74, 66, 0.62], [74, 74, 66, 0.62]],
    crest: [[252, 251, 246, 0.5], [252, 251, 246, 0.62], [252, 251, 246, 0.78]],
    glint: [[198, 138, 64, 0.8], [224, 158, 82, 0.9], [214, 158, 84, 0.9]],
  };
  // resolve a palette key at scene-time u, blended across the two canvases by k
  const arr = (P, key) => [0, 1, 2, 3].map((i) => o2L3(P[key][0][i], P[key][1][i], P[key][2][i], u));
  const col = (key, aMul = 1) => {
    const a = arr(N, key), b = arr(L, key);
    const c = a.map((v, i) => o2Lerp(v, b[i], k));
    return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${Math.min(1, c[3] * aMul).toFixed(3)})`;
  };
  const seaMul = o2Lerp(1, o2Lerp(1.35, 0.85, u), k);
  const bandA = [o2Lerp(0.52, 0.17, k), o2Lerp(0.38, 0.115, k), o2Lerp(0.26, 0.075, k)].map((a) => a * seaMul);

  // the sun: hidden under the sea, breaks the horizon at dawn — and while the
  // UI is still in the dark register it stays pinned at the crest, so the
  // bright disc never climbs up behind light-ink copy. It rises the rest of
  // the way (low over the water) once daylight reaches the tokens.
  const sunT = Math.max(0, Math.min(1, (u - 0.34) / 0.6));
  const sunE = sunT * sunT * (3 - 2 * sunT);
  const sunX = w * o2Lerp(0.26, 0.74, sunE);
  const sunR = o2Lerp(17, 25, sunE);
  // the risen sun hovers just above the waterline — the disc + bloom live in
  // the narrow vivid band at the horizon, never up behind the copy
  const sunYfree = o2Lerp(horizon + 24, horizon - 38, sunE);
  // while the UI is dark the disc stays fully below the crest — bloom, flare
  // and reflection are the only pre-dawn signs; it physically breaks the
  // horizon at the same moment the tokens flip to daylight (S19)
  const sunY = lit ? sunYfree : Math.max(sunYfree, horizon + sunR * 0.25);
  // dark register keeps a perpetual-dawn glow once the sun has reached the crest
  const bell = lit ? bell0 : Math.max(bell0, sunE * 0.75);
  const glow = Math.min(1, bell * 0.8 + dayness);
  const glowY = Math.min(sunY, horizon);
  const breaking = Math.max(0, 1 - Math.abs(sunY - horizon) / (sunR * 1.7)); // 1 at the exact break
  // sun body colors ride the scene time
  const sunMid = `rgb(${Math.round(o2L3(246, 248, 250, u))},${Math.round(o2L3(184, 178, 218, u))},${Math.round(o2L3(108, 100, 148, u))})`;
  const sunEdge = `rgb(${Math.round(o2L3(230, 238, 244, u))},${Math.round(o2L3(136, 156, 204, u))},${Math.round(o2L3(70, 84, 134, u))})`;

  const starO = Math.max(0, 1 - u / 0.5) * o2Lerp(0.9, 0.62, k);
  const moonO = Math.max(0, 1 - u / 0.52) * 0.9;
  const moonFill = `rgb(${Math.round(o2Lerp(13, 241, k))},${Math.round(o2Lerp(20, 238, k))},${Math.round(o2Lerp(27, 228, k))})`;
  const moonEdge = k < 0.5 ? 'rgba(234,242,241,0.4)' : '#D9D4C4';
  const inkLine = k < 0.5 ? 'rgba(234,242,241,0.5)' : 'rgba(74,74,66,0.55)';
  const boat = u > 0.08 && u < 0.96;
  const boatX = w * o2Lerp(0.16, 0.8, (Math.min(0.96, Math.max(0.08, u)) - 0.08) / 0.88);

  const Cloud = ({ cx, cy, s, o, delay }) => (
    <g className="onb-drift" style={{ animationDelay: delay }} opacity={o} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx="2" cy="9" rx="42" ry="8" fill={col('skyHrz')} opacity={bell * 0.85} />
      <g fill={col('cloud')}>
        <ellipse cx="0" cy="0" rx="46" ry="12" />
        <ellipse cx="-27" cy="5" rx="29" ry="9" />
        <ellipse cx="25" cy="6" rx="33" ry="10" />
        <ellipse cx="7" cy="-8" rx="23" ry="9" />
      </g>
    </g>
  );

  return (
    <svg aria-hidden width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice" fill="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`o2sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col('skyTop')} />
          <stop offset="55%" stopColor={col('skyMid')} />
          <stop offset="100%" stopColor={col('skyHrz')} />
        </linearGradient>
        {/* the sun: a hot near-white core falling off through gold to ember */}
        <radialGradient id={`o2sun-${uid}`} cx="42%" cy="36%" r="76%">
          <stop offset="0%" stopColor="#FFF8E6" />
          <stop offset="46%" stopColor={sunMid} />
          <stop offset="100%" stopColor={sunEdge} />
        </radialGradient>
        <radialGradient id={`o2bloom-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={col('glint', 0.55)} />
          <stop offset="60%" stopColor={col('glint', 0.18)} />
          <stop offset="100%" stopColor="rgba(240,170,100,0)" />
        </radialGradient>
        <linearGradient id={`o2flare-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,236,196,0)" />
          <stop offset="50%" stopColor="rgba(255,240,206,0.9)" />
          <stop offset="100%" stopColor="rgba(255,236,196,0)" />
        </linearGradient>
        <linearGradient id={`o2col-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col('glint', 0.5)} />
          <stop offset="100%" stopColor={col('glint', 0)} />
        </linearGradient>
        <linearGradient id={`o2mist-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(248,246,240,0)" />
          <stop offset="50%" stopColor={k < 0.5 ? 'rgba(190,205,215,0.08)' : 'rgba(252,251,246,0.55)'} />
          <stop offset="100%" stopColor="rgba(248,246,240,0)" />
        </linearGradient>
        <radialGradient id={`o2milky-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={col('star', 0.13)} />
          <stop offset="100%" stopColor="rgba(234,242,241,0)" />
        </radialGradient>
        <clipPath id={`o2sky-clip-${uid}`}><rect x="0" y="0" width={w} height={horizon} /></clipPath>
      </defs>

      {/* sky, warming band by band */}
      <rect width={w} height={horizon} fill={`url(#o2sky-${uid})`} />

      {/* a faint milky-way wash, deep-night only */}
      {starO > 0.2 ? <ellipse cx={w * 0.3} cy={h * 0.2} rx={w * 0.52} ry={54} transform={`rotate(-24 ${w * 0.3} ${h * 0.2})`} fill={`url(#o2milky-${uid})`} opacity={(starO - 0.2) * 0.9} /> : null}

      {/* stars thin out as the light comes up — the brightest carry a sparkle */}
      {starO > 0.01 ? O2_STARS.map(([x, y], i) => {
        const scx = x * w / 393, so = starO * (i % 5 === 0 ? 0.6 : 1), sdl = { animationDelay: `${i * 0.7}s` };
        if (i % 7 === 0) return <path key={i} className="onb-twinkle" style={sdl} d={`M${scx - 3} ${y} h6 M${scx} ${y - 3} v6`} stroke={col('star')} strokeWidth="1.1" strokeLinecap="round" opacity={so} />;
        return <circle key={i} className={i % 3 === 0 ? 'onb-twinkle' : undefined} style={sdl} cx={scx} cy={y} r={i % 4 === 0 ? 1.6 : i % 3 === 0 ? 1.25 : 0.95} fill={col('star')} opacity={so} />;
      }) : null}

      {/* the moon sets as the sun gains */}
      {moonO > 0.01 ? (
        <g opacity={moonO} transform={`translate(${w * 0.8}, ${h * 0.13 + u * 110})`}>
          <circle r="26" fill={moonFill} stroke={moonEdge} strokeWidth="1.4" />
          <circle cx="-9" cy="-4" r="22" fill="var(--bg)" opacity="0.92" />
          <circle r="36" stroke={k < 0.5 ? 'rgba(234,242,241,0.22)' : 'rgba(74,74,66,0.22)'} strokeWidth="1.4" strokeDasharray="2.5 6" fill="none" />
        </g>
      ) : null}

      {/* clouds catch the light: dark silhouettes → underlit amber → white */}
      <Cloud cx={w * 0.24} cy={h * 0.115} s={1} o={0.9} delay="0s" />
      <Cloud cx={w * 0.68} cy={h * 0.195} s={0.78} o={0.75} delay="-9s" />
      <Cloud cx={w * 0.46} cy={h * 0.055} s={0.6} o={0.55} delay="-16s" />

      {/* high cirrus, combed thin */}
      <g stroke={col('cloud', 0.85)} strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
        <path d={`M${w * 0.09} ${h * 0.158} h64`} />
        <path d={`M${w * 0.19} ${h * 0.178} h30`} />
        <path d={`M${w * 0.57} ${h * 0.088} h74`} />
        <path d={`M${w * 0.66} ${h * 0.108} h36`} />
      </g>

      {/* dawn glow pooling on the horizon */}
      <ellipse cx={sunX} cy={horizon} rx={w * (0.34 + bell * 0.3 + dayness * 0.22)} ry={64 + glow * 46} fill={`url(#o2bloom-${uid})`} opacity={Math.min(1, bell * 0.95 + dayness * 0.8)} />

      {/* the sun itself, clipped by the sea until it breaks through */}
      <g clipPath={`url(#o2sky-clip-${uid})`}>
        <circle cx={sunX} cy={glowY} r={sunR * 4.6} fill={`url(#o2bloom-${uid})`} opacity={0.35 + glow * 0.65} />
        <circle cx={sunX} cy={sunY} r={sunR * 1.9} fill={`url(#o2bloom-${uid})`} opacity={0.45 + glow * 0.55} />
        <circle cx={sunX} cy={sunY} r={sunR} fill={`url(#o2sun-${uid})`} />
        {/* molten rim while the sun sits low */}
        {bell > 0.08 ? <circle cx={sunX} cy={sunY} r={sunR + 0.8} stroke="rgba(255,238,200,0.85)" strokeWidth="1.3" fill="none" opacity={bell} /> : null}
        {/* low cloud slats crossing the rising disc */}
        {bell > 0.22 && sunY > horizon - sunR ? (
          <g fill={col('sea', 0.55)} opacity={Math.min(1, (bell - 0.22) / 0.5)}>
            <rect x={sunX - sunR * 1.5} y={sunY - sunR * 0.34} width={sunR * 3.4} height="2.6" rx="1.3" />
            <rect x={sunX - sunR * 1.1} y={sunY + sunR * 0.22} width={sunR * 2.4} height="2.2" rx="1.1" />
          </g>
        ) : null}
        {/* horizontal flare at the moment it breaks the waterline */}
        {breaking > 0.02 ? <path d={`M${sunX - 52 - breaking * 26} ${horizon - 1} H${sunX + 52 + breaking * 26}`} stroke={`url(#o2flare-${uid})`} strokeWidth={1.6 + breaking * 1.6} strokeLinecap="round" opacity={breaking} /> : null}
        {/* rays fan out once the morning arrives */}
        {dayness > 0.03 ? (
          <g stroke={col('glint', 0.5 + dayness * 0.4)} strokeWidth="2" strokeLinecap="round" opacity={dayness}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 + Math.PI / 12, len = i % 2 ? 7 : 11;
              const r0 = sunR + 9, r1 = r0 + len * (0.5 + dayness * 0.5);
              return <line key={i} x1={sunX + r0 * Math.cos(a)} y1={sunY + r0 * Math.sin(a)} x2={sunX + r1 * Math.cos(a)} y2={sunY + r1 * Math.sin(a)} />;
            })}
          </g>
        ) : null}
      </g>

      {/* pre-dawn mist hugging the water */}
      {u < 0.6 ? <rect x="0" y={horizon - 40} width={w} height={58} fill={`url(#o2mist-${uid})`} opacity={(1 - u / 0.6)} /> : null}

      {/* the sea */}
      <g className="o2-swell">
        {boat ? (
          <g transform={`translate(${boatX}, ${horizon - 1})`} opacity="0.62">
            <path d="M-9 0 L9 0 L5 5 L-5 5 Z" fill={col('sea', 0.9)} />
            <path d="M0 -1 L0 -13 L8 -3 Z" fill={col('sea', 0.7)} />
          </g>
        ) : null}
        <rect x="0" y={horizon} width={w} height={h - horizon} fill={col('sea', bandA[0])} />
        <path d={`M0 ${horizon} H${w}`} stroke={col('crest')} strokeWidth="2" strokeLinecap="round" />
        {/* the headland — a far shore with a lighthouse that works the dark */}
        <g>
          <path d={`M0 ${horizon + 1} L0 ${horizon - 13} Q ${w * 0.045} ${horizon - 19} ${w * 0.085} ${horizon - 11} Q ${w * 0.115} ${horizon - 5} ${w * 0.15} ${horizon + 1} Z`} fill={col('sea', o2Lerp(0.9, 0.55, k))} />
          <rect x={w * 0.052 - 1.6} y={horizon - 27} width="3.2" height="15" rx="1.2" fill={col('sea', o2Lerp(1, 0.65, k))} />
          <circle cx={w * 0.052} cy={horizon - 29.5} r="2" fill={u < 0.42 ? '#FFE9B8' : col('crest', 0.85)} />
          {u < 0.42 ? (
            <g className="onb-twinkle" opacity="0.85">
              <path d={`M${w * 0.052 + 2} ${horizon - 29.5} L${w * 0.052 + 36} ${horizon - 35} L${w * 0.052 + 36} ${horizon - 24} Z`} fill="rgba(255,233,184,0.13)" />
              <circle cx={w * 0.052} cy={horizon - 29.5} r="4.5" fill="rgba(255,233,184,0.22)" />
            </g>
          ) : null}
        </g>
        {/* moonlight on the water, before the sun takes over */}
        {moonO > 0.25 && glow < 0.2 ? (
          <g opacity={(moonO - 0.25) * 0.9}>
            {[10, 24, 40, 60].map((dy, i) => {
              const hw = 5 + i * 4.5, jx = i % 2 ? 4 : -3;
              return <path key={dy} d={`M${w * 0.8 - hw + jx} ${horizon + dy} h${hw * 2}`} stroke={k < 0.5 ? 'rgba(214,232,240,0.32)' : 'rgba(168,176,184,0.3)'} strokeWidth={2.4 - i * 0.35} strokeLinecap="round" />;
            })}
          </g>
        ) : null}
        {/* the sun's reflection: a tapered column of light + broken shimmer rows */}
        {glow > 0.05 ? (
          <g>
            <path d={`M${sunX - 5} ${horizon} L${sunX + 5} ${horizon} L${sunX + 30} ${h} L${sunX - 30} ${h} Z`} fill={`url(#o2col-${uid})`} opacity={0.5 + glow * 0.5} />
            <g opacity={Math.min(1, 0.35 + glow * 0.65)}>
              {[12, 26, 44, 66, 94].map((dy, i) => {
                const hw = 7 + i * 6.5 + glow * 7, jx = (i % 2 ? 6 : -4);
                return <path key={dy} d={`M${sunX - hw + jx} ${horizon + dy} h${hw * 2}`} stroke={col('glint', 0.45 - i * 0.07)} strokeWidth={3 - i * 0.35} strokeLinecap="round" />;
              })}
            </g>
          </g>
        ) : null}
        <rect x="0" y={horizon + (h - horizon) * 0.38} width={w} height={(h - horizon) * 0.62} fill={col('sea', bandA[1])} />
        <path d={`M${w * 0.08} ${horizon + (h - horizon) * 0.38} H${w * 0.8}`} stroke={col('crest', 0.62)} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="0" y={horizon + (h - horizon) * 0.7} width={w} height={(h - horizon) * 0.3} fill={col('sea', bandA[2])} />
        <path d={`M${w * 0.16} ${horizon + (h - horizon) * 0.7} H${w * 0.62}`} stroke={col('crest', 0.45)} strokeWidth="1.4" strokeLinecap="round" />
        {/* scattered foam ticks between the swells */}
        <g stroke={col('crest', 0.32)} strokeWidth="1.3" strokeLinecap="round">
          <path d={`M${w * 0.3} ${horizon + (h - horizon) * 0.2} h14`} />
          <path d={`M${w * 0.55} ${horizon + (h - horizon) * 0.26} h10`} />
          <path d={`M${w * 0.18} ${horizon + (h - horizon) * 0.52} h12`} />
          <path d={`M${w * 0.68} ${horizon + (h - horizon) * 0.56} h14`} />
          <path d={`M${w * 0.4} ${horizon + (h - horizon) * 0.84} h12`} />
        </g>
        {/* morning glints scattered on the swell */}
        {dayness > 0.05 ? O2_GLINTS.map(([gx, gy], i) => (
          <path key={i} className="onb-twinkle" style={{ animationDelay: `${i * 0.55}s` }} d={`M${w * gx - 3.2} ${h * gy} h6.4 M${w * gx} ${h * gy - 3.2} v6.4`} stroke={col('glint', 0.7)} strokeWidth="1.6" strokeLinecap="round" opacity={dayness * 0.85} />
        )) : null}
      </g>

      {/* gulls arrive with the morning */}
      {dayness > 0.18 ? (
        <g stroke={inkLine} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={Math.min(1, (dayness - 0.18) / 0.5)}>
          <path d={`M${sunX - 70} ${sunY - 34} l7 -5 7 5`} />
          <path d={`M${sunX - 44} ${sunY - 54} l5.5 -4 5.5 4`} />
          <path d={`M${sunX - 96} ${sunY - 12} l4.5 -3.5 4.5 3.5`} />
        </g>
      ) : null}
    </svg>
  );
}

function O2Shell({ step = 0, total = 38, onBack, children, bar = true, pad = 24, phase, lit: litProp, calm = false }) {
  const night = o2Night();
  const phaseLabel = phase != null ? phase : o2Phase(step);
  const t = Math.max(0, Math.min(1, (step - 1) / (total - 1)));
  // The canvas lives the journey too — but tokens never interpolate through
  // each other (mid-mix greys destroy contrast). The funnel runs in the dark
  // register from the door through the analysis, and daylight reaches the UI
  // in one step at the score reveal (S19). Callers pass `lit` by screen id;
  // the numeric fallback (22 = S19's flow index + 1) covers direct use.
  const lit = !night && (litProp != null ? litProp : step >= 22);
  const darkUI = night || !lit;
  return (
    <div className={darkUI ? 'o2-night' : undefined} style={{ position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {darkUI ? <div style={{ position: 'absolute', left: '-20%', right: '-20%', bottom: '-24%', height: '52%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--fill) 14%, transparent), transparent 68%)' }} /> : null}
        <O2Ambient t={t} night={night} mix={lit ? 1 : 0} lit={lit} />
        {/* legibility veil — the sky art dims wherever copy can live; the only
            vivid window is a narrow band around the horizon (68–76%). Dense
            screens pass `calm` to fill even that window with a light veil. */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 74%, transparent) 28%, color-mix(in srgb, var(--bg) 54%, transparent) 46%, color-mix(in srgb, var(--bg) 30%, transparent) 58%, color-mix(in srgb, var(--bg) 10%, transparent) 64%, ${calm ? 'color-mix(in srgb, var(--bg) 26%, transparent)' : 'rgba(0,0,0,0)'} 68%, ${calm ? 'color-mix(in srgb, var(--bg) 26%, transparent)' : 'rgba(0,0,0,0)'} 76.5%, color-mix(in srgb, var(--bg) 24%, transparent) 84%, color-mix(in srgb, var(--bg) 42%, transparent) 92%, color-mix(in srgb, var(--bg) 52%, transparent) 100%)` }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', padding: `72px ${pad}px 44px` }}>
        {bar ? (
          <div style={{ marginBottom: 22, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginLeft: -4, display: 'flex', borderRadius: 10, opacity: onBack ? 0.8 : 0.18 }}>
                <svg width="12" height="20" viewBox="0 0 13 22"><path d="M11 2L2 11l9 9" stroke="var(--ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
                <div style={{ width: `${Math.max(2, (step / total) * 100)}%`, height: '100%', borderRadius: 9999, background: 'linear-gradient(90deg, var(--fill-hi), var(--fill-lo))', transition: 'width .5s cubic-bezier(.4,0,.1,1)' }} />
              </div>
              <span className="tnum" style={{ fontWeight: 600, fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink3)', flexShrink: 0 }}>{phaseLabel}</span>
            </div>
          </div>
        ) : null}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
      </div>
    </div>
  );
}

function O2H({ children, size = 31, style = {} }) {
  return <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: size, lineHeight: 1.16, letterSpacing: '0.01em', color: 'var(--ink)', margin: '0 auto', textWrap: 'pretty', textAlign: 'center', maxWidth: 332, flexShrink: 0, ...style }}>{children}</h1>;
}
function O2Sub({ children, style = {} }) {
  return <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink2)', margin: '16px auto 0', textWrap: 'pretty', textAlign: 'center', maxWidth: 316, flexShrink: 0, ...style }}>{children}</p>;
}
function O2Eyebrow({ children, tone = 'var(--ink2)', style = {} }) {
  return <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: tone, textAlign: 'center', flexShrink: 0, ...style }}>{children}</div>;
}
// gray reassurance footnote, stoic-style
function O2Note({ children, style = {} }) {
  return <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink3)', textAlign: 'center', margin: '0 auto', maxWidth: 280, flexShrink: 0, ...style }}>{children}</div>;
}
function O2CTA({ label, onClick, enabled = true, ghost = false }) {
  if (ghost) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={onClick} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink2)', padding: '15px 20px 0' }}>{label}</button>
    </div>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={enabled ? onClick : undefined} disabled={!enabled} className="tl-press" style={{
        appearance: 'none', border: 'none', cursor: enabled ? 'pointer' : 'default',
        background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', color: 'var(--on-fill)',
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 12, padding: '17px 34px',
        minWidth: 236, letterSpacing: '0.03em', opacity: enabled ? 1 : 0.3,
        boxShadow: enabled ? 'none' : 'none',
      }}>{label}</button>
    </div>
  );
}
// single/multi select — stoic-style centered capsule; selected = solid ink,
// and a selected row with a note expands to carry it inside the capsule
function O2Row({ label, sub, on, multi = false, onClick }) {
  return (
    <button onClick={onClick} className={'tl-press' + (on ? ' onb-pop' : '')} style={{
      appearance: 'none', cursor: 'pointer', border: 'none', width: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7,
      padding: on && sub ? '15px 26px 17px' : '18px 26px', borderRadius: 34, minHeight: 58,
      background: on ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--card)',
      color: on ? 'var(--on-fill)' : 'var(--ink)', textAlign: 'center',
      boxShadow: on
        ? 'none'
        : 'none',
    }}>
      <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{label}</span>
      {on && sub ? <span className="o2-tick" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, lineHeight: 1.5, color: 'var(--on-fill-2, rgba(244,243,239,0.75))', maxWidth: 268 }}>{sub}</span> : null}
    </button>
  );
}
// question screen (single: auto-advance ~400ms)
function O2Question({ title, sub, options, value, multi = false, onSet, next, ctaLabel, note, skip }) {
  const pick = (label) => {
    if (multi) { const cur = value || []; onSet(cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]); }
    else { onSet(label); setTimeout(next, 400); }
  };
  const count = multi ? (value || []).length : 0;
  const short = options.length <= 5;
  return (
    <React.Fragment>
      <div style={{ flex: short ? '0 0 40px' : '0 0 12px' }} />
      <O2H>{title}</O2H>
      {sub ? <O2Sub>{sub}</O2Sub> : null}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, marginTop: short ? 34 : 28, paddingBottom: 4, justifyContent: short ? 'center' : 'flex-start' }}>
        {options.map((o) => {
          const [label, s] = Array.isArray(o) ? o : [o, null];
          const on = multi ? (value || []).includes(label) : value === label;
          return <O2Row key={label} label={label} sub={s} on={on} multi={multi} onClick={() => pick(label)} />;
        })}
      </div>
      <div style={{ paddingTop: 14, flexShrink: 0 }}>
        {note ? <O2Note style={{ marginBottom: 13 }}>{note}</O2Note> : null}
        {multi ? <O2CTA label={count ? `${ctaLabel || 'Continue'} · ${count}` : (ctaLabel || 'Continue')} enabled={count > 0} onClick={next} /> : null}
        {skip ? <O2CTA ghost label="Skip" onClick={next} /> : null}
      </div>
    </React.Fragment>
  );
}
// interstitial scaffold
function O2Card({ children, style = {}, className }) {
  return <div className={className} style={{ background: 'var(--card)', borderRadius: 20, padding: '18px 19px', boxShadow: 'var(--shadow-card)', ...style }}>{children}</div>;
}
function O2Quote({ text, who, style = {} }) {
  const initial = (who || '?').trim()[0].toUpperCase();
  return (
    <O2Card style={{ display: 'flex', gap: 13, alignItems: 'flex-start', ...style }}>
      <span style={{ width: 38, height: 38, borderRadius: 9999, flexShrink: 0, background: 'color-mix(in oklab, var(--ink) 10%, transparent)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{initial}</span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.5, color: 'var(--ink)', margin: 0, textWrap: 'pretty' }}>“{text}”</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ display: 'inline-flex', gap: 1.5 }}>
            {[0, 1, 2, 3, 4].map((i) => <svg key={i} width="10" height="10" viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z" fill="var(--ink3)" /></svg>)}
          </span>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)' }}>{who}</span>
        </div>
      </div>
    </O2Card>
  );
}

// ── night-sea hero art (S1) ──────────────────────────────────────────
function O2Sea({ h = 190 }) {
  return (
    <svg width="100%" height={h} viewBox={`0 0 358 ${h}`} fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="o2sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0E14" /><stop offset="100%" stopColor="#0D1B21" />
        </linearGradient>
        <linearGradient id="o2wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--fill)" stopOpacity="0.4" /><stop offset="55%" stopColor="var(--accent)" stopOpacity="0.85" /><stop offset="100%" stopColor="var(--fill)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="358" height={h} fill="url(#o2sea)" />
      <path d={`M0 ${h * 0.44} H358`} stroke="rgba(234,242,241,0.14)" strokeWidth="1" />
      <circle cx="286" cy={h * 0.2} r="13" fill="none" stroke="rgba(234,242,241,0.3)" strokeWidth="1.4" />
      <circle cx="281" cy={h * 0.18} r="10" fill="#0A0E14" />
      <g className="o2-swell">
        <path d={`M0 ${h * 0.62} C 60 ${h * 0.54} 120 ${h * 0.7} 179 ${h * 0.62} C 238 ${h * 0.54} 298 ${h * 0.7} 358 ${h * 0.6}`} stroke="url(#o2wave)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d={`M0 ${h * 0.76} C 70 ${h * 0.69} 130 ${h * 0.82} 190 ${h * 0.75} C 250 ${h * 0.69} 305 ${h * 0.81} 358 ${h * 0.74}`} stroke="color-mix(in oklab, var(--fill) 35%, transparent)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d={`M0 ${h * 0.9} C 80 ${h * 0.84} 150 ${h * 0.95} 220 ${h * 0.89} C 280 ${h * 0.84} 320 ${h * 0.93} 358 ${h * 0.88}`} stroke="color-mix(in oklab, var(--fill) 18%, transparent)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

// ════════ PHASE 0 · HOOK ═════════════════════════════════════════════
const O2_ARRIVAL = [
  ['I just relapsed', 'relapsed'], ['I keep quitting, then relapsing', 'cycling'],
  ["I'm ready to quit for good", 'resolved'], ["Not sure I even have a problem", 'curious'],
];
function O2S1_Door({ a, set, next }) {
  const sel = a.arrival || [];
  const toggle = (k) => set('arrival', sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);
  return (
    <React.Fragment>
      <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 13.5, letterSpacing: '0.28em', color: 'var(--ink)', textAlign: 'center', flexShrink: 0 }}>VICI</div>
      {o2Night() ? <div style={{ margin: '10px -24px 4px', opacity: 0.95 }}><O2Sea h={158} /></div> : <div style={{ flex: '0 1 108px' }} />}
      <O2H size={32}>What brought you here tonight?</O2H>
      <O2Sub style={{ marginTop: 10 }}>Pick everything that's true tonight.</O2Sub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 28 }}>
        {O2_ARRIVAL.map(([label, k]) => <O2Row key={k} label={label} on={sel.includes(k)} multi onClick={() => toggle(k)} />)}
      </div>
      <div style={{ flex: 1 }} />
      <O2CTA label="Continue" enabled={sel.length > 0} onClick={next} />
    </React.Fragment>
  );
}

const O2_OPENERS = {
  combo: ['Relapsed tonight, and done with it. That mix is exactly the right fuel.', "The disgust you feel right now fades in a day or two. The decision doesn't have to."],
  relapsed: ["Then you're already doing the hardest part.", 'Getting honest twenty minutes after, instead of disappearing for a week? Most guys never get this far.'],
  cycling: ["If wanting it badly enough were the fix, you'd have quit years ago.", "You don't need more willpower. You need a method that survives a bad night. That's what this is."],
  resolved: ['Good. That feeling you have right now is real fuel.', "Let's turn it into a plan before it cools."],
  curious: ['Fair enough. Most guys here started with the same quiet question: is this actually affecting me?', "The next few minutes are a straight self-assessment. Find out where you actually stand."],
};
function O2S2_Promise({ a, next }) {
  const [line1, line2] = O2_OPENERS[o2Register(a)];
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <O2H size={29}>{line1}</O2H>
        <O2Sub style={{ fontSize: 16 }}>{line2}</O2Sub>
        <div style={{ height: 1, background: 'var(--line)', margin: '28px 34px 26px' }} />
        <O2Eyebrow>The promise</O2Eyebrow>
        <O2H size={20} style={{ marginTop: 10 }}>Science-based. Private. Built to finish the fight you've been fighting alone — vici means “I conquered.”</O2H>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 13, marginTop: 20 }}>
          <AvatarStack items={['J', 'M', 'A', 'K']} size={30} />
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13.5, color: 'var(--ink2)' }}><b style={{ color: 'var(--ink)' }} className="tnum">100,000+</b> men rewiring</span>
        </div>
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}><PressRow /></div>
      </div>
      <O2CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}
function O2S3_Framing({ a, next }) {
  const curious = o2Register(a) === 'curious';
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <O2H>{curious ? "First — let's find out where you actually stand." : 'First, we need to understand your relationship with porn.'}</O2H>
        <O2Sub style={{ fontSize: 15.5 }}>A dozen questions, three minutes. Your answers build your plan — and are never shared with anyone. Not even us.</O2Sub>
      </div>
      <O2CTA label="I'm ready to be honest" onClick={next} />
    </React.Fragment>
  );
}
const O2_VAULT = [
  ['Encrypted, always.', "Your answers are encrypted on your device and in transit. We couldn't read them if we wanted to.",
    <g key="i"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="var(--ink)" strokeWidth="1.9" /><path d="M8.2 10.5V7.8a3.8 3.8 0 017.6 0v2.7" stroke="var(--ink)" strokeWidth="1.9" /><circle cx="12" cy="15.4" r="1.4" fill="var(--ink)" /></g>],
  ['Never sold. Never shared.', 'No advertisers, no data brokers, no exceptions. Our revenue is your subscription — you are the customer, not the product.',
    <g key="i"><circle cx="12" cy="12" r="8.5" stroke="var(--ink)" strokeWidth="1.9" /><path d="M6.2 6.2l11.6 11.6" stroke="var(--ink)" strokeWidth="1.9" strokeLinecap="round" /></g>],
  ['Anonymous by design.', 'No real name required. Nothing on your phone screen says what this app is for unless you open it.',
    <g key="i"><circle cx="8" cy="13.5" r="3.4" stroke="var(--ink)" strokeWidth="1.9" /><circle cx="16" cy="13.5" r="3.4" stroke="var(--ink)" strokeWidth="1.9" /><path d="M11.4 13.2c.4-.5 .8-.5 1.2 0M3 10.5l2-4.2M21 10.5l-2-4.2" stroke="var(--ink)" strokeWidth="1.9" strokeLinecap="round" /></g>],
];
function O2S3b_Vault({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" stroke="var(--on-fill)" strokeWidth="2" strokeLinejoin="round" /><path d="M9 11.5l2.2 2.2L15.5 9" stroke="var(--on-fill)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <O2H>Before you tell us anything — here's our promise.</O2H>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          {O2_VAULT.map(([t, s, icon], i) => (
            <O2Card key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 17px' }}>
              <span className="o2-tick" style={{ animationDelay: `${0.15 + i * 0.12}s`, width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: 'var(--soft)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none">{icon}</svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, color: 'var(--ink)', letterSpacing: 'normal' }}>{t}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 4 }}>{s}</div>
              </div>
            </O2Card>
          ))}
        </div>
      </div>
      <O2CTA label="Understood — let's begin" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 1 · QUIZ ═════════════════════════════════════════════
function O2S4_Name({ a, set, next }) {
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 36px' }} />
      <O2H>What should we call you?</O2H>
      <div style={{ marginTop: 30 }}>
        <input value={a.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Your name"
          style={{ width: '100%', appearance: 'none', border: 'none', outline: 'none', background: 'var(--card)', boxShadow: 'none', borderRadius: 34, padding: '20px 24px', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.005em', textAlign: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="var(--ink3)" strokeWidth="2" /><path d="M8.2 10.5V7.8a3.8 3.8 0 017.6 0v2.7" stroke="var(--ink3)" strokeWidth="2" /></svg>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)' }}>Stays on your device.</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <O2CTA label="Continue" enabled={!!(a.name || '').trim()} onClick={next} />
    </React.Fragment>
  );
}
function O2S10_Valid1({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <O2H>You're answering honestly. That's rarer than you think.</O2H>
        <O2Quote text="The quiz alone made me feel less insane." who="Daniel, 26 · day 112" style={{ marginTop: 26 }} />
      </div>
      <O2CTA label="Keep going" onClick={next} />
    </React.Fragment>
  );
}
// S11c — streaks vs recovery (brand-defining)
function O2StreakChart() {
  const W = 320, H = 170, yB = 140;
  const grey = `M10 ${yB} L74 58 L74 ${yB} L172 40 L172 ${yB} L232 88 L232 ${yB} L262 112`;
  const teal = `M10 ${yB - 6} C 60 ${yB - 34}, 70 ${yB - 40}, 96 ${yB - 48} L104 ${yB - 40} C 150 ${yB - 58}, 165 ${yB - 66}, 186 ${yB - 72} L192 ${yB - 66} C 250 ${yB - 88}, 285 ${yB - 100}, 310 ${yB - 108}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="10" y1={yB} x2="310" y2={yB} stroke="var(--line)" strokeWidth="1" />
      {[74, 172, 232].map((x) => (
        <text key={x} x={x} y={yB + 15} textAnchor="middle" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5 }}>back to zero</text>
      ))}
      <path d={grey} stroke="var(--ink4)" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 4" fill="none" opacity="0.8" />
      <path d={`${teal} L310 ${yB} L10 ${yB} Z`} fill="color-mix(in oklab, var(--fill) 7%, transparent)" />
      <path className="onb-draw" d={teal} stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" fill="none" pathLength="1" />
      <circle cx="310" cy={yB - 108} r="5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.6" />
      <g style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10 }}>
        <text x="12" y="16" fill="var(--ink4)">— streaks</text>
        <text x="12" y="32" fill="var(--accent)">— recovery</text>
      </g>
      <text x="310" y={yB - 118} textAnchor="end" fill="var(--ink2)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5 }}>Streak resets. Recovery doesn't.</text>
    </svg>
  );
}
function O2S11c_Streaks({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ height: 10 }} />
        <O2H>You've white-knuckled before. Here's why it didn't hold.</O2H>
        <O2Card style={{ margin: '22px 0 4px', padding: '16px 14px 10px' }}><O2StreakChart /></O2Card>
        <O2Sub>A streak only counts days — it never touches the reasons you relapse. And when it breaks, the counter says you lost <b style={{ color: 'var(--ink)' }}>everything</b>. That lie turns a bad night into a lost week.</O2Sub>
        <O2Sub style={{ marginTop: 18 }}><b style={{ color: 'var(--ink)' }}>VICI tracks recovery instead.</b> Skills learned and triggers defused stay with you. A relapse dents your score — it can't zero it.</O2Sub>
      </div>
      <div style={{ paddingTop: 16 }}><O2CTA label="That's what happened to me" onClick={next} /></div>
    </React.Fragment>
  );
}
function O2S13_Reframe({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 84 }}>
        <O2H>Then tonight matters.</O2H>
        <O2Sub style={{ fontSize: 15.5 }}>Right now you probably feel disgusted with yourself. Read this slowly: <b style={{ color: 'var(--accent)' }}>a relapse is a wave, not the ocean.</b></O2Sub>
      </div>
      <O2CTA label="Keep going" onClick={next} />
    </React.Fragment>
  );
}

// ════════ PHASE 2 · MIRROR ═══════════════════════════════════════════
const O2_ANALYSIS = ['Analyzing dependency markers', 'Comparing against 100,000+ recovery profiles', 'Estimating rewiring timeline', 'Building your plan'];
function O2S18_Analysis({ live = true, next }) {
  const [n, setN] = o2State(live ? 0 : 4);
  o2Effect(() => {
    if (!live) return;
    const id = setInterval(() => setN((v) => {
      if (v >= 4) { clearInterval(id); setTimeout(next, 650); return v; }
      return v + 1;
    }), 1500);
    return () => clearInterval(id);
  }, [live]);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="43" stroke="var(--soft2)" strokeWidth="5" />
          <circle cx="48" cy="48" r="43" stroke="url(#o2ar)" strokeWidth="5" strokeLinecap="round" pathLength="100"
            strokeDasharray={`${Math.max(3, (n / 4) * 100)} 100`} transform="rotate(-90 48 48)" style={{ transition: 'stroke-dasharray .9s cubic-bezier(.4,0,.2,1)' }} />
          <defs><linearGradient id="o2ar" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--fill-lo)" /><stop offset="100%" stopColor="var(--fill-hi)" /></linearGradient></defs>
          <g className="o2-swell"><path d="M26 52 q 11 -9 22 0 t 22 0" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M31 61 q 8.5 -6.5 17 0 t 17 0" stroke="color-mix(in oklab, var(--fill) 45%, transparent)" strokeWidth="2.2" strokeLinecap="round" fill="none" /></g>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, width: 282 }}>
        {O2_ANALYSIS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 11, opacity: i < n ? 1 : 0.3, transition: 'opacity .4s' }}>
            <span style={{ width: 20, height: 20, borderRadius: 9999, flexShrink: 0, background: i < n ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'transparent', boxShadow: i < n ? 'none' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i < n ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="var(--on-fill)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
            </span>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function O2Gauge({ score = 73 }) {
  const r = 92, c = Math.PI * r; // half-circle arc length
  const off = c * (1 - score / 100);
  const th = Math.PI * (1 - score / 100);
  const dot = [124 + r * Math.cos(th), 138 - r * Math.sin(th)];
  return (
    <svg width="248" height="150" viewBox="0 0 248 150" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {/* minor ticks fanned inside the arc */}
      {Array.from({ length: 21 }).map((_, i) => {
        const t = Math.PI * (1 - i / 20), major = i % 5 === 0;
        const r0 = r - (major ? 17 : 13), r1 = r - 9;
        return <line key={i} x1={124 + r0 * Math.cos(t)} y1={138 - r0 * Math.sin(t)} x2={124 + r1 * Math.cos(t)} y2={138 - r1 * Math.sin(t)} stroke={major ? 'var(--ink4)' : 'var(--soft2)'} strokeWidth={major ? 1.6 : 1.1} strokeLinecap="round" />;
      })}
      <path d={`M32 138 A ${r} ${r} 0 0 1 216 138`} stroke="var(--soft2)" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path className="o2-gauge" d={`M32 138 A ${r} ${r} 0 0 1 216 138`} stroke="url(#o2g)" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray={c} strokeDashoffset={off} style={{ '--o2-gfrom': c }} />
      <defs><linearGradient id="o2g" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="var(--fill-lo)" /><stop offset="100%" stopColor="var(--fill-hi)" /></linearGradient></defs>
      {/* the needle-point where his number lands */}
      <circle cx={dot[0]} cy={dot[1]} r="8" fill="var(--bg)" stroke="var(--fill)" strokeWidth="3" />
      <circle cx={dot[0]} cy={dot[1]} r="2.6" fill="var(--fill)" />
      <text x="32" y="149" textAnchor="middle" fill="var(--ink4)" className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9 }}>0</text>
      <text x="216" y="149" textAnchor="middle" fill="var(--ink4)" className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9 }}>100</text>
      <text x="124" y="112" textAnchor="middle" fill="var(--ink)" className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 52, letterSpacing: '-0.02em' }}>{score}</text>
      <text x="124" y="136" textAnchor="middle" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, letterSpacing: '0.12em' }}>OF 100</text>
    </svg>
  );
}
const O2_DUR_ECHO = { 'Under a year': 'less than a year, by your own words', '1–3 years': 'a few years now, by your own words', '3–10 years': 'most of a decade, by your own words', 'Most of my life': 'most of your life, by your own words' };
function O2S19_Score({ a, next }) {
  const score = o2Score(a);
  const band = score >= 70 ? 'Significant dependency' : score >= 45 ? 'Moderate dependency' : 'Early-stage pattern';
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <O2Eyebrow style={{ marginTop: 4 }}>Your dependency score</O2Eyebrow>
        {/* the meter is the moment — air above and below it */}
        <div style={{ flex: 1.1, minHeight: 22 }} />
        <O2Gauge score={score} />
        <div className="o2-tick" style={{ animationDelay: '0.5s', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 21, letterSpacing: '-0.01em', color: 'var(--ink)', marginTop: 20 }}>{band}</div>
        <div className="o2-tick tnum" style={{ animationDelay: '0.7s', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink2)', marginTop: 13, background: 'var(--soft)', boxShadow: 'none', borderRadius: 9999, padding: '6px 13px' }}>Higher than 68% of men here</div>
        <div style={{ flex: 1.3, minHeight: 26 }} />
        <O2Sub style={{ fontSize: 14, marginTop: 0, fontWeight: 500, color: 'var(--ink)' }}>{a.name || 'You'}, you've been carrying this for {O2_DUR_ECHO[a.duration] || 'years'}.</O2Sub>
        <O2Sub style={{ fontSize: 12.5, color: 'var(--ink3)', maxWidth: 300, marginTop: 10 }}>Scored from your answers on frequency, escalation and cost — a starting point, not a verdict.</O2Sub>
      </div>
      <div style={{ paddingTop: 18 }}><O2CTA label="Show me what it means" onClick={next} /></div>
    </React.Fragment>
  );
}
function O2S20_Mirror({ a, next }) {
  const items = [
    [`${a.freq || 'Regular'} use`, true], [`${(a.escal || '').startsWith('Yes') ? 'Significantly escalating' : 'Escalating'} content`, (a.escal || '') !== 'Not really'],
    [`Strongest ${((a.triggers || [])[0] || 'late at night').toLowerCase()}, ${((a.triggers || [])[1] || 'alone').toLowerCase().replace("when i'm ", '')}`, true],
    [`Costing you: ${(a.costs || []).slice(0, 3).map((c) => c.split(' / ')[0].split(' & ')[0].toLowerCase()).join(', ') || 'focus, energy'}`, true],
    [`${a.attempts === "I've lost count" ? 'Countless' : a.attempts === 'Several times' ? '4+' : a.attempts === 'Once or twice' ? '2' : 'No'} previous quit attempts`, true],
  ];
  return (
    <React.Fragment>
      <O2H>Your pattern, in your own words:</O2H>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 22 }}>
        <O2Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid var(--line)', background: 'var(--soft)' }}>
            <O2Eyebrow>Pattern summary</O2Eyebrow>
            <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink3)' }}>JUL 3 · 2026</span>
          </div>
          <div style={{ padding: '3px 18px' }}>
          {items.filter(([, keep]) => keep).map(([t], i, arr) => (
            <div key={i} className="o2-tick" style={{ animationDelay: `${0.1 + i * 0.09}s`, display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--fill)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.35 }}>{t}</span>
            </div>
          ))}
          </div>
        </O2Card>
      </div>
      <O2CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}
const O2_TESTIMONIALS = {
  'Brain fog / can\'t focus': ['The fog was the first thing to go. Week two, I could read again.', 'Alex, 29 · day 84'],
  'Low energy & motivation': ['I stopped needing three coffees to feel like a person by 10am.', 'Sam, 33 · day 61'],
  'Less attraction to real partners': ['Real attraction came back. Slowly, then all at once.', 'Chris, 27 · day 122'],
  'Damage to my relationship': ['She knows. We rebuilt it. That conversation was day one.', 'Mark, 35 · day 148'],
  'Wasted hours & lost sleep': ['I got my nights back first, then my mornings.', 'Dev, 24 · day 45'],
  default: ['I tried five streak apps. This was the first thing that explained why they failed.', 'Jon, 31 · day 97'],
};
function O2S21_Proof({ a, next }) {
  const score = o2Score(a);
  const lo = Math.max(5, Math.floor(score / 10) * 10), hi = lo + 10;
  const band = Math.min(4, Math.max(0, Math.floor(score / 20)));
  const picks = (a.costs || []).filter((c) => O2_TESTIMONIALS[c]).slice(0, 2);
  const quotes = [...picks.map((c) => O2_TESTIMONIALS[c]), O2_TESTIMONIALS.default].slice(0, 3);
  return (
    <React.Fragment>
      <O2H>You're not the only one at {score}.</O2H>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 46, margin: '24px 26px 8px' }}>
        {[16, 26, 40, 30, 15].map((h, i) => (
          <div key={i} style={{ flex: 1, height: h, borderRadius: '6px 6px 2px 2px', background: i === band ? 'linear-gradient(180deg, var(--fill-hi), var(--fill-lo))' : 'var(--soft2)', position: 'relative' }}>
            {i === band ? <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10, letterSpacing: '0.06em', color: 'var(--ink)', whiteSpace: 'nowrap' }}>YOU</span> : null}
          </div>
        ))}
      </div>
      <O2Sub style={{ marginTop: 12 }}><b className="tnum" style={{ color: 'var(--ink)' }}>31%</b> of VICI users start between {lo}–{hi}. Here's what happened to them:</O2Sub>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, paddingBottom: 4 }}>
        {quotes.map(([q, who]) => <O2Quote key={who} text={q} who={who} />)}
      </div>
      <O2CTA label="Continue" onClick={next} />
    </React.Fragment>
  );
}
function O2Curve() {
  const W = 320, H = 178, yB = 148;
  const you = `M12 ${yB - 26} C 40 ${yB - 14} 58 ${yB - 6} 84 ${yB - 12} C 130 ${yB - 24} 180 ${yB - 62} 232 ${yB - 88} C 262 ${yB - 102} 288 ${yB - 112} 308 ${yB - 118}`;
  const flat = `M12 ${yB - 26} C 80 ${yB - 20} 180 ${yB - 12} 308 ${yB - 2}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="12" y1={yB} x2="308" y2={yB} stroke="var(--line)" strokeWidth="1" />
      {/* the hard-part band, weeks 1–2 */}
      <rect x="12" y="18" width="72" height={yB - 18} fill="color-mix(in oklab, var(--ink) 3.5%, transparent)" rx="6" />
      <path d={flat} stroke="var(--ink4)" strokeWidth="1.8" strokeDasharray="3 5" fill="none" opacity="0.85" />
      <text x="306" y={yB + 13} textAnchor="end" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9 }}>without a plan</text>
      <path d={`${you} L308 ${yB} L12 ${yB} Z`} fill="color-mix(in oklab, var(--fill) 7%, transparent)" />
      <path className="onb-draw" d={you} stroke="url(#o2c)" strokeWidth="3" strokeLinecap="round" fill="none" pathLength="1" />
      <defs><linearGradient id="o2c" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="var(--fill-lo)" /><stop offset="100%" stopColor="var(--fill-hi)" /></linearGradient></defs>
      <circle cx="12" cy={yB - 26} r="8" className="onb-pulse" fill="var(--fill)" opacity="0.35" />
      <circle cx="12" cy={yB - 26} r="4.5" fill="var(--bg)" stroke="var(--fill)" strokeWidth="2.4" />
      <text x="12" y={yB + 13} fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9, letterSpacing: '0.08em' }}>TODAY</text>
      <rect x="30" y={yB - 4} width="70" height="0" fill="none" />
      <text x="58" y={yB - 30} textAnchor="middle" fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9 }}>weeks 1–2 · the hard part</text>
      {[[84, yB - 12, 'Day 14', 'urges weaken'], [232, yB - 88, 'Day 30', 'clarity returns'], [308, yB - 118, 'Day 90', 'rewired baseline']].map(([x, y, d, s]) => (
        <g key={d}>
          <circle cx={x} cy={y} r="4.5" fill="var(--bg)" stroke="var(--fill)" strokeWidth="2.4" />
          <text x={x === 308 ? x - 2 : x} y={y - 22} textAnchor={x === 308 ? 'end' : 'middle'} fill="var(--ink)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5 }}>{d}</text>
          <text x={x === 308 ? x - 2 : x} y={y - 11} textAnchor={x === 308 ? 'end' : 'middle'} fill="var(--ink3)" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5 }}>{s}</text>
        </g>
      ))}
    </svg>
  );
}
function O2S22_Prognosis({ next }) {
  return (
    <React.Fragment>
      <div style={{ flex: '0 0 16px' }} />
      <O2H>Your brain can rewire. Here's your projected timeline.</O2H>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <O2Card style={{ padding: '18px 14px 12px' }}><O2Curve /></O2Card>
        <O2Note style={{ marginTop: 15 }}>The dip in weeks 1–2 is real. That's the stretch we guard with you.</O2Note>
      </div>
      <O2CTA label="Show me the method" onClick={next} />
    </React.Fragment>
  );
}

Object.assign(window, {
  O2_DEMO, o2Register, o2Score, o2Night, O2Shell, O2Ambient, O2H, O2Sub, O2Eyebrow, O2CTA, O2Row, O2Question, O2Card, O2Quote, O2Sea, O2Gauge, O2Curve, O2StreakChart,
  O2S1_Door, O2S2_Promise, O2S3_Framing, O2S3b_Vault, O2S4_Name, O2S10_Valid1, O2S11c_Streaks, O2S13_Reframe,
  O2S18_Analysis, O2S19_Score, O2S20_Mirror, O2S21_Proof, O2S22_Prognosis,
});
