import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';

import { useHarnessScroll } from './harnessRegistry';

/** Registers a pager and its pages' offsets with the capture harness (D35); draws nothing. */
export function HarnessPages({ name, pager, pages, horizontal }: { name: string; pager: RefObject<ScrollView | null>; pages: number[]; horizontal?: boolean }) {
  useHarnessScroll(pager, { name, pages, horizontal });
  return null;
}
