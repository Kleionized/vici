import { useRouter } from 'expo-router';
import { useState } from 'react';

import { KK_ALBUM, kkMetal, kkStanding } from '@/components/keepsakes/Medallion';
import { ChipsStep, DoneBoard, FlowNav, OptionsStep, useWhen, WhenStep } from '@/components/logflow';
import { Hero, MonoText, IntensityScale, PrimaryButton, ScaleReading, Screen } from '@/components/mono';
import { bandToSeverity, INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { UnsavedBoard, useBackgroundWrite, WAITING_LINE } from '@/components/urge/saving';
import { useCreateEvent, useEvents } from '@/lib/backend';
import { isSurfed } from '@/lib/day';
import { capitalise, joinLower, numberWords } from '@/lib/format';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';
import type { EventType } from '@/lib/types';

/**
 * 91D–91H · Urge log — how strong, what set it off, what you did, when, logged.
 *
 * Every step is a board on the mono kit (`src/components/logflow`); the lapse
 * flow (`/lapse`) is the same steps one shorter.
 *
 * Nothing is answered for the user (F3, D463): no bar is lit and no outcome
 * chosen until they pick one. The strength is optional — Continue with none
 * picked files no strength; the outcome decides what the entry is (ridden out
 * or a slip), so Continue waits for it.
 *
 * Logging never waits on the network (B10, D465): the logged board shows at
 * once and the write runs behind it; a refused write gets its own board.
 */

const OUTCOMES: { label: string; slip?: boolean; type: EventType }[] = [
  { label: 'Rode it out', type: 'urge_rode_out' },
  { label: 'Surfed with the timer', type: 'urge_rode_out' },
  { label: 'Distracted myself', type: 'urge_rode_out' },
  { label: 'Reached out', type: 'urge_rode_out' },
  { label: 'I slipped', slip: true, type: 'urge_acted_on' },
];

const VICI = KK_ALBUM.find((face) => face.key === 'vici')!;

/**
 * 91H's line: `Twenty-three ridden out. Two to Bronze.` — the urges ridden out
 * so far (the Vici medallion's count, this one included) and how many more to
 * its next tier. Past the last rung there is no next tier, so only the count
 * is said.
 */
function riddenLine(count: number): string {
  const standing = kkStanding(VICI, count);
  const next = VICI.steps[standing];
  const head = `${numberWords(count, { capital: true })} ridden out.`;
  if (next == null) return head;
  return `${head} ${numberWords(next - count, { capital: true })} to ${capitalise(kkMetal(VICI, standing + 1))}.`;
}

export default function UrgeLog() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const events = useEvents();
  const when = useWhen();
  const [step, setStep] = useState(0);
  // The frame inks the fourth bar (91D); nothing is picked for the user here.
  const [intensity, setIntensity] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<number | null>(null);
  const [ridden, setRidden] = useState<number | null>(null);
  const write = useBackgroundWrite('urge');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));

  function save() {
    if (outcome == null) return;
    const item = OUTCOMES[outcome];
    // counted before the write, so the line does not wait on the log to refresh
    const before = (events ?? []).filter(isSurfed).length;
    const input = {
      type: item.type,
      severity: intensity != null ? bandToSeverity(intensity) : undefined,
      trigger: triggers.length ? triggers.join(' · ') : undefined,
      whatHelped: item.slip ? undefined : item.label,
      createdAt: when.at,
    };
    write.run(async () => {
      await createEvent(input);
      if (item.slip) await writeAccountJSON(ACCOUNT_KEYS.letterPending, Date.now());
      else await writeAccountJSON(ACCOUNT_KEYS.postPending, Date.now());
    });
    setRidden(item.slip ? null : before + 1);
    setStep(4);
  }

  if (step === 4 && write.state === 'failed') {
    return <UnsavedBoard what="urge" onRetry={write.retry} onLater={close} onClose={close} />;
  }

  if (step === 4 && outcome != null) {
    return (
      <DoneBoard
        title="Urge logged."
        // a slip rode nothing out, so it has no count to say (undrawn: logs Q7)
        body={write.state === 'slow' ? WAITING_LINE : ridden != null ? riddenLine(ridden) : undefined}
        rows={[
          { label: 'Intensity', value: intensity != null ? INTENSITY_BANDS[intensity].label : '—' },
          { label: 'Set off by', value: triggers.length ? joinLower(triggers) : '—' },
          { label: 'What I did', value: OUTCOMES[outcome].label },
        ]}
        cta="Done"
        onClose={close}
      />
    );
  }

  return (
    <Screen>
      {/* each question's illustration sits between the stack and the pill and is
          painted first, under both; a phone too short for it drops it (D320) */}
      {step === 0 ? <Hero id="thermometer" top={506} scale={1.062} controls={106} /> : null}
      {step === 1 ? <Hero id="match" top={506} controls={106} /> : null}
      {step === 2 ? <Hero id="clipboard" top={506} scale={0.989} controls={106} /> : null}
      <FlowNav step={step + 1} total={4} onBack={back} onClose={close} />

      {step === 0 ? (
        <>
          <MonoText v="h1" style={{ position: 'absolute', left: 24, right: 24, top: 136 }}>
            How strong was the urge?
          </MonoText>
          <IntensityScale value={intensity} onChange={setIntensity} a11yLabels={INTENSITY_BANDS.map((b) => b.label)} />
          {intensity != null ? <ScaleReading word={INTENSITY_BANDS[intensity].label} line={INTENSITY_BANDS[intensity].note} /> : null}
        </>
      ) : null}
      {step === 1 ? <ChipsStep title="What set it off?" value={triggers} onChange={setTriggers} /> : null}
      {step === 2 ? (
        <OptionsStep
          title="What did you do?"
          options={OUTCOMES.map((o) => o.label)}
          // no key matches '' — nothing is lit until the user picks
          value={outcome != null ? OUTCOMES[outcome].label : ''}
          onChange={(label) => setOutcome(OUTCOMES.findIndex((o) => o.label === label))}
        />
      ) : null}
      {step === 3 ? <WhenStep title="When was it?" when={when} /> : null}

      {step === 0 ? <PrimaryButton label="Continue" onPress={() => setStep(1)} /> : null}
      {step === 1 ? <PrimaryButton label="Continue" disabled={triggers.length === 0} onPress={() => setStep(2)} /> : null}
      {step === 2 ? <PrimaryButton label="Continue" disabled={outcome == null} onPress={() => setStep(3)} /> : null}
      {step === 3 ? <PrimaryButton label="Log the urge" disabled={outcome == null} onPress={save} /> : null}
    </Screen>
  );
}
