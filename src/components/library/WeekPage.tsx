import { useState, type ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { CheckDisc, ChevronL, ChevronR, CueScrollView, Hero, MonoText, Tap, useCanvasTop, useTabBarHeight } from '@/components/mono';
import type { Curriculum84Lesson, Curriculum84Week } from '@/content/curriculum84';
import { useCurrentUser } from '@/lib/backend';
import { mono } from '@/lib/theme';

/**
 * `Week I Reset` … `Week XII Leave It Behind P2` — the twelve week pages
 * (library.md §3). One template: the back chevron, the week's hero, a centred
 * caps / name / blurb stack at canvas 338, and its seven lessons as 58pt rows
 * from canvas 472, over the tab bar with Library lit.
 *
 * Each week is drawn twice, `Week N` and `Week N P2`, and nothing but the rows
 * moves between the pair: rows 1–4 on the first, 5–7 on the second, both from
 * 472. So they are one page, its rows in a 264pt viewport (472 → 736, 12 above
 * the bar) scrolled 0 or 264 (CRITIC §5, library Q2). At scroll 0 row 5's top
 * sits on the viewport's foot, so nothing shows in the 728–748 gap the first
 * frame leaves empty.
 *
 * Children of a mono `Screen`, so every number is the canvas's.
 */

/**
 * The svg `top` each week page states. They are not arbitrary — every week
 * stands its art on canvas 292 (`T = 102 − 1.1·(bounds bottom − 190)`, all twelve
 * to 0.05pt) — but the frames write these, so these are what is drawn.
 */
export const WEEK_HERO_TOP: Readonly<Record<number, number>> = {
  1: 80,
  2: 98.9,
  3: 63.9,
  4: 114.4,
  5: 80,
  6: 98.9,
  7: 98.9,
  8: 80,
  9: 80,
  10: 80,
  11: 98.9,
  12: 88.8,
};

export const HEADER_TOP = 338;
export const ROWS_TOP = 472;
export const ROW_H = 58;
export const ROW_GAP = 8;
/** canvas 472 → 736: the rows viewport the P1 / P2 pair is drawn through */
export const ROWS_VIEW = 264;
/** what the viewport scrolls: four rows, so the last position is P2 (row 5 at 472) */
const ROWS_SCROLL = 4 * (ROW_H + ROW_GAP);
/**
 * Below three rows of viewport (a phone under ~770 tall) a 264 window becomes a
 * slot; the page scrolls whole instead (D320 rule 3, CRITIC §7.3).
 */
const MIN_VIEW = 3 * ROW_H + 2 * ROW_GAP;

export type RowState = 'done' | 'current' | 'upcoming';

/**
 * Where a lesson stands on the reader's day. The frames are drawn for day 38:
 * 1–37 done, 38 `Continue`, 39–84 upcoming. Completion records are not
 * consulted — the calendar day decides, as it always has (library Q3).
 */
export function rowStateFor(lessonDay: number, day: number): RowState {
  if (lessonDay < day) return 'done';
  if (lessonDay === day) return 'current';
  return 'upcoming';
}

/** Day one is the day they signed up, not the day after. */
export function courseDay(createdAt: number | undefined, now: number): number {
  return createdAt ? Math.max(1, Math.floor((now - createdAt) / 86_400_000) + 1) : 1;
}

/**
 * The reader's course day, read against the moment the screen mounted, so a
 * re-render cannot move the current row under a finger.
 */
export function useCourseDay(): number {
  const user = useCurrentUser();
  const [now] = useState(() => Date.now());
  return courseDay(user?.createdAt, now);
}

/** The week a day falls in — past day 84 the course stays on Week XII. */
export function weekForDay(day: number): number {
  return Math.min(12, Math.max(1, Math.ceil(day / 7)));
}

/** A `?week=` param, or any stray value, as one of the twelve. */
export function clampWeek(value: unknown): number {
  return Math.max(1, Math.min(12, Math.round(Number(value)) || 1));
}

/** The lesson's number as the rows print it — two digits. */
export const lessonNumber = (day: number) => String(day).padStart(2, '0');

const STATE_WORD: Record<RowState, string> = { done: 'completed', current: 'today', upcoming: 'upcoming' };

/**
 * One lesson row (library §3.5): `h58 r18`, a 28 lead cell, a 15/700 title that
 * wraps greedily (the span states no `text-wrap`; nine titles take two lines at
 * 393), and a trailing chevron — `#9B968E` when done, `#5A574F` when upcoming —
 * or, on the current row, which is the inverted card, `Continue`.
 *
 * The unframed screens borrow it with two knobs no frame draws: `detail`, a
 * second line under the title (the row grows past 58 only if the two run
 * long), and `lead` as any short label (a week's roman numeral). Without
 * `onPress` it is a plain row, not a button.
 */
export function CourseRow({
  lead,
  title,
  detail,
  caps,
  state,
  trailing,
  onPress,
  disabled,
  label,
}: {
  /** `'check'` for the done disc, otherwise the label the lead cell prints */
  lead: 'check' | string;
  title: string;
  detail?: string;
  /** a caps line over the title (search results' week) */
  caps?: string;
  state: RowState;
  /** defaults: current → `Continue`, otherwise the chevron; `null` draws nothing */
  trailing?: ReactNode | null;
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const current = state === 'current';
  const ink = current ? mono.onInk : mono.ink;
  const tail =
    trailing !== undefined ? (
      trailing
    ) : current ? (
      <MonoText v="pill" color={mono.onInk}>
        Continue
      </MonoText>
    ) : (
      <ChevronR color={state === 'done' ? mono.mute : mono.art} />
    );
  const tall = !!(detail || caps);
  const body = (
    <>
      <View style={{ width: 28, alignItems: 'center' }}>
        {lead === 'check' ? (
          <CheckDisc size={24} />
        ) : (
          <MonoText v="rowValue" color={current ? mono.onInkMuted : mono.mute}>
            {lead}
          </MonoText>
        )}
      </View>
      {tall ? (
        // Only the unframed screens draw these rows (search, first steps,
        // locked), so their two-line runs take `pretty` rather than the week
        // rows' greedy wrap: no lone last word on a narrow phone (D248).
        <View style={{ flex: 1, gap: 2 }}>
          {caps ? (
            <MonoText v="caps" wrap="wrap" color={current ? mono.onInkMuted : mono.mute}>
              {caps}
            </MonoText>
          ) : null}
          <MonoText v="rowLabel" wrap="pretty" color={ink}>
            {title}
          </MonoText>
          {detail ? (
            <MonoText v="pTight" wrap="pretty" color={current ? mono.onInkMuted : mono.mute} style={{ fontSize: 13, lineHeight: 18 }}>
              {detail}
            </MonoText>
          ) : null}
        </View>
      ) : (
        <MonoText v="rowLabel" wrap="wrap" color={ink} style={{ flex: 1 }}>
          {title}
        </MonoText>
      )}
      {tail}
    </>
  );
  const box = {
    minHeight: ROW_H,
    borderRadius: 18,
    backgroundColor: current ? mono.ink : mono.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: tall ? 11 : 0,
  } as const;
  if (!onPress) return <View style={box}>{body}</View>;
  return (
    <Tap onPress={onPress} disabled={disabled} label={label ?? title} style={box}>
      {body}
    </Tap>
  );
}

/** A week's lesson as a row, labelled the way a screen reader should hear it. */
export function LessonRow({ lesson, day, onPress, disabled }: { lesson: Curriculum84Lesson; day: number; onPress?: () => void; disabled?: boolean }) {
  const state = rowStateFor(lesson.day, day);
  const n = lessonNumber(lesson.day);
  return (
    <CourseRow
      lead={state === 'done' ? 'check' : n}
      title={lesson.title}
      state={state}
      onPress={onPress}
      disabled={disabled}
      label={`${lesson.title}, lesson ${n}, ${STATE_WORD[state]}`}
    />
  );
}

/** The seven rows, gap 8, in whatever column the caller gives them. */
export function LessonRows({ week, day, onLesson }: { week: Curriculum84Week; day: number; onLesson: (lessonDay: number) => void }) {
  return (
    <View style={{ gap: ROW_GAP }}>
      {week.lessons.map((lesson) => (
        <LessonRow key={lesson.day} lesson={lesson} day={day} onPress={() => onLesson(lesson.day)} />
      ))}
    </View>
  );
}

/**
 * The header stack (kit `stack(338, [caps, h1, p], {center, gap 8})`): `Week VI`
 * 13/700 `#9B968E` nowrap, the name 30/36 −0.6 balanced, the blurb 15/22
 * `#B5B0A8` pretty — each a full-width centred line.
 */
export function WeekHeader({ week, top = HEADER_TOP }: { week: Curriculum84Week; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, gap: 8, alignItems: 'center' }}>
      <MonoText v="caps" center style={{ alignSelf: 'stretch' }}>
        {`Week ${week.roman}`}
      </MonoText>
      <MonoText v="title" center accessibilityRole="header" style={{ alignSelf: 'stretch' }}>
        {week.name}
      </MonoText>
      <MonoText v="pTight" center style={{ alignSelf: 'stretch' }}>
        {week.blurb}
      </MonoText>
    </View>
  );
}

/**
 * How tall the rows viewport is on this phone: from 472 to 12 above the tab
 * scene's foot (the bar's top — 748 at 852, so the frame's 264 exactly). A
 * taller phone shows more of the column rather than a band of empty ground
 * under row 4 (D243); a shorter one less. `null` when that leaves fewer than
 * three rows: the page then scrolls whole.
 *
 * The foot is then raised to the top of the first row it would cut, as the
 * frame's own 264 lands on row 5's top edge: at 932 the 344 left would show
 * 14pt of row 6 as a stray band over the bar, so the window stops at row 5's
 * foot (330) instead (D247). 852 (264) and 844 (256) cut no row and are kept.
 */
export function useRowsViewport(): number | null {
  const { height } = useWindowDimensions();
  const bar = useTabBarHeight();
  const canvasTop = useCanvasTop();
  const sceneBottom = height - bar - canvasTop;
  const view = sceneBottom - 12 - ROWS_TOP;
  if (view < MIN_VIEW) return null;
  const cut = view % (ROW_H + ROW_GAP);
  return cut > 0 && cut < ROW_H ? view - cut : view;
}

/**
 * The back chevron, kit `chevronL()`: a 40-tall box at 22,60 over the hero (z 5).
 * `top` lets the short-phone page carry it in its scroll.
 */
export function WeekBack({ onPress, top = 60 }: { onPress: () => void; top?: number }) {
  return (
    <Tap
      label="Back"
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4, left: 16, right: 20 }}
      style={{ position: 'absolute', left: 22, top, height: 40, justifyContent: 'center', zIndex: 5 }}>
      <ChevronL />
    </Tap>
  );
}

/**
 * One week page, everything above the bar but the chevron, which the pager
 * holds still over all twelve. `width` is the page's (the pager's) — the hero
 * centres its 393 box in it and full-bleed art reaches both edges. On a phone
 * too short for the rows viewport the page scrolls whole, chevron included
 * (`onBack`), so nothing passes under a pinned glyph.
 */
export function WeekPage({
  week,
  day,
  width,
  onLesson,
  onBack,
}: {
  week: Curriculum84Week;
  day: number;
  width: number;
  onLesson: (lessonDay: number) => void;
  onBack: () => void;
}) {
  const view = useRowsViewport();
  const rows = <LessonRows week={week} day={day} onLesson={onLesson} />;
  const hero = <Hero id={week.hero} top={WEEK_HERO_TOP[week.n] ?? 80} width={width} />;

  if (view != null) {
    return (
      <View style={{ width, height: '100%' }}>
        {hero}
        <WeekHeader week={week} />
        <CueScrollView
          style={{ position: 'absolute', left: 0, right: 0, top: ROWS_TOP, height: view }}
          // the last scroll position is P2 — row 5 on the viewport's top edge —
          // whatever the viewport's height
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: view + ROWS_SCROLL - (7 * ROW_H + 6 * ROW_GAP) }}>
          {rows}
        </CueScrollView>
      </View>
    );
  }

  // A short phone: chevron, hero, header and rows in one scroll that starts
  // under the status bar (canvas 54), so the page's canvas y is the content's + 54.
  const top = 54;
  return (
    <View style={{ width, height: '100%' }}>
      <CueScrollView style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0 }}>
        <View style={{ height: ROWS_TOP - top + 7 * ROW_H + 6 * ROW_GAP + 24 }}>
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: -top, width }}>
            {hero}
          </View>
          <WeekHeader week={week} top={HEADER_TOP - top} />
          <View style={{ position: 'absolute', left: 16, right: 16, top: ROWS_TOP - top }}>{rows}</View>
          <WeekBack onPress={onBack} top={60 - top} />
        </View>
      </CueScrollView>
    </View>
  );
}
