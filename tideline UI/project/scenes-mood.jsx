// scenes-mood.jsx — the check-in's seven mood medallions.
// Each is a full faceted-planar scene inside a circular vignette,
// morphing CONTINUOUSLY with t (0 = low … 1 = radiant) so the slider
// feels alive. Same paper palette and lit/shade-plane language as
// TipScene and the worlds map; gradients only for literal light.
//
// Exports (window): MoodScenes = { weather, tide, moon, bloom, rings, aurora, orb }

const { useRef: msRef } = React;

const MK = () => window.SceneKit;

// medallion shell: circular clip + faint rim
function Medallion({ sky, children }) {
  const uid = msRef('md' + Math.random().toString(36).slice(2, 7)).current;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="ci-breathe" style={{ display: 'block' }}>
      <defs><clipPath id={`clip-${uid}`}><circle cx="100" cy="100" r="96" /></clipPath></defs>
      <g clipPath={`url(#clip-${uid})`}>
        <rect width="200" height="200" fill={sky} />
        {children}
      </g>
      <circle cx="100" cy="100" r="95.2" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.6" />
    </svg>
  );
}

// wavy band that fills to the bottom of the medallion
function mBand(y, a, segs = 3) {
  const seg = 200 / segs;
  let d = `M-2 ${y}`;
  for (let i = 0; i < segs; i++) {
    const x0 = -2 + i * seg, dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${x0 + seg * 0.33} ${y + dir * a}, ${x0 + seg * 0.66} ${y + dir * a}, ${x0 + seg} ${y}`;
  }
  return `${d} L202 202 L-2 202 Z`;
}
function mLine(y, a, segs = 3, x0 = -2, x1 = 202) {
  const seg = (x1 - x0) / segs;
  let d = `M${x0} ${y}`;
  for (let i = 0; i < segs; i++) {
    const sx = x0 + i * seg, dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`;
  }
  return d;
}
// warm glow disc for literal light (lamp / flame / aurora edge)
function MGlow({ cx, cy, r, color = '#EBCD8C', op = 0.5 }) {
  const uid = msRef('gl' + Math.random().toString(36).slice(2, 7)).current;
  return (
    <g opacity={op}>
      <defs>
        <radialGradient id={uid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="60%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid})`} />
    </g>
  );
}

// ═════════════════════════════════════════════════════════════════════
// WEATHER (default) — the day over the bay: storm → clearing → radiant
// ═════════════════════════════════════════════════════════════════════
function MoodSceneWeather({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S, scMix: X, SGull, SSun } = MK();
  const sky = X('#D8D3BF', SC.skyTop, t);
  const sunOn = S(t, 0.3, 0.62);
  const rain = 1 - S(t, 0.1, 0.42);
  const bolt = 1 - S(t, 0.04, 0.16);
  const lift = S(t, 0.35, 0.9);               // the cloud lifts away late
  const bossOp = 1 - S(t, 0.6, 0.92);
  const amp = L(6.5, 2.2, t);
  const cloudLit = X('#C9C4AE', '#FBFAF4', t);
  const cloudSh = X('#A8A38C', '#E1DECF', t);
  return (
    <Medallion sky={sky}>
      {/* the sun climbs out of the sea as the day clears */}
      <SSun cx={L(124, 106, t)} cy={L(122, 56, t)} r={L(11, 17, t)} glow={2.8} op={sunOn} />
      {/* far headland across the bay — grounded, rising out of the water */}
      <path d="M14 141 L52 112 L94 141 Z" fill={SC.far} />
      <path d="M52 112 L94 141 L70 141 Z" fill={SC.farShade} />
      {/* the storm bank — rain travels WITH it as it lifts away */}
      <g opacity={bossOp} transform={`translate(${L(0, -22, lift)} ${L(0, -40, lift)}) scale(${L(1, 0.74, lift)})`}>
        <path d="M42 92 C 36 76 52 64 70 68 C 76 50 106 45 120 60 C 136 51 156 61 154 76 C 165 79 163 91 150 92 Z" fill={cloudLit} />
        <path d="M48 92 L150 92 C 149.5 98.2 142.5 101.8 133 101.2 C 124.5 104.6 105.5 104.6 97 101.2 C 84 102.2 68 101.4 58.5 99 C 52 97.4 48.4 94.8 48 92 Z" fill={cloudSh} opacity="0.8" />
        <path d="M54 72 C 62 64 76 62 86 66" stroke={SC.snow} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity={0.5 + t * 0.4} />
        {/* rain, hanging from the cloud */}
        <g stroke={X('#948F77', '#AEA98F', t)} strokeWidth="2.1" strokeLinecap="round" opacity={rain}>
          <path d="M64 106 l-4 13 M86 108 l-4 13 M108 106 l-4 13 M130 108 l-4 13 M75 122 l-3.4 11 M97 124 l-3.4 11 M119 122 l-3.4 11" />
        </g>
        {/* one crack of lightning at the very bottom of the scale */}
        <path d="M102 98 L94 116 L101 116 L92 134 L108 114 L100 114 L108 98 Z" fill="#8E8E80" opacity={bolt} />
      </g>
      {/* a fair-weather wisp arrives late */}
      <g opacity={S(t, 0.72, 0.95) * 0.8}>
        <path d="M134 74 C 132 68 138 64 145 66 C 148 60 159 59 163 64 C 169 62 175 66 174 71 C 177 73 175 78 169 78 L141 78 C 137 78 134 76 134 74 Z" fill="#FBFAF4" />
        <path d="M139 78 L169 78 C 168.5 81 164.5 82.8 160 82.4 C 156 84.2 149 84.2 145.5 82.4 C 142 82.6 139.4 80.6 139 78 Z" fill={SC.farShade} opacity="0.6" />
      </g>
      {/* the sea — three banded planes, choppy → glassy */}
      <g className="onb-bob2">
        <path d={mBand(132, amp)} fill={SC.waterHi} />
        <path d={mLine(132, amp)} stroke={SC.foam} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
      {/* sun's column on the water */}
      <g opacity={S(t, 0.45, 0.75) * 0.8}>
        <path d="M98 138 h14 M101 146 h10 M99 154 h8" stroke={SC.foam} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="onb-bob">
        <path d={mBand(154, amp * 0.85)} fill={SC.water} />
        <path d={mLine(154, amp * 0.85)} stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <circle cx="54" cy="149" r="1.8" fill={SC.foam} opacity={rain * 0.9} />
        <circle cx="74" cy="152" r="1.3" fill={SC.foam} opacity={rain * 0.7} />
        <circle cx="142" cy="150" r="1.6" fill={SC.foam} opacity={rain * 0.8} />
      </g>
      <path d={mBand(176, amp * 0.7)} fill={SC.waterLo} />
      <path d={mLine(176, amp * 0.7)} stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* gulls return with the light */}
      <SGull x={64} y={86} s={0.9} o={S(t, 0.55, 0.8) * 0.75} />
      <SGull x={86} y={76} s={0.7} o={S(t, 0.64, 0.88) * 0.55} />
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// TIDE — the shore walk: the sun climbs, the surf settles, footprints
// carry on up the beach, and a cairn stacks itself stone by stone
// ═════════════════════════════════════════════════════════════════════
function MoodSceneTide({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S, scMix: X, SGull, SSun, SStar5, SBoat, SGrass } = MK();
  const sky = X('#D8D3BF', SC.skyTop, t);
  const amp = L(7, 2, t);
  const chop = 1 - S(t, 0.15, 0.55);
  return (
    <Medallion sky={sky}>
      <SSun cx={100} cy={L(104, 44, t)} r={L(12, 18, t)} glow={2.8} op={0.4 + S(t, 0.08, 0.45) * 0.6} />
      {/* far sail, only in fair weather */}
      <g opacity={S(t, 0.6, 0.85)}><SBoat x={152} y={104} s={0.42} /></g>
      {/* horizon + mid sea */}
      <g className="onb-bob2">
        <path d={mBand(114, amp)} fill={SC.waterHi} />
        <path d={mLine(114, amp)} stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75" />
        <circle cx="44" cy="110" r="1.8" fill={SC.foam} opacity={chop * 0.95} />
        <circle cx="66" cy="107" r="1.3" fill={SC.foam} opacity={chop * 0.7} />
        <circle cx="152" cy="109" r="1.5" fill={SC.foam} opacity={chop * 0.85} />
      </g>
      {/* sun's reflection, strengthening */}
      <g opacity={S(t, 0.35, 0.65) * 0.85}>
        <path d="M93 119 h14 M96 126 h10" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g className="onb-bob">
        <path d={mBand(132, amp * 0.85)} fill={SC.water} />
        <path d={mLine(132, amp * 0.85)} stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
        <circle cx="118" cy="128" r="1.6" fill={SC.foam} opacity={chop * 0.8} />
      </g>
      {/* the surf line — a winding foam ribbon meeting the sand */}
      <path d="M-2 150 C 34 142 62 152 98 146 C 134 140 162 150 202 142 L202 158 C 164 164 134 154 100 160 C 66 165 32 156 -2 164 Z" fill={SC.foam} />
      {/* wet + dry sand planes */}
      <path d="M-2 164 C 32 156 66 165 100 160 C 134 154 164 164 202 158 L202 202 L-2 202 Z" fill={SC.fgLit} />
      <path d="M-2 184 C 60 178 130 184 202 178 L202 202 L-2 202 Z" fill={SC.fgShade} opacity="0.55" />
      {/* foam arcs licking the sand */}
      <path d="M24 168 q 28 -7 56 -2" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M114 162 q 26 -6 52 -1" stroke={SC.foam} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
      {/* footprints wander up the beach as the mood lifts */}
      {[[58, 186], [73, 180], [89, 175], [105, 170], [120, 165]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="2" fill={SC.fgDeep}
          opacity={S(t, 0.16 + i * 0.11, 0.32 + i * 0.11) * (0.75 - i * 0.07)}
          transform={`rotate(${-16 + i * 4} ${x} ${y})`} />
      ))}
      {/* the cairn stacks itself, stone by stone */}
      <g transform="translate(150 176)">
        <ellipse cx="0" cy="4.5" rx="11.5" ry="4.4" fill={SC.fgShade} opacity={0.5 + S(t, 0.02, 0.2) * 0.5} />
        <ellipse cx="0" cy="-0.5" rx="8" ry="3.4" fill={SC.fgDeep} opacity={S(t, 0.28, 0.44)} />
        <ellipse cx="0" cy="-5.6" rx="5.3" ry="2.7" fill={SC.fgShade} opacity={S(t, 0.52, 0.68)} />
        <circle cx="0" cy="-10.4" r="2.5" fill={SC.fgDeep} opacity={S(t, 0.78, 0.92)} />
      </g>
      <SStar5 x={40} y={174} s={1.05} c={SC.fgDeep} rot={-10} />
      <SGrass x={174} y={192} s={1} />
      <SGull x={56} y={64} s={0.9} o={S(t, 0.5, 0.78) * 0.75} />
      <SGull x={78} y={54} s={0.7} o={S(t, 0.6, 0.86) * 0.55} />
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MOON — the night watch: a crescent waxes to full, stars come out,
// moonlight widens on the water below the ridge
// ═════════════════════════════════════════════════════════════════════
const MOON_STARS = [
  [30, 36, 1.5], [58, 20, 1.1], [152, 26, 1.4], [174, 52, 1.1], [22, 78, 1.2],
  [186, 92, 1], [128, 16, 1.2], [70, 48, 0.9], [162, 70, 0.9], [40, 104, 1],
];
function MoodSceneMoon({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S, scMix: X, SPine } = MK();
  const sky = X('#CBC6B0', '#A39E87', t);
  const r = L(23, 31, t);
  const shadowX = 100 - (8 + 62 * t);      // slides off as it waxes
  return (
    <Medallion sky={sky}>
      {/* stars arrive with the deepening night */}
      {MOON_STARS.map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y} r={rr} fill={SC.snow}
          className={i % 3 === 0 ? 'onb-twinkle' : undefined}
          style={i % 3 === 0 ? { animationDelay: `${i * 0.5}s` } : undefined}
          opacity={S(t, 0.12 + i * 0.06, 0.3 + i * 0.06) * (0.5 + (i % 2) * 0.4)} />
      ))}
      {/* the moon — body, craters, then the shadow slides away */}
      <circle cx="100" cy="70" r={r} fill={SC.snow} stroke={SC.farShade} strokeWidth="1.4" />
      <g opacity={S(t, 0.2, 0.55)}>
        <circle cx={100 - r * 0.32} cy={70 - r * 0.12} r={r * 0.16} fill="#E7E4D7" />
        <circle cx={100 - r * 0.02} cy={70 + r * 0.34} r={r * 0.11} fill="#E7E4D7" />
        <circle cx={100 + r * 0.3} cy={70 + r * 0.02} r={r * 0.09} fill="#E7E4D7" />
        <circle cx={100 + r * 0.14} cy={70 - r * 0.3} r={r * 0.07} fill="#E7E4D7" />
      </g>
      <circle cx={shadowX} cy="70" r={r + 3} fill={sky} />
      <MGlow cx={100} cy={70} r={r * 2.6} color="#F1EDDA" op={L(0.14, 0.5, t)} />
      {/* the ridge — dark facets against the sky */}
      <path d="M-2 152 L48 118 L106 152 Z" fill={SC.nightRidge} />
      <path d="M48 118 L106 152 L78 152 Z" fill={SC.nightRidgeSh} />
      <path d="M92 152 L148 124 L202 152 Z" fill={SC.nightRidge} />
      <path d="M148 124 L202 152 L176 152 Z" fill={SC.nightRidgeSh} />
      <path d="M48 118 L42 127 C 47 123 52 124 55 128 Z" fill={SC.snow} opacity={0.5 + t * 0.4} />
      <SPine x={30} y={150} s={0.85} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      <SPine x={126} y={150} s={0.7} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      <SPine x={168} y={148} s={0.9} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      {/* still water under the ridge */}
      <path d="M-2 152 H202 V202 H-2 Z" fill={SC.nightRidgeSh} />
      <path d={mBand(168, 1.8)} fill={SC.nightDeep} />
      {/* the moon's column, widening as it fills */}
      <g opacity={L(0.18, 0.75, t)}>
        <path d={`M${100 - L(4, 8, t)} 157 h${L(8, 16, t)}`} stroke="#EFEBD8" strokeWidth="3" strokeLinecap="round" />
        <path d={`M${100 - L(3, 6, t)} 166 h${L(6, 12, t)}`} stroke="#EFEBD8" strokeWidth="2.6" strokeLinecap="round" />
        <path d={`M${100 - L(2.2, 4.5, t)} 175 h${L(4.4, 9, t)}`} stroke="#EFEBD8" strokeWidth="2.2" strokeLinecap="round" />
        <path d={`M${100 - L(1.5, 3, t)} 184 h${L(3, 6, t)}`} stroke="#EFEBD8" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// BLOOM — TipScene's windowsill, alive: a potted flower unfolds petal
// by petal beside a closed book; a petal falls at radiant
// ═════════════════════════════════════════════════════════════════════
function MoodSceneBloom({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S } = MK();
  const stemH = L(30, 58, t);
  const headX = 96 + L(-8, 0, t), headY = 132 - stemH;
  const petals = Array.from({ length: 8 });
  return (
    <Medallion sky="#F2EFE4">
      {/* daylight through the window */}
      <MGlow cx={140} cy={48} r={84} color="#F8F3DE" op={0.45 + t * 0.4} />
      {/* the sill — lit top + shaded front (TipScene's exact grammar) */}
      <path d="M2 132 L198 132 L198 144 L2 144 Z" fill={SC.midLit} />
      <path d="M2 144 L198 144 L192 168 L8 168 Z" fill={SC.nearShade} />
      <path d="M-2 168 H202 V202 H-2 Z" fill="#EDEAE0" />
      {/* companion sprout, far left */}
      <g transform="translate(42 132)">
        <path d="M-9 0 L9 0 L7 15 L-7 15 Z" fill={SC.snow} />
        <path d="M2 0 L9 0 L7 15 L2 15 Z" fill={SC.midShade} />
        <ellipse cx="0" cy="0" rx="9" ry="2.8" fill={SC.fgLit} />
        <path d="M0 -1 C 0 -6 -1 -10 -2 -13" stroke={SC.fgShade} strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M-2 -13 C -8 -15 -10 -12 -10 -8 C -6 -8 -3 -10 -2 -13 Z" fill={SC.nearShade} />
        <path d="M-2 -13 C 3 -17 6 -14 6 -11 C 3 -9 -1 -11 -2 -13 Z" fill={SC.fgShade} />
      </g>
      {/* the closed book, right — straight out of TipScene */}
      <g transform="translate(146 132)">
        <path d="M-22 0 L22 0 L22 -10 L-22 -10 Z" fill={SC.nearShade} />
        <path d="M-22 -10 L22 -10 L22 -7 L-22 -7 Z" fill={SC.snow} />
        <path d="M-18 -10 L26 -10 L26 -20 L-18 -20 Z" fill={SC.midShade} />
        <path d="M-18 -20 L26 -20 L26 -17 L-18 -17 Z" fill="#EDEAE0" />
      </g>
      {/* the pot — lit body, shaded side, rim */}
      <g transform="translate(96 132)">
        <path d="M-17 0 L17 0 L13 27 L-13 27 Z" fill="#FCFBF8" />
        <path d="M6 0 L17 0 L13 27 L7 27 Z" fill={SC.midShade} />
        <ellipse cx="0" cy="0" rx="17" ry="4.2" fill={SC.fgLit} />
        <ellipse cx="0" cy="-0.4" rx="13" ry="3" fill={SC.fgShade} />
        <path d="M-15 30 L15 30 L13 33 L-13 33 Z" fill={SC.nearShade} opacity="0.8" />
      </g>
      {/* the stem — leans while young, straightens as it opens */}
      <path d={`M96 132 C ${L(92, 96, t)} ${132 - stemH * 0.5} ${headX} ${132 - stemH * 0.8} ${headX} ${headY}`}
        stroke={SC.fgShade} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* leaves — facet pairs that open with t */}
      <g transform={`translate(${L(94.5, 96, t)} ${132 - stemH * 0.42}) rotate(${L(-12, -32, t)}) scale(${L(0.9, 1.15, t)})`}>
        <path d="M0 0 C -9 -2 -14 2 -14 8 C -8 8 -2 4 0 0 Z" fill={SC.nearShade} />
        <path d="M0 0 C -7 3 -12 8 -14 8 C -9 10 -2 5 0 0 Z" fill={SC.fgShade} />
      </g>
      <g transform={`translate(${L(95, 96, t)} ${132 - stemH * 0.66}) rotate(${L(10, 28, t)}) scale(${L(-0.85, -1.05, t)} ${L(0.85, 1.05, t)})`}>
        <path d="M0 0 C -8 -2 -12 2 -12 7 C -7 7 -2 3 0 0 Z" fill={SC.nearShade} />
        <path d="M0 0 C -6 2 -10 7 -12 7 C -8 9 -2 4 0 0 Z" fill={SC.fgShade} />
      </g>
      {/* sepals hug the bud at the low end */}
      <g opacity={1 - S(t, 0.42, 0.72)}>
        <path d={`M${headX} ${headY + 3} C ${headX - 7} ${headY - 2} ${headX - 6} ${headY - 12} ${headX - 1} ${headY - 14} C ${headX - 2} ${headY - 7} ${headX - 1} ${headY - 1} ${headX} ${headY + 3} Z`} fill={SC.nearShade} />
        <path d={`M${headX} ${headY + 3} C ${headX + 7} ${headY - 2} ${headX + 6} ${headY - 12} ${headX + 1} ${headY - 14} C ${headX + 2} ${headY - 7} ${headX + 1} ${headY - 1} ${headX} ${headY + 3} Z`} fill={SC.fgShade} />
      </g>
      {/* petals — unfold one at a time around the core */}
      {petals.map((_, j) => {
        const open = S(t, 0.06 + j * 0.085, 0.24 + j * 0.085);
        if (open <= 0.01) return null;
        const ang = j * 45 + L(28, 0, t);
        const off = L(3.5, 14, open);
        const ry = L(5, 15.5, open);
        return (
          <g key={j} transform={`rotate(${ang} ${headX} ${headY})`} opacity={0.4 + open * 0.6}>
            <ellipse cx={headX} cy={headY - off} rx={L(2.8, 7, open)} ry={ry}
              fill={j % 2 ? '#E9E5D6' : SC.snow} />
            <path d={`M${headX} ${headY - off - ry} C ${headX + L(1.6, 4.4, open)} ${headY - off - ry * 0.45} ${headX + L(1.6, 4.4, open)} ${headY - off + ry * 0.45} ${headX} ${headY - off + ry}`}
              fill={SC.nearShade} opacity="0.4" />
          </g>
        );
      })}
      {/* the core */}
      <circle cx={headX} cy={headY} r={L(3.6, 7.2, t)} fill={SC.fgShade} />
      <circle cx={headX - 1.2} cy={headY - 1.2} r={L(1.7, 3.3, t)} fill={SC.fgLit} />
      {/* a petal come to rest on the sill, only at the top of the scale */}
      <g opacity={S(t, 0.72, 0.92)}>
        <ellipse cx="122" cy="140" rx="5.4" ry="2.6" fill={SC.snow} transform="rotate(-18 122 140)" />
        <ellipse cx="123.5" cy="140.5" rx="2.6" ry="1.3" fill={SC.nearShade} transform="rotate(-18 123 140)" opacity="0.6" />
      </g>
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// RINGS — the tide pool: a dropped pebble; rings reach further as the
// mood rises; stones, driftwood and a starfish keep the pool company
// ═════════════════════════════════════════════════════════════════════
function MoodSceneRings({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S, SStar5, SGrass, SPebbles } = MK();
  const rings = [0, 1, 2, 3, 4];
  return (
    <Medallion sky={SC.fgLit}>
      {/* sand — a lit sweep upper-left, shade arc low */}
      <path d="M-2 60 C 40 44 120 38 202 52 L202 -2 L-2 -2 Z" fill={SC.nearLit} opacity="0.7" />
      <path d="M-2 170 C 60 162 140 162 202 170 L202 202 L-2 202 Z" fill={SC.fgShade} opacity="0.55" />
      {/* the pool — foam rim, sky-mirror water, shaded inner edge */}
      <ellipse cx="100" cy="108" rx="68" ry="44" fill={SC.foam} />
      <ellipse cx="100" cy="107" rx="61" ry="38" fill={SC.skyTop} />
      <path d="M46 96 C 60 85 82 79 104 79" stroke={SC.farShade} strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* the pebble, just dropped — splash crown fades as rings take over */}
      <circle cx="100" cy="105" r="3.6" fill={SC.fgDeep} />
      <g stroke={SC.waterLo} strokeWidth="1.9" strokeLinecap="round" opacity={1 - S(t, 0.12, 0.34)}>
        <path d="M95 98 l-2.6 -4.8 M100 97 l0 -5.5 M105 98 l2.6 -4.8" />
      </g>
      {/* rings — each reaches further out as t rises */}
      {rings.map((j) => {
        const vis = S(t, j * 0.13, j * 0.13 + 0.2);
        if (vis <= 0.01) return null;
        const rx = L(7, 13 + j * 11.5, vis), ry = rx * 0.6;
        return (
          <ellipse key={j} cx="100" cy="105" rx={rx} ry={ry} fill="none"
            stroke={j % 2 ? SC.waterLo : SC.water} strokeWidth={2.6 - j * 0.35}
            opacity={vis * (0.95 - j * 0.13)} />
        );
      })}
      {/* sun glint on the pool at the top of the scale */}
      <ellipse cx="128" cy="89" rx="9.5" ry="4" fill={SC.snow} opacity={S(t, 0.55, 0.85) * 0.9} />
      <circle cx="118" cy="96" r="1.6" fill={SC.snow} opacity={S(t, 0.65, 0.9) * 0.8} />
      {/* pebble clusters at the rim */}
      <SPebbles x={44} y={130} s={1} />
      <SPebbles x={158} y={136} s={0.85} />
      <SPebbles x={156} y={68} s={0.7} />
      {/* driftwood, grass, starfish */}
      <g transform="rotate(-9 62 48)">
        <rect x="34" y="44" width="52" height="6.4" rx="3.2" fill={SC.fgDeep} />
        <rect x="34" y="44" width="52" height="2.8" rx="1.4" fill={SC.fgShade} />
        <path d="M82 46 L94 41" stroke={SC.fgDeep} strokeWidth="2.8" strokeLinecap="round" />
      </g>
      <SStar5 x={56} y={162} s={1.15} rot={-20} />
      <SGrass x={168} y={172} s={1.05} />
      <circle cx="88" cy="162" r="2" fill={SC.fgDeep} opacity="0.5" />
      <circle cx="134" cy="58" r="1.8" fill={SC.fgDeep} opacity="0.4" />
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// AURORA — ribbons of light sweep over a dark valley; a cabin window
// warms when the mood is high
// ═════════════════════════════════════════════════════════════════════
function AuroraRibbon({ cx, botY, wBot, wTop, bend, tilt, on, warm = false }) {
  const { scLerp: L, scSmooth: S } = MK();
  const topY = L(botY - 24, 10, on);
  const h = botY - topY;
  const d = `M${cx - wBot / 2} ${botY}
    C ${cx - wBot / 2 + bend} ${botY - h * 0.35} ${cx - wTop / 2 - bend} ${topY + h * 0.32} ${cx - wTop / 2 + bend * 0.4} ${topY}
    L ${cx + wTop / 2 + bend * 0.4} ${topY + 3}
    C ${cx + wTop / 2 - bend} ${topY + h * 0.36} ${cx + wBot / 2 + bend * 0.85} ${botY - h * 0.32} ${cx + wBot / 2} ${botY} Z`;
  const edge = `M${cx - wBot / 2} ${botY} C ${cx - wBot / 2 + bend} ${botY - h * 0.35} ${cx - wTop / 2 - bend} ${topY + h * 0.32} ${cx - wTop / 2 + bend * 0.4} ${topY}`;
  return (
    <g opacity={on * 0.9} transform={`rotate(${tilt} ${cx} ${botY - h / 2})`}>
      <path d={d} fill="#EFEBD8" opacity="0.4" />
      <path d={edge} stroke="#F7F4E4" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.95" />
      {warm && <path d={edge} stroke="#EFE0B4" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" transform={`translate(3 0)`} />}
    </g>
  );
}
function MoodSceneAurora({ t = 0.5 }) {
  const { SC, scSmooth: S, scMix: X, SPine } = MK();
  const sky = X('#C6C1AB', '#9A9580', t);
  return (
    <Medallion sky={sky}>
      {MOON_STARS.slice(0, 8).map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y * 0.8 + 6} r={rr * 0.9} fill={SC.snow}
          className={i % 3 === 1 ? 'onb-twinkle' : undefined}
          opacity={S(t, 0.1 + i * 0.06, 0.28 + i * 0.06) * (0.45 + (i % 2) * 0.4)} />
      ))}
      {/* the curtains — swept, tilted, tapering; they grow with t */}
      <AuroraRibbon cx={60} botY={122} wBot={30} wTop={12} bend={16} tilt={-14} on={S(t, 0.08, 0.36)} />
      <AuroraRibbon cx={102} botY={130} wBot={36} wTop={14} bend={-14} tilt={5} on={S(t, 0.26, 0.54)} warm />
      <AuroraRibbon cx={142} botY={118} wBot={26} wTop={10} bend={18} tilt={-8} on={S(t, 0.46, 0.74)} />
      <AuroraRibbon cx={172} botY={110} wBot={18} wTop={8} bend={-10} tilt={10} on={S(t, 0.68, 0.92)} />
      {/* the valley — ridge silhouettes, pines, a cabin */}
      <path d="M-2 150 L54 116 L118 150 Z" fill={SC.nightRidge} />
      <path d="M54 116 L118 150 L86 150 Z" fill={SC.nightRidgeSh} />
      <path d="M104 150 L152 126 L202 150 Z" fill={SC.nightRidge} />
      <path d="M152 126 L202 150 L178 150 Z" fill={SC.nightRidgeSh} />
      <path d="M54 116 L48 125 C 53 121 58 122 61 126 Z" fill={SC.snow} opacity={0.5 + t * 0.4} />
      <path d="M-2 150 H202 V202 H-2 Z" fill={SC.nightRidgeSh} />
      <path d={mBand(170, 2)} fill={SC.nightDeep} />
      <SPine x={36} y={148} s={0.9} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      <SPine x={94} y={148} s={0.68} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      <SPine x={124} y={146} s={0.8} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      {/* the cabin — its window lights when the mood is high */}
      <g transform="translate(154 136)">
        <path d="M-12 14 L-12 2 L12 2 L12 14 Z" fill={SC.nightRidgeSh} />
        <path d="M4 2 L12 2 L12 14 L4 14 Z" fill={SC.nightDeep} />
        <path d="M-15 3 L0 -9 L15 3 Z" fill={SC.nightDeep} />
        <MGlow cx={-3} cy={8} r={14} op={S(t, 0.55, 0.85) * 0.9} />
        <rect x="-6.8" y="5" width="6.8" height="6" rx="1" fill="#F2DCA4" opacity={0.25 + S(t, 0.55, 0.85) * 0.75} />
        <path d="M9 -5 C 10 -8 8 -10 9 -13" stroke={SC.nightDeep} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={S(t, 0.6, 0.9) * 0.9} />
      </g>
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ORB — the lantern: it lifts off the dark water and burns brighter as
// the mood rises; companions join at the top of the scale
// ═════════════════════════════════════════════════════════════════════
function Lantern({ x, y, s = 1, glow = 0.5, flame = 3, simple = false }) {
  const { SC } = MK();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <MGlow cx={0} cy={0} r={simple ? 30 : 42} op={glow} />
      {/* body — a tall paper dome: lit + shade faces, curved ribs */}
      <path d="M-11 -8 C -11 -20 11 -20 11 -8 C 11 2 9 10 6 14 C 3 16 -3 16 -6 14 C -9 10 -11 2 -11 -8 Z" fill="#F8F4E4" />
      <path d="M2 -16.6 C 7 -15.6 11 -12.4 11 -8 C 11 2 9 10 6 14 C 4.5 15 2.5 15.6 1 15.8 C 4 8 5 -6 2 -16.6 Z" fill="#DFD9C0" />
      {!simple && <path d="M-10.6 -6 C -4 -8.4 4 -8.4 10.6 -6 M-10.2 1 C -4 -1 4 -1 10.2 1 M-8.8 8 C -3.6 6.4 3.6 6.4 8.8 8" stroke={SC.fgLit} strokeWidth="1.2" fill="none" opacity="0.95" />}
      {/* cap + hanger, base rim */}
      <path d="M-5 -16.4 L5 -16.4 L4 -19 L-4 -19 Z" fill={SC.fgShade} />
      {!simple && <path d="M0 -19 C 0 -21.5 2.5 -22.5 4 -21" stroke={SC.fgShade} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      <path d="M-6 14.6 L6 14.6 L5 17 L-5 17 Z" fill={SC.fgShade} />
      {/* the flame */}
      <circle cx="0" cy="1" r={flame} fill="#F2A94E" />
      <circle cx="0" cy="0.2" r={flame * 0.45} fill="#FBE3B0" />
    </g>
  );
}
function MoodSceneOrb({ t = 0.5 }) {
  const { SC, scLerp: L, scSmooth: S, scMix: X, SPine } = MK();
  const sky = X('#CFCAB6', '#A9A48D', t);
  const y = L(120, 52, t);
  return (
    <Medallion sky={sky}>
      {MOON_STARS.slice(0, 9).map(([x, sy, rr], i) => (
        <circle key={i} cx={x} cy={sy * 0.75 + 4} r={rr * 0.9} fill={SC.snow}
          className={i % 4 === 1 ? 'onb-twinkle' : undefined}
          opacity={S(t, 0.2 + i * 0.07, 0.4 + i * 0.07) * (0.4 + (i % 2) * 0.4)} />
      ))}
      {/* far shore silhouette for depth */}
      <path d="M118 142 L156 124 L202 142 Z" fill={SC.nightRidge} opacity="0.85" />
      <path d="M156 124 L202 142 L180 142 Z" fill={SC.nightRidgeSh} opacity="0.85" />
      <SPine x={188} y={140} s={0.6} lit={SC.nightRidgeSh} sh={SC.nightDeep} />
      {/* dusk water */}
      <g className="onb-bob2">
        <path d={mBand(142, L(4, 2, t))} fill={X('#9C977F', '#8F8A74', t)} />
        <path d={mLine(142, L(4, 2, t))} stroke="#EFEBD8" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45" />
      </g>
      <path d={mBand(170, L(3, 1.6, t))} fill={X('#8F8A74', '#827D67', t)} />
      <path d={mLine(170, L(3, 1.6, t))} stroke="#EFEBD8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.3" />
      {/* ripples where the light sits on the water — strongest when low */}
      <g opacity={1 - S(t, 0.4, 0.75)}>
        <ellipse cx="100" cy="143" rx={L(17, 9, t)} ry="2.8" fill="none" stroke="#EFEBD8" strokeWidth="1.7" opacity="0.75" />
        <ellipse cx="100" cy="144" rx={L(27, 15, t)} ry="4.4" fill="none" stroke="#EFEBD8" strokeWidth="1.2" opacity="0.4" />
      </g>
      {/* the reflection column */}
      <g opacity={L(0.65, 0.4, t)}>
        <path d="M95 148 h10 M96.5 157 h7 M98 166 h4.4" stroke="#F2E6C4" strokeWidth="2.8" strokeLinecap="round" />
      </g>
      {/* companions arrive at the top of the scale */}
      <g opacity={S(t, 0.66, 0.88)}><Lantern x={154} y={80} s={0.78} glow={0.42} flame={3} simple /></g>
      <g opacity={S(t, 0.8, 0.96)}><Lantern x={48} y={100} s={0.58} glow={0.36} flame={2.6} simple /></g>
      {/* the lantern itself — rising, steadying, burning brighter */}
      <g className="onb-bob" transform={`rotate(${L(-5, 0, t)} 100 ${y})`}>
        <Lantern x={100} y={y} s={L(1.55, 1.85, t)} glow={L(0.3, 0.75, t)} flame={L(2.8, 3.8, t)} />
      </g>
    </Medallion>
  );
}

// ═════════════════════════════════════════════════════════════════
// WEATHER, TONED — the default check-in visual. The disc IS the mood:
// its ground takes the home week-ring ramp tone (pale → near-black),
// and the day is drawn duotone in a contrasting ink — dark storm marks
// on the pale low discs, white sunlight on the dark radiant disc.
// ═════════════════════════════════════════════════════════════════
function MoodSceneWeatherToned({ t = 0.5 }) {
  const { scLerp: L, scSmooth: S } = MK();
  const TONES = window.MOOD_TONES || ['#C9C6BE', '#AFACA3', '#918E85', '#6B6960', '#33312D'];
  // the disc's ground — continuous blend along the ramp
  const seg = Math.min(3.999, Math.max(0, t * 4));
  const si = Math.floor(seg), sf = seg - si;
  const bg = `color-mix(in oklab, ${TONES[Math.min(4, si + 1)]} ${Math.round(sf * 100)}%, ${TONES[si]})`;
  // content ink — dark on the pale discs; flips to paper-white as the
  // ground deepens (between Fine and Good), like day breaking inverted
  const flip = S(t, 0.5, 0.72);
  const fg = `color-mix(in oklab, #F7F6F1 ${Math.round(flip * 100)}%, #3B3A33)`;
  const mixInto = (o) => `color-mix(in oklab, ${fg} ${Math.round(o * 100)}%, ${bg})`;

  const sunOn = S(t, 0.55, 0.8);          // the sun belongs to Good / Radiant only
  const rain = 1 - S(t, 0.1, 0.42);
  const bolt = 1 - S(t, 0.04, 0.16);
  const cloudOp = 1 - S(t, 0.55, 0.78);   // …and the cloud leaves before they arrive
  const amp = L(6.5, 2.2, t);
  const gull = (x, y, s, o) => (
    <path d={`M${x - 6 * s} ${y} Q ${x - 3 * s} ${y - 4 * s} ${x} ${y - 0.6 * s} Q ${x + 3 * s} ${y - 4 * s} ${x + 6 * s} ${y}`}
      stroke={fg} strokeWidth={1.9 * s} strokeLinecap="round" fill="none" opacity={o} />
  );
  return (
    <Medallion sky={bg}>
      {/* the sun climbs out of the sea toward the upper-left as the day
          clears — white light on the dark disc */}
      <MGlow cx={L(124, 60, t)} cy={L(122, 52, t)} r={L(26, 44, t)} color={fg} op={sunOn * 0.55} />
      <circle cx={L(124, 60, t)} cy={L(122, 52, t)} r={L(11, 17, t)} fill={fg} opacity={sunOn} />
      {/* far headland across the bay — grounded, rising out of the water */}
      <path d="M14 141 L52 112 L94 141 Z" fill={mixInto(0.42)} />
      <path d="M52 112 L94 141 L70 141 Z" fill={mixInto(0.58)} />
      {/* THE cloud — one fixed shape, one fixed place while it lasts.
          It thins as the mood lifts and is gone by Good; only the rain
          and the bolt come and go before that. */}
      <g opacity={cloudOp}>
        <path d="M86 80 A 12.5 12.5 0 0 1 90.5 57 A 15.5 15.5 0 0 1 118 46 A 14 14 0 0 1 144 50.5 A 12 12 0 0 1 163.5 62 A 10.5 10.5 0 0 1 165 80 Z" fill={mixInto(0.88)} />
        <path d="M90 80 L162 80 C 161.5 86.5 154.5 90.2 146 89.6 C 138.5 92.8 119.5 92.8 112 89.6 C 101.5 90.2 90.8 86.5 90 80 Z" fill={mixInto(0.68)} />
        {/* rain, hanging from the base */}
        <g stroke={mixInto(0.7)} strokeWidth="2.1" strokeLinecap="round" opacity={rain}>
          <path d="M100 94 l-4 13 M120 96 l-4 13 M140 94 l-4 13 M110 110 l-3.4 11 M130 112 l-3.4 11 M150 108 l-3.4 11" />
        </g>
        {/* one crack of lightning at the very bottom of the scale */}
        <path d="M126 86 L118 104 L125 104 L116 122 L132 102 L124 102 L132 86 Z" fill={fg} opacity={bolt} />
      </g>
      {/* the sea — three banded planes, choppy → glassy, tonal with the disc */}
      <g className="onb-bob2">
        <path d={mBand(132, amp)} fill={mixInto(0.16)} />
        <path d={mLine(132, amp)} stroke={mixInto(0.6)} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      </g>
      {/* sun's column on the water — under the risen sun */}
      <g opacity={S(t, 0.62, 0.85) * 0.85}>
        <path d="M53 138 h14 M56 146 h10 M54 154 h8" stroke={fg} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="onb-bob">
        <path d={mBand(154, amp * 0.85)} fill={mixInto(0.26)} />
        <path d={mLine(154, amp * 0.85)} stroke={mixInto(0.6)} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
        <circle cx="54" cy="149" r="1.8" fill={mixInto(0.7)} opacity={rain * 0.9} />
        <circle cx="74" cy="152" r="1.3" fill={mixInto(0.7)} opacity={rain * 0.7} />
        <circle cx="142" cy="150" r="1.6" fill={mixInto(0.7)} opacity={rain * 0.8} />
      </g>
      <path d={mBand(176, amp * 0.7)} fill={mixInto(0.36)} />
      <path d={mLine(176, amp * 0.7)} stroke={mixInto(0.6)} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* gulls return with the light */}
      {gull(58, 96, 0.9, S(t, 0.55, 0.8) * 0.8)}
      {gull(78, 86, 0.7, S(t, 0.64, 0.88) * 0.6)}
    </Medallion>
  );
}

const MoodScenes = {
  weather: MoodSceneWeatherToned,
  'weather-paper': MoodSceneWeather,
  tide: MoodSceneTide,
  moon: MoodSceneMoon,
  bloom: MoodSceneBloom,
  rings: MoodSceneRings,
  aurora: MoodSceneAurora,
  orb: MoodSceneOrb,
};

Object.assign(window, { MoodScenes, Medallion, MGlow });
