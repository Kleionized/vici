import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, BackGlyph, ChevronGlyph, Grain, PressScale } from '@/components/ui';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import type { UserSettings } from '@/lib/types';
import { colors, sans } from '@/lib/theme';

/**
 * 042 · App lock — the face on an ink disc, one line about why, then the two
 * lists. Reads as a decision rather than a preference pane.
 *
 * Canvas geometry with the 54px status bar removed: back at y 10, title at 60,
 * the disc at 124, the line at 242, and every caption exactly 26 above its card.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

export default function AppLock() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const s = user?.settings;
  const flag = (key: keyof UserSettings, def: boolean) => {
    const value = (s?.[key] as boolean | undefined) ?? def;
    return { switchTo: value, right: <Toggle on={value} />, onPress: () => void update({ [key]: !value }) };
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

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
        {/* the title box carries the 64 down to the disc, so the disc lands at y 124 */}
        <View style={{ height: 64, paddingHorizontal: 16 }}>
          <AppText style={[sans('600'), { fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>App lock</AppText>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                <Path d="M6 13V9a3 3 0 013-3h4M27 6h4a3 3 0 013 3v4M34 27v4a3 3 0 01-3 3h-4M13 34H9a3 3 0 01-3-3v-4" stroke="#F4F3F0" strokeWidth={2.4} strokeLinecap="round" fill="none" />
                <Path d="M14 16v2M26 16v2M20 16v6h-2" stroke="#F4F3F0" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <Path d="M14 26c1.6 1.8 3.6 2.8 6 2.8s4.4-1 6-2.8" stroke="#F4F3F0" strokeWidth={2.2} strokeLinecap="round" fill="none" />
              </Svg>
            </View>
          </View>

          {/* the line runs to two 20pt rows in its 313pt column, which is what
              puts the canvas's "Lock" caption at y 316 — hence the 34 below */}
          <AppText center style={[sans('400'), { marginHorizontal: 40, marginTop: 26, marginBottom: 34, fontSize: 14, lineHeight: 20, color: '#55534E' }]}>
            This work is personal. Keep VICI behind Face ID so it opens only for you.
          </AppText>

          <Section header="Lock" gap={32} card={{ paddingVertical: 4 }}>
            <Row title="Require Face ID" {...flag('appLockFaceId', false)} />
            <Divider />
            <Row title="Lock when I leave the app" {...flag('appLockOnLeave', false)} />
            <Divider />
            <Row title="Ask after" detail="Immediately" />
          </Section>

          <Section header="Privacy" gap={0} card={{ paddingVertical: 4 }}>
            <Row title="Hide sensitive previews" {...flag('hideSensitivePreviews', true)} />
          </Section>

          <AppText style={[sans('400'), { marginHorizontal: 28, marginTop: 20, fontSize: 13, lineHeight: 18.5, color: '#8B8882' }]}>
            Hides journal previews and entry titles in notifications and the app switcher.
          </AppText>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/** A captioned group; the 26-tall caption box is the canvas's caption-to-card gap. */
function Section({ header, gap = 32, card, children }: { header: string; gap?: number; card?: ViewStyle; children: ReactNode }) {
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
