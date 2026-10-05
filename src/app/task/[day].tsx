import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * `/task/<n>` — the previous drop's two task boards. The day's task now lives
 * inside the lesson: `Today’s task` and the Done-when card are the reader's own
 * last pages (D324), so this opens the reader there. Marking the task done is
 * where it always was besides — Today's check and Morning's question, both on
 * `dailyCheckins.dailyActionDone`.
 */
export default function TaskRedirect() {
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(String(day ?? '').replace(/^day-/, '')) || 1;
  return <Redirect href={`/lesson/day/${n}?page=task`} />;
}
