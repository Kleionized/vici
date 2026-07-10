import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { useCurrentUser } from '@/lib/backend';

export default function Paywall() {
  const router = useRouter();
  const user = useCurrentUser();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  return (
    <>
      <StatusBar style="dark" />
      <PaywallFlow name={user?.displayName?.trim().split(/\s+/)[0]} confirmLabel="Continue" onDone={close} />
    </>
  );
}
