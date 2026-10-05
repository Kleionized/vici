import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { lhNormal, mono, sans } from '@/lib/theme';

import { Tap } from './Tap';

/** A wheel time: what the three columns show. */
export type WheelTime = { hour12: number; minute: number; period: 'AM' | 'PM' };
export type WheelColumnKey = 'hour' | 'minute' | 'period';
/** Which column moved and by how many rows — for callers that think in steps (±1 h, ±1 min, ±12 h). */
export type WheelStep = { column: WheelColumnKey; delta: number };

/** Every row is 44 tall; the band sits on the third of five (canvas `top 88`). */
const ROW = 44;
const VISIBLE = 5;
const COLUMN_H = ROW * VISIBLE;
const BAND_TOP = 88;
/**
 * A column claims a vertical move after 4 pt — before a scroll view around the
 * wheel would (Android's touch slop is 8 dp, UIKit's scroll pan starts later
 * still), and with native gesture handlers the first to activate wins. A
 * sideways move of 10 first leaves the touch to whatever pages horizontally.
 */
const CLAIM_Y = 4;
const YIELD_X = 10;

/**
 * A row's look by its distance from the band, straight off the frames: the
 * picked row 30/900 ink, its neighbours 22/400 mute, the outer pair 22/400 in
 * the line grey. Rows further out only exist mid-drag, outside the column's
 * clip, and keep the outer look.
 */
const LOOK = [
  { ...sans('900'), fontSize: 30, lineHeight: lhNormal(30), color: mono.ink },
  { ...sans('400'), fontSize: 22, lineHeight: lhNormal(22), color: mono.mute },
  { ...sans('400'), fontSize: 22, lineHeight: lhNormal(22), color: mono.line },
] as const;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const webNoSelect = Platform.OS === 'web' ? ({ userSelect: 'none', cursor: 'grab', touchAction: 'none' } as unknown as ViewStyle) : null;

/**
 * One column of five rows. The column is a window onto an unbounded strip of
 * rows (virtual index → `values[index mod n]` when it loops), so a looping
 * column never runs out and never has to jump back to a middle copy. The strip
 * moves under the finger; on release it projects the flick, settles on a whole
 * row (44 — always a whole point, so rows land exactly where the canvas puts
 * them), and only then reports the new value.
 *
 * It is fully controlled: `index` is the caller's value, and whenever a move
 * ends the column checks it again — a caller that refuses or clamps a value
 * (slip's "never in the future") gets the strip rolled back to what it holds.
 * A value that arrives from outside while the strip is still (or settling
 * after the finger lifted) rolls the strip to it; one that arrives while a
 * finger holds the column becomes the value the drag's step is counted from.
 *
 * Tapping a row above or below the band steps to it — the slip and urge-log
 * flows nudge the time that way.
 */
function Column({
  values,
  index,
  width,
  loop,
  label,
  onStep,
}: {
  values: string[];
  index: number;
  width: number;
  loop: boolean;
  label: string;
  onStep: (delta: number, nextIndex: number) => void;
}) {
  const n = values.length;
  const [offset] = useState(() => new Animated.Value(index));
  const pos = useRef(index); // live position, in rows (fractional mid-drag)
  // the virtual row standing for the caller's value — what a step is counted from
  const committed = useRef(index);
  const [center, setCenter] = useState(index);
  const centerRef = useRef(index);
  const held = useRef(false); // a finger is moving the strip
  const dragged = useRef(false); // this touch became a drag, so the row under it must not also step
  const start = useRef(0);
  const lastMove = useRef(0);
  // the outer rows (±3) only exist while the strip moves: at rest the column
  // holds exactly its five rows and has nothing to scroll (a drive's `scrollBy`
  // looks for the first div with overflow and would otherwise find a wheel)
  const [moving, setMoving] = useState(false);
  // bumped whenever a move ends, so the value check runs after the caller answered
  const [settles, setSettles] = useState(0);

  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  useEffect(() => {
    const id = offset.addListener(({ value }) => {
      pos.current = value;
      const c = Math.round(value);
      if (c !== centerRef.current) {
        centerRef.current = c;
        setCenter(c);
      }
    });
    return () => offset.removeListener(id);
  }, [offset]);

  const clampRow = (v: number) => (loop ? v : Math.max(0, Math.min(n - 1, v)));

  /** Animate the strip to a whole row; `report` says whether arriving there is the user's step. */
  const run = (to: number, report: boolean, ms?: number) => {
    setMoving(true);
    Animated.timing(offset, {
      toValue: to,
      duration: ms ?? Math.min(520, 160 + Math.abs(to - pos.current) * 30),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      // a drag or a newer move took the strip over; that one reports
      if (!finished) return;
      setMoving(false);
      if (report) {
        const delta = to - committed.current;
        committed.current = to;
        if (delta !== 0) onStepRef.current(delta, loop ? mod(to, n) : to);
      }
      setSettles((k) => k + 1);
    });
  };
  const settle = (target: number, ms?: number) => run(clampRow(target), true, ms);
  const step = (d: number) => settle(Math.round(pos.current) + d, 200);

  // The caller's value is the truth. After every settle (and whenever the value
  // changes) the strip is checked against it and rolled there, by the shortest
  // way round, without reporting anything back.
  useEffect(() => {
    let target = index;
    if (loop) {
      const base = Math.round(pos.current);
      let d = mod(index - mod(base, n), n);
      if (d > n / 2) d -= n;
      target = base + d;
    }
    committed.current = target;
    if (held.current || pos.current === target) return;
    offset.stopAnimation();
    run(target, false);
    // `run` is rebuilt every render; the strip only needs re-checking when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, loop, n, offset, settles]);

  // The drag. Native gesture handlers, not the JS responder: a responder
  // cannot keep a parent ScrollView from taking the touch (Android intercepts,
  // iOS's scroll pan cancels it), and the wheel sits in one on short screens.
  const settleRef = useRef(settle);
  useEffect(() => {
    settleRef.current = settle;
  });
  // The builder only stores these callbacks; they run on gesture events, never
  // during render — which is what the refs and purity rules cannot see through.
  /* eslint-disable react-hooks/refs, react-hooks/purity */
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetY([-CLAIM_Y, CLAIM_Y])
        .failOffsetX([-YIELD_X, YIELD_X])
        .onBegin(() => {
          dragged.current = false;
        })
        .onStart(() => {
          offset.stopAnimation();
          held.current = true;
          dragged.current = true;
          start.current = pos.current;
          setMoving(true);
        })
        .onUpdate((e) => {
          lastMove.current = Date.now();
          let next = start.current - e.translationY / ROW;
          // past either end of a column that does not loop, the strip drags at a third
          if (!loop) {
            if (next < 0) next = next / 3;
            else if (next > n - 1) next = n - 1 + (next - (n - 1)) / 3;
          }
          offset.setValue(next);
        })
        .onEnd((e, ok) => {
          held.current = false;
          // project the flick (velocity is pt/s) and settle on the nearest whole
          // row. A finger that stopped before lifting throws nothing (the web
          // tracker keeps its last speed however long the pause), and a touch
          // taken away mid-drag just settles where it is.
          const still = Date.now() - lastMove.current > 90;
          const throwRows = ok && !still ? ((e.velocityY / 1000) * 180) / ROW : 0;
          settleRef.current(Math.round(pos.current - throwRows));
        }),
    [offset, loop, n],
  );
  /* eslint-enable react-hooks/refs, react-hooks/purity */

  const translateY = useMemo(() => Animated.multiply(offset, -ROW), [offset]);
  const rows: number[] = [];
  const reach = moving ? 3 : 2;
  for (let i = center - reach; i <= center + reach; i++) rows.push(i);

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        aria-valuetext={values[loop ? mod(center, n) : Math.max(0, Math.min(n - 1, center))]}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
        style={[{ width, height: COLUMN_H, overflow: 'hidden' }, webNoSelect]}>
        <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: COLUMN_H, transform: [{ translateY }] }}>
          {rows.map((i) => {
            const has = loop || (i >= 0 && i < n);
            const value = has ? values[mod(i, n)] : '';
            const away = Math.min(2, Math.abs(i - center));
            const look = LOOK[away];
            const body = value ? (
              <Text maxFontSizeMultiplier={1.3} style={look}>
                {value}
              </Text>
            ) : null;
            const box: ViewStyle = { position: 'absolute', left: 0, right: 0, top: BAND_TOP + i * ROW, height: ROW, alignItems: 'center', justifyContent: 'center' };
            if (!value || i === center) {
              return (
                <View key={i} style={[box, { pointerEvents: 'none' }]}>
                  {body}
                </View>
              );
            }
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`${label} ${value}`}
                // on the web build a mouse drag that started here still ends in a click
                onPress={() => (dragged.current ? undefined : step(i - centerRef.current))}
                style={box}>
                {body}
              </Pressable>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const PERIODS = ['AM', 'PM'];

/**
 * The time wheel (design-system §7.26; every check-in-time frame, Lapse /
 * Slip / Urge Log When): a 220-tall box, the `#1E1E1E` band at `left 40
 * right 40 top 88 h44 r14`, and a centred cluster — hour 70 · ":" · minute 70 ·
 * AM/PM 60, gap 12. Hours and minutes loop; the meridiem is a real two-row
 * column (AM above PM), so its empty rows are empty.
 *
 * Fully controlled, like a text input: `value` in, `onChange(next, step)` out
 * once a column settles — `step` says which column moved and by how many rows,
 * for callers that shift a timestamp (±1 h, ±1 min, ±12 h) rather than store a
 * clock time. The wheel always comes to rest on `value`: a caller that keeps
 * its old value or clamps the new one (a picked time may not be in the future)
 * sees the column roll back to what it holds. Answer in `onChange` itself (set
 * state there) — a value that only arrives later rolls the wheel back and then
 * forward again.
 *
 * `minuteStep` thins the minute column (5 → 00, 05 … 55). Hold minutes on the
 * step: an off-step minute shows as the step at or below it (58 → 55, never the
 * next hour's 00), and nothing is reported until the user moves that column.
 */
export function TimeWheel({
  value,
  onChange,
  minuteStep = 1,
  style,
}: {
  value: WheelTime;
  onChange: (next: WheelTime, step: WheelStep) => void;
  minuteStep?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const minutes = useMemo(
    () => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => String(i * minuteStep).padStart(2, '0')),
    [minuteStep],
  );
  const minuteIndex = mod(Math.floor(value.minute / minuteStep), minutes.length);

  return (
    <View style={[{ height: COLUMN_H, flexDirection: 'row', justifyContent: 'center' }, style]}>
      <View
        style={{ position: 'absolute', left: 40, right: 40, top: BAND_TOP, height: ROW, borderRadius: 14, backgroundColor: mono.card, pointerEvents: 'none' }}
      />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* each step is built on `value` as the caller holds it now, never on a value it refused */}
        <Column
          label="Hour"
          values={HOURS}
          index={value.hour12 - 1}
          width={70}
          loop
          onStep={(delta, i) => onChange({ ...value, hour12: i + 1 }, { column: 'hour', delta })}
        />
        <View style={{ height: COLUMN_H, justifyContent: 'center', pointerEvents: 'none' }}>
          <Text maxFontSizeMultiplier={1.3} style={{ ...sans('700'), fontSize: 30, lineHeight: lhNormal(30), color: mono.ink }}>
            :
          </Text>
        </View>
        <Column
          label="Minute"
          values={minutes}
          index={minuteIndex}
          width={70}
          loop
          onStep={(delta, i) => onChange({ ...value, minute: i * minuteStep }, { column: 'minute', delta })}
        />
        <Column
          label="AM or PM"
          values={PERIODS}
          index={value.period === 'PM' ? 1 : 0}
          width={60}
          loop={false}
          onStep={(delta, i) => onChange({ ...value, period: i === 1 ? 'PM' : 'AM' }, { column: 'period', delta })}
        />
      </View>
    </View>
  );
}

/** Sunday first, as the check-in-time frames draw it (CRITIC C16). */
export const DAY_LABELS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'] as const;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * The seven day toggles under "Select days": `space-between`, 42×42 r21. On is
 * the ink disc with a `#111111` 14/700 letter (every frame draws all seven on);
 * off — never drawn — is the card disc with an ink letter (D322). `value` is
 * the set of days on, 0 = Sunday.
 */
export function DayToggles({
  value,
  onChange,
  style,
}: {
  value: number[];
  onChange?: (next: number[], day: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, style]}>
      {DAY_LABELS.map((label, day) => {
        const on = value.includes(day);
        return (
          <Tap
            key={label}
            label={DAY_NAMES[day]}
            accessibilityRole="checkbox"
            // `aria-checked`, which RN-web renders and native maps to accessibilityState
            aria-checked={on}
            hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
            onPress={() => onChange?.(on ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b), day)}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: on ? mono.ink : mono.card, alignItems: 'center', justifyContent: 'center' }}>
            <Text maxFontSizeMultiplier={1.3} style={{ ...sans('700'), fontSize: 14, lineHeight: lhNormal(14), color: on ? mono.onInk : mono.ink }}>
              {label}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/** `{hour12, minute, period}` ⇄ minutes after midnight. */
export function wheelToMinutes(t: WheelTime): number {
  return ((t.hour12 % 12) + (t.period === 'PM' ? 12 : 0)) * 60 + t.minute;
}
export function wheelFromMinutes(total: number): WheelTime {
  const m = mod(Math.round(total), 24 * 60);
  const h24 = Math.floor(m / 60);
  return { hour12: h24 % 12 || 12, minute: m % 60, period: h24 >= 12 ? 'PM' : 'AM' };
}
