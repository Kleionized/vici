import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useId } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { useLessons } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * The locked curriculum (canvas 106) — week I walked, the weeks beyond as
 * ghosted rows, then the road disappearing into the mist: "N more weeks
 * ahead", and the unlock pill.
 *
 * Laid out from the canvas's 393 × 852 frame; the status bar ends at 54, so
 * every canvas `top` is written here as `top − 54` under the safe area.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** The three ghosted rows, at canvas y 268 / 346 / 424 — week I sits above them. */
const WEEKS: [string, string, number][] = [
  ['Week II · Riding the wave', 'Urge surfing & the 20-minute rule', 214],
  ['Week III · Your triggers, mapped', 'Spot the leading indicators early', 292],
  ['Week IV · Never fail twice', 'A plan for the moment after a lapse', 370],
];

function LockGlyph() {
  return (
    <Svg width={17} height={19} viewBox="0 0 17 19">
      <Rect x={1.5} y={8} width={14} height={9.5} rx={2.4} stroke="#55534E" strokeWidth={1.9} fill="none" />
      <Path d="M4.8 8V5.6a3.7 3.7 0 0 1 7.4 0V8" stroke="#55534E" strokeWidth={1.9} fill="none" />
    </Svg>
  );
}

/**
 * The road ahead, lost in mist — a 240 × 130 vignette: a pale apron of ground,
 * a milestone tipped away from the eye, a signpost, and two banks of fog. The
 * canvas blurs the fog with `filter: blur(3px)`, which RN SVG has no filter
 * for, so each bank is redrawn as a radial gradient with the same soft falloff.
 */
function MistRoadArt() {
  const fogA = useId().replace(/:/g, '');
  const fogB = useId().replace(/:/g, '');
  return (
    <View style={{ width: 240, height: 130 }}>
      <Svg width={240} height={130} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Ellipse cx={120} cy={107} rx={100} ry={11} fill="#E7E5DE" />
      </Svg>

      {/* the milestone, tipped away with the canvas's own perspective */}
      <View
        style={{
          position: 'absolute',
          left: 108,
          top: 58,
          width: 26,
          height: 52,
          backgroundColor: '#DCDAD2',
          borderTopLeftRadius: 13,
          borderTopRightRadius: 13,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          transform: [{ perspective: 120 }, { rotateX: '48deg' }],
        }}
      />
      <View style={{ position: 'absolute', left: 150, top: 20, width: 3, height: 30, borderRadius: 2, backgroundColor: '#8B8882', opacity: 0.45 }} />
      <View style={{ position: 'absolute', left: 132, top: 22, width: 18, height: 10, backgroundColor: '#8B8882', opacity: 0.45, borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }} />

      <Svg width={240} height={130} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id={fogA} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FBFAF6" stopOpacity={0.95} />
            <Stop offset="0.7" stopColor="#FBFAF6" stopOpacity={0.9} />
            <Stop offset="1" stopColor="#FBFAF6" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={fogB} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.8} />
            <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity={0.74} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={119} cy={57} rx={99} ry={17} fill={`url(#${fogA})`} />
        <Ellipse cx={127} cy={73} rx={79} ry={13} fill={`url(#${fogB})`} />
      </Svg>

      <View style={{ position: 'absolute', left: 30, top: 104, width: 10, height: 26, backgroundColor: '#B9B6AE', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
      <View style={{ position: 'absolute', left: 26, top: 96, width: 18, height: 16, backgroundColor: '#C9C6BE', borderTopLeftRadius: 9, borderTopRightRadius: 9, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
    </View>
  );
}

export default function Locked() {
  const router = useRouter();
  const lessons = useLessons() ?? [];
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/library'));

  // the curriculum's own shape: how many weeks exist, and how big week one is
  const weekNumbers = [...new Set(lessons.map((l) => l.week))].sort((a, b) => a - b);
  const firstWeek = weekNumbers[0];
  const firstCount = lessons.filter((l) => l.week === firstWeek).length;
  const ahead = Math.max(0, weekNumbers.length - 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ height: 764 }} showsVerticalScrollIndicator={false}>
          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 14, bottom: 14, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>

          <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 68, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Weeks</AppText>

          {/* week one — walked */}
          <View style={{ position: 'absolute', left: 24, right: 24, top: 144, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={16} height={13} viewBox="0 0 16 13">
                <Path d="M1.5 7l4.4 4.5L14.5 1.5" fill="none" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={[sans('500'), { fontSize: 14.5, color: '#1D1C1A' }]}>Week I · The first calm</AppText>
              <AppText style={[sans('400'), { marginTop: 2, fontSize: 13, color: '#55534E' }]}>Completed · {firstCount} lessons</AppText>
            </View>
          </View>

          {/* the weeks beyond — ghosted, each under its own hairline */}
          {WEEKS.map(([title, sub, top]) => (
            <View
              key={title}
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                opacity: 0.55,
                borderTopWidth: 1,
                borderTopColor: 'rgba(0,0,0,0.09)',
                paddingTop: 15,
              }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EAE8E1', alignItems: 'center', justifyContent: 'center' }}>
                <LockGlyph />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={[sans('500'), { fontSize: 14.5, color: '#1D1C1A' }]}>{title}</AppText>
                <AppText style={[sans('400'), { marginTop: 2, fontSize: 13, color: '#55534E' }]}>{sub}</AppText>
              </View>
            </View>
          ))}

          {/* the canvas pins the vignette at x 76, not to the frame's centre */}
          <View style={{ position: 'absolute', left: 76, top: 466 }}>
            <MistRoadArt />
          </View>

          <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 598, fontSize: 20, color: '#1D1C1A' }]}>
            {ahead} more weeks ahead
          </AppText>
          <AppText center style={[sans('400'), { position: 'absolute', left: 64, right: 64, top: 630, fontSize: 13.5, lineHeight: 20, color: '#55534E' }]}>
            {`You've finished week one. The road carries on past the mist.`}
          </AppText>

          <PressScale
            onPress={() => router.push('/paywall')}
            accessibilityRole="button"
            style={{ position: 'absolute', left: 24, right: 24, top: 690, height: 58, borderRadius: 29, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>Unlock VICI Plus</AppText>
          </PressScale>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
