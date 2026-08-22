import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Ellipse,
  G,
  Image as SvgImage,
  LinearGradient as SvgLinearGradient,
  Mask,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { sans } from '@/lib/theme';

/**
 * The slip, in three frames — canvases 152, 153, 154.
 *
 * 152 and 153 are the same paper sheet lifted 2pt over the status bar: a piece
 * of drawn object art at 240 × 200, a line, a paragraph, and one dark pill.
 * Nothing about the screen looks like an alarm — a lapse is data (invariant #2),
 * so it gets the same calm treatment a win does.
 *
 * 154 breaks the sheet and puts you outdoors at first light. Canvas tops below
 * are the 393 × 852 frame's; anything under a safe-area edge has the 54pt status
 * bar taken off it.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const PAPER = '#F4F3F0';
const INK = '#1D1C1A';
const MUTED = '#55534E';

const PAGES = [
  {
    headline: "It happened. That's data.",
    body: "Same calm screen as a win. Note what set it off while it's fresh; the pattern is what the log is for.",
    cta: 'Log the slip',
  },
  {
    headline: "Don't fail twice.",
    body: 'One slip is a data point · two in a row is a pattern',
    cta: 'Continue',
  },
  {
    headline: 'Begin again.',
    body: "Logged — slip · the campaign didn't reset",
    cta: 'Start again',
  },
] as const;

export default function Relapse() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logged: alreadyLogged } = useLocalSearchParams<{ logged?: string }>();
  const createEvent = useCreateEvent();
  const [index, setIndex] = useState(0);
  const logged = useRef(alreadyLogged === '1');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const back = () => (index === 0 ? close() : setIndex((value) => value - 1));

  function advance() {
    if (index < PAGES.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    if (!logged.current) {
      logged.current = true;
      void createEvent({ type: 'lapse' }).catch(() => {});
      void setJSON('tideline.letter.pending', Date.now());
    }
    router.replace('/(app)/today');
  }

  if (index === 2) return <BeginAgain page={PAGES[2]} onBack={back} onDone={advance} />;

  const page = PAGES[index];
  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <StatusBar style="dark" />
      {/* canvas top:52 against a 54pt bar — the sheet crests 2pt above the
          status bar's baseline. `UI Final 1` squared its top and flattened the
          frame's ground to the sheet's own paper. */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: insets.top - 2,
          bottom: 0,
          backgroundColor: PAPER,
          overflow: 'hidden',
        }}>
        <PressScale
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
          style={{ position: 'absolute', right: 22, top: 18, minHeight: 0 }}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path d="M3 3l14 14M17 3L3 17" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </PressScale>

        {/* canvas left:76 for a 240-wide box on a 393 frame — centred, so it stays centred */}
        <View pointerEvents="none" style={{ position: 'absolute', left: '50%', top: 180, marginLeft: -120 }}>
          {index === 0 ? <SlipArt /> : <TwiceArt />}
        </View>

        <AppText
          center
          style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 398, fontSize: 23, letterSpacing: 0.1, color: INK }]}>
          {page.headline}
        </AppText>
        <AppText
          center
          style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 444, fontSize: 15.5, lineHeight: 23, color: MUTED }]}>
          {page.body}
        </AppText>

        <PressScale
          onPress={advance}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: 88,
            height: 54,
            minHeight: 0,
            borderRadius: 27,
            backgroundColor: '#131313',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{page.cta}</AppText>
        </PressScale>

        {index === 0 ? (
          <PressScale
            onPress={() => router.replace('/urge')}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 44, minHeight: 0, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>Back to the wave tool</AppText>
          </PressScale>
        ) : null}
      </View>
    </View>
  );
}

/** 154 · the sun clearing the waterline, with the campaign still standing behind it. */
function BeginAgain({ page, onBack, onDone }: { page: (typeof PAGES)[2]; onBack: () => void; onDone: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F0EFEB' }}>
      <StatusBar style="dark" />
      <BeginSky />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/*
         * The chrome hangs off this plain View, not off the SafeAreaView. Yoga
         * resolves a defined inset on an absolute child against the parent's
         * BORDER box and never consults its padding, and safe-area-context
         * expresses the inset as padding — so an absolute child of the
         * SafeAreaView would draw at screen y 10, under the status bar.
         */}
        <View style={{ flex: 1 }}>
          <PressScale
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#2A2924" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText style={[sans('400'), { fontSize: 17, color: '#2A2924' }]}>Back</AppText>
          </PressScale>

          <AppText
            center
            style={[sans('500'), { position: 'absolute', left: 40, right: 40, top: 74, fontSize: 22, lineHeight: 32, color: INK }]}>
            {page.headline}
          </AppText>
          <AppText
            center
            style={[sans('400'), { position: 'absolute', left: 30, right: 30, top: 150, fontSize: 14, color: MUTED }]}>
            {page.body}
          </AppText>
        </View>
      </SafeAreaView>

      {/* canvas top:756 h:48 in the 852 frame — the same 48pt off the frame's bottom edge */}
      <PressScale
        onPress={onDone}
        accessibilityRole="button"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 48,
          height: 48,
          minHeight: 0,
          borderRadius: 25,
          backgroundColor: '#131313',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{page.cta}</AppText>
      </PressScale>
    </View>
  );
}

/**
 * The 154 field: a four-stop dawn, three shafts of grain falling through it, and
 * the sun rising into a horizon band that cuts every light source off at y 558.
 */
function BeginSky() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <LinearGradient
        colors={['#F2E3D8', '#E4C6A8', '#FBFAF7', '#F0EFEB']}
        locations={[0, 0.39, 0.65, 0.82]}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
      />

      <NoiseRay id="beginA" left={-30} top={-40} width={150} height={420} rotate="24deg" opacity={0.2} />
      <NoiseRay id="beginB" left={130} top={-60} width={140} height={430} rotate="6deg" opacity={0.24} />
      <NoiseRay id="beginC" left={290} top={-40} width={150} height={420} rotate="-14deg" opacity={0.2} />

      {/* the canvas clips the sun and its halo at y 558 so the light stops at the water */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 558, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            left: '50%',
            top: 368,
            width: 200,
            height: 200,
            marginLeft: -100,
            borderRadius: 100,
            overflow: 'hidden',
          }}>
          <Svg width={200} height={200}>
            <Defs>
              {/* radial-gradient(circle at 50% 30%, …) — farthest-corner radius from (100,60) in a 200 box */}
              <RadialGradient id="begin-sun" cx={100} cy={60} r={172.05} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#FBF2E2" />
                <Stop offset="0.65" stopColor="#F0DBB4" />
                <Stop offset="1" stopColor="#DFC08B" />
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={200} height={200} fill="url(#begin-sun)" />
          </Svg>
          <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: 0.5 }} />
        </View>

        {/* no blur on this one in the canvas, so it is the literal two-stop ramp — an added mid stop would over-light the middle */}
        <Svg width={280} height={280} style={{ position: 'absolute', left: '50%', top: 328, marginLeft: -140 }}>
          <Defs>
            <RadialGradient id="begin-halo" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FAECD2" stopOpacity={0.5} />
              <Stop offset="0.72" stopColor="#FAECD2" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={140} cy={140} rx={140} ry={140} fill="url(#begin-halo)" />
        </Svg>
      </View>

      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 542, height: 32 }}
      />

      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: 0.1 }} />
    </View>
  );
}

/**
 * One shaft of grain hung from the top of the frame. The canvas fades each with
 * `mask-image:linear-gradient(180deg,#000 30%,transparent)`; RN has no CSS mask,
 * so the same falloff is an SVG luminance mask over the noise tile.
 */
function NoiseRay({
  id,
  left,
  top,
  width,
  height,
  rotate,
  opacity,
}: {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: string;
  opacity: number;
}) {
  return (
    <View style={{ position: 'absolute', left, top, width, height, transform: [{ rotate }], transformOrigin: 'top center' }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.3" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#000000" />
          </SvgLinearGradient>
          <Mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}-fade)`} />
          </Mask>
        </Defs>
        <G mask={`url(#${id}-mask)`}>
          <SvgImage x={0} y={0} width={width} height={height} href={noiseDark} preserveAspectRatio="xMidYMid slice" opacity={opacity} />
        </G>
      </Svg>
    </View>
  );
}

/** 152 · the slip written down: two tilted sheets, a pen laid across them, one tick. */
function SlipArt() {
  return (
    <View style={{ width: 240, height: 200, overflow: 'hidden' }}>
      {/* canvas blur(4px) on the closest-side wash; RN SVG has no blur filter, so the falloff is a mid gradient stop */}
      <Svg width={136} height={136} style={{ position: 'absolute', left: 56, top: 44 }}>
        <Defs>
          <RadialGradient id="slip-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#8E99A8" stopOpacity={0.32} />
            <Stop offset="0.37" stopColor="#8E99A8" stopOpacity={0.14} />
            <Stop offset="0.74" stopColor="#8E99A8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={68} cy={68} rx={68} ry={68} fill="url(#slip-glow)" />
      </Svg>

      <View
        style={{ position: 'absolute', left: 56, top: 72, width: 126, height: 94, borderRadius: 10, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }}
      />
      <View
        style={{
          position: 'absolute',
          left: 62,
          top: 66,
          width: 114,
          height: 94,
          borderRadius: 8,
          backgroundColor: '#F7F6F2',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
          transform: [{ rotate: '-2deg' }],
        }}
      />
      <View style={{ position: 'absolute', left: 118, top: 68, width: 2, height: 88, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />

      <View style={{ position: 'absolute', left: 74, top: 88, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 74, top: 102, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 74, top: 116, width: 24, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 130, top: 86, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 130, top: 100, width: 26, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />

      <View
        style={{
          position: 'absolute',
          left: 148,
          top: 118,
          width: 64,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#55534E',
          transform: [{ rotate: '-28deg' }],
          transformOrigin: 'left center',
        }}
      />
      <View style={{ position: 'absolute', left: 204, top: 86, width: 8, height: 8, borderRadius: 2, backgroundColor: '#B4B1AB', transform: [{ rotate: '17deg' }] }} />

      <View
        style={{
          position: 'absolute',
          left: 174,
          top: 48,
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#131313',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Svg width={13} height={13} viewBox="0 0 14 14">
          <Path d="M2.5 7.5l3 3 6-7" stroke={PAPER} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </View>
  );
}

/** 153 · one domino down, the next one still upright — the whole argument in an object. */
function TwiceArt() {
  return (
    <View style={{ width: 240, height: 200, overflow: 'hidden' }}>
      {/* canvas blur(4px) on the warm wash; no blur filter in RN SVG, so the mid gradient stop carries the falloff */}
      <Svg width={130} height={130} style={{ position: 'absolute', left: 70, top: 52 }}>
        <Defs>
          <RadialGradient id="twice-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
            <Stop offset="0.37" stopColor="#E2BA78" stopOpacity={0.17} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={65} cy={65} rx={65} ry={65} fill="url(#twice-glow)" />
      </Svg>

      <View style={{ position: 'absolute', left: 20, top: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCDED8' }} />
      <View style={{ position: 'absolute', left: 12, top: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: PAPER }} />

      {/* both contact shadows are blurred in the canvas (5px, then 4px) — redrawn as soft radials */}
      <Svg width={78} height={16} style={{ position: 'absolute', left: 34, top: 158 }}>
        <Defs>
          <RadialGradient id="twice-shadow-fallen" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.05} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={39} cy={8} rx={39} ry={8} fill="url(#twice-shadow-fallen)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          left: 42,
          top: 118,
          width: 18,
          height: 66,
          borderRadius: 6,
          backgroundColor: '#C6C5C0',
          transform: [{ rotate: '76deg' }],
          transformOrigin: 'bottom right',
        }}
      />
      <View style={{ position: 'absolute', left: 112, top: 144, width: 14, height: 28, borderRadius: 4, backgroundColor: '#B4B1AB' }} />

      <Svg width={44} height={12} style={{ position: 'absolute', left: 150, top: 162 }}>
        <Defs>
          <RadialGradient id="twice-shadow-standing" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.14} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.07} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={22} cy={6} rx={22} ry={6} fill="url(#twice-shadow-standing)" />
      </Svg>

      <View style={{ position: 'absolute', left: 152, top: 100, width: 20, height: 68, borderRadius: 6, backgroundColor: '#3A3934' }} />
      <View style={{ position: 'absolute', left: 157, top: 110, width: 10, height: 3, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.35)' }} />
    </View>
  );
}
