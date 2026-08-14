import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, BackGlyph, ChevronGlyph, PressScale } from '@/components/ui';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { colors, sans } from '@/lib/theme';

/**
 * 041 · Data & privacy — the promise first, set on inset paper with a shield,
 * then the two lists: what you can take with you, and what you can switch off.
 *
 * Canvas geometry with the 54px status bar removed: the back affordance at
 * y 10, the title at 60, the panel at 118, and every caption exactly 26 above
 * its card.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

export default function Privacy() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));
  const pauseAnalytics = user?.settings.pauseAnalytics ?? false;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ height: 60 }}>
          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back to Settings"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <BackGlyph />
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Settings</AppText>
          </PressScale>
        </View>
        {/* the title box carries the 58 down to the panel, so the panel lands at y 118 */}
        <View style={{ height: 58, paddingHorizontal: 16 }}>
          <AppText style={[sans('600'), { fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Data &amp; privacy</AppText>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* The promise — inset paper, not a raised card. The canvas pins the
              next caption at y 244 and the promise runs to three 21pt lines in
              its 300pt column, so the panel closes at 213 and the gap is 31. */}
          <View
            style={{
              marginHorizontal: 12,
              marginBottom: 31,
              borderRadius: 16,
              backgroundColor: '#EDECE7',
              paddingVertical: 16,
              paddingHorizontal: 18,
              flexDirection: 'row',
              gap: 13,
              alignItems: 'flex-start',
            }}>
            <View style={{ marginTop: 2 }}>
              <Svg width={20} height={24} viewBox="0 0 20 24" fill="none">
                <Path d="M10 1l8 3v7c0 5.5-3.5 9.5-8 11-4.5-1.5-8-5.5-8-11V4z" fill="none" stroke="#55534E" strokeWidth={2} strokeLinejoin="round" />
                <Path d="M6.5 11.5l2.5 2.5 4.5-5" fill="none" stroke="#55534E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <AppText style={[sans('400'), { flex: 1, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
              Your journal, urges and Life Map stay on your device and your private account. We never sell your data, ever.
            </AppText>
          </View>

          <Section header="Your data" gap={30} card={{ paddingVertical: 4 }}>
            <Row title="Export my data" detail="JSON" />
            <Divider />
            <Row title="Privacy policy" />
            <Divider />
            <Row title="Terms of service" />
          </Section>

          <Section header="Controls" gap={0} card={{ paddingVertical: 4 }}>
            <Row
              title="Pause analytics"
              right={<Toggle on={pauseAnalytics} />}
              onPress={() => void update({ pauseAnalytics: !pauseAnalytics })}
              switchTo={pauseAnalytics}
            />
            <Divider />
            <Row title="Delete account" />
          </Section>

          <AppText style={[sans('400'), { marginHorizontal: 28, marginTop: 15, fontSize: 13, lineHeight: 18.5, color: '#8B8882' }]}>
            Deleting your account erases your journal, urges and Life Map permanently. This can&apos;t be undone.
          </AppText>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/** A captioned group; the 26-tall caption box is the canvas's caption-to-card gap. */
function Section({ header, gap = 30, card, children }: { header: string; gap?: number; card?: ViewStyle; children: ReactNode }) {
  return (
    <View style={{ marginBottom: gap }}>
      <View style={{ height: 26, paddingHorizontal: 16 }}>
        <AppText style={[sans('600'), { fontSize: 13, color: '#55534E' }]}>{header}</AppText>
      </View>
      <View style={[{ marginHorizontal: 12, borderRadius: 16, backgroundColor: '#FFFFFF' }, card]}>{children}</View>
    </View>
  );
}

/** A list row — 50 tall on the settings sub-pages. */
function Row({ title, detail, right, onPress, switchTo }: { title: string; detail?: string; right?: ReactNode; onPress?: () => void; switchTo?: boolean }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={switchTo === undefined ? (onPress ? 'button' : undefined) : 'switch'}
      accessibilityState={switchTo === undefined ? undefined : { checked: switchTo }}
      style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
      <AppText style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{title}</AppText>
      {right ?? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {detail ? <AppText style={[sans('400'), { fontSize: 14, color: '#8B8882' }]}>{detail}</AppText> : null}
          <ChevronGlyph color="#B0AEA8" />
        </View>
      )}
    </PressScale>
  );
}

/** The hairline stops 18 short of both card edges. */
function Divider() {
  return <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} />;
}

/** The pill switch: 44 × 26 with a 20px knob inset 3 (canvas). */
function Toggle({ on }: { on: boolean }) {
  return (
    <View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: on ? '#131313' : colors.borderStrong }}>
      {/* the canvas never draws the off state — it borrows the app's resting track */}
      <View style={{ position: 'absolute', top: 3, left: on ? undefined : 3, right: on ? 3 : undefined, width: 20, height: 20, borderRadius: 10, backgroundColor: on ? '#ffffff' : '#F2F2EE' }} />
    </View>
  );
}
