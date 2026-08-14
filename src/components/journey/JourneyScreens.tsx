/**
 * The journey, as the canvas draws it: one campaign map and four chapters.
 *
 * `CampaignMap` (107) is the promise made before the vow — the first four weeks
 * as four lit cards, newest week at the top, with the week you stand on marked.
 * `JourneyChapter` (176–179) is a single stretch of the ninety days: its name,
 * one line about the weather there, the picture of it, and the three marks that
 * close it. The canvas labels 177 "Journey Campaign", but it draws The Crossing
 * — chapter II — so all four chapters are on the canvas, none extrapolated.
 *
 * Laid out from the canvas's 393 × 852 frame — the status bar ends at 54, so
 * every `top` below is the canvas value less 54. The closing land band and the
 * campaign's button are anchored from the bottom instead, so a shorter phone
 * loses picture rather than the way forward.
 */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, LoadingView, PressScale } from '@/components/ui';
import { useCheckins, useCurrentLesson, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { sans } from '@/lib/theme';
import { type ChapterKey, ChapterFooter, ChapterScene, FOOTER_H, SCENE_H } from './WorldArt';
import { GROUND_CARD_H, GROUND_INTERLUDE_H, type GroundKey, GroundCardArt, GroundInterludeArt, WeekCardArt } from './WorldCardArt';

const noiseDark = require('../../../assets/images/noise-dark.png');
const laurelMark = require('../../../assets/images/laurel-mark.webp');

export type { ChapterKey, GroundKey };

// ── where the ninety days are cut ────────────────────────────────────────────

/** The journey in order — the list `library.tsx` walks. */
export const CHAPTER_ORDER: ChapterKey[] = ['landing', 'crossing', 'highlands', 'watch'];

/**
 * The last day of each chapter, read straight off the day ranges the canvas
 * prints in its own rows: 1–7 The Landing, 8–30 The Crossing, 31–60 The
 * Highlands, 61–90 The Watch.
 */
export const CHAPTER_LAST_DAY: Record<ChapterKey, number> = { landing: 7, crossing: 30, highlands: 60, watch: 90 };

/** Which chapter a given day of the ninety falls in. Past day 90 you keep the watch. */
export function chapterForDay(day: number): ChapterKey {
  if (day <= CHAPTER_LAST_DAY.landing) return 'landing';
  if (day <= CHAPTER_LAST_DAY.crossing) return 'crossing';
  if (day <= CHAPTER_LAST_DAY.highlands) return 'highlands';
  return 'watch';
}

/** Day 1 is the day you signed up, not the day after it. */
export function useJourneyDay(): number {
  const user = useCurrentUser();
  // Read once: the count must not shift under a re-render while a screen is open.
  const [now] = useState(() => Date.now());
  return user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;
}

/** The chapter the user stands on. Falls back to the first one until the record loads. */
export function useCurrentChapter(): ChapterKey {
  return chapterForDay(useJourneyDay());
}

// ── what the screens read off the record ─────────────────────────────────────

interface Ctx {
  /** 1 on the first day. */
  day: number;
  /** Waves ridden out — the canvas's "×1". */
  waves: number;
  /** Mornings answered. */
  mornings: number;
  /** The vow is signed. */
  vowed: boolean;
}

type RowState = 'done' | 'current' | 'locked';

interface ChapterRow {
  label: string;
  meta: (c: Ctx) => string;
  state: (c: Ctx) => RowState;
}

/** A row covering a stretch of the ninety days you have already put behind you. */
const past = (to: number) => (c: Ctx): RowState => (c.day > to ? 'done' : 'locked');

/**
 * The Crossing is the one frame whose rows are chapters rather than marks, and
 * the one place the canvas draws "here" — the boat disc, the 60pt row and the
 * ink ring appear on no other frame. So a chapter row is current when you stand
 * in it, done once you are past it, shut until you reach it.
 */
const standingIn = (key: ChapterKey) => (c: Ctx): RowState => {
  const here = chapterForDay(c.day);
  if (key === here) return 'current';
  return CHAPTER_ORDER.indexOf(key) < CHAPTER_ORDER.indexOf(here) ? 'done' : 'locked';
};

export interface Chapter {
  key: ChapterKey;
  title: string;
  line: string;
  rows: [ChapterRow, ChapterRow, ChapterRow];
}

export const CHAPTERS: Record<ChapterKey, Chapter> = {
  landing: {
    key: 'landing',
    title: 'The Landing',
    line: 'Getting ashore — the vow, the first check-ins, the first wave faced.',
    rows: [
      { label: 'The vow', meta: () => 'Day 0', state: (c) => (c.vowed ? 'done' : 'locked') },
      // the canvas prints one string here, held or not — the glyph carries the truth
      { label: 'Seven mornings', meta: () => 'Days 1–7 · held', state: (c) => (c.mornings >= 7 ? 'done' : 'locked') },
      { label: 'First wave outlasted', meta: (c) => `×${c.waves}`, state: (c) => (c.waves > 0 ? 'done' : 'locked') },
    ],
  },
  // The Crossing looks outward rather than inward: standing mid-water, what you
  // want is the shore behind you, the count you are on, and the ground ahead.
  crossing: {
    key: 'crossing',
    title: 'The Crossing',
    line: 'Open water — the first honest weeks. Hold the pledge, ride the waves, learn your triggers.',
    rows: [
      { label: 'The Landing', meta: () => 'Days 1–7 · held', state: standingIn('landing') },
      // the canvas prints "Day 13 of 30"; past day 30 the count sits on its ceiling
      { label: 'The Crossing', meta: (c) => `Day ${Math.min(30, c.day)} of 30`, state: standingIn('crossing') },
      { label: 'The Highlands', meta: () => 'Days 31–60', state: standingIn('highlands') },
    ],
  },
  highlands: {
    key: 'highlands',
    title: 'The Highlands',
    line: 'Thinner air, longer views — the habits hold under real stress.',
    rows: [
      { label: 'The Long Climb', meta: () => 'Days 31–45', state: past(45) },
      { label: 'The Pass', meta: () => 'Days 46–53', state: past(53) },
      { label: 'The Ridge', meta: () => 'Days 54–60', state: past(60) },
    ],
  },
  watch: {
    key: 'watch',
    title: 'The Watch',
    line: 'The habit is yours — now you keep the light on for the long run.',
    rows: [
      { label: 'Home waters', meta: () => 'Days 61–75', state: past(75) },
      { label: 'Keeping the watch', meta: () => 'Days 76–90', state: past(90) },
      { label: 'The vow, renewed', meta: () => 'Day 90', state: past(90) },
    ],
  },
};

// ── shared chrome ────────────────────────────────────────────────────────────

/** The canvas's quiet Back row: chevron and word, canvas top 64. */
function BackRow({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
      style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19">
        <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
    </PressScale>
  );
}

/** Done, here, or not yet — the three glyphs the chapter rows carry. */
function RowGlyph({ state }: { state: RowState }) {
  if (state === 'locked') {
    return (
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#EDECE7', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={11} height={13} viewBox="0 0 14 16">
          <Rect x={1.5} y={7} width={11} height={8} rx={2} fill="#8B8882" />
          <Path d="M4 7V5a3 3 0 016 0v2" fill="none" stroke="#8B8882" strokeWidth={2} />
        </Svg>
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={18} height={11.7} viewBox="0 0 40 26">
          <Path d="M21 3 L21 16 L12 16 Z" fill="#F4F3F0" />
          <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill="#F4F3F0" />
        </Svg>
      </View>
    );
  }
  return (
    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={12} height={10} viewBox="0 0 16 13">
        <Path d="M1.5 7l4.4 4.5L14.5 1.5" fill="none" stroke="#F4F3F0" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function ChapterRowCard({ label, meta, state }: { label: string; meta: string; state: RowState }) {
  const here = state === 'current';
  return (
    <View
      style={{
        height: here ? 60 : 56,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        boxShadow: here ? '0 0 0 2px #131313, 0 10px 22px rgba(40,38,32,0.12)' : '0 0 0 1px rgba(0,0,0,0.06)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        paddingHorizontal: 16,
        opacity: state === 'locked' ? 0.6 : 1,
      }}>
      <RowGlyph state={state} />
      <AppText numberOfLines={1} style={[sans(here ? '700' : '500'), { flex: 1, fontSize: 15.5, color: '#1D1C1A' }]}>
        {label}
      </AppText>
      <AppText style={[sans(here ? '600' : '500'), { fontSize: 12.5, color: here ? '#1D1C1A' : '#8B8882' }]}>{meta}</AppText>
    </View>
  );
}

/** The 24pt of air between two rows, with the canvas's two grey pips in it. */
function RowGap() {
  return (
    <View style={{ height: 24 }}>
      <View style={{ position: 'absolute', left: 28, top: 5, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
      <View style={{ position: 'absolute', left: 28, top: 13, width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: 'rgba(40,38,32,0.2)' }} />
    </View>
  );
}

// ── 176–179 · one chapter ────────────────────────────────────────────────────

/**
 * Everything the canvas draws below a chapter's Back row, laid out from that
 * row's own origin: the title at 60, the line at 108, the scene at 160, the
 * three rows at 512, and the land the chapter closes on.
 *
 * Written as a fixed-height block rather than a `flex: 1` screen so it can be
 * either one page (`JourneyChapter`) or one section of a longer scroll
 * (`JourneyScroll`) without the two drifting apart.
 */
export const CHAPTER_BODY_H = 852 - 54;

function ChapterBody({ chapter, ctx, width, height }: { chapter: ChapterKey; ctx: Ctx; width: number; height: number }) {
  const c = CHAPTERS[chapter];
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>{c.title}</AppText>
      <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 60, top: 108, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>{c.line}</AppText>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 160, height: SCENE_H, overflow: 'hidden' }} pointerEvents="none">
        <ChapterScene scene={chapter} width={width} />
      </View>

      <View style={{ position: 'absolute', left: 24, right: 24, top: 512 }}>
        {c.rows.map((row, i) => (
          <View key={row.label}>
            {i ? <RowGap /> : null}
            <ChapterRowCard label={row.label} meta={row.meta(ctx)} state={row.state(ctx)} />
          </View>
        ))}
      </View>

      {/* the land the chapter closes on: canvas top 798 of 852, so a flat 54 off
          the block's bottom — the home-indicator zone is inside the band, not
          added to it */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: FOOTER_H }} pointerEvents="none">
        <ChapterFooter scene={chapter} width={width} height={FOOTER_H} />
        {chapter === 'watch' ? (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <Image source={laurelMark} contentFit="contain" style={{ width: 20, height: 20, opacity: 0.8 }} />
            <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>Day 90 · the vow, renewed</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/** What every chapter reads off the record — gathered once, shared by all four. */
function useChapterCtx(): Ctx | undefined {
  const day = useJourneyDay();
  const events = useEvents();
  const checkins = useCheckins();
  const journal = useJournalEntries();
  if (events === undefined || checkins === undefined || journal === undefined) return undefined;
  return {
    day,
    waves: events.filter((e) => e.type === 'urge_rode_out').length,
    mornings: checkins.length,
    vowed: journal.some((entry) => entry.tag === 'Pledge'),
  };
}

export function JourneyChapter({ chapter, onBack }: { chapter: ChapterKey; onBack?: () => void }) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ctx = useChapterCtx();

  if (!ctx) return <LoadingView />;
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(app)/today')));

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      {/* the plain View is load-bearing: safe-area-context expresses its inset as
          Yoga padding, and Yoga lays an absolute child out from the parent's
          border box, so absolute children of the SafeAreaView itself would sit
          under the status bar */}
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <BackRow onPress={back} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <ChapterBody chapter={chapter} ctx={ctx} width={width} height={Math.max(CHAPTER_BODY_H, height - insets.top)} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * The journey as one page: the four chapters, drawn exactly as they are drawn
 * on their own, run end to end down a single scroll.
 *
 * Each is its own full-height block, so the land band that closes one chapter
 * becomes the horizon the next one opens above — which is what the canvas's
 * four frames do when you flick between them, and why they are stacked at their
 * own height rather than collapsed to their content.
 */
export function JourneyScroll({ bottomInset = 0 }: { bottomInset?: number }) {
  const { width } = useWindowDimensions();
  const ctx = useChapterCtx();
  if (!ctx) return <LoadingView />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: bottomInset }}>
            {CHAPTER_ORDER.map((chapter) => (
              <ChapterBody key={chapter} chapter={chapter} ctx={ctx} width={width} height={CHAPTER_BODY_H} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 107 · the campaign map ───────────────────────────────────────────────────

/** The four weeks, newest first — the order the canvas stacks them in. */
const WEEKS: { n: number; roman: string; title: string; size: number }[] = [
  { n: 4, roman: 'Week IV', title: 'Building the life', size: 16 },
  { n: 3, roman: 'Week III', title: 'Setbacks & self-compassion', size: 15.5 },
  { n: 2, roman: 'Week II', title: 'Understanding urges', size: 16 },
  { n: 1, roman: 'Week I', title: 'Foundations', size: 16 },
];

function WeekCard({ week, top, here }: { week: (typeof WEEKS)[number]; top: number; here: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, height: 96 }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          borderRadius: 14,
          backgroundColor: '#F0EFE9',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
        }}>
        <WeekCardArt week={week.n} />
      </View>

      <View style={{ position: 'absolute', left: 126, right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>{week.roman}</AppText>
          {here ? (
            <View style={{ backgroundColor: '#131313', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('600'), { fontSize: 12.5, color: '#FFFFFF' }]}>You are here</AppText>
            </View>
          ) : null}
        </View>
        <AppText numberOfLines={1} style={[sans('600'), { marginTop: 4, fontSize: week.size, color: '#1D1C1A' }]}>
          {week.title}
        </AppText>
      </View>
    </View>
  );
}

export function CampaignMap({ onBack, onContinue }: { onBack?: () => void; onContinue?: () => void }) {
  const router = useRouter();
  const day = useJourneyDay();
  const current = useCurrentLesson();

  if (current === undefined) return <LoadingView />;

  // The week you stand on: the curriculum's if it has an opinion, otherwise the
  // one the calendar puts you in. Only the first four are drawn here.
  const here = Math.min(4, Math.max(1, current?.lesson.week ?? Math.ceil(day / 7)));
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(app)/today')));
  const go = onContinue ?? (() => router.push('/(app)/library'));

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F4F0' }}>
      <LinearGradient colors={['#F6F4F0', '#FCFBF9']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      {/* the two washes are frame-anchored, so they sit outside the safe area;
          the canvas blurs the upper one 6px and RN SVG has no filter, so the
          falloff carries it */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <Svg width={540} height={270} style={{ position: 'absolute', left: -40, top: -140 }}>
          <Defs>
            <RadialGradient id="map-top" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.14} />
              <Stop offset="0.42" stopColor="#B4AA96" stopOpacity={0.08} />
              <Stop offset="0.72" stopColor="#B4AA96" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={270} cy={135} rx={270} ry={135} fill="url(#map-top)" />
        </Svg>
        <Svg width={560} height={560} style={{ position: 'absolute', left: '50%', marginLeft: -280, bottom: -300 }}>
          <Defs>
            <RadialGradient id="map-bottom" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.52} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.23} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={280} cy={280} rx={280} ry={280} fill="url(#map-bottom)" />
        </Svg>
      </View>

      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 }} pointerEvents="none" />

      {/* same reason as the chapter screen: Yoga ignores the SafeAreaView's inset
          padding when it positions an absolute child, so everything absolute
          lives one plain View deeper */}
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <BackRow onPress={back} />

          <AppText
            center
            style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: 72, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: '#1D1C1A' }]}>
            Your first four weeks.
          </AppText>

          {WEEKS.map((week, i) => (
            <WeekCard key={week.n} week={week} top={138 + i * 118} here={week.n === here} />
          ))}

          <AppText center style={[sans('400'), { position: 'absolute', left: 26, right: 26, top: 642, fontSize: 15, lineHeight: 22, color: '#55534E' }]}>
            {"Four weeks, one path. Move at your own pace — there's no clock."}
          </AppText>

          <PressScale
            onPress={go}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 30,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#131313',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.3, color: '#FFFFFF' }]}>Show me my path</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 183 · the five grounds ───────────────────────────────────────────────────

/**
 * The campaign as the export-only frame draws it: five grounds in a column you
 * scroll, joined by drifts of pebbles, with one full-bleed long view set into
 * the middle of the run.
 *
 * This is a second, richer telling of the same journey and a different cut of
 * it — five grounds against the four chapters of 176–179. The main design file
 * stays the source of truth for the Library tab; this screen is the extra one.
 */
interface Ground {
  key: GroundKey;
  numeral: string;
  name: string;
  line: string;
  /** The card's own field, top to bottom. */
  field: readonly [string, string];
  state: 'taken' | 'here' | 'ahead';
}

const GROUNDS: Ground[] = [
  {
    key: 'landing',
    numeral: 'GROUND I',
    name: 'The Landing',
    line: 'Where it began — day one, ashore.',
    field: ['#E9EFF4', '#F0EDE5'],
    state: 'taken',
  },
  {
    key: 'crossing',
    numeral: 'GROUND II',
    name: 'The Crossing',
    line: 'Open water — steady strokes, no heroics.',
    field: ['#E3ECF3', '#EDEAE2'],
    state: 'here',
  },
  {
    key: 'deep',
    numeral: 'GROUND III',
    name: 'Deep Waters',
    line: 'The current pulls hardest here.',
    field: ['#E4E9EE', '#EBE9E3'],
    state: 'ahead',
  },
  {
    key: 'held',
    numeral: 'GROUND IV',
    name: 'Held Ground',
    line: 'You stop losing what you gained.',
    field: ['#E9EFF4', '#F0EDE5'],
    state: 'ahead',
  },
  {
    key: 'camp',
    numeral: 'GROUND V',
    name: 'First Camp',
    line: 'Rest earned — the first real footing.',
    field: ['#E9EFF4', '#F0EDE5'],
    state: 'ahead',
  },
];

/**
 * Which chapter a ground opens.
 *
 * The five grounds are not the four chapters recut — the chapter frames carry
 * day ranges and the ground cards carry none, and the two sets share only their
 * first two names outright. So past The Crossing this is a reading rather than a
 * measurement, and the frames' own lines are the only evidence there is: Deep
 * Waters is "the current pulls hardest here", which is The Highlands' stretch
 * under real stress; Held Ground "you stop losing what you gained" and First
 * Camp "rest earned" are both the long hold The Watch keeps.
 */
export const GROUND_TO_CHAPTER: Record<GroundKey, ChapterKey> = {
  landing: 'landing',
  crossing: 'crossing',
  deep: 'highlands',
  held: 'watch',
  camp: 'watch',
};

/** The four pebbles that drift between one ground and the next. */
function GroundLink() {
  const pebble = (top: number, size: number, dx: number, fill: string) => ({
    position: 'absolute' as const,
    left: '50%' as const,
    marginLeft: dx,
    top,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: fill,
  });
  return (
    <View style={{ height: 64 }} pointerEvents="none">
      <View style={pebble(9, 7, -9, '#C3CEDA')} />
      <View style={pebble(23, 8, 2, '#B2C1D0')} />
      <View style={pebble(38, 8, -10, '#B2C1D0')} />
      <View style={pebble(52, 7, 1, '#C3CEDA')} />
    </View>
  );
}

/** Taken, standing here, or still shut — the three marks a ground card carries. */
function GroundBadge({ state }: { state: Ground['state'] }) {
  if (state === 'taken') {
    return (
      <View
        style={{
          position: 'absolute',
          right: 14,
          top: 14,
          height: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          paddingLeft: 8,
          paddingRight: 11,
          borderRadius: 12,
          backgroundColor: 'rgba(19,19,19,0.08)',
        }}>
        <Svg width={11} height={9} viewBox="0 0 16 13">
          <Path d="M1.5 7l4.4 4.5L14.5 1.5" fill="none" stroke="#131313" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 0.3, color: '#131313' }]}>Taken</AppText>
      </View>
    );
  }
  if (state === 'here') {
    return (
      <View
        style={{
          position: 'absolute',
          right: 14,
          top: 14,
          height: 24,
          justifyContent: 'center',
          paddingHorizontal: 10,
          borderRadius: 12,
          backgroundColor: '#131313',
        }}>
        <AppText style={[sans('600'), { fontSize: 9, letterSpacing: 1.3, color: '#FFFFFF' }]}>YOU ARE HERE</AppText>
      </View>
    );
  }
  return (
    <View
      style={{
        position: 'absolute',
        right: 14,
        top: 14,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(19,19,19,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg width={11} height={13} viewBox="0 0 17 19">
        <Rect x={1.5} y={8} width={14} height={9.5} rx={2.4} stroke="#8B8882" strokeWidth={1.9} fill="none" />
        <Path d="M4.8 8V5.6a3.7 3.7 0 0 1 7.4 0V8" stroke="#8B8882" strokeWidth={1.9} fill="none" />
      </Svg>
    </View>
  );
}

/** What a ground reads as to a screen reader — the chip is the only sighted cue. */
const GROUND_STATE_LABEL: Record<Ground['state'], string> = { taken: 'taken', here: 'you are here', ahead: 'not yet reached' };

function GroundCard({ ground, width, onPress }: { ground: Ground; width: number; onPress?: () => void }) {
  const here = ground.state === 'here';
  const ahead = ground.state === 'ahead';
  // The card is its own pressable rather than sitting inside one. PressScale
  // adds no padding of its own and its minHeight of 44 is well under the
  // canvas's 116, so the card cannot be stretched and the 118pt pitch below it
  // cannot move — which a wrapper around the card would risk.
  const style = {
    height: GROUND_CARD_H,
    borderRadius: 16,
    boxShadow: here ? '0 0 0 2px #131313, 0 10px 22px rgba(40,38,32,0.18)' : `0 0 0 1px rgba(0,0,0,${ground.state === 'taken' ? 0.07 : 0.06})`,
  };
  const face = (
    <>
      {/* the art is clipped by its own View so the ring above stays outside it */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16, overflow: 'hidden' }}>
        <LinearGradient colors={ground.field} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <GroundCardArt ground={ground.key} width={width} />
        <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06 }} pointerEvents="none" />
      </View>

      <AppText style={[sans('600'), { position: 'absolute', left: 18, top: 16, fontSize: 11, letterSpacing: 2.2, color: here ? '#6E6C66' : ahead ? '#A5A29B' : '#8B8882' }]}>
        {ground.numeral}
      </AppText>
      <AppText
        numberOfLines={1}
        style={[
          sans(here ? '700' : '600'),
          { position: 'absolute', left: 18, right: 18, bottom: 32, fontSize: here ? 21 : 20, color: here ? '#131313' : ahead ? '#6E6C66' : '#1D1C1A' },
        ]}>
        {ground.name}
      </AppText>
      <AppText numberOfLines={1} style={[sans('400'), { position: 'absolute', left: 18, right: 18, bottom: 13, fontSize: 12.5, color: ahead ? '#98958E' : '#55534E' }]}>
        {ground.line}
      </AppText>

      <GroundBadge state={ground.state} />
    </>
  );

  // A ground that has not been reached still opens: the lock chip is a mark of
  // where you stand, not a door held shut.
  if (!onPress) return <View style={style}>{face}</View>;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${ground.name}, ${GROUND_STATE_LABEL[ground.state]}`}
      accessibilityHint={ground.line}
      style={style}>
      {face}
    </PressScale>
  );
}

export function CampaignGrounds({ onBack, onOpen }: { onBack?: () => void; onOpen?: (ground: GroundKey) => void }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(app)/today')));
  // the column is inset 24 a side; the long view breaks back out to the frame
  const cardWidth = width - 48;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <BackRow onPress={back} />

          <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 31, letterSpacing: -0.4, color: '#2A2924' }]}>The campaign</AppText>
          <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 80, top: 106, fontSize: 15, lineHeight: 23, color: '#55534E' }]}>
            Five grounds, from landing to triumph.
          </AppText>

          <ScrollView
            style={{ position: 'absolute', left: 0, right: 0, top: 156, bottom: 0 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 64 }}>
            {GROUNDS.map((ground, i) => (
              <View key={ground.key}>
                {i > 0 && GROUNDS[i - 1].key !== 'deep' ? <GroundLink /> : null}
                <GroundCard ground={ground} width={cardWidth} onPress={onOpen ? () => onOpen(ground.key) : undefined} />
                {/* the canvas swaps the pebbles for the long view after Deep Waters */}
                {ground.key === 'deep' ? (
                  <View style={{ height: GROUND_INTERLUDE_H, marginHorizontal: -24, overflow: 'hidden' }} pointerEvents="none">
                    <GroundInterludeArt width={width} />
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* the canvas's scroll-edge fade, drawn over everything */}
      <LinearGradient
        colors={['rgba(244,243,240,0)', '#F4F3F0']}
        locations={[0, 0.82]}
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64 }}
      />
    </View>
  );
}
