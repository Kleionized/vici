import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Field, ProgressDots, Screen } from '@/components/ui';
import { useLifeMap, useUpdateLifeMap } from '@/lib/backend';
import { spacing } from '@/lib/theme';

export default function Why() {
  const router = useRouter();
  const lifeMap = useLifeMap();
  const updateLifeMap = useUpdateLifeMap();
  const [why, setWhy] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lifeMap?.whyStatement) setWhy(lifeMap.whyStatement);
  }, [lifeMap?.whyStatement]);

  async function next() {
    setSaving(true);
    await updateLifeMap({ whyStatement: why.trim() });
    setSaving(false);
    router.push('/(onboarding)/values');
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.xl }}>
      <ProgressDots total={4} index={1} />
      <View style={{ gap: spacing.md }}>
        <AppText variant="display">Your why</AppText>
        <AppText variant="muted">
          What is the life you want this change to make room for? There&apos;s no right answer — write it
          the way you&apos;d say it to a friend.
        </AppText>
      </View>
      <Field
        label="I want this because…"
        value={why}
        onChangeText={setWhy}
        placeholder="e.g. I want to be present with the people I love."
        multiline
      />
      <Button label="Continue" onPress={next} loading={saving} disabled={!why.trim()} />
    </Screen>
  );
}
