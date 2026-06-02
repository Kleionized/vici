import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Field, LoadingView, Screen, SectionLabel } from '@/components/ui';
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

export default function LifeMapScreen() {
  const router = useRouter();
  const lifeMap = useLifeMap();
  const updateLifeMap = useUpdateLifeMap();

  const [why, setWhy] = useState('');
  const [oneYear, setOneYear] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(SUGGESTED);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!lifeMap) return;
    setWhy(lifeMap.whyStatement ?? '');
    setOneYear(lifeMap.oneYearAnswer ?? '');
    const labels = lifeMap.values.map((v) => v.label);
    setSelected(labels);
    setAvailable((prev) => Array.from(new Set([...prev, ...labels])));
  }, [lifeMap]);

  if (lifeMap === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  function toggle(label: string) {
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  }

  function addCustom() {
    const label = custom.trim();
    if (!label) return;
    setAvailable((prev) => (prev.includes(label) ? prev : [...prev, label]));
    setSelected((prev) => (prev.includes(label) ? prev : [...prev, label]));
    setCustom('');
  }

  async function save() {
    setSaving(true);
    const values = selected.map((label, i) => ({ label, importance: Math.max(1, 5 - i) }));
    await updateLifeMap({ whyStatement: why.trim(), oneYearAnswer: oneYear.trim(), values });
    setSaving(false);
    setSaved(true);
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="display">Life Map</AppText>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/today'))} hitSlop={8}>
          <AppText variant="soft">Done</AppText>
        </Pressable>
      </View>
      <AppText variant="muted">Your anchor. The app brings this back to you when it helps.</AppText>

      <Field label="Why you're here" value={why} onChangeText={setWhy} placeholder="In your own words…" multiline />
      <Field
        label="One year from now"
        value={oneYear}
        onChangeText={setOneYear}
        placeholder="If this goes well, what does a year from now look like?"
        multiline
      />

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>What you value</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {available.map((label) => {
            const on = selected.includes(label);
            return (
              <Pressable
                key={label}
                onPress={() => toggle(label)}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm + 2,
                  borderRadius: radius.pill,
                  backgroundColor: on ? colors.accent : colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: on ? colors.accent : colors.border,
                }}>
                <AppText color={on ? colors.accentText : colors.text} weightOverride={on ? weight.semibold : weight.regular}>
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Field label="Add your own" value={custom} onChangeText={setCustom} placeholder="A value in your words" />
          </View>
          <Button label="Add" fullWidth={false} variant="secondary" onPress={addCustom} />
        </View>
      </View>

      <Button label={saved ? 'Saved — update' : 'Save Life Map'} onPress={save} loading={saving} />
    </Screen>
  );
}
