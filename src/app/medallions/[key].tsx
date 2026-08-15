import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useId } from 'react';
import { ScrollView, Share, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { KKMedallion, KK_METALS, kkFace, kkReached, kkRoman, kkRung, type KKMetal } from '@/components/keepsakes/Medallion';
import { AppText, EmptyState, PressScale } from '@/components/ui';
import { colors, sans } from '@/lib/theme';

/**
 * 024–028 · One medallion, at one treatment.
 *
 * The page takes the colour of the metal: Paper is the plain board, the three
 * middle metals warm or cool it and float a single light behind the disc, and
 * Platinum turns the whole thing to night. Under the coin sits the rung it
 * stands on, and one card saying what that rung is worth — or what waits, if
 * nothing has been struck yet. The tier ladder the old canvas drew between them
 * is gone: the metal is the ladder.
 *
 * Canvas y − 54 throughout (the frame's status bar is the safe-area top inset).
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** A soft light behind the disc. `top` is in content coords; `bottom` hangs off the screen. */
type Glow = { w: number; h: number; top?: number; bottom?: number; rgb: string; a: number; stop: number };

type Skin = {
  /** the board: one colour on Paper, a two-stop wash on every metal */
  page: string | [string, string];
  /** the ring of board colour the disc is mounted in */
  mount: string;
  glows: Glow[];
  noise: number;
  /** the canvas lays the noise twice on the light boards and once on the dark one */
  noiseLayers: number;
  chrome: string;
  title: string;
  body: string;
  pill: { bg: string; ring: string; ink: string };
  card: { bg: string; ring: string; title: string; body: string };
  cta: { bg: string; ink: string };
  back: string;
  bar: 'dark' | 'light';
};

// Four of the five boards are light and share one palette exactly.
const LIGHT = {
  chrome: '#55534E',
  title: '#1D1C1A',
  body: '#55534E',
  pill: { bg: '#FFFFFF', ring: 'rgba(0,0,0,0.1)', ink: '#55534E' },
  card: { bg: '#FFFFFF', ring: 'rgba(0,0,0,0.06)', title: '#1D1C1A', body: '#55534E' },
  cta: { bg: '#131313', ink: '#FFFFFF' },
  back: '#55534E',
  bar: 'dark' as const,
  noise: 0.07,
  noiseLayers: 2,
};

const SKIN: Record<KKMetal, Skin> = {
  paper: { ...LIGHT, page: '#F4F3F0', mount: '#F4F3F0', glows: [] },
  bronze: {
    ...LIGHT,
    page: ['#F4EBDF', '#EEDEC7'],
    mount: '#F2E8DA',
    glows: [{ w: 340, h: 340, top: 6, rgb: '#B87F4C', a: 0.3, stop: 0.74 }],
  },
  silver: {
    ...LIGHT,
    page: ['#F4F5F6', '#EBEDF0'],
    mount: '#F1F2F4',
    glows: [{ w: 340, h: 340, top: 6, rgb: '#96A0AC', a: 0.3, stop: 0.74 }],
  },
  gold: {
    ...LIGHT,
    page: ['#F7EEDA', '#F2E2BC'],
    mount: '#F5EBD2',
    glows: [
      { w: 400, h: 400, top: -14, rgb: '#E2BA78', a: 0.55, stop: 0.74 },
      { w: 520, h: 440, bottom: -220, rgb: '#FFECC4', a: 0.6, stop: 0.72 },
    ],
  },
  platinum: {
    page: ['#171715', '#26251F'],
    mount: '#201F1C',
    glows: [
      { w: 420, h: 420, top: -24, rgb: '#EBF0F8', a: 0.13, stop: 0.74 },
      { w: 560, h: 460, bottom: -240, rgb: '#E2BA78', a: 0.12, stop: 0.72 },
    ],
    noise: 0.12,
    noiseLayers: 1,
    chrome: 'rgba(244,243,240,0.75)',
    title: '#F4F3F0',
    body: 'rgba(244,243,240,0.75)',
    pill: { bg: 'rgba(255,255,255,0.09)', ring: 'rgba(255,255,255,0.22)', ink: 'rgba(244,243,240,0.55)' },
    card: { bg: 'rgba(255,255,255,0.07)', ring: 'rgba(255,255,255,0.18)', title: '#F4F3F0', body: 'rgba(244,243,240,0.75)' },
    cta: { bg: '#F4F3F0', ink: '#131313' },
    back: 'rgba(244,243,240,0.55)',
    bar: 'light',
  },
};

export default function MedallionDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ key?: string; tier?: string }>();
  const face = kkFace(params.key ?? '');
  const metal = (KK_METALS.includes(params.tier as KKMetal) ? params.tier : 'paper') as KKMetal;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/milestones'));

  if (!face) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 }}>
        <EmptyState title="Medallion not found" body="It may have been renamed." />
      </SafeAreaView>
    );
  }

  const skin = SKIN[metal];
  const reached = kkReached(face, metal);
  const tiered = face.steps.length > 0;

  // The pill: where this face stands, or the first rung it is waiting on.
  const state = tiered
    ? reached > 0
      ? `Tier ${kkRoman(reached)} · ${kkRung(face, face.steps[reached - 1])}`
      : `Not yet · first ${kkRung(face, face.steps[0])}`
    : reached > 0 || metal !== 'paper'
      ? 'Mints once'
      : 'Not yet';

  // The line the medallion carries — the one it has, or the one it is owed.
  const story = face.stories[Math.max(0, reached - 1)];
  const said = reached > 0 ? `“${story}”` : tiered ? `“${story}” — waiting at ${kkRung(face, face.steps[0])}.` : `“${story}”`;
  const saidTitle = reached === 0 && tiered ? 'What waits at tier one' : 'What it says';

  const share = () => {
    void Share.share({ message: `${face.name} · ${state}` }).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: typeof skin.page === 'string' ? skin.page : skin.page[0] }}>
      <StatusBar style={skin.bar} />

      {/* the board, its light, and the grain over both — in the canvas's order */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {typeof skin.page === 'string' ? null : (
          <LinearGradient colors={skin.page} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        )}
        {skin.glows.map((glow, i) => (
          <Glowlight key={i} glow={glow} insetTop={insets.top} />
        ))}
        {Array.from({ length: skin.noiseLayers }, (_, i) => i).map((i) => (
          <Image key={i} source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: skin.noise }} />
        ))}
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Yoga measures an absolute child's inset from the parent's border box
            and never consults padding, which is how safe-area-context expresses
            the inset — so everything absolute hangs off the scroller's content
            box instead. The box is the canvas's own 852 less the status bar it
            actually has: on the reference phone that is the whole viewport and
            nothing scrolls, and on a shorter one the last rows stay reachable. */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: 852 - insets.top }}>
          {/* canvas y 64 */}
          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke={skin.chrome} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </PressScale>

          {/* canvas y 72 — the album's page marks, carried through as chrome */}
          <View pointerEvents="none" style={{ position: 'absolute', right: 20, top: 18, flexDirection: 'row', gap: 4.5 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ width: 4.5, height: 4.5, borderRadius: 2.25, backgroundColor: skin.chrome }} />
            ))}
          </View>

          {/* canvas y 128 */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 74, alignItems: 'center' }}>
            <View style={{ borderRadius: 9999, boxShadow: `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 7px ${skin.mount}, 0 0 0 8.5px rgba(0,0,0,0.16)` }}>
              <KKMedallion scene={face.key} size={150} metal={metal} variant="detail" />
            </View>
          </View>

          <AppText style={[sans('600'), { position: 'absolute', left: 24, right: 24, top: 272, textAlign: 'center', fontSize: 26, letterSpacing: -0.2, color: skin.title }]}>
            {face.name}
          </AppText>
          <AppText style={[sans('400'), { position: 'absolute', left: 36, right: 36, top: 312, textAlign: 'center', fontSize: 15, lineHeight: 22, color: skin.body }]}>
            {face.long ?? face.blurb}
          </AppText>

          {/* canvas y 424 */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 370, alignItems: 'center' }}>
            <View style={{ height: 30, borderRadius: 15, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: skin.pill.bg, boxShadow: `0 0 0 1px ${skin.pill.ring}` }}>
              <AppText style={[sans('600'), { fontSize: 12.5, color: skin.pill.ink }]}>{state}</AppText>
            </View>
          </View>

          {/* canvas y 502 */}
          <View
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              top: 448,
              height: 118,
              borderRadius: 16,
              backgroundColor: skin.card.bg,
              boxShadow: `0 0 0 1px ${skin.card.ring}`,
            }}>
            <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 18, fontSize: 15.5, color: skin.card.title }]}>{saidTitle}</AppText>
            <AppText style={[sans('400'), { position: 'absolute', left: 20, right: 20, top: 48, fontSize: 14, lineHeight: 21, color: skin.card.body }]}>{said}</AppText>
          </View>

          {/* canvas y 688 */}
          <PressScale
            onPress={share}
            accessibilityRole="button"
            accessibilityLabel="Share this"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: 634,
              height: 56,
              borderRadius: 28,
              backgroundColor: skin.cta.bg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: skin.cta.ink }]}>Share this</AppText>
            <Svg width={15} height={17} viewBox="0 0 16 18" fill="none">
              <Path d="M8 1.5v9.5M4.7 4.6L8 1.5l3.3 3.1" stroke={skin.cta.ink} strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <Path
                d="M4.5 8H3.4A1.9 1.9 0 0 0 1.5 9.9v4.7a1.9 1.9 0 0 0 1.9 1.9h9.2a1.9 1.9 0 0 0 1.9-1.9V9.9A1.9 1.9 0 0 0 12.6 8h-1.1"
                stroke={skin.cta.ink}
                strokeWidth={1.9}
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
          </PressScale>

          {/* canvas y 764 */}
          <PressScale
            onPress={back}
            accessibilityRole="button"
            hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 710, minHeight: 0, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 14.5, color: skin.back }]}>Back to medallions</AppText>
          </PressScale>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * `radial-gradient(closest-side, C a, C 0 N%)` in a W × H box with
 * `border-radius:50%` — the ending shape touches each side, so it is the box's
 * own ellipse with the second stop at N.
 */
function Glowlight({ glow, insetTop }: { glow: Glow; insetTop: number }) {
  const uid = useId().replace(/:/g, '');
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        ...(glow.top != null ? { top: insetTop + glow.top } : { bottom: glow.bottom }),
      }}>
      <Svg width={glow.w} height={glow.h}>
        <Defs>
          <RadialGradient id={`kkgl-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={glow.rgb} stopOpacity={glow.a} />
            <Stop offset={glow.stop} stopColor={glow.rgb} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={glow.w / 2} cy={glow.h / 2} rx={glow.w / 2} ry={glow.h / 2} fill={`url(#kkgl-${uid})`} />
      </Svg>
    </View>
  );
}
