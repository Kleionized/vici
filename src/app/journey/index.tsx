import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { JourneyScroll } from '@/components/journey/JourneyScreens';
import { AppText, PressScale } from '@/components/ui';
import { sans } from '@/lib/theme';

/**
 * The campaign — the four chapters, end to end.
 *
 * This was the Library tab until the Library became the twelve weeks (D-114).
 * The chapters are a different account of the same run — the grounds you have
 * taken rather than the lessons you have read — so they kept their scroll and
 * moved to a pushed route of their own. The four are still individually at
 * `/journey/[chapter]`.
 */
export default function JourneyIndex() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <JourneyScroll bottomInset={40} />
      <PressScale
        onPress={back}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={{ top: 14, bottom: 14, left: 16, right: 16 }}
        style={{ position: 'absolute', left: 16, top: 64, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9, zIndex: 5 }}>
        <Svg width={11} height={19} viewBox="0 0 11 19">
          <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
      </PressScale>
    </View>
  );
}
