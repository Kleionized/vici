import type { BottomTabBarProps } from 'expo-router/tabs';

import { AppTabBar, TAB_BAR_CONTENT, TAB_FOR_ROUTE, useTabBarHeight } from '@/components/mono/TabBar';

/**
 * The `(app)` navigator's tab bar — the kit's `TabBar` (`mono/TabBar.tsx`),
 * which is the canvas's five-item bar: Today · Log · SOS · Library · Journey.
 *
 * The lit item comes from the navigator's focused route, not the URL. A screen
 * pushed over the tabs (the Log chooser, a lesson) changes the URL while the
 * tab screen underneath stays mounted; reading the URL would drop that screen's
 * bar during the push and the back-swipe.
 *
 * Only the routes whose frames draw the bar get one (`TAB_FOR_ROUTE`: Today,
 * Log, Library, Medallions, Score). Every other `(app)` route — Settings, the
 * review drawer `All`, Journal, Insights, Life map, Weeks, Rough days, Support —
 * is a full-height screen with no bar, as before.
 *
 * The bar sits under the scene in the navigator's column (`inline`), so a tab
 * scene ends at the bar's top — 748 at 852, where every tab frame's content
 * already ends (no tab frame anchors anything to the bottom edge). The bar
 * paints the frame's ground and noise over its own band (D327): at 852 that is
 * invisible, and nothing a scene scrolls can show through the labels.
 *
 * `All` used to be a fourth tab here (`SHOW_ALL_TAB`). The canvas draws five
 * items and no drawer, so it left the bar; the route stays registered and is
 * reached by URL, or — in mock and dev builds — by a long press on Today.
 */
export const SHOW_ALL_TAB = false;

export { TAB_BAR_CONTENT, useTabBarHeight };

export function StoicTabBar({ state }: Pick<BottomTabBarProps, 'state'>) {
  const name = state.routes[state.index]?.name;
  const active = name ? TAB_FOR_ROUTE[name] : undefined;
  if (!active) return null;
  return <AppTabBar active={active} inline />;
}
