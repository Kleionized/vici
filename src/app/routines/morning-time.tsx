import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { CheckinTimeBoard, saveCheckinDays, useCheckinDays } from '@/components/routines/kit';
import { syncCheckinReminders } from '@/lib/reminders';
import { useRoutines, useSaveRoutines, type TimeOfDay } from '@/lib/routines';

/** `Morning Check-in Time` (19B). */
export default function MorningTime() {
  const router = useRouter();
  const routines = useRoutines();
  const save = useSaveRoutines();
  const stored = useCheckinDays('morning');
  // Both stores load from disk a beat after the screen mounts, so the draft
  // stays null until the wheel or a chip is actually touched — until then the
  // board follows whatever the store settles on.
  const [draftTime, setDraftTime] = useState<TimeOfDay | null>(null);
  const [draftDays, setDraftDays] = useState<number[] | null>(null);
  const time = draftTime ?? routines.morning;
  const days = draftDays ?? stored;

  /* The same board serves onboarding and the Settings > Reminders row, and the
     two exits are different: entered from Settings, `Save time` returns there;
     entered from onboarding it carries on to the night board. Without the
     parameter, editing the morning time from Settings dragged the user through
     the onboarding night board and left them on Today. */
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';

  const back = () => (router.canGoBack() ? router.back() : router.replace(fromSettings ? '/(app)/settings' : '/(app)/today'));

  const next = async () => {
    await save({ morning: time });
    await saveCheckinDays('morning', days);
    // the reminders follow the new time and days (a no-op while they are off)
    void syncCheckinReminders();
    if (fromSettings) return back();
    router.push('/routines/night-time');
  };

  return (
    <CheckinTimeBoard
      kind="morning"
      onBack={back}
      time={time}
      onTime={setDraftTime}
      days={days}
      onDays={setDraftDays}
      onSave={() => void next()}
    />
  );
}
