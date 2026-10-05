import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { lhNormal, mono, ring, sans } from '@/lib/theme';

import { Check } from './icons';
import { Tap } from './Tap';
import { MonoText } from './Text';

/**
 * The old light kit's lift, `0 1px 2px rgba(0,0,0,0.04)`. The V3 onboarding
 * frames still carry it on every unselected option and chip (and drop it on the
 * selected one); every later frame omits it. On `#0D0D0D` it darkens a pixel by
 * at most one level — invisible — but it is what those frames write, so the
 * screens that copy them pass `lift` (design-system §2.6).
 */
export const OPTION_LIFT = '0 1px 2px rgba(0,0,0,0.04)';

/** One answer. A bare string is its own key and label. */
export type Choice<K extends string = string> =
  | K
  | {
      key: K;
      /** what the row says; defaults to the key */
      label?: string;
      /** picking it clears every other answer, and any other pick clears it ("Nothing in particular") */
      exclusive?: boolean;
      disabled?: boolean;
      accessibilityLabel?: string;
    };

type Norm<K extends string> = { key: K; label: string; exclusive: boolean; disabled: boolean; accessibilityLabel?: string };

function norm<K extends string>(c: Choice<K>): Norm<K> {
  if (typeof c === 'string') return { key: c, label: c, exclusive: false, disabled: false };
  return { key: c.key, label: c.label ?? c.key, exclusive: !!c.exclusive, disabled: !!c.disabled, accessibilityLabel: c.accessibilityLabel };
}

/**
 * The multi-select rule every chip question shares. Tapping a chosen answer
 * removes it. An exclusive answer replaces everything; any other answer drops
 * the exclusive one. At `max` a further pick is refused rather than silently
 * dropping an answer chosen earlier ("Choose up to three" means it) — the
 * result is an equal copy, and the kit's pickers then call no `onChange`, as
 * the funnel's `pick` returned early. Picks are kept in the order they were
 * made, as the funnel has always stored them.
 */
export function toggleChoice<K extends string>(
  value: readonly K[],
  key: K,
  { exclusive = [], max }: { exclusive?: readonly K[]; max?: number } = {},
): K[] {
  if (value.includes(key)) return value.filter((k) => k !== key);
  if (exclusive.includes(key)) return [key];
  const kept = value.filter((k) => !exclusive.includes(k));
  if (max != null && kept.length >= max) return [...value];
  return [...kept, key];
}

/** Single-select (`value` one key or nothing) or multi-select (`multi`, `value` a list). */
export type SelectProps<K extends string> =
  | { multi?: false; value: K | null | undefined; onChange: (key: K) => void; exclusive?: undefined; max?: undefined }
  | {
      multi: true;
      value: readonly K[];
      onChange: (keys: K[]) => void;
      /** keys that clear the others — or mark the choice itself `exclusive` */
      exclusive?: readonly K[];
      /** the most answers allowed ("What it affects" caps at 3) */
      max?: number;
    };

function useSelect<K extends string>(props: SelectProps<K>, items: Norm<K>[]) {
  const exclusive = [...(props.exclusive ?? []), ...items.filter((i) => i.exclusive).map((i) => i.key)];
  const isOn = (k: K) => (props.multi ? props.value.includes(k) : props.value === k);
  const press = (k: K) => {
    if (!props.multi) return props.onChange(k);
    const prev = props.value;
    const next = toggleChoice(prev, k, { exclusive, max: props.max });
    // a pick refused at `max` changes nothing, and — as in the funnel's own
    // `pick` — reports nothing: no save, no haptic, no analytics for a no-op
    if (next.length === prev.length && next.every((x, i) => x === prev[i])) return;
    props.onChange(next);
  };
  return { isOn, press, multi: !!props.multi };
}

/**
 * One full-width answer row (design-system §7.10): `height 58, r18, padding 0
 * 22`, label 15/400 nowrap (the kit says 16 — every frame draws 15). Off is the
 * card with an ink label; on is the ink fill with a `#111111` label and no lift.
 * No mark, no tick, no ring — the fill is the answer.
 */
export function Option({
  label,
  on,
  onPress,
  lift,
  multi,
  disabled,
  accessibilityLabel,
  style,
}: {
  label: string;
  on: boolean;
  onPress?: () => void;
  lift?: boolean;
  multi?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      aria-checked={on}
      aria-disabled={!!disabled}
      label={accessibilityLabel}
      style={[
        {
          height: 58,
          borderRadius: 18,
          paddingHorizontal: 22,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: on ? mono.ink : mono.card,
          boxShadow: !on && lift ? OPTION_LIFT : undefined,
        },
        style,
      ]}>
      <MonoText v="optionLabel" color={on ? mono.onInk : mono.ink}>
        {label}
      </MonoText>
    </Tap>
  );
}

/**
 * A column of `Option`s, gap 12 — the single-choice question (V3 Q1, Q2 …,
 * Slip Urge Now, Urge Log Outcome). Selecting does not advance: the screen
 * decides (the funnel turns over 260 ms after a pick on screens with no
 * primary).
 */
export function OptionList<K extends string>({
  options,
  lift,
  gap = 12,
  style,
  ...select
}: SelectProps<K> & { options: readonly Choice<K>[]; lift?: boolean; gap?: number; style?: StyleProp<ViewStyle> }) {
  const items = options.map(norm);
  const s = useSelect(select as SelectProps<K>, items);
  return (
    <View style={[{ gap }, style]}>
      {items.map((it) => (
        <Option
          key={it.key}
          label={it.label}
          on={s.isOn(it.key)}
          onPress={() => s.press(it.key)}
          lift={lift}
          multi={s.multi}
          disabled={it.disabled}
          accessibilityLabel={it.accessibilityLabel}
        />
      ))}
    </View>
  );
}

/**
 * The two-column tiles (design-system §7.11): `height 62, r20`, label 16/700
 * nowrap, centred. Off is the card with the 1.5 line ring; on is the ink fill,
 * no ring. CSS draws them as a `1fr 1fr` grid with gap 12; here each pair is a
 * row of two `flex: 1` tiles, and an odd last tile keeps its column with an
 * empty partner — the grid's own behaviour.
 */
export function Grid2<K extends string>({
  options,
  gap = 12,
  style,
  ...select
}: SelectProps<K> & { options: readonly Choice<K>[]; gap?: number; style?: StyleProp<ViewStyle> }) {
  const items = options.map(norm);
  const s = useSelect(select as SelectProps<K>, items);
  const rows: Norm<K>[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View style={[{ gap }, style]}>
      {rows.map((pair) => (
        <View key={pair[0].key} style={{ flexDirection: 'row', gap }}>
          {pair.map((it) => {
            const on = s.isOn(it.key);
            return (
              <Tap
                key={it.key}
                onPress={() => s.press(it.key)}
                disabled={it.disabled}
                accessibilityRole={s.multi ? 'checkbox' : 'radio'}
                aria-checked={on}
                aria-disabled={it.disabled}
                label={it.accessibilityLabel}
                style={{
                  flex: 1,
                  height: 62,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: on ? mono.ink : mono.card,
                  boxShadow: on ? undefined : ring.outline,
                }}>
                <MonoText v="gridLabel" color={on ? mono.onInk : mono.ink}>
                  {it.label}
                </MonoText>
              </Tap>
            );
          })}
          {pair.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

/**
 * One wrapping chip (design-system §7.12): `height 48, r24, padding 0 20, gap
 * 8`, label 15/400 nowrap. On adds a 13 check before the label — the label's
 * weight does not change.
 */
export function Chip({
  label,
  on,
  onPress,
  lift,
  multi = true,
  disabled,
  accessibilityLabel,
  style,
}: {
  label: string;
  on: boolean;
  onPress?: () => void;
  lift?: boolean;
  multi?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      aria-checked={on}
      aria-disabled={!!disabled}
      label={accessibilityLabel}
      style={[
        {
          height: 48,
          borderRadius: 24,
          paddingHorizontal: 20,
          gap: 8,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: on ? mono.ink : mono.card,
          boxShadow: !on && lift ? OPTION_LIFT : undefined,
        },
        style,
      ]}>
      {on ? <Check size={13} /> : null}
      <MonoText v="optionLabel" color={on ? mono.onInk : mono.ink}>
        {label}
      </MonoText>
    </Tap>
  );
}

/**
 * Wrapping chips, gap 12 both ways — multi-select by default (V3 Q5/Q6/Q7/Q17,
 * What it affects, What starts it, the SOS feeling and reason pickers, the
 * log flows' triggers). Each chip is as wide as its words.
 */
export function Chips<K extends string>({
  options,
  lift,
  gap = 12,
  style,
  ...select
}: SelectProps<K> & { options: readonly Choice<K>[]; lift?: boolean; gap?: number; style?: StyleProp<ViewStyle> }) {
  const items = options.map(norm);
  const s = useSelect(select as SelectProps<K>, items);
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap }, style]}>
      {items.map((it) => (
        <Chip
          key={it.key}
          label={it.label}
          on={s.isOn(it.key)}
          onPress={() => s.press(it.key)}
          lift={lift}
          multi={s.multi}
          disabled={it.disabled}
          accessibilityLabel={it.accessibilityLabel}
        />
      ))}
    </View>
  );
}

/** 14/700, `line-height: normal` — the when-chip and the segmented label's metrics. */
const t14: TextStyle = { ...sans('700'), fontSize: 14, lineHeight: lhNormal(14) };

/**
 * The quick-pick row of a When step (Lapse / Slip / Urge Log When, §7.17):
 * `flex; gap 10` of `height 44, r22, padding 0 18` pills, 14/700 nowrap. One is
 * on (ink fill, `#111111`) or none is, when the wheel below holds a time of its
 * own. Single-select and controlled. The three chips need 326.6 of the 327 a
 * 375 phone gives the column, so the row wraps (gap 10 both ways) rather than
 * run past the gutter on a narrower phone or at a larger text size; at 393 it
 * is one line, as drawn.
 */
export function WhenChips<K extends string>({
  options,
  value,
  onChange,
  gap = 10,
  style,
}: {
  options: readonly Choice<K>[];
  value: K | null | undefined;
  onChange: (key: K) => void;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const items = options.map(norm);
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap }, style]}>
      {items.map((it) => {
        const on = value === it.key;
        return (
          <Tap
            key={it.key}
            onPress={() => onChange(it.key)}
            disabled={it.disabled}
            accessibilityRole="radio"
            aria-checked={on}
            aria-disabled={it.disabled}
            label={it.accessibilityLabel}
            style={{ height: 44, borderRadius: 22, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: on ? mono.ink : mono.card }}>
            <MonoText v="pill" wrap="nowrap" style={[t14, { color: on ? mono.onInk : mono.ink }]}>
              {it.label}
            </MonoText>
          </Tap>
        );
      })}
    </View>
  );
}

/**
 * The chosen-moment row under a When wheel (§7.17 "date row"): `height 44, r14,
 * card, padding 0 6 0 18`, the phrase 15/700 ink on the left and a `height 32
 * r16` ground pill on the right ("Change", 13/700 ink).
 */
export function DateRow({
  label,
  action = 'Change',
  onPress,
  style,
}: {
  label: string;
  action?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          height: 44,
          borderRadius: 14,
          backgroundColor: mono.card,
          paddingLeft: 18,
          paddingRight: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}>
      <MonoText v="rowLabel" wrap="wrap" style={{ flexShrink: 1 }}>
        {label}
      </MonoText>
      <Tap onPress={onPress} hitSlop={6} style={{ height: 32, borderRadius: 16, backgroundColor: mono.ground, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }}>
        <MonoText v="pill">{action}</MonoText>
      </Tap>
    </View>
  );
}

export type SegmentItem<K extends string = string> = K | { key: K; label?: string; accessibilityLabel?: string };

/**
 * The segmented switch (design-system §7.16): track `height 44, r22, card,
 * padding 4`; segments `flex 1, height 36, r18`, 13/700 nowrap — the selected
 * one an ink thumb with a `#111111` label (the kit's `#FFFFFF` is a kit bug),
 * the rest transparent with a mute label. Exactly one is selected. The canvas
 * puts it at `left 16 right 16 top 164`; position it with `style`.
 */
export function Segmented<K extends string>({
  items,
  value,
  onChange,
  style,
}: {
  items: readonly SegmentItem<K>[];
  value: K;
  onChange: (key: K, index: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      accessibilityRole="tablist"
      style={[{ height: 44, borderRadius: 22, backgroundColor: mono.card, padding: 4, flexDirection: 'row' }, style]}>
      {items.map((raw, i) => {
        const it = typeof raw === 'string' ? { key: raw, label: raw as string } : { ...raw, label: raw.label ?? raw.key };
        const on = it.key === value;
        return (
          <Tap
            key={it.key}
            onPress={() => onChange(it.key, i)}
            accessibilityRole="tab"
            aria-selected={on}
            label={'accessibilityLabel' in it ? it.accessibilityLabel : undefined}
            style={{ flex: 1, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? mono.ink : 'transparent' }}>
            <MonoText v="pill" color={on ? mono.onInk : mono.mute}>
              {it.label}
            </MonoText>
          </Tap>
        );
      })}
    </View>
  );
}

