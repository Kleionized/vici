import { usePathname, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText, Laurel } from '@/components/ui';
import { colors, sans } from '@/lib/theme';

/**
 * The canvas bottom nav, exactly: a flat parchment bar (no border, no blur),
 * thin stroke-line icons with Gill Sans labels, and a raised solid-ink 52px
 * circle holding the wave glyph — the always-there "feeling an urge?" door.
 * Five slots: Today · Journey · ◉wave · Log · You.
 */
type Item = { key: string; label: string; route: string; icon: (c: string, on: boolean) => ReactNode };

const ITEMS: Item[] = [
  { key: 'today', label: 'Today', route: '/(app)/today', icon: home },
  { key: 'journey', label: 'Journey', route: '/(app)/weeks', icon: journey },
  { key: 'log', label: 'Log', route: '/(app)/log', icon: pen },
  { key: 'you', label: 'You', route: '/(app)/dashboard', icon: you },
];

export function StoicTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const active = (route: string) => {
    const tail = '/' + route.split('/').pop();
    // Rough Days hangs off the Log tab
    if (tail === '/log' && pathname.startsWith('/rough-days')) return true;
    return pathname.startsWith(tail);
  };

  const tab = (item: Item) => {
    const on = active(item.route);
    const tint = on ? colors.text : colors.textSoft;
    return (
      <Pressable
        key={item.key}
        onPress={() => router.navigate(item.route as never)}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        style={{ flex: 1, alignItems: 'center', gap: 3 }}>
        {item.icon(tint, on)}
        <AppText style={[sans(on ? '600' : '400'), { fontSize: 12, letterSpacing: 0.24, color: tint }]}>
          {item.label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.bg,
        paddingTop: 12,
        paddingHorizontal: 18,
        paddingBottom: Math.max(insets.bottom + 6, 22),
      }}>
      {tab(ITEMS[0])}
      {tab(ITEMS[1])}
      {/* the raised dark urge circle */}
      <View style={{ flex: 1.1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <Pressable
          onPress={() => router.push('/urge' as never)}
          accessibilityRole="button"
          accessibilityLabel="Feeling an urge?"
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: 9999,
            backgroundColor: colors.ink,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: pressed ? 0.965 : 1 }],
          })}>
          <Laurel size={27} color={colors.inkText} />
        </Pressable>
      </View>
      {tab(ITEMS[2])}
      {tab(ITEMS[3])}
    </View>
  );
}

// ── the canvas NAV_ICON set, verbatim ────────────────────────────────
function home(c: string, on: boolean) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5 12 4l8 6.5V20a.8.8 0 0 1-.8.8h-4.4V15h-5.6v5.8H4.8A.8.8 0 0 1 4 20z"
        fill={on ? c : 'none'}
        stroke={c}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function journey(c: string) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={c} strokeWidth={1.8} />
      <Path d="M15.5 8.5 10.5 10.5 8.5 15.5 13.5 13.5z" fill="none" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}
function pen(c: string) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 4.5a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L8.4 18.6l-3.6 1 1-3.6L16.5 4.5z"
        fill="none"
        stroke={c}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function you(c: string) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={3.6} fill="none" stroke={c} strokeWidth={1.8} />
      <Path d="M5.5 20a6.5 6.5 0 0 1 13 0z" fill="none" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}
