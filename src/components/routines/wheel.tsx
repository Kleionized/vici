import { useEffect, useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { TimeOfDay } from '@/lib/routines';
import { sans } from '@/lib/theme';

/**
 * The time wheel the two check-in boards share (108/109 on the canvas).
 *
 * The canvas draws a static perspective stack: the selected row 30px inside a
 * 44px line box, the six around it stepping down to 22/21/20 inside 29px ones.
 * Those rows are not evenly spaced — the first neighbour sits 36.5 from the
 * centre and each one after that a further 29 — so the scroll runs on a flat
 * 36.5 interval and every row is then nudged back toward the centre to land on
 * the canvas's spacing.
 */

const ITEM_H = 36.5;
/** Canvas 250 → 468: three rows either side of the selected one, and nothing past them. */
const COLUMN_H = 218;
const PAD = (COLUMN_H - ITEM_H) / 2;
/** Spacing between the off-centre rows once past the first neighbour. */
const OUTER_GAP = 29;

/** Size, leading and tone by distance from the selected row, straight off the canvas. */
const STEPS = [
  { size: 30, leading: 44, color: '#1D1C1A' },
  { size: 22, leading: 29, color: 'rgba(90,88,82,0.55)' },
  { size: 21, leading: 29, color: 'rgba(120,117,110,0.5)' },
  { size: 20, leading: 29, color: 'rgba(140,137,130,0.45)' },
];

function Column({
  values,
  index,
  onIndex,
  width,
  label,
  loop = false,
}: {
  values: string[];
  index: number;
  onIndex: (next: number) => void;
  width: number;
  label: string;
  loop?: boolean;
}) {
  const ref = useRef<ScrollView>(null);
  // The canvas shows 57/58/59 above a selected 00, so hours and minutes wrap.
  // Three copies is enough runway that a thumb never reaches an end before the
  // wheel has settled and re-centred on the middle one.
  const rows = loop ? [...values, ...values, ...values] : values;
  const base = loop ? values.length : 0;

  // Where the wheel is right now, in rows — fractional, so the perspective
  // moves with the finger rather than only after the snap settles.
  const [offset, setOffset] = useState(index + base);
  const position = useRef(0);

  // `contentOffset` is iOS-only, so the column has to be scrolled to the saved
  // value by hand. Re-running on `index` also catches the stored routine
  // arriving from disk a beat after the screen mounts.
  useEffect(() => {
    const target = index + base;
    if (Math.abs(target - position.current) < 0.5) return;
    ref.current?.scrollTo({ y: target * ITEM_H, animated: false });
    position.current = target;
    setOffset(target);
  }, [index, base]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = event.nativeEvent.contentOffset.y / ITEM_H;
    position.current = next;
    setOffset(next);
  };

  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>, recentre: boolean) => {
    const landed = Math.max(0, Math.min(rows.length - 1, Math.round(event.nativeEvent.contentOffset.y / ITEM_H)));
    const next = loop ? ((landed % values.length) + values.length) % values.length : landed;
    if (next !== index) onIndex(next);
    if (!recentre || !loop) return;
    const target = next + base;
    if (target === landed) return;
    ref.current?.scrollTo({ y: target * ITEM_H, animated: false });
    position.current = target;
    setOffset(target);
  };

  // Only the rows near the band are built; 180 live <Text> nodes re-rendering on
  // every scroll frame is what makes a wheel stutter.
  const first = Math.max(0, Math.round(offset) - 4);
  const last = Math.min(rows.length - 1, Math.round(offset) + 4);

  return (
    <ScrollView
      ref={ref}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: values[index] }}
      // ScrollView composes its own `baseVertical` under this style, and that
      // base carries flexGrow/flexShrink 1 — which `width` does not override.
      // Left alone, the three columns stretch to fill the row and none of them
      // lands on the canvas's x. Pinning both flex factors to 0 is what keeps
      // 40 / 50 / 60 at 105 / 172 / 238.
      style={{ width, height: COLUMN_H, flexGrow: 0, flexShrink: 0 }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_H}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={16}
      onMomentumScrollEnd={(event) => settle(event, true)}
      onScrollEndDrag={(event) => settle(event, false)}>
      <View style={{ height: PAD + first * ITEM_H }} />
      {rows.slice(first, last + 1).map((value, k) => {
        const i = first + k;
        const d = i - offset;
        const away = Math.abs(d);
        const step = STEPS[Math.min(3, Math.round(away))];
        // Flat scroll travel out, canvas spacing back in.
        const placed = away <= 1 ? d * ITEM_H : Math.sign(d) * (ITEM_H + (away - 1) * OUTER_GAP);
        return (
          <View key={`${value}-${i}`} style={{ height: ITEM_H, alignItems: 'center', justifyContent: 'center' }}>
            <AppText
              style={[
                sans('400'),
                {
                  fontSize: step.size,
                  lineHeight: step.leading,
                  color: step.color,
                  transform: [{ translateY: placed - d * ITEM_H }],
                },
              ]}>
              {value}
            </AppText>
          </View>
        );
      })}
      <View style={{ height: (rows.length - 1 - last) * ITEM_H + PAD }} />
    </ScrollView>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export function TimeWheel({ value, onChange }: { value: TimeOfDay; onChange: (next: TimeOfDay) => void }) {
  return (
    <View style={{ height: COLUMN_H }}>
      {/* the band under the selected rows — canvas 46/301 wide at y 335, i.e. 85 into the stack and 2px above the row's own box */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 46, width: 301, top: 85, height: 44, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.08)' }}
      />
      {/* the canvas pins the columns at x 105/172/238; 105 + 40 + 27 = 172 and 172 + 50 + 16 = 238, so the row is padded to the
          literal origin rather than centred — the frame's cluster centre (201.5) is 5px right of the band's (196.5) and that
          disagreement is part of the drawing */}
      <View style={{ flexDirection: 'row', paddingLeft: 105 }}>
        <Column values={HOURS} index={value.hour - 1} onIndex={(i) => onChange({ ...value, hour: i + 1 })} width={40} label="Hour" loop />
        <View style={{ width: 27 }} />
        <Column values={MINUTES} index={value.minute} onIndex={(i) => onChange({ ...value, minute: i })} width={50} label="Minute" loop />
        <View style={{ width: 16 }} />
        <Column values={PERIODS} index={value.period === 'PM' ? 1 : 0} onIndex={(i) => onChange({ ...value, period: i === 1 ? 'PM' : 'AM' })} width={60} label="AM or PM" />
      </View>
    </View>
  );
}
