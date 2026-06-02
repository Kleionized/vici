import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Card, Field, ScaleInput, Screen, SectionLabel } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { formatClock } from '@/lib/date';
import { getJSON, removeKey, setJSON } from '@/lib/storage';
import { colors, radius, spacing } from '@/lib/theme';
import type { PrecedingState } from '@/lib/types';

type Phase = 'idle' | 'rate' | 'wait' | 'outcome';

interface UrgeSession {
  phase: Phase;
  intensity: number | null;
  startedAt: number | null;
  durationSec: number;
}

const SESSION_KEY = 'tideline.urge.session';
const DURATIONS = [60, 180, 300];

const HALT: { key: keyof PrecedingState; label: string }[] = [
  { key: 'hungry', label: 'Hungry' },
  { key: 'tired', label: 'Tired' },
  { key: 'lonely', label: 'Lonely' },
  { key: 'bored', label: 'Bored' },
];

export default function Urge() {
  const router = useRouter();
  const createEvent = useCreateEvent();

  const [phase, setPhase] = useState<Phase>('idle');
  const [intensity, setIntensity] = useState<number | null>(null);
  const [durationSec, setDurationSec] = useState(180);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // outcome fields
  const [halt, setHalt] = useState<PrecedingState>({});
  const [trigger, setTrigger] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [learned, setLearned] = useState('');
  const [saving, setSaving] = useState(false);

  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore any in-progress session so backgrounding the app doesn't lose it.
  useEffect(() => {
    (async () => {
      const s = await getJSON<UrgeSession>(SESSION_KEY);
      if (!s) return;
      setIntensity(s.intensity);
      setDurationSec(s.durationSec);
      setStartedAt(s.startedAt);
      if (s.phase === 'wait' && s.startedAt) {
        const elapsed = (Date.now() - s.startedAt) / 1000;
        setPhase(elapsed >= s.durationSec ? 'outcome' : 'wait');
      } else {
        setPhase(s.phase);
      }
    })();
  }, []);

  // Persist session on meaningful change (not while idle/outcome editing).
  useEffect(() => {
    if (phase === 'idle') {
      void removeKey(SESSION_KEY);
      return;
    }
    void setJSON(SESSION_KEY, { phase, intensity, startedAt, durationSec } satisfies UrgeSession);
  }, [phase, intensity, startedAt, durationSec]);

  // Wait-phase timer.
  useEffect(() => {
    if (phase !== 'wait') {
      if (tick.current) clearInterval(tick.current);
      return;
    }
    tick.current = setInterval(() => setNow(Date.now()), 500);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [phase]);

  const elapsed = phase === 'wait' && startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const remaining = Math.max(0, durationSec - elapsed);
  useEffect(() => {
    if (phase === 'wait' && remaining === 0) setPhase('outcome');
  }, [phase, remaining]);

  function beginWait() {
    setStartedAt(Date.now());
    setNow(Date.now());
    setPhase('wait');
  }

  function reset() {
    setPhase('idle');
    setIntensity(null);
    setStartedAt(null);
    setHalt({});
    setTrigger('');
    setWhatHelped('');
    setLearned('');
  }

  async function logOutcome(type: 'urge_rode_out' | 'urge_acted_on') {
    setSaving(true);
    const precedingState: PrecedingState = { ...halt };
    await createEvent({
      type,
      trigger: trigger.trim() || undefined,
      precedingState: Object.keys(precedingState).length ? precedingState : undefined,
      whatHelped: whatHelped.trim() || undefined,
      lesson: learned.trim() || undefined,
    });
    await removeKey(SESSION_KEY);
    setSaving(false);
    reset();
    router.replace('/(app)/log');
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="label">Ride it out</AppText>
        <AppText variant="display">
          {phase === 'wait' ? 'Let the wave pass' : phase === 'outcome' ? 'What happened?' : 'An urge is a wave'}
        </AppText>
      </View>

      {phase === 'idle' ? (
        <View style={{ gap: spacing.lg }}>
          <AppText variant="muted">
            Urges crest and fade if you don&apos;t fight them or feed them. Take a few minutes and let this
            one move through. Whatever happens next is information, not a verdict.
          </AppText>
          <Button label="I'm having an urge" onPress={() => setPhase('rate')} />
        </View>
      ) : null}

      {phase === 'rate' ? (
        <View style={{ gap: spacing.xl }}>
          <View style={{ gap: spacing.sm }}>
            <SectionLabel>How strong is it right now?</SectionLabel>
            <ScaleInput min={1} max={10} value={intensity} onChange={setIntensity} leftLabel="Faint" rightLabel="Intense" />
          </View>
          <View style={{ gap: spacing.sm }}>
            <SectionLabel>How long do you want to ride?</SectionLabel>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {DURATIONS.map((d) => {
                const on = durationSec === d;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setDurationSec(d)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: spacing.md,
                      borderRadius: radius.md,
                      backgroundColor: on ? colors.accent : colors.surfaceAlt,
                      borderWidth: 1,
                      borderColor: on ? colors.accent : colors.border,
                    }}>
                    <AppText color={on ? colors.accentText : colors.text} weightOverride="600">
                      {d / 60} min
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Button label="Begin" onPress={beginWait} disabled={intensity == null} />
          <Pressable onPress={reset} hitSlop={8}>
            <AppText variant="soft" center>
              Cancel
            </AppText>
          </Pressable>
        </View>
      ) : null}

      {phase === 'wait' ? (
        <View style={{ gap: spacing.xl, alignItems: 'center', paddingVertical: spacing.xl }}>
          <AppText variant="display">{formatClock(remaining)}</AppText>
          <BreathingPrompt elapsed={elapsed} />
          <AppText variant="muted" center>
            Notice where you feel it in your body. You don&apos;t have to do anything about it. Just breathe,
            and let it be there until it isn&apos;t.
          </AppText>
          <Button label="I'm through it" variant="secondary" onPress={() => setPhase('outcome')} />
        </View>
      ) : null}

      {phase === 'outcome' ? (
        <View style={{ gap: spacing.lg }}>
          <AppText variant="muted">
            However it went, this is just data you can learn from. Add whatever feels useful — all of it is
            optional.
          </AppText>

          <View style={{ gap: spacing.sm }}>
            <SectionLabel>What was going on? (HALT)</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {HALT.map((h) => {
                const on = !!halt[h.key];
                return (
                  <Pressable
                    key={h.key}
                    onPress={() => setHalt((prev) => ({ ...prev, [h.key]: !prev[h.key] }))}
                    style={{
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm + 2,
                      borderRadius: radius.pill,
                      backgroundColor: on ? colors.accent : colors.surfaceAlt,
                      borderWidth: 1,
                      borderColor: on ? colors.accent : colors.border,
                    }}>
                    <AppText color={on ? colors.accentText : colors.text}>{h.label}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Field label="What set it off? (optional)" value={trigger} onChangeText={setTrigger} placeholder="A place, feeling, time of day…" />
          <Field label="What helped, if anything?" value={whatHelped} onChangeText={setWhatHelped} placeholder="What you did, or what you noticed" />
          <Field label="What did this teach you?" value={learned} onChangeText={setLearned} placeholder="Anything you want to remember" multiline />

          <Button label="I rode it out" onPress={() => logOutcome('urge_rode_out')} loading={saving} />
          <Button label="I acted on it" variant="secondary" onPress={() => logOutcome('urge_acted_on')} loading={saving} />
          <Pressable onPress={reset} hitSlop={8}>
            <AppText variant="soft" center>
              Discard
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

function BreathingPrompt({ elapsed }: { elapsed: number }) {
  // 16s box-breath cycle: in (4) · hold (4) · out (4) · hold (4)
  const phaseInCycle = elapsed % 16;
  const label =
    phaseInCycle < 4 ? 'Breathe in…' : phaseInCycle < 8 ? 'Hold…' : phaseInCycle < 12 ? 'Breathe out…' : 'Hold…';
  return (
    <View
      style={{
        width: 160,
        height: 160,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText variant="subtitle">{label}</AppText>
    </View>
  );
}
