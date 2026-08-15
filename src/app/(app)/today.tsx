import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useId, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, LoadingView, PressScale } from '@/components/ui';
import { BedArt, type DayStep, DoorwayArt, LessonDome, LessonNightArt, NoteArt, PhoneDownArt, ReadingsStrip, TaskCard, WaterArt } from '@/components/today/kit';
import { useCheckins, useCurrentLesson, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useUpsertCheckin } from '@/lib/backend';
import { lessonForDay } from '@/content/curriculum84';
import { buildScore } from '@/lib/score';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * 21 · Today — three pages, scrolled down.
 *
 * Page one answers "where am I": the day count, the score drawn as the night
 * you are climbing out of, this morning's two readings, and the last thirty
 * days as thirty marks. Page two is the work in front of you — the lesson and
 * the day's one step. Page three is the line you signed. The mark, the profile
 * door and the urge bar hold across all three, because those are the three
 * things that must stay reachable without reading anything.
 *
 * `UI Final` re-dealt these blocks: the readings moved up to page one, the
 * lesson card moved down to page two beside the task, the pledge took a page of
 * its own, the pager dots were deleted, and the thirty-day strip is new.
 *
 * Laid out from the canvas's 393 × 852 frame: the status bar ends at 54, the
 * urge bar starts at 705 and the tab bar at 769.
 */

const laurelMark = require('../../../assets/images/laurel-mark.webp');
const noiseDark = require('../../../assets/images/noise-dark.png');

const MOOD_WORD = ['Heavy', 'Low', 'Fine', 'Good', 'Clear'];
const ENERGY_WORD = ['Empty', 'Low', 'Steady', 'Good', 'Full'];

/**
 * The steps the card falls back on when nobody has named the day's action yet.
 * The first is the one the canvas draws; the rest follow its shape — when it
 * belongs, one plain sentence, and the thing itself drawn into the card's night.
 */
const DAY_STEPS: DayStep[] = [
  { when: 'Tonight', caption: 'Put your phone somewhere difficult to access before you sleep.', art: PhoneDownArt },
  { when: 'Today', caption: 'Drink a full glass of water before anything else.', art: WaterArt },
  { when: 'Today', caption: 'Get outside for ten minutes, even if it is only around the block.', art: DoorwayArt },
  { when: 'Today', caption: 'Write down what set it off, in the words you would say out loud.', art: NoteArt },
  { when: 'Before bed', caption: 'Make the bed now, so tonight you walk into a room that is ready.', art: BedArt },
];

export default function Today() {
  const router = useRouter();
  const user = useCurrentUser();
  const current = useCurrentLesson();
  const progress = useLessonProgressMap();
  const checkins = useCheckins();
  const events = useEvents();
  const journal = useJournalEntries();
  const upsertCheckin = useUpsertCheckin();
  const pager = useRef<ScrollView>(null);
  // Both pages are exactly one viewport tall, so the scroll snaps between them.
  // Computed rather than measured: onLayout on web settles a frame late and the
  // first page would render at its natural height.
  const insets = useSafeAreaInsets();
  const pageH = useWindowDimensions().height - insets.top - 37 - 64 - useTabBarHeight();
  // Read once on mount: the day count and today's key must not shift under a
  // re-render while the screen is open.
  const [now] = useState(() => Date.now());

  if (current === undefined || progress === undefined || checkins === undefined || events === undefined) {
    return <LoadingView />;
  }

  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const score = buildScore(checkins, events, lessonsDone, user?.createdAt);

  const n = new Date(now);
  const todayKeyLocal = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  const todayCheckin = checkins.find((c) => c.date === todayKeyLocal);
  const moodIdx = todayCheckin?.mood != null ? Math.max(0, Math.min(4, todayCheckin.mood - 1)) : null;
  const energyIdx = todayCheckin?.energy != null ? Math.max(0, Math.min(4, todayCheckin.energy - 1)) : moodIdx;
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge');

  // The last thirty days, oldest first. A day is held unless a lapse landed on
  // it; the canvas draws thirty slots and exactly two marks, so a day before the
  // account existed takes the ring rather than a third tone it has no support
  // for. The counter is derived, never stated.
  const lapsedDays = new Set(
    (events ?? [])
      .filter((event) => event.type === 'lapse')
      .map((event) => {
        const at = new Date(event.createdAt);
        return `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`;
      }),
  );
  const held = Array.from({ length: 30 }, (_, index) => {
    const at = new Date(now - (29 - index) * 86_400_000);
    const key = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`;
    if (user?.createdAt && at.getTime() < user.createdAt) return false;
    return !lapsedDays.has(key);
  });

  // The day's one action. The night check-in names it and files it under the
  // day it is *for*, so by the time it reaches this card it is simply today's.
  // Until someone names one, the card carries the day's own step instead.
  // A task the curriculum set for the day is the card's lesson-sourced state:
  // it takes the lesson's own name and glyph and is set a step smaller. One
  // named by hand in the night check-in stays the generic state.
  const dayLesson = lessonForDay(day);
  const step: DayStep = todayCheckin?.dailyAction
    ? { when: 'Today', caption: todayCheckin.dailyAction, art: NoteArt }
    : dayLesson
      ? { when: 'Today', caption: dayLesson.task.cardSummary, art: LessonNightArt, lesson: dayLesson.task.cardTitle }
      : DAY_STEPS[(day - 1) % DAY_STEPS.length];
  const stepDone = todayCheckin?.dailyActionDone ?? false;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* the mark and the profile door — design y 64, 27 tall */}
        <View style={{ height: 37, paddingTop: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Image source={laurelMark} contentFit="contain" style={{ width: 27, height: 27 }} />
          <PressScale onPress={() => router.push('/profile')} accessibilityLabel="Open profile" hitSlop={16}>
            <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
              <Circle cx={13} cy={9.5} r={4} stroke={colors.textMuted} strokeWidth={2} />
              <Path d="M4.5 22.5c1-4.5 4.2-6.8 8.5-6.8s7.5 2.3 8.5 6.8" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </PressScale>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            ref={pager}
            pagingEnabled
            snapToInterval={pageH}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            style={{ flex: 1 }}>
            <View style={{ height: pageH }}>
              <PageOne
                day={day}
                score={score}
                mood={moodIdx}
                energy={energyIdx}
                held={held}
                onScore={() => router.push('/score')}
                onMorning={() => router.push('/day/morning')}
              />
            </View>
            <View style={{ height: pageH }}>
              <PageTwo
                lesson={current}
                done={lessonsDone % 6}
                step={step}
                stepDone={stepDone}
                onStep={() => void upsertCheckin({ date: todayKeyLocal, dailyActionDone: !stepDone })}
                onLesson={() => (current ? router.push(`/lesson-overview/${current.lesson.slug}`) : router.push('/lessons-browser'))}
                onLibrary={() => router.push('/(app)/library')}
              />
            </View>
            <View style={{ height: pageH }}>
              <PageThree pledge={pledge} name={user?.displayName} onPledges={() => router.push('/(app)/journal')} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* the one door that stays open on every page */}
      <PressScale
        onPress={() => router.push('/urge')}
        accessibilityRole="button"
        accessibilityLabel="Urge surfing and SOS"
        style={{
          height: 64,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          backgroundColor: colors.ink,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          paddingHorizontal: 16,
        }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(244,243,240,0.12)', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={20} height={13} viewBox="0 0 26 16" fill="none">
            <Path d="M2 12c4-7 8 3 12-3s8 2 10-2" stroke="#F4F3F0" strokeWidth={2.4} strokeLinecap="round" />
          </Svg>
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[sans('600'), { fontSize: 14.5, color: '#F7F6F2' }]}>Stay present. Surf the wave.</AppText>
          <AppText style={[sans('400'), { marginTop: 2, fontSize: 12.5, color: 'rgba(244,243,240,0.55)' }]}>Urge surfing · SOS</AppText>
        </View>
        <Svg width={7} height={12} viewBox="0 0 8 14" fill="none">
          <Path d="M1.5 1.5L6.5 7l-5 5.5" stroke="rgba(244,243,240,0.5)" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </PressScale>
    </View>
  );
}

/* ------------------------------------------------------------------- page one */

function PageOne({
  day,
  score,
  mood,
  energy,
  held,
  onScore,
  onMorning,
}: {
  day: number;
  score: ReturnType<typeof buildScore>;
  mood: number | null;
  energy: number | null;
  held: boolean[];
  onScore: () => void;
  onMorning: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* design 114, i.e. 23 below the mark row */}
      <AppText style={[sans('600'), { marginLeft: 16, marginTop: 23, fontSize: 27, lineHeight: 27, letterSpacing: -0.2, color: colors.text }]}>
        Day {day}
      </AppText>

      <View style={{ marginTop: 23 }}>
        <ScoreCard score={score} onPress={onScore} />
      </View>

      {/* design 402 — 16 under the score card */}
      <SectionRow label="This morning" onPress={onMorning} marginTop={16} />

      <View style={{ marginTop: 11.5 }}>
        <ReadingsStrip
          mood={mood}
          energy={energy}
          moodWord={mood != null ? MOOD_WORD[mood] : '—'}
          energyWord={energy != null ? ENERGY_WORD[energy] : '—'}
        />
      </View>

      {/* design 492 — 16 under the readings */}
      <View style={{ marginTop: 16 }}>
        <HeldStrip held={held} />
      </View>
    </View>
  );
}

/**
 * The score, drawn as the thing it measures: a night sky with a low moon and a
 * ridge you are climbing. The number sits on the dark because that is where the
 * work happens.
 */
function ScoreCard({ score, onPress }: { score: ReturnType<typeof buildScore>; onPress: () => void }) {
  const id = useId().replace(/:/g, '');
  // The card runs full width inside a 12pt gutter; the sky art is positioned
  // from its right edge, as the canvas does.
  const W = useWindowDimensions().width - 24;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Recovery score ${score.total}`}
      style={{
        marginHorizontal: 12,
        height: 222,
        borderRadius: 22,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: '#0C0D10',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 14px 30px rgba(30,28,24,0.28)',
      }}>
      {/* sky */}
      <Svg width="100%" height={222} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#08090B" />
            <Stop offset="0.55" stopColor="#0E1014" />
            <Stop offset="1" stopColor="#151920" />
          </SvgLinearGradient>
          {/* `radial-gradient(circle at 36% 30%, …)` names no size, so CSS uses
              farthest-corner: from (36%, 30%) of a 30px box the far corner is
              √((0.64·30)² + (0.70·30)²) = 28.45px, which is 94.8% of the box. */}
          <RadialGradient id={`moon${id}`} cx="36%" cy="30%" rx="94.8%" ry="94.8%">
            <Stop offset="0" stopColor="#F5F3EC" />
            <Stop offset="0.46" stopColor="#D9D6CD" />
            <Stop offset="1" stopColor="#A5A197" />
          </RadialGradient>
          {/* The moon div's own `box-shadow: 0 0 26px rgba(223,220,211,0.26)`.
              A shadow blur is a Gaussian of σ = blur/2, not a linear ramp: the
              stated alpha is reached deep inside the shape, is already halved at
              its edge, and is all but gone by one blur radius out. So on a 41pt
              gradient (15 disc + 26 blur) the stops track erf, which is why they
              fall away so much faster than the distance suggests. */}
          <RadialGradient id={`moonGlow${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0.366" stopColor="#DFDCD3" stopOpacity={0.13} />
            <Stop offset="0.512" stopColor="#DFDCD3" stopOpacity={0.085} />
            <Stop offset="0.683" stopColor="#DFDCD3" stopOpacity={0.042} />
            <Stop offset="0.829" stopColor="#DFDCD3" stopOpacity={0.015} />
            <Stop offset="1" stopColor="#DFDCD3" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`halo${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#DFDCD3" stopOpacity={0.15} />
            <Stop offset="0.4" stopColor="#DFDCD3" stopOpacity={0.07} />
            <Stop offset="0.72" stopColor="#DFDCD3" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height={222} fill={`url(#sky${id})`} />
        {/* the canvas's `left`/`top` place a star box's corner, not its centre,
            so each centre is the stated offset plus half the box */}
        <Circle cx={117} cy={35} r={1} fill="#F4F3F0" fillOpacity={0.45} />
        <Circle cx={W - 151.25} cy={57.25} r={1.25} fill="#F4F3F0" fillOpacity={0.35} />
        <Circle cx={53} cy={97} r={1} fill="#F4F3F0" fillOpacity={0.3} />
        <Circle cx={W - 66} cy={76} r={42} fill={`url(#halo${id})`} />
        <Circle cx={W - 63} cy={71} r={41} fill={`url(#moonGlow${id})`} />
        <Circle cx={W - 63} cy={71} r={15} fill={`url(#moon${id})`} />
      </Svg>

      {/* the two ridges, drawn in the canvas's own 369 × 76 frame */}
      <Svg width="100%" height={64} viewBox="0 0 369 76" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 102 }}>
        <Defs>
          <SvgLinearGradient id={`h1${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#232830" />
            <Stop offset="1" stopColor="#0A0B0D" />
          </SvgLinearGradient>
          <SvgLinearGradient id={`h2${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2A303B" />
            <Stop offset="1" stopColor="#0C0D10" />
          </SvgLinearGradient>
        </Defs>
        <Path d="M-4,76 L-4,50 Q56,22 124,48 Q160,61 188,68 L188,76 Z" fill={`url(#h1${id})`} />
        <Path d="M168,76 L168,66 Q226,57 270,36 Q316,17 373,25 L373,76 Z" fill={`url(#h2${id})`} />
      </Svg>

      {/* the waterline glow, then the flat dark below it */}
      <Svg width="100%" height={68} style={{ position: 'absolute', left: 0, right: 0, top: 154 }}>
        <Defs>
          <SvgLinearGradient id={`glow${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E9C78A" stopOpacity={0} />
            <Stop offset="1" stopColor="#E9C78A" stopOpacity={0.12} />
          </SvgLinearGradient>
          <SvgLinearGradient id={`sea${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#131720" />
            <Stop offset="1" stopColor="#0B0C0F" />
          </SvgLinearGradient>
          {/* The canvas blurs this shaft by 5px; RN SVG has no blur filter, so
              it is drawn as a soft radial instead of a hard-edged bar. */}
          <RadialGradient id={`shaft${id}`} cx="50%" cy="0%" rx="50%" ry="100%">
            <Stop offset="0" stopColor="#DFDCD3" stopOpacity={0.13} />
            <Stop offset="1" stopColor="#DFDCD3" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height={12} fill={`url(#glow${id})`} />
        <Rect x={0} y={12} width="100%" height={56} fill={`url(#sea${id})`} />
        {/* the moon's reflection on the water — the canvas's 38 × 44 shaft at
            top 168, grown by the 5px blur it is drawn with */}
        <Ellipse cx={W - 69} cy={36} rx={22} ry={26} fill={`url(#shaft${id})`} />
      </Svg>

      <AppText style={[sans('500'), { position: 'absolute', left: 20, top: 22, fontSize: 13, color: '#F7F6F2' }]}>Recovery score</AppText>

      <View
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          height: 30,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: 'rgba(244,243,240,0.28)',
          backgroundColor: 'rgba(20,19,16,0.25)',
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}>
        <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
          <Path d="M1 8.5L5 4.5l2.5 2L12.5 1.5" stroke="#F4F3F0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9.2 1.5h3.3V4.8" stroke="#F4F3F0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText style={[sans('600'), { fontSize: 12, color: '#F4F3F0' }]}>Trend</AppText>
      </View>

      <View style={{ position: 'absolute', left: 20, top: 48, flexDirection: 'row', alignItems: 'baseline', gap: 9 }}>
        <AppText style={[sans('500'), { fontSize: 43, letterSpacing: 1.5, color: '#F7F6F2', fontVariant: ['tabular-nums'] }]}>
          {score.total.toLocaleString()}
        </AppText>
        {score.delta !== 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
            <Svg width={9} height={8} viewBox="0 0 10 9">
              <Path d={score.delta > 0 ? 'M5 0.5L9.5 8.5H0.5z' : 'M5 8.5L0.5 0.5h9z'} fill="rgba(244,243,240,0.8)" />
            </Svg>
            <AppText style={[sans('500'), { fontSize: 13, color: 'rgba(244,243,240,0.8)' }]}>{Math.abs(score.delta)}</AppText>
          </View>
        ) : null}
      </View>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 50, height: 6, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.14)', overflow: 'hidden' }}>
        <View style={{ width: `${score.progress * 100}%`, height: 6, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.92)' }} />
      </View>
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 22, flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={[sans('500'), { fontSize: 11, color: 'rgba(244,243,240,0.55)' }]}>
          {score.rank.name} · {score.rank.at.toLocaleString()}
        </AppText>
        {score.next ? (
          <AppText style={[sans('500'), { fontSize: 11, color: 'rgba(244,243,240,0.55)' }]}>
            {score.next.name} · {score.next.at.toLocaleString()}
          </AppText>
        ) : null}
      </View>

      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06 }} pointerEvents="none" />
    </PressScale>
  );
}

/** The lesson in front of you, with a dome of first light and a six-step rule. */
function LessonCard({ title, meta, done, onPress }: { title: string; meta: string; done: number; onPress: () => void }) {
  const id = useId().replace(/:/g, '');
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${meta}`}
      style={{
        marginHorizontal: 12,
        height: 152,
        borderRadius: 20,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: colors.surface,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
      }}>
      <AppText numberOfLines={1} style={[sans('600'), { position: 'absolute', left: 20, top: 26, right: 168, fontSize: 19, letterSpacing: -0.2, color: colors.text }]}>
        {title}
      </AppText>
      <AppText style={[sans('400'), { position: 'absolute', left: 20, top: 56, fontSize: 12.5, color: colors.textSoft }]}>{meta}</AppText>

      <LessonDome id={id} />

      <Svg width={8} height={14} viewBox="0 0 8 14" fill="none" style={{ position: 'absolute', right: 16, top: 22 }}>
        <Path d="M1.5 1.5L6.5 7l-5 5.5" stroke={colors.textSoft} strokeWidth={2} strokeLinecap="round" />
      </Svg>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20, flexDirection: 'row', gap: 7 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={{ flex: 1, height: 4.5, borderRadius: 2.5, backgroundColor: i < done ? colors.ink : 'rgba(19,19,19,0.15)' }} />
        ))}
      </View>
    </PressScale>
  );
}

/* ------------------------------------------------------------------- page two */

function PageTwo({
  lesson,
  done,
  step,
  stepDone,
  onStep,
  onLesson,
  onLibrary,
}: {
  lesson: { lesson: { title: string; orderIndex: number; week: number } } | null | undefined;
  done: number;
  step: DayStep;
  stepDone: boolean;
  onStep: () => void;
  onLesson: () => void;
  onLibrary: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* design 138 — 47 below the mark row */}
      <SectionRow label="This week" action="Library" actionOffset={-2} onPress={onLibrary} marginTop={47} />

      <View style={{ marginTop: 11.5 }}>
        <LessonCard
          title={lesson?.lesson.title ?? 'Start the first lesson'}
          meta={lesson ? `Lesson ${lesson.lesson.orderIndex + 1} · Week ${lesson.lesson.week}` : 'Week I'}
          done={done}
          onPress={onLesson}
        />
      </View>

      {/* design 340 — 24 under the lesson card */}
      <View style={{ marginTop: 24 }}>
        <TaskCard step={step} done={stepDone} onPress={onStep} />
      </View>
    </View>
  );
}

function PageThree({ pledge, name, onPledges }: { pledge?: { body: string; createdAt: number }; name?: string; onPledges: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <SectionRow label="Goal & pledge" action="Past pledges" actionOffset={-2} onPress={onPledges} marginTop={47} />

      <View style={{ marginTop: 11.5 }}>
        <PledgeCard pledge={pledge} name={name} onPress={onPledges} />
      </View>
    </View>
  );
}

/**
 * The last thirty days as thirty marks. Ten to a row on a 31pt pitch, which is
 * exact at the canvas's 393 — `10 × 20 + 9 × 11 = 299` with no slack — so the
 * columns are pinned and the gap is derived rather than left to a wrapping flex
 * row, which would silently drop to nine columns on a 375pt phone and push the
 * block past the card's content line.
 */
function HeldStrip({ held }: { held: boolean[] }) {
  const width = useWindowDimensions().width;
  // The canvas's grid runs left 35 to 334 inside a 369-wide card: 35 either side.
  const inner = width - 24 - 35 * 2;
  const gap = Math.max(0, (inner - 10 * 20) / 9);
  const count = held.filter(Boolean).length;
  return (
    <View
      style={{
        marginHorizontal: 12,
        height: 184,
        borderRadius: 20,
        borderCurve: 'continuous',
        backgroundColor: colors.surface,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
      }}>
      <AppText style={[sans('500'), { position: 'absolute', left: 20, top: 20, fontSize: 13, color: colors.text }]}>Last 30 days</AppText>
      <AppText style={[sans('500'), { position: 'absolute', right: 20, top: 20, fontSize: 12.5, color: colors.textSoft }]}>{count} held</AppText>
      <View style={{ position: 'absolute', left: 35, top: 58, right: 35, flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {held.map((on, index) => (
          <View
            key={index}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: on ? colors.ink : undefined,
              boxShadow: on ? undefined : 'inset 0 0 0 1.5px rgba(0,0,0,0.18)',
            }}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * A quiet section label with its way through on the right. The row is only as
 * tall as its label — the canvas measures from the label's own box — so the
 * touch target comes from hitSlop rather than from padding it out.
 */
function SectionRow({
  label,
  action,
  actionOffset = 0,
  onPress,
  marginTop,
}: {
  label: string;
  action?: string;
  actionOffset?: number;
  onPress: () => void;
  marginTop: number;
}) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={action ?? label}
      hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
      style={{ minHeight: 0, marginTop, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <AppText style={[sans('600'), { fontSize: 12.5, color: colors.textSoft }]}>{label}</AppText>
      <View style={{ marginTop: actionOffset, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        {action ? <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 0.5, color: colors.textSoft }]}>{action}</AppText> : null}
        <Svg width={7} height={12} viewBox="0 0 8 14" fill="none">
          <Path d="M1.5 1.5L6.5 7l-5 5.5" stroke="#B0AEA8" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </View>
    </PressScale>
  );
}

/** The line you signed this morning, on the paper you signed it on. */
function PledgeCard({ pledge, name, onPress }: { pledge?: { body: string; createdAt: number }; name?: string; onPress: () => void }) {
  const body = pledge?.body ?? 'I am abstaining today because…';
  const cut = body.indexOf('because ');
  const stem = cut === -1 ? body : body.slice(0, cut + 8);
  const reason = cut === -1 ? '' : body.slice(cut + 8).replace(/\.$/, '');
  const signed = pledge
    ? `Signed ${new Date(pledge.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Not signed yet today';

  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={body}
      style={{
        marginHorizontal: 12,
        height: 140,
        borderRadius: 14,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: colors.surface,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
      }}>
      <AppText style={{ position: 'absolute', left: 16, top: 26, fontFamily: fonts.quote, fontSize: 32, lineHeight: 20, color: '#C9C0AC' }}>&ldquo;</AppText>
      <AppText style={{ position: 'absolute', left: 38, right: 38, top: 32, fontFamily: fonts.quote, fontSize: 17.5, lineHeight: 27, color: '#3A3934' }}>
        {stem}
        {reason ? (
          <AppText style={{ fontFamily: fonts.quote, fontSize: 17.5, lineHeight: 27, color: '#3A3934', textDecorationLine: 'underline', textDecorationColor: 'rgba(0,0,0,0.22)' }}>
            {reason}
          </AppText>
        ) : null}
        {reason ? '.' : ''}
      </AppText>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <AppText style={[sans('500'), { fontSize: 11, letterSpacing: 0.3, color: '#A5A29B' }]}>{signed}</AppText>
        {pledge ? (
          <View style={{ alignItems: 'flex-end' }}>
            <AppText style={{ fontFamily: fonts.script, fontSize: 24, lineHeight: 24, color: colors.text, transform: [{ rotate: '-3.5deg' }] }}>
              {name?.split(' ')[0] ?? 'You'}
            </AppText>
            <View style={{ marginTop: 4, width: 92, height: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} />
          </View>
        ) : (
          <View style={{ width: 92, height: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        )}
      </View>
    </PressScale>
  );
}
