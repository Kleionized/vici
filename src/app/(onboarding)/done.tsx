import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Card, Pill, ProgressDots, Screen } from '@/components/ui';
import { useCompleteOnboarding, useLifeMap } from '@/lib/backend';
import { spacing } from '@/lib/theme';

export default function Done() {
  const router = useRouter();
  const lifeMap = useLifeMap();
  const completeOnboarding = useCompleteOnboarding();
  const [saving, setSaving] = useState(false);

  async function enter() {
    setSaving(true);
    await completeOnboarding();
    setSaving(false);
    router.replace('/');
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.xl }}>
      <ProgressDots total={4} index={3} />
      <View style={{ gap: spacing.md }}>
        <AppText variant="display">You&apos;re set.</AppText>
        <AppText variant="muted">
          This is your starting point — not a scoreboard. Here&apos;s what you anchored to. We&apos;ll bring
          it back when it helps.
        </AppText>
      </View>

      {lifeMap?.whyStatement ? (
        <Card>
          <View style={{ gap: spacing.sm }}>
            <AppText variant="label">Your why</AppText>
            <AppText>{lifeMap.whyStatement}</AppText>
          </View>
        </Card>
      ) : null}

      {lifeMap?.values?.length ? (
        <Card>
          <View style={{ gap: spacing.md }}>
            <AppText variant="label">What you value</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {lifeMap.values.map((v) => (
                <Pill key={v.label} label={v.label} />
              ))}
            </View>
          </View>
        </Card>
      ) : null}

      <Button label="Enter Tideline" onPress={enter} loading={saving} />
    </Screen>
  );
}
