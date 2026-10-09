/**
 * The urge in progress — one per account on this phone (D490), kept locally so
 * an urge outlives the screen it started on (deploy WP5, D461).
 *
 * Same-urge rule (D066): opening the SOS (`/urge`) or the hub (`/urge-hub`)
 * within twenty minutes of the session's last activity resumes the SAME urge —
 * the interrupt on the board it stopped at, the hub's ring on its own clock —
 * and counts the reopen in `reopens`, which the urge's event carries. One event
 * is written per session, when it resolves.
 *
 * Every way out clears the session: the urge logged, closed, or ended by a
 * logged slip. The only session left behind is one the app was killed in the
 * middle of, and it lapses twenty minutes after it was last touched. So the
 * (app) layout's "mid-urge, no arrivals" check only ever sees a live urge, never
 * a stale one.
 */

import { ACCOUNT_KEYS, readAccountJSON, removeAccountKey, writeAccountJSON } from '@/lib/accountState';
import { genId } from '@/lib/id';

const KEY = ACCOUNT_KEYS.urgeSession;
/**
 * Sessions written before this shape carried a strength nobody gave (the
 * default band, 8). They are dropped on read rather than trusted.
 */
const VERSION = 2;

/** Reopening within this window counts as the same urge. */
export const SAME_URGE_WINDOW_MS = 20 * 60 * 1000;

/** Where the urge was opened: the SOS interrupt, or the urge hub. */
export type UrgeDoor = 'interrupt' | 'hub';

/** The interrupt's answers so far — what a reopened `/urge` resumes from. */
export interface UrgeFlowSnapshot {
  step: string;
  /** The strength band (0–4) the user picked, or null if they have not. */
  band: number | null;
  place: string | null;
  reasons: string[];
  feelings: string[];
  /** The second read (0–4), or null if they have not given it. */
  after: number | null;
  note: string;
}

export interface UrgeSession {
  v: typeof VERSION;
  id: string;
  startedAt: number;
  lastActiveAt: number;
  door: UrgeDoor;
  /** The strength the user gave (1–10). Absent until they pick one: nothing is assumed. */
  severity?: number;
  /** Times the urge was reopened after the app was closed mid-urge. */
  reopens: number;
  /** The hub's chip — filed as the event's trigger. */
  trigger?: string;
  /** The interrupt's answers, while it is running. */
  flow?: UrgeFlowSnapshot;
}

export function newUrgeSession(door: UrgeDoor): UrgeSession {
  const now = Date.now();
  return { v: VERSION, id: genId('urge'), startedAt: now, lastActiveAt: now, door, reopens: 0 };
}

/** The stored session, if it is still inside the same-urge window. */
export async function loadUrgeSession(): Promise<UrgeSession | null> {
  const s = await readAccountJSON<UrgeSession>(KEY);
  if (!s) return null;
  if (s.v !== VERSION || typeof s.startedAt !== 'number' || Date.now() - s.lastActiveAt > SAME_URGE_WINDOW_MS) {
    await removeAccountKey(KEY);
    return null;
  }
  return s;
}

export async function saveUrgeSession(s: UrgeSession): Promise<void> {
  await writeAccountJSON(KEY, { ...s, lastActiveAt: Date.now() });
}

export async function clearUrgeSession(): Promise<void> {
  await removeAccountKey(KEY);
}

/**
 * When this run of the app last logged a slip. In memory only: the one reader
 * is the urge hub under the slip flow, in the same run; an app killed in
 * between has no hub left to ask.
 */
let slipLoggedAt = 0;

/**
 * A slip was logged, so whatever urge was live ended in it: its session goes,
 * and a hub that handed the urge to the slip flow starts a new one when it is
 * back in front (D460).
 */
export function endUrgeInSlip(): Promise<void> {
  slipLoggedAt = Date.now();
  return clearUrgeSession();
}

/** Whether a slip has been logged since `t`, in this run of the app. */
export function slipLoggedSince(t: number): boolean {
  return slipLoggedAt >= t;
}

/**
 * The urge a door opens: the live one, one reopen more — or a new one. It is
 * saved before it is handed back, so the clock survives the app being killed
 * straight away.
 */
export async function openUrgeSession(door: UrgeDoor): Promise<UrgeSession> {
  const stored = await loadUrgeSession();
  const session = stored ? { ...stored, reopens: stored.reopens + 1 } : newUrgeSession(door);
  await saveUrgeSession(session);
  return session;
}
