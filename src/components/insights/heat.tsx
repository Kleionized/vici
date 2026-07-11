import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Insights heatmap primitives (canvas: screens-analytics) — one tinted
 * cell per day on the shared MOOD_TONES ramp, the caps day-of-week
 * header, the tone legend, the 2W/4W/12W range filter, and the airy
 * numeral monuments. One idea per section, one format per idea.
 */

export const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];
export const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TONES = colors.moodTones;

/** mood 0–4 → tone, optionally softened toward the paper (alpha %). */
function mixToward(hex: string, alphaPct: number): string {
  const t = alphaPct / 100;
  const pa = parseInt(hex.slice(1), 16);
  const pb = parseInt('F4F3F0'.slice(0), 16); // paper
  const bb = parseInt('F4F3F0', 16);
  const ch = (sh: number) => Math.round(((pa >> sh) & 255) * t + ((bb >> sh) & 255) * (1 - t));
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}
export const moodC = (v: number, alpha?: number) => (alpha == null ? TONES[v] : mixToward(TONES[v], alpha));

export const AN_RANGES = [
  { label: '2W', days: 14, h: 44, r: 12 },
  { label: '4W', days: 28, h: 40, r: 10 },
  { label: '12W', days: 84, h: 20, r: 6 },
];

export function AnLabel({ children, style }: { children: ReactNode; style?: object }) {
  return (
    <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 2.34, textTransform: 'uppercase', color: colors.text }, style]}>
      {children}
    </AppText>
  );
}

export function AnCaps({ children, style }: { children: ReactNode; style?: object }) {
  return (
    <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1.05, textTransform: 'uppercase', color: colors.textSofter }, style]}>
      {children}
    </AppText>
  );
}

export function AnDowHeader({ style }: { style?: object }) {
  return (
    <View style={[{ flexDirection: 'row', gap: 6 }, style]}>
      {DOW.map((d, i) => (
        <AnCaps key={i} style={{ flex: 1, textAlign: 'center' }}>
          {d}
        </AnCaps>
      ))}
    </View>
  );
}

/** one row of 7 day-cells; v: 0–4 mood, null = no check-in */
export function AnWeekRow({
  week,
  h,
  r,
  alpha,
  todayIdx = -1,
  style,
}: {
  week: (number | null)[];
  h: number;
  r: number;
  alpha?: number;
  todayIdx?: number;
  style?: object;
}) {
  const cells = [...week];
  while (cells.length < 7) cells.push(null);
  return (
    <View style={[{ flexDirection: 'row', gap: 6 }, style]}>
      {cells.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: h,
            borderRadius: r,
            backgroundColor: v == null ? colors.accentSoft : moodC(v, alpha),
            borderWidth: i === todayIdx ? 2 : 0,
            borderColor: colors.ink,
          }}
        />
      ))}
    </View>
  );
}

export function AnLegend() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 3.5 }}>
          {TONES.map((c) => (
            <View key={c} style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c }} />
          ))}
        </View>
        <AnCaps>Low → Radiant</AnCaps>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: colors.accentSoft }} />
        <AnCaps>No check-in</AnCaps>
      </View>
    </View>
  );
}

/** the date-range filter — quiet caps, an ink rule under the active one */
export function AnRangeFilter({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {AN_RANGES.map((rg) => {
        const on = rg.days === value;
        return (
          <Pressable key={rg.label} onPress={() => onChange(rg.days)} hitSlop={8} style={{ paddingBottom: 4, borderBottomWidth: 1.5, borderBottomColor: on ? colors.ink : 'transparent' }}>
            <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 1.2, color: on ? colors.text : colors.textSoft }]}>{rg.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** the airy numeral row — hairline-separated monuments */
export function AnStats({ stats }: { stats: [string | number, string, ReactNode?][] }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {stats.map(([v, l, d], i) => (
        <View key={l} style={{ flex: 1, alignItems: 'center', paddingVertical: 4, borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 37, lineHeight: 37, color: colors.text, fontVariant: ['tabular-nums'] }}>{v}</AppText>
            {d ?? null}
          </View>
          <AnCaps style={{ color: colors.textSoft, marginTop: 9 }}>{l}</AnCaps>
        </View>
      ))}
    </View>
  );
}

/** quiet inline delta — no chip, just a small triangle + text */
export function Delta({ children, down = false }: { children: ReactNode; down?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Svg width={9} height={9} viewBox="0 0 12 12" style={{ transform: [{ scaleY: down ? -1 : 1 }] }}>
        <Path d="M6 2.5l4 5H2z" fill={colors.textSoft} />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted }]}>{children}</AppText>
    </View>
  );
}
