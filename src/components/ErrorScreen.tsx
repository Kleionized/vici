import { useEffect } from 'react';

import { HeroBoard } from '@/components/mono';

/**
 * "Something went wrong · Try again" — what a route group shows when a screen
 * under it throws while drawing (B11, D495), instead of the release app
 * closing. The root layout and the `(app)` layout export it as their
 * `ErrorBoundary` (expo-router wraps a route that exports one in a React
 * error boundary; `retry` draws the route again).
 *
 * The kit's statement board — the umbrella hero, the 26/33 title, its line
 * and the primary — and nothing that needs the app's providers: at the root
 * it is drawn in place of them. `onUrge` adds the SOS as the ghost link where
 * a router is there to open it (the `(app)` group).
 *
 * The error goes to the device log. Reporting it anywhere needs a crash
 * reporting account (an owner action), so nothing leaves the phone.
 */
export function ErrorScreen({ error, retry, onUrge }: { error: Error; retry: () => void; onUrge?: () => void }) {
  useEffect(() => {
    console.error('[VICI] A screen failed to draw:', error);
  }, [error]);

  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="umbrella"
      stackTop={451}
      titleSize={26}
      title="Something went wrong."
      body="VICI couldn’t show this screen. Everything you’ve logged is still saved."
      cta="Try again"
      onCta={retry}
      ghost={onUrge ? 'Ride out an urge' : undefined}
      onGhost={onUrge}
    />
  );
}
