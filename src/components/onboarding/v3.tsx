/**
 * Onboarding v3 — "the campaign" funnel, a native port of the canvas
 * screens-onb3 / onb3-map / onb3-tool. The funnel opens on near-black night
 * water; light gathers low and slow as the questions pass and breaks to paper
 * exactly at the reading. Progress is one growing ink rule; days and weeks are
 * Roman numerals. No scores, no comparison stats, no countdowns, no fake deals.
 *
 * Exposes the step components + an O3Tone context so primitives flip between
 * the night register and the paper register automatically.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AppText, Laurel } from '@/components/ui';
import { PressScale } from '@/components/ui/press-scale';
import { BreathCue, UrgeWave, type BreathPhase } from '@/components/urge';
import { SC } from '@/components/scene/SceneKit';
import { colors, fonts, sans } from '@/lib/theme';
import {
  AegisCheck,
  AegisField,
  AegisSpinner,
  ByAge80Card,
  CAMPAIGN_WEEKS,
  CampaignLineCard,
  ONB_LESSONS,
  OnbLessonArt,
  OnbPagerDots,
  type OnbLessonKind,
  CampaignMapField,
  CampaignWeekRow,
  LAST_30,
  MonthGrid,
  MostActiveTriggerCard,
  NEXT_30,
  NEXT_365,
  OnbPaperField,
  PlanReadyArt,
  PlanReadyField,
  REVERSAL_CAPTION_DELAY_MS,
  RewireCurveCard,
  RootLoopCard,
  StreakSawtoothCard,
  UrgesByNightCard,
  VowSignaturePanel,
  VowSunArt,
  YearGrid,
} from './art';

const noiseDark = require('../../../assets/images/noise-dark.png');

// ── the two registers ────────────────────────────────────────────────
export type Tone = {
  bg: string;
  card: string;
  ink: string;
  ink2: string;
  ink3: string;
  ink4: string;
  line: string;
  soft2: string;
  /** The unfilled half of the rule at the top of every funnel screen. */
  track: string;
  fill: string;
  onFill: string;
};
const NIGHT: Tone = {
  bg: '#0F0F0D',
  card: 'rgba(255,255,255,0.07)',
  ink: '#F4F3F0',
  ink2: 'rgba(244,243,240,0.7)',
  ink3: 'rgba(244,243,240,0.55)',
  ink4: 'rgba(244,243,240,0.3)',
  line: 'rgba(255,255,255,0.1)',
  soft2: 'rgba(255,255,255,0.22)',
  track: 'rgba(255,255,255,0.2)',
  fill: '#F4F3F0',
  onFill: '#131313',
};
const PAPER: Tone = {
  // Daylight paper is a shade brighter than the app's field — the reading is
  // meant to feel like the sun finally came up on it.
  bg: '#FAF9F8',
  card: colors.surface,
  ink: colors.text,
  ink2: colors.textMuted,
  ink3: colors.textSoft,
  ink4: colors.textSofter,
  line: colors.border,
  soft2: colors.borderStrong,
  track: 'rgba(0,0,0,0.12)',
  fill: colors.ink,
  onFill: colors.inkText,
};
const O3Tone = createContext<Tone>(NIGHT);
const useTone = () => useContext(O3Tone);

// ── the 048–084 run, frame by frame ──────────────────────────────────
/**
 * Thirty-seven canvas frames in funnel order. The night field, the low sun and
 * the bottom glow are authored per frame, not by a formula: a section intro
 * repeats the field of the question it opens, the four lesson interstitials
 * jump ahead of the questions on either side of them, the glow alternates warm
 * and cool with no pattern, and 072 breaks the −0.55·w offset its neighbours
 * all follow. Nothing here can be recovered from a progress fraction, so every
 * number below is the frame's own.
 *
 * `rule` is the ink rule's stated width percent; `top`/`bot` the 180° field;
 * `sun`/`off` the low sun's box and how far it hangs below the frame;
 * `glow`/`a0`/`a45` its colour and the two stated stops (the third is always
 * transparent at 72%).
 */
type O3Field = { rule: number; top: string; bot: string; sun: number; off: number; glow: string; a0: number; a45: number };
const O3_WARM = '#FFECC4'; // rgba(255,236,196,·)
const O3_COOL = '#FFFFFF'; // rgba(255,255,255,·)
const fld = (rule: number, top: string, bot: string, sun: number, off: number, glow: string, a0: number, a45: number): O3Field =>
  ({ rule, top, bot, sun, off, glow, a0, a45 });
const O3_FIELD: O3Field[] = [
  fld(4, 'rgb(15,15,13)', 'rgb(26,25,23)', 420, -231, O3_WARM, 0.1, 0.05), //   048 · section 1
  fld(4, 'rgb(15,15,13)', 'rgb(26,25,23)', 420, -231, O3_WARM, 0.1, 0.05), //   049 · Q1
  fld(9, 'rgb(16,16,14)', 'rgb(27,26,24)', 429, -236, O3_COOL, 0.12, 0.05), //  050 · Q2
  fld(13, 'rgb(17,17,15)', 'rgb(29,28,26)', 438, -241, O3_WARM, 0.14, 0.06), // 051 · Q3
  fld(15, 'rgb(21,21,19)', 'rgb(35,34,32)', 484, -266, O3_WARM, 0.28, 0.12), // 052 · lesson, willpower
  fld(17, 'rgb(17,17,15)', 'rgb(30,29,27)', 448, -246, O3_WARM, 0.15, 0.07), // 053 · Q4
  fld(22, 'rgb(18,18,16)', 'rgb(31,30,28)', 457, -251, O3_COOL, 0.17, 0.08), // 054 · section 2
  fld(22, 'rgb(18,18,16)', 'rgb(31,30,28)', 457, -251, O3_COOL, 0.17, 0.08), // 055 · Q5
  fld(26, 'rgb(19,19,17)', 'rgb(32,31,29)', 466, -256, O3_WARM, 0.19, 0.09), // 056 · Q6
  fld(30, 'rgb(20,20,18)', 'rgb(34,33,31)', 475, -261, O3_COOL, 0.21, 0.09), // 057 · Q7
  fld(32, 'rgb(27,27,25)', 'rgb(45,44,42)', 558, -307, O3_WARM, 0.38, 0.17), // 058 · lesson, rewire
  fld(35, 'rgb(21,21,19)', 'rgb(36,35,33)', 493, -271, O3_COOL, 0.25, 0.11), // 059 · section 3
  fld(35, 'rgb(21,21,19)', 'rgb(36,35,33)', 493, -271, O3_COOL, 0.25, 0.11), // 060 · Q8
  fld(39, 'rgb(22,22,20)', 'rgb(37,36,34)', 503, -277, O3_COOL, 0.27, 0.12), // 061 · Q9
  fld(43, 'rgb(23,23,21)', 'rgb(39,38,36)', 512, -282, O3_WARM, 0.28, 0.13), // 062 · Q10
  fld(48, 'rgb(24,24,22)', 'rgb(40,39,37)', 521, -287, O3_COOL, 0.3, 0.14), //  063 · section 4
  fld(48, 'rgb(24,24,22)', 'rgb(40,39,37)', 521, -287, O3_COOL, 0.3, 0.14), //  064 · Q11
  fld(52, 'rgb(25,25,23)', 'rgb(41,40,38)', 530, -292, O3_WARM, 0.32, 0.14), // 065 · Q12
  fld(57, 'rgb(25,25,23)', 'rgb(42,41,39)', 539, -296, O3_COOL, 0.34, 0.15), // 066 · Q13
  fld(61, 'rgb(26,26,24)', 'rgb(44,43,41)', 548, -301, O3_WARM, 0.36, 0.16), // 067 · Q14
  fld(65, 'rgb(28,28,26)', 'rgb(46,45,43)', 567, -312, O3_COOL, 0.39, 0.18), // 068 · section 5
  fld(65, 'rgb(28,28,26)', 'rgb(46,45,43)', 567, -312, O3_COOL, 0.39, 0.18), // 069 · Q15
  fld(70, 'rgb(28,28,26)', 'rgb(47,46,44)', 576, -317, O3_WARM, 0.41, 0.18), // 070 · Q16
  fld(74, 'rgb(29,29,27)', 'rgb(49,48,46)', 585, -322, O3_COOL, 0.43, 0.19), // 071 · Q17
  fld(76, 'rgb(30,30,28)', 'rgb(50,49,47)', 590, -320, O3_WARM, 0.44, 0.2), //  072 · lesson, anchor
  fld(78, 'rgb(30,30,28)', 'rgb(50,49,47)', 594, -327, O3_WARM, 0.45, 0.2), //  073 · Q18
  fld(83, 'rgb(31,31,29)', 'rgb(51,50,48)', 603, -332, O3_COOL, 0.47, 0.21), // 074 · section 6
  fld(83, 'rgb(31,31,29)', 'rgb(51,50,48)', 603, -332, O3_COOL, 0.47, 0.21), // 075 · Q19
  fld(85, 'rgb(32,32,30)', 'rgb(52,51,49)', 613, -337, O3_COOL, 0.48, 0.22), // 076 · lesson, small steps
  fld(87, 'rgb(32,32,30)', 'rgb(54,53,51)', 622, -342, O3_WARM, 0.5, 0.23), //  077 · Q20
  fld(91, 'rgb(33,33,31)', 'rgb(55,54,52)', 631, -347, O3_COOL, 0.52, 0.23), // 078 · section 7
  fld(91, 'rgb(33,33,31)', 'rgb(55,54,52)', 631, -347, O3_COOL, 0.52, 0.23), // 079 · Q21
  fld(96, 'rgb(34,34,32)', 'rgb(56,55,53)', 640, -352, O3_WARM, 0.54, 0.24), // 080 · Q22
  fld(100, 'rgb(35,35,33)', 'rgb(58,57,55)', 640, -352, O3_WARM, 0.56, 0.25), // 081 · Q23
  fld(100, 'rgb(36,36,34)', 'rgb(59,58,56)', 640, -352, O3_WARM, 0.56, 0.25), // 082 · Q24 name
  fld(100, 'rgb(37,37,35)', 'rgb(60,59,57)', 640, -352, O3_WARM, 0.56, 0.25), // 083 · Q25 age
  fld(100, 'rgb(38,38,36)', 'rgb(61,60,58)', 640, -352, O3_WARM, 0.56, 0.25), // 084 · Q26 gender
];

/** Which row of the table each kind of screen sits on. */
const O3_Q_FIELD = [1, 2, 3, 5, 7, 8, 9, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 25, 27, 29, 31, 32, 33, 34, 35, 36];
const O3_SECTION_FIELD = [0, 6, 11, 15, 20, 26, 30];
const O3_LESSON_FIELD: Record<string, number> = { willpower: 4, rewire: 10, anchor: 24, steps: 28 };

/**
 * Only the screen on the frame knows which frame it is — the funnel's step
 * index counts the push primer, the reading pause and the whole paper tail as
 * well. A screen that knows its place publishes it here and the shell reads
 * its field, its low sun and its rule width straight off the table.
 */
const O3FieldCtx = createContext<((v: number | null) => void) | null>(null);
function useO3Field(v: number | null) {
  const publish = useContext(O3FieldCtx);
  useEffect(() => {
    if (v == null) return;
    publish?.(v);
    return () => publish?.(null);
  }, [publish, v]);
}

// ── roman numerals ───────────────────────────────────────────────────
export function o3Roman(n: number): string {
  const T: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = '';
  let v = Math.max(1, Math.round(n));
  for (const [k, r] of T) while (v >= k) { s += r; v -= k; }
  return s;
}

// ── small motion helpers ─────────────────────────────────────────────
function Rise({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 550, delay: delay * 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [t, delay]);
  return <Animated.View style={[{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [9, 0] }) }] }, style]}>{children}</Animated.View>;
}

/** Which paper field a lit frame states — 096 and 107 each carry their own. */
export type O3Paper = 'default' | 'plan' | 'map' | 'plain';

// ── the shell: night ground, gathering light, a growing ink rule ─────
export function O3Shell({
  progress = 0,
  onBack,
  bar = true,
  lit = false,
  paper = 'default',
  segments,
  backTop,
  children,
}: {
  progress?: number;
  onBack?: (() => void) | null;
  bar?: boolean;
  lit?: boolean;
  paper?: O3Paper;
  /** The eight-segment rule the paper tail draws, and how many are inked. */
  segments?: number;
  /** Back sits at y 94 on the night frames, 96 on the paper ones, 64 on the map. */
  backTop?: number;
  children: ReactNode;
}) {
  const tone = lit ? PAPER : NIGHT;
  const [frame, setFrame] = useState<number | null>(null);
  // Screens outside the 058–094 run publish no frame: the push primer stands
  // before it and holds the opening field, the paper tail stands after it and
  // holds the closing one.
  const field = O3_FIELD[frame ?? (progress < 0.5 ? 0 : O3_FIELD.length - 1)];
  const pct = frame == null ? Math.round(Math.max(0.04, Math.min(1, progress)) * 100) : field.rule;
  // The chrome is drawn off the canvas frame: rule at y 66, Back at y 94, both
  // measured below the 54pt status bar the safe-area inset stands in for.
  const backInk = lit ? tone.ink2 : 'rgba(244,243,240,0.75)';
  return (
    <O3FieldCtx.Provider value={setFrame}>
      <O3Tone.Provider value={tone}>
        <View style={{ flex: 1, backgroundColor: tone.bg }}>
          {/* the ambient light gathering low, or daylight on paper */}
          <Ambient field={field} lit={lit} paper={paper} />
          <SafeAreaView edges={['top']} style={{ flex: 1 }}>
            {/* Yoga positions an absolutely-placed child from its parent's
                BORDER box and never consults padding, and SafeAreaView spends
                the inset as padding — so the rule and the Back row have to sit
                inside a plain view that already starts at the inset, or they
                draw across the status bar on device. */}
            <View style={{ flex: 1 }}>
              {bar && segments != null ? (
                /* the paper tail counts in eight ticks rather than one rule */
                <View style={{ position: 'absolute', left: 24, right: 24, top: 12, flexDirection: 'row', gap: 8 }}>
                  {Array.from({ length: 8 }, (_, k) => (
                    <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k < segments ? '#131313' : 'rgba(0,0,0,0.14)' }} />
                  ))}
                </View>
              ) : bar ? (
                <View style={{ position: 'absolute', left: 24, right: 24, top: 12, height: 4, borderRadius: 2, backgroundColor: tone.track }}>
                  <View style={{ height: 4, width: `${pct}%`, borderRadius: 2, backgroundColor: tone.ink }} />
                </View>
              ) : null}
              {onBack ? (
                <PressScale
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Back"
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
                  style={{ position: 'absolute', left: 16, top: backTop ?? 40, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                  <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
                    <Path d="M9.5 1.5L2 9.5l7.5 8" stroke={backInk} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <AppText style={[sans('400'), { fontSize: 17, color: backInk }]}>Back</AppText>
                </PressScale>
              ) : null}
              {/* Padding for the flowed screens; the canvas-placed ones position
                  absolutely, which Yoga measures from this box's edge, not its
                  content — so their lefts and tops are the frame's own numbers. */}
              <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 76, paddingBottom: 32 }}>{children}</View>
            </View>
          </SafeAreaView>
        </View>
      </O3Tone.Provider>
    </O3FieldCtx.Provider>
  );
}

// gathering light: a wide pale bloom low, a warmer core arriving later
function Ambient({ field, lit, paper = 'default' }: { field: O3Field; lit: boolean; paper?: O3Paper }) {
  // Daylight. Three of the paper frames state their own field, so each is drawn
  // from its own numbers rather than tinted off a shared one; 108 states none
  // at all and stands on flat white.
  if (lit) {
    if (paper === 'plain') return <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF' }} />;
    if (paper === 'plan') return <PlanReadyField />;
    if (paper === 'map') return <CampaignMapField />;
    return <OnbPaperField />;
  }
  // Night: every value is the frame's own, off O3_FIELD — the field ends, the
  // sun's box and hang, and the glow's colour and two stops.
  const { sun, off, glow, a0, a45 } = field;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <LinearGradient colors={[field.top, field.bot]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      {/* the bloom off the top-left corner — the canvas blurs it 6px, and with
          no blur filter in RN SVG the gradient's own falloff carries it. Every
          frame in the run states the same box and stops. */}
      <Svg width={540} height={270} style={{ position: 'absolute', left: -40, top: -140 }}>
        <Defs>
          <RadialGradient id="o3bloom" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.14} />
            <Stop offset="0.72" stopColor="#131313" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={270} cy={135} rx={270} ry={135} fill="url(#o3bloom)" />
      </Svg>
      <Svg width={sun} height={sun} style={{ position: 'absolute', left: '50%', marginLeft: -sun / 2, bottom: off }}>
        <Defs>
          <RadialGradient id="o3sun" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={glow} stopOpacity={a0} />
            <Stop offset="0.45" stopColor={glow} stopOpacity={a45} />
            <Stop offset="0.72" stopColor={glow} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={sun / 2} cy={sun / 2} rx={sun / 2} ry={sun / 2} fill="url(#o3sun)" />
      </Svg>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 }} />
    </View>
  );
}

// ── voice primitives ─────────────────────────────────────────────────
export function O3H({ children, size = 22, style }: { children: ReactNode; size?: number; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('500'), { fontSize: size, lineHeight: size * 1.32, letterSpacing: 0.1, color: tone.ink, maxWidth: 305, alignSelf: 'center' }, style]}>
      {children}
    </AppText>
  );
}
export function O3Sub({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('400'), { fontSize: 15, lineHeight: 23, color: tone.ink2, maxWidth: 315, alignSelf: 'center', marginTop: 12 }, style]}>
      {children}
    </AppText>
  );
}
export function O3Eyebrow({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.3, textTransform: 'uppercase', color: tone.ink3 }, style]}>
      {children}
    </AppText>
  );
}
export function O3Note({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('400'), { fontSize: 12, lineHeight: 18, color: tone.ink3, maxWidth: 280, alignSelf: 'center' }, style]}>
      {children}
    </AppText>
  );
}
export function O3CTA({
  label,
  onClick,
  enabled = true,
  ghost = false,
  size = 'lg',
  style,
}: {
  label: string;
  onClick?: () => void;
  enabled?: boolean;
  ghost?: boolean;
  /** `md` is the questionnaire's 56pt pill, `lg` the 58pt one the last cards use. */
  size?: 'md' | 'lg';
  style?: object;
}) {
  const tone = useTone();
  if (ghost) {
    return (
      <View style={{ alignItems: 'center' }}>
        <PressScale onPress={onClick} style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
          <AppText style={[sans('500'), { fontSize: 14, color: tone.ink2 }, style as object]}>{label}</AppText>
        </PressScale>
      </View>
    );
  }
  const md = size === 'md';
  return (
    <PressScale
      onPress={enabled ? onClick : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      style={{
        height: md ? 56 : 58,
        backgroundColor: tone.fill,
        borderRadius: md ? 28 : 29,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.26,
        ...(style as object),
      }}>
      <AppText style={[sans('600'), { fontSize: md ? 16.5 : 17, letterSpacing: md ? 0 : 0.2, color: tone.onFill }]}>{label}</AppText>
    </PressScale>
  );
}

/**
 * The 56pt pale pill — the section intros and every multi-select — sits at
 * y 744 on the 852 frame, so 52 up from the bottom. (The 58pt one the typed
 * and single-answer frames use sits at the same 744 and lands on 50.)
 */
export const O3_MD_CTA_BOTTOM = 852 - 744 - 56;

/**
 * The dark pill the paper tail ends on. Height, radius and tracking are the
 * frame's own — 097–105 draw 58/29, 096 draws 56/28, 108 draws 54/27, and
 * 106 · 107 widen the tracking to 0.3.
 */
function O3PaperCTA({ label, onPress, y, h = 58, ls = 0.2, enabled = true }: { label: string; onPress: () => void; /** The pill's canvas top. */ y: number; h?: 54 | 56 | 58; ls?: number; enabled?: boolean }) {
  return (
    <PressScale
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 852 - y - h,
        height: h,
        minHeight: 0,
        borderRadius: h / 2,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.26,
      }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: ls, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/**
 * The quiet way out under that pill — one grey line, centred on the frame.
 * Anchored from the bottom like the pill above it, so the gap between the two
 * holds on a taller screen; 18 is the natural line box of a 15pt system line,
 * which is the height the canvas measures for its div.
 */
function O3PaperLink({ label, onPress, y }: { label: string; onPress: () => void; /** The line's canvas top. */ y: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 852 - y - 18, minHeight: 0, alignItems: 'center' }}>
      <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>{label}</AppText>
    </PressScale>
  );
}

/** The 24pt balanced headline 097 · 103 · 104 · 105 share, at its own inset. */
function O3PaperH({ children, top, inset }: { children: ReactNode; top: number; inset: number }) {
  return (
    <AppText center style={[sans('500'), { position: 'absolute', left: inset, right: inset, top, fontSize: 24, lineHeight: 32, letterSpacing: -0.2, color: '#1D1C1A' }]}>
      {children}
    </AppText>
  );
}

/** The grey line under every projection card: 14/21 at the frame's own inset. */
function O3PaperCaption({ children, top, inset = 44, style }: { children: ReactNode; top: number; inset?: number; style?: object }) {
  return (
    <AppText center style={[sans('400'), { position: 'absolute', left: inset, right: inset, top, fontSize: 14, lineHeight: 21, color: '#55534E' }, style]}>
      {children}
    </AppText>
  );
}

/** 098–101 all open the same way: an eyebrow, a big numeral, and its unit. */
function O3PaperTally({ eyebrow, value, unit }: { eyebrow: string; value: number; unit: string }) {
  const shown = useCountUp(value);
  return (
    <>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 98, fontSize: 12.5, color: '#8B8882' }]}>{eyebrow}</AppText>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 136, alignItems: 'center' }}>
        <AppText style={[sans('600'), { fontSize: 56, lineHeight: 56, letterSpacing: -1.5, color: '#1D1C1A', fontVariant: ['tabular-nums'] }]}>
          {shown.toLocaleString('en-US')}
        </AppText>
        <AppText style={[sans('600'), { marginTop: 10, fontSize: 12.5, color: '#8B8882' }]}>{unit}</AppText>
      </View>
    </>
  );
}

/** The white projection card, at the frame's stated top and height. */
function O3PaperCard({ top, height, gap, children }: { top: number; height: number; gap?: number; children: ReactNode }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height,
        borderRadius: 20,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}>
      {children}
    </View>
  );
}

/** The 11.5pt note some of those cards close with. */
function O3CardNote({ children }: { children: ReactNode }) {
  return <AppText style={[sans('500'), { fontSize: 11.5, color: '#B0AEA8' }]}>{children}</AppText>;
}

/** The 16×12 tick the answer rows flood with. */
function O3Tick({ c }: { c: string }) {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
      <Path d="M1.5 6l4.4 4.5L14.5 1.5" stroke={c} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── the chip — one answer row, 60 tall, flooding ink when chosen ─────
export function O3Chip({ label, on, picked = false, onClick }: { label: string; on: boolean; picked?: boolean; onClick: () => void }) {
  const tone = useTone();
  const chosen = on || picked;
  return (
    <PressScale
      onPress={onClick}
      accessibilityRole="button"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 22,
        borderRadius: 16,
        height: 60,
        backgroundColor: chosen ? tone.fill : tone.card,
        boxShadow: chosen ? undefined : `0 0 0 1px ${tone.soft2}`,
      }}>
      <AppText style={[sans('500'), { flex: 1, fontSize: 17, lineHeight: 20, color: chosen ? tone.onFill : tone.ink }]}>{label}</AppText>
      {chosen ? <O3Tick c={tone.onFill} /> : null}
    </PressScale>
  );
}

// ── option glyphs — the tile strokes from the canvas, path for path.
// Several tiles reuse one glyph across questions (the bed is both "Can’t
// sleep" and "Bedroom"), which is why the cases fall through ──
function O3Icon({ label, c }: { label: string; c: string }) {
  const box = (kids: ReactNode, vb = '0 0 24 24') => (
    <Svg width={22} height={22} viewBox={vb} fill="none">
      {kids}
    </Svg>
  );
  switch (label) {
    case 'Late night':
      return box(<Path d="M17 4 A10.5 10.5 0 1 0 25 20 A8.2 8.2 0 1 1 17 4 Z" fill={c} />, '0 0 30 30');
    case 'Early morning':
      return box(
        <>
          <Path d="M7 15a5 5 0 0 1 10 0" fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M3 18h18M12 4v3M5 7l2 2M19 7l-2 2" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Bored daytime':
    case 'Boredom':
      return box(
        <>
          <Circle cx={12} cy={12} r={8.5} fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M12 7.5V12l3 2" stroke={c} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>,
      );
    case 'After stress':
    case 'Anxiety':
      return box(<Path d="M3 16l5-6 4 4 6-8" fill="none" stroke={c} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />);
    case 'Can’t sleep':
    case 'Bedroom':
      return box(
        <>
          <Path d="M3 7v10M3 14h18v3M3 11h18v3" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <Rect x={5} y={8.5} width={6} height={3} rx={1.5} fill={c} />
        </>,
      );
    case 'Weekends':
      return box(
        <>
          <Rect x={3.5} y={5} width={17} height={15} rx={3} fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M8 3v4M16 3v4M3.5 10h17" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Drinking':
      return box(
        <>
          <Path d="M7 3h10l-1.2 13a3.8 3.8 0 0 1-7.6 0Z" fill="none" stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M9 21h6M12 17v4" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Home alone':
      return box(
        <>
          <Path d="M4 11l8-7 8 7" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M6 10v10h12V10" fill="none" stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
        </>,
      );
    case 'Phone in bed':
    case 'My phone':
      return box(
        <>
          <Rect x={7} y={3} width={10} height={18} rx={2.5} fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M10.5 18h3" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Loneliness':
      return box(
        <>
          <Circle cx={12} cy={8} r={3.6} fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M5 20a7 7 0 0 1 14 0" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Low mood':
    case 'Bathroom':
      return box(<Path d="M12 3.5c3.5 4.2 6 7.2 6 10.2a6 6 0 1 1-12 0c0-3 2.5-6 6-10.2Z" fill="none" stroke={c} strokeWidth={2.5} strokeLinejoin="round" />);
    case 'Anger':
      return box(
        <Path
          d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"
          stroke={c}
          strokeWidth={2.5}
          strokeLinecap="round"
        />,
      );
    case 'Numbness':
      return box(<Circle cx={12} cy={12} r={7.5} fill="none" stroke={c} strokeWidth={2.5} strokeDasharray="3.5 4" />);
    case 'Habit':
      return box(
        <>
          <Path d="M18.5 12a6.5 6.5 0 1 1-2-4.7" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M16 3.5l1 3.5-3.5 1" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </>,
      );
    case 'Desire':
      return box(
        <Path
          d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.6 2.2-5.2.6 1 1.4 1.7 2.3 2C11 7.5 11.4 5 12 3Z"
          fill="none"
          stroke={c}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />,
      );
    case 'Desk':
      return box(
        <>
          <Rect x={3.5} y={4.5} width={17} height={11.5} rx={2} fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M9 20h6M12 16.5V20" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Living room':
      return box(
        <>
          <Path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" fill="none" stroke={c} strokeWidth={2.5} />
          <Path d="M3.5 13a2 2 0 0 1 4 0v1h9v-1a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" fill="none" stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M6 18v2M18 18v2" stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        </>,
      );
    case 'Away':
      return box(
        <>
          <Path d="M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 0 1 13 0c0 4.7-6.5 10-6.5 10Z" fill="none" stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
          <Circle cx={12} cy={10.6} r={2.2} fill={c} />
        </>,
      );
    default:
      return box(<Circle cx={12} cy={12} r={3.2} fill={c} />);
  }
}

/** One answer row. `fs` carries the canvas's own drop to 15.5 on the long ones. */
export type O3Opt = { label: string; fs?: number };
export type O3Kind = 'list' | 'grid' | 'check' | 'text' | 'number';

const INK = '#F4F3F0';
const ON_INK = '#131313';

/**
 * The question engine — one shell across thirty-three frames.
 *
 * Everything is placed off the 393 × 852 canvas frame: title at y 158, the
 * "select all" line at 226, answer rows from 310 in 74pt steps, the pill at
 * 764. Absolute, because the frame holds the rows at a fixed y whether the
 * question wraps to one line or three.
 */
export function O3Question({
  title,
  options,
  value,
  multi = false,
  kind = 'list',
  onSet,
  next,
  note,
  ctaLabel,
  skip,
}: {
  title: string;
  options: O3Opt[];
  value: string | string[] | undefined;
  multi?: boolean;
  kind?: O3Kind;
  onSet: (v: string | string[]) => void;
  next: () => void;
  note?: string;
  ctaLabel?: string;
  skip?: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const qi = O3_QUESTIONS.findIndex(([, q]) => q.title === title);
  useO3Field(qi >= 0 ? O3_Q_FIELD[qi] : null);

  const typed = kind === 'text' || kind === 'number';
  // The canvas draws a button only where a tap cannot settle the answer by
  // itself: the multi-selects, the two typed fields, and the optional last one.
  const hasCta = multi || typed || !!skip;
  const chosen = multi ? (value as string[]) || [] : [];

  // A buttonless frame turns itself over — one beat, so the ink flood reads
  // as the answer before the next question arrives.
  useEffect(() => {
    if (!picked || hasCta) return;
    const id = setTimeout(next, 260);
    return () => clearTimeout(id);
  }, [picked, hasCta, next]);

  const isOn = (label: string) => (multi ? chosen.includes(label) : value === label || picked === label);
  const pick = (label: string) => {
    if (multi) {
      onSet(chosen.includes(label) ? chosen.filter((x) => x !== label) : [...chosen, label]);
      return;
    }
    onSet(label);
    setPicked(label);
  };

  let body: ReactNode = null;
  if (kind === 'grid') {
    const rows: O3Opt[][] = [];
    for (let i = 0; i < options.length; i += 3) rows.push(options.slice(i, i + 3));
    // three rows of tiles start at y 278, two rows at 298
    const top = (rows.length >= 3 ? 278 : 298) - 54;
    body = rows.map((row, r) => (
      <View key={r} style={{ position: 'absolute', left: 24, right: 24, top: top + 102 * r, flexDirection: 'row', gap: 10 }}>
        {row.map((opt) => {
          const on = isOn(opt.label);
          return (
            <PressScale
              key={opt.label}
              onPress={() => pick(opt.label)}
              accessibilityRole="button"
              style={{
                flex: 1,
                height: 94,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingHorizontal: 4,
                backgroundColor: on ? INK : 'rgba(255,255,255,0.07)',
                boxShadow: on ? undefined : '0 0 0 1px rgba(255,255,255,0.2)',
              }}>
              {on ? (
                <View style={{ position: 'absolute', right: 8, top: 8, width: 15, height: 15, borderRadius: 7.5, backgroundColor: ON_INK, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={8} height={6} viewBox="0 0 16 12" fill="none">
                    <Path d="M1.5 6l4.4 4.5L14.5 1.5" stroke={INK} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              ) : null}
              <O3Icon label={opt.label} c={on ? ON_INK : INK} />
              <AppText center style={[sans('500'), { fontSize: 12, lineHeight: 15, color: on ? ON_INK : INK }]}>{opt.label}</AppText>
            </PressScale>
          );
        })}
        {row.length < 3 ? Array.from({ length: 3 - row.length }, (_, k) => <View key={`gap${k}`} style={{ flex: 1 }} />) : null}
      </View>
    ));
  } else if (kind === 'check') {
    // the seven-row list pulls in to 52pt rows on a 62 pitch; the five-row one
    // stays at 56 on a 70 pitch
    const tight = options.length > 5;
    const top = (tight ? 288 : 306) - 54;
    body = options.map((opt, i) => {
      const on = isOn(opt.label);
      return (
        <PressScale
          key={opt.label}
          onPress={() => pick(opt.label)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: on }}
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: top + (tight ? 62 : 70) * i,
            height: tight ? 52 : 56,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 18,
            backgroundColor: on ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)',
            boxShadow: on ? '0 0 0 1px rgba(255,255,255,0.45)' : '0 0 0 1px rgba(255,255,255,0.18)',
          }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? INK : undefined,
              boxShadow: on ? undefined : 'inset 0 0 0 1.5px rgba(244,243,240,0.4)',
            }}>
            {on ? (
              <Svg width={12} height={9} viewBox="0 0 16 12" fill="none">
                <Path d="M1.5 6l4.4 4.5L14.5 1.5" stroke={ON_INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : null}
          </View>
          <AppText style={[sans('500'), { flex: 1, fontSize: 15.5, lineHeight: 19, color: INK }]}>{opt.label}</AppText>
        </PressScale>
      );
    });
  } else if (typed) {
    const num = kind === 'number';
    const text = String(value || '');
    body = (
      <View
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 256,
          height: 60,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          backgroundColor: 'rgba(255,255,255,0.07)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.22)',
        }}>
        {/* 082 draws the caret as a 2×22 bar ahead of the placeholder — the
            frame's stand-in for the real one, which HTML cannot show in a div.
            Keep it (and hide the system caret behind it) while the field is
            empty, so "Your name" starts at the canvas's x 51 rather than 46;
            once there is a value the native caret takes over and follows the
            text, which is what 083 draws. 083 puts its bar after the value, so
            the number field needs neither the bar nor the lead. */}
        {!num ? (
          <View style={{ position: 'absolute', left: 22, top: 19, width: 2, height: 22, borderRadius: 1, backgroundColor: INK, opacity: text ? 0 : 1 }} />
        ) : null}
        <TextInput
          value={text}
          onChangeText={onSet}
          placeholder={num ? '' : 'Your name'}
          placeholderTextColor="rgba(244,243,240,0.45)"
          keyboardType={num ? 'number-pad' : 'default'}
          autoCapitalize={num ? 'none' : 'words'}
          maxLength={num ? 3 : 40}
          selectionColor={INK}
          caretHidden={!num && !text}
          // the canvas's 2pt bar plus its 3pt gap, so the text sits at x 51
          style={[
            sans(num ? '500' : '400'),
            { flex: 1, height: 60, fontSize: 17, color: INK, marginLeft: num ? 0 : 5 },
            num ? { fontVariant: ['tabular-nums'] as const } : null,
          ]}
        />
      </View>
    );
  } else {
    body = options.map((opt, i) => {
      const on = isOn(opt.label);
      return (
        <PressScale
          key={opt.label}
          onPress={() => pick(opt.label)}
          accessibilityRole="button"
          accessibilityState={{ selected: on }}
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 256 + 74 * i,
            height: 60,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 22,
            backgroundColor: on ? INK : 'rgba(255,255,255,0.07)',
            boxShadow: on ? undefined : '0 0 0 1px rgba(255,255,255,0.22)',
          }}>
          <AppText style={[sans('500'), { flex: 1, fontSize: opt.fs ?? 17, lineHeight: 20, color: on ? ON_INK : INK }]}>{opt.label}</AppText>
          {on ? <O3Tick c={ON_INK} /> : null}
        </PressScale>
      );
    });
  }

  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 104, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: INK }]}>
        {title}
      </AppText>
      {multi ? (
        <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 172, fontSize: 13, color: 'rgba(244,243,240,0.55)' }]}>
          Select all that apply
        </AppText>
      ) : null}
      {body}
      {note ? (
        <AppText
          center
          style={[
            sans('400'),
            { position: 'absolute', left: 44, right: 44 },
            kind === 'number'
              ? { top: 340, fontSize: 13.5, lineHeight: 20, color: 'rgba(244,243,240,0.6)' }
              : { top: 634, fontSize: 12.5, color: 'rgba(244,243,240,0.55)' },
          ]}>
          {note}
        </AppText>
      ) : null}
      {hasCta ? (
        <O3CTA
          size={multi ? 'md' : 'lg'}
          label={ctaLabel ?? (multi ? `Continue · ${chosen.length}` : 'Continue')}
          enabled={multi ? chosen.length > 0 : true}
          onClick={next}
          style={{ position: 'absolute', left: 24, right: 24, bottom: multi ? O3_MD_CTA_BOTTOM : 50 }}
        />
      ) : null}
    </>
  );
}

// ════════ steps ══════════════════════════════════════════════════════
export function O3PushIntro({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <O3H style={{ marginTop: 24 }}>Push Notifications</O3H>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 84, height: 168, borderRadius: 14, backgroundColor: tone.card, boxShadow: `0 0 0 1px ${tone.line}, 0 8px 22px rgba(40,38,32,0.12)` }}>
            <View style={{ position: 'absolute', left: 6, right: 6, top: 15, height: 128, borderRadius: 4, backgroundColor: tone.soft2, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path d="M12 3.5a5.8 5.8 0 0 1 5.8 5.8v3.5l1.7 2.5a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.5V9.3A5.8 5.8 0 0 1 12 3.5z" stroke={tone.ink} strokeWidth={1.7} strokeLinejoin="round" />
                <Path d="M9.8 19a2.2 2.2 0 0 0 4.4 0" stroke={tone.ink} strokeWidth={1.7} />
              </Svg>
            </View>
            <View style={{ position: 'absolute', left: 34, bottom: 5, width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: tone.ink3 }} />
          </View>
          <View style={{ position: 'absolute', left: 34, bottom: 122, width: 62, height: 54, borderRadius: 10, backgroundColor: tone.soft2, alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={{ fontSize: 24 }}>♡</AppText>
          </View>
          <View style={{ position: 'absolute', right: 24, top: 120, width: 64, height: 56, borderRadius: 10, backgroundColor: tone.soft2, alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 18, color: tone.ink }]}>z z</AppText>
          </View>
        </View>
        <O3Sub style={{ marginBottom: 28 }}>No need to do this alone. A gentle nudge helps you check in and learn each day — nothing noisy, nothing shaming.</O3Sub>
      </View>
      <O3CTA label="Next" onClick={next} />
    </>
  );
}

export function O3Threshold({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 15, letterSpacing: 5, color: tone.ink }}>VICI</AppText>
        <View style={{ width: 40, height: 1.5, backgroundColor: tone.ink, marginTop: 16 }} />
        <View style={{ height: 64 }} />
        <Rise>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 31, lineHeight: 41, letterSpacing: 0.24, color: tone.ink, maxWidth: 300 }}>
            One day you close this app for good, and it says{' '}
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic' }}>vici.</AppText>
          </AppText>
        </Rise>
      </View>
      <O3CTA label="Begin" onClick={next} />
      <O3CTA ghost label="I already have a campaign" onClick={next} style={{ fontSize: 12.5, color: tone.ink3 }} />
    </>
  );
}

const OATH: [string, string][] = [
  ['Everything stays on this device.', 'Your answers are stored here, not on a server. We could not read them if we wanted to.'],
  ['Face ID locks the door.', 'Nothing on your screen says what this app is for unless you open it.'],
  ['No feed. No followers.', 'Recovery here is not performed for anyone. There is no audience to disappoint.'],
];
export function O3Privacy({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
        <O3H>What happens here stays in your hands.</O3H>
        <View style={{ marginTop: 30, backgroundColor: tone.card, borderRadius: 20, paddingHorizontal: 20 }}>
          {OATH.map(([t, s], i) => (
            <View key={t} style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start', paddingVertical: 17, borderBottomWidth: i < OATH.length - 1 ? 1 : 0, borderBottomColor: tone.line }}>
              <View style={{ width: 21, height: 21, marginTop: 1 }}>
                <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
                  {i === 0 ? (
                    <>
                      <Rect x={6.5} y={3.5} width={11} height={17} rx={2.4} stroke={tone.ink} strokeWidth={1.7} />
                      <Path d="M10 17.8h4" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  ) : i === 1 ? (
                    <>
                      <Path d="M5 8.5V6.4A1.4 1.4 0 0 1 6.4 5H8.5M15.5 5h2.1A1.4 1.4 0 0 1 19 6.4V8.5M19 15.5v2.1a1.4 1.4 0 0 1-1.4 1.4H15.5M8.5 19H6.4A1.4 1.4 0 0 1 5 17.6V15.5" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                      <Path d="M9.5 10.2v1M14.5 10.2v1M9.8 14.2a3.4 3.4 0 0 0 4.4 0" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <Circle cx={12} cy={12} r={8.4} stroke={tone.ink} strokeWidth={1.7} />
                      <Path d="M6.3 6.3l11.4 11.4" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  )}
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={[sans('600'), { fontSize: 14, color: tone.ink }]}>{t}</AppText>
                <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: tone.ink2, marginTop: 3 }]}>{s}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
      <O3CTA label="Understood" onClick={next} />
    </>
  );
}

const ARRIVAL: [string, string][] = [
  ['I just slipped', 'relapsed'],
  ['I keep stopping, then sliding back', 'cycling'],
  ["I'm ready to be done with it", 'resolved'],
  ["I'm not sure it's a problem yet", 'curious'],
];
export function O3Door({ value, onSet, next }: { value: string[]; onSet: (v: string[]) => void; next: () => void }) {
  const sel = value || [];
  const toggle = (k: string) => onSet(sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);
  return (
    <>
      <View style={{ height: 26 }} />
      <O3H>What brings you to the door?</O3H>
      <View style={{ flex: 1, justifyContent: 'center', gap: 12, marginTop: 30 }}>
        {ARRIVAL.map(([label, k]) => (
          <O3Chip key={k} label={label} on={sel.includes(k)} onClick={() => toggle(k)} />
        ))}
      </View>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label="Continue" enabled={sel.length > 0} onClick={next} />
      </View>
    </>
  );
}

/**
 * 062 · 068 · 082 · 086 — the four teaching interstitials.
 *
 * Each is one drawn idea on a 310pt stage, a line, a paragraph, and the pager
 * that says how many are left. The drawings, the fields and the copy all live
 * in `./art` where they are copied off the frame; this places them.
 */
export function O3Interlude({ kind, next }: { kind: OnbLessonKind; next: () => void }) {
  const l = ONB_LESSONS[kind];
  // the four lessons jump ahead of the questions on either side of them, so
  // they carry their own row of the table rather than a neighbour's
  useO3Field(O3_LESSON_FIELD[kind] ?? null);
  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 152 }}>
        <OnbLessonArt kind={kind} />
      </View>
      <AppText center style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: 476, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: INK }]}>
        {l.title}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: l.bodyInset, right: l.bodyInset, top: l.bodyTop - 54, fontSize: 15.5, lineHeight: 23, color: 'rgba(244,243,240,0.75)' }]}>
        {l.body}
      </AppText>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 658 }}>
        <OnbPagerDots i={l.step} />
      </View>
      <O3CTA label={l.cta} onClick={next} style={{ position: 'absolute', left: 24, right: 24, bottom: 50 }} />
    </>
  );
}

/** Sugar so the table below reads as the canvas rows do. */
const o = (label: string, fs?: number): O3Opt => (fs ? { label, fs } : { label });

// the assessment table — Q1..Q26, copy and per-row type sizes off the frames
export const O3_QUESTIONS: [string, { title: string; options: O3Opt[]; multi?: boolean; kind?: O3Kind; note?: string; skip?: boolean; ctaLabel?: string }][] = [
  // Section 1 · Where you're starting
  ['freq', { title: 'How often are you using porn right now?', options: [o('Several times a day'), o('About once a day'), o('A few times a week'), o('About once a week'), o('A few times a month'), o('Less than once a month')] }],
  ['duration', { title: 'How long has this been something you’ve wanted to change?', options: [o('Less than a year'), o('1 to 3 years'), o('4 to 10 years'), o('More than 10 years'), o('I can’t remember a time without it', 15.5)] }],
  ['control', { title: 'How much control do you feel over it right now?', options: [o('I feel powerless over it'), o('I resist sometimes, but usually give in', 15.5), o('I win about half the time'), o('I mostly stay in control, but I want to be free of it', 15.5)] }],
  ['pattern', { title: 'Which of these sounds most like your pattern?', options: [o('A quick habit I barely think about'), o('A way I unwind, numb out, or escape'), o('Something I binge on for hours at a time', 15.5), o('An escalating thing — more, or more extreme', 15.5), o('It comes in waves — intense, then quiet', 15.5)] }],
  // Section 2 · When and why it happens
  ['triggers', { kind: 'grid', multi: true, title: 'When are you most likely to slip?', options: [o('Late night'), o('Early morning'), o('Bored daytime'), o('After stress'), o('Can’t sleep'), o('Weekends'), o('Drinking'), o('Home alone'), o('Phone in bed')] }],
  ['emotions', { kind: 'grid', multi: true, title: 'What feeling is most often underneath it?', options: [o('Loneliness'), o('Anxiety'), o('Boredom'), o('Low mood'), o('Anger'), o('Numbness'), o('Habit'), o('Desire')] }],
  ['places', { kind: 'grid', multi: true, title: 'Where does it usually happen?', options: [o('Bedroom'), o('Bathroom'), o('Desk'), o('Living room'), o('My phone'), o('Away')] }],
  // Section 3 · How you've been feeling lately
  ['energy', { title: 'How are your energy and drive most days?', options: [o('Running on empty most of the time'), o('Low more often than not'), o('Up and down'), o('Generally good')] }],
  ['meaning', { title: 'How much sense of purpose do you feel right now?', options: [o('I feel pretty lost'), o('Some, but it feels thin'), o('It comes and goes'), o('I’m clear on what matters to me', 15.5)] }],
  ['connection', { title: 'How connected do you feel to the people around you?', options: [o('Pretty isolated'), o('A few people, but I feel distant'), o('Reasonably connected'), o('Strongly connected')] }],
  // Section 4 · A little about your life
  ['age', { title: 'Your age range.', options: [o('Under 18'), o('18 to 24'), o('25 to 34'), o('35 to 44'), o('45 or older')] }],
  ['relationship', { title: 'Relationship status.', options: [o('Single'), o('Dating or in a relationship'), o('Married or living with a partner'), o('It’s complicated')] }],
  ['alone', { title: 'Do you have a lot of unstructured time alone?', options: [o('Yes, most days'), o('Sometimes'), o('Rarely')] }],
  ['framing', { title: 'Does faith or a moral code play a part in why you want to stop?', options: [o('Yes, it’s central for me'), o('Somewhat'), o('No — my reasons are practical'), o('Prefer not to say')] }],
  // Section 5 · What you want
  ['goalPorn', { title: 'What is your goal with porn?', options: [o('Quit it completely'), o('Cut it down a lot'), o('Keep it to a level I set myself'), o('Not sure yet — I want to explore', 15.5)] }],
  ['goalMast', { title: 'And masturbation?', options: [o('Stop that too — a full reset'), o('Keep it, just without porn'), o('Cut it down'), o('I’m not trying to change that')] }],
  ['tried', { kind: 'check', multi: true, title: 'What have you already tried?', options: [o('Blockers or filters'), o('Going cold turkey'), o('An accountability partner'), o('Deleting accounts or apps'), o('Therapy or counselling'), o('Replacing it with other habits'), o('Nothing structured yet')] }],
  ['readiness', { title: 'How ready do you feel to change right now?', options: [o('Just exploring'), o('Thinking about it'), o('Ready to start'), o('Already started — I want structure', 15.5)] }],
  // Section 6 · How you want the plan to run
  ['load', { title: 'How much do you want to do each day?', options: [o('One small lesson'), o('A lesson plus a task'), o('As much as I can'), o('Just the bad-day tools for now')] }],
  ['checkins', { kind: 'check', multi: true, title: 'When should we check in with you?', options: [o('Morning'), o('Midday'), o('Evening'), o('Late night — my danger zone'), o('No reminders')] }],
  // A quick wellbeing check
  ['impact', { title: 'Is this affecting your sleep, work, relationships, or money?', options: [o('Not really'), o('A little'), o('Quite a bit'), o('A lot')] }],
  ['coping', { title: 'Are you using porn mainly to cope with something heavy right now?', options: [o('No'), o('Maybe'), o('Yes')] }],
  ['mood', { title: 'In the last two weeks, how often have you felt down or hopeless?', options: [o('Not at all'), o('Some days'), o('Most days'), o('Nearly every day')] }],
  // The three that name him
  ['name', { kind: 'text', title: 'What should we call you?', options: [] }],
  ['ageYears', { kind: 'number', title: 'How old are you?', note: 'This helps us show how the pattern could develop over time.', options: [] }],
  ['gender', { skip: true, title: 'How do you describe your gender?', note: 'Optional — it never changes your projection.', options: [o('Male'), o('Female'), o('Non-binary'), o('Another identity'), o('Prefer not to say')] }],
];

/**
 * The seven section intros (V3 — Section 1..7).
 *
 * Twenty-three questions in a row reads as an interrogation. These break it
 * into six named stretches plus a gentler wellbeing coda, and each one says
 * what the next few questions are for — the difference between being processed
 * and being asked.
 */
export const O3_SECTIONS: { at: number; eyebrow: string; title: string; body: string }[] = [
  { at: 0, eyebrow: 'Section 1 of 6', title: 'Where you\u2019re starting', body: 'The honest baseline. None of this is graded.' },
  { at: 4, eyebrow: 'Section 2 of 6', title: 'When and why it happens', body: 'This is where the plan gets specific to you. Pick everything that fits.' },
  { at: 7, eyebrow: 'Section 3 of 6', title: 'How you\u2019ve been feeling lately', body: 'A bigger picture than the habit alone. It often points at what\u2019s really driving things.' },
  { at: 10, eyebrow: 'Section 4 of 6', title: 'A little about your life', body: 'So the plan fits your actual days, not a generic user.' },
  { at: 14, eyebrow: 'Section 5 of 6', title: 'What you want', body: 'Your goal, in your words. Porn and masturbation are two separate choices \u2014 you set each.' },
  { at: 18, eyebrow: 'Section 6 of 6', title: 'How you want the plan to run', body: 'The settings. Easy to change any time.' },
  { at: 20, eyebrow: 'Almost done', title: 'A quick wellbeing check', body: 'A few gentle questions. Not a test, not a diagnosis \u2014 your answers stay private.' },
];

export function O3SectionIntro({ section, next }: { section: (typeof O3_SECTIONS)[number]; next: () => void }) {
  // the intro repeats the field and rule of the question it opens
  useO3Field(O3_SECTION_FIELD[O3_SECTIONS.findIndex((s) => s.at === section.at)] ?? null);
  return (
    <>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 254, fontSize: 13, letterSpacing: 0.3, color: 'rgba(244,243,240,0.55)' }]}>
        {section.eyebrow}
      </AppText>
      <AppText center style={[sans('500'), { position: 'absolute', left: 36, right: 36, top: 284, fontSize: 26, lineHeight: 33.8, letterSpacing: -0.2, color: INK }]}>
        {section.title}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 366, fontSize: 15.5, lineHeight: 24, color: 'rgba(244,243,240,0.7)' }]}>
        {section.body}
      </AppText>
      <O3CTA size="md" label="Continue" onClick={next} style={{ position: 'absolute', left: 24, right: 24, bottom: O3_MD_CTA_BOTTOM }} />
    </>
  );
}

/** How many of the thirty cells the projection's arithmetic starts from. */
const marks = (days: string) => days.split('').filter((c) => c === '1').length;

/** 098 — how many times, in the last thirty days. Where the projection starts. */
export function O3CurrentPattern({ next }: { answers?: Record<string, string | string[]>; next: () => void }) {
  return (
    <>
      <O3PaperTally eyebrow="Your current pattern" value={marks(LAST_30)} unit="times in the last 30 days" />
      <O3PaperCard top={246} height={232}>
        <MonthGrid days={LAST_30} />
      </O3PaperCard>
      <O3PaperCaption top={498}>This is where the projection begins.</O3PaperCaption>
      <O3PaperCTA label="Next" onPress={next} y={744} />
    </>
  );
}

/**
 * 102 — the turn. Three screens of arithmetic have just been run at someone;
 * this is the one that says the arithmetic is a projection and not a sentence,
 * and it says it by clearing the year grid a cell at a time.
 */
export function O3Reversal({ next, back }: { next: () => void; back: () => void }) {
  // the caption waits out the clearing and then arrives, on the frame's own 5s
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 900, delay: REVERSAL_CAPTION_DELAY_MS, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [fade]);
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 94, fontSize: 26, letterSpacing: -0.2, color: '#1D1C1A' }]}>
        But this can change.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 140, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
        This is a projection of your current pattern. It is not your future.
      </AppText>
      <O3PaperCard top={212} height={240}>
        <YearGrid days={NEXT_365} clearing />
      </O3PaperCard>
      <Animated.View style={{ position: 'absolute', left: 44, right: 44, top: 480, opacity: fade }}>
        <AppText center style={[sans('400'), { fontSize: 14, lineHeight: 21, color: '#55534E' }]}>
          Every time you interrupt the pattern, you change the shape of the year.
        </AppText>
      </Animated.View>
      <O3PaperCTA label="Change the pattern" onPress={next} y={744} />
      <O3PaperLink label="Review my projection" onPress={back} y={812} />
    </>
  );
}

/** 096 — the handover: the questionnaire is done and the plan exists. */
export function O3PlanReady({ next, back }: { next: () => void; back: () => void }) {
  return (
    <>
      <View style={{ position: 'absolute', left: '50%', marginLeft: -130, top: 96 }}>
        <PlanReadyArt />
      </View>
      <AppText center style={[sans('500'), { position: 'absolute', left: 36, right: 36, top: 418, fontSize: 24, lineHeight: 32, letterSpacing: -0.1, color: '#1D1C1A' }]}>
        Your plan is ready.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 468, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
        Built from your answers — it re-tunes as you log.
      </AppText>
      <O3PaperCTA label="See my plan" onPress={next} y={688} h={56} />
      <O3PaperLink label="Change an answer" onPress={back} y={764} />
    </>
  );
}

/**
 * 90A / 90B · The two things handed over at the end of the vow: the letter
 * sealed on day zero, and the first medallion. Both offer a way to decline
 * gracefully — a keepsake pressed on someone is not a keepsake.
 */
export function O3Handover({
  kind,
  next,
  name,
}: {
  kind: 'letter' | 'medallion';
  next: () => void;
  name?: string;
}) {
  const tone = useTone();
  const letter = kind === 'letter';
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 30 }}>
        <View style={{ alignItems: 'center' }}>
          {letter ? (
            <Svg width={72} height={54} viewBox="0 0 72 54" fill="none">
              <Rect x={1.5} y={1.5} width={69} height={51} rx={6} stroke={tone.ink2} strokeWidth={2} />
              <Path d="M4 6l32 24L68 6" stroke={tone.ink2} strokeWidth={2} strokeLinejoin="round" />
            </Svg>
          ) : (
            <Laurel size={60} color={tone.ink} muted />
          )}
        </View>
        <O3H size={28} style={{ marginTop: 30 }}>{letter ? 'A letter arrived.' : 'You earned a medallion.'}</O3H>
        <AppText center style={[sans('400'), { marginTop: 20, paddingHorizontal: 18, fontSize: 15.5, lineHeight: 24, color: tone.ink2 }]}>
          {letter
            ? 'From the man at week XII — sealed the night you started.'
            : `Vici, tier I${name ? '' : ''} — the first one ridden. Each one shortens the next.`}
        </AppText>
      </View>
      <O3CTA label={letter ? 'Open it' : 'Take it'} onClick={next} />
      <PressScale onPress={next} accessibilityRole="button" style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
        <AppText style={[sans('500'), { fontSize: 14.5, color: tone.ink3 }]}>
          {letter ? 'Save it for tonight' : 'Put it on the shelf'}
        </AppText>
      </PressScale>
    </>
  );
}

/**
 * 103 — "Streaks reset." Three climbs, each shorter than the last, each ending
 * on a cross at zero. The frame that used to carry both halves of the argument
 * now carries only this one; 104 answers it.
 */
export function O3Streaks({ next }: { answers?: Record<string, string | string[]>; next: () => void }) {
  return (
    <>
      <O3PaperH top={116} inset={40}>Streaks reset.</O3PaperH>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 210 }}>
        <StreakSawtoothCard />
      </View>
      <O3PaperCaption top={456} inset={52}>Fourteen days, then nine, then five — every reset lands on zero.</O3PaperCaption>
      <O3PaperCTA label="Next" onPress={next} y={744} />
    </>
  );
}

/** 104 — "Campaigns don’t." The same six weeks as one line that never resets. */
export function O3CampaignLine({ next }: { next: () => void }) {
  return (
    <>
      <O3PaperH top={116} inset={40}>Campaigns don’t.</O3PaperH>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 210 }}>
        <CampaignLineCard />
      </View>
      <O3PaperCaption top={456} inset={52}>A slip costs a day, not the campaign — it never returns to zero.</O3PaperCaption>
      <O3PaperCTA label="Next" onPress={next} y={744} />
    </>
  );
}

/**
 * 095 · Enlisting the Aegis — the charting pause. The frame is one long wash
 * from #131313 at the crown to white at the foot, with the sunrise disc rising
 * through the bottom edge: the night the questions were asked in becoming the
 * daylight the reading is handed over in. Full-screen; owns its background.
 *
 * The canvas draws the mid-state — two steps ticked, the third still turning,
 * the bar 186 of its 311 across. Here the three steps tick in turn and the bar
 * runs the whole way, ending exactly where the frame's own numbers put it.
 */
const AEGIS_STEPS = ['Reading your answers', 'Mapping your risky window', 'Choosing your first week'] as const;
const AEGIS_MS = 6800;

export function O3ReadingPause({ next }: { answers?: Record<string, string | string[]>; next: () => void }) {
  const [done, setDone] = useState(0);
  const bar = useRef(new Animated.Value(0.04)).current;
  useEffect(() => {
    Animated.timing(bar, { toValue: 1, duration: AEGIS_MS - 400, easing: Easing.bezier(0.25, 0.6, 0.3, 1), useNativeDriver: false }).start();
    const ticks = [1, 2, 3].map((k) => setTimeout(() => setDone(k), (AEGIS_MS / 3.4) * k));
    const id = setTimeout(next, AEGIS_MS);
    return () => {
      ticks.forEach(clearTimeout);
      clearTimeout(id);
    };
  }, [next, bar]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <AegisField />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 96, fontSize: 15, color: 'rgba(244,243,240,0.8)' }]}>
            Charting your plan. One moment.
          </AppText>
          <View style={{ position: 'absolute', left: 41, top: 123, width: 311, height: 3, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.25)', overflow: 'hidden' }}>
            <Animated.View style={{ height: 3, borderRadius: 2, backgroundColor: '#F4F3F0', width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 208, alignItems: 'center', gap: 16 }}>
            {AEGIS_STEPS.map((label, i) => {
              const ticked = i < done;
              return (
                <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {ticked ? <AegisCheck /> : <AegisSpinner />}
                  <AppText style={[sans('500'), { fontSize: 15.5, color: ticked ? '#F4F3F0' : 'rgba(244,243,240,0.75)' }]}>{label}</AppText>
                </View>
              );
            })}
          </View>
          <AppText center style={[sans('500'), { position: 'absolute', left: 20, right: 20, top: 380, fontSize: 20, lineHeight: 31, letterSpacing: 0.1, color: '#2A2924' }]}>
            From the dark hours to first light — your plan guards the risky window first.
          </AppText>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ═════ THE ROOT — the loop, drawn from their answers ═════════════════
const O3_ISSUE: Record<string, { kind: 'feel' | 'auto'; word: string }> = {
  'Loneliness': { kind: 'feel', word: 'loneliness' },
  'Anxiety': { kind: 'feel', word: 'anxiety' },
  'Boredom': { kind: 'feel', word: 'boredom' },
  'Low mood': { kind: 'feel', word: 'low mood' },
  'Anger': { kind: 'feel', word: 'anger' },
  'Numbness': { kind: 'feel', word: 'numbness' },
  'Habit': { kind: 'auto', word: 'autopilot' },
  'Desire': { kind: 'auto', word: 'wiring' },
};
function o3Issue(a: Record<string, string | string[]>): { kind: 'feel' | 'auto'; word: string } {
  const list = (a.emotions as string[]) || [];
  for (const e of list) {
    const hit = O3_ISSUE[e];
    if (hit && hit.kind === 'feel') return hit;
  }
  return O3_ISSUE[list[0]] || { kind: 'feel', word: 'restlessness' };
}
const orCap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** 097 — the loop the answers describe, named station by station. */
export function O3Root({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const name = String(answers.name || '').trim();
  const issue = o3Issue(answers);
  const t = ((answers.triggers as string[]) || []).slice(0, 2).map((x) => x.toLowerCase());
  const when = t.length ? t.join(', ') : 'the same hours each time';
  const feel = issue.kind === 'feel';
  const head = feel
    ? `Porn isn’t the problem${name ? `, ${name}` : ''}. It’s your anesthetic for ${issue.word}.`
    : `Porn isn’t a decision${name ? `, ${name}` : ''}. It’s a loop on autopilot.`;
  const stations: [string, string, string, string] = feel
    ? [`the ${issue.word} rises`, 'the escape', 'minutes of relief', 'back — deeper']
    : ['the cue', 'autopilot', 'the release', 'the groove deepens'];
  const caption = feel
    ? `${orCap(when)} — the ${issue.word} rises, relief lasts minutes, and the loop turns again.`
    : `The cue arrives — ${when} — and the hands run the loop without you.`;
  return (
    <>
      <O3PaperH top={112} inset={36}>{head}</O3PaperH>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 262 }}>
        <RootLoopCard stations={stations} />
      </View>
      <O3PaperCaption top={512}>{caption}</O3PaperCaption>
      <O3PaperCTA label="Follow it forward" onPress={next} y={744} />
    </>
  );
}

// ═════ IF NOTHING CHANGES — three projection pages ═══════════════════
// the next month · the next year · the rest of a life. Same geometry on
// every page: a counting numeral, a grid of day-cells, one caption line.

/** Eased numeral count-up (cubic out, 1.5s). */
function useCountUp(n: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / 1500);
      setV(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);
  return v;
}

/**
 * 099 · 100 · 101 — the projection, one horizon per page.
 *
 * The frames are the argument, so the grids are read off them rather than
 * generated: nine of the next thirty days, a hundred and ten of the next three
 * hundred and sixty-five, and the years from now to eighty as one stack of
 * hairlines. The numerals follow the grids — nine, a hundred and ten, and
 * 365 × 9/30 a year for the years that are left — so a page can never say one
 * thing and draw another.
 */
const AGE_END = 80;
const AGE_DEFAULT = 24;

export function O3CostPage({ answers, next, h }: { answers: Record<string, string | string[]>; next: () => void; h: 1 | 2 | 3 }) {
  const typed = parseInt(String(answers.ageYears || ''), 10);
  const age = Number.isFinite(typed) && typed > 0 && typed < AGE_END ? typed : AGE_DEFAULT;
  const years = AGE_END - age;
  const perYear = 365 * (marks(LAST_30) / 30);

  if (h === 3) {
    return (
      <>
        <O3PaperTally eyebrow="If nothing changes" value={Math.round(perYear * years)} unit={`more times by age ${AGE_END}`} />
        <View style={{ position: 'absolute', left: 24, right: 24, top: 246 }}>
          <ByAge80Card from={age} />
        </View>
        <O3PaperCaption top={526}>Small patterns repeated over decades become part of a life.</O3PaperCaption>
        <O3PaperCTA label="Next" onPress={next} y={744} />
      </>
    );
  }
  if (h === 2) {
    return (
      <>
        <O3PaperTally eyebrow="If nothing changes" value={marks(NEXT_365)} unit="times in the next 365 days" />
        <O3PaperCard top={246} height={242} gap={12}>
          <YearGrid days={NEXT_365} />
          <O3CardNote>Projection based on your current pace</O3CardNote>
        </O3PaperCard>
        <O3PaperCaption top={498}>A repeated night slowly becomes a year-long pattern.</O3PaperCaption>
        <O3PaperCTA label="Next" onPress={next} y={744} />
      </>
    );
  }
  return (
    <>
      <O3PaperTally eyebrow="If nothing changes" value={marks(NEXT_30)} unit="times in the next 30 days" />
      <O3PaperCard top={246} height={248} gap={14}>
        <MonthGrid days={NEXT_30} />
        <O3CardNote>Based on your last 30 days</O3CardNote>
      </O3PaperCard>
      <O3PaperCaption top={498}>At your current pace, the next month may look much like the last.</O3PaperCaption>
      <O3PaperCTA label="Next" onPress={next} y={744} />
    </>
  );
}

/** The trigger line the summary card leads with, in his own words where given. */
function busiestTrigger(a: Record<string, string | string[]>): string {
  const picked = ((a.triggers as string[]) || []).slice(0, 2);
  if (!picked.length) return 'Late nights, weekends';
  return picked.join(', ').replace(/^./, (c) => c.toUpperCase());
}

/** 106 — the week, drawn: which two nights the plan watches first. */
const PEAK_NIGHTS = [4, 5];
const PEAK_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function O3Pattern({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: 104, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        Your pattern, mapped.
      </AppText>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 214 }}>
        <UrgesByNightCard peaks={PEAK_NIGHTS} />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 486 }}>
        <MostActiveTriggerCard trigger={busiestTrigger(answers)} />
      </View>
      <AppText style={[sans('400'), { position: 'absolute', left: 26, right: 26, top: 594, fontSize: 15, lineHeight: 22, color: '#55534E' }]}>
        Your risky window is {PEAK_NAMES[PEAK_NIGHTS[0]]} and {PEAK_NAMES[PEAK_NIGHTS[1]]} night. We&apos;ll pay gentle attention there first.
      </AppText>
      <O3PaperCTA label="See what's ahead" onPress={next} y={764} ls={0.3} />
    </>
  );
}


function RouteMap() {
  const w = 344;
  const h = 268;
  const route = 'M30 218 C 62 214 88 208 112 196 C 140 182 152 168 176 152 C 198 137 214 128 238 112 C 262 96 280 78 300 56';
  const st: [number, number][] = [[30, 218], [62, 213], [96, 203], [128, 188], [160, 163], [190, 143], [220, 124], [248, 105], [276, 82], [300, 56]];
  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <Path d={`M0 150 L70 118 L128 142 L196 92 L252 118 L${w} 84 L${w} ${h} L0 ${h} Z`} fill={SC.far} />
      <Path d="M196 92 L252 118 L196 130 Z" fill={SC.farShade} />
      <Path d={`M0 190 L58 168 L118 182 L188 136 L244 152 L300 56 L330 96 L${w} 88 L${w} ${h} L0 ${h} Z`} fill={SC.midLit} />
      <Path d="M300 56 L330 96 L300 104 L268 92 Z" fill={SC.midShade} />
      <Path d="M300 56 L286 78 L300 84 L312 72 Z" fill={SC.snow} />
      <Path d="M188 136 L244 152 L188 160 Z" fill={SC.midShade} />
      <Path d={`M0 214 L48 206 L112 216 L190 190 L258 200 L${w} 170 L${w} ${h} L0 ${h} Z`} fill={SC.nearLit} />
      <Path d="M112 216 L190 190 L190 206 L128 222 Z" fill={SC.nearShade} />
      <Path d={`M0 240 L120 236 L${w * 0.42} 250 L0 ${h} Z`} fill={SC.water} />
      <Path d="M10 236 h30M52 244 h22M20 254 h26" stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" />
      <Path d={route} stroke={colors.bg} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
      <Path d={route} stroke={SC.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
      {st.map(([x, y], i) =>
        i === 0 ? (
          <Circle key={i} cx={x} cy={y} r={5} fill={colors.ink} stroke={colors.bg} strokeWidth={2} />
        ) : (
          <Circle key={i} cx={x} cy={y} r={3.2} fill={colors.bg} stroke={SC.ink} strokeWidth={1.5} />
        ),
      )}
      <Path d="M300 56 V38" stroke={SC.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M300 38 L314 43 L300 48 Z" fill={colors.ink} />
      <SvgText x={24} y={238} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>I</SvgText>
      <SvgText x={128} y={176} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>IV</SvgText>
      <SvgText x={224} y={142} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>VIII</SvgText>
      <SvgText x={312} y={60} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>XII</SvgText>
    </Svg>
  );
}
/**
 * 107 · the campaign map.
 *
 * The first four weeks stacked with week I at the bottom, so the eye starts
 * where he is standing and climbs. Each row is a tile with its own small
 * drawing and its own halo, the light burning a little brighter every week up
 * the stack. That is the whole argument for staying, made without a sentence.
 */
export function O3Reading({ next }: { answers?: Record<string, string | string[]>; next: () => void }) {
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: 72, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        Your first four weeks.
      </AppText>
      {CAMPAIGN_WEEKS.map((_, i) => (
        <CampaignWeekRow key={i} i={i} />
      ))}
      <AppText center style={[sans('400'), { position: 'absolute', left: 26, right: 26, top: 642, fontSize: 15, lineHeight: 22, color: '#55534E' }]}>
        Four weeks, one path. Move at your own pace — there&apos;s no clock.
      </AppText>
      <O3PaperCTA label="Show me my path" onPress={next} y={764} ls={0.3} />
    </>
  );
}

// ═════ 105 · THE REWIRE — how hard urges pull, weeks I–XII ═══════════
export function O3Rewire({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const name = String(answers.name || '').trim();
  const trig = (((answers.triggers as string[]) || [])[0] || 'late night').toLowerCase().replace(/^after /, '');
  return (
    <>
      <O3PaperH top={116} inset={40}>{name ? `${name}, your brain can rewire.` : 'Your brain can rewire.'}</O3PaperH>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 196 }}>
        <RewireCurveCard />
      </View>
      <O3PaperCaption top={440}>
        Twelve weeks of kept days — the {trig} window guarded, urges shorter each week, until an evening is just an evening.
      </O3PaperCaption>
      <O3PaperCTA label="Next" onPress={next} y={744} />
    </>
  );
}

// ── the wave, ridden ─────────────────────────────────────────────────
const WAVE_SECONDS = 20;
const WAVE_PHASES = [
  { at: 0.0, name: 'Notice it', tip: 'Follow the water. Nothing to fight.' },
  { at: 0.24, name: 'It rises', tip: 'Let it build. You are not the wave.' },
  { at: 0.48, name: 'The crest', tip: 'This is as strong as it gets.' },
  { at: 0.68, name: 'It breaks', tip: 'Feel it recede. It always does.' },
  { at: 0.87, name: 'Still water', tip: 'Notice the quiet.' },
];
export function O3Wave({ next }: { next: () => void }) {
  const [stage, setStage] = useState<'intro' | 'surf' | 'after' | 'medal'>('intro');
  const [pi, setPi] = useState(0);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const progressRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (stage !== 'surf') return;
    let mounted = true;
    const t0 = Date.now();
    const loop = () => {
      if (!mounted) return;
      const p = Math.min(1, (Date.now() - t0) / 1000 / WAVE_SECONDS);
      progressRef.current = p;
      let idx = 0;
      for (let k = 0; k < WAVE_PHASES.length; k++) if (p >= WAVE_PHASES[k].at) idx = k;
      setPi((v) => (v === idx ? v : idx));
      if (p >= 1) {
        setStage('after');
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf.current);
    };
  }, [stage]);

  if (stage === 'intro') {
    return (
      <O3Shell bar={false} lit>
        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
          <O3H>Before anything else, learn the one move you’ll use most.</O3H>
          <O3Sub>A craving is a wave. It crests and it breaks, usually inside fifteen minutes. Ride a little water now, and you will know the move for life.</O3Sub>
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Svg width={200} height={64} viewBox="0 0 200 64" fill="none">
              <Path d="M8 44 C 40 20 62 20 92 34 S 152 56 192 26" stroke={colors.text} strokeWidth={2.4} strokeLinecap="round" />
              <Path d="M26 54 h28 M78 56 h20 M140 52 h24" stroke={colors.text} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
            </Svg>
          </View>
        </View>
        <O3CTA label="Begin the wave" onClick={() => setStage('surf')} />
      </O3Shell>
    );
  }

  if (stage === 'surf' || stage === 'after') {
    const after = stage === 'after';
    return (
      <View style={{ flex: 1, backgroundColor: '#131313', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: after ? 0.2 : 1 }}>
          <UrgeWave progressRef={progressRef} onBreathPhaseChange={setBreathPhase} />
        </View>
        {!after ? (
          <View style={{ position: 'absolute', top: 84, left: 0, right: 0, paddingHorizontal: 24, alignItems: 'center' }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 30, letterSpacing: 0.24, color: '#F5F4F1', marginTop: 16 }}>{WAVE_PHASES[pi].name}</AppText>
            <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: 'rgba(245,244,241,0.62)', marginTop: 10, paddingHorizontal: 20 }]}>{WAVE_PHASES[pi].tip}</AppText>
          </View>
        ) : (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
            <Rise delay={0.6}>
              <AppText center style={{ fontFamily: fonts.serif, fontSize: 25, lineHeight: 33, color: '#F5F4F1' }}>
                That is how a craving passes.{'\n'}It crests, and it breaks.{'\n'}You just rode one out.
              </AppText>
            </Rise>
            <View style={{ position: 'absolute', left: 30, right: 30, bottom: 44 }}>
              <Rise delay={1.2}>
                <Pressable onPress={() => setStage('medal')} style={{ backgroundColor: '#F5F4F1', borderRadius: 9999, paddingVertical: 16, alignItems: 'center' }}>
                  <AppText style={[sans('600'), { fontSize: 15, color: '#131313' }]}>Continue</AppText>
                </Pressable>
              </Rise>
            </View>
          </View>
        )}
        {!after ? (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 44, alignItems: 'center' }}>
            <BreathCue phase={breathPhase} color="rgba(245,244,241,0.64)" />
          </View>
        ) : null}
      </View>
    );
  }

  // medal
  return (
    <O3Shell bar={false} lit>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
        <View style={{ marginTop: 34 }}>
          <Medallion size={196} />
        </View>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: colors.text }]}>The First Wave</AppText>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 13.5, color: colors.textSoft, marginTop: 8 }}>
            ridden this day · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </AppText>
        </View>
      </View>
      <O3Note style={{ marginBottom: 13 }}>Medallions are earned by doing. This one is already yours.</O3Note>
      <O3CTA label="Carry it in" onClick={next} />
    </O3Shell>
  );
}

function Medallion({ size = 190 }: { size?: number }) {
  const ink = colors.text;
  return (
    <Svg width={size} height={size} viewBox="0 0 190 190" fill="none">
      <Circle cx={95} cy={95} r={90} stroke={ink} strokeWidth={1.4} strokeDasharray="2.5 6.5" opacity={0.55} />
      <Circle cx={95} cy={95} r={76} stroke={ink} strokeWidth={1.8} />
      <Circle cx={95} cy={95} r={70} stroke={ink} strokeWidth={0.9} opacity={0.6} />
      <Path d="M38 118 C 62 114 76 102 88 82 C 96 68 106 58 118 57 C 138 56 150 70 148 87 C 147 100 136 108 124 104 C 115 101 112 91 118 85 C 122 81 128 82 130 87" stroke={ink} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Path d="M40 126 q 9 -5 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0" stroke={ink} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M56 136 h20 M96 136 h24 M134 136 h14" stroke={ink} strokeWidth={1.2} strokeLinecap="round" opacity={0.55} />
      <Path d="M112 46 l0 -6 M124 45 l2 -6 M136 49 l4 -5" stroke={ink} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

// ── 108 · the vow ────────────────────────────────────────────────────
/** "Jun 9 · Day 0" — the stamp printed under the signature rule. */
function vowStamp(): string {
  const now = new Date();
  return `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Day 0`;
}

export function O3Pledge({ name, next }: { name: string; next: () => void }) {
  const [inked, setInked] = useState(false);
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 76, fontSize: 22, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        The vow.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 120, fontSize: 15.5, lineHeight: 24, color: '#55534E' }]}>
        I&apos;m done letting the wave decide. One evening at a time, I take the watch back.
      </AppText>
      <View style={{ position: 'absolute', left: '50%', marginLeft: -100, top: 198 }}>
        <VowSunArt />
      </View>
      <View style={{ position: 'absolute', left: 36, right: 36, top: 374 }}>
        <VowSignaturePanel name={name} date={vowStamp()} signed={inked} onSign={() => setInked(true)} onClear={() => setInked(false)} />
      </View>
      <O3PaperCTA label="I sign it" onPress={next} y={688} h={54} enabled={inked} />
      {/* reading it again means signing it again — the link lifts the ink */}
      <O3PaperLink label="Read it once more" onPress={() => setInked(false)} y={760} />
    </>
  );
}

// ── letter ───────────────────────────────────────────────────────────
/** The week-XII letter, assembled from the user's own intake answers
 * (canvas: O3_Letter) — the fork where he and the other ending part ways. */
export function buildWeekXiiLetter(a: Record<string, string | string[]>): { name: string; paragraphs: string[] } {
  const name = String(a.name || '').trim();
  const t = (a.triggers as string[]) || [];
  const trigLine = t.includes('Late night')
    ? 'The late nights'
    : t.includes('Home alone')
      ? 'The long stretches alone'
      : t.includes('After stress')
        ? 'The hard-day evenings'
        : t.includes('Bored daytime')
          ? 'The slack afternoons'
          : 'The old window';
  const emos = ((a.emotions as string[]) || []).slice(0, 2).map((x) => x.toLowerCase());
  const emoLine = emos.length >= 2 ? `the ${emos[0]} and the ${emos[1]}` : emos.length ? `the ${emos[0]}` : 'the restlessness';
  const costs = a.impact === 'Not really' ? 'the hours, the energy, the quiet' : 'the sleep, the work, the relationships, the money';
  const prize = ['the focus', 'the evenings'];
  return {
    name,
    paragraphs: [
      "It's week XII where I'm writing from, and the first thing to say is: we made it out.",
      `${trigLine} stopped being dangerous around week IV. The urges still came — they just got shorter, then quieter, then rare.`,
      `There was another ending — the one where it kept feeding on ${costs}, and ${emoLine} stayed in charge. I never met that man. Tonight is the fork where he and I part ways.`,
      `Everything you circled tonight (${prize.join(', ')}) came back. It's here, waiting.`,
    ],
  };
}

export function O3Letter({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const { name, paragraphs } = buildWeekXiiLetter(answers);
  return (
    <>
      <O3H size={23} style={{ marginTop: 10 }}>A letter from the man at week XII.</O3H>
      <View style={{ flex: 1, marginTop: 18, backgroundColor: '#F7F7F6', borderRadius: 18, overflow: 'hidden' }}>
        {/* fold crease */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: '34%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 18 }} showsVerticalScrollIndicator={false}>
          <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 22, lineHeight: 26, color: '#242424', marginBottom: 14 }}>
            {name ? `${name} —` : 'Friend —'}
          </AppText>
          {paragraphs.map((para, i) => (
            <AppText key={i} style={{ fontFamily: fonts.serifSharp, fontSize: 15.5, lineHeight: 25, color: '#3A3A3A', marginBottom: 14 }}>
              {para}
            </AppText>
          ))}
          <View style={{ marginTop: 4, gap: 3 }}>
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 17.5, color: '#242424' }}>— you, at week XII</AppText>
            <Svg width={130} height={11} viewBox="0 0 130 11" fill="none">
              <Path d="M2 7 C 30 2, 50 9, 74 5.5 S 116 4, 128 6.5" stroke="rgba(38,38,31,0.5)" strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
          </View>
        </ScrollView>
      </View>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label="Take his letter with you" onClick={next} />
      </View>
    </>
  );
}

// ── Day I ────────────────────────────────────────────────────────────
function windowFor(a: Record<string, string | string[]>): [string, string] {
  const t = (a.triggers as string[]) || [];
  if (t.includes('Late night') || t.includes('Phone in bed') || t.includes('Can’t sleep')) return ['11:00 pm', 'before the tide rises'];
  if (t.includes('After stress')) return ['6:00 pm', 'as the day lets go'];
  if (t.includes('Bored daytime')) return ['9:00 pm', 'when the evening goes slack'];
  return ['9:30 pm', 'before the quiet hours'];
}
export function O3DayOne({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const [time, why] = windowFor(answers);
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
        <AppText style={[sans('600'), { fontSize: 15, letterSpacing: 4, textTransform: 'uppercase', color: tone.ink }]}>Day I</AppText>
        <View style={{ width: 40, height: 1.5, backgroundColor: tone.ink, marginTop: 12 }} />
        <O3Sub style={{ marginTop: 26, fontSize: 15, color: tone.ink }}>Already lit. The wave you rode counts.</O3Sub>
        <O3Sub style={{ marginTop: 8 }}>Days are counted, never owed. A slip does not send you to zero.</O3Sub>
        <View style={{ marginTop: 34, backgroundColor: tone.card, borderRadius: 20, padding: 20, flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}>
          <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
            <Path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke={tone.ink} strokeWidth={1.7} strokeLinejoin="round" />
            <Path d="M9.8 18.8a2.2 2.2 0 0 0 4.4 0" stroke={tone.ink} strokeWidth={1.7} />
          </Svg>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('600'), { fontSize: 14, color: tone.ink }]}>A quiet word at {time}</AppText>
            <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: tone.ink2, marginTop: 3 }]}>Your window, {why}. One line, once a day. Never “your streak misses you.”</AppText>
          </View>
        </View>
      </View>
      <O3CTA label="Set the quiet word" onClick={next} />
      <O3CTA ghost label="You can ask for it later" onClick={next} />
    </>
  );
}

// ── notification permission (pre-screened) ───────────────────────────
export function O3Notify({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const [ask, setAsk] = useState(false);
  const [time] = windowFor(answers);
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <O3H size={24}>Your phone will ask its own question now.</O3H>
        <O3Sub>Allowing it turns on one thing: the {time} word you just asked for. Nothing else, ever.</O3Sub>
        <View style={{ marginTop: 28, backgroundColor: tone.card, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start', transform: [{ rotate: '-1.5deg' }] }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: tone.fill, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={18} height={12} viewBox="0 0 34 20" fill="none">
              <Path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke={tone.onFill} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <AppText style={[sans('600'), { fontSize: 13, color: tone.ink }]}>VICI</AppText>
              <AppText style={[sans('500'), { fontSize: 10.5, color: tone.ink3 }]}>{time}</AppText>
            </View>
            <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 18, color: tone.ink2, marginTop: 2 }]}>The tide is rising. You know the move.</AppText>
          </View>
        </View>
      </View>
      <O3CTA label="Continue" onClick={() => setAsk(true)} />
      {ask ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(19,19,19,0.32)', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View style={{ width: 268, borderRadius: 16, backgroundColor: '#F6F5F2', overflow: 'hidden' }}>
            <View style={{ padding: 20, paddingBottom: 16, alignItems: 'center' }}>
              <AppText center style={{ fontFamily: fonts.body, fontWeight: '600', fontSize: 15.5, color: '#111' }}>“VICI” Would Like to Send You Notifications</AppText>
              <AppText center style={{ fontFamily: fonts.body, fontSize: 12.5, color: '#4B4B4B', marginTop: 7, lineHeight: 17 }}>One quiet word a day, at the time you chose.</AppText>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 0.8, borderTopColor: 'rgba(0,0,0,0.16)' }}>
              <Pressable onPress={next} style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderRightWidth: 0.8, borderRightColor: 'rgba(0,0,0,0.16)' }}>
                <AppText style={{ fontFamily: fonts.body, fontSize: 15.5, color: '#0A66C2' }}>Don’t Allow</AppText>
              </Pressable>
              <Pressable onPress={next} style={{ flex: 1, paddingVertical: 13, alignItems: 'center' }}>
                <AppText style={{ fontFamily: fonts.body, fontWeight: '600', fontSize: 15.5, color: '#0A66C2' }}>Allow</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}

// ── save ─────────────────────────────────────────────────────────────
export function O3Save({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <O3H style={{ marginTop: 24 }}>Save your progress.</O3H>
      <O3Sub>Your reflections, your log, your path — kept safe across devices.</O3Sub>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 126, height: 126, borderRadius: 63, backgroundColor: tone.card, alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${tone.line}` }}>
          <Laurel size={88} color={tone.ink} />
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <O3CTA label="Continue with Apple" onClick={next} />
        {['Continue with Google', 'Continue with email'].map((label) => (
          <PressScale key={label} onPress={next} style={{ minHeight: 56, borderRadius: 28, backgroundColor: tone.card, alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${tone.soft2}` }}>
            <AppText style={[sans('600'), { fontSize: 16.5, color: tone.ink }]}>{label}</AppText>
          </PressScale>
        ))}
        <O3Note>By continuing, you agree to our terms of service and privacy policy.</O3Note>
      </View>
    </>
  );
}

// ── paywall ──────────────────────────────────────────────────────────
function O3PlanRow({ tone, on, name, price, note, onPress }: { tone: Tone; on: boolean; name: string; price: string; note: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: tone.card, borderRadius: 18, padding: 16, borderWidth: on ? 1.7 : 0, borderColor: tone.ink }}>
      <View style={{ width: 19, height: 19, borderRadius: 9999, borderWidth: on ? 0 : 1.6, borderColor: tone.soft2, backgroundColor: on ? tone.fill : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {on ? (
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path d="M4.5 12.5l4.6 4.6L19.5 7" stroke={tone.onFill} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={[sans('600'), { fontSize: 14.5, color: tone.ink }]}>{name}</AppText>
        <AppText style={[sans('400'), { fontSize: 12, color: tone.ink2, marginTop: 2 }]}>{note}</AppText>
      </View>
      <AppText style={[sans('600'), { fontSize: 15.5, color: tone.ink }]}>
        {price}
        <AppText style={[sans('400'), { fontSize: 11.5, color: tone.ink3 }]}>/yr</AppText>
      </AppText>
    </Pressable>
  );
}

export function O3Paywall({ answers, next, onFree }: { answers: Record<string, string | string[]>; next: () => void; onFree: () => void }) {
  const tone = useTone();
  const [plan, setPlan] = useState<'plus' | 'coach'>('plus');
  const prize = ((answers.prize as string[]) || []).slice(0, 3).map((x) => x.toLowerCase());
  return (
    <>
      <O3Eyebrow>Vici Plus</O3Eyebrow>
      <O3H size={24} style={{ marginTop: 10 }}>The full campaign, to week XII.</O3H>
      <ScrollView style={{ flex: 1, marginTop: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: tone.card, borderRadius: 20, padding: 14 }}>
          <RouteMap />
        </View>
        <View style={{ marginTop: 14, paddingHorizontal: 18, backgroundColor: tone.card, borderRadius: 18 }}>
          {[
            ['All ten grounds', 'the campaign past the Landing'],
            ['Insights', prize.length ? `read off your logs: ${prize.join(', ')}` : 'read off your own logs'],
            ['Medallions & letters', 'earned, kept, delivered'],
          ].map(([t, s], i, arr) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingVertical: 11.5, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: tone.line }}>
              <View style={{ width: 5, height: 5, borderRadius: 9999, backgroundColor: tone.ink }} />
              <AppText style={[sans('600'), { fontSize: 13, color: tone.ink }]}>{t}</AppText>
              <AppText style={[sans('400'), { flex: 1, fontSize: 12, color: tone.ink2 }]}>{s}</AppText>
            </View>
          ))}
        </View>
        <View style={{ gap: 9, marginTop: 14 }}>
          <O3PlanRow tone={tone} on={plan === 'plus'} name="Plus" price="$39.99" note="The full campaign" onPress={() => setPlan('plus')} />
          <O3PlanRow tone={tone} on={plan === 'coach'} name="Plus, with coach" price="$99.99" note="A human in your corner, weekly" onPress={() => setPlan('coach')} />
        </View>
      </ScrollView>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label={plan === 'coach' ? 'Continue · $99.99 a year' : 'Continue · $39.99 a year'} onClick={next} />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Pressable onPress={onFree} style={{ borderWidth: 1.4, borderColor: tone.soft2, borderRadius: 9999, paddingVertical: 11, paddingHorizontal: 24 }}>
            <AppText style={[sans('600'), { fontSize: 13.5, color: tone.ink }]}>Continue with the free tools</AppText>
          </Pressable>
        </View>
        <O3Note style={{ marginTop: 11 }}>Price is the price: no timers, no “deals.”</O3Note>
      </View>
    </>
  );
}
