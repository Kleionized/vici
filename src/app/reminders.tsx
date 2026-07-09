import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Glyph, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import type { UserSettings } from '@/lib/types';
import { colors, spacing } from '@/lib/theme';

export default function Reminders() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const s = user?.settings;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  const toggle = (key: keyof UserSettings, def: boolean) => ({
    value: (s?.[key] as boolean | undefined) ?? def,
    onChange: (v: boolean) => update({ [key]: v }),
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingTop: spacing.sm }}>
          <ScreenHeader hue={285} eyebrow="Settings" title="Reminders" onBack={back} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
          <SettingsGroup header="Daily check-in">
            <SettingsRow glyph="sun" title="Morning check-in" toggle={toggle('morningCheckin', true)} />
            <SettingsRow glyph="clock" title="Time" detail={s?.reminderTime || '8:00 AM'} last />
          </SettingsGroup>

          <SettingsGroup header="Smart nudges" footer="tideline learns when your urges tend to spike and sends quiet support a little before — never more than twice a day.">
            <SettingsRow glyph="wave" title="Risk-time support" toggle={toggle('riskTimeSupport', true)} />
            <SettingsRow glyph="moon" title="Evening wind-down" toggle={toggle('eveningWindDown', true)} />
            <SettingsRow glyph="spark" title="Weekly reflection" toggle={toggle('weeklyReflection', false)} last />
          </SettingsGroup>

          <SettingsGroup header="Tone" footer="Calm keeps language soft and shame-free. We never send streak alarms.">
            <SettingsRow glyph="leaf" title="Calm" control={<View>{Glyph.check(colors.text)}</View>} />
            <SettingsRow glyph="flag" title="Direct" control={<View style={{ width: 20 }} />} last />
          </SettingsGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
