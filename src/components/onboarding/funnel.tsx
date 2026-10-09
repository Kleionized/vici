/**
 * The onboarding questionnaire — `03 · Name` … `23 · Goal confirmation` — on
 * the `Vici Overhaul` kit (auth-funnel; `.overhaul/understand/auth-funnel.md`).
 *
 * The drop draws the twenty-two screens on two templates, and every number
 * either template fixes lives here; what a frame states for itself (its inked
 * dashes, its stack's top and gap, its copy, its answers, its spot
 * illustration, its primary) is read off it into
 * `src/content/onboardingFunnel.ts` by `scripts/overhaul/gen-funnel.mjs`.
 *
 * - **Question** (Name, Age, Gender, Q1 … Q17): the nav row (back chevron and
 *   eight dashes), a stack at `left 24 right 24 top 136` (140 on Q5, What
 *   starts it and Q17 — the frames' own, transcribed) of a left-aligned 26/33
 *   title, the 15/22 mute line, a bare spacer and then the answers; the spot
 *   illustration under it at T 506 / 582; the primary at `bottom 48` on the
 *   multi-select and typed screens. A single-select screen draws no primary and
 *   turns itself over 260 ms after a pick, showing the chosen fill first.
 * - **Statement** (Start, First Principle, Transition, Goal confirmation): the
 *   kit's `HeroBoard` — hero at 190, centred title and paragraph at 451.
 *
 * `O3Shell` keeps the props `welcome.tsx` passes (the step index's `progress`,
 * `paper`, `lit`, `segments`, `backTop` — all of the previous drop's chrome);
 * the funnel screens draw their own frame and take only `onBack` from it.
 */

import { createContext, isValidElement, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View, type TextStyle, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Chips, Hero, HeroBoard, MonoText, NavBar, OptionList, PrimaryButton, Screen, ScrollRegion, TextField } from '@/components/mono';
import { FUNNEL_STEPS, type FunnelRun, type FunnelStep } from '@/content/onboardingFunnel';
import { mono, sans } from '@/lib/theme';

/** Which paper field a lit frame stated in the previous drop — accepted, and no longer drawn. */
export type O3Paper = 'default' | 'plan' | 'map' | 'plain';

/** The nav row ends at canvas 100 (`top 60, height 40`); below it the answers scroll on a short phone (D320). */
const NAV_BOTTOM = 100;
/** The primary at `bottom 48`, 58 tall: what it takes off the screen's bottom edge. */
const PRIMARY_RESERVE = 106;

const ShellCtx = createContext<{ onBack?: () => void }>({});

/**
 * The shell every `/welcome` step stands in. The questionnaire's screens (and
 * the under-18 gate) draw their whole frame — ground, nav, content — and read
 * the way back from here. Anything else rendered inside it (the tail's
 * `reading` step, until the tail group drops it per D324) gets the ground, a
 * back chevron, and the previous shell's padded box.
 */
export function O3Shell({
  onBack,
  children,
}: {
  /** @deprecated the old progress rule's fill — every frame states its own dashes */
  progress?: number;
  onBack?: (() => void) | null;
  /** @deprecated */
  bar?: boolean;
  /** @deprecated the paper tail's register — the overhaul has none */
  lit?: boolean;
  /** @deprecated */
  paper?: O3Paper;
  /** @deprecated */
  segments?: number;
  /** @deprecated every overhaul frame puts the nav row at 60 */
  backTop?: number;
  children: ReactNode;
}) {
  const ctx = useMemo(() => ({ onBack: onBack ?? undefined }), [onBack]);
  if (isValidElement(children) && (children.type === O3FunnelStep || children.type === O3AgeGate)) {
    return <ShellCtx.Provider value={ctx}>{children}</ShellCtx.Provider>;
  }
  return (
    <Screen>
      {onBack ? <NavBar left="back" right="empty" onBack={onBack} /> : null}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 54, bottom: 0, paddingHorizontal: 24, paddingTop: 76, paddingBottom: 32 }}>{children}</View>
    </Screen>
  );
}

/**
 * The three screens whose "none of these" answer clears the rest, and the one
 * that caps its picks. A frame can draw a chosen chip and an unchosen one; it
 * cannot draw a rule about which pairs are legal. These come from the
 * questionnaire's own change log (`.vicifull/QUESTIONNAIRE-CHANGES.txt` §5).
 * The kit's `toggleChoice` is the funnel's old `pick`, lifted (D350): an
 * exclusive answer replaces everything, and a pick past the cap is refused.
 */
const O3_EXCLUSIVE: Record<string, string> = {
  emotions: 'Nothing in particular', // 12 · Beforehand
  before: 'Nothing obvious', //         14 · What starts it
  tried: 'Nothing yet', //              22 · What you’ve tried
};
/** `17 · What it affects` says "Choose up to three" and means it. */
const O3_MAX_PICKS: Record<string, number> = { affects: 3 };

/**
 * `23 · Goal confirmation` reads the man's stated goal back to him; the canvas
 * draws the "stop" reading with the masturbation card under it. The other
 * readings exist only in the questionnaire doc (§23). The doc writes the
 * shared second line as "That’s what we’ll build around"; the frame draws
 * "That’s what we’ll work toward" for the case it shows, and stop, reduce and
 * limit share one line in the doc, so all three carry the frame's revision.
 */
const O3_GOAL_CONFIRM: Record<string, [string, string]> = {
  'Stop completely': ['You want to stop.', 'That’s what we’ll work toward.'],
  'Watch much less': ['You want porn to take up a lot less of your life.', 'That’s what we’ll work toward.'],
  'Set a limit and stick to it': ['You want to set a limit and actually keep it.', 'That’s what we’ll work toward.'],
  'I’m not sure yet': ['You don’t need to decide forever today.', 'We’ll start with getting the choice back.'],
};
/** The card is drawn only for the one masturbation answer that earns it. */
const O3_GOAL_CONFIRM_MAST = 'Keep it, just without porn';

/**
 * Native has no `text-wrap: balance`, so a fixed title whose greedy wrap at
 * 393 breaks differently from the canvas carries the canvas's own breaks there
 * (D332; the list is auth-funnel §3.8, measured on the frames). Only at 393 and
 * wider — at 375 an explicit break would split a line the narrower column has
 * already wrapped. Web balances them itself.
 */
const NATIVE_BREAKS: Record<string, string> = {
  gender: 'How do you describe\nyour gender?',
  freq: 'How often are you\nwatching porn right now?',
  duration: 'How long have you wanted\nto quit or cut down?',
  relapseSpan: 'When you’ve tried to quit,\nhow long do you usually make\nit before watching again?',
  firstPrinciple: 'An urge doesn’t stay at\nits worst for very long.',
  triggers: 'When do you usually\nend up watching?',
  emotions: 'What are you usually\nfeeling right before?',
  places: 'Where are you\nusually watching?',
  impact: 'How much is porn getting\nin the way of your life?',
  lonely: 'How often have you\nfelt lonely lately?',
  alone: 'How often are you on your\nown for long stretches?',
  goalPorn: 'What are you aiming\nfor with porn?',
};
function useTitle(step: FunnelStep, text: string): string {
  const { width } = useWindowDimensions();
  const brk = NATIVE_BREAKS[step.id];
  if (Platform.OS === 'web' || width < 393 || !brk || text !== step.title || brk.replace(/\n/g, ' ') !== text) return text;
  return brk;
}

/**
 * The canvas writes the sample name "Sam" into the Start board's title. The
 * app knows the real one; the man told it three screens earlier. With no name
 * (the field left blank, or an Apple sign-in that shared none) the vocative is
 * dropped — "Let’s figure out…" — rather than greeting him as the sample (D472).
 */
function withName(text: string, name?: string): string {
  const given = (name ?? '').trim();
  if (given) return text.replace(/^Sam\b/, given);
  return text.replace(/^Sam,\s*(\S)/, (_, first: string) => first.toUpperCase());
}

/** `04 · Age` draws 24 chosen — the wheel's value before it is touched. */
const AGE_DEFAULT = 24;

/** One funnel step, drawn on its template from its own frame's numbers. */
export function O3FunnelStep({
  step,
  value,
  onSet,
  next,
  name,
  answers,
}: {
  step: FunnelStep;
  value: string | string[] | undefined;
  onSet: (v: string | string[]) => void;
  next: () => void;
  /** The canvas writes the sample name "Sam" into the Start board's copy. */
  name?: string;
  /** `23 · Goal confirmation` (and the zero-pick rule on `17`) read earlier answers. */
  answers?: Record<string, string | string[]>;
}) {
  const { onBack } = useContext(ShellCtx);
  const [picked, setPicked] = useState<string | null>(null);
  const hasCta = step.cta != null;

  // A screen the canvas gives no primary turns itself over — one beat, so the
  // ink fill reads as the answer before the next question arrives.
  useEffect(() => {
    if (!picked || hasCta) return;
    const id = setTimeout(next, 260);
    return () => clearTimeout(id);
  }, [picked, hasCta, next]);

  // The wheel draws the frame's 24 before it is touched, but an untouched wheel
  // answers nothing: an age gate must not hand an adult age to anyone who taps
  // Continue, so Continue waits for a turn of the wheel (P8, D500).
  const age = parseInt(String(value ?? ''), 10);
  const ageOk = Number.isFinite(age) && age >= AGE_MIN && age <= AGE_MAX;

  const goal = step.id === 'goalConfirm' ? O3_GOAL_CONFIRM[String(answers?.goalPorn ?? '')] : undefined;
  const title = useTitle(step, withName(goal?.[0] ?? step.title, name));
  const nav = { left: 'back' as const, centre: step.dashes != null ? { step: step.dashes, total: 8 } : null, right: 'empty' as const, onBack };

  if (step.kind === 'statement') {
    const body = goal?.[1] ?? step.body;
    const card = step.card && (step.id !== 'goalConfirm' || answers?.goalMast === O3_GOAL_CONFIRM_MAST) ? step.card : null;
    return (
      <HeroBoard
        nav={nav}
        hero={step.hero?.id}
        heroTop={step.hero?.top}
        heroScale={step.hero?.scale}
        stackTop={step.stack.top}
        gap={step.stack.gap}
        titleSize={26}
        title={title}
        body={body ? withName(body, name) : undefined}
        extra={card ? <FunnelCard runs={card} /> : undefined}
        cta={step.cta ?? 'Continue'}
        onCta={next}
      />
    );
  }

  const chosen = step.multi && Array.isArray(value) ? value : [];
  // `17 · What it affects` takes an empty answer from a man who has just said
  // porn is not really in the way — the doc's own exception.
  const zeroOk = step.id === 'affects' && answers?.impact === 'Not really';
  const controls = hasCta ? PRIMARY_RESERVE : 0;
  const exclusive = O3_EXCLUSIVE[step.id];

  let answersEl: ReactNode = null;
  if (step.kind === 'text') {
    answersEl = (
      <TextField
        variant="name"
        value={typeof value === 'string' ? value : ''}
        onChangeText={onSet}
        placeholder={step.placeholder}
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
        maxLength={40}
        autoFocus
        returnKeyType="next"
        onSubmitEditing={next}
      />
    );
  } else if (step.kind === 'list') {
    answersEl = (
      <OptionList
        lift
        options={step.options}
        value={picked ?? (typeof value === 'string' ? value : null)}
        onChange={(k) => {
          onSet(k);
          setPicked(k);
        }}
      />
    );
  } else if (step.kind === 'chips') {
    answersEl = (
      <Chips
        multi
        lift
        options={step.options}
        value={chosen}
        onChange={onSet}
        exclusive={exclusive ? [exclusive] : undefined}
        max={O3_MAX_PICKS[step.id]}
      />
    );
  }

  return (
    <Screen>
      {/* first, as the frames paint it: the answers never sit over it at 852,
          and on a phone too short to clear the controls it is left out (D320) */}
      {step.hero ? <Hero id={step.hero.id} top={step.hero.top} scale={step.hero.scale} controls={controls} /> : null}
      <NavBar {...nav} />
      {step.kind === 'wheel' ? (
        <>
          <View style={{ position: 'absolute', left: 24, right: 24, top: step.stack.top, gap: step.stack.gap }}>
            <MonoText v="h1">{title}</MonoText>
          </View>
          <AgeWheel top={236} value={ageOk ? age : AGE_DEFAULT} unset={!ageOk} onChange={(v) => onSet(String(v))} />
        </>
      ) : (
        <ScrollRegion
          top={NAV_BOTTOM}
          bottom={controls}
          contentStyle={{ paddingHorizontal: 24, paddingTop: step.stack.top - NAV_BOTTOM, paddingBottom: hasCta ? 24 : 48 }}>
          <View style={{ gap: step.stack.gap }}>
            <MonoText v="h1">{title}</MonoText>
            {step.sub ? (
              <MonoText v="pTight" color={mono.mute}>
                {step.sub}
              </MonoText>
            ) : null}
            {step.spacer ? <View style={{ height: step.spacer }} /> : null}
            {answersEl}
          </View>
        </ScrollRegion>
      )}
      {step.cta ? <PrimaryButton label={step.cta} onPress={next} disabled={(step.multi && chosen.length === 0 && !zeroOk) || (step.kind === 'wheel' && !ageOk)} /> : null}
    </Screen>
  );
}

/** 15/23 `#B5B0A8`, left-aligned inside the centred stack; the closing run 700 ink. */
const CARD_TEXT: TextStyle = { ...sans('400'), fontSize: 15, lineHeight: 23, color: mono.sub, textAlign: 'left' };

/**
 * Goal confirmation's card: `margin-top 14` on top of the stack's 18, padding
 * 18 22, r18, `#1E1E1E`. It stretches to the stack's width — the drawn copy
 * fills 345 anyway, and a shorter variant must not shrink it.
 */
function FunnelCard({ runs }: { runs: FunnelRun[] }) {
  return (
    <View style={{ marginTop: 14, alignSelf: 'stretch', paddingVertical: 18, paddingHorizontal: 22, borderRadius: 18, backgroundColor: mono.card }}>
      <Text maxFontSizeMultiplier={1.3} style={CARD_TEXT}>
        {runs.map((r, i) =>
          r.bold ? (
            <Text key={i} style={{ ...sans('700'), color: mono.ink }}>
              {r.text}
            </Text>
          ) : (
            r.text
          ),
        )}
      </Text>
    </View>
  );
}

// ── 04 · Age ─────────────────────────────────────────────────────────

/** D331: wide enough below 18 that the under-18 gate stays reachable. */
const AGE_MIN = 13;
const AGE_MAX = 99;
/** Points of drag per year. */
const AGE_STEP = 40;

/**
 * The five rows the frame draws around the chosen age — 30/700 `#2E2E2E` on 56,
 * 34/700 `#5A574F` on 60, 72/700 ls −2 ink on 100 between two 200 × 1.5 ink
 * rules — whose pitch is not uniform (centres ±81.5, ±139.5), so this is not a
 * snapping list. The value steps under the finger (one year per 40 pt of drag)
 * and the rows keep their drawn looks; a visible neighbour is a tap target.
 */
const AGE_LOOK: Record<number, TextStyle> = {
  2: { ...sans('700'), fontSize: 30, lineHeight: 56, color: mono.line },
  1: { ...sans('700'), fontSize: 34, lineHeight: 60, color: mono.art },
  0: { ...sans('700'), fontSize: 72, lineHeight: 100, letterSpacing: -2, color: mono.ink },
};
const webNoSelect = Platform.OS === 'web' ? ({ userSelect: 'none', cursor: 'grab', touchAction: 'none' } as unknown as ViewStyle) : null;

function AgeWheel({ top, value, unset = false, onChange }: { top: number; value: number; unset?: boolean; onChange: (v: number) => void }) {
  const valueRef = useRef(value);
  // nothing chosen yet: the age on show is only the frame's 24, so picking it must still count
  const unsetRef = useRef(unset);
  const from = useRef(value);
  const dragging = useRef(false);
  /** when the last drag let go — the click a mouse drag ends in must not also step */
  const dragEnd = useRef(0);
  const report = useRef(onChange);
  useEffect(() => {
    valueRef.current = value;
    unsetRef.current = unset;
    report.current = onChange;
  });
  const step = (v: number) => {
    const c = Math.max(AGE_MIN, Math.min(AGE_MAX, v));
    if (c === valueRef.current && !unsetRef.current) return;
    valueRef.current = c;
    unsetRef.current = false;
    report.current(c);
  };
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

  // The builder only stores these callbacks; they run on gesture events, never
  // during render — which is what the refs and purity rules cannot see through.
  /* eslint-disable react-hooks/refs, react-hooks/purity */
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetY([-4, 4])
        .failOffsetX([-10, 10])
        .onStart(() => {
          dragging.current = true;
          from.current = valueRef.current;
        })
        .onUpdate((e) => stepRef.current(from.current - Math.round(e.translationY / AGE_STEP)))
        .onFinalize(() => {
          if (!dragging.current) return;
          dragging.current = false;
          dragEnd.current = Date.now();
        }),
    [dragging, from, valueRef, stepRef, dragEnd],
  );
  /* eslint-enable react-hooks/refs, react-hooks/purity */

  const row = (off: number) => {
    const v = value + off;
    const has = v >= AGE_MIN && v <= AGE_MAX;
    const text = (
      <Text maxFontSizeMultiplier={1.3} style={AGE_LOOK[Math.abs(off)]}>
        {has ? String(v) : ' '}
      </Text>
    );
    // while nothing is chosen the middle row is a button too: tapping the age on show picks it (D500)
    if (!has || (off === 0 && !unset)) return <View key={off}>{text}</View>;
    return (
      <Pressable
        key={off}
        accessibilityRole="button"
        accessibilityLabel={String(v)}
        // a mouse drag that started on a row still ends in a click on web
        onPress={() => (Date.now() - dragEnd.current < 250 ? undefined : step(v))}>
        {text}
      </Pressable>
    );
  };
  const rule = (k: string) => <View key={k} style={{ width: 200, height: 1.5, backgroundColor: mono.ink }} />;

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Age"
        aria-valuetext={String(value)}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => step(value + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
        style={[{ position: 'absolute', left: 0, right: 0, top, alignItems: 'center' }, webNoSelect]}>
        {row(-2)}
        {row(-1)}
        {rule('a')}
        {row(0)}
        {rule('b')}
        {row(1)}
        {row(2)}
      </View>
    </GestureDetector>
  );
}

// ── the under-18 gate ────────────────────────────────────────────────

/**
 * Where an under-18 leaves the funnel. `04 · Age`'s gate is stated in the
 * questionnaire doc and nowhere else — no frame draws the board — so it is the
 * Age screen's own chrome (the nav, its one dash) with the question template's
 * title and a 15/24 paragraph, and no way forward: Back is the only control,
 * so a wrong age is one tap from being corrected. The copy is the app's own.
 */
export const O3_AGE_MIN = 18;
export function O3AgeGate() {
  const { onBack } = useContext(ShellCtx);
  const age = FUNNEL_STEPS.find((s) => s.id === 'ageYears');
  return (
    <Screen>
      <NavBar left="back" centre={{ step: age?.dashes ?? 1, total: 8 }} right="empty" onBack={onBack} />
      <ScrollRegion top={NAV_BOTTOM} contentStyle={{ paddingHorizontal: 24, paddingTop: (age?.stack.top ?? 136) - NAV_BOTTOM, paddingBottom: 48 }}>
        <View style={{ gap: 14 }}>
          <MonoText v="h1">This one is for over-18s.</MonoText>
          <MonoText v="p">
            Come back when you are. If porn is already getting in the way, someone you trust — a doctor, a counsellor, a parent — is a better first step than an app.
          </MonoText>
        </View>
      </ScrollRegion>
    </Screen>
  );
}
