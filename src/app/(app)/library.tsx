import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import { WeekBack, WeekPage, clampWeek, courseDay, useRowsViewport, weekForDay } from '@/components/library/WeekPage';
import { LoadingView, Screen } from '@/components/mono';
import { CURRICULUM_84 } from '@/content/curriculum84';
import { useCurrentUser } from '@/lib/backend';
import { useToday } from '@/lib/day';

/**
 * The Library tab — the twelve week pages (`Week I Reset` … `Week XII Leave It
 * Behind P2`), side by side (D325). The canvas draws no Library index: its only
 * Library-lit frames are the week pages, each with a back chevron over the tab
 * bar, so the tab *is* those pages — a horizontal pager that opens on the
 * reader's current week (Week VI on the frames' day 38), or on `?week=N`, which
 * is where `/week/N` lands (D240).
 *
 * The pages mount a neighbour either side of the one in view, so a swipe never
 * meets an empty page and twelve heroes are never drawn at once.
 */
export default function Library() {
  const router = useRouter();
  const params = useLocalSearchParams<{ week?: string }>();
  const { width } = useWindowDimensions();
  const user = useCurrentUser();
  // the screen's clock: it moves on with focus, the foreground and midnight (L5)
  const now = useToday();
  const day = courseDay(user, now);
  // a phone too short for the rows viewport scrolls each page whole, chevron and all
  const pinned = useRowsViewport() != null;

  const requested = params.week != null ? clampWeek(params.week) : null;
  // Until the account is read the current week is unknown; a `?week=` needs no wait.
  const [page, setPage] = useState<number | null>(requested != null ? requested - 1 : null);
  // the last `?week=` acted on, and a count of the times a page was chosen
  // (opened on, asked for) rather than scrolled to — the pager follows those
  const [asked, setAsked] = useState<number | null>(requested);
  const [jump, setJump] = useState(0);
  const pager = useRef<ScrollView>(null);

  // A `/week/N` (or `?week=N`) arriving while the tab is already mounted turns
  // to that page.
  if (requested !== asked) {
    setAsked(requested);
    if (requested != null) {
      setPage(requested - 1);
      setJump((j) => j + 1);
    }
  }
  // The opening page, once the account is known: the current week.
  if (page == null && user) {
    setPage(weekForDay(courseDay(user, now)) - 1);
    setJump((j) => j + 1);
  }

  useEffect(() => {
    if (page != null) pager.current?.scrollTo({ x: page * width, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when a page is chosen (or the width changes), not when one is scrolled to
  }, [jump, width]);

  // The param is consumed, so asking for the same week again turns to it again.
  useEffect(() => {
    if (requested != null) router.setParams({ week: undefined });
  }, [requested, router]);

  const back = () => (router.canGoBack() ? router.back() : router.navigate('/(app)/today'));
  const openLesson = (lessonDay: number) => router.push(`/lesson/day/${lessonDay}`);

  if (page == null) return <LoadingView onBack={back} />;

  return (
    <Screen>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentOffset={{ x: page * width, y: 0 }}
        // web ignores `contentOffset`, and a resize has to land on the same page
        onLayout={() => pager.current?.scrollTo({ x: page * width, animated: false })}
        onScroll={(e) => {
          const i = Math.max(0, Math.min(CURRICULUM_84.length - 1, Math.round(e.nativeEvent.contentOffset.x / width)));
          if (i !== page) setPage(i);
        }}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width }}>
        {CURRICULUM_84.map((week, i) => (
          <View key={week.n} style={{ width, height: '100%' }}>
            {Math.abs(i - page) <= 1 ? <WeekPage week={week} day={day} width={width} onLesson={openLesson} onBack={back} /> : null}
          </View>
        ))}
      </ScrollView>

      {/* the same chevron on every page, held still while the pages move */}
      {pinned ? <WeekBack onPress={back} /> : null}
    </Screen>
  );
}
