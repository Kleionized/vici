import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ChipsStep, DoneBoard, FlowNav, useWhen, WhenStep } from '@/components/logflow';
import { Hero, PrimaryButton, Screen } from '@/components/mono';
import { UnsavedBoard, useBackgroundWrite, WAITING_LINE } from '@/components/urge/saving';
import { useCreateEvent } from '@/lib/backend';
import { dayPartTime, joinLower } from '@/lib/format';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';

/**
 * 90B–90D · The lapse, in the log's own voice — when it happened, what fed it,
 * and a card saying it is on the record. No red, no reset (invariant #2): the
 * same steps the urge log uses, one fewer.
 *
 * The rail is the eight dashes for step 1 and 2 of 3; the logged board drops
 * them and keeps only the ✕, as 90D draws it.
 *
 * The flow asks two things, so the logged board says two things back. 90D's
 * "and one thing changed for next time" and its `Changed` row (which printed
 * the day's lesson task) claimed an answer nobody gave (P4, D469).
 *
 * Logging never waits on the network (B10, D465): the board shows at once and
 * the write runs behind it; a refused write gets its own board.
 */

export default function Lapse() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const when = useWhen();
  const [step, setStep] = useState(0);
  const [triggers, setTriggers] = useState<string[]>([]);
  const write = useBackgroundWrite('lapse');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));

  function save() {
    // A lapse is one neutral event: when it landed and what fed it. Nothing
    // else is invented for it — the log reads it back with the same words.
    const trigger = triggers.length ? triggers.join(' · ') : undefined;
    const at = when.at;
    write.run(async () => {
      await createEvent({ type: 'lapse', trigger, createdAt: at });
      // The sealed letter arrives over Today the launch after a slip is logged.
      await writeAccountJSON(ACCOUNT_KEYS.letterPending, Date.now());
    });
    setStep(2);
  }

  if (step === 2 && write.state === 'failed') {
    return <UnsavedBoard what="lapse" onRetry={write.retry} onLater={close} onClose={close} />;
  }

  if (step === 2) {
    return (
      <DoneBoard
        title="Slip logged."
        body={write.state === 'slow' ? WAITING_LINE : 'Stopped and logged.'}
        rows={[
          // 90D reads the moment as a day part alone — `Last night` — and the
          // date where no word fits (format.ts `dayPartTime`)
          { label: 'When', value: dayPartTime(when.at, when.now, { withTime: false }) },
          { label: 'Set off by', value: triggers.length ? joinLower(triggers) : '—' },
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
      {step === 1 ? <PrimaryButton label="Continue" disabled={triggers.length === 0} onPress={save} /> : null}
    </Screen>
  );
}
