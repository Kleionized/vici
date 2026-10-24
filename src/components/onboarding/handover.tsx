/**
 * The handover — `38 · A Letter Arrived` … `41 · Medallion Earned`.
 *
 * Where the funnel stops asking and starts giving things: VICI's letter written
 * as him at week XII, the vow, the first medallion. The reminders and day zero
 * (`O3Reminders`, `O3DayZero`) live in `reminders.tsx` (D390), so this file is
 * tail's alone.
 *
 * `Vici Overhaul` sets all four on the kit. The two arrivals are hero boards
 * (the `envelope` and the `medal`), without the ✕ the previous drop drew — the
 * boards' own buttons already do what it did (CRITIC §5, tail Q10). The letter
 * is a `#1E1E1E` card under a fade with its buttons over it; the vow is a
 * left-aligned stack and a ruled signature.
 */
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GhostLink, HeroBoard, HoldButton, MonoText, NavBar, PrimaryButton, riseStyle, Screen, useCanvasTop, useMotion } from '@/components/mono';
import { WEEK_XII_RUNS, type LetterRun } from '@/content/weekXiiLetter';
import { VOW_TEXT } from '@/lib/pledge';
import { lhNormal, mono, sansItalic } from '@/lib/theme';
import { useSuccessHaptic } from '@/lib/haptics';

import { LetterP, LetterPaper, PAPER, PAPER_FOOT, Strong } from '@/components/keepsakes/Letter';

import { Band } from './tail';

// ── 38 · A Letter Arrived (frame `Letter Received`) ──────────────────

/**
 * The letter's one honest line (D476): the frame's "From you, twelve weeks from
 * now." presented a letter VICI wrote — the same for everyone — as his own.
 * Shared with `/letter?variant=week12`, which re-opens the same board.
 */
export const WEEK_XII_FROM = 'From VICI, written as you at week twelve.';

/** The envelope, "A letter came.", `Open` over `Save it for later`. */
export function O3LetterArrived({ next, skip }: { next: () => void; skip: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="envelope"
      heroTop={181}
      stackTop={442}
      gap={18}
      titleSize={26}
      title="A letter came."
      body={WEEK_XII_FROM}
      cta="Open"
      onCta={next}
      ghost="Save it for later"
      onGhost={skip}
    />
  );
}

// ── 39 · A Letter From Week XII (frame `Letter Week XII`) ────────────


/** A paragraph as runs: the frame's own when the words are the letter's, else the plain string. */
function runsOf(p: string): LetterRun[] {
  return WEEK_XII_RUNS.find((r) => r.map((x) => x.text).join('') === p) ?? [{ text: p }];
}

/**
 * The letter on a card (`left 24 right 24 top 112 bottom 0`, r 24 24 0 0,
 * `#1E1E1E`, padding 34 28 0, clipped): the salutation, four
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
export function O3LetterRead({
  name,
  paragraphs,
  onKeep,
  next,
  onClose,
}: {
  name: string;
  paragraphs: string[];
  onKeep: () => void;
  next: () => void;
  onClose?: () => void;
}) {
  const who = name.trim();
  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={onClose ?? next} />
      {/* on the letter's paper, opening as every letter does (D61) */}
      <LetterPaper top={112} bottom={PAPER_FOOT}>
        <MonoText v="h1" wrap="wrap" color={PAPER.ink} style={{ lineHeight: lhNormal(26) }}>
          {/* a no-break space keeps the dash with the name however long it is */}
          {who ? `${who}\u00A0—` : 'Friend\u00A0—'}
        </MonoText>
        {paragraphs.map((p, i) => (
          <LetterP key={i}>
            {runsOf(p).map((r, k) => (r.bold ? <Strong key={k}>{r.text}</Strong> : r.text))}
          </LetterP>
        ))}
      </LetterPaper>
      <PrimaryButton label="Continue" onPress={next} bottom={96} />
      <GhostLink label="Keep this letter" onPress={onKeep} />
    </Screen>
  );
}

// ── 40 · The Vow ─────────────────────────────────────────────────────

/**
 * The vow's words (`VOW_TEXT`, `src/lib/pledge.ts`). Signing files them as his
 * `Vow` journal entry (D474), which `/vow` reads back with the day he signed.
 */

/** The signature block: the 47.5 ruled name, 10, the 16 line under it. */
const SIG_H = 74;
/** The controls' reach off the bottom edge: the hold at 96 + 58. */
const VOW_CONTROLS = 96 + 58;

/**
 * "The vow." (40/46) at 184, the vow itself (21/33 ink), and his name in Lato
 * 700 italic on a 1.5 ink rule, "Signed on Day 0, Jun 9" (14/400 mute) under
 * it. `Sign` over `Not now`; the ✕ is `Not now`.
 *
 * The signature hangs at 530. On a shorter phone it first rises into the ground
 * between the vow and itself (keeping 24 under the vow), so it never sits under
 * `Sign`; only if that is not enough does the band lift or scroll (D320).
 *
 * Signing is a hold (D64): "Hold to commit" fills over three seconds with
 * touches that grow as it fills, and his name inks in along the rule as it
 * does. Let go early and both drain back. His three values (34A) sit under
 * the vow: what he is committing for.
 */
export function O3TheVow({ name, date, values = [], onSign, skip }: { name: string; date: string; values?: string[]; onSign: () => void; skip: () => void }) {
  const who = name.trim() || 'Friend';
  const motion = useMotion();
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [stackH, setStackH] = useState(204);
  const [signed, setSigned] = useState(false);
  const [sigW, setSigW] = useState(0);
  const fill = useSharedValue(0);
  const inked = useAnimatedStyle(() => ({ width: fill.value * sigW }));
  const sigTop = Math.max(184 + stackH + 24, Math.min(530, winH - canvasTop - VOW_CONTROLS - 16 - SIG_H));
  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={skip} />
      <Band start={184} end={sigTop + SIG_H} bottom={VOW_CONTROLS}>
        <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: 184, gap: 18 }}>
            <MonoText v="h1" style={{ fontSize: 40, lineHeight: 46 }}>
              The vow.
            </MonoText>
            {/* the frame states no text-wrap; `pretty` breaks it as drawn at 393 and keeps
                a narrower phone from leaving "day." alone on the last line (D219) */}
            <MonoText v="p" wrap="pretty" color={mono.ink} style={{ fontSize: 21, lineHeight: 33, marginTop: 8 }}>
              {VOW_TEXT}
            </MonoText>
            {values.length ? (
              <Animated.View style={[{ gap: 6 }, riseStyle(motion, { delay: 200 })]}>
                <MonoText v="caps">For</MonoText>
                <MonoText v="gridLabel">{values.join(' · ')}</MonoText>
              </Animated.View>
            ) : null}
          </View>
          <View style={{ position: 'absolute', left: 24, right: 24, top: sigTop }} onLayout={(e) => setSigW(e.nativeEvent.layout.width)}>
            {/* the name faint on the rule, and inked over it as far as the hold has filled */}
            <MonoText
              v="h1"
              wrap="wrap"
              color={mono.art}
              style={{ ...sansItalic(), fontSize: 30, lineHeight: lhNormal(30), letterSpacing: -0.5, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: mono.signRule }}>
              {who}
            </MonoText>
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0, overflow: 'hidden' }, inked]}>
              <MonoText
                v="h1"
                wrap="nowrap"
                numberOfLines={1}
                style={{ ...sansItalic(), width: sigW, fontSize: 30, lineHeight: lhNormal(30), letterSpacing: -0.5, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: mono.ink }}>
                {who}
              </MonoText>
            </Animated.View>
            <MonoText v="p" wrap="wrap" color={mono.mute} style={{ marginTop: 10, fontSize: 14, lineHeight: lhNormal(14) }}>
              {signed ? `Signed on ${date}` : 'Hold the button to sign.'}
            </MonoText>
          </View>
      </Band>
      <HoldButton
        label="Hold to commit"
        holdingLabel="Keep holding"
        doneLabel="Signed"
        bottom={96}
        progress={fill}
        done={signed}
        onComplete={() => {
          setSigned(true);
          // the signed board stays a moment, then the funnel moves on
          setTimeout(onSign, 900);
        }}
      />
      <GhostLink label="Not now" onPress={skip} />
    </Screen>
  );
}

// ── 41 · Medallion Earned (frame `Medallion Received`) ───────────────

/** The medal at 190 (scale 1), "Veni." over "Your first medallion. You started.", `Continue`. */
export function O3MedallionEarned({ title, body, next }: { title: string; body: string; next: () => void }) {
  // the first medallion: the completion's touch (D59)
  useSuccessHaptic();
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="medal"
      stackTop={480}
      gap={12}
      titleSize={26}
      title={title}
      body={body}
      cta="Continue"
      onCta={next}
    />
  );
}
