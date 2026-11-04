/**
 * The in-progress urge session — persisted locally so closing the phone
 * mid-urge (the severe flow's whole point) doesn't lose the thread.
 *
 * Same-urge rule: reopening within ~20 minutes of the last activity resumes
 * the SAME session — it counts as one urge in the database, with `reopens`
 * incremented — rather than starting a new one. Older sessions are stale and
 * discarded. One event row is written per session, at resolution.
 *
 * `UrgeFlow` keeps where it had got to on the session (`flow`) on every
 * change, so a reopen lands on the same board with the same answers and the
 * session's own `startedAt` — the length it files is the urge's, not the last
 * sitting's. The session is cleared only when the urge is resolved or the user
 * chooses to leave it; a screen that merely unmounts (a pop, a remount, the
 * process being killed) leaves it for the next open to pick up.
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

/** Where the interrupt had got to — enough to put the same board back with the same answers. */
export interface UrgeFlowSnapshot {
  /** the flow step's name (`FlowStep` in `components/urge/flow.tsx`) */
  step: string;
  /** the strength board's band, 0–4 */
  band: number;
  /** the strength board was skipped: the band is the default, not a reading */
  skipped?: boolean;
  place: string;
  reasons: string[];
  feelings: string[];
  /** the second read, once answered (null until then) */
  after: number | null;
  note: string;
  /** "Give me another" presses on the feeling board */
  roll: number;
  /** which SOS stage was on screen */
  sosStage: number;
  /** how far through the ninety-second ring, 0–1 */
  surfProgress: number;
}

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
  /** The interrupt's own progress, when the session came from it (the hub's carries none). */
  flow?: UrgeFlowSnapshot;
}

export function newUrgeSession(severity: number): UrgeSession {
  const now = Date.now();
  return { id: genId('urge'), startedAt: now, lastActiveAt: now, severity, peakSeverity: severity, reopens: 0, phase: 'active' };
}

/**
 * Writes are queued one behind another, so a save issued just before a clear
 * can never land after it and bring a resolved session back.
 */
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => {});
  return run;
}

/** Load the stored session if it's still inside the same-urge window. */
export async function loadUrgeSession(): Promise<UrgeSession | null> {
  await queue;
  const s = await getJSON<UrgeSession>(KEY);
  if (!s) return null;
  if (Date.now() - s.lastActiveAt > SAME_URGE_WINDOW_MS) {
    await clearUrgeSession();
    return null;
  }
  return s;
}

export function saveUrgeSession(s: UrgeSession): Promise<void> {
  return enqueue(() => setJSON(KEY, { ...s, lastActiveAt: Date.now() }));
}

export function clearUrgeSession(): Promise<void> {
  return enqueue(() => removeKey(KEY));
}
