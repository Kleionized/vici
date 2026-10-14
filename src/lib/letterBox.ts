/**
 * The letters VICI has delivered to this account on this phone, newest last,
 * and the milestone marks already spent (`src/lib/viciPost.ts`). Kept per
 * account like the other delivery marks (D490): signing out leaves it, so a
 * letter never arrives twice (D552).
 */

import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';

export type DeliveredLetter = { id: string; at: number; kept?: boolean };
export type LetterBox = { marks: string[]; letters: DeliveredLetter[] };

const KEY = ACCOUNT_KEYS.lettersDelivered;
/** Mail keeps the last hundred; a mark list this long is decades of milestones. */
const KEEP = 100;

const EMPTY: LetterBox = { marks: [], letters: [] };

export async function readLetterBox(userId?: string): Promise<LetterBox> {
  const box = await readAccountJSON<LetterBox>(KEY, userId).catch(() => null);
  return box && Array.isArray(box.marks) && Array.isArray(box.letters) ? box : EMPTY;
}

/** Record a delivered letter, and any marks it spends. */
export async function deliverLetter(id: string, at: number, marks: string[] = [], userId?: string): Promise<void> {
  const box = await readLetterBox(userId);
  await writeAccountJSON(
    KEY,
    { marks: [...new Set([...box.marks, ...marks])], letters: [...box.letters, { id, at }].slice(-KEEP) },
    userId,
  );
}

/** Mark a delivered letter as saved to the Journal. True the first time, so it is filed once. */
export async function keepLetter(id: string, at: number): Promise<boolean> {
  const box = await readLetterBox();
  const hit = box.letters.find((l) => l.id === id && l.at === at);
  if (!hit || hit.kept) return false;
  await writeAccountJSON(KEY, { ...box, letters: box.letters.map((l) => (l === hit ? { ...l, kept: true } : l)) });
  return true;
}
