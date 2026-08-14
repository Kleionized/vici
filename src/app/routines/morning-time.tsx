import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { CheckinPicker, RoutineCTA, RoutineShell, saveCheckinDays, useCheckinDays } from '@/components/routines/kit';
import { useRoutines, useSaveRoutines, type TimeOfDay } from '@/lib/routines';

/** 108 · Morning check-in time. */
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

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const toggle = (day: number) => setDraftDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b));

  const next = async () => {
    await save({ morning: time });
    await saveCheckinDays('morning', days);
    router.push('/routines/night-time');
  };

  return (
    <>
      <StatusBar style="dark" />
      <RoutineShell
        onBack={back}
        title="When should the morning check-in come?"
        note="Twenty seconds, first thing — you can change this any time."
        cta={<RoutineCTA label="Save time" onPress={() => void next()} />}>
        <CheckinPicker time={time} onTime={setDraftTime} days={days} onToggleDay={toggle} />
      </RoutineShell>
    </>
  );
}
