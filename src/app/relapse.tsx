import { Redirect } from 'expo-router';

/**
 * `/relapse` was an older, four-board twin of the post-slip flow that logged a
 * bare lapse — no time, no trigger — and re-signed nothing. The slip flow
 * (`/slip`) is the one way to log a slip now (U1, D468); an old link to this
 * route lands there.
 */
export default function Relapse() {
  return <Redirect href="/slip" />;
}
