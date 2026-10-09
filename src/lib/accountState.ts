/**
 * What this phone keeps for an account, outside the account itself (deploy
 * WP7, D490–D492): the letter and post delivery flags, report-seen marks, the
 * check-in times, days and prompt clock, SOS settings, the urge in progress,
 * the written-in affirmation prompt and onboarding progress.
 *
 * Every one of those keys is stored under the signed-in account's id
 * (`<base>:<userId>`, the shape the reminder switch and the Week XII flag
 * already used), so a second account on the same phone never reads the
 * first's "a letter arrived", urge or check-in times. Screens read and write
 * them through `readAccountJSON` / `writeAccountJSON`, which resolve the
 * account themselves.
 *
 * Which account that is: the one auth reports, set by `useDeviceAccount()`
 * (mounted once at the root). Before auth has loaded — a launch with no
 * signal, where Clerk cannot load at all — it is the last account signed in
 * on this phone (`tideline.device.account`), so the SOS reached from the
 * offline boot board still keeps its urge under the right account. With no
 * account at all, reads answer null and writes are dropped.
 *
 * Signing out removes that account's pending and in-progress state (D491):
 * a sign-out seen while the app runs, or a different account signing in. A
 * launch whose first report is "signed out" clears nothing and keeps using the
 * phone's account, because offline that report can be Clerk loading with no
 * session it could check. Keys written before this build, under no account,
 * are claimed by the next account to sign in, so an update keeps the owner's
 * check-in times (D492).
 *
 * Device-level, and left as they are: the app-lock mirror
 * (`tideline.applock.v1`, which must engage before any account loads, and is
 * already cleared on sign-out), the mock build's account book and session
 * (`tideline.mock.*`, `tideline.session.userId`), Clerk's token cache, and
 * `tideline.device.account` itself.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import { useAuth } from '@/lib/auth';
import { getJSON, removeKey, setJSON } from '@/lib/storage';

/** Every per-account key, by what it holds. The strings are the old device-wide names. */
export const ACCOUNT_KEYS = {
  /** a slip was logged: the post-slip letter arrives on the next launch */
  letterPending: 'tideline.letter.pending',
  /** the post-slip letter has been kept in the Journal (Mail lists it) */
  letterKept: 'tideline.letter.day3',
  /** an urge was ridden out: the medallion post arrives on the next launch */
  postPending: 'tideline.post.backondeck.pending',
  /** the medallion post has been delivered */
  postDelivered: 'tideline.post.backondeck.delivered',
  /** the last weekly report delivered */
  reportSeen: 'tideline.weeklyReport.seenWeek',
  /** the day-zero letter's Week XII arrival has been delivered */
  letterXiiDelivered: 'tideline.letter.week12.delivered',
  /** when the launch gate (or a tapped reminder) last opened a check-in */
  checkinPromptAt: 'tideline.checkinPromptAt',
  /** the morning and night check-in times */
  routines: 'tideline.routines.v2',
  /** the days each check-in's reminder fires on */
  checkinDays: 'tideline.routines.days.v1',
  /** check-in reminders asked for on this phone (`src/lib/reminders.ts`, D420) */
  remindersOn: 'tideline.reminders.enabled.v1',
  /** the SOS's orb light and background */
  sosSettings: 'tideline.sos.settings',
  /** the urge in progress (`src/lib/urgeSession.ts`) */
  urgeSession: 'tideline.urgeSession',
  /** a prompt the user wrote on the affirmation board */
  affirmationPrompt: 'tideline.affirmation.prompt',
  /** onboarding's step and answers, so an app kill resumes the funnel (D2) */
  onboarding: 'tideline.onboarding.v1',
} as const;

export type AccountKey = (typeof ACCOUNT_KEYS)[keyof typeof ACCOUNT_KEYS];

/**
 * Removed when the account signs out (D491): anything that would make the
 * phone act for it, or that shows what it recently did or wrote. Its
 * "already delivered" marks and its reminder choice, times and days stay —
 * stored under its id, no other account reads them, and clearing them would
 * re-deliver a letter or a report and reset the reminders (D420) the next
 * time it signs in.
 */
const CLEARED_ON_SIGN_OUT: readonly AccountKey[] = [
  ACCOUNT_KEYS.letterPending,
  ACCOUNT_KEYS.postPending,
  ACCOUNT_KEYS.checkinPromptAt,
  ACCOUNT_KEYS.sosSettings,
  ACCOUNT_KEYS.urgeSession,
  ACCOUNT_KEYS.affirmationPrompt,
  ACCOUNT_KEYS.onboarding,
];

/** Keys earlier builds stored under no account (D492). */
const LEGACY: readonly AccountKey[] = [
  ACCOUNT_KEYS.letterPending,
  ACCOUNT_KEYS.letterKept,
  ACCOUNT_KEYS.postPending,
  ACCOUNT_KEYS.postDelivered,
  ACCOUNT_KEYS.reportSeen,
  ACCOUNT_KEYS.checkinPromptAt,
  ACCOUNT_KEYS.routines,
  ACCOUNT_KEYS.checkinDays,
  ACCOUNT_KEYS.sosSettings,
  ACCOUNT_KEYS.urgeSession,
  ACCOUNT_KEYS.affirmationPrompt,
];

/** Written by earlier builds and read by nothing now: removed where found. */
const RETIRED = ['tideline.post.yearlydrop.seen'];

/** Device-level: the account signed in on this phone, for launches where auth cannot say yet. */
const DEVICE_ACCOUNT_KEY = 'tideline.device.account';

export const accountKey = (base: AccountKey, id: string) => `${base}:${id}`;

// ── which account ────────────────────────────────────────────────────

/** The account auth reports; undefined until auth has loaded in this run. */
let current: string | null | undefined;
/** Sign-out clearing and legacy claiming, in order: reads wait for it. */
let settled: Promise<void> = Promise.resolve();
let lastSignedIn: Promise<string | null> | null = null;
const listeners = new Set<() => void>();

/** The account last signed in on this phone, as the disk had it at launch. */
function storedAccount(): Promise<string | null> {
  if (!lastSignedIn) lastSignedIn = getJSON<string>(DEVICE_ACCOUNT_KEY).then((id) => (typeof id === 'string' && id ? id : null));
  return lastSignedIn;
}

/** The account this phone had at launch (null for none); the reminders compare a first sign-in against it. */
export const accountAtLaunch = storedAccount;

/** The account whose keys a read or write uses now. */
function resolveAccount(): Promise<string | null> {
  if (current !== undefined) return settled.then(() => current ?? null);
  return storedAccount().then((id) => (current !== undefined ? settled.then(() => current ?? null) : id));
}

async function clearSignedOut(id: string) {
  try {
    await AsyncStorage.multiRemove(CLEARED_ON_SIGN_OUT.map((base) => accountKey(base, id)));
  } catch {
    // best-effort: the keys are this account's alone either way
  }
}

/** An earlier build's account-less keys become this account's, unless it already has its own. */
async function claimLegacy(id: string) {
  try {
    const found = (await AsyncStorage.multiGet([...LEGACY, ...RETIRED])).filter(([, value]) => value != null);
    if (!found.length) return;
    const claimable = found.filter(([key]) => (LEGACY as readonly string[]).includes(key));
    const own = await AsyncStorage.multiGet(claimable.map(([key]) => `${key}:${id}`));
    const moves = claimable.filter((_, i) => own[i]?.[1] == null).map(([key, value]): [string, string] => [`${key}:${id}`, value as string]);
    if (moves.length) await AsyncStorage.multiSet(moves);
    await AsyncStorage.multiRemove(found.map(([key]) => key));
  } catch {
    // left for the next sign-in to claim
  }
}

async function switchAccount(prev: string | null | undefined, next: string | null) {
  const before = prev === undefined ? await storedAccount() : prev;
  if (before && before !== next) await clearSignedOut(before);
  if (next) {
    await claimLegacy(next);
    await setJSON(DEVICE_ACCOUNT_KEY, next);
  } else {
    await removeKey(DEVICE_ACCOUNT_KEY);
  }
}

function setAccount(next: string | null) {
  if (next === current) return;
  // The run's first word from auth is "signed out": not a sign-out seen here.
  // Offline, Clerk can load with no session it could check (no cached client
  // yet), so this may be the same account with no signal. Nothing is cleared,
  // the phone's account is kept, and reads and writes stay on it (as before
  // auth loaded) until an account signs in; a different one then clears it.
  if (current === undefined && next === null) return;
  const prev = current;
  current = next;
  settled = settled.then(() => switchAccount(prev, next)).catch(() => {});
  for (const listener of listeners) listener();
}

/** Called whenever the account changes (module caches such as the check-in times reset on it). */
export function onAccountChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Mount once, at the root, ahead of the screens. Points every account key at
 * the account auth reports. While auth has not loaded (no signal, before
 * Clerk can load), and when the run's first report is "signed out", the last
 * account signed in on this phone stays in use.
 */
export function useDeviceAccount(): void {
  const { isLoaded, isSignedIn, userId } = useAuth();
  useEffect(() => {
    if (!isLoaded) return;
    setAccount(isSignedIn && userId ? userId : null);
  }, [isLoaded, isSignedIn, userId]);
}

// ── reading and writing ─────────────────────────────────────────────

/**
 * Pass `id` where the screen already knows the account (onboarding and the
 * launch gate do); otherwise the account is resolved as above. Either way the
 * read waits for a sign-in's legacy claim to land. No account: nothing is kept.
 */
async function idFor(id?: string | null): Promise<string | null> {
  return id !== undefined ? settled.then(() => id) : resolveAccount();
}

export async function readAccountJSON<T>(base: AccountKey, id?: string | null): Promise<T | null> {
  const who = await idFor(id);
  return who ? getJSON<T>(accountKey(base, who)) : null;
}

export async function writeAccountJSON(base: AccountKey, value: unknown, id?: string | null): Promise<void> {
  const who = await idFor(id);
  if (who) await setJSON(accountKey(base, who), value);
}

export async function removeAccountKey(base: AccountKey, id?: string | null): Promise<void> {
  const who = await idFor(id);
  if (who) await removeKey(accountKey(base, who));
}
