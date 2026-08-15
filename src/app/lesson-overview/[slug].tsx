import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { StoicTabBar } from '@/components/StoicTabBar';
import { LessonCoverScene, LessonHorizon, LessonScene, LessonTrail, type LessonTint, tintForLesson, tintTones } from '@/components/lesson/scenes';
import { AppText, EmptyState, Grain, LoadingView, PressScale } from '@/components/ui';
import { useLessonDetail } from '@/lib/backend';
import { interactiveLesson } from '@/lib/curriculum';
import { colors, sans } from '@/lib/theme';
import type { InteractiveLesson } from '@/lib/types';
import { WORLDS } from '@/lib/worlds';

const noiseDark = require('../../../assets/images/noise-dark.png');

/**
 * A lesson, before you are in it. The bundle draws this in two states and they
 * are the same screen at two moments:
 *
 *   Story Detail (181) — a lesson you have not opened. A tall cover scene, the
 *   title, what it is about in one line, a horizon band, how many parts it runs
 *   and one pill reading "Start lesson".
 *
 *   Story Tracks (180) — a lesson you are inside. The shorter header, then the
 *   parts themselves as a contents table with a tick on what you have read, and
 *   a pill pointing at wherever you stopped.
 *
 * Both carry the tab bar with Library lit, because this is the drill-down from
 * the Library tab rather than somewhere you were pushed to.
 *
 * Canvas y values below are the 393 × 852 frame's; the status bar ends at 54,
 * so everything under the safe area is 54 less.
 */
export default function LessonOverview() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const detail = useLessonDetail(slug ?? '');
  const { width } = useWindowDimensions();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/library'));

  if (detail === undefined) return <LoadingView />;
  if (detail === null) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackRow onPress={back} />
        <EmptyState title="Lesson not found" body="It may have been removed or not imported yet." />
      </SafeAreaView>
    );
  }

  const { lesson, progress } = detail;
  const content = interactiveLesson(lesson.slug);
  const world = WORLDS.find((item) => item.n === lesson.week);
  const where = world ? `Week ${lesson.week} · ${world.sub}` : `Week ${lesson.week}`;
  const started = progress?.status === 'in_progress' || progress?.status === 'completed';
  const done = progress?.status === 'completed';
  const beats = content ? lessonParts(content) : [];
  const tint = tintForLesson(`${lesson.title} ${content?.heading ?? ''}`);

  // Before the lesson every part is ahead of you; after it, every part is
  // behind. In between we only know the lesson is open, so the first part is
  // the one to point at.
  const reached = done ? beats.length : started ? 1 : 0;
  const next = beats[Math.min(reached, beats.length - 1)];
  const cta = done ? 'Review lesson' : started ? `Continue — ${next?.number ?? 'lesson'}` : 'Start lesson';
  const open = () => router.replace(`/lesson/${lesson.slug}${started ? '?from=overview' : ''}` as never);

  const meta = (
    <View style={{ marginLeft: 16, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
      <AppText style={[sans('500'), { fontSize: 14, color: '#8B8882' }]}>{lesson.estimatedMinutes ?? 4} min</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <BookGlyph />
        <AppText style={[sans('500'), { fontSize: 14, color: '#8B8882' }]}>{where}</AppText>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}>
        {started ? (
          <TracksBody width={width} tint={tint} title={lesson.title} meta={meta} beats={beats} reached={reached} />
        ) : (
          <DetailBody width={width} tint={tint} title={lesson.title} meta={meta} blurb={blurbFor(content)} parts={beats.length} />
        )}
      </ScrollView>

      {/* The pill is set from the foot of the frame, not from the rows above it:
          the canvas leaves 17 between it and the tab bar on Story Tracks and 25
          on Story Detail, which puts its top back on the frame's 704 and 692. */}
      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: started ? 17 : 25, backgroundColor: colors.bg }}>
        <PressScale
          onPress={open}
          accessibilityRole="button"
          style={{
            height: started ? 48 : 52,
            borderRadius: started ? 24 : 26,
            backgroundColor: '#131313',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText numberOfLines={1} style={[sans('600'), { fontSize: started ? 16.5 : 17, color: '#FFFFFF' }]}>{cta}</AppText>
        </PressScale>
      </View>
      <StoicTabBar />

      {/* the way back, floating over the wash */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <BackRow onPress={back} />
      </SafeAreaView>
    </View>
  );
}

/**
 * Story Detail. The cover scene runs to 330 and the title sits at 366, so the
 * gap is 36; every offset under it is the canvas's own, less the one above it.
 */
function DetailBody({
  width,
  tint,
  title,
  meta,
  blurb,
  parts,
}: {
  width: number;
  tint: LessonTint;
  title: string;
  meta: React.ReactNode;
  blurb: string;
  parts: number;
}) {
  return (
    <>
      {/* the grain goes down on the sky and under the art, as the canvas has it */}
      <LessonCoverScene width={width} height={330} tint={tint}>
        <Grain source={noiseDark} opacity={0.05} />
      </LessonCoverScene>

      {/* the canvas sets this `white-space: nowrap` with no right bound, so it
          runs to the screen edge and stops */}
      <AppText
        numberOfLines={1}
        style={[sans('500'), { marginTop: 36, marginLeft: 16, fontSize: 27, letterSpacing: -0.3, color: '#1D1C1A' }]}>
        {title}
      </AppText>
      <View style={{ marginTop: 16 }}>{meta}</View>
      {/* the canvas's line wraps twice inside its right:60 bound, and the band
          under it is set from the frame rather than from the text, so the box
          keeps its two lines whether or not this lesson's line fills them */}
      <AppText
        numberOfLines={2}
        style={[sans('400'), { marginTop: 23, marginLeft: 16, marginRight: 60, height: 48, fontSize: 15, lineHeight: 24, color: '#55534E' }]}>
        {blurb}
      </AppText>

      <View style={{ marginTop: 6 }}>
        <LessonHorizon width={width} height={112} tint={tint} />
      </View>

      {/* canvas: the band ends at 620 and the count row sits at 650 */}
      <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        {Array.from({ length: Math.min(parts, 8) }).map((_, index) => (
          <View
            key={index}
            style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: index ? 'rgba(19,19,19,0.28)' : '#131313' }}
          />
        ))}
        <AppText style={[sans('500'), { marginLeft: 7, fontSize: 13.5, color: '#8B8882' }]}>
          {parts === 1 ? '1 short part' : `${parts} short parts`}
        </AppText>
      </View>
    </>
  );
}

/** Story Tracks: the same lesson once it is open, as a contents table. */
function TracksBody({
  width,
  tint,
  title,
  meta,
  beats,
  reached,
}: {
  width: number;
  tint: LessonTint;
  title: string;
  meta: React.ReactNode;
  beats: { number: string; label: string }[];
  reached: number;
}) {
  return (
    <>
      <LessonScene width={width} height={232} tint={tint}>
        <Grain source={noiseDark} opacity={0.05} />
      </LessonScene>

      <AppText
        numberOfLines={1}
        style={[sans('500'), { marginTop: 24, marginLeft: 16, fontSize: 26, letterSpacing: -0.3, color: '#1D1C1A' }]}>
        {title}
      </AppText>
      <View style={{ marginTop: 15 }}>{meta}</View>

      <View style={{ marginTop: 25 }}>
        <LessonTrail tint={tint} />
      </View>

      <View style={{ marginTop: 35, paddingHorizontal: 16 }}>
        {beats.map((beat, index) => (
          <PartRow
            key={beat.number}
            label={beat.label}
            tint={tint}
            state={index < reached ? 'done' : index === reached ? 'current' : 'ahead'}
            first={index === 0}
          />
        ))}
      </View>
    </>
  );
}

/** The 0.05 grain both header scenes lay down before their art. */

function BackRow({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ height: 40, paddingHorizontal: 16, justifyContent: 'center' }}>
      <PressScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Back to the library"
        style={{ minHeight: 0, alignSelf: 'flex-start', paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 9 }}
        hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}>
        <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
          <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Library</AppText>
      </PressScale>
    </View>
  );
}

/**
 * One part of the lesson: a tick for what you have read, a solid caret for
 * where you are, and a soft one for what is still ahead. No hairlines — the
 * row you have reached is the first one still in ink, which is all the position
 * anyone needs here.
 */
function PartRow({ label, state, tint, first }: { label: string; state: 'done' | 'current' | 'ahead'; tint: LessonTint; first: boolean }) {
  const ahead = state === 'ahead';
  const done = state === 'done';
  return (
    <View style={{ marginTop: first ? 0 : 18, height: 44, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: done ? '#131313' : ahead ? 'rgba(0,0,0,0.05)' : tintTones(tint).disc,
          boxShadow: state === 'current' ? '0 0 0 1px rgba(0,0,0,0.07)' : undefined,
        }}>
        {done ? (
          <Svg width={14} height={11} viewBox="0 0 16 13" fill="none">
            <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : (
          <Svg width={12} height={15} viewBox="0 0 18 22" style={{ marginLeft: 3 }}>
            <Path d="M3 2v18L16.5 11z" fill={ahead ? '#8B8882' : '#131313'} />
          </Svg>
        )}
      </View>
      <AppText numberOfLines={1} style={[sans('500'), { flex: 1, fontSize: 16, color: ahead ? '#8B8882' : '#1D1C1A' }]}>{label}</AppText>
    </View>
  );
}

function BookGlyph() {
  return (
    <Svg width={16} height={13} viewBox="0 0 19 15" fill="none">
      <Path d="M9.5 2.5C7.5 1 4.5 1 1.5 2v11c3-1 6-1 8 0.5 2-1.5 5-1.5 8-0.5V2c-3-1-6-1-8 0.5z" stroke="#8B8882" strokeWidth={1.6} />
      <Path d="M9.5 2.5v11" stroke="#8B8882" strokeWidth={1.6} />
    </Svg>
  );
}

/**
 * The parts a lesson runs, listed as the canvas lists them: one row per teach
 * page, under that page's own headline, then a closing row for the interactive
 * tail — the questions, the branch and the takeaway, which the frame names
 * "Try the tool". Nothing else is named, so nothing else gets a row.
 *
 * `number` is what the call to action points at, so it stays short enough to
 * sit on a pill.
 */
function lessonParts(content: InteractiveLesson): { number: string; label: string }[] {
  const names = content.pages.flatMap((page) => (page.kind === 'teach' ? [headline(page.headline)] : []));
  names.push('Try the tool');
  return names.map((name, index) => {
    const number = `Part ${NUMERALS[index] ?? index + 1}`;
    return { number, label: `${number}: ${name}` };
  });
}

/**
 * What the lesson is about, in the one 24pt line Story Detail gives it: the
 * opening page's own first sentence, which is where the frame's line comes from.
 */
function blurbFor(content: InteractiveLesson | null | undefined): string {
  const first = content?.pages.find((page) => page.kind === 'teach');
  if (!first || first.kind !== 'teach') return '';
  return first.body.match(/^[^.!?]+[.!?]/)?.[0]?.trim() ?? first.body;
}

/** A page headline cut down to something that fits one line of a contents list. */
function headline(text: string): string {
  const first = text.match(/^[^.!?]+/)?.[0] ?? text;
  return first.trim().replace(/[,;:]$/, '');
}

/** Long enough for the deepest lesson: six teach pages plus its three closing beats. */
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
