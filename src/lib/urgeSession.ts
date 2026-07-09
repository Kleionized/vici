/**
 * The in-progress urge session — persisted locally so closing the phone
 * mid-urge (the severe flow's whole point) doesn't lose the thread.
 *
 * Same-urge rule: reopening within ~20 minutes of the last activity resumes
 * the SAME session — it counts as one urge in the database, with `reopens`
 * incremented — rather than starting a new one. Older sessions are stale and
 * discarded. One event row is written per session, at resolution.
 */

import { genId } from '@/lib/id';
import { getJSON, removeKey, setJSON } from '@/lib/storage';

const KEY = 'tideline.urgeSession';

/** Reopening within this window counts as the same urge. */
export const SAME_URGE_WINDOW_MS = 20 * 60 * 1000;

/** Severity at or above this is the severe path; below it, the minor path. */
export const SEVERE_THRESHOLD = 7;
/** Once a re-rating drops below this, the urge is subsiding → ask what happened. */
export const SUBSIDING_THRESHOLD = 5;

export interface UrgeSession {
  id: string;
  startedAt: number;
  lastActiveAt: number;
  /** The latest rating (1–10). */
  severity: number;
  /** The highest rating seen this session — what gets recorded. */
  peakSeverity: number;
  /** App reopens while riding this urge (severe close-your-phone loop). */
  reopens: number;
  /** 'away' = the user was told to put the phone down and hasn't re-rated yet. */
  phase: 'active' | 'away';
  trigger?: string;
}

export function newUrgeSession(severity: number): UrgeSession {
  const now = Date.now();
  return { id: genId('urge'), startedAt: now, lastActiveAt: now, severity, peakSeverity: severity, reopens: 0, phase: 'active' };
}

/** Load the stored session if it's still inside the same-urge window. */
export async function loadUrgeSession(): Promise<UrgeSession | null> {
  const s = await getJSON<UrgeSession>(KEY);
  if (!s) return null;
  if (Date.now() - s.lastActiveAt > SAME_URGE_WINDOW_MS) {
    await removeKey(KEY);
    return null;
  }
  return s;
}

export async function saveUrgeSession(s: UrgeSession): Promise<void> {
  await setJSON(KEY, { ...s, lastActiveAt: Date.now() });
}

export async function clearUrgeSession(): Promise<void> {
  await removeKey(KEY);
}
