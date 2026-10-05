import { useLocalSearchParams, useRouter } from 'expo-router';

import { CHAPTERS, type ChapterKey, JourneyChapter } from '@/components/journey/JourneyScreens';

/**
 * 176–179 · one chapter of the journey, pushed — a page of its own outside the
 * `(app)` group, its chevron going back to the campaign that opened it. An
 * unknown key opens The Landing.
 */
export default function ChapterRoute() {
  const router = useRouter();
  const { chapter } = useLocalSearchParams<{ chapter?: string }>();
  const key: ChapterKey = chapter && chapter in CHAPTERS ? (chapter as ChapterKey) : 'landing';

  return <JourneyChapter chapter={key} onBack={() => (router.canGoBack() ? router.back() : router.replace('/journey'))} />;
}
