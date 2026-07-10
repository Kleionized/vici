import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText, bandToSeverity, IntensityBands, severityToBand } from '@/components/ui';
import {
  BrightButton,
  CLAY,
  FadeIn,
  HUE,
  INK_DARK,
  JourneyPage,
  NightIllustration,
  NightSky,
  SAGE,
  SEA,
  Stars,
  TopChrome,
  UrgeWave,
  WAVE_ART,
} from '@/components/urge';
import { useCreateEvent } from '@/lib/backend';
import { colors, fonts } from '@/lib/theme';
import {
  clearUrgeSession,
  loadUrgeSession,
  newUrgeSession,
  saveUrgeSession,
  SEVERE_THRESHOLD,
  SUBSIDING_THRESHOLD,
  type UrgeSession,
} from '@/lib/urgeSession';

const TEXT = colors.text;
const SUB = colors.textMuted;
const CHIP_BG = colors.surface;
const CHIP_LINE = 'transparent';

// ── severity model ───────────────────────────────────────────────────────────
const SEV_WORDS: [number, string, string][] = [
  // [min severity, word, line]
  [1, 'A flicker', 'There — but quiet.'],
  [3, 'Pulling', 'You can feel the tug.'],
  [5, 'Strong', 'It has your attention.'],
  [7, 'Very strong', 'Hard to think past it.'],
  [9, 'Overwhelming', 'It feels like a command.'],
];
const sevWord = (s: number) => SEV_WORDS.reduce((acc, w) => (s >= w[0] ? w : acc), SEV_WORDS[0]);
const sevTint = (s: number) => (s >= SEVERE_THRESHOLD ? CLAY : s >= SUBSIDING_THRESHOLD ? SEA : SAGE);

// ── minor-path content: trigger → tailored fixes ─────────────────────────────
const TRIGGERS = ['Late at night', 'Stress or anxiety', 'Boredom', 'Feeling low', 'Loneliness', 'Endless scrolling', 'Tired & depleted', 'After a win'];

const FIXES: Record<string, { line: string; steps: string[] }> = {
  'Late at night': { line: 'Late-night urges feed on a day that hasn’t ended.', steps: ['Lights down, screen out of reach', 'Brush your teeth — close the day', 'Get into bed properly'] },
  'Stress or anxiety': { line: 'The urge is offering relief. Take the relief without it.', steps: ['Three slow breaths, longer out than in', 'Write the worry down for tomorrow', 'Drop your shoulders, unclench your jaw'] },
  Boredom: { line: 'Boredom wants stimulation — any kind will do.', steps: ['Pick one tiny task and start it', 'Step outside for two minutes of air', 'Put one song on and move'] },
  'Feeling low': { line: 'Be gentle — the urge is trying to medicate a feeling.', steps: ['Name the feeling out loud', 'A warm shower or a warm drink', 'Text someone who gets it'] },
  Loneliness: { line: 'The urge is a stand-in for contact. Get the real thing.', steps: ['Message a real person, right now', 'Go where people are — a shop, a café', 'Send a voice note instead of a text'] },
  'Endless scrolling': { line: 'The feed primed this. Break the chain at the screen.', steps: ['Close the feed — all the way', 'Phone on a shelf in another room', 'Do the next small physical thing'] },
  'Tired & depleted': { line: 'Depleted is when it strikes hardest. Refuel instead.', steps: ['A full glass of water', 'A 20-minute timer rest, eyes closed', 'Calling the day early is a win'] },
  'After a win': { line: 'A win deserves a better reward than this.', steps: ['Say the win out loud', 'Tell someone about it', 'Take it for a walk'] },
};

const HELPED = ['Breathing', 'Left the room', 'Went outside', 'Phone away', 'Talked to someone', 'It just passed'];

type Step = 'rate' | 'why' | 'fix' | 'surf' | 'remove' | 'breathe' | 'closephone' | 'away' | 'rerate' | 'stillstrong' | 'outcome' | 'done';

/**
 * The urge flow, branched by severity:
 *  - rate it first (slider);
 *  - minor → what's behind it → tailored fixes → optional breathing;
 *  - severe → get out of the room → three slow breaths → put the phone down →
 *    re-rate on every reopen (counted) until it subsides;
 *  - only once it's subsiding: what happened → one event per urge, with peak
 *    severity + reopen count. Reopening within ~20 min resumes the same urge.
 */
export default function Urge() {
  const router = useRouter();
  const createEvent = useCreateEvent();

  const [step, setStep] = useState<Step | null>(null); // null until the session loads
  const [session, setSession] = useState<UrgeSession | null>(null);
  const [resumed, setResumed] = useState(false);
  const [trigger, setTrigger] = useState<string | null>(null);
  const [helped, setHelped] = useState<string[]>([]);
  const saved = useRef(false);

  const stepRef = useRef<Step | null>(null);
  stepRef.current = step;
  const sessionRef = useRef<UrgeSession | null>(null);
  sessionRef.current = session;

  // Resume the same urge if we're inside the 20-minute window; else start fresh.
  useEffect(() => {
    (async () => {
      const existing = await loadUrgeSession();
      if (existing) {
        const s: UrgeSession = { ...existing, reopens: existing.phase === 'away' ? existing.reopens + 1 : existing.reopens, phase: 'active' };
        setSession(s);
        setTrigger(s.trigger ?? null);
        setResumed(true);
        await saveUrgeSession(s);
        setStep('rerate');
      } else {
        setStep('rate');
      }
    })();
  }, []);

  // Coming back to the foreground while "away" = a reopen during the same urge.
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state !== 'active') return;
      const s = sessionRef.current;
      if (!s || stepRef.current !== 'away') return;
      const next: UrgeSession = { ...s, reopens: s.reopens + 1, phase: 'active' };
      setSession(next);
      await saveUrgeSession(next);
      setResumed(true);
      setStep('rerate');
    });
    return () => sub.remove();
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  async function update(partial: Partial<UrgeSession>) {
    const s = sessionRef.current;
    if (!s) return;
    const next = { ...s, ...partial };
    setSession(next);
    await saveUrgeSession(next);
  }

  async function startWithSeverity(sev: number) {
    const s = newUrgeSession(sev);
    setSession(s);
    await saveUrgeSession(s);
    setStep(sev >= SEVERE_THRESHOLD ? 'remove' : 'why');
  }

  async function reRated(sev: number) {
    const s = sessionRef.current;
    if (!s) return;
    await update({ severity: sev, peakSeverity: Math.max(s.peakSeverity, sev) });
    setStep(sev < SUBSIDING_THRESHOLD ? 'outcome' : 'stillstrong');
  }

  async function goAway() {
    await update({ phase: 'away' });
    setStep('away');
  }

  async function resolve(type: 'urge_rode_out' | 'urge_acted_on') {
    const s = sessionRef.current;
    if (!saved.current) {
      saved.current = true;
      await createEvent({
        type,
        severity: s?.peakSeverity,
        reopens: s?.reopens,
        trigger: trigger ?? undefined,
        whatHelped: helped.length ? helped.join(', ') : undefined,
      }).catch(() => {});
      await clearUrgeSession();
    }
    if (type === 'urge_acted_on') {
      router.replace('/relapse');
      return;
    }
    setStep('done');
  }

  if (!step) return <View style={{ flex: 1, backgroundColor: INK_DARK }} />;

  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <StatusBar style="dark" />

      {step === 'rate' ? (
        <RateScreen
          headline={'How strong is\nthe urge?'}
          initial={5}
          onBack={close}
          backKind="close"
          cta="Continue"
          onNext={startWithSeverity}
          footer={
            <Pressable onPress={() => router.replace('/relapse')} hitSlop={8} style={{ paddingVertical: 4 }}>
              <AppText center weightOverride="600" style={{ fontSize: 14.5, color: colors.textSoft }}>
                I already slipped — start the reset
              </AppText>
            </Pressable>
          }
        />
      ) : null}

      {step === 'why' ? (
        <ChipScreen
          hue={HUE.sea}
          tintFn={SEA}
          onBack={() => setStep('rate')}
          headline="What's behind it right now?"
          sub="Name the trigger — it loosens its grip."
          options={TRIGGERS}
          selected={trigger ? [trigger] : []}
          onPick={async (t) => {
            setTrigger(t);
            await update({ trigger: t });
            setStep('fix');
          }}
        />
      ) : null}

      {step === 'fix' && trigger ? (
        <FixScreen
          trigger={trigger}
          onBack={() => setStep('why')}
          onBreathe={() => setStep('surf')}
          onSteady={() => setStep('outcome')}
        />
      ) : null}

      {step === 'surf' ? <SurfScreen seconds={180} doneLabel="It passed — I'm through it" onBack={() => setStep('fix')} onDone={() => setStep('outcome')} /> : null}

      {step === 'remove' ? (
        <JourneyPage
          tint={CLAY}
          hue={HUE.clay}
          back="back"
          onBack={() => setStep('rate')}
          label="Right now"
          headline="Get out of this room"
          sub="Stand up and move — outside if it's safe. The scene stays behind; you don't."
          art={WAVE_ART}
          onNext={() => setStep('breathe')}
          nextLabel="I've moved"
        />
      ) : null}

      {step === 'breathe' ? <SurfScreen seconds={60} heading="Three slow breaths" doneLabel="I'm steadier" onBack={() => setStep('remove')} onDone={() => setStep('closephone')} /> : null}

      {step === 'closephone' ? (
        <JourneyPage
          tint={SEA}
          hue={HUE.sea}
          back="back"
          onBack={() => setStep('breathe')}
          label="The hard part"
          headline="Now put the phone down"
          sub="Screen off, phone away. Stay out there and let the wave break — we'll check in when you're back."
          art={WAVE_ART}
          onNext={goAway}
          nextLabel="I'm putting it down"
        />
      ) : null}

      {step === 'away' ? (
        <AwayScreen
          onBack={async () => {
            const s = sessionRef.current;
            if (s) {
              const next: UrgeSession = { ...s, reopens: s.reopens + 1, phase: 'active' };
              setSession(next);
              await saveUrgeSession(next);
            }
            setResumed(true);
            setStep('rerate');
          }}
        />
      ) : null}

      {step === 'rerate' ? (
        <RateScreen
          headline={resumed ? 'Welcome back.\nHow is it now?' : 'How is it now?'}
          sub={session && session.reopens > 0 ? `Still the same wave — check-in ${session.reopens + 1}.` : undefined}
          initial={session?.severity ?? 5}
          onBack={close}
          backKind="close"
          cta="This is where it is"
          onNext={reRated}
        />
      ) : null}

      {step === 'stillstrong' ? (
        <JourneyPage
          tint={CLAY}
          hue={HUE.clay}
          back="close"
          onBack={close}
          label="That's okay"
          headline="Still loud"
          sub="Waves take their time. Stay out of the room, breathe — it cannot hold this pitch."
          art={WAVE_ART}
          onNext={() => setStep('breathe')}
          nextLabel="Breathe with me"
          footer={
            <Pressable onPress={goAway} hitSlop={8} style={{ paddingVertical: 4 }}>
              <AppText center weightOverride="600" style={{ fontSize: 14.5, color: colors.textSoft }}>
                Phone down — I'll ride it out there
              </AppText>
            </Pressable>
          }
        />
      ) : null}

      {step === 'outcome' ? (
        <OutcomeScreen
          trigger={trigger}
          setTrigger={(t) => {
            setTrigger(t);
            void update({ trigger: t });
          }}
          helped={helped}
          toggleHelped={(h) => setHelped((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]))}
          onRodeOut={() => resolve('urge_rode_out')}
          onActedOn={() => resolve('urge_acted_on')}
        />
      ) : null}

      {step === 'done' ? (
        <DoneScreen
          reopens={session?.reopens ?? 0}
          onClose={() => {
            void clearUrgeSession();
            close();
          }}
        />
      ) : null}
    </View>
  );
}

function RateScreen({
  headline,
  sub,
  initial,
  cta,
  backKind,
  onBack,
  onNext,
  footer,
}: {
  headline: string;
  sub?: string;
  initial?: number;
  cta: string;
  backKind: 'close' | 'back';
  onBack: () => void;
  onNext: (sev: number) => void;
  footer?: React.ReactNode;
}) {
  // the shared band-list grammar — identical to the urge log's intensity step
  const [band, setBand] = useState<number | null>(initial != null ? severityToBand(initial) : null);
  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={HUE.sea} />
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopChrome back={backKind} onBack={onBack} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 26, flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, letterSpacing: 0.3 }}>
            {headline}
          </AppText>
          {sub ? (
            <AppText center weightOverride="500" style={{ fontSize: 15, lineHeight: 21, color: SUB, marginTop: 8 }}>
              {sub}
            </AppText>
          ) : null}
          <View style={{ marginTop: 30 }}>
            <IntensityBands value={band} onSelect={setBand} />
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 26, paddingBottom: 18 }}>
          <View style={{ opacity: band == null ? 0.35 : 1 }}>
            <BrightButton label={cta} onPress={() => (band != null ? onNext(bandToSeverity(band)) : undefined)} />
          </View>
          {footer ? <View style={{ marginTop: 14, alignItems: 'center' }}>{footer}</View> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── chips on the night sky (triggers / what helped) ──────────────────────────
function NightChip({ label, on, tintFn, onPress }: { label: string; on: boolean; tintFn: (a?: number) => string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 17,
        paddingVertical: 12,
        borderRadius: 9999,
        backgroundColor: on ? colors.ink : CHIP_BG,
        borderWidth: 1.5,
        borderColor: on ? colors.ink : CHIP_LINE,
      }}>
      <AppText weightOverride={on ? '700' : '600'} color={on ? colors.inkText : colors.text} style={{ fontSize: 15.5, letterSpacing: -0.15 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function ChipScreen({
  hue,
  tintFn,
  onBack,
  headline,
  sub,
  options,
  selected,
  onPick,
}: {
  hue: number;
  tintFn: (a?: number) => string;
  onBack: () => void;
  headline: string;
  sub?: string;
  options: string[];
  selected: string[];
  onPick: (v: string) => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={hue} />
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopChrome back="back" onBack={onBack} />
        <View style={{ flex: 1, paddingHorizontal: 30, justifyContent: 'center' }}>
          <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 29, lineHeight: 33, letterSpacing: 0.29 }}>
            {headline}
          </AppText>
          {sub ? (
            <AppText center weightOverride="500" style={{ fontSize: 15.5, lineHeight: 22, color: SUB, marginTop: 12 }}>
              {sub}
            </AppText>
          ) : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11, justifyContent: 'center', marginTop: 34 }}>
            {options.map((t) => (
              <NightChip key={t} label={t} on={selected.includes(t)} tintFn={tintFn} onPress={() => onPick(t)} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── minor path: tailored fixes ───────────────────────────────────────────────
function FixScreen({ trigger, onBack, onBreathe, onSteady }: { trigger: string; onBack: () => void; onBreathe: () => void; onSteady: () => void }) {
  const fix = FIXES[trigger] ?? FIXES.Boredom;
  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={HUE.sage} />
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopChrome back="back" onBack={onBack} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30 }} showsVerticalScrollIndicator={false}>
          <AppText center weightOverride="700" color={SAGE(0.98)} style={{ fontSize: 12.5, letterSpacing: 2.4, textTransform: 'uppercase' }}>
            {trigger}
          </AppText>
          <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 29, lineHeight: 33, letterSpacing: 0.29, marginTop: 14 }}>
            Try this instead
          </AppText>
          <AppText center weightOverride="500" style={{ fontSize: 15.5, lineHeight: 22, color: SUB, marginTop: 12 }}>
            {fix.line}
          </AppText>
          <View style={{ gap: 11, marginTop: 28 }}>
            {fix.steps.map((s, i) => (
              <FadeIn key={s} style={{}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: CHIP_BG, borderWidth: 1, borderColor: CHIP_LINE, borderRadius: 17, paddingVertical: 15, paddingHorizontal: 16 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 9999, backgroundColor: SAGE(0.2), alignItems: 'center', justifyContent: 'center' }}>
                    <AppText weightOverride="700" color={SAGE(1)} style={{ fontSize: 13 }}>
                      {i + 1}
                    </AppText>
                  </View>
                  <AppText weightOverride="600" color={TEXT} style={{ flex: 1, fontSize: 15.5, lineHeight: 21, letterSpacing: -0.15 }}>
                    {s}
                  </AppText>
                </View>
              </FadeIn>
            ))}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 30, paddingBottom: 18 }}>
          <BrightButton label="Breathe with me" onPress={onBreathe} />
          <Pressable onPress={onSteady} hitSlop={8} style={{ paddingVertical: 4, marginTop: 14 }}>
            <AppText center weightOverride="600" style={{ fontSize: 14.5, color: colors.textSoft }}>
              I'm steady — wrap up
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── away: the phone is meant to be down ──────────────────────────────────────
function AwayScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={HUE.peri} />
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 }}>
          <AppText center weightOverride="700" style={{ fontSize: 12.5, letterSpacing: 2.4, textTransform: 'uppercase', color: colors.textSoft }}>
            Phone down
          </AppText>
          <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 29, lineHeight: 33, letterSpacing: 0.29, marginTop: 14 }}>
            We'll be here when the wave breaks.
          </AppText>
          <AppText center weightOverride="500" style={{ fontSize: 15.5, lineHeight: 23, color: SUB, marginTop: 14 }}>
            Stay out of the room. Breathe slow. Come back when it loosens.
          </AppText>
        </View>
        <View style={{ paddingHorizontal: 30, paddingBottom: 26, alignItems: 'center' }}>
          <Pressable onPress={onBack} hitSlop={10} style={{ paddingVertical: 10, paddingHorizontal: 18 }}>
            <AppText center weightOverride="600" style={{ fontSize: 15, color: colors.textMuted }}>
              I'm back — check in
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── outcome: only once it's subsiding ────────────────────────────────────────
function OutcomeScreen({
  trigger,
  setTrigger,
  helped,
  toggleHelped,
  onRodeOut,
  onActedOn,
}: {
  trigger: string | null;
  setTrigger: (t: string) => void;
  helped: string[];
  toggleHelped: (h: string) => void;
  onRodeOut: () => void;
  onActedOn: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={HUE.sea} />
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
          <AppText center weightOverride="700" color={SEA(0.98)} style={{ fontSize: 12.5, letterSpacing: 2.4, textTransform: 'uppercase' }}>
            The wave is breaking
          </AppText>
          <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 29, lineHeight: 33, letterSpacing: 0.29, marginTop: 14 }}>
            What happened?
          </AppText>
          <AppText center weightOverride="500" style={{ fontSize: 15.5, lineHeight: 22, color: SUB, marginTop: 10 }}>
            Just data — not a verdict.
          </AppText>

          <AppText weightOverride="600" style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.textSoft, marginTop: 28, marginBottom: 11 }}>
            What was behind it
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
            {TRIGGERS.map((t) => (
              <NightChip key={t} label={t} on={trigger === t} tintFn={SEA} onPress={() => setTrigger(t)} />
            ))}
          </View>

          <AppText weightOverride="600" style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.textSoft, marginTop: 24, marginBottom: 11 }}>
            What helped
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
            {HELPED.map((h) => (
              <NightChip key={h} label={h} on={helped.includes(h)} tintFn={SAGE} onPress={() => toggleHelped(h)} />
            ))}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 30, paddingBottom: 18 }}>
          <BrightButton label="I rode it out" onPress={onRodeOut} />
          <Pressable onPress={onActedOn} hitSlop={8} style={{ paddingVertical: 4, marginTop: 14 }}>
            <AppText center weightOverride="600" style={{ fontSize: 14.5, color: colors.textSoft }}>
              I acted on it
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── the breathing wave you ride (timed; used for the 3-breath settle too) ────
const PHASES = [
  { at: 0.0, name: 'Notice it', tip: 'The urge is here. Don’t push it away.' },
  { at: 0.22, name: 'It’s rising', tip: 'Let it build. You are not the wave.' },
  { at: 0.46, name: 'Cresting', tip: 'This is the peak. Breathe slow and wide.' },
  { at: 0.66, name: 'Passing', tip: 'Feel it recede. It always does.' },
  { at: 0.86, name: 'Calm returns', tip: 'You rode it out. Notice the quiet.' },
];

function SurfScreen({ seconds, heading, doneLabel, onBack, onDone }: { seconds: number; heading?: string; doneLabel: string; onBack: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(seconds);
  const progressRef = useRef(0);
  const raf = useRef(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let lastUi = 0;
    const loop = (now: number) => {
      if (!mounted) return;
      if (start.current == null) start.current = now;
      const elapsed = (now - start.current) / 1000;
      const p = Math.min(1, elapsed / seconds);
      progressRef.current = p;
      if (now - lastUi > 110) {
        lastUi = now;
        setProgress(p);
        setRemaining(Math.max(0, Math.ceil(seconds - elapsed)));
      }
      if (p < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf.current);
    };
  }, [seconds]);

  const cur = PHASES.reduce((acc, ph) => (progress >= ph.at ? ph : acc), PHASES[0]);
  const mm = String(Math.floor(remaining / 60));
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <NightSky hue={HUE.sea} />
      <Stars />
      <UrgeWave progressRef={progressRef} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopChrome
          back="back"
          onBack={onBack}
          trailing={
            <AppText weightOverride="700" style={{ fontSize: 17, letterSpacing: 0.3, color: colors.textMuted, fontVariant: ['tabular-nums'] }}>
              {mm}:{ss}
            </AppText>
          }
        />
        <View style={{ marginTop: 36, paddingHorizontal: 36, alignItems: 'center' }}>
          <AppText center weightOverride="700" color={SEA(0.98)} style={{ fontSize: 12.5, letterSpacing: 2.4, textTransform: 'uppercase' }}>
            {heading ?? cur.name}
          </AppText>
          <FadeIn key={cur.name} style={{ marginTop: 14 }}>
            <AppText center color={TEXT} style={{ fontFamily: fonts.serif, fontSize: 25, lineHeight: 31, letterSpacing: 0.25 }}>
              {cur.tip}
            </AppText>
          </FadeIn>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ paddingHorizontal: 26, paddingBottom: 18 }}>
          <BrightButton label={doneLabel} onPress={onDone} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// you rode it out — night-sky landing
// ── the finish: a full-screen night sea. Dark, immersive, factual. ────
function NightSea() {
  const band = (y: number, a: number, fill: string) =>
    `M-4 ${y} C 60 ${y - a} 130 ${y + a} 201 ${y} C 272 ${y - a} 340 ${y + a} 406 ${y} L406 260 L-4 260 Z`;
  return (
    <Svg width="100%" height={260} viewBox="0 0 402 260" preserveAspectRatio="xMidYMax slice">
      <Circle cx={300} cy={40} r={26} fill="#EDEDE8" opacity={0.12} />
      <Circle cx={300} cy={40} r={13} fill="#EDEDE8" opacity={0.5} />
      <Path d={band(96, 9, '#15161A')} fill="#15161A" />
      <Path d="M-4 96 C 60 87 130 105 201 96 C 272 87 340 105 406 96" stroke="rgba(237,237,232,0.3)" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <Path d={band(150, 7, '#101114')} fill="#101114" />
      <Path d="M-4 150 C 60 143 130 157 201 150 C 272 143 340 157 406 150" stroke="rgba(237,237,232,0.18)" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d={band(204, 5, '#0C0D10')} fill="#0C0D10" />
    </Svg>
  );
}

function DoneScreen({ reopens, onClose }: { reopens: number; onClose: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#08080A' }}>
      <StatusBar style="light" />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <NightSea />
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <AppText center color="#EDEDE8" style={{ fontFamily: fonts.serif, fontSize: 38, lineHeight: 42, letterSpacing: 0.38 }}>
            You rode it out.
          </AppText>
          <AppText center weightOverride="500" style={{ fontSize: 16.5, lineHeight: 24, color: 'rgba(237,237,232,0.6)', marginTop: 14, paddingHorizontal: 6 }}>
            {reopens > 0 ? `Waited; it passed. ${reopens + 1} check-ins.` : 'Waited; it passed.'}
          </AppText>
        </View>
        <View style={{ paddingHorizontal: 26, paddingBottom: 18 }}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              backgroundColor: '#EDEDE8',
              borderRadius: 9999,
              paddingVertical: 16,
              alignItems: 'center',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <AppText weightOverride="600" style={{ fontSize: 15.5, color: '#131313' }}>
              Done
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
