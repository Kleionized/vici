import { Stack, useLocalSearchParams } from 'expo-router';

import { LAB } from '@/components/mono/lab';
import { FORCE_MOCK } from '@/lib/config';

/**
 * Mock-only bench for the kit: `/kit-lab?f=<replica>` renders one replica of a
 * real frame built from `src/components/mono/*`, so a kit piece is checked
 * against the frame it came from (pxdiff) before any screen depends on it.
 * Renders nothing outside the mock build.
 */
export default function KitLab() {
  const { f } = useLocalSearchParams<{ f?: string }>();
  const Replica = f ? LAB[f] : undefined;
  if (!FORCE_MOCK || !Replica) return null;
  return (
    <>
      <Stack.Screen options={{ animation: 'none' }} />
      <Replica />
    </>
  );
}
