/**
 * Onboarding funnel — the canvas art.
 *
 * Every shape in this file is a literal translation of a design frame: the four
 * lesson interstitials (062 · 068 · 082 · 086), the plan handover (095 · 096),
 * the projection charts the funnel argues with (097–106), the campaign map
 * (107) and the vow's signature field (108). Positions, radii, stroke widths
 * and colours are copied from the frame rather than derived, so drift shows up
 * as a diff instead of a judgement call.
 *
 * RN SVG has no blur filter. Wherever the canvas blurs a shape
 * (`filter: blur(n)`) it is redrawn here as a radial gradient with an
 * equivalent soft falloff; each of those carries its own note.
 */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useId, useRef, type ComponentType, type ReactNode } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, Path, Polygon, RadialGradient, Rect, Stop, Text as SvgText, LinearGradient as SvgGrad } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { fonts, sans } from '@/lib/theme';

const noiseDark = require('../../../assets/images/noise-dark.png');

/* ─────────────────────────────────────────────────────────── shared pieces */

type WashStop = [offset: string, color: string, opacity: number];

/**
 * A CSS `radial-gradient(closest-side, …)` painted into a `border-radius:50%`
 * box: an ellipse inscribed in the box, so the stop percentages carry over
 * unchanged.
 */
function Wash({ stops, style }: { stops: WashStop[]; style: ViewStyle }) {
  const id = `wash${useId().replace(/:/g, '')}`;
  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            {stops.map(([offset, color, opacity]) => (
              <Stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
            ))}
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

function Noise({ opacity, radius = 0 }: { opacity: number; radius?: number }) {
  return (
    <Image
      source={noiseDark}
      contentFit="cover"
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity, borderRadius: radius }}
    />
  );
}

/** The white projection card every chart frame from 097 on sits inside. */
const CARD: ViewStyle = { borderRadius: 20, borderCurve: 'continuous', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.09)' };

/**
 * react-native-svg lays `<Svg>` out STATIC on web, and CSS paints every
 * positioned box above every non-positioned one regardless of document order —
 * so a chart that shares a card with a noise overlay or a glow disappears
 * behind it on web while looking right on device. Every chart below carries
 * this, which puts the drawing back in document order where it belongs.
 */
const CHART: ViewStyle = { position: 'absolute', top: 0, left: 0 };

/* ───────────────────────────────────── 052 · 058 · 072 · 076 — the lessons */

export type OnbLessonKind = 'willpower' | 'rewire' | 'anchor' | 'steps';

/**
 * The four interstitials, in canvas order. `progress` is the filled width of
 * the top bar, `glow` the warm disc bled off the bottom edge, and `shadowTop`
 * / `artTop` place the ground shadow and the drawing inside the 310pt stage.
 */
export const ONB_LESSONS: Record<
  OnbLessonKind,
  {
    step: number;
    progress: number;
    title: string;
    body: string;
    bodyTop: number;
    bodyInset: number;
    cta: string;
    field: { top: string; bottom: string; glow: string; glowSize: number; glowBottom: number; glowMid: number; glowHead: number };
    art: { width: number; height: number; shadowTop: number; artTop: number };
  }
> = {
  willpower: {
    step: 0,
    progress: 0.15,
    title: "It's not a willpower problem.",
    body: 'Urges follow a wave. They rise, crest, and pass. VICI teaches you to ride them out instead of fighting them head-on.',
    bodyTop: 614,
    bodyInset: 26,
    cta: 'Next',
    field: { top: 'rgb(21,21,19)', bottom: 'rgb(35,34,32)', glow: 'rgb(255,236,196)', glowSize: 484, glowBottom: -266, glowHead: 0.28, glowMid: 0.12 },
    art: { width: 230, height: 180, shadowTop: 158, artTop: 36 },
  },
  rewire: {
    step: 1,
    progress: 0.32,
    title: 'Your brain can change.',
    body: 'Every urge you outlast weakens the old loop and strengthens the new one. Neuroplasticity built the habit, and it can unbuild it.',
    bodyTop: 586,
    bodyInset: 30,
    cta: 'Continue',
    field: { top: 'rgb(27,27,25)', bottom: 'rgb(45,44,42)', glow: 'rgb(255,236,196)', glowSize: 558, glowBottom: -307, glowHead: 0.38, glowMid: 0.17 },
    art: { width: 200, height: 180, shadowTop: 177, artTop: 34 },
  },
  anchor: {
    step: 2,
    progress: 0.76,
    title: "You won't do it on willpower alone.",
    body: 'Structure beats resolve. Your cues, lessons, and check-ins carry you when motivation dips.',
    bodyTop: 586,
    bodyInset: 30,
    cta: 'Continue',
    field: { top: 'rgb(30,30,28)', bottom: 'rgb(50,49,47)', glow: 'rgb(255,236,196)', glowSize: 590, glowBottom: -320, glowHead: 0.44, glowMid: 0.2 },
    art: { width: 190, height: 185, shadowTop: 150, artTop: 32 },
  },
  steps: {
    step: 3,
    progress: 0.85,
    title: "Progress isn't a straight line.",
    body: 'Real change moves like a tide. In, out, in again. The waterline shifts over weeks, not hours.',
    bodyTop: 586,
    bodyInset: 30,
    cta: 'Next',
    field: { top: 'rgb(32,32,30)', bottom: 'rgb(52,51,49)', glow: 'rgb(255,255,255)', glowSize: 613, glowBottom: -337, glowHead: 0.48, glowMid: 0.22 },
    art: { width: 200, height: 180, shadowTop: 180, artTop: 40 },
  },
};

/** The night field the four lesson frames share, warmer with each step. */
export function OnbLessonField({ kind }: { kind: OnbLessonKind }) {
  const f = ONB_LESSONS[kind].field;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <LinearGradient colors={[f.top, f.bottom]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* canvas blurs this 6px — a closest-side radial is already that soft */}
      <Wash
        stops={[
          ['0%', 'rgb(180,170,150)', 0.14],
          ['72%', 'rgb(19,19,19)', 0],
        ]}
        style={{ left: -40, top: -140, width: 540, height: 270 }}
      />
      <Wash
        stops={[
          ['0%', f.glow, f.glowHead],
          ['45%', f.glow, f.glowMid],
          ['72%', f.glow, 0],
        ]}
        style={{ left: '50%', marginLeft: -f.glowSize / 2, bottom: f.glowBottom, width: f.glowSize, height: f.glowSize }}
      />
      <Noise opacity={0.12} />
    </View>
  );
}

/** 052 — two thick cables, snapped, with the tension marks either side. */
function WillpowerDrawing() {
  const id = `obW${useId().replace(/:/g, '')}`;
  return (
    <Svg width={230} height={180} viewBox="0 0 230 180">
      <Defs>
        <SvgGrad id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#F7F6F2" />
          <Stop offset="1" stopColor="#C9C6BD" />
        </SvgGrad>
      </Defs>
      <Path d="M14 96 C40 88 62 86 92 90" stroke={`url(#${id})`} strokeWidth={15} fill="none" strokeLinecap="round" />
      <Path d="M138 92 C168 96 194 104 216 114" stroke={`url(#${id})`} strokeWidth={15} fill="none" strokeLinecap="round" />
      <Path d="M92 88 C104 84 112 86 120 90" stroke="rgba(244,243,240,0.55)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <Path d="M94 94 C106 94 116 92 134 92" stroke="rgba(244,243,240,0.4)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <Path d="M96 100 C106 104 118 100 136 97" stroke="rgba(244,243,240,0.28)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <Circle cx={115} cy={76} r={4} fill="#E9D2A4" />
      <Path d="M26 106 l-4 8 M42 104 l-3 7" stroke="rgba(244,243,240,0.25)" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M196 118 l4 8 M182 114 l3 7" stroke="rgba(244,243,240,0.25)" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/** 058 — the loop reopened: an almost-closed arc with the head turned out. */
function RewireDrawing() {
  const id = `obR${useId().replace(/:/g, '')}`;
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180">
      <Defs>
        <SvgGrad id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F7F6F2" />
          <Stop offset="1" stopColor="#C9C6BD" />
        </SvgGrad>
      </Defs>
      <Path d="M148 96 a52 52 0 1 1-16-37" stroke={`url(#${id})`} strokeWidth={13} fill="none" strokeLinecap="round" />
      <Path d="M120 42 l24 16 -28 10 Z" fill="#F4F3F0" />
      <Circle cx={96} cy={96} r={7} fill="#E9D2A4" />
    </Svg>
  );
}

/** 072 — the anchor. Structure, drawn as the one thing that holds. */
function AnchorDrawing() {
  const id = `obA${useId().replace(/:/g, '')}`;
  return (
    <Svg width={190} height={185} viewBox="0 0 190 185">
      <Defs>
        <SvgGrad id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F7F6F2" />
          <Stop offset="1" stopColor="#C4C1B8" />
        </SvgGrad>
      </Defs>
      <Circle cx={95} cy={30} r={12} fill="none" stroke={`url(#${id})`} strokeWidth={9} />
      <Rect x={90.5} y={42} width={9} height={82} rx={4.5} fill={`url(#${id})`} />
      <Rect x={66} y={58} width={58} height={8} rx={4} fill={`url(#${id})`} />
      <Path
        d="M95 124 C70 124 50 108 46 88 l-12 10 6-30 26 12 -12 6 c6 14 22 24 41 24 19 0 35-10 41-24 l-12-6 26-12 6 30 -12-10 c-4 20-24 36-49 36 Z"
        fill={`url(#${id})`}
      />
    </Svg>
  );
}

/** 076 — three stacked steps narrowing upward toward the light. */
function StepsDrawing() {
  const id = `obS1${useId().replace(/:/g, '')}`;
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180">
      <Defs>
        <SvgGrad id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F7F6F2" />
          <Stop offset="1" stopColor="#C9C6BD" />
        </SvgGrad>
      </Defs>
      <Rect x={42} y={118} width={116} height={28} rx={14} fill={`url(#${id})`} />
      <Rect x={56} y={90} width={84} height={25} rx={12.5} fill={`url(#${id})`} opacity={0.88} />
      <Rect x={70} y={64} width={54} height={22} rx={11} fill={`url(#${id})`} opacity={0.75} />
      <Circle cx={97} cy={44} r={7} fill="#E9D2A4" />
    </Svg>
  );
}

const LESSON_DRAWING: Record<OnbLessonKind, ComponentType> = {
  willpower: WillpowerDrawing,
  rewire: RewireDrawing,
  anchor: AnchorDrawing,
  steps: StepsDrawing,
};

/** The 310pt illustration stage: halo, ground shadow, drawing. */
export function OnbLessonArt({ kind }: { kind: OnbLessonKind }) {
  const a = ONB_LESSONS[kind].art;
  const Drawing = LESSON_DRAWING[kind];
  return (
    <View style={{ width: '100%', height: 310 }}>
      {/* the canvas blurs this halo 7px */}
      <Wash
        stops={[
          ['0%', 'rgb(255,236,196)', 0.3],
          ['74%', 'rgb(255,236,196)', 0],
        ]}
        style={{ left: '50%', marginLeft: -110, top: 60, width: 220, height: 200 }}
      />
      {/* rgba(0,0,0,0.4) blurred 10px in the canvas — drawn as a soft falloff */}
      <Wash
        stops={[
          ['0%', 'rgb(0,0,0)', 0.4],
          ['62%', 'rgb(0,0,0)', 0.18],
          ['100%', 'rgb(0,0,0)', 0],
        ]}
        style={{ left: '50%', marginLeft: -90, top: a.shadowTop, width: 180, height: 18 }}
      />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -a.width / 2, top: a.artTop }}>
        <Drawing />
      </View>
    </View>
  );
}

/** The four-dot pager under the lesson copy (canvas top 712). */
export function OnbPagerDots({ i, n = 4 }: { i: number; n?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
      {Array.from({ length: n }, (_, k) => (
        <View key={k} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: k === i ? '#F4F3F0' : 'rgba(255,255,255,0.25)' }} />
      ))}
    </View>
  );
}

/* ─────────────────────────────────────────────── 085 — Enlisting the Aegis */

/**
 * The night-to-daylight wash the charting screen runs on, with the white
 * sunrise disc rising through the bottom of the frame.
 *
 * `discTop` is the canvas value with no status-bar deduction: the field fills
 * the whole screen as a sibling of the SafeAreaView, so its offsets are
 * measured from the frame's top edge rather than from under the inset.
 */
export function AegisField({ discTop = 563 }: { discTop?: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: '#F4F3F0' }]}>
      <LinearGradient
        colors={['#131313', '#2A2924', '#6E7069', '#C9C8C4', '#FFFFFF']}
        locations={[0, 0.26, 0.52, 0.74, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Noise opacity={0.12} />
      <View
        style={{
          position: 'absolute',
          left: -3,
          top: discTop,
          width: 399,
          height: 399,
          borderRadius: 199.5,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 -20px 70px rgba(255,255,255,0.6)',
          overflow: 'hidden',
        }}>
        <Noise opacity={0.08} />
      </View>
    </View>
  );
}

/** The tick beside a finished charting step. */
export function AegisCheck() {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15">
      <Path d="M2.5 8l3.2 3.2L12.5 4" fill="none" stroke="#F4F3F0" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * The ring beside the step still running. The canvas draws a still frame — a
 * three-quarter ring with the top quadrant knocked out — so it turns here,
 * which is the only way a loading ring reads as one in a live app.
 */
export function AegisSpinner() {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [t]);
  return (
    <Animated.View
      style={{
        width: 13,
        height: 13,
        borderRadius: 6.5,
        borderWidth: 2,
        borderColor: 'rgba(244,243,240,0.55)',
        borderTopColor: 'transparent',
        transform: [{ rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
      }}
    />
  );
}

/* ───────────────────────────────────────────────────── 086 — the plan card */

/** The paper field 086 sits on: a dust wash above, a warm one bled below. */
export function PlanReadyField() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: '#F4F3F0' }]}>
      <Noise opacity={0.07} />
      {/* blurred 5px in the canvas */}
      <Wash
        stops={[
          ['0%', 'rgb(180,170,150)', 0.32],
          ['55%', 'rgb(180,170,150)', 0.1],
          ['75%', 'rgb(180,170,150)', 0],
        ]}
        style={{ left: '-15%', top: -190, width: '130%', height: 300 }}
      />
      <Wash
        stops={[
          ['0%', 'rgb(255,236,196)', 0.4],
          ['45%', 'rgb(255,236,196)', 0.18],
          ['72%', 'rgb(255,236,196)', 0],
        ]}
        style={{ left: '50%', marginLeft: -260, bottom: -260, width: 520, height: 520 }}
      />
    </View>
  );
}

/**
 * The plan itself, drawn: a tilted paper card with the route dotted across it,
 * a flag at the summit and the morning sun in the corner. 260 × 280 overall.
 */
export function PlanReadyArt() {
  return (
    <View style={{ width: 260, height: 280 }}>
      {/* the canvas blurs this halo 5px */}
      <Wash
        stops={[
          ['0%', 'rgb(226,186,120)', 0.46],
          ['74%', 'rgb(226,186,120)', 0],
        ]}
        style={{ left: 44, top: 16, width: 172, height: 172 }}
      />
      {/* rgba(0,0,0,0.10) blurred 6px */}
      <Wash
        stops={[
          ['0%', 'rgb(0,0,0)', 0.1],
          ['100%', 'rgb(0,0,0)', 0],
        ]}
        style={{ left: 52, top: 248, width: 156, height: 15 }}
      />
      <View
        style={{
          position: 'absolute',
          left: 56,
          top: 52,
          width: 148,
          height: 152,
          borderRadius: 9,
          borderCurve: 'continuous',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 18px 36px rgba(40,38,32,0.16)',
          transform: [{ rotate: '-2deg' }],
          overflow: 'hidden',
        }}>
        <Noise opacity={0.05} />
        <View style={{ position: 'absolute', left: 14, top: 13, width: 52, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
        {/* viewBox lifted 4 units so the flagpole's -2 does not clip; the top
            is pulled back by the same 4 so the drawing lands where it does on
            the canvas */}
        <Svg width={120} height={104} viewBox="0 -4 120 104" style={{ position: 'absolute', left: 14, top: 26 }}>
          <Path d="M8 88 C30 74 22 52 44 44 C68 35 78 26 104 12" stroke="#131313" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeDasharray="1 8" />
          <Circle cx={8} cy={88} r={5} fill="#131313" />
          <Circle cx={44} cy={44} r={4} fill="#FFFFFF" stroke="#131313" strokeWidth={2} />
          {/* the canvas leaves this one's fill unset, so it paints black */}
          <Path d="M104 12 L104 0 L96 0" fill="#000000" />
          <Rect x={102} y={-2} width={3} height={18} rx={1.5} fill="#131313" />
          <Path d="M105 0 L118 4.5 L105 9 Z" fill="#131313" />
        </Svg>
        <SunDisc size={26} style={{ position: 'absolute', right: 12, bottom: 12 }} cx="38%" cy="30%" r="93.5%" stops={SUN_86} />
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────── the sun discs */

type SunStop = [offset: string, color: string];

/** 086 · `radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 70%)`. */
const SUN_86: SunStop[] = [
  ['0%', '#F0DBB4'],
  ['70%', '#E2BA78'],
];
/** 087 · `radial-gradient(circle at 50% 30%, #FBF2E2, #F0DBB4 65%, #DFC08B)`. */
const SUN_87: SunStop[] = [
  ['0%', '#FBF2E2'],
  ['65%', '#F0DBB4'],
  ['100%', '#DFC08B'],
];
/** 097 · `radial-gradient(circle at 50% 38%, #F8E9CB, #EFD3A2 70%, #E3BE85)`. */
const SUN_97: SunStop[] = [
  ['0%', '#F8E9CB'],
  ['70%', '#EFD3A2'],
  ['100%', '#E3BE85'],
];

/**
 * An off-centre `radial-gradient(circle at x y, …)`. CSS defaults such a
 * gradient to `farthest-corner`, so `r` is that corner distance as a percentage
 * of the box — 93.5% at 38%/30% in a square, 86% at 50%/30%, 79.6% at 50%/38%.
 */
function SunDisc({
  size,
  cx,
  cy,
  r,
  stops,
  style,
  children,
}: {
  size: number;
  cx: string;
  cy: string;
  r: string;
  stops: SunStop[];
  style?: ViewStyle;
  children?: ReactNode;
}) {
  const id = `sun${useId().replace(/:/g, '')}`;
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx={cx} cy={cy} rx={r} ry={r}>
            {stops.map(([offset, color]) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

/* ───────────────────────────────────────────────────────── 087 — the loop */

/** The paper field 087–095 share. */
export function OnbPaperField() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <LinearGradient colors={['#FAF9F8', '#FDFDFC']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* blurred 6px in the canvas */}
      <Wash
        stops={[
          ['0%', 'rgb(180,170,150)', 0.14],
          ['72%', 'rgb(19,19,19)', 0],
        ]}
        style={{ left: -40, top: -140, width: 540, height: 270 }}
      />
      <Wash
        stops={[
          ['0%', 'rgb(255,236,196)', 0.42],
          ['45%', 'rgb(255,236,196)', 0.19],
          ['72%', 'rgb(255,236,196)', 0],
        ]}
        style={{ left: '50%', marginLeft: -280, bottom: -300, width: 560, height: 560 }}
      />
      <Noise opacity={0.12} />
    </View>
  );
}

/** The four stations of the loop, clockwise from the top. */
export const ROOT_LOOP_STATIONS: [string, string, string, string] = ['the loneliness rises', 'the escape', 'minutes of relief', 'back — deeper'];

/**
 * One label on the loop. The canvas sets `paint-order:stroke` with a 7px white
 * stroke, which paints as a halo behind the glyphs; drawn here as the same text
 * twice, stroked first and filled on top.
 */
function LoopLabel({ x, y, weight, size, fill, children }: { x: number; y: number; weight: '400' | '600'; size: number; fill: string; children: string }) {
  const common = { x, y, textAnchor: 'middle' as const, fontFamily: fonts.sans, fontWeight: weight, fontSize: size };
  return (
    <>
      <SvgText {...common} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={7} strokeLinejoin="round">
        {children}
      </SvgText>
      <SvgText {...common} fill={fill}>
        {children}
      </SvgText>
    </>
  );
}

/**
 * 087 — the loop the answers describe, as an ellipse with the sun burning at
 * its centre and the four stations named around the rim.
 */
export function RootLoopCard({ stations = ROOT_LOOP_STATIONS }: { stations?: [string, string, string, string] }) {
  return (
    <View style={[CARD, { paddingTop: 18, paddingHorizontal: 12, paddingBottom: 12, overflow: 'hidden' }]}>
      <Noise opacity={0.05} radius={20} />
      {/* the canvas blurs this 3px */}
      <Wash
        stops={[
          ['0%', 'rgb(226,186,120)', 0.5],
          ['74%', 'rgb(226,186,120)', 0],
        ]}
        style={{ left: '50%', top: '50%', marginLeft: -32, marginTop: -32, width: 64, height: 64 }}
      />
      <SunDisc
        size={34}
        cx="50%"
        cy="30%"
        r="86%"
        stops={SUN_87}
        style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -17, marginTop: -14, borderRadius: 17, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Noise opacity={0.4} />
      </SunDisc>
      <View style={{ width: '100%', aspectRatio: 300 / 172 }}>
        <Svg width="100%" height="100%" viewBox="0 0 300 172" style={CHART}>
          <Ellipse cx={150} cy={86} rx={104} ry={55} stroke="#8B8882" strokeWidth={1.7} fill="none" />
          <Path d="M249 80 h11 l-5.5 10 z" fill="#8B8882" />
          <Path d="M40 92 h11 l-5.5 -10 z" fill="#8B8882" />
          <LoopLabel x={150} y={36} weight="600" size={11.5} fill="#1D1C1A">
            {stations[0]}
          </LoopLabel>
          <LoopLabel x={254} y={90} weight="400" size={11} fill="#55534E">
            {stations[1]}
          </LoopLabel>
          <LoopLabel x={150} y={143} weight="400" size={11} fill="#55534E">
            {stations[2]}
          </LoopLabel>
          <LoopLabel x={46} y={90} weight="400" size={11} fill="#55534E">
            {stations[3]}
          </LoopLabel>
        </Svg>
      </View>
    </View>
  );
}

/* ────────────────────────────────────── 088–092 — the projection day grids */

/** 088 · the nine dark days of the last thirty, in canvas order. */
export const LAST_30 = '011000100001110000100001000100';
/** 089 · the nine projected days of the next thirty. */
export const NEXT_30 = '001001000100100010010001001001';
/** 090 · 092 · the 110 dark days of the projected year, 26 to a row. */
export const NEXT_365 =
  '01100011010000000100100010100000000111111000010000000110000000000000000000000000110001011100000000111000111100000000001111111000011010000000000000000001001100000000101001110000011000001110001000001011101100000000111000000000001000000011100000000000110000001111110000011000001111111100000000000111100011111111101110000000000000001111011100000010000000000000000000000';

const CELL_DARK = '#131313';
const CELL_LIGHT = '#F1F0EB';

function rows(days: string, cols: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < days.length; i += cols) out.push(days.slice(i, i + cols));
  return out;
}

/** 088 · 089 — thirty day-cells, seven to a row. */
export function MonthGrid({ days = LAST_30 }: { days?: string }) {
  return (
    <View style={{ width: '100%', gap: 6 }}>
      {rows(days, 7).map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 6 }}>
          {row.split('').map((mark, c) => (
            <View
              key={c}
              style={{
                flex: 1,
                height: 27,
                borderRadius: 7,
                backgroundColor: mark === '1' ? CELL_DARK : CELL_LIGHT,
                ...(mark === '1' ? null : { boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }),
              }}
            />
          ))}
          {row.length < 7 ? Array.from({ length: 7 - row.length }, (_, k) => <View key={`pad${k}`} style={{ flex: 1, height: 27 }} />) : null}
        </View>
      ))}
    </View>
  );
}

/** 092 · the cells that clear, as [index, delay in seconds]. */
export const REVERSAL_CLEARED: [number, number][] = [
  [2, 4.62], [36, 2.39], [81, 3.17], [88, 3.95], [98, 1.31], [99, 1.85], [104, 3.97], [105, 1.4], [106, 2.43], [107, 4.15],
  [118, 4.35], [119, 3.73], [120, 4.0], [154, 3.38], [169, 1.46], [190, 2.62], [196, 1.33], [213, 4.15], [226, 1.79], [234, 1.27],
  [235, 3.74], [236, 1.79], [249, 1.83], [256, 1.72], [259, 2.57], [261, 3.45], [274, 1.22], [275, 1.33], [276, 3.07], [277, 3.89],
  [279, 1.54], [280, 2.71], [293, 3.51], [295, 4.36], [296, 3.72], [300, 4.7], [301, 3.87], [302, 3.29], [305, 1.44], [306, 2.28],
  [307, 1.9], [310, 2.14], [311, 2.73], [312, 2.87], [328, 1.58], [333, 4.3], [342, 2.62],
];
/** 092 · each cleared cell fades over 0.9s, and the caption at 5s. */
export const REVERSAL_CLEAR_MS = 900;
export const REVERSAL_CAPTION_DELAY_MS = 5000;
const REVERSAL_SPAN_MS = 5600;
const REVERSAL_AT = new Map(REVERSAL_CLEARED);

/**
 * 090 · 092 — the projected year, 26 cells to a row. Pass `clearing` and the
 * dark cells listed in REVERSAL_CLEARED fade back to paper on the canvas's own
 * schedule; that is 092's whole argument, so it is timed rather than instant.
 */
export function YearGrid({ days = NEXT_365, clearing = false }: { days?: string; clearing?: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!clearing) return;
    Animated.timing(t, { toValue: REVERSAL_SPAN_MS, duration: REVERSAL_SPAN_MS, easing: Easing.linear, useNativeDriver: false }).start();
  }, [clearing, t]);
  return (
    <View style={{ width: '100%', gap: 2.5 }}>
      {rows(days, 26).map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 2.5 }}>
          {row.split('').map((mark, c) => {
            const i = r * 26 + c;
            const delay = clearing && mark === '1' ? REVERSAL_AT.get(i) : undefined;
            const fill =
              delay == null
                ? mark === '1'
                  ? CELL_DARK
                  : CELL_LIGHT
                : t.interpolate({
                    inputRange: [delay * 1000, delay * 1000 + REVERSAL_CLEAR_MS],
                    outputRange: [CELL_DARK, CELL_LIGHT],
                    extrapolate: 'clamp',
                  });
            return <Animated.View key={c} style={{ flex: 1, aspectRatio: 1, borderRadius: 2.5, backgroundColor: fill }} />;
          })}
          {row.length < 26 ? Array.from({ length: 26 - row.length }, (_, k) => <View key={`pad${k}`} style={{ flex: 1, aspectRatio: 1 }} />) : null}
        </View>
      ))}
    </View>
  );
}

/**
 * 101 — the decades, as one hairline per year from where he is now down to 80.
 * The frame draws 56 of them, which is the 24 it labels. No numbers on the
 * bars: the point is the height of the stack, not any one year.
 */
export function ByAge80Card({ from = 24 }: { from?: number }) {
  const years = Math.max(1, 80 - from);
  return (
    <View style={[CARD, { height: 268 }]}>
      <AppText style={[sans('600'), { position: 'absolute', left: 18, top: 13, fontSize: 10.5, color: '#8B8882' }]}>{from}</AppText>
      <AppText style={[sans('600'), { position: 'absolute', left: 18, bottom: 34, fontSize: 10.5, color: '#8B8882' }]}>80</AppText>
      <View style={{ position: 'absolute', left: 44, right: 18, top: 16, bottom: 38, justifyContent: 'space-between' }}>
        {Array.from({ length: years }, (_, k) => (
          <View key={k} style={{ height: 2.2, borderRadius: 1, backgroundColor: '#131313', opacity: 0.78 }} />
        ))}
      </View>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, bottom: 11, fontSize: 11.5, color: '#B0AEA8' }]}>
        Based on your current pace — not a fixed outcome
      </AppText>
    </View>
  );
}

/* ──────────────────────────────────────────── 103 · 104 — streaks vs campaign */

/**
 * The sawtooth's three climbs: where each starts, its peak, the label and the
 * label's own baseline — the frame sets the first 14 above its peak and the
 * other two 12, so the offset is stated rather than derived.
 */
const SAWTOOTH: { x0: number; x: number; y: number; ty: number; label: string; fill: string }[] = [
  { x0: 22, x: 116, y: 44, ty: 30, label: '14 days', fill: '#1D1C1A' },
  { x0: 130, x: 198, y: 74, ty: 62, label: '9 days', fill: '#55534E' },
  { x0: 212, x: 262, y: 98, ty: 86, label: '5 days', fill: '#8B8882' },
];

/**
 * 103 — three climbs, each shorter than the last, each ending on a cross at
 * the baseline. No axes and no fills: the whole argument is the three peaks
 * stepping down and the three x-marks under them.
 */
export function StreakSawtoothCard() {
  return (
    <View style={[CARD, { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 16, overflow: 'hidden' }]}>
      <Noise opacity={0.05} radius={20} />
      <View style={{ width: '100%', aspectRatio: 320 / 190 }}>
        <Svg width="100%" height="100%" viewBox="0 0 320 190" style={CHART}>
          <Line x1={16} y1={152} x2={304} y2={152} stroke="rgba(19,19,19,0.16)" strokeWidth={1.5} />
          {SAWTOOTH.map((s) => (
            <Path key={`c${s.x}`} d={`M${s.x0},152 L${s.x},${s.y}`} fill="none" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
          ))}
          {SAWTOOTH.map((s) => (
            <Line key={`d${s.x}`} x1={s.x} y1={s.y} x2={s.x} y2={146} stroke="rgba(19,19,19,0.25)" strokeWidth={2} strokeDasharray="3 6" />
          ))}
          {SAWTOOTH.map((s) => (
            <Circle key={`p${s.x}`} cx={s.x} cy={s.y} r={4} fill="#131313" />
          ))}
          {SAWTOOTH.map((s) => (
            <SvgText key={`t${s.x}`} x={s.x} y={s.ty} fontSize={13} fontFamily={fonts.sans} fontWeight="600" fill={s.fill} textAnchor="middle">
              {s.label}
            </SvgText>
          ))}
          {SAWTOOTH.map((s) => (
            <Path key={`x${s.x}`} d={`M${s.x - 6} 152 l12 12 M${s.x + 6} 152 l-12 12`} stroke="#B0AEA8" strokeWidth={2.6} strokeLinecap="round" />
          ))}
        </Svg>
      </View>
    </View>
  );
}

/**
 * 104 — the same six weeks as one line that bends where the slips are and
 * keeps climbing off the top-right corner. The counterweight to 103.
 */
export function CampaignLineCard() {
  return (
    <View style={[CARD, { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 16, overflow: 'hidden' }]}>
      <Noise opacity={0.05} radius={20} />
      <View style={{ width: '100%', aspectRatio: 320 / 190 }}>
        <Svg width="100%" height="100%" viewBox="0 0 320 190" style={CHART}>
          <Line x1={16} y1={152} x2={304} y2={152} stroke="rgba(19,19,19,0.16)" strokeWidth={1.5} />
          <Circle cx={24} cy={148} r={4.5} fill="#131313" />
          <Path d="M24,148 C100,136 180,92 288,34" fill="none" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
          <Path d="M288,34 l-10.5,-1 M288,34 l-4,9.5" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
          <Path d="M118,116 l8 8 M212,74 l8 8" stroke="#E2BA78" strokeWidth={3.6} strokeLinecap="round" />
          <SvgText x={122} y={140} fontSize={11} fontFamily={fonts.sans} fontWeight="500" fill="#C99F5F">
            slip
          </SvgText>
          <SvgText x={216} y={98} fontSize={11} fontFamily={fonts.sans} fontWeight="500" fill="#C99F5F">
            slip
          </SvgText>
          <SvgText x={24} y={170} fontSize={10.5} fontFamily={fonts.sans} fontWeight="500" fill="#8B8882">
            day 0
          </SvgText>
          <SvgText x={304} y={170} fontSize={10.5} fontFamily={fonts.sans} fontWeight="500" fill="#8B8882" textAnchor="end">
            today · day 41
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────────────── 105 — the rewire curve */

/** Twelve weekly bars: x, y, height, and the ink's opacity, off the frame. */
const REWIRE_BARS: [x: number, y: number, h: number, o: number][] = [
  [18.0, 38, 100, 1.0], [40.4, 48, 90, 0.94], [62.8, 58, 80, 0.88], [85.2, 67, 71, 0.81],
  [107.6, 76, 62, 0.75], [130.0, 84, 54, 0.69], [152.4, 92, 46, 0.63], [174.8, 99, 39, 0.57],
  [197.2, 106, 32, 0.5], [219.6, 112, 26, 0.44], [242.0, 117, 21, 0.38], [264.4, 122, 16, 0.32],
];

/**
 * 105 — how hard urges pull, week by week, as twelve bars stepping down and
 * fading out. No projection line and no "left alone" comparison any more.
 */
export function RewireCurveCard() {
  return (
    <View style={[CARD, { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 10, overflow: 'hidden' }]}>
      <Noise opacity={0.05} radius={20} />
      <View style={{ width: '100%', aspectRatio: 300 / 170 }}>
        <Svg width="100%" height="100%" viewBox="0 0 300 170" style={CHART}>
          <SvgText x={18} y={18} fontSize={11} fontFamily={fonts.sans} fontWeight="500" fill="#B0AEA8">
            how hard urges pull
          </SvgText>
          {REWIRE_BARS.map(([x, y, h, o]) => (
            <Rect key={x} x={x} y={y} width={14} height={h} rx={4} fill="#131313" fillOpacity={o} />
          ))}
          <Line x1={14} y1={138} x2={286} y2={138} stroke="rgba(19,19,19,0.16)" strokeWidth={1.5} />
          <SvgText x={18} y={158} fontSize={10.5} fontFamily={fonts.sans} fontWeight="500" fill="#8B8882">
            week I
          </SvgText>
          <SvgText x={282} y={158} fontSize={10.5} fontFamily={fonts.sans} fontWeight="500" fill="#8B8882" textAnchor="end">
            week XII
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

/* ──────────────────────────────────────────────── 095 — the pattern, mapped */

const NIGHT_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
/** Mo–Su. The two tallest bars are the window the plan guards first. */
export const NIGHT_BARS = [42, 58, 50, 72, 96, 120, 84];

/** 095 — urges by night, with the risky pair inked and the rest in paper grey. */
export function UrgesByNightCard({ bars = NIGHT_BARS, peaks = [4, 5] }: { bars?: number[]; peaks?: number[] }) {
  return (
    <View style={[CARD, { height: 250, borderRadius: 16 }]}>
      <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 18, fontSize: 12.5, color: '#8B8882' }]}>Urges by night</AppText>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 44, height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
        {bars.map((height, i) => (
          <View
            key={NIGHT_DAYS[i]}
            style={{
              flex: 1,
              height,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: peaks.includes(i) ? '#131313' : '#DCDBD6',
            }}
          />
        ))}
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 16, flexDirection: 'row', gap: 14 }}>
        {NIGHT_DAYS.map((day) => (
          <AppText key={day} center style={[sans('500'), { flex: 1, fontSize: 11.5, color: '#8B8882' }]}>
            {day}
          </AppText>
        ))}
      </View>
    </View>
  );
}

/** The crescent in the trigger card's chip. */
export function MoonGlyph({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14.5 2.5a9.5 9.5 0 1 0 7 14 9 9 0 0 1-7-14z" fill="#131313" />
    </Svg>
  );
}

/** 095 — the one-line summary under the chart: the trigger that runs hottest. */
export function MostActiveTriggerCard({ trigger }: { trigger: string }) {
  return (
    <View style={[CARD, { height: 76, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 16 }]}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MoonGlyph />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>Most active trigger</AppText>
        <AppText numberOfLines={1} style={[sans('600'), { marginTop: 4, fontSize: 17.5, color: '#1D1C1A' }]}>
          {trigger}
        </AppText>
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────── 108 — the vow */

/** The sun held over the signature panel: a 200pt halo and a 56pt disc. */
export function VowSunArt() {
  return (
    <View style={{ width: 200, height: 200 }}>
      {/* the canvas blurs this halo 3px */}
      <Wash
        stops={[
          ['0%', 'rgb(226,186,120)', 0.38],
          ['72%', 'rgb(226,186,120)', 0],
        ]}
        style={{ left: 0, top: 0, width: 200, height: 200 }}
      />
      <SunDisc
        size={56}
        cx="50%"
        cy="38%"
        r="79.6%"
        stops={SUN_97}
        style={{ position: 'absolute', left: 72, top: 26, borderRadius: 28, boxShadow: '0 6px 18px rgba(226,186,120,0.45)' }}
      />
    </View>
  );
}

/**
 * 108 — the panel the vow is signed on. It is drawn as a real signature field:
 * the SIGNATURE caption, a Clear affordance, the ruled line with its cross,
 * and the printed name and date under it. Pressing the field lays the ink
 * stroke the frame draws down on the rule.
 */
export function VowSignaturePanel({ name, date, signed, onSign, onClear }: { name?: string; date?: string; signed?: boolean; onSign?: () => void; onClear?: () => void }) {
  return (
    <View style={{ height: 170, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FAF9F6', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.10)' }}>
      <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 13, fontSize: 10.5, letterSpacing: 1.6, color: '#C6C3BC' }]}>SIGNATURE</AppText>
      <Pressable
        onPress={signed ? onClear : undefined}
        disabled={!signed}
        accessibilityRole="button"
        accessibilityLabel="Clear signature"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={{ position: 'absolute', right: 16, top: 11 }}>
        <AppText style={[sans('500'), { fontSize: 12.5, color: '#B0AEA8' }]}>Clear</AppText>
      </Pressable>
      {signed ? (
        <Svg width={216} height={64} viewBox="0 0 216 64" style={{ position: 'absolute', left: 44, bottom: 36 }}>
          <Path
            d="M6 46 C 20 8, 44 6, 40 30 C 36 52, 12 56, 34 44 C 58 30, 78 22, 96 36 C 108 46, 122 30, 138 34"
            fill="none"
            stroke="#26261F"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={138} cy={34} r={2.6} fill="#26261F" />
        </Svg>
      ) : null}
      <AppText style={{ position: 'absolute', left: 24, bottom: 38, fontSize: 14, color: '#B0AEA8' }}>×</AppText>
      <View style={{ position: 'absolute', left: 22, right: 22, bottom: 34, height: 1.5, backgroundColor: 'rgba(0,0,0,0.26)' }} />
      <AppText style={[sans('500'), { position: 'absolute', left: 24, bottom: 13, fontSize: 11.5, color: '#B0AEA8' }]}>{name || 'You'}</AppText>
      <AppText style={[sans('500'), { position: 'absolute', right: 22, bottom: 13, fontSize: 11.5, color: '#B0AEA8' }]}>{date}</AppText>
      {/* The field itself, laid over the rule so a tap anywhere on it signs.
          It starts below the caption row so it never swallows Clear, and it is
          declared last so nothing above it intercepts the tap. */}
      <Pressable
        onPress={signed ? undefined : onSign}
        disabled={signed}
        accessibilityRole="button"
        accessibilityLabel="Sign the vow"
        style={{ position: 'absolute', left: 0, right: 0, top: 38, bottom: 0 }}
      />
    </View>
  );
}

/* ───────────────────────────────────────────────────── 107 — the campaign map */

/**
 * The map's own field: a warmer paper than 097–106 (#F6F4F0 → #FCFBF9) with the
 * bottom glow pushed from 0.42/0.19 to 0.52/0.23.
 */
export function CampaignMapField() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <LinearGradient colors={['#F6F4F0', '#FCFBF9']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* blurred 6px in the canvas */}
      <Wash
        stops={[
          ['0%', 'rgb(180,170,150)', 0.14],
          ['72%', 'rgb(19,19,19)', 0],
        ]}
        style={{ left: -40, top: -140, width: 540, height: 270 }}
      />
      <Wash
        stops={[
          ['0%', 'rgb(255,236,196)', 0.52],
          ['45%', 'rgb(255,236,196)', 0.23],
          ['72%', 'rgb(255,236,196)', 0],
        ]}
        style={{ left: '50%', marginLeft: -280, bottom: -300, width: 560, height: 560 }}
      />
      <Noise opacity={0.12} />
    </View>
  );
}

/** The four weeks, top of the map down: 107's rows in canvas order. */
/**
 * The twelve weeks, four to a page, week I at the foot of page 1 so the eye
 * starts where he is standing and climbs. The halo ramp repeats per page —
 * 0.62 / 0.5 / 0.38 / 0.3 down each — and the halo's own top is 7 on every row.
 */
export const CAMPAIGN_WEEKS: { week: number; page: number; top: number; eyebrow: string; title: string; titleSize: number; halo: number; here?: boolean }[] = [
  { week: 12, page: 3, top: 138, eyebrow: 'Week XII', title: 'Leave It Behind', titleSize: 16, halo: 0.62 },
  { week: 11, page: 3, top: 256, eyebrow: 'Week XI', title: 'Build a Life You Want', titleSize: 15.5, halo: 0.5 },
  { week: 10, page: 3, top: 374, eyebrow: 'Week X', title: 'Yourself', titleSize: 16, halo: 0.38 },
  { week: 9, page: 3, top: 492, eyebrow: 'Week IX', title: 'Connection', titleSize: 16, halo: 0.3 },
  { week: 8, page: 2, top: 138, eyebrow: 'Week VIII', title: 'Boredom and Meaning', titleSize: 15.5, halo: 0.62 },
  { week: 7, page: 2, top: 256, eyebrow: 'Week VII', title: 'Relapse and Adversity', titleSize: 15.5, halo: 0.5 },
  { week: 6, page: 2, top: 374, eyebrow: 'Week VI', title: 'Discipline', titleSize: 16, halo: 0.38 },
  { week: 5, page: 2, top: 492, eyebrow: 'Week V', title: 'Why It Feels Worth It', titleSize: 15.5, halo: 0.3 },
  { week: 4, page: 1, top: 138, eyebrow: 'Week IV', title: 'Know Your Brain', titleSize: 16, halo: 0.62 },
  { week: 3, page: 1, top: 256, eyebrow: 'Week III', title: 'In the Moment', titleSize: 16, halo: 0.5 },
  { week: 2, page: 1, top: 374, eyebrow: 'Week II', title: 'Changing Your Mindset', titleSize: 15.5, halo: 0.38 },
  { week: 1, page: 1, top: 492, eyebrow: 'Week I', title: 'Reset', titleSize: 16, halo: 0.3, here: true },
];

/**
 * The scroll position, drawn as the canvas draws it: a thumb of exactly one
 * third of the track, travelling in thirds. It is driven by the page index
 * rather than by a continuous offset — 144 of 450 is not proportional to a
 * twelve-row scroll, and the halo ramp restarting on every page says the same
 * thing.
 */
export function CampaignMapRail({ page }: { page: number }) {
  return (
    <View style={{ position: 'absolute', right: 9, top: 138, width: 4, height: 450, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.06)' }}>
      <View style={{ position: 'absolute', left: 0, top: 153 * (3 - page), width: 4, height: 144, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
    </View>
  );
}

/** The tile the art is drawn into: the row less its 14pt right inset. */
const TILE_W = 393 - 48 - 14;
const TILE_H = 96;

/** The little drawing in each row's tile, keyed by week. */
function CampaignWeekArt({ week }: { week: number }) {
  // week I — three courses of foundation, narrowing upward
  if (week === 1) {
    return (
      <>
        <View style={{ position: 'absolute', left: 40, top: 58, width: 48, height: 11, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 46, top: 46, width: 34, height: 11, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 53, top: 36, width: 20, height: 9, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
      </>
    );
  }
  // week II — three discs and the line they settle onto
  if (week === 2) {
    return (
      <>
        <View style={{ position: 'absolute', left: 66, top: 22, width: 20, height: 20, borderRadius: 10, backgroundColor: '#E9D2A4' }} />
        <View style={{ position: 'absolute', left: 38, top: 40, width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: 54, top: 34, width: 30, height: 30, borderRadius: 15, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 34, top: 52, width: 56, height: 16, borderRadius: 10, backgroundColor: '#E0DFDA' }} />
      </>
    );
  }
  // week III — the urge, drawn as the wave it is
  if (week === 3) {
    return (
      <Svg width={52} height={40} viewBox="0 0 26 20" style={{ position: 'absolute', left: 38, top: 26 }}>
        <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke="#55534E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </Svg>
    );
  }
  // week IV — the ring, the core, and the one that got away
  if (week === 4) {
    return (
      <>
        <View style={{ position: 'absolute', left: 38, top: 22, width: 48, height: 48, borderRadius: 24, boxShadow: 'inset 0 0 0 2px #D6D5D0' }} />
        <View style={{ position: 'absolute', left: 50, top: 34, width: 24, height: 24, borderRadius: 12, backgroundColor: '#E9D2A4' }} />
        <View style={{ position: 'absolute', left: 82, top: 30, width: 6, height: 6, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
      </>
    );
  }
  // week V — the scales, one pan heavier than the other
  if (week === 5) {
    return (
      <>
        <View style={{ position: 'absolute', left: 52, top: 60, width: 24, height: 6, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 61, top: 32, width: 4, height: 30, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 40, top: 30, width: 46, height: 4, borderRadius: 2, backgroundColor: '#8A857C', transform: [{ rotate: '7deg' }] }} />
        {/* 9px bottom radii on a 16 x 8 box: CSS scales them by min(16/18, 8/9)
            to 8, i.e. a bottom half-disc, and RN clamps identically */}
        <View style={{ position: 'absolute', left: 34, top: 32, width: 16, height: 8, borderBottomLeftRadius: 9, borderBottomRightRadius: 9, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 76, top: 42, width: 16, height: 8, borderBottomLeftRadius: 9, borderBottomRightRadius: 9, backgroundColor: '#E9D2A4' }} />
      </>
    );
  }
  // week VI — two peaks, a snow cap and a flag on the near one
  if (week === 6) {
    return (
      <>
        {/* the canvas draws the pole first, so the flag paints over its left edge */}
        <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Polygon points="51,42 68,68 34,68" fill="#E0DFDA" />
          <Polygon points="73,26 94,68 52,68" fill="#D6D5D0" />
          <Polygon points="73,26 80,37 76.08,33.7 73,36.45 69.92,33.7 66,37" fill="#F9F8F4" />
          <Rect x={72} y={12} width={2.5} height={15} rx={1} fill="#8A857C" />
          <Polygon points="74,12 84,15.5 74,19" fill="#E9D2A4" />
        </Svg>
      </>
    );
  }
  // week VII — the compass, still pointing north after the fall
  if (week === 7) {
    return (
      <>
        <View style={{ position: 'absolute', left: 40, top: 22, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: 53, top: 35, width: 22, height: 22, borderRadius: 11, backgroundColor: '#FAF8F4' }} />
        <View style={{ position: 'absolute', left: 61, top: 24, width: 6, height: 8, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 61, top: 60, width: 6, height: 8, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 42, top: 43, width: 8, height: 6, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 78, top: 43, width: 8, height: 6, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
      </>
    );
  }
  // week VIII — the sun going down behind the hill
  if (week === 8) {
    return (
      <>
        <View style={{ position: 'absolute', left: 58, top: 26, width: 18, height: 18, borderRadius: 9, backgroundColor: '#E9D2A4' }} />
        <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Path d="M30 70 L30 62 A 33 10 0 0 1 96 62 L96 70 Z" fill="#E0DFDA" />
        </Svg>
        <View style={{ position: 'absolute', left: 42, top: 48, width: 3, height: 6, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '-12deg' }] }} />
        <View style={{ position: 'absolute', left: 80, top: 46, width: 3, height: 6, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '10deg' }] }} />
      </>
    );
  }
  // week IX — two tents pitched side by side
  if (week === 9) {
    return (
      <>
        {/* DOM order is pole L, flag L, pole R, flag R — flags on top */}
        <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Path d="M28 70 L28 68 A 20 24 0 0 1 68 68 L68 70 Z" fill="#E0DFDA" />
          <Path d="M58 70 L58 66 A 22 28 0 0 1 102 66 L102 70 Z" fill="#D6D5D0" />
          <Rect x={46} y={32} width={2.5} height={13} rx={1} fill="#8A857C" />
          <Polygon points="48,32 57,35 48,38" fill="#E9D2A4" />
          <Rect x={78} y={26} width={2.5} height={13} rx={1} fill="#8A857C" />
          <Polygon points="80,26 89,29 80,32" fill="#E9D2A4" />
        </Svg>
      </>
    );
  }
  // week X — the mirror, and the man standing in front of it
  if (week === 10) {
    return (
      <>
        <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Ellipse cx={62} cy={44} rx={16} ry={22} fill="#F9F8F4" />
          {/* an inset ring of width w draws wholly inside the edge, so the
              stroke's centreline sits at r − w/2 */}
          <Ellipse cx={62} cy={44} rx={14.5} ry={20.5} stroke="#D6D5D0" strokeWidth={3} fill="none" />
        </Svg>
        <View style={{ position: 'absolute', left: 53, top: 28, width: 7, height: 14, borderRadius: 4, backgroundColor: '#FFFFFF', transform: [{ rotate: '18deg' }] }} />
        <View style={{ position: 'absolute', left: 50, top: 64, width: 5, height: 9, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '18deg' }] }} />
        <View style={{ position: 'absolute', left: 69, top: 64, width: 5, height: 9, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '-18deg' }] }} />
      </>
    );
  }
  // week XI — a lit house with the low sun behind it
  if (week === 11) {
    return (
      <>
        <View style={{ position: 'absolute', left: 40, top: 22, width: 48, height: 46, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: 47, top: 28, width: 34, height: 40, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#F9F8F4' }} />
        <View style={{ position: 'absolute', left: 60, top: 40, width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#E9D2A4' }} />
        <View
          style={{
            position: 'absolute',
            left: 88,
            top: 26,
            width: 15,
            height: 44,
            borderRadius: 2,
            backgroundColor: '#D6D5D0',
            transform: [{ skewY: '-8deg' }],
            transformOrigin: 'left top',
          }}
        />
      </>
    );
  }
  // week XII — the signpost passed, and the road going on
  return (
    <>
      <View
        style={{ position: 'absolute', left: 44, top: 54, width: 42, height: 11, borderTopLeftRadius: 3, borderTopRightRadius: 3, borderBottomRightRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#C6C5C0' }}
      />
      <View style={{ position: 'absolute', left: 64, top: 24, width: 2.5, height: 30, borderRadius: 1, backgroundColor: '#8A857C' }} />
      <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Polygon points="64,26 64,54 50,54" fill="#F9F8F4" />
        <Polygon points="68,30 81,54 68,54" fill="#E9D2A4" />
      </Svg>
      <View style={{ position: 'absolute', left: 36, top: 68, width: 20, height: 3, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
    </>
  );
}

export function CampaignWeekRow({ i }: { i: number }) {
  const w = CAMPAIGN_WEEKS[i];
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: w.top, height: 96 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', borderRadius: 14, backgroundColor: '#F0EFE9', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }}>
        {/* rgba(0,0,0,0.08) blurred 3px in the canvas */}
        <Wash stops={[['0%', 'rgb(0,0,0)', 0.08], ['100%', 'rgb(0,0,0)', 0]]} style={{ left: 38, top: 74, width: 52, height: 9 }} />
        <Wash
          stops={[
            ['0%', 'rgb(255,236,196)', w.halo],
            ['72%', 'rgb(255,236,196)', 0],
          ]}
          style={{ left: 9, top: 7 /* the canvas states 7 on all twelve rows */, width: 110, height: 110 }}
        />
        <CampaignWeekArt week={w.week} />
      </View>
      <View style={{ position: 'absolute', left: 126, right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>{w.eyebrow}</AppText>
          {w.here ? (
            <View style={{ borderRadius: 8, backgroundColor: '#131313', paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('600'), { fontSize: 12.5, color: '#FFFFFF' }]}>You are here</AppText>
            </View>
          ) : null}
        </View>
        <AppText numberOfLines={2} style={[sans('600'), { marginTop: 4, fontSize: w.titleSize, color: '#1D1C1A' }]}>
          {w.title}
        </AppText>
      </View>
    </View>
  );
}
