import { useState, type ReactNode } from 'react';
import { View, useWindowDimensions, type TextStyle } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { Check, MonoText, NavBar, Pill, RuledRows, Segmented, TitleHead, type SegmentItem, type TextVariant } from '@/components/mono';
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

/**
 * Ruled 46 rows: the label column (`useLabelColumn`), a dot per count (9 ink,
 * gap 6) and the count 14/700 mute. The dots stop where the row does — a long
 * run is cut at what fits, the count still says how many.
 */
export function DotRows({ rows, top }: { rows: [string, number][]; top: number }) {
  const { width } = useWindowDimensions();
  // the row inside the 24 gutters and its own 2 padding
  const inner = width - 48 - 4;
  const { column, cut, measure } = useLabelColumn(
    rows.map(([label]) => label),
    inner,
  );
  const fit = Math.max(1, Math.floor((inner - column - 14 - 14 - DOT_COUNT + DOT_GAP) / (9 + DOT_GAP)));
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top }}>
      {measure}
      <RuledRows height={46}>
        {rows.map(([label, n]) => (
          <DotRow key={label} label={label} n={n} column={column} cut={cut(label)} dots={Math.min(n, fit)} />
        ))}
      </RuledRows>
    </View>
  );
}

/**
 * One dot row — the kit `RuledRow`'s box (`height 46, padding 0 2, gap 14`,
 * the rule on rows 2+, handed down by `RuledRows`) with a label that can end
 * in an ellipsis, which the kit row's label cannot.
 */
function DotRow({
  label,
  n,
  column,
  cut,
  dots,
  height = 46,
  divider,
}: {
  label: string;
  n: number;
  column: number;
  cut: boolean;
  dots: number;
  height?: number;
  divider?: boolean;
}) {
  return (
    <View
      accessibilityLabel={`${label}, ${n}`}
      style={[
        { height: divider ? height + 1 : height, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', gap: 14 },
        divider ? { borderTopWidth: 1, borderTopColor: mono.line } : null,
      ]}>
      <MonoText v="rowLabel" numberOfLines={cut ? 1 : undefined} style={{ width: column }}>
        {label}
      </MonoText>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: DOT_GAP }}>
        {Array.from({ length: dots }, (_, k) => (
          <View key={k} style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: mono.ink }} />
        ))}
      </View>
      <MonoText v="rowValue">{String(n)}</MonoText>
    </View>
  );
}

// ── 91B · the intensity histogram ────────────────────────────────────────────

/**
 * `left 40 right 40 top 352; column gap 12`: five columns in a 96 band, each a
 * bottom-up stack of 12 ink dots (gap 7, one per urge in that band — five fit);
 * the 1 line rule; the band numbers 13/700 ink.
 */
export function Histogram({ bins, top = 352 }: { bins: number[]; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 40, right: 40, top, gap: 12 }}>
      <View style={{ height: 96, flexDirection: 'row', alignItems: 'flex-end' }}>
        {bins.map((n, i) => (
          <View key={i} style={{ flex: 1, flexDirection: 'column-reverse', alignItems: 'center', gap: 7 }}>
            {Array.from({ length: Math.min(n, 5) }, (_, k) => (
              <View key={k} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mono.ink }} />
            ))}
          </View>
        ))}
      </View>
      <View style={{ height: 1, backgroundColor: mono.line }} />
      <View style={{ flexDirection: 'row' }}>
        {bins.map((_, i) => (
          <MonoText key={i} v="pill" center style={{ flex: 1 }}>
            {String(i + 1)}
          </MonoText>
        ))}
      </View>
    </View>
  );
}

// ── 91C · the mood bubbles ───────────────────────────────────────────────────

/** The four sizes the frame draws, by rank — not a function of the count (logs Q10, CRITIC §5). */
const BUBBLES = [88, 66, 54, 36] as const;

const BUBBLE_GAP = 26;
/** How close the bubbles may draw together before their names wrap. */
const BUBBLE_GAP_MIN = 16;
const BUBBLE_NAME: TextStyle = { fontSize: 14, lineHeight: lhNormal(14) };

type BubbleFit = { count: number; gap: number; widths: number[] | null };

/**
 * How four names fit a column the frame sized for `Tense`, `Flat`, `Restless`
 * and `Low`. As drawn when they fit. Otherwise, the way the frame's own flex
 * row would give: the gap closes toward 16 first, then the widest names wrap
 * (each column `max(bubble, longest word)` at the least), and only if even
 * their longest words cannot sit side by side do the smallest ranks drop.
 */
function fitBubbles(items: { size: number; name: number; word: number }[], column: number): BubbleFit {
  const basis = items.map((it) => Math.max(it.size, it.name));
  const floor = items.map((it) => Math.max(it.size, it.word));
  const sum = (a: number[], n: number) => a.slice(0, n).reduce((s, x) => s + x, 0);
  let count = items.length;
  if (sum(basis, count) + BUBBLE_GAP * (count - 1) <= column) return { count, gap: BUBBLE_GAP, widths: null };
  while (count > 1 && sum(floor, count) + BUBBLE_GAP_MIN * (count - 1) > column) count -= 1;
  const gap = count > 1 ? Math.max(BUBBLE_GAP_MIN, Math.min(BUBBLE_GAP, (column - sum(basis, count)) / (count - 1))) : 0;
  const room = column - gap * (count - 1);
  if (sum(basis, count) <= room) return { count, gap, widths: null };
  // the widest names give way first: one cap on every column, never under its floor
  let lo = 0;
  let hi = Math.max(...basis.slice(0, count));
  for (let k = 0; k < 24; k += 1) {
    const mid = (lo + hi) / 2;
    if (sum(basis.map((b, i) => Math.max(floor[i], Math.min(b, mid))), count) <= room) lo = mid;
    else hi = mid;
  }
  return { count, gap, widths: basis.slice(0, count).map((b, i) => Math.max(floor[i], Math.min(b, lo))) };
}

/**
 * `left 24 right 24 top 352; centred; gap 26`: up to four ink circles, largest
 * first, bottom-aligned in a 92 slot, each over its name 14/700 ink and count
 * 12/700 mute (gap 2; 12 under the slot). Names the column cannot hold side by
 * side close the gap and then wrap (`fitBubbles`). `flow` places the row under
 * whatever precedes it, 17 below — where 352 falls under a one-line big word.
 */
export function Bubbles({ items, top = 352, flow }: { items: [string, number][]; top?: number; flow?: boolean }) {
  const { width } = useWindowDimensions();
  const shown = items.slice(0, BUBBLES.length);
  const words = (name: string) => name.split(/\s+/).filter(Boolean);
  const [measured, measure] = useTextWidths(
    shown.flatMap(([name]) => [name, ...words(name)]),
    'pill',
    BUBBLE_NAME,
  );
  const fit = measured
    ? fitBubbles(
        shown.map(([name], i) => ({ size: BUBBLES[i], name: measured[name], word: Math.max(...words(name).map((w) => measured[w])) })),
        width - 48,
      )
    : { count: shown.length, gap: BUBBLE_GAP, widths: null };
  return (
    <View
      style={[
        flow ? { marginHorizontal: 24, marginTop: 17 } : { position: 'absolute', left: 24, right: 24, top },
        { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: fit.gap },
      ]}>
      {measure}
      {shown.slice(0, fit.count).map(([name, n], i) => (
        <View key={name} style={[{ alignItems: 'center', gap: 12 }, fit.widths ? { width: fit.widths[i] } : null]}>
          <View style={{ height: 92, justifyContent: 'flex-end' }}>
            <View style={{ width: BUBBLES[i], height: BUBBLES[i], borderRadius: BUBBLES[i] / 2, backgroundColor: mono.ink }} />
          </View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <MonoText v="pill" style={BUBBLE_NAME} wrap={fit.widths ? 'balance' : 'nowrap'} center>
              {name}
            </MonoText>
            <MonoText v="pill" style={{ fontSize: 12, lineHeight: lhNormal(12) }} color={mono.mute}>
              {String(n)}
            </MonoText>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── 91D · the 24-hour dial ───────────────────────────────────────────────────

const f1 = (v: number) => v.toFixed(1);
/** Room around the 236 box for the labels the frame lets overhang it (−12…248, −5…241). */
const PAD = 24;
const svgFont = (w: '700' | '900') => ({ fontFamily: sans(w).fontFamily as string, fontWeight: 'normal' as const });

/** 23 → `11 pm`, 25 → `1 am`. */
export function clockHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`;
}

/**
 * `left 0 right 0 top 248; centred`: a 236 dial — the r 96 ring (`#2E2E2E` 2),
 * 24 hour ticks clockwise from midnight at the top (every sixth `#9B968E` 2
 * from r 86, the rest `#2E2E2E` 1.5 from r 90), a dot per hour that had urges
 * on the ring at the hour's middle (r 7.5 for one, 10 for two, +2.5 each up to
 * 12.5), the four hour labels, and the peak window in the middle with
 * "Most urges" under it.
 */
export function Dial({ hours, peak, top = 248 }: { hours: number[]; peak: string | null; top?: number }) {
  const at = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: 118 + r * Math.sin(a), y: 118 - r * Math.cos(a) };
  };
  const ticks = Array.from({ length: 24 }, (_, h) => {
    const major = h % 6 === 0;
    const a = at(h * 15, major ? 86 : 90);
    const b = at(h * 15, 96);
    return <Path key={h} d={`M${f1(a.x)} ${f1(a.y)}L${f1(b.x)} ${f1(b.y)}`} stroke={major ? mono.mute : mono.line} strokeWidth={major ? 2 : 1.5} strokeLinecap="round" />;
  });
  const dots = hours
    .map((n, h) => ({ n, h }))
    .filter((d) => d.n > 0)
    .map(({ n, h }) => {
      const p = at((h + 0.5) * 15, 96);
      return <Circle key={h} cx={f1(p.x)} cy={f1(p.y)} r={Math.min(12.5, 5 + 2.5 * n)} fill={mono.ink} />;
    });
  const label = (x: number, y: number, s: string) => (
    <SvgText x={f1(x)} y={f1(y)} fill={mono.mute} textAnchor="middle" fontSize={11} {...svgFont('700')}>
      {s}
    </SvgText>
  );
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top - PAD, alignItems: 'center' }}>
      <Svg width={236 + 2 * PAD} height={236 + 2 * PAD} viewBox={`${-PAD} ${-PAD} ${236 + 2 * PAD} ${236 + 2 * PAD}`}>
        <Circle cx={118} cy={118} r={96} fill="none" stroke={mono.line} strokeWidth={2} />
        {ticks}
        {dots}
        {label(118, 8, '12 am')}
        {label(236, 122, '6 am')}
        {label(118, 238, '12 pm')}
        {label(0, 122, '6 pm')}
        {peak ? (
          <>
            <SvgText x={118} y={120} fill={mono.ink} textAnchor="middle" fontSize={20} letterSpacing={-0.4} {...svgFont('700')}>
              {peak}
            </SvgText>
            <SvgText x={118} y={142} fill={mono.mute} textAnchor="middle" fontSize={12} {...svgFont('700')}>
              Most urges
            </SvgText>
          </>
        ) : null}
      </Svg>
    </View>
  );
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
