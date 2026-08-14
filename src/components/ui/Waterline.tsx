import { Image } from 'expo-image';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from './AppText';
import { sans } from '@/lib/theme';

/**
 * 01 · Splash and 02 · Finding the Waterline — the two launch frames.
 *
 * Both are the same night field: a #131313 → #2E2C29 gradient with soft radial
 * washes bled off the edges and a handful of 2px stars. The canvas blurs each
 * wash by 6–8px; a `closest-side` radial is already that soft, so the SVG
 * ellipse stands in for it without a filter (RN SVG has none).
 *
 * Laid out in the canvas's own 393 × 852 frame and stretched to the device, so
 * the composition holds its proportions on any screen.
 */

const laurelMark = require('../../../assets/images/laurel-mark.webp');
const noiseDark = require('../../../assets/images/noise-dark.png');

/** A `radial-gradient(closest-side, c, transparent <fade>%)` wash. */
function Wash({
  id,
  left,
  top,
  width,
  height,
  color,
  opacity,
  fade,
}: {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  fade: number;
}) {
  return (
    <>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset={fade / 2 / 100} stopColor={color} stopOpacity={opacity * 0.42} />
          <Stop offset={fade / 100} stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={left + width / 2} cy={top + height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </>
  );
}

function Star({ x, y, opacity }: { x: number; y: number; opacity: number }) {
  return <Circle cx={x + 1} cy={y + 1} r={1} fill="#A09B91" fillOpacity={opacity} />;
}

/**
 * 01 · Splash — the mark, held between a cool wash above and a warm one below.
 */
export function SplashScene() {
  return (
    <View style={{ flex: 1, backgroundColor: '#131313', overflow: 'hidden' }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 393 852"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Defs>
          <LinearGradient id="spField" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#131313" />
            <Stop offset="0.55" stopColor="#1D1C1A" />
            <Stop offset="1" stopColor="#2E2C29" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={393} height={852} fill="url(#spField)" />
        <Wash id="spA" left={-30} top={-120} width={480} height={240} color="#787369" opacity={0.2} fade={72} />
        <Wash id="spB" left={120} top={290} width={230} height={230} color="#788C96" opacity={0.1} fade={70} />
        <Wash id="spC" left={118} top={395} width={120} height={150} color="#E2BE8C" opacity={0.16} fade={72} />
        <Wash id="spD" left={-60} top={620} width={420} height={260} color="#787369" opacity={0.14} fade={72} />
        <Star x={96} y={140} opacity={0.22} />
        <Star x={290} y={205} opacity={0.18} />
        <Star x={200} y={590} opacity={0.15} />
        <Star x={330} y={700} opacity={0.14} />
      </Svg>

      {/* the mark, at 41% across and 47% down — where the canvas sets it */}
      <Image
        source={laurelMark}
        tintColor="#FFFFFF"
        contentFit="contain"
        style={{ position: 'absolute', left: '40.7%', top: '46.9%', width: 72, height: 72, opacity: 0.9 }}
      />

      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }} />
    </View>
  );
}

/**
 * 02 · Finding the Waterline — the same field with the washes pulled to the top
 * and bottom edges, and the ring low on the screen where the thumb already is.
 */
export function WaterlineScene({ label = 'Finding the waterline...' }: { label?: string }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.linear }), -1, false);
  }, [spin]);
  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));

  return (
    <View style={{ flex: 1, backgroundColor: '#131313', overflow: 'hidden' }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 393 852"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Defs>
          <LinearGradient id="wgField" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#131313" />
            <Stop offset="0.55" stopColor="#1D1C1A" />
            <Stop offset="1" stopColor="#2E2C29" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={393} height={852} fill="url(#wgField)" />
        <Wash id="wgA" left={-40} top={-140} width={540} height={270} color="#B4AA96" opacity={0.34} fade={72} />
        <Wash id="wgB" left={230} top={-110} width={330} height={210} color="#B4AA96" opacity={0.26} fade={70} />
        <Wash id="wgC" left={-40} top={610} width={470} height={300} color="#787369" opacity={0.3} fade={72} />
        <Wash id="wgD" left={170} top={690} width={330} height={230} color="#787369" opacity={0.22} fade={70} />
        <Star x={96} y={415} opacity={0.28} />
        <Star x={288} y={372} opacity={0.2} />
        <Star x={186} y={540} opacity={0.16} />
      </Svg>

      {/* 770 / 852 down the frame — low, next to the home indicator */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '90.4%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 13,
        }}>
        <Animated.View style={ring}>
          <Svg width={36} height={36} viewBox="0 0 36 36">
            <Circle
              cx={18}
              cy={18}
              r={15}
              fill="none"
              stroke="#131313"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray="82 13"
              transform="rotate(-70 18 18)"
            />
          </Svg>
        </Animated.View>
        <AppText style={[sans('400'), { fontSize: 17.5, letterSpacing: 0.2, color: 'rgba(244,243,240,0.8)' }]}>{label}</AppText>
      </View>
    </View>
  );
}
