import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { HeroBoard } from '@/components/mono';
import { SplashScene, WaterlineScene } from '@/components/ui/Waterline';
import { useAuth } from '@/lib/auth';
import { retryBoot, useCurrentUser } from '@/lib/backend';

/** The mark holds alone this long before the wait says what it is doing. */
const SLOW_MS = 900;
/**
 * And this long before boot stops waiting and says it can't connect (B10,
 * D493): long enough for a slow cold start to land, short enough that someone
 * opening VICI in an urge with no signal is not left on the mark.
 */
const STUCK_MS = 8000;

/**
 * Boot — the cold open, and the route decider.
 *
 * `01 · Splash` is the only launch frame the canvas draws, so it is the
 * only one the normal path shows: the mark holds while the session and the user
 * resolve, and the moment both are in, this hands over. The signed-out branch
 * hands over to `(auth)/splash`, which paints the same scene and owns the beat
 * that makes the mark readable — so the field never blinks between the two.
 *
 * A boot still waiting after the mark has held for 900 ms adds the kit's
 * spinner and "Opening VICI…" (`WaterlineScene`). One still waiting at 8 s —
 * no signal, so Clerk cannot load or Convex cannot answer, or the account's
 * row could not be made — stops waiting: the statement board says VICI can't
 * connect, "Try again" waits again (and asks the Convex bootstrap to make the
 * account's row now, `retryBoot`), and "Ride out an urge" opens the SOS, which
 * needs no connection. The SOS is pushed over this route, so closing it comes
 * back here, and boot carries on from where it got to.
 *
 *   not authed          → (auth)
 *   authed, !onboarded  → (onboarding)
 *   authed, onboarded   → (app)
 */
export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const [slow, setSlow] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const hydrated = isLoaded && (!isSignedIn || user !== undefined);

  useEffect(() => {
    if (hydrated) return;
    const toSlow = setTimeout(() => setSlow(true), SLOW_MS);
    const toStuck = setTimeout(() => setStuck(true), STUCK_MS);
    return () => {
      clearTimeout(toSlow);
      clearTimeout(toStuck);
    };
  }, [hydrated, attempt]);

  if (!hydrated) {
    if (stuck) {
      return (
        <HeroBoard
          nav={{ left: 'empty', right: 'empty' }}
          hero="compass"
          stackTop={451}
          titleSize={26}
          title="VICI can’t connect right now."
          body="Check your signal, then try again. The SOS works without one."
          cta="Try again"
          onCta={() => {
            setStuck(false);
            setAttempt((n) => n + 1);
            retryBoot();
          }}
          ghost="Ride out an urge"
          onGhost={() => router.push('/urge')}
        />
      );
    }
    return slow ? <WaterlineScene /> : <SplashScene />;
  }
  if (!isSignedIn) return <Redirect href="/(auth)/splash" />;
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)/today" />;
}
