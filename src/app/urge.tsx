import { useLocalSearchParams } from 'expo-router';

import { UrgeFlow } from '@/components/urge';
import { FORCE_MOCK } from '@/lib/config';

/**
 * The First 90 Seconds (canvas 28 → 33) — the SOS tab's disc opens it (CRITIC
 * C12), as does Rough Days' `/rough-first90`.
 *
 * Mock builds only: `?board=<SOS-…>` opens the flow on that response board, so
 * the three boards no answer reaches (D038) can be drawn and checked (D336).
 * A production build ignores the parameter.
 */
export default function Urge() {
  const { board } = useLocalSearchParams<{ board?: string }>();
  return <UrgeFlow board={FORCE_MOCK ? board : undefined} />;
}
