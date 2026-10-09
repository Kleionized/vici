import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Enclosure, LetterCard, LetterP, PostArrival, Salutation, Signoff, postWeek } from '@/components/keepsakes/Letter';
import { kkFace, kkStanding } from '@/components/keepsakes/Medallion';
import { useCreateJournalEntry, useCurrentUser, useEvents } from '@/lib/backend';
import { roman } from '@/lib/format';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';

/**
 * The medallion post — `90B · VICI Post — Arrival` → `39B · Post — Medallion
 * Letter` → (the enclosure) `/drop`.
 *
 * It arrives like every post (CRITIC C8: Letter Arrival is the arrival for both
 * posts), then reads as a letter with the medallion enclosed under the
 * sign-off. Leaving it — the ✕ or `Tonight` on the arrival, the ✕ on the
 * letter — shelves it, as the arrival's corner X always did: the post is done
 * and stays re-readable from Mail.
 *
 * The enclosure is the face this post's own rule earns. The post fires when an
 * urge was logged and did not end in a slip — exactly `Vici`'s rule — so it
 * encloses Vici at the rung that count has cleared. The frame encloses
 * `Rebound, Tier I` (its sample account); the card's layout is the frame's,
 * the face is the account's (D275).
 */

const POST_DONE_KEY = ACCOUNT_KEYS.postDelivered;

/*
 * The letter's words (D478). They state only what the post's own rule proves —
 * an urge was logged and ridden out without a slip — and nothing it cannot:
 * the frame's "Most men vanish for a week after a night like that" and "The
 * return is the strongest predictor there is" were unsourced statistics, and
 * "Last night … This morning" assumed a delivery time the launch gate does not
 * keep (the post arrives on whatever launch follows the ride).
 */
const P1 = 'An urge came, and it passed without you giving in to it. You logged it, so it’s on your record now.';
const P2 = 'That is the whole skill: letting one rise and end on its own. This one is for using it.';

type Phase = 'arrive' | 'read';

export default function MedallionPost() {
  const router = useRouter();
  const user = useCurrentUser();
  const events = useEvents();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');
  const name = (user?.displayName || '').trim().split(/\s+/)[0] || 'friend';

  const face = kkFace('vici')!;
  const ridden = (events ?? []).filter((e) => e.type === 'urge_rode_out').length;
  const standing = Math.max(1, kkStanding(face, ridden));

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  /** Leaving it — the medallion is yours either way; the post is done. */
  // the done flag goes down before leaving: a post opened cold leaves to Today,
  // whose launch gate would otherwise deliver it again
  const shelve = () => {
    void writeAccountJSON(POST_DONE_KEY, Date.now()).then(close);
  };

  // `Save to Journal` (the frame's `Save to Log`): the letter is kept as a
  // Journal entry, and the Log never lists letters (D489)
  const keep = () => {
    void (async () => {
      await writeAccountJSON(POST_DONE_KEY, Date.now());
      close();
      await createJournalEntry({
        tag: 'Letter',
        title: 'A medallion from VICI',
        body: `Dear ${name},\n\n${P1}\n\n${P2}\n\n— VICI`,
      }).catch(() => {});
    })();
  };

  if (phase === 'arrive') {
    return <PostArrival caps={postWeek(user)} onRead={() => setPhase('read')} onLater={shelve} onClose={shelve} />;
  }

  return (
    <LetterCard title="From VICI" onClose={shelve} primary="Save to Journal" onPrimary={keep} ghost="See the yearly offer" onGhost={() => router.push('/drop')}>
      <Salutation>{`Dear ${name},`}</Salutation>
      <LetterP>{P1}</LetterP>
      <LetterP>{P2}</LetterP>
      <Signoff>— VICI</Signoff>
      <Enclosure scene={face.key} numeral={roman(standing)} title={`${face.name}, Tier ${roman(standing)}`} line={face.blurb} />
    </LetterCard>
  );
}
