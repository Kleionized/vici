import type { ComponentType } from 'react';

import { LAB_CHOICES } from './choices';
import { LAB_CORE } from './core';
import { LAB_HERO } from './hero';
import { LAB_MISC } from './misc';
import { LAB_OVERLAY } from './overlay';
import { LAB_ROWS } from './rows';
import { LAB_TABBAR } from './tabbar';

/** Every replica, keyed by the frame's split file stem (`V3-Q1`, `Settings` …). */
export const LAB: Record<string, ComponentType> = {
  ...LAB_CORE,
  ...LAB_CHOICES,
  ...LAB_ROWS,
  ...LAB_OVERLAY,
  ...LAB_HERO,
  ...LAB_TABBAR,
  ...LAB_MISC,
  // Where two parts replicate one frame, the plain stem is the most complete
  // replica (the whole frame); the partial ones stay reachable by their `@part` key.
  'Log-Urges': LAB_ROWS['Log-Urges@choices'],
  'Log-Urges@tabbar': LAB_TABBAR['Log-Urges'],
  'Today-Home@tabbar': LAB_TABBAR['Today-Home'],
  'V3-Q1@core': LAB_CORE['V3-Q1'],
};
