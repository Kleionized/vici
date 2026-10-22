import Svg, { Path } from 'react-native-svg';

import { mono } from '@/lib/theme';

/**
 * The app's pictograms, all in one solid style (D55): filled shapes on a 24
 * grid, details cut out of them (`evenodd`) rather than drawn in outline, and
 * the few line-like forms (a sun's rays, waves) drawn as filled bands of one
 * weight. Controls — chevrons, close, back, share, the check inside a disc,
 * plus — are marks, not pictures, and stay stroked.
 */

const f = (n: number) => +n.toFixed(2);

const circle = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(h - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(-(w - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(-(h - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}Z`;

/** A line of width `w` with round ends, as a filled shape. */
function band(pts: [number, number][], w: number): string {
  const r = w / 2;
  const normal = (i: number): [number, number] => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  const left = pts.map((p, i) => [p[0] + normal(i)[0] * r, p[1] + normal(i)[1] * r]);
  const right = pts.map((p, i) => [p[0] - normal(i)[0] * r, p[1] - normal(i)[1] * r]).reverse();
  const end = right[0];
  const start = left[0];
  return (
    `M${f(start[0])} ${f(start[1])}` +
    left.slice(1).map((p) => `L${f(p[0])} ${f(p[1])}`).join('') +
    `A${f(r)} ${f(r)} 0 0 0 ${f(end[0])} ${f(end[1])}` +
    right.slice(1).map((p) => `L${f(p[0])} ${f(p[1])}`).join('') +
    `A${f(r)} ${f(r)} 0 0 0 ${f(start[0])} ${f(start[1])}Z`
  );
}

/** Points along a curve `t → [x, y]`, `n` steps. */
const along = (fn: (t: number) => [number, number], n = 24) => Array.from({ length: n + 1 }, (_, i) => fn(i / n));

const wave = (y: number, amp: number) => along((t) => [3 + 18 * t, y - amp * Math.sin(t * Math.PI * 2)]);

const rays = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4;
  return band(
    [
      [12 + Math.cos(a) * 7.4, 12 + Math.sin(a) * 7.4],
      [12 + Math.cos(a) * 10.4, 12 + Math.sin(a) * 10.4],
    ],
    2.1,
  );
}).join('');

/** The arc of "again": most of a circle, its head an arrow. */
const againArc = (() => {
  const pts = along((t) => {
    const a = ((-30 + 260 * t) * Math.PI) / 180;
    return [12 + 7.2 * Math.cos(a), 12 + 7.2 * Math.sin(a)];
  }, 32);
  const [x, y] = pts[0];
  // the head at the start of the arc, pointing back along it (anticlockwise)
  const a = (-30 * Math.PI) / 180;
  const tx = Math.sin(a);
  const ty = -Math.cos(a);
  const nx = Math.cos(a);
  const ny = Math.sin(a);
  const head = `M${f(x + tx * 3.6)} ${f(y + ty * 3.6)}L${f(x + nx * 3.4 - tx * 0.6)} ${f(y + ny * 3.4 - ty * 0.6)}L${f(x - nx * 3.4 - tx * 0.6)} ${f(y - ny * 3.4 - ty * 0.6)}Z`;
  return band(pts.slice(2), 2.4) + head;
})();

/** A five-pointed star, its points rounded a little by its own polygon. */
const star = (() => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180);
    const r = i % 2 ? 4.4 : 9.6;
    return `${f(12 + r * Math.cos(a))} ${f(12.6 + r * Math.sin(a))}`;
  });
  return `M${pts.join('L')}Z`;
})();

type Part = { d: string; even?: boolean };

export const GLYPHS = {
  sun: [{ d: circle(12, 12, 4.6) + rays }],
  waves: [{ d: band(wave(9.5, 2.2), 2.4) + band(wave(15.5, 2.2), 2.4) }],
  wave: [{ d: band(wave(12, 3), 2.4) }],
  again: [{ d: againArc }],
  book: [{ d: 'M11.2 6.2C9.4 4.9 6.7 4.4 3 4.4v14.2c3.6 0 6.3.5 8.2 1.7zM12.8 6.2C14.6 4.9 17.3 4.4 21 4.4v14.2c-3.6 0-6.3.5-8.2 1.7z' }],
  calendar: [
    { d: rrect(3, 5, 18, 16, 3) + rrect(5.5, 10, 13, 8.5, 1.5), even: true },
    { d: rrect(7, 2.5, 2.2, 4, 1.1) + rrect(14.8, 2.5, 2.2, 4, 1.1) + rrect(7.5, 12, 3.6, 3.6, 0.8) },
  ],
  clock: [{ d: circle(12, 12, 9.5) + 'M11 6.5h2v5.1l3.3 2.1-1.1 1.7L11 12.6z', even: true }],
  moon: [{ d: 'M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z' }],
  bars: [{ d: rrect(3.5, 13, 4.4, 7.5, 1.3) + rrect(9.8, 8.8, 4.4, 11.7, 1.3) + rrect(16.1, 4, 4.4, 16.5, 1.3) }],
  checkCircle: [{ d: circle(12, 12, 9.5) + 'M7.3 12.6l1.5-1.5 2.2 2.2 4.6-4.7 1.5 1.5-6.1 6.2z', even: true }],
  person: [{ d: circle(12, 7.6, 4.3) + 'M3.5 20.8a8.5 8.5 0 0 1 17 0z' }],
  pencil: [{ d: 'M3.6 20.4l1-4.7L15.5 4.8a1.7 1.7 0 0 1 2.4 0l1.3 1.3a1.7 1.7 0 0 1 0 2.4L8.3 19.4z' }],
  search: [{ d: circle(10.3, 10.3, 7.2) + circle(10.3, 10.3, 4.6), even: true }, { d: band([[15.4, 15.4], [20.4, 20.4]], 2.8) }],
  house: [{ d: 'M3 11.2L12 3l9 8.2v9.3a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5z' + rrect(10, 14, 4, 6, 1), even: true }],
  bed: [{ d: rrect(2.5, 5, 3.2, 15, 1.3) + rrect(2.5, 12, 19, 5.2, 1.6) + rrect(7.2, 8.4, 5.4, 3, 1.2) + rrect(18.3, 15, 3.2, 5, 1.2) }],
  people: [{ d: circle(8, 7.6, 3.3) + circle(16.4, 7.6, 3.3) + 'M1.8 19.5a6.2 6.2 0 0 1 12.4 0zM10.2 19.5a6.2 6.2 0 0 1 12.4 0z' }],
  briefcase: [
    { d: rrect(2.5, 7, 19, 13, 2.6) + rrect(10.4, 12, 3.2, 2.6, 0.7), even: true },
    { d: rrect(8, 3.5, 8, 4.5, 1.8) + rrect(10, 5.2, 4, 2.8, 0.8), even: true },
  ],
  pin: [{ d: 'M12 22s-7.2-6.4-7.2-12.1a7.2 7.2 0 0 1 14.4 0C19.2 15.6 12 22 12 22z' + circle(12, 9.9, 2.7), even: true }],
  phone: [{ d: rrect(6, 2, 12, 20, 3) + rrect(10, 17.8, 4, 1.6, 0.8), even: true }],
  plug: [{ d: rrect(7.8, 2.5, 2.4, 5.5, 1.2) + rrect(13.8, 2.5, 2.4, 5.5, 1.2) + 'M5.5 7.5h13v3.6a6.5 6.5 0 0 1-13 0z' + band([[12, 16.5], [12, 21.5]], 2.6) }],
  doc: [{ d: rrect(4.5, 2.5, 15, 19, 3) + rrect(8, 7.8, 8, 2, 1) + rrect(8, 11.6, 8, 2, 1) + rrect(8, 15.4, 5, 2, 1), even: true }],
  medal: [{ d: circle(12, 9, 6.6) + 'M8 14.2L6.4 21.6l5.6-2.7 5.6 2.7-1.6-7.4a8.2 8.2 0 0 1-8 0z' }],
  stopwatch: [
    { d: circle(12, 14, 8) + rrect(11, 9.2, 2, 6, 1), even: true },
    { d: rrect(9.4, 1.8, 5.2, 2.5, 1.25) + rrect(11, 3.6, 2, 3, 0.5) },
  ],
  star: [{ d: star }],
  bolt: [{ d: 'M13.6 2L4.6 13.4h6.1L9.4 22l10-12.3h-6.3z' }],
  alert: [{ d: circle(12, 12, 9.5) + rrect(10.9, 6.4, 2.2, 7.4, 1.1) + circle(12, 16.7, 1.35), even: true }],
} satisfies Record<string, Part[]>;

export type GlyphName = keyof typeof GLYPHS;

/** One solid pictogram at `size`, in `color`. */
export function Glyph({ name, size = 24, color = mono.ink }: { name: GlyphName; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {GLYPHS[name].map((p: Part, i: number) => (
        <Path key={i} d={p.d} fill={color} fillRule={p.even ? 'evenodd' : 'nonzero'} />
      ))}
    </Svg>
  );
}
