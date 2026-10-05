import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Grain } from '@/components/ui/Grain';
import { FORCE_MOCK } from '@/lib/config';
import { mono, sans } from '@/lib/theme';

import { TabJourney, TabLibrary, TabLog, TabToday } from './icons';
import { SCREEN_VARIANTS, type ScreenVariant } from './Screen';
import { Tap } from './Tap';
import { MonoText } from './Text';

/**
 * The tab bar (design-system §7.18), drawn identically on 37 frames — Today ×4,
 * Log ×3, Medallions ×3, Score Detail ×3, the 24 week pages — with only the lit
 * item changing. `left 0 right 0 bottom 0 height 104; padding 14 14 0; row,
 * space-between, align flex-start; z 8`: four 72-wide items (26 glyph, gap 4,
 * 11.5 label) around a 60 ink disc that is a button, not a tab.
 */

export type TabKey = 'today' | 'log' | 'library' | 'journey';

type TabItem = { key: TabKey; label: string; route: string; Icon: (p: { color: string }) => ReactNode };

/**
 * Where each tab goes (today-day §0.6, routes §5.2). Log opens the chooser, as it
 * did (D124): the chooser draws no bar, the list it leads to lights this tab.
 * Journey is the medallions page — not the retired `/journey` campaign.
 */
export const TAB_ITEMS: readonly TabItem[] = [
  { key: 'today', label: 'Today', route: '/(app)/today', Icon: TabToday },
  { key: 'log', label: 'Log', route: '/log-chooser', Icon: TabLog },
  { key: 'library', label: 'Library', route: '/(app)/library', Icon: TabLibrary },
  { key: 'journey', label: 'Journey', route: '/(app)/milestones', Icon: TabJourney },
];

/** The SOS disc opens the interrupt, pushed (CRITIC C12) — never a page sheet. */
export const SOS_ROUTE = '/urge';

/**
 * The tab each `(app)` route lights, keyed by route name — the routes whose
 * frames draw the bar. Score Detail lights Journey (its three frames do), the
 * week pages light Library. A route that is not here draws no bar.
 */
export const TAB_FOR_ROUTE: Readonly<Record<string, TabKey>> = {
  today: 'today',
  log: 'log',
  library: 'library',
  milestones: 'journey',
  score: 'journey',
};

/** The same mapping for a pathname, for a screen that renders the bar itself. */
export function tabForPath(pathname: string): TabKey | null {
  if (pathname === '/today') return 'today';
  if (pathname === '/log') return 'log';
  if (pathname === '/library' || pathname === '/week' || pathname.startsWith('/week/')) return 'library';
  if (pathname === '/milestones' || pathname === '/score') return 'journey';
  return null;
}

/** The bar above the home-indicator zone: the frame's 104 less its 34. */
export const TAB_BAR_CONTENT = 70;
/** The canvas's home-indicator zone, which the bar's 104 includes. */
const HOME_ZONE = 34;

export function tabBarHeight(insetBottom: number) {
  return TAB_BAR_CONTENT + Math.max(insetBottom, HOME_ZONE);
}

/**
 * The bar's height on this device: the frame's 104 on a 34-inset phone (and on
 * the mock web build, whose bottom inset is 0), taller only where the home
 * indicator is. Inside the `(app)` navigator the scene already ends at the
 * bar's top; a screen that draws the bar itself over its own content pads its
 * scroller's foot by this much.
 */
export function useTabBarHeight() {
  return tabBarHeight(useSafeAreaInsets().bottom);
}

/**
 * The ground behind the bar. The frames give the bar no fill — content ends
 * above 748 — but a scene that scrolls would run under the labels, so the bar
 * paints the frame's own ground and noise (D327). The noise tiles from the
 * window's (0,0) in every frame, so the tile is offset by the bar's own top to
 * stay in phase with the screen's: at 852 the bar is invisible.
 */
function BarGround({ variant, height }: { variant: ScreenVariant; height: number }) {
  const v = SCREEN_VARIANTS[variant];
  const windowH = useWindowDimensions().height;
  const phase = (((windowH - height) % 96) + 96) % 96;
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden', backgroundColor: v.ground, pointerEvents: 'none' }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: -phase, bottom: 0 }}>
        <Grain source={v.noise} opacity={v.opacity} />
      </View>
    </View>
  );
}

const ITEM_SLOP = { top: 14, bottom: 20, left: 0, right: 0 };

/**
 * The bar itself — presentational. By default it is absolutely positioned at
 * the bottom of its parent, as the frames draw it (`bottom 0`): the way a screen
 * outside the navigator (a week page) puts it over its own `Screen`. `inline`
 * lays it out in flow instead — the tab navigator puts it under the scene, so
 * the scene ends at the bar's top (748 at 852) as react-navigation lays it out.
 * Either way its contents are pinned to the 14 top padding, so glyphs sit at
 * canvas y 762, labels at 792, the disc at 756.
 *
 * `active` lights one item (700 ink label + ink glyph; the rest 400 `#9B968E`).
 * The SOS disc is never lit. `ground={false}` drops the painted ground for a
 * caller that wants the frame's bare bar.
 */
export function TabBar({
  active,
  onTab,
  onTabLongPress,
  onSOS,
  variant = 'app',
  ground = true,
  inline,
  style,
}: {
  active: TabKey | null;
  onTab?: (key: TabKey) => void;
  onTabLongPress?: (key: TabKey) => void;
  onSOS?: () => void;
  variant?: ScreenVariant;
  ground?: boolean;
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const height = useTabBarHeight();
  const item = (it: TabItem) => {
    const on = it.key === active;
    const c = on ? mono.ink : mono.mute;
    return (
      <Tap
        key={it.key}
        onPress={() => onTab?.(it.key)}
        onLongPress={onTabLongPress ? () => onTabLongPress(it.key) : undefined}
        accessibilityRole="tab"
        aria-selected={on}
        label={it.label}
        hitSlop={ITEM_SLOP}
        // CSS's flex items shrink by default and Yoga's do not; below 376 wide
        // the four items give up the overflow so the disc keeps its circle
        style={{ width: 72, flexShrink: 1, alignItems: 'center', gap: 4 }}>
        <it.Icon color={c} />
        <MonoText v="tabLabel" color={c} style={on ? sans('700') : null}>
          {it.label}
        </MonoText>
      </Tap>
    );
  };
  return (
    <View
      style={[
        inline ? { position: 'relative' } : { position: 'absolute', left: 0, right: 0, bottom: 0 },
        {
          height,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingTop: 14,
          paddingHorizontal: 14,
          zIndex: 8,
        },
        style,
      ]}>
      {ground ? <BarGround variant={variant} height={height} /> : null}
      {item(TAB_ITEMS[0])}
      {item(TAB_ITEMS[1])}
      <Tap
        label="SOS"
        onPress={onSOS}
        style={{ width: 60, height: 60, borderRadius: 30, marginTop: -6, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
        <MonoText v="pill" color={mono.onInk}>
          SOS
        </MonoText>
      </Tap>
      {item(TAB_ITEMS[2])}
      {item(TAB_ITEMS[3])}
    </View>
  );
}

/** The review drawer's door — no frame draws `All`, so it has no pixels (routes §5.4). */
const DRAWER_DOOR = FORCE_MOCK || __DEV__;

/**
 * The bar wired to the router: each item navigates to its tab, the disc pushes
 * the interrupt. Inside the `(app)` navigator the layout passes the focused
 * route's tab; a screen outside it (a week page, say) passes its own `active`.
 *
 * In mock and dev builds a long press on Today opens the review drawer (`/all`),
 * which left the bar with the canvas's five items and is otherwise reached only
 * by URL.
 */
export function AppTabBar({
  active,
  variant,
  ground,
  inline,
}: {
  active: TabKey | null;
  variant?: ScreenVariant;
  ground?: boolean;
  inline?: boolean;
}) {
  const router = useRouter();
  return (
    <TabBar
      active={active}
      variant={variant}
      ground={ground}
      inline={inline}
      onTab={(key) => {
        const it = TAB_ITEMS.find((t) => t.key === key);
        if (it) router.navigate(it.route as never);
      }}
      onTabLongPress={
        DRAWER_DOOR
          ? (key) => {
              if (key === 'today') router.push('/(app)/all' as never);
            }
          : undefined
      }
      onSOS={() => router.push(SOS_ROUTE as never)}
    />
  );
}
