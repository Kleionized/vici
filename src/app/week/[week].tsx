import { Redirect, useLocalSearchParams } from 'expo-router';

import { clampWeek } from '@/components/library/WeekPage';

/**
 * `/week/<n>` — a week page by link (the All drawer's `A week · board`, the
 * recipes). The week pages are the Library tab now (D240): they draw the tab
 * bar with Library lit, which a stack route outside `(app)` cannot, so the link
 * lands on the tab turned to that week. A stray `n` is clamped to the twelve.
 */
export default function WeekRoute() {
  const { week } = useLocalSearchParams<{ week?: string }>();
  return <Redirect href={{ pathname: '/(app)/library', params: { week: String(clampWeek(week)) } }} />;
}
