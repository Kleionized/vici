import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, BackGlyph, PressScale } from '@/components/ui';
import { useUpdateSettings } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * 101 · Reminders — the promise ("nothing noisy, nothing shaming") is checked
 * against the notes themselves rather than asserted, so both are shown as they
 * would land. The second sits back at 0.55: it hasn't arrived yet.
 *
 * Canvas geometry with the 54pt status bar removed: back at y 10, the title at
 * 86, the sub at 142, the two notes at 226 and 338, the pill 50 off the bottom.
 */

const laurelMark = require('../../assets/images/laurel-mark.webp');

// The banners as the canvas words them — "now" is the note that just landed,
// not a stored preference, so neither time is read from settings.
const NOTES: { top: number; title: string; when: string; body: string; opacity: number }[] = [
  { top: 226, title: 'Morning check-in', when: 'now', body: "Twenty seconds — where's your head at today?", opacity: 1 },
  { top: 338, title: 'Late night ahead', when: '10:41 PM', body: 'Your risky window. The wave tool is one tap away.', opacity: 0.55 },
];

export default function Reminders() {
  const router = useRouter();
  const update = useUpdateSettings();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  // The one pill turns on exactly the two nudges the notes above promised.
  const turnOn = () => {
    void update({ morningCheckin: true, riskTimeSupport: true }).catch(() => {});
    back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* SafeAreaView expresses the inset as Yoga padding, and Yoga positions an
            absolute child from the border box — so everything absolute goes inside
            this plain flex child, which does carry the inset */}
        <View style={{ flex: 1 }}>
          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <BackGlyph color="#55534E" />
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>

          <AppText
            center
            style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: 86, fontSize: 22, lineHeight: 22 * 1.32, letterSpacing: 0.1, color: '#1D1C1A' }]}>
            A gentle nudge.
          </AppText>
          <AppText
            center
            style={[sans('400'), { position: 'absolute', left: 30, right: 30, top: 142, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
            Two nudges a day, timed to your risky window. Nothing noisy, nothing shaming.
          </AppText>

          {NOTES.map((n) => (
            <View
              key={n.title}
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top: n.top,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                paddingVertical: 16,
                paddingHorizontal: 18,
                opacity: n.opacity,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Image source={laurelMark} contentFit="contain" style={{ width: 24, height: 24, opacity: 0.8 }} />
                <AppText style={[sans('600'), { flex: 1, fontSize: 15.5, color: '#1D1C1A' }]}>{n.title}</AppText>
                <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>{n.when}</AppText>
              </View>
              <AppText style={[sans('400'), { marginTop: 8, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>{n.body}</AppText>
            </View>
          ))}

          {/* canvas top:744 in the 852 frame — held 50 off the bottom instead so a
              shorter phone keeps the way forward rather than losing it below the fold */}
          <PressScale
            onPress={turnOn}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 50,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#131313',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.3, color: '#FFFFFF' }]}>Turn on reminders</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}
