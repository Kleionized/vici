import { useRouter } from 'expo-router';
import { useState } from 'react';

import { KK_ALBUM, kkMetal, kkStanding } from '@/components/keepsakes/Medallion';
import { ChipsStep, DoneBoard, FlowNav, OptionsStep, useWhen, WhenStep } from '@/components/logflow';
import { Hero, MonoText, IntensityScale, PrimaryButton, ScaleReading, Screen } from '@/components/mono';
import { bandToSeverity, INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { useCreateEvent, useEvents } from '@/lib/backend';
import { capitalise, joinLower, numberWords } from '@/lib/format';
import { setJSON } from '@/lib/storage';
import type { EventType } from '@/lib/types';

/**
 * 91D–91H · Urge log — how strong, what set it off, what you did, when, logged.
 *
 * Every step is a board on the mono kit (`src/components/logflow`); the lapse
 * flow (`/lapse`) is the same steps one shorter.
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
  // The scale has no empty state on the canvas; 91D inks the fourth bar, Intense.
  const [intensity, setIntensity] = useState(3);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [outcome, setOutcome] = useState(0);
  const [saving, setSaving] = useState(false);
  const [ridden, setRidden] = useState<number | null>(null);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));

  async function save() {
    setSaving(true);
    const item = OUTCOMES[outcome];
    // counted before the write, so the line does not wait on the log to refresh
    const before = (events ?? []).filter((e) => e.type === 'urge_rode_out').length;
    await createEvent({
      type: item.type,
      severity: bandToSeverity(intensity),
      trigger: triggers.length ? triggers.join(' · ') : undefined,
      whatHelped: item.slip ? undefined : item.label,
      createdAt: when.at,
    });
    if (item.slip) await setJSON('tideline.letter.pending', Date.now());
    else await setJSON('tideline.post.backondeck.pending', Date.now());
    setRidden(item.slip ? null : before + 1);
    setSaving(false);
    setStep(4);
  }

  if (step === 4) {
    return (
      <DoneBoard
        title="Urge logged."
        // a slip rode nothing out, so it has no count to say (undrawn: logs Q7)
        body={ridden != null ? riddenLine(ridden) : undefined}
        rows={[
          { label: 'Intensity', value: INTENSITY_BANDS[intensity].label },
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
          <ScaleReading word={INTENSITY_BANDS[intensity].label} line={INTENSITY_BANDS[intensity].note} />
        </>
      ) : null}
      {step === 1 ? <ChipsStep title="What set it off?" value={triggers} onChange={setTriggers} /> : null}
      {step === 2 ? (
        <OptionsStep title="What did you do?" options={OUTCOMES.map((o) => o.label)} value={OUTCOMES[outcome].label} onChange={(label) => setOutcome(OUTCOMES.findIndex((o) => o.label === label))} />
      ) : null}
      {step === 3 ? <WhenStep title="When was it?" when={when} /> : null}

      {step === 0 || step === 2 ? <PrimaryButton label="Continue" onPress={() => setStep(step + 1)} /> : null}
      {step === 1 ? <PrimaryButton label="Continue" disabled={triggers.length === 0} onPress={() => setStep(2)} /> : null}
      {step === 3 ? <PrimaryButton label={saving ? 'Logging…' : 'Log the urge'} disabled={saving} onPress={() => void save()} /> : null}
    </Screen>
  );
}
