import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useCreateJournalEntry, useJournalEntries } from '@/lib/backend';
import { haptic } from '@/lib/haptics';
import { keepLetter } from '@/lib/letterBox';

/**
 * "Save to Journal" on a letter (D61). The letter is saved as a `Letter`
 * journal entry and the board stays open, so the save is seen: the pill turns
 * to "Saved to Journal" with a tick (and the success touch), and from then on
 * it opens the Journal. Whether it is saved is read from the Journal itself —
 * the same title and words — so a letter reopened from Mail shows it saved,
 * and it is never filed twice. A delivered letter is also marked kept in the
 * letter box (`box`), which is what Mail's "Saved to your journal" reads. A
 * save that fails says so and can be tried again.
 */
export function useKeepLetter({ title, body, box }: { title: string; body: string; box?: { id: string; at: number } }) {
  const router = useRouter();
  const entries = useJournalEntries();
  const create = useCreateJournalEntry();
  const [state, setState] = useState<'idle' | 'saving' | 'failed'>('idle');
  const saved = !!entries?.some((e) => e.tag === 'Letter' && e.title === title && e.body === body);

  const press = () => {
    if (saved) {
      router.push('/(app)/journal');
      return;
    }
    if (state === 'saving') return;
    setState('saving');
    void (async () => {
      try {
        await create({ tag: 'Letter', title, body });
        if (box) await keepLetter(box.id, box.at).catch(() => false);
        haptic.success();
        setState('idle');
      } catch {
        setState('failed');
      }
    })();
  };

  const label = saved ? 'Saved to Journal' : state === 'saving' ? 'Saving…' : state === 'failed' ? 'Couldn’t save. Try again' : 'Save to Journal';
  return { saved, label, press };
}
