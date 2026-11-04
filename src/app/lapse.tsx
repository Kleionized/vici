import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { ChipsStep, DoneBoard, FlowNav, useWhen, WhenStep } from '@/components/logflow';
import { Hero, PrimaryButton, Screen } from '@/components/mono';
import { useCheckins, useCreateEvent } from '@/lib/backend';
import { todayKey } from '@/lib/date';
import { dayPartTime, joinLower } from '@/lib/format';
import { setJSON } from '@/lib/storage';

/**
 * 90B–90D · The lapse, in the log's own voice — when it happened, what fed it,
 * and a card saying it is on the record. No red, no reset (invariant #2): the
 * same steps the urge log uses, one fewer.
 *
 * The rail is the eight dashes for step 1 and 2 of 3; the logged board drops
 * them and keeps only the ✕, as 90D draws it.
 */

export default function Lapse() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const checkins = useCheckins();
  const when = useWhen();
  const [step, setStep] = useState(0);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  /** The re-entry guard: a second tap lands before the disabled pill has rendered. */
  const busy = useRef(false);
  // the day's action, filed under the flow's own clock's date (the one the summary reads against)
  const changed = (checkins ?? []).find((c) => c.date === todayKey(when.now))?.dailyAction;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));

  async function save() {
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    try {
      // A lapse is one neutral event: when it landed and what fed it. Nothing
      // else is invented for it — the log reads it back with the same words.
      // `when.at` is never later than the flow's clock (`useWhen` holds it there).
      await createEvent({ type: 'lapse', trigger: triggers.length ? triggers.join(' · ') : undefined, createdAt: Math.min(when.at, Date.now()) });
    } catch (error) {
      // nothing was written: the pill comes back so it can be tried again, rather than sticking on "Logging…"
      if (__DEV__) console.warn('lapse was not written', error);
      busy.current = false;
      setSaving(false);
      return;
    }
    // The sealed letter arrives over Today the launch after a slip is logged.
    await setJSON('tideline.letter.pending', Date.now());
    setSaving(false);
    setStep(2);
  }

  if (step === 2) {
    return (
      <DoneBoard
        title="Slip logged."
        body="Stopped, logged, and one thing changed for next time."
        rows={[
          // 90D reads the moment as a day part alone — `Last night` — and the
          // date where no word fits (format.ts `dayPartTime`)
          { label: 'When', value: dayPartTime(when.at, when.now, { withTime: false }) },
          { label: 'Set off by', value: triggers.length ? joinLower(triggers) : '—' },
          // the flow asks two questions, so `Changed` cannot come from it: the one
          // change the app holds is the day's action, named on the night check-in
          // and carried on today's card — what the frame's own line describes
          { label: 'Changed', value: changed ?? '—' },
        ]}
        cta="Continue"
        onClose={close}
      />
    );
  }

  return (
    <Screen>
      {step === 1 ? <Hero id="match" top={506} controls={106} /> : null}
      <FlowNav step={step + 1} total={3} onBack={back} onClose={close} />
      {step === 0 ? <WhenStep title="When did it happen?" when={when} /> : null}
      {step === 1 ? <ChipsStep title="What fed it?" value={triggers} onChange={setTriggers} /> : null}
      {step === 0 ? <PrimaryButton label="Continue" onPress={() => setStep(1)} /> : null}
      {step === 1 ? (
        <PrimaryButton label={saving ? 'Logging…' : 'Continue'} disabled={saving || triggers.length === 0} onPress={() => void save()} />
      ) : null}
    </Screen>
  );
}
