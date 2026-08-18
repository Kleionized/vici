import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Scene } from '@/components/task/TaskScene';
import { AppText, Glyph, PressScale, SectionLabel } from '@/components/ui';
import { CURRICULUM_84_DAYS, weekFor } from '@/content/curriculum84';
import { LESSON_PLATES, LESSON_PLATE_H, LESSON_PLATE_W } from '@/content/lessonPlates';
import { colors, fonts, spacing } from '@/lib/theme';

const RECENT = ['urge', 'sleep', 'relapse'];

export default function Search() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/library'));

  // Title, the line the card carries, and the week's own name — the three
  // things the curriculum actually says about a lesson.
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return CURRICULUM_84_DAYS;
    return CURRICULUM_84_DAYS.filter((lesson) => {
      const week = weekFor(lesson.week);
      return (
        lesson.title.toLowerCase().includes(needle) ||
        lesson.summary.toLowerCase().includes(needle) ||
        (week ? `${week.name} ${week.blurb}`.toLowerCase().includes(needle) : false)
      );
    });
  }, [q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 12 }}>
            {Glyph.search(colors.text)}
            <TextInput
              value={q}
              onChangeText={setQ}
              autoFocus
              placeholder="Search the twelve weeks"
              placeholderTextColor={colors.textSoft}
              style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text, padding: 0 }}
            />
          </View>
          <PressScale onPress={back} hitSlop={8} style={{ minWidth: 60, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' }}>
            <AppText weightOverride="600" style={{ fontSize: 16 }}>
              Cancel
            </AppText>
          </PressScale>
        </View>

        {/* recent chips */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
          {RECENT.map((r) => (
            <PressScale key={r} onPress={() => setQ(r)} style={{ minHeight: 44, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' }}>
              <AppText weightOverride="600" style={{ fontSize: 13.5, color: colors.textMuted }}>
                {r}
              </AppText>
            </PressScale>
          ))}
        </View>

        <SectionLabel style={{ paddingHorizontal: 24, paddingBottom: spacing.md }}>
          {`${results.length} result${results.length === 1 ? '' : 's'}`}
        </SectionLabel>

        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: 11 }} keyboardShouldPersistTaps="handled">
          {results.map((lesson) => {
            const week = weekFor(lesson.week);
            const plate = LESSON_PLATES[lesson.day];
            return (
              <PressScale key={lesson.day} onPress={() => router.push(`/lesson-card/${lesson.day}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 18, padding: 14 }}>
                  {/* the lesson's own plate, at the size the row leaves it */}
                  <View style={{ width: 46, height: 46, borderRadius: 13, overflow: 'hidden', backgroundColor: colors.accentSoft }}>
                    {plate ? (
                      <View style={{ position: 'absolute', left: 0, bottom: 0 }}>
                        <Scene layers={plate} boxW={LESSON_PLATE_W} boxH={LESSON_PLATE_H} width={46} />
                      </View>
                    ) : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <SectionLabel size={10.5} style={{ marginBottom: 3 }}>
                      {week ? `Week ${week.roman} · ${week.name}` : `Week ${lesson.week}`}
                    </SectionLabel>
                    <AppText weightOverride="500" style={{ fontSize: 14.5, lineHeight: 18 }}>
                      {lesson.title}
                    </AppText>
                    <AppText numberOfLines={2} variant="muted" weightOverride="500" style={{ fontSize: 13, marginTop: 2, lineHeight: 18 }}>
                      {lesson.summary}
                    </AppText>
                  </View>
                  {Glyph.chevR(colors.textSoft)}
                </View>
              </PressScale>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
