import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useId, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { WeekScene, WEEK_SCENE_HEIGHT } from '@/components/journey/WeekScene';
import { AppText, Grain, PressScale } from '@/components/ui';
import { weekFor, type Curriculum84Lesson } from '@/content/curriculum84';
import { useCurrentUser, useLessonProgressMap } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * 92A–92L · the week overview.
 *
 * One board per week: the week's name, the line under it, the picture, and the
 * seven lessons it holds. The canvas draws each week twice — `Week I Reset` and
 * `Week I Reset P2` — but the two frames are byte-identical outside the row
 * column, and the row window fits exactly the four rows the first frame draws.
 * They are one scrolling screen at two scroll positions, not two boards
 * (DECISIONS D-019).
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** Card 56 tall on an 80 pitch — the 24 between them is where the pips sit. */
const ROW_H = 56;
const ROW_PITCH = 80;

type RowState = 'done' | 'current' | 'locked';

export default function WeekOverview() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const user = useCurrentUser();
  const progress = useLessonProgressMap();
  const width = useWindowDimensions().width;

  const n = Math.max(1, Math.min(12, Number(week) || 1));
  const data = weekFor(n);

  // Which day the user is on. Day one is the day they signed up, not the day
  // after — the same reckoning `day/morning.tsx` uses. Read once on mount so a
  // re-render cannot move the current row under the reader.
  const [now] = useState(() => Date.now());
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;

  const stateFor = (lesson: Curriculum84Lesson): RowState => {
    if (lesson.day < day) return 'done';
    if (lesson.day === day) return 'current';
    return 'locked';
  };

  if (!data) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* canvas 64 — a chevron and nothing else; these frames carry no word */}
        <PressScale
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/today'))}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, zIndex: 5 }}>
          <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
            <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </PressScale>

        {/* canvas 114 */}
        <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
          {data.name}
        </AppText>
        {/* canvas 158 */}
        <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 60, top: 104, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
          Week {data.roman} · {data.blurb}
        </AppText>

        {/* canvas 214, 258 tall, with its own fade to the field at the foot */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 160, height: WEEK_SCENE_HEIGHT, overflow: 'hidden' }}>
          <WeekScene week={n} width={width} />
        </View>

        {/* canvas 486 — the row column, scrolling under the closing band */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ position: 'absolute', left: 0, right: 0, top: 432, bottom: 0 }}
          contentContainerStyle={{ paddingBottom: 108 }}>
          {data.lessons.map((lesson, index) => (
            <View key={lesson.day}>
              <LessonRow
                title={lesson.title}
                number={String(lesson.day).padStart(2, '0')}
                state={progress ? stateFor(lesson) : 'locked'}
                onPress={() => router.push(`/lesson-card/${lesson.day}`)}
              />
              {index < data.lessons.length - 1 ? <Pips /> : null}
            </View>
          ))}
        </ScrollView>

        {/* canvas 798 — the land the board closes on */}
        <ClosingLand width={width} />
      </SafeAreaView>
    </View>
  );
}

/** One lesson: a glyph disc, the title, and its two-digit number. */
function LessonRow({ title, number, state, onPress }: { title: string; number: string; state: RowState; onPress: () => void }) {
  const done = state === 'done';
  const current = state === 'current';
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, lesson ${number}`}
      style={{
        marginHorizontal: 24,
        height: ROW_H,
        minHeight: ROW_H,
        borderRadius: 14,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: current ? '0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)' : '0 0 0 1px rgba(0,0,0,0.06)',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: done || current ? '#131313' : 'rgba(19,19,19,0.05)',
          boxShadow: done || current ? undefined : 'inset 0 0 0 1.5px rgba(0,0,0,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {done ? (
          <Svg width={12} height={10} viewBox="0 0 16 13" fill="none">
            <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#F4F3F0" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : current ? (
          <Svg width={13} height={13} viewBox="0 0 24 24">
            <Path d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z" fill="#F4F3F0" />
          </Svg>
        ) : (
          <Svg width={12} height={13} viewBox="0 0 16 17" fill="none">
            <Path d="M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5" stroke="#A5A29B" strokeWidth={1.8} />
            <Rect x={3} y={7.5} width={10} height={7.5} rx={2} fill="#A5A29B" />
          </Svg>
        )}
      </View>
      <AppText numberOfLines={1} style={[sans('500'), { flex: 1, fontSize: 15.5, color: done || current ? '#1D1C1A' : '#8B8882' }]}>
        {title}
      </AppText>
      <AppText style={[sans(current ? '600' : '500'), { fontSize: 12.5, color: current ? '#1D1C1A' : done ? '#8B8882' : '#B0AEA8' }]}>{number}</AppText>
    </PressScale>
  );
}

/**
 * The two dots in each 24pt gap. The canvas puts them at frame left 52 — 28
 * inside the row column's own 24pt inset — and at gap-local +5 and +13.
 */
function Pips() {
  return (
    <View style={{ height: ROW_PITCH - ROW_H }}>
      <View style={{ position: 'absolute', left: 52, top: 5, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
      <View style={{ position: 'absolute', left: 52, top: 13, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
    </View>
  );
}

/** Two headlands closing the board, drawn as the elliptical domes they are. */
function ClosingLand({ width }: { width: number }) {
  const id = useId().replace(/:/g, '');
  const dome = (x: number, w: number, y: number, h: number, ry: number) =>
    `M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}L${x + w} ${y + h}L${x} ${y + h}Z`;
  // left:-30 right:40% and left:35% right:-40, resolved against the live width.
  const aX = -30;
  const aW = width * 0.6 + 30;
  const bX = width * 0.35;
  const bW = width * 0.65 + 40;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 54, overflow: 'hidden' }}>
      <Svg width={width} height={54} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <SvgLinearGradient id={`land${id}`} x1="0" y1="0" x2="0" y2="54" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#ECEBE6" />
            <Stop offset="1" stopColor="#E7E6E0" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={54} fill={`url(#land${id})`} />
        <Path d={dome(aX, aW, 30, 80, 44)} fill="#CFD9E2" />
        <Path d={dome(bX, bW, 38, 80, 40)} fill="#C4D2DE" />
      </Svg>
    </View>
  );
}
