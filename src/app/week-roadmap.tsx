import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, LoadingView } from '@/components/ui';
import { WorldArt } from '@/components/journey/WorldArt';
import { CATEGORY_LABEL } from '@/lib/labels';
import { useCurrentLesson, useLessonProgressMap, useLessons } from '@/lib/backend';
import { colors, fonts, sans } from '@/lib/theme';
import { WORLDS } from '@/lib/worlds';

/**
 * The per-world HUB (canvas: screens-worlds · WorldHubScreen) — the world's
 * kept visualization on top, fading into the page; a glass header bar
 * (back · name + GROUND N OF X); then the timeline: a continuous rail with
 * state nodes, one section header, and illustrated lesson cards — the
 * current lesson is the home screen's dark Next-lesson surface.
 */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const RAIL_X = 30;

type RowState = 'done' | 'current' | 'locked';

export default function WeekRoadmap() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const lessons = useLessons();
  const current = useCurrentLesson();
  const progress = useLessonProgressMap();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/weeks'));

  if (!lessons || current === undefined || progress === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <LoadingView />
      </View>
    );
  }

  const weekNum = week ? Number(week) : (current?.lesson.week ?? 1);
  const world = WORLDS.find((w) => w.n === weekNum);
  const worldKey = world?.key ?? 'shore';
  const weekLessons = lessons.filter((l) => l.week === weekNum).sort((a, b) => a.orderIndex - b.orderIndex);
  const doneCount = weekLessons.filter((l) => progress[l.slug]?.status === 'completed').length;
  const theme = weekLessons[0] ? CATEGORY_LABEL[weekLessons[0].category] : `Week ${weekNum}`;
  const currentOrder = current?.lesson.orderIndex ?? Infinity;

  const stateOf = (l: (typeof weekLessons)[number]): RowState => {
    if (progress[l.slug]?.status === 'completed') return 'done';
    if (current?.lesson.slug === l.slug) return 'current';
    return l.orderIndex > currentOrder ? 'locked' : 'current';
  };
  const reachedOf = (s: RowState) => s !== 'locked';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* the kept visualization — clears the header, settles into the page */}
        <View style={{ height: 268, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 402 / 300 }}>
            <WorldArt scene={worldKey} fit="xMidYMid slice" />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 118 }}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          </View>
          {/* fade to paper */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 96 }}>
            {[0.0, 0.18, 0.4, 0.66, 0.88, 1].map((o, i, arr) => (
              <View key={i} style={{ flex: 1, backgroundColor: `rgba(244,243,240,${o})` }} />
            ))}
          </View>
        </View>

        {/* the timeline */}
        <View style={{ paddingBottom: 44, paddingTop: 26 }}>
          {/* section header row */}
          <SectionHeaderRow
            meta={`Ground ${ROMAN[weekNum - 1] ?? weekNum}`}
            title={theme}
            sub={world?.sub ?? ''}
            reached={doneCount > 0 || weekLessons.some((l) => stateOf(l) === 'current')}
            bottomAccent={weekLessons.length > 0 && reachedOf(stateOf(weekLessons[0]))}
          />
          {weekLessons.map((l, i) => {
            const st = stateOf(l);
            const isCurrent = current?.lesson.slug === l.slug;
            const rowState: RowState = isCurrent ? 'current' : st;
            const next = weekLessons[i + 1];
            return (
              <LessonRow
                key={l.slug}
                i={i}
                title={l.title}
                mins={l.estimatedMinutes ?? 5}
                type={l.reflectionFields.length ? 'Practice' : 'Article'}
                state={rowState}
                isCurrent={isCurrent}
                last={i === weekLessons.length - 1}
                topAccent={reachedOf(rowState)}
                bottomAccent={next ? reachedOf(stateOf(next)) : false}
                onPress={rowState === 'locked' ? undefined : () => router.push(`/lesson/${l.slug}`)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* the fixed glass header bar */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(244,243,240,0.86)', borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 10 }}>
          <Pressable onPress={back} hitSlop={8} accessibilityLabel="Back" style={{ width: 42, height: 42, borderRadius: 9999, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 5l-7 7 7 7" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 8 }}>
            <AppText numberOfLines={1} style={[sans('500'), { fontSize: 18, letterSpacing: -0.09, color: colors.text }]}>
              {world?.name ?? theme}
            </AppText>
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 3 }]}>
              Ground {ROMAN[weekNum - 1] ?? weekNum} of X
            </AppText>
          </View>
          <View style={{ width: 42, height: 42, borderRadius: 9999, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 15V4.2M12 4.2 8 8.2M12 4.2l4 4" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// the section header that opens a world's timeline
function SectionHeaderRow({ meta, title, sub, reached, bottomAccent }: { meta: string; title: string; sub: string; reached: boolean; bottomAccent: boolean }) {
  const NODE_C = 30;
  return (
    <View style={{ position: 'relative', minHeight: NODE_C + 94 }}>
      <View style={{ position: 'absolute', left: RAIL_X - 1.25, top: NODE_C, bottom: 0, width: 2.5, backgroundColor: bottomAccent ? colors.ink : colors.border }} />
      <View
        style={{
          position: 'absolute',
          left: RAIL_X - 15,
          top: NODE_C - 15,
          width: 30,
          height: 30,
          borderRadius: 9999,
          zIndex: 1,
          backgroundColor: reached ? colors.ink : colors.surface,
          borderWidth: reached ? 0 : 2.5,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {reached ? (
          <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12.5l4.5 4.5L19 7" stroke={colors.inkText} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
      <View style={{ marginLeft: 68, paddingTop: 16, paddingRight: 24 }}>
        <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>{meta}</AppText>
        <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 26, lineHeight: 30, letterSpacing: 0.26, color: colors.text, marginTop: 8 }}>
          {title}
        </AppText>
        <AppText style={[sans('400'), { fontSize: 14.5, lineHeight: 20, color: colors.textMuted, marginTop: 8 }]}>{sub}</AppText>
      </View>
    </View>
  );
}

// one timeline row: rail node + illustrated lesson card
function LessonRow({
  i,
  title,
  mins,
  type,
  state,
  isCurrent,
  last,
  topAccent,
  bottomAccent,
  onPress,
}: {
  i: number;
  title: string;
  mins: number;
  type: string;
  state: RowState;
  isCurrent: boolean;
  last: boolean;
  topAccent: boolean;
  bottomAccent: boolean;
  onPress?: () => void;
}) {
  const done = state === 'done';
  const locked = state === 'locked';
  const NODE_C = 58;
  const nodeSz = done || isCurrent ? 30 : 22;
  return (
    <View style={{ position: 'relative', height: last ? 100 : 112 }}>
      <View style={{ position: 'absolute', left: RAIL_X - 1.25, top: 0, height: NODE_C, width: 2.5, backgroundColor: topAccent ? colors.ink : colors.border }} />
      {!last ? (
        <View style={{ position: 'absolute', left: RAIL_X - 1.25, top: NODE_C, bottom: 0, width: 2.5, backgroundColor: bottomAccent ? colors.ink : colors.border }} />
      ) : null}
      <View
        style={{
          position: 'absolute',
          left: RAIL_X - nodeSz / 2,
          top: NODE_C - nodeSz / 2,
          width: nodeSz,
          height: nodeSz,
          borderRadius: 9999,
          zIndex: 1,
          backgroundColor: done ? colors.ink : colors.surface,
          borderWidth: done ? 0 : 2.5,
          borderColor: isCurrent || !locked ? colors.ink : colors.border,
          opacity: locked ? 0.7 : 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {done ? (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12.5l4.5 4.5L19 7" stroke={colors.inkText} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : !isCurrent && !locked ? (
          <View style={{ width: 7, height: 7, borderRadius: 9999, backgroundColor: colors.ink }} />
        ) : null}
      </View>
      {/* the card — the current lesson is the home's dark Next-lesson surface */}
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => ({
          position: 'absolute',
          left: 68,
          right: 24,
          top: 12,
          height: 92,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: isCurrent ? '#131313' : colors.surface,
          opacity: locked ? 0.5 : 1,
          justifyContent: 'center',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        })}>
        <View style={{ paddingLeft: 20, paddingRight: 96 }}>
          <AppText
            style={
              isCurrent
                ? [sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase' as const, color: 'rgba(245,244,241,0.62)' }]
                : [sans('400'), { fontSize: 13, color: colors.textSoft }]
            }>
            {isCurrent ? 'Next lesson' : `${type} · ${mins} min`}
          </AppText>
          <AppText
            numberOfLines={2}
            style={
              isCurrent
                ? { fontFamily: fonts.serif, fontSize: 18, lineHeight: 21.5, letterSpacing: 0.09, color: '#F5F4F1', marginTop: 5 }
                : [sans('500'), { fontSize: 15.5, lineHeight: 18.5, letterSpacing: -0.08, color: colors.text, marginTop: 5 }]
            }>
            {title}
          </AppText>
          {isCurrent ? (
            <AppText style={[sans('500'), { fontSize: 12, color: 'rgba(245,244,241,0.55)', marginTop: 5, fontVariant: ['tabular-nums'] }]}>
              {type} · {mins} min
            </AppText>
          ) : null}
        </View>
        {/* the illustration tile — Roman numeral, or a lock */}
        <View
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            width: 72,
            height: 72,
            borderRadius: 18,
            backgroundColor: isCurrent ? 'rgba(245,244,241,0.1)' : colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {locked ? (
            <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
              <Path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" stroke={colors.textSofter} strokeWidth={2} />
              <Path d="M4.4 10h15.2v9a2.6 2.6 0 0 1-2.6 2.6H7a2.6 2.6 0 0 1-2.6-2.6z" stroke={colors.textSofter} strokeWidth={2} />
            </Svg>
          ) : (
            <AppText style={{ fontFamily: fonts.serif, fontSize: 27, letterSpacing: 1.35, color: isCurrent ? '#F5F4F1' : '#4A4A42' }}>
              {ROMAN[i % 10]}
            </AppText>
          )}
        </View>
      </Pressable>
    </View>
  );
}
