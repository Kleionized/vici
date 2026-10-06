/**
 * The First 90 Seconds — `UrgeFlow`, behind `/urge` and `/rough-first90`: the
 * interrupt's boards (intro, strength, where, the three moves, the two
 * pickers, reassess, afterward, the relief board), and the step machine that
 * runs them, hands each answer to its response board (`boards.tsx`,
 * sos-boards) and the `sos` step to the stages in `stages.tsx`.
 *
 * Every board is the flat dark kit (`Vici Overhaul`, sos-flow §3): the hero
 * boards are the kit's `HeroBoard`, the question boards `SosQuestion`. Canvas
 * coordinates throughout (the kit's `Screen`).
 */

import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, View, type TextStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  CheckinDisc,
  Chips,
  HeroBoard,
  IntensityScale,
  MonoText,
  Pill,
  ScaleReading,
  Tap,
  TextField,
} from '@/components/mono';
import { bandToSeverity, INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { isSosBoardKey, type SosBoardKey } from '@/content/sosResponses';
import { URGE_FEELINGS, URGE_TRIGGERS } from '@/content/sosPickers';
import { useCreateEvent } from '@/lib/backend';
import { minutesWords } from '@/lib/format';
import { getJSON, setJSON } from '@/lib/storage';
import { lhNormal, mono, sans } from '@/lib/theme';
import { clearUrgeSession, newUrgeSession, saveUrgeSession } from '@/lib/urgeSession';

import { ResponsePage } from './boards';
import {
  BreatheStage,
  DEFAULT_SOS_SETTINGS,
  Gap,
  OddStage,
  SOS_ORDER,
  SOS_SETTINGS_KEY,
  SosQuestion,
  SosSettingsSheet,
  SURF_SECONDS,
  TapStage,
  WaveStage,
  type SosSettings,
} from './stages';

// ════════ THE FIRST 90 SECONDS ══════════════════════════════════════════════
// Canvas 28 → 33: Cue Intro Modal · SOS Strength · Cue Hue Picker · Surf Step
// 1/3 · Cue Set Confirmation · the reason and feeling pickers · Reassess ·
// Afterward · Surf Complete, with sos-boards' response boards between them.

export type UrgePlace = 'private' | 'bed' | 'public' | 'work' | 'out';

/**
 * `Cue Hue Picker` · the five places, in the canvas's own order, each with the
 * frame's 20-box glyph (stroke `currentColor` 1.8, round caps and joins).
 */
const PLACES: { key: UrgePlace; label: string; d: string }[] = [
  { key: 'private', label: 'Somewhere private', d: 'M4 17V8l6-5 6 5v9M8 17v-5h4v5' },
  { key: 'bed', label: 'In bed', d: 'M3 15V9h14v6M3 12h14M5 9V6h4v3' },
  {
    key: 'public',
    label: 'A public space',
    d: 'M6 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM14 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 16c0-2.5 1.8-4 4-4s4 1.5 4 4M10 16c0-2.5 1.8-4 4-4s4 1.5 4 4',
  },
  { key: 'work', label: 'At work or school', d: 'M3 7h14v9H3zM7 7V4h6v3M3 11h14' },
  { key: 'out', label: 'Out and about', d: 'M10 17s-5-4.5-5-8a5 5 0 0 1 10 0c0 3.5-5 8-5 8zM10 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
];

/**
 * `Surf Step 1`, `Surf Step 3`, `Cue Set Confirmation` — the three moves, in
 * the order the nav numbers them (the file names describe an older order:
 * `Surf-Step-3` is Move II). Each is a hero board that closes on "Continue";
 * the hero is the card each frame draws.
 */
const MOVES: { title: string; body: string; hero: 'bed' | 'openDoor' | 'charger' }[] = [
  { title: 'Stand up.', body: 'Both feet on the floor. The wave loses its grip the moment the room changes.', hero: 'bed' },
  { title: 'Leave the room.', body: 'Go somewhere with light, and somewhere you don’t usually watch.', hero: 'openDoor' },
  { title: 'Put the phone away.', body: 'Put it somewhere you cannot reach from where you’re sitting.', hero: 'charger' },
];
const MOVE_NUMERAL = ['I', 'II', 'III'];

// ── 28 · Cue Intro Modal ────────────────────────────────────────────────────

function IntroPage({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  return (
    <HeroBoard
      nav={{ onClose }}
      hero="stopwatch"
      caps="The interrupt"
      title="The first 90 seconds."
      body="A universal interrupt for the moment the wave hits. Six small moves — decide nothing until it passes."
      cta="Start"
      onCta={onNext}
    />
  );
}

// ── 28B · SOS Strength ──────────────────────────────────────────────────────

/** What each bar means, for screen readers and recipes (they tap by the word). */
const BAND_LABELS = INTENSITY_BANDS.map((b) => b.label);

function StrengthPage({ band, onBand, onBack, onClose, onNext }: { band: number; onBand: (index: number) => void; onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <SosQuestion
      left="back"
      onBack={onBack}
      onClose={onClose}
      dashes={1}
      hero={{ id: 'thermometer', top: 458, scale: 0.731 }}
      gap={20}
      layer={
        <>
          <IntensityScale value={band} onChange={onBand} a11yLabels={BAND_LABELS} />
          <ScaleReading word={INTENSITY_BANDS[band].label} line={INTENSITY_BANDS[band].note} />
        </>
      }
      // the reading's line ends at 440 + 36 + 6 + 24
      layerBottom={506}
      cta="Continue"
      onCta={onNext}
      ghost="Skip this step"
      onGhost={onNext}>
      <MonoText v="h1">How strong is it right now?</MonoText>
    </SosQuestion>
  );
}

// ── 29 · Cue Hue Picker — where are you right now ───────────────────────────

/**
 * One place: `height 60, r18, padding 0 18 0 16, gap 14` — a 34 ringed disc
 * holding the glyph, the label 16/400, and on the chosen row a 10 `#1E1E1E`
 * dot (the generator says white; the frame draws the card colour). Chosen is
 * the ink fill with `#111111` content and the disc's ring at 30 % of it.
 */
function PlaceRow({ label, d, on, onPress }: { label: string; d: string; on: boolean; onPress: () => void }) {
  const fg = on ? mono.onInk : mono.ink;
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="radio"
      aria-checked={on}
      label={label}
      style={{ height: 60, borderRadius: 18, paddingLeft: 16, paddingRight: 18, gap: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: on ? mono.ink : mono.card }}>
      <View style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1.5px ${on ? mono.onInkRing : mono.line}` }}>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Path d={d} fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <MonoText v="optionLabel" wrap="wrap" color={fg} style={{ flex: 1, ...sans('400'), fontSize: 16, lineHeight: lhNormal(16) }}>
        {label}
      </MonoText>
      {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: mono.card }} /> : null}
    </Tap>
  );
}

function WherePage({ place, onPlace, onBack, onClose, onNext }: { place: UrgePlace; onPlace: (next: UrgePlace) => void; onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <SosQuestion left="back" onBack={onBack} onClose={onClose} dashes={3} hero={{ id: 'openDoor', top: 506, scale: 0.723 }} gap={18} cta="Continue" onCta={onNext}>
      <MonoText v="h1">Where are you right now?</MonoText>
      <Gap h={4} />
      <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
        {PLACES.map((item) => (
          <PlaceRow key={item.key} label={item.label} d={item.d} on={place === item.key} onPress={() => onPlace(item.key)} />
        ))}
      </View>
    </SosQuestion>
  );
}

// ── 30 · SOS Reason Picker · 30B · SOS Feeling Picker ───────────────────────

const TRIGGER_LABELS = URGE_TRIGGERS.map((c) => c.label);
const FEELING_LABELS = URGE_FEELINGS.map((c) => c.label);

/** The answers in the picker's own (canvas) order — the board follows the first of them (D251). */
const inCanvasOrder = (labels: readonly string[], picked: readonly string[]) => labels.filter((l) => picked.includes(l));

/**
 * Both pickers: `stack(136, gap 8)` — the question, "Select all that apply."
 * (15/22 mute), a 6 spacer, and the kit's chips (multi-select, D324), with the
 * frame's hero under them.
 */
function PickerPage({
  title,
  labels,
  picked,
  onPick,
  hero,
  dashes,
  onBack,
  onClose,
  onNext,
}: {
  title: string;
  labels: readonly string[];
  picked: string[];
  onPick: (next: string[]) => void;
  hero: { id: 'feedOff' | 'thunderCloud'; top: number; scale: number };
  dashes: number;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <SosQuestion left="back" onBack={onBack} onClose={onClose} dashes={dashes} hero={hero} gap={8} cta="Continue" onCta={onNext}>
      <MonoText v="h1">{title}</MonoText>
      <MonoText v="pTight" color={mono.mute}>
        Select all that apply.
      </MonoText>
      <Gap h={6} />
      <Chips multi options={labels} value={picked} onChange={onPick} />
    </SosQuestion>
  );
}

// ── 29B · 29C · 29D · the three moves ───────────────────────────────────────

/**
 * "Try a different step" moves to the next move, the third wrapping to the
 * first (D068); the pill is what leaves the sequence.
 */
function MovePage({ index, onClose, onNext, onAnother }: { index: number; onClose: () => void; onNext: () => void; onAnother: () => void }) {
  const move = MOVES[index];
  return (
    <HeroBoard
      key={`move-${index}`}
      nav={{ centre: { title: `Move ${MOVE_NUMERAL[index]} of 3` }, onClose }}
      hero={move.hero}
      title={move.title}
      body={move.body}
      cta="Continue"
      onCta={onNext}
      ghost="Try a different step"
      onGhost={onAnother}
    />
  );
}

// ── 32 · SOS Reassess ───────────────────────────────────────────────────────

/**
 * The second read's own five words — the first read asks how strong it is,
 * this one where it has got to — so index 1 is "Noticeable" where the first
 * says "Mild". Only index 1 is drawn.
 */
const REASSESS_BANDS = ['Gone', 'Noticeable', 'Still there', 'Strong', 'Peaking'];

/**
 * The frame's line is the way the urge went and the two reads, numbered 1–5:
 * "Coming down — from 4 to 2". The word follows the direction, never the
 * second read alone, so a rise cannot read "Coming down" (D254): down is
 * "Coming down" ("It passed" once it is gone — the old note for that read),
 * unmoved is "Holding steady — still at N" (the old middle note), up is
 * "Rising — from N to M" (app-authored, in the D-20 copy batch).
 */
function reassessLine(before: number, after: number): string {
  if (after === before) return after === 0 ? 'It passed' : `Holding steady — still at ${after + 1}`;
  const word = after > before ? 'Rising' : after === 0 ? 'It passed' : 'Coming down';
  return `${word} — from ${before + 1} to ${after + 1}`;
}

function ReassessPage({ before, after, onAfter, onBack, onClose, onNext }: { before: number; after: number; onAfter: (index: number) => void; onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <SosQuestion
      left="back"
      onBack={onBack}
      onClose={onClose}
      dashes={8}
      hero={{ id: 'thermometer', top: 506, scale: 1.062 }}
      gap={8}
      layer={
        <>
          <IntensityScale value={after} onChange={onAfter} previous={before} a11yLabels={REASSESS_BANDS} />
          <ScaleReading word={REASSESS_BANDS[after]} line={reassessLine(before, after)} />
        </>
      }
      layerBottom={506}
      cta="Continue"
      onCta={onNext}>
      <MonoText v="h1">Where is the urge now?</MonoText>
      <MonoText v="pTight" color={mono.mute}>
        Rate it again from 1–5.
      </MonoText>
    </SosQuestion>
  );
}

// ── 32B · SOS Afterward ─────────────────────────────────────────────────────

/**
 * The note grows a line at a time up to eight (30 each): the card is then
 * 284 tall and ends at canvas 549, 42 clear of the envelope's art (591), and
 * scrolls inside rather than running over it (sos-flow §3.11).
 */
const NOTE_MAX = 8 * 30;
const NOTE_SCROLL = {
  maxHeight: NOTE_MAX,
  // the kit hides a textarea's overflow (it only ever grows); a capped one scrolls
  ...(Platform.OS === 'web' ? ({ overflowY: 'auto', scrollbarWidth: 'none' } as unknown as TextStyle) : null),
};

/**
 * One sentence, filed on the event as its note. The frame draws the field
 * typed ("I need to say…" in ink with the caret after it, CRITIC C9): the
 * same words are the placeholder here, in the kit's `#9B968E`, and the
 * field grows with what is written, to `NOTE_MAX`.
 */
function AfterwardPage({ note, onNote, onClose, onNext }: { note: string; onNote: (next: string) => void; onClose: () => void; onNext: () => void }) {
  return (
    <SosQuestion onClose={onClose} hero={{ id: 'envelope', top: 506 }} gap={14} cta="Done" onCta={onNext}>
      <MonoText v="h1">One more thing.</MonoText>
      <MonoText v="p">The relationship doesn’t need solving tonight. Write the one thing you need to say tomorrow.</MonoText>
      <Gap h={6} />
      <TextField
        variant="note"
        value={note}
        onChangeText={onNote}
        placeholder="I need to say…"
        accessibilityLabel="What you need to say tomorrow"
        scrollEnabled
        inputStyle={NOTE_SCROLL}
      />
    </SosQuestion>
  );
}

// ── 33 · Surf Complete ──────────────────────────────────────────────────────

/** "Twenty-two minutes, start to finish." — the session's own length, in words (D255). */
function lengthLine(seconds: number): string {
  // no-break spaces keep 'start to finish' one unit when the line wraps
  if (seconds < 60) return 'You outlasted it. Under a minute, start\u00A0to\u00A0finish.';
  return `You outlasted it. ${minutesWords(seconds / 60)}, start\u00A0to\u00A0finish.`;
}

function DonePage({ seconds, onClose }: { seconds: number; onClose: () => void }) {
  return (
    <HeroBoard
      nav={{ onClose }}
      hero="lighthouse"
      title="The wave passed."
      body={lengthLine(seconds)}
      extra={
        <>
          <Gap h={2} />
          <Pill kind="checkin" label="Logged as ridden out" lead={<CheckinDisc done />} />
        </>
      }
      cta="Back to Today"
      onCta={onClose}
    />
  );
}

// ── the flow ────────────────────────────────────────────────────────────────

type FlowStep =
  | 'intro'
  | 'strength'
  | 'where'
  | 'place-said'
  | 'stand'
  | 'leave'
  | 'phone'
  | 'reason'
  | 'trigger-said'
  | 'feeling'
  | 'feeling-said'
  | 'reassess'
  | 'afterward'
  | 'sos'
  | 'done';

/**
 * The interrupt, in the canvas's own order (D037): each picker is followed by
 * the board the bundle draws for its answer, and the three moves sit between
 * the place's answer and the trigger picker. The canvas then runs Afterward →
 * The wave passed; the `sos` stages between them are the app's (D252).
 */
const FLOW: FlowStep[] = [
  'intro',
  'strength',
  'where',
  'place-said',
  'stand',
  'leave',
  'phone',
  'reason',
  'trigger-said',
  'feeling',
  'feeling-said',
  'reassess',
  'afterward',
  'sos',
  'done',
];

/**
 * Which board answers which option, by the key the frames are named with.
 * `SOS-Loc-Bathroom`, `SOS-Loc-Home-Alone`, `SOS-Feel-Anxious`, `-Numb`,
 * `-Ashamed`, `-Rejected` and `SOS-Trig-Rejection` have no option to reach
 * them (D038); the feeling ones come round on "Give me another", the other
 * three only on the mock build's `?board=` (D336).
 */
const PLACE_BOARD: Record<UrgePlace, SosBoardKey> = {
  private: 'SOS-Loc-Private-Room',
  bed: 'SOS-Loc-Bed',
  public: 'SOS-Loc-Public',
  work: 'SOS-Loc-Work',
  out: 'SOS-Loc-Elsewhere',
};

const TRIGGER_BOARD: Record<string, SosBoardKey> = {
  'Something online': 'SOS-Trig-Content',
  Doomscrolling: 'SOS-Trig-Doomscroll',
  'A stuck fantasy': 'SOS-Trig-Fantasy',
  'Phone in bed': 'SOS-Trig-Late-Phone',
  'Pure habit': 'SOS-Trig-Habit',
  'Can’t sleep': 'SOS-Trig-Cant-Sleep',
  'An argument': 'SOS-Trig-Argument',
  'Being alone': 'SOS-Trig-Alone',
  'I don’t know': 'SOS-Trig-Unknown',
};

const FEELING_BOARD: Record<string, SosBoardKey> = {
  'Turned on': 'SOS-Feel-Turned-On',
  Bored: 'SOS-Feel-Bored',
  Lonely: 'SOS-Feel-Lonely',
  'Stressed or anxious': 'SOS-Feel-Stressed',
  Angry: 'SOS-Feel-Angry',
  Low: 'SOS-Feel-Low',
  Tired: 'SOS-Feel-Tired',
  Restless: 'SOS-Feel-Restless',
  'I don’t know': 'SOS-Feel-Unknown',
};

/**
 * What "Give me another" rotates through: every board the feeling branch
 * draws, in the bundle's own order, including the four no option reaches and
 * the challenge board.
 */
const FEELING_ROTATION: SosBoardKey[] = [
  'SOS-Feel-Turned-On',
  'SOS-Feel-Bored',
  'SOS-Feel-Lonely',
  'SOS-Feel-Stressed',
  'SOS-Feel-Anxious',
  'SOS-Feel-Angry',
  'SOS-Feel-Low',
  'SOS-Feel-Rejected',
  'SOS-Feel-Tired',
  'SOS-Feel-Restless',
  'SOS-Feel-Numb',
  'SOS-Feel-Ashamed',
  'SOS-Feel-Unknown',
  'SOS-Challenge',
];

/** The step a board belongs to — where the mock build's `?board=` opens the flow (D336). */
function stepForBoard(key: SosBoardKey): FlowStep {
  if (key.startsWith('SOS-Loc-')) return 'place-said';
  if (key.startsWith('SOS-Trig-')) return 'trigger-said';
  return 'feeling-said';
}

/**
 * The First 90 Seconds, end to end. Behind `/urge` and `/rough-first90` both,
 * because the canvas draws one interrupt and the two doors lead to it.
 *
 * `board` (mock builds only — `src/app/urge.tsx` passes it from `?board=`)
 * opens the flow on that response board, so the three boards no answer
 * reaches can be drawn and checked; everything after it runs as usual.
 */
export function UrgeFlow({ board }: { board?: string } = {}) {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const forced = board && isSosBoardKey(board) ? board : undefined;
  const [index, setIndex] = useState(() => (forced ? FLOW.indexOf(stepForBoard(forced)) : 0));
  /** The board `?board=` asked for — its step's answer until that step's picker is answered. */
  const [override, setOverride] = useState<SosBoardKey | undefined>(forced);
  const overrideAt = (at: FlowStep) => (override && stepForBoard(override) === at ? override : undefined);
  const [band, setBand] = useState(3);
  const [place, setPlace] = useState<UrgePlace>('private');
  /** Multi-select (D324): every pick, in the order made — read in canvas order. */
  const [reasons, setReasons] = useState<string[]>([]);
  const [feelings, setFeelings] = useState<string[]>([]);
  /**
   * The second read, once answered. Until then it is "Noticeable" (index 1, the
   * frame's and the old default) — or the first read itself when that was
   * fainter, so an untouched board never opens on "Rising" nor files a rise
   * nobody reported (D254).
   */
  const [afterPick, setAfter] = useState<number | null>(null);
  const after = afterPick ?? Math.min(1, band);
  const [note, setNote] = useState('');
  /** How many times "Give me another" has been pressed on the feeling board. */
  const [roll, setRoll] = useState(0);
  const [sosStage, setSosStage] = useState(0);
  const [settings, setSettings] = useState<SosSettings>(DEFAULT_SOS_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** The finished session's length, for the relief board's sentence. */
  const [lasted, setLasted] = useState(0);
  const logged = useRef(false);
  // A lazy state initialiser, not `useRef(Date.now())`: the ref's initial value
  // is evaluated on every render, which makes the render impure.
  const [openedAt] = useState(() => Date.now());
  const startedAt = useRef(openedAt);
  const step = FLOW[index];

  const reasonsOrdered = inCanvasOrder(TRIGGER_LABELS, reasons);
  const feelingsOrdered = inCanvasOrder(FEELING_LABELS, feelings);
  const trigger = reasonsOrdered[0];
  const feeling = feelingsOrdered[0];

  // The feeling branch's suggestion: the board for the answer, then the next
  // one along each time "Give me another" is pressed.
  const feelingBoard = overrideAt('feeling-said') ?? FEELING_BOARD[feeling ?? ''] ?? 'SOS-Feel-Unknown';
  const suggestion = FEELING_ROTATION[(FEELING_ROTATION.indexOf(feelingBoard) + roll) % FEELING_ROTATION.length];

  // One clock for the whole SOS: every stage runs under it and it finishes the
  // session on its own at zero, whichever stage is on screen.
  const [surfProgress, setSurfProgress] = useState(0);
  const [surfRemaining, setSurfRemaining] = useState(SURF_SECONDS);
  const surfProgressRef = useRef(0);
  const inSos = step === 'sos';

  useEffect(() => {
    const session = newUrgeSession(bandToSeverity(band));
    startedAt.current = session.startedAt;
    void saveUrgeSession(session);
    void getJSON<SosSettings>(SOS_SETTINGS_KEY).then((stored) => {
      if (stored) setSettings({ ...DEFAULT_SOS_SETTINGS, ...stored });
    });
    return () => {
      void clearUrgeSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inSos) return;
    const from = Date.now() - surfProgressRef.current * SURF_SECONDS * 1000;
    const tick = () => {
      const elapsed = (Date.now() - from) / 1000;
      const nextProgress = Math.min(1, elapsed / SURF_SECONDS);
      surfProgressRef.current = nextProgress;
      setSurfProgress(nextProgress);
      setSurfRemaining(Math.max(0, Math.ceil(SURF_SECONDS - elapsed)));
    };
    tick();
    const clock = setInterval(tick, 250);
    return () => clearInterval(clock);
  }, [inSos]);

  const close = () => {
    void clearUrgeSession();
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  };
  const go = (to: (current: number) => number) => setIndex(to);
  const next = () => go((current) => Math.min(FLOW.length - 1, current + 1));
  const back = () => go((current) => Math.max(0, current - 1));
  /** A picker answered: its branch's board is the answer's again, not `?board=`'s. */
  const answer =
    <T,>(set: (v: T) => void, at: FlowStep) =>
    (v: T) => {
      if (overrideAt(at)) setOverride(undefined);
      set(v);
    };
  /** "Try a different step" — the next move board, the third wrapping to the first. */
  const otherMove = () =>
    go((current) => {
      const first = FLOW.indexOf('stand');
      return first + ((current - first + 1) % MOVES.length);
    });

  function finish() {
    if (logged.current) return;
    logged.current = true;
    const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    setLasted(seconds);
    // Completion is a local interaction: the relief board never waits for the
    // network; the event settles in the background.
    setIndex(FLOW.indexOf('done'));
    // The place, the feeling and what fed it go to `precedingState`, not to the
    // event's own `trigger` (the trigger chart's vocabulary). Every reason
    // picked is kept, in the picker's order; the feeling is the first picked,
    // in the picker's order — the field holds one (D251).
    void createEvent({
      type: 'urge_rode_out',
      severity: bandToSeverity(band),
      severityAfter: bandToSeverity(after),
      // what 85C and 85D read back: how long the wave actually took
      durationSeconds: seconds,
      note: note.trim() || undefined,
      precedingState: {
        location: PLACES.find((item) => item.key === place)?.label,
        feeling,
        reasons: reasonsOrdered.length ? reasonsOrdered : undefined,
      },
      /* A rejected mutation is how a missing `durationSeconds` argument once hid
         (FINDINGS F30): the write must not block the screen, but it says what
         it lost. */
    }).catch((error) => {
      if (__DEV__) console.warn('urge_rode_out was not written', error);
    });
    void setJSON('tideline.post.backondeck.pending', Date.now());
  }

  function logSlip() {
    void clearUrgeSession();
    // Replace, not push, so the surf clock is unmounted rather than left
    // running beneath the slip flow. D147: `/slip`, the post-slip flow.
    router.replace('/slip');
  }

  function saveSettings(nextSettings: SosSettings) {
    setSettings(nextSettings);
    void setJSON(SOS_SETTINGS_KEY, nextSettings);
  }

  const advance = () => setSosStage((current) => Math.min(SOS_ORDER.length - 1, current + 1));

  // The wave outlasts itself: at zero the session closes on the relief board.
  useEffect(() => {
    if (inSos && surfRemaining === 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inSos, surfRemaining]);

  const stage = SOS_ORDER[sosStage];
  const stageProps = {
    ctx: 'interrupt' as const,
    settings,
    onClose: close,
    onEnd: finish,
    onDone: advance,
    onSlip: logSlip,
    dots: { count: SOS_ORDER.length, active: sosStage },
    // over every stage, as the old flow drew it: a round that ends while the sheet is open does not close it
    overlay: <SosSettingsSheet open={settingsOpen} settings={settings} onChange={saveSettings} onDone={() => setSettingsOpen(false)} />,
  };

  switch (step) {
    case 'intro':
      return <IntroPage onClose={close} onNext={next} />;
    case 'strength':
      return <StrengthPage band={band} onBand={setBand} onBack={back} onClose={close} onNext={next} />;
    case 'where':
      return <WherePage place={place} onPlace={answer(setPlace, 'place-said')} onBack={back} onClose={close} onNext={next} />;
    case 'place-said':
      return <ResponsePage key="place" answer={overrideAt('place-said') ?? PLACE_BOARD[place]} onClose={close} onNext={next} onBack={back} />;
    case 'stand':
      return <MovePage index={0} onClose={close} onNext={next} onAnother={otherMove} />;
    case 'leave':
      return <MovePage index={1} onClose={close} onNext={next} onAnother={otherMove} />;
    case 'phone':
      return <MovePage index={2} onClose={close} onNext={next} onAnother={otherMove} />;
    case 'reason':
      return (
        <PickerPage
          key="reason"
          title="What’s feeding it right now?"
          labels={TRIGGER_LABELS}
          picked={reasons}
          onPick={answer(setReasons, 'trigger-said')}
          hero={{ id: 'feedOff', top: 506, scale: 1.071 }}
          dashes={4}
          onBack={back}
          onClose={close}
          onNext={next}
        />
      );
    case 'trigger-said':
      return <ResponsePage key="trigger" answer={overrideAt('trigger-said') ?? TRIGGER_BOARD[trigger ?? ''] ?? 'SOS-Trig-Unknown'} onClose={close} onNext={next} onBack={back} />;
    case 'feeling':
      return (
        <PickerPage
          key="feeling"
          title="What’s underneath it?"
          labels={FEELING_LABELS}
          picked={feelings}
          // a new answer starts its own board, not the old one shifted by earlier "Give me another"s
          onPick={(v: typeof feelings) => {
            setRoll(0);
            answer(setFeelings, 'feeling-said')(v);
          }}
          hero={{ id: 'thunderCloud', top: 506, scale: 1.1 }}
          dashes={5}
          onBack={back}
          onClose={close}
          onNext={next}
        />
      );
    case 'feeling-said':
      return (
        <ResponsePage
          key={`feeling-${suggestion}`}
          answer={suggestion}
          onClose={close}
          onNext={next}
          // back to the picker clears the rotation: Continue then shows the answer's own board again
          onBack={() => {
            setRoll(0);
            back();
          }}
          onAnother={() => setRoll((current) => current + 1)}
        />
      );
    case 'reassess':
      return <ReassessPage before={band} after={after} onAfter={setAfter} onBack={back} onClose={close} onNext={next} />;
    case 'afterward':
      return <AfterwardPage note={note} onNote={setNote} onClose={close} onNext={next} />;
    case 'sos':
      if (stage === 'breathe') return <BreatheStage {...stageProps} onSettings={() => setSettingsOpen(true)} />;
      if (stage === 'tap') return <TapStage {...stageProps} />;
      if (stage === 'odd') return <OddStage {...stageProps} />;
      return <WaveStage {...stageProps} progress={surfProgress} remaining={surfRemaining} />;
    case 'done':
      return <DonePage seconds={lasted} onClose={close} />;
  }
}
