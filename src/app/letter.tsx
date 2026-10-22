import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LetterCard, LetterP, PostArrival, Salutation, Signoff } from '@/components/keepsakes/Letter';
import { HeroBoard, LoadingView } from '@/components/mono';
import { O3LetterRead, WEEK_XII_FROM } from '@/components/onboarding/handover';
import { LETTER_BY_ID, type ViciLetter } from '@/content/viciLetters';
import { WEEK_XII_LETTER } from '@/content/weekXiiLetter';
import { useCreateJournalEntry, useCurrentUser } from '@/lib/backend';
import { LETTER_OPENS_DAY, letterOpen, programmeDay } from '@/lib/day';
import { keepLetter, readLetterBox } from '@/lib/letterBox';
import { fillName, firstName, letterText, salutation } from '@/lib/viciPost';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';

/**
 * VICI's letters — `90B · VICI Post — Arrival` and `39 · The Letter — Read`,
 * plus `Letter Received` / `Letter Week XII` on the `week12` variant (the
 * handover's own two boards, re-opened from Settings and from All).
 *
 * The post variant reads one of the owner's letters (`src/content/viciLetters.ts`):
 * a milestone letter, or the letter for the morning after a slip. The launch
 * gate picks it (`src/lib/viciPost.ts`) and opens `?id=M05&at=…`; Mail opens the
 * same. Without an id it shows the latest letter delivered (D553).
 *
 * The arrival is the hero board (the envelope, "A letter came.", `Read` over
 * `Read later`); the read is the letter on its card, kept with `Save to
 * Journal` (D489). The letter stays readable from Mail either way.
 */

const PENDING_KEY = ACCOUNT_KEYS.letterPending;

type Variant = 'post' | 'week12';
type Phase = 'arrive' | 'read';

export default function LetterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ variant?: string; id?: string; at?: string }>();
  const user = useCurrentUser();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');

  const variant: Variant = params.variant === 'week12' ? 'week12' : 'post';
  const first = firstName(user?.displayName);

  // The post's letter: the one named, else the latest delivered (null: none yet).
  const named = params.id ? LETTER_BY_ID[params.id] : undefined;
  const namedAt = Number(params.at);
  const [latest, setLatest] = useState<{ letter: ViciLetter; at: number } | null | undefined>(undefined);
  useEffect(() => {
    if (variant !== 'post' || named) return;
    void readLetterBox().then((box) => {
      const last = box.letters[box.letters.length - 1];
      const letter = last ? LETTER_BY_ID[last.id] : undefined;
      setLatest(last && letter ? { letter, at: last.at } : null);
    });
  }, [variant, named]);
  const post = useMemo(() => (named ? { letter: named, at: Number.isFinite(namedAt) ? namedAt : 0 } : latest), [named, namedAt, latest]);

  const dismiss = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }, [router]);

  // Save to Journal — the letter becomes a journal entry, once. The week-XII letter
  // was already written there the night it was sealed, so that variant only closes.
  const keep = useCallback(() => {
    if (variant === 'week12' || !post) {
      dismiss();
      return;
    }
    void (async () => {
      await writeAccountJSON(PENDING_KEY, null);
      dismiss();
      if (!(await keepLetter(post.letter.id, post.at))) return;
      await createJournalEntry({ tag: 'Letter', title: post.letter.subject, body: letterText(post.letter, first) }).catch(() => {});
    })();
  }, [createJournalEntry, dismiss, first, post, variant]);

  const later = useCallback(() => {
    void (async () => {
      if (variant === 'post') await writeAccountJSON(PENDING_KEY, null);
      dismiss();
    })();
  }, [dismiss, variant]);

  if (variant === 'week12') {
    // The day-zero letter is sealed until Week XII (R2): Settings shows it
    // unopenable until then, and the launch gate delivers it on the first
    // launch of the week. A way in before that (a link, the review drawer)
    // finds it sealed, not open.
    if (user === undefined) return <LoadingView spinner={false} onClose={dismiss} />;
    const day = programmeDay(user);
    if (!letterOpen(day)) {
      const left = LETTER_OPENS_DAY - day;
      return (
        <HeroBoard
          nav={{ left: 'empty', right: 'close', onClose: dismiss }}
          hero="envelope"
          stackTop={451}
          titleSize={26}
          title="Sealed until Week XII."
          body={`It opens ${left === 1 ? 'tomorrow' : `in ${left} days`}, on Day ${LETTER_OPENS_DAY}.`}
          cta="Close"
          onCta={dismiss}
        />
      );
    }
    return phase === 'arrive' ? (
      // `Letter Received` — the handover's board: no ✕, the 26/33 title at 451
      <HeroBoard
        nav={{ left: 'empty', right: 'empty' }}
        hero="envelope"
        stackTop={451}
        titleSize={26}
        title="A letter came."
        body={WEEK_XII_FROM}
        cta="Open"
        onCta={() => setPhase('read')}
        ghost="Save it for later"
        onGhost={later}
      />
    ) : (
      /* `Letter Week XII` is drawn once, in the handover; this route re-opens
         the same board from Settings and All rather than keep a second copy. */
      <O3LetterRead name={first} paragraphs={WEEK_XII_LETTER} onKeep={later} next={later} />
    );
  }

  if (post === undefined) return <LoadingView spinner={false} onClose={dismiss} />;
  if (post === null) {
    return (
      <HeroBoard
        nav={{ left: 'empty', right: 'close', onClose: dismiss }}
        hero="envelope"
        stackTop={451}
        titleSize={26}
        title="No letters yet."
        body="VICI writes after milestones, and the morning after a slip."
        cta="Close"
        onCta={dismiss}
      />
    );
  }

  if (phase === 'arrive') {
    // the programme week the post lands in, on the calendar count every screen uses
    return <PostArrival onRead={() => setPhase('read')} onLater={later} onClose={later} />;
  }

  const { letter } = post;
  return (
    <LetterCard title="From VICI" onClose={later} primary="Save to Journal" onPrimary={keep} ghost="Close" onGhost={later}>
      <Salutation>{salutation(letter.greeting, first)}</Salutation>
      {letter.paragraphs.map((p, i) => (
        <LetterP key={i}>{fillName(p, first)}</LetterP>
      ))}
      <Signoff>Vici</Signoff>
    </LetterCard>
  );
}
