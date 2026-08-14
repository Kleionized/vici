import { usePathname, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { colors, sans } from '@/lib/theme';

/**
 * The tab bar, as the canvas draws it: a white shelf carrying tabs and nothing
 * else. Ride It Out used to live up here as a dark card; it is a row on Today
 * now, which is where the canvas puts it — the bar is for going places, not for
 * doing things.
 *
 * The glyphs are different objects rather than one unified silhouette: a door
 * standing open, a stack of entries, books on a shelf, and a drawer of panes.
 *
 * The canvas draws three tabs at hand-set centres 70 / 196 / 318. `All` is a
 * fourth the canvas does not draw — a way into everything the app can show that
 * nothing else routes to. Four tabs will not fit the canvas's rhythm, so the row
 * is spread on even quarters instead; the glyph size, the 14 above it, the 5
 * under it and the 13pt label are all still the canvas's.
 */

type Item = {
  key: string;
  label: string;
  route: string;
  icon: (active: boolean) => ReactNode;
  /** Centre of the tab, as a fraction of the bar's width. */
  at: `${number}%`;
  /** Label box width from the canvas. */
  w: number;
};

/** Even quarters — see the note above on why the canvas's own centres are not used. */
const ITEMS: Item[] = [
  { key: 'home', label: 'Home', route: '/(app)/today', icon: home, at: '12.5%', w: 60 },
  { key: 'log', label: 'Log', route: '/(app)/log', icon: log, at: '37.5%', w: 60 },
  { key: 'library', label: 'Library', route: '/(app)/library', icon: library, at: '62.5%', w: 66 },
  { key: 'all', label: 'All', route: '/(app)/all', icon: all, at: '87.5%', w: 60 },
];

/** Resting and selected ink for the glyphs. */
const OFF = colors.track;
const ON = colors.textTitle;

/**
 * Canvas height of the bar above the home indicator: 14 to the glyph, 29 of
 * glyph, 5, then the 15pt label. Screens that pin something directly above the
 * bar need this number, so it lives here rather than being guessed twice.
 */
export const TAB_BAR_CONTENT = 63;

export function useTabBarHeight() {
  return TAB_BAR_CONTENT + Math.max(useSafeAreaInsets().bottom, 20);
}

/**
 * Screens that live inside the tab group for routing reasons but whose canvas
 * frame runs the full 852 with no bar drawn — Locked Weeks puts its CTA at 744,
 * which the bar would sit on top of. Returning null here gives the navigator a
 * zero-height bar, so the screen gets the whole viewport.
 */
const NO_BAR = ['/locked', '/settings', '/rough-days', '/dashboard', '/lifemap', '/journal', '/support'];

export function StoicTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (NO_BAR.some((route) => pathname.startsWith(route))) return null;

  const isActive = (item: Item) => {
    if (item.key === 'home') return pathname === '/today' || pathname.startsWith('/profile') || pathname.startsWith('/milestones');
    if (item.key === 'log') return pathname === '/log';
    if (item.key === 'all') return pathname === '/all';
    return pathname === '/library' || pathname.startsWith('/rough-days') || pathname.startsWith('/dashboard') || pathname.startsWith('/lesson');
  };

  return (
    <View
      style={{
        height: TAB_BAR_CONTENT + Math.max(insets.bottom, 20),
        paddingTop: 14,
        backgroundColor: 'rgba(255,255,255,0.95)',
      }}>
      {ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <PressScale
            key={item.key}
            onPress={() => router.navigate(item.route as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            hitSlop={{ top: 14, bottom: 20, left: 22, right: 22 }}
            style={{ position: 'absolute', top: 14, left: item.at, marginLeft: -item.w / 2, width: item.w, alignItems: 'center' }}>
            <View style={{ height: 29 }}>{item.icon(active)}</View>
            <AppText style={[sans('500'), { marginTop: 5, fontSize: 13, color: active ? colors.textTitle : colors.textSoft }]}>
              {item.label}
            </AppText>
          </PressScale>
        );
      })}
    </View>
  );
}

/** A door standing open — the way back in. */
function home(active: boolean) {
  return (
    <Svg width={30} height={29} viewBox="0 0 24 26">
      <Path d="M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z" fill={active ? ON : OFF} />
      <Circle cx={15.2} cy={14} r={1.7} fill="#FFFFFF" fillOpacity={0.92} />
    </Svg>
  );
}

/** Entries stacked on a card. */
function log(active: boolean) {
  return (
    <Svg width={30} height={29} viewBox="0 0 24 26">
      <Rect x={4.5} y={2} width={15} height={22} rx={3} fill={active ? ON : OFF} />
      <Path d="M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeOpacity={0.95} />
    </Svg>
  );
}

/** Three books on a shelf, seen end-on. */
function library(active: boolean) {
  const fill = active ? ON : OFF;
  return (
    <Svg width={30} height={29} viewBox="0 0 24 26">
      <Rect x={5} y={2.5} width={4.4} height={21} rx={1.8} fill={fill} />
      <Rect x={10.9} y={2.5} width={4.4} height={21} rx={1.8} fill={fill} />
      <Rect x={16.8} y={2.5} width={4.4} height={21} rx={1.8} fill={fill} />
    </Svg>
  );
}

/**
 * A drawer of panes — four of the same shape, which is what the hub is: every
 * screen in the app laid out flat, none of them favoured.
 */
function all(active: boolean) {
  const fill = active ? ON : OFF;
  return (
    <Svg width={30} height={29} viewBox="0 0 24 26">
      <Rect x={3.6} y={4.6} width={7.8} height={7.8} rx={2.4} fill={fill} />
      <Rect x={12.6} y={4.6} width={7.8} height={7.8} rx={2.4} fill={fill} />
      <Rect x={3.6} y={13.6} width={7.8} height={7.8} rx={2.4} fill={fill} />
      <Rect x={12.6} y={13.6} width={7.8} height={7.8} rx={2.4} fill={fill} />
    </Svg>
  );
}
