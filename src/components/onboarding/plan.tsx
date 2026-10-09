/**
 * The plan sub-flow — `25 · This Is Where We’d Start` … `27 · Your Plan`.
 *
 * Five boards between `24 · Build plan` and `28 · Your recovery rating`. In
 * `Vici Overhaul` four of them are the kit's statement board — a nav row, a
 * hero at 190 (the `charger`, and the `door` on Step 2), a centred 26/33 stack
 * at 451 and the primary — so they are `HeroBoard`s, which also carries the
 * small-screen lift (D320). `Your Plan` is a stack of five icon cards.
 *
 * What the boards *say* is unchanged from the previous drop: his signals (up
 * to three, and only his — D473), the first change and its two steps, the
 * evidence sentence and the plan rows are all still read off his answers
 * (D053–D055, D093). Only the drawing
 * changed: the night card, the glyph discs, the dashed rule and the soft-blob
 * scenes are gone, and the signals are the kit's 44pt ink pills.
 */
import { useState, type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';

import { HeroBoard, IconCard, MonoText, NavBar, Pill, PrimaryButton, Screen } from '@/components/mono';
import { mono, sans } from '@/lib/theme';

import { Band } from './tail';

// ── what the boards read off the questionnaire ───────────────────────

/**
 * `11 · When` → the chip `25 · Where We’d Start` draws for it. Its keys are the
 * nine labels the picker offers, and they are what `planSignals` filters on.
 *
 * The frame still draws "Home alone" and "Phone in bed" for `When I’m home
 * alone` and `While scrolling` (D053). The pills wrap freely now — the 100pt
 * `nowrap` column of D092 is gone — but the shorter forms are the frame's own
 * words for two of them, so the other three keep the same pattern.
 */
const CHIP_LABEL: Record<string, string> = {
  'Late at night': 'Late at night',
  'In the morning': 'In the morning',
  'When I’m bored': 'Bored',
  'When I’m stressed': 'Stressed',
  'When I can’t sleep': 'Can’t sleep',
  'On weekends': 'On weekends',
  'After drinking': 'After drinking',
  'When I’m home alone': 'Home alone',
  'While scrolling': 'Phone in bed',
};

/** `11 · When` → the sentence-opening form on `26 · Start Here`. */
const WHEN_SHORT: Record<string, string> = {
  'Late at night': 'Late night',
  'In the morning': 'Mornings',
  'When I’m bored': 'Boredom',
  'When I’m stressed': 'Stress',
  'When I can’t sleep': 'Sleepless nights',
  'On weekends': 'Weekends',
  'After drinking': 'Drinking',
  'When I’m home alone': 'Being home alone',
  'While scrolling': 'Scrolling',
};

/** `13 · Place` → the mid-sentence form. The canvas turns "In bed" into "bed". */
const WHERE_SHORT: Record<string, string> = {
  'In bed': 'bed',
  'In the bathroom': 'the bathroom',
  'At my desk': 'your desk',
  'In the living room': 'the living room',
  'Somewhere else at home': 'home',
  'Outside home': 'being out',
};

/**
 * `14 · What starts it` → the mid-sentence form and the plan row.
 *
 * The canvas fixes the transform on one entry: "I start scrolling" is
 * "scrolling" in the sentence and "Scrolling" on the plan row — the
 * first-person clause becomes a noun phrase. The rest follow it.
 */
const STARTER: Record<string, { phrase: string; row: string }> = {
  'I see something sexual online': { phrase: 'something you saw', row: 'Something you saw' },
  'I start scrolling': { phrase: 'scrolling', row: 'Scrolling' },
  'I can’t sleep': { phrase: 'not sleeping', row: 'Not sleeping' },
  'I’ve had a stressful day': { phrase: 'a stressful day', row: 'A stressful day' },
  'I argue with someone or feel rejected': { phrase: 'an argument', row: 'An argument' },
  'I start fantasising': { phrase: 'fantasising', row: 'Fantasising' },
  'Nothing obvious': { phrase: 'no one thing', row: 'Nothing obvious' },
};

export type FirstChange = {
  /** `26 · Start Here`'s heading. */
  heading: string;
  /** `27 · Your Plan`'s fourth row. */
  row: string;
  /** `26A · Step 1` and `26A2 · Step 2` — one heading and one note each. */
  steps: [{ title: string; note: string }, { title: string; note: string }];
};

/**
 * The first change the boards propose, and the ones `Choose another` reaches.
 *
 * The bundle designs exactly one — the phone out of the bed — and draws
 * `Choose another` under it with no destination frame anywhere in the drop. A
 * dead control was the worse of the two readings, so the line swaps the
 * proposed change for the next signal he named on `25 · Where We’d Start`; the
 * boards keep their own artwork (D054).
 *
 * No heading below carries a line break: the frames state `text-wrap: balance`
 * and `MonoText` passes it through on web — the same engine balancing the same
 * run at the same width breaks where the frame breaks.
 */
const FIRST_CHANGES: Record<string, FirstChange> = {
  // the canvas's own board, verbatim — slot 9 of `11 · When`
  'While scrolling': {
    heading: 'Keep your phone out of bed tonight.',
    row: 'Phone out of bed',
    steps: [
      { title: 'Charge it away from the bed.', note: 'Tonight, before you lie down.' },
      { title: 'Can’t sleep? Get out of bed before you start scrolling.', note: 'One change tonight. Build from there.' },
    ],
  },
  'Late at night': {
    heading: 'Pick the hour you stop tonight.',
    row: 'A stop time',
    steps: [
      { title: 'Set the hour before you need it.', note: 'Tonight, while it is still early.' },
      { title: 'When it comes round, put the phone down and go to bed.', note: 'One change tonight. Build from there.' },
    ],
  },
  'When I can’t sleep': {
    heading: 'Leave the room instead of lying there.',
    row: 'Out of the room',
    steps: [
      { title: 'Decide now where you will go.', note: 'Tonight, before you lie down.' },
      { title: 'Twenty minutes awake and you get up, without the phone.', note: 'One change tonight. Build from there.' },
    ],
  },
  'When I’m home alone': {
    heading: 'Keep one door open tonight.',
    row: 'A door left open',
    steps: [
      { title: 'Pick the room you will not close.', note: 'Tonight, before the house goes quiet.' },
      { title: 'When the house empties, the door stays open.', note: 'One change tonight. Build from there.' },
    ],
  },
};
const DEFAULT_CHANGE = 'While scrolling';

/**
 * Native has no `text-wrap: balance`, and four of the headings above break
 * differently greedily at 345 than balanced (measured: `.overhaul/f-tail-breaks.mjs`)
 * — "Keep your phone out of bed / tonight." for the frame's "Keep your phone /
 * out of bed tonight." On native those carry the frame's break (D332); web
 * balances the plain string, as the canvas does.
 */
const NATIVE_BREAKS: Record<string, string> = {
  'Keep your phone out of bed tonight.': 'Keep your phone\nout of bed tonight.',
  'Leave the room instead of lying there.': 'Leave the room\ninstead of lying there.',
  'Pick the room you will not close.': 'Pick the room\nyou will not close.',
  'When the house empties, the door stays open.': 'When the house empties,\nthe door stays open.',
};
const balanced = (s: string) => (Platform.OS === 'web' ? s : (NATIVE_BREAKS[s] ?? s));

/**
 * Which of his signals `26 · Start Here` proposes first, and the order
 * `Choose another` walks them in: the most concrete thing among them, so a man
 * who named late night, being home alone and scrolling is offered the phone out
 * of the bed — the canvas's own board (D054).
 */
const CHANGE_ORDER = ['While scrolling', 'When I can’t sleep', 'When I’m home alone', 'Late at night'];

/**
 * The signals `25` draws as pills, in his own picker's labels: what he ticked
 * on `11 · When`, up to three, and nothing else.
 *
 * Filtered on `11 · When`'s nine labels (`CHIP_LABEL`'s keys) — not on the
 * funnel's legacy glyph table, which this drop's glyph-less picker no longer
 * needs. A man who ticked one or two used to be topped up from the trio the
 * canvas draws, under "These came up together in your answers" — words he
 * never chose. The board now draws only his (D473).
 */
export function planSignals(triggers: string[]): string[] {
  const seen: string[] = [];
  for (const t of triggers) {
    if (CHIP_LABEL[t] && !seen.includes(t)) seen.push(t);
    if (seen.length === 3) break;
  }
  return seen;
}

/** The change a signal proposes — the canvas's own board wherever none is named. */
export function firstChangeFor(signal: string): FirstChange {
  return FIRST_CHANGES[signal] ?? FIRST_CHANGES[DEFAULT_CHANGE];
}

/**
 * The boards `26 · Start Here` can propose, in the order it proposes them —
 * read off the three signals `25` just drew, so `26` never proposes a change
 * for something `25` did not show him.
 */
export function changeCandidates(signals: string[]): string[] {
  const named = CHANGE_ORDER.filter((k) => signals.includes(k));
  return named.length ? named : [DEFAULT_CHANGE];
}

export function chipLabel(signal: string) {
  return CHIP_LABEL[signal] ?? signal;
}
export function whenShort(when: string) {
  return WHEN_SHORT[when] ?? when;
}
export function whereShort(where: string) {
  return WHERE_SHORT[where] ?? where.toLowerCase();
}
export function starterFor(starter: string) {
  return STARTER[starter] ?? { phrase: 'scrolling', row: 'Scrolling' };
}

/**
 * `26 · Start Here`'s sentence — "Late night, bed and scrolling came up
 * together in your answers." — his `11 · When`, `13 · Place` and `14 · What
 * starts it`. When `Choose another` proposes one of his signals the three
 * terms do not name, the signal takes the `when` slot, so the board never
 * argues for a door with evidence about a phone (D093).
 *
 * Every term is an answer he gave (D473): an unanswered picker, or "Nothing
 * obvious" on 14, leaves its term out rather than standing the canvas's own
 * answer in, and the default change (`While scrolling`, offered when none of
 * his signals has a board) never claims to be one of his answers.
 */
export function evidenceLine(signal: string, when: string | undefined, where: string | undefined, starter: string | undefined, picked: readonly string[] = []) {
  const terms: string[] = [];
  if (when) terms.push(whenShort(when));
  if (where) terms.push(whereShort(where));
  if (starter && starter !== 'Nothing obvious') terms.push(starterFor(starter).phrase);
  const lead = picked.includes(signal) ? whenShort(signal) : null;
  if (lead && !terms.some((t) => t.toLowerCase() === lead.toLowerCase())) {
    if (when) terms[0] = lead;
    else terms.unshift(lead);
  }
  if (!terms.length) return 'It’s one small change, and it’s yours to make tonight.';
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  if (terms.length === 1) return `${cap(terms[0])} came up in your answers.`;
  const list = terms.length === 2 ? `${terms[0]} and ${terms[1]}` : `${terms[0]}, ${terms[1]} and ${terms[2]}`;
  return `${cap(list)} came up together in your answers.`;
}

/**
 * The triple the four boards after `25` all share.
 *
 * `14 · What starts it` is looked up by its answer rather than by its key, so
 * a renamed step id cannot strand it. Each of the three is his answer or
 * nothing (D473) — the pickers cannot be left empty on the real path, but a
 * board never stands the canvas's sample answer in for his.
 */
export function planReading(a: Record<string, string | string[]>, pick: number) {
  const triggers = (a.triggers as string[]) || [];
  const places = (a.places as string[]) || [];
  const signals = planSignals(triggers);
  const candidates = changeCandidates(signals);
  const starter = Object.values(a)
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .find((v) => typeof v === 'string' && STARTER[v]) as string | undefined;
  const signal = candidates[pick % candidates.length];
  return {
    when: triggers[0] as string | undefined,
    where: places[0] as string | undefined,
    starter,
    // `Choose another` walks his own signals in `CHANGE_ORDER`, wrapping round.
    signal,
    signals,
    change: firstChangeFor(signal),
  };
}

// ── 25 · This Is Where We’d Start ─────────────────────────────────────

/** The charger, his name, his signals as pills, and the line that says he does not have to change everything at once. */
export function O3WhereWedStart({ name, triggers, next }: { name?: string; triggers: string[]; next: () => void }) {
  const who = (name ?? '').trim();
  const signals = planSignals(triggers);
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="charger"
      stackTop={451}
      gap={16}
      titleSize={26}
      title={who ? `${who}, this is where we’d start.` : 'This is where we’d start.'}
      body={
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            {signals.map((s) => (
              <Pill key={s} kind="place" label={chipLabel(s)} />
            ))}
          </View>
          {/* said only of what he picked: one signal is not "together" (D473) */}
          {signals.length ? (
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {signals.length === 1 ? 'This came up in your answers.' : 'These came up together in your answers.'}
            </MonoText>
          ) : null}
          {/* one paragraph with an inline 700 ink run, as the frame writes it */}
          <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
            You don’t need to change everything at once.{' '}
            <MonoText v="p" style={{ ...sans('700'), color: mono.ink }}>
              Start with this.
            </MonoText>
          </MonoText>
        </>
      }
      cta="Continue"
      onCta={next}
    />
  );
}

// ── 26 · Start Here ──────────────────────────────────────────────────

/** The change, the evidence for it, and the two ways past it. */
export function O3StartHere({
  change,
  signal,
  signals = [],
  when,
  where,
  starter,
  onAccept,
  onAnother,
}: {
  change: FirstChange;
  /** The signal this board's proposal is built on — D054's `Choose another`. */
  signal: string;
  /** his own `11 · When` signals, as `25` drew them */
  signals?: readonly string[];
  when?: string;
  where?: string;
  starter?: string;
  onAccept: () => void;
  onAnother: () => void;
}) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="charger"
      stackTop={451}
      gap={18}
      titleSize={26}
      title={balanced(change.heading)}
      body={evidenceLine(signal, when, where, starter, signals)}
      cta="Continue"
      onCta={onAccept}
      ghost="Choose another"
      onGhost={onAnother}
    />
  );
}

// ── 26A · Step 1 / 26A2 · Step 2 ─────────────────────────────────────

/** The charger again, "Step 1 of 2" in the nav. */
export function O3StartHereStep1({ change, next, back }: { change: FirstChange; next: () => void; back?: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'back', centre: { title: 'Step 1 of 2' }, right: 'empty', onBack: back }}
      hero="charger"
      stackTop={451}
      gap={16}
      titleSize={26}
      title={balanced(change.steps[0].title)}
      body={change.steps[0].note}
      cta="Next"
      onCta={next}
    />
  );
}

/** The door — getting out of the room. */
export function O3StartHereStep2({ change, next, back }: { change: FirstChange; next: () => void; back?: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'back', centre: { title: 'Step 2 of 2' }, right: 'empty', onBack: back }}
      hero="door"
      stackTop={451}
      gap={16}
      titleSize={26}
      title={balanced(change.steps[1].title)}
      body={change.steps[1].note}
      cta="Continue"
      onCta={next}
    />
  );
}

// ── 27 · Your Plan ───────────────────────────────────────────────────

const PLAN_ROW_SUBS = ['When it usually happens', 'Where it usually happens', 'What tends to set it off', 'Your first change', 'When an urge hits'];

const G20 = { fill: 'none', stroke: mono.onInk, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/**
 * The five 20pt glyphs, the frame's own paths. They belong to the *row*, not
 * to the answer (D055): the words vary with his answers, the drawing does not.
 * Row 5 is a bolt in this drop (it was a crosshair).
 */
const PLAN_ICONS: ReactNode[] = [
  <Path key="moon" d="M14 3a8 8 0 1 0 3 12.5A7 7 0 0 1 14 3z" fill={mono.onInk} />,
  <Path key="bed" d="M3 6v9M3 12h14v3M17 12v-3a2 2 0 0 0-2-2H8v4" {...G20} />,
  <G key="phone">
    <Rect width={10} height={15} x={5} y={2.5} rx={2.5} fill="none" stroke={mono.onInk} strokeWidth={2} />
    <Path d="M10 7v6M8 11l2 2 2-2" {...G20} strokeWidth={1.8} />
  </G>,
  <Path key="plug" d="M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0z M10 15v3" {...G20} />,
  <Path key="bolt" d="M11 2L4 11h6l-1 7 7-9h-6z" fill={mono.onInk} />,
];

/** The stack's top and the last card's bottom on the canvas (cards 237 … 589 + 74). */
const PLAN_TOP = 170;
const PLAN_BOTTOM = 663;

/**
 * Five cards: when, where, what sets it off, the first change and what SOS does
 * about it. On a phone shorter than the frame the stack rises into the ground
 * under the nav and what is left scrolls between the nav and the primary — the
 * tail's `Band` (D320, D219); at 852 it fits and nothing moves.
 */
export function O3YourPlan({
  when,
  where,
  starter,
  change,
  next,
  back,
}: {
  when?: string;
  where?: string;
  starter?: string;
  change: FirstChange;
  next: () => void;
  back?: () => void;
}) {
  // a row whose question went unanswered is left out, not filled with the
  // canvas's answer (D473); the glyph stays with its row
  const rows = [when, where, starter ? starterFor(starter).row : undefined, change.row, 'SOS gets you out first']
    .map((title, i) => ({ title, i }))
    .filter((r): r is { title: string; i: number } => !!r.title);
  const [stackH, setStackH] = useState(PLAN_BOTTOM - PLAN_TOP);
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={PLAN_TOP} end={PLAN_TOP + stackH}>
        <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: PLAN_TOP, gap: 14 }}>
          <MonoText v="h1">Your plan</MonoText>
          <View style={{ height: 6 }} />
          {rows.map(({ title, i }) => (
            <IconCard
              key={i}
              title={title}
              sub={PLAN_ROW_SUBS[i]}
              icon={
                <Svg width={20} height={20} viewBox="0 0 20 20">
                  {PLAN_ICONS[i]}
                </Svg>
              }
            />
          ))}
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}
