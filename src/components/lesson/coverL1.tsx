import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, FeGaussianBlur, Filter, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useId } from 'react';
import type { ReactNode } from 'react';

/**
 * SVG filters interpolate in linear RGB by default and CSS's `filter: blur()`
 * does not, which skews a blurred colour by a couple of steps per channel (F43).
 * Not in `react-native-svg`'s typings, hence the cast — the same one
 * `TaskScene.tsx` makes.
 */
const SRGB = { colorInterpolationFilters: 'sRGB' } as unknown as Record<string, never>;

/**
 * Lesson 1's cover scene — the one bespoke piece of cover art in the bundle.
 *
 * Every other lesson draws the shared 270 × 190 horizon in `coverScene.ts`;
 * lesson 1 alone draws a 270 × 224 room with a window, a lamp and a bed. The
 * frame is byte-identical between the last bundle and this one, so this is the
 * transcription made for it, lifted out of the reader route unchanged.
 */

export function CoverSceneL1() {
  // Every gradient id is per-instance. `react-native-svg`'s web build puts its
  // defs in the one document, and expo-router keeps a pushed-from screen
  // mounted underneath at `display: none` — so two copies of this scene make
  // two window gradients under one id, and the reference binds to the first —
  // the hidden one, which paints nothing (F20). The scene is mounted in one
  // place today and captures on the pushed path are clean; this is what keeps
  // that true if the cover is ever drawn twice.
  const uid = useId().replace(/:/g, '');
  return (
    <View style={{ width: 270, height: 224 }}>
      <View style={{ position: 'absolute', left: 15, top: 0, width: 240, height: 200, transform: [{ scale: 1.12 }], transformOrigin: 'top center' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, width: 240, height: 200, overflow: 'hidden' }}>
          {/* One root for every gradient and every node that uses one: a def
              declared in a different `<Svg>` resolves to nothing on native.

              Every wash here is a CSS `closest-side` on its own box, so each
              radial is left in the default `objectBoundingBox` at 50 % rather
              than given `rx`/`ry` in user space — those two are the native
              build's props, are not `<radialGradient>` attributes, and on web
              silently become `r = 50 %` of the whole 240 × 200 scene. That is
              what turned the lamp's 32pt halo into a flat cream disc and the
              two ground shadows into hard grey ellipses (D081). */}
          <SceneSvg>
            <Defs>
              <RadialGradient id={`cs-win${uid}`}>
                <Stop offset="0" stopColor="#CBDAE8" stopOpacity={0.24} />
                <Stop offset="0.76" stopColor="#CBDAE8" stopOpacity={0} />
              </RadialGradient>
              {/* The canvas blurs both washes as well as shading them, and D010
                  excused that because there was no RN equivalent. There is one
                  now, and it is not cosmetic: a `closest-side` ramp under
                  `blur(5px)` is measurably flatter through its core than the
                  ramp alone — 795 differing pixels on this frame became 389 when
                  the two washes were given their own Gaussian (D151). */}
              <Filter id={`cs-winb${uid}`} filterUnits="userSpaceOnUse" x={11} y={103} width={110} height={110} {...SRGB}>
                <FeGaussianBlur stdDeviation={5} />
              </Filter>
            </Defs>
            <Path d="M-28 192 A148 26 0 0 1 268 192 L268 230 L-28 230 Z" fill="#EAE9E3" />
            <Circle cx={66} cy={158} r={40} fill={`url(#cs-win${uid})`} filter={`url(#cs-winb${uid})`} />
          </SceneSvg>

          {/* the window, its mullion and its sill */}
          <View style={{ position: 'absolute', left: 44, top: 16, width: 58, height: 72, borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)' }}>
            <Svg width={58} height={72} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
              <Defs>
                <SvgLinearGradient id={`cs-glass2${uid}`} x1="0" y1="0" x2="0" y2="72" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#12151B" />
                  <Stop offset="1" stopColor="#1A2027" />
                </SvgLinearGradient>
              </Defs>
              <Rect x={0} y={0} width={58} height={72} fill={`url(#cs-glass2${uid})`} />
            </Svg>
          </View>
          <View style={{ position: 'absolute', left: 71, top: 16, width: 4, height: 72, backgroundColor: '#E4E3DE' }} />
          <View style={{ position: 'absolute', left: 37, top: 88, width: 72, height: 7, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
          <View style={{ position: 'absolute', left: 82, top: 28, width: 13, height: 13, borderRadius: 6.5, backgroundColor: '#DCDED8', boxShadow: '0 0 10px rgba(220,222,216,0.6)' }} />
          <View style={{ position: 'absolute', left: 54, top: 50, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: 'rgba(244,243,240,0.6)' }} />
          <View style={{ position: 'absolute', left: 62, top: 68, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.4)' }} />

          {/* the side table, the lamp on it, and what each casts */}
          <SceneSvg>
            <Defs>
              {/* `left:53 top:167 50 x 11, rgba(0,0,0,0.08), filter: blur(5px)` —
                  a blurred SOLID, not a blurred gradient. D082 sampled one into
                  a four-stop radial because RN SVG had no blur; 15.15 ships
                  `FeGaussianBlur` on all three platforms, so the layer is the
                  canvas's own Gaussian (D091). The radial model got both ends
                  wrong: an 11pt-tall solid under a 5pt blur never reaches 0.08
                  in its middle, and the falloff carries 2σ past the box where a
                  box-sized radial has already fallen to nothing. The region is
                  stated at 3σ or the filter clips itself square. */}
              <Filter id={`cs-sh1b${uid}`} filterUnits="userSpaceOnUse" x={38} y={152} width={80} height={41} {...SRGB}>
                <FeGaussianBlur stdDeviation={5} />
              </Filter>
            </Defs>
            <Ellipse cx={78} cy={172.5} rx={25} ry={5.5} fill="#000000" fillOpacity={0.08} filter={`url(#cs-sh1b${uid})`} />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 56, top: 136, width: 44, height: 28, borderRadius: 5, backgroundColor: '#E4E3DE' }} />
          <View style={{ position: 'absolute', left: 65, top: 145, width: 26, height: 4, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <View style={{ position: 'absolute', left: 60, top: 164, width: 5, height: 6, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 91, top: 164, width: 5, height: 6, backgroundColor: '#C6C5C0' }} />
          <SceneSvg>
            <Defs>
              <RadialGradient id={`cs-lampb${uid}`}>
                <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.45} />
                <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
              </RadialGradient>
              <Filter id={`cs-lampf${uid}`} filterUnits="userSpaceOnUse" x={47} y={83} width={62} height={62} {...SRGB}>
                <FeGaussianBlur stdDeviation={5} />
              </Filter>
            </Defs>
            <Circle cx={78} cy={114} r={16} fill={`url(#cs-lampb${uid})`} filter={`url(#cs-lampf${uid})`} />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 67, top: 100, width: 22, height: 15, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#E9D2A4' }} />
          <View style={{ position: 'absolute', left: 76.5, top: 115, width: 3, height: 16, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 70, top: 131, width: 16, height: 5, borderRadius: 2.5, backgroundColor: '#C6C5C0' }} />

          {/* the bed */}
          <SceneSvg>
            <Defs>
              {/* `left:115 top:167 118 x 11, rgba(0,0,0,0.09), blur(5px)` — D091, as above. */}
              <Filter id={`cs-sh2b${uid}`} filterUnits="userSpaceOnUse" x={100} y={152} width={148} height={41} {...SRGB}>
                <FeGaussianBlur stdDeviation={5} />
              </Filter>
            </Defs>
            <Ellipse cx={174} cy={172.5} rx={59} ry={5.5} fill="#000000" fillOpacity={0.09} filter={`url(#cs-sh2b${uid})`} />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 114, top: 108, width: 10, height: 62, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#D6D5D0' }} />
          <View style={{ position: 'absolute', left: 122, top: 138, width: 104, height: 24, borderTopLeftRadius: 6, borderTopRightRadius: 10, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#E0DFDA' }} />
          <View style={{ position: 'absolute', left: 156, top: 136, width: 70, height: 26, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 5, borderBottomLeftRadius: 4, backgroundColor: '#C9C8C1' }} />
          <View style={{ position: 'absolute', left: 162, top: 142, width: 56, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)' }} />
          <View
            style={{ position: 'absolute', left: 126, top: 129, width: 28, height: 14, borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#FFFFFF', boxShadow: 'inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)' }}
          />
          <View style={{ position: 'absolute', left: 124, top: 162, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 216, top: 162, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />

          <View style={{ position: 'absolute', left: 212, top: 40, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.4)' }} />
          <View style={{ position: 'absolute', left: 198, top: 68, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.3)' }} />
        </View>
      </View>
    </View>
  );
}

/** A full-bleed SVG layer over the 240 x 200 scene box. */
function SceneSvg({ width = 240, height = 200, children }: { width?: number; height?: number; children: ReactNode }) {
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {children}
    </Svg>
  );
}
