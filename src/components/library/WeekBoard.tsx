import { useRouter } from 'expo-router';
import { useId } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { WeekScene, WEEK_SCENE_HEIGHT } from '@/components/journey/WeekScene';
import { AppText, PressScale } from '@/components/ui';
import type { Curriculum84Lesson, Curriculum84Week } from '@/content/curriculum84';
import { sans } from '@/lib/theme';

/**
 * `Week I Reset` … `Week XII Leave It Behind` — one week, as the canvas draws
 * it: the name, the line under it, the picture, and the seven lessons it holds.
 *
 * The bundle draws each week twice, `Week N …` and `Week N … P2`. The diff
 * between the pair is the row column alone — the header and the scene do not
 * move — so they are one board at two scroll positions, which is why the pushed
 * `/week/[week]` route pins the scene and scrolls only the rows (D-019).
 *
 * The Library stacks all twelve, and there the inner scroller is exactly what
 * must not exist: a board renders at its **natural height** with all seven rows
 * standing, and the page scrolls. Same pixels, no nested scroll.
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54.
 */

/** Card 56 tall on an 80 pitch — the 24 between them is where the pips sit. */
export const ROW_H = 56;
export const ROW_PITCH = 80;

/** Header block: name at canvas 114, blurb at 158, the scene starting at 214. */
export const HEADER_H = 160;
/** Canvas 472 → 486: the air between the scene's foot and the first row. */
export const ROWS_TOP_GAP = 14;
export const LAND_H = 54;

/**
 * The air between one week and the next in the Library.
 *
 * The pushed board closes on a land band at canvas 798 because it is the floor
 * of a screen. Stacked twelve deep that band becomes a seam repeated eleven
 * times, so the Library drops it and separates the weeks with paper instead.
 * With the next week's own 60 above its name that is 220pt of nothing, which is
 * what tells you a week ended rather than a rule drawn across the page.
 */
export const WEEK_GAP = 160;

export type RowState = 'done' | 'current' | 'locked';

/** Where a lesson stands relative to the day the reader is on. */
export function rowStateFor(lesson: Curriculum84Lesson, day: number): RowState {
  if (lesson.day < day) return 'done';
  if (lesson.day === day) return 'current';
  return 'locked';
}

/** How tall one Library board stands, its trailing gap included. */
export function weekBoardHeight(lessonCount: number): number {
  return HEADER_H + WEEK_SCENE_HEIGHT + ROWS_TOP_GAP + lessonCount * ROW_PITCH - (ROW_PITCH - ROW_H) + WEEK_GAP;
}

/** The name and the line under it — canvas 114 and 158. */
export function WeekHeading({ week }: { week: Curriculum84Week }) {
  return (
    <View style={{ height: HEADER_H }}>
      <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>{week.name}</AppText>
      {/* `HEADER_H` is a fixed 160 and the Library's `getItemLayout` trusts it,
          so the blurb is held to the two lines every current one sets: a third
          would run into the scene band and the board below would not move. */}
      <AppText numberOfLines={2} style={[sans('400'), { position: 'absolute', left: 24, right: 60, top: 104, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
        Week {week.roman} · {week.blurb}
      </AppText>
    </View>
  );
}

/** One lesson: a state disc, the title, and its two-digit number. */
export function LessonRow({ title, number, state, onPress }: { title: string; number: string; state: RowState; onPress: () => void }) {
  const done = state === 'done';
  const current = state === 'current';
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, lesson ${number}, ${done ? 'completed' : current ? 'today' : 'locked'}`}
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
export function Pips() {
  return (
    <View style={{ height: ROW_PITCH - ROW_H }}>
      <View style={{ position: 'absolute', left: 52, top: 5, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
      <View style={{ position: 'absolute', left: 52, top: 13, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
    </View>
  );
}

/**
 * The seven rows with their pips between. Given as a fragment so the pushed
 * route can put them in its scroller and the Library can put them in its flow.
 */
export function LessonRows({ week, day, onLesson }: { week: Curriculum84Week; day: number; onLesson: (lessonDay: number) => void }) {
  return (
    <>
      {week.lessons.map((lesson, index) => (
        <View key={lesson.day}>
          <LessonRow
            title={lesson.title}
            number={String(lesson.day).padStart(2, '0')}
            state={rowStateFor(lesson, day)}
            onPress={() => onLesson(lesson.day)}
          />
          {index < week.lessons.length - 1 ? <Pips /> : null}
        </View>
      ))}
    </>
  );
}

/**
 * Two headlands closing the board, drawn as the elliptical domes they are.
 *
 * Canvas 798, pinned to the foot of the pushed screen. The Library does not
 * draw it: stacked twelve deep it reads as a seam between weeks rather than a
 * floor under one.
 */
export function ClosingLand({ width }: { width: number }) {
  const id = useId().replace(/:/g, '');
  const dome = (x: number, w: number, y: number, h: number, ry: number) =>
    `M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}L${x + w} ${y + h}L${x} ${y + h}Z`;
  // left:-30 right:40% and left:35% right:-40, resolved against the live width.
  const aX = -30;
  const aW = width * 0.6 + 30;
  const bX = width * 0.35;
  const bW = width * 0.65 + 40;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: LAND_H, overflow: 'hidden' }}>
      <Svg width={width} height={LAND_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <SvgLinearGradient id={`land${id}`} x1="0" y1="0" x2="0" y2={LAND_H} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#ECEBE6" />
            <Stop offset="1" stopColor="#E7E6E0" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={LAND_H} fill={`url(#land${id})`} />
        <Path d={dome(aX, aW, 30, 80, 44)} fill="#CFD9E2" />
        <Path d={dome(bX, bW, 38, 80, 40)} fill="#C4D2DE" />
      </Svg>
    </View>
  );
}

/**
 * One whole week at its natural height — what the Library stacks twelve of.
 *
 * Nothing here scrolls: the page it sits in does. And nothing closes it but
 * air — see `WEEK_GAP`.
 */
export function WeekBoard({ week, day }: { week: Curriculum84Week; day: number }) {
  const router = useRouter();
  const width = useWindowDimensions().width;
  return (
    <View>
      <WeekHeading week={week} />
      <View style={{ height: WEEK_SCENE_HEIGHT, overflow: 'hidden' }}>
        <WeekScene week={week.n} width={width} />
      </View>
      <View style={{ height: ROWS_TOP_GAP }} />
      <LessonRows week={week} day={day} onLesson={(lessonDay) => router.push(`/lesson-card/${lessonDay}`)} />
      <View style={{ height: WEEK_GAP }} />
    </View>
  );
}
