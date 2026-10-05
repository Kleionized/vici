import type { ComponentType } from 'react';

import { Screen } from '../Screen';
import { TabBar, type TabKey } from '../TabBar';

/**
 * Kit-lab replicas for `TabBar.tsx`. The bar is the only thing built; the rest
 * of each frame is left as bare ground (the screen groups own it), so these are
 * diffed on the bar's band — `--ignore=0,54,393,694` blanks 54–748.
 */
function bar(active: TabKey) {
  return function Replica() {
    return (
      <Screen>
        <TabBar active={active} />
      </Screen>
    );
  };
}

/** Kit-lab replicas for the tabbar part of the kit. Key = the frame's split file stem. */
export const LAB_TABBAR: Record<string, ComponentType> = {
  'Today-Home': bar('today'),
  'Log-Urges': bar('log'),
  'Medallions': bar('journey'),
  'Week-I-Reset': bar('library'),
};
