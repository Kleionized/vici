import { useRouter } from 'expo-router';

import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { useCurrentUser } from '@/lib/backend';
import { PAYWALL_SOURCE } from '@/lib/purchases';

/**
 * `/paywall` — the standalone purchase screen, reached from Manage
 * subscription, the locked curriculum and All.
 *
 * Which paywall it opens is decided once at module load, so the rules of hooks
 * hold: VICI's own offering-driven paywall by default, the RevenueCat dashboard
 * paywall under `EXPO_PUBLIC_REVENUECAT_PAYWALL=revenuecat`, and the drawn
 * paywall under `=designed` or wherever purchases are mocked. The onboarding
 * funnel always keeps the drawn paywall — it is one step inside a pixel-exact
 * sequence.
 */
const Board =
  PAYWALL_SOURCE === 'offering'
    ? (require('@/components/paywall/OfferingPaywall') as typeof import('@/components/paywall/OfferingPaywall')).OfferingPaywall
    : PAYWALL_SOURCE === 'revenuecat'
      ? (require('@/components/paywall/RevenueCatPaywall') as typeof import('@/components/paywall/RevenueCatPaywall')).RevenueCatPaywall
      : PaywallFlow;

export default function Paywall() {
  const router = useRouter();
  const user = useCurrentUser();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  // every board draws its own mono `Screen`, light status glyphs included
  return <Board name={user?.displayName?.trim().split(/\s+/)[0]} onDone={close} />;
}
