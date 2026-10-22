import { Redirect } from 'expo-router';

/**
 * `/dev/harness` — the Vici UI 2 run's screen harness (`src/dev/HarnessScreen.tsx`).
 *
 * Development builds only. The screen is required behind `__DEV__`, which a
 * release build folds to `false`, so neither it nor its fixtures are in a
 * release bundle; there the route redirects to the app's start, and nothing in
 * the app links here.
 */
const HarnessScreen: (() => React.JSX.Element) | null = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- kept out of release bundles
    (require('@/dev/HarnessScreen') as typeof import('@/dev/HarnessScreen')).HarnessScreen
  : null;

export default function Harness() {
  return HarnessScreen ? <HarnessScreen /> : <Redirect href="/" />;
}
