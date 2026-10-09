import { Redirect, usePathname, useRouter } from 'expo-router';

import { HeroBoard } from '@/components/mono';

/**
 * Any link the router cannot match (U2, D482): a stale or mistyped
 * `tideline://…` link, an old notification, a shared URL. Without this route
 * expo-router showed its own unstyled "Unmatched Route" page, with a Sitemap
 * link listing every route in the app.
 *
 * Set as the kit's statement board — the signpost hero, the 26/33 title and
 * its line, the primary — with nothing to go back to but the app itself:
 * "Back to Today" goes to `/`, which sends a signed-in account to Today and
 * anyone else to the door.
 *
 * `/sso-callback` is not a mistake: on Android, Clerk's Apple / Google sign-in
 * can hand the app back on that path as well as to the auth session that
 * opened it. The session completes on its own (`maybeCompleteAuthSession` in
 * `clerkAuth.tsx`), so the path goes straight to `/` instead of telling a user
 * who has just signed in that the page does not exist.
 */
export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.replace(/^\/+/, '').startsWith('sso-callback')) return <Redirect href="/" />;

  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'empty' }}
      hero="signpost"
      stackTop={451}
      titleSize={26}
      title="This page doesn’t exist."
      body="The link may be old or mistyped. Everything in VICI is still where you left it."
      cta="Back to Today"
      onCta={() => router.replace('/')}
    />
  );
}
