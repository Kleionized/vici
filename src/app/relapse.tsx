import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * `/relapse` was the slip told a second time — four boards (`34 · SOS —
 * Slipped`, `36 · Don’t Fail Twice`, `36B · Re-sign`, `37 · Begin Again`) that
 * twinned the post-slip flow's, wrote the lapse only on the last of them (so
 * "Log the slip" and then ✕ logged nothing), showed a pledge the user had
 * never written, and said "Don’t let it become two" whatever the day's count.
 *
 * `/slip` is that flow done properly — it writes the slip once its questions
 * are answered, reads the day's count and the pledge off the log, and draws
 * the pledge board only over words the user signed — and it is where the SOS,
 * the hub and Today already send a slip (D147). This route is kept so an old
 * link still lands somewhere, and lands there.
 *
 * Nothing in the app opens `/relapse?logged=1` (the "already written" entry the
 * old board took); a slip already on the log has no questions left to ask, so
 * that link goes to Today rather than filing it twice.
 */
export default function Relapse() {
  const { logged } = useLocalSearchParams<{ logged?: string }>();
  return <Redirect href={logged === '1' ? '/(app)/today' : '/slip'} />;
}
