import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { dayAction, nightAction } from '@/components/day/kit';
import { CheckinFlow, checkinCopy, isMorningCheckin, type CheckinResult } from '@/components/MoodLogger';
import { LoadingView } from '@/components/ui';
import { useCheckins, useCurrentUser, useTodayCheckin, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';

/**
 * 156, 157, 160 and 158–159 · the daily check-in, in its two registers.
 *
 * Any time of day: how the head is, what it felt like, what fed it. Before
 * noon the last question is replaced by the day's one action — whether
 * yesterday's happened, and what today's is. The steps live in
 * `components/MoodLogger` so the sheet and this route draw the same pixels;
 * here is only the wiring, and which day each answer belongs to.
 */

/** Day one is the day you signed up, not the day after. */
function dayNumber(createdAt?: number): number {
  if (!createdAt) return 1;
  return Math.max(1, Math.floor((Date.now() - createdAt) / 86_400_000) + 1);
}

function priorDateKey(): string {
  return toDateKey(new Date(Date.now() - 86_400_000));
}

export default function CheckIn() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part?: string }>();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const today = useTodayCheckin();
  const upsert = useUpsertCheckin();
  const copy = checkinCopy(part);
  const morning = isMorningCheckin(part);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Fixed at mount: a check-in that straddles midnight should keep writing to
  // the day it was opened on rather than quietly move under the user.
  const [yesterdayKey] = useState(priorDateKey);

  async function save(result: CheckinResult) {
    // The upsert merges, so each write carries only what it actually knows.
    await upsert({
      date: todayKey(),
      mood: result.mood,
      emotions: result.emotions.length ? result.emotions : undefined,
      reasons: result.reasons.length ? result.reasons : undefined,
      dailyAction: result.action,
    });
    // The answer about yesterday's action belongs to yesterday's row.
    if (result.yesterdayDone !== undefined) {
      await upsert({ date: yesterdayKey, dailyActionDone: result.yesterdayDone }).catch(() => {});
    }
    close();
  }

  // Held until the rows have loaded: the flow seeds its rail, its picks and
  // both actions from them once, at mount.
  if (today === undefined || checkins === undefined) return <LoadingView />;

  const day = dayNumber(user?.createdAt);
  const yesterday = checkins.find((c) => c.date === yesterdayKey);

  // An action is stored on the day it is for, so today's may already be set —
  // last night's check-in names it. The fallbacks stand in for a night that was
  // never checked in on: a day's action is named the night before, so the row
  // for day D would have taken `nightAction(D - 1)`.
  const yesterdayAction = yesterday?.dailyAction ?? nightAction(day - 2);
  const todayAction = today?.dailyAction ?? dayAction(day);

  return (
    <>
      <StatusBar style="dark" />
      <CheckinFlow
        head={copy.head}
        feel={copy.feel}
        morning={morning}
        initialMood={today?.mood}
        initialEmotions={today?.emotions}
        initialReasons={today?.reasons}
        yesterdayAction={yesterdayAction}
        todayAction={todayAction}
        onDone={(result) => void save(result)}
        onExit={close}
      />
    </>
  );
}
