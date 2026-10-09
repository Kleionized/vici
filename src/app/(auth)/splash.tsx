import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { SplashScene } from '@/components/ui/Waterline';

/**
 * 01 · Splash — the laurel and the wordmark on the ground, and then the door.
 *
 * The bundle draws one launch frame and puts `02 · Login` straight after it, so
 * this holds `01 · Splash` long enough to be read and hands over. It used to
 * spend a second on `Finding the Waterline` on the way — a board no drop of the
 * canvas has ever drawn — which, coming after boot had already shown the mark
 * and that same board, played the whole cold open twice.
 */
export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const onward = setTimeout(() => router.replace('/(auth)/sign-in'), 900);
    return () => clearTimeout(onward);
  }, [router]);

  return <SplashScene />;
}
