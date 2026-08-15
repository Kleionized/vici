import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { colors, sans } from '@/lib/theme';

/**
 * 91C0 · Report ready — canvas 030.
 *
 * The report used to open itself the moment a week closed. It lands over Today
 * now and asks first — a weekly reckoning is worth two minutes of attention,
 * and dropping it on someone unannounced is how it gets skimmed.
 *
 * The page is lit from below and the report itself sits in the light: a small
 * sheet of paper, tilted, with the week's line drawn on it. Canvas tops below
 * are the 393 × 852 frame's, less the 54pt status bar.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

export default function ReportReady() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const { width } = useWindowDimensions();

  const later = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const open = () => router.replace(week ? `/weekly-report?week=${week}` : '/weekly-report');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />

      {/* the canvas lays the noise down first and floats both washes over it */}
      <Grain source={noiseDark} opacity={0.07} />

      {/* the two washes are frame-anchored, so they sit outside the safe area */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {/* canvas blurs this by 5px; RN SVG has no blur filter, so the falloff is the gradient's */}
        <Svg width={width * 1.3} height={300} style={{ position: 'absolute', left: -width * 0.15, top: -190 }}>
          <Defs>
            <RadialGradient id="ready-top" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.32} />
              <Stop offset="0.55" stopColor="#B4AA96" stopOpacity={0.1} />
              <Stop offset="0.75" stopColor="#B4AA96" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={(width * 1.3) / 2} cy={150} rx={(width * 1.3) / 2} ry={150} fill="url(#ready-top)" />
        </Svg>
        <Svg width={520} height={520} style={{ position: 'absolute', left: '50%', bottom: -260, marginLeft: -260 }}>
          <Defs>
            <RadialGradient id="ready-bottom" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.4} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.18} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={260} cy={260} rx={260} ry={260} fill="url(#ready-bottom)" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* safe-area-context spends the inset as Yoga padding, and Yoga measures
            an absolutely-positioned child's inset from the border box — so every
            absolute child below has to hang off a plain view, not the SafeAreaView */}
        <View style={{ flex: 1 }}>
          <PressScale
            onPress={later}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
            style={{ position: 'absolute', right: 20, top: 12, minHeight: 0 }}>
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path d="M3 3l12 12M15 3L3 15" stroke="#55534E" strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </PressScale>

          <ReportArt />

          <AppText
            center
            style={[sans('500'), { position: 'absolute', left: 36, right: 36, top: 418, fontSize: 24, lineHeight: 32, letterSpacing: -0.1, color: '#1D1C1A' }]}>
            Your weekly report is ready.
          </AppText>
          <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 468, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
            Score, urges, and the pattern — two quiet minutes.
          </AppText>

          <PressScale
            onPress={open}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: 634,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#131313',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>Open the report</AppText>
          </PressScale>
          <PressScale
            onPress={later}
            accessibilityRole="button"
            hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 710, minHeight: 0, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>Later</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * The report as an object: a tilted sheet lit from behind, its own week drawn
 * on it in one rising line. Canvas frame 260 × 280 at y 150, centred.
 */
function ReportArt() {
  return (
    <View style={{ position: 'absolute', left: '50%', top: 96, width: 260, height: 280, marginLeft: -130 }} pointerEvents="none">
      {/* the light behind the sheet — canvas blurs it 5px, redrawn as a soft radial */}
      <Svg width={172} height={172} style={{ position: 'absolute', left: 44, top: 16 }}>
        <Defs>
          <RadialGradient id="ready-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.46} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={86} cy={86} rx={86} ry={86} fill="url(#ready-glow)" />
      </Svg>

      {/* the sheet's contact shadow — canvas blurs it 6px, same treatment */}
      <Svg width={156} height={15} style={{ position: 'absolute', left: 52, top: 248 }}>
        <Defs>
          <RadialGradient id="ready-shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.05} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={78} cy={7.5} rx={78} ry={7.5} fill="url(#ready-shadow)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          left: 70,
          top: 44,
          width: 120,
          height: 164,
          borderRadius: 9,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 18px 36px rgba(40,38,32,0.16)',
          transform: [{ rotate: '2.5deg' }],
          overflow: 'hidden',
        }}>
        <Grain source={noiseDark} opacity={0.05} />

        <View style={{ position: 'absolute', left: 14, top: 14, width: 44, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: 14, top: 26, width: 28, height: 5, borderRadius: 3, backgroundColor: '#EAE8E1' }} />

        <Svg width={92} height={64} viewBox="0 0 92 64" style={{ position: 'absolute', left: 14, top: 46 }}>
          <Path d="M2 54 C20 50 34 42 50 32 C64 23 78 14 90 8 L90 64 L2 64 Z" fill="rgba(19,19,19,0.08)" />
          <Path d="M2 54 C20 50 34 42 50 32 C64 23 78 14 90 8" stroke="#131313" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <Circle cx={90} cy={8} r={3.4} fill="#131313" />
        </Svg>

        <View style={{ position: 'absolute', left: 14, top: 122, width: 60, height: 4, borderRadius: 2, backgroundColor: '#EAE8E1' }} />
        <View style={{ position: 'absolute', left: 14, top: 132, width: 48, height: 4, borderRadius: 2, backgroundColor: '#EFEDE6' }} />

        <Svg width={26} height={26} style={{ position: 'absolute', right: 12, bottom: 12 }}>
          <Defs>
            {/* css `radial-gradient(circle at 38% 30%, …)` defaults to farthest-corner:
                from (9.88, 7.8) the far corner of the 26px box is 24.31 away = 93.5% */}
            <RadialGradient id="ready-seal" cx="38%" cy="30%" rx="93.5%" ry="93.5%">
              <Stop offset="0" stopColor="#F0DBB4" />
              <Stop offset="0.7" stopColor="#E2BA78" />
              <Stop offset="1" stopColor="#E2BA78" />
            </RadialGradient>
          </Defs>
          <Circle cx={13} cy={13} r={13} fill="url(#ready-seal)" />
        </Svg>
      </View>
    </View>
  );
}
