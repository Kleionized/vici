import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Board, Cta, Part } from '@/components/lesson/reader';
import { LessonScroll } from '@/components/lesson/scroll';
import { LESSON_READER, type ReaderPage } from '@/content/lessonReader';

/**
 * The lesson reader — all 84 lessons, as the `lesson UI` bundle draws them.
 *
 * The last drop authored one lesson's body and left the other 83 with a card
 * and a task; this one authors every page of all 84, 1,398 in total. The page
 * still advances by tapping the board: only the pick and completion boards
 * carry a pill, and the cover's chevron is the only other hint of a control.
 *
 * Everything about how a page looks lives in `src/content/lessonReader.ts`,
 * transcribed frame by frame. This file decides only what a tap does.
 */
export default function LessonReader() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(String(day ?? '').replace(/^day-/, '')) || 1;
  // The cursor carries the lesson it belongs to. Opening a different lesson
  // reuses this component rather than remounting it, so a bare `useState(0)`
  // would drop the reader on whatever page number the last lesson left behind.
  const [cursor, setCursor] = useState({ day: n, index: 0 });
  const index = cursor.day === n ? cursor.index : 0;
  const setIndex = (next: (i: number) => number) => setCursor({ day: n, index: next(index) });
  const insets = useSafeAreaInsets();

  const pages: ReaderPage[] | undefined = LESSON_READER[n];
  const close = () => (router.canGoBack() ? router.back() : router.replace(`/lesson-card/${n}`));

  if (!pages?.length) return null;

  const page = pages[Math.min(index, pages.length - 1)];
  const next = () => (index >= pages.length - 1 ? close() : setIndex((i) => i + 1));
  // The completion and pick boards are the only pages that draw a pill; the
  // task-options board states none.
  const cta = page.k === 'board' ? undefined : page.cta;

  return (
    <>
      <StatusBar style="dark" />
      <LessonScroll
        index={index}
        count={pages.length}
        gap={page.k === 'column' ? page.gap : undefined}
        // The cover is the one page that draws the scroll chevron, and it is
        // always the first: every lesson opens on its eyebrow and title.
        chevron={index === 0}
        // Only the boards that ask something take a touch; every reading page
        // stays transparent so a tap anywhere turns it.
        interactive={page.k === 'pick' || (page.k === 'column' && page.parts.some((p) => p.t === 'picklist'))}
        onClose={close}
        onNext={next}
        footer={cta ? <Cta cta={cta} onPress={next} bottomInset={insets.bottom} /> : null}>
        {page.k === 'column' ? (
          page.parts.map((part, i) => <Part key={i} part={part} />)
        ) : (
          // The board pages are not centred on the screen — they state their own
          // top and foot — so they opt out of the stack rather than sit in it.
          //
          // The pick board owns its taps: its rows are the answer and its pill
          // is the way on. The options board draws no pill, so it stays
          // transparent to touch and the page advances by tapping it, like the
          // 1,241 pages that are just reading.
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents={page.k === 'pick' ? 'box-none' : 'none'}>
            <Board page={page} />
          </View>
        )}
      </LessonScroll>
    </>
  );
}
