import { KK_ALBUM, kkStanding, type KKFace, type KeepsakeSceneKey } from '@/components/keepsakes/Medallion';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import type { AppUser, DailyCheckin, JournalEntry, LessonProgress, TidelineEvent } from '@/lib/types';
import { addDays, calendarDaysBetween, fromDateKey, startOfDay, useNow } from '@/lib/date';

/**
 * The medallion ledger: what every face counts, live, and where it stands.
 *
 * One reading for every screen that shows a face — the album, the ladders,
 * `Tiers One-offs`, the medallion letter's enclosure and Edit Profile's
 * "Medallions · 10 of 12" — so no two of them can disagree about a number
 * (CRITIC C17: `useMedallionLedger` and `useAlbumStanding` are this one file).
 */

/** What a face knows about itself once the log has been counted. */
export type LedgerFace = {
  face: KKFace;
  count: number;
  earned: boolean;
  /** how many rungs are behind it — 1 for a one-off that has minted */
  standing: number;
  /** when a one-off minted (ms), for the date it carries instead of a tier */
  date?: number;
};

export type MedallionLedger = {
  faces: LedgerFace[];
  byKey: Record<KeepsakeSceneKey, LedgerFace>;
  earned: number;
  total: number;
};

/** A slip, however it was logged: the slip flow files a `lapse`, the urge log an `urge_acted_on` (`isSlip`). */
const isSlip = (type: TidelineEvent['type']) => type === 'lapse' || type === 'urge_acted_on';

/**
 * Whether a check-in row records a check-in. A row is written by several hands
 * (`convex/checkins.ts`): the morning and night check-ins set a mood, but the
 * night check-in also files tomorrow's action on tomorrow's row, and Today
 * ticks the action off on today's — a row holding only `dailyAction` /
 * `dailyActionDone` is a plan or a tick, not a check-in, and the row for
 * tomorrow exists before tomorrow does.
 */
const checkedIn = (c: Pick<DailyCheckin, 'mood' | 'energy' | 'sleepHours'>) => c.mood != null || c.energy != null || c.sleepHours != null;

/** Return's "7+ days away", in calendar days between two days with something on them. */
const AWAY_DAYS = 7;

type LedgerInput = {
  user: Pick<AppUser, 'createdAt' | 'onboardingComplete'> | null | undefined;
  events: readonly Pick<TidelineEvent, 'type' | 'createdAt' | 'severity'>[];
  checkins: readonly Pick<DailyCheckin, 'date' | 'mood' | 'energy' | 'sleepHours'>[];
  journal: readonly Pick<JournalEntry, 'createdAt'>[];
  progress: Record<string, Pick<LessonProgress, 'status'> | null | undefined>;
  /** the clock, for the one rule that has to know which days have happened yet */
  now?: number;
};

/** The counting itself — pure, so it can be checked without a store. */
export function buildLedger({ user, events, checkins, journal, progress, now = Date.now() }: LedgerInput): MedallionLedger {
  const rode = events.filter((e) => e.type === 'urge_rode_out');
  const actedOn = events.filter((e) => e.type === 'urge_acted_on');
  // Breakwater is the top intensity band ("Overwhelming", stored as 10; "Intense" is 8) ridden out
  const storms = rode.filter((e) => (e.severity ?? 0) >= 9);
  const slips = events.filter((e) => isSlip(e.type));
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;

  // Every day is keyed by its own local midnight, so two records on one
  // evening are one day. A check-in row is filed under a calendar date; a row
  // dated after today (tomorrow's action) is not a day that has happened.
  const today = startOfDay(now);
  const checkinDays = new Set<number>();
  for (const c of checkins) {
    if (!checkedIn(c)) continue;
    const day = fromDateKey(c.date).getTime();
    if (day <= today) checkinDays.add(day);
  }

  // Vidi counts days the app was opened and something was written down — not
  // days since sign-up — so every kind of record folds into one set of dates.
  const recorded = new Set<number>(checkinDays);
  for (const e of events) recorded.add(startOfDay(e.createdAt));
  for (const j of journal) recorded.add(startOfDay(j.createdAt));

  // Rebound is the morning after: a check-in on the calendar day following a
  // slip — either kind of slip — counted once per morning, however many slips
  // that night held.
  const rebounds = new Set<number>();
  for (const l of slips) {
    const next = addDays(startOfDay(l.createdAt), 1);
    if (checkinDays.has(next)) rebounds.add(next);
  }

  // Return is coming back after a week with nothing on it: the first day with
  // a record that lands 7+ calendar days after the one before it (the very
  // first day can never earn it). Counted by the calendar, not by 24-hour
  // blocks, so a week that crosses a clock change still reads as a week.
  const days = [...recorded].sort((a, b) => a - b);
  const returned = days.find((ms, i) => i > 0 && calendarDaysBetween(days[i - 1], ms) >= AWAY_DAYS);
  const pulse = checkinDays.size;
  const firstCheckin = pulse ? Math.min(...checkinDays) : undefined;
  const firstSlipLogged = slips.length ? Math.min(...slips.map((e) => e.createdAt)) : undefined;

  // What each face counts, and — for the four that mint once — whether it has.
  const COUNT: Record<KeepsakeSceneKey, number> = {
    veni: user?.onboardingComplete ? 1 : 0,
    firstlight: pulse ? 1 : 0,
    vidi: recorded.size,
    vici: rode.length,
    breakwater: storms.length,
    rebound: rebounds.size,
    logbook: rode.length + actedOn.length,
    pulse,
    blackbox: firstSlipLogged != null ? 1 : 0,
    lessons: lessonsDone,
    archive: journal.length,
    return: returned != null ? 1 : 0,
  };
  const DATE: Partial<Record<KeepsakeSceneKey, number>> = {
    veni: user?.createdAt,
    firstlight: firstCheckin,
    blackbox: firstSlipLogged,
    return: returned,
  };

  const faces = KK_ALBUM.map((face): LedgerFace => {
    const count = COUNT[face.key];
    const standing = kkStanding(face, count);
    return { face, count, earned: standing > 0, standing, date: face.steps.length || standing < 1 ? undefined : DATE[face.key] };
  });
  const byKey = Object.fromEntries(faces.map((f) => [f.face.key, f])) as Record<KeepsakeSceneKey, LedgerFace>;
  return { faces, byKey, earned: faces.filter((f) => f.earned).length, total: faces.length };
}

/** The ledger for the signed-in account; `undefined` while any of its five reads is loading. */
export function useMedallionLedger(): MedallionLedger | undefined {
  const events = useEvents();
  const checkins = useCheckins();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  // "now" held steady while the screen is open, moved on when the day turns
  const now = useNow();
  if (events === undefined || checkins === undefined || user === undefined || journal === undefined || progress === undefined) return undefined;
  return buildLedger({ user, events, checkins, journal, progress, now });
}

/** Edit Profile's "Medallions · 10 of 12": how many faces are earned, of how many. */
export function useAlbumStanding(): { earned: number; total: number } | undefined {
  const ledger = useMedallionLedger();
  return ledger ? { earned: ledger.earned, total: ledger.total } : undefined;
}
