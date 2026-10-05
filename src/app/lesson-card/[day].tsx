import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * `/lesson-card/<n>` — the previous drop's lesson card. No frame in `Vici
 * Overhaul` draws it: the reader's own cover (hero, `Lesson n`, the title,
 * `Begin`) is the way in now (D324). The route stays so every link that still
 * pushes it (week rows, search, first steps, the All drawer) lands in the
 * lesson, and the redirect replaces it, so back returns to where it was opened.
 */
export default function LessonCard() {
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(String(day ?? '').replace(/^day-/, '')) || 1;
  return <Redirect href={`/lesson/day/${n}`} />;
}
