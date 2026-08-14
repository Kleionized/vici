import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { RD_KEYS, RD_PROTOCOLS } from '@/content/roughDays';
import { sans } from '@/lib/theme';

const noiseDark = require('../../../assets/images/noise-dark.png');

/**
 * Rough days — the way in. The v3 canvas dropped its own library page and now
 * draws only the seven protocols themselves (frames 001–021), each opening on
 * its own "walk through it" page. This is the shelf those seven sit on: the
 * universal interrupt on top, then the seven, in canvas order.
 *
 * Laid out from the 393 × 852 frame: the status bar ends at 54, so every
 * canvas top below is quoted with 54 already taken off it.
 */

function Row({ title, last, onPress }: { title: string; last: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      // canvas: 12.5px of padding above and below a 15px line, hairline under
      style={{ height: last ? 43 : 44, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}>
      <AppText style={[sans('500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{title}</AppText>
      <Svg width={7} height={12} viewBox="0 0 8 14">
        <Path d="M1.5 1.5 6 7l-4.5 5.5" stroke="rgba(0,0,0,0.28)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </PressScale>
  );
}

export default function RoughDays() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 44 }}>
          {/* design y 64 */}
          <PressScale
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/(app)/library'))}
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ marginTop: 10, marginLeft: 16, height: 20, minHeight: 0, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>

          {/* design y 122 */}
          <AppText style={[sans('600'), { marginTop: 38, marginLeft: 24, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Rough days</AppText>

          {/* design y 196 — the universal interrupt */}
          <PressScale
            onPress={() => router.push('/rough-first90')}
            style={{ marginTop: 41.6, marginHorizontal: 24, borderRadius: 18, backgroundColor: '#131313', paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', gap: 14, overflow: 'hidden' }}>
            <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 }} pointerEvents="none" />
            <View style={{ flex: 1 }}>
              <AppText style={[sans('600'), { fontSize: 12.5, color: 'rgba(245,244,241,0.62)' }]}>The universal interrupt</AppText>
              <AppText style={[sans('600'), { marginTop: 6, fontSize: 17, color: '#F5F4F1' }]}>The First 90 Seconds</AppText>
              <AppText style={[sans('400'), { marginTop: 3, fontSize: 13, color: 'rgba(245,244,241,0.62)' }]}>Two quick asks, six tailored moves.</AppText>
            </View>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(245,244,241,0.14)', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={14} height={12} viewBox="0 0 16 14">
                <Path d="M8 1.5L14.5 7 8 12.5M14 7H1.5" stroke="#F5F4F1" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </PressScale>

          {/* design y 318 for the label, 340 for the card */}
          <AppText style={[sans('600'), { marginTop: 26, marginLeft: 28, fontSize: 12.5, color: '#8B8882' }]}>What today feels like</AppText>
          <View style={{ marginTop: 7, marginHorizontal: 24, borderRadius: 18, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 2, boxShadow: '0 0 0 1px rgba(0,0,0,0.09)' }}>
            {RD_KEYS.map((key, i) => (
              <Row
                key={key}
                title={RD_PROTOCOLS[key].title}
                last={i === RD_KEYS.length - 1}
                onPress={() => router.push({ pathname: '/rough-protocol', params: { key } })}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
