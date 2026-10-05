import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CourseRow, ROW_GAP, courseDay } from '@/components/library/WeekPage';
import { ChevronR, LoadingView, MonoText, NavBar, Screen, ScrollRegion } from '@/components/mono';
import { CURRICULUM_84_DAYS } from '@/content/curriculum84';
import { useCurrentUser, useLessonProgressMap } from '@/lib/backend';
import { lessonSlug } from '@/lib/curriculum';
import { mono } from '@/lib/theme';

/**
 * The six first steps, opened from the Today card — no frame draws it (routes
 * §4.9). A close-only nav with its caption, the heading and its line, the
 * lesson reader's 3pt progress rail for how many are done, and the six as
 * week-page rows: done (check), today's (`Continue`), and the rest by number —
 * the ones not open yet listed but disabled, with no lock glyph (CRITIC C7).
 * Tapping one closes the checklist and opens that lesson.
 */
export default function FirstSteps() {
  const router = useRouter();
  const user = useCurrentUser();
  const progress = useLessonProgressMap();
  // Read once on mount, so a re-render cannot move the lock line under a finger.
  const [now] = useState(() => Date.now());
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (progress === undefined) return <LoadingView onClose={close} />;

  // The first six days of week one, and the day the reader is on — the same
  // reckoning the week pages and the lessons browser use.
  const steps = CURRICULUM_84_DAYS.slice(0, 6);
  const day = courseDay(user?.createdAt, now);
  const done = steps.filter((lesson) => progress[lessonSlug(lesson.day)]?.status === 'completed').length;

  return (
    <Screen>
      <NavBar left="empty" centre={{ title: 'First steps' }} right="close" onClose={close} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 36, paddingBottom: 48 }}>
        <View style={{ marginHorizontal: 24, gap: 8 }}>
          <MonoText v="h1" accessibilityRole="header">
            Six gentle first steps
          </MonoText>
          <MonoText v="p">No rush. These help VICI fit your life, and they open one at a time as you go.</MonoText>
        </View>

        {/* the lesson reader's progress rail: 3 tall, r2, the line under an ink fill */}
        <View
          accessibilityRole="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={done}
          style={{ marginTop: 24, marginHorizontal: 24, height: 3, borderRadius: 2, backgroundColor: mono.line, overflow: 'hidden' }}>
          <View style={{ width: `${(done / steps.length) * 100}%`, height: 3, borderRadius: 2, backgroundColor: mono.ink }} />
        </View>
        <MonoText v="caps" style={{ marginTop: 12, marginHorizontal: 24 }}>
          {done ? `${done} of ${steps.length} done` : `None done yet · ${steps.length} to go`}
        </MonoText>

        <View style={{ marginTop: 24, marginHorizontal: 16, gap: ROW_GAP }}>
          {steps.map((lesson, index) => {
            const complete = progress[lessonSlug(lesson.day)]?.status === 'completed';
            const locked = lesson.day > day && !complete;
            const n = index + 1;
            return (
              <CourseRow
                key={lesson.day}
                lead={complete ? 'check' : String(n)}
                title={lesson.title}
                detail={lesson.summary}
                state={complete ? 'done' : lesson.day === day ? 'current' : 'upcoming'}
                // open but not today's: the done row's brighter chevron; not open yet: the upcoming one
                trailing={!complete && !locked && lesson.day !== day ? <ChevronR color={mono.mute} /> : undefined}
                disabled={locked}
                label={`Step ${n}, ${lesson.title}${complete ? ', done' : locked ? ', locked' : ''}`}
                onPress={() => {
                  close();
                  router.push(`/lesson/day/${lesson.day}`);
                }}
              />
            );
          })}
        </View>
      </ScrollRegion>
    </Screen>
  );
}
