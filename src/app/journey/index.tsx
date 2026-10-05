import { useRouter } from 'expo-router';

import { JourneyScroll } from '@/components/journey/JourneyScreens';

/**
 * The campaign — the four chapters, end to end.
 *
 * This was the Library tab until the Library became the twelve weeks (D-114),
 * and the tab named Journey is the medallions page in this drop; the chapters
 * keep this pushed route (D328) in the week pages' form. The four are still
 * individually at `/journey/[chapter]`.
 */
export default function JourneyIndex() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  return <JourneyScroll onBack={back} bottomInset={40} />;
}
