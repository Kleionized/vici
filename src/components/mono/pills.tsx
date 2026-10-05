import type { ReactNode } from 'react';
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { lhNormal, mono, monoDark, ring, sans } from '@/lib/theme';

import { ArrowUp, Check, Flame } from './icons';
import { Tap } from './Tap';
import { MonoText } from './Text';

/** A pill's run: 700 at `size`, `line-height: normal` (the span is a flex item, so its own font sizes the box). */
const run = (size: number, color: string, extra?: TextStyle): TextStyle => ({ ...sans('700'), fontSize: size, lineHeight: lhNormal(size), color, ...extra });

/**
 * Every pill the frames draw (design-system §7.17), as `kind`:
 *
 * | kind | box | type | where |
 * | --- | --- | --- | --- |
 * | `range` | h32 r16 card, padding 0 14 (+ 8 ink dot, gap 8, with `dot`) | 13/700 ink | nav right: Urge Overview, Weekly Report, Score Detail |
 * | `badge` | h28 r14 ink, padding 0 12 | 12/700 `#111111` | Manage Subscription "Active", Yearly Drop "Save 74%" |
 * | `status` | h36 r18 card (ink with `filled`), padding 0 14 | 13/700 ink (`#111111`) | Your Vow Page |
 * | `darkTag` | h36 r18 card + 1px `rgba(255,255,255,0.15)` ring, padding 0 14 | 13/700 `#FFFFFF` | Urge Hub Now |
 * | `place` | h44 r22 ink, padding 0 18 | 15/700 `#111111` | Where We’d Start |
 * | `lessonTag` | h24 r12 ink, padding 0 10 | 13/700/16 `#111111` | lesson timeline "Change this part" |
 * | `outline` | h34 r17 card + line ring, padding 0 16 | 13/700 ink | Starting Score |
 * | `streak` | h36 r18 card, padding 0 12 0 10, gap 6, Flame 16×18 | 15/700 ink | Today Home |
 * | `delta` | h30 r15 card, padding 0 12, gap 5, ArrowUp 10 | 14/700 ink | Today Home |
 * | `checkin` | h44 r22 card, padding 0 18 0 8, gap 10, a 30 disc (`lead`) | 15/700 ink | Today Home, Surf Complete |
 *
 * A pill is as wide as its words. In a column parent pass `inline` (the canvas's
 * `inline-flex`), which stops it stretching to the column's width.
 *
 * `streak` and `delta` draw their own glyph unless `lead` is given (`lead={null}`
 * draws none). A negative delta passes `down` — the up arrow turned over, as
 * today-day §5 asks; a zero delta is hidden by the screen, not drawn.
 */
export type PillKind = 'range' | 'badge' | 'status' | 'darkTag' | 'place' | 'lessonTag' | 'outline' | 'streak' | 'delta' | 'checkin';

const PILL: Record<PillKind, { h: number; pl: number; pr: number; gap: number; bg: string; ring?: string; text: TextStyle }> = {
  range: { h: 32, pl: 14, pr: 14, gap: 8, bg: mono.card, text: run(13, mono.ink) },
  badge: { h: 28, pl: 12, pr: 12, gap: 6, bg: mono.ink, text: run(12, mono.onInk) },
  status: { h: 36, pl: 14, pr: 14, gap: 8, bg: mono.card, text: run(13, mono.ink) },
  darkTag: { h: 36, pl: 14, pr: 14, gap: 8, bg: mono.card, ring: ring.chipDark, text: run(13, monoDark.text) },
  place: { h: 44, pl: 18, pr: 18, gap: 8, bg: mono.ink, text: run(15, mono.onInk) },
  lessonTag: { h: 24, pl: 10, pr: 10, gap: 6, bg: mono.ink, text: run(13, mono.onInk, { lineHeight: 16 }) },
  outline: { h: 34, pl: 16, pr: 16, gap: 8, bg: mono.card, ring: ring.outline, text: run(13, mono.ink) },
  streak: { h: 36, pl: 10, pr: 12, gap: 6, bg: mono.card, text: run(15, mono.ink) },
  delta: { h: 30, pl: 12, pr: 12, gap: 5, bg: mono.card, text: run(14, mono.ink) },
  checkin: { h: 44, pl: 8, pr: 18, gap: 10, bg: mono.card, text: run(15, mono.ink) },
};

export function Pill({
  kind = 'range',
  label,
  filled,
  dot,
  lead,
  down,
  inline,
  onPress,
  accessibilityLabel,
  style,
}: {
  kind?: PillKind;
  label: string;
  /** `status`: the ink-filled one ("Held for 92 days") */
  filled?: boolean;
  /** `range`: the 8×8 ink dot before the words (Score Detail "Navigator II") */
  dot?: boolean;
  /** what sits before the words — the check-in chip's 30 disc (`CheckinDisc`); replaces streak's flame and delta's arrow, `null` for none */
  lead?: ReactNode;
  /** `delta`: the score went down — the arrow points down (undrawn; the frames only show a rise) */
  down?: boolean;
  /** the canvas's `inline-flex` in a column: hug the words instead of stretching */
  inline?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = PILL[kind];
  const ink = kind === 'status' && filled;
  const box: ViewStyle = {
    height: p.h,
    borderRadius: p.h / 2,
    paddingLeft: p.pl,
    paddingRight: p.pr,
    gap: p.gap,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ink ? mono.ink : p.bg,
    boxShadow: p.ring,
    alignSelf: inline ? 'flex-start' : undefined,
  };
  let glyph: ReactNode = null;
  if (lead !== undefined) glyph = lead;
  else if (kind === 'streak') glyph = <Flame />;
  else if (kind === 'delta') glyph = down ? <View style={{ transform: [{ rotate: '180deg' }] }}><ArrowUp /></View> : <ArrowUp />;
  else if (kind === 'range' && dot) glyph = <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mono.ink }} />;
  const body = (
    <>
      {glyph}
      <MonoText v="pill" wrap="nowrap" style={[p.text, ink ? { color: mono.onInk } : null]}>
        {label}
      </MonoText>
    </>
  );
  if (onPress) {
    return (
      <Tap onPress={onPress} label={accessibilityLabel} hitSlop={p.h < 44 ? { top: (44 - p.h) / 2, bottom: (44 - p.h) / 2 } : undefined} style={[box, style]}>
        {body}
      </Tap>
    );
  }
  return (
    <View accessibilityLabel={accessibilityLabel} style={[box, style]}>
      {body}
    </View>
  );
}

/**
 * The check-in chip's 30 disc (Today Home, Surf Complete): `tone` is a
 * `#1E1E1E` disc with the line ring and a 14 dot of that tone ("Fine"); `icon`
 * a transparent ringed disc holding a glyph ("Low energy"'s bolt); `done` the
 * ink disc with a 13 check ("Logged as ridden out").
 */
export function CheckinDisc({ tone, icon, done }: { tone?: string; icon?: ReactNode; done?: boolean }) {
  if (done) return <CheckDisc size={30} />;
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: tone ? mono.card : undefined,
        boxShadow: ring.outline,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {tone ? <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: tone }} /> : icon}
    </View>
  );
}

/** The check each disc size carries in the frames (design-system §7.23). */
const GLYPH: Record<number, number> = { 22: 11, 24: 12, 26: 13, 28: 12, 30: 13, 32: 13, 34: 14, 36: 14, 40: 16, 52: 20, 84: 36, 96: 34, 132: 56 };

/**
 * A round check (design-system §7.23). `done` — the ink disc with a `#111111`
 * check, every size from the 22 of the check rows to the 132 of Morning 5 Done
 * (the glyph size per disc is the frames', override with `glyph`). `inverse` —
 * Paywall's selected-plan radio: a `#1E1E1E` disc with an ink check on the ink
 * card. `pending` — the step list's hollow `#1E1E1E` disc with the line ring;
 * `current` — the same with an ink ring and an 8 ink dot. `empty` — a
 * transparent disc with only the line ring (Paywall's unselected radio, and a
 * record row's negative).
 * The glyph keeps its `0 0 14 14` viewBox, so its 2.2 stroke scales with it.
 */
export function CheckDisc({
  size = 22,
  state = 'done',
  glyph,
  style,
}: {
  size?: number;
  state?: 'done' | 'inverse' | 'pending' | 'current' | 'empty';
  glyph?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const g = glyph ?? (state === 'inverse' && size === 22 ? 12 : (GLYPH[size] ?? Math.round(size * 0.45)));
  const bg = state === 'done' ? mono.ink : state === 'empty' ? undefined : mono.card;
  const shadow = state === 'pending' || state === 'empty' ? ring.outline : state === 'current' ? ring.outlineInk : undefined;
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, boxShadow: shadow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
        style,
      ]}>
      {state === 'done' ? <Check size={g} /> : null}
      {state === 'inverse' ? <Check size={g} color={mono.ink} /> : null}
      {state === 'current' ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mono.ink }} /> : null}
    </View>
  );
}
