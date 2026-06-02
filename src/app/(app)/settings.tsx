import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Card, Divider, Field, LoadingView, Screen, SectionLabel, ToggleRow } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { BACKEND_MODE, useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { spacing } from '@/lib/theme';

export default function Settings() {
  const router = useRouter();
  const { email, displayName, mode: authMode, signOut } = useAuth();
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();

  const [reminder, setReminder] = useState('');
  const [reminderSaved, setReminderSaved] = useState(false);

  useEffect(() => {
    if (user?.settings.reminderTime) setReminder(user.settings.reminderTime);
  }, [user?.settings.reminderTime]);

  if (user === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="display">Settings</AppText>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/today'))} hitSlop={8}>
          <AppText variant="soft">Done</AppText>
        </Pressable>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Progress</SectionLabel>
        <Card>
          <ToggleRow
            label="Show a 'days since' number"
            description="Off by default. This is an optional, secondary stat — never the main measure of progress, and a lapse never resets it as a failure."
            value={!!user?.settings.showStreak}
            onValueChange={(v) => updateSettings({ showStreak: v })}
          />
        </Card>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Daily reminder</SectionLabel>
        <Field
          label="Reminder time (HH:MM)"
          value={reminder}
          onChangeText={(t) => {
            setReminder(t);
            setReminderSaved(false);
          }}
          placeholder="e.g. 21:00"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          helperText="Stored now; scheduling a real notification is wired later."
        />
        <Button
          label={reminderSaved ? 'Saved' : 'Save reminder'}
          variant="secondary"
          onPress={async () => {
            await updateSettings({ reminderTime: reminder.trim() || undefined });
            setReminderSaved(true);
          }}
        />
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Anchors</SectionLabel>
        <Button label="Edit your Life Map" variant="secondary" onPress={() => router.push('/lifemap')} />
        <Button label="Find support" variant="secondary" onPress={() => router.push('/support')} />
      </View>

      <Divider />

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Account</SectionLabel>
        <Card>
          <View style={{ gap: spacing.xs }}>
            {displayName ? <AppText weightOverride="600">{displayName}</AppText> : null}
            {email ? <AppText variant="soft">{email}</AppText> : null}
            <AppText variant="soft">
              Data: {BACKEND_MODE} · Auth: {authMode}
            </AppText>
          </View>
        </Card>
        <Button
          label="Sign out"
          variant="secondary"
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
        />
      </View>
    </Screen>
  );
}
