import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { CheckinPicker, RoutineCTA, RoutineShell, saveCheckinDays, useCheckinDays } from '@/components/routines/kit';
import { useRoutines, useSaveRoutines, type TimeOfDay } from '@/lib/routines';

/** 109 · Nightly check-in time — the last board before Today. */
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
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const toggle = (day: number) => setDraftDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b));

  const done = async () => {
    await save({ night: time });
    await saveCheckinDays('night', days);
    router.replace('/(app)/today');
  };

  return (
    <>
      <StatusBar style="dark" />
      <RoutineShell
        backLabel={from === 'settings' ? 'Settings' : 'Back'}
        onBack={back}
        title="When should the nightly check-in come?"
        note="Set it for the start of your riskiest hours. You can change this any time."
        cta={<RoutineCTA label="Save time" onPress={() => void done()} />}>
        <CheckinPicker time={time} onTime={setDraftTime} days={days} onToggleDay={toggle} />
      </RoutineShell>
    </>
  );
}
