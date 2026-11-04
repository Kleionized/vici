/**
 * Feeding the home-screen widgets (`src/widgets/TodayWidget.tsx`).
 *
 * The app computes what the widget shows — the day, the score, today's one
 * thing, the next check-in — and hands it over as a two-entry timeline: now,
 * and local midnight, when the day number turns over by itself without the app
 * being opened. Updates are skipped when nothing a widget shows has changed,
 * so this can run on every data change for free.
 *
 * iOS only; `expo-widgets` is a no-op elsewhere.
 */

import { Platform } from 'react-native';

import { lessonForDay } from '@/content/curriculum84';
import { nextMidnight, programDay, toDateKey } from '@/lib/date';
import { formatTime, type Routines } from '@/lib/routines';
import { buildScore } from '@/lib/score';
import type { AppUser, DailyCheckin, JournalEntry, LessonProgress, TidelineEvent } from '@/lib/types';
import type { SosWidgetProps, TodayWidgetProps } from '@/widgets/TodayWidget';

export type WidgetInput = {
  user: AppUser;
  checkins: DailyCheckin[];
  events: TidelineEvent[];
  journal: JournalEntry[];
  progress: Record<string, LessonProgress>;
  routines: Routines;
  /** hide the pledge's words (the "Hide sensitive previews" setting) */
  discreet: boolean;
  now: number;
};

let last = '';

function todayProps(input: WidgetInput, at: number): TodayWidgetProps {
  const { user, checkins, events, journal, progress, routines, discreet } = input;
  const day = programDay(user.createdAt, at);
  const key = toDateKey(new Date(at));
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const score = buildScore(checkins, events, lessonsDone, user.createdAt, at);
  const today = checkins.find((c) => c.date === key);
  const morningDone = today?.energy != null;
  const nightDone = !!(today?.emotions?.length || today?.reasons?.length);
  const next = !morningDone ? `Morning check-in · ${formatTime(routines.morning)}` : !nightDone ? `Night check-in · ${formatTime(routines.night)}` : '';
  const pledge = discreet ? '' : (journal.find((e) => e.tag === 'Pledge')?.body ?? '');
  const task = today?.dailyAction ?? lessonForDay(day)?.task.cardSummary ?? '';
  return {
    day,
    score: score.total.toLocaleString('en-US'),
    delta: score.delta > 0 ? `+${score.delta} today` : '',
    // the task is the day's own words — shown only when previews are not hidden
    task: discreet ? '' : task,
    pledge,
    next,
    ready: true,
  };
}

/** Push the widgets' content; `null` (signed out) blanks them. */
export function syncWidgets(input: WidgetInput | null): void {
  if (Platform.OS !== 'ios') return;
  try {
    // required lazily: the module resolves to a no-op stub off iOS, but there is
    // no reason to load it at all on a platform that has no widgets
    const { todayWidget, sosWidget } = require('@/widgets/TodayWidget') as typeof import('@/widgets/TodayWidget');
    if (!input) {
      const blank: TodayWidgetProps = { day: 1, score: '', delta: '', task: '', pledge: '', next: '', ready: false };
      const sig = 'blank';
      if (last === sig) return;
      last = sig;
      todayWidget.updateSnapshot(blank);
      sosWidget.updateSnapshot({ ready: false } satisfies SosWidgetProps);
      return;
    }
    const now = todayProps(input, input.now);
    const midnight = nextMidnight(input.now);
    // at midnight: the new day's number and score, nothing done yet
    const tomorrow = { ...todayProps({ ...input, checkins: input.checkins }, midnight + 1000), delta: '' };
    const sig = JSON.stringify([now, tomorrow]);
    if (sig === last) return;
    last = sig;
    todayWidget.updateTimeline([
      { date: new Date(input.now), props: now },
      { date: new Date(midnight), props: tomorrow },
    ]);
    sosWidget.updateSnapshot({ ready: true });
  } catch (error) {
    if (__DEV__) console.warn('Widgets could not be updated', error);
  }
}
