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
