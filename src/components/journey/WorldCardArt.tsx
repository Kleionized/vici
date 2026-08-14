/**
 * The four week thumbnails on the campaign map (canvas 107) — one drawing per
 * week, each sitting in its own pool of warm light at the left edge of the
 * card: a stack of blocks for the foundations, a wave for the urges, a face for
 * the setbacks, a house for the life being built.
 *
 * The canvas draws them at fixed pixel offsets inside a 96pt-tall card, so the
 * art is a fixed 130 × 96 box anchored left — it does not stretch with the card.
 */

import { useId } from 'react';
import type { ReactNode } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { ART_ROOT, roundRect, swell } from './WorldArt';

/** The drawing's own box: the light pool runs from x 9 to x 119. */
export const CARD_ART_W = 130;
export const CARD_ART_H = 96;

/** Per week: how bright the pool of light is, and how far down it starts. */
const POOL: Record<number, { alpha: number; top: number }> = {
  4: { alpha: 0.62, top: 7 },
  3: { alpha: 0.5, top: 8 },
  2: { alpha: 0.38, top: 8 },
  1: { alpha: 0.3, top: 8 },
};

export function WeekCardArt({ week }: { week: number }) {
  const gid = `w${week}-${useId().replace(/:/g, '')}`;
  const pool = POOL[week] ?? POOL[1];

  let subject: ReactNode = null;
  if (week === 4) {
    subject = (
      <>
        {/* house: body, doorway, latch, and a lean-to skewed -8° off its top-left */}
        <Path d="M46 22H82A6 6 0 0 1 88 28V68H40V28A6 6 0 0 1 46 22Z" fill="#E0DFDA" />
        <Path d="M50 28H78A3 3 0 0 1 81 31V68H47V31A3 3 0 0 1 50 28Z" fill="#F9F8F4" />
        <Circle cx={64.5} cy={44.5} r={4.5} fill="#E9D2A4" />
        <G transform="translate(88 26) skewY(-8)">
          <Rect x={0} y={0} width={15} height={44} rx={2} fill="#D6D5D0" />
        </G>
      </>
    );
  } else if (week === 3) {
    subject = (
      <>
        <Circle cx={64} cy={46} r={24} fill="#E0DFDA" />
        <Circle cx={64} cy={46} r={11} fill="#FAF8F4" />
        <Rect x={61} y={24} width={6} height={8} rx={2} fill="#C6C5C0" />
        <Rect x={61} y={60} width={6} height={8} rx={2} fill="#C6C5C0" />
        <Rect x={42} y={43} width={8} height={6} rx={2} fill="#C6C5C0" />
        <Rect x={78} y={43} width={8} height={6} rx={2} fill="#C6C5C0" />
      </>
    );
  } else if (week === 2) {
    // the canvas nests a 26 × 20 svg at twice the size, so the stroke doubles too
    subject = (
      <G transform="translate(38 26) scale(2)">
        <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke="#55534E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </G>
    );
  } else {
    subject = (
      <>
        <Rect x={40} y={58} width={48} height={11} rx={3} fill="#C6C5C0" />
        <Rect x={46} y={46} width={34} height={11} rx={3} fill="#D6D5D0" />
        <Rect x={53} y={36} width={20} height={9} rx={3} fill="#E0DFDA" />
      </>
    );
  }

  return (
    <Svg width={CARD_ART_W} height={CARD_ART_H} viewBox={`0 0 ${CARD_ART_W} ${CARD_ART_H}`} style={ART_ROOT}>
      <Defs>
        {/* the canvas leaves these pools unblurred, so the ramp is its own two
            stops — a third one in the middle only lifts the alpha off the line */}
        <RadialGradient id={`pool-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFECC4" stopOpacity={pool.alpha} />
          <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
        </RadialGradient>
        {/* the canvas blurs the ground shadow by 3px; the falloff stands in for it */}
        <RadialGradient id={`shade-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#000000" stopOpacity={0.86} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={64} cy={78.5} rx={26} ry={4.5} fill={`url(#shade-${gid})`} opacity={0.08} />
      <Ellipse cx={64} cy={pool.top + 55} rx={55} ry={55} fill={`url(#pool-${gid})`} />
      {subject}
    </Svg>
  );
}

// ── 183 · the five grounds ───────────────────────────────────────────────────

/**
 * The picture inside each ground card on `CampaignGrounds` (canvas 183, the
 * export-only frame): a low sun, the dunes or swells of that ground, and one
 * small prop — a flag planted, a boat under sail, a cloud over open water, a
 * cairn, a tent by a fire.
 *
 * Everything the canvas anchors with `right:` is measured off the live card
 * width, so a wider phone widens the water rather than sliding the boat out of
 * frame. The three unreached grounds are drawn at the canvas's 0.55.
 */
export type GroundKey = 'landing' | 'crossing' | 'deep' | 'held' | 'camp';

/** The canvas draws every ground card exactly this tall. */
export const GROUND_CARD_H = 116;
/** And the one full-bleed picture between grounds III and IV this tall. */
export const GROUND_INTERLUDE_H = 236;

/** The sun's alpha at its centre — only three of the five grounds have one. */
const SUN_ALPHA: Record<GroundKey, number> = { landing: 0.9, crossing: 0.95, deep: 0, held: 0, camp: 0.9 };

export function GroundCardArt({ ground, width }: { ground: GroundKey; width: number }) {
  const gid = `${ground}-${useId().replace(/:/g, '')}`;
  const sun = `url(#sun-${gid})`;
  const w = width;

  let body: ReactNode = null;
  if (ground === 'landing') {
    body = (
      <>
        <Ellipse cx={w - 129} cy={29} rx={25} ry={25} fill={sun} />
        <Path d={swell(150, 64, w - 90, 110, 46)} fill="#EADFC9" />
        <Path d={swell(238, 84, w - 138, 110, 38)} fill="#E0D2B4" />
        <Rect x={w - 58.5} y={42} width={2.5} height={28} rx={1.25} fill="#55534E" />
        {/* the pennant is a CSS border triangle: 13 wide, 10 tall, apex right */}
        <Path d={`M${w - 54} 44L${w - 41} 49L${w - 54} 54Z`} fill="#3A3934" />
        <Rect x={170} y={14} width={36} height={11} rx={5.5} fill="#FFFFFF" fillOpacity={0.65} />
        <Ellipse cx={w - 98.5} cy={85.75} rx={2.5} ry={1.75} fill="#CDBD92" transform={`rotate(-14 ${w - 98.5} 85.75)`} />
        <Ellipse cx={w - 86.5} cy={79.75} rx={2.5} ry={1.75} fill="#CDBD92" transform={`rotate(-10 ${w - 86.5} 79.75)`} />
        <Ellipse cx={w - 76.5} cy={85.75} rx={2.5} ry={1.75} fill="#CDBD92" />
      </>
    );
  } else if (ground === 'crossing') {
    body = (
      <>
        <Ellipse cx={w - 98} cy={30} rx={28} ry={28} fill={sun} />
        <Path d={swell(130, 60, w - 60, 110, 44)} fill="#D8E3EE" />
        <Path d={swell(210, 78, w - 170, 110, 38)} fill="#C7D8E7" />
        <Path d={swell(160, 96, w - 40, 110, 32)} fill="#B9CDDF" />
        <Path d={`M${w - 115} 30L${w - 115} 50L${w - 102} 50Z`} fill="#3A3934" />
        {/* hull: 28 × 7 with 3/8/9/9 corners, which CSS scales by 7/17 */}
        <Path d={roundRect(w - 122, 51, 28, 7, 1.24, 3.29, 3.71, 3.71)} fill="#131313" />
        <Path d={`M${w - 176} 44L${w - 176} 53L${w - 170} 53Z`} fill="#8DA0B2" />
        <Rect x={w - 172} y={68} width={22} height={3} rx={1.5} fill="rgba(255,255,255,0.55)" />
        <Rect x={w - 76} y={86} width={18} height={3} rx={1.5} fill="rgba(255,255,255,0.45)" />
        <G transform={`translate(${w - 66} 18)`}>
          <Path d="M1 6C3 3 5 3 7 5.5M12 5c2-3.5 4.5-3.5 7-0.5" fill="none" stroke="#8DA0B2" strokeWidth={1.5} strokeLinecap="round" />
        </G>
      </>
    );
  } else if (ground === 'deep') {
    body = (
      <G opacity={0.55}>
        <Path d={swell(120, 56, w - 40, 110, 46)} fill="#C4D3E1" />
        <Path d={swell(190, 76, w - 140, 110, 38)} fill="#B0C4D6" />
        <Path d={swell(150, 94, w - 20, 110, 32)} fill="#9FB7CC" />
        <Rect x={w - 144} y={66} width={24} height={3} rx={1.5} fill="rgba(255,255,255,0.5)" />
        <Rect x={w - 82} y={84} width={16} height={3} rx={1.5} fill="rgba(255,255,255,0.4)" />
        <Rect x={w - 86} y={28} width={34} height={10} rx={5} fill="#FFFFFF" fillOpacity={0.5} />
      </G>
    );
  } else if (ground === 'held') {
    body = (
      <G opacity={0.55}>
        <Path d={swell(140, 62, w - 70, 110, 44)} fill="#E2D7BE" />
        <Path d={swell(230, 84, w - 120, 110, 36)} fill="#D6C8A6" />
        <Rect x={w - 78} y={56} width={14} height={5} rx={2.5} fill="#8B8882" />
        <Rect x={w - 75.5} y={50} width={9} height={4} rx={2} fill="#98958E" />
        <Rect x={w - 74} y={45} width={6} height={3} rx={1.5} fill="#A5A29B" />
        <Ellipse cx={w - 134} cy={83.5} rx={2} ry={1.5} fill="#C2B592" />
        <Ellipse cx={w - 116} cy={76.5} rx={2} ry={1.5} fill="#C2B592" />
        <Ellipse cx={w - 98} cy={69.5} rx={2} ry={1.5} fill="#C2B592" />
        <Rect x={160} y={18} width={32} height={10} rx={5} fill="#FFFFFF" fillOpacity={0.6} />
      </G>
    );
  } else {
    // the flame's corners are 50%/50%/40%/40% of an 8 × 6 box, so every one of
    // them is a different ellipse and the shape has to be written out longhand
    const fx = w - 112;
    const flame = `M${fx + 4} 58A4 3 0 0 1 ${fx + 8} 61V61.6A3.2 2.4 0 0 1 ${fx + 4.8} 64H${fx + 3.2}A3.2 2.4 0 0 1 ${fx} 61.6V61A4 3 0 0 1 ${fx + 4} 58Z`;
    body = (
      <G opacity={0.55}>
        <Ellipse cx={w - 129} cy={29} rx={23} ry={23} fill={sun} />
        <Path d={swell(130, 66, w - 50, 110, 44)} fill="#E6DCC6" />
        <Path d={`M${w - 90} 66L${w - 56} 66L${w - 73} 40Z`} fill="#55534E" />
        <Path d={roundRect(w - 75, 56, 4, 10, 2, 2, 0, 0)} fill="#2A2924" />
        <Rect x={w - 118} y={63} width={12} height={3} rx={1.5} fill="#8B8882" />
        <Path d={flame} fill="#D9A05B" />
        <Circle cx={w - 102.5} cy={51.5} r={1.5} fill="#B4B1AB" />
        <Circle cx={w - 98.25} cy={45.25} r={1.25} fill="#C6C5C0" />
      </G>
    );
  }

  // Left static this scene renders *underneath* the absolutely-positioned field
  // gradient it is drawn on — see ART_ROOT.
  return (
    <Svg width={w} height={GROUND_CARD_H} viewBox={`0 0 ${w} ${GROUND_CARD_H}`} style={ART_ROOT}>
      <Defs>
        <RadialGradient id={`sun-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#F3E3C4" stopOpacity={SUN_ALPHA[ground]} />
          <Stop offset="0.78" stopColor="#F3E3C4" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {body}
    </Svg>
  );
}

/**
 * The one full-bleed picture in the column — the long view between Deep Waters
 * and Held Ground: a sun over open water, a figure on the near shore, a boat
 * standing out past a row of roofs. The canvas pulls it out to the frame edges
 * with `margin: 0 -24px`, so it is measured off the window, not the card.
 */
export function GroundInterludeArt({ width }: { width: number }) {
  const gid = `interlude-${useId().replace(/:/g, '')}`;
  const w = width;
  return (
    <Svg width={w} height={GROUND_INTERLUDE_H} viewBox={`0 0 ${w} ${GROUND_INTERLUDE_H}`} style={ART_ROOT}>
      <Defs>
        <RadialGradient id={`glow-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#F3E3C4" stopOpacity={1} />
          <Stop offset="0.52" stopColor="#F3E3C4" stopOpacity={1} />
          <Stop offset="1" stopColor="#F3E3C4" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={w / 2 + 23} cy={91} rx={75} ry={75} fill={`url(#glow-${gid})`} />
      <Rect x={44} y={36} width={52} height={14} rx={7} fill="#FFFFFF" fillOpacity={0.7} />
      <Rect x={66} y={27} width={34} height={12} rx={6} fill="#FFFFFF" fillOpacity={0.55} />
      <Rect x={w - 100} y={52} width={40} height={12} rx={6} fill="#FFFFFF" fillOpacity={0.6} />
      <G transform={`translate(${w - 148} 78)`}>
        <Path d="M1 8C4 3.5 7 3.5 10 7M16 6c3-4.5 6-4.5 9-1" fill="none" stroke="#9AA9B8" strokeWidth={1.7} strokeLinecap="round" />
      </G>
      <Path d={swell(-80, 98, w + 160, 220, 120)} fill="#E9EFF3" />
      <Path d={swell(130, 122, w + 20, 220, 100)} fill="#DBE4ED" />
      <Path d={roundRect(w - 76, 138, 12, 26, 6, 6, 0, 0)} fill="#EAF0F5" />
      <Path d={roundRect(w - 90, 146, 10, 20, 5, 5, 0, 0)} fill="#E4ECF3" />
      <Path d={roundRect(w - 58, 148, 10, 18, 5, 5, 0, 0)} fill="#E4ECF3" />
      <Path d={roundRect(w - 102, 152, 8, 14, 4, 4, 0, 0)} fill="#DFE9F1" />
      <Path d={swell(-120, 112, w - 20, 240, 110)} fill="#D3DEE9" />
      <Circle cx={66.5} cy={90.5} r={3.5} fill="#7A8794" />
      <Path d={roundRect(60, 95, 13, 17, 6, 6, 3, 3)} fill="#7A8794" />
      <Path d={`M${w - 108} 148L${w - 108} 164L${w - 98} 164Z`} fill="#5C6B7A" />
      {/* hull: 20 × 5 with 2/5/6/6 corners, which CSS scales by 5/11 */}
      <Path d={roundRect(w - 112, 165, 20, 5, 0.91, 2.27, 2.73, 2.73)} fill="#3A3934" />
      <Path d={swell(-60, 178, w + 120, 160, 70)} fill="#C6D5E3" />
    </Svg>
  );
}
