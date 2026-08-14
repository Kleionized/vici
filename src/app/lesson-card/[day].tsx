import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { lessonForDay, weekFor } from '@/content/curriculum84';
import { sans } from '@/lib/theme';

/**
 * `Lesson 01` … `Lesson 84` · the lesson's own card.
 *
 * The board a week row opens: which lesson this is, its title, the one line
 * that says what it is for, and the way in. The seven-dot rail counts the
 * lesson's place inside its week, not the whole course.
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54; the ones anchored to `bottom` are the
 * canvas's own.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

export default function LessonCard() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(day) || 1;
  const lesson = lessonForDay(n);
  const week = lesson ? weekFor(lesson.week) : undefined;

  if (!lesson || !week) return null;

  const indexInWeek = week.lessons.findIndex((l) => l.day === lesson.day);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* canvas right 22, top 24 — a close cross, not a chevron */}
        <PressScale
          onPress={() => (router.canGoBack() ? router.back() : router.replace(`/week/${lesson.week}`))}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={{ position: 'absolute', right: 22, top: 24, minHeight: 0, zIndex: 5 }}>
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Path d="M3 3l14 14M17 3L3 17" stroke="#55534E" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </PressScale>

        {/* canvas 28 — seven dots, one per lesson in the week */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
          {week.lessons.map((l, i) => (
            <View
              key={l.day}
              style={{
                width: i === indexInWeek ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === indexInWeek ? '#131313' : 'rgba(19,19,19,0.18)',
              }}
            />
          ))}
        </View>

        {/* canvas 64 */}
        <AppText
          center
          style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 64, fontSize: 11, letterSpacing: 1.4, color: '#B0AEA8' }]}>
          {`LESSON ${String(lesson.day).padStart(2, '0')} · WEEK ${week.roman}`}
        </AppText>

        {/* canvas 392 for a 23/30 title, 396 for the 20/27 one long titles take */}
        <AppText
          center
          style={[
            sans('500'),
            {
              position: 'absolute',
              left: 36,
              right: 36,
              top: (lesson.titleSize === 20 ? 396 : 392) - 54,
              fontSize: lesson.titleSize,
              lineHeight: lesson.titleSize === 20 ? 27 : 30,
              letterSpacing: 0.1,
              color: '#1D1C1A',
            },
          ]}>
          {lesson.title}
        </AppText>

        {/* canvas 448 */}
        <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 394, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
          {lesson.summary}
        </AppText>

        <PressScale
          onPress={() => router.push(`/lesson/day-${lesson.day}`)}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: 88,
            height: 54,
            minHeight: 54,
            borderRadius: 27,
            backgroundColor: '#131313',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>Start lesson</AppText>
        </PressScale>

        <PressScale
          onPress={() => router.replace(`/week/${lesson.week}`)}
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 24, right: 24 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 44, minHeight: 0, alignItems: 'center' }}>
          <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>{`Back to Week ${week.roman}`}</AppText>
        </PressScale>
      </SafeAreaView>
    </View>
  );
}
