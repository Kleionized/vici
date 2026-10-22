import { LinearGradient } from 'expo-linear-gradient';
import { Children, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Check, EASE_OUT, GhostLink, HeroBoard, LaurelMark, MonoText, MS, NavBar, popStyle, PrimaryButton, riseStyle, Screen, useMotion } from '@/components/mono';
import { Grain } from '@/components/ui/Grain';
import { lhNormal, mono, sans, sansItalic } from '@/lib/theme';


/**
 * The post — every piece of it arrives the same way and is read the same way
 * (`90B · VICI Post — Arrival`, `39 · The Letter — Read`, `39B · Post —
 * Medallion Letter`; CRITIC C8: Letter Arrival is the arrival for both posts).
 */

/**
 * `90B · VICI Post — Arrival`: the envelope hero at 200 (×1.1), the stack at
 * 486 — "The post is in.", the line under it — `Read` over `Tonight`, and the ✕.
 */
export function PostArrival({ onRead, onLater, onClose }: { onRead: () => void; onLater: () => void; onClose: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'close', onClose }}
      hero="envelope"
      heroTop={200}
      stackTop={486}
      title="A letter came."
      body="It takes a minute to read."
      cta="Read"
      onCta={onRead}
      ghost="Read later"
      onGhost={onLater}
    />
  );
}

/** The paper (D61, dark since D62): the app's card for the sheet, its ink and sub ink on it, a faint grain. */
export const PAPER = { sheet: mono.card, ink: mono.ink, body: mono.sub, mute: mono.mute } as const;
const NOISE = require('../../../assets/images/noise.png');
/** where a letter's sheet ends: 20 above the primary (96 + 58) */
export const PAPER_FOOT = 96 + 58 + 20;
/** the fade at the sheet's foot, so a long letter runs under it */
const FADE = 44;

/** When each part of the letter arrives as it opens (ms): the sheet, its folds easing out, the words, the seal. */
const OPEN = { sheet: 60, folds: 520, words: 480, step: 110 } as const;

const SHEET_IN = {
  from: { opacity: 0, transform: [{ translateY: 110 }, { rotate: '-2.5deg' }, { scale: 0.96 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { rotate: '0deg' }, { scale: 1 }] },
};
const FOLDS_EASE = { from: { opacity: 1 }, to: { opacity: 0.6 } };

/** One of the two folds: a wide, faint valley of shade across the sheet at `at` (a share of its height) — shading, never a line. */
function Fold({ at, motion }: { at: string; motion: boolean }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: 0, right: 0, top: at as `${number}%`, height: 90, marginTop: -45 },
        motion ? ({ animationName: FOLDS_EASE, animationDuration: 900, animationDelay: OPEN.folds, animationFillMode: 'both', animationTimingFunction: EASE_OUT } as object) : { opacity: 0.6 },
      ]}>
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.28)', 'rgba(255,255,255,0.045)', 'rgba(255,255,255,0)']} locations={[0, 0.5, 0.56, 1]} style={{ flex: 1 }} />
    </Animated.View>
  );
}

/**
 * The letter as a letter (D61): a sheet rather than a card — dark, as the app
 * is (D62), with a grain, small corners and a shadow under it; the letterhead (the
 * laurel and VICI, the date); the two folds it was sent in, as soft shading;
 * and the words in ink. It opens by sliding up out of its envelope as it
 * straightens, its folds easing out, then the words arrive in turn and the
 * seal last. The sheet scrolls on a phone too short for the letter.
 */
export function LetterPaper({
  top,
  bottom,
  inset = 16,
  date,
  children,
}: {
  top: number;
  bottom: number;
  inset?: number;
  /** the day it came, under the letterhead */
  date?: string;
  children: ReactNode;
}) {
  const motion = useMotion();
  const parts = Children.toArray(children);
  return (
    <Animated.View
      style={[
        { position: 'absolute', left: inset, right: inset, top, bottom, borderRadius: 5, backgroundColor: PAPER.sheet, boxShadow: '0 22px 44px rgba(0,0,0,0.7)' },
        motion ? ({ animationName: SHEET_IN, animationDuration: 760, animationDelay: OPEN.sheet, animationFillMode: 'backwards', animationTimingFunction: EASE_OUT } as object) : null,
      ]}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 5, overflow: 'hidden' }}>
        <Grain source={NOISE} opacity={0.06} />
        <Fold at="33.3%" motion={motion} />
        <Fold at="66.6%" motion={motion} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 26, paddingBottom: FADE + 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 26 }}>
            <LaurelMark size={24} style={{ tintColor: PAPER.ink }} />
            <MonoText v="caps" color={PAPER.ink} style={{ letterSpacing: 2.4, fontSize: 12 }}>
              VICI
            </MonoText>
            <View style={{ flex: 1 }} />
            {date ? (
              <MonoText v="caps" color={PAPER.mute} style={{ fontSize: 12 }}>
                {date}
              </MonoText>
            ) : null}
          </View>
          <View style={{ gap: 16 }}>
            {parts.map((part, i) => (
              <Animated.View key={i} style={riseStyle(motion, { delay: OPEN.words + i * OPEN.step, distance: 8, duration: MS.slow })}>
                {part}
              </Animated.View>
            ))}
          </View>
        </ScrollView>
        <LinearGradient pointerEvents="none" colors={['rgba(30,30,30,0)', PAPER.sheet]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: FADE }} />
      </View>
    </Animated.View>
  );
}

/**
 * The letter read (`39`, `39B`): the frame, the nav's title, the letter on its
 * paper (`left 16 right 16 top 112`, its foot 20 above the primary), the
 * primary at bottom 96 over the ghost at 60. `primaryDone` puts a tick on the
 * primary.
 */
export function LetterCard({
  title,
  onClose,
  primary,
  onPrimary,
  primaryDone,
  ghost,
  onGhost,
  date,
  children,
}: {
  title: string;
  onClose: () => void;
  primary: string;
  onPrimary: () => void;
  /** the primary has done its work (a letter saved): it carries a tick */
  primaryDone?: boolean;
  ghost: string;
  onGhost: () => void;
  date?: string;
  children: ReactNode;
}) {
  return (
    <Screen variant="letter">
      <NavBar left="empty" centre={{ title }} right="close" onClose={onClose} />
      <LetterPaper top={112} bottom={PAPER_FOOT} date={date}>
        {children}
      </LetterPaper>
      <PrimaryButton label={primary} onPress={onPrimary} bottom={96} icon={primaryDone ? <Check size={14} color={mono.onInk} /> : undefined} />
      <GhostLink label={ghost} onPress={onGhost} />
    </Screen>
  );
}

/** "Dear Sam," — 22/700, −0.3, in ink. */
export function Salutation({ children }: { children: ReactNode }) {
  return (
    <MonoText v="h1Sheet" wrap="wrap" color={PAPER.ink} style={{ lineHeight: lhNormal(22), letterSpacing: -0.3 }}>
      {children}
    </MonoText>
  );
}

/** A paragraph: 15.5/25, pretty, in the paper's body ink. `children` may carry a `Strong` run. */
export function LetterP({ children }: { children: ReactNode }) {
  return (
    <MonoText v="p" wrap="pretty" color={PAPER.body} style={{ fontSize: 15.5, lineHeight: 25 }}>
      {children}
    </MonoText>
  );
}

/** The 700 ink run inside a paragraph (the reason, in his own words). */
export function Strong({ children }: { children: ReactNode }) {
  return <MonoText style={{ ...sans('700'), fontSize: 15.5, lineHeight: 25, color: PAPER.ink }}>{children}</MonoText>;
}

/** The sign-off: the name in italic, as signed, and VICI's seal beside it, landing last. */
export function Signoff({ children }: { children: ReactNode }) {
  const motion = useMotion();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 }}>
      <MonoText v="p" color={PAPER.ink} style={{ ...sansItalic(), fontSize: 24, lineHeight: 30 }}>
        {children}
      </MonoText>
      <Animated.View
        style={[
          { width: 34, height: 34, borderRadius: 17, backgroundColor: PAPER.ink, alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' },
          popStyle(motion, { delay: 1100, duration: MS.slow + 120 }),
        ]}>
        <MonoText v="caps" color={mono.onInk} style={{ fontSize: 14, letterSpacing: 0 }}>
          V
        </MonoText>
      </Animated.View>
    </View>
  );
}
