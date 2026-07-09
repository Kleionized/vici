import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Card, Glyph, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { colors, spacing } from '@/lib/theme';

export default function Privacy() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingTop: spacing.sm }}>
          <ScreenHeader hue={250} eyebrow="Privacy" title="Data & privacy" onBack={back} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.xl }}>
            <Card>
              <View style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start' }}>
                <View style={{ marginTop: 1 }}>{Glyph.shield(colors.text)}</View>
                <AppText variant="muted" weightOverride="500" style={{ flex: 1, fontSize: 14.5, lineHeight: 21 }}>
                  Your journal, urges and Life Map stay on your device and your private account. We never sell your data, ever.
                </AppText>
              </View>
            </Card>
          </View>

          <SettingsGroup header="Your data">
            <SettingsRow glyph="download" title="Export my data" detail="JSON" />
            <SettingsRow glyph="doc" title="Privacy policy" />
            <SettingsRow glyph="doc" title="Terms of service" last />
          </SettingsGroup>

          <SettingsGroup header="Controls" footer="Deleting your account erases your journal, urges and Life Map permanently. This can't be undone.">
            <SettingsRow
              glyph="spark"
              title="Pause analytics"
              toggle={{ value: user?.settings.pauseAnalytics ?? false, onChange: (v) => update({ pauseAnalytics: v }) }}
            />
            <SettingsRow glyph="trash" title="Delete account" danger last />
          </SettingsGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
