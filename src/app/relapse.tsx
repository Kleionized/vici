import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { HeroBoard, MonoText, PledgeCard } from '@/components/mono';
import { Gap, SosQuestion } from '@/components/urge/stages';
import { useCreateEvent, useCurrentUser, useJournalEntries } from '@/lib/backend';
import { setJSON } from '@/lib/storage';

/**
 * The slip, in four boards — `34 · SOS — Slipped`, `36 · Relapse — Don’t Fail
 * Twice`, `36B · Re-sign the Pledge`, `37 · Begin Again`. Reached from the All
 * drawer; the SOS and the hub's "I slipped" open `/slip` (D147).
 *
 * The four are the slip flow's twins (Slip Entry, Don’t Fail Twice, Pledge,
 * Begin Again) on the same kit pieces: three hero boards and the pledge
 * board. They differ from them in the ghost links and Begin Again's back
 * chevron, as the frames do.
 */
export default function Relapse() {
  const router = useRouter();
  const { logged: alreadyLogged } = useLocalSearchParams<{ logged?: string }>();
  const createEvent = useCreateEvent();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  // The standing pledge, read the way Today reads it.
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge');
  const [index, setIndex] = useState(0);
  const logged = useRef(alreadyLogged === '1');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const back = () => (index === 0 ? close() : setIndex((value) => value - 1));

  function advance() {
    if (index < 3) {
      setIndex((value) => value + 1);
      return;
    }
    if (!logged.current) {
      logged.current = true;
      // As on the SOS interrupt: caught so the screen never blocks on a write,
      // but not silent — a rejected mutation is how F30 stayed invisible.
      void createEvent({ type: 'lapse' }).catch((error) => {
        if (__DEV__) console.warn('lapse was not written', error);
      });
      void setJSON('tideline.letter.pending', Date.now());
    }
    router.replace('/(app)/today');
  }

  switch (index) {
    case 0:
      return (
        <HeroBoard
          key="log"
          nav={{ onClose: close }}
          hero="dominoes"
          title="It happened."
          // pretty breaks before "it" where a greedy wrap would not — native gets the frame's lines (D332)
          body={'The day isn’t over. Log what happened, then stop\nit here.'}
          cta="Log the slip"
          onCta={advance}
          ghost="Back to the wave tool"
          // the wave tool is the interrupt this board was drawn beside
          onGhost={() => router.replace('/urge')}
        />
      );
    case 1:
      return (
        <HeroBoard
          key="twice"
          nav={{ onClose: close }}
          hero="dominoes2"
          title="Don’t let it become two."
          body="One slip happened. You can still turn the rest of today around."
          cta="Continue"
          onCta={advance}
        />
      );
    case 2:
      return (
        <SosQuestion
          onClose={close}
          hero={{ id: 'fountainPen', top: 458, scale: 0.869 }}
          gap={14}
          cta="Sign it again"
          onCta={advance}
          ghost="Change the pledge"
          onGhost={() => router.push('/day/morning')}>
          <MonoText v="h1">The pledge still stands.</MonoText>
          <MonoText v="p">A slip doesn’t erase what you decided. Sign it again and keep going.</MonoText>
          <Gap h={6} />
          {/* with no pledge on record the card keeps the words it always fell back to */}
          <PledgeCard pledge={pledge?.body ?? 'The mornings are mine again.'} name={user?.displayName?.split(' ')[0] || 'You'} signed />
        </SosQuestion>
      );
    default:
      return (
        <HeroBoard
          key="begin"
          nav={{ left: 'back', onBack: back, onClose: close }}
          hero="sunrise"
          title="The day is still yours."
          body="One part of it went wrong. Nothing else has to."
          cta="Start again"
          onCta={advance}
        />
      );
  }
}
