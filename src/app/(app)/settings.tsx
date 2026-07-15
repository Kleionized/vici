import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, LoadingView, Screen, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { colors, sans, spacing } from '@/lib/theme';

// ── Settings — the quiet hub behind the profile: identity card up top,
// then grouped rows in the design's settings grammar (SettingsGroup /
// SettingsRow), plan · reminders · security · account · tools · support. ──
export default function Settings() {
  const router = useRouter();
  const { email, displayName, signOut } = useAuth();
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();

  if (user === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const name = displayName || user?.displayName || 'You';
  const premium = !!user?.settings.premium;

  return (
    <Screen contentStyle={{ paddingTop: spacing.sm }}>
      <ScreenHeader
        title="Settings"
        pad={0}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(app)/today'))}
      />

      {/* identity — tap to edit the profile */}
      <View style={{ marginTop: 18 }}>
        <SettingsGroup>
          <SettingsRow glyph="user" title={name} detail={email ?? 'On this device'} onPress={() => router.push('/profile')} />
          <SettingsRow glyph="star" title="Medallions" detail="The campaign album" last onPress={() => router.push('/milestones')} />
        </SettingsGroup>
      </View>

      <SettingsGroup header="Plan">
        {premium ? (
          <SettingsRow glyph="card" title="Manage subscription" detail="VICI Plus" last onPress={() => router.push('/subscription')} />
        ) : (
          <>
            <SettingsRow glyph="star" title="Go premium" detail="VICI Plus" onPress={() => router.push('/paywall')} />
            <SettingsRow glyph="card" title="Manage subscription" last onPress={() => router.push('/subscription')} />
          </>
        )}
      </SettingsGroup>

      <SettingsGroup header="Reminders">
        <SettingsRow glyph="bell" title="Notifications & reminders" detail={user?.settings.reminderTime || 'Off'} onPress={() => router.push('/reminders')} />
        <SettingsRow
          glyph="calendar"
          title="Show a days number"
          toggle={{ value: !!user?.settings.showStreak, onChange: (v) => void updateSettings({ showStreak: v }) }}
          last
        />
      </SettingsGroup>

      <SettingsGroup header="Security & privacy">
        <SettingsRow glyph="face" title="App lock · Face ID" onPress={() => router.push('/applock')} />
        <SettingsRow glyph="shield" title="Data & privacy" last onPress={() => router.push('/privacy')} />
      </SettingsGroup>

      <SettingsGroup header="Tools">
        <SettingsRow glyph="spark" title="Open urge surf with a Back Tap" onPress={() => router.push('/backtap')} />
        <SettingsRow glyph="heart" title="Your Life Map" last onPress={() => router.push('/lifemap')} />
      </SettingsGroup>

      <SettingsGroup header="Support" footer="A days number is optional and secondary. A lapse never resets it as a failure.">
        <SettingsRow glyph="compass" title="Find support" last onPress={() => router.push('/(app)/support')} />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow
          glyph="chevR"
          title="Sign out"
          danger
          last
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
        />
      </SettingsGroup>

    </Screen>
  );
}
