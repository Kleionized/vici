import { useTabBarHeight } from '@/components/StoicTabBar';
import { JourneyScroll } from '@/components/journey/JourneyScreens';

/**
 * The Library tab — the journey, not the lesson shelves.
 *
 * The canvas draws the four chapters as four frames you flick between; here
 * they run end to end down one scroll, each at its own full height, so the land
 * band that closes one is the horizon the next opens above. Nothing about a
 * chapter's own layout changes.
 *
 * The Back row every chapter frame carries belongs to the pushed route at
 * `/journey/[chapter]`, not here — a tab has nowhere to go back to.
 */

export default function Library() {
  return <JourneyScroll bottomInset={useTabBarHeight()} />;
}
