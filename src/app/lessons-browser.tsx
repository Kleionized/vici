import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useId } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Grain, LoadingView, PressScale } from '@/components/ui';
import { useCurrentLesson, useLessonProgressMap } from '@/lib/backend';
import { INTERACTIVE_WEEKS } from '@/lib/curriculum';
import { weekHeading } from '@/lib/lessonArt';
import { sans } from '@/lib/theme';
import type { InteractiveLesson } from '@/lib/types';

/**
 * 159 · Lessons Browser.
 *
 * The whole curriculum as a shelf per week: each lesson a small paper tile
 * carrying its title at the top and one drawn object underneath, lit by the
 * same warm wash the rest of the app draws its objects in. Weeks you have not
 * reached still show their tiles — the shape of what is coming is the point —
 * with a padlock on the ones that will not open yet.
 *
 * It opens over whatever you were doing, hence "Cancel" rather than a back
 * chevron: this is a place you look something up, not a place you end up. The
 * Library tab shows the journey now, so this is the only frame that draws the
 * shelves and it keeps them to itself.
 *
 * Canvas y values below are the 393 × 852 frame's; the status bar ends at 54,
 * so everything under the safe area is 54 less.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const TILE_W = 118;
const TILE_H = 168;
/** canvas tile lefts 13 / 144 / 275 — a 13 margin and a 13 gap, three across */
const GUTTER = 13;

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

/** Every week as a shelf: its heading, then its lessons as tiles. */
function Shelves({ contentBottom }: { contentBottom: number }) {
  const router = useRouter();
  const current = useCurrentLesson();
  const progress = useLessonProgressMap();

  if (current === undefined || progress === undefined) return <LoadingView />;

  const currentOrder = current?.lesson.orderIndex ?? Infinity;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingBottom: contentBottom }}>
      {INTERACTIVE_WEEKS.map((week, index) => {
        const lessons = week.subs.flatMap((sub) => sub.lessons);
        if (!lessons.length) return null;
        return (
          // canvas: heading at y 104, its shelf 36 lower, 40 of air to the next heading
          <View key={week.n} style={{ marginTop: index ? 40 : 0 }}>
            <AppText numberOfLines={1} style={[sans('600'), { marginLeft: GUTTER, fontSize: 20, color: '#1D1C1A' }]}>
              {weekHeading(week.n)}
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingHorizontal: GUTTER, gap: GUTTER }}>
              {lessons.map((lesson) => (
                <LessonTile
                  key={lesson.slug}
                  lesson={lesson}
                  locked={lesson.order > currentOrder && progress[lesson.slug]?.status !== 'completed'}
                  onPress={() => router.push(`/lesson-overview/${lesson.slug}`)}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

/** One tile: its title, its drawn object under the light, a padlock if it is not open yet. */
function LessonTile({ lesson, locked, onPress }: { lesson: InteractiveLesson; locked: boolean; onPress: () => void }) {
  // useId carries colons, which an url(#id) reference will not take.
  const id = useId().replace(/:/g, '');
  const art = TILE_ART[Math.abs(lesson.order) % TILE_ART.length];
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
      <TileLight id={id} night={art.night} />
      {art.draw()}
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
        numberOfLines={3}
        style={[sans('600'), { position: 'absolute', left: 11, right: locked ? 30 : 11, top: 22, fontSize: 13.5, lineHeight: 18, color: '#1D1C1A' }]}>
        {lesson.title}
      </AppText>
    </PressScale>
  );
}

/**
 * The wash every tile object stands in, plus the shadow it casts. The canvas
 * blurs both by 3px and RN SVG has no blur filter, so each is drawn as a radial
 * gradient with the same falloff: the wash keeps the canvas's own two stops
 * (0.34 at the centre, nothing at 74%), and the cast shadow holds its flat
 * rgba(0,0,0,0.08) out to 55% before ramping away, which is what the blur does
 * to a hard-edged 52 × 8 ellipse.
 */
function TileLight({ id, night }: { id: string; night?: boolean }) {
  const tone = night ? '#8E99A8' : '#E2BA78';
  return (
    <Svg width={TILE_W} height={TILE_H} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id={`glow${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={tone} stopOpacity={night ? 0.3 : 0.34} />
          <Stop offset="0.74" stopColor={tone} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`cast${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={0.08} />
          <Stop offset="0.55" stopColor="#000000" stopOpacity={0.08} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {/* canvas: 78 × 78 at top 62, centred — box 20→98 × 62→140 */}
      <Ellipse cx={59} cy={101} rx={39} ry={39} fill={`url(#glow${id})`} />
      {/* canvas: 52 × 8 at top 124, centred */}
      <Ellipse cx={59} cy={128} rx={26} ry={4} fill={`url(#cast${id})`} />
    </Svg>
  );
}

interface TileArt {
  /** the two night objects stand in a cool wash rather than the warm one */
  night?: boolean;
  draw: () => ReactNode;
}

/**
 * The twelve tile objects, in the canvas's order. Keyed on a lesson's place in
 * the curriculum so a lesson keeps the same face wherever it is drawn.
 */
const TILE_ART: TileArt[] = [
  {
    // the banner on its pole
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -10, top: 84, width: 3.5, height: 42, borderRadius: 2, backgroundColor: '#C4C3BC' }} />
        <Svg width={24} height={16} viewBox="0 0 30 20" style={{ position: 'absolute', left: '50%', marginLeft: -7, top: 84 }}>
          <Path d="M0 2 C7 -0.5 11 3.5 18 2 L18 13 C11 15.5 7 11.5 0 14 Z" fill="#3A3934" />
        </Svg>
      </>
    ),
  },
  {
    // the climb that dips before it rises, arrow at its head
    draw: () => (
      <Svg width={44} height={36} viewBox="0 0 44 36" style={{ position: 'absolute', left: '50%', marginLeft: -22, top: 88 }}>
        <Path d="M3 32 L15 20 L23 26 L41 8" stroke="#55534E" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M32 7 L41 7 L41 16" stroke="#55534E" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    // the wave, ridden out
    draw: () => (
      <Svg width={54} height={42} viewBox="0 0 26 20" style={{ position: 'absolute', left: '50%', marginLeft: -27, top: 84 }}>
        <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke="#55534E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    // the lens — the canvas's inset 5px ring is a border in RN
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -19, top: 84, width: 30, height: 30, borderRadius: 15, borderWidth: 5, borderColor: '#B4B1AB' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: 7, top: 112, width: 17, height: 6, borderRadius: 3, backgroundColor: '#8B8882', transform: [{ rotate: '42deg' }] }} />
      </>
    ),
  },
  {
    // four dots, the first one lit
    draw: () => (
      <View style={{ position: 'absolute', left: '50%', marginLeft: -34, top: 98, flexDirection: 'row', gap: 9 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E9D2A4' }} />
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#C6C5C0' }} />
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#C6C5C0' }} />
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#C6C5C0' }} />
      </View>
    ),
  },
  {
    // two cards, the top one written on
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -25, top: 90, width: 50, height: 34, borderRadius: 4, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />
        <View
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: -22,
            top: 87,
            width: 44,
            height: 34,
            borderRadius: 3,
            backgroundColor: '#F7F6F2',
            transform: [{ rotate: '-2deg' }],
            boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
          }}
        />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -14, top: 96, width: 20, height: 3, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -14, top: 104, width: 26, height: 3, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      </>
    ),
  },
  {
    // two speech bubbles, one answering the other
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -26, top: 88, width: 36, height: 25, borderRadius: 9, backgroundColor: '#F7F6F2', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -18, top: 108, width: 8, height: 8, backgroundColor: '#F7F6F2', transform: [{ rotate: '45deg' }] }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -2, top: 102, width: 28, height: 20, borderRadius: 8, backgroundColor: '#D6D5D0' }} />
      </>
    ),
  },
  {
    // the crescent, cut by a disc of the tile's own paper
    night: true,
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -17, top: 86, width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCDED8' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -24, top: 81, width: 34, height: 34, borderRadius: 17, backgroundColor: '#F0EFE9' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: 22, top: 90, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: 'rgba(142,153,168,0.6)' }} />
      </>
    ),
  },
  {
    // the phone, face down on the table
    night: true,
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -9, top: 84, width: 18, height: 38, borderRadius: 4, backgroundColor: '#131313' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -16, top: 120, width: 32, height: 5, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
      </>
    ),
  },
  {
    // three bars, the tallest one inked
    draw: () => (
      <View style={{ position: 'absolute', left: '50%', marginLeft: -26, top: 90, width: 52, height: 34, flexDirection: 'row', alignItems: 'flex-end', gap: 7 }}>
        <View style={{ flex: 1, height: 14, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
        <View style={{ flex: 1, height: 22, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
        <View style={{ flex: 1, height: 34, borderRadius: 3, backgroundColor: '#131313' }} />
      </View>
    ),
  },
  {
    // the window with the sun in it, and the light falling in beside it
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -22, top: 82, width: 44, height: 44, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -16, top: 88, width: 32, height: 38, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#F9F8F4' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -6, top: 100, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E9D2A4' }} />
        <View
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: 16,
            top: 86,
            width: 14,
            height: 42,
            borderRadius: 2,
            backgroundColor: '#D6D5D0',
            transform: [{ skewY: '-8deg' }],
            transformOrigin: 'left top',
          }}
        />
      </>
    ),
  },
  {
    // the clock, kept
    draw: () => (
      <>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -18, top: 84, width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: '#C6C5C0', backgroundColor: '#F7F6F2' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -1.5, top: 92, width: 3, height: 11, borderRadius: 2, backgroundColor: '#55534E' }} />
        <View style={{ position: 'absolute', left: '50%', marginLeft: -1, top: 100, width: 9, height: 3, borderRadius: 2, backgroundColor: '#55534E' }} />
      </>
    ),
  },
];
