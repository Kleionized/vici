/**
 * The journey's four chapter scenes — canvas 176 "The Landing", 177 "The
 * Crossing", 178 "The Highlands", 179 "The Watch" — plus the shallow band of
 * land the same frames close on.
 *
 * Each scene is the 393 × 338 picture the chapter screen drops under its title:
 * a warm paper sky, one low sun, the swells or ridges of that stretch, and a
 * single small object that says where you are — a boat pulled ashore, a boat
 * under sail, a flag on a ridge, a lighthouse keeping watch.
 *
 * The canvas builds them from absolutely-positioned divs with elliptical corner
 * radii and CSS blurs. RN has neither, so every form is an SVG path here and
 * every blurred shape is redrawn as a gradient with an equivalent falloff.
 *
 * The scene's viewBox is the live screen width, not the canvas's 393, so the
 * things the canvas anchors with `right:` or a percentage keep that anchor on a
 * wider or narrower phone instead of being scaled off it.
 */

import { useId } from 'react';
import type { ReactNode } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

export type ChapterKey = 'landing' | 'crossing' | 'highlands' | 'watch';

/**
 * Every art root in this folder is positioned, and not by accident.
 *
 * `react-native-svg`'s web build lays an `<Svg>` out `position: static`, and CSS
 * paints every positioned box above every non-positioned one in the same
 * stacking context whatever the document order says. So a scene left static
 * disappears under any absolutely-positioned sibling — the field gradient it is
 * drawn on, most of all — while looking perfectly correct on device, where Yoga
 * has no such rule. Nothing moves: the parents all carry their own size, so the
 * root is being pinned to a box it already filled.
 *
 * This is invisible to a numeric audit. Every element still reports the right
 * rect; it is simply painted underneath something. Screenshot the web build.
 */
export const ART_ROOT = { position: 'absolute', top: 0, left: 0 } as const;

/** The height the canvas draws every chapter scene into. */
export const SCENE_H = 338;
/** The land band that closes each chapter: canvas top 798 of 852. */
export const FOOTER_H = 54;

/**
 * `border-radius: 50% 50% 0 0 / Npx Npx 0 0` on a box. Both top corners take
 * half the width, so they meet in the middle and the whole top edge becomes one
 * elliptical arc — the canvas's swell/ridge shape.
 */
export function swell(x: number, y: number, w: number, h: number, ry: number) {
  return `M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}L${x + w} ${y + h}L${x} ${y + h}Z`;
}

/** A box with four independent corner radii — CSS `border-radius: a b c d`. */
export function roundRect(x: number, y: number, w: number, h: number, tl: number, tr: number, br: number, bl: number) {
  return (
    `M${x + tl} ${y}H${x + w - tr}` +
    (tr ? `A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}` : '') +
    `V${y + h - br}` +
    (br ? `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}` : '') +
    `H${x + bl}` +
    (bl ? `A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` : '') +
    `V${y + tl}` +
    (tl ? `A${tl} ${tl} 0 0 1 ${x + tl} ${y}` : '') +
    'Z'
  );
}

/**
 * `box-shadow: 0 0 0 1px C` lies wholly outside the box and grows each corner
 * radius by the 1px spread. An SVG stroke straddles the path instead — half of
 * it would eat into the fill — so every such ring is drawn here as a second,
 * one-point-larger shape painted behind the shape it rings.
 */
const RING_05 = 'rgba(0,0,0,0.05)';
const RING_04 = 'rgba(0,0,0,0.04)';

/** The sun halo's alpha at its centre, per scene. */
const HALO: Record<ChapterKey, number> = { landing: 0.42, crossing: 0.42, highlands: 0.4, watch: 0.45 };

export function ChapterScene({ scene, width }: { scene: ChapterKey; width: number }) {
  const gid = `${scene}-${useId().replace(/:/g, '')}`;
  const shade = `url(#shade-${gid})`;
  const halo = `url(#halo-${gid})`;
  const w = width;

  // The canvas blurs each halo and drop shadow by 3–4px; RN SVG has no blur
  // filter, so the blur is folded into the gradient's falloff instead.
  let body: ReactNode = null;
  if (scene === 'landing') {
    body = (
      <>
        <Ellipse cx={135} cy={165} rx={65} ry={65} fill={halo} />
        <Circle cx={135} cy={163} r={19} fill="#E9D2A4" />
        <Path d={swell(-40, 242, w + 80, 90, 26)} fill="#C8D7E5" />
        <Path d={swell(-60, 260, w + 80, 80, 22)} fill="#D5E1EA" />
        <Path d={swell(-40, 288, w + 80, 90, 22)} fill="#EDE7D8" />
        <Path d={swell(-70, 308, w + 90, 80, 18)} fill="#F2EDE0" />
        <Ellipse cx={254} cy={331.5} rx={48} ry={5.5} fill={shade} opacity={0.09} />
        {/* hull: 88 × 22 with 6/6/18/18 corners, which CSS scales to 5.5/5.5/16.5/16.5 */}
        <Path d={roundRect(209, 299, 90, 24, 6.5, 6.5, 17.5, 17.5)} fill={RING_05} />
        <Path d={roundRect(210, 300, 88, 22, 5.5, 5.5, 16.5, 16.5)} fill="#E4E3DE" />
        <Rect x={216} y={304} width={76} height={4} rx={2} fill="#D6D5D0" />
        <Rect x={128} y={260} width={4} height={58} rx={2} fill="#B4B1AB" />
        <Rect x={132} y={260} width={20} height={12} rx={2} fill="#E9D2A4" />
        <Ellipse cx={134} cy={324} rx={22} ry={4} fill={shade} opacity={0.08} />
        <Rect x={60} y={270} width={24} height={4} rx={2} fill="rgba(255,255,255,0.55)" />
        <Rect x={320} y={278} width={20} height={4} rx={2} fill="rgba(255,255,255,0.5)" />
      </>
    );
  } else if (scene === 'crossing') {
    body = (
      <>
        <Ellipse cx={282} cy={168} rx={70} ry={70} fill={halo} />
        <Circle cx={282} cy={168} r={20} fill="#E9D2A4" />
        <Rect x={24} y={126} width={52} height={14} rx={7} fill="#F9F8F4" />
        <Rect x={52} y={112} width={34} height={11} rx={5.5} fill="#F9F8F4" opacity={0.85} />
        {/* the two headlands stop at right:55% and right:70% of the live width */}
        <Path d={swell(-60, 188, w * 0.45 + 60, 120, 56)} fill="#DEDDD6" />
        <Path d={swell(-90, 212, w * 0.3 + 90, 120, 44)} fill="#D2D1CA" />
        <Path d={swell(-40, 260, w + 80, 120, 30)} fill="#C8D7E5" />
        <Path d={swell(-60, 282, w + 80, 110, 24)} fill="#D5E1EA" />
        <Ellipse cx={244} cy={304} rx={48} ry={6} fill={`url(#wake-${gid})`} opacity={0.14} />
        {/* sail: 34 × 52 under `border-radius: 0 100% 0 0` — a quarter ellipse */}
        <Path d="M235 223H236A35 53 0 0 1 271 276V277H235Z" fill={RING_04} />
        <Path d="M236 224A34 52 0 0 1 270 276L236 276Z" fill="#F7F6F2" />
        <Rect x={232} y={216} width={4} height={70} rx={2} fill="#B4B1AB" />
        <Rect x={222} y={216} width={10} height={7} rx={2} fill="#E9D2A4" />
        <Path d={roundRect(203, 283, 78, 20, 5, 5, 15, 15)} fill={RING_05} />
        <Path d={roundRect(204, 284, 76, 18, 4, 4, 14, 14)} fill="#E4E3DE" />
        <Rect x={150} y={316} width={26} height={4} rx={2} fill="rgba(255,255,255,0.6)" />
        <Rect x={300} y={328} width={20} height={4} rx={2} fill="rgba(255,255,255,0.5)" />
        <Rect x={96} y={340} width={22} height={4} rx={2} fill="rgba(255,255,255,0.45)" />
      </>
    );
  } else if (scene === 'highlands') {
    body = (
      <>
        {/* the halo and the sun hang off the right edge: right:56 and right:98 */}
        <Ellipse cx={w - 121} cy={161} rx={65} ry={65} fill={halo} />
        <Circle cx={w - 115} cy={151} r={17} fill="#E9D2A4" />
        <Path d={swell(-80, 184, w * 0.66 + 80, 200, 130)} fill="#D8D7D0" />
        <Path d={swell(w * 0.28, 214, w * 0.72 + 80, 170, 100)} fill="#CBCAC3" />
        <Path d={swell(-40, 268, w + 80, 120, 48)} fill="#C0BFB8" />
        <Rect x={116} y={144} width={4} height={46} rx={2} fill="#B4B1AB" />
        <Rect x={120} y={144} width={18} height={11} rx={2} fill="#E9D2A4" />
        <Ellipse cx={122} cy={191.5} rx={18} ry={3.5} fill={shade} opacity={0.1} />
        <Rect x={150} y={310} width={16} height={4} rx={2} fill="rgba(255,255,255,0.5)" transform="rotate(-14 158 312)" />
        <Rect x={176} y={296} width={13} height={4} rx={2} fill="rgba(255,255,255,0.45)" transform="rotate(-14 182.5 298)" />
        <Rect x={200} y={282} width={11} height={4} rx={2} fill="rgba(255,255,255,0.4)" transform="rotate(-14 205.5 284)" />
      </>
    );
  } else {
    body = (
      <>
        <Circle cx={62} cy={132} r={18} fill="#DCDED8" />
        <Circle cx={54} cy={126} r={18} fill="#EFEEE8" />
        <Circle cx={121.25} cy={133.25} r={1.25} fill="rgba(142,153,168,0.7)" />
        <Circle cx={89} cy={169} r={1} fill="rgba(142,153,168,0.55)" />
        <Ellipse cx={254} cy={202} rx={50} ry={50} fill={halo} />
        <Path d={swell(-40, 268, w + 80, 110, 26)} fill="#D8D7D0" />
        <Path d={swell(-40, 292, w + 80, 100, 22)} fill="#C8D7E5" />
        <Path d={swell(-70, 312, w + 90, 90, 18)} fill="#D5E1EA" />
        {/* the lamp's beam: a 110 × 26 horizontal fade, tilted 8° and blurred 2px */}
        <Rect x={258} y={188} width={110} height={26} fill={`url(#beam-${gid})`} transform="rotate(8 313 201)" />
        <Ellipse cx={254} cy={293} rx={38} ry={5} fill={shade} opacity={0.1} />
        <Path d={roundRect(231, 211, 42, 84, 7, 7, 3, 3)} fill={RING_05} />
        <Path d={roundRect(232, 212, 40, 82, 6, 6, 2, 2)} fill="#F7F6F2" />
        <Rect x={232} y={244} width={40} height={10} fill="#E0DFDA" />
        <Rect x={228} y={200} width={48} height={14} rx={3} fill="#55534E" />
        <Rect x={240} y={188} width={24} height={14} rx={3} fill="#E9D2A4" />
        <Path d={roundRect(236, 180, 32, 10, 6, 6, 0, 0)} fill="#55534E" />
      </>
    );
  }

  return (
    <Svg width={w} height={SCENE_H} viewBox={`0 0 ${w} ${SCENE_H}`} style={ART_ROOT}>
      <Defs>
        {/* the band opens and closes on the page's own field colour, so only the
            warm middle reads as a band at all */}
        <LinearGradient id={`band-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F4F3F0" />
          <Stop offset="0.58" stopColor="#F3EEE1" />
          <Stop offset="1" stopColor="#F4F3F0" />
        </LinearGradient>
        <LinearGradient id={`fade-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F4F3F0" stopOpacity={0} />
          <Stop offset="1" stopColor="#F4F3F0" stopOpacity={1} />
        </LinearGradient>
        <RadialGradient id={`halo-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#E2BA78" stopOpacity={HALO[scene]} />
          <Stop offset="0.4" stopColor="#E2BA78" stopOpacity={HALO[scene] * 0.58} />
          <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`shade-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#000000" stopOpacity={0.86} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`wake-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#283C5A" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#283C5A" stopOpacity={0.86} />
          <Stop offset="1" stopColor="#283C5A" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={`beam-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#E9D2A4" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#E9D2A4" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={w} height={SCENE_H} fill={`url(#band-${gid})`} />
      {body}
      <Rect x={0} y={SCENE_H - 44} width={w} height={44} fill={`url(#fade-${gid})`} />
    </Svg>
  );
}

/** The two headlands' fill, per chapter — water off the landing, stone above it. */
const FOOTER_HILLS: Record<ChapterKey, readonly [string, string] | null> = {
  landing: ['#CFD9E2', '#C4D2DE'],
  crossing: ['#DAD9D2', '#D0CFC8'],
  highlands: ['#D8D7D0', '#CFCEC7'],
  watch: null,
};

/**
 * The band the chapter closes on: two headlands rising into a 54pt strip. The
 * canvas anchors them at -30/40% and 35%/-40, so they are measured off the live
 * width rather than the frame's 393. The Watch closes on the laurel instead.
 */
export function ChapterFooter({ scene, width, height }: { scene: ChapterKey; width: number; height: number }) {
  const gid = `${scene}-foot-${useId().replace(/:/g, '')}`;
  const hills = FOOTER_HILLS[scene];
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={ART_ROOT}>
      <Defs>
        <LinearGradient id={`land-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ECEBE6" />
          <Stop offset="1" stopColor="#E7E6E0" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#land-${gid})`} />
      {hills ? (
        <G>
          <Path d={swell(-30, 30, width * 0.6 + 30, 80, 44)} fill={hills[0]} />
          <Path d={swell(width * 0.35, 38, width * 0.65 + 40, 80, 40)} fill={hills[1]} />
        </G>
      ) : null}
    </Svg>
  );
}
