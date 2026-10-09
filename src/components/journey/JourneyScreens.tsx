/**
 * The campaign: the ninety days as four chapters — The Landing, The Crossing,
 * The Highlands, The Watch — at `/journey/[chapter]` and end to end at
 * `/journey`. No frame in `Vici Overhaul` draws them (the tab named Journey is
 * the medallions page now); they keep their routes, rows and reckoning and take
 * the week page's form (routes §4.12): a hero from `Lesson-Illustrations-v4`
 * standing on canvas 292, a centred caps / name / line stack at 338, and the
 * chapter's three marks as week-page rows at 472 — done (check), the one you
 * stand in (the inverted row), not yet (numbered) — each with its day range
 * where the week page puts `Continue` or the chevron.
 *
 * The previous drop's paper scenes, land bands and campaign cards are gone with
 * the paper (`WorldArt`, `WorldCardArt`, `CampaignMap`, `CampaignGrounds`).
 */

import { useRouter } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourseRow, ROW_GAP, WeekBack } from '@/components/library/WeekPage';
import { CueScrollView, Hero, LaurelMark, LoadingView, MonoText, Screen } from '@/components/mono';
import { HERO_BOUNDS, type HeroId } from '@/content/heroes';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { isMorningCheckin, programmeDay, useToday } from '@/lib/day';
import { mono } from '@/lib/theme';

export type ChapterKey = 'landing' | 'crossing' | 'highlands' | 'watch';

// ── where the ninety days are cut ────────────────────────────────────────────

/** The journey in order — the list `app/journey/index.tsx` walks. */
export const CHAPTER_ORDER: ChapterKey[] = ['landing', 'crossing', 'highlands', 'watch'];

/**
 * The last day of each chapter, read straight off the day ranges the rows
 * print: 1–7 The Landing, 8–30 The Crossing, 31–60 The Highlands, 61–90 The Watch.
 */
export const CHAPTER_LAST_DAY: Record<ChapterKey, number> = { landing: 7, crossing: 30, highlands: 60, watch: 90 };

/** Which chapter a given day of the ninety falls in. Past day 90 you keep the watch. */
export function chapterForDay(day: number): ChapterKey {
  if (day <= CHAPTER_LAST_DAY.landing) return 'landing';
  if (day <= CHAPTER_LAST_DAY.crossing) return 'crossing';
  if (day <= CHAPTER_LAST_DAY.highlands) return 'highlands';
  return 'watch';
}

/**
 * Day 1 is the programme's first day (`programmeDay`, src/lib/day.ts) — the
 * calendar count Today and the Library use, on the screen's clock.
 */
export function useJourneyDay(): number {
  const user = useCurrentUser();
  const now = useToday();
  return programmeDay(user, now);
}

/** The chapter the user stands on. Falls back to the first one until the record loads. */
export function useCurrentChapter(): ChapterKey {
  return chapterForDay(useJourneyDay());
}

// ── what the screens read off the record ─────────────────────────────────────

interface Ctx {
  /** 1 on the first day. */
  day: number;
  /** Waves ridden out — the row's "×1". */
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
 * The Crossing is the one chapter whose rows are chapters rather than marks,
 * and the one place a row is "here": current when you stand in it, done once
 * you are past it, shut until you reach it.
 */
const standingIn = (key: ChapterKey) => (c: Ctx): RowState => {
  const here = chapterForDay(c.day);
  if (key === here) return 'current';
  return CHAPTER_ORDER.indexOf(key) < CHAPTER_ORDER.indexOf(here) ? 'done' : 'locked';
};

export interface Chapter {
  key: ChapterKey;
  /** the chapter's numeral, for its caps line */
  roman: string;
  title: string;
  line: string;
  /** the `Lesson-Illustrations-v4` card it stands under */
  hero: HeroId;
  rows: [ChapterRow, ChapterRow, ChapterRow];
}

export const CHAPTERS: Record<ChapterKey, Chapter> = {
  landing: {
    key: 'landing',
    roman: 'I',
    title: 'The Landing',
    line: 'Getting ashore — the vow, the first check-ins, the first wave faced.',
    hero: 'sunrise',
    rows: [
      { label: 'The vow', meta: () => 'Day 0', state: (c) => (c.vowed ? 'done' : 'locked') },
      // one string here, held or not — the glyph carries the truth
      { label: 'Seven mornings', meta: () => 'Days 1–7 · held', state: (c) => (c.mornings >= 7 ? 'done' : 'locked') },
      { label: 'First wave outlasted', meta: (c) => `×${c.waves}`, state: (c) => (c.waves > 0 ? 'done' : 'locked') },
    ],
  },
  // The Crossing looks outward rather than inward: standing mid-water, what you
  // want is the shore behind you, the count you are on, and the ground ahead.
  crossing: {
    key: 'crossing',
    roman: 'II',
    title: 'The Crossing',
    line: 'Open water — the first hard weeks. Hold the pledge, ride the waves, learn your triggers.',
    hero: 'compass',
    rows: [
      { label: 'The Landing', meta: () => 'Days 1–7 · held', state: standingIn('landing') },
      // "Day 13 of 30"; past day 30 the count sits on its ceiling
      { label: 'The Crossing', meta: (c) => `Day ${Math.min(30, c.day)} of 30`, state: standingIn('crossing') },
      { label: 'The Highlands', meta: () => 'Days 31–60', state: standingIn('highlands') },
    ],
  },
  highlands: {
    key: 'highlands',
    roman: 'III',
    title: 'The Highlands',
    line: 'Thinner air, longer views — the habits hold under real stress.',
    hero: 'mountain',
    rows: [
      { label: 'The Long Climb', meta: () => 'Days 31–45', state: past(45) },
      { label: 'The Pass', meta: () => 'Days 46–53', state: past(53) },
      { label: 'The Ridge', meta: () => 'Days 54–60', state: past(60) },
    ],
  },
  watch: {
    key: 'watch',
    roman: 'IV',
    title: 'The Watch',
    line: 'The habit is yours. Now you keep the light on for the long run.',
    hero: 'lighthouse',
    rows: [
      { label: 'Home waters', meta: () => 'Days 61–75', state: past(75) },
      { label: 'Keeping the watch', meta: () => 'Days 76–90', state: past(90) },
      { label: 'The vow, renewed', meta: () => 'Day 90', state: past(90) },
    ],
  },
};

// ── one chapter ──────────────────────────────────────────────────────────────

/**
 * The hero's `top`, by the week pages' own rule: every week stands its art on
 * canvas 292 (`T = 102 − 1.1·(bounds bottom − 190)`), so a chapter does too.
 */
const heroTop = (id: HeroId) => 102 - 1.1 * (HERO_BOUNDS[id][1] - 190);

/**
 * The block one chapter takes, canvas 0 to the air under its rows. 700 lets the
 * next chapter's art enter the first screen by ~46 pt at 852 — a clear "more
 * below" rather than the 6 pt sliver 740 left (D404). The watch keeps 740 for
 * its closing line (content to 728).
 */
const BODY_H = 700;
const BODY_H_WATCH = 740;
/** The scroll starts under the status bar, so a block's canvas y is its content y + this. */
const STATUS = 54;

/**
 * Everything a chapter draws, as a block of canvas coordinates whose first
 * `offset` points are cut (the status bar's, for the first block in a scroll).
 * The same block is one chapter's page and one section of the campaign.
 */
function ChapterBody({ chapter, ctx, width, offset, onBack }: { chapter: ChapterKey; ctx: Ctx; width: number; offset: number; onBack?: () => void }) {
  const c = CHAPTERS[chapter];
  const y = (v: number) => v - offset;
  return (
    <View style={{ height: (chapter === 'watch' ? BODY_H_WATCH : BODY_H) - offset }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: -offset, width }}>
        <Hero id={c.hero} top={heroTop(c.hero)} width={width} />
      </View>

      {/* the week page's header stack (338, gap 8), then the rows: at 472 under a
          one-line line, and 34 under a longer one */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: y(338) }}>
        <View style={{ marginHorizontal: 24, gap: 8, alignItems: 'center' }}>
          <MonoText v="caps" center style={{ alignSelf: 'stretch' }}>
            {`Chapter ${c.roman}`}
          </MonoText>
          <MonoText v="title" center accessibilityRole="header" style={{ alignSelf: 'stretch' }}>
            {c.title}
          </MonoText>
          {/* the week blurbs all fit one line; the chapter lines take two, and
              centred two-line copy balances rather than leaving "long run." alone */}
          <MonoText v="pTight" center wrap="balance" style={{ alignSelf: 'stretch' }}>
            {c.line}
          </MonoText>
        </View>

        <View style={{ marginTop: 44, marginHorizontal: 16, gap: ROW_GAP }}>
          {c.rows.map((row, i) => {
            const state = row.state(ctx);
            const meta = row.meta(ctx);
            return (
              <View key={row.label} accessible accessibilityLabel={`${row.label}, ${meta}, ${state === 'done' ? 'done' : state === 'current' ? 'you are here' : 'not yet'}`}>
                <CourseRow
                  lead={state === 'done' ? 'check' : String(i + 1)}
                  title={row.label}
                  state={state === 'locked' ? 'upcoming' : state}
                  trailing={
                    <MonoText v="pill" color={state === 'current' ? mono.onInk : mono.mute}>
                      {meta}
                    </MonoText>
                  }
                />
              </View>
            );
          })}
        </View>

        {chapter === 'watch' ? (
          <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LaurelMark size={20} />
            <MonoText v="caps">Day 90 · the vow, renewed</MonoText>
          </View>
        ) : null}
      </View>

      {onBack ? <WeekBack onPress={onBack} top={y(60)} /> : null}
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
    // mornings answered: rows the morning check-in filled, not rows that only hold an action
    mornings: checkins.filter(isMorningCheckin).length,
    vowed: journal.some((entry) => entry.tag === 'Pledge'),
  };
}

/**
 * One chapter as a page: the block in a scroll that starts under the status
 * bar — at 852 it fits and nothing moves; on a shorter phone it scrolls, the
 * chevron with it, and ends 24 clear of the window's foot (the home indicator's
 * inset added) rather than with The Watch's closing line 13 off the edge.
 */
export function JourneyChapter({ chapter, onBack }: { chapter: ChapterKey; onBack?: () => void }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ctx = useChapterCtx();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(app)/today')));

  if (!ctx) return <LoadingView onBack={back} />;

  return (
    <Screen>
      <CueScrollView
        style={{ position: 'absolute', left: 0, right: 0, top: STATUS, bottom: 0 }}
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
        <ChapterBody chapter={chapter} ctx={ctx} width={width} offset={STATUS} onBack={back} />
      </CueScrollView>
    </Screen>
  );
}

/**
 * The campaign as one page: the four chapters, each drawn exactly as it is
 * drawn on its own, end to end down a single scroll. The chevron rides with
 * the first.
 */
export function JourneyScroll({ onBack, bottomInset = 0 }: { onBack?: () => void; bottomInset?: number }) {
  const { width } = useWindowDimensions();
  const ctx = useChapterCtx();
  if (!ctx) return <LoadingView onBack={onBack} />;

  return (
    <Screen>
      <CueScrollView
        style={{ position: 'absolute', left: 0, right: 0, top: STATUS, bottom: 0 }}
        contentContainerStyle={{ paddingBottom: bottomInset }}>
        {CHAPTER_ORDER.map((chapter, i) => (
          <ChapterBody key={chapter} chapter={chapter} ctx={ctx} width={width} offset={i ? 0 : STATUS} onBack={i ? undefined : onBack} />
        ))}
      </CueScrollView>
    </Screen>
  );
}
