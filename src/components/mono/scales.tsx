import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { mono, monoDark, ring, toneRamp } from '@/lib/theme';

import { Tap } from './Tap';
import { MonoText } from './Text';

/**
 * The scales the frames draw (design-system §7.20–7.22): the Urge Hub's pager
 * dots, the five tone discs (Morning Feeling, Night 1 Mood), the five intensity
 * bars (SOS Strength / Reassess, Urge Log Intensity) and Morning Energy's
 * fill meter, plus the word-and-line reading every scale screen sets under it
 * at canvas 440.
 *
 * Values are the app's own: a 0-based index into five (the dials and the urge
 * bands already store 0–4). Each piece sits at its canvas `top` (232 on every
 * frame) unless `inline`, which leaves it in flow for a scrolling layout.
 */

function place(top: number, inline: boolean | undefined): ViewStyle {
  return inline ? { position: 'relative' } : { position: 'absolute', left: 0, right: 0, top };
}

const FIVE = [0, 1, 2, 3, 4] as const;

// ── pager dots ──

/**
 * Each dot's touch area: 44 tall, and as wide as the 7 gap allows without two
 * dots' areas meeting (6 + 3 + 3 = 12 of the 13 between centres). Growing the
 * dot instead would move the row off the frame.
 */
const DOT_SLOP = { top: 19, bottom: 19, left: 3, right: 3 };

/**
 * `left 0 right 0 bottom 180; gap 7` → five 6×6 r3 dots. The frames (the five
 * Urge Hub pages, all dark) keep every dot 6 wide — the kit's 18-wide active
 * dot is not drawn. `tone: 'light'` is the same row in ink and line for a
 * standard ground (no frame draws one).
 *
 * With `onChange` each dot is a control that jumps to its page (the Urge Hub's
 * dots are, labelled "Pane N"); the box is the same 6×6, the touch area grows
 * by `hitSlop`. Without it the row is drawing only and passes touches through.
 */
export function PagerDots({
  count = 5,
  active,
  onChange,
  label = (i) => `Pane ${i + 1}`,
  tone = 'dark',
  bottom = 180,
  inline,
  style,
}: {
  count?: number;
  active: number;
  onChange?: (index: number) => void;
  /** each dot's accessibilityLabel when it is a control (0-based index in) */
  label?: (index: number) => string;
  tone?: 'dark' | 'light';
  bottom?: number;
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const on = tone === 'dark' ? monoDark.dotOn : mono.ink;
  const off = tone === 'dark' ? monoDark.dotOff : mono.line;
  return (
    <View
      style={[
        inline ? null : { position: 'absolute', left: 0, right: 0, bottom },
        { flexDirection: 'row', justifyContent: 'center', gap: 7, pointerEvents: onChange ? 'box-none' : 'none' },
        style,
      ]}>
      {Array.from({ length: count }, (_, i) => {
        const dot: ViewStyle = { width: 6, height: 6, borderRadius: 3, backgroundColor: i === active ? on : off };
        return onChange ? (
          <Tap key={i} onPress={() => onChange(i)} label={label(i)} aria-selected={i === active} hitSlop={DOT_SLOP} style={dot} />
        ) : (
          <View key={i} style={dot} />
        );
      })}
    </View>
  );
}

// ── tone discs ──

/**
 * Row `left 0 right 0 top 232 height 150; centred; gap 18` → five 48 discs in
 * the tone ramp (`#34322F` → `#F2F0EC`); the two darkest carry an inset
 * `#45423E` ring so their edge reads on the ground. The chosen disc grows to 64
 * and takes the gap-then-ink double ring. The frames only ever choose the
 * middle disc, which has no inset ring of its own; a chosen dark disc takes the
 * double ring alone, as the CSS rule that sets it would (D382).
 */
export function ToneScale({
  value,
  onChange,
  labels,
  top = 232,
  inline,
}: {
  value: number | null;
  onChange?: (index: number) => void;
  /** what each disc means, for screen readers (the frames print it under the row) */
  labels?: readonly string[];
  top?: number;
  inline?: boolean;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={[place(top, inline), { height: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 }]}>
      {FIVE.map((i) => {
        const on = i === value;
        const size = on ? 64 : 48;
        return (
          <Tap
            key={i}
            onPress={() => onChange?.(i)}
            accessibilityRole="radio"
            aria-checked={on}
            label={labels?.[i] ?? `${i + 1} of 5`}
            hitSlop={{ top: 8, bottom: 8, left: 9, right: 9 }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              flexShrink: 0,
              backgroundColor: toneRamp[i],
              boxShadow: on ? ring.selectedTone : i < 2 ? ring.insetTone : undefined,
            }}
          />
        );
      })}
    </View>
  );
}

// ── intensity bars ──

const BAR_W = 46;
const BAR_HEIGHTS = [46, 72, 98, 124, 150] as const;

/**
 * Column `gap 14`: a bars row (`align flex-end; gap 14; height 150`) of five
 * 46-wide r15 bars, 46 → 150 tall in steps of 26, each `padding-top 12` with
 * its marker dot centred at the top; then a row of 46-wide 13/700 labels.
 * Off: `#1E1E1E` + the line ring, label `#5A574F`. On: ink, no ring, an 8 r4
 * `#1E1E1E` dot, label ink.
 *
 * `previous` is SOS Reassess's earlier reading: a transparent bar with an ink
 * dot and a dashed ink outline drawn inside its edge (`outline: 1.5px dashed;
 * outline-offset: -1.5px` — the same box as a 1.5 border). It shows only when
 * it differs from the current value, as the designer's generator draws it.
 */
export function IntensityScale({
  value,
  onChange,
  previous,
  labels = ['1', '2', '3', '4', '5'],
  a11yLabels,
  top = 232,
  inline,
}: {
  value: number | null;
  onChange?: (index: number) => void;
  previous?: number | null;
  labels?: readonly string[];
  /** what each level means, for screen readers */
  a11yLabels?: readonly string[];
  top?: number;
  inline?: boolean;
}) {
  return (
    <View style={place(top, inline)}>
      <View style={{ alignItems: 'center', gap: 14 }}>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 14, height: 150 }}>
          {FIVE.map((i) => {
            const on = i === value;
            const was = !on && previous != null && i === previous;
            const box: ViewStyle = on
              ? { backgroundColor: mono.ink }
              : was
                ? { backgroundColor: 'transparent' }
                : { backgroundColor: mono.card, boxShadow: ring.outline };
            return (
              <Tap
                key={i}
                onPress={() => onChange?.(i)}
                accessibilityRole="radio"
                aria-checked={on}
                label={a11yLabels?.[i] ?? labels[i]}
                style={[{ width: BAR_W, height: BAR_HEIGHTS[i], borderRadius: 15, alignItems: 'center', paddingTop: 12 }, box]}>
                {/* the outline is an overlay, not the bar's own border: a border
                    is part of the layout box, and Chrome snaps its width, which
                    moved the dot half a point off the frame's */}
                {was ? <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 15, borderWidth: 1.5, borderStyle: 'dashed', borderColor: mono.ink }} /> : null}
                {on || was ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: on ? mono.card : mono.ink }} /> : null}
              </Tap>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14 }}>
          {FIVE.map((i) => (
            <Tap key={i} onPress={() => onChange?.(i)} accessible={false} style={{ width: BAR_W }}>
              <MonoText v="pill" center color={i === value ? mono.ink : mono.art}>
                {labels[i]}
              </MonoText>
            </Tap>
          ))}
        </View>
      </View>
    </View>
  );
}

// ── energy meter ──

const ENERGY_HEIGHTS = [50, 75, 100, 125, 150] as const;

/**
 * Morning Energy: a fill meter, not a single choice. Row `align flex-end;
 * centred; gap 14; height 150` of five 44-wide r14 bars, 50 → 150 tall in steps
 * of 25; every bar up to and including the chosen level is ink (no ring), the
 * rest `#1E1E1E` + the line ring. No labels, no dots.
 */
export function EnergyBars({
  value,
  onChange,
  labels,
  top = 232,
  inline,
}: {
  value: number | null;
  onChange?: (index: number) => void;
  /** what each level means, for screen readers */
  labels?: readonly string[];
  top?: number;
  inline?: boolean;
}) {
  return (
    <View style={place(top, inline)}>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 14, height: 150 }}>
        {FIVE.map((i) => {
          const lit = value != null && i <= value;
          return (
            <Tap
              key={i}
              onPress={() => onChange?.(i)}
              accessibilityRole="radio"
              aria-checked={i === value}
              label={labels?.[i] ?? `${i + 1} of 5`}
              style={{
                width: 44,
                height: ENERGY_HEIGHTS[i],
                borderRadius: 14,
                backgroundColor: lit ? mono.ink : mono.card,
                boxShadow: lit ? undefined : ring.outline,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── the reading under a scale ──

/**
 * `left 24 right 24 top 440; column; gap 6; centred`: the word (30/700, −0.6,
 * normal line box) and its line (15/400/24 `#B5B0A8`, pretty). Every scale
 * screen draws it — Feeling, Mood, Energy, Strength, Reassess, Intensity.
 *
 * The word is the scale's value, not a heading (the screen's question is): it
 * is a polite live region, so a screen reader hears the new reading when the
 * choice changes.
 */
export function ScaleReading({
  word,
  line,
  top = 440,
  inline,
  children,
}: {
  word: string;
  line?: string;
  top?: number;
  inline?: boolean;
  children?: ReactNode;
}) {
  return (
    <View aria-live="polite" style={[inline ? null : { position: 'absolute', left: 24, right: 24, top }, { alignItems: 'center', gap: 6 }]}>
      <MonoText v="title" center wrap="wrap">
        {word}
      </MonoText>
      {line ? (
        <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
          {line}
        </MonoText>
      ) : null}
      {children}
    </View>
  );
}
