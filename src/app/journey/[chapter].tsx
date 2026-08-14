import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CHAPTERS, type ChapterKey, JourneyChapter } from '@/components/journey/JourneyScreens';

/**
 * 176–179 · one chapter of the journey, pushed.
 *
 * The canvas draws these full-bleed to 852 with a Back row and no tab bar — the
 * closing land band runs 798–852, which a bar would sit on top of. So a chapter
 * is a pushed route rather than a tab: it lives outside the `(app)` group, gets
 * the whole viewport, and its Back row goes back to the campaign that opened it.
 */

export default function ChapterRoute() {
  const router = useRouter();
  const { chapter } = useLocalSearchParams<{ chapter?: string }>();
  const key: ChapterKey = chapter && chapter in CHAPTERS ? (chapter as ChapterKey) : 'landing';

  return (
    <>
      <StatusBar style="dark" />
      <JourneyChapter chapter={key} onBack={() => (router.canGoBack() ? router.back() : router.replace('/(app)/library'))} />
    </>
  );
}
