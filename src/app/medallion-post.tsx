import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Enclosure, LetterCard, LetterP, PostArrival, Salutation, Signoff, postWeek } from '@/components/keepsakes/Letter';
import { kkFace, kkStanding } from '@/components/keepsakes/Medallion';
import { useCreateJournalEntry, useCurrentUser, useEvents } from '@/lib/backend';
import { roman } from '@/lib/format';
import { setJSON } from '@/lib/storage';

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

const POST_DONE_KEY = 'tideline.post.backondeck.delivered';

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
    void setJSON(POST_DONE_KEY, Date.now()).then(close);
  };

  const keep = () => {
    void (async () => {
      await setJSON(POST_DONE_KEY, Date.now());
      close();
      await createJournalEntry({
        tag: 'Letter',
        title: 'VICI Post · A medallion',
        body: `Dear ${name},\n\nLast night an urge rose, crested, and left without you. This morning you opened the app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back.\n\nThe return is the strongest predictor there is — stronger than any count. This one isn’t for resisting. It’s for coming back.\n\n— VICI`,
      }).catch(() => {});
    })();
  };

  if (phase === 'arrive') {
    return <PostArrival caps={postWeek(user?.createdAt)} onRead={() => setPhase('read')} onLater={shelve} onClose={shelve} />;
  }

  return (
    <LetterCard title="Enclosure from VICI" onClose={shelve} primary="Save to Log" onPrimary={keep} ghost="Open the enclosure" onGhost={() => router.push('/drop')}>
      <Salutation>{`Dear ${name},`}</Salutation>
      <LetterP>
        Last night an urge rose, crested, and left without you. This morning you opened the app anyway — logged it, stayed. Most men vanish for a week after
        a night like that. You came back.
      </LetterP>
      <LetterP>The return is the strongest predictor there is — stronger than any count. This one isn’t for resisting. It’s for coming back.</LetterP>
      <Signoff>— VICI</Signoff>
      <Enclosure scene={face.key} numeral={roman(standing)} title={`${face.name}, Tier ${roman(standing)}`} line={face.blurb} />
    </LetterCard>
  );
}
