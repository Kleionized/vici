import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { SplashScene, WaterlineScene } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';

/**
 * Boot — the cold open, and the route decider.
 *
 * `01 · Splash` is the only launch frame the canvas draws, so it is the
 * only one the normal path shows: the mark holds while the session and the user
 * resolve, and the moment both are in, this hands over. The signed-out branch
 * hands over to `(auth)/splash`, which paints the same scene and owns the beat
 * that makes the mark readable — so the field never blinks between the two.
 *
 * `WaterlineScene` has no frame in this bundle or the last ones. It is kept for
 * the case it was built for — a boot that is genuinely still waiting after the
 * mark has been on screen for a second — rather than shown on every launch.
 *
 *   not authed          → (auth)
 *   authed, !onboarded  → (onboarding)
 *   authed, onboarded   → (app)
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 900);
    return () => clearTimeout(t);
  }, []);

  const hydrated = isLoaded && (!isSignedIn || user !== undefined);
  if (!hydrated) {
    return slow ? <WaterlineScene /> : <SplashScene />;
  }
  if (!isSignedIn) return <Redirect href="/(auth)/splash" />;
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)/today" />;
}
