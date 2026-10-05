import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Chips, IconCircle, LoadingView, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, Spinner, Tap, TextField } from '@/components/mono';
import { useLifeMap, useUpdateLifeMap } from '@/lib/backend';
import { mono } from '@/lib/theme';

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

/** The nav row ends at 100; the page scrolls between it and the primary (D320). */
const NAV_BOTTOM = 100;
const PRIMARY_RESERVE = 106;

/**
 * Life Map — reached from All. No frame draws it (routes.md §4.4), so it takes
 * the closest frames' pieces and keeps its copy and behaviour: the nav row
 * with a "Done" in the right slot, the question template's title and
 * paragraph at 136, each question as a caps label over Night 3 Reflection's
 * bare text area (22/34), the values as V3 Q17's chips (with "Add your own"
 * as Name's field carrying an outline "+" disc), and the primary pinned at
 * `bottom 48`.
 */
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate local editable drafts when backend data arrives.
    setWhy(lifeMap.whyStatement ?? '');
    setOneYear(lifeMap.oneYearAnswer ?? '');
    // a value with no label (older or hand-seeded rows store bare strings) must
    // not reach the chips, whose keys are the labels
    const labels = (lifeMap.values as unknown[])
      .map((v) => (typeof v === 'string' ? v : (v as { label?: unknown } | null)?.label))
      .filter((l): l is string => typeof l === 'string' && l.length > 0);
    setSelected(labels);
    setAvailable((prev) => Array.from(new Set([...prev, ...labels])));
  }, [lifeMap]);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (lifeMap === undefined) return <LoadingView onBack={back} />;

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
    <Screen>
      {/* "Done" leaves without committing an edit, as it always has; the
          primary is what saves. */}
      <NavBar left="back" right={{ text: 'Done', onPress: back }} onBack={back} />
      <ScrollRegion top={NAV_BOTTOM} bottom={PRIMARY_RESERVE} contentStyle={{ paddingHorizontal: 24, paddingTop: 136 - NAV_BOTTOM, paddingBottom: 24 }}>
        <View style={{ gap: 14 }}>
          <MonoText v="h1" accessibilityRole="header">
            Life Map
          </MonoText>
          <MonoText v="p">Your anchor. The app brings this back to you when it helps.</MonoText>

          <View style={{ marginTop: 18, gap: 8 }}>
            <MonoText v="caps">Why you&apos;re here</MonoText>
            <TextField variant="bare" value={why} onChangeText={setWhy} placeholder="In your own words…" accessibilityLabel="Why you're here" />
          </View>
          <View style={{ marginTop: 18, gap: 8 }}>
            <MonoText v="caps">One year from now</MonoText>
            <TextField
              variant="bare"
              value={oneYear}
              onChangeText={setOneYear}
              placeholder="If this goes well, what does a year from now look like?"
              accessibilityLabel="One year from now"
            />
          </View>

          <View style={{ marginTop: 18, gap: 12 }}>
            <MonoText v="caps">What you value</MonoText>
            <Chips multi options={available} value={selected} onChange={setSelected} />
          </View>
          <View style={{ gap: 8 }}>
            <MonoText v="caps">Add your own</MonoText>
            <TextField
              variant="name"
              value={custom}
              onChangeText={setCustom}
              placeholder="A value in your words"
              returnKeyType="done"
              onSubmitEditing={addCustom}
              accessibilityLabel="Add your own"
              style={{ paddingRight: 6 }}
              accessory={
                <Tap label="Add" onPress={addCustom} hitSlop={6}>
                  <IconCircle size={48}>
                    <Svg width={16} height={16} viewBox="0 0 16 16">
                      <Path d="M8 2v12M2 8h12" stroke={mono.ink} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  </IconCircle>
                </Tap>
              }
            />
          </View>
        </View>
      </ScrollRegion>
      <PrimaryButton
        label={saved ? 'Saved · update' : 'Save Life Map'}
        onPress={() => void save()}
        disabled={saving}
        icon={saving ? <Spinner size={18} color={mono.onInk} /> : undefined}
      />
    </Screen>
  );
}
