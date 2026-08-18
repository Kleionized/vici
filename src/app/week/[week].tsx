import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { WeekScene, WEEK_SCENE_HEIGHT } from '@/components/journey/WeekScene';
import { ClosingLand, LessonRows, WeekHeading } from '@/components/library/WeekBoard';
import { Grain, PressScale } from '@/components/ui';
import { weekFor } from '@/content/curriculum84';
import { useCurrentUser } from '@/lib/backend';

/**
 * 92A–92L · the week overview, pushed.
 *
 * One board per week: the week's name, the line under it, the picture, and the
 * seven lessons it holds. The canvas draws each week twice — `Week I Reset` and
 * `Week I Reset P2` — and the diff between the pair is the row column alone, so
 * they are one screen at two scroll positions: the header and the scene are
 * pinned and only the rows move (DECISIONS D-019).
 *
 * Everything the board is made of lives in `components/library/WeekBoard`,
 * because the Library tab stacks all twelve of these and must draw the same
 * pixels.
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

export default function WeekOverview() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const user = useCurrentUser();
  const width = useWindowDimensions().width;

  const n = Math.max(1, Math.min(12, Number(week) || 1));
  const data = weekFor(n);

  // Which day the user is on. Day one is the day they signed up, not the day
  // after — the same reckoning `day/morning.tsx` uses. Read once on mount so a
  // re-render cannot move the current row under the reader.
  const [now] = useState(() => Date.now());
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;

  if (!data) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Yoga positions an absolute child against its parent's border box and
          ignores the padding SafeAreaView spends the inset with, so absolute
          children of the SafeAreaView itself sit at the top of the screen
          rather than below the notch. One plain View deeper restores it. */}
        <View style={{ flex: 1 }}>
          {/* canvas 64 — a chevron and nothing else; these frames carry no word */}
          <PressScale
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/library'))}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, zIndex: 5 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
              <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </PressScale>

          {/* canvas 114 and 158 */}
          <WeekHeading week={data} />

          {/* canvas 214, 258 tall, with its own fade to the field at the foot */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 160, height: WEEK_SCENE_HEIGHT, overflow: 'hidden' }}>
            <WeekScene week={n} width={width} />
          </View>

          {/* canvas 486 — the row column, scrolling under the closing band */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ position: 'absolute', left: 0, right: 0, top: 432, bottom: 0 }}
            contentContainerStyle={{ paddingBottom: 108 }}>
            <LessonRows week={data} day={day} onLesson={(lessonDay) => router.push(`/lesson-card/${lessonDay}`)} />
          </ScrollView>

          {/* canvas 798 — the land the board closes on */}
          <ClosingLand width={width} />
        </View>
      </SafeAreaView>
    </View>
  );
}
