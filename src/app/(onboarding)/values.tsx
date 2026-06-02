import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, ProgressDots, Screen } from '@/components/ui';
import { useLifeMap, useUpdateLifeMap } from '@/lib/backend';
import { colors, radius, spacing, weight } from '@/lib/theme';

const SUGGESTED = [
  'Connection',
  'Health',
  'Honesty',
  'Growth',
  'Creativity',
  'Presence',
  'Discipline',
  'Adventure',
  'Family',
  'Contribution',
  'Calm',
  'Courage',
];

export default function Values() {
  const router = useRouter();
  const lifeMap = useLifeMap();
  const updateLifeMap = useUpdateLifeMap();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lifeMap?.values?.length) setSelected(lifeMap.values.map((v) => v.label));
  }, [lifeMap?.values]);

  function toggle(label: string) {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  }

  async function next() {
    setSaving(true);
    const values = selected.map((label, i) => ({ label, importance: Math.max(1, 5 - i) }));
    await updateLifeMap({ values });
    setSaving(false);
    router.push('/(onboarding)/done');
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.xl }}>
      <ProgressDots total={4} index={2} />
      <View style={{ gap: spacing.md }}>
        <AppText variant="display">What you value</AppText>
        <AppText variant="muted">
          Pick the few that matter most right now. These become the anchor the app brings back to you —
          your Life Map. You can change them anytime.
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {SUGGESTED.map((label) => {
          const on = selected.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => toggle(label)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm + 2,
                borderRadius: radius.pill,
                backgroundColor: on ? colors.accent : colors.surfaceAlt,
                borderWidth: 1,
                borderColor: on ? colors.accent : colors.border,
              }}>
              <AppText
                color={on ? colors.accentText : colors.text}
                weightOverride={on ? weight.semibold : weight.regular}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Button label="Continue" onPress={next} loading={saving} disabled={selected.length === 0} />
    </Screen>
  );
}
