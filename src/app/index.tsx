import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { SplashScene, WaterlineScene } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';

/**
 * Boot — the cold open, and the route decider.
 *
 * 01 · Splash holds the mark for a beat, then 02 · Finding the Waterline keeps
 * the same night field while the session and the user resolve. No progress bar
 * and no percentage: the canvas gives the wait one ring and one line.
 *
 *   not authed          → (auth)
 *   authed, !onboarded  → (onboarding)
 *   authed, onboarded   → (app)
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const [looking, setLooking] = useState(false);
  // Hold the mark long enough to read it, then hand over to the ring.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const toWaterline = setTimeout(() => setLooking(true), 900);
    const done = setTimeout(() => setSettled(true), 1900);
    return () => {
      clearTimeout(toWaterline);
      clearTimeout(done);
    };
  }, []);

  const hydrated = isLoaded && (!isSignedIn || user !== undefined);
  if (!hydrated || !settled) {
    return (
      <>
        <StatusBar style="light" />
        {looking ? <WaterlineScene /> : <SplashScene />}
      </>
    );
  }
  if (!isSignedIn) return <Redirect href="/(auth)/splash" />;
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)/today" />;
}
