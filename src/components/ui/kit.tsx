import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, sans } from '@/lib/theme';
import { AppText } from './AppText';
import { BackGlyph } from './marks';
import { PressScale } from './press-scale';

/**
 * Ported design-kit primitives from the Claude Design handoff (`stoic-kit.jsx`):
 * the monotone Glyph icon set, IconChip, grouped settings list (SettingsGroup /
 * SettingsRow), and the original tideline tide/journey/crest illustrations.
 * Faithful to the bundle, expressed in react-native-svg.
 */

type GlyphFn = (c: string, opt?: boolean) => ReactNode;

// ── monotone line/solid UI glyphs ───────────────────────────────────────────
export const Glyph: Record<string, GlyphFn> = {
  home: (c) => (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z" stroke={c} strokeWidth={1.9} strokeLinejoin="round" />
    </Svg>
  ),
  compass: (c) => (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={1.9} />
      <Path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke={c} strokeWidth={1.9} strokeLinejoin="round" />
    </Svg>
  ),
  pen: (c) => (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z" stroke={c} strokeWidth={1.9} strokeLinejoin="round" />
    </Svg>
  ),
  spark: (c) => (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3c.5 4 1.5 6 5 6.5-3.5.5-4.5 2.5-5 6.5-.5-4-1.5-6-5-6.5 3.5-.5 4.5-2.5 5-6.5z" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  ),
  lock: (c, fill) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={10} width={16} height={11} rx={2.5} fill={fill ? c : 'none'} stroke={c} strokeWidth={1.8} />
      <Path d="M8 10V7a4 4 0 018 0v3" stroke={c} strokeWidth={1.8} />
    </Svg>
  ),
  bell: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6 16V11a6 6 0 0112 0v5l2 2H4l2-2z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M10 20a2 2 0 004 0" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
  book: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5a2 2 0 012-2h6v17H6a2 2 0 01-2-2V5zM20 5a2 2 0 00-2-2h-6v17h6a2 2 0 002-2V5z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
  search: (c) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={c} strokeWidth={2} />
      <Path d="M16.5 16.5L21 21" stroke={c} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  shield: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  ),
  download: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  trash: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13h8l1-13" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  face: (c) => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path d="M5 8V6a1 1 0 011-1h2M16 5h2a1 1 0 011 1v2M19 16v2a1 1 0 01-1 1h-2M8 19H6a1 1 0 01-1-1v-2" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M9 10v1M15 10v1M12 9v3l-1 1M9.5 15c1.5 1 3.5 1 5 0" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
  flag: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6 21V4m0 0h11l-2 4 2 4H6" stroke={c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  user: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={c} strokeWidth={1.8} />
      <Path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  doc: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M13 3v5h5" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
  check: (c, _w) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12l5 5L20 6" stroke={c} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  chevR: (c) => (
    <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
      <Path d="M1 1l6 7-6 7" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  star: (c, fill) => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z" fill={fill ? c : 'none'} stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  ),
  anchor: (c) => (
    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={2.2} stroke={c} strokeWidth={1.8} />
      <Path d="M12 7v13M5 12a7 7 0 0014 0M8 11H5M19 11h-3" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  wave: (c) => (
    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
      <Path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  sun: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4.2} stroke={c} strokeWidth={1.8} />
      <Path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.8 1.8M17 17l1.8 1.8M18.8 5.2L17 7M7 17l-1.8 1.8" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  moon: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20 14.5A8 8 0 019.5 4 7.5 7.5 0 1020 14.5z" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  ),
  clock: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={c} strokeWidth={1.8} />
      <Path d="M12 7v5l3.5 2" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  calendar: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5} width={16} height={16} rx={2.5} stroke={c} strokeWidth={1.8} />
      <Path d="M4 9.5h16M8 3v4M16 3v4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  heart: (c, fill) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20S3.5 14.5 3.5 8.8A4.3 4.3 0 0112 6.2a4.3 4.3 0 018.5 2.6C20.5 14.5 12 20 12 20z" fill={fill ? c : 'none'} stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  ),
  leaf: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20 4S6 3 5 13c-.5 5 4 6 4 6M5 19c2-9 9-12 13-13" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  map: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M9 4v14M15 6v14" stroke={c} strokeWidth={1.7} />
    </Svg>
  ),
  card: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5.5} width={18} height={13} rx={2.5} stroke={c} strokeWidth={1.8} />
      <Path d="M3 9.5h18M6.5 14.5h4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  gift: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={9} width={16} height={11} rx={1.5} stroke={c} strokeWidth={1.8} />
      <Path d="M3 9h18M12 9v11M12 9S10.5 4 8 5.5 9.5 9 12 9zM12 9s1.5-5 4-3.5S14.5 9 12 9z" stroke={c} strokeWidth={1.7} strokeLinejoin="round" />
    </Svg>
  ),
  restore: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5v5h5M4.5 14a8 8 0 102-7.5L4 10" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
};

export type GlyphName = keyof typeof Glyph;

// ── pill toggle (white track + dark knob when on) ───────────────────────────
export function Toggle({ on = false }: { on?: boolean }) {
  return (
    <View style={{ width: 51, height: 31, borderRadius: 9999, backgroundColor: on ? colors.accent : colors.borderStrong, justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          top: 2.5,
          left: on ? 22.5 : 2.5,
          width: 26,
          height: 26,
          borderRadius: 9999,
          backgroundColor: on ? colors.accentText : '#F2F2EE',
        }}
      />
    </View>
  );
}

// ── round avatar with initials (white fill, dark glyph) ─────────────────────

// ── round/soft-square chip holding a monotone glyph ─────────────────────────
export function IconChip({
  name,
  size = 38,
  radius: rad = 12,
  tone = 'soft',
  color,
  chipColor,
}: {
  name: GlyphName;
  size?: number;
  radius?: number;
  tone?: 'soft' | 'ink' | 'plain';
  color?: string;
  /** Override the soft chip fill (the settings rows use the warmer #F1EFE9). */
  chipColor?: string;
}) {
  const bg = tone === 'ink' ? colors.accent : tone === 'plain' ? 'transparent' : (chipColor ?? colors.accentSoft);
  const glyphColor = color ?? (tone === 'ink' ? colors.accentText : colors.text);
  return (
    <View style={{ width: size, height: size, borderRadius: rad, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {Glyph[name](glyphColor)}
    </View>
  );
}

// ── grouped settings list (rounded card, hairline-divided rows) ─────────────
/**
 * The chrome every settings sub-page wears (canvas: App Lock · Data Privacy):
 * a labelled back affordance naming where you came from, then the page title
 * set large on the left.
 */
export function SettingsTopBar({ title, back = 'Settings', onBack }: { title: string; back?: string; onBack: () => void }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <PressScale
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={`Back to ${back}`}
        style={{ minHeight: 40, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <BackGlyph />
        <AppText style={[sans('400'), { fontSize: 17, color: colors.textMuted }]}>{back}</AppText>
      </PressScale>
      <AppText style={[sans('600'), { marginTop: 4, fontSize: 27, letterSpacing: -0.4, color: colors.inkAlt }]}>{title}</AppText>
    </View>
  );
}

// ── original tideline illustrations: tide / journey / crest ─────────────────

// ── a plan card (paywall) ───────────────────────────────────────────────────
