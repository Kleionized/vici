import { KK_ALBUM, kkStanding, type KKFace, type KeepsakeSceneKey } from '@/components/keepsakes/Medallion';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import type { AppUser, DailyCheckin, JournalEntry, LessonProgress, TidelineEvent } from '@/lib/types';

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

const DAY = 86_400_000;

/** `YYYY-MM-DD` as local midnight — `new Date(iso)` reads it as UTC and slips a day west of Greenwich. */
const dayStart = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1).getTime();
};

/** A timestamp as its own local calendar day, so two records on one evening count once. */
const dayKey = (ms: number) => {
  const d = new Date(ms);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

type LedgerInput = {
  user: Pick<AppUser, 'createdAt' | 'onboardingComplete'> | null | undefined;
  events: readonly Pick<TidelineEvent, 'type' | 'createdAt' | 'severity'>[];
  checkins: readonly Pick<DailyCheckin, 'date'>[];
  journal: readonly Pick<JournalEntry, 'createdAt'>[];
  progress: Record<string, Pick<LessonProgress, 'status'> | null | undefined>;
};

/** The counting itself — pure, so it can be checked without a store. */
export function buildLedger({ user, events, checkins, journal, progress }: LedgerInput): MedallionLedger {
  const rode = events.filter((e) => e.type === 'urge_rode_out');
  const actedOn = events.filter((e) => e.type === 'urge_acted_on');
  // Breakwater is the top intensity band (9–10) ridden out
  const storms = rode.filter((e) => (e.severity ?? 0) >= 9);
  const lapses = events.filter((e) => e.type === 'lapse');
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;

  // Vidi counts days the app was opened and something was written down — not
  // days since sign-up — so every kind of record folds into one set of dates.
  const recorded = new Set<number>();
  for (const c of checkins) recorded.add(dayKey(dayStart(c.date)));
  for (const e of events) recorded.add(dayKey(e.createdAt));
  for (const j of journal) recorded.add(dayKey(j.createdAt));

  // Rebound is the morning after: a check-in on the day following a slip.
  const checkinDays = new Set(checkins.map((c) => dayKey(dayStart(c.date))));
  const rebounds = new Set<number>();
  for (const l of lapses) {
    const next = dayKey(l.createdAt + DAY);
    if (checkinDays.has(next)) rebounds.add(next);
  }

  // Return is a check-in that lands after a week of silence — the gap is
  // measured against the previous check-in, so the first one can never earn it.
  const stamps = checkins.map((c) => dayStart(c.date)).sort((a, b) => a - b);
  const returned = stamps.find((ms, i) => i > 0 && ms - stamps[i - 1] >= 7 * DAY);
  const firstCheckin = stamps.length ? stamps[0] : undefined;
  const firstSlipLogged = actedOn.length ? Math.min(...actedOn.map((e) => e.createdAt)) : undefined;

  // What each face counts, and — for the four that mint once — whether it has.
  const COUNT: Record<KeepsakeSceneKey, number> = {
    veni: user?.onboardingComplete ? 1 : 0,
    firstlight: checkins.length ? 1 : 0,
    vidi: recorded.size,
    vici: rode.length,
    breakwater: storms.length,
    rebound: rebounds.size,
    logbook: rode.length + actedOn.length,
    pulse: checkins.length,
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
  if (events === undefined || checkins === undefined || user === undefined || journal === undefined || progress === undefined) return undefined;
  return buildLedger({ user, events, checkins, journal, progress });
}

/** Edit Profile's "Medallions · 10 of 12": how many faces are earned, of how many. */
export function useAlbumStanding(): { earned: number; total: number } | undefined {
  const ledger = useMedallionLedger();
  return ledger ? { earned: ledger.earned, total: ledger.total } : undefined;
}
