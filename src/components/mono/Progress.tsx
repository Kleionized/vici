import { useEffect } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { lhNormal, mono, sans } from '@/lib/theme';

import { CheckDisc } from './pills';

/**
 * The bundle's one loading visual (Enlisting Aegis): an 88 svg — a dotted
 * r38 ring (`2 7`, stroke 2) under a quarter arc from 12 to 3 o'clock (stroke
 * 4, round). The frame is static; the app turns the whole mark, one turn per
 * 1.2 s, and holds it still under Reduce Motion or `spinning={false}` (a
 * capture of the frame's own pose).
 */
export function Spinner({
  size = 88,
  color = mono.ink,
  spinning = true,
  style,
}: {
  size?: number;
  color?: string;
  spinning?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const turn = useSharedValue(0);
  const spin = spinning && !reduced;

  useEffect(() => {
    if (!spin) {
      cancelAnimation(turn);
      turn.value = 0;
      return;
    }
    turn.value = 0;
    turn.value = withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(turn);
  }, [spin, turn]);

  const rotate = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));

  return (
    <Animated.View accessibilityRole="progressbar" accessibilityLabel="Loading" style={[{ width: size, height: size }, rotate, style]}>
      <Svg width={size} height={size} viewBox="0 0 88 88">
        <Circle cx={44} cy={44} r={38} fill="none" stroke={color} strokeWidth={2} strokeDasharray="2 7" />
        <Path d="M44 6 A38 38 0 0 1 82 44" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

export type StepState = 'done' | 'current' | 'pending';

/**
 * The step list under the spinner (design-system §7.25): column gap 18, rows
 * `gap 14` — the 26 `CheckDisc` (done / current / pending), then the line,
 * 16/700 ink when done or current, 16/400 mute while pending. `current` is the index of the step in progress; steps
 * before it are done, after it pending (`current = steps.length` → all done).
 */
export function StepList({ steps, current, style }: { steps: string[]; current: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ gap: 18 }, style]}>
      {steps.map((label, i) => {
        const state: StepState = i < current ? 'done' : i === current ? 'current' : 'pending';
        return (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <CheckDisc size={26} glyph={13} state={state} />
            <Text
              maxFontSizeMultiplier={1.3}
              style={{
                ...sans(state === 'pending' ? '400' : '700'),
                flex: 1,
                fontSize: 16,
                lineHeight: lhNormal(16),
                color: state === 'pending' ? mono.mute : mono.ink,
              }}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
