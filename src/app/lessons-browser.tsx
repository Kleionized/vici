import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { LessonRow, ROW_GAP, useCourseDay } from '@/components/library/WeekPage';
import { MonoText, Screen, ScrollRegion, Tap } from '@/components/mono';
import { CURRICULUM_84 } from '@/content/curriculum84';
import { mono } from '@/lib/theme';

/**
 * 159 · Lessons Browser — no frame in `Vici Overhaul` draws it (routes §4.10).
 *
 * The whole curriculum, one week after another, in the week pages' own
 * vocabulary: each week's caps and name, then its seven rows exactly as the
 * week page draws them (done / `Continue` / upcoming). The previous drop's paper
 * shelves and their lesson plates are gone with the plates; the shape of what
 * is coming is still the point, so lessons not reached yet are listed — and,
 * as before, do not open (CRITIC C7: no lock glyph, the row is disabled).
 *
 * It is somewhere you look a lesson up and leave, so the nav keeps its words:
 * "Cancel" on the left, the search door on the right.
 */
export default function LessonsBrowser() {
  const router = useRouter();
  const day = useCourseDay();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <Screen>
      {/* the nav row's geometry (top 60, h 40, padding 0 22), with an 80-wide
          word slot each side so the caption stays centred */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 60, height: 40, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <Tap onPress={close} hitSlop={{ top: 4, bottom: 4, left: 12, right: 12 }} style={{ width: 80, height: 40, justifyContent: 'center' }}>
          <MonoText v="rowLabel">Cancel</MonoText>
        </Tap>
        <MonoText v="navTitle" accessibilityRole="header">
          Lessons
        </MonoText>
        <Tap label="Search lessons" onPress={() => router.push('/search')} hitSlop={{ top: 4, bottom: 4, left: 12, right: 12 }} style={{ width: 80, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
          <SearchGlyph />
        </Tap>
      </View>

      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingBottom: 48, gap: 36 }}>
        {CURRICULUM_84.map((week) => (
          <View key={week.n} style={{ gap: 16 }}>
            <View style={{ marginHorizontal: 24, gap: 6 }}>
              <MonoText v="caps">{`Week ${week.roman}`}</MonoText>
              <MonoText v="h1" accessibilityRole="header">
                {week.name}
              </MonoText>
            </View>
            <View style={{ marginHorizontal: 16, gap: ROW_GAP }}>
              {week.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.day}
                  lesson={lesson}
                  day={day}
                  disabled={lesson.day > day}
                  onPress={() => router.push(`/lesson/day/${lesson.day}`)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollRegion>
    </Screen>
  );
}

/** A search glyph in the kit's line weight — no frame draws one. */
function SearchGlyph() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Circle cx={7.75} cy={7.75} r={5.75} fill="none" stroke={mono.ink} strokeWidth={2} />
      <Path d="M12.2 12.2L16 16" stroke={mono.ink} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
