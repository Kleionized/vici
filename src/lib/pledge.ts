import type { JournalEntry } from '@/lib/types';

/**
 * The frame's sample pledge. The morning check-in has offered it as the pledge
 * to re-sign when an account had none, and filed it as "Day N pledge" when
 * signed — so accounts carry it as if they had written it. It is never read
 * back as anyone's pledge (D475): `standingPledge` passes over it, and a screen
 * with no pledge of the user's own shows its "write one" state instead.
 */
export const SAMPLE_PLEDGE = 'The mornings are mine again.';

/**
 * The vow `40 · The Vow` offers — the words a `Vow` entry is filed with when he
 * signs it there, or later on `/vow` (D474).
 */
export const VOW_TEXT =
  'I’m giving this twelve weeks. I don’t need to be perfect. When I want to watch, I’ll use the plan first. If I have a bad day, I’ll come back the next day.';

/**
 * A pledge's words. The pledge editor (`/journal-new?tag=Pledge`) has a title
 * and a body, and a pledge written in the first field alone used to be stored
 * with an empty body — so Today, the morning re-sign, the hub, relapse and slip,
 * which all read `body`, showed nothing (or a blank card). The body wins; a
 * real title stands in for an empty one; `''` means there is no pledge to show.
 */
export function pledgeText(entry: Pick<JournalEntry, 'title' | 'body'> | null | undefined): string {
  if (!entry) return '';
  const body = entry.body?.trim();
  if (body) return body;
  const title = entry.title?.trim();
  return title && title !== 'Untitled' ? title : '';
}

/** Whether these words are the frame's sample rather than the user's own. */
export function isSamplePledge(words: string | null | undefined): boolean {
  return (words ?? '').trim() === SAMPLE_PLEDGE;
}

/** The standing pledge: the newest `Pledge` entry with words of the user's own (never the sample, D475). */
export function standingPledge<T extends Pick<JournalEntry, 'tag' | 'title' | 'body'>>(journal: readonly T[] | null | undefined): T | undefined {
  return (journal ?? []).find((entry) => {
    if (entry.tag !== 'Pledge') return false;
    const words = pledgeText(entry);
    return words !== '' && !isSamplePledge(words);
  });
}

/**
 * The reason the user started, in their own words, or `''`.
 *
 * Onboarding used to store a sentence machine-assembled from two chip answers
 * ("Stop completely. The when i’m bored window, guarded first.") as the Life
 * Map's why, and the post-slip letter quoted it as "the reason you started".
 * Onboarding no longer writes it (D477); accounts that already carry it read
 * it as no reason at all, so the letter leaves the clause out and Life Map
 * opens its field empty — without a migration, on either backend.
 */
export function ownWhy(why: string | null | undefined): string {
  const text = (why ?? '').trim();
  if (!text) return '';
  if (/ window, guarded first\.?$/.test(text)) return '';
  return text;
}
