/**
 * SceneKit — a React-Native-svg port of the design canvas's shared
 * faceted-planar scene kit (`scenes-core.jsx`). Warm paper greys, every form
 * built from a LIT plane + a SHADE plane, banded water with foam lines, ink
 * only for tiny narrative marks (gulls, boats, buoys). Gradients are used
 * ONLY for literal light (the sun's glow).
 *
 * This exports the `SC` palette and the small primitives the app's data /
 * insight / scene screens compose from.
 */
import { type ReactNode, useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

// ── palette — lifted from the canvas (warm paper scale, no hue) ──────
export const SC = {
  skyTop: '#F8F6EF',
  skyLo: '#EFECE1',
  storm: '#DAD5C2',
  far: '#E9E6D9',
  farShade: '#E1DECF',
  midLit: '#E1DDCD',
  midShade: '#D2CDBA',
  nearLit: '#D8D3C0',
  nearShade: '#C5C0AA',
  fgLit: '#C9C4AE',
  fgShade: '#B4AF98',
  fgDeep: '#A8A38C',
  path: '#F7F5ED',
  snow: '#F4F2E9',
  waterHi: '#E7E4D5',
  water: '#D9D5C2',
  waterLo: '#C8C3AD',
  waterDeep: '#B3AE97',
  waterDark: '#A29D85',
  foam: '#F5F3EA',
  ink: '#4A4A42',
  sun: '#F1EDDA',
  sunEdge: '#E3DEC6',
  lamp: '#F2DCA4',
} as const;

export const scLerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── tiny shared prims ────────────────────────────────────────────────
export function SGull({ x, y, s = 1, o = 0.7 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <Path
      d={`M${x - 7 * s} ${y} Q ${x - 2.4 * s} ${y - 4.6 * s} ${x} ${y} Q ${x + 2.4 * s} ${y - 4.6 * s} ${x + 7 * s} ${y}`}
      stroke={SC.ink}
      strokeWidth={1.6 * s}
      strokeLinecap="round"
      fill="none"
      opacity={o}
    />
  );
}

// soft-falloff sun — the only gradient allowed for daylight
export function SSun({ cx, cy, r, glow = 2.6, op = 1 }: { cx: number; cy: number; r: number; glow?: number; op?: number }) {
  const u = useId().replace(/:/g, '');
  return (
    <G opacity={op}>
      <Defs>
        <RadialGradient id={u} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#EDE7D2" stopOpacity={0.9} />
          <Stop offset="55%" stopColor="#EDE7D2" stopOpacity={0.38} />
          <Stop offset="100%" stopColor="#EDE7D2" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r * glow} fill={`url(#${u})`} />
      <Circle cx={cx} cy={cy} r={r} fill={SC.sun} stroke={SC.sunEdge} strokeWidth={1.5} />
    </G>
  );
}

// faceted moon, static phase 0..1 (lit fraction, lit side left)
export function SMoonF({ cx, cy, r, phase = 0.4 }: { cx: number; cy: number; r: number; phase?: number }) {
  const p = Math.max(0.02, Math.min(0.98, phase));
  const rx = r * Math.abs(1 - 2 * p);
  const sweep = p < 0.5 ? 1 : 0;
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={SC.snow} stroke={SC.farShade} strokeWidth={1.6} />
      <Circle cx={cx - r * 0.34} cy={cy - r * 0.14} r={r * 0.15} fill="#E7E4D7" />
      <Circle cx={cx - r * 0.06} cy={cy + r * 0.32} r={r * 0.1} fill="#E7E4D7" />
      <Circle cx={cx + r * 0.3} cy={cy + r * 0.06} r={r * 0.08} fill="#E7E4D7" />
      <Path
        d={`M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`}
        fill={SC.midLit}
        opacity={0.92}
      />
    </G>
  );
}

// small marker buoy — cone on a mast, leaning by `lean` degrees
export function SBuoy({ x, y, s = 1, lean = 0, o = 1 }: { x: number; y: number; s?: number; lean?: number; o?: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${lean}) scale(${s})`} opacity={o}>
      <Path d="M0 6 L0 -16" stroke={SC.ink} strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
      <Path d="M0 -16 L11 -12 L0 -8 Z" fill={SC.midShade} />
      <Path d="M0 -16 L11 -12 L5 -13.8 Z" fill={SC.nearShade} />
      <Ellipse cx={0} cy={7} rx={7.5} ry={2.8} fill={SC.foam} opacity={0.85} />
    </G>
  );
}

// little two-sail boat riding a band
export function SBoat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d="M0 14 L0 -22" stroke={SC.ink} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
      <Path d="M2 -20 C 13 -12 16 2 16 12 L2 12 Z" fill={SC.snow} />
      <Path d="M2 -20 C 6 -14 8 -2 9 12 L2 12 Z" fill={SC.midShade} opacity={0.5} />
      <Path d="M-2 -16 C -11 -8 -13 4 -13 12 L-2 12 Z" fill={SC.midLit} />
      <Path d="M-17 14 C -10 20 12 20 20 14 L18 18 C 8 23 -8 23 -14 18 Z" fill={SC.fgShade} />
      <Path d="M-17 14 L20 14 L18 18 L-14 18 Z" fill={SC.fgDeep} />
      <Path d="M-17 14 L20 14" stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" />
    </G>
  );
}

// faceted pine — lit + shade halves
export function SPine({ x, y, s = 1, lit = SC.nearShade, sh = SC.fgShade }: { x: number; y: number; s?: number; lit?: string; sh?: string }) {
  return (
    <G>
      <Path d={`M${x} ${y - 30 * s} L${x - 10 * s} ${y} L${x} ${y} Z`} fill={lit} />
      <Path d={`M${x} ${y - 30 * s} L${x + 9 * s} ${y} L${x} ${y} Z`} fill={sh} />
    </G>
  );
}

// stacked stone cairn
export function SCairn({ x, y, s = 1, a = SC.fgShade, b = SC.fgDeep }: { x: number; y: number; s?: number; a?: string; b?: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Ellipse cx={0} cy={4} rx={9} ry={3.4} fill={a} />
      <Ellipse cx={0} cy={0} rx={6.4} ry={2.8} fill={b} />
      <Ellipse cx={0} cy={-4} rx={4.2} ry={2.2} fill={a} />
      <Circle cx={0} cy={-8} r={2} fill={b} />
    </G>
  );
}

// beach-grass tuft
export function SGrass({ x, y, s = 1, c = SC.fgShade }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G stroke={c} strokeWidth={1.6 * s} strokeLinecap="round" fill="none">
      <Path d={`M${x} ${y} C ${x - 1 * s} ${y - 5 * s} ${x - 3 * s} ${y - 8 * s} ${x - 5 * s} ${y - 10 * s}`} />
      <Path d={`M${x} ${y} C ${x} ${y - 6 * s} ${x + 1 * s} ${y - 9 * s} ${x + 3 * s} ${y - 12 * s}`} />
      <Path d={`M${x + 2 * s} ${y} C ${x + 3 * s} ${y - 4 * s} ${x + 5 * s} ${y - 7 * s} ${x + 7 * s} ${y - 8 * s}`} />
    </G>
  );
}

// a floating lens (tapers to points at both ends) — for single bands
export const lens = (cx: number, cy: number, rx: number, ry: number, sag = 0.55) =>
  `M${cx - rx} ${cy} C ${cx - rx * sag} ${cy - ry}, ${cx + rx * sag} ${cy - ry}, ${cx + rx} ${cy} C ${cx + rx * sag} ${cy + ry}, ${cx - rx * sag} ${cy + ry}, ${cx - rx} ${cy} Z`;

// gentle wavy top edge for banded water
export function seaTop(x0: number, x1: number, y: number, a: number, segs = 4) {
  const seg = (x1 - x0) / segs;
  let d = `M${x0} ${y}`;
  for (let i = 0; i < segs; i++) {
    const sx = x0 + i * seg;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`;
  }
  return d;
}

// a full-width banded sea block (used as a decorative footer/hero)
export type SeaBand = { top: string; fill: string; foam?: boolean; foamW?: number; foamO?: number; extra?: ReactNode };
export function SeaStack({
  cx,
  cy,
  rx,
  ry,
  bands,
  children,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  bands: SeaBand[];
  children?: ReactNode;
}) {
  const rr = ry * 0.9;
  const clip = useId().replace(/:/g, '');
  return (
    <G>
      <Defs>
        <clipPath id={clip}>
          <Rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} rx={rr} ry={rr} />
        </clipPath>
      </Defs>
      <G clipPath={`url(#${clip})`}>
        {bands.map((b, i) => (
          <G key={i}>
            <Path d={`${b.top} L${cx + rx + 4} ${cy + ry + 4} L${cx - rx - 4} ${cy + ry + 4} Z`} fill={b.fill} />
            {b.foam ? <Path d={b.top} stroke={SC.foam} strokeWidth={b.foamW || 2} strokeLinecap="round" fill="none" opacity={b.foamO == null ? 0.8 : b.foamO} /> : null}
            {b.extra}
          </G>
        ))}
        {children}
      </G>
    </G>
  );
}

// wandering footprints — the path, in miniature
export function SPrints({ pts, o = 0.55, tilt = -18 }: { pts: [number, number][]; o?: number; tilt?: number }) {
  return (
    <G>
      {pts.map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={2.8} ry={1.6} fill={SC.fgDeep} opacity={Math.max(0.12, o - i * 0.055)} transform={`rotate(${tilt + i * 3} ${x} ${y})`} />
      ))}
    </G>
  );
}

// five-armed starfish
export function SStar5({ x, y, s = 1, c = SC.fgDeep, rot = -14 }: { x: number; y: number; s?: number; c?: string; rot?: number }) {
  return (
    <Path
      d="M0 -7 l2.1 4.3 4.8 .6 -3.5 3.3 .9 4.7 -4.3-2.3 -4.3 2.3 .9-4.7 -3.5-3.3 4.8-.6 Z"
      fill={c}
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    />
  );
}

// ── THE WAVE — the breaking crest (canvas: WaveCrest). Base y=0 at the
// waterline, peak ~−88, spans x −118..+84 around 0. ──
export function WaveCrest({ x = 0, y = 0, s = 1, deep = true }: { x?: number; y?: number; s?: number; deep?: boolean }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d="M-118 0 C -90 -5 -62 -14 -42 -28 C -26 -41 -14 -58 -5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31 C 42 -27 36 -25 31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 7 -73 0 -66 -5 -56 C -13 -40 -26 -22 -44 -11 C -66 -2 -92 1 -118 0 Z" fill={SC.water} />
      <Path d="M-5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31 C 42 -27 36 -25 31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 7 -73 0 -66 -5 -56 L-5 -71 Z" fill={SC.waterLo} opacity={0.9} />
      {deep ? <Path d="M31 -26 C 40 -35 44 -46 41 -56 C 38 -68 28 -75 16 -74 C 22 -72 28 -68 31 -61 C 35 -52 34 -38 27 -28 C 28 -27 30 -26 31 -26 Z" fill={SC.waterDeep} opacity={0.55} /> : null}
      <Path d="M-104 -3 C -78 -8 -54 -18 -37 -32 C -24 -43 -13 -58 -5 -70 C -12 -52 -22 -34 -36 -20 C -54 -6 -80 -1 -104 -3 Z" fill={SC.waterHi} opacity={0.85} />
      <G stroke={SC.foam} strokeLinecap="round" fill="none">
        <Path d="M-84 -6 C -60 -12 -40 -23 -26 -38 C -17 -48 -9 -60 -3 -69" strokeWidth={1.1} opacity={0.5} />
        <Path d="M-64 -6 C -46 -13 -31 -26 -20 -41 C -14 -49 -8 -57 -2 -63" strokeWidth={0.9} opacity={0.36} />
        <Path d="M-44 -5 C -30 -12 -19 -23 -10 -37 C -6 -43 -1 -49 4 -54" strokeWidth={0.85} opacity={0.26} />
      </G>
      <Path d="M-100 -4 C -76 -10 -52 -19 -38 -31 C -25 -42 -14 -58 -5 -71 C 3 -82 14 -88 26 -88 C 44 -88 57 -79 61 -65 C 64 -52 59 -39 47 -31" stroke={SC.foam} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <G stroke={SC.foam} strokeLinecap="round" fill="none">
        <Path d="M27 -30 C 34 -39 37 -49 35 -58" strokeWidth={1} opacity={0.5} />
        <Path d="M22 -33 C 28 -41 30 -50 29 -58" strokeWidth={0.8} opacity={0.32} />
      </G>
      <Circle cx={31} cy={-26} r={4} fill={SC.foam} />
      <Circle cx={24} cy={-22} r={2.8} fill={SC.foam} opacity={0.9} />
      <Circle cx={38} cy={-27} r={2.6} fill={SC.foam} opacity={0.85} />
      <Circle cx={52} cy={-20} r={2.2} fill={SC.foam} />
      <Circle cx={62} cy={-28} r={1.6} fill={SC.foam} opacity={0.85} />
      <Circle cx={58} cy={-10} r={1.4} fill={SC.foam} opacity={0.8} />
      <Circle cx={70} cy={-18} r={1.1} fill={SC.foam} opacity={0.65} />
      <Circle cx={66} cy={-36} r={0.9} fill={SC.foam} opacity={0.55} />
      <G stroke={SC.foam} strokeLinecap="round" fill="none" opacity={0.6}>
        <Path d="M54 -34 l4 -3" strokeWidth={1} />
        <Path d="M64 -44 l3 -3" strokeWidth={0.9} />
        <Path d="M72 -28 l3.4 -1.8" strokeWidth={0.9} />
      </G>
      <Path d="M20 -2 C 32 -9 50 -11 64 -8 C 74 -6 80 -3 78 0 C 60 4 36 4 20 -2 Z" fill={SC.foam} opacity={0.92} />
    </G>
  );
}

// ── urge vignettes (canvas: UrgeVignette) — the stages the flow uses ──
export function UrgeVignette({ stage }: { stage: 'remove' | 'name' }) {
  if (stage === 'remove') {
    return (
      <G>
        <SSun cx={64} cy={40} r={15} glow={2.6} />
        <SGull x={150} y={40} s={0.85} o={0.6} />
        <SeaStack
          cx={92}
          cy={96}
          rx={90}
          ry={22}
          bands={[
            { top: seaTop(0, 190, 82, 3.5), fill: SC.water, foam: true, foamW: 2, extra: <Path d="M40 86 C 60 82 84 81 102 84 C 82 87 58 88 40 86 Z" fill={SC.waterHi} opacity={0.8} /> },
            { top: seaTop(0, 190, 102, 3), fill: SC.waterLo, foam: true, foamW: 1.8, foamO: 0.6 },
          ]}
        />
        <Path d="M0 132 C 60 120 130 116 196 120 C 250 123 292 130 320 138 L320 180 L0 180 Z" fill={SC.fgLit} />
        <Path d="M0 156 C 80 148 170 152 250 148 C 278 146 302 150 320 148 L320 180 L0 180 Z" fill={SC.fgShade} opacity={0.55} />
        <Path d="M196 132 L258 96 L320 122 L320 148 C 280 142 236 138 196 138 Z" fill={SC.nearLit} />
        <Path d="M258 96 L320 122 L292 122 Z" fill={SC.nearShade} />
        <G transform="translate(258 96)">
          <Path d="M-20 26 L0 -6 L20 26 Z" fill={SC.snow} />
          <Path d="M0 -6 L20 26 L9 26 Z" fill={SC.midShade} />
          <Path d="M-5 26 L0 12 L5 26 Z" fill={SC.fgDeep} />
        </G>
        <SPine x={300} y={120} s={1} />
        <SPine x={286} y={126} s={0.72} />
        <Path d="M56 180 C 88 164 124 152 162 144 C 196 137 224 128 242 116 L256 120 C 240 134 210 144 176 152 C 136 161 98 170 74 180 Z" fill={SC.path} />
        <SPrints pts={[[104, 166], [122, 160], [142, 155], [162, 150], [182, 145]]} />
        <SGrass x={40} y={150} s={1.1} />
        <SGrass x={228} y={158} s={0.9} />
        <SCairn x={70} y={140} s={0.7} />
      </G>
    );
  }
  // 'name' — a pennant planted on the beach; the wave, named, smaller
  return (
    <G>
      <SGull x={262} y={44} s={0.9} o={0.65} />
      <Path d={lens(112, 92, 100, 6)} fill={SC.waterHi} />
      <Path d="M28 90 C 56 85 88 84 116 86 C 144 88 172 92 194 95" stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" opacity={0.55} fill="none" />
      <WaveCrest x={92} y={128} s={0.62} />
      <Path d={lens(110, 138, 104, 7)} fill={SC.waterLo} />
      <Path d="M22 135 C 56 129 96 127 128 129 C 158 131 186 136 202 139" stroke={SC.foam} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.85} />
      <Path d="M0 148 C 70 138 150 136 224 140 C 262 142 294 147 320 152 L320 180 L0 180 Z" fill={SC.fgLit} />
      <Path d="M0 166 C 90 158 190 160 274 156 C 292 155 308 157 320 156 L320 180 L0 180 Z" fill={SC.fgShade} opacity={0.5} />
      <Path d="M26 150 C 70 142 122 140 168 143 C 128 148 76 150 26 150 Z" fill={SC.foam} opacity={0.85} />
      <G transform="translate(234 150)">
        <Path d="M0 8 L4 -66" stroke={SC.fgDeep} strokeWidth={4} strokeLinecap="round" />
        <Path d="M4 -66 L4 -58" stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M5 -64 L46 -55 L5 -43 Z" fill={SC.ink} />
        <Path d="M1 -20 L-26 6" stroke={SC.fgDeep} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="1 5" />
        <Ellipse cx={0} cy={9} rx={10} ry={3.4} fill={SC.fgShade} />
        <Circle cx={-8} cy={6} r={2.6} fill={SC.fgDeep} />
        <Circle cx={9} cy={7} r={2} fill={SC.fgDeep} />
      </G>
      <SGrass x={288} y={166} s={1} />
      <SStar5 x={126} y={162} s={0.9} />
      <SPrints pts={[[52, 170], [72, 166], [94, 162], [116, 160]]} tilt={-8} />
    </G>
  );
}

// smooth Catmull-Rom-ish curve through points (for the mood tide chart)
export function scSmoothPath(pts: [number, number][], k = 0.18) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) * k} ${p1[1] + (p2[1] - p0[1]) * k}, ${p2[0] - (p3[0] - p1[0]) * k} ${p2[1] - (p3[1] - p1[1]) * k}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// convenience wrapper so screens can drop a scene as one element
export function Scene({ width, height, viewBox, children }: { width: number | string; height: number; viewBox: string; children: ReactNode }) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      {children}
    </Svg>
  );
}
