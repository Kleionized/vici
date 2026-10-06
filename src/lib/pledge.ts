import type { JournalEntry } from '@/lib/types';

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

/** The standing pledge: the newest `Pledge` entry that has words. */
export function standingPledge<T extends Pick<JournalEntry, 'tag' | 'title' | 'body'>>(journal: readonly T[] | null | undefined): T | undefined {
  return (journal ?? []).find((entry) => entry.tag === 'Pledge' && pledgeText(entry) !== '');
}
