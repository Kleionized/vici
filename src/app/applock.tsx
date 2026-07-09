import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Glyph, Illo, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import type { UserSettings } from '@/lib/types';
import { colors, spacing } from '@/lib/theme';

export default function AppLock() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const s = user?.settings;
  const toggle = (key: keyof UserSettings, def: boolean) => ({
    value: (s?.[key] as boolean | undefined) ?? def,
    onChange: (v: boolean) => update({ [key]: v }),
  });
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingTop: spacing.sm }}>
          <ScreenHeader hue={200} eyebrow="Security" title="App lock" onBack={back} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
          {/* face hero with faint horizon line */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: spacing.md, height: 108 }}>
            <View style={{ position: 'absolute', opacity: 0.16 }}>{Illo.waveline(colors.text, { w: 360, h: 30 })}</View>
            <View style={{ width: 92, height: 92, borderRadius: 9999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
              {Glyph.face(colors.inkText)}
            </View>
          </View>
          <AppText variant="muted" center weightOverride="500" style={{ fontSize: 15.5, lineHeight: 22, marginHorizontal: spacing.xxl, marginBottom: spacing.xl }}>
            Recovery is personal. Keep tideline behind Face ID so it opens only for you.
          </AppText>

          <SettingsGroup header="Lock">
            <SettingsRow glyph="face" title="Require Face ID" toggle={toggle('appLockFaceId', false)} />
            <SettingsRow glyph="lock" title="Lock when I leave the app" toggle={toggle('appLockOnLeave', false)} />
            <SettingsRow glyph="clock" title="Ask after" detail="Immediately" last />
          </SettingsGroup>

          <SettingsGroup header="Privacy" footer="Hides journal previews and entry titles in notifications and the app switcher.">
            <SettingsRow glyph="shield" title="Hide sensitive previews" toggle={toggle('hideSensitivePreviews', true)} last />
          </SettingsGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
