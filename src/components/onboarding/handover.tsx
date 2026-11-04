/**
 * The handover — `38 · A Letter Arrived` … `41 · Medallion Earned`.
 *
 * Where the funnel stops asking and starts giving things: the letter from the
 * man at week XII, the vow, the first medallion. The reminders and day zero
 * (`O3Reminders`, `O3DayZero`) live in `reminders.tsx` (D390), so this file is
 * tail's alone.
 *
 * `Vici Overhaul` sets all four on the kit. The two arrivals are hero boards
 * (the `envelope` and the `medal`), without the ✕ the previous drop drew — the
 * boards' own buttons already do what it did (CRITIC §5, tail Q10). The letter
 * is a `#1E1E1E` card under a fade with its buttons over it; the vow is a
 * left-aligned stack and a ruled signature.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BeatLine, GhostLink, HeroBoard, MonoText, NavBar, PrimaryButton, Reveal, Screen, TypeBeat, useBeat, useCanvasTop, wasTyped } from '@/components/mono';
import { WEEK_XII_RUNS, type LetterRun } from '@/content/weekXiiLetter';
import { lhNormal, mono, sans, sansItalic } from '@/lib/theme';

import { Band } from './tail';

// ── 38 · A Letter Arrived (frame `Letter Received`) ──────────────────

/** The envelope, "A letter arrived.", `Open` over `Save it for later`. */
export function O3LetterArrived({ next, skip }: { next: () => void; skip: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="envelope"
      stackTop={451}
      gap={18}
      titleSize={26}
      title="A letter arrived."
      body="From you, twelve weeks from now."
      cta="Open"
      onCta={next}
      ghost="Save it for later"
      onGhost={skip}
      typeTitle
    />
  );
}

// ── 39 · A Letter From Week XII (frame `Letter Week XII`) ────────────

/**
 * The column scrolls in the card down to the primary's bottom edge (96) — under
 * the primary, never below it, so on a short phone no line shows through the
 * fade between `Continue` and `Keep this letter` (D219). Its end room lets the
 * last line rise 16 clear of the primary's top (58 + 16).
 */
const LETTER_VIEW_BOTTOM = 96;
const LETTER_END_PAD = 58 + 16;

/** A paragraph as runs: the frame's own when the words are the letter's, else the plain string. */
function runsOf(p: string): LetterRun[] {
  return WEEK_XII_RUNS.find((r) => r.map((x) => x.text).join('') === p) ?? [{ text: p }];
}

/**
 * The letter on a card (`left 24 right 24 top 112 bottom 0`, r 24 24 0 0,
 * `#1E1E1E`, padding 34 28 0, clipped): the eyebrow, the salutation, four
 * paragraphs at gap 14 (one run in 700 ink), and a 190 fade to the card's own
 * colour under `Continue` (bottom 96) and `Keep this letter` (bottom 60).
 *
 * At 852 the copy ends above the fade and nothing moves. On a shorter phone the
 * column scrolls inside the card, with room at its end to clear the buttons —
 * the fade and the buttons stay put.
 *
 * Props are the previous drop's, so `/letter?variant=week12` (letters group)
 * keeps calling it as it does: `paragraphs` are plain strings, and a paragraph
 * that is the letter's own picks its bold run back up from `WEEK_XII_RUNS`.
 * The ✕ does what it did (`next`) unless `onClose` says otherwise.
 */
/** The pause before each paragraph after the first, as a voice reading would take it: a breath, then a little longer after a long one. */
function readingDelays(paragraphs: string[]): number[] {
  let t = 0;
  return paragraphs.map((p, i) => {
    if (i > 0) t += Math.min(1100, 520 + paragraphs[i - 1].length * 3);
    return t;
  });
}

/**
 * One paragraph of the letter. `reading`: it fades up in its turn after the
 * salutation has been said — or at once, after a touch.
 */
function LetterParagraph({ reading, delay, children }: { reading?: boolean; delay: number; children: ReactNode }) {
  if (!reading) return <>{children}</>;
  return (
    <Reveal delay={delay} duration={520} lift={6}>
      {children}
    </Reveal>
  );
}

/** A touch anywhere on the letter finishes the salutation and brings the rest of the letter at once. It only watches. */
function LetterTouch({ onTouch, children }: { onTouch: () => void; children: ReactNode }) {
  const beat = useBeat();
  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponderCapture={() => {
        if (!beat.ready) beat.skip();
        onTouch();
        return false;
      }}>
      {children}
    </View>
  );
}

export function O3LetterRead({
  name,
  paragraphs,
  onKeep,
  next,
  onClose,
  reading,
}: {
  name: string;
  paragraphs: string[];
  onKeep: () => void;
  next: () => void;
  onClose?: () => void;
  /**
   * Read it to him (the onboarding step): the salutation is said, then the
   * paragraphs arrive one at a time, like a voice reading — a touch anywhere
   * brings the rest at once. Off, the letter is simply there (`/letter`).
   */
  reading?: boolean;
}) {
  const who = name.trim();
  const salutation = who ? `${who} —` : 'Friend —';
  // a letter already read this session (a Back from the vow) is simply there
  const [all, setAll] = useState(() => wasTyped(salutation));
  const delays = all ? paragraphs.map(() => 0) : readingDelays(paragraphs);
  const salutationStyle = { lineHeight: lhNormal(26), marginBottom: 18 };
  const buttons = (
    <>
      <PrimaryButton label="Continue" onPress={next} bottom={96} />
      <GhostLink label="Keep this letter" onPress={onKeep} />
    </>
  );
  const board = (
    <Screen>
      <NavBar left="empty" right="close" onClose={onClose ?? next} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 112, bottom: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: mono.card, overflow: 'hidden' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentInsetAdjustmentBehavior="never"
          style={{ marginBottom: LETTER_VIEW_BOTTOM }}
          contentContainerStyle={{ paddingTop: 34, paddingHorizontal: 28, paddingBottom: LETTER_END_PAD }}>
          <MonoText v="caps" wrap="wrap" style={{ marginBottom: 18 }}>
            {who ? `Week XII, from ${who}` : 'Week XII, from you'}
          </MonoText>
          {reading ? (
            <BeatLine v="h1" wrap="wrap" style={salutationStyle} text={salutation} speed={0.6} delay={260} />
          ) : (
            <MonoText v="h1" wrap="wrap" style={salutationStyle}>
              {salutation}
            </MonoText>
          )}
          <View style={{ gap: 14 }}>
            {paragraphs.map((p, i) => (
              <LetterParagraph key={i} reading={reading} delay={delays[i]}>
                <MonoText v="p" wrap="wrap">
                  {runsOf(p).map((r, k) =>
                    r.bold ? (
                      <MonoText key={k} v="p" style={{ ...sans('700'), color: mono.ink }}>
                        {r.text}
                      </MonoText>
                    ) : (
                      r.text
                    ),
                  )}
                </MonoText>
              </LetterParagraph>
            ))}
          </View>
        </ScrollView>
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(30,30,30,0)', mono.card, mono.card]}
        locations={[0, 0.6, 1]}
        style={{ position: 'absolute', left: 24, right: 24, bottom: 0, height: 190 }}
      />
      {reading ? (
        <Reveal delay={all ? 0 : 420} style={StyleSheet.absoluteFill}>
          {buttons}
        </Reveal>
      ) : (
        buttons
      )}
    </Screen>
  );
  if (!reading) return board;
  return (
    <TypeBeat id="letter" instant={wasTyped(salutation)}>
      <LetterTouch onTouch={() => setAll(true)}>{board}</LetterTouch>
    </TypeBeat>
  );
}

// ── 40 · The Vow ─────────────────────────────────────────────────────

const VOW =
  'I’m giving this twelve weeks. I don’t need to be perfect. When I want to watch, I’ll use the plan first. If I have a bad day, I’ll come back the next day.';

/** The signature block: the 47.5 ruled name, 10, the 16 line under it. */
const SIG_H = 74;
/** The controls' reach off the bottom edge: `Sign` at 96 + 58. */
const VOW_CONTROLS = 96 + 58;

/**
 * "Day 0, Jun 9" over "The vow." (40/46), the vow itself (21/33 ink), and his
 * name in Lato 700 italic on a 1.5 ink rule, "Signed on day 0" under it. `Sign`
 * over `Not now`; the ✕ is `Not now`.
 *
 * The signature hangs at 530. On a shorter phone it first rises into the ground
 * between the vow and itself (keeping 24 under the vow), so it never sits under
 * `Sign`; only if that is not enough does the band lift or scroll (D320).
 */
export function O3TheVow({ name, date, onSign, skip }: { name: string; date: string; onSign: () => void; skip: () => void }) {
  const who = name.trim() || 'Friend';
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [stackH, setStackH] = useState(238);
  const sigTop = Math.max(150 + stackH + 24, Math.min(530, winH - canvasTop - VOW_CONTROLS - 16 - SIG_H));
  // "The vow." is said; the vow itself, then his signature, then `Sign` follow it
  return (
    <TypeBeat id="vow" instant={wasTyped('The vow.')} tapToFinish>
      <Screen>
        <NavBar left="empty" right="close" onClose={skip} />
        <Band start={150} end={sigTop + SIG_H} bottom={VOW_CONTROLS}>
          <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: 150, gap: 18 }}>
            <MonoText v="caps">{date}</MonoText>
            <BeatLine v="h1" style={{ fontSize: 40, lineHeight: 46 }} text="The vow." speed={0.7} />
            {/* the frame states no text-wrap; `pretty` breaks it as drawn at 393 and keeps
                a narrower phone from leaving "day." alone on the last line (D219) */}
            <Reveal duration={480}>
              <MonoText v="p" wrap="pretty" color={mono.ink} style={{ fontSize: 21, lineHeight: 33, marginTop: 8 }}>
                {VOW}
              </MonoText>
            </Reveal>
          </View>
          <Reveal delay={260} style={{ position: 'absolute', left: 24, right: 24, top: sigTop }}>
            <MonoText
              v="h1"
              wrap="wrap"
              style={{ ...sansItalic(), fontSize: 30, lineHeight: lhNormal(30), letterSpacing: -0.5, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: mono.ink }}>
              {who}
            </MonoText>
            <MonoText v="caps" wrap="wrap" style={{ marginTop: 10, letterSpacing: 0.5 }}>
              Signed on day 0
            </MonoText>
          </Reveal>
        </Band>
        <Reveal delay={380} style={StyleSheet.absoluteFill}>
          <PrimaryButton label="Sign" onPress={onSign} bottom={96} />
          <GhostLink label="Not now" onPress={skip} />
        </Reveal>
      </Screen>
    </TypeBeat>
  );
}

// ── 41 · Medallion Earned (frame `Medallion Received`) ───────────────

/** The medal at 190 (scale 1), "Veni" over "Your first medallion." and "You started.", `Continue`. */
export function O3MedallionEarned({ eyebrow, title, body, next }: { eyebrow: string; title: string; body: string; next: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="medal"
      stackTop={452}
      gap={12}
      caps={eyebrow}
      titleSize={26}
      title={title}
      body={body}
      cta="Continue"
      onCta={next}
      typeTitle
      heroStrike
    />
  );
}
