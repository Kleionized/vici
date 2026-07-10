import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { useLifeMap } from '@/lib/backend';

export default function Paywall() {
  const router = useRouter();
  const lifeMap = useLifeMap();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  return (
    <>
      <StatusBar style="dark" />
      <PaywallFlow prize={(lifeMap?.values ?? []).map((v) => v.label)} confirmLabel="Continue" onDone={close} />
    </>
  );
}
