import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { LetterCard, LetterP, PostArrival, Salutation, Signoff, Strong } from '@/components/keepsakes/Letter';
import { HeroBoard, LoadingView } from '@/components/mono';
import { O3LetterRead, WEEK_XII_FROM } from '@/components/onboarding/handover';
import { WEEK_XII_LETTER } from '@/content/weekXiiLetter';
import { useCreateJournalEntry, useCurrentUser, useLifeMap } from '@/lib/backend';
import { LETTER_OPENS_DAY, courseWeekForDay, letterOpen, programmeDay } from '@/lib/day';
import { roman } from '@/lib/format';
import { ownWhy } from '@/lib/pledge';
import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';

/**
 * The post — `90B · VICI Post — Arrival` and `39 · The Letter — Read`, plus
 * `Letter Received` / `Letter Week XII` on the `week12` variant (the handover's
 * own two boards, re-opened from Settings and from All).
 *
 * The arrival is the post's hero board (the envelope, "The post is in.", `Read`
 * over `Tonight`); the read is the letter on its card, kept with `Save to
 * Journal` (the frame's `Save to Log`: the Log never lists letters, the
 * Journal does — D489).
 * Both ways out — `Tonight`, `Close`, the ✕ — clear the pending flag, so the
 * letter arrives once, and stays readable from Mail.
 */

const LETTER_KEY = ACCOUNT_KEYS.letterKept;
const PENDING_KEY = ACCOUNT_KEYS.letterPending;

type Variant = 'post' | 'week12';
type Phase = 'arrive' | 'read';

/** The reason, set as a sentence of its own: one full stop, never two. */
const sentence = (why: string) => (/[.!?…]$/.test(why) ? why : `${why}.`);

/*
 * The post's words (D476). It is VICI's letter, the same for everyone but the
 * name, so it is signed by VICI — not "the you who makes it out" — and it says
 * only what any account's record holds after a slip: what was logged before
 * it is still there. The reason he started is quoted only when he wrote one
 * himself (Life Map's "Why you're here", `ownWhy`); with none, the sentence is
 * left out rather than invented (D477). It no longer assumes the morning.
 */
const P1 = 'If you’re reading this, it happened. Good — you opened the letter instead of disappearing. That’s the only door that matters right now.';
const P2 = 'One slip is a wave, not the sea. Nothing before it is erased: every check-in, every lesson and every urge you waited out is still on your record.';
const P2_WHY = 'So is the reason you started:';
const P3 = 'The only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don’t fail twice.';
const P4 = 'Check in tonight. Steadier is enough.';

export default function LetterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ variant?: string }>();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');

  const variant: Variant = params.variant === 'week12' ? 'week12' : 'post';
  const first = user?.displayName?.trim().split(/\s+/)[0] || '';
  const name = first || 'friend';
  const own = ownWhy(lifeMap?.whyStatement);
  const why = own ? sentence(own) : '';

  const dismiss = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }, [router]);

  // Save to Journal — the letter becomes a journal entry, once. The week-XII letter
  // was already written there the night it was sealed, so that variant only closes.
  const keep = useCallback(() => {
    if (variant === 'week12') {
      dismiss();
      return;
    }
    void (async () => {
      const prev = await readAccountJSON<{ kept?: boolean }>(LETTER_KEY);
      await writeAccountJSON(LETTER_KEY, { kept: true, at: Date.now() });
      await writeAccountJSON(PENDING_KEY, null);
      // only once the flag is down: a letter opened cold leaves to Today, whose
      // launch gate would read a still-pending letter and push it straight back
      dismiss();
      if (prev?.kept) return;
      const body = `Dear ${name},\n\n${P1}\n\n${P2}${why ? ` ${P2_WHY} ${why}` : ''}\n\n${P3}\n\n${P4}\n\n— VICI`;
      await createJournalEntry({ tag: 'Letter', title: 'Don’t fail twice', body }).catch(() => {});
    })();
  }, [createJournalEntry, dismiss, name, variant, why]);

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
          body={`It opens on Day ${LETTER_OPENS_DAY} — ${left === 1 ? 'tomorrow' : `${left} days from now`}.`}
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
        title="A letter arrived."
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

  if (phase === 'arrive') {
    // the programme week the post lands in, on the calendar count every screen uses
    return <PostArrival caps={`Week ${roman(courseWeekForDay(programmeDay(user)))} post`} onRead={() => setPhase('read')} onLater={later} onClose={later} />;
  }

  return (
    <LetterCard title="From VICI" onClose={later} primary="Save to Journal" onPrimary={keep} ghost="Close" onGhost={later}>
      <Salutation>{`Dear ${name},`}</Salutation>
      <LetterP>{P1}</LetterP>
      <LetterP>
        {P2}
        {why ? (
          <>
            {` ${P2_WHY} `}
            <Strong>{why}</Strong>
          </>
        ) : null}
      </LetterP>
      <LetterP>{P3}</LetterP>
      <LetterP>{P4}</LetterP>
      <Signoff>— VICI</Signoff>
    </LetterCard>
  );
}
