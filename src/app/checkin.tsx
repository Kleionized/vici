import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { CheckinFlow, checkinCopy, isMorningCheckin, type CheckinResult } from '@/components/MoodLogger';
import { LoadingView } from '@/components/mono';
import { useCheckins, useTodayCheckin, useUpsertCheckin } from '@/lib/backend';
import { todayKey } from '@/lib/date';

/**
 * The check-in, lifted out of the night flow (no frame draws this route; it is
 * Night 1 Mood, Checkin Emotions and Checkin Reasons on a three-step rail).
 *
 * How the head is, what it felt like, what fed it — the same three boards the
 * evening flow draws, on their own route so a mood can be logged on the spot.
 *
 * There is no morning register here any more. `UI Final 1` draws the morning as
 * eight frames of its own — a cover, the task check, the ledger, a feeling dial,
 * an energy dial, the pledge and the close — and none of them is an orb, an
 * emotions board or an action card, so `?part=morning` hands over to the flow
 * that is actually drawn (`DECISIONS.md` D033).
 */

export default function CheckIn() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part?: string }>();
  const today = useTodayCheckin();
  const checkins = useCheckins();
  const upsert = useUpsertCheckin();
  const copy = checkinCopy(part);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Fixed at mount so a check-in that straddles midnight keeps writing to the
  // day it was opened on rather than quietly moving under the user.
  const [openedOn] = useState(todayKey);

  // Saved once, and the screen closes without waiting on the write (D499).
  const saving = useRef(false);
  function save(result: CheckinResult) {
    if (saving.current) return;
    saving.current = true;
    // The upsert merges, so each write carries only what it actually knows.
    void upsert({
      date: openedOn,
      mood: result.mood,
      emotions: result.emotions.length ? result.emotions : undefined,
      reasons: result.reasons.length ? result.reasons : undefined,
    }).catch((error: unknown) => {
      if (__DEV__) console.warn('checkin was not saved', error);
    });
    close();
  }

  if (isMorningCheckin(part)) return <Redirect href="/day/morning" />;

  // Held until the rows have loaded: the flow seeds its picks from them once,
  // at mount.
  if (today === undefined || checkins === undefined) return <LoadingView onClose={close} />;

  return (
    <CheckinFlow
      head={copy.head}
      feel={copy.feel}
      initialMood={today?.mood}
      initialEmotions={today?.emotions}
      initialReasons={today?.reasons}
      onDone={save}
      onExit={close}
    />
  );
}
