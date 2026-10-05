import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { CheckinTimeBoard, saveCheckinDays, useCheckinDays } from '@/components/routines/kit';
import { useRoutines, useSaveRoutines, type TimeOfDay } from '@/lib/routines';

/**
 * `Nightly Check-in Time` (19C) — the last board before Today. With
 * `?from=settings` it is `Settings Check-in Time` (92B), which this drop draws
 * byte-identical to 19C: the old "Settings" back label and the reassurance
 * line under the chips are gone, and only the exit differs.
 */
export default function NightTime() {
  const router = useRouter();
  const routines = useRoutines();
  const save = useSaveRoutines();
  const stored = useCheckinDays('night');
  // Same as the morning board: no draft until something is touched, so a late
  // read from disk still lands on the wheel.
  const [draftTime, setDraftTime] = useState<TimeOfDay | null>(null);
  const [draftDays, setDraftDays] = useState<number[] | null>(null);
  const time = draftTime ?? routines.night;
  const days = draftDays ?? stored;

  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';
  const back = () => (router.canGoBack() ? router.back() : router.replace(fromSettings ? '/(app)/settings' : '/(app)/today'));

  const done = async () => {
    await save({ night: time });
    await saveCheckinDays('night', days);
    /* Onboarding ends here, so that path replaces the stack with Today. The
       Settings path must not: 92B is a Settings sub-page and every one of its
       siblings returns to Settings, and a `replace` here threw the whole stack
       away so Back could not go home either. */
    if (fromSettings) return back();
    router.replace('/(app)/today');
  };

  return (
    <CheckinTimeBoard
      kind="night"
      onBack={back}
      time={time}
      onTime={setDraftTime}
      days={days}
      onDays={setDraftDays}
      onSave={() => void done()}
    />
  );
}
