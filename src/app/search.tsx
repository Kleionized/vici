import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { CourseRow, ROW_GAP, lessonNumber } from '@/components/library/WeekPage';
import { Chip, ChevronR, MonoText, Screen, ScrollRegion, Tap, TextField } from '@/components/mono';
import { CURRICULUM_84_DAYS, weekFor } from '@/content/curriculum84';
import { mono } from '@/lib/theme';

const RECENT = ['urge', 'sleep', 'relapse'];

/**
 * Search — no frame draws it (routes §4.11). The field is Sheet Edit Name's
 * (`h60 r18 #1E1E1E`, 18/700, placeholder `#9B968E`) with "Cancel" beside it,
 * the three recent words as chips that fill the query, the count as caps, and
 * the results as week-page rows carrying their week on a caps line and the
 * lesson's one-liner under the title. The previous drop's lesson plates are
 * gone with the plates.
 */
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
  const asked = q.trim().toLowerCase();

  return (
    <Screen>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 60, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TextField
            variant="sheet"
            value={q}
            onChangeText={setQ}
            autoFocus
            placeholder="Search the twelve weeks"
            returnKeyType="search"
            accessibilityLabel="Search the twelve weeks"
            style={{ flex: 1 }}
          />
          <Tap onPress={back} hitSlop={{ top: 10, bottom: 10, left: 8, right: 12 }} style={{ height: 40, justifyContent: 'center' }}>
            <MonoText v="rowLabel">Cancel</MonoText>
          </Tap>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {RECENT.map((r) => (
            <Chip key={r} label={r} multi={false} on={asked === r} onPress={() => setQ(r)} />
          ))}
        </View>
        <MonoText v="caps" style={{ marginTop: 8 }}>{`${results.length} result${results.length === 1 ? '' : 's'}`}</MonoText>
      </View>

      <ScrollRegion top={240} contentStyle={{ paddingHorizontal: 16, paddingBottom: 48, gap: ROW_GAP }}>
        {results.map((lesson) => {
          const week = weekFor(lesson.week);
          return (
            <CourseRow
              key={lesson.day}
              lead={lessonNumber(lesson.day)}
              caps={week ? `Week ${week.roman} · ${week.name}` : `Week ${lesson.week}`}
              title={lesson.title}
              detail={lesson.summary}
              state="upcoming"
              trailing={<ChevronR color={mono.mute} />}
              label={`${lesson.title}, lesson ${lessonNumber(lesson.day)}`}
              onPress={() => router.push(`/lesson/day/${lesson.day}`)}
            />
          );
        })}
      </ScrollRegion>
    </Screen>
  );
}
