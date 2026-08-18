import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Scene } from '@/components/task/TaskScene';
import { AppText, Grain, PressScale } from '@/components/ui';
import { CURRICULUM_84, type Curriculum84Lesson } from '@/content/curriculum84';
import { LESSON_PLATES, LESSON_PLATE_H, LESSON_PLATE_W } from '@/content/lessonPlates';
import { useCurrentUser } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * 159 · Lessons Browser.
 *
 * The whole curriculum as a shelf per week: each lesson a small paper tile
 * carrying its title at the top and its own drawing underneath. Weeks you have
 * not reached still show their tiles — the shape of what is coming is the
 * point — with a padlock on the ones that will not open yet.
 *
 * The drawing on a tile is the lesson's own plate, the same one its card opens
 * with, scaled to the tile's width and stood on its foot. The twelve invented
 * objects that used to be cycled by lesson number are gone: there was never a
 * reason for lesson 13 and lesson 25 to share a face (DECISIONS D-113).
 *
 * It opens over whatever you were doing, hence "Cancel" rather than a back
 * chevron: this is a place you look something up, not a place you end up. The
 * Library tab draws the weeks whole, so this is the only frame that shelves
 * them and it keeps the shelves to itself.
 *
 * Canvas y values below are the 393 × 852 frame's; the status bar ends at 54,
 * so everything under the safe area is 54 less.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const TILE_W = 118;
const TILE_H = 168;
/** canvas tile lefts 13 / 144 / 275 — a 13 margin and a 13 gap, three across */
const GUTTER = 13;
/** 240 × 200 into 118 wide is 0.492, so a plate stands 98 tall on the tile's foot. */
const PLATE_H = Math.round((LESSON_PLATE_H * TILE_W) / LESSON_PLATE_W);

export default function LessonsBrowser() {
  const router = useRouter();

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <TitleRow onCancel={close} />
        <Shelves contentBottom={40} />
      </SafeAreaView>
    </View>
  );
}

/**
 * Canvas y 64–86: Cancel, the centred title, the search glyph. Kept in a
 * flowed 44-tall box rather than absolutely on the SafeAreaView, because Yoga
 * measures an absolute child's inset from the border box and so ignores the
 * inset the safe area expresses as padding.
 */
function TitleRow({ onCancel }: { onCancel?: () => void }) {
  const router = useRouter();
  return (
    <View style={{ height: 44 }}>
      {onCancel ? (
        <PressScale
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
          style={{ position: 'absolute', left: 16, top: 12, minHeight: 0 }}>
          <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Cancel</AppText>
        </PressScale>
      ) : null}
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 10, fontSize: 18.5, letterSpacing: 0.2, color: '#1D1C1A' }]}>
        Lessons
      </AppText>
      <PressScale
        onPress={() => router.push('/search')}
        accessibilityRole="button"
        accessibilityLabel="Search lessons"
        hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
        style={{ position: 'absolute', right: 20, top: 10, minHeight: 0 }}>
        <Svg width={22} height={22} viewBox="0 0 22 22">
          <Circle cx={9.5} cy={9.5} r={7} fill="none" stroke="#1D1C1A" strokeWidth={2} />
          <Path d="M15 15l5 5" stroke="#1D1C1A" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </PressScale>
    </View>
  );
}

/** Every week as a shelf: its heading, then its seven lessons as tiles. */
function Shelves({ contentBottom }: { contentBottom: number }) {
  const router = useRouter();
  const user = useCurrentUser();

  // Day one is the day they signed up, not the day after — the reckoning the
  // week board and the morning check-in both use.
  const [now] = useState(() => Date.now());
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingBottom: contentBottom }}>
      {CURRICULUM_84.map((week, index) => (
        // canvas: heading at y 104, its shelf 36 lower, 40 of air to the next heading
        <View key={week.n} style={{ marginTop: index ? 40 : 0 }}>
          <AppText numberOfLines={1} style={[sans('600'), { marginLeft: GUTTER, fontSize: 20, color: '#1D1C1A' }]}>
            Week {week.roman} · {week.name}
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingHorizontal: GUTTER, gap: GUTTER }}>
            {week.lessons.map((lesson) => (
              <LessonTile key={lesson.day} lesson={lesson} locked={lesson.day > day} onPress={() => router.push(`/lesson-card/${lesson.day}`)} />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

/** One tile: its title, its own plate standing on the tile's foot, a padlock if it is not open yet. */
function LessonTile({ lesson, locked, onPress }: { lesson: Curriculum84Lesson; locked: boolean; onPress: () => void }) {
  const plate = LESSON_PLATES[lesson.day];
  return (
    <PressScale
      onPress={locked ? undefined : onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      accessibilityLabel={`${lesson.title}${locked ? '. Locked' : ''}`}
      style={{
        width: TILE_W,
        height: TILE_H,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#DEDDD6',
        boxShadow: '0 0 0 1px rgba(40,60,90,0.08)',
      }}>
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#F0EFE9' }} />
      {plate ? (
        <View style={{ position: 'absolute', left: 0, top: TILE_H - PLATE_H }}>
          <Scene layers={plate} boxW={LESSON_PLATE_W} boxH={LESSON_PLATE_H} width={TILE_W} />
        </View>
      ) : null}
      <Grain source={noiseDark} opacity={0.05} />

      {locked ? (
        <View style={{ position: 'absolute', right: 8, top: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(19,19,19,0.45)', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={10} height={12} viewBox="0 0 14 16">
            <Rect x={1.5} y={7} width={11} height={8} rx={2} fill="#F4F3F0" />
            <Path d="M4 7V5a3 3 0 016 0v2" fill="none" stroke="#F4F3F0" strokeWidth={2} />
          </Svg>
        </View>
      ) : null}

      <AppText
        numberOfLines={2}
        style={[sans('600'), { position: 'absolute', left: 11, right: locked ? 30 : 11, top: 22, fontSize: 13.5, lineHeight: 18, color: '#1D1C1A' }]}>
        {lesson.title}
      </AppText>
    </PressScale>
  );
}
