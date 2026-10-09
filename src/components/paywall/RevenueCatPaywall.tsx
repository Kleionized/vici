/**
 * The paywall designed in the RevenueCat dashboard, rendered by
 * `react-native-purchases-ui`.
 *
 * It is the surface that can show all three products — the drawn paywall has
 * two rows and no lifetime — and it is the one that picks up A/B tests,
 * targeting and localisation without a release. `catalogue.PAYWALL_SOURCE`
 * decides which of the two `/paywall` opens.
 *
 * The component renders a native view, so it does not exist in Expo Go or on
 * web; there `react-native-purchases-ui` substitutes its own preview paywall.
 * If the offering fails to load at all, the drawn paywall takes over — which,
 * against a store, says plans are unavailable rather than drawing sample
 * prices. The dashboard paywall carries its own Terms, Privacy and renewal
 * copy; they are set in the RevenueCat paywall editor, not here.
 */

import RevenueCatUI from 'react-native-purchases-ui';
import { useRef } from 'react';
import { Alert, View } from 'react-native';

import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { ENTITLEMENT_ID, usePurchases } from '@/lib/purchases';
import { Screen } from '@/components/mono';
import { mono } from '@/lib/theme';

export function RevenueCatPaywall({
  name,
  confirmLabel,
  embedded,
  onDone,
}: {
  name?: string;
  confirmLabel?: string;
  embedded?: boolean;
  onDone: (purchased: boolean) => void;
}) {
  const { ready, error, offering, refresh } = usePurchases();
  // The paywall dismisses itself after a purchase, so `onDismiss` arrives on
  // both paths; the first outcome to land is the one the caller is told about.
  const settled = useRef(false);
  const finish = (purchased: boolean) => {
    if (settled.current) return;
    settled.current = true;
    if (purchased) void refresh();
    onDone(purchased);
  };

  // the ground the paywall opens on, so the wait is not a flash of another colour
  if (!ready && !error) return <Screen />;
  // no offering: the drawn paywall's "unavailable" board, never sample prices
  if (!offering) return <PaywallFlow name={name} confirmLabel={confirmLabel} embedded={embedded} onDone={onDone} />;

  return (
    <View style={{ flex: 1, backgroundColor: mono.ground }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        options={{ offering, displayCloseButton: true }}
        onPurchaseCompleted={() => finish(true)}
        onRestoreCompleted={({ customerInfo }) => {
          if (customerInfo.entitlements.active[ENTITLEMENT_ID]) finish(true);
        }}
        onPurchaseError={({ error }) => Alert.alert('Purchase failed', error.message)}
        onRestoreError={({ error }) => Alert.alert('Could not restore', error.message)}
        onDismiss={() => finish(false)}
      />
    </View>
  );
}
