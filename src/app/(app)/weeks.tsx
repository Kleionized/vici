import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, Card, LoadingView, Pill, Screen, SectionLabel } from '@/components/ui';
import { CATEGORY_LABEL } from '@/lib/labels';
import { useLessonProgressMap, useLessons } from '@/lib/backend';
import { colors, radius, spacing } from '@/lib/theme';
import type { Lesson, LessonStatus } from '@/lib/types';

const STATUS_LABEL: Record<LessonStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
};

const STATUS_TINT: Record<LessonStatus, string> = {
  not_started: colors.border,
  in_progress: colors.info,
  completed: colors.positive,
};

export default function Weeks() {
  const router = useRouter();
  const lessons = useLessons();
  const progress = useLessonProgressMap();

  if (!lessons || progress === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const byWeek = new Map<number, Lesson[]>();
  for (const l of lessons) {
    const arr = byWeek.get(l.week) ?? [];
    arr.push(l);
    byWeek.set(l.week, arr);
  }
  const weeks = [...byWeek.keys()].sort((a, b) => a - b);
  const completed = lessons.filter((l) => progress[l.slug]?.status === 'completed').length;

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="label">Your path</AppText>
        <AppText variant="display">Weeks</AppText>
        <AppText variant="muted">
          {completed} of {lessons.length} lessons complete. Move at your own pace — there&apos;s no clock.
        </AppText>
      </View>

      {weeks.map((week) => {
        const items = (byWeek.get(week) ?? []).sort((a, b) => a.orderIndex - b.orderIndex);
        const category = items[0]?.category;
        return (
          <View key={week} style={{ gap: spacing.sm }}>
            <SectionLabel>{`Week ${week}${category ? ` · ${CATEGORY_LABEL[category]}` : ''}`}</SectionLabel>
            <View style={{ gap: spacing.sm }}>
              {items.map((lesson) => {
                const status = progress[lesson.slug]?.status ?? 'not_started';
                return (
                  <Pressable key={lesson.slug} onPress={() => router.push(`/lesson/${lesson.slug}`)}>
                    <View
                      style={{
                        backgroundColor: colors.surfaceAlt,
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderLeftWidth: 3,
                        borderLeftColor: STATUS_TINT[status],
                        padding: spacing.lg,
                        gap: spacing.xs,
                      }}>
                      <AppText weightOverride="600">{lesson.title}</AppText>
                      <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                        <AppText variant="soft">{STATUS_LABEL[status]}</AppText>
                        {lesson.sensitive ? <Pill label="sensitive" /> : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}
