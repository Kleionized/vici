import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { LAB } from '@/components/mono/lab';
import { FORCE_MOCK } from '@/lib/config';

/**
 * Mock-only bench for the kit: `/kit-lab?f=<replica>` renders one replica of a
 * real frame built from `src/components/mono/*`, so a kit piece is checked
 * against the frame it came from (pxdiff) before any screen depends on it.
 *
 * Outside the mock and development builds — or with no replica named — it
 * goes to `/` (U2, D483). It used to render nothing, so a `tideline://kit-lab`
 * link on a release build left a blank screen with no way out.
 */
export default function KitLab() {
  const { f } = useLocalSearchParams<{ f?: string }>();
  const Replica = f ? LAB[f] : undefined;
  if (!(FORCE_MOCK || __DEV__) || !Replica) return <Redirect href="/" />;
  return (
    <>
      <Stack.Screen options={{ animation: 'none' }} />
      <Replica />
    </>
  );
}
