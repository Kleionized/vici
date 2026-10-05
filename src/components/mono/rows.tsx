import { Children, cloneElement, Fragment, isValidElement, useEffect, type Key, type ReactElement, type ReactNode } from 'react';
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { lhNormal, mono, sans } from '@/lib/theme';

import { ChevronR } from './icons';
import { CheckDisc } from './pills';
import { Tap } from './Tap';
import { MonoText } from './Text';

/**
 * Every ruled list in the frames draws `border-top: 1px solid #2E2E2E` on rows
 * 2+ and on no first row. The canvas's rows are content-box, so a ruled row is
 * one point taller than its `height` (a 54 settings row measures 55, a 52 log
 * row 53); RN boxes are border-box, so each kit row adds the point itself when
 * it carries the rule. The list hands `divider` to every row but the first —
 * a row passed in explicitly with `divider` keeps its own value. Fragments are
 * opened first (`{premium && (<><Row/><Row/></>)}` is ordinary settings code),
 * so the rows inside one are ruled like their siblings.
 */
type RowEl = ReactElement<Record<string, unknown>>;

function rowsOf(children: ReactNode, prefix = ''): { el: RowEl; key: Key }[] {
  return Children.toArray(children).flatMap((c) => {
    if (!isValidElement(c)) return [];
    const key = `${prefix}${c.key ?? ''}`;
    if (c.type === Fragment) return rowsOf((c.props as { children?: ReactNode }).children, `${key}/`);
    return [{ el: c as RowEl, key }];
  });
}

function ruled(children: ReactNode, extra?: Record<string, unknown>) {
  return rowsOf(children).map(({ el, key }, i) => {
    const add: Record<string, unknown> = { key, divider: el.props.divider ?? i > 0 };
    if (extra) for (const k of Object.keys(extra)) if (el.props[k] === undefined) add[k] = extra[k];
    return cloneElement(el, add);
  });
}

const RULE: ViewStyle = { borderTopWidth: 1, borderTopColor: mono.line };
const t = (size: number, w: '400' | '700', color: string, lh = lhNormal(size)): TextStyle => ({ ...sans(w), fontSize: size, lineHeight: lh, color });

/** A row is a control only when it does something; a display row is a plain box (no button role, no press scale). */
function RowBox({
  onPress,
  role = 'button',
  checked,
  label,
  style,
  children,
}: {
  onPress?: () => void;
  role?: 'button' | 'switch';
  checked?: boolean;
  label?: string;
  style: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  if (!onPress) return <View accessibilityLabel={label} style={style}>{children}</View>;
  return (
    <Tap onPress={onPress} accessibilityRole={role} aria-checked={checked} label={label} style={style}>
      {children}
    </Tap>
  );
}

// ── settings rows (54) ──────────────────────────────────────────────────────

/**
 * A captioned group of settings rows (design-system §7.14): the caps label
 * (13/700 mute nowrap), `gap 10`, then the card — `r20 #1E1E1E overflow
 * hidden`. Groups stack `gap 18` in their screen's column. The sheets' groups
 * have no label.
 */
export function RowGroup({
  label,
  children,
  gap = 10,
  radius = 20,
  style,
}: {
  label?: string;
  children?: ReactNode;
  gap?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const card = <View style={{ borderRadius: radius, backgroundColor: mono.card, overflow: 'hidden' }}>{ruled(children)}</View>;
  if (!label) return style ? <View style={style}>{card}</View> : card;
  return (
    <View style={[{ gap }, style]}>
      <MonoText v="caps">{label}</MonoText>
      {card}
    </View>
  );
}

/**
 * One settings row: `height 54, padding 0 18, space-between, gap 12`. Left the
 * label 15/700 ink (`muted` → mute: "Delete account", "Remove photo"); right a
 * `gap 10` cluster of the value 14/700 mute and a `#5A574F` chevron — or a
 * `Toggle`, or nothing (`chevron={false}`: "Started VICI", the photo sheet's
 * rows). `valueLines` lets a **dynamic** value ellipsise instead of running
 * off a narrow phone (CRITIC C11); fixed copy never passes it.
 */
export function Row({
  label,
  value,
  chevron,
  toggle,
  muted,
  onPress,
  divider,
  valueLines,
  right,
  height = 54,
  accessibilityLabel,
}: {
  label: string;
  value?: string;
  /** default: drawn unless the row holds a toggle */
  chevron?: boolean;
  toggle?: { value: boolean; onChange: (next: boolean) => void };
  muted?: boolean;
  onPress?: () => void;
  /** the 1px rule above the row — `RowGroup` sets it on rows 2+ */
  divider?: boolean;
  valueLines?: number;
  /** anything else in the right cluster, after the value */
  right?: ReactNode;
  height?: number;
  accessibilityLabel?: string;
}) {
  const showChevron = chevron ?? !toggle;
  const press = toggle ? () => toggle.onChange(!toggle.value) : onPress;
  const shrink = valueLines != null;
  return (
    <RowBox
      onPress={press}
      role={toggle ? 'switch' : 'button'}
      checked={toggle?.value}
      label={accessibilityLabel}
      style={[
        { height: divider ? height + 1 : height, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
        divider ? RULE : null,
      ]}>
      <MonoText v="rowLabel" color={muted ? mono.mute : mono.ink}>
        {label}
      </MonoText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: shrink ? 1 : 0 }}>
        {value != null && value !== '' ? (
          <MonoText v="rowValue" numberOfLines={valueLines} style={shrink ? { flexShrink: 1 } : null}>
            {value}
          </MonoText>
        ) : null}
        {right}
        {toggle ? <Toggle value={toggle.value} /> : null}
        {showChevron ? <ChevronR color={mono.art} /> : null}
      </View>
    </RowBox>
  );
}

/**
 * The switch (design-system §7.15): `50×30 r15`, a 24 knob inset 3. On — the
 * only state the frames draw — is the ink track with a `#1E1E1E` knob at the
 * right (the kit's `#FFFFFF` knob vanished on ink; the frames corrected it).
 * Off (D322): the line track with an ink knob at left 3. The knob slides and
 * both fills cross-fade. Pass `onChange` to make it its own control; inside a
 * `Row` the row is the control and the switch only shows the state.
 */
export function Toggle({
  value,
  onChange,
  disabled,
  accessibilityLabel,
}: {
  value: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const p = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value, p]);
  const track = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(p.value, [0, 1], [mono.line, mono.ink]) }));
  const knob = useAnimatedStyle(() => ({
    left: 3 + 20 * p.value,
    backgroundColor: interpolateColor(p.value, [0, 1], [mono.ink, mono.card]),
  }));
  const body = (
    <Animated.View style={[{ width: 50, height: 30, borderRadius: 15 }, track]}>
      <Animated.View style={[{ position: 'absolute', top: 3, width: 24, height: 24, borderRadius: 12 }, knob]} />
    </Animated.View>
  );
  if (!onChange) return body;
  return (
    <Tap
      onPress={() => onChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      aria-checked={value}
      aria-disabled={!!disabled}
      label={accessibilityLabel}
      hitSlop={8}>
      {body}
    </Tap>
  );
}

// ── the kit's list rows (60) — Manage Subscription only ─────────────────────

/** The kit's `listRows` card (`r22 #1E1E1E overflow hidden`) — drawn only on Manage Subscription. */
export function ListRows({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ borderRadius: 22, backgroundColor: mono.card, overflow: 'hidden' }, style]}>{ruled(children)}</View>;
}

/** `height 60, padding 0 20, gap 12`: label 16/400 ink, value 16/700 ink, a `#9B968E` chevron. */
export function ListRow({
  label,
  value,
  chevron = true,
  onPress,
  divider,
  valueLines,
  accessibilityLabel,
}: {
  label: string;
  value?: string;
  chevron?: boolean;
  onPress?: () => void;
  divider?: boolean;
  valueLines?: number;
  accessibilityLabel?: string;
}) {
  const shrink = valueLines != null;
  return (
    <RowBox
      onPress={onPress}
      label={accessibilityLabel}
      style={[
        { height: divider ? 61 : 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
        divider ? RULE : null,
      ]}>
      <MonoText v="optionLabel" style={{ ...sans('400'), fontSize: 16, lineHeight: lhNormal(16) }}>
        {label}
      </MonoText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: shrink ? 1 : 0 }}>
        {value ? (
          <MonoText v="rowValue" numberOfLines={valueLines} style={[t(16, '700', mono.ink), shrink ? { flexShrink: 1 } : null]}>
            {value}
          </MonoText>
        ) : null}
        {chevron ? <ChevronR color={mono.mute} /> : null}
      </View>
    </RowBox>
  );
}

// ── ruled rows on the ground (logs, mail) ────────────────────────────────────

/**
 * The log's list idiom — no card, no fill, just the rules (logs §1): a column
 * of `RuledRow`s. `height` is the frame's row height for every row in it: 52
 * (the Log tabs, the overview summary), 56 (Weekly Report Urges), 46 (the
 * overview's dot rows).
 */
export function RuledRows({ children, height, style }: { children?: ReactNode; height?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{ruled(children, height != null ? { height } : undefined)}</View>;
}

/**
 * `height 52, padding 0 2, gap 14, space-between`: the label 15/700 ink nowrap;
 * the right side 14/700 mute nowrap in a `gap 8` row. `slipped` is the slip
 * variant — a 6×6 ink dot and the words in ink ("Slipped"). `labelWidth` fixes
 * the label column (the overview's dot rows, 96) and `children` replace the
 * right side (the dot bars).
 */
export function RuledRow({
  label,
  value,
  slipped,
  height = 52,
  labelWidth,
  children,
  onPress,
  divider,
  accessibilityLabel,
}: {
  label: string;
  value?: string;
  slipped?: boolean;
  height?: number;
  labelWidth?: number;
  children?: ReactNode;
  onPress?: () => void;
  divider?: boolean;
  accessibilityLabel?: string;
}) {
  const color = slipped ? mono.ink : mono.mute;
  return (
    <RowBox
      onPress={onPress}
      label={accessibilityLabel}
      style={[
        { height: divider ? height + 1 : height, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
        divider ? RULE : null,
      ]}>
      <MonoText v="rowLabel" style={labelWidth != null ? { width: labelWidth } : null}>
        {label}
      </MonoText>
      {children ??
        (value != null ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {slipped ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: mono.ink }} /> : null}
            <MonoText v="rowValue" color={color}>
              {value}
            </MonoText>
          </View>
        ) : null)}
    </RowBox>
  );
}

// ── detail rows: the done screens' summary card ─────────────────────────────

/**
 * The summary card of Lapse Done, Slip Logged and Urge Log Done (design-system
 * §7.14, CRITIC C10): `r22 #1E1E1E overflow hidden`, **shrink-to-fit** and
 * centred — as wide as its widest row and never wider than its column. Lapse
 * Done's measures 326, Urge Log Done's 249, Slip Logged's fills 345 because
 * its words would run past it; one rule gives all three. Pass `rows`, or
 * `DetailRow` children.
 */
export function SummaryCard({
  rows,
  children,
  stretch,
  style,
}: {
  rows?: { label: string; value: string }[];
  children?: ReactNode;
  /** fill the column instead of hugging the rows */
  stretch?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        { borderRadius: 22, backgroundColor: mono.card, overflow: 'hidden', alignSelf: stretch ? 'stretch' : 'center', maxWidth: '100%' },
        style,
      ]}>
      {ruled(rows ? rows.map((r) => <DetailRow key={r.label} label={r.label} value={r.value} />) : children)}
    </View>
  );
}

/** `DetailRows` is the same card, named for the rows it holds. */
export const DetailRows = SummaryCard;

/**
 * `padding 16 20, space-between, align flex-start, gap 16`: the label 14/700
 * mute nowrap one point lower (`padding-top 1`), the value 15/700 ink,
 * right-aligned, `line-height 22`, wrapping when the card is at full width.
 */
export function DetailRow({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <View
      style={[
        { paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
        divider ? RULE : null,
      ]}>
      <MonoText v="rowValue" style={{ paddingTop: 1, flexShrink: 0 }}>
        {label}
      </MonoText>
      <MonoText v="rowLabel" wrap="wrap" style={{ lineHeight: 22, textAlign: 'right', flexShrink: 1 }}>
        {value}
      </MonoText>
    </View>
  );
}

// ── check rows: the record lists ─────────────────────────────────────────────

/** A column of `CheckRow`s, ruled — Morning 1 Yesterday, Night 2 Record. */
export function CheckRows({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{ruled(children)}</View>;
}

/**
 * `height 58, padding 0 2, gap 14`: a 22 ink disc with an 11 check, the label
 * 16/400 ink filling the row, and an optional value 15/700 ink ("+12 → 1,240").
 * The frames only draw done rows; `done={false}` (a negative — "No urges
 * logged") is the `empty` disc, a bare 1.5 `#2E2E2E` ring with no check, as
 * today-day OQ-M2 recommends. The negatives keep their own copy.
 */
export function CheckRow({ label, value, done = true, divider }: { label: string; value?: string; done?: boolean; divider?: boolean }) {
  return (
    <View
      style={[
        { height: divider ? 59 : 58, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', gap: 14 },
        divider ? RULE : null,
      ]}>
      <CheckDisc size={22} state={done ? 'done' : 'empty'} />
      <MonoText v="optionLabel" style={{ ...t(16, '400', mono.ink), flex: 1 }}>
        {label}
      </MonoText>
      {value ? <MonoText v="rowLabel">{value}</MonoText> : null}
    </View>
  );
}
