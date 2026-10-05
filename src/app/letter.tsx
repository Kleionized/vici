import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { LetterCard, LetterP, PostArrival, Salutation, Signoff, Strong, postWeek } from '@/components/keepsakes/Letter';
import { HeroBoard } from '@/components/mono';
import { O3LetterRead } from '@/components/onboarding/handover';
import { WEEK_XII_LETTER } from '@/content/weekXiiLetter';
import { useCreateJournalEntry, useCurrentUser, useLifeMap } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';

/**
 * The post — `90B · VICI Post — Arrival` and `39 · The Letter — Read`, plus
 * `Letter Received` / `Letter Week XII` on the `week12` variant (the handover's
 * own two boards, re-opened from Settings and from All).
 *
 * The arrival is the post's hero board (the envelope, "The post is in.", `Read`
 * over `Tonight`); the read is the letter on its card, kept with `Save to Log`.
 * Both ways out — `Tonight`, `Close`, the ✕ — clear the pending flag, so the
 * letter arrives once, and stays readable from Mail.
 */

const LETTER_KEY = 'tideline.letter.day3';
const PENDING_KEY = 'tideline.letter.pending';

type Variant = 'post' | 'week12';
type Phase = 'arrive' | 'read';

const FALLBACK_WHY = 'I want to be present for the people I love';

/** The reason, set as a sentence of its own: one full stop, never two. */
const sentence = (why: string) => (/[.!?…]$/.test(why) ? why : `${why}.`);

export default function LetterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ variant?: string }>();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');

  const variant: Variant = params.variant === 'week12' ? 'week12' : 'post';
  const name = user?.displayName?.trim().split(/\s+/)[0] || 'friend';
  const why = sentence(lifeMap?.whyStatement?.trim() || FALLBACK_WHY);

  const dismiss = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }, [router]);

  // Save to Log — the letter becomes a journal entry, once. The week-XII letter
  // was already written there the night it was sealed, so that variant only closes.
  const keep = useCallback(() => {
    if (variant === 'week12') {
      dismiss();
      return;
    }
    void (async () => {
      const prev = await getJSON<{ kept?: boolean }>(LETTER_KEY);
      await setJSON(LETTER_KEY, { kept: true, at: Date.now() });
      await setJSON(PENDING_KEY, null);
      // only once the flag is down: a letter opened cold leaves to Today, whose
      // launch gate would read a still-pending letter and push it straight back
      dismiss();
      if (prev?.kept) return;
      const body = `Dear ${name},\n\nIf you’re reading this, it happened. Good — you opened the letter instead of disappearing. That’s the only door that matters this morning.\n\nOne slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started: ${why} All still yours.\n\nThe only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don’t fail twice.\n\nI’ll see you tonight, steadier.\n\n— the you who makes it out`;
      await createJournalEntry({ tag: 'Letter', title: 'Don’t fail twice', body }).catch(() => {});
    })();
  }, [createJournalEntry, dismiss, name, variant, why]);

  const later = useCallback(() => {
    void (async () => {
      if (variant === 'post') await setJSON(PENDING_KEY, null);
      dismiss();
    })();
  }, [dismiss, variant]);

  if (variant === 'week12') {
    return phase === 'arrive' ? (
      // `Letter Received` — the handover's board: no ✕, the 26/33 title at 451
      <HeroBoard
        nav={{ left: 'empty', right: 'empty' }}
        hero="envelope"
        stackTop={451}
        titleSize={26}
        title="A letter arrived."
        body="From you, twelve weeks from now."
        cta="Open"
        onCta={() => setPhase('read')}
        ghost="Save it for later"
        onGhost={later}
      />
    ) : (
      /* `Letter Week XII` is drawn once, in the handover; this route re-opens
         the same board from Settings and All rather than keep a second copy. */
      <O3LetterRead name={name} paragraphs={WEEK_XII_LETTER} onKeep={later} next={later} />
    );
  }

  if (phase === 'arrive') {
    return <PostArrival caps={postWeek(user?.createdAt)} onRead={() => setPhase('read')} onLater={later} onClose={later} />;
  }

  return (
    <LetterCard title="From VICI" onClose={later} primary="Save to Log" onPrimary={keep} ghost="Close" onGhost={later}>
      <Salutation>{`Dear ${name},`}</Salutation>
      <LetterP>If you’re reading this, it happened. Good — you opened the letter instead of disappearing. That’s the only door that matters this morning.</LetterP>
      <LetterP>
        One slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started: <Strong>{why}</Strong> All
        still yours.
      </LetterP>
      <LetterP>The only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don’t fail twice.</LetterP>
      <LetterP>I’ll see you tonight, steadier.</LetterP>
      <Signoff>— the you who makes it out</Signoff>
    </LetterCard>
  );
}
