import { useState, type ReactNode } from 'react';
import { View, useWindowDimensions, type TextStyle } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { Check, MonoText, NavBar, Pill, Segmented, TitleHead, type SegmentItem, type TextVariant } from '@/components/mono';
import { lhNormal, mono, ring, sans } from '@/lib/theme';
import type { DayStatus } from '@/lib/weeklyReport';

/**
 * The Log's own pieces (91 / 91A–D / 91C–C3): the title head with its switch,
 * the big number, the week strip, the dot rows and the four small charts.
 * Every one is laid out in canvas coordinates; `top` is the frame's y.
 */

// ── the head every register draws ────────────────────────────────────────────

/**
 * Back chevron (and the range pill on the overview and the report), the 32/38
 * page title at 108, and the segmented switch at `left 16 right 16 top 164`.
 */
export function RegisterHead<K extends string>({
  title,
  pill,
  onBack,
  items,
  value,
  onChange,
}: {
  title: string;
  pill?: string;
  onBack: () => void;
  items: readonly SegmentItem<K>[];
  value: K;
  onChange: (key: K, index: number) => void;
}) {
  return (
    <>
      <NavBar left="back" right={pill ? { node: <Pill kind="range" label={pill} /> } : null} onBack={onBack} />
      <TitleHead title={title} />
      <Segmented items={items} value={value} onChange={onChange} style={{ position: 'absolute', left: 16, right: 16, top: 164 }} />
    </>
  );
}

// ── the big number ───────────────────────────────────────────────────────────

/**
 * `left 24 right 24 top 236; centred; gap 10`: the value 64/700/67 (−2.2) — or,
 * as a word ("Strong", "Tense"), 44/700/67 (−1.5) — over its caption,
 * 15/400/22 mute. Both nowrap in the frame; a word is the app's own (the
 * feeling picker's `Stressed or anxious` runs 354 at 44), so it wraps,
 * balanced and centred, where it would run past the column — type never
 * shrinks (D320). `flow` drops the absolute box so what follows can sit under
 * a second line (the Mood page).
 */
export function BigStat({ value, caption, word, top = 236, flow }: { value: string; caption: string; word?: boolean; top?: number; flow?: boolean }) {
  return (
    <View style={[flow ? { marginHorizontal: 24 } : { position: 'absolute', left: 24, right: 24, top }, { alignItems: 'center', gap: 10 }]}>
      <MonoText v="statValue" wrap={word ? 'balance' : undefined} center={word} style={word ? { fontSize: 44, letterSpacing: -1.5 } : null}>
        {value}
      </MonoText>
      <MonoText v="pTight" color={mono.mute} wrap="nowrap" center>
        {caption}
      </MonoText>
    </View>
  );
}

// ── the week strip (Log Urges, Log Check-ins) ────────────────────────────────

export type StripDay = { label: string; lit: boolean; mark: ReactNode };

/** Monday first, as the Log draws its week (CRITIC C16). */
export const STRIP_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * `left 32 right 32 top 352`: seven 36-wide columns, space-between; each a 36
 * slot over its 11/700 letter (gap 10) — `#5A574F`, today's in ink.
 */
export function WeekStrip({ days, top = 352 }: { days: StripDay[]; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 32, right: 32, top, flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((d, i) => (
        <View key={i} style={{ width: 36, alignItems: 'center', gap: 10 }}>
          <View style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>{d.mark}</View>
          <MonoText v="pill" style={{ fontSize: 11, lineHeight: lhNormal(11) }} color={d.lit ? mono.ink : mono.art}>
            {d.label}
          </MonoText>
        </View>
      ))}
    </View>
  );
}

/** A day with nothing on it (and a day still to come): the 8 line-grey dot. */
export const EmptyDay = () => <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mono.line }} />;

/** An urge day: the 34 ink disc carrying the day's count, 14/700 `#111111`. */
export function CountDay({ n }: { n: number }) {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
      <MonoText v="pill" style={{ fontSize: 14, lineHeight: lhNormal(14) }} color={mono.onInk}>
        {String(n)}
      </MonoText>
    </View>
  );
}

/**
 * A check-in day: an ink circle `12 + 4.4·v` across for a 1–5 reading (29.6 at
 * 4, 25.2 at 3 — the two sizes the frame draws, which fit exactly this line).
 */
export function ReadingDay({ v }: { v: number }) {
  const d = 12 + 4.4 * Math.max(1, Math.min(5, v));
  return <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: mono.ink }} />;
}

// ── measuring the app's own words ────────────────────────────────────────────

/**
 * One-line widths of `texts` in a text style, measured off screen. The frames
 * size their label columns for their sample words (`Bedroom`, `Tense`); the
 * app's own vocabulary runs longer (`Somewhere private`, `Stressed or
 * anxious`), so the columns read what they are given. The hidden copies render
 * only until each text is measured, then drop out of the tree; a new text (or
 * a Dynamic Type change) measures again. `null` until every text has a width.
 */
function useTextWidths(texts: string[], v: TextVariant, style?: TextStyle): [Record<string, number> | null, ReactNode] {
  const { fontScale } = useWindowDimensions();
  const [seen, setSeen] = useState<Record<string, number>>({});
  const key = (t: string) => `${fontScale}|${t}`;
  const unique = [...new Set(texts)];
  const todo = unique.filter((t) => seen[key(t)] == null);
  const node = todo.length ? (
    <View aria-hidden style={{ position: 'absolute', left: 0, top: 0, opacity: 0, alignItems: 'flex-start', pointerEvents: 'none' }}>
      {todo.map((t) => (
        <MonoText
          key={t}
          v={v}
          wrap="nowrap"
          style={style}
          onLayout={(e) => {
            // web's onLayout reports whole points (76.5 reads 76): a point over, so a column set to it never wraps
            const w = Math.ceil(e.nativeEvent.layout.width) + 1;
            setSeen((prev) => (prev[key(t)] === w ? prev : { ...prev, [key(t)]: w }));
          }}>
          {t}
        </MonoText>
      ))}
    </View>
  ) : null;
  const widths = todo.length ? null : Object.fromEntries(unique.map((t) => [t, seen[key(t)]]));
  return [widths, node];
}

// ── dot rows (overview Strength / Timing) ────────────────────────────────────

const DOT_GAP = 6;
/** The frame's label column. */
const DOT_LABEL = 96;
/** What a row keeps for its count: three digits of 14/700 (≈ 26). */
const DOT_COUNT = 26;

/**
 * The label column of a row of label · marks · count (the dot rows, Insights'
 * trigger bars). The frame's column is 96, which holds its `Bedroom`/`Desk`/
 * `Bathroom`; the places and triggers the app records run to `Somewhere
 * private` and `Something online`. The column is the widest label, never under
 * 96 and at most half the row (`inner`, the row inside its padding), so the
 * marks stay in one column and keep their room; a label past that (a note
 * standing in for a place) is `cut` and ends in an ellipsis, as the old place
 * list did. Render `measure` anywhere inside the rows' box.
 */
export function useLabelColumn(labels: string[], inner: number): { column: number; cut: (label: string) => boolean; measure: ReactNode } {
  const [widths, measure] = useTextWidths(labels, 'rowLabel');
  const cap = Math.floor(Math.min(inner / 2, inner - 14 - (5 * 9 + 4 * DOT_GAP) - 14 - DOT_COUNT));
  const widest = widths ? Math.max(0, ...labels.map((label) => widths[label])) : 0;
  const column = Math.min(cap, Math.max(DOT_LABEL, widest));
  return { column, cut: (label) => !!widths && widths[label] > column, measure };
}

const f1 = (v: number) => v.toFixed(1);
const svgFont = (w: '700' | '900') => ({ fontFamily: sans(w).fontFamily as string, fontWeight: 'normal' as const });

/** 23 → `11 pm`, 25 → `1 am`. */
export function clockHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`;
}

// ── 91-3 · the sparkline ─────────────────────────────────────────────────────

/** Catmull-Rom through the points — the same curve the old spark and score line used. */
function smoothPath(pts: { x: number; y: number }[]): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${r(p1.x + (p2.x - p0.x) / 6)} ${r(p1.y + (p2.y - p0.y) / 6)}, ${r(p2.x - (p3.x - p1.x) / 6)} ${r(p2.y - (p3.y - p1.y) / 6)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

/** A value on a fixed `[lo, hi]` scale as a 0–1 share, held to the scale. */
const shareOf = (v: number, [lo, hi]: readonly [number, number]) => (hi > lo ? Math.max(0, Math.min(1, (v - lo) / (hi - lo))) : 0);

/**
 * `left 0 right 0 top 352; centred`: a 220 × 56 line of the closed weeks'
 * values, oldest to newest across x 4…216, lowest to highest across y 48…6,
 * ink 3 with a round cap, ending on a 5 ink dot. One week is a flat line at
 * the top. With `scale` the y's are that fixed range (the recovery rating's
 * 0–100, D515) instead of the values' own, so a small change stays small.
 */
export function Spark({ values, top = 352, scale }: { values: number[]; top?: number; scale?: readonly [number, number] }) {
  if (!values.length) return null;
  const lo = Math.min(...values);
  const span = Math.max(...values) - lo;
  const yOf = (v: number) => (scale ? 48 - 42 * shareOf(v, scale) : span ? 48 - (42 * (v - lo)) / span : 6);
  const pts =
    values.length === 1
      ? [
          { x: 4, y: yOf(values[0]) },
          { x: 216, y: yOf(values[0]) },
        ]
      : values.map((v, i) => ({ x: 4 + (212 * i) / (values.length - 1), y: yOf(v) }));
  const end = pts[pts.length - 1];
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, alignItems: 'center' }}>
      <Svg width={220} height={56} viewBox="0 0 220 56">
        <Path d={smoothPath(pts)} fill="none" stroke={mono.ink} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={end.x} cy={end.y} r={5} fill={mono.ink} />
      </Svg>
    </View>
  );
}

// ── 91C · the week's rating line ─────────────────────────────────────────────

/** Monday first — the report reads its week forward. */
const WEEK_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * `left 32 right 32 top 352`: the seven day-end values as a polyline (ink 3,
 * round) through `x = 16 + 49.7·i` of a 330 × 140 box, lowest at y 108 and
 * highest at 20 (a flat week rides at 64). With `scale` the y's are that fixed
 * range instead — the recovery rating's 0 at 108 and 100 at 20 (D515). Days 1–6 are 4.5 ground discs with a
 * 2.5 ink ring, the last a 6.5 ink dot; the day letters sit at y 136, 12 mute
 * (700), the last ink in Lato 900 — the frame's weights 600/800, which the
 * canvas's three Lato faces draw as 700/900. The frame stretches its 330 box
 * into the 329 column (`preserveAspectRatio: none`); here the x's are scaled
 * instead, so the dots stay round on a wider phone.
 */
export function ScoreLine({ values, top = 352, scale }: { values: number[]; top?: number; scale?: readonly [number, number] }) {
  const { width } = useWindowDimensions();
  const w = width - 64;
  const k = w / 330;
  const lo = Math.min(...values);
  const span = Math.max(...values) - lo;
  const pts = values.map((v, i) => ({ x: (16 + 49.7 * i) * k, y: scale ? 108 - 88 * shareOf(v, scale) : span ? 108 - (88 * (v - lo)) / span : 64 }));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p.x)} ${f1(p.y)}`).join(' ');
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 32, right: 32, top, height: 140 }}>
      <Svg width={w} height={140} viewBox={`0 0 ${w} 140`}>
        <Path d={d} fill="none" stroke={mono.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) =>
          i < pts.length - 1 ? (
            <Circle key={i} cx={f1(p.x)} cy={f1(p.y)} r={4.5} fill={mono.ground} stroke={mono.ink} strokeWidth={2.5} />
          ) : (
            <Circle key={i} cx={f1(p.x)} cy={f1(p.y)} r={6.5} fill={mono.ink} />
          ),
        )}
        {pts.map((p, i) => {
          const last = i === pts.length - 1;
          return (
            <SvgText key={`l${i}`} x={f1(p.x)} y={136} fill={last ? mono.ink : mono.mute} textAnchor="middle" fontSize={12} {...svgFont(last ? '900' : '700')}>
              {WEEK_LETTERS[i]}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

// ── 91C2 · the week's days ───────────────────────────────────────────────────

export type { DayStatus };

/** The wave a ridden-out day carries (16, stroke 2, round). */
function Wave() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path d="M2 9c2.5 0 3-4 5-4s3 4 5 4 2-2 2-2" fill="none" stroke={mono.ink} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * `left 32 right 32 top 352`: seven 40 cells, space-between, each over its
 * 11/700 letter (`#5A574F`, Sunday ink). Clean: the ink disc with a 16 check.
 * Ridden out: an inset 2 ink ring with the wave. A slip day, or a day the
 * account did not exist yet, is not drawn by the frame — it gets the empty
 * cell, a bare inset 1.5 `#2E2E2E` ring (the last-week row's hollow).
 */
export function DayCells({ days, top = 352 }: { days: DayStatus[]; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 32, right: 32, top, flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((s, i) => (
        <View key={i} style={{ width: 40, alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: s === 'clean' ? mono.ink : 'transparent',
              boxShadow: s === 'ridden' ? `inset 0 0 0 2px ${mono.ink}` : s === 'clean' ? undefined : ring.insetLine,
            }}>
            {s === 'clean' ? <Check size={16} /> : s === 'ridden' ? <Wave /> : null}
          </View>
          <MonoText v="pill" style={{ fontSize: 11, lineHeight: lhNormal(11) }} color={i === days.length - 1 ? mono.ink : mono.art}>
            {WEEK_LETTERS[i]}
          </MonoText>
        </View>
      ))}
    </View>
  );
}

/**
 * `left 32 right 32 top 450; column gap 16`: "Last week" 13/700 mute, centred;
 * then seven 18 dots, `space-between, padding 0 11` — ink for a clean day,
 * hollow (inset 1.5 `#2E2E2E`) for a slip or a day with no account.
 */
export function LastWeek({ clean, top = 450 }: { clean: boolean[]; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 32, right: 32, top, gap: 16 }}>
      <MonoText v="caps" center>
        Last week
      </MonoText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 11 }}>
        {clean.map((on, i) => (
          <View key={i} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: on ? mono.ink : 'transparent', boxShadow: on ? undefined : ring.insetLine }} />
        ))}
      </View>
    </View>
  );
}
