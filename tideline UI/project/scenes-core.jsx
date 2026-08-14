// scenes-core.jsx — VICI's shared faceted-planar scene kit.
// The visual bar is TipScene (the mug on the windowsill) and the worlds
// map: warm paper greys, every form built from a LIT plane + a SHADE
// plane, organic banded water with foam lines, a near-white winding
// path as the signature, and ink used only for tiny narrative marks
// (gulls, flags, figures). Gradients are allowed ONLY for literal light
// (sun glow, lamp glow) and nothing else.
//
// Exports (window): SceneKit, SceneShore, SceneWave, SceneRewire,
// SceneSteps, SceneAnchor, UrgeVignette, SceneIntensity, SceneLoggedMini.

const { useRef: scRef } = React;

// ── palette — lifted from assets/next-lesson-bg.webp, same as worlds ──
const SC = {
  skyTop: '#F8F6EF', skyLo: '#EFECE1', storm: '#DAD5C2',
  far: '#E9E6D9', farShade: '#E1DECF',
  midLit: '#E1DDCD', midShade: '#D2CDBA',
  nearLit: '#D8D3C0', nearShade: '#C5C0AA',
  fgLit: '#C9C4AE', fgShade: '#B4AF98', fgDeep: '#A8A38C',
  path: '#F7F5ED', snow: '#F4F2E9',
  waterHi: '#E7E4D5', water: '#D9D5C2', waterLo: '#C8C3AD',
  waterDeep: '#B3AE97', waterDark: '#A29D85',
  foam: '#F5F3EA', ink: '#4A4A42', sun: '#F1EDDA', sunEdge: '#E3DEC6',
  // dusk/night planes (still warm paper, just the deep end of the scale)
  duskHi: '#CBC6B0', dusk: '#B9B49E', duskLo: '#A5A089',
  nightRidge: '#8F8A74', nightRidgeSh: '#7E7963', nightDeep: '#6F6A57',
  // literal light only
  ember: '#F2A94E', lamp: '#F2DCA4', lampGlow: '#EBCD8C',
};

// ── the two tones. SC starts as PAPER (unchanged default); setSceneTone
// swaps the LIVE SC object's values so every scene re-renders in the new
// register on the next React pass. INK is black-dominant: planes and
// water fall to near-black, while the highlights that used to be quiet
// (foam, the path ribbon, snow, sun/moon, the ink narrative marks) stay
// light and now carry the whole read against the dark.
const SC_PAPER = { ...SC };
const SC_INK = {
  skyTop: '#0B0D11', skyLo: '#111319', storm: '#171A21',
  far: '#161922', farShade: '#0F121A',
  midLit: '#20242E', midShade: '#171B24',
  nearLit: '#2A2F3A', nearShade: '#1D212B',
  fgLit: '#333A46', fgShade: '#252A34', fgDeep: '#1A1E27',
  path: '#E7EBF1', snow: '#DBE0E8',
  waterHi: '#232B35', water: '#191F29', waterLo: '#12171F', waterDeep: '#0C1017', waterDark: '#080B10',
  foam: '#CFD8E1', ink: '#CBD0D6', sun: '#F3ECCF', sunEdge: '#DBD1AC',
  duskHi: '#242A33', dusk: '#1A1F27', duskLo: '#12161D',
  nightRidge: '#2C323C', nightRidgeSh: '#1F242D', nightDeep: '#151920',
  ember: '#F2A94E', lamp: '#F2DCA4', lampGlow: '#EBCD8C',
};
function setSceneTone(tone) {
  Object.assign(SC, tone === 'ink' ? SC_INK : SC_PAPER);
}


const scLerp = (a, b, t) => a + (b - a) * t;
const scSmooth = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const scMix = (c1, c2, t) => {
  const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = p(c1), [r2, g2, b2] = p(c2);
  const h = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${h(scLerp(r1, r2, t))}${h(scLerp(g1, g2, t))}${h(scLerp(b1, b2, t))}`;
};

// ── tiny shared prims ────────────────────────────────────────────────
// two-stroke gull — wings arced properly so it reads as a bird, not a tilde
const SGull = ({ x, y, s = 1, o = 0.7 }) => (
  <path d={`M${x - 6.5 * s} ${y + 0.5 * s} Q ${x - 3 * s} ${y - 4.8 * s} ${x} ${y - 0.5 * s} Q ${x + 3 * s} ${y - 4.8 * s} ${x + 6.5 * s} ${y + 0.5 * s}`}
    stroke={SC.ink} strokeWidth={Math.max(1.7 * s, 1.5)} strokeLinecap="round" fill="none" opacity={o} />
);
// faceted pine — lit + shade halves
const SPine = ({ x, y, s = 1, lit = SC.nearShade, sh = SC.fgShade }) => (
  <g>
    <path d={`M${x} ${y - 30 * s} L${x - 10 * s} ${y} L${x} ${y} Z`} fill={lit} />
    <path d={`M${x} ${y - 30 * s} L${x + 9 * s} ${y} L${x} ${y} Z`} fill={sh} />
  </g>
);
// stacked stone cairn
const SCairn = ({ x, y, s = 1, a = SC.fgShade, b = SC.fgDeep }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="4" rx="9" ry="3.4" fill={a} />
    <ellipse cx="0" cy="0" rx="6.4" ry="2.8" fill={b} />
    <ellipse cx="0" cy="-4" rx="4.2" ry="2.2" fill={a} />
    <circle cx="0" cy="-8" r="2" fill={b} />
  </g>
);
// faceted moon, static phase 0..1 (lit fraction, lit side left — like TipScene)
const SMoonF = ({ cx, cy, r, phase = 0.4 }) => {
  const p = Math.max(0.02, Math.min(0.98, phase));
  const rx = r * Math.abs(1 - 2 * p);
  const sweep = p < 0.5 ? 1 : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={SC.snow} stroke={SC.farShade} strokeWidth="1.6" />
      <circle cx={cx - r * 0.34} cy={cy - r * 0.14} r={r * 0.15} fill="#E7E4D7" />
      <circle cx={cx - r * 0.06} cy={cy + r * 0.32} r={r * 0.1} fill="#E7E4D7" />
      <circle cx={cx + r * 0.3} cy={cy + r * 0.06} r={r * 0.08} fill="#E7E4D7" />
      <path d={`M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`}
        fill={SC.midLit} opacity="0.92" />
    </g>
  );
};
// soft-falloff sun — the only gradient allowed for daylight
function SSun({ cx, cy, r, glow = 2.6, op = 1, pulse = true }) {
  const u = scRef('ss' + Math.random().toString(36).slice(2, 7)).current;
  return (
    <g opacity={op} className={pulse ? 'onb-sun' : undefined}>
      <defs>
        <radialGradient id={u} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE7D2" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#EDE7D2" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#EDE7D2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * glow} fill={`url(#${u})`} />
      <circle cx={cx} cy={cy} r={r} fill={SC.sun} stroke={SC.sunEdge} strokeWidth="1.5" />
    </g>
  );
}
// small marker buoy — cone on a mast, leaning by `lean` degrees
const SBuoy = ({ x, y, s = 1, lean = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${s})`} opacity={o}>
    <path d="M0 6 L0 -16" stroke={SC.ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    <path d="M0 -16 L11 -12 L0 -8 Z" fill={SC.midShade} />
    <path d="M0 -16 L11 -12 L5 -13.8 Z" fill={SC.nearShade} />
    <ellipse cx="0" cy="7" rx="7.5" ry="2.8" fill={SC.foam} opacity="0.85" />
  </g>
);
// little two-sail boat riding a band
const SBoat = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 14 L0 -22" stroke={SC.ink} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    <path d="M2 -20 C 13 -12 16 2 16 12 L2 12 Z" fill={SC.snow} />
    <path d="M2 -20 C 6 -14 8 -2 9 12 L2 12 Z" fill={SC.midShade} opacity="0.5" />
    <path d="M-2 -16 C -11 -8 -13 4 -13 12 L-2 12 Z" fill={SC.midLit} />
    <path d="M-17 14 C -10 20 12 20 20 14 L18 18 C 8 23 -8 23 -14 18 Z" fill={SC.fgShade} />
    <path d="M-17 14 L20 14 L18 18 L-14 18 Z" fill={SC.fgDeep} />
    <path d="M-17 14 L20 14" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" />
  </g>
);
// wandering footprints
const SPrints = ({ pts, o = 0.55, tilt = -18 }) => (
  <g>
    {pts.map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2.8" ry="1.6" fill={SC.fgDeep}
        opacity={Math.max(0.12, o - i * 0.055)} transform={`rotate(${tilt + i * 3} ${x} ${y})`} />
    ))}
  </g>
);
// beach-grass tuft
const SGrass = ({ x, y, s = 1, c = SC.fgShade }) => (
  <g stroke={c} strokeWidth={1.6 * s} strokeLinecap="round" fill="none">
    <path d={`M${x} ${y} C ${x - 1 * s} ${y - 5 * s} ${x - 3 * s} ${y - 8 * s} ${x - 5 * s} ${y - 10 * s}`} />
    <path d={`M${x} ${y} C ${x} ${y - 6 * s} ${x + 1 * s} ${y - 9 * s} ${x + 3 * s} ${y - 12 * s}`} />
    <path d={`M${x + 2 * s} ${y} C ${x + 3 * s} ${y - 4 * s} ${x + 5 * s} ${y - 7 * s} ${x + 7 * s} ${y - 8 * s}`} />
  </g>
);
// five-armed starfish
const SStar5 = ({ x, y, s = 1, c = SC.fgDeep, rot = -14 }) => (
  <path d="M0 -7 l2.1 4.3 4.8 .6 -3.5 3.3 .9 4.7 -4.3-2.3 -4.3 2.3 .9-4.7 -3.5-3.3 4.8-.6 Z"
    fill={c} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} />
);
// low pebble cluster — two rounded stones, lit + shade
const SPebbles = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 4 C -12 -2 -4 -5 2 -3 C 8 -1 10 3 8 5 C 2 7 -8 7 -12 4 Z" fill={SC.nearShade} />
    <path d="M2 -3 C 8 -1 10 3 8 5 C 4 6 0 6 -3 6 C 0 3 1 0 2 -3 Z" fill={SC.fgShade} />
    <path d="M6 -4 C 10 -6 15 -4 16 -1 C 17 2 14 4 10 4 C 9 1 8 -2 6 -4 Z" fill={SC.fgShade} />
  </g>
);

// a floating lens (tapers to points at both ends) — for single bands
const lens = (cx, cy, rx, ry, sag = 0.55) =>
  `M${cx - rx} ${cy} C ${cx - rx * sag} ${cy - ry}, ${cx + rx * sag} ${cy - ry}, ${cx + rx} ${cy} C ${cx + rx * sag} ${cy + ry}, ${cx - rx * sag} ${cy + ry}, ${cx - rx} ${cy} Z`;

// gap-free sea: full-width bands stacked inside one clip so the whole
// block floats with organic tapered ends and a flat, grounded bottom
function SeaStack({ cx, cy, rx, ry, bands, children }) {
  const u = scRef('sea' + Math.random().toString(36).slice(2, 7)).current;
  const rr = ry * 0.9;
  return (
    <g>
      <defs><clipPath id={u}><rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} rx={rr} ry={rr} /></clipPath></defs>
      <g clipPath={`url(#${u})`}>
        {bands.map((b, i) => (
          <g key={i} className={i % 2 ? 'onb-bob2' : 'onb-bob'}>
            <path d={`${b.top} L${cx + rx + 4} ${cy + ry + 4} L${cx - rx - 4} ${cy + ry + 4} Z`} fill={b.fill} />
            {b.foam ? <path d={b.top} stroke={SC.foam} strokeWidth={b.foamW || 2} strokeLinecap="round" fill="none" opacity={b.foamO == null ? 0.8 : b.foamO} /> : null}
            {b.extra}
          </g>
        ))}
        {children}
      </g>
    </g>
  );
}
// gentle wavy top edge for SeaStack bands
function seaTop(x0, x1, y, a, segs = 4) {
  const seg = (x1 - x0) / segs;
  let d = `M${x0} ${y}`;
  for (let i = 0; i < segs; i++) {
    const sx = x0 + i * seg, dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`;
  }
  return d;
}

// ── THE WAVE — the breaking crest, drawn to READ as a wave: a long
// rising back, a lip that curls forward over an OPEN barrel (the page
// shows through the hollow), whitewater where the lip lands. Kept
// light — depth comes from waterLo/waterDeep crescents and fine foam
// linework. Anchored: base y=0 at the waterline, peak ~−88,
// spans x −118..+84 around 0.
const WaveCrest = ({ x = 0, y = 0, s = 1, deep = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* the body — one silhouette with the barrel bitten out */}
    <path d="M-118 0 C -90 -5 -62 -14 -42 -28 C -26 -41 -14 -58 -5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31 C 42 -27 36 -25 31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 7 -73 0 -66 -5 -56 C -13 -40 -26 -22 -44 -11 C -66 -2 -92 1 -118 0 Z" fill={SC.water} />
    {/* the rolled lip — one value step deeper, so the tube reads */}
    <path d="M-5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31 C 42 -27 36 -25 31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 7 -73 0 -66 -5 -56 L-5 -71 Z" fill={SC.waterLo} opacity="0.9" />
    {/* shadow rim just inside the barrel */}
    {deep && <path d="M31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 22 -72 28 -68 31 -61 C 35 -52 34 -38 27 -28 C 28 -27 30 -26 31 -26 Z" fill={SC.waterDeep} opacity="0.55" />}
    {/* lit back slope */}
    <path d="M-104 -3 C -78 -8 -54 -18 -37 -32 C -24 -43 -13 -58 -5 -70 C -12 -52 -22 -34 -36 -20 C -54 -6 -80 -1 -104 -3 Z" fill={SC.waterHi} opacity="0.85" />
    {/* face contours — hairlines sweeping up toward the lip */}
    <g stroke={SC.foam} strokeLinecap="round" fill="none">
      <path d="M-84 -6 C -60 -12 -40 -23 -26 -38 C -17 -48 -9 -60 -3 -69" strokeWidth="1.1" opacity="0.5" />
      <path d="M-64 -6 C -46 -13 -31 -26 -20 -41 C -14 -49 -8 -57 -2 -63" strokeWidth="0.9" opacity="0.36" />
      <path d="M-44 -5 C -30 -12 -19 -23 -10 -37 C -6 -43 -1 -49 4 -54" strokeWidth="0.85" opacity="0.26" />
    </g>
    {/* crest line: back slope → over the lip → around the curl */}
    <path d="M-100 -4 C -76 -10 -52 -19 -38 -31 C -25 -42 -14 -58 -5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    {/* ribs inside the barrel */}
    <g stroke={SC.foam} strokeLinecap="round" fill="none">
      <path d="M27 -30 C 34 -39 37 -49 35 -58" strokeWidth="1" opacity="0.5" />
      <path d="M22 -33 C 28 -41 30 -50 29 -58" strokeWidth="0.8" opacity="0.32" />
    </g>
    {/* the foam roll at the lip's tip */}
    <circle cx="31" cy="-26" r="4" fill={SC.foam} />
    <circle cx="24" cy="-22" r="2.8" fill={SC.foam} opacity="0.9" />
    <circle cx="38" cy="-27" r="2.6" fill={SC.foam} opacity="0.85" />
    {/* spray flying off the curl */}
    <circle cx="52" cy="-20" r="2.2" fill={SC.foam} /><circle cx="62" cy="-28" r="1.6" fill={SC.foam} opacity="0.85" />
    <circle cx="58" cy="-10" r="1.4" fill={SC.foam} opacity="0.8" /><circle cx="70" cy="-18" r="1.1" fill={SC.foam} opacity="0.65" />
    <circle cx="66" cy="-36" r="0.9" fill={SC.foam} opacity="0.55" />
    <g stroke={SC.foam} strokeLinecap="round" fill="none" opacity="0.6">
      <path d="M54 -34 l4 -3" strokeWidth="1" />
      <path d="M64 -44 l3 -3" strokeWidth="0.9" />
      <path d="M72 -28 l3.4 -1.8" strokeWidth="0.9" />
    </g>
    {/* whitewater where the lip lands — scalloped, with bubble rings */}
    <path d="M20 -2 C 32 -9 50 -11 64 -8 C 74 -6 80 -3 78 0 C 60 4 36 4 20 -2 Z" fill={SC.foam} opacity="0.92" />
    <path d="M26 -3 q 6 -3 13 -2.6 M42 -7 q 7 -1.8 14 -0.4 M58 -5 q 5 0.2 9 1.8" stroke={SC.waterLo} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.55" />
    <circle cx="84" cy="-4" r="1.6" fill={SC.foam} opacity="0.75" />
    <circle cx="30" cy="0" r="1" fill="none" stroke={SC.waterLo} strokeWidth="0.7" opacity="0.5" />
    <circle cx="52" cy="0" r="1.3" fill="none" stroke={SC.waterLo} strokeWidth="0.7" opacity="0.45" />
    {/* foam runout on the spent water, left */}
    <path d="M-96 -3 h20 M-66 -2 h13" stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
  </g>
);

// ═════════════════════════════════════════════════════════════════════
// SCENE · SHORE — the welcome signature. Sun over a layered sea, a
// small boat setting out, the surf reaching a sliver of sand.
// ═════════════════════════════════════════════════════════════════════
function SceneShore({ w = 250, h = 158 }) {
  return (
    <svg width={w} height={h} viewBox="0 0 250 158" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SSun cx={125} cy={44} r={21} glow={2.8} />
      <SGull x={70} y={38} s={0.9} /><SGull x={92} y={28} s={0.72} o={0.5} />
      {/* far headland peeking over the horizon */}
      <path d="M158 78 L192 62 L228 78 Z" fill={SC.far} />
      <path d="M192 62 L228 78 L208 78 Z" fill={SC.farShade} />
      {/* the sea — one floating stack, no gaps */}
      <SeaStack cx={125} cy={112} rx={118} ry={34}
        bands={[
          { top: seaTop(0, 250, 86, 4), fill: SC.waterHi, foam: true, foamW: 1.8, foamO: 0.7,
            extra: <path d="M114 90 h20 M110 96 h14 M120 102 h11" stroke={SC.foam} strokeWidth="2.6" strokeLinecap="round" opacity="0.65" /> },
          { top: seaTop(0, 250, 104, 5), fill: SC.water, foam: true, foamW: 2.2,
            extra: <path d="M52 100 C 78 95 108 94 132 97 C 106 100 74 102 52 100 Z" fill={SC.waterHi} opacity="0.8" /> },
          { top: seaTop(0, 250, 124, 4.5), fill: SC.waterLo, foam: true, foamW: 2.4,
            extra: <g><circle cx="90" cy="120" r="2" fill={SC.foam} /><circle cx="103" cy="115" r="1.4" fill={SC.foam} /><circle cx="164" cy="119" r="1.6" fill={SC.foam} opacity="0.8" /></g> },
        ]}
      />
      {/* the boat rides the mid band */}
      <g className="onb-bob2"><SBoat x={186} y={86} s={0.66} /></g>
      {/* sand wedge, lower left — foam scallops, cairn, grass */}
      <path d="M4 136 C 34 128 74 127 106 133 C 88 144 56 150 28 149 C 14 148 5 143 4 136 Z" fill={SC.fgLit} />
      <path d="M18 143 C 44 146 74 143 94 137 C 78 146 52 150 30 148 C 25 147 20 145 18 143 Z" fill={SC.fgShade} opacity="0.55" />
      <path d="M14 137 C 38 131 68 130 94 134" stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M30 143 C 48 139 66 138 82 140" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
      <SCairn x={34} y={143} s={0.6} /><SGrass x={88} y={146} s={0.8} />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · WAVE — the urge made visible: the curling crest under a
// small moon. (onboarding lessons 1 & 5)
// ═════════════════════════════════════════════════════════════════════
function SceneWave() {
  return (
    <svg width="232" height="172" viewBox="0 0 232 172" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SMoonF cx={194} cy={36} r={18} phase={0.42} />
      <SGull x={40} y={38} s={0.9} /><SGull x={62} y={28} s={0.7} o={0.5} />
      {/* horizon sliver behind */}
      <path d={lens(150, 88, 76, 6)} fill={SC.waterHi} />
      <path d="M92 86 C 116 81 144 80 168 82 C 190 84 212 88 220 90" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" fill="none" />
      {/* the crest */}
      <g className="onb-bob"><WaveCrest x={104} y={134} s={0.82} /></g>
      {/* trough band in front — light, with hairline echoes */}
      <g className="onb-bob2">
        <path d={lens(116, 150, 110, 9)} fill={SC.waterLo} />
        <path d={lens(120, 152, 82, 5)} fill={SC.waterDeep} opacity="0.4" />
        <path d="M22 147 C 58 139 102 137 138 139 C 170 141 198 146 214 150" stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M44 152 C 76 146 116 144 148 146 C 172 147 194 151 208 154" stroke={SC.foam} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.5" />
        <circle cx="66" cy="144" r="1.8" fill={SC.foam} /><circle cx="82" cy="139" r="1.3" fill={SC.foam} />
        <circle cx="168" cy="144" r="1.2" fill={SC.foam} opacity="0.7" />
      </g>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · REWIRE — the fork: the worn track wanders to a dead snag;
// the new near-white path climbs the lit hill toward the sun.
// ═════════════════════════════════════════════════════════════════════
function SceneRewire() {
  return (
    <svg width="232" height="172" viewBox="0 0 232 172" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SSun cx={192} cy={32} r={15} glow={2.8} />
      {/* the low country, left — dim mound */}
      <path d="M2 118 L54 92 L108 118 Z" fill={SC.far} />
      <path d="M54 92 L108 118 L82 118 Z" fill={SC.farShade} />
      {/* the lit hill, right */}
      <path d="M96 150 L178 66 L232 150 Z" fill={SC.midLit} />
      <path d="M178 66 L232 150 L204 150 Z" fill={SC.midShade} />
      <path d="M178 66 L166 82 C 174 76 182 78 186 84 Z" fill={SC.snow} />
      {/* valley floor */}
      <path d="M0 150 C 60 142 120 146 176 144 C 198 143 218 146 232 144 L232 158 C 180 162 120 158 64 162 C 40 163 16 160 0 162 Z" fill={SC.nearLit} />
      <path d="M0 162 C 60 158 130 162 190 158 C 206 157 222 159 232 158 L232 172 L0 172 Z" fill={SC.fgLit} />
      {/* the fork — both ways leave one junction */}
      <circle cx="106" cy="164" r="3" fill={SC.fgDeep} opacity="0.6" />
      {/* OLD path — dashed, worn, wandering to the snag */}
      <path d="M103 163 C 84 157 62 150 46 138 C 36 130 30 124 28 114" stroke={SC.fgDeep} strokeWidth="3.2" strokeLinecap="round" strokeDasharray="2 8" fill="none" opacity="0.8" />
      <circle cx="70" cy="152" r="1.6" fill={SC.fgDeep} opacity="0.5" /><circle cx="52" cy="143" r="1.3" fill={SC.fgDeep} opacity="0.45" />
      {/* the dead snag — bare trunk, drooping arms */}
      <g stroke={SC.fgDeep} strokeLinecap="round" opacity="0.9">
        <path d="M28 114 L28 90" strokeWidth="3" />
        <path d="M28 100 C 23 98 20 94 20 90 M28 96 C 32 94 34 91 35 87 M28 106 L23 104" strokeWidth="2" fill="none" />
      </g>
      {/* NEW path — the near-white ribbon, switchbacking up the hill */}
      <path d="M110 172 C 122 163 138 156 156 150 C 174 144 184 138 188 130 C 191 124 186 119 174 117 C 164 115 158 112 156 107 C 154 101 160 96 172 93 L179 90 L184 96 C 174 100 166 103 166 107 C 166 110 172 112 182 114 C 198 117 205 126 200 134 C 194 143 180 149 164 154 C 148 159 132 165 122 172 Z" fill={SC.path} />
      {/* the top of the climb — a small flag under the sun */}
      <g transform="translate(182 88)">
        <path d="M0 4 L0 -14" stroke={SC.ink} strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -13 L12 -9 L0 -5 Z" fill={SC.ink} />
      </g>
      {/* signpost at the junction — two boards, bright way up */}
      <g transform="translate(112 158)">
        <path d="M0 8 L0 -18" stroke={SC.fgDeep} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M1 -16 L17 -12 L1 -8 Z" fill={SC.snow} stroke={SC.fgShade} strokeWidth="1" />
        <path d="M-1 -6 L-13 -3 L-1 0 Z" fill={SC.nearShade} />
      </g>
      <SPine x={144} y={150} s={0.8} /><SPine x={218} y={158} s={0.95} />
      <SGull x={62} y={52} s={0.8} o={0.55} />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · STEPS — the staircase hill: three treads, the path zigzags
// left → right → left, a cairn at every turn, a flag at the top.
// ═════════════════════════════════════════════════════════════════════
function SceneSteps() {
  return (
    <svg width="232" height="172" viewBox="0 0 232 172" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SSun cx={202} cy={28} r={14} glow={2.6} />
      <SGull x={40} y={30} s={0.85} o={0.6} /><SGull x={62} y={22} s={0.65} o={0.45} />
      {/* tread 3 (top) */}
      <path d="M118 70 L214 58 L226 66 L134 80 Z" fill={SC.midLit} />
      <path d="M134 80 L226 66 L226 96 L134 108 Z" fill={SC.midShade} />
      {/* tread 2 (middle) */}
      <path d="M52 104 L214 88 L226 96 L68 114 Z" fill={SC.nearLit} />
      <path d="M68 114 L226 96 L226 128 L68 144 Z" fill={SC.nearShade} />
      {/* tread 1 (bottom) */}
      <path d="M10 142 L206 122 L222 130 L30 152 Z" fill={SC.fgLit} />
      <path d="M30 152 L222 130 L222 158 L30 172 Z" fill={SC.fgShade} />
      {/* the path — zigzag ribbons along each tread */}
      <path d="M14 148 C 60 142 118 136 168 132 L196 130 L198 136 L170 138 C 122 142 66 148 22 154 Z" fill={SC.path} />
      <path d="M196 130 C 200 124 202 118 202 112 L194 106 L188 108 C 190 114 190 122 188 130 Z" fill={SC.path} opacity="0.95" />
      <path d="M70 118 C 118 112 156 108 194 106 L196 112 C 158 114 122 118 78 124 Z" fill={SC.path} opacity="0.95" />
      <path d="M70 118 C 66 112 64 106 66 100 L74 96 L80 98 C 77 104 76 111 78 118 Z" fill={SC.path} opacity="0.9" />
      <path d="M74 96 C 116 90 152 86 190 82 L214 80 L216 86 L192 88 C 154 92 118 96 80 102 Z" fill={SC.path} opacity="0.9" />
      {/* cairns at the turns */}
      <SCairn x={202} y={124} s={0.68} /><SCairn x={62} y={112} s={0.64} />
      {/* the flag where the path tops out */}
      <g transform="translate(218 76)">
        <path d="M0 0 L0 -26" stroke={SC.ink} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M0 -25 L-17 -20 L0 -14 Z" fill={SC.ink} />
      </g>
      {/* mist drifting across the base */}
      <path d="M0 160 C 28 154 60 156 88 152 C 96 147 110 146 118 150 C 146 148 174 150 198 147 C 210 146 222 148 230 150 L230 160 C 190 166 120 168 60 168 C 36 168 12 166 0 168 Z" fill={SC.skyTop} opacity="0.85" />
      <SPine x={12} y={140} s={0.85} /><SGrass x={112} y={166} s={0.9} />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · ANCHOR — the harbour still-life: an anchor against a rope-
// wrapped bollard on dock planks, calm water and a buoy beyond.
// ═════════════════════════════════════════════════════════════════════
function SceneAnchor() {
  return (
    <svg width="232" height="172" viewBox="0 0 232 172" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SSun cx={44} cy={30} r={13} glow={2.6} />
      {/* calm water beyond the dock — one stack */}
      <SeaStack cx={116} cy={86} rx={112} ry={26}
        bands={[
          { top: seaTop(0, 232, 70, 3), fill: SC.waterHi, foam: true, foamW: 1.6, foamO: 0.6 },
          { top: seaTop(0, 232, 88, 4), fill: SC.water, foam: true, foamW: 2,
            extra: <path d="M60 84 C 84 80 112 79 134 82 C 110 85 82 86 60 84 Z" fill={SC.waterHi} opacity="0.8" /> },
        ]}
      />
      <SBuoy x={196} y={72} s={0.85} lean={4} />
      <SGull x={70} y={50} s={0.85} o={0.6} /><SGull x={90} y={42} s={0.65} o={0.45} />
      {/* the dock — planks in slight perspective */}
      <path d="M2 116 L230 106 L232 118 L0 130 Z" fill={SC.nearLit} />
      <path d="M0 130 L232 118 L232 132 L0 146 Z" fill={SC.midLit} />
      <path d="M0 146 L232 132 L232 148 L0 164 Z" fill={SC.nearLit} />
      <path d="M2 116 L230 106" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M0 130 L232 118 M0 146 L232 132" stroke={SC.fgShade} strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      <path d="M0 164 L232 148 L232 156 L0 172 Z" fill={SC.fgShade} />
      {/* bollard with rope wraps */}
      <g transform="translate(174 100)">
        <path d="M-8 34 L-6 0 L6 0 L8 34 Z" fill={SC.fgLit} />
        <path d="M1 0 L6 0 L8 34 L1 34 Z" fill={SC.fgShade} />
        <ellipse cx="0" cy="0" rx="6.4" ry="2.6" fill={SC.fgDeep} />
        <path d="M-7.2 9 A 7.2 3 0 0 0 7.2 9 M-7.5 15 A 7.5 3 0 0 0 7.5 15" stroke={SC.fgDeep} strokeWidth="2.8" fill="none" />
      </g>
      {/* the anchor — lit/shade split, leaning toward the bollard */}
      <g transform="translate(102 94) rotate(-10)">
        <path d="M0 -22 C 7 -18 7 -9 0 -6 C -7 -9 -7 -18 0 -22 Z" fill="none" stroke={SC.fgShade} strokeWidth="4.6" />
        <path d="M0 -6 L0 36" stroke={SC.fgShade} strokeWidth="5.4" strokeLinecap="round" />
        <path d="M-15 3 L15 3" stroke={SC.fgShade} strokeWidth="4.6" strokeLinecap="round" />
        <path d="M0 36 C -12 34 -21 26 -23 15 L-30 20 C -26 36 -14 45 0 47 Z" fill={SC.fgShade} />
        <path d="M0 36 C 12 34 21 26 23 15 L30 20 C 26 36 14 45 0 47 Z" fill={SC.fgDeep} />
        <path d="M0 -6 L0 36" stroke={SC.fgLit} strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {/* rope: bollard → anchor ring, slack curve */}
      <path d="M167 102 C 146 100 122 90 104 74" stroke={SC.fgDeep} strokeWidth="2.4" strokeLinecap="round" fill="none" strokeDasharray="1 6" opacity="0.9" />
      {/* spare coil on the planks */}
      <g transform="translate(44 144)">
        <ellipse cx="0" cy="0" rx="16" ry="5.4" fill="none" stroke={SC.fgShade} strokeWidth="3" />
        <ellipse cx="0" cy="-1" rx="9" ry="3.2" fill="none" stroke={SC.fgDeep} strokeWidth="2.6" />
      </g>
      {/* dock lantern — literal light, gently warm */}
      <g transform="translate(218 98)">
        <path d="M0 10 L0 -8" stroke={SC.fgDeep} strokeWidth="2" strokeLinecap="round" />
        <rect x="-4" y="-16" width="8" height="9" rx="2" fill={SC.fgShade} />
        <circle cx="0" cy="-11.5" r="2.4" fill={SC.lamp} />
      </g>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// URGE VIGNETTES — one <g> per stage, drawn into a 320×180 box.
// Stages: rising · passing · remove · name · calm · slip · twice · begin
// ═════════════════════════════════════════════════════════════════════
function UrgeVignette({ stage = 'rising' }) {
  switch (stage) {

    // the urge is a wave — the crest curling under the moon
    case 'rising': return (
      <g>
        <SMoonF cx={252} cy={44} r={26} phase={0.42} />
        <SGull x={52} y={50} /><SGull x={78} y={38} s={0.75} o={0.5} />
        {/* far headland */}
        <path d="M232 96 L268 82 L306 96 Z" fill={SC.far} />
        <path d="M268 82 L306 96 L288 96 Z" fill={SC.farShade} />
        {/* horizon sliver */}
        <path d={lens(216, 102, 96, 6)} fill={SC.waterHi} />
        <path d="M138 100 C 168 95 202 94 232 96 C 262 98 292 102 304 104" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" fill="none" />
        <path d="M96 112 C 132 107 176 106 214 108 C 246 110 270 113 284 116" stroke={SC.foam} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" fill="none" />
        {/* the crest, full size */}
        <g className="onb-bob"><WaveCrest x={142} y={148} s={1.04} /></g>
        {/* trough — light band, fine foam echoes */}
        <g className="onb-bob2">
          <path d={lens(160, 164, 150, 9)} fill={SC.waterLo} />
          <path d={lens(166, 166, 112, 5.5)} fill={SC.waterDeep} opacity="0.4" />
          <path d="M34 161 C 80 153 136 151 182 153 C 224 155 262 160 286 164" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M62 166 C 104 160 154 158 196 160 C 228 161 256 165 276 168" stroke={SC.foam} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.5" />
          <circle cx="88" cy="157" r="1.8" fill={SC.foam} /><circle cx="106" cy="152" r="1.3" fill={SC.foam} />
          <circle cx="230" cy="158" r="1.3" fill={SC.foam} opacity="0.7" /><circle cx="250" cy="163" r="1" fill={SC.foam} opacity="0.55" />
        </g>
      </g>
    );

    // it always passes — the sea flattening, sun breaking through
    case 'passing': return (
      <g>
        <SSun cx={92} cy={50} r={19} glow={2.8} />
        <path d={lens(158, 44, 56, 4.6)} fill={SC.skyLo} opacity="0.9" />
        <path d={lens(196, 58, 44, 3.8)} fill={SC.skyLo} opacity="0.7" />
        <SGull x={234} y={46} s={0.9} /><SGull x={260} y={36} s={0.7} o={0.5} />
        <SeaStack cx={160} cy={130} rx={152} ry={44}
          bands={[
            { top: seaTop(0, 320, 96, 4.5), fill: SC.waterHi, foam: true, foamW: 1.8, foamO: 0.65,
              extra: <path d="M80 100 h16 M74 106 h11" stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" /> },
            { top: seaTop(0, 320, 118, 5.5), fill: SC.water, foam: true, foamW: 2.2,
              extra: <path d="M72 113 C 102 108 138 107 166 110 C 138 114 100 115 72 113 Z" fill={SC.waterHi} opacity="0.8" /> },
            { top: seaTop(0, 320, 142, 5), fill: SC.waterLo, foam: true, foamW: 2.6,
              extra: (
                <g>
                  {/* the spent crest — a wide foam wash, bubbles trailing */}
                  <path d="M96 140 C 130 132 172 130 204 135 C 172 141 128 143 96 140 Z" fill={SC.foam} opacity="0.9" />
                  <circle cx="120" cy="136" r="2.2" fill={SC.foam} /><circle cx="136" cy="132" r="1.6" fill={SC.foam} />
                  <circle cx="196" cy="133" r="1.8" fill={SC.foam} /><circle cx="212" cy="138" r="1.3" fill={SC.foam} />
                </g>
              ) },
            { top: seaTop(0, 320, 164, 4), fill: SC.waterDeep, foam: true, foamW: 2, foamO: 0.7 },
          ]}
        />
      </g>
    );

    // remove yourself — the path leaves the water for the dunes
    case 'remove': return (
      <g>
        <SSun cx={64} cy={40} r={15} glow={2.6} />
        <SGull x={150} y={40} s={0.85} o={0.6} />
        {/* the sea, kept small and behind */}
        <SeaStack cx={92} cy={96} rx={90} ry={22}
          bands={[
            { top: seaTop(0, 190, 82, 3.5), fill: SC.water, foam: true, foamW: 2,
              extra: <path d="M40 86 C 60 82 84 81 102 84 C 82 87 58 88 40 86 Z" fill={SC.waterHi} opacity="0.8" /> },
            { top: seaTop(0, 190, 102, 3), fill: SC.waterLo, foam: true, foamW: 1.8, foamO: 0.6 },
          ]}
        />
        {/* dune mass — lit slope + shaded lee */}
        <path d="M0 132 C 60 120 130 116 196 120 C 250 123 292 130 320 138 L320 180 L0 180 Z" fill={SC.fgLit} />
        <path d="M0 156 C 80 148 170 152 250 148 C 278 146 302 150 320 148 L320 180 L0 180 Z" fill={SC.fgShade} opacity="0.55" />
        <path d="M196 132 L258 96 L320 122 L320 148 C 280 142 236 138 196 138 Z" fill={SC.nearLit} />
        <path d="M258 96 L320 122 L292 122 Z" fill={SC.nearShade} />
        {/* the hut on the dune */}
        <g transform="translate(258 96)">
          <path d="M-20 26 L0 -6 L20 26 Z" fill={SC.snow} />
          <path d="M0 -6 L20 26 L9 26 Z" fill={SC.midShade} />
          <path d="M-5 26 L0 12 L5 26 Z" fill={SC.fgDeep} />
        </g>
        <SPine x={300} y={120} s={1} /><SPine x={286} y={126} s={0.72} />
        {/* the path — S-curve from the waterline up to the hut */}
        <path d="M56 180 C 88 164 124 152 162 144 C 196 137 224 128 242 116 L256 120 C 240 134 210 144 176 152 C 136 161 98 170 74 180 Z" fill={SC.path} />
        <SPrints pts={[[104, 166], [122, 160], [142, 155], [162, 150], [182, 145]]} />
        <SGrass x={40} y={150} s={1.1} /><SGrass x={228} y={158} s={0.9} />
        <SCairn x={70} y={140} s={0.7} />
      </g>
    );

    // name it — a pennant planted on the beach; the wave, named, smaller
    case 'name': return (
      <g>
        <SGull x={262} y={44} s={0.9} o={0.65} />
        {/* horizon */}
        <path d={lens(112, 92, 100, 6)} fill={SC.waterHi} />
        <path d="M28 90 C 56 85 88 84 116 86 C 144 88 172 92 194 95" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" fill="none" />
        {/* the wave, mid-distance now */}
        <g className="onb-bob"><WaveCrest x={92} y={128} s={0.62} /></g>
        <path d={lens(110, 138, 104, 7)} fill={SC.waterLo} />
        <path d="M22 135 C 56 129 96 127 128 129 C 158 131 186 136 202 139" stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* the beach — a broad lit apron */}
        <path d="M0 148 C 70 138 150 136 224 140 C 262 142 294 147 320 152 L320 180 L0 180 Z" fill={SC.fgLit} />
        <path d="M0 166 C 90 158 190 160 274 156 C 292 155 308 157 320 156 L320 180 L0 180 Z" fill={SC.fgShade} opacity="0.5" />
        <path d="M26 150 C 70 142 122 140 168 143 C 128 148 76 150 26 150 Z" fill={SC.foam} opacity="0.85" />
        {/* the naming post — driftwood mast, ink pennant, rope stay */}
        <g transform="translate(234 150)">
          <path d="M0 8 L4 -66" stroke={SC.fgDeep} strokeWidth="4" strokeLinecap="round" />
          <path d="M4 -66 L4 -58" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" />
          <path className="onb-bob" d="M5 -64 L46 -55 L5 -43 Z" fill={SC.ink} />
          <path d="M1 -20 L-26 6" stroke={SC.fgDeep} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 5" />
          <ellipse cx="0" cy="9" rx="10" ry="3.4" fill={SC.fgShade} />
          <circle cx="-8" cy="6" r="2.6" fill={SC.fgDeep} /><circle cx="9" cy="7" r="2" fill={SC.fgDeep} />
        </g>
        <SGrass x={288} y={166} s={1} /><SStar5 x={126} y={162} s={0.9} />
        <SPrints pts={[[52, 170], [72, 166], [94, 162], [116, 160]]} tilt={-8} />
      </g>
    );

    // calm — after the wave: mirror water, high sun, the shore at peace
    case 'calm': return (
      <g>
        <SSun cx={160} cy={42} r={20} glow={3} />
        <SGull x={82} y={52} s={0.9} /><SGull x={108} y={42} s={0.7} o={0.5} />
        <SeaStack cx={160} cy={116} rx={152} ry={34}
          bands={[
            { top: seaTop(0, 320, 88, 2.6), fill: SC.waterHi, foam: true, foamW: 1.6, foamO: 0.6,
              extra: <path d="M146 92 h26 M141 98 h18 M152 104 h13" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" opacity="0.6" /> },
            { top: seaTop(0, 320, 110, 3), fill: SC.water, foam: true, foamW: 2, foamO: 0.8 },
            { top: seaTop(0, 320, 132, 2.6), fill: SC.waterLo, foam: true, foamW: 2, foamO: 0.7 },
          ]}
        />
        <g className="onb-bob2"><SBuoy x={254} y={104} s={0.85} lean={2} /></g>
        {/* the shore, wide and quiet */}
        <path d="M0 152 C 76 144 162 142 240 146 C 274 148 300 152 320 156 L320 180 L0 180 Z" fill={SC.fgLit} />
        <path d="M0 170 C 96 162 200 164 288 160 C 300 159 312 161 320 160 L320 180 L0 180 Z" fill={SC.fgShade} opacity="0.5" />
        <path d="M40 154 q 36 -8 76 -3 M150 148 q 32 -7 66 -2" stroke={SC.foam} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />
        <SCairn x={64} y={166} s={0.8} /><SStar5 x={210} y={164} s={1} />
        <SGrass x={296} y={172} s={1} />
      </g>
    );

    // relapse 1 · the slip — a quiet dusk dip, the buoy leaning
    case 'slip': return (
      <g>
        <SMoonF cx={70} cy={46} r={24} phase={0.3} />
        <path d={lens(196, 40, 52, 4)} fill={SC.skyLo} opacity="0.8" />
        <path d={lens(238, 54, 40, 3.4)} fill={SC.skyLo} opacity="0.6" />
        <path d="M228 96 L268 82 L308 96 Z" fill={SC.far} />
        <path d="M268 82 L308 96 L288 96 Z" fill={SC.farShade} />
        <path d="M0 96 H320 V110 H0 Z" fill={SC.far} opacity="0.7" />
        <g className="onb-bob2">
          <path d="M0 120 C 60 112 120 130 180 136 C 236 141 284 132 320 122 V160 H0 Z" fill={SC.water} />
          <path d="M0 120 C 60 112 120 130 180 136 C 236 141 284 132 320 122" stroke={SC.foam} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
        {/* the dip — a darker trough with drifting flecks */}
        <path d="M116 140 C 146 152 196 154 226 144 C 196 160 148 158 116 140 Z" fill={SC.waterDeep} opacity="0.45" />
        <circle cx="152" cy="148" r="1.6" fill={SC.foam} opacity="0.7" /><circle cx="176" cy="152" r="1.2" fill={SC.foam} opacity="0.5" />
        <g className="onb-bob" transform="translate(206 116) rotate(9)">
          <path d="M0 22 L0 -12" stroke={SC.ink} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <path d="M0 -12 L14 -7 L0 -2 Z" fill={SC.midShade} />
          <ellipse cx="0" cy="24" rx="9" ry="3.4" fill={SC.foam} opacity="0.8" />
        </g>
        <path d="M0 158 C 70 148 150 156 230 152 C 268 150 300 154 320 150 V180 H0 Z" fill={SC.waterLo} />
        <path d="M0 158 C 70 148 150 156 230 152" stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
        <SGull x={278} y={60} s={0.75} o={0.4} />
      </g>
    );

    // relapse 2 · don't fail twice — the valley the path leaves at once
    case 'twice': return (
      <g>
        <SGull x={244} y={44} s={0.9} /><SGull x={268} y={36} s={0.7} o={0.5} />
        <path d="M0 168 L0 66 L96 40 L150 118 L96 168 Z" fill={SC.midLit} />
        <path d="M96 40 L150 118 L96 168 L64 168 Z" fill={SC.midShade} />
        <path d="M320 168 L320 46 L236 66 L192 124 L250 168 Z" fill={SC.midLit} />
        <path d="M236 66 L192 124 L250 168 L216 168 Z" fill={SC.midShade} />
        <path d="M96 40 L86 54 C 93 49 99 50 103 55 Z" fill={SC.snow} />
        <path d="M236 66 L228 78 C 234 74 240 75 244 80 Z" fill={SC.snow} opacity="0.9" />
        <SPine x={288} y={152} s={0.9} /><SPine x={306} y={158} s={0.7} />
        <path d="M96 152 C 130 144 196 144 232 152 C 196 160 132 160 96 152 Z" fill={SC.skyTop} opacity="0.9" />
        <path d="M112 160 C 140 155 186 155 214 160 C 186 165 140 165 112 160 Z" fill="#FFFFFF" opacity="0.6" />
        <path d="M20 96 C 64 104 104 128 140 146 C 158 155 178 155 194 146 C 224 130 258 104 300 88 L306 98 C 266 114 234 138 202 156 C 180 168 152 168 130 156 C 96 138 60 114 16 106 Z" fill={SC.path} />
        <circle cx="298" cy="92" r="4.6" fill={SC.ink} />
        <SCairn x={36} y={92} s={0.66} />
      </g>
    );

    // relapse 3 · begin again — dawn, the path setting out
    case 'begin': return (
      <g>
        <SSun cx={160} cy={86} r={24} glow={3} />
        <SGull x={64} y={54} s={0.9} /><SGull x={92} y={44} s={0.7} o={0.5} />
        <path d="M0 110 L64 84 L128 110 Z" fill={SC.far} />
        <path d="M64 84 L128 110 L96 110 Z" fill={SC.farShade} />
        <path d="M196 110 L262 82 L320 110 Z" fill={SC.far} />
        <path d="M262 82 L320 110 L292 110 Z" fill={SC.farShade} />
        <path d="M0 110 H320 V180 H0 Z" fill={SC.midLit} />
        <path d="M0 134 C 80 126 180 134 260 128 C 286 126 306 129 320 126 V180 H0 Z" fill={SC.nearShade} opacity="0.75" />
        <path d="M0 158 C 90 152 190 158 280 154 C 296 153 310 155 320 153 V180 H0 Z" fill={SC.fgLit} />
        <path d="M136 180 C 148 158 156 138 158 118 L170 118 C 170 138 164 160 156 180 Z" fill={SC.path} />
        <path d="M148 180 C 154 166 158 152 160 138" stroke={SC.foam} strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none" />
        <SPrints pts={[[150, 172], [158, 160], [162, 148]]} tilt={-4} o={0.5} />
        <circle cx="92" cy="150" r="1.6" fill={SC.foam} opacity="0.8" /><circle cx="238" cy="144" r="1.4" fill={SC.foam} opacity="0.7" />
        <circle cx="70" cy="168" r="1.3" fill={SC.foam} opacity="0.6" />
        <SPine x={42} y={152} s={1.05} /><SPine x={282} y={156} s={0.95} /><SPine x={302} y={162} s={0.7} />
        <SCairn x={196} y={166} s={0.75} />
      </g>
    );

    default: return <g />;
  }
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · INTENSITY — the urge-log slider scene. One sea, continuously
// morphing: calm bands and an upright buoy → a curling dark crest,
// spray flying, the buoy heeled hard over.
// ═════════════════════════════════════════════════════════════════════
function SceneIntensity({ t = 0.5 }) {
  const L = scLerp, S = scSmooth;
  const p = L(5, 52, t);                 // crest height
  const yB = 112;                        // waterline of the front swell
  const claw = S(t, 0.42, 0.78);         // the curl arrives late
  const cloud = S(t, 0.3, 0.8);
  const sprayO = S(t, 0.55, 0.85);
  // the front swell — apex at x 118
  const body = `M4 ${yB + 8}
    C 34 ${yB + 4} 58 ${yB - p * 0.42} 82 ${yB - p * 0.74}
    C 96 ${yB - p * 0.94} 106 ${yB - p} 118 ${yB - p}
    C 128 ${yB - p * 0.95} 138 ${yB - p * 0.68} 148 ${yB - p * 0.4}
    C 162 ${yB - p * 0.14} 180 ${yB + 2} 200 ${yB + 4}
    C 216 ${yB + 5} 230 ${yB + 6} 236 ${yB + 7}
    L236 146 L4 146 Z`;
  const bodyTop = `M4 ${yB + 8}
    C 34 ${yB + 4} 58 ${yB - p * 0.42} 82 ${yB - p * 0.74}
    C 96 ${yB - p * 0.94} 106 ${yB - p} 118 ${yB - p}
    C 128 ${yB - p * 0.95} 138 ${yB - p * 0.68} 148 ${yB - p * 0.4}
    C 162 ${yB - p * 0.14} 180 ${yB + 2} 200 ${yB + 4}`;
  return (
    <svg width="240" height="150" viewBox="0 0 240 150" className="ci-breathe" style={{ display: 'block', overflow: 'visible' }}>
      {/* weather sliding in with the pull */}
      <g opacity={cloud * 0.95} transform={`translate(${L(46, 0, cloud)} ${L(-14, 0, cloud)})`}>
        <path d="M148 34 C 146 24 156 17 167 19 C 171 9 189 7 196 15 C 206 10 218 16 217 25 C 224 28 222 36 214 37 L156 37 C 150 37 147 36 148 34 Z" fill={scMix(SC.skyLo, SC.nearShade, t * 0.8)} />
        <path d="M154 37 L214 37 C 213 41 208 43 202 43 L166 43 C 160 43 155 41 154 37 Z" fill={SC.fgShade} opacity="0.32" />
      </g>
      {/* the gulls leave as it builds */}
      <SGull x={52} y={30} s={0.9} o={0.65 * (1 - S(t, 0.25, 0.55))} />
      <SGull x={74} y={22} s={0.7} o={0.45 * (1 - S(t, 0.2, 0.5))} />
      {/* far + mid bands */}
      <g className="onb-bob2">
        <path d={lens(120, L(80, 74, t), 112, L(5, 8, t))} fill={SC.waterHi} />
        <path d={seaTop(30, 212, L(78, 71, t), L(2.4, 4.5, t), 3)} stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <g className="onb-bob">
        <path d={lens(120, L(96, 92, t), 120, L(6, 10, t))} fill={scMix(SC.water, SC.waterLo, t)} />
        <path d={seaTop(16, 226, L(93, 87, t), L(3, 6, t), 4)} stroke={SC.foam} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="60" cy={L(92, 84, t)} r="1.7" fill={SC.foam} opacity={0.2 + t * 0.75} />
        <circle cx="82" cy={L(89, 80, t)} r="1.3" fill={SC.foam} opacity={0.15 + t * 0.7} />
        <circle cx="180" cy={L(92, 86, t)} r="1.5" fill={SC.foam} opacity={0.1 + t * 0.8} />
      </g>
      {/* the buoy — upright in calm, heeled hard in the swell */}
      <SBuoy x={198} y={L(100, 98, t)} s={0.9} lean={L(2, 30, S(t, 0.15, 0.9))} />
      <path d={`M188 ${L(104, 102, t)} q 6 3 15 1`} stroke={SC.foam} strokeWidth="2" strokeLinecap="round" fill="none" opacity={S(t, 0.45, 0.75) * 0.9} />
      {/* the front swell */}
      <g className="onb-bob">
        <path d={body} fill={scMix(SC.water, SC.waterDeep, t)} />
        {/* lit back */}
        <path d={`M46 ${yB - p * 0.24} C 66 ${yB - p * 0.55} 86 ${yB - p * 0.88} 106 ${yB - p * 0.97} C 96 ${yB - p * 0.72} 80 ${yB - p * 0.4} 46 ${yB - p * 0.24} Z`}
          fill={SC.waterHi} opacity={0.35 + t * 0.4} />
        <path d={bodyTop} stroke={SC.foam} strokeWidth={L(2, 2.8, t)} strokeLinecap="round" fill="none" />
        {/* contour hairlines echoing the swell face */}
        <g opacity={0.3 + t * 0.28}>
          <path d={bodyTop} stroke={SC.foam} strokeWidth="1" strokeLinecap="round" fill="none" transform="translate(0 8)" />
          <path d={bodyTop} stroke={SC.foam} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(2 16)" />
        </g>
        {/* the claw curls over at high pull */}
        <g opacity={claw} transform={`translate(118 ${yB - p}) scale(${0.5 + claw * 0.34})`}>
          <path d="M0 0 C 8 -9 24 -12 36 -7 C 48 -2 54 10 51 23 C 49 34 41 43 28 47 C 36 36 40 25 38 14 C 36 2 26 -4 12 -2 C 7 -1 3 -1 0 0 Z" fill={SC.waterLo} />
          <path d="M38 14 C 40 25 36 36 28 47 C 24 51 18 54 12 55 C 22 44 28 30 28 18 C 28 14 32 12 38 14 Z" fill={SC.waterDeep} opacity="0.6" />
          <path d="M0 0 C 8 -9 24 -12 36 -7 C 48 -2 54 10 51 23 C 49 32 44 40 34 45" stroke={SC.foam} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M31 40 C 37 30 40 20 38 12" stroke={SC.foam} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
        </g>
        <circle cx={150} cy={yB - p - 8} r="2.4" fill={SC.foam} opacity={sprayO} />
        <circle cx={160} cy={yB - p - 16} r="1.8" fill={SC.foam} opacity={sprayO * 0.9} />
        <circle cx={154} cy={yB - p + 4} r="1.4" fill={SC.foam} opacity={sprayO * 0.8} />
        <circle cx={104} cy={yB - p - 10} r="1.6" fill={SC.foam} opacity={sprayO * 0.7} />
        <g stroke={SC.foam} strokeLinecap="round" fill="none" opacity={sprayO * 0.75}>
          <path d={`M166 ${yB - p - 22} l4 -3`} strokeWidth="1" />
          <path d={`M144 ${yB - p - 24} l3 -3`} strokeWidth="0.9" />
        </g>
      </g>
      {/* deep base — kept light, foam does the definition */}
      <path d={lens(120, 134, 122, 8)} fill={scMix(SC.waterLo, SC.waterDeep, t)} />
      <path d={seaTop(14, 226, 131, 3, 4)} stroke={SC.foam} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d={seaTop(30, 210, 138, 2.2, 3)} stroke={SC.foam} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SCENE · LOGGED — the small confirmation vignette: the moon over two
// calm bands. Fuller moon when you rode it out; thinner when you slipped.
// ═════════════════════════════════════════════════════════════════════
function SceneLoggedMini({ slip = false }) {
  return (
    <svg width="132" height="118" viewBox="0 0 132 118" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <SMoonF cx={66} cy={44} r={30} phase={slip ? 0.28 : 0.78} />
      <circle cx="24" cy="20" r="1.4" fill={SC.farShade} className="onb-twinkle" />
      <circle cx="108" cy="28" r="1.2" fill={SC.farShade} className="onb-twinkle" style={{ animationDelay: '1.2s' }} />
      <g className="onb-bob2">
        <path d={lens(66, 92, 58, 5)} fill={SC.water} />
        <path d="M18 90 C 34 86 54 85 70 87 C 86 88 100 91 112 93" stroke={SC.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" fill="none" />
        <path d="M58 88 h14 M54 93 h10" stroke={SC.foam} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>
      <path d={lens(66, 106, 52, 4.6)} fill={SC.waterLo} />
      <path d="M24 104 C 42 100 62 99 78 101 C 92 102 104 105 112 107" stroke={SC.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" fill="none" />
      <SGull x={102} y={54} s={0.7} o={0.5} />
    </svg>
  );
}

Object.assign(window, {
  SceneKit: { SC, scLerp, scSmooth, scMix, SGull, SPine, SCairn, SMoonF, SSun, SBuoy, SBoat, SPrints, SGrass, SStar5, SPebbles, WaveCrest, SeaStack, seaTop, lens },
  SceneShore, SceneWave, SceneRewire, SceneSteps, SceneAnchor,
  UrgeVignette, SceneIntensity, SceneLoggedMini, setSceneTone,
});
